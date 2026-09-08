(() => {
  'use strict';
  const dayKey=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const parseDay=key=>{const [y,m,d]=key.split('-').map(Number);return new Date(y,m-1,d,12);};
  const number=n=>Math.max(0,Math.floor(Number(n)||0));
  function dayStats(state={},key=dayKey()) {
    const entries=Object.values(state.vocabulary?.days?.[key]||{}).filter(v=>v&&typeof v==='object');
    const newWords=entries.filter(v=>v.new).length,reviewWords=entries.filter(v=>v.review).length;
    const words=entries.filter(v=>v.new||v.review).length,sentences=number(state.dailyAnswers?.[key]);
    return {newWords,reviewWords,words,sentences,active:words>0||sentences>0};
  }
  function streak(state={},today=dayKey()) {
    const date=parseDay(today);let total=0;
    // Until today's first practice, yesterday's streak remains alive.
    if(!dayStats(state,dayKey(date)).active)date.setDate(date.getDate()-1);
    for(let i=0;i<20000;i++) {
      if(!dayStats(state,dayKey(date)).active)break;
      total++;date.setDate(date.getDate()-1);
    }
    return total;
  }
  function mergeProfile(a={},b={}) {
    a=a||{};b=b||{};
    const ta=Number(a?.updatedAt)||0,tb=Number(b?.updatedAt)||0;
    return ta>tb?a:tb>ta?b:String(a?.changeId||'')>=String(b?.changeId||'')?a:b;
  }
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let app,root,shown=false,selected=dayKey(),month=selected.slice(0,7),header=null,dialog;
  const identity=()=>window.EchoCloud?.getIdentity?.()||{};
  const name=()=>String(app.get().profile?.displayName||identity().name||identity().email?.split('@')[0]||'学习者').slice(0,24);
  function route(view) {const url=new URL(location.href);url.searchParams.set('view',view);history.replaceState(null,'',url);}
  function show() {
    window.EchoVocab?.close();
    if(!shown)header=[document.querySelector('#courseTitle').textContent,document.querySelector('#courseEyebrow').textContent];
    shown=true;root.hidden=false;document.body.classList.add('home-open');route('home');
    document.querySelectorAll('.nav-button').forEach(b=>b.classList.toggle('active',b.id==='homeNav'));
    document.querySelector('#courseTitle').textContent='学习主页';document.querySelector('#courseEyebrow').textContent='YOUR DAILY ECHO';
    selected=dayKey();month=selected.slice(0,7);render();
  }
  function close() {
    if(!shown)return;
    shown=false;root.hidden=true;document.body.classList.remove('home-open');route('practice');
    document.querySelector('#homeNav').classList.remove('active');
    if(header){document.querySelector('#courseTitle').textContent=header[0];document.querySelector('#courseEyebrow').textContent=header[1];}
  }
  function render() {
    if(!shown)return;
    const state=app.get(),today=dayKey(),s=dayStats(state,today),goal=[10,20,30,50].includes(state.vocabulary?.preferences?.goal)?state.vocabulary.preferences.goal:20;
    const now=parseDay(today),dateText=now.toLocaleDateString('zh-CN',{month:'long',day:'numeric',weekday:'long'});
    const monthKeys=new Set([...Object.keys(state.dailyAnswers||{}),...Object.keys(state.vocabulary?.days||{})].filter(k=>k.startsWith(month+'-')&&k<=today));
    const activeDays=[...monthKeys].filter(k=>dayStats(state,k).active).length;
    const monthWords=[...monthKeys].reduce((n,k)=>n+dayStats(state,k).words,0),monthSentences=[...monthKeys].reduce((n,k)=>n+dayStats(state,k).sentences,0);
    const picked=dayStats(state,selected),[year,m]=month.split('-').map(Number);
    const first=new Date(year,m-1,1,12),offset=(first.getDay()+6)%7,last=new Date(year,m,0).getDate();
    const cells=Array.from({length:Math.ceil((offset+last)/7)*7},(_,i)=>{
      const d=i-offset+1;if(d<1||d>last)return '<span class="h-empty" aria-hidden="true"></span>';
      const key=`${month}-${String(d).padStart(2,'0')}`,v=dayStats(state,key),future=key>today;
      const intensity=v.active?(v.words+v.sentences>=50?'strong':'light'):'';
      return `<button type="button" class="h-day ${intensity} ${key===today?'today':''} ${key===selected?'selected':''}" data-day="${key}" aria-pressed="${key===selected}" aria-label="${key}，${v.words} 个词，${v.sentences} 次句子练习${key===today?'，今天':''}" ${future?'disabled':''}><span>${d}</span><i aria-hidden="true"></i>${v.active?`<small>${v.words?'词 '+v.words:''}${v.words&&v.sentences?' · ':''}${v.sentences?'句 '+v.sentences:''}</small>`:'<small>—</small>'}</button>`;
    }).join('');
    root.innerHTML=`<section class="h-welcome"><div><p class="h-eyebrow">A LITTLE PRACTICE, EVERY DAY.</p><h2>你好，<span id="homeGreeting">${esc(name())}</span><span class="h-greeting-dot">。</span></h2><p class="h-subtitle">${s.active?'今天的努力，已经留下回声。':'从一个单词、一句表达开始今天。'}</p><button class="h-name-button" data-home-action="name">修改称呼 ↗</button></div><div class="h-date-seal"><span>${String(now.getMonth()+1).padStart(2,'0')} / ${now.getFullYear()}</span><b>${String(now.getDate()).padStart(2,'0')}</b><small>${esc(dateText)}</small></div></section>
      <section class="h-today" aria-label="今日学习概况"><div><span>今日学过的词</span><strong id="homeTodayWords">${s.words}<small>词</small></strong><p>新词 ${s.newWords} · 复习 ${s.reviewWords}</p></div><div><span>今日句子练习</span><strong id="homeTodaySentences">${s.sentences}<small>次</small></strong><p>提交检查后计数，含重复练习</p></div><div><span>连续学习</span><strong id="homeStreak">${streak(state,today)}<small>天</small></strong><p>${s.active?'今天已留下学习记录':'今天还没开始，来接上这一程'}</p></div></section>
      <div class="h-paths"><button class="h-path words" data-home-action="words"><div><span>01 / WORD STUDIO</span><h3>去背单词 <b>↗</b></h3><p>今日新词 ${s.newWords} / ${goal} · 5,000 词备考词库</p></div><div class="h-bar" role="progressbar" aria-label="今日新词目标" aria-valuemin="0" aria-valuemax="${goal}" aria-valuenow="${Math.min(s.newWords,goal)}"><i style="width:${Math.min(100,s.newWords/goal*100)}%"></i></div></button><button class="h-path sentences" data-home-action="sentences"><div><span>02 / SCENE PRACTICE</span><h3>去练句子 <b>↗</b></h3><p>今日完成 ${s.sentences} / 50 · 生活、校园与会议</p></div><div class="h-bar" role="progressbar" aria-label="今日句子目标" aria-valuemin="0" aria-valuemax="50" aria-valuenow="${Math.min(s.sentences,50)}"><i style="width:${Math.min(100,s.sentences/50*100)}%"></i></div></button></div>
      <section class="h-calendar-section"><div class="h-section-title"><div><p class="h-eyebrow">YOUR LEARNING DAYS</p><h2>把坚持，看得见。</h2></div><span>本月学习 ${activeDays} 天</span></div><div class="h-calendar-layout"><div class="h-calendar"><div class="h-month-nav"><button data-home-action="prev" aria-label="上个月">‹</button><h3>${year} 年 ${m} 月</h3><button data-home-action="next" aria-label="下个月" ${month>=today.slice(0,7)?'disabled':''}>›</button><button class="h-back-today" data-home-action="today">今天</button></div><div class="h-weekdays" aria-hidden="true">${['一','二','三','四','五','六','日'].map(d=>`<span>${d}</span>`).join('')}</div><div class="h-days" aria-label="学习日历">${cells}</div><div class="h-calendar-legend"><span><i></i>有学习记录</span><small>点击日期看明细 · 深色表示更多练习</small></div></div><aside class="h-day-detail" aria-live="polite"><span class="h-eyebrow">${selected===today?'TODAY / 今天':'DAY REVIEW / 当日回顾'}</span><h3>${esc(parseDay(selected).toLocaleDateString('zh-CN',{month:'long',day:'numeric'}))}</h3><p>${picked.active?'每一次回忆，都是一次积累。':selected===today?'今天的这一格，等你点亮。':'这一天没有记录到学习。'}</p><dl><div><dt>学过单词</dt><dd>${picked.words}<small> 词</small></dd></div><div><dt>其中：新词 / 复习</dt><dd>${picked.newWords} / ${picked.reviewWords}</dd></div><div><dt>句子练习</dt><dd>${picked.sentences}<small> 次</small></dd></div></dl><div class="h-month-total">本月累计 ${monthWords} 词次 · ${monthSentences} 次句子练习<br><small>单词按每日去重后相加，跨日会重复计数。</small></div></aside></div></section>
      <details class="h-explainer"><summary>统计怎样计算？</summary><p>单词完成“忘记／模糊／记住”评价后计入当日，拼写检查错误也计入学习；同一词当天只算一个“学过的词”。新词与复习可能重叠，不能直接相加。句子按提交“检查答案”的次数计数，包括重复练习、语音输入和未完成 AI 精改的提交，不等同于正确句数。只打开页面、查看未评价的单词或修改昵称不会点亮日历。</p><p>新记录按设备本地日期统计。旧版句子记录使用 UTC 日期且没有逐次时间戳，因此沿用原日期，不推算或编造历史时间。不同设备同时练句子的旧版同步策略为每日计数取较大值，可能少计并发练习。连续天数同时计入背词和句子练习；今天尚未学习时保留截至昨天的连续记录。未登录时只显示本机记录，登录后使用该账号同步的数据。</p></details>`;
  }
  function refresh(reset=false) {
    if(reset){dialog?.close();selected=dayKey();month=selected.slice(0,7);}
    render();
  }
  function init(adapter) {
    app=adapter;root=document.getElementById('homeView');
    document.querySelector('#homeNav').addEventListener('click',show);
    dialog=document.createElement('dialog');dialog.id='homeNameDialog';dialog.innerHTML='<form method="dialog" id="homeNameForm"><div class="dialog-head"><div><h2>希望 Echo 怎么称呼你？</h2><p>留空会使用账号名称；未登录时显示“学习者”。</p></div><button type="button" data-dismiss aria-label="关闭">×</button></div><div class="dialog-body"><label for="homeName">你的称呼</label><input id="homeName" maxlength="24" autocomplete="nickname" placeholder="例如：小徐"><div class="dialog-actions"><button class="btn secondary" type="button" data-dismiss>取消</button><button class="btn" type="submit">保存称呼</button></div></div></form>';
    document.body.append(dialog);dialog.querySelectorAll('[data-dismiss]').forEach(b=>b.onclick=()=>dialog.close());
    dialog.querySelector('form').addEventListener('submit',e=>{e.preventDefault();app.setProfile({displayName:dialog.querySelector('input').value.trim().slice(0,24),updatedAt:Date.now(),changeId:crypto.randomUUID()});dialog.close();render();});
    root.addEventListener('click',e=>{
      const date=e.target.closest('[data-day]');if(date){selected=date.dataset.day;render();root.querySelector(`[data-day="${selected}"]`)?.focus({preventScroll:true});return;}
      const action=e.target.closest('[data-home-action]')?.dataset.homeAction;
      if(action==='name'){dialog.querySelector('input').value=app.get().profile?.displayName||'';dialog.showModal();dialog.querySelector('input').focus();}
      if(action==='words')window.EchoVocab.show();
      if(action==='sentences')document.querySelector('[data-view="daily"]').click();
      if(action==='today'){selected=dayKey();month=selected.slice(0,7);render();}
      if(action==='prev'||action==='next'){const d=parseDay(month+'-01');d.setMonth(d.getMonth()+(action==='prev'?-1:1));const candidate=dayKey(d).slice(0,7);if(candidate>dayKey().slice(0,7))return;month=candidate;selected=month===dayKey().slice(0,7)?dayKey():month+'-01';render();root.querySelector(`[data-home-action="${action}"]`)?.focus({preventScroll:true});}
    });
    root.addEventListener('keydown',e=>{
      const date=e.target.closest('[data-day]');const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[e.key];
      if(!date||!delta||e.altKey||e.ctrlKey||e.metaKey)return;
      e.preventDefault();const d=parseDay(date.dataset.day);d.setDate(d.getDate()+delta);const key=dayKey(d);if(key>dayKey())return;selected=key;month=key.slice(0,7);render();root.querySelector(`[data-day="${key}"]`)?.focus({preventScroll:true});
    });
    window.addEventListener('echo-account-change',()=>queueMicrotask(()=>refresh()));
    let lastDay=dayKey();setInterval(()=>{if(dayKey()!==lastDay){lastDay=dayKey();if(shown){selected=lastDay;month=lastDay.slice(0,7);render();}}},30000);
    const params=new URLSearchParams(location.search),view=params.get('view');
    if(view==='home'||(!view&&!params.has('compact')))show();
  }
  window.EchoHome={init,show,close,refresh,dayKey,dayStats,streak,mergeProfile};
})();
