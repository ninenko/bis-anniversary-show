/* Grade 0 - Isn't She Lovely - crayon picture frames around the mums & children photo slideshow (round 2) */
(function(){
const W=1920,H=1080,TAU=Math.PI*2,INK='#1c1c1c';
const PX=380,PY=120,PW=1160,PH=660,PR=24,CX=PX+PW/2;   // photo window

/* ---------- helpers (work on any 2D context) ---------- */
function mk(w=W,h=H){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function ink(c,p,fill,w=6,col=INK){if(fill){c.fillStyle=fill;c.fill(p)}if(w){c.lineWidth=w;c.strokeStyle=col;c.lineJoin=c.lineCap='round';c.stroke(p)}}
function str(c,p,col,w){c.lineWidth=w;c.strokeStyle=col;c.lineJoin=c.lineCap='round';c.stroke(p)}
function dot(c,x,y,r,col=INK){c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,TAU);c.fill()}
function sm(pts){const n=pts.length,g=i=>pts[Math.max(0,Math.min(n-1,i))];let d=`M${pts[0][0]},${pts[0][1]}`;
  for(let i=0;i<n-1;i++){const p0=g(i-1),p1=g(i),p2=g(i+1),p3=g(i+2);
    d+=` C${p1[0]+(p2[0]-p0[0])/6},${p1[1]+(p2[1]-p0[1])/6} ${p2[0]-(p3[0]-p1[0])/6},${p2[1]-(p3[1]-p1[1])/6} ${p2[0]},${p2[1]}`}return d}
function hill(S,base,amp,freq,ph,x0=-120,x1=2040){const pts=[];for(let x=x0;x<=x1;x+=70)pts.push([x,base+amp*Math.sin(x*freq+ph)+amp*.45*Math.sin(x*freq*2.3+ph*1.7)+S.R(-3,3)]);
  return new Path2D(sm(pts)+` L${x1},1200 L${x0},1200 Z`)}
// random crayon strokes inside a clip region
function crayon(S,c,clip,x,y,w,h,cols,n,{len=[8,24],wid=[2,4.5],a=.3,ang=[-.65,-.25]}={}){c.save();if(clip)c.clip(clip);c.lineCap='round';
  for(let i=0;i<n;i++){const px=S.R(x,x+w),py=S.R(y,y+h),an=S.R(ang[0],ang[1]),l=S.R(len[0],len[1]);c.globalAlpha=a*S.R(.45,1);
    c.strokeStyle=cols[i%cols.length];c.lineWidth=S.R(wid[0],wid[1]);c.beginPath();c.moveTo(px,py);c.lineTo(px+Math.cos(an)*l,py+Math.sin(an)*l);c.stroke()}c.restore()}
function rrPts(x,y,w,h,r,step=40){const pts=[];
  const seg=(x1,y1,x2,y2)=>{const n=Math.max(1,Math.round(Math.hypot(x2-x1,y2-y1)/step));for(let i=0;i<n;i++)pts.push([x1+(x2-x1)*i/n,y1+(y2-y1)*i/n])};
  const k=Math.max(3,Math.round(r*1.57/step));
  const arc=(cx,cy,a0)=>{for(let i=0;i<k;i++){const a=a0+i/k*Math.PI/2;pts.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}};
  seg(x+r,y,x+w-r,y);arc(x+w-r,y+r,-Math.PI/2);seg(x+w,y+r,x+w,y+h-r);arc(x+w-r,y+h-r,0);seg(x+w-r,y+h,x+r,y+h);arc(x+r,y+h-r,Math.PI/2);seg(x,y+h-r,x,y+r);arc(x+r,y+r,Math.PI);return pts}
function wob(S,pts,j){return S.smooth(pts.map(([a,b])=>[a+S.R(-j,j),b+S.R(-j,j)]))}
// frame ring: outer wobbly edge + inner edge (hugs the photo window, overlapping it ~3px)
function ring(S,fb,ro,j=3){const o=wob(S,rrPts(PX-fb,PY-fb,PW+2*fb,PH+2*fb,ro,40),j),i=wob(S,rrPts(PX+3,PY+3,PW-6,PH-6,PR-3,40),1.2);
  const r=new Path2D();r.addPath(o);r.addPath(i);return {o,i,r}}
// a track around the frame band: at(d) -> [x,y,angle]
function track(off,r){const pts=rrPts(PX-off,PY-off,PW+2*off,PH+2*off,r,6);pts.push(pts[0]);const L=[0];
  for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));const total=L[L.length-1];
  return {total,at(d){d=((d%total)+total)%total;let i=1;while(i<L.length-1&&L[i]<d)i++;const t=(d-L[i-1])/((L[i]-L[i-1])||1),a=pts[i-1],b=pts[i];
    return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,Math.atan2(b[1]-a[1],b[0]-a[0])]}}}
function shadow(c,fb,ro){c.save();c.filter='blur(16px)';c.fillStyle='rgba(40,20,60,.32)';const p=new Path2D();p.roundRect(PX-fb+10,PY-fb+18,PW+2*fb,PH+2*fb,ro);c.fill(p);c.restore()}
function glowSprite(col,r=64){const c=mk(2*r,2*r),x=c.getContext('2d'),g=x.createRadialGradient(r,r,0,r,r,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,2*r,2*r);return c}
function radial(c,x,y,r,stops){const g=c.createRadialGradient(x,y,0,x,y,r);stops.forEach((s,i)=>g.addColorStop(i/(stops.length-1),s));c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r)}
function vgrad(c,stops,y0=0,y1=H){const g=c.createLinearGradient(0,y0,0,y1);stops.forEach(([t,col])=>g.addColorStop(t,col));c.fillStyle=g;c.fillRect(0,y0,W,y1-y0)}

/* ---------- little crayon things (setup-time, on offscreen canvases) ---------- */
function daisy(S,c,x,y,r,col='#fff',cen='#ffcf2e'){for(let i=0;i<8;i++){const a=i/8*TAU+S.R(-.1,.1),p=new Path2D();p.ellipse(x+Math.cos(a)*r*.6,y+Math.sin(a)*r*.6,r*.46,r*.25,a,0,TAU);ink(c,p,col,2.5)}
  ink(c,S.blob(x,y,r*.32,r*.32,{n:14}),cen,2.5)}
function rose(S,c,x,y,r,col,dark){ink(c,S.blob(x,y,r,r*.95,{bumps:5,amp:.12,jit:.04,n:30}),col,3.5);c.strokeStyle=dark;c.lineWidth=Math.max(2,r*.11);c.lineCap='round';c.beginPath();
  const a0=S.R(0,TAU);for(let a=0;a<TAU*2.3;a+=.22){const rr=r*.78*(1-a/(TAU*2.5));const px=x+Math.cos(a+a0)*rr,py=y+Math.sin(a+a0)*rr;a?c.lineTo(px,py):c.moveTo(px,py)}c.stroke()}
function leaf(c,x,y,len,ang,col='#5cbf48',vein='#2f7a26'){c.save();c.translate(x,y);c.rotate(ang);const p=new Path2D(`M0,0 Q${len*.5},${-len*.42} ${len},0 Q${len*.5},${len*.42} 0,0Z`);ink(c,p,col,3);
  c.strokeStyle=vein;c.lineWidth=2;c.beginPath();c.moveTo(3,0);c.lineTo(len*.8,0);c.stroke();c.restore()}
function forget(S,c,x,y,r,col='#7cc4ff'){for(let i=0;i<5;i++){const a=i/5*TAU;ink(c,S.blob(x+Math.cos(a)*r*.55,y+Math.sin(a)*r*.55,r*.45,r*.45,{n:12}),col,2)}ink(c,S.blob(x,y,r*.26,r*.26,{n:10}),'#fff27a',1.5)}
function tulipHead(r){return new Path2D(`M${-r},${-r*.2} L${-r*1.1},${-r*1.4} L${-r*.45},${-r*.85} L0,${-r*1.55} L${r*.45},${-r*.85} L${r*1.1},${-r*1.4} L${r},${-r*.2} Q${r*.6},${r*.55} 0,${r*.55} Q${-r*.6},${r*.55} ${-r},${-r*.2}Z`)}
function hp(c,heart,x,y,s,rot,fill,w=4){c.save();c.translate(x,y);c.rotate(rot);c.scale(s/50,s/50);ink(c,heart,fill,w*50/s);c.restore()}
function tree(S,c,x,y,h,cr,leafF,trunkF){const t=new Path2D(`M${x-16},${y} Q${x-8},${y-h*.5} ${x-10},${y-h} L${x+10},${y-h} Q${x+8},${y-h*.5} ${x+18},${y}Z`);ink(c,t,trunkF,5);
  const crown=S.blob(x,y-h-cr*.55,cr,cr*.85,{bumps:7,amp:.22,jit:.02,n:70});ink(c,crown,leafF,6);
  c.strokeStyle='rgba(28,28,28,.55)';c.lineWidth=3.5;c.lineCap='round';for(let k=0;k<5;k++){const px=x+S.R(-cr*.6,cr*.4),py=y-h-cr*.55+S.R(-cr*.5,cr*.5);c.beginPath();c.moveTo(px,py);c.quadraticCurveTo(px+12,py-10,px+26,py);c.stroke()}}
