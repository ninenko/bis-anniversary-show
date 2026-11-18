/* Grade 8 - Music performance, "measure our lives in love" (120 s). Round 2 rebuild. */
(function(){
const TAU=Math.PI*2,W=1920,H=1080;
const mk=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),c);return c};
function glowSprite(r,rgb,a0=1,mid=.35){return mk(r*2,r*2,x=>{const g=x.createRadialGradient(r,r,0,r,r,r);
  g.addColorStop(0,`rgba(${rgb},${a0})`);g.addColorStop(mid,`rgba(${rgb},${a0*.35})`);g.addColorStop(1,`rgba(${rgb},0)`);x.fillStyle=g;x.fillRect(0,0,r*2,r*2)})}
function grain(S,ctx){const c=mk(256,256,x=>{const d=x.createImageData(256,256);for(let i=0;i<d.data.length;i+=4){const v=S.rnd()*255|0;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}x.putImageData(d,0,0)});return ctx.createPattern(c,'repeat')}
function ridge(S,n,rough){const a=new Array(n+1).fill(0);a[0]=S.R(-1,1);a[n]=S.R(-1,1);let step=n,amp=1;
  while(step>1){const h=step/2;for(let i=h;i<n;i+=step)a[i]=(a[i-h]+a[i+h])/2+S.R(-amp,amp);step=h;amp*=rough}return a}
function radial(x,cx,cy,r,stops,sy=1){x.save();x.translate(cx,cy);x.scale(1,sy);const g=x.createRadialGradient(0,0,0,0,0,r);stops.forEach(s=>g.addColorStop(s[0],s[1]));x.fillStyle=g;x.fillRect(-r,-r,2*r,2*r);x.restore()}
function vgrad(x,y0,y1,stops){const g=x.createLinearGradient(0,y0,0,y1);stops.forEach(s=>g.addColorStop(s[0],s[1]));return g}

/* =====================================================================
   1: PAPER HEARTS - origami hearts and cranes turning in warm light
   ===================================================================== */
