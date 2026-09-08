(() => {
  'use strict';
  const DAY=86400000;
  const dayKey=(time=Date.now())=>{const d=new Date(time);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
  const object=v=>v && typeof v==='object' && !Array.isArray(v) ? v : {};
  const newer=(a,b)=>!a ? b : !b ? a : (Number(a.updatedAt)||0)>(Number(b.updatedAt)||0) ? a : (Number(a.updatedAt)||0)<(Number(b.updatedAt)||0) ? b : String(a.changeId||'')>=String(b.changeId||'') ? a : b;
  function merge(a={},b={}) {
    a=object(a);b=object(b);
    const map=(x,y)=>Object.fromEntries([...new Set([...Object.keys(object(x)),...Object.keys(object(y))])].map(k=>[k,newer(object(x)[k],object(y)[k])]));
    const cards=map(a.cards,b.cards);
    for(const id of Object.keys(cards)) {
      const first=[a.cards?.[id]?.firstAt,b.cards?.[id]?.firstAt].filter(x=>Number.isFinite(x)&&x>0);
      if(first.length) cards[id]={...cards[id],firstAt:Math.min(...first)};
    }
    const days={};
    for(const day of new Set([...Object.keys(object(a.days)),...Object.keys(object(b.days))])) {
      days[day]={};
      for(const id of new Set([...Object.keys(object(a.days?.[day])),...Object.keys(object(b.days?.[day]))])) {
        days[day][id]={new:Boolean(a.days?.[day]?.[id]?.new||b.days?.[day]?.[id]?.new),review:Boolean(a.days?.[day]?.[id]?.review||b.days?.[day]?.[id]?.review)};
      }
    }
    return {cards,days,stars:map(a.stars,b.stars),preferences:newer(a.preferences,b.preferences)||{goal:20}};
  }
  function schedule(old,grade,now=Date.now(),changeId='') {
    if(!['again','hard','good'].includes(grade)) throw new Error('Unknown grade');
    old=object(old);
    let repetitions=Math.max(0,Math.min(5,Number(old.repetitions)||0));
    let interval=Number(old.interval)||0;
    let due=Number(old.due)||now;
    if(grade==='again') {repetitions=0;interval=0;due=now+600000;}
    else if(grade==='hard') {repetitions=Math.min(repetitions,1);interval=1;due=now+DAY;}
    else if(!old.firstAt || due<=now || old.lastGrade==='again') {
      repetitions=Math.min(5,repetitions+1);interval=[0,1,3,7,14,30][repetitions];due=now+interval*DAY;
    }
    return {...old,firstAt:old.firstAt||now,updatedAt:now,changeId,due,interval,repetitions,lastGrade:grade,lapses:(Number(old.lapses)||0)+(grade==='again'?1:0)};
  }
  const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const spelling=s=>s.toLowerCase().trim().replace(/[’‘]/g,"'").replace(/\s+/g,' ');
  const correctSpelling=(s,w)=>[w.word,...w.aliases].some(x=>spelling(x)===spelling(s));
  let app,root,book,screen='home',queue=[],cursor=0,current=null,revealed=false,rated=false,spellChecked=false,spellCorrect=false;
  let mode='recall',topic='全部主题',level='全部层级',filter='all',search='',libraryLimit=40,oldHeader=null,shown=false;
  const $=id=>document.getElementById(id);
  const data=()=>merge(app.get());
  const changeId=()=>crypto.randomUUID();
  const words=()=>book.words.filter(w=>(topic==='全部主题'||w.topic===topic)&&(level==='全部层级'||w.level===level));
  const shortMeaning=w=>w.meaning.length>100?w.meaning.split(/[；，]/).slice(0,5).join('；'):w.meaning;
  const credit=w=>w.attribution?`<details class="v-source"><summary>例句来源与署名</summary><p>${escape(w.attribution)}</p><a href="https://tatoeba.org/en/sentences/show/${escape(w.exampleId)}" target="_blank" rel="noopener">英文原句</a> · <a href="https://tatoeba.org/en/sentences/show/${escape(w.translationId)}" target="_blank" rel="noopener">中文原句</a> · <a href="https://creativecommons.org/licenses/by/2.0/fr/" target="_blank" rel="noopener">CC BY 2.0 FR</a><p>释义：ECDICT（MIT）。例句片段从原句截取，不代表固定搭配。社区例句可能存在不自然表达或译义偏差。</p></details>`:'';
  const stats=()=>{
    const d=data(),today=Object.values(d.days[dayKey()]||{}),now=Date.now();
    return {d,newToday:today.filter(v=>v.new).length,reviewToday:today.filter(v=>v.review).length,
      seen:book.words.filter(w=>d.cards[w.id]).length,due:book.words.filter(w=>d.cards[w.id]?.due<=now).length,
      mastered:book.words.filter(w=>(d.cards[w.id]?.repetitions||0)>=4).length,
      stars:book.words.filter(w=>d.stars[w.id]?.value).length,goal:[10,20,30,50].includes(d.preferences.goal)?d.preferences.goal:20};
  };
  const ratingKeys={again:'1',hard:'2',good:'3'};
  const btn=(action,text,cls='')=>`<button type="button" class="v-btn ${cls}" data-v-action="${action}"${ratingKeys[action]?` aria-keyshortcuts="${ratingKeys[action]}" title="快捷键 ${ratingKeys[action]}"`:''}>${text}</button>`;
  const selectors=()=>`<label>层级<select id="vLevel">${['全部层级',...(book.levels||[])].map(t=>`<option ${t===level?'selected':''}>${escape(t)}</option>`).join('')}</select></label><label>主题<select id="vTopic">${['全部主题',...book.topics].map(t=>`<option ${t===topic?'selected':''}>${escape(t)}</option>`).join('')}</select></label><label>学习方式<select id="vMode"><option value="recall" ${mode==='recall'?'selected':''}>看词回忆</option><option value="spell" ${mode==='spell'?'selected':''}>中译英拼写</option></select></label>`;
  function save(d) {app.set(d);}
  function show() {
    if(!shown) oldHeader=[$('courseTitle').textContent,$('courseEyebrow').textContent];
    shown=true;document.body.classList.add('vocabulary-open');root.hidden=false;
    const url=new URL(location.href);url.searchParams.set('view','vocabulary');history.replaceState(null,'',url);
    document.querySelectorAll('.nav-button').forEach(b=>b.classList.toggle('active',b.id==='vocabNav'));
    $('courseTitle').textContent='让单词，留下来';$('courseEyebrow').textContent='WORD STUDIO · IELTS CORE';
    renderHome();
  }
  function close() {
    if(!shown) return;
    shown=false;root.hidden=true;document.body.classList.remove('vocabulary-open');
    const url=new URL(location.href);url.searchParams.delete('view');history.replaceState(null,'',url);
    if(oldHeader) { $('courseTitle').textContent=oldHeader[0];$('courseEyebrow').textContent=oldHeader[1]; }
    $('vocabNav').classList.remove('active');
  }
  function renderHome() {
    screen='home';current=null;const s=stats();
    root.innerHTML=`<div class="v-hero"><div class="v-book"><span class="v-book-edition">ECHO / WORD COLLECTION 01</span><strong>IELTS<span>雅思备考词库</span></strong><div class="v-book-lines"></div><footer><b>${book.words.length.toLocaleString()}</b> WORDS · ${book.topics.length} TOPICS</footer></div><div class="v-intro"><div class="v-kicker">少一点机械重复，多一次主动回忆。</div><h2>从认识，<br>到真正记得。</h2><p>看单词，想意思；放进例句，再亲手拼一次。<br>不熟的词会回来，记住的词慢一点再见。</p><div class="v-actions">${btn('start','开始今日学习 <span>↗</span>','v-primary')}${btn('due',`到期复习 · ${s.due}`)}</div><p class="v-footnote">每日目标不是上限 · 完成后仍可继续学习</p></div></div>
      <div class="v-metrics"><div><b>${s.newToday}<small> / ${s.goal}</small></b><span>今日新词</span></div><div><b>${s.reviewToday}</b><span>今日已复习</span></div><div><b>${s.seen}<small> / ${book.words.length}</small></b><span>累计学习</span></div><div><b>${s.mastered}</b><span>稳固记忆</span></div></div>
      <div class="v-level-summary">${(book.levels||[]).map(l=>`<span><b>${escape(l)}</b> ${book.words.filter(w=>w.level===l).length.toLocaleString()} 词</span>`).join('')}<small>筛选范围：${words().length.toLocaleString()} 词 · 今日目标跨层级累计</small></div><div class="v-controls">${selectors()}<label>每日新词<select id="vGoal">${[10,20,30,50].map(n=>`<option value="${n}" ${n===s.goal?'selected':''}>${n} 词</option>`).join('')}</select></label></div>
      <div class="v-book-footer"><div><h3>雅思备考 · 分层学习</h3><p>${escape(book.note)}</p><p>已收录的英美拼写变体均可接受。发音使用设备系统语音，无需 Gemini。</p><p><a href="./vocabulary-sources.html" target="_blank" rel="noopener">词库来源、许可与选词说明 ↗</a></p></div><div class="v-actions">${btn('library','浏览词书')}${btn('stars',`生词本 · ${s.stars}`)}</div></div>
      <details class="v-method"><summary>复习怎样安排？</summary><p>“忘记”约 10 分钟后再见，“模糊”次日复习，“记住”在到期复习答对后依次延长为 1、3、7、14、30 天。提前加练不会反复推迟复习；至少 4 次有效记忆轮次才计入稳固记忆。这是简化的间隔复习规则，不保证永久记住。今日统计按本机日期、去重词数计算。</p><p>登录后与句子记录一起同步；同一词在多设备上同时复习时，以时间较新的记录为准，请保持设备时间准确。</p></details>`;
  }
  function start(kind='start') {
    const s=stats(),list=words(),now=Date.now();
    const due=list.filter(w=>s.d.cards[w.id]?.due<=now).sort((a,b)=>s.d.cards[a.id].due-s.d.cards[b.id].due);
    const fresh=list.filter(w=>!s.d.cards[w.id]);
    const remaining=Math.max(0,s.goal-s.newToday);
    let selected=kind==='due'?due:kind==='starstudy'?list.filter(w=>s.d.stars[w.id]?.value):[...due,...fresh.slice(0,kind==='more'?s.goal:remaining)];
    if(kind==='practice') selected=list;
    queue=selected.map(w=>w.id);cursor=0;
    if(!queue.length) return finish(kind==='due'?'这个主题目前没有到期词。':kind==='starstudy'?'生词本还没有单词。':fresh.length?'今日新词目标已完成。':'本主题的新词已学完。');
    loadCard();
  }
  function loadCard() {
    if(cursor>=queue.length) return finish('这一轮完成了，给记忆一点时间。');
    current=book.words.find(w=>w.id===queue[cursor]);screen='study';revealed=false;rated=false;spellChecked=false;spellCorrect=false;renderCard();
  }
  function renderCard() {
    const w=current,s=stats(),star=Boolean(s.d.stars[w.id]?.value);
    root.innerHTML=`<div class="v-study-top">${btn('home','← 词汇书')}<span>${mode==='spell'?'中译英拼写':'看词回忆'} · ${cursor+1} / ${queue.length}</span>${btn('star',star?'★ 已加入生词本':'☆ 加入生词本')}</div>
      <article class="v-card"><div class="v-kicker">${escape(w.topic)} · ${escape(w.level||'核心')} · ${s.d.cards[w.id]?'复习词':'新词'}</div>
      ${mode==='recall'?`<h2 class="v-word">${escape(w.word)}</h2>${w.phonetic?`<p class="v-phonetic">/${escape(w.phonetic)}/ <small>词典音标</small></p>`:''}<div class="v-audio">${btn('us','美音 ▷')}${btn('uk','英音 ▷')}<span>设备系统朗读</span></div>`:`<h2 class="v-meaning-prompt">${escape(shortMeaning(w))}</h2><p class="v-pos">${escape(w.pos)} · ${w.word.length} 个字母</p><form id="vSpellForm"><label class="v-sr" for="vSpell">拼写英文单词</label><input id="vSpell" autocomplete="off" autocapitalize="none" spellcheck="false" maxlength="80" placeholder="在这里拼出英文单词…" ${spellChecked?'readonly':''}><button type="submit" class="v-btn v-primary" ${spellChecked?'disabled':''}>检查拼写 ↵</button></form>`}
      <div id="vAnswer" ${revealed?'':'hidden'}><p class="v-definition">${mode==='spell'?`<strong>${escape(w.word)}</strong> · `:''}<span>${escape(w.pos)}</span> ${escape(shortMeaning(w))}</p>${w.meaning.length>100?`<details class="v-source"><summary>查看完整辞典释义</summary><p>${escape(w.meaning)}</p></details>`:''}
      ${mode==='spell'?`<p id="vSpellResult" class="${spellCorrect?'v-correct':'v-wrong'}" role="status">${spellCorrect?'拼写正确':'正确拼写是 '+escape(w.word)+'；这次记为“忘记”，稍后再练。'}</p><div class="v-audio">${btn('us','美音 ▷')}${btn('uk','英音 ▷')}</div>`:''}
      <div class="v-example"><span>IN CONTEXT / 放进语境</span><p>${escape(w.example)}</p><small>${escape(w.translation)}</small>${btn('example','听例句 ▷')}</div><p class="v-collocation"><span>${escape(w.phraseKind||'常用搭配')}</span> ${escape(w.phrase)}</p>${credit(w)}</div>
      <div class="v-reveal" ${revealed?'hidden':''}>${mode==='recall'?btn('reveal','想好了吗？查看释义 ↵','v-primary'):btn('reveal','暂时想不起，查看答案')}<p>先主动回忆，再揭晓；不急着翻页。</p></div>
      <div id="vRating" class="v-rating" ${revealed&&!rated?'':'hidden'}><p>这一次，你记得多清楚？按数字键 1 / 2 / 3 评价</p><div>${btn('again','<b><kbd>1</kbd> 忘记了</b><small>约 10 分钟后</small>','v-again')}${btn('hard','<b><kbd>2</kbd> 有点模糊</b><small>明天再见</small>')}${btn('good','<b><kbd>3</kbd> 记住了</b><small>延长复习间隔</small>','v-primary')}</div></div>
      <div id="vSaved" class="v-saved" ${rated?'':'hidden'} role="status"><p id="vSavedText"></p>${btn('next','下一词 ↵','v-primary')}</div>
      <footer class="v-card-foot">${btn('previous','← 上一个')}<span>释义会保留，下一词由你决定。</span></footer></article>`;
    if(mode==='spell'&&!spellChecked) requestAnimationFrame(()=>$('vSpell')?.focus());
  }
  function reveal() {
    if(!current||revealed) return;
    if(mode==='spell') {spellChecked=true;spellCorrect=false;}
    revealed=true;renderCard();
    if(mode==='spell') rate('again');
  }
  function checkSpelling() {
    if(!current||spellChecked) return;
    const input=$('vSpell').value;
    if(!input.trim()) {app.toast('先试着拼一下，也可以选择查看答案');return;}
    spellCorrect=correctSpelling(input,current);spellChecked=true;revealed=true;renderCard();$('vSpell').value=input;
    if(!spellCorrect) rate('again');
  }
  function rate(grade) {
    if(!current||!revealed||rated) return;
    const d=data(),now=Date.now(),old=d.cards[current.id],day=dayKey(now);
    d.cards[current.id]=schedule(old,grade,now,changeId());
    d.days[day] ||= {};
    const entry=d.days[day][current.id]||{};
    d.days[day][current.id]={new:Boolean(entry.new||!old),review:Boolean(entry.review||old)};
    // A forgotten word is saved to the notebook; later removal has its own synced tombstone.
    if(grade==='again') d.stars[current.id]={value:true,updatedAt:now,changeId:changeId()};
    rated=true;save(d);
    root.querySelector('[data-v-action="star"]').textContent=d.stars[current.id]?.value?'★ 已加入生词本':'☆ 加入生词本';
    $('vRating').hidden=true;$('vSaved').hidden=false;
    $('vSavedText').textContent=grade==='again'?'已记录：约 10 分钟后复习，并加入生词本。':`已记录：下次复习 ${new Date(d.cards[current.id].due).toLocaleString('zh-CN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}`;
  }
  function finish(message) {
    screen='end';current=null;
    const s=stats();root.innerHTML=`<div class="v-finish"><div class="v-finish-mark">✓</div><div class="v-kicker">ONE MORE ECHO</div><h2>${escape(message)}</h2><p>今天学习 ${s.newToday} 个新词，复习 ${s.reviewToday} 个词。<br>目标是提醒，不是限制。</p><div class="v-actions">${btn('more','再学一组新词','v-primary')}${btn('due','检查到期复习')}${btn('practice','自由加练')}${btn('home','返回词汇书')}</div></div>`;
  }
  function renderLibrary() {
    screen='library';current=null;const s=stats(),term=search.trim().toLowerCase();
    const list=words().filter(w=>(!term||`${w.word} ${w.aliases.join(' ')} ${w.meaning}`.toLowerCase().includes(term))&&(filter==='stars'?s.d.stars[w.id]?.value:filter==='new'?!s.d.cards[w.id]:filter==='due'?s.d.cards[w.id]?.due<=Date.now():true));
    root.innerHTML=`<div class="v-study-top">${btn('home','← 词汇书')}<h2>${filter==='stars'?'我的生词本':'词汇目录'}</h2>${btn('starstudy','练习生词本','v-primary')}</div><div class="v-controls"><label class="v-search">搜索英文 / 中文<input id="vSearch" value="${escape(search)}" placeholder="例如：sustainable / 可持续"></label><label>范围<select id="vFilter"><option value="all" ${filter==='all'?'selected':''}>全部词汇</option><option value="new" ${filter==='new'?'selected':''}>未学词</option><option value="due" ${filter==='due'?'selected':''}>到期词</option><option value="stars" ${filter==='stars'?'selected':''}>生词本</option></select></label>${selectors()}</div><p class="v-list-count">${list.length} 个词 · 点击词条开始练习</p><div class="v-word-list">${list.slice(0,libraryLimit).map(w=>`<button class="v-word-row" data-word="${escape(w.id)}"><span><b>${escape(w.word)}</b><small>${escape(w.level||'核心')} · ${escape(w.topic)} · ${escape(w.pos)}</small></span><span>${escape(shortMeaning(w))}</span><em>${s.d.stars[w.id]?.value?'★ ':''}${s.d.cards[w.id]?'已学':'新词'} ↗</em></button>`).join('')||'<div class="v-empty">没有符合条件的单词。试试更换主题或搜索词。</div>'}</div>${list.length>libraryLimit?btn('loadmore','显示更多'):''}`;
  }
  function audio(accent,text) {
    if(!('speechSynthesis' in window)) return app.toast('这个浏览器不支持系统朗读');
    speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=accent;u.rate=.85;
    const voice=speechSynthesis.getVoices().find(v=>v.lang.replace('_','-')===accent);if(voice)u.voice=voice;
    else app.toast('设备未提供指定口音，将尝试系统默认英语语音');
    u.onerror=()=>app.toast('朗读未能播放，请检查设备语音设置');speechSynthesis.speak(u);
  }
  function act(action) {
    if(action==='home') return renderHome();
    if(['start','due','more','practice','starstudy'].includes(action)) return start(action);
    if(action==='library'||action==='stars') {filter=action==='stars'?'stars':'all';search='';libraryLimit=40;return renderLibrary();}
    if(action==='loadmore') {libraryLimit+=40;return renderLibrary();}
    if(action==='reveal') return reveal();
    if(['again','hard','good'].includes(action)) return rate(action);
    if(action==='next'&&rated) {cursor++;return loadCard();}
    if(action==='previous'&&cursor>0) {cursor--;return loadCard();}
    if(action==='star'&&current) {const d=data();d.stars[current.id]={value:!d.stars[current.id]?.value,updatedAt:Date.now(),changeId:changeId()};save(d);root.querySelector('[data-v-action="star"]').textContent=d.stars[current.id].value?'★ 已加入生词本':'☆ 加入生词本';return;}
    if(current&&['us','uk','example'].includes(action)) audio(action==='uk'?'en-GB':'en-US',action==='example'?current.example:current.word);
  }
  function init(adapter) {
    app=adapter;book=window.ECHO_VOCAB_BOOK;root=$('vocabView');
    $('vocabNav').addEventListener('click',show);
    root.addEventListener('click',e=>{
      const word=e.target.closest('[data-word]');
      if(word) {queue=[word.dataset.word];cursor=0;loadCard();return;}
      const button=e.target.closest('[data-v-action]');if(button)act(button.dataset.vAction);
    });
    root.addEventListener('submit',e=>{if(e.target.id==='vSpellForm'){e.preventDefault();checkSpelling();}});
    root.addEventListener('input',e=>{if(e.target.id==='vSearch'){const caret=e.target.selectionStart;search=e.target.value;libraryLimit=40;renderLibrary();$('vSearch').focus();$('vSearch').setSelectionRange(caret,caret);}});
    root.addEventListener('change',e=>{
      if(e.target.id==='vGoal') {const d=data();d.preferences={goal:Number(e.target.value),updatedAt:Date.now(),changeId:changeId()};save(d);}
      if(e.target.id==='vTopic')topic=e.target.value;
      if(e.target.id==='vLevel')level=e.target.value;
      if(e.target.id==='vMode')mode=e.target.value;
      if(e.target.id==='vFilter')filter=e.target.value;
      if(screen==='library')renderLibrary();else if(screen==='home')renderHome();
    });
    document.addEventListener('keydown',e=>{
      if(!shown||document.querySelector('dialog[open]')||e.isComposing||e.keyCode===229||e.repeat||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey) return;
      const target=e.target;
      const typing=target.isContentEditable||Boolean(target.closest('input,textarea,[contenteditable="true"]'));
      const checkedSpelling=target.id==='vSpell'&&target.readOnly&&spellChecked;
      if(target.closest('select')||(typing&&!checkedSpelling)) return;
      if(current&&revealed&&!rated&&['1','2','3'].includes(e.key)) {
        e.preventDefault();rate(['again','hard','good'][Number(e.key)-1]);return;
      }
      if(e.target.matches('select,button')||e.target.id==='vSearch')return;
      if(e.key==='Enter'&&current){e.preventDefault();if(rated)act('next');else if(mode==='spell'&&!spellChecked)checkSpelling();else if(!revealed)reveal();}
    });
    if(new URLSearchParams(location.search).get('view')==='vocabulary')show();
  }
  function refresh(reset=false) {
    if(!shown) return;
    if(reset){queue=[];cursor=0;renderHome();}
    else if(screen==='home')renderHome();
    // Background sync must never flip or advance the active card.
  }
  window.EchoVocab={init,show,close,refresh,merge,schedule,dayKey,correctSpelling};
})();