function tuft(S,c,x,y,col){c.strokeStyle=col;c.lineWidth=3.5;c.lineCap='round';c.beginPath();c.moveTo(x-10,y);c.quadraticCurveTo(x-10,y-16,x-16,y-26);c.moveTo(x,y);c.quadraticCurveTo(x,y-20,x+3,y-32);c.moveTo(x+10,y);c.quadraticCurveTo(x+12,y-14,x+20,y-22);c.stroke()}
function cloudOutline(S,w,h){return {a:S.blob(0,0,w/2,h/2,{bumps:5,amp:.45,jit:.02,n:70}),b:S.blob(4,-3,w/2*.93,h/2*.93,{bumps:5,amp:.4,jit:.03,n:60})}}

/* =====================================================================
   1: FLOWER GARLAND - spring meadow, pink frame wrapped in roses and daisies
   ===================================================================== */
BIS.scene('g0-1',{title:'Flower Garland',blurb:'A pink crayon frame wrapped in roses and daisies with a red bow, in a sunny meadow with a little home, a mother bird feeding her chicks and a mother duck leading her ducklings.',
setup(S){const st=S.state,FB=52,RO=PR+40;st.heart=S.heartPath(50);
  /* ---- background ---- */
  const bg=mk(),b=bg.getContext('2d');st.bg=bg;
  vgrad(b,[[0,'#5cc2f5'],[.35,'#93d9fa'],[.62,'#d4f1ff'],[.74,'#fff3d2'],[1,'#fff3d2']]);
  crayon(S,b,null,0,0,W,820,['#ffffff','#7fd0f7','#b9e7ff'],5200,{a:.28,len:[10,30]});
  radial(b,170,150,520,['rgba(255,236,150,.85)','rgba(255,230,150,.35)','rgba(255,230,150,0)']);
  // far hills
  const h1=hill(S,700,26,.004,1.2);ink(b,h1,S.hatch('#b5e39a',['#c9efae','#a2d986','#d5f5bd'],56,10,4),0);crayon(S,b,h1,0,640,W,200,['#9ad27c','#d2f2b8'],900,{a:.3});str(b,h1,'#6aa94f',4);
  // little home on the left hill
  (function(){const x=150,y=742;const wall=new Path2D(`M${x-62},${y} L${x-60},${y-92} L${x+62},${y-94} L${x+60},${y}Z`);ink(b,wall,S.hatch('#fff3dc',['#ffe6bf','#fff','#f6d9aa'],30,8,3),5);
    const roof=new Path2D(`M${x-86},${y-86} L${x},${y-168} L${x+86},${y-88} Z`);ink(b,roof,S.hatch('#ff6f6f',['#ff4d5b','#ff9a8a','#e8434f'],30,9,3),5);
    ink(b,new Path2D(`M${x+30},${y-140} L${x+30},${y-176} L${x+52},${y-176} L${x+52},${y-120}Z`),'#c8754a',4);
    ink(b,new Path2D(`M${x+12},${y} L${x+12},${y-52} Q${x+30},${y-70} ${x+46},${y-52} L${x+46},${y}Z`),'#9b5a35',4);dot(b,x+38,y-26,3.5,'#ffd84a');
    hp(b,st.heart,x-28,y-46,26,0,'#ffe27a',4);str(b,new Path2D(`M${x-28},${y-62} L${x-28},${y-35} M${x-41},${y-48} L${x-15},${y-48}`),INK,2.5);
    const sm=new Path2D();for(let k=0;k<3;k++)sm.addPath(S.blob(x+48+k*14,y-196-k*30,12+k*4,10+k*3,{n:16}));ink(b,sm,'rgba(255,255,255,.85)',3)})();
  // mid hills
  const h2=hill(S,800,30,.0032,4.1);ink(b,h2,S.hatch('#8fd16a',['#a6e080','#77bd55','#b8ea8f'],52,10,4),6);
  // picket fences on both sides
  [[30,330],[1600,1900]].forEach(([a,z])=>{for(let x=a;x<z;x+=34){const y=812+Math.sin(x*.0032+4.1)*24;ink(b,new Path2D(`M${x-9},${y+6} L${x-9},${y-52} L${x},${y-64} L${x+9},${y-52} L${x+9},${y+6}Z`),'#fffaf0',3.5)}
    const y0=812+Math.sin(a*.0032+4.1)*24,y1=812+Math.sin(z*.0032+4.1)*24;str(b,S.wline(a-10,y0-30,z,y1-30,2),INK,9);str(b,S.wline(a-10,y0-30,z,y1-30,2),'#f5e9d0',4)});
  // trees: left small ones, right big tree with nest
  tree(S,b,330,800,70,70,S.hatch('#6cc94a',['#8fe060','#53ad38','#a5e86e'],40,10,3),'#b5663a');
  tree(S,b,40,820,80,90,S.hatch('#58b844',['#7bd25a','#3f9b32','#93dc6a'],40,10,3),'#a8562f');
  const tk=new Path2D('M1712,1000 Q1736,760 1720,560 Q1700,470 1640,430 L1660,412 Q1724,450 1748,520 Q1770,460 1830,420 L1846,436 Q1786,490 1772,600 Q1770,800 1800,1000Z');
  ink(b,tk,S.hatch('#b8693d',['#9a5330','#cf8250','#8a4628'],34,9,3),6);
  const crown=S.blob(1760,330,230,190,{bumps:8,amp:.2,jit:.02,n:90});ink(b,crown,S.hatch('#5dbf43',['#7fd85a','#459e33','#9be06c','#ff9ec0'],46,12,4),7);
  crayon(S,b,crown,1520,130,480,400,['#3f9b32','#9be06c'],500,{a:.35});
  for(let k=0;k<9;k++){const a=S.R(0,TAU),r=S.R(40,170);const x=1760+Math.cos(a)*r,y=330+Math.sin(a)*r*.75;if(x<1600)continue;ink(b,S.blob(x,y,11,11,{bumps:5,amp:.5,n:20}),k%2?'#ff7aa6':'#fff',2.5);dot(b,x,y,3,'#ffcf2e')}
  // nest on the branch
  st.nestF=S.hatch('#d9a04a',['#b07a25','#f0c46a','#8a5a10'],22,10,2.5);st.nest=new Path2D('M1612,466 Q1660,500 1712,466 Q1708,500 1662,506 Q1616,500 1612,466Z');
  // front meadow
  const h3=hill(S,905,22,.0042,2.3);st.gHatch=S.hatch('#64c04a',['#7fd45c','#4fa83a','#94e070'],50,11,4);ink(b,h3,st.gHatch,7);
  crayon(S,b,h3,0,860,W,220,['#3f9632','#9ae36c','#b9f08a'],1500,{a:.35,ang:[-1.8,-1.3],len:[10,22]});
  for(let x=10;x<W;x+=S.R(22,40))tuft(S,b,x,910+Math.sin(x*.0042+2.3)*22+S.R(4,150),S.pick(['#a6ea74','#3d8e2c','#c4f58e']));
  const fc=[['#ff6f8e','#c93a5c'],['#ffb36b','#d9762b'],['#ffffff','#e8a000'],['#c9a2ff','#8a5ad6'],['#ffe45a','#e0a800']];
  for(let k=0;k<70;k++){const x=S.R(0,W),y=S.R(930,1075),r=S.R(9,15),f=S.pick(fc);if(k%3==0)rose(S,b,x,y,r,f[0],f[1]);else if(k%3==1)daisy(S,b,x,y,r*1.3,f[0]==='#ffffff'?'#fff':f[0]);else forget(S,b,x,y,r)}
  shadow(b,FB,RO);
  /* ---- frame ---- */
  const fr=mk(),f=fr.getContext('2d');st.fr=fr;const R=ring(S,FB,RO);
  f.fillStyle=S.hatch('#ffa3c6',['#ff86b3','#ffc3da','#ff79a8'],46,10,4);f.fill(R.r,'evenodd');
  f.save();f.clip(R.r,'evenodd');crayon(S,f,null,PX-FB,PY-FB,PW+2*FB,PH+2*FB,['#ff6f9f','#ffd3e3'],2600,{a:.35});f.restore();
  str(f,R.o,INK,8);str(f,R.i,INK,6);str(f,wob(S,rrPts(PX-FB+9,PY-FB+9,PW+2*FB-18,PH+2*FB-18,RO-9,40),2),'rgba(255,255,255,.75)',3.5);
  // vine with leaves and flowers
  const T=track(FB/2,PR+FB/2),vp=[];for(let d=0;d<=T.total;d+=10){const [x,y,a]=T.at(d),o=Math.sin(d/55)*9;vp.push([x+Math.sin(a)*o,y-Math.cos(a)*o])}
  const vine=new Path2D(sm(vp));str(f,vine,INK,8);str(f,vine,'#3f9b32',4);
  for(let d=0,k=0;d<T.total;d+=30,k++){const [x,y,a]=T.at(d+S.R(-4,4)),o=Math.sin(d/55)*9,s=k%2?1:-1;leaf(f,x+Math.sin(a)*o,y-Math.cos(a)*o,S.R(20,27),a+s*S.R(.7,1.1)+(k%4<2?0:Math.PI),S.pick(['#5cbf48','#7fd35c','#4aa83a']))}
  const kinds=['rose','daisy','forget','rose','tulip'];
  for(let d=40,k=0;d<T.total;d+=S.R(78,98),k++){const [x,y]=T.at(d),kd=kinds[k%5],r=S.R(17,22);
    if(kd==='rose'){const cc=S.pick([['#ff4f6e','#a8193a'],['#ff9ec0','#d24a7f'],['#ffb36b','#c86a1e'],['#fff1a8','#d1a400']]);rose(S,f,x,y,r,cc[0],cc[1])}
    else if(kd==='daisy')daisy(S,f,x,y,r*1.15);else if(kd==='forget')forget(S,f,x,y,r*.9,S.pick(['#7cc4ff','#c9a2ff']));
    else{f.save();f.translate(x,y);ink(f,tulipHead(r*.8),S.pick(['#ff5a6e','#c9a2ff','#ffd84a']),3);f.restore()}}
  // corner clusters
  [[PX-FB/2,PY-FB/2],[PX+PW+FB/2,PY-FB/2],[PX+PW+FB/2,PY+PH+FB/2],[PX-FB/2,PY+PH+FB/2]].forEach(([x,y],i)=>{const ox=x<CX?-10:10,oy=y<540?-10:10;
    for(let k=0;k<5;k++)leaf(f,x+ox,y+oy,32,k/5*TAU+i,'#4aa83a');rose(S,f,x+ox-14,y+oy+6,22,'#ff4f6e','#a8193a');rose(S,f,x+ox+16,y+oy-8,19,'#ff9ec0','#d24a7f');daisy(S,f,x+ox+4,y+oy+20,15)});
  // the bow on top
  (function(){const x=CX,y=60;const rib=S.hatch('#ff4f6e',['#ff2f55','#ff7c92','#e0203f'],34,9,3);
    const tl=new Path2D(`M${x-6},${y+8} Q${x-60},${y+30} ${x-120},${y+44} L${x-104},${y+58} L${x-128},${y+66} Q${x-60},${y+52} ${x+4},${y+16}Z`);
    const tr=new Path2D(`M${x+6},${y+8} Q${x+60},${y+30} ${x+120},${y+44} L${x+104},${y+58} L${x+128},${y+66} Q${x+60},${y+52} ${x-4},${y+16}Z`);
    ink(f,tl,rib,5);ink(f,tr,rib,5);
    const ll=new Path2D(`M${x},${y} C${x-50},${y-70} ${x-140},${y-50} ${x-128},${y+2} C${x-120},${y+44} ${x-50},${y+30} ${x},${y}Z`);
    const lr=new Path2D(`M${x},${y} C${x+50},${y-70} ${x+140},${y-50} ${x+128},${y+2} C${x+120},${y+44} ${x+50},${y+30} ${x},${y}Z`);
    ink(f,ll,rib,6);ink(f,lr,rib,6);str(f,new Path2D(`M${x-30},${y-6} Q${x-80},${y-34} ${x-108},${y-6} M${x+30},${y-6} Q${x+80},${y-34} ${x+108},${y-6}`),'#ff9fb0',4);
    hp(f,st.heart,x,y+12,34,0,S.hatch('#ff2f55',['#ff6f84','#d9183c'],24,8,3),5);str(f,new Path2D(`M${x-12},${y-8} Q${x-6},${y-14} ${x},${y-8}`),'#ffd0d8',3)})();
  // heart at bottom centre
  hp(f,st.heart,CX,PY+PH+FB*.62,40,0,S.hatch('#ff4f6e',['#ff2f55','#ff8fa3'],24,8,3),5);
  /* ---- moving bits ---- */
  st.sunBody=S.blob(0,0,80,78,{jit:.02});st.sunF=S.hatch('#ffe12e',['#ffd000','#fff27a','#ffc400'],30,10,3);
  st.rays=new Path2D();for(let i=0;i<16;i++){const a=i/16*TAU+S.R(-.05,.05),r1=S.R(98,106),r2=S.R(140,170);st.rays.addPath(S.wline(Math.cos(a)*r1,Math.sin(a)*r1,Math.cos(a)*r2,Math.sin(a)*r2,3))}
  st.clouds=[[90,1.05,120],[230,.7,145],[30,.85,72],[300,.55,145],[150,.6,48]].map(([y,s,sec],i)=>({c:cloudOutline(S,300*s,120*s),y,sec,x0:i*410+S.R(0,120)}));
  st.birds=[[260,48,0],[300,48,.04],[200,72,.5]].map(([y,sec,o])=>({y,sec,o}));
  st.hearts=[];const hc=['#ff4f6e','#ff9ec0','#ffd84a','#c9a2ff','#ffb36b'];
  for(let i=0;i<12;i++){const left=i%2==0;st.hearts.push({x:left?S.R(40,300):S.R(1620,1880),y:S.R(0,H),s:S.R(16,30),c:hc[i%5],ph:S.R(0,1),sec:S.pick([29,36,48])})}
  st.bf=[{cx:180,cy:520,rx:110,ry:90,c:'#ff8fc8',ph:0},{cx:1760,cy:700,rx:110,ry:70,c:'#ffb347',ph:.45},{cx:1090,cy:880,rx:420,ry:30,c:'#9fd0ff',ph:.7}];
  st.wingU=S.blob(24,-14,26,20,{jit:.04,n:20});st.wingL=S.blob(17,15,17,13,{jit:.04,n:20});
  st.mum=S.hatch('#fffaf0',['#f1e6cf','#ffffff','#e7d8b8'],30,8,3);st.ducky=S.hatch('#ffd93b',['#ffe97a','#ffc61a','#fff3a6'],26,9,2.5);
  st.dBody=S.blob(0,-40,50,31,{jit:.02});st.dHead=S.blob(36,-84,23,22,{jit:.03});
  st.bird=S.blob(0,0,40,30,{jit:.02});st.birdH=S.blob(30,-24,20,19,{jit:.03});st.chick=S.blob(0,0,15,14,{jit:.03});
  st.flw=[];for(let i=0;i<10;i++){const left=i<5;st.flw.push({x:left?S.R(20,320):S.R(1600,1900),y:S.R(1000,1070),h:S.R(80,150),r:S.R(18,24),c:S.pick(['#ff5a6e','#ffd84a','#c9a2ff','#ff9a3c','#ff8fc8']),ph:S.R(0,1)})}
  st.tulip=tulipHead(22);
  st.spark=S.starPath(16,5,4);st.sparks=[];const sT=track(FB+18,RO+18);for(let i=0;i<10;i++){const [x,y]=sT.at(i/10*sT.total+S.R(0,80));st.sparks.push({x,y,ph:S.R(0,1),s:S.R(.8,1.4)})}
},
draw(S){const c=S.ctx,st=S.state;c.drawImage(st.bg,0,0);
  // sun
  S.at(170,150,S.saw(70)*TAU,1,()=>{str(c,st.rays,INK,14);str(c,st.rays,'#ffd400',8)});
  S.at(170,150,0,1+.03*S.osc(4),()=>{ink(c,st.sunBody,st.sunF,7);str(c,new Path2D('M-36,-14 q12,-14 24,0 M14,-14 q12,-14 24,0'),'#6b2a12',6);
    ink(c,new Path2D('M-30,12 Q0,52 30,12 Q0,24 -30,12Z'),'#9b2d16',5,'#6b2a12');dot(c,-44,16,11,'rgba(255,130,80,.5)');dot(c,44,16,11,'rgba(255,130,80,.5)')});
  // clouds
  st.clouds.forEach(k=>{const x=S.wrap(k.x0,k.sec,W,240);S.at(x,k.y,0,1,()=>{ink(c,k.c.a,'rgba(255,255,255,.55)',8,'#fff');str(c,k.c.b,'rgba(255,255,255,.8)',3)})});
  st.birds.forEach((bd,i)=>{const x=S.wrap(bd.o*W,bd.sec,W,80),fl=S.osc(.6,i*.3);S.at(x,bd.y+S.osc(6,i*.2)*14,0,1,()=>str(c,new Path2D(`M-24,${fl*6} Q-12,${-10-fl*8} 0,0 Q12,${-10-fl*8} 24,${fl*6}`),INK,5))});
  // mother bird feeding chicks in the nest
  const feed=S.osc01(3.2),beak=S.osc01(.6);
  [[1636,470],[1660,462],[1686,468]].forEach(([x,y],i)=>S.at(x,y-6-(i==1?feed*6:0),0,1,()=>{ink(c,st.chick,st.ducky,4);dot(c,5,-3,3);
    const o=4+beak*7*(i==1?1:.5);ink(c,new Path2D(`M10,-2 L22,${-4-o*.4} L12,2 L22,${4+o*.4}Z`),'#ff8a00',3)}));
  ink(c,st.nest,st.nestF,5);
  S.at(1738,452,-.15*feed,1,()=>{ink(c,st.bird,'#ff7a7a',5);ink(c,new Path2D('M-30,-6 L-56,-20 L-48,4Z'),'#ff5a6e',4);
    S.at(0,0,-.5*feed,1,()=>{ink(c,st.birdH,'#ff7a7a',5);dot(c,26,-28,4);dot(c,20,-18,6,'rgba(255,255,255,.5)');ink(c,new Path2D('M8,-26 L-14,-22 L8,-18Z'),'#ffb300',3)});
    str(c,new Path2D('M-10,0 q14,14 28,0'),INK,4)});
  // floating hearts at the sides
  st.hearts.forEach(h=>{const y=S.wrap(h.y,h.sec,H,60,-1),x=h.x+S.osc(7,h.ph)*18;hp(c,st.heart,x,y,h.s*(1+.06*S.osc(2.5,h.ph)),S.osc(6,h.ph)*.25,h.c,4)});
  S.photoWindow(PX,PY,PW,PH,PR);
  c.drawImage(st.fr,0,0);
  // twinkles around the frame
  st.sparks.forEach(s=>{const a=S.pulse(4,s.ph,3);if(a<.05)return;c.globalAlpha=a;S.at(s.x,s.y,0,s.s*(.6+.6*a),()=>ink(c,st.spark,'#fff7b0',3,'#ffb800'));c.globalAlpha=1});
  // butterflies
  st.bf.forEach(b=>{const a=TAU*(S.cycles(30)*S.p+b.ph),x=b.cx+Math.sin(a)*b.rx,y=b.cy+Math.sin(a*2)*b.ry*.5,f=.3+.7*Math.abs(S.osc(.7,b.ph));
    S.at(x,y,Math.cos(a)*.3,.9,()=>{[-1,1].forEach(d=>S.at(0,0,0,[d*f,1],()=>{ink(c,st.wingU,b.c,4);ink(c,st.wingL,'#ffe45a',4)}));
      str(c,new Path2D('M0,-20 L0,22'),INK,8);str(c,new Path2D('M0,-20 Q-8,-34 -12,-38 M0,-20 Q8,-34 12,-38'),INK,3)})});
  // swaying tulips at the bottom corners
  st.flw.forEach(fl=>{S.at(fl.x,fl.y,S.osc(6,fl.ph)*.08,1,()=>{const p=new Path2D(`M0,0 Q6,${-fl.h/2} 0,${-fl.h}`);str(c,p,INK,10);str(c,p,'#4fbf55',5);
    leaf(c,0,-fl.h*.35,34,-.9,'#5cbf48');S.at(0,-fl.h,0,fl.r/22,()=>ink(c,st.tulip,fl.c,5))})});
  // mother duck and ducklings walking along the meadow
  const dx=S.wrap(0,72,W,330);
  [[0,1.15,st.mum,0],[-110,.55,st.ducky,.25],[-175,.5,st.ducky,.5],[-235,.46,st.ducky,.75]].forEach(([o,s,fill,ph])=>{const x=dx+o,step=S.osc(.8,ph),y=1000+Math.sin(x*.004)*6;
    S.at(x,y-Math.abs(step)*5*s,0,s,()=>{str(c,new Path2D(`M-10,-12 L${-10+step*8},0 M10,-12 L${10-step*8},0`),'#ff8a00',6);
      ink(c,new Path2D('M-46,-46 L-68,-62 L-52,-30Z'),fill,5);ink(c,st.dBody,fill,6);ink(c,st.dHead,fill,6);
      ink(c,new Path2D('M54,-88 Q76,-88 78,-80 Q72,-73 54,-76Z'),'#ff9a1a',4);dot(c,44,-90,4.5);dot(c,45.5,-91.5,1.6,'#fff');dot(c,38,-76,6,'rgba(255,140,160,.6)');
      str(c,new Path2D('M-24,-46 Q0,-64 20,-42'),INK,5);
      if(s>1)S.at(26,-108,0,1,()=>{ink(c,new Path2D('M0,0 L-20,-12 L-20,12Z M0,0 L20,-12 L20,12Z'),'#ff6f9f',4);dot(c,0,0,6,'#ff3d7f')})})});
}});