BIS.scene('g8-1',{title:'Paper Hearts',blurb:'Origami paper hearts and cranes hang on fine threads and drift down, slowly turning in warm golden light.',
 setup(S){const st=S.state;
  // ---- origami sprites: facets in unit coords, drawn at 80px per unit
  const HEART=[ // [points, shade]
   [[[0,1],[-1,.05],[-.42,-.12]],0],[[[0,1],[-.42,-.12],[0,-.35]],.18],[[[-1,.05],[-1,-.38],[-.42,-.12]],-.12],
   [[[-1,-.38],[-.68,-.68],[-.42,-.12]],.28],[[[-.68,-.68],[-.3,-.68],[-.42,-.12]],.1],[[[-.3,-.68],[0,-.35],[-.42,-.12]],-.05],
   [[[0,1],[1,.05],[.42,-.12]],-.2],[[[0,1],[.42,-.12],[0,-.35]],-.06],[[[1,.05],[1,-.38],[.42,-.12]],-.3],
   [[[1,-.38],[.68,-.68],[.42,-.12]],.05],[[[.68,-.68],[.3,-.68],[.42,-.12]],-.1],[[[.3,-.68],[0,-.35],[.42,-.12]],-.22]];
  const CRANE=[
   [[[-.08,.05],[-.9,-.78],[-.3,.16]],.22],[[[-.08,.05],[-.3,.16],[-.05,.22]],-.1],
   [[[.08,.05],[.82,-.9],[.3,.15]],-.05],[[[.08,.05],[.3,.15],[.05,.22]],-.25],
   [[[-.42,.14],[0,-.02],[0,.36]],.08],[[[.42,.14],[0,-.02],[0,.36]],-.18],
   [[[-.3,.2],[-.98,-.2],[-.24,.28]],.15],[[[-.98,-.2],[-1.12,-.06],[-.9,-.12]],0],
   [[[.3,.2],[1.02,-.3],[.26,.3]],-.12]];
  const shade=(hex,k)=>{const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;
   const t=k>0?255:40;const a=Math.abs(k);return `rgb(${Math.round(r+(t-r)*a)},${Math.round(g+(t-g)*a)},${Math.round(b+(t-b)*a)})`};
  const R0=110;
  const sprite=(facets,col,back,blur)=>mk(R0*2,R0*2,x=>{
   const draw=y=>{y.translate(R0,R0);y.scale(80,80);y.lineJoin='round';
    for(const [pts,k] of facets){y.beginPath();pts.forEach((q,i)=>i?y.lineTo(q[0],q[1]):y.moveTo(q[0],q[1]));y.closePath();
     y.fillStyle=shade(col,back?k*.6-.18:k);y.fill();y.lineWidth=.012;y.strokeStyle=shade(col,back?-.3:-.18);y.stroke()}};
   if(!blur){draw(x);return}
   const t=mk(R0*2,R0*2,draw);x.filter=`blur(${blur}px)`;x.drawImage(t,0,0);x.filter='none'});
  const PAL=['#e9a0a8','#d9707f','#f3d9c4','#e6bf7a','#f2b9b4','#c95a6c'];
  st.R0=R0;st.spr={};
  for(const [kind,fac] of [['h',HEART],['c',CRANE]])for(let ci=0;ci<PAL.length;ci++)for(const b of [0,4,12]){
   st.spr[`${kind}${ci}f${b}`]=sprite(fac,PAL[ci],false,b);st.spr[`${kind}${ci}b${b}`]=sprite(fac,PAL[ci],true,b)}
  // ---- background plate: warm paper-cream room light
  st.bg=mk(W,H,x=>{
   x.fillStyle=vgrad(x,0,H,[[0,'#f3e2d3'],[.45,'#ecc9bd'],[.8,'#d9a1a0'],[1,'#b9787f']]);x.fillRect(0,0,W,H);
   radial(x,380,120,1300,[[0,'rgba(255,236,190,.95)'],[.3,'rgba(255,220,170,.45)'],[1,'rgba(255,210,170,0)']],.8);
   radial(x,1650,300,700,[[0,'rgba(255,200,200,.35)'],[1,'rgba(255,200,200,0)']]);
   // soft bokeh field (out-of-focus lights far behind)
   const bk=mk(W,H,y=>{for(let i=0;i<110;i++){const r=S.R(18,90),bx=S.R(0,W),by=Math.pow(S.rnd(),1.3)*H*.85;
     const col=S.pick(['255,240,210','255,214,170','255,190,190','255,250,235']),a=S.R(.08,.28)*(1-by/H*.6);
     y.fillStyle=`rgba(${col},${a})`;y.beginPath();y.arc(bx,by,r,0,TAU);y.fill();y.strokeStyle=`rgba(${col},${a*.9})`;y.lineWidth=2.5;y.stroke()}});
   x.filter='blur(5px)';x.drawImage(bk,0,0);x.filter='none';
   // fallen hearts resting at the bottom, out of focus
   const fl=mk(W,H,y=>{for(let i=0;i<70;i++){const X=S.R(-40,W+40),Y=S.R(985,1090),s=S.R(.35,.75)*(1+(Y-985)/150);
     const kind=S.rnd()<.8?'h':'c',ci=S.RI(0,PAL.length-1);y.save();y.translate(X,Y);y.rotate(S.R(-.9,.9));y.scale(s,s*.55);y.drawImage(st.spr[`${kind}${ci}f0`],-R0,-R0);y.restore()}});
   x.fillStyle=vgrad(x,900,H,[[0,'rgba(150,80,90,0)'],[1,'rgba(150,80,90,.35)']]);x.fillRect(0,900,W,180);
   x.filter='blur(3px)';x.drawImage(fl,0,0);x.filter='none';
   radial(x,960,540,1250,[[.5,'rgba(0,0,0,0)'],[1,'rgba(90,30,45,.45)']],.65);
  });
  // diagonal light shafts from the upper left
  const rays0=mk(W,H,x=>{x.globalCompositeOperation='lighter';
   for(let i=0;i<9;i++){const x0=S.R(-300,900),w=S.R(40,170),len=1900;x.save();x.translate(x0,-60);x.rotate(-.55);
     const g=x.createLinearGradient(0,0,0,len);g.addColorStop(0,'rgba(255,240,205,.22)');g.addColorStop(.6,'rgba(255,230,200,.06)');g.addColorStop(1,'rgba(255,230,200,0)');
     x.fillStyle=g;x.beginPath();x.moveTo(-w/2,0);x.lineTo(w/2,0);x.lineTo(w*1.4,len);x.lineTo(-w*1.4,len);x.fill();x.restore()}});
  st.rays=mk(W,H,x=>{x.filter='blur(18px)';x.drawImage(rays0,0,0);x.filter='none'});
  // ---- hanging strands (mobile of hearts and cranes), mid focus = sharp
  const kinds=()=>S.rnd()<.6?'h':'c';
  st.strands=[[150,520,.8],[390,380,.9],[640,600,.85],[960,280,2.05],[1270,560,.85],[1530,420,.9],[1780,580,.8]].map(([X,len,sc])=>{
   const items=[];if(sc>1){items.push({d:len,kind:'h',ci:1,sc,spin:30,ph:S.rnd()})}
   else{for(let dd=110;dd<=len;dd+=S.R(95,130))items.push({d:dd,kind:kinds(),ci:S.RI(0,PAL.length-1),sc:sc*S.R(.75,1),spin:S.pick([15,20,24,30]),ph:S.rnd()})}
   return{X,len,items,sec:S.pick([10,12,15]),ph:S.rnd(),amp:S.R(.02,.04)}});
  // ---- falling pieces at three depths
  st.fall=Array.from({length:52},()=>{const z=S.rnd();const layer=z<.45?0:z<.9?1:2;
   return{x:S.R(0,W),y:S.R(0,H),layer,blur:[4,0,12][layer],sc:[S.R(.32,.45),S.R(.55,.8),S.R(1.2,1.6)][layer],a:[.55,.95,.55][layer],
    sec:layer===2?S.pick([20,24,30]):layer===1?S.pick([30,40]):S.pick([40,60]),sw:S.R(30,90),swsec:S.pick([10,12,15,20]),
    spin:S.pick([6,8,10,12]),kind:S.rnd()<.65?'h':'c',ci:S.RI(0,PAL.length-1),ph:S.rnd(),tilt:S.R(-.4,.4)}}).sort((a,b)=>[0,1,2].indexOf(a.layer)-[0,1,2].indexOf(b.layer));
  st.bokeh=Array.from({length:26},()=>({x:S.R(0,W),y:S.R(0,H*.8),r:S.R(40,130),sec:S.pick([60,120]),ph:S.rnd(),col:S.pick(['255,235,200','255,200,190','255,222,160'])}));
  st.dust=Array.from({length:140},()=>({x:S.R(0,W),y:S.R(0,H),r:S.R(.8,2.4),sec:S.pick([40,60,120]),sw:S.R(10,40),ph:S.rnd(),tw:S.pick([3,4,5,6])}));
  st.bglow=glowSprite(64,'255,240,215',1,.5);
  st.grain=grain(S,S.ctx);
 },
 draw(S){const c=S.ctx,st=S.state,R0=st.R0;
  c.globalAlpha=1;c.globalCompositeOperation='source-over';c.drawImage(st.bg,0,0);
  c.globalCompositeOperation='lighter';c.globalAlpha=.42+.18*S.osc(24);c.drawImage(st.rays,0,0);
  for(const b of st.bokeh){c.globalAlpha=.16+.1*S.osc(12,b.ph);const x=S.wrap(b.x,b.sec,W,b.r);c.drawImage(st.bglow,x-b.r,b.y+S.osc(30,b.ph)*20-b.r,b.r*2,b.r*2)}
  c.globalCompositeOperation='source-over';
  // turning paper piece: front/back sprite by the sign of cos
  const piece=(x,y,kind,ci,blur,sc,turn,tilt,a)=>{const cs=Math.cos(turn),sx=Math.max(.06,Math.abs(cs));
   const img=st.spr[`${kind}${ci}${cs>=0?'f':'b'}${blur}`];c.globalAlpha=a;
   const ct=Math.cos(tilt),stn=Math.sin(tilt);c.setTransform(ct*sc*sx,stn*sc*sx,-stn*sc,ct*sc,x,y);c.drawImage(img,-R0,-R0);c.setTransform(1,0,0,1,0,0)};
  const fall=f=>{const y=S.wrap(f.y,f.sec,H,140*f.sc),x=f.x+S.osc(f.swsec,f.ph)*f.sw;
   piece(x,y,f.kind,f.ci,f.blur,f.sc,TAU*S.saw(f.spin,f.ph),f.tilt+.25*S.osc(f.swsec,f.ph+.25),f.a)};
  for(const f of st.fall)if(f.layer===0)fall(f);
  // threads + hanging pieces
  for(const s of st.strands){const ang=s.amp*S.osc(s.sec,s.ph),sa=Math.sin(ang),ca=Math.cos(ang);
   c.globalAlpha=.55;c.strokeStyle='#b88a5a';c.lineWidth=1.3;c.beginPath();c.moveTo(s.X,-10);c.lineTo(s.X-sa*s.len,ca*s.len);c.stroke();
   for(const it of s.items){const px=s.X-sa*it.d,py=it.d*ca;piece(px,py+46*it.sc,it.kind,it.ci,0,it.sc,TAU*S.saw(it.spin,it.ph),-ang,1)}}
  for(const f of st.fall)if(f.layer===1)fall(f);
  c.globalCompositeOperation='lighter';c.fillStyle='rgb(255,236,200)';
  for(const d of st.dust){const y=S.wrap(d.y,d.sec,H,10,-1),x=d.x+S.osc(d.sec/2,d.ph)*d.sw;c.globalAlpha=.12+.45*S.osc01(d.tw,d.ph);c.beginPath();c.arc(x,y,d.r,0,TAU);c.fill()}
  c.globalCompositeOperation='source-over';
  for(const f of st.fall)if(f.layer===2)fall(f);
  c.globalAlpha=.035;c.fillStyle=st.grain;c.fillRect(0,0,W,H);c.globalAlpha=1;
 }});

