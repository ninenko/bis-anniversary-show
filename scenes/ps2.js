/* Preschool 2 - "We Are Family" - hand-drawn crayon backgrounds (round 2 rebuild).
   Every static layer is pre-rendered in setup; draw() only blits sprites with loop-safe motion. */
(function(){
const INK='#1c1c1c',TAU=Math.PI*2,PI=Math.PI,W=1920,H=1080;

/* ---------- local helpers (work on any 2D context) ---------- */
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,Math.ceil(w));c.height=Math.max(1,Math.ceil(h));return c};
function ink(c,p,fill,w=6,col=INK){if(fill){c.fillStyle=fill;c.fill(p)}if(w){c.lineWidth=w;c.strokeStyle=col;c.lineJoin='round';c.lineCap='round';c.stroke(p)}}
function rb(S,cx,cy,rx,ry,rot=0,o={}){const p=new Path2D();p.addPath(S.blob(0,0,rx,ry,o),new DOMMatrix().translate(cx,cy).rotate(rot*180/PI));return p}
// crayon blob with a thin second hand-drawn outline
function dblob(c,S,cx,cy,rx,ry,fill,w=6,o={},rot=0,col=INK){const p=rb(S,cx,cy,rx,ry,rot,o);ink(c,p,fill,w,col);c.save();c.globalAlpha=.4;
  ink(c,rb(S,cx+S.R(-2,2),cy+S.R(-2,2),rx*.93,ry*.93,rot,o),null,Math.max(1.5,w*.35),col);c.restore();return p}
// sprite = offscreen canvas covering local box (x0,y0,w,h); fn draws in local coords
function sprite(x0,y0,w,h,fn){const cv=mk(w,h),c=cv.getContext('2d');c.translate(-x0,-y0);fn(c);return{cv,x0,y0}}
function blit(c,sp,x,y,rot=0,sx=1,sy=sx,a=1){if(a<=0)return;c.save();c.translate(x,y);if(rot)c.rotate(rot);if(sx!==1||sy!==1)c.scale(sx,sy);if(a<1)c.globalAlpha*=a;c.drawImage(sp.cv,sp.x0,sp.y0);c.restore()}
function eye(c,x,y,r){c.fillStyle=INK;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(x+r*.33,y-r*.36,r*.38,0,TAU);c.fill()}
function arcS(c,x,y,r,a0,a1,w=4,col=INK){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.beginPath();c.arc(x,y,r,a0,a1);c.stroke()}
const smile=(c,x,y,r,w=4,col=INK)=>arcS(c,x,y,r,.18*PI,.82*PI,w,col);
const happyEye=(c,x,y,r,w=4)=>arcS(c,x,y,r,1.15*PI,1.85*PI,w);
const sleepEye=(c,x,y,r,w=4)=>arcS(c,x,y,r,.15*PI,.85*PI,w);
function blush(c,x,y,r,col='#ff8fa0',a=.7){c.save();c.globalAlpha=a;c.fillStyle=col;c.beginPath();c.ellipse(x,y,r,r*.62,0,0,TAU);c.fill();c.restore()}
function stroke(c,pts,col,w){c.strokeStyle=col;c.lineWidth=w;c.lineCap=c.lineJoin='round';c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.stroke()}
// crayon texture strokes (optionally clipped to a path)
function scrib(c,S,path,x0,y0,x1,y1,cols,n,len=[8,22],w=[2,4],a=.35,ang=[-.5,.2]){c.save();if(path)c.clip(path);c.lineCap='round';c.globalAlpha=a;
  for(let i=0;i<n;i++){const x=S.R(x0,x1),y=S.R(y0,y1),l=S.R(len[0],len[1]),t=S.R(ang[0],ang[1]);c.strokeStyle=cols[i%cols.length];c.lineWidth=S.R(w[0],w[1]);
    c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(t)*l,y+Math.sin(t)*l);c.stroke()}c.restore()}
function vgrad(c,y0,y1,stops){const g=c.createLinearGradient(0,y0,0,y1);stops.forEach((s,i)=>g.addColorStop(i/(stops.length-1),s));return g}
function shade(c,path,y0,y1,stops){c.save();c.clip(path);c.fillStyle=vgrad(c,y0,y1,stops);c.fillRect(-100,y0,W+200,y1-y0);c.restore()}
function rglow(c,x,y,r,col,a=1){c.save();c.globalAlpha*=a;const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r);c.restore()}
function sd(pts){const n=pts.length,g=i=>pts[Math.max(0,Math.min(n-1,i))];let d=`M${pts[0][0]},${pts[0][1]}`;
  for(let i=0;i<n-1;i++){const p0=g(i-1),p1=g(i),p2=g(i+1),p3=g(i+2);d+=` C${p1[0]+(p2[0]-p0[0])/6},${p1[1]+(p2[1]-p0[1])/6} ${p2[0]-(p3[0]-p1[0])/6},${p2[1]-(p3[1]-p1[1])/6} ${p2[0]},${p2[1]}`}return d}
const hillP=(pts,b=H+40)=>new Path2D(sd(pts)+` L${pts[pts.length-1][0]},${b} L${pts[0][0]},${b} Z`);
function wrect(S,x0,y0,x1,y1,j=2){const pts=[];const e=(ax,ay,bx,by)=>{const n=Math.max(2,Math.round(Math.hypot(bx-ax,by-ay)/70));for(let i=0;i<n;i++){const t=i/n;pts.push([ax+(bx-ax)*t+S.R(-j,j),ay+(by-ay)*t+S.R(-j,j)])}};
  e(x0,y0,x1,y0);e(x1,y0,x1,y1);e(x1,y1,x0,y1);e(x0,y1,x0,y0);const p=new Path2D();pts.forEach((q,i)=>i?p.lineTo(q[0],q[1]):p.moveTo(q[0],q[1]));p.closePath();return p}
function tuft(c,x,y,s,col){c.strokeStyle=col;c.lineWidth=3.5;c.lineCap='round';c.beginPath();c.moveTo(x-10*s,y);c.quadraticCurveTo(x-8*s,y-14*s,x-16*s,y-24*s);
  c.moveTo(x,y);c.quadraticCurveTo(x,y-18*s,x+3*s,y-30*s);c.moveTo(x+10*s,y);c.quadraticCurveTo(x+12*s,y-12*s,x+20*s,y-20*s);c.stroke()}
function tinyFlower(c,x,y,col,r=4){c.fillStyle=col;for(let i=0;i<5;i++){const a=i/5*TAU;c.beginPath();c.arc(x+Math.cos(a)*r,y+Math.sin(a)*r,r*.8,0,TAU);c.fill()}c.fillStyle='#ffcf2a';c.beginPath();c.arc(x,y,r*.6,0,TAU);c.fill()}
function bow(c,x,y,sc,col){c.save();c.translate(x,y);c.scale(sc,sc);ink(c,new Path2D('M0,0 C-8,-16 -27,-18 -25,0 C-27,18 -8,16 0,0 Z M0,0 C8,-16 27,-18 25,0 C27,18 8,16 0,0 Z'),col,3.5);
  const k=new Path2D();k.arc(0,0,6.5,0,TAU);ink(c,k,col,3.5);c.restore()}
function heartSp(S,s,fill,w=4,line=INK){return sprite(-s*1.3,-s*1.3,s*2.6,s*1.95,c=>{ink(c,S.heartPath(s),fill,w,line);c.save();c.globalAlpha=.6;c.fillStyle='#fff';c.beginPath();c.ellipse(-s*.36,-s*.48,s*.15,s*.08,-.7,0,TAU);c.fill();c.restore()})}
function cloudSp(S,w,h,fill,line,shadeCol){return sprite(-w*.82,-h*.9,w*1.64,h*1.8,c=>{const o={bumps:5,amp:.42,jit:.02,n:70};const p=S.blob(0,0,w/2,h/2,o);c.fillStyle=fill;c.fill(p);
  scrib(c,S,p,-w*.8,-h*.1,w*.8,h*.8,[shadeCol],Math.round(w/5),[14,34],[3,6],.4,[-.15,.1]);scrib(c,S,p,-w*.8,-h*.8,w*.8,0,['#ffffff'],Math.round(w/8),[10,24],[3,5],.5,[-.15,.1]);
  ink(c,p,null,6,line);c.save();c.globalAlpha=.45;ink(c,S.blob(3,-2,w/2*.94,h/2*.94,o),null,2.5,line);c.restore()})}
function vbird(c,x,y,s,flap,col=INK){c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle=col;c.lineWidth=5;c.lineCap=c.lineJoin='round';const k=-16*flap+4;
  c.beginPath();c.moveTo(-26,0);c.quadraticCurveTo(-13,k,0,2);c.quadraticCurveTo(13,k,26,0);c.stroke();c.restore()}
function flowerSp(S,kind,col,h){return sprite(-52,-h-52,104,h+60,c=>{c.strokeStyle='#2f7a1e';c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(S.R(-12,12),-h/2,0,-h);c.stroke();
  ink(c,rb(S,13,-h*.36,17,7,-.6),'#45b52e',3);if(h>70)ink(c,rb(S,-13,-h*.6,15,6,.6),'#45b52e',3);
  const y=-h;
  if(kind===0){for(let i=0;i<8;i++){const a=i/8*TAU;ink(c,rb(S,Math.cos(a)*19,y+Math.sin(a)*19,14,8,a),col,3)}const m=new Path2D();m.arc(0,y,11,0,TAU);ink(m?c:c,m,'#ffc81a',3)}
  else if(kind===1){ink(c,new Path2D(`M-20,${y-14} L-10,${y-2} L0,${y-20} L10,${y-2} L20,${y-14} Q22,${y+18} 0,${y+20} Q-22,${y+18} -20,${y-14} Z`),col,4)}
  else if(kind===2){ink(c,S.blob(0,y,27,25,{bumps:5,amp:.5,jit:.03}),col,4);arcS(c,-2,y-2,9,.2,2.6,3,'rgba(0,0,0,.35)')}
  else{for(let i=0;i<6;i++){const a=i/6*TAU;stroke(c,[[0,y],[Math.cos(a)*25,y+Math.sin(a)*25]],col,9)}const m=new Path2D();m.arc(0,y,8,0,TAU);ink(c,m,'#ffb000',2.5)}})}