/* =====================================================================
   2: OCEAN HUG - under the sea, driftwood & rope frame with shells
   ===================================================================== */
BIS.scene('g0-2',{title:'Ocean Hug',blurb:'Under the sea: a rope-and-driftwood frame with starfish and shells, a mother whale swimming with her calf, a turtle and her baby, swaying seaweed and rising bubbles.',
setup(S){const st=S.state,FB=50,RO=PR+30;st.heart=S.heartPath(50);
  const bg=mk(),b=bg.getContext('2d');st.bg=bg;
  vgrad(b,[[0,'#a8f2ee'],[.18,'#5fd0dc'],[.55,'#2b9cc4'],[1,'#17679a']]);
  crayon(S,b,null,0,0,W,H,['#c6fbf6','#3bb3d0','#1f86b3'],5500,{a:.24,len:[12,32],ang:[-.2,.2]});
  // surface shimmer
  const surf=new Path2D();for(let x=0;x<W;x+=S.R(60,120)){const y=S.R(10,48);surf.addPath(S.wline(x,y,x+S.R(40,90),y+S.R(-4,4),3))}str(b,surf,'rgba(255,255,255,.7)',5);
  // distant reef silhouettes
  for(let k=0;k<14;k++){const x=k<7?S.R(-60,360):S.R(1560,1980);b.fillStyle=S.pick(['rgba(30,110,150,.55)','rgba(40,125,160,.5)']);b.fill(S.blob(x,S.R(700,860),S.R(60,140),S.R(80,200),{bumps:6,amp:.25}))}
  // sand
  const sand=hill(S,935,20,.004,.6);st.sandF=S.hatch('#f6dc98',['#efc977','#fff0c0','#e2b866'],46,11,4);ink(b,sand,st.sandF,7);
  crayon(S,b,sand,0,890,W,190,['#d9aa58','#fff3c8'],1400,{a:.35});
  for(let k=0;k<70;k++){const x=S.R(0,W),y=S.R(960,1075);dot(b,x,y,S.R(3,7),S.pick(['#c99b57','#e8c27a','#b0b0c8','#f2e2c0']))}
  // corals: left and right reefs
  function coral(x,y,len,ang,w,col,depth){const x2=x+Math.cos(ang)*len,y2=y+Math.sin(ang)*len;const p=new Path2D(`M${x},${y} Q${(x+x2)/2+S.R(-10,10)},${(y+y2)/2} ${x2},${y2}`);
    str(b,p,INK,w+7);str(b,p,col,w);if(depth>0){coral(x2,y2,len*.72,ang-S.R(.3,.6),w*.78,col,depth-1);coral(x2,y2,len*.72,ang+S.R(.3,.6),w*.78,col,depth-1)}
    else dot(b,x2,y2,w*.55,col)}
  function sponge(x,y,h,col){for(let k=0;k<3;k++){const xx=x+k*26-26,hh=h*S.R(.6,1);const p=new Path2D(`M${xx-12},${y} L${xx-14},${y-hh} Q${xx},${y-hh-8} ${xx+14},${y-hh} L${xx+12},${y}Z`);ink(b,p,col,5);ink(b,S.blob(xx,y-hh,11,5,{n:16}),'#4a2a6a',3)}}
  function brain(x,y,r,col){const p=S.blob(x,y,r,r*.7,{jit:.04});ink(b,p,col,6);b.save();b.clip(p);for(let k=0;k<7;k++)str(b,S.wline(x-r,y-r*.6+k*r*.22,x+r,y-r*.5+k*r*.22,6),'rgba(28,28,28,.35)',3);b.restore()}
  brain(120,985,95,S.hatch('#ff9a6b',['#ff7a4c','#ffbf98'],30,8,3));coral(240,975,90,-1.7,16,'#ff5f8a',3);coral(60,985,70,-1.35,13,'#ffb347',3);sponge(330,1000,90,S.hatch('#b58cf0',['#9a6ee0','#d1b5ff'],28,8,3));
  brain(1810,990,90,S.hatch('#c9a2ff',['#a77ef0','#e0ccff'],30,8,3));coral(1680,985,95,-1.45,16,'#ff7a5c',3);coral(1880,975,75,-1.9,13,'#ff5f8a',3);sponge(1590,1005,80,S.hatch('#ffd84a',['#ffc21a','#fff09a'],28,8,3));
  // shells & starfish on the sand
  st.star=S.smooth(Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,r=i%2?16:40;return [Math.cos(a)*r,Math.sin(a)*r]}));
  st.shell=new Path2D('M0,0 L-34,-30 Q-30,-52 0,-56 Q30,-52 34,-30 Z');
  function shellAt(c2,x,y,s,rot,col){c2.save();c2.translate(x,y);c2.rotate(rot);c2.scale(s,s);ink(c2,st.shell,col,4/s);c2.strokeStyle='rgba(28,28,28,.6)';c2.lineWidth=2.5/s;c2.beginPath();for(let k=-2;k<=2;k++){c2.moveTo(0,-2);c2.lineTo(k*12,-50+Math.abs(k)*6)}c2.stroke();ink(c2,new Path2D('M-8,0 L8,0 L4,8 L-4,8Z'),col,3/s);c2.restore()}
  function starAt(c2,x,y,s,rot,col){c2.save();c2.translate(x,y);c2.rotate(rot);c2.scale(s,s);ink(c2,st.star,col,5/s);for(let i=0;i<5;i++){const a=-Math.PI/2+i*TAU/5;for(let k=1;k<3;k++)dot(c2,Math.cos(a)*k*10,Math.sin(a)*k*10,2.6,'rgba(255,255,255,.85)')}c2.restore()}
  st.shellAt=shellAt;st.starAt=starAt;
  starAt(b,520,1035,.9,.3,'#ff8a4c');shellAt(b,700,1060,.8,-.2,'#ffc2cc');starAt(b,1320,1050,.75,-.4,'#ffd84a');shellAt(b,1460,1030,.7,.3,'#fff0d8');shellAt(b,960,1065,.6,0,'#ffb0b8');
  shadow(b,FB,RO);
  /* ---- frame: driftwood band with rope edges ---- */
  const fr=mk(),f=fr.getContext('2d');st.fr=fr;const R=ring(S,FB,RO);
  f.fillStyle=S.hatch('#e2ad6e',['#c88d4e','#f0c891','#b97a40'],50,11,4);f.fill(R.r,'evenodd');
  f.save();f.clip(R.r,'evenodd');for(let o=10;o<FB;o+=7){const T=track(o,PR+o),pts=[];for(let d=0;d<=T.total;d+=24){const [x,y,a]=T.at(d),w=Math.sin(d/90+o)*2.5;pts.push([x+Math.sin(a)*w,y-Math.cos(a)*w])}str(f,new Path2D(sm(pts)),'rgba(120,70,30,.4)',2)}
  f.restore();str(f,R.o,INK,7);
  function rope(off,r,w){const T=track(off,r),pts=[];for(let d=0;d<=T.total;d+=10){const [x,y]=T.at(d);pts.push([x,y])}const p=new Path2D(sm(pts));str(f,p,INK,w+6);str(f,p,'#f3dca6',w);
    f.strokeStyle='#a87c3e';f.lineWidth=2.8;f.lineCap='round';f.beginPath();for(let d=0;d<T.total;d+=w*.8){const [x,y,a]=T.at(d),cx=Math.cos(a+.8)*w*.5,cy=Math.sin(a+.8)*w*.5;f.moveTo(x-cx,y-cy);f.lineTo(x+cx,y+cy)}f.stroke()}
  rope(FB-4,RO-4,15);rope(2,PR+2,10);
  // shells and pearls along the band
  const T=track(FB/2,PR+FB/2);for(let d=60,k=0;d<T.total;d+=S.R(150,200),k++){const [x,y,a]=T.at(d);if(k%2)shellAt(f,x,y+16,.48,a,S.pick(['#ffc2cc','#fff0d8','#ffd6a8']));else{for(let j=-2;j<=2;j++){const [px,py]=T.at(d+j*13);dot(f,px,py,7,INK);dot(f,px,py,5,'#fffaf2');dot(f,px-2,py-2,1.8,'#fff')}}}
  starAt(f,PX-FB/2,PY-FB/2,1.15,.2,S.hatch('#ff8a4c',['#ff6a2a','#ffb07a'],24,8,3));starAt(f,PX+PW+FB/2,PY+PH+FB/2,1.05,-.3,S.hatch('#ffd84a',['#ffc21a','#fff09a'],24,8,3));
  shellAt(f,PX+PW+FB/2,PY-FB/2+26,1.1,.4,S.hatch('#ffb0c4',['#ff8fae','#ffd3df'],24,8,3));shellAt(f,PX-FB/2,PY+PH+FB/2+26,1.1,-.4,S.hatch('#fff0d8',['#f1d9b0','#fff'],24,8,3));
  // open clam with a pearl at top centre
  (function(){const x=CX,y=PY-FB+20;const lo=new Path2D(`M${x-62},${y+4} Q${x},${y+52} ${x+62},${y+4} Q${x},${y+20} ${x-62},${y+4}Z`),up=new Path2D(`M${x-62},${y+2} Q${x-56},${y-56} ${x},${y-60} Q${x+56},${y-56} ${x+62},${y+2} Q${x},${y-14} ${x-62},${y+2}Z`);
    const cf=S.hatch('#c9a2ff',['#b386f5','#e3d0ff'],26,8,3);ink(f,up,cf,6);for(let k=-3;k<=3;k++)str(f,new Path2D(`M${x},${y-6} L${x+k*16},${y-50+Math.abs(k)*5}`),'rgba(28,28,28,.4)',2.5);ink(f,lo,cf,6);
    radial(f,x,y,60,['rgba(255,255,255,.9)','rgba(255,255,255,0)']);dot(f,x,y,17,INK);dot(f,x,y,14,'#fff8f0');dot(f,x-5,y-5,5,'#fff')})();
  /* ---- moving bits ---- */
  st.rays=[];for(let i=0;i<7;i++){const x=S.R(-100,W),w=S.R(60,150),sk=S.R(160,320);st.rays.push({p:new Path2D(`M${x},-10 L${x+w},-10 L${x+w+sk+120},${H} L${x+sk-60},${H}Z`),ph:S.R(0,1),sec:S.pick([10,13,18])})}
  st.weed=[];for(let i=0;i<16;i++){const side=i%2,x=side?S.R(1580,1910):S.R(10,340);st.weed.push({x,y:S.R(990,1060),n:S.RI(9,14),seg:S.R(26,36),w:S.R(10,15),col:S.pick(['#3fbf6a','#2fa35a','#7ad66a','#1f8a5a']),ph:S.R(0,1)})}
  st.bub=[];for(let i=0;i<46;i++){const x=i<34?(i%2?S.R(1590,1900):S.R(20,330)):S.R(400,1500);st.bub.push({x,y:S.R(0,H),r:S.R(4,13),sec:S.pick([12,16,20,24]),ph:S.R(0,1)})}
  st.fish=S.blob(0,0,20,11,{n:20});st.tail=new Path2D('M-16,0 L-32,-11 L-30,11Z');
  st.schools=[[34,72,1,'#ffd84a'],[260,145,-1,'#ff8a4c'],[600,48,1,'#7cf0ff']].map(([y,sec,dir,col])=>({y,sec,dir,col,x0:S.R(0,1),m:Array.from({length:7},()=>[S.R(-120,40),S.R(-34,34),S.R(.7,1.1),S.R(0,1)])}));
  st.schools[0].m=st.schools[0].m.map(m=>[m[0],m[1]*.4,m[2]*.75,m[3]]);
  // whale sprite (no tail; tail swishes separately)
  const ws=mk(460,240),w=ws.getContext('2d');st.whale=ws;w.translate(250,130);
  const body=S.smooth([[190,0],[176,-48],[110,-84],[10,-90],[-90,-66],[-170,-30],[-224,-6],[-170,24],[-70,58],[50,72],[150,50]]);
  ink(w,body,S.hatch('#5b8fe0',['#4a7bd0','#7aa8f0','#6a9aea'],40,10,4),0);w.save();w.clip(body);ink(w,S.blob(30,80,180,64,{n:40}),S.hatch('#d6ecff',['#bcdcff','#eef7ff'],30,8,3),0);
  for(let k=0;k<6;k++)str(w,new Path2D(`M${-60+k*34},${30+k*2} Q${-10+k*34},${40} ${40+k*34},${28-k*2}`),'rgba(70,110,180,.6)',3);w.restore();str(w,body,INK,7);
  dot(w,128,-16,8);dot(w,131,-19,3,'#fff');str(w,new Path2D('M116,14 Q150,36 182,8'),INK,5);dot(w,104,8,13,'rgba(255,140,170,.55)');
  ink(w,new Path2D('M10,30 Q-10,80 -60,96 Q-30,60 -20,30Z'),'#4a7bd0',5);
  st.ftail=new Path2D('M0,0 C-20,-10 -40,-50 -76,-60 C-62,-30 -66,-10 -52,0 C-66,10 -62,30 -76,56 C-40,48 -20,10 0,0Z');
  st.whaleF=S.hatch('#5b8fe0',['#4a7bd0','#7aa8f0'],40,10,4);
  // turtle sprite pieces
  st.shellP=S.blob(0,0,52,40,{jit:.03});st.shellF=S.hatch('#4fbf6a',['#3a9f52','#7ad67a','#2f8a45'],30,9,3);st.tHead=S.blob(64,-6,20,16,{jit:.03});st.flip=S.blob(0,0,24,10,{n:16});
  st.jelly=new Path2D('M-50,0 Q-50,-56 0,-58 Q50,-56 50,0 Q38,8 25,0 Q12,8 0,0 Q-12,8 -25,0 Q-38,8 -50,0Z');
  st.glow=glowSprite('rgba(255,200,240,.55)');
  st.crab=S.blob(0,0,34,22,{jit:.03});
},
draw(S){const c=S.ctx,st=S.state;c.drawImage(st.bg,0,0);
  st.rays.forEach(r=>{c.fillStyle=`rgba(255,255,240,${.05+.07*S.osc01(r.sec,r.ph)})`;c.fill(r.p)});
  // fish schools (they swim behind the frame)
  st.schools.forEach(s=>{const bx=S.wrap(s.x0*W,s.sec,W,220,s.dir);s.m.forEach(([dx,dy,sc,ph])=>{S.at(bx+dx*s.dir,s.y+dy+S.osc(3,ph)*5,S.osc(1.2,ph)*.08,[sc*s.dir,sc],()=>{ink(c,st.tail,s.col,3);ink(c,st.fish,s.col,3);dot(c,10,-2,2.5)})})});
  // jellyfish mother & baby (right)
  [[1755,330,1,0],[1665,440,.55,.35]].forEach(([x,y,s,ph])=>{const sq=S.osc(3,ph),yy=y+S.osc(16,ph)*50;c.drawImage(st.glow,x-90*s,yy-110*s,180*s,180*s);
    S.at(x,yy,0,[s*(1+.06*sq),s*(1-.06*sq)],()=>{for(let k=-2;k<=2;k++){const p=new Path2D();p.moveTo(k*18,4);for(let j=1;j<=6;j++)p.lineTo(k*18+Math.sin(TAU*(S.cycles(3)*S.p+ph)-j*.8+k)*9,4+j*22);str(c,p,'#ff9ed8',5)}
      ink(c,st.jelly,'#ffb3e2',6);dot(c,-16,-26,4);dot(c,16,-26,4);str(c,new Path2D('M-8,-14 Q0,-8 8,-14'),INK,3);dot(c,-28,-16,6,'rgba(255,120,170,.6)');dot(c,28,-16,6,'rgba(255,120,170,.6)');
      str(c,new Path2D('M-30,-40 Q-10,-52 10,-48'),'rgba(255,255,255,.8)',4)})});
  S.photoWindow(PX,PY,PW,PH,PR);
  c.drawImage(st.fr,0,0);
  // seaweed
  st.weed.forEach(wd=>{const pts=[[wd.x,wd.y]];for(let j=1;j<=wd.n;j++)pts.push([wd.x+S.osc(7,wd.ph-j*.05)*j*3.2+Math.sin(j*.9+wd.ph*6)*6,wd.y-j*wd.seg]);const p=new Path2D(sm(pts));str(c,p,INK,wd.w+7);str(c,p,wd.col,wd.w)});
  // turtle mum & baby (left)
  [[175,330,1,0],[262,450,.55,.18]].forEach(([x,y,s,ph])=>{const px=x+S.osc(29,ph)*40,py=y+S.osc(36,ph+.2)*90,pd=S.osc(2.4,ph);
    S.at(px,py,-.15+S.osc(36,ph+.45)*.12,s,()=>{S.at(-26,24,.6+pd*.4,1,()=>ink(c,st.flip,'#8fd88a',4));S.at(26,26,.9-pd*.4,1,()=>ink(c,st.flip,'#8fd88a',4));
      S.at(-22,-26,-.6-pd*.4,1,()=>ink(c,st.flip,'#8fd88a',4));S.at(30,-28,-.9+pd*.4,1,()=>ink(c,st.flip,'#8fd88a',4));
      ink(c,st.tHead,'#8fd88a',5);dot(c,72,-10,4);dot(c,73,-11,1.5,'#fff');str(c,new Path2D('M70,2 Q76,6 82,0'),INK,3);
      ink(c,st.shellP,st.shellF,6);str(c,new Path2D('M-18,-14 L0,-24 L18,-14 L18,8 L0,18 L-18,8Z M-18,-14 L-40,-14 M18,-14 L40,-14 M18,8 L38,18 M-18,8 L-38,18 M0,-24 L0,-38 M0,18 L0,38'),'rgba(28,28,28,.6)',3.5)})});
  // bubbles
  c.lineWidth=3;st.bub.forEach((bb,i)=>{const y=S.wrap(bb.y,bb.sec,H,30,-1),x=bb.x+S.osc(4,bb.ph)*8;if(x>PX-60&&x<PX+PW+60&&y<PY+PH+60)return;if(i%5==0){hp(c,st.heart,x,y,bb.r*2.2+8,S.osc(5,bb.ph)*.2,'rgba(255,170,210,.35)',3);return}c.strokeStyle='rgba(255,255,255,.75)';c.beginPath();c.arc(x,y,bb.r,0,TAU);c.stroke();dot(c,x-bb.r*.35,y-bb.r*.35,bb.r*.25,'rgba(255,255,255,.9)')});
  // crab on the sand
  const cx=1760+S.osc(16)*60,step=S.osc(.9);S.at(cx,1040,0,1,()=>{c.strokeStyle=INK;c.lineWidth=5;c.lineCap='round';c.beginPath();for(let k=0;k<3;k++){c.moveTo(-20,0);c.lineTo(-44,8+k*8+step*4);c.moveTo(20,0);c.lineTo(44,8+k*8-step*4)}c.stroke();
    ink(c,new Path2D('M-30,-10 L-48,-36 L-34,-44 L-28,-30Z M30,-10 L48,-36 L34,-44 L28,-30Z'),'#ff5a4c',4);ink(c,st.crab,'#ff6f5a',5);str(c,new Path2D('M-10,-20 L-12,-34 M10,-20 L12,-34'),INK,4);dot(c,-12,-36,5,'#fff');dot(c,12,-36,5,'#fff');dot(c,-12,-36,2.5);dot(c,12,-36,2.5);
    str(c,new Path2D('M-8,0 Q0,6 8,0'),INK,3)});
  // mother whale and calf
  const wx=S.wrap(0,72,W,420),wy=915+S.osc(9)*10,sw=S.osc(3.6);
  [[wx,wy,1,0,sw],[wx-40,wy+78+S.osc(9,.3)*6,.46,.2,S.osc(2.4)]].forEach(([x,y,s,ph,swish])=>{S.at(x,y,S.osc(9,ph+.25)*.04,s,()=>{S.at(-212,-6,swish*.3,1,()=>ink(c,st.ftail,st.whaleF,6));c.drawImage(st.whale,-250,-130)})});
}});

