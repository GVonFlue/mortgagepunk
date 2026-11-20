/* eslint-disable */
// @ts-nocheck
/* The drawing wheel's engine: canvas wheel, lightning, sound, confetti and the
   pick itself. Ported as-is from the wheel ProyTech runs for live drawings
   (getproytech.com/wheel), recoloured for Mortgage Punk. It is plain DOM code
   on purpose: it was tuned on a projector at a live event, and rewriting the
   animation timing into React state would only risk that.

   THE PICK IS FAIR. winnerIdx comes from randInt(), which draws from
   crypto.getRandomValues with rejection sampling. Nothing here weights,
   orders or remembers names to favour one. Do not add a "demo" switch to
   this file: a rigged wheel must never share a URL with a real drawing.

   initWheel(root) wires everything to the markup in WheelStage.tsx and
   returns a function that removes the page-level listeners again. */
export function initWheel(root) {
  const gone = new AbortController();
  const onDoc = (t, f) => document.addEventListener(t, f, { signal: gone.signal });
  const onWin = (t, f) => window.addEventListener(t, f, { signal: gone.signal });
  const BODYF = (getComputedStyle(document.documentElement).getPropertyValue('--font-body').trim() || 'system-ui') + ', system-ui, sans-serif';

  const $ = id => document.getElementById(id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = $('wheel'), ctx = canvas.getContext('2d');
  const ta = $('names');
  const PAL = ['#B81F27','#141414','#EDEBE8','#EB2933','#1C1C1C','#FF6069'];
  const INK = {'#B81F27':'#ffffff','#141414':'#EDEBE8','#EDEBE8':'#141414','#EB2933':'#ffffff','#1C1C1C':'#EDEBE8','#FF6069':'#0A0A0A'};
  const TAU = Math.PI*2;

  let names = [], rot = 0, spinning = false, drawn = [], winnerIdx = -1, lastTick = -1;

  const store = {
    get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } },
    set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  };

  /* marquee + snow */
  const words = ['Mortgage Punk','Live drawing','Reimagining the American Dream','American Dream Conference','Backstage Pass','Somebody is winning tonight'];
  const run = words.map(w => '<span>'+w+'</span><span><b>ϟ</b></span>').join('');
  $('track').innerHTML = run + run + run + run;
  if(!reduce){
    const s = $('snow');
    for(let i=0;i<22;i++){
      const f = document.createElement('i'), d = 4 + Math.random()*7;
      f.style.cssText = 'left:'+(Math.random()*100)+'%;width:'+d+'px;height:'+d+'px;animation-duration:'+(9+Math.random()*9)+'s;animation-delay:'+(Math.random()*8)+'s';
      s.appendChild(f);
    }
  }

  /* ---------- names ---------- */
  function parse(){
    names = ta.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const seen = new Set(), dup = new Set();
    names.forEach(n => { const k = n.toLowerCase(); if(seen.has(k)) dup.add(n); seen.add(k); });
    $('count').textContent = names.length + (names.length === 1 ? ' name' : ' names');
    $('dupes').textContent = dup.size ? dup.size + ' duplicate' + (dup.size>1?'s':'') + ': ' + [...dup].slice(0,4).join(', ') + (dup.size>4?'…':'') : '';
    $('spinBtn').disabled = $('puck').disabled = names.length < 2;
    store.set('mpwheel_names', ta.value);
    draw();
  }

  /* ---------- wheel drawing ---------- */
  function size(){
    const dpr = devicePixelRatio || 1, w = canvas.clientWidth;
    canvas.width = w*dpr; canvas.height = w*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    const b = $('bolts'); b.width = innerWidth*dpr; b.height = innerHeight*dpr; bctx.setTransform(dpr,0,0,dpr,0,0);
    draw();
  }
  function colorFor(i,n){
    let c = PAL[i % PAL.length];
    if(i === n-1 && n % PAL.length === 1) c = PAL[3];
    return c;
  }
  function fit(label,max,fs){
    ctx.font = '700 '+fs+'px '+BODYF;
    if(ctx.measureText(label).width <= max) return label;
    let s = label;
    while(s.length > 1 && ctx.measureText(s+'…').width > max) s = s.slice(0,-1);
    return s+'…';
  }
  function draw(){
    const W = canvas.clientWidth; if(!W) return;
    const c = W/2, R = c*0.885;
    ctx.clearRect(0,0,W,W);

    // steel rim
    let g = ctx.createLinearGradient(0,0,W,W);
    g.addColorStop(0,'#EDEBE8'); g.addColorStop(.3,'#EB2933'); g.addColorStop(.55,'#141414'); g.addColorStop(.8,'#FF6069'); g.addColorStop(1,'#1C1C1C');
    ctx.beginPath(); ctx.arc(c,c,c*0.985,0,TAU); ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); ctx.arc(c,c,c*0.955,0,TAU); ctx.fillStyle = '#0A0A0A'; ctx.fill();

    ctx.save(); ctx.translate(c,c); ctx.rotate(rot);
    const n = names.length;
    if(!n){
      ctx.beginPath(); ctx.arc(0,0,R,0,TAU); ctx.fillStyle = '#141414'; ctx.fill();
      ctx.rotate(-rot); ctx.fillStyle = '#A8A6A3'; ctx.textAlign = 'center';
      ctx.font = '700 '+Math.round(c*0.065)+'px '+BODYF;
      ctx.fillText('Paste names to load the wheel', 0, R*0.58);
    } else {
      const seg = TAU/n;
      const fs = Math.max(9, Math.min(28, seg*R*0.44, c*0.07));
      const maxW = R - Math.max(c*0.3, fs/seg*1.05) - c*0.045;
      for(let i=0;i<n;i++){
        const col = colorFor(i,n);
        ctx.beginPath(); ctx.moveTo(0,0); ctx.arc(0,0,R,i*seg,(i+1)*seg); ctx.closePath();
        ctx.fillStyle = col; ctx.fill();
        ctx.strokeStyle = 'rgba(5,5,5,.6)'; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.save(); ctx.rotate(i*seg + seg/2);
        ctx.fillStyle = INK[col]; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(fit(names[i], maxW, fs), R - c*0.045, 1);
        ctx.restore();
      }
    }
    ctx.restore();

    // depth + gloss (does not rotate)
    g = ctx.createRadialGradient(c,c,R*0.2,c,c,R);
    g.addColorStop(0,'rgba(5,5,5,.45)'); g.addColorStop(.35,'rgba(5,5,5,0)'); g.addColorStop(.9,'rgba(5,5,5,0)'); g.addColorStop(1,'rgba(5,5,5,.35)');
    ctx.beginPath(); ctx.arc(c,c,R,0,TAU); ctx.fillStyle = g; ctx.fill();
    g = ctx.createLinearGradient(c-R,c-R,c+R*0.2,c+R*0.2);
    g.addColorStop(0,'rgba(255,255,255,.16)'); g.addColorStop(.5,'rgba(255,255,255,0)');
    ctx.beginPath(); ctx.arc(c,c,R,0,TAU); ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); ctx.arc(c,c,R,0,TAU); ctx.lineWidth = c*0.012; ctx.strokeStyle = '#FF6069';
    ctx.shadowColor = '#EB2933'; ctx.shadowBlur = c*0.05; ctx.stroke(); ctx.shadowBlur = 0;

    // chasing arena lights
    const bulbs = 40, phase = spinning ? Math.floor(performance.now()/70) : 0;
    for(let i=0;i<bulbs;i++){
      const a = i/bulbs*TAU, on = spinning ? ((i+phase)%4===0) : (i%2===0);
      const x = c+Math.cos(a)*c*0.92, y = c+Math.sin(a)*c*0.92;
      ctx.beginPath(); ctx.arc(x,y,c*0.012,0,TAU);
      ctx.fillStyle = on ? '#EB2933' : '#EDEBE8';
      ctx.shadowColor = on ? '#EB2933' : '#FF6069'; ctx.shadowBlur = on ? c*0.04 : c*0.015;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  function indexAtPointer(r){
    const n = names.length, seg = TAU/n;
    let a = (-Math.PI/2 - r) % TAU; if(a < 0) a += TAU;
    return Math.floor(a/seg) % n;
  }
  // Rejection sampling: a plain `% max` would make the first few names a hair
  // likelier whenever max does not divide 2^32. Redraw the rare value past the
  // last whole multiple so every name has exactly the same chance.
  function randInt(max){ const lim = Math.floor(4294967296 / max) * max; const b = new Uint32Array(1); do { crypto.getRandomValues(b); } while (b[0] >= lim); return b[0] % max; }
  function rand01(){ const b = new Uint32Array(1); crypto.getRandomValues(b); return b[0]/4294967296; }

  /* ---------- lightning ---------- */
  const bctx = $('bolts').getContext('2d');
  let bolts = [];
  function makeBolt(x1,y1,x2,y2,rough){
    let pts = [[x1,y1],[x2,y2]], off = rough;
    for(let k=0;k<7;k++){
      const next = [pts[0]];
      for(let i=0;i<pts.length-1;i++){
        const [ax,ay] = pts[i], [bx,by] = pts[i+1];
        const mx = (ax+bx)/2, my = (ay+by)/2, dx = bx-ax, dy = by-ay, len = Math.hypot(dx,dy)||1;
        const d = (Math.random()-.5)*off;
        next.push([mx - dy/len*d, my + dx/len*d], [bx,by]);
      }
      pts = next; off *= .55;
    }
    const branches = [];
    for(let i=0;i<3;i++){
      const p = pts[Math.floor(pts.length*(.2+Math.random()*.5))];
      const ang = Math.atan2(y2-y1,x2-x1) + (Math.random()-.5)*1.6, L = Math.hypot(x2-x1,y2-y1)*(.15+Math.random()*.2);
      branches.push(makeSimple(p[0],p[1],p[0]+Math.cos(ang)*L,p[1]+Math.sin(ang)*L,rough*.35));
    }
    return {main:pts, branches};
  }
  function makeSimple(x1,y1,x2,y2,rough){
    let pts = [[x1,y1],[x2,y2]], off = rough;
    for(let k=0;k<5;k++){
      const next = [pts[0]];
      for(let i=0;i<pts.length-1;i++){
        const [ax,ay] = pts[i], [bx,by] = pts[i+1];
        next.push([(ax+bx)/2+(Math.random()-.5)*off,(ay+by)/2+(Math.random()-.5)*off],[bx,by]);
      }
      pts = next; off *= .55;
    }
    return pts;
  }
  function strokePath(pts,w,col,blur){
    bctx.beginPath(); bctx.moveTo(pts[0][0],pts[0][1]);
    for(const p of pts) bctx.lineTo(p[0],p[1]);
    bctx.lineWidth = w; bctx.strokeStyle = col; bctx.shadowColor = '#EB2933'; bctx.shadowBlur = blur; bctx.stroke();
  }
  function addBolt(x1,y1,x2,y2,power){
    bolts.push({b:makeBolt(x1,y1,x2,y2,Math.hypot(x2-x1,y2-y1)*.28), t0:performance.now(), life:power>1?900:520, power});
    if(bolts.length === 1) requestAnimationFrame(renderBolts);
  }
  function renderBolts(now){
    bctx.clearRect(0,0,innerWidth,innerHeight);
    bolts = bolts.filter(o => now - o.t0 < o.life);
    for(const o of bolts){
      const t = (now - o.t0)/o.life;
      const flick = t < .35 ? (Math.random() > .3 ? 1 : .35) : 1 - (t-.35)/.65;
      bctx.globalAlpha = Math.max(0, flick);
      const w = o.power;
      strokePath(o.b.main, 9*w, 'rgba(235,41,51,.35)', 40*w);
      strokePath(o.b.main, 3.2*w, '#FFD0D3', 20*w);
      strokePath(o.b.main, 1.4*w, '#ffffff', 6);
      for(const br of o.b.branches){ strokePath(br, 1.6*w, 'rgba(255,208,211,.8)', 14*w); }
    }
    bctx.globalAlpha = 1; bctx.shadowBlur = 0;
    if(bolts.length) requestAnimationFrame(renderBolts); else bctx.clearRect(0,0,innerWidth,innerHeight);
  }
  function ambientBolt(){
    const W = innerWidth, H = innerHeight, side = randInt(4);
    let x1,y1,x2,y2;
    if(side===0){ x1 = rand01()*W*.3; y1 = -10; x2 = x1 + 60 + rand01()*160; y2 = H*(.15+rand01()*.25); }
    else if(side===1){ x1 = W - rand01()*W*.3; y1 = -10; x2 = x1 - 60 - rand01()*160; y2 = H*(.15+rand01()*.25); }
    else if(side===2){ x1 = -10; y1 = H*(.5+rand01()*.4); x2 = W*(.08+rand01()*.1); y2 = y1 + (rand01()-.5)*200; }
    else { x1 = W+10; y1 = H*(.5+rand01()*.4); x2 = W*(.82+rand01()*.1); y2 = y1 + (rand01()-.5)*200; }
    addBolt(x1,y1,x2,y2,.8);
  }
  function scheduleAmbient(){
    if(reduce) return;
    setTimeout(() => { if(!document.hidden) ambientBolt(); scheduleAmbient(); }, spinning ? 500 + rand01()*700 : 3000 + rand01()*5000);
  }

  /* ---------- sound ---------- */
  let actx = null;
  const ac = () => (actx = actx || new (window.AudioContext||window.webkitAudioContext)());
  let master = null, lastTickAt = 0;
  function out(){
    const a = ac();
    if(!master){
      const comp = a.createDynamicsCompressor();
      comp.threshold.value = -14; comp.knee.value = 8; comp.ratio.value = 6; comp.attack.value = .003; comp.release.value = .25;
      master = a.createGain(); master.gain.value = 1;
      master.connect(comp); comp.connect(a.destination);
    }
    if(a.state === 'suspended') a.resume();
    return master;
  }
  // soft wooden "tock" as the peg passes the pointer, throttled so it never buzzes
  function tick(){
    try{
      const a = ac(), now = a.currentTime;
      if(now - lastTickAt < .045) return;
      lastTickAt = now;
      const o = a.createOscillator(), g = a.createGain(), f = a.createBiquadFilter();
      o.type = 'triangle';
      o.frequency.setValueAtTime(620, now); o.frequency.exponentialRampToValueAtTime(330, now + .03);
      f.type = 'lowpass'; f.frequency.value = 1400;
      g.gain.setValueAtTime(.0001, now); g.gain.exponentialRampToValueAtTime(.09, now + .003);
      g.gain.exponentialRampToValueAtTime(.0001, now + .06);
      o.connect(f); f.connect(g); g.connect(out()); o.start(now); o.stop(now + .07);
    }catch(e){}
  }
  function noiseBuf(sec){
    const a = ac(), len = Math.floor(a.sampleRate*sec), buf = a.createBuffer(1,len,a.sampleRate), d = buf.getChannelData(0);
    for(let i=0;i<len;i++) d[i] = Math.random()*2-1;
    return buf;
  }
  // thunder crack + low boom
  function thunder(){
    try{
      const a = ac(), t = a.currentTime, o = out();
      const crack = a.createBufferSource(), cf = a.createBiquadFilter(), cg = a.createGain();
      crack.buffer = noiseBuf(.35); cf.type = 'highpass'; cf.frequency.value = 900;
      cg.gain.setValueAtTime(.9, t); cg.gain.exponentialRampToValueAtTime(.0001, t + .3);
      crack.connect(cf); cf.connect(cg); cg.connect(o); crack.start(t);
      const boom = a.createBufferSource(), bf = a.createBiquadFilter(), bg = a.createGain();
      boom.buffer = noiseBuf(2.6); bf.type = 'lowpass'; bf.frequency.value = 260;
      bg.gain.setValueAtTime(.0001, t); bg.gain.exponentialRampToValueAtTime(2.2, t + .05); bg.gain.exponentialRampToValueAtTime(.0001, t + 2.5);
      boom.connect(bf); bf.connect(bg); bg.connect(o); boom.start(t);
      const sub = a.createOscillator(), sg = a.createGain();
      sub.type = 'sine'; sub.frequency.setValueAtTime(70, t); sub.frequency.exponentialRampToValueAtTime(32, t + .8);
      sg.gain.setValueAtTime(.9, t); sg.gain.exponentialRampToValueAtTime(.0001, t + .9);
      sub.connect(sg); sg.connect(o); sub.start(t); sub.stop(t + 1);
    }catch(e){}
  }
  // big arena goal horn: low brassy chord, slight scoop up, long sustain, crowd roar underneath
  function horn(){
    try{
      const a = ac(), t = a.currentTime, o = out(), dur = 3.6;
      const shaper = a.createWaveShaper(), curve = new Float32Array(1024);
      for(let i=0;i<1024;i++){ const x = i/512 - 1; curve[i] = Math.tanh(x*2.6); }
      shaper.curve = curve;
      const tone = a.createBiquadFilter(); tone.type = 'lowpass'; tone.frequency.value = 2200; tone.Q.value = 1.2;
      const body = a.createBiquadFilter(); body.type = 'peaking'; body.frequency.value = 420; body.gain.value = 6; body.Q.value = 1;
      const hg = a.createGain();
      hg.gain.setValueAtTime(.0001, t); hg.gain.exponentialRampToValueAtTime(.55, t + .09);
      hg.gain.setValueAtTime(.55, t + dur - .35); hg.gain.exponentialRampToValueAtTime(.0001, t + dur);
      shaper.connect(tone); tone.connect(body); body.connect(hg); hg.connect(o);
      [116.5, 146.8, 174.6, 233.1].forEach(fr => {
        [-5, 5].forEach(cents => {
          ['sawtooth','square'].forEach(type => {
            const osc = a.createOscillator(), g = a.createGain();
            osc.type = type; osc.detune.value = cents;
            osc.frequency.setValueAtTime(fr*0.94, t); osc.frequency.exponentialRampToValueAtTime(fr, t + .12);
            g.gain.value = type === 'square' ? .05 : .08;
            osc.connect(g); g.connect(shaper); osc.start(t); osc.stop(t + dur + .05);
          });
        });
      });
      const roar = a.createBufferSource(), rf = a.createBiquadFilter(), rg = a.createGain();
      roar.buffer = noiseBuf(5); rf.type = 'bandpass'; rf.frequency.value = 900; rf.Q.value = .6;
      rg.gain.setValueAtTime(.0001, t); rg.gain.exponentialRampToValueAtTime(.35, t + .6);
      rg.gain.setValueAtTime(.35, t + 3.2); rg.gain.exponentialRampToValueAtTime(.0001, t + 5);
      roar.connect(rf); rf.connect(rg); rg.connect(o); roar.start(t);
    }catch(e){}
  }

  /* ---------- spin ---------- */
  const pointer = $('pointer'), stage = $('stage');
  function spin(){
    if(spinning || names.length < 2) return;
    spinning = true; stage.classList.add('spinning');
    $('spinBtn').disabled = $('puck').disabled = true; ta.disabled = true;
    const n = names.length, seg = TAU/n;
    winnerIdx = randInt(n);                         // fair crypto-random pick
    const off = .15 + rand01()*.7;                  // land inside the slice
    let delta = ((-Math.PI/2 - (winnerIdx+off)*seg) - rot) % TAU; if(delta < 0) delta += TAU;
    const turns = reduce ? 1 : 8 + randInt(3);
    const start = rot, end = rot + delta + turns*TAU;
    const dur = reduce ? 1200 : 8000 + randInt(1500);
    const t0 = performance.now();
    lastTick = indexAtPointer(rot);
    function frame(now){
      const t = Math.min(1,(now-t0)/dur), e = 1 - Math.pow(1-t,4);
      rot = start + (end-start)*e;
      const idx = indexAtPointer(rot);
      if(idx !== lastTick){ lastTick = idx; tick(); pointer.classList.add('kick'); setTimeout(() => pointer.classList.remove('kick'), 55); }
      draw();
      if(t < 1) requestAnimationFrame(frame);
      else { rot = end % TAU; spinning = false; stage.classList.remove('spinning'); draw(); announce(); }
    }
    requestAnimationFrame(frame);
  }

  function shock(x,y,cls,delay){
    setTimeout(() => { const d = document.createElement('div'); d.className = 'shock ' + (cls||''); d.style.left = x+'px'; d.style.top = y+'px';
      root.appendChild(d); setTimeout(() => d.remove(), 1000); }, delay||0);
  }
  function announce(){
    const name = names[winnerIdx];
    const wn = $('winName'); wn.textContent = name;
    drawn.push(name); renderDrawn();
    if(reduce){ horn(); $('win').classList.add('show'); $('removeBtn').focus(); return; }
    const r = stage.getBoundingClientRect(), cx = r.left + r.width/2, cy = r.top + r.height/2;
    // wave 1: strike the wheel
    addBolt(cx + (rand01()-.5)*80, -20, cx, r.top + r.height*.06, 2.6);
    addBolt(innerWidth*(.05+rand01()*.15), -20, cx - r.width*.3, cy, 1.6);
    addBolt(innerWidth*(.8+rand01()*.15), -20, cx + r.width*.3, cy, 1.6);
    const f = $('flash'); f.className = ''; void f.offsetWidth; f.className = 'on2';
    const pg = document.querySelector('.page'); pg.classList.remove('shake'); void pg.offsetWidth; pg.classList.add('shake');
    shock(cx, cy, '', 0); shock(cx, cy, 'o', 140); shock(cx, cy, '', 300);
    thunder();
    // wave 2: goal
    setTimeout(() => {
      horn();
      ['goal','goalEdge'].forEach(id => { const g = $(id); g.classList.remove('on'); void g.offsetWidth; g.classList.add('on'); });
      const card = document.querySelector('.card'); card.classList.remove('hype'); void card.offsetWidth; card.classList.add('hype');
      wn.classList.remove('pop'); void wn.offsetWidth; wn.classList.add('pop');
      $('win').classList.add('show'); $('removeBtn').focus();
      confetti();
      shock(innerWidth/2, innerHeight/2, 'o', 0); shock(innerWidth/2, innerHeight/2, '', 160);
    }, 320);
    // wave 3: aftershocks
    [900, 1500, 2300].forEach((ms,i) => setTimeout(() => {
      const left = i % 2 === 0;
      addBolt(left ? -20 : innerWidth + 20, innerHeight*(.1+rand01()*.3), innerWidth*(left ? .25+rand01()*.1 : .65+rand01()*.1), innerHeight*(.6+rand01()*.3), 1.4);
    }, ms));
  }
  function closeWin(removeIt){
    $('win').classList.remove('show'); ta.disabled = false;
    if(removeIt && winnerIdx > -1){ names.splice(winnerIdx,1); ta.value = names.join('\n'); }
    winnerIdx = -1; parse();
  }
  function renderDrawn(){
    const ol = $('drawnList'); ol.innerHTML = '';
    drawn.forEach((d,i) => {
      const li = document.createElement('li'), em = document.createElement('em'), sp = document.createElement('span');
      em.textContent = '#'+(i+1); sp.textContent = d; li.append(em, sp); ol.appendChild(li);
    });
    $('drawnEmpty').style.display = drawn.length ? 'none' : 'block';
    store.set('mpwheel_drawn', JSON.stringify(drawn));
  }

  function confetti(){
    const cv = $('confetti'), cx = cv.getContext('2d'), dpr = devicePixelRatio || 1;
    cv.width = innerWidth*dpr; cv.height = innerHeight*dpr; cx.setTransform(dpr,0,0,dpr,0,0);
    const cols = ['#EB2933','#FF6069','#EDEBE8','#B81F27','#EB2933','#ffffff'];
    const P = [];
    const mk = (x,y,vx,vy,delay) => P.push({x,y,vx,vy,delay,r:Math.random()*6,vr:(Math.random()-.5)*.35,
      w:6+Math.random()*8,h:10+Math.random()*10,c:cols[Math.floor(Math.random()*cols.length)],spark:Math.random()<.18});
    // corner cannons, two volleys
    [0,650].forEach(delay => {
      [[.02,1],[.98,-1]].forEach(([x,dir]) => { for(let i=0;i<150;i++) mk(innerWidth*x, innerHeight*.98, dir*(4+Math.random()*12), -(16+Math.random()*14), delay); });
    });
    // center burst behind the name
    for(let i=0;i<220;i++){ const a = Math.random()*Math.PI*2, s = 6+Math.random()*18; mk(innerWidth/2, innerHeight*.45, Math.cos(a)*s, Math.sin(a)*s-6, 0); }
    // rain from the top
    for(let i=0;i<120;i++) mk(Math.random()*innerWidth, -20 - Math.random()*200, (Math.random()-.5)*2, 2+Math.random()*3, 400);
    const t0 = performance.now();
    (function loop(now){
      const el = now - t0;
      cx.clearRect(0,0,innerWidth,innerHeight);
      for(const p of P){
        if(el < p.delay) continue;
        p.vy += .34; p.vx *= .985; p.vy *= .995; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        cx.save(); cx.translate(p.x,p.y); cx.rotate(p.r);
        if(p.spark){ cx.fillStyle = '#fff'; cx.shadowColor = '#FF6069'; cx.shadowBlur = 12; cx.beginPath(); cx.arc(0,0,2.6,0,Math.PI*2); cx.fill(); cx.shadowBlur = 0; }
        else { cx.fillStyle = p.c; cx.fillRect(-p.w/2,-p.h/2,p.w,p.h*Math.abs(Math.cos(p.r*2))); }
        cx.restore();
      }
      if(el < 6500) requestAnimationFrame(loop); else cx.clearRect(0,0,innerWidth,innerHeight);
    })(t0);
  }

  /* ---------- wiring ---------- */
  ta.addEventListener('input', parse);
  $('spinBtn').addEventListener('click', spin);
  $('puck').addEventListener('click', spin);
  $('removeBtn').addEventListener('click', () => { closeWin(true); setTimeout(spin, 300); });
  $('closeBtn').addEventListener('click', () => closeWin(true));
  $('keepBtn').addEventListener('click', () => closeWin(false));
  $('shuffleBtn').addEventListener('click', () => {
    if(spinning) return;
    for(let i=names.length-1;i>0;i--){ const j = randInt(i+1); [names[i],names[j]] = [names[j],names[i]]; }
    ta.value = names.join('\n'); parse();
  });
  $('clearBtn').addEventListener('click', () => {
    if(spinning) return;
    if(names.length && !confirm('Clear every name and the winners list?')) return;
    ta.value = ''; drawn = []; renderDrawn(); parse();
  });
  $('stageBtn').addEventListener('click', () => {
    const on = document.body.classList.toggle('stagemode');
    $('stageBtn').textContent = on ? 'Edit names' : 'Stage mode';
  });
  $('fsBtn').addEventListener('click', () => {
    if(document.fullscreenElement){ document.exitFullscreen && document.exitFullscreen(); }
    else if(document.documentElement.requestFullscreen){ document.documentElement.requestFullscreen().catch(()=>{}); }
  });
  onDoc('keydown', e => {
    const open = $('win').classList.contains('show');
    if(e.code === 'Space' && document.activeElement !== ta && !open){ e.preventDefault(); spin(); }
    if(e.key === 'Escape' && open) closeWin(false);
  });
  onWin('resize', size);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(draw);

  ta.value = store.get('mpwheel_names') || '';
  try{ drawn = JSON.parse(store.get('mpwheel_drawn') || '[]') || []; }catch(e){ drawn = []; }
  renderDrawn(); size(); parse(); scheduleAmbient();

  return () => { gone.abort(); document.body.classList.remove('stagemode'); };
}