function wingSp(S,col,col2){return sprite(-52,-44,104,88,c=>{[-1,1].forEach(d=>{ink(c,rb(S,d*22,-12,24,18,d*.45),col,3.5);ink(c,rb(S,d*16,14,15,12,-d*.4),col2,3.5);
  c.fillStyle='#fff';c.beginPath();c.arc(d*24,-14,5,0,TAU);c.fill()});ink(c,rb(S,0,0,5,20),INK,0);stroke(c,[[-2,-18],[-10,-34]],INK,2.5);stroke(c,[[2,-18],[10,-34]],INK,2.5)})}
// cute standing animal family member (feet at local 0,0)
function critterSp(S,k){const s=k.s,F=k.fill,w=5.5;return sprite(-118*s,-305*s,236*s,316*s,c=>{c.scale(s,s);
  if(k.kind==='bunny')[-1,1].forEach(d=>{ink(c,rb(S,d*30,-232,17,54,d*.2),F,w);ink(c,rb(S,d*30,-226,8,38,d*.2),k.inner,0)});
  if(k.kind==='bear')[-1,1].forEach(d=>{ink(c,S.blob(d*45,-190,22,21),F,w);ink(c,S.blob(d*45,-190,11,10),k.inner,0)});
  if(k.kind==='cat')[-1,1].forEach(d=>{ink(c,new Path2D(`M${d*16},-192 Q${d*40},-240 ${d*56},-234 Q${d*64},-196 ${d*58},-166 Z`),F,w);
    ink(c,new Path2D(`M${d*28},-190 Q${d*42},-220 ${d*50},-218 Q${d*55},-196 ${d*50},-178 Z`),k.inner,0)});
  ink(c,rb(S,-25,-11,25,13),F,w);ink(c,rb(S,25,-11,25,13),F,w);
  dblob(c,S,0,-70,52,62,F,w);ink(c,S.blob(0,-62,31,40,{jit:.04}),k.belly,0);
  ink(c,rb(S,-50,-84,14,30,.35),F,w);ink(c,rb(S,50,-84,14,30,-.35),F,w);
  dblob(c,S,0,-152,64,55,F,w);
  if(k.kind==='dog')[-1,1].forEach(d=>ink(c,rb(S,d*60,-146,20,44,d*.3),k.ear,w));
  if(k.patch)ink(c,S.blob(26,-170,22,18),k.patch,0);
  if(k.kind==='bear'||k.kind==='dog'){ink(c,S.blob(0,-131,28,20),k.belly,3.5);c.fillStyle=INK;c.beginPath();c.ellipse(0,-140,10,7,0,0,TAU);c.fill()}
  else{const n=new Path2D('M-8,-142 L8,-142 L0,-133 Z');ink(c,n,'#ff7a9a',2.5)}
  eye(c,-23,-162,7.5);eye(c,23,-162,7.5);
  arcS(c,-6,-130,6,.1*PI,.9*PI,3.5);arcS(c,6,-130,6,.1*PI,.9*PI,3.5);
  blush(c,-41,-138,10);blush(c,41,-138,10);
  if(k.kind==='cat'){[-1,1].forEach(d=>{stroke(c,[[d*30,-140],[d*62,-146]],INK,2.5);stroke(c,[[d*30,-134],[d*62,-130]],INK,2.5)})}
  if(k.glasses){c.strokeStyle=INK;c.lineWidth=3.5;c.beginPath();c.arc(-23,-162,14,0,TAU);c.moveTo(37,-162);c.arc(23,-162,14,0,TAU);c.moveTo(-9,-164);c.lineTo(9,-164);c.stroke()}
  if(k.bow)bow(c,k.kind==='bunny'?30:36,k.kind==='bunny'?-196:-198,1,k.bow);
  if(k.tie){ink(c,new Path2D('M0,-100 L-20,-112 L-20,-88 Z M0,-100 L20,-112 L20,-88 Z'),k.tie,3.5);const m=new Path2D();m.arc(0,-100,5,0,TAU);ink(c,m,k.tie,3)}})}
function drawCritter(c,S,f){let y=f.y,rot=0,sx=1,sy=1;
  if(f.mode==='hop'){const h=Math.max(0,S.osc(f.sec||1.7,f.ph));y-=26*h;sy=1+.04*h;sx=1-.03*h}
  else{rot=.035*S.osc(f.sec||4.6,f.ph);sy=1+.012*S.osc(2.3,f.ph)}
  blit(c,f.sp,f.x,y,rot,sx,sy)}
function rising(c,S,sp,x,y,sec,ph,dist=170){const t=S.saw(sec,ph),a=Math.min(1,t/.15,(1-t)/.35);blit(c,sp,x+12*Math.sin(t*TAU+ph*6),y-t*dist,.15*Math.sin(t*TAU*1.5),.45+.65*t,.45+.65*t,a)}

/* =====================================================================
   1. FAMILY TREE - sunny spring morning
   ===================================================================== */
