/* Illustrations for the ESM3 lesson. No model inference or biological simulation. */
(function () {
  'use strict';
  function init() {
    var byId = function (id) { return document.getElementById(id); };
    if (!byId('protein-view')) return;
    var NS = 'http://www.w3.org/2000/svg';
    var c = { ink:'var(--plot-ink)', muted:'var(--plot-muted)', grid:'var(--plot-grid)', accent:'var(--plot-accent)', secondary:'var(--plot-secondary)', paper:'var(--surface)', soft:'var(--accent-soft)', blue:'var(--light-in)', green:'var(--light-out)' };
    var state = { proteinView:'sequence', chainLength:20, designStep:0, identityPercent:58 };
    function el(tag, attrs, text) {
      var node = document.createElementNS(NS, tag);
      Object.keys(attrs || {}).forEach(function (key) { node.setAttribute(key, attrs[key]); });
      if (text !== undefined) node.textContent = text;
      return node;
    }
    function add(parent, tag, attrs, text) { var node=el(tag,attrs,text);parent.appendChild(node);return node; }
    function label(svg,x,y,text,attrs) { return add(svg,'text',Object.assign({x:x,y:y,fill:c.muted,'font-size':12,'font-family':'inherit'},attrs||{}),text); }
    function line(svg,x1,y1,x2,y2,attrs) { return add(svg,'line',Object.assign({x1:x1,y1:y1,x2:x2,y2:y2,stroke:c.grid,'stroke-width':1.5},attrs||{})); }
    function text(id,value) { byId(id).textContent=value; }
    function clamp(value,min,max) { return Math.min(max,Math.max(min,value)); }
    function figure(id,height,title,description) {
      var host=byId(id),width=Math.max(240,Math.round(host.getBoundingClientRect().width||400));
      var svg=el('svg',{viewBox:'0 0 '+width+' '+height,width:'100%',height:height,role:'img','aria-labelledby':id+'-svg-title '+id+'-svg-desc'});
      add(svg,'title',{id:id+'-svg-title'},title);add(svg,'desc',{id:id+'-svg-desc'},description);host.replaceChildren(svg);
      return {svg:svg,width:width};
    }
    function select(selector,key,value) { document.querySelectorAll(selector).forEach(function(button){button.setAttribute('aria-pressed',String(String(button.dataset[key])===String(value)));}); }
    function exactCount() { return 20n ** BigInt(state.chainLength); }
    function countParts() { var number=Number(exactCount());var exponent=Math.floor(Math.log10(number));return {mantissa:(number/Math.pow(10,exponent)).toFixed(2),exponent:exponent,digits:exactCount().toString().length}; }
    function countString() { var parts=countParts();return parts.mantissa+' × 10^'+parts.exponent; }
    function identityReference() { return state.identityPercent===58?'closest reported fluorescent protein':state.identityPercent===36?'Aequorea victoria GFP':'hypothetical comparison'; }
    var proteinCopy={
      sequence:{title:'A chain has an order.',description:'The numbered beads are positions along one chain. Positions 2 and 11 are far apart in the sequence. The numbering says nothing yet about their distance in space.',detail:'The sketch uses 12 beads so the idea is visible. They are not esmGFP’s sequence.'},
      structure:{title:'Folding brings distant positions together.',description:'The same chain now follows a compact path. Positions 2 and 11 can become neighbors in space even though nine steps separate them along the sequence.',detail:'This invented geometry illustrates a contact, not an actual protein fold or a computed trajectory.'},
      function:{title:'An arrangement supports a physical effect.',description:'A fluorescent protein surrounds a light-handling chromophore with a protective barrel. Absorbed light can be re-emitted at a longer wavelength.',detail:'This separate GFP cartoon is not the fold of the 12-bead chain. Light colors are schematic; no spectrum or efficiency is being calculated.'}
    };
    function drawProtein() {
      var copy=proteinCopy[state.proteinView];text('protein-view-title',copy.title);text('protein-view-description',copy.description);text('protein-view-detail',copy.detail);select('[data-protein-view]','proteinView',state.proteinView);
      var f=figure('protein-view',265,copy.title,copy.description+' '+copy.detail),svg=f.svg,w=f.width;
      if(state.proteinView==='function') {
        var middle=w/2,left=middle-50,right=middle+50;
        add(svg,'path',{d:'M'+left+' 70Q'+middle+' 40 '+right+' 70V195Q'+middle+' 230 '+left+' 195Z',fill:c.soft,stroke:c.accent,'stroke-width':2});
        add(svg,'ellipse',{cx:middle,cy:70,rx:50,ry:17,fill:c.paper,stroke:c.accent,'stroke-width':2});
        [-30,-10,10,30].forEach(function(dx){line(svg,middle+dx,85,middle+dx,205,{stroke:c.accent,'stroke-width':2});});
        add(svg,'circle',{cx:middle,cy:145,r:12,fill:c.accent});
        line(svg,20,108,middle-15,140,{stroke:c.blue,'stroke-width':3});
        add(svg,'path',{d:'M'+(middle-24)+' 131L'+(middle-15)+' 140L'+(middle-28)+' 142',fill:'none',stroke:c.blue,'stroke-width':2});
        line(svg,middle+15,151,w-20,192,{stroke:c.green,'stroke-width':3});
        add(svg,'path',{d:'M'+(w-33)+' 184L'+(w-20)+' 192L'+(w-33)+' 195',fill:'none',stroke:c.green,'stroke-width':2});
        label(svg,15,90,'light in',{fill:c.blue,'font-size':11});label(svg,w-15,220,'light out',{'text-anchor':'end',fill:c.green,'font-size':11});
        label(svg,middle,250,'fluorescence needs illumination',{'text-anchor':'middle','font-size':11});
        return;
      }
      var points=[];
      var compact=[[.12,.15],[.36,.18],[.62,.12],[.87,.25],[.87,.55],[.65,.76],[.38,.87],[.12,.70],[.13,.44],[.29,.47],[.39,.40],[.62,.43]];
      for(var i=0;i<12;i++) points.push(state.proteinView==='sequence'?{x:19+i*(w-38)/11,y:125}:{x:25+compact[i][0]*(w-50),y:35+compact[i][1]*185});
      add(svg,'polyline',{points:points.map(function(p){return p.x+','+p.y;}).join(' '),fill:'none',stroke:c.accent,'stroke-width':2.5,'stroke-linejoin':'round'});
      if(state.proteinView==='structure') line(svg,points[1].x,points[1].y,points[10].x,points[10].y,{stroke:c.secondary,'stroke-dasharray':'3 3','stroke-width':2});
      points.forEach(function(p,index){var focus=index===1||index===10;add(svg,'circle',{cx:p.x,cy:p.y,r:focus?11:9,fill:focus?c.secondary:c.paper,stroke:focus?c.secondary:c.accent,'stroke-width':1.5});label(svg,p.x,p.y+3.5,String(index+1),{'text-anchor':'middle',fill:focus?c.paper:c.ink,'font-size':9.5});});
      label(svg,w/2,245,state.proteinView==='sequence'?'Order along the chain':'Same order. Different spatial arrangement.',{'text-anchor':'middle','font-size':11});
    }
    function drawSpace() {
      var n=state.chainLength,parts=countParts();text('protein-length-value',n);text('space-exponent',n);byId('protein-length').value=String(n);select('[data-protein-length]','proteinLength',n);
      var total=byId('sequence-count');total.replaceChildren(document.createTextNode(parts.mantissa+' × 10'));var sup=document.createElement('sup');sup.textContent=parts.exponent;total.appendChild(sup);
      text('sequence-count-detail',parts.digits+' digits if written as a whole number.');
      text('space-observation','A '+n+'-position chain has '+(n<=5?exactCount().toLocaleString('en-US'):'about '+countString())+' possible sequences. The count says nothing about what fraction would fold or fluoresce.');
      var f=figure('sequence-space',270,'How the sequence count grows','For length '+n+', there are exactly 20 raised to the power '+n+' sequences. The graph uses log base 10 on the vertical axis; its straight line represents exponential growth in the count.'),svg=f.svg,w=f.width;
      var x0=38,x1=w-18,y0=220,y1=40;
      function px(value){return x0+(value-2)/(229-2)*(x1-x0);}
      function py(value){return y0-(value/300)*(y0-y1);}
      [0,100,200,300].forEach(function(v){line(svg,x0,py(v),x1,py(v));label(svg,x0-8,py(v)+4,String(v),{'text-anchor':'end','font-size':10});});
      [2,100,229].forEach(function(v){line(svg,px(v),y0,px(v),y0+4);label(svg,px(v),y0+18,String(v),{'text-anchor':'middle','font-size':10});});
      line(svg,x0,y0,x0,y1);line(svg,x0,y0,x1,y0);line(svg,px(2),py(2*Math.log10(20)),px(229),py(229*Math.log10(20)),{stroke:c.accent,'stroke-width':2.5});
      var x=px(n),y=py(n*Math.log10(20));line(svg,x,y,x,y0,{stroke:c.secondary,'stroke-dasharray':'3 4'});add(svg,'circle',{cx:x,cy:y,r:5,fill:c.secondary,stroke:c.paper,'stroke-width':2});
      label(svg,clamp(x+9,65,w-68),clamp(y-11,55,205),'N = '+n,{fill:c.secondary,'font-size':11});
      label(svg,x0,18,'log₁₀(number of sequences)',{'font-size':11});label(svg,(x0+x1)/2,263,'chain length N',{'text-anchor':'middle','font-size':11});
    }
    var generationCopy=[
      {owner:'Researchers',title:'Specify what should be preserved.',description:'The GFP design began with information about a small part of an existing fluorescent protein’s core. The desired physical function supplied the research goal.',caution:'A prompt can constrain a design without specifying every amino acid.',rows:['Sequence: a few positions specified','Structure: part of the core specified','Function: fluorescence is the goal']},
      {owner:'ESM3 + computational workflow',title:'Propose compatible completions.',description:'ESM3 can fill missing sequence and structure information using the context supplied. A partial design leaves room for many possible completions.',caution:'The filled tiles represent the idea of sampling, not an actual prediction made on this page.',rows:['Sequence: candidate completion','Structure: candidate completion','Function: still a research goal']},
      {owner:'Computational screening + researchers',title:'Choose which proposals to make.',description:'Candidate designs are filtered and selected before laboratory testing. A predicted structure and a favorable model score help prioritize candidates; neither is a fluorescence measurement.',caution:'An evaluation made by a model is a proxy for the physical property we ultimately care about.',rows:['Sequence: selected candidate','Structure: predicted plausibility','Function: not yet established']},
      {owner:'Researchers + physical experiment',title:'Ask the molecule, not the model.',description:'Researchers make candidate proteins and measure their behavior. A measured signal can support function; a failed or dim candidate can inform the next round.',caution:'The experiment turns a proposed sequence into testable evidence under specific conditions.',rows:['Sequence: a physical protein','Structure: not shown as measured here','Function: fluorescence tested']}
    ];
    function drawGeneration() {
      var copy=generationCopy[state.designStep];text('generation-owner',copy.owner);text('generation-title',copy.title);text('generation-description',copy.description);text('generation-caution',copy.caution);select('[data-design-step]','designStep',state.designStep);
      var f=figure('generation-view',270,copy.title,copy.description+' '+copy.caution),svg=f.svg,w=f.width;
      var tile=(w-35)/12,gap=4;
      for(var row=0;row<2;row++) {
        label(svg,10,27+row*83,row===0?'SEQUENCE':'STRUCTURE',{'font-size':10,'letter-spacing':1});
        for(var i=0;i<12;i++) {
          var specified=row===0?(i===3||i===4):(i>=3&&i<=6),filled=state.designStep>0||specified,x=10+i*tile,y=43+row*83;
          add(svg,'rect',{x:x,y:y,width:tile-gap,height:27,rx:3,fill:specified?c.accent:filled?c.soft:c.paper,stroke:specified?c.accent:c.grid,'stroke-width':1.2});
          label(svg,x+(tile-gap)/2,y+18,filled?'•':'?',{'text-anchor':'middle',fill:specified?c.paper:c.muted,'font-size':12});
        }
      }
      line(svg,10,183,w-10,183);label(svg,10,205,state.designStep===3?'PHYSICAL MEASUREMENT':'FUNCTION IS THE GOAL',{'font-size':10,'letter-spacing':.8,fill:state.designStep===3?c.accent:c.muted});
      label(svg,10,230,state.designStep===3?'Does the made protein fluoresce?':'Does this proposal actually work?',{'font-size':w<300?11:12,fill:c.ink});
      label(svg,10,257,state.designStep===0?'Solid tiles = supplied context':state.designStep===3?'Illustration of a test, not experimental data':'Pale tiles = proposed completion',{'font-size':10});
    }
    function drawIdentity() {
      var pct=state.identityPercent;byId('identity-percent').value=String(pct);text('identity-value',pct);text('identity-different',100-pct);select('[data-identity]','identity',pct);
      var comparison=pct===58?'58% is the paper’s closest-known-fluorescent-protein comparison.':pct===36?'36% is the reported comparison with Aequorea victoria GFP, the original jellyfish GFP.':'This slider setting is a hypothetical comparison, not an additional experimental result.';
      text('identity-comparison',comparison);text('identity-observation','In a toy alignment of 100 positions, '+pct+' matches leave '+(100-pct)+' differences. Identity describes a comparison with a particular reference, not a universal novelty score.');
      var f=figure('identity-grid',270,pct+' percent sequence identity in a 100-position illustration','The schematic has '+pct+' matching positions marked with dots and '+(100-pct)+' differing positions marked with crosses. Positions are invented; this is not the actual esmGFP alignment.'),svg=f.svg,w=f.width;
      var side=Math.min(228,w-16),step=side/10,gap=4,left=(w-side)/2,top=15;
      for(var i=0;i<100;i++) {
        var match=i<pct,x=left+(i%10)*step,y=top+Math.floor(i/10)*step;
        add(svg,'rect',{x:x,y:y,width:step-gap,height:step-gap,rx:2,fill:match?c.soft:c.paper,stroke:match?c.accent:c.secondary,'stroke-width':1});
        label(svg,x+(step-gap)/2,y+(step-gap)/2+3.5,match?'•':'×',{'text-anchor':'middle',fill:match?c.accent:c.secondary,'font-size':11});
      }
      label(svg,w/2,263,pct+' matching · '+(100-pct)+' different',{'text-anchor':'middle','font-size':11});
    }
    function renderAll(){drawProtein();drawSpace();drawGeneration();drawIdentity();}
    document.querySelectorAll('[data-protein-view]').forEach(function(button){button.addEventListener('click',function(){state.proteinView=button.dataset.proteinView;drawProtein();});});
    document.querySelectorAll('[data-protein-length]').forEach(function(button){button.addEventListener('click',function(){state.chainLength=Number(button.dataset.proteinLength);drawSpace();});});
    byId('protein-length').addEventListener('input',function(event){state.chainLength=clamp(Number(event.target.value),2,229);drawSpace();});
    document.querySelectorAll('[data-design-step]').forEach(function(button){button.addEventListener('click',function(){state.designStep=Number(button.dataset.designStep);drawGeneration();});});
    document.querySelectorAll('[data-identity]').forEach(function(button){button.addEventListener('click',function(){state.identityPercent=Number(button.dataset.identity);drawIdentity();});});
    byId('identity-percent').addEventListener('input',function(event){state.identityPercent=clamp(Number(event.target.value),0,100);drawIdentity();});
    var pending=0;
    if(typeof ResizeObserver!=='undefined') {
      var widths=new Map();var observer=new ResizeObserver(function(entries){var changed=false;entries.forEach(function(entry){var next=Math.round(entry.contentRect.width);if(widths.get(entry.target)!==next){widths.set(entry.target,next);changed=true;}});if(changed&&!pending)pending=requestAnimationFrame(function(){pending=0;renderAll();});});
      ['protein-view','sequence-space','generation-view','identity-grid'].forEach(function(id){observer.observe(byId(id));});
    } else { window.addEventListener('resize',function(){if(!pending)pending=requestAnimationFrame(function(){pending=0;renderAll();});}); }
    function getState(){return {proteinView:state.proteinView,chainLength:state.chainLength,sequenceCountExact:exactCount().toString(),designStep:state.designStep,identityPercent:state.identityPercent,identityReference:identityReference()};}
    window.esm3Lesson={getState:getState};
    window.discoveryLessonGuide={
      kind:'esm3',initialContext:'esm3-protein',getState:getState,
      sources:['https://doi.org/10.1126/science.ads0018','https://www.biorxiv.org/content/10.1101/2024.07.01.600583v1.full','https://www.evolutionaryscale.ai/blog/esm3-release','https://pdb101.rcsb.org/motm/42'],
      scope:'This is an explanation of Hayes et al., Simulating 500 million years of evolution with a language model (Science, online 16 January 2025), and the experimentally tested fluorescent protein esmGFP. Keep model proposals separate from physical measurements. The reported 58% sequence identity is to the closest known fluorescent protein in the authors\' comparison; 36% is to Aequorea victoria GFP. Comparable fluorescence intensity refers to the authors\' assays and common GFP controls, not superiority in every condition. The 500-million-year claim is a retrospective estimate from natural sequence divergence, not runtime, a literal replay of evolution, or a dated ancestry for an artificial protein. Human researchers selected the task and candidates and performed laboratory work.',
      settingsCaveat:'All diagrams are schematic except the exact arithmetic 20^N. The 100-position identity grid is an invented arrangement for explaining percentages, not esmGFP\'s sequence alignment. Only the 58% and 36% presets refer to reported comparisons; other identity settings are hypothetical. The 12-bead chain is not esmGFP and the function cartoon is not its computed fold. The workflow tiles are not live model outputs or experimental data. No fluorescence values are plotted.',
      notes:{
        'esm3-protein':{title:'From sequence to physical function',intro:'The design has to connect three descriptions of the same molecule.',simpler:'A sequence tells you which amino acids come in which order. Their interactions help determine the folded shape. That shape supports—or fails to support—a physical function. In GFP, a protected chromophore can absorb light and re-emit it at a longer wavelength.',example:'Positions 2 and 11 are far apart when you read the sequence. A folded chain can bring them close enough to interact. Changing either position can therefore affect a relationship that the written list does not make obvious.',why:'A plausible string of letters or a plausible predicted shape is only part of the task. The molecule must exhibit the property we actually want.',question:'How can sequence, structure, and fluorescence constrain each other?'},
        'esm3-search':{title:'Why the number of sequences explodes',intro:'Each extra position multiplies the count by 20.',simpler:'For a fixed chain length N and an alphabet of 20 amino acids, there are 20^N possible sequences. This counts strings; it does not say how many fold or fluoresce.',example:'Two positions give 400 strings. Three give 8,000. Adding one position multiplies the count by 20 no matter how long the chain already is. The straight line in the plot comes from its logarithmic vertical axis, not slow growth.',why:'A learned model can focus proposals on patterns associated with useful molecules. We still need measurements to find out whether that focus is productive.',question:'Why can learning patterns help search without guaranteeing function?'},
        'esm3-generation':{title:'What the model contributes',intro:'The model proposes completions; researchers decide what to test and measure.',simpler:'ESM3 learns to fill missing information about protein sequence, structure, and function. Partial information can guide a new proposal. Computational checks can prioritize candidates, but are not the same as laboratory evidence.',example:'Predicting shape from a supplied sequence and proposing sequence from partial structural constraints fill in different blanks. In both cases, a model score is a proxy; measured fluorescence is a property of the made molecule.',why:'The interesting achievement is a workflow that connects learned patterns to experimentally useful candidates. Human goal-setting, selection, and experiments are part of the result.',question:'What separates a generated protein proposal from an experimentally established result?'},
        'esm3-evidence':{title:'What the experiment and headline establish',intro:'Keep measurement, comparison, and evolutionary estimate separate.',simpler:'esmGFP fluoresced in the authors\' tests. Its reported closest-known-fluorescent-protein comparison was 58% sequence identity. The evolutionary-timescale estimate interprets that distance; it is not an amount of time the model spent evolving.',example:'In a simplified 100-position alignment, 58 matching positions leave 42 differences. That says nothing by itself about brightness: a small but crucial change can disrupt function, while many other changes can preserve it.',why:'A working, distant example demonstrates a possibility. Reliability across targets requires broader testing, and an identity percentage needs a named reference and comparison method.',question:'Which parts of the esmGFP result were measured, compared, or estimated?'}
      }
    };
    renderAll();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
}());
