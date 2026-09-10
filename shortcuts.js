/* Page-aware quick actions and keyboard access to every rendered button. */
(() => {
  const $ = s => document.querySelector(s);
  const visible = el => Boolean(el?.isConnected && !el.disabled && !el.closest('[hidden],[inert]') && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
  const va = action => `[data-v-action="${action}"]`;
  let bindings = new Map(), hintTargets = new Map(), hints = false, prefix = '', scheduled = false;
  const help = document.createElement('button');
  help.type = 'button'; help.id = 'keyboardHelp'; help.textContent = '? 快捷键';
  help.setAttribute('aria-label', '显示所有按钮的快捷键'); help.setAttribute('aria-keyshortcuts', '?');
  $('.top-actions').append(help);
  const notice = document.createElement('div');
  notice.id = 'keyboardNotice'; notice.hidden = true; notice.setAttribute('role', 'status'); document.body.append(notice);
  const scope = () => $('dialog[open]') || document;
  function mapping() {
    const result = [];
    const add = (selector, keys, label = keys.join(' / ')) => {
      const el = [...scope().querySelectorAll(selector)].find(visible);
      if (el) result.push({el, keys, label});
    };
    if ($('dialog[open]')) return result; // Modal actions remain available through ? / Tab, not global commands.
    if (document.body.classList.contains('vocabulary-open')) {
      if ($('.v-finish')) {
        add(va('more'), ['1','Enter'], '1 / ↵'); add(va('due'), ['2']);
        add(va('practice'), ['3']); add(va('home'), ['4']);
      } else {
        add(va('start'), ['1','Enter'], '1 / ↵'); add(va('due'), ['2']);
        add(va('library'), ['3']); add(va('stars'), ['4']);
        add(va('starstudy'), ['1','Enter'], '1 / ↵'); add(va('loadmore'), ['2']);
        add(va('home'), ['b']); add(va('star'), ['f']);
        add(va('us'), ['j']); add(va('uk'), ['k']); add(va('example'), ['e']);
        add(va('reveal'), ['a','Enter'], 'A / ↵');
        add(va('again'), ['1']); add(va('hard'), ['2']); add(va('good'), [' '], '空格');
        add(va('next'), ['Enter'], '↵'); add(va('previous'), ['ArrowLeft'], '←');
      }
    } else if (document.body.classList.contains('home-open')) {
      add('[data-home-action=words]', ['1','Enter'], '1 / ↵');
      add('[data-home-action=sentences]', ['2']); add('#lifeHomeEntry', ['3']);
      add('[data-home-action=name]', ['n']); add('[data-home-action=prev]', ['[']);
      add('[data-home-action=next]', [']']); add('[data-home-action=today]', ['d']);
    } else if (document.body.classList.contains('life-open')) {
      add('[data-life-start=all]', ['Enter'], '↵');
      document.querySelectorAll('.life-filters button').forEach((el,i) => add(`[data-life-group="${el.dataset.lifeGroup}"]`, [String(i+1)]));
    } else {
      add('#speakBtn', ['j']); add('#hintBtn', ['h']); add('#revealBtn', ['a']); add('#micBtn', ['m']);
      add('#checkBtn', ['Enter'], '↵'); add('#nextBtn', ['ArrowRight'], '→'); add('#prevBtn', ['ArrowLeft'], '←');
      add('#compactBtn', ['w']); add('#focusBtn', ['f']);
    }
    add('#homeNav', ['0']); add('#vocabNav', ['v']); add('#lifeNav', ['l']);
    add('[data-view=daily]', ['t']); add('[data-view=review]', ['r']); add('#customNav', ['c']);
    add('#statsTopBtn,#statsBtn', ['s']); add('[data-account-button]', ['o']);
    return result;
  }
  function refresh() {
    scheduled = false; bindings = new Map();
    const mapped = mapping(), active = new Set(mapped.map(x=>x.el));
    document.querySelectorAll('[data-echo-shortcut]').forEach(el=>{if(!active.has(el))el.removeAttribute('data-echo-shortcut');});
    mapped.forEach(({el,keys,label}) => {
      keys.forEach(key=>{if(!bindings.has(key)) bindings.set(key,el);});
      if(el.dataset.echoShortcut!==label) el.dataset.echoShortcut=label;
      const aria=keys.map(k=>k===' '?'Space':k).join(' ');
      if(el.getAttribute('aria-keyshortcuts')!==aria)el.setAttribute('aria-keyshortcuts',aria);
    });
    if(hints) paintHints();
  }
  function clearHints() {
    document.querySelectorAll('[data-echo-hint]').forEach(el=>el.removeAttribute('data-echo-hint'));
    hintTargets.clear();
  }
  function paintHints() {
    const targets=[...scope().querySelectorAll('button,summary,a[href]')].filter(el=>el!==help&&visible(el));
    const alphabet='asdfghjklqwertyuiopzxcvbnm';
    // Fixed-width codes are prefix-free and cover long word directories as well as calendars.
    const width=Math.max(2,Math.ceil(Math.log(Math.max(1,targets.length))/Math.log(alphabet.length)));
    const next = new Map();
    targets.forEach((el,i)=>{let code='',n=i;for(let j=0;j<width;j++){code=alphabet[n%alphabet.length]+code;n=Math.floor(n/alphabet.length);}next.set(code,el);});
    document.querySelectorAll('[data-echo-hint]').forEach(el=>{
      if(!targets.includes(el))el.removeAttribute('data-echo-hint');
    });
    hintTargets=next;
    next.forEach((el,code)=>{const label=code.startsWith(prefix)?code.toUpperCase():'';if(el.getAttribute('data-echo-hint')!==label)el.setAttribute('data-echo-hint',label);});
    notice.textContent=`按钮快捷键：输入按钮上的字母标号${prefix?'（已输入 '+prefix.toUpperCase()+'）':''} · 可滚动查看 · Esc 退出`;
  }
  function toggle(force) {
    hints=force??!hints; prefix=''; clearHints(); notice.hidden=!hints;
    help.setAttribute('aria-expanded',String(hints));
    if(hints)paintHints();
  }
  help.addEventListener('click',()=>toggle());
  document.addEventListener('keydown',e=>{
    if(e.isComposing||e.keyCode===229||e.ctrlKey||e.metaKey||e.altKey)return;
    const typing=e.target.isContentEditable||Boolean(e.target.closest('input:not([readonly]),textarea,select,[contenteditable=true]'));
    if(typing)return;
    const consume=()=>{e.preventDefault();e.stopImmediatePropagation();};
    if(e.key==='?'&&!e.repeat){consume();toggle();return;}
    if(hints) {
      if(e.key==='Escape'){consume();toggle(false);return;}
      if(e.key==='Tab'){toggle(false);return;}
      if(e.key==='Backspace'){consume();prefix=prefix.slice(0,-1);paintHints();return;}
      if(/^[a-z]$/i.test(e.key)) {
        consume();if(e.repeat)return;prefix+=e.key.toLowerCase();
        const el=hintTargets.get(prefix);
        if(el){toggle(false);if(visible(el)){el.focus({preventScroll:true});el.click();}refresh();}
        else {if(![...hintTargets.keys()].some(k=>k.startsWith(prefix)))prefix='';paintHints();}
        return;
      }
      // Prevent old Enter/Space/number handlers while selecting a labelled button.
      if(['Enter',' ','ArrowLeft','ArrowRight'].includes(e.key)||/^[0-9]$/.test(e.key))consume();
      return;
    }
    if(e.shiftKey)return;
    refresh();
    // Keep native calendar and disclosure keyboard navigation.
    if(e.target.closest('[data-day],summary')&&['Enter',' ','ArrowLeft','ArrowRight'].includes(e.key))return;
    const el=bindings.get(e.key.length===1?e.key.toLowerCase():e.key);
    if(el&&visible(el)){consume();if(!e.repeat){el.click();refresh();}}
  },true);
  new MutationObserver(records=>{
    if(records.every(r=>r.type==='attributes'&&['data-echo-shortcut','aria-keyshortcuts','data-echo-hint','aria-expanded'].includes(r.attributeName)||notice.contains(r.target)))return;
    if(!scheduled){scheduled=true;requestAnimationFrame(refresh);}
  }).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','class','disabled','open','readonly','data-echo-shortcut','data-echo-hint','aria-keyshortcuts','aria-expanded']});
  refresh();
})();