BIS.scene('ps2-1',{title:'Family Tree',
blurb:'A huge tree full of swaying heart fruit with a bird family in its nest, and bunny and bear families underneath on a sunny spring morning.',
setup(S){const st=S.state,R=S.R;
 const P={
  grassL:S.hatch('#a6dd3a',['#c8f05a','#86c524','#b8e84a'],50,12,4),
  grassM:S.hatch('#63c23e',['#80d650','#4aa82e','#94e060'],50,12,4),
  far:S.hatch('#8fd4ae',['#a6dfc0','#76c298','#b4e8cc'],60,10,4),
  bush:S.hatch('#5a64d6',['#7a84ea','#4650c0','#8890f0'],40,10,3),
  leaf:S.hatch('#5ccb38',['#86e250','#42ae26','#a2ee66'],44,14,4),
  leafD:S.hatch('#2f9a3a',['#44b04a','#22802e','#55bd52'],44,14,4),
  bark:S.hatch('#b8733a',['#8f5424','#d08f52','#7a4318'],40,14,4),
  sun:S.hatch('#ffe12e',['#ffd000','#fff27a','#ffc400'],30,10,3),
  red:S.hatch('#ff4a62',['#ff7488','#e02a48','#ff98a8'],24,10,2.5),
  pink:S.hatch('#ff86b4',['#ffaecd','#ff5f9a','#ffd0e2'],24,10,2.5),
  straw:S.hatch('#e8b84a',['#c99320','#f5d071','#b88218'],22,10,2.5),
  bunG:S.hatch('#d6bfa4',['#c2a684','#e8d6c0','#b8987a'],30,10,3),
  bunW:S.hatch('#fff7ee',['#f0e2d0','#ffffff','#e8d6c0'],30,9,3),
  bear:S.hatch('#b8763c',['#a0622c','#cc8a4e','#8e5424'],30,10,3),
  bearL:S.hatch('#dba468',['#c88c4c','#ecbc80','#be8040'],30,10,3),
  bird:S.hatch('#5aa8f0',['#7cc0ff','#3f8ede','#94ccff'],26,9,2.5),
  bird2:S.hatch('#ff8a4a',['#ffa66a','#f0702e','#ffbb88'],26,9,2.5),
  chick:S.hatch('#ffd93b',['#ffe97a','#ffc61a','#fff3a6'],26,9,2.5)};
 st.sky=sprite(0,0,W,H,c=>{c.fillStyle=vgrad(c,0,780,['#4fbefb','#84d4fd','#c4eefe','#fff3c8']);c.fillRect(0,0,W,H);
  rglow(c,250,200,580,'rgba(255,244,170,.9)');
  scrib(c,S,null,0,0,W,780,['#ffffff','#6cc6fb','#a8e2ff'],900,[24,60],[3,6],.16,[-.12,.04])});
 st.rays=sprite(-240,-240,480,480,c=>{for(let i=0;i<16;i++){const a=i/16*TAU+R(-.05,.05),r1=R(120,130),r2=R(178,222);c.strokeStyle=i%2?'#ffc400':'#ffd84a';c.lineWidth=R(10,14);c.lineCap='round';
  c.beginPath();c.moveTo(Math.cos(a)*r1,Math.sin(a)*r1);c.quadraticCurveTo(Math.cos(a+.06)*(r1+r2)/2,Math.sin(a+.06)*(r1+r2)/2,Math.cos(a)*r2,Math.sin(a)*r2);c.stroke()}});
 st.sun=sprite(-135,-135,270,270,c=>{dblob(c,S,0,0,106,100,P.sun,7,{jit:.03},0,'#e8a000');scrib(c,S,null,-60,-80,10,-20,['#fffbd0'],10,[14,28],[4,6],.6,[-.6,-.3]);
  eye(c,-34,-18,10);eye(c,34,-18,10);const m=new Path2D('M-38,12 Q0,62 38,12 Q0,28 -38,12 Z');ink(c,m,'#b0381c',5,'#6b2a12');blush(c,-62,16,16,'#ff8a3c',.65);blush(c,62,16,16,'#ff8a3c',.65)});
 st.clouds=[[420,110,1.0,170],[1180,80,1.2,210],[1680,240,.85,150],[820,320,.62,130],[120,390,.55,120]].map(([x,y,s,sec])=>({sp:cloudSp(S,340*s,130*s,'#ffffff','#5aa8e0','#bfe0fa'),x,y,sec,w:340*s}));
 st.birds=[{x:150,y:150,s:1.25,sec:80,ph:0},{x:880,y:250,s:.9,sec:95,ph:.4},{x:1450,y:110,s:1.4,sec:70,ph:.7}];
 // crown geometry (also used to place heart fruit)
 const cb=[[960,300,400,195],[650,385,210,150],[1270,375,215,150],[880,165,240,125],[1075,175,230,125],[770,480,195,105],[1150,480,195,105],[960,450,270,120]];
 const crown=cb.map(b=>S.blob(b[0],b[1],b[2],b[3],{bumps:8,amp:.16,jit:.02,n:80}));
 const tc=mk(W,H).getContext('2d');const inCrown=(x,y)=>crown.some(p=>tc.isPointInPath(p,x,y));
 st.land=sprite(0,0,W,H,c=>{
  const far=hillP([[-100,650],[180,605],[480,640],[820,600],[1180,635],[1500,590],[1780,625],[2020,605]]);
  ink(c,far,P.far,6,'#2f6e50');shade(c,far,585,780,['rgba(255,255,255,.4)','rgba(255,255,255,0)']);
  for(let i=0;i<20;i++){const x=R(-20,1940),y=R(645,700),s=R(.5,.9);stroke(c,[[x,y],[x,y-40*s]],'#6a4020',6*s);ink(c,S.blob(x,y-62*s,30*s,34*s,{bumps:5,amp:.2,jit:.03}),i%2?'#3f9a5c':'#5cb874',3.5,'#2a5a3a')}
  const mid=hillP([[-100,770],[260,715],[640,755],[1000,720],[1380,750],[1700,700],[2020,735]]);
  ink(c,mid,P.grassM,7);shade(c,mid,700,920,['rgba(255,255,190,.25)','rgba(0,50,0,.12)']);
  [[110,790,1],[560,790,.75],[1380,790,.85],[1840,780,1.1],[760,800,.55],[1190,800,.6]].forEach(([x,y,s])=>ink(c,S.blob(x,y-50*s,120*s,70*s,{bumps:6,amp:.3,jit:.02,n:70}),P.bush,6));
  for(let i=0;i<60;i++)tinyFlower(c,R(0,W),R(760,880),S.pick(['#ffffff','#ffe14a','#ff8fc8','#ff6a4a']),R(3,5));
  const gr=hillP([[-100,905],[380,875],[960,895],[1540,870],[2020,900]]);
  ink(c,gr,P.grassL,7);shade(c,gr,870,1080,['rgba(255,255,200,0)','rgba(30,90,0,.25)']);
  for(let i=0;i<170;i++)tuft(c,R(0,W),R(905,1078),R(.7,1.2),i%3?'#5ea81e':'#d6f56a');
  for(let i=0;i<50;i++)tinyFlower(c,R(0,W),R(910,1070),S.pick(['#ffffff','#ffe14a','#ff8fc8','#b48cff']),R(4,6));
  c.fillStyle='rgba(30,80,20,.25)';c.beginPath();c.ellipse(960,948,280,34,0,0,TAU);c.fill();
  const branch=(pts,w)=>{const p=new Path2D(sd(pts));c.lineCap='round';c.lineJoin='round';c.strokeStyle=INK;c.lineWidth=w+12;c.stroke(p);c.strokeStyle=P.bark;c.lineWidth=w;c.stroke(p)};
  branch([[935,650],[820,530],[690,450]],36);branch([[990,630],[1110,530],[1270,455]],36);
  const trunk=new Path2D('M832,952 C888,940 904,905 910,845 L916,560 L1004,560 L1010,845 C1016,905 1032,940 1088,952 Q960,970 832,952 Z');
  ink(c,trunk,P.bark,7);
  for(let i=0;i<9;i++){const x=R(928,992),y=R(600,900);c.strokeStyle='#6a3a14';c.lineWidth=3.5;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+R(-8,8),y+20,x+R(-4,4),y+R(36,60));c.stroke()}
  c.save();c.translate(960,770);ink(c,S.heartPath(30),P.red,5);c.restore();
  crown.forEach(p=>ink(c,p,null,18));crown.forEach(p=>{c.fillStyle=P.leafD;c.fill(p)});
  cb.forEach(b=>{c.fillStyle=P.leaf;c.fill(S.blob(b[0]-b[2]*.12,b[1]-b[3]*.18,b[2]*.78,b[3]*.68,{bumps:8,amp:.14,jit:.03,n:70}))});
  [0,1,3,4].forEach(k=>scrib(c,S,crown[k],cb[k][0]-cb[k][2],cb[k][1]-cb[k][3]*1.2,cb[k][0],cb[k][1],['#d4f87a','#eaffb0'],70,[10,22],[3,5],.45));
  for(let i=0,n=0;i<600&&n<55;i++){const x=R(480,1440),y=R(60,580);if(!inCrown(x,y))continue;n++;c.globalAlpha=.75;c.strokeStyle=INK;c.lineWidth=3.5;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+12,y-13,x+26,y);c.stroke();c.globalAlpha=1}
  branch([[1080,600],[1250,590],[1420,618],[1580,606]],24);
  c.fillStyle='#6e4410';c.beginPath();c.ellipse(1420,598,84,20,0,0,TAU);c.fill();
 });
 st.nestF=sprite(1320,560,200,110,c=>{const p=new Path2D('M1330,594 Q1420,622 1510,594 Q1506,650 1420,656 Q1334,650 1330,594 Z');ink(c,p,P.straw,5);
  for(let i=0;i<9;i++){const x=R(1345,1490),y=R(606,644);stroke(c,[[x,y],[x+R(14,26),y+R(-6,6)]],'#8a5a10',3)}});
 st.chickSp=sprite(-40,-70,80,80,c=>{dblob(c,S,0,-28,26,26,P.chick,4.5);stroke(c,[[-4,-52],[-9,-64]],INK,3);stroke(c,[[3,-53],[9,-63]],INK,3);eye(c,-10,-35,4.5);eye(c,10,-35,4.5);
  ink(c,new Path2D('M-11,-22 L0,-31 L11,-22 L0,-7 Z'),'#ff8a00',3);stroke(c,[[-10,-21],[10,-21]],INK,2.5);blush(c,-18,-24,5);blush(c,18,-24,5)});
 st.chicks=[1384,1420,1456].map((x,i)=>({x,y:614,ph:i/3}));
 const birdSp=(fill,belly,worm)=>sprite(-90,-112,180,124,c=>{
  ink(c,new Path2D('M28,-42 L76,-66 L70,-40 L82,-26 L30,-28 Z'),fill,4.5);
  stroke(c,[[-6,-14],[-9,0]],'#ff8a00',4.5);stroke(c,[[8,-14],[9,0]],'#ff8a00',4.5);
  dblob(c,S,4,-42,42,31,fill,5);ink(c,S.blob(-6,-34,24,17),belly,0);ink(c,rb(S,16,-46,24,13,.4),fill,4);stroke(c,[[4,-48],[26,-40]],INK,2.5);
  dblob(c,S,-32,-72,25,24,fill,5);ink(c,new Path2D('M-52,-79 L-74,-70 L-52,-62 Z'),'#ff9a1a',3.5);eye(c,-38,-77,5);blush(c,-30,-61,6);
  if(worm){c.strokeStyle='#ff6f9a';c.lineWidth=5;c.lineCap='round';c.beginPath();c.moveTo(-72,-70);c.quadraticCurveTo(-80,-58,-74,-50);c.quadraticCurveTo(-68,-42,-76,-34);c.stroke()}});
 st.mom=birdSp(P.bird,'#e6f4ff',true);
 st.dad=sprite(-90,-112,180,124,c=>{c.scale(-1,1);c.drawImage(birdSp(P.bird2,'#fff0e0',false).cv,-90,-112)});
 st.hearts=[];const hsp=[heartSp(S,50,P.red),heartSp(S,46,P.pink),heartSp(S,42,P.red),heartSp(S,38,P.pink)];
 const hang=hsp.map(h=>sprite(-70,-6,140,130,c=>{stroke(c,[[0,0],[2,16]],'#2f6a1e',4);ink(c,rb(S,10,6,10,4,-.5),'#58c23a',2.5);c.drawImage(h.cv,h.x0,h.y0+44)}));
 for(let t=0;t<3000&&st.hearts.length<19;t++){const x=R(500,1420),y=R(90,500);if(!inCrown(x,y)||!inCrown(x,y+60))continue;if(Math.hypot(x-1420,y-600)<160)continue;
  if(st.hearts.some(h=>Math.hypot(h.x-x,h.y-y)<118))continue;st.hearts.push({x,y,sp:hang[st.hearts.length%4],sec:R(3.5,5.5),ph:R(0,1)})}
 st.petR=heartSp(S,13,P.red,3);st.petP=heartSp(S,12,P.pink,3);
 st.petals=[];for(let i=0;i<14;i++)st.petals.push({x:R(560,1380),y0:R(430,560),sec:R(24,36),ph:i/14,sp:i%2?st.petR:st.petP,drift:R(30,70),rs:R(0,TAU)});
 st.fam=[
  {sp:critterSp(S,{kind:'bunny',s:1.12,fill:P.bunG,belly:'#f6eadb',inner:'#ffb3c4',tie:'#3f7ee8'}),x:205,y:952,ph:0},
  {sp:critterSp(S,{kind:'bunny',s:1.02,fill:P.bunW,belly:'#ffffff',inner:'#ffb3c4',bow:'#ff5a8a'}),x:378,y:946,ph:.5},
  {sp:critterSp(S,{kind:'bunny',s:.56,fill:P.bunW,belly:'#ffffff',inner:'#ffb3c4'}),x:292,y:1022,mode:'hop',ph:0},
  {sp:critterSp(S,{kind:'bunny',s:.5,fill:P.bunG,belly:'#f6eadb',inner:'#ffb3c4',bow:'#ffd23a'}),x:478,y:1026,mode:'hop',ph:.5,sec:2.1},
  {sp:critterSp(S,{kind:'bear',s:1.22,fill:P.bear,belly:'#f0cc96',inner:'#e8a0a0',tie:'#2fae5a'}),x:1728,y:952,ph:.2},
  {sp:critterSp(S,{kind:'bear',s:1.1,fill:P.bearL,belly:'#f6dcae',inner:'#e8a0a0',bow:'#ff5a8a'}),x:1556,y:946,ph:.7},
  {sp:critterSp(S,{kind:'bear',s:.6,fill:P.bearL,belly:'#f6dcae',inner:'#e8a0a0'}),x:1646,y:1024,mode:'hop',ph:.3,sec:1.9}].sort((a,b)=>a.y-b.y);
 st.loveSp=heartSp(S,32,P.red,4);
 const fsp=[flowerSp(S,0,'#ffffff',80),flowerSp(S,1,'#ff4a5a',70),flowerSp(S,2,'#ff8fc8',90),flowerSp(S,3,'#ffd21a',75),flowerSp(S,0,'#ffb3e0',65),flowerSp(S,2,'#ff7a2a',85),flowerSp(S,1,'#b48cff',72),flowerSp(S,3,'#ff5a8a',80)];
 st.flowers=[];for(let i=0;i<34;i++){const x=(i+R(.1,.9))/34*W;const near=[292,478,1646].some(b=>Math.abs(b-x)<70);st.flowers.push({sp:fsp[i%fsp.length],x,y:near?R(1062,1080):R(1000,1080),sec:R(3,5),ph:R(0,1)})}st.flowers.sort((a,b)=>a.y-b.y);
 st.bfly=[[640,700,'#ff7ab8','#ffd0e6',22],[1300,690,'#ffd23a','#fff0a0',26],[110,560,'#9b7bff','#d2c4ff',30],[1810,590,'#ff8a3a','#ffd23a',24]].map((b,i)=>({x:b[0],y:b[1],sp:wingSp(S,b[2],b[3]),sec:b[4],ph:i*.27}));
},
draw(S){const c=S.ctx,st=S.state;
 blit(c,st.sky,0,0);
 blit(c,st.rays,250,200,S.p*TAU*S.cycles(70));
 blit(c,st.sun,250,200,.04*S.osc(9),1+.03*S.osc(5));
 st.clouds.forEach((k,i)=>blit(c,k.sp,S.wrap(k.x,k.sec,W,k.w*.85),k.y+6*S.osc(17,i/5)));
 st.birds.forEach(b=>vbird(c,S.wrap(b.x,b.sec,W,60),b.y+20*S.osc(13,b.ph),b.s,S.osc01(.8,b.ph)));
 blit(c,st.land,0,0);
 st.chicks.forEach(k=>blit(c,st.chickSp,k.x,k.y-13*Math.max(0,S.osc(1.8,k.ph)),.12*S.osc(3.6,k.ph)));
 blit(c,st.nestF,0,0);
 blit(c,st.dad,1290,610,.05*S.osc(5,.3));
 blit(c,st.mom,1540,606,-.16*Math.max(0,S.osc(3.4)));
 st.hearts.forEach(h=>blit(c,h.sp,h.x,h.y,.13*S.osc(h.sec,h.ph),1+.03*S.osc(2.6,h.ph)));
 st.flowers.forEach(f=>{if(f.y<1040)blit(c,f.sp,f.x,f.y,.09*S.osc(f.sec,f.ph))});
 st.fam.forEach(f=>drawCritter(c,S,f));
 rising(c,S,st.loveSp,292,690,6,0);rising(c,S,st.loveSp,1642,640,6,.5);
 st.flowers.forEach(f=>{if(f.y>=1040)blit(c,f.sp,f.x,f.y,.09*S.osc(f.sec,f.ph))});
 st.bfly.forEach(b=>{const x=b.x+130*S.osc(b.sec,b.ph),y=b.y+50*S.osc(b.sec/2,b.ph);blit(c,b.sp,x,y,.15*S.osc(b.sec,b.ph+.25),.3+.7*Math.abs(S.osc(1.4,b.ph)),1)});
 st.petals.forEach(p=>{const t=S.saw(p.sec,p.ph),a=Math.min(1,t/.08,(1-t)/.15);blit(c,p.sp,p.x+Math.sin(t*TAU*1.5+p.rs)*p.drift,p.y0+t*(1060-p.y0),.5*Math.sin(t*TAU*2+p.rs),1,1,a)});
}});

