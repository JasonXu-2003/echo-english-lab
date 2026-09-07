(() => {
  const verdicts = new Set(['correct', 'needs_revision', 'meaning_mismatch', 'uncertain']);
  function validate(value) {
    if (!value || !verdicts.has(value.verdict) || typeof value.corrected !== 'string' || !value.corrected.trim()
      || value.corrected.length > 2500 || typeof value.explanation !== 'string' || value.explanation.length > 2500
      || !Array.isArray(value.edits) || value.edits.length > 20
      || value.edits.some(e => !e || ['before', 'after', 'reason'].some(k => typeof e[k] !== 'string' || e[k].length > 800))) {
      throw new Error('批改结果不完整，请稍后重试');
    }
    return value;
  }
  function diff(before, after) {
    const words = text => text.match(/[A-Za-z0-9]+(?:['’][A-Za-z]+)*|[^\sA-Za-z0-9]/g) || [];
    const a = words(before), b = words(after);
    const key = x => x.toLowerCase().replace(/’/g, "'");
    if (a.length > 400 || b.length > 400) return [{type:'same', text:after}];
    const lengths = Array.from({length:a.length + 1}, () => new Uint16Array(b.length + 1));
    for (let i=a.length-1;i>=0;i--) for(let j=b.length-1;j>=0;j--)
      lengths[i][j] = key(a[i]) === key(b[j]) ? lengths[i+1][j+1]+1 : Math.max(lengths[i+1][j], lengths[i][j+1]);
    const result=[];
    let i=0,j=0;
    while(i<a.length || j<b.length) {
      if(i<a.length && j<b.length && key(a[i])===key(b[j])) result.push({type:'same',text:b[j++]}),i++;
      else if(j<b.length && (i===a.length || lengths[i][j+1]>lengths[i+1][j])) result.push({type:'add',text:b[j++]});
      else result.push({type:'remove',text:a[i++]});
    }
    return result;
  }
  window.EchoReview = {validate, diff};
})();
