(() => {
  'use strict';
  const book=window.ECHO_DAILY_LIFE;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let app,root,shown=false,header,group='全部';
  const groupOf=s=>s.label.startsWith('KITCHEN')?'厨房':s.label.startsWith('OFFICE')?'办公室':s.label.startsWith('HOME')?'家里':'外出';
  const wordsFor=id=>book.questions.filter(q=>q.lifeScene===id).flatMap(q=>q.vocabulary);
  const wordRow=(v,i,prefix)=>`<li><div><strong>${esc(v.word)}</strong><span>${esc(v.meaning)}</span><small>${esc(v.phrase)}</small></div><button type="button" data-life-say="${prefix}:${i}" aria-label="听 ${esc(v.word)} 的发音">听词 ↗</button></li>`;
  function decorateHome() {
    const paths=document.querySelector('#homeView .h-paths');if(!paths||document.querySelector('#lifeHomeEntry'))return;
    paths.insertAdjacentHTML('afterend',`<button id="lifeHomeEntry" class="life-home-entry" data-life-open><span>EVERYDAY / 日常生活英语</span><strong>认得这些东西，也说得出这些小事。 <b>↗</b></strong><small>厨房 · 办公室 · 街头 · 家里　${book.scenes.length} 个场景 / ${book.questions.length} 句</small></button>`);
  }
  function show() {
    window.EchoHome.close();window.EchoVocab.close();
    if(!shown)header=[document.querySelector('#courseTitle').textContent,document.querySelector('#courseEyebrow').textContent];
    shown=true;root.hidden=false;document.body.classList.add('life-open');
    document.querySelector('#courseTitle').textContent='日常生活英语';document.querySelector('#courseEyebrow').textContent='EVERYDAY ENGLISH · SMALL THINGS, REAL WORDS';
    document.querySelectorAll('.nav-button').forEach(b=>b.classList.toggle('active',b.id==='lifeNav'));
    const url=new URL(location.href);url.searchParams.set('view','daily-life');url.searchParams.delete('life');history.replaceState(null,'',url);
    render();window.scrollTo(0,0);
  }
  function close() {
    if(!shown)return;shown=false;root.hidden=true;document.body.classList.remove('life-open');
    document.querySelector('#lifeNav').classList.remove('active');
    if(header){document.querySelector('#courseTitle').textContent=header[0];document.querySelector('#courseEyebrow').textContent=header[1];}
  }
  function start(id) {
    const scene=book.scenes.find(s=>s.id===id);if(!scene&&id!=='all')return;
    app.start(book.questions.filter(q=>id==='all'||q.lifeScene===id),scene?.title||'日常生活英语 · 全部场景','EVERYDAY ENGLISH · 物品词 + 常用搭配 + 情景表达');
    const url=new URL(location.href);url.searchParams.set('life',id);history.replaceState(null,'',url);
    document.querySelectorAll('.nav-button').forEach(b=>b.classList.toggle('active',b.id==='lifeNav'));
    window.scrollTo(0,0);
  }
  function render() {
    root.innerHTML=`<section class="life-intro"><div><span class="life-kicker">NOT JUST “THAT THING”</span><h2>身边的小东西，<br>说得出口的日常。</h2><p>从“这叫什么”到“这句话怎么说”。先认识物品和搭配，再练一次真实的开口。</p><small>${book.scenes.length} 个场景 · ${book.questions.length} 句原创编排 · 不计时、不自动跳题</small></div><button class="life-start-all" data-life-start="all">从第一幕开始 <span>↗</span></button></section><div class="life-filters" aria-label="筛选日常场景">${['全部','厨房','办公室','外出','家里'].map(g=>`<button data-life-group="${g}" aria-pressed="${g===group}">${g}</button>`).join('')}</div><div class="life-scenes">${book.scenes.filter(s=>group==='全部'||groupOf(s)===group).map(s=>`<article class="life-scene"><div class="life-card-top"><span>${s.label}</span><small>${s.count} 句</small></div><h3>${esc(s.title)}</h3><p>${esc(s.intro)}</p><div class="life-word-preview">${wordsFor(s.id).slice(0,3).map(v=>`<span>${esc(v.word)}</span>`).join('')}</div><button class="life-start" data-life-start="${s.id}">练这一组 <b>→</b></button><details><summary>先认词 · 看搭配 / ${s.count} 条</summary><ul class="life-lexicon">${wordsFor(s.id).map((v,i)=>wordRow(v,i,s.id)).join('')}</ul></details></article>`).join('')}</div><p class="life-note">词语发音使用设备英语语音。提示中会标出常见英美说法；练习沿用原有 AI 语义批改，不要求照抄参考句。提交检查会计入主页的句子练习统计，浏览词语不会增加雅思背词数量。</p>`;
  }
  function renderHints(q) {
    const box=document.querySelector('#lifeWordHelp');if(!box)return;
    const vocabulary=q.vocabulary||book.questions.find(item=>item.en===q.en)?.vocabulary;
    document.body.classList.toggle('life-practice',Boolean(vocabulary?.length));
    box.hidden=!vocabulary?.length;if(box.hidden){box.replaceChildren();return;}
    box.innerHTML=`<div class="life-help-top"><button data-life-open>← 选生活场景</button><span>不会说的物品，先认一认</span></div><details><summary>展开词语提示与常用搭配</summary><ul class="life-lexicon">${vocabulary.map((v,i)=>wordRow(v,i,'current')).join('')}</ul></details>`;
    box._words=vocabulary;
  }
  function init(adapter) {
    app=adapter;root=document.querySelector('#lifeView');document.querySelector('#lifeNav').addEventListener('click',show);
    document.addEventListener('click',e=>{
      if(e.target.closest('[data-life-open]')){show();return;}
      const launch=e.target.closest('[data-life-start]');if(launch){start(launch.dataset.lifeStart);return;}
      const filter=e.target.closest('[data-life-group]');if(filter){group=filter.dataset.lifeGroup;render();root.querySelector(`[data-life-group="${group}"]`).focus();return;}
      const say=e.target.closest('[data-life-say]');if(say){const [id,n]=say.dataset.lifeSay.split(':');const word=(id==='current'?document.querySelector('#lifeWordHelp')._words:wordsFor(id))[Number(n)];if(word)app.speak(word.word);}
    });
    // Native disclosure/button keys must not reach the sentence submit/advance handler.
    document.querySelector('#lifeWordHelp').addEventListener('keydown',e=>{if(['Enter',' ','ArrowLeft','ArrowRight'].includes(e.key))e.stopPropagation();});
    decorateHome();
    const params=new URLSearchParams(location.search);
    if(params.get('view')==='daily-life')show();
    else if(params.get('view')==='practice'&&params.has('life'))start(params.get('life'));
  }
  window.EchoLife={init,show,close,start,renderHints,decorateHome};
})();