/* =====================================================================
   2. HOME SWEET HOME - golden sunset at the family cottage
   ===================================================================== */
BIS.scene('ps2-2',{title:'Home Sweet Home',
blurb:'A cosy cottage at sunset with a cat family in the glowing windows, heart-shaped chimney smoke, a kitten on a tree swing, a dog family and fireflies.',
setup(S){const st=S.state,R=S.R;
 const P={
  wall:S.hatch('#fff0d6',['#f5dcb4','#fff8ea','#ecd0a4'],40,10,3),
  roof:S.hatch('#e8503a',['#ff7058','#c83a28','#ff8a6a'],40,12,4),
  brick:S.hatch('#c8553a',['#e06a4a','#a8402a','#d87858'],30,10,3),
  wood:S.hatch('#b8733a',['#8f5424','#d08f52','#a0602c'],34,12,3),
  far:S.hatch('#a685c4',['#b99ad6','#9370b4','#c4a8e0'],60,10,4),
  mid:S.hatch('#7aa84e',['#8fbe5e','#64903e','#a2cc6a'],50,12,4),
  ground:S.hatch('#4f9a3e',['#5fae4a','#3e8030','#70bc58'],56,14,4),
  tree:S.hatch('#3f9a52',['#56b066','#2f7e40','#68c078'],44,14,4),
  treeL:S.hatch('#62b84e',['#82cc62','#4ea23c','#96d872'],44,14,4),
  sun:S.hatch('#ffb03a',['#ffc65a','#ff9a2a','#ffd87a'],34,10,4),
  moon:S.hatch('#fff4c2',['#ffe89a','#fffbe0','#f6e2a0'],30,10,3),
  path:S.hatch('#ecd2a8',['#dcbc8c','#f6e2c2','#d0ac78'],40,10,3),
  catG:S.hatch('#a4acbc',['#8e96a8','#b8c0ce','#9aa2b4'],28,10,3),
  catO:S.hatch('#ffb050',['#ff9a30','#ffc878','#f09030'],28,10,3),
  catW:S.hatch('#fff7ee',['#f0e2d0','#ffffff','#e8d6c0'],28,9,3),
  catY:S.hatch('#ffd27a',['#ffc050','#ffe2a0','#f0b850'],28,10,3),
  catS:S.hatch('#dcdce6',['#c8c8d4','#ececf4','#bcbccc'],28,10,3),
  dog:S.hatch('#e8c08a',['#d8a868','#f4d4a6','#cc9a5a'],28,10,3),
  pup:S.hatch('#fffaf2',['#f2e6d6','#ffffff','#ead8c4'],28,9,3),
  blue:S.hatch('#5aa0f0',['#78b8ff','#3f86d8','#90c8ff'],26,10,3),
  pinkC:S.hatch('#ff86b4',['#ffaecd','#ff5f9a','#ffd0e2'],26,10,3),
  yel:S.hatch('#ffd84a',['#ffe67a','#f5c020','#fff0a0'],26,10,3),
  grn:S.hatch('#7ad65a',['#9ae678','#5cbc3c','#b0f090'],26,10,3),
  redC:S.hatch('#ff5a4a',['#ff7a6a','#e03a2a','#ff9a8a'],22,9,3),
  dh:S.hatch('#6a9ef0',['#88b4ff','#4f84d8','#9cc4ff'],30,10,3)};
 st.sky=sprite(0,0,W,H,c=>{c.fillStyle=vgrad(c,0,800,['#33286e','#5e3f98','#a9579f','#f2808e','#ffb36a','#ffe0a0']);c.fillRect(0,0,W,H);
  rglow(c,1500,690,700,'rgba(255,214,130,.9)');rglow(c,1420,150,300,'rgba(255,246,200,.45)');
  scrib(c,S,null,0,0,W,800,['#ffffff','#ffd0e0','#c8a8ff'],900,[24,60],[3,6],.13,[-.1,.04]);
  dblob(c,S,1500,690,150,146,P.sun,7,{jit:.02},0,'#e07a20');scrib(c,S,null,1400,560,1600,640,['#fff2b0'],20,[30,60],[5,8],.55,[-.05,.05])});
 st.moon=sprite(-110,-110,220,220,c=>{dblob(c,S,0,0,80,78,P.moon,6,{jit:.025},0,'#c8a040');
  [[-30,-38,10],[34,-28,7],[22,44,9]].forEach(([x,y,r])=>ink(c,S.blob(x,y,r,r*.8),'#f2dc96',2,'#d6b860'));
  sleepEye(c,-26,-6,11,5);sleepEye(c,26,-6,11,5);smile(c,0,16,16,4.5);blush(c,-44,18,11);blush(c,44,18,11)});
 const starSp=[10,14,19].map(r=>sprite(-r*1.6,-r*1.6,r*3.2,r*3.2,c=>ink(c,S.starPath(r,r*.45),'#fff2a0',2.5,'#d8a838')));
 st.stars=[];for(let t=0;t<800&&st.stars.length<44;t++){const x=R(30,1890),y=R(20,400-Math.abs(x-960)*.05);if(Math.hypot(x-1420,y-150)<150)continue;
  if(st.stars.some(s=>Math.hypot(s.x-x,s.y-y)<80))continue;st.stars.push({x,y,sp:starSp[S.RI(0,2)],sec:R(3,6),ph:R(0,1)})}
 st.clouds=[[500,130,1.05,230],[1050,60,.9,200],[1750,280,.7,180],[900,300,.55,160]].map(([x,y,s,sec])=>({sp:cloudSp(S,420*s,120*s,'#ffbfd2','#8a4a8a','#e88aaf'),x,y,sec,w:420*s}));
 st.birds=[{x:300,y:240,s:.9,sec:100,ph:0},{x:360,y:270,s:.7,sec:100,ph:.3},{x:1200,y:200,s:1.1,sec:85,ph:.6}];
 const P0=[1225,520],PC=[1500,610],P1=[1790,470];const onLine=t=>[(1-t)*(1-t)*P0[0]+2*(1-t)*t*PC[0]+t*t*P1[0],(1-t)*(1-t)*P0[1]+2*(1-t)*t*PC[1]+t*t*P1[1]];
 const pathP=new Path2D('M905,834 L1015,834 C1030,920 1090,990 1150,1090 L770,1090 C830,990 890,920 905,834 Z');
 st.land=sprite(0,0,W,H,c=>{
  const far=hillP([[-100,660],[200,630],[520,668],[880,628],[1240,664],[1560,640],[1820,664],[2020,646]]);
  ink(c,far,P.far,6,'#5a3a78');shade(c,far,620,800,['rgba(255,200,170,.25)','rgba(60,30,90,.2)']);
  for(let i=0;i<12;i++){const x=120+i*150+R(-40,40),y=R(668,700),s=R(.7,1.1);const b=wrect(S,x-20*s,y-30*s,x+20*s,y,1);ink(c,b,'#6a4a8a',3,'#3a2458');
   ink(c,new Path2D(`M${x-26*s},${y-28*s} L${x},${y-50*s} L${x+26*s},${y-28*s} Z`),'#8a3a5a',3,'#3a2458');c.fillStyle='#ffe07a';c.fillRect(x-7*s,y-22*s,12*s,11*s);rglow(c,x,y-16*s,26*s,'rgba(255,224,122,.5)')}
  const mid=hillP([[-100,780],[300,735],[700,770],[1100,736],[1500,766],[1800,724],[2020,750]]);
  ink(c,mid,P.mid,7,'#2e4a2a');shade(c,mid,720,900,['rgba(255,190,90,.25)','rgba(40,30,80,.18)']);
  c.save();c.globalAlpha=.75;c.strokeStyle='#ffd77a';c.lineWidth=7;c.translate(0,6);c.stroke(new Path2D(sd([[-100,780],[300,735],[700,770],[1100,736],[1500,766],[1800,724],[2020,750]])));c.restore();
  const gr=hillP([[-100,895],[400,872],[960,885],[1500,870],[2020,892]]);
  ink(c,gr,P.ground,7,'#1f3a1a');shade(c,gr,860,1080,['rgba(255,190,90,.18)','rgba(30,20,70,.25)']);
  for(let i=0;i<120;i++)tuft(c,R(0,W),R(890,1000),R(.7,1.1),i%3?'#3e7a2e':'#a8d870');
  ink(c,pathP,P.path,5,'#5a3a20');for(let i=0;i<16;i++){const y=R(850,1070),hw=55+(y-834)*.42;ink(c,S.blob(960+R(-hw*.6,hw*.6),y,R(16,26),R(8,12)),'#d4b088',2.5,'#8a6a48')}
  // big tree (left)
  ink(c,new Path2D('M282,900 C312,880 318,820 318,760 L326,470 L392,470 L398,760 C398,820 404,880 436,900 Q360,914 282,900 Z'),P.wood,7);
  const br=new Path2D(sd([[380,600],[500,566],[660,556]]));c.lineCap='round';c.strokeStyle=INK;c.lineWidth=40;c.stroke(br);c.strokeStyle=P.wood;c.lineWidth=28;c.stroke(br);
  const tb=[[350,330,230,160],[210,420,150,105],[490,410,160,110],[300,210,170,110],[440,240,150,100],[350,480,190,90]];
  const tp=tb.map(b=>S.blob(b[0],b[1],b[2],b[3],{bumps:8,amp:.16,jit:.02,n:80}));tp.forEach(p=>ink(c,p,null,18));tp.forEach(p=>{c.fillStyle=P.tree;c.fill(p)});
  tb.forEach(b=>{c.fillStyle=P.treeL;c.fill(S.blob(b[0]+b[2]*.1,b[1]-b[3]*.16,b[2]*.76,b[3]*.66,{bumps:8,amp:.14,jit:.03,n:70}))});
  tb.forEach((b,k)=>scrib(c,S,tp[k],b[0]+b[2]*.3,b[1]-b[3]*1.2,b[0]+b[2]*1.2,b[1]+b[3],['#ffc86a','#ffe09a'],40,[10,22],[3,5],.55));
  tp.forEach(p=>shade(c,p,40,600,['rgba(70,40,130,.22)','rgba(70,40,130,0)']));
  for(let i=0,n=0;i<400&&n<30;i++){const x=R(80,640),y=R(110,560);if(!tp.some(p=>c.isPointInPath(p,x,y)))continue;n++;c.globalAlpha=.7;c.strokeStyle=INK;c.lineWidth=3.5;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+12,y-13,x+26,y);c.stroke();c.globalAlpha=1}
  for(let i=0;i<5;i++){const x=R(180,560),y=R(260,520);if(tp.some(p=>c.isPointInPath(p,x,y)))ink(c,S.blob(x,y,12,12),'#ff5a4a',3)}
  // house
  ink(c,wrect(S,1110,210,1178,380),P.brick,6);ink(c,wrect(S,1098,196,1190,228),P.brick,6);
  const wall=wrect(S,700,430,1220,834,2);ink(c,wall,P.wall,7);
  c.save();c.clip(wall);const hg=c.createLinearGradient(700,0,1220,0);hg.addColorStop(0,'rgba(90,60,140,.22)');hg.addColorStop(.6,'rgba(255,170,90,0)');hg.addColorStop(1,'rgba(255,160,80,.22)');c.fillStyle=hg;c.fillRect(700,430,520,410);
  for(let i=0;i<26;i++){const x=R(715,1190),y=R(450,820);c.strokeStyle='#e2b888';c.lineWidth=3;c.strokeRect(x,y,30,14)}c.restore();
  [[735,480,885,620],[1035,480,1185,620]].forEach(([a,b,d,e])=>{rglow(c,(a+d)/2,(b+e)/2,150,'rgba(255,220,120,.45)');const p=wrect(S,a,b,d,e,1.5);c.fillStyle=vgrad(c,b,e,['#fff2b0','#ffc860']);c.fill(p)});
  rglow(c,960,340,90,'rgba(255,220,120,.4)');
  const roof=new Path2D('M630,462 L960,160 L1290,462 Q960,476 630,462 Z');ink(c,roof,P.roof,8);
  c.save();c.clip(roof);c.strokeStyle='#a8301e';c.lineWidth=3.5;c.globalAlpha=.6;for(let y=210,r=0;y<470;y+=34,r++)for(let x=600+(r%2)*22;x<1320;x+=44){c.beginPath();c.arc(x,y,22,.1,PI-.1);c.stroke()}c.restore();
  stroke(c,[[630,462],[960,476],[1290,462]],'#fff0d6',10);stroke(c,[[630,462],[960,160],[1290,462]],INK,8);
  const att=new Path2D();att.arc(960,340,54,0,TAU);c.fillStyle=vgrad(c,286,394,['#fff2b0','#ffc860']);c.fill(att);
  const door=new Path2D('M905,834 L905,712 Q960,652 1015,712 L1015,834 Z');ink(c,door,P.wood,6);stroke(c,[[960,680],[960,834]],'#7a4318',3);
  c.save();c.translate(960,722);ink(c,S.heartPath(17),'#ffe07a',3.5);c.restore();const kn=new Path2D();kn.arc(995,780,6,0,TAU);ink(c,kn,'#ffd23a',3);
  ink(c,wrect(S,890,830,1030,846,1),'#c8b8a8',4);
  // lantern
  stroke(c,[[1046,700],[1046,686]],INK,4);ink(c,wrect(S,1032,700,1060,736,1),'#ffe07a',4);
  // clothesline + pole
  ink(c,wrect(S,1780,452,1800,900,1.5),P.wood,5);ink(c,wrect(S,1750,452,1830,466,1),P.wood,4);
  c.strokeStyle=INK;c.lineWidth=3.5;c.beginPath();c.moveTo(P0[0],P0[1]);c.quadraticCurveTo(PC[0],PC[1],P1[0],P1[1]);c.stroke();
  // doghouse
  ink(c,wrect(S,1570,760,1740,906,2),P.dh,6);ink(c,new Path2D('M1548,770 L1655,690 L1762,770 Z'),P.roof,6);
  ink(c,new Path2D('M1620,906 L1620,830 Q1655,792 1690,830 L1690,906 Z'),'#2a2240',5);c.save();c.translate(1655,744);ink(c,S.heartPath(14),'#ff5a8a',3);c.restore();
  ink(c,S.blob(1520,900,34,10),'#9aa2b0',4);for(let i=0;i<60;i++)tinyFlower(c,R(0,W),R(800,880),S.pick(['#ffffff','#ffe14a','#ff8fc8','#c8a0ff']),R(3,4.5));
 });
 // window frames, curtains, flower boxes (drawn over the cats)
 st.front=sprite(0,0,W,H,c=>{
  [[735,480,885,620],[1035,480,1185,620]].forEach(([a,b,d,e])=>{ink(c,wrect(S,a,b,d,e,1.5),null,7);
   [[a,1],[d,-1]].forEach(([x,dd])=>ink(c,new Path2D(`M${x},${b} L${x+dd*44},${b} Q${x+dd*20},${b+60} ${x+dd*30},${e-30} L${x},${e-20} Z`),P.pinkC,4));
   ink(c,wrect(S,a-10,b-6,d+10,b+8,1),'#ff86b4',4);
   ink(c,wrect(S,a-14,e,d+14,e+30,1.5),P.wood,5);
   for(let i=0;i<6;i++)ink(c,S.blob(a+i*(d-a)/5,e-6,13,12,{bumps:5,amp:.4}),S.pick(['#ff5a8a','#ffd23a','#ffffff','#ff8a3a']),3)});
  const ring=new Path2D();ring.arc(960,340,54,0,TAU);ink(c,ring,null,9);ink(c,ring,null,4,'#fff0d6');
  // fence + front grass strip
  const fg=hillP([[-100,985],[500,978],[960,990],[1400,975],[2020,985]]);ink(c,fg,P.ground,6,'#1f3a1a');shade(c,fg,970,1080,['rgba(255,190,90,.12)','rgba(20,15,60,.3)']);
  c.save();c.clip(new Path2D('M0,960 L1920,960 L1920,1080 L0,1080 Z'));ink(c,pathP,P.path,5,'#5a3a20');c.restore();
  for(let i=0;i<40;i++)tuft(c,R(0,W),R(1000,1078),R(.9,1.3),i%2?'#3e7a2e':'#8ac85a');
  const posts=[];for(let x=-20;x<1950;x+=62)if(x<830||x>1080)posts.push(x);
  [[-20,820],[1090,1950]].forEach(([a,b])=>{ink(c,wrect(S,a,926,b,942,1.5),'#ffe6c8',4);ink(c,wrect(S,a,962,b,978,1.5),'#ffe6c8',4)});
  posts.forEach(x=>{const y=R(-3,3);ink(c,new Path2D(`M${x-14},1000 L${x-14},${912+y} L${x},${892+y} L${x+14},${912+y} L${x+14},1000 Z`),'#fff1dc',4.5);stroke(c,[[x-5,930],[x-5,980]],'#e8cfa8',3)});
 });
 st.cats=[
  {sp:critterSp(S,{kind:'cat',s:.62,fill:P.catG,belly:'#eef0f4',inner:'#ffb3c4',tie:'#3f7ee8'}),x:776,y:648,rot:.1,ph:0,win:0},
  {sp:critterSp(S,{kind:'cat',s:.6,fill:P.catO,belly:'#fff0d6',inner:'#ffb3c4',bow:'#ff4a8a'}),x:846,y:650,rot:-.1,ph:.5,win:0},
  {sp:critterSp(S,{kind:'cat',s:.48,fill:P.catW,belly:'#ffffff',inner:'#ffb3c4',patch:'#ffb050'}),x:1080,y:640,rot:.06,ph:.2,win:1},
  {sp:critterSp(S,{kind:'cat',s:.46,fill:P.catY,belly:'#fff4d8',inner:'#ffb3c4',bow:'#7ad65a'}),x:1145,y:644,rot:-.06,ph:.7,win:1},
  {sp:critterSp(S,{kind:'cat',s:.48,fill:P.catS,belly:'#ffffff',inner:'#ffb3c4',glasses:true}),x:960,y:430,rot:0,ph:.35,win:2}];
 st.wins=[wrect(S,737,482,883,618,0),wrect(S,1037,482,1183,618,0),(()=>{const p=new Path2D();p.arc(960,340,52,0,TAU);return p})()];
 st.kitten=critterSp(S,{kind:'cat',s:.5,fill:P.catO,belly:'#fff0d6',inner:'#ffb3c4',bow:'#ff4a8a'});
 st.swing=sprite(-80,-10,160,300,c=>{stroke(c,[[-34,0],[-48,268]],'#5a3a20',4);stroke(c,[[34,0],[48,268]],'#5a3a20',4);ink(c,wrect(S,-64,262,64,280,1),P.wood,4.5)});
 st.dogs=[{sp:critterSp(S,{kind:'dog',s:.95,fill:P.dog,belly:'#fff4e0',ear:'#a8703a',bow:'#ff5a8a'}),x:1360,y:905,ph:.1},
  {sp:critterSp(S,{kind:'dog',s:.57,fill:P.pup,belly:'#ffffff',ear:'#c8884a',patch:'#e8c08a'}),x:1470,y:925,mode:'hop',ph:.4,sec:1.8}];
 const shirt=(w,f)=>sprite(-w*.8,-10,w*1.6,w*1.1,c=>{ink(c,new Path2D(`M${-w*.5},0 L${-w*.2},0 Q0,${w*.16} ${w*.2},0 L${w*.5},0 L${w*.72},${w*.3} L${w*.5},${w*.42} L${w*.44},${w*.95} L${-w*.44},${w*.95} L${-w*.5},${w*.42} L${-w*.72},${w*.3} Z`),f,4.5);
  c.save();c.translate(0,w*.55);ink(c,S.heartPath(w*.13),'#ff4a62',2.5);c.restore();[-.32,.32].forEach(k=>ink(c,wrect(S,w*k-4,-8,w*k+4,10,.5),'#ffe07a',2.5))});
 const dress=(w,f)=>sprite(-w*.8,-10,w*1.6,w*1.3,c=>{ink(c,new Path2D(`M${-w*.3},0 L${w*.3},0 L${w*.32},${w*.36} L${w*.62},${w*1.12} Q0,${w*1.2} ${-w*.62},${w*1.12} L${-w*.32},${w*.36} Z`),f,4.5);
  c.fillStyle='#fff';for(let i=0;i<9;i++){c.beginPath();c.arc(R(-w*.4,w*.4),R(w*.45,w*1.05),4,0,TAU);c.fill()}[-.2,.2].forEach(k=>ink(c,wrect(S,w*k-4,-8,w*k+4,10,.5),'#ffe07a',2.5))});
 const socks=f=>sprite(-50,-10,100,90,c=>{[-18,18].forEach(x=>{ink(c,new Path2D(`M${x-9},0 L${x+9},0 L${x+9},44 Q${x+24},48 ${x+20},62 L${x-6},62 Q${x-11},60 ${x-9},44 Z`),f,3.5);ink(c,wrect(S,x-4,-8,x+4,6,.5),'#ffe07a',2)})});
 st.clothes=[[.13,shirt(130,P.blue)],[.33,dress(105,P.pinkC)],[.53,shirt(84,P.yel)],[.69,shirt(62,P.grn)],[.84,socks(P.redC)]].map(([t,sp],i)=>{const q=onLine(t);return{x:q[0],y:q[1],sp,ph:i*.21}});
 st.puffSp=heartSp(S,38,'#ffc4da',4.5,'#9a4a7a');
 st.ff=sprite(-30,-30,60,60,c=>{rglow(c,0,0,30,'rgba(255,250,160,.9)');c.fillStyle='#fffbd0';c.beginPath();c.arc(0,0,4,0,TAU);c.fill()});
 st.lamp=sprite(-120,-120,240,240,c=>rglow(c,0,0,120,'rgba(255,220,120,.55)'));
 st.flies=[];for(let i=0;i<30;i++){const side=i%3;st.flies.push({x:side===0?R(40,640):side===1?R(1240,1880):R(640,1280),y:side===2?R(860,1060):R(560,1000),ax:R(30,80),ay:R(20,50),s1:R(9,15),s2:R(7,12),ph:R(0,1),tw:R(2.5,4.5)})}
 const fsp=[flowerSp(S,2,'#ff8fc8',62),flowerSp(S,0,'#ffffff',58),flowerSp(S,3,'#c8a0ff',66),flowerSp(S,1,'#ff5a4a',56),flowerSp(S,2,'#ffd23a',60)];
 st.flowers=[];for(let i=0;i<26;i++){let x=(i+R(.1,.9))/26*W;st.flowers.push({sp:fsp[i%fsp.length],x,y:R(1030,1080),sec:R(3,5),ph:R(0,1)})}st.flowers.sort((a,b)=>a.y-b.y);
},
draw(S){const c=S.ctx,st=S.state;
 blit(c,st.sky,0,0);
 st.stars.forEach(s=>{const k=S.osc01(s.sec,s.ph);blit(c,s.sp,s.x,s.y,.3*S.osc(s.sec*3,s.ph),.75+.35*k,.75+.35*k,.5+.5*k)});
 blit(c,st.moon,1420,150+6*S.osc(11),.06*S.osc(9,.2));
 st.clouds.forEach((k,i)=>blit(c,k.sp,S.wrap(k.x,k.sec,W,k.w*.85),k.y+5*S.osc(19,i/4)));
 st.birds.forEach(b=>vbird(c,S.wrap(b.x,b.sec,W,60),b.y+18*S.osc(15,b.ph),b.s,S.osc01(.9,b.ph),'#3a2458'));
 blit(c,st.land,0,0);
 for(let k=0;k<5;k++){const t=S.saw(10,k/5),a=Math.min(1,t/.12,(1-t)/.45);blit(c,st.puffSp,1144+t*90+16*Math.sin(t*9+k),196-t*340,.2*Math.sin(t*TAU+k),.35+.8*t,.35+.8*t,a*.95)}
 st.cats.forEach(k=>{c.save();c.clip(st.wins[k.win]);blit(c,k.sp,k.x,k.y+4*S.osc(3.8,k.ph),k.rot+.07*S.osc(4.4,k.ph));c.restore()});
 blit(c,st.front,0,0);
 c.save();c.globalCompositeOperation='lighter';blit(c,st.lamp,1046,718,0,1,1,.55+.25*S.osc01(4));c.restore();
 st.clothes.forEach(k=>blit(c,k.sp,k.x,k.y,.07*S.osc(3.4,k.ph)));
 S.at(595,558,.17*S.osc(4.4),1,()=>{blit(c,st.swing,0,0);blit(c,st.kitten,0,264)});
 st.dogs.forEach(f=>drawCritter(c,S,f));
 st.flowers.forEach(f=>blit(c,f.sp,f.x,f.y,.09*S.osc(f.sec,f.ph)));
 c.save();c.globalCompositeOperation='lighter';st.flies.forEach(f=>blit(c,st.ff,f.x+f.ax*S.osc(f.s1,f.ph),f.y+f.ay*S.osc(f.s2,f.ph+.3),0,1,1,.25+.75*S.pulse(f.tw,f.ph,2)));c.restore();
}});