/* =====================================================================
   2: HEARTSTRINGS - a heart woven from vibrating golden strings
   ===================================================================== */
BIS.scene('g8-2',{title:'Heartstrings',blurb:'A heart made of glowing, gently vibrating golden strings breathes slowly in a deep wine-red space.',
 setup(S){const st=S.state;st.cx=960;st.cy=440;st.sc=19;
  st.bg=mk(W,H,x=>{x.fillStyle='#0d0207';x.fillRect(0,0,W,H);
   radial(x,960,420,1150,[[0,'#6a1734'],[.35,'#3d0b20'],[.7,'#1a040e'],[1,'rgba(13,2,7,0)']],.8);
   radial(x,960,1100,900,[[0,'rgba(150,40,70,.35)'],[1,'rgba(150,40,70,0)']],.35);
   for(let i=0;i<46;i++){const r=S.R(20,120),gx=S.R(0,W),gy=S.R(0,H);const col=S.pick(['255,170,150','255,120,150','255,210,160']);
     radial(x,gx,gy,r,[[0,`rgba(${col},${S.R(.03,.09)})`],[.8,`rgba(${col},${S.R(.02,.05)})`],[1,`rgba(${col},0)`]])}
   radial(x,960,540,1300,[[.55,'rgba(0,0,0,0)'],[1,'rgba(0,0,0,.7)']],.62);
  });
  // light rays, 12-fold symmetric so a 1/12 turn per loop is seamless
  st.rays=mk(2400,2400,x=>{x.translate(1200,1200);const ws=[.035,.018,.026];
   for(let i=0;i<36;i++){const a=i/36*TAU,w=ws[i%3];const g=x.createRadialGradient(0,0,0,0,0,1200);g.addColorStop(0,'rgba(255,190,170,.16)');g.addColorStop(.5,'rgba(255,120,150,.05)');g.addColorStop(1,'rgba(255,120,150,0)');
     x.fillStyle=g;x.beginPath();x.moveTo(0,0);x.arc(0,0,1200,a-w,a+w);x.closePath();x.fill()}});
  st.glow=glowSprite(128,'255,170,150',1,.3);st.spark=glowSprite(32,'255,240,215',1,.25);
  // heart outline samples (unit), with outward normals via radial direction from centroid
  const N=st.N=200;st.hx=new Float32Array(N);st.hy=new Float32Array(N);
  for(let i=0;i<N;i++){const t=i/N*TAU;st.hx[i]=16*Math.pow(Math.sin(t),3);st.hy[i]=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))-2.5}
  const C=st.C=26;st.cont=[];
  for(let i=0;i<C;i++){const u=i/(C-1);st.cont.push({k:.3+u*1.45,u,m:S.RI(3,7),m2:S.RI(9,14),a:.01+.03*u,a2:.004+.008*u,sec:S.pick([15,20,24,30,40]),dir:S.rnd()<.5?-1:1,ph:S.rnd(),ph2:S.rnd()})}
  st.sparks=Array.from({length:12},(_,i)=>({ci:S.RI(2,C-6),sec:S.pick([20,24,30,40]),ph:S.rnd(),dir:i%2?1:-1}));
  st.dust=Array.from({length:150},()=>({x:S.R(0,W),y:S.R(0,H),r:S.R(.8,2.6),sec:S.pick([40,60,120]),sw:S.R(10,40),ph:S.rnd(),tw:S.pick([3,4,5,6])}));
  st.strings=Array.from({length:7},(_,j)=>({y:830+j*30,n:S.RI(2,5),sec:S.pick([6,8,10]),ph:S.rnd(),psec:S.pick([12,15,20]),pph:S.rnd()}));
  st.grain=grain(S,S.ctx);
 },
 draw(S){const c=S.ctx,st=S.state,cx=st.cx,cy=st.cy,N=st.N;
  c.globalAlpha=1;c.globalCompositeOperation='source-over';c.drawImage(st.bg,0,0);
  c.globalCompositeOperation='lighter';
  const breath=S.osc01(5);
  c.save();c.translate(cx,cy);c.rotate(S.p*TAU/12);c.globalAlpha=.55+.25*S.osc01(20);c.drawImage(st.rays,-1200,-1200);c.restore();
  c.globalAlpha=.28+.14*breath;c.drawImage(st.glow,cx-520,cy-500,1040,1000);
  // contours
  c.lineJoin='round';
  const pts=[];
  for(let i=0;i<st.C;i++){const o=st.cont[i];const b=1+.022*S.osc(5,-o.u*.35);const K=o.k*st.sc*b;
   const ph=TAU*(o.dir*S.saw(o.sec,o.ph)),ph2=TAU*(-o.dir*S.saw(o.sec*.5,o.ph2));
   const xs=new Float32Array(N),ys=new Float32Array(N);
   c.beginPath();
   for(let j=0;j<N;j++){const t=j/N*TAU;const d=1+o.a*Math.sin(o.m*t+ph)+o.a2*Math.sin(o.m2*t+ph2);const X=cx+st.hx[j]*K*d,Y=cy+st.hy[j]*K*d;xs[j]=X;ys[j]=Y;j?c.lineTo(X,Y):c.moveTo(X,Y)}
   c.closePath();pts.push([xs,ys]);
   const u=o.u,inner=1-u;
   c.strokeStyle=`rgb(255,${Math.round(110+120*inner)},${Math.round(140+40*inner)})`;
   c.globalAlpha=(.13+.7*Math.pow(inner,1.2))*(.85+.15*breath);c.lineWidth=1.1+1.6*inner;c.stroke();
  }
  // sparks travelling along strings
  for(const s of st.sparks){const [xs,ys]=pts[s.ci];const f=S.saw(s.sec,s.ph);const j=Math.floor((s.dir>0?f:1-f)*N)%N;
   c.globalAlpha=.85;c.drawImage(st.spark,xs[j]-22,ys[j]-22,44,44);c.globalAlpha=.25;c.drawImage(st.glow,xs[j]-60,ys[j]-60,120,120)}
  // dust
  c.fillStyle='rgb(255,215,180)';
  for(const d of st.dust){const y=S.wrap(d.y,d.sec,H,20,-1),x=d.x+S.osc(d.sec/2,d.ph)*d.sw;c.globalAlpha=.15+.5*S.osc01(d.tw,d.ph);c.beginPath();c.arc(x,y,d.r,0,TAU);c.fill()}
  // vibrating strings at the bottom (a quiet staff of light)
  for(const s of st.strings){const amp=6*S.osc(s.sec,s.ph);c.beginPath();
   for(let X=0;X<=W;X+=24){const Y=s.y+amp*Math.sin(Math.PI*s.n*X/W)*Math.sin(Math.PI*X/W);X?c.lineTo(X,Y):c.moveTo(X,Y)}
   c.globalAlpha=.28;c.strokeStyle='rgb(255,170,150)';c.lineWidth=1.4;c.stroke();
   const px=S.saw(s.psec,s.pph)*W,py=s.y+amp*Math.sin(Math.PI*s.n*px/W)*Math.sin(Math.PI*px/W);
   c.globalAlpha=.5*Math.sin(Math.PI*px/W);c.drawImage(st.glow,px-90,py-30,180,60)}
  c.globalCompositeOperation='source-over';
  c.globalAlpha=.04;c.fillStyle=st.grain;c.fillRect(0,0,W,H);c.globalAlpha=1;
 }});

