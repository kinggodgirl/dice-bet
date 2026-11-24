/* 주사위 칩 예측 — 학생·교사 화면 공통 계산과 그림 */
(function(){
const DC = {};
/* 단계별 나올 수 있는 결과 */
DC.outs = st => st===2 ? [2,3,4,5,6,7,8,9,10,11,12] : [1,2,3,4,5,6];
/* 이론 확률 (교사 화면의 '이론값' 표시에만 씀) */
DC.prob = (st,v) => st===2 ? (6-Math.abs(v-7))/36 : 1/6;
/* 판마다 굴리는 횟수 선택지 (칩 개수 = 굴리는 횟수) */
DC.nOpts = st => st===2 ? [36,72] : [30,60];
DC.stageName = st => st===2 ? '2단계 · 주사위 두 개의 합' : '1단계 · 주사위 한 개';

function rnd6(){
  try{ const a=new Uint32Array(1); crypto.getRandomValues(a); return a[0]%6+1; }
  catch(e){ return Math.floor(Math.random()*6)+1; }
}
/* 굴리기: 1단계는 "3516…" (한 글자 = 한 번), 2단계는 "3561…" (두 글자 = 한 번, 두 주사위) */
DC.roll = (st,n) => { let s=''; for(let i=0;i<n*(st===2?2:1);i++) s+=rnd6(); return s; };
/* 굴린 결과 문자열 → [{a,b,v}] */
DC.decode = (st,s) => {
  const r=[]; s=String(s||'');
  if(st===2){ for(let i=0;i+1<s.length;i+=2){ const a=+s[i], b=+s[i+1]; r.push({a,b,v:a+b}); } }
  else for(let i=0;i<s.length;i++){ const a=+s[i]; r.push({a,v:a}); }
  return r;
};
/* 결과별 횟수 (outs 순서 배열) */
DC.counts = (st,list) => { const o=DC.outs(st), c=o.map(()=>0); for(const x of list){ const i=o.indexOf(x.v); if(i>=0) c[i]++; } return c; };
/* 점수 = 칩과 실제 횟수가 겹친 만큼 */
DC.score = (chips,counts) => chips.reduce((s,c,i)=>s+Math.min(c||0,counts[i]||0),0);
DC.sum = a => (a||[]).reduce((s,x)=>s+(+x||0),0);
/* 칩 배열 검사: 길이·자연수·합 */
DC.validChips = (st,n,c) => Array.isArray(c) && c.length===DC.outs(st).length && c.every(x=>Number.isInteger(x)&&x>=0&&x<=n) && DC.sum(c)===n;

/* 순위 (같은 점수 같은 등수) : {key:score} → {key:rank} */
DC.ranks = sc => { const ks=Object.keys(sc).sort((a,b)=>sc[b]-sc[a]); const rk={}; ks.forEach((k,i)=>{ rk[k]= i>0&&sc[k]===sc[ks[i-1]] ? rk[ks[i-1]] : i+1; }); return rk; };

/* 비교용 전략 (교사 모의실험) */
DC.presets = (st,n) => {
  const o=DC.outs(st), L=o.length;
  const spread = (w) => { const t=DC.sum(w); const raw=w.map(x=>x/t*n), c=raw.map(Math.floor); let left=n-DC.sum(c);
    const order=raw.map((x,i)=>[x-Math.floor(x),i]).sort((a,b)=>b[0]-a[0]); for(let k=0;left>0;k++,left--) c[order[k%L][1]]++; return c; };
  const one = i => o.map((_,j)=>j===i?n:0);
  if(st===2) return [
    {id:'even', name:'모두 고르게', c:[4,3,3,3,3,4,3,3,3,3,4].map(x=>x*n/36)},
    {id:'mid', name:'7 근처에 많이', c:spread(o.map(v=>6-Math.abs(v-7)))},
    {id:'only7', name:'7에 몽땅', c:one(5)},
    {id:'ends', name:'양 끝(2·12)에 많이', c:spread(o.map(v=>1+Math.abs(v-7)))},
  ];
  return [
    {id:'even', name:'모두 고르게', c:spread(o.map(()=>1))},
    {id:'only6', name:'6에 몽땅', c:one(5)},
    {id:'half', name:'5·6에 반반', c:o.map(v=>v>=5?n/2:0)},
    {id:'tilt', name:'큰 눈에 조금 더', c:spread([1,1,1,2,2,2])},
  ];
};
/* 모의실험: 여러 전략이 같은 판(같은 굴림)으로 games판 겨룸 → 평균 점수·1등 횟수 */
DC.simulate = (st,n,strats,games) => {
  const res=strats.map(()=>({tot:0,win:0}));
  for(let g=0;g<games;g++){
    const cnt=DC.counts(st,DC.decode(st,DC.roll(st,n)));
    const sc=strats.map(s=>DC.score(s.c,cnt)), best=Math.max(...sc), nb=sc.filter(x=>x===best).length;
    sc.forEach((x,i)=>{ res[i].tot+=x; if(x===best) res[i].win+=1/nb; });
  }
  return res.map(r=>({avg:r.tot/games, win:r.win}));
};

/* ---------- 그림 ---------- */
const PIPS={1:[[50,50]],2:[[27,27],[73,73]],3:[[27,27],[50,50],[73,73]],4:[[27,27],[73,27],[27,73],[73,73]],5:[[27,27],[73,27],[50,50],[27,73],[73,73]],6:[[27,25],[73,25],[27,50],[73,50],[27,75],[73,75]]};
DC.dieSVG = (v,size,cls) => `<svg class="die ${cls||''}" width="${size}" height="${size}" viewBox="0 0 100 100" aria-label="주사위 ${v}"><rect x="4" y="4" width="92" height="92" rx="18" fill="#fff" stroke="#1d2433" stroke-width="6"/>${(PIPS[v]||[]).map(([x,y])=>`<circle cx="${x}" cy="${y}" r="9.5" fill="${v===1?'#cf3f54':'#1d2433'}"/>`).join('')}</svg>`;

/* 막대 판: chips(내 칩, 없으면 null), counts(실제, 없으면 null), opt.max(눈금 최대), opt.theory(N: 이론값 점선), opt.edit(칩 놓기 가능) */
DC.boardHTML = (st,chips,counts,opt) => {
  opt=opt||{}; const o=DC.outs(st);
  const mx=Math.max(opt.max||1, ...(chips||[0]), ...(counts||[0]), opt.theory?Math.ceil(opt.theory*Math.max(...o.map(v=>DC.prob(st,v)))):0);
  const pct=x=>(x/mx*100).toFixed(2)+'%';
  return `<div class="board ${opt.edit?'edit':''} s${st}" data-max="${mx}">${o.map((v,i)=>{
    const c=chips?chips[i]||0:0, k=counts?counts[i]||0:0, ov=Math.min(c,k);
    const th=opt.theory?opt.theory*DC.prob(st,v):null;
    return `<div class="bcol" data-i="${i}">
      <div class="bnum">${counts?`<span class="k">${k}</span>`:''}${chips&&counts?'<span class="sl">/</span>':''}${chips?`<span class="c">${c}</span>`:''}</div>
      <div class="barea" data-i="${i}">
        ${counts?`<div class="act" style="height:${pct(k)}"></div>`:''}
        ${chips?`<div class="chp ${c?'':'zero'}" style="height:${pct(c)};background-size:100% ${(100/Math.max(c,1)).toFixed(3)}%"></div>`:''}
        ${chips&&counts&&ov?`<div class="ovl" style="height:${pct(ov)}"></div>`:''}
        ${th!=null?`<div class="thy" style="bottom:${pct(th)}"></div>`:''}
      </div>
      <div class="blab">${v}</div>
      ${opt.edit?`<div class="bbtn"><button class="pl" data-i="${i}" data-d="1" aria-label="${v}에 칩 하나 더">＋</button><button class="mi" data-i="${i}" data-d="-1" aria-label="${v}에서 칩 하나 빼기">－</button></div>`:''}
    </div>`; }).join('')}</div>`;
};
/* 판 공통 스타일 (한 번만 넣음) */
DC.css = `
.board{display:flex;gap:6px;align-items:flex-end;width:100%;user-select:none;-webkit-user-select:none}
.bcol{flex:1;display:flex;flex-direction:column;align-items:stretch;min-width:0}
.bnum{text-align:center;font-weight:900;font-size:17px;height:26px;white-space:nowrap}
.bnum .k{color:#2f5d9e}.bnum .c{color:#b8730a}.bnum .sl{color:#bbb;margin:0 2px;font-weight:400}
.barea{position:relative;height:var(--bh,260px);background:repeating-linear-gradient(to top,#f3efe6 0 1px,transparent 1px 100%);border-bottom:3px solid #1d2433;border-radius:6px 6px 0 0;touch-action:none}
.board.edit .barea{cursor:pointer;background-color:#fffdf8}
.act{position:absolute;left:6%;right:6%;bottom:0;background:#9fb9de;border-radius:5px 5px 0 0;transition:height .12s}
.chp{position:absolute;left:18%;right:18%;bottom:0;border:3px solid #d9930f;border-radius:6px 6px 2px 2px;background-image:linear-gradient(to top,rgba(217,147,15,.55) 0 calc(100% - 3px),#fff8e8 calc(100% - 3px));background-color:rgba(255,214,120,.35)}
.chp.zero{border:none}
.ovl{position:absolute;left:18%;right:18%;bottom:0;background:rgba(46,139,87,.75);border-radius:4px 4px 0 0}
.thy{position:absolute;left:0;right:0;border-top:3px dashed #cf3f54;height:0}
.blab{text-align:center;font-weight:900;font-size:22px;margin-top:4px;font-family:"Times New Roman",Times,serif}
.bbtn{display:flex;flex-direction:column;gap:5px;margin-top:6px}
.bbtn button{padding:8px 0;font-size:22px;line-height:1;border-radius:10px}
.bbtn .pl{background:#d9930f}.bbtn .mi{background:#fff;color:#1d2433;border:2px solid #ddd6c8}
.board.s2 .bnum{font-size:14px}.board.s2 .blab{font-size:18px}.board.s2 .bbtn button{font-size:19px;padding:7px 0}
.legend{display:flex;gap:14px;flex-wrap:wrap;font-size:14px;color:#6b6f78;margin-top:8px;align-items:center}
.legend i{display:inline-block;width:16px;height:14px;border-radius:3px;vertical-align:-2px;margin-right:4px}
.legend .lc{border:3px solid #d9930f;background:rgba(255,214,120,.6)}.legend .la{background:#9fb9de}.legend .lo{background:rgba(46,139,87,.75)}.legend .lt{border-top:3px dashed #cf3f54;height:0;width:18px;border-radius:0}
.die{display:inline-block;vertical-align:middle}
`;
/* 칩 놓기: 막대를 누르거나 끌어서 높이 정하기, ＋/－ 버튼. setChips 가 화면을 다시 그려도 끌기가 이어지게 상태는 바깥에 둠 */
let DRAG=null;
DC.bindBoard = (root,getChips,setChips,n) => {
  const el=root.querySelector('.board'); if(!el) return;
  el.querySelectorAll('.bbtn button').forEach(b=>b.addEventListener('click',()=>{
    const c=getChips().slice(), i=+b.dataset.i, d=+b.dataset.d;
    if(d>0 && DC.sum(c)>=n) return setChips(c,'full');
    c[i]=Math.max(0,c[i]+d); setChips(c);
  }));
  el.querySelectorAll('.barea').forEach(a=>{
    a.addEventListener('pointerdown',e=>{ DRAG={root,getChips,setChips,n}; setAt(a,e.clientY); e.preventDefault(); });
  });
};
function setAt(area,y){
  if(!DRAG) return;
  const brd=area.closest('.board'), mx=+brd.dataset.max||DRAG.n;
  const r=area.getBoundingClientRect(), i=+area.dataset.i;
  let want=Math.round((r.bottom-y)/r.height*mx); want=Math.max(0,Math.min(mx,want));
  const c=DRAG.getChips().slice(); if(c[i]===want) return;
  const room=DRAG.n-(DC.sum(c)-c[i]);
  const full=want>room; c[i]=Math.min(want,room); DRAG.setChips(c,full?'full':'');
}
addEventListener('pointermove',e=>{ if(!DRAG) return; const t=document.elementFromPoint(e.clientX,e.clientY); const a=t&&t.closest&&t.closest('.barea'); if(a&&DRAG.root.contains(a)) setAt(a,e.clientY); },{passive:true});
addEventListener('pointerup',()=>{ DRAG=null; }); addEventListener('pointercancel',()=>{ DRAG=null; });
/* 칩 놓기 판의 눈금: 기본은 칩의 절반, 그보다 많이 놓으면 늘어남 */
DC.editMax = (n,chips) => Math.max(Math.ceil(n/2), ...chips);
/* 칩만 바뀌었을 때 판을 다시 만들지 않고 고침 (끌기가 끊기지 않게). 눈금을 바꿔야 하면 false */
DC.patchBoard = (root,chips) => {
  const el=root.querySelector('.board'); if(!el) return false;
  const mx=+el.dataset.max; if(Math.max(...chips)>mx) return false;
  el.querySelectorAll('.bcol').forEach(col=>{ const i=+col.dataset.i, c=chips[i]||0, p=col.querySelector('.chp'), t=col.querySelector('.bnum .c');
    if(p){ p.style.height=(c/mx*100).toFixed(2)+'%'; p.style.backgroundSize='100% '+(100/Math.max(c,1)).toFixed(3)+'%'; p.classList.toggle('zero',!c); }
    if(t) t.textContent=c; });
  return true;
};
window.DC = DC;
})();