/* =====================================================================
   3: MOONLIGHT QUILT - night garden, patchwork quilt frame, fairy lights
   ===================================================================== */
BIS.scene('g0-3',{title:'Moonlight Quilt',blurb:'A cosy patchwork-quilt frame under fairy lights on a starry night, with a mother moon cradling a little star, an owl family on a branch and two rabbits on the hill.',
setup(S){const st=S.state,FB=58,RO=PR+26;st.heart=S.heartPath(50);
  const bg=mk(),b=bg.getContext('2d');st.bg=bg;
  vgrad(b,[[0,'#121a4a'],[.4,'#26307a'],[.72,'#4e3d92'],[.86,'#9a5ea6'],[1,'#c97aa6']]);
  crayon(S,b,null,0,0,W,950,['#3a4aa0','#1b245e','#5a4aa8'],5200,{a:.3,len:[12,30]});
  for(let i=0;i<260;i++){const x=S.R(0,W),y=S.R(0,760),r=S.R(.8,2.4);dot(b,x,y,r,`rgba(255,250,220,${S.R(.4,.95)})`)}
  radial(b,1745,175,420,['rgba(255,236,170,.55)','rgba(255,220,160,.18)','rgba(255,220,160,0)']);
  // hills with glowing cottages
  const h1=hill(S,790,24,.0038,2.0);ink(b,h1,S.hatch('#43398a',['#51479c','#382f78','#5c50a8'],52,10,4),0);crayon(S,b,h1,0,740,W,300,['#5d52ab','#2f2868'],700,{a:.3});str(b,h1,'#6b5fb8',4);
  [[90,800],[240,790],[1660,792],[1830,804]].forEach(([x,y],i)=>{const yy=y-6;ink(b,new Path2D(`M${x-28},${yy} L${x-28},${yy-40} L${x+28},${yy-40} L${x+28},${yy}Z`),'#2a2460',3.5,'#15123a');
    ink(b,new Path2D(`M${x-38},${yy-36} L${x},${yy-70} L${x+38},${yy-36}Z`),'#3b2f6e',3.5,'#15123a');b.drawImage(glowSprite('rgba(255,210,110,.7)',40),x-40,yy-62,80,80);
    ink(b,new Path2D(`M${x-12},${yy-30} L${x+12},${yy-30} L${x+12},${yy-12} L${x-12},${yy-12}Z`),'#ffd56a',2.5,'#15123a')});
  const h2=hill(S,880,28,.003,5.2);st.h2F=S.hatch('#2f3a7a',['#3a4790','#26306a','#46549c'],52,10,4);ink(b,h2,st.h2F,6,'#141a40');
  crayon(S,b,h2,0,840,W,240,['#4a5aa8','#1d2558'],900,{a:.35});
  // trees
  const tl=S.hatch('#2c6a6a',['#357a78','#225656','#3f8a86'],40,10,3);
  tree(S,b,1880,880,90,100,tl,'#4a3058');tree(S,b,1560,890,60,64,tl,'#4a3058');
  // big branch on the left for the owls
  const br=new Path2D('M-30,1000 Q20,760 10,560 Q0,480 -30,420 L-10,410 Q30,470 40,520 Q120,476 330,452 L336,476 Q150,500 60,560 Q70,780 60,1000Z');
  ink(b,br,S.hatch('#6a4a3a',['#5a3c2e','#7d5a46'],34,9,3),6,'#15123a');
  for(let k=0;k<6;k++)leaf(b,60+k*48,476-k*4+(k%2?-14:16),34,(k%2?-1:1)*.9-.3,'#3f8a6a','#1e4a3a');
  const crownL=S.blob(-20,330,170,150,{bumps:7,amp:.22,n:70});ink(b,crownL,tl,6,'#15123a');
  // night flowers & grass
  for(let x=0;x<W;x+=S.R(24,44))tuft(S,b,x,900+S.R(10,170),S.pick(['#5a6ab8','#3b4890','#7a7ad0']));
  for(let k=0;k<55;k++){const x=S.R(0,W),y=S.R(930,1075);if(k%2)daisy(S,b,x,y,S.R(11,16),S.pick(['#f6f0ff','#e0d0ff','#ffe0f0']),'#ffd56a');else forget(S,b,x,y,S.R(9,13),S.pick(['#9fb4ff','#d0a8ff']))}
  shadow(b,FB,RO);
  /* ---- patchwork quilt frame ---- */
  const fr=mk(),f=fr.getContext('2d');st.fr=fr;const R=ring(S,FB,RO,2.5);
  const cols=['#ffb3c7','#ffe28a','#b8ecd0','#c9b8ff','#ffcfa3','#a8dcff'],pats=cols.map(cc=>S.hatch(cc,[S.mix(cc,'#ffffff',.45),S.mix(cc,'#000000',.12)],40,9,3));
  f.save();f.clip(R.r,'evenodd');
  const cells=[];const row=(x0,x1,y0,y1,n)=>{for(let i=0;i<n;i++)cells.push([x0+(x1-x0)*i/n,y0,(x1-x0)/n,y1-y0])};
  row(PX-FB,PX+PW+FB,PY-FB,PY,14);row(PX-FB,PX+PW+FB,PY+PH,PY+PH+FB,14);
  const col=(x0,x1,y0,y1,n)=>{for(let i=0;i<n;i++)cells.push([x0,y0+(y1-y0)*i/n,x1-x0,(y1-y0)/n])};col(PX-FB,PX,PY,PY+PH,8);col(PX+PW,PX+PW+FB,PY,PY+PH,8);
  cells.forEach(([x,y,w,h],i)=>{const k=(i*5+Math.floor(i/3))%6;f.fillStyle=pats[k];f.fillRect(x,y,w,h);const mx=x+w/2,my=y+h/2,m=i%4,mc=S.mix(cols[k],'#000000',.3);
    if(m==0)hp(f,st.heart,mx,my+4,18,0,'#fff',0);else if(m==1){for(let a=0;a<2;a++)for(let bq=0;bq<2;bq++)dot(f,x+w*(.28+a*.44),y+h*(.28+bq*.44),4.5,'rgba(255,255,255,.85)')}
    else if(m==2){f.save();f.translate(mx,my);ink(f,S.starPath(13,6,5),'#fff6c0',2,mc);f.restore()}else{f.strokeStyle='rgba(255,255,255,.7)';f.lineWidth=4;f.beginPath();for(let s=-2;s<=2;s++){f.moveTo(mx+s*11-8,y+4);f.lineTo(mx+s*11+8,y+h-4)}f.stroke()}
    f.setLineDash([7,6]);f.strokeStyle=S.mix(cols[k],'#000000',.35);f.lineWidth=2.5;f.strokeRect(x+5,y+5,w-10,h-10);f.setLineDash([]);
    f.strokeStyle='rgba(60,40,90,.55)';f.lineWidth=2;f.strokeRect(x,y,w,h)});
  f.restore();
  str(f,R.o,INK,8);str(f,R.i,INK,6);f.setLineDash([10,8]);str(f,wob(S,rrPts(PX-FB-12,PY-FB-12,PW+2*FB+24,PH+2*FB+24,RO+12,40),1.5),'rgba(255,240,250,.5)',3);f.setLineDash([]);
  // buttons at the corners
  [[PX-FB/2,PY-FB/2,'#ff6f9f'],[PX+PW+FB/2,PY-FB/2,'#5fc2ff'],[PX+PW+FB/2,PY+PH+FB/2,'#ffcf2e'],[PX-FB/2,PY+PH+FB/2,'#7bd88a']].forEach(([x,y,cc])=>{ink(f,S.blob(x,y,26,26,{n:28}),cc,5);
    str(f,S.blob(x,y,19,19,{n:24}),'rgba(0,0,0,.25)',2.5);[[-6,-6],[6,-6],[-6,6],[6,6]].forEach(([a,bq])=>dot(f,x+a,y+bq,3.5,'#2a1f3a'));str(f,new Path2D(`M${x-6},${y-6} L${x+6},${y+6} M${x+6},${y-6} L${x-6},${y+6}`),'#fff',2)});
  // big stitched heart at bottom centre, little bow at top centre
  hp(f,st.heart,CX,PY+PH+FB*.6,42,0,S.hatch('#ff6f9f',['#ff4f86','#ffa3c4'],24,8,3),5);
  // fairy-light strings across the top
  st.bulbs=[];const strP=new Path2D();for(let s=0;s<6;s++){const x0=s*320,x1=x0+320,y0=14,sag=s==0||s==5?40:34;const pts=[];
    for(let k=0;k<=32;k++){const t=k/32,x=x0+(x1-x0)*t,y=y0+sag*4*t*(1-t);pts.push([x,y])}strP.addPath(new Path2D(sm(pts)));
    for(let k=1;k<8;k++){const t=k/8,x=x0+(x1-x0)*t,y=y0+sag*4*t*(1-t);st.bulbs.push({x,y:y+10,c:['#ffd56a','#ff9ec0','#a8f0d0','#c9b8ff'][(s*7+k)%4],ph:(s*7+k)*.13%1})}}
  str(f,strP,'rgba(210,200,240,.75)',3);
  st.hang=[[118,170,0],[238,250,.3],[1880,400,.15]].map(([x,len,ph])=>({x,y:14+40*4*(x%320/320)*(1-x%320/320),len,ph}));
  /* ---- moving bits ---- */
  const mR=108,d=52,mr=96,ix=(d*d+mR*mR-mr*mr)/(2*d),iy=Math.sqrt(mR*mR-ix*ix),a1=Math.atan2(iy,ix),b1=Math.atan2(-iy,ix-d);
  st.moon=new Path2D();st.moon.arc(0,0,mR,a1,TAU-a1,false);st.moon.arc(d,0,mr,b1,-b1,true);st.moon.closePath();
  st.moonF=S.hatch('#ffe58a',['#ffd84a','#fff3b8','#ffcf3a'],30,10,3);
  st.star5=S.smooth(Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,r=i%2?12:28;return [Math.cos(a)*r,Math.sin(a)*r]}));st.starF=S.hatch('#ffe14a',['#fff3a0','#ffc61a'],22,8,2.5);
  st.tw=[];for(let i=0;i<70;i++){let x=S.R(0,W),y=S.R(0,780);if(x>PX-60&&x<PX+PW+60&&y>PY-60)y=S.R(0,PY-70);st.tw.push({x,y,s:S.R(.5,1.1),ph:S.R(0,1),sec:S.pick([3,4,5,6])})}
  st.spark=S.starPath(14,3.5,4);
  st.gGold=glowSprite('rgba(255,220,120,.9)',48);st.bulbG=['#ffd56a','#ff9ec0','#a8f0d0','#c9b8ff'].reduce((o,cc)=>{const n=parseInt(cc.slice(1),16);o[cc]=glowSprite(`rgba(${n>>16},${n>>8&255},${n&255},.8)`,40);return o},{});
  st.ff=[];for(let i=0;i<30;i++){const x=i%3==0?S.R(420,1500):(i%2?S.R(20,330):S.R(1590,1900)),y=i%3==0?S.R(860,1060):S.R(520,1040);st.ff.push({x,y,ph:S.R(0,1),ph2:S.R(0,1),sec:S.pick([9,12,16]),sec2:S.pick([7,10,13])})}
  st.owlB=S.blob(0,-58,46,58,{jit:.03});st.owlF=S.hatch('#a8784f',['#8f603a','#c4956a'],30,9,3);st.owlBelly=S.blob(0,-44,30,38,{jit:.04});
  st.owletB=S.blob(0,-38,30,38,{jit:.03});st.owletF=S.hatch('#c9b8a8',['#b3a090','#e3d6c8'],26,9,3);
  st.rab=S.blob(0,-50,44,52,{jit:.03});st.rabH=S.blob(0,-118,34,30,{jit:.03});st.ear=new Path2D('M0,0 C-14,-30 -12,-80 0,-92 C12,-80 14,-30 0,0Z');st.earIn=new Path2D('M0,-10 C-6,-34 -6,-70 0,-80 C6,-70 6,-34 0,-10Z');
  st.eyeW=new Path2D('M14,0 A14,14 0 1,1 -14,0 A14,14 0 1,1 14,0Z');st.tailR=S.blob(-42,-24,14,13,{n:16});st.belly=S.blob(0,-40,26,32,{n:20});st.rabF=S.hatch('#f4f0ff',['#ddd4f2','#ffffff'],30,8,3);
},
draw(S){const c=S.ctx,st=S.state;c.drawImage(st.bg,0,0);
  // twinkling stars
  st.tw.forEach(t=>{const a=.25+.75*S.pulse(t.sec,t.ph,2);c.globalAlpha=a;S.at(t.x,t.y,0,t.s*(.7+.3*a),()=>{c.fillStyle='#fff6cf';c.fill(st.spark)});c.globalAlpha=1});
  // shooting star (once every ~36 s)
  const ss=S.saw(36,.3);if(ss<.08){const k=ss/.08,x=430+k*640,y=24+k*30;const g=c.createLinearGradient(x-200,y-10,x,y);g.addColorStop(0,'rgba(255,240,200,0)');g.addColorStop(1,`rgba(255,250,220,${.9*(1-k*.6)})`);
    c.strokeStyle=g;c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(x-200,y-10);c.lineTo(x,y);c.stroke();dot(c,x,y,4,'#fffbe0')}
  // mother moon cradling a little star
  S.at(1745,175,-.35+S.osc(20)*.05,1,()=>{ink(c,st.moon,st.moonF,7);str(c,new Path2D('M-78,-18 q12,12 26,0'),'#7a4a12',6);str(c,new Path2D('M-74,26 q16,16 34,2'),'#7a4a12',6);dot(c,-86,8,11,'rgba(255,140,120,.55)')});
  const tws=S.osc01(2.6);c.drawImage(st.gGold,1712-60,215-60,120,120);S.at(1712,215,.25+S.osc(5)*.08,.95+.08*tws,()=>{ink(c,st.star5,st.starF,5);dot(c,-6,-2,2.5);dot(c,6,-2,2.5);str(c,new Path2D('M-5,6 q5,4 10,0'),INK,2.5)});
  S.photoWindow(PX,PY,PW,PH,PR);
  c.drawImage(st.fr,0,0);
  // fairy-light bulbs
  st.bulbs.forEach(bl=>{const a=.45+.55*S.osc01(3,bl.ph);c.globalAlpha=a;c.drawImage(st.bulbG[bl.c],bl.x-34,bl.y-30,68,68);c.globalAlpha=1;
    c.fillStyle=bl.c;c.strokeStyle='#1a1438';c.lineWidth=3;c.beginPath();c.ellipse(bl.x,bl.y+4,7,10,0,0,TAU);c.fill();c.stroke();c.fillStyle='#1a1438';c.fillRect(bl.x-4,bl.y-8,8,6)});
  // hanging crayon stars
  st.hang.forEach(h=>S.at(h.x,h.y,S.osc(6,h.ph)*.09,1,()=>{c.strokeStyle='rgba(255,240,210,.7)';c.lineWidth=2;c.beginPath();c.moveTo(0,0);c.lineTo(0,h.len);c.stroke();
    S.at(0,h.len+24,S.osc(4,h.ph)*.15,1.1,()=>ink(c,st.star5,st.starF,5))}));
  // owl family on the branch
  const blink=S.pulse(5,.1,40)>.35,blink2=S.pulse(4,.6,40)>.35;
  S.at(150,462,S.osc(8)*.03,1,()=>{ink(c,new Path2D('M-30,-104 L-40,-130 L-14,-112Z M30,-104 L40,-130 L14,-112Z'),'#8f603a',4);ink(c,st.owlB,st.owlF,6);ink(c,st.owlBelly,'#f3dfc0',4);
    for(let k=0;k<3;k++)str(c,new Path2D(`M${-14+k*14},-40 l-5,6 M${-14+k*14},-20 l-5,6`),'#b08a5a',3);
    [-18,18].forEach(x=>{c.save();c.translate(x,-82);ink(c,st.eyeW,'#fffbe8',4);
      if(blink)str(c,new Path2D('M-11,0 Q0,7 11,0'),INK,4);else{dot(c,2,1,7);dot(c,4,-2,2.4,'#fff')}c.restore()});
    ink(c,new Path2D('M-7,-70 L7,-70 L0,-58Z'),'#ffb300',3);ink(c,new Path2D('M34,-70 Q66,-46 46,-14 Q36,-40 30,-50Z'),'#8f603a',4);
    str(c,new Path2D('M-12,0 l-6,8 M-4,0 l0,9 M12,0 l6,8 M4,0 l0,9'),'#ffb300',4)});
  S.at(250,452,S.osc(4.5,.3)*.1,1,()=>{ink(c,st.owletB,st.owletF,5);ink(c,new Path2D('M-20,-66 L-24,-82 L-8,-72Z M20,-66 L24,-82 L8,-72Z'),'#b3a090',3.5);
    [-11,11].forEach(x=>{c.save();c.translate(x,-48);ink(c,st.eyeW,'#fffbe8',3.5);if(blink2)str(c,new Path2D('M-9,0 Q0,6 9,0'),INK,3.5);else{dot(c,1,1,6);dot(c,3,-2,2,'#fff')}c.restore()});
    ink(c,new Path2D('M-5,-36 L5,-36 L0,-28Z'),'#ffb300',2.5);dot(c,-18,-32,5,'rgba(255,140,160,.6)');dot(c,18,-32,5,'rgba(255,140,160,.6)')});
  // fireflies
  st.ff.forEach(fl=>{const x=fl.x+S.osc(fl.sec,fl.ph)*50,y=fl.y+S.osc(fl.sec2,fl.ph2)*34,a=.3+.7*S.pulse(4,fl.ph,2);c.globalAlpha=a;c.drawImage(st.gGold,x-22,y-22,44,44);c.globalAlpha=1;dot(c,x,y,3.2,'#fff6b0')});
  // mother rabbit and bunny on the hill (right), looking up at the moon
  const hop=Math.max(0,S.osc(3.5));
  [[1700,1000,1,0,0],[1810,1012-hop*22,.6,.4,1]].forEach(([x,y,s,ph,isB])=>S.at(x,y,0,s,()=>{
    [-1,1].forEach(sd=>S.at(sd*16,-138,sd*(.22+S.osc(isB?2.2:5,ph+sd*.1)*.06),1,()=>{ink(c,st.ear,st.rabF,5);c.fillStyle='#ffb3c7';c.fill(st.earIn)}));
    ink(c,st.tailR,'#fff',4);ink(c,st.rab,st.rabF,6);ink(c,st.belly,'#fff',0);ink(c,st.rabH,st.rabF,6);
    dot(c,-12,-122,4.5);dot(c,12,-122,4.5);dot(c,-10.5,-123.5,1.6,'#fff');dot(c,13.5,-123.5,1.6,'#fff');ink(c,new Path2D('M-5,-110 L5,-110 L0,-104Z'),'#ff7aa6',2.5);
    str(c,new Path2D('M0,-104 Q-6,-98 -10,-100 M0,-104 Q6,-98 10,-100'),INK,2.5);dot(c,-22,-108,6,'rgba(255,140,170,.6)');dot(c,22,-108,6,'rgba(255,140,170,.6)');
    str(c,new Path2D('M-18,-6 q-6,6 -16,4 M18,-6 q6,6 16,4'),INK,4)}));
  hp(c,st.heart,1752,904-S.saw(5)*60,14*(1-S.saw(5)*.4),0,`rgba(255,120,170,${1-S.saw(5)})`,0);
}});
})();