/* =====================================================================
   3: BLOSSOM VALLEY - a great flowering tree in a spring valley
   ===================================================================== */
BIS.scene('g8-3',{title:'Blossom Valley',blurb:'A great blossoming tree with a swing frames a sunlit spring valley below snowy peaks, petals drifting on the breeze.',
 setup(S){const st=S.state,HZ=640;
  st.sky=mk(W,H,x=>{
   x.fillStyle=vgrad(x,0,HZ+80,[[0,'#7aa2d2'],[.45,'#b4cde8'],[.8,'#f2d9d4'],[1,'#fbe6d6']]);x.fillRect(0,0,W,H);
   radial(x,1560,250,900,[[0,'rgba(255,250,230,.95)'],[.08,'rgba(255,240,210,.7)'],[.35,'rgba(255,225,200,.25)'],[1,'rgba(255,220,200,0)']]);
   // god rays
   x.save();x.translate(1560,250);x.globalCompositeOperation='lighter';
   for(let i=0;i<22;i++){const a=S.R(Math.PI*.52,Math.PI*.9),w=S.R(.01,.035);const g=x.createRadialGradient(0,0,0,0,0,1500);g.addColorStop(0,'rgba(255,245,225,.16)');g.addColorStop(1,'rgba(255,245,225,0)');x.fillStyle=g;x.beginPath();x.moveTo(0,0);x.arc(0,0,1500,a-w,a+w);x.closePath();x.fill()}
   x.restore();
   // snowy peaks
   const a=ridge(S,256,.56),pts=[];
   for(let i=0;i<=256;i++){const X=i*W/256,e=Math.exp(-Math.pow((X-1600)/380,2))*330+Math.exp(-Math.pow((X-1150)/260,2))*170+70;pts.push([X,HZ-50-e*(.92+.22*a[i])])}
   const mp=new Path2D();mp.moveTo(0,HZ+40);pts.forEach(q=>mp.lineTo(q[0],q[1]));mp.lineTo(W,HZ+40);mp.closePath();
   x.fillStyle=vgrad(x,320,HZ+40,[[0,'#9aa6cf'],[1,'#c9c3dc']]);x.fill(mp);
   x.save();x.clip(mp);
   // snow: above a ragged snowline, lit on the right faces
   const sn=ridge(S,128,.6);x.beginPath();x.moveTo(0,0);for(let i=0;i<=128;i++){const X=i*W/128;x.lineTo(X,HZ-150+sn[i]*40-Math.exp(-Math.pow((X-1600)/380,2))*170-Math.exp(-Math.pow((X-1150)/260,2))*75)}x.lineTo(W,0);x.closePath();
   x.fillStyle=vgrad(x,300,HZ-80,[[0,'#fbf8ff'],[1,'#dcd8ee']]);x.fill();
   for(let i=1;i<256;i++){const [X,Y]=pts[i],nY=pts[i+1][1];if(nY>Y){x.fillStyle='rgba(80,90,150,.06)';x.beginPath();x.moveTo(X,Y);x.lineTo(X+7.5,nY);x.lineTo(X+7.5+80,HZ+40);x.lineTo(X+60,HZ+40);x.fill()}}
   x.fillStyle=vgrad(x,HZ-110,HZ+40,[[0,'rgba(251,230,214,0)'],[1,'rgba(251,230,214,.8)']]);x.fillRect(0,HZ-110,W,150);x.restore();
   const pop=(X,y,h,w)=>{x.beginPath();x.moveTo(X,y-h);x.bezierCurveTo(X+w*1.3,y-h*.6,X+w*1.1,y-h*.1,X,y);x.bezierCurveTo(X-w*1.1,y-h*.1,X-w*1.3,y-h*.6,X,y-h);x.fill()};
   // rolling hills with poplar rows
   const hill=(base,amp,f,ph,fill,haze)=>{const p=new Path2D();p.moveTo(0,H);for(let X=0;X<=W;X+=10)p.lineTo(X,base+Math.sin(X*f+ph)*amp+Math.sin(X*f*2.7+ph*2)*amp*.3);p.lineTo(W,H);p.closePath();x.fillStyle=fill;x.fill(p);
     x.save();x.clip(p);x.fillStyle=vgrad(x,base-amp,base+120,[[0,haze],[1,'rgba(0,0,0,0)']]);x.fillRect(0,base-amp*1.3,W,200);x.restore();return X=>base+Math.sin(X*f+ph)*amp+Math.sin(X*f*2.7+ph*2)*amp*.3};
   const h1=hill(HZ+30,26,.0035,1,'#a9c79c','rgba(250,230,220,.6)');
   for(let X=60;X<W;X+=S.R(10,26)){if(S.rnd()<.45)continue;const y=h1(X)+6,h=S.R(30,62);x.fillStyle=S.pick(['#7c9a8c','#849f92','#738f86']);pop(X,y,h,h*.13)}
   const h2=hill(HZ+120,34,.0028,3.3,'#8db97e','rgba(250,235,215,.45)');
   for(let X=900;X<W;X+=S.R(16,30)){if(S.rnd()<.3)continue;const y=h2(X)+8,h=S.R(60,110);x.fillStyle=S.pick(['#4f7a5c','#5a8664','#466f55']);pop(X,y,h,h*.12);x.fillStyle='rgba(255,236,200,.28)';pop(X+h*.04,y,h*.94,h*.05)}
   // foreground meadow
   const m=hill(900,30,.002,.4,'#6fa45f','rgba(255,235,200,.35)');
   x.fillStyle=vgrad(x,880,H,[[0,'rgba(0,0,0,0)'],[1,'rgba(40,70,40,.45)']]);x.fillRect(0,880,W,200);
   x.lineCap='round';
   for(let i=0;i<2600;i++){const X=S.R(0,W),y0=m(X),Y=S.R(y0+4,H+10),h=S.R(6,18)*(1+(Y-900)/180);x.strokeStyle=S.pick(['#5b9150','#7cb46a','#4d7f45','#8cc47a']);x.lineWidth=S.R(1,2.4);x.beginPath();x.moveTo(X,Y);x.lineTo(X+S.R(-5,5),Y-h);x.stroke()}
   for(let i=0;i<900;i++){const X=S.R(0,W),Y=S.R(m(X)+8,H),r=S.R(1.5,4)*(1+(Y-900)/250);x.fillStyle=S.pick(['#fde2ec','#f5a9c1','#fff6c8','#ffffff','#f7c9d8']);x.beginPath();x.arc(X,Y,r,0,TAU);x.fill()}
  });
  // ---- the tree
  const segs=[],tips=[];
  const grow=(x0,y0,a,len,w,d,maxD)=>{const bend=S.R(-.25,.25),x1=x0+Math.cos(a)*len,y1=y0+Math.sin(a)*len,mx=(x0+x1)/2+Math.cos(a+Math.PI/2)*len*bend*.3,my=(y0+y1)/2+Math.sin(a+Math.PI/2)*len*bend*.3;
   segs.push({x0,y0,mx,my,x1,y1,w0:w,w1:w*.72,d});if(d>=maxD||len<16){tips.push([x1,y1]);return}
   if(d>=3)tips.push([mx,my]);
   const n=S.rnd()<.3?3:2;for(let i=0;i<n;i++){let na=a+(n===2?(i?1:-1)*S.R(.25,.6):(i-1)*S.R(.4,.6));na+=(-Math.PI/2-na)*.08;grow(x1,y1,na,len*S.R(.72,.86),w*.7,d+1,maxD)}};
  // trunk (hand-shaped) then crown
  segs.push({x0:300,y0:1010,mx:300,my:820,x1:420,y1:640,w0:96,w1:66,d:0});
  segs.push({x0:420,y0:640,mx:500,my:520,x1:470,y1:430,w0:66,w1:48,d:0});
  grow(470,430,-1.9,170,44,1,8);grow(470,430,-1.25,190,42,1,8);grow(430,600,-2.6,180,36,1,7);
  // long swing branch reaching right
  const B={x0:440,y0:560,mx:780,my:340,x1:1180,y1:300};st.B=B;
  const bz=t=>[(1-t)*(1-t)*B.x0+2*(1-t)*t*B.mx+t*t*B.x1,(1-t)*(1-t)*B.y0+2*(1-t)*t*B.my+t*t*B.y1];
  for(let i=0;i<10;i++){const t0=i/10,t1=(i+1)/10,p0=bz(t0),p1=bz(t1),pm=bz((t0+t1)/2);segs.push({x0:p0[0],y0:p0[1],mx:pm[0],my:pm[1],x1:p1[0],y1:p1[1],w0:34*(1-t0*.8),w1:34*(1-t1*.8),d:2})}
  for(const t of [.18,.34,.5,.66,.8,.93]){const p=bz(t);grow(p[0],p[1],-Math.PI/2+S.R(-.6,.5),S.R(90,150),14,4,8);if(t>.4)grow(p[0],p[1],S.R(.3,1.0),S.R(60,100),9,5,8)}
  st.bz=bz;
  const drawSeg=(x,s,col)=>{x.strokeStyle=col;x.lineCap='round';const n=4;for(let k=0;k<n;k++){const t0=k/n,t1=(k+1)/n;const P=t=>[(1-t)*(1-t)*s.x0+2*(1-t)*t*s.mx+t*t*s.x1,(1-t)*(1-t)*s.y0+2*(1-t)*t*s.my+t*t*s.y1];const a=P(t0),b=P(t1);x.lineWidth=s.w0+(s.w1-s.w0)*(t0+t1)/2;x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke()}};
  const blossoms=(x,shade)=>{for(const [tx,ty] of tips){const nC=3;for(let q=0;q<nC;q++){const cx=tx+S.R(-40,40),cy=ty+S.R(-34,30);
    for(let k=0;k<16;k++){const ang=S.R(0,TAU),rr=Math.sqrt(S.rnd())*36,px=cx+Math.cos(ang)*rr,py=cy+Math.sin(ang)*rr*.8,r=S.R(4,9);
     const lit=(Math.cos(ang)*.6-Math.sin(ang)*.8)*rr/36;   // up-right faces the sun
     if(shade){x.fillStyle='rgba(176,82,120,.55)';x.beginPath();x.arc(px+3,py+7,r*1.1,0,TAU);x.fill()}
     else{x.fillStyle=lit>.35?S.pick(['#fff0f4','#ffe1ea']):lit>-.2?S.pick(['#f8c1d2','#f5b0c6','#fbd0dc']):S.pick(['#e78fae','#de7fa1','#ef9fb9']);x.globalAlpha=S.R(.8,1);x.beginPath();x.arc(px,py,r,0,TAU);x.fill();x.globalAlpha=1}}}}};
  st.trunk=mk(W,H,x=>{for(const s of segs)if(s.d<2&&s.w0>40)drawSeg(x,s,'#4a3138');
   x.globalCompositeOperation='source-atop';const hl=mk(W,H,y=>{for(const s of segs)if(s.d<2&&s.w0>40){const o=s.w0*.28;drawSeg(y,{...s,x0:s.x0+o,x1:s.x1+o*.7,mx:s.mx+o*.8,w0:s.w0*.3,w1:s.w1*.3},'#ffcdb9')}});
   const sh=mk(W,H,y=>{for(const s of segs)if(s.d<2&&s.w0>40){const o=s.w0*.28;drawSeg(y,{...s,x0:s.x0-o,x1:s.x1-o*.7,mx:s.mx-o*.8,w0:s.w0*.25,w1:s.w1*.25},'#1e0f19')}});
   x.globalAlpha=.2;x.drawImage(hl,0,0);x.globalAlpha=.28;x.drawImage(sh,0,0);x.globalAlpha=1;
   x.globalCompositeOperation='source-over';
   // shadow pool under tree
   radial(x,360,1012,300,[[0,'rgba(40,60,40,.45)'],[1,'rgba(40,60,40,0)']],.18);
   for(let i=0;i<260;i++){const X=S.R(120,900),Y=S.R(990,1075);x.fillStyle=S.pick(['#f8c1d2','#fde2ec','#efa0bb']);x.globalAlpha=S.R(.6,1);x.beginPath();x.ellipse(X,Y,S.R(2,4.5),S.R(1.2,2.4),S.R(0,TAU),0,TAU);x.fill()}x.globalAlpha=1});
  st.crown=mk(W,H,x=>{blossoms(x,true);for(const s of segs)if(!(s.d<2&&s.w0>40))drawSeg(x,s,s.d<4?'#4a3138':'#5a3d44');blossoms(x,false)});
  st.pivot=[460,560];
  // petals
  st.petal=new Path2D('M0,-1 C0.7,-0.8 0.9,0.2 0,1 C-0.9,0.2 -0.7,-0.8 0,-1Z');
  st.petals=Array.from({length:210},()=>{const z=S.rnd();return{x:S.R(0,W),y:S.R(0,H),z,s:3+z*z*9,secx:S.pick([60,120]),secy:S.pick([20,24,30,40]),sw:S.R(20,60),ph:S.rnd(),spin:S.pick([4,5,6,8]),rot:S.R(0,TAU),col:S.pick(['#fde2ec','#f8c1d2','#f5aec4','#ffffff'])}}).sort((a,b)=>a.z-b.z);
  st.clouds=Array.from({length:4},(_,i)=>{const w=S.R(260,420),h=w*.32;const cv=mk(Math.ceil(w*1.6),Math.ceil(h*2.6),x=>{x.translate(w*.1,h*.7);for(let k=0;k<26;k++){const px=w*.15+S.R(0,w),py=h*.85+S.R(-h*.35,h*.25)-Math.sin((px-w*.15)/w*Math.PI)*h*.3,r=S.R(h*.25,h*.5);
     const g=x.createRadialGradient(px,py-r*.3,0,px,py,r);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(.7,'rgba(250,236,240,.55)');g.addColorStop(1,'rgba(230,215,235,0)');x.fillStyle=g;x.beginPath();x.arc(px,py,r,0,TAU);x.fill()}});
   return{cv,x:S.R(0,W),y:S.R(90,330),sec:120/(1)}});
  st.grain=grain(S,S.ctx);st.sun=glowSprite(128,'255,245,220',1,.2);
 },
 draw(S){const c=S.ctx,st=S.state;
  c.globalAlpha=1;c.globalCompositeOperation='source-over';
  c.drawImage(st.sky,0,0);
  for(const cl of st.clouds){c.globalAlpha=.85;c.drawImage(cl.cv,S.wrap(cl.x,cl.sec,W,cl.cv.width),cl.y)}
  c.globalAlpha=1;
  c.globalCompositeOperation='lighter';c.globalAlpha=.25+.15*S.osc(20);c.drawImage(st.sun,1560-420,250-420,840,840);c.globalCompositeOperation='source-over';c.globalAlpha=1;
  // far petals (behind tree)
  const drawPetals=(lo,hi)=>{for(const p of st.petals){if(p.z<lo||p.z>=hi)continue;const x=S.wrap(p.x,p.secx,W,30)+S.osc(p.secy,p.ph)*p.sw,y=S.wrap(p.y,p.secy,H,30),a=p.rot+TAU*S.saw(p.spin,p.ph),fl=Math.cos(TAU*S.saw(p.spin*1.5,p.ph+.3));
    const s=p.s,ca=Math.cos(a)*s,sa=Math.sin(a)*s;c.setTransform(ca*.6,sa*.6,-sa*fl,ca*fl,x,y);c.globalAlpha=.9;c.fillStyle=p.col;c.fill(st.petal)}c.setTransform(1,0,0,1,0,0);c.globalAlpha=1};
  drawPetals(0,.5);
  c.drawImage(st.trunk,0,0);
  const ang=.004*S.osc(10),[px,py]=st.pivot;
  // swing (hangs from the swing branch, sways with the crown)
  const rot=(q)=>{const dx=q[0]-px,dy=q[1]-py,ca=Math.cos(ang),sa=Math.sin(ang);return[px+dx*ca-dy*sa,py+dx*sa+dy*ca]};
  const A1=rot(st.bz(.57)),A2=rot(st.bz(.69));const sw=.045*S.osc(8)+.012*S.osc(5,.2),len=360;
  const mxp=(A1[0]+A2[0])/2,myp=(A1[1]+A2[1])/2;
  const sx=mxp+Math.sin(sw)*len,sy=myp+Math.cos(sw)*len,half=(A2[0]-A1[0])/2+6;
  c.strokeStyle='#5b4a3e';c.lineWidth=3;c.beginPath();c.moveTo(A1[0],A1[1]+8);c.lineTo(sx-half+10,sy);c.moveTo(A2[0],A2[1]+8);c.lineTo(sx+half-10,sy);c.stroke();
  c.save();c.translate(sx,sy);c.rotate(-sw*.6);c.fillStyle='#6b4a36';c.fillRect(-half,-4,half*2,14);c.fillStyle='rgba(255,220,180,.35)';c.fillRect(-half,-4,half*2,3);c.restore();
  // crown with gentle sway
  c.save();c.translate(px,py);c.rotate(ang);c.translate(-px,-py);c.drawImage(st.crown,0,0);c.restore();
  drawPetals(.5,1.01);
  c.globalAlpha=.03;c.fillStyle=st.grain;c.fillRect(0,0,W,H);c.globalAlpha=1;
 }});
})();