/* =====================================================================
   3. PENGUIN FAMILY - icy sea under a pastel rainbow
   ===================================================================== */
BIS.scene('ps2-3',{title:'Penguin Family',
blurb:'A penguin family hugging on an ice floe under a pastel rainbow, with a whale mum and baby blowing a heart and a seal family nearby in gently falling snow.',
setup(S){const st=S.state,R=S.R;
 const P={
  peng:S.hatch('#2c3350',['#3a4266','#22283e','#4a5378'],30,10,3),
  white:S.hatch('#ffffff',['#e6eef8','#f4f8ff'],30,8,3),
  chick:S.hatch('#b8bcca',['#c8ccd8','#a2a6b6','#d4d8e2'],26,12,3),
  iceT:S.hatch('#f4faff',['#dcecfa','#ffffff','#cfe4f6'],50,10,4),
  iceS:S.hatch('#8cc4ec',['#a8d4f2','#70aee0','#b8e0f8'],44,12,4),
  mtn:S.hatch('#a6c6ec',['#bcd6f4','#8eb2e0','#cde0f8'],50,12,4),
  mtnF:S.hatch('#cfe0f6',['#dde9fa','#bccff0'],60,8,4),
  whale:S.hatch('#4a8fdc',['#5ea2ec','#3a7cc8','#74b4f4'],34,12,4),
  whaleB:S.hatch('#86c4f4',['#9ad2fa','#70b0e8','#b0dcfc'],30,12,3),
  seal:S.hatch('#8e9aae',['#a0aabc','#7a8698','#b0bac8'],30,10,3),
  pup:S.hatch('#f8f8fc',['#e6e8f0','#ffffff'],26,8,3),
  sun:S.hatch('#fff0a0',['#ffe680','#fff8cc','#ffdc60'],30,10,3),
  red:S.hatch('#ff4a62',['#ff7488','#e02a48','#ff98a8'],24,10,2.5),
  pink:S.hatch('#ff86b4',['#ffaecd','#ff5f9a','#ffd0e2'],24,10,2.5),
  fish:S.hatch('#ff9a3a',['#ffb460','#f07a20'],20,8,2.5)};
 const HZ=640;st.HZ=HZ;
 st.sky=sprite(0,0,W,H,c=>{c.fillStyle=vgrad(c,0,HZ,['#6ec3f0','#a6dcf7','#d9effa','#fde2ee']);c.fillRect(0,0,W,H);
  const cx=960,cy=840,cols=['#ff8fa3','#ffb36b','#ffe37a','#9be38a','#7cc8f5','#b59cf0'];
  cols.forEach((col,i)=>{const r=760-12-i*24;c.strokeStyle=col;c.lineWidth=25;c.beginPath();c.arc(cx,cy,r,PI,TAU);c.stroke()});
  const ring=new Path2D();ring.arc(cx,cy,760,PI,TAU);ring.arc(cx,cy,616,TAU,PI,true);ring.closePath();
  scrib(c,S,ring,200,60,1720,HZ,['#ffffff'],700,[14,30],[3,5],.35,[-.4,.4]);c.save();c.globalAlpha=.6;ink(c,ring,null,4,'#7a6aa8');c.restore();
  rglow(c,220,170,380,'rgba(255,248,200,.8)');
  scrib(c,S,null,0,0,W,HZ,['#ffffff','#b8e4fb'],700,[24,60],[3,6],.15,[-.1,.04])});
 st.rays=sprite(-180,-180,360,360,c=>{for(let i=0;i<12;i++){const a=i/12*TAU,r1=R(88,96),r2=R(130,160);stroke(c,[[Math.cos(a)*r1,Math.sin(a)*r1],[Math.cos(a+.04)*r2,Math.sin(a+.04)*r2]],i%2?'#ffe070':'#fff0a0',R(9,12))}});
 st.sun=sprite(-100,-100,200,200,c=>{dblob(c,S,0,0,76,74,P.sun,6,{jit:.03},0,'#e8b030');happyEye(c,-24,-6,11,5);happyEye(c,24,-6,11,5);smile(c,0,12,18,5);blush(c,-44,14,12,'#ffa0a0');blush(c,44,14,12,'#ffa0a0')});
 st.clouds=[[300,330,.8,150],[1000,120,1.0,190],[1650,300,.75,160],[1350,60,.55,130]].map(([x,y,s,sec])=>({sp:cloudSp(S,330*s,125*s,'#ffffff','#6aa8de','#d4e8fa'),x,y,sec,w:330*s}));
 st.land=sprite(0,0,W,H,c=>{
  const back=new Path2D(sd([[-100,HZ],[-20,520],[180,450],[360,540],[600,470],[760,520],[960,430],[1180,520],[1380,460],[1580,520],[1800,440],[2020,520],[2020,HZ]])+' Z');
  ink(c,back,P.mtnF,4,'#7aa4d4');
  const pk=[[-100,HZ],[60,500],[230,575],[420,410],[640,575],[840,470],[1040,590],[1230,440],[1420,570],[1600,400],[1790,540],[1930,470],[2020,560],[2020,HZ]];
  const m=new Path2D();pk.forEach((p,i)=>i?m.lineTo(p[0],p[1]):m.moveTo(p[0],p[1]));m.closePath();ink(c,m,P.mtn,6,'#3a6aa8');
  pk.forEach((p,i)=>{if(i===0||i===pk.length-1)return;const a=pk[i-1],b=pk[i+1];if(p[1]>a[1]||p[1]>b[1])return;const f=.32,lx=p[0]+(a[0]-p[0])*f,ly=p[1]+(a[1]-p[1])*f,rx=p[0]+(b[0]-p[0])*f,ry=p[1]+(b[1]-p[1])*f;
   ink(c,new Path2D(`M${p[0]},${p[1]} L${lx},${ly} L${lx+(rx-lx)*.3},${(ly+ry)/2-8} L${lx+(rx-lx)*.55},${(ly+ry)/2+10} L${lx+(rx-lx)*.8},${(ly+ry)/2-6} L${rx},${ry} Z`),'#ffffff',4,'#3a6aa8')});
  shade(c,m,380,HZ,['rgba(255,255,255,0)','rgba(253,226,238,.55)']);
  const sea=new Path2D(`M0,${HZ} L${W},${HZ} L${W},${H} L0,${H} Z`);c.fillStyle=vgrad(c,HZ,H,['#8fd4f6','#4fa8e6','#2f7fd0','#2462b0']);c.fill(sea);
  scrib(c,S,sea,0,HZ,W,H,['#ffffff','#bfe6ff','#1f5aa0'],900,[20,50],[3,5],.18,[-.04,.04]);
  stroke(c,[[0,HZ],[W,HZ]],'#2a5a98',5);
  [[140,1],[560,.7],[1460,.9],[1820,.6]].forEach(([x,s])=>{const p=new Path2D(`M${x-70*s},${HZ+2} L${x-40*s},${HZ-50*s} L${x-5*s},${HZ-40*s} L${x+20*s},${HZ-75*s} L${x+70*s},${HZ+2} Z`);ink(c,p,'#ffffff',4,'#3a6aa8');
   c.save();c.clip(p);c.fillStyle='rgba(120,180,230,.45)';c.fillRect(x,HZ-80*s,80*s,90*s);c.restore()});
  c.fillStyle='rgba(20,60,120,.25)';c.beginPath();c.ellipse(960,770,470,40,0,0,TAU);c.fill();c.beginPath();c.ellipse(1650,866,260,26,0,0,TAU);c.fill();
 });
 // wave rows
 st.waves=[[690,150,9,1,.5,3],[742,190,11,-1,.55,3.5],[905,210,12,1,.45,4],[985,240,14,-1,.5,4.5],[1050,260,16,1,.45,5]].map(([y,per,sec,dir,a,w])=>({y,per,sec,dir,
  sp:sprite(0,-20,W+2*per,40,c=>{c.globalAlpha=a;c.strokeStyle='#ffffff';c.lineWidth=w;c.lineCap='round';for(let x=0;x<W+2*per;x+=per){const o=S.R(-per*.2,per*.2);c.beginPath();c.moveTo(x+o,0);c.quadraticCurveTo(x+o+per*.18,-12,x+o+per*.36,0);c.quadraticCurveTo(x+o+per*.5,10,x+o+per*.62,-2);c.stroke()}})}));
 // main ice floe
 st.floe=sprite(480,560,960,260,c=>{const side=S.blob(960,700,440,92,{jit:.01,n:80});ink(c,side,P.iceS,6,'#2a5a98');
  for(let i=0;i<10;i++){const x=R(560,1360);stroke(c,[[x,722],[x+R(-10,10),R(745,772)]],'#5a90c8',3)}
  ink(c,S.blob(960,655,432,58,{jit:.012,n:80}),P.iceT,6,'#2a5a98');
  [[640,640,60,16],[1260,646,70,16],[1120,628,40,10]].forEach(b=>ink(c,S.blob(b[0],b[1],b[2],b[3]),'#ffffff',3.5,'#7aa4d4'))});
 st.floe2=sprite(1380,740,540,180,c=>{ink(c,S.blob(1650,830,250,56,{jit:.01}),P.iceS,6,'#2a5a98');ink(c,S.blob(1650,800,242,40,{jit:.015}),P.iceT,6,'#2a5a98')});
 const peng=k=>{const s=k.s;return sprite(-110*s,-290*s,220*s,300*s,c=>{c.scale(s,s);
  ink(c,rb(S,-26,-8,24,11,-.15),'#ff9a1a',4.5);ink(c,rb(S,26,-8,24,11,.15),'#ff9a1a',4.5);
  dblob(c,S,0,-112,78,108,P.peng,6);ink(c,S.blob(0,-86,54,78,{jit:.03}),P.white,3.5);
  ink(c,S.blob(-25,-174,19,19),'#ffffff',0);ink(c,S.blob(25,-174,19,19),'#ffffff',0);eye(c,-25,-174,8.5);eye(c,25,-174,8.5);
  ink(c,new Path2D('M-15,-158 L15,-158 L0,-136 Z'),'#ff9a1a',3.5);blush(c,-48,-150,12);blush(c,48,-150,12);
  if(k.scarf){ink(c,new Path2D('M-58,-136 Q0,-112 58,-136 L56,-118 Q0,-94 -56,-118 Z'),k.scarf,4);ink(c,new Path2D('M26,-118 L44,-118 L50,-62 L30,-66 Z'),k.scarf,4);stroke(c,[[33,-70],[34,-60]],INK,2.5);stroke(c,[[42,-70],[46,-60]],INK,2.5)}
  if(k.bow)bow(c,40,-206,1.2,k.bow)})};
 const flip=(s,f)=>sprite(-22*s,-6*s,44*s,118*s,c=>{c.scale(s,s);ink(c,rb(S,0,50,16,52),f,5)});
 st.pens=[{sp:peng({s:1.25,scarf:P.red}),fl:flip(1.25,P.peng),x:800,y:652,s:1.25,ph:0,wave:-1},
  {sp:peng({s:1.15,bow:'#ff7ab8'}),fl:flip(1.15,P.peng),x:1118,y:650,s:1.15,ph:.5,wave:1}];
 const chick=k=>sprite(-80,-170,160,180,c=>{ink(c,rb(S,-18,-6,16,8),'#555a6a',3.5);ink(c,rb(S,18,-6,16,8),'#555a6a',3.5);
  dblob(c,S,0,-56,48,52,P.chick,5,{bumps:12,amp:.06});ink(c,rb(S,-46,-62,12,26,.4,{bumps:6,amp:.1}),P.chick,4.5);ink(c,rb(S,46,-62,12,26,-.4,{bumps:6,amp:.1}),P.chick,4.5);
  dblob(c,S,0,-118,46,42,'#2c3350',5);ink(c,S.blob(0,-112,34,29),'#ffffff',0);eye(c,-13,-116,6.5);eye(c,13,-116,6.5);
  ink(c,new Path2D('M-6,-104 L6,-104 L0,-96 Z'),'#555a6a',2.5);blush(c,-25,-104,7);blush(c,25,-104,7);if(k)bow(c,26,-150,.7,k)});
 st.chicks=[{sp:chick(null),x:922,y:672,ph:0},{sp:chick('#ffd23a'),x:1012,y:676,ph:.5}];
 st.heartR=heartSp(S,40,P.red,4.5);st.heartP=heartSp(S,36,P.pink,4.5);
 // whales (local origin at waterline centre, facing right)
 const whale=(s,f)=>{const body=S.smooth([[230,-40],[196,-112],[100,-152],[-40,-142],[-160,-92],[-236,-40],[-250,8],[-160,44],[0,62],[160,52],[232,10]]);
  return{body:sprite(-270*s,-170*s,540*s,250*s,c=>{c.scale(s,s);ink(c,body,f,7);
   c.save();c.clip(body);ink(c,S.blob(40,40,190,50),'#d4ecfc',0);for(let i=0;i<6;i++)stroke(c,[[-60+i*40,8],[-50+i*40,50]],'#9cc8ec',3);c.restore();ink(c,body,null,7);
   eye(c,150,-58,9);smile(c,182,-42,16,4.5);blush(c,140,-34,13);ink(c,rb(S,40,-10,40,16,.4),f,5)}),
   tail:sprite(-120*s,-110*s,150*s,140*s,c=>{c.scale(s,s);ink(c,new Path2D('M10,0 Q-40,-10 -60,-60 Q-90,-80 -100,-60 Q-70,-40 -70,-16 Q-100,10 -96,30 Q-60,26 -40,6 Q-20,14 10,14 Z'),f,6)}),s}};
 st.whales=[{...whale(1,P.whale),x:370,y:872,ph:0},{...whale(.5,P.whaleB),x:250,y:1000,ph:.4}];
 st.spoutHeart=heartSp(S,30,P.pink,4,'#3a6aa8');
 // seals
 const seal=(s,f,dir)=>sprite(-150*s,-190*s,300*s,200*s,c=>{c.scale(s*dir,s);const parts=[rb(S,25,-40,100,40,-.12),S.blob(-62,-122,46,42),rb(S,-42,-78,40,48,.3)];
  parts.forEach(p=>ink(c,p,null,12));parts.forEach(p=>{c.fillStyle=f;c.fill(p)});
  ink(c,rb(S,120,-16,26,12,.5),f,5);ink(c,rb(S,118,-34,24,11,-.3),f,5);ink(c,rb(S,-30,-14,26,12,-.3),f,5);
  eye(c,-80,-130,8);eye(c,-46,-130,8);ink(c,new Path2D('M-70,-112 L-56,-112 L-63,-104 Z'),INK,2);arcS(c,-63,-104,8,.2*PI,.8*PI,3.5);
  c.fillStyle=INK;[[-82,-108],[-88,-102],[-44,-108],[-38,-102]].forEach(([x,y])=>{c.beginPath();c.arc(x,y,2,0,TAU);c.fill()});blush(c,-96,-112,9);blush(c,-30,-112,9)});
 st.seals=[{sp:seal(1,P.seal,-1),x:1585,y:808,ph:0},{sp:seal(.62,P.pup,1),x:1760,y:810,ph:.5}];
 // fish, sparkles, snow
 st.fishSp=sprite(-40,-24,80,48,c=>{ink(c,new Path2D('M-20,0 L-36,-14 L-34,14 Z'),P.fish,3.5);ink(c,S.blob(4,0,24,15),P.fish,4);eye(c,14,-4,3.5);stroke(c,[[0,-8],[0,8]],'#c05a10',2.5)});
 st.fish=[{x:1270,y:930,sec:12,ph:0},{x:620,y:1000,sec:15,ph:.5}];
 st.spark=sprite(-16,-16,32,32,c=>{c.fillStyle='#ffffff';c.beginPath();c.moveTo(0,-15);c.quadraticCurveTo(2,-2,15,0);c.quadraticCurveTo(2,2,0,15);c.quadraticCurveTo(-2,2,-15,0);c.quadraticCurveTo(-2,-2,0,-15);c.fill()});
 st.sparks=[];for(let i=0;i<26;i++)st.sparks.push({x:R(20,1900),y:R(660,1060),sec:R(3,6),ph:R(0,1),s:R(.6,1.1)});
 const flake=r=>sprite(-r-3,-r-3,2*r+6,2*r+6,c=>{c.strokeStyle='#ffffff';c.lineWidth=Math.max(2,r*.28);c.lineCap='round';c.beginPath();for(let i=0;i<3;i++){const a=i/3*PI;c.moveTo(Math.cos(a)*r,Math.sin(a)*r);c.lineTo(-Math.cos(a)*r,-Math.sin(a)*r)}c.stroke()});
 const fl=[flake(5),flake(7),flake(10)];
 st.snow=[];for(let i=0;i<110;i++)st.snow.push({x:R(0,W),y:R(0,H),sec:R(32,55),sp:fl[i%3],ph:R(0,1),sw:R(10,26)});
 st.fore=sprite(0,880,W,200,c=>{[[-10,1070,150,70],[1870,1056,260,84]].forEach(([x,y,rx,ry])=>{ink(c,S.blob(x,y+18,rx,ry,{jit:.02}),P.iceS,6,'#2a5a98');ink(c,S.blob(x,y-8,rx*.96,ry*.7,{jit:.02}),P.iceT,6,'#2a5a98')});
  [[30,1020,40],[1830,1000,40]].forEach(([x,y,r])=>ink(c,S.blob(x,y,r,r*.55,{bumps:4,amp:.2}),'#ffffff',4,'#7aa4d4'))});
},
draw(S){const c=S.ctx,st=S.state,HZ=st.HZ;
 blit(c,st.sky,0,0);
 blit(c,st.rays,220,170,S.p*TAU*S.cycles(60));blit(c,st.sun,220,170,.05*S.osc(8),1+.03*S.osc(5));
 st.clouds.forEach((k,i)=>blit(c,k.sp,S.wrap(k.x,k.sec,W,k.w*.85),k.y+6*S.osc(17,i/4)));
 blit(c,st.land,0,0);
 const wave=w=>blit(c,w.sp,-w.per+w.dir*S.saw(w.sec)*w.per,w.y);
 wave(st.waves[0]);wave(st.waves[1]);
 blit(c,st.floe2,0,4*S.osc(6,.3));
 st.seals.forEach(k=>blit(c,k.sp,k.x,k.y+4*S.osc(6,.3),.05*S.osc(3.6,k.ph)));
 const fb=5*S.osc(7);
 c.save();c.translate(0,fb);blit(c,st.floe,0,0);
 st.pens.forEach(p=>{const rot=.035*S.osc(3.4,p.ph)+(p.wave>0?-.03:.03);S.at(p.x,p.y,rot,1,()=>{const sx=70*p.s,sy=-148*p.s;
  blit(c,p.fl,-sx,sy,p.wave<0?.5+.35*S.osc01(2.6,p.ph):-.18);blit(c,p.fl,sx,sy,p.wave>0?-.5-.35*S.osc01(2.6,p.ph):.18);blit(c,p.sp,0,0)})});
 st.chicks.forEach(k=>{const h=Math.max(0,S.osc(1.9,k.ph));blit(c,k.sp,k.x,k.y-14*h,.06*S.osc(3,k.ph),1-.03*h,1+.04*h)});
 c.restore();
 for(let k=0;k<4;k++)rising(c,S,k%2?st.heartP:st.heartR,960+(k%2?50:-50),400+fb,8,k/4,240);
 // whales: above-water part solid, under-water part faint
 st.whales.forEach(wh=>{const bob=7*S.osc(5,wh.ph),rot=.025*S.osc(5,wh.ph+.25),s=wh.s;
  const paint=()=>S.at(wh.x,wh.y+bob,rot,1,()=>{blit(c,wh.tail,-232*s,-30*s,.18*S.osc(3.5,wh.ph));blit(c,wh.body,0,0)});
  c.save();c.beginPath();c.rect(0,0,W,wh.y);c.clip();paint();c.restore();
  c.save();c.beginPath();c.rect(0,wh.y,W,H);c.clip();c.globalAlpha=.42;paint();c.restore();
  c.save();c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=4;c.lineCap='round';for(let i=-1;i<=1;i+=2){const rx=(260+10*S.osc(2.5,wh.ph))*s;c.beginPath();c.ellipse(wh.x,wh.y+4,rx,12*s+4,0,i>0?.1:PI-.6,i>0?.6:PI-.1);c.stroke()}c.restore()});
 {const wh=st.whales[0],t=S.saw(10),bx=wh.x+90,by=wh.y-150+7*S.osc(5,wh.ph);if(t<.45){const k=Math.sin(t/.45*PI),h=170*k;c.save();c.strokeStyle='#e8f8ff';c.lineCap='round';
   for(let i=-2;i<=2;i++){c.lineWidth=7;c.globalAlpha=.9;c.beginPath();c.moveTo(bx,by);c.quadraticCurveTo(bx+i*16*k,by-h*.7,bx+i*34*k,by-h*(1-Math.abs(i)*.18));c.stroke()}c.restore();
   blit(c,st.spoutHeart,bx,by-h-22*k,.1*S.osc(2),.4+.7*k,.4+.7*k,Math.min(1,k*2))}}
 wave(st.waves[2]);wave(st.waves[3]);wave(st.waves[4]);
 st.fish.forEach(f=>{const t=S.saw(f.sec,f.ph);if(t>=.3)return;const u=t/.3,x=f.x+u*180,y=f.y-Math.sin(u*PI)*150,ang=Math.atan2(-Math.cos(u*PI)*150*PI,180);blit(c,st.fishSp,x,y,ang,1,1,Math.min(1,u/.08,(1-u)/.08))});
 st.sparks.forEach(s=>{const k=S.pulse(s.sec,s.ph,3);if(k>.02)blit(c,st.spark,s.x,s.y,0,s.s*(.3+.9*k),s.s*(.3+.9*k),k)});
 blit(c,st.fore,0,0);
 st.snow.forEach(f=>blit(c,f.sp,f.x+f.sw*S.osc(9,f.ph),S.wrap(f.y,f.sec,H,20),S.saw(12,f.ph)*TAU,1,1,.9));
}});
})();
