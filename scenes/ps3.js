/* Preschool 3 - You've Got a Friend in Me - "Friendship" - hand-drawn crayon (original visuals) */
(function(){
const INK='#1c1c1c',TAU=Math.PI*2;

/* ---------- shared crayon toolkit (all building happens in setup) ---------- */
function kit(S){
 const R=S.R,ctx=S.ctx;
 const can=(w,h)=>{const v=document.createElement('canvas');v.width=Math.ceil(w);v.height=Math.ceil(h);return v};
 const hatch=(c,base,marks,size=48,count=11,wid=3.4)=>{const v=can(size,size),x=v.getContext('2d');x.fillStyle=base;x.fillRect(0,0,size,size);x.lineCap='round';x.lineWidth=wid;x.globalAlpha=.7;
   for(let i=0;i<count;i++){const a=R(-.65,.15),l=R(7,18),px=R(0,size),py=R(0,size);x.strokeStyle=marks[i%marks.length];
     for(const dx of[-size,0,size])for(const dy of[-size,0,size]){x.beginPath();x.moveTo(px+dx,py+dy);x.lineTo(px+dx+Math.cos(a)*l,py+dy+Math.sin(a)*l);x.stroke()}}
   return c.createPattern(v,'repeat')};
 const ink=(c,p,fill,w=6,col=INK)=>{if(fill){c.fillStyle=fill;c.fill(p)}if(w){c.lineJoin=c.lineCap='round';c.strokeStyle=col;c.lineWidth=w;c.stroke(p);
   c.save();c.globalAlpha*=.4;c.translate(2.2,1.6);c.lineWidth=Math.max(1.5,w*.35);c.stroke(p);c.restore()}};
 const strk=(c,p,col,w)=>{c.lineJoin=c.lineCap='round';c.strokeStyle=col;c.lineWidth=w;c.stroke(p)};
 const P=d=>new Path2D(d);
 const circ=(x,y,r)=>{const p=new Path2D();p.arc(x,y,r,0,TAU);return p};
 const ell=(x,y,rx,ry,rot=0)=>{const p=new Path2D();p.ellipse(x,y,rx,ry,rot,0,TAU);return p};
 const rr=(x,y,w,h,r)=>{const p=new Path2D();p.roundRect(x,y,w,h,r);return p};
 const spr=(w,h,ox,oy,fn)=>{const v=can(w,h),c=v.getContext('2d');c.translate(ox,oy);fn(c);return{cv:v,ox,oy}};
 const put=(s,x,y,rot,sc,a)=>{ctx.save();ctx.translate(x,y);if(rot)ctx.rotate(rot);if(sc!=null&&sc!==1)Array.isArray(sc)?ctx.scale(sc[0],sc[1]):ctx.scale(sc,sc);if(a!=null)ctx.globalAlpha*=a;ctx.drawImage(s.cv,-s.ox,-s.oy);ctx.restore()};
 const layer=fn=>{const v=can(1920,1080);fn(v.getContext('2d'));return v};
 const vgrad=(c,y0,y1,stops)=>{const g=c.createLinearGradient(0,y0,0,y1);stops.forEach((s,i)=>g.addColorStop(i/(stops.length-1),s));return g};
 const glowC=(c,x,y,r,col)=>{const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(x-r,y-r,2*r,2*r)};
 const hillPath=(f,x0=-60,x1=1980,step=40,bottom=1140)=>{const pts=[];for(let x=x0;x<=x1+step;x+=step)pts.push([x,f(x)+R(-2,2)]);
   const p=new Path2D();p.moveTo(x0,bottom);p.lineTo(pts[0][0],pts[0][1]);
   for(let i=0;i<pts.length-1;i++){const m=[(pts[i][0]+pts[i+1][0])/2,(pts[i][1]+pts[i+1][1])/2];p.quadraticCurveTo(pts[i][0],pts[i][1],m[0],m[1])}
   const L=pts[pts.length-1];p.lineTo(L[0],L[1]);p.lineTo(L[0],bottom);p.closePath();return p};
 const scribble=(c,clip,cols,n,len,wid,alpha,area)=>{c.save();if(clip)c.clip(clip);c.lineCap='round';c.globalAlpha=alpha;
   for(let i=0;i<n;i++){const x=R(area[0],area[0]+area[2]),y=R(area[1],area[1]+area[3]),a=R(-.55,.1),l=R(len[0],len[1]);c.strokeStyle=cols[i%cols.length];c.lineWidth=R(wid[0],wid[1]);
     c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+Math.cos(a)*l*.5+R(-5,5),y+Math.sin(a)*l*.5+R(-5,5),x+Math.cos(a)*l,y+Math.sin(a)*l);c.stroke()}c.restore()};
 const grain=layer(c=>{c.lineCap='round';for(let i=0;i<8000;i++){const x=R(0,1920),y=R(0,1080),a=R(-.6,.1),l=R(4,12);
   c.strokeStyle=i%2?'rgba(255,255,255,.08)':'rgba(50,25,0,.05)';c.lineWidth=R(1,2.5);c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);c.stroke()}});
 const dot=(c,x,y,rx,ry,col)=>{c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.fill()};
 const eyes=(c,x,y,ex,r=10)=>{[-ex,ex].forEach(X=>{dot(c,x+X,y,r*.9,r*1.1,INK);dot(c,x+X+r*.32,y-r*.4,r*.36,r*.36,'#fff');dot(c,x+X-r*.3,y+r*.42,r*.16,r*.16,'#fff')})};
 const blush=(c,x,y,ex,col='rgba(255,100,125,.55)')=>{dot(c,x-ex,y,15,9,col);dot(c,x+ex,y,15,9,col)};
 const tuft=(c,x,y,s=1,col='#2f8a25')=>{c.save();c.translate(x,y);c.scale(s,s);strk(c,P('M-12,0 q2,-22 -8,-34 M0,0 q0,-28 5,-42 M12,0 q4,-18 15,-28'),col,4.5);c.restore()};
 const flower=(c,x,y,s,col,stem='#2f7a22')=>{c.save();c.translate(x,y);c.scale(s,s);
   strk(c,S.wline(0,0,R(-6,6),-70,3),stem,7);ink(c,P('M0,-28 q20,-16 32,-4 q-14,14 -32,4Z'),'#3fa32e',3);
   if(R(0,1)<.5){ink(c,S.blob(0,-88,30,27,{bumps:5,amp:.5,jit:.03}),col,4.5);dot(c,0,-88,9,9,'#ffb000')}
   else{for(let k=0;k<6;k++){const t=k/6*TAU;ink(c,ell(Math.cos(t)*20,-88+Math.sin(t)*20,13,10,t),col,3.5)}ink(c,circ(0,-88,10),'#ffc21a',3.5)}
   c.restore()};
 const cloudSpr=(w,h,fill,line,lw=8)=>{const p=S.cloudPath(w,h),p2=S.blob(4,-4,w*.46,h*.44,{bumps:5,amp:.4,jit:.03,n:60});
   return spr(w*1.5+40,h*1.7+40,w*.75+20,h*.85+20,c=>{c.fillStyle=fill;c.fill(p);strk(c,p,line,lw);c.globalAlpha=.6;strk(c,p2,line,3)})};
 const heart=S.heartPath(40);
 /* cute seated critter. origin = bottom centre, head centre (0,-205) */
 const critter=(c,kind,o)=>{
  const fur=hatch(c,o.fur,o.fm,44,12,3.4),bel=hatch(c,o.bel,o.bm||[o.bel,'#ffffff'],40,7,3);const hy=-205;
  if(kind==='hedgehog'){const pts=[],n=30;for(let i=0;i<=n;i++){const a=Math.PI*(.82+1.36*i/n),r=i%2?1:1.28;pts.push([Math.cos(a)*130*r,-150+Math.sin(a)*150*r])}
    const p=new Path2D();p.moveTo(0,-40);pts.forEach(q=>p.lineTo(q[0],q[1]));p.closePath();ink(c,p,hatch(c,o.spike,o.sm,40,12,3.4),6)}
  if(kind==='fox'){ink(c,P('M50,-40 C170,-20 215,-140 160,-230 C150,-170 120,-120 60,-110Z'),fur,6);ink(c,P('M160,-230 C150,-200 140,-185 128,-170 C150,-172 175,-190 160,-230Z'),'#fff8ee',4)}
  if(kind==='cat'){strk(c,P('M50,-30 C150,-20 170,-110 130,-150 C110,-170 95,-150 110,-140'),INK,30);strk(c,P('M50,-30 C150,-20 170,-110 130,-150 C110,-170 95,-150 110,-140'),o.fur,19)}
  if(kind==='bear')[-1,1].forEach(d=>{ink(c,circ(d*62,hy-60,32),fur,6);dot(c,d*62,hy-60,16,16,o.inn)});
  if(kind==='bunny')[-1,1].forEach(d=>{c.save();c.translate(d*34,hy-62);c.rotate(d*.18);ink(c,ell(0,-60,27,80),fur,6);dot(c,0,-52,12,56,o.inn);c.restore()});
  if(kind==='cat'||kind==='fox')[-1,1].forEach(d=>{ink(c,P(`M${d*28},${hy-58} L${d*80},${hy-130} L${d*86},${hy-30}Z`),fur,6);c.fillStyle=o.inn;c.fill(P(`M${d*42},${hy-58} L${d*76},${hy-108} L${d*78},${hy-46}Z`))});
  if(kind==='pig')[-1,1].forEach(d=>ink(c,P(`M${d*36},${hy-62} Q${d*70},${hy-120} ${d*92},${hy-92} Q${d*92},${hy-50} ${d*72},${hy-38}Z`),fur,6));
  if(kind==='frog')[-1,1].forEach(d=>ink(c,circ(d*48,hy-56,36),fur,6));
  // body + feet
  ink(c,S.blob(0,-80,82,84,{jit:.025}),fur,7);
  ink(c,S.blob(0,-66,50,54,{jit:.03}),bel,0);
  if(kind==='frog'||kind==='duck')[-1,1].forEach(d=>ink(c,S.blob(d*44,-10,36,16,{jit:.04}),kind==='duck'?'#ff9a1f':fur,6));
  else [-1,1].forEach(d=>{ink(c,S.blob(d*44,-12,32,21,{jit:.04}),fur,6);dot(c,d*44,-10,14,9,o.inn||o.bel)});
  // head
  const frog=kind==='frog';ink(c,S.blob(0,hy,frog?104:90,frog?72:82,{jit:.02}),fur,7);
  if(kind==='duck')strk(c,P(`M-2,${hy-80} q-10,-30 14,-38 M4,${hy-80} q16,-22 32,-8`),INK,5);
  if(kind==='hedgehog')ink(c,P(`M-70,${hy-40} q20,-50 70,-52 q50,2 70,52 q-30,-26 -70,-24 q-40,-2 -70,24Z`),hatch(c,o.spike,o.sm,40,12,3.4),5);
  if(frog){[-1,1].forEach(d=>{ink(c,circ(d*48,hy-58,23),'#fff',4.5);dot(c,d*48+d*3,hy-56,11,13,INK);dot(c,d*48+d*3+4,hy-61,4,4,'#fff')});
    strk(c,P(`M-58,${hy+8} Q0,${hy+58} 58,${hy+8}`),INK,6);blush(c,0,hy+16,70);return}
  if(['bear','fox','cat','hedgehog','bunny'].includes(kind))ink(c,S.blob(0,hy+30,kind==='bunny'?36:46,kind==='bunny'?27:33,{jit:.04}),bel,4);
  eyes(c,0,hy-14,33,11);blush(c,0,hy+20,60);
  if(kind==='duck'){ink(c,ell(0,hy+28,42,19),'#ff9a1f',5);strk(c,P(`M-34,${hy+28} Q0,${hy+40} 34,${hy+28}`),INK,3.5);return}
  if(kind==='pig'){ink(c,ell(0,hy+24,32,23),'#ff8fae',5);dot(c,-10,hy+24,4.5,7.5,'#7a2a3a');dot(c,10,hy+24,4.5,7.5,'#7a2a3a');strk(c,P(`M-15,${hy+56} q15,12 30,0`),INK,4.5);return}
  dot(c,0,hy+17,13,9,kind==='bunny'?'#ff7f9a':'#3a2420');
  strk(c,P(`M0,${hy+24} l0,8 M-17,${hy+34} q8.5,11 17,-2 q8.5,13 17,2`),INK,4.5);
 };
 const arm=(c0,o,len=96)=>spr(70,len+60,35,24,c=>{const fur=hatch(c,o.fur,o.fm,44,12,3.4);ink(c,rr(-17,-14,34,len,17),fur,6);ink(c,S.blob(0,len-12,20,18,{jit:.05}),o.kind==='duck'?'#ffe066':(o.inn&&o.kind!=='fox'?o.bel:o.bel),5)});
 const mk=(kind,o,len)=>{o.kind=kind;return{body:spr(460,520,230,490,c=>critter(c,kind,o)),arm:arm(null,o,len)}};
 // draw critter with two arms (angles: 0 = hanging down)
 const pal=(cr,x,y,sc,rot,aL,aR,sh=[68,-128])=>S.at(x,y,rot,sc,()=>{put(cr.body,0,0);put(cr.arm,-sh[0],sh[1],aL);put(cr.arm,sh[0],sh[1],aR)});
 const bird=(x,y,s,fl,col=INK)=>{ctx.save();ctx.translate(x,y);ctx.scale(s,s);const w=-14*fl;ctx.beginPath();ctx.moveTo(-28,w*.4);ctx.quadraticCurveTo(-14,w-6,0,0);ctx.quadraticCurveTo(14,w-6,28,w*.4);
   ctx.strokeStyle=col;ctx.lineWidth=5;ctx.lineCap=ctx.lineJoin='round';ctx.stroke();ctx.restore()};
 const bfly=(x,y,s,fl,c1,c2,rot=0)=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);
   ctx.save();ctx.scale(.25+.75*Math.abs(fl),1);[[-1],[1]].forEach(([d])=>{
     ctx.beginPath();ctx.ellipse(d*20,-12,20,17,d*.5,0,TAU);ctx.fillStyle=c1;ctx.fill();ctx.lineWidth=4;ctx.strokeStyle=INK;ctx.stroke();
     ctx.beginPath();ctx.ellipse(d*15,12,13,11,-d*.4,0,TAU);ctx.fillStyle=c2;ctx.fill();ctx.stroke();
     ctx.beginPath();ctx.arc(d*20,-13,5,0,TAU);ctx.fillStyle='#fff';ctx.fill()});ctx.restore();
   ctx.beginPath();ctx.ellipse(0,0,5,18,0,0,TAU);ctx.fillStyle=INK;ctx.fill();
   ctx.beginPath();ctx.moveTo(-2,-16);ctx.quadraticCurveTo(-8,-30,-14,-30);ctx.moveTo(2,-16);ctx.quadraticCurveTo(8,-30,14,-30);ctx.lineWidth=2.5;ctx.stroke();ctx.restore()};
 return {R,can,hatch,ink,strk,P,circ,ell,rr,spr,put,layer,vgrad,glowC,hillPath,scribble,grain,dot,eyes,blush,tuft,flower,cloudSpr,heart,critter,mk,pal,bird,bfly};
}

const FUR={
 bear:{fur:'#b9743e',fm:['#9a5a2c','#d08a4e','#a8652f'],bel:'#f6d6a8',inn:'#f2a2a0'},
 bunny:{fur:'#fbf7f0',fm:['#e8ded0','#ffffff','#eee4d6'],bel:'#ffffff',bm:['#fff','#f3ece2'],inn:'#ffa8bc'},
 cat:{fur:'#ffad42',fm:['#ff951a','#ffc670','#f08514'],bel:'#fff1d8',inn:'#ff9fb0'},
 frog:{fur:'#6dd04a',fm:['#58bb38','#8de36a','#4fae32'],bel:'#dcf6a0'},
 duck:{fur:'#ffd83a',fm:['#ffc61a','#ffe97a','#f7c400'],bel:'#fff3a8'},
 pig:{fur:'#ffb8cb',fm:['#ff9fb8','#ffd0dc','#f8a6bd'],bel:'#ffd7e2',inn:'#ff8fae'},
 fox:{fur:'#f2782a',fm:['#e0621a','#ff9447','#d8581a'],bel:'#fff6ea',inn:'#4a2a1c'},
 hedgehog:{fur:'#f0cf9e',fm:['#e3bb84','#f8dcb2'],bel:'#fbe6c6',inn:'#e8b7a0',spike:'#8a5734',sm:['#6e4024','#a56c42','#5c341c']}
};
const cp=o=>Object.assign({},o);

/* =====================================================================
   1: SEESAW FRIENDS - sunny meadow, bear + bunny on a seesaw, kitten on a swing
   ===================================================================== */
BIS.scene('ps3-1',{title:'Seesaw Friends',blurb:'A bear and a bunny ride a seesaw in a sunny meadow while a kitten swings from the big tree and butterflies flutter by.',
setup(S){const st=S.state,k=st.k=kit(S),{ink,hatch,strk,P,circ,ell,spr,layer,R}=k;
 const midF=x=>690+0.00013*(x-960)**2+8*Math.sin(x/170);
 const fgF=x=>950+16*Math.sin(x/260+1)+9*Math.sin(x/97);
 st.bg=layer(c=>{
  c.fillStyle=k.vgrad(c,0,720,['#47b8f2','#82d4fa','#c8efff','#fff3c8']);c.fillRect(0,0,1920,1080);
  k.glowC(c,1640,180,560,'rgba(255,238,160,.8)');
  k.scribble(c,null,['#ffffff','#9fdcfb'],260,[30,80],[3,6],.18,[0,0,1920,600]);
  const f1=x=>575+38*Math.sin(x/230+2)+22*Math.sin(x/97);
  ink(c,k.hillPath(f1),hatch(c,'#a8dccb',['#93cfb8','#c3ebdc','#9fd5c6'],52,10,4),5,'#4f8f78');
  for(let x=40;x<1920;x+=R(70,150)){const y=f1(x)+8,s=R(.3,.5);c.save();c.translate(x,y);c.scale(s,s);strk(c,P('M0,0 L0,-70'),'#6b4a2a',12);
    ink(c,S.blob(0,-110,55,60,{bumps:6,amp:.2,jit:.03}),hatch(c,'#6fbf73',['#5aa860','#8ad48a'],40,8,4),7,'#3c6e48');c.restore()}
  const f2=x=>640+30*Math.sin(x/180)+20*Math.sin(x/71+1);
  ink(c,k.hillPath(f2),hatch(c,'#a3e07a',['#8ad064','#bcee92','#7fc95c'],50,10,4),6);
  const mid=k.hillPath(midF);ink(c,mid,hatch(c,'#80d24e',['#6abe3e','#9ee46a','#5fb238','#b6ef7c'],52,12,4.5),7);
  k.scribble(c,mid,['#5aa83a','#a8ea76','#4f9a30'],700,[18,46],[3,6],.25,[0,640,1920,440]);
  for(let i=0;i<70;i++){const x=R(0,1920),y=midF(x)+R(20,200);k.tuft(c,x,y,R(.6,1),'#3f9a2e')}
  for(let i=0;i<34;i++){const x=R(0,1920);if(Math.abs(x-960)<120)continue;k.flower(c,x,midF(x)+R(40,190),R(.35,.55),S.pick(['#fff','#ffe02a','#ff8fc8','#ff5a3c','#b98cf5']))}
 });
 st.props=layer(c=>{
  // big tree (left) with a branch for the swing
  const bark=hatch(c,'#a8592f',['#8a4422','#c26d3d','#7a3a1c'],40,10,4);
  ink(c,P('M60,1000 C90,860 110,700 100,560 C95,470 70,400 40,330 L120,360 C150,420 175,330 230,300 L260,330 C210,380 190,470 200,560 C210,700 220,860 260,1000Z'),bark,8);
  ink(c,P('M150,420 C230,380 330,365 470,360 L472,384 C340,392 240,410 175,452Z'),bark,7);
  strk(c,P('M140,900 q8,-90 -4,-180 M190,760 q10,-60 0,-120'),'#6a2e14',4);
  const leaf=hatch(c,'#55b84a',['#3f9c38','#79d25e','#2f8a2c','#8ee070'],50,12,4.5);
  [[150,250,290,190],[-10,330,170,140],[330,200,180,140],[130,90,220,130]].forEach(([x,y,rx,ry])=>ink(c,S.blob(x,y,rx,ry,{bumps:8,amp:.16,jit:.02,n:90}),leaf,8));
  for(let i=0;i<55;i++){const a=R(0,TAU),r=Math.sqrt(R(0,1));const x=160+Math.cos(a)*r*300,y=230+Math.sin(a)*r*190;strk(c,P(`M${x},${y} q10,-9 22,0`),'#1f6a1f',4)}
  for(let i=0;i<16;i++){const a=R(0,TAU),r=Math.sqrt(R(.1,1));const x=170+Math.cos(a)*r*280,y=240+Math.sin(a)*r*170;ink(c,circ(x,y,13),'#ff4a3a',4);dot2(c,x-4,y-4)}
  function dot2(c,x,y){c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.arc(x,y,4,0,TAU);c.fill()}
  // right side: bushes, fence, bird house
  const fence=hatch(c,'#fff1d2',['#f2dcae','#ffffff'],30,6,3);
  for(let x=1440;x<1960;x+=56){const y=midF(x)+30;ink(c,P(`M${x-14},${y} L${x-14},${y-110} L${x},${y-128} L${x+14},${y-110} L${x+14},${y}Z`),fence,5)}
  strk(c,S.wline(1420,midF(1700)-45,1960,midF(1700)-35,3),INK,14);strk(c,S.wline(1420,midF(1700)-45,1960,midF(1700)-35,3),'#f2dcae',7);
  const bushF=hatch(c,'#3f9f4a',['#2f8a3c','#5cbe5a','#7ad06a'],44,10,4);
  [[1500,760,130,80],[1660,750,150,92],[1840,745,140,86],[1980,760,120,80]].forEach(([x,y,rx,ry])=>{ink(c,S.blob(x,y,rx,ry,{bumps:6,amp:.25,jit:.02,n:70}),bushF,7);
    for(let i=0;i<6;i++)ink(c,circ(x+R(-rx*.7,rx*.7),y+R(-ry*.6,ry*.3),9),S.pick(['#fff','#ffd84a','#ff8fc8']),3)});
  const pole=hatch(c,'#b06a3a',['#8a4c24','#c98050'],30,6,3);
  ink(c,P('M1752,740 L1748,470 L1772,470 L1776,740Z'),pole,6);
  ink(c,P('M1690,470 L1690,380 L1760,330 L1830,380 L1830,470Z'),hatch(c,'#5ab0f0',['#3f98e0','#7cc4f8'],34,8,3.4),7);
  ink(c,P('M1670,392 L1760,312 L1850,392 L1834,402 L1760,338 L1686,402Z'),hatch(c,'#ff5a4a',['#e84030','#ff7a6a'],30,8,3),6);
  ink(c,circ(1760,410,20),'#3a2420',5);ink(c,P('M1748,446 l24,0'),null,6);
  // seesaw stand
  ink(c,P('M900,700 L960,590 L1020,700Z'),hatch(c,'#ff9a3c',['#f07a1a','#ffb866'],34,8,3.4),7);
  ink(c,circ(960,600,14),'#ffd84a',5);
 });
 st.fg=layer(c=>{
  const g=k.hillPath(fgF);ink(c,g,hatch(c,'#58b83c',['#46a430','#78d054','#3c9628','#8ee066'],52,12,4.5),7);
  k.scribble(c,g,['#3c9628','#8ee066','#2f8020'],600,[20,50],[3,6],.3,[0,920,1920,160]);
  for(let x=10;x<1920;x+=R(18,34))k.tuft(c,x,fgF(x)+R(4,26),R(.8,1.2),'#2a7a20');
  for(let x=20;x<1920;x+=R(55,110))k.flower(c,x,fgF(x)+R(40,110),R(.55,.8),S.pick(['#ffe02a','#ff5a3c','#ffffff','#ff8fc8','#7ac0ff']));
  [[300,1030],[1560,1040],[1100,1060]].forEach(([x,y])=>{ink(c,S.blob(x,y,34,22,{jit:.08}),hatch(c,'#c9c2b8',['#b0a89c','#ded8cf'],30,6,3),5)});
 });
 st.grain=k.grain;
 // sun
 st.rays=spr(520,520,260,260,c=>{for(let i=0;i<16;i++){const a=i/16*TAU+R(-.06,.06),r1=R(120,132),r2=R(185,235);strk(c,S.wline(Math.cos(a)*r1,Math.sin(a)*r1,Math.cos(a)*r2,Math.sin(a)*r2,3),'#ffcf1a',R(9,13))}});
 st.sun=spr(260,260,130,130,c=>{ink(c,S.blob(0,0,104,100,{jit:.03}),hatch(c,'#ffe12e',['#ffd000','#fff27a','#ffc400'],30,10,3),7,'#f0a800');
   k.eyes(c,0,-14,34,11);k.blush(c,0,20,58,'rgba(255,120,60,.55)');ink(c,P('M-34,14 Q0,62 34,14 Q0,28 -34,14Z'),'#b8322a',5,'#7a2a12')});
 st.clouds=[[260,120,1.05,0,150,150],[340,130,.8,.35,330,190],[200,90,.7,.62,230,130],[300,120,.9,.85,420,170]].map(([w,h,s,x,y,sec])=>({sp:k.cloudSpr(w,h,'rgba(255,255,255,.75)','#fff',8),s,x:x*1920,y,sec}));
 // heroes
 st.bear=k.mk('bear',cp(FUR.bear));st.bunny=k.mk('bunny',cp(FUR.bunny));st.cat=k.mk('cat',cp(FUR.cat),86);
 st.plank=spr(1000,90,500,40,c=>{ink(c,k.rr(-440,-14,880,30,14),hatch(c,'#ff5a6e',['#e84058','#ff8090','#ff6e82'],36,9,3.4),7);
   [-1,1].forEach(d=>{ink(c,P(`M${d*300},-14 L${d*300},-62 L${d*330},-62`),null,10);strk(c,P(`M${d*300},-14 L${d*300},-62 L${d*330},-62`),'#ffd84a',4)})});
 st.seat=spr(240,60,120,30,c=>ink(c,k.rr(-90,-12,180,26,10),hatch(c,'#5ab0f0',['#3f98e0','#7cc4f8'],34,8,3.4),6));
 st.sfl=[[1530,.95,'#ffd21a'],[1610,1.15,'#ffc21a'],[1890,1,'#ffd21a']].map(([x,s,col],i)=>({x,s,ph:i*.31,head:spr(200,200,100,100,c=>{for(let j=0;j<14;j++){const a=j/14*TAU;ink(c,ell(Math.cos(a)*50,Math.sin(a)*50,28,13,a),col,4)}
   ink(c,circ(0,0,40),hatch(c,'#7a4a1c',['#5a3410','#9a6a2c'],24,10,3),5);k.eyes(c,0,-6,14,6);strk(c,P('M-10,10 q10,9 20,0'),INK,3.5)})}));
 st.bfl=[0,1,2,3,4].map(i=>({x:[820,1130,720,1480,960][i],y:[150,170,790,600,380][i],ax:R(60,100),ay:R(30,50),ph:R(0,1),c1:['#ff7ab0','#ffd84a','#8fd0ff','#ff9a3c','#c49aff'][i],c2:['#ffd84a','#ff7ab0','#fff','#ffe0a0','#ff8fc8'][i]}));
 st.birds=[0,1,2].map(i=>({x:R(0,1920),y:R(70,260),s:R(.8,1.2),ph:R(0,1)}));
 st.hearts=[0,1,2,3,4,5].map(i=>({off:i/6,dx:R(-50,50)}));
 st.hcols=['#ff4f6d','#ff8fb3','#ff6b6b','#ff5a8a'];
 st.snail=spr(130,100,65,85,c=>{ink(c,P('M-60,0 Q-62,-22 -40,-26 L30,-26 Q50,-24 52,0Z'),'#f6d27a',5);ink(c,S.blob(0,-44,40,38,{jit:.03}),hatch(c,'#c86ad6',['#a850c0','#e08ae8'],30,8,3),6);
   strk(c,P('M0,-44 m-6,0 a6,6 0 1 1 12,0 a14,14 0 1 1 -26,4 a24,24 0 1 1 42,-12'),INK,4);strk(c,P('M-48,-24 l-8,-26 M-40,-26 l2,-26'),INK,4);k.dot(c,-56,-52,5,5,INK);k.dot(c,-38,-54,5,5,INK)});
},
draw(S){const c=S.ctx,st=S.state,k=st.k;
 c.drawImage(st.bg,0,0);
 st.clouds.forEach(cl=>k.put(cl.sp,S.wrap(cl.x,cl.sec,1920,320),cl.y+6*S.osc(10,cl.x),0,cl.s));
 // sun
 k.put(st.rays,1640,180,S.p*TAU*S.cycles(41));k.put(st.sun,1640,180,0,1+.035*S.osc(4.1));
 st.birds.forEach((b,i)=>k.bird(S.wrap(b.x,41,1920,80),b.y+14*S.osc(8,b.ph),b.s,S.osc(.8,b.ph)));
 c.drawImage(st.props,0,0);
 // birds on the bird-house roof
 k.bird(1720,300-6*S.pulse(2.2,0,3),.7,.2,'#3a2420');
 // sunflowers (behind bunny side)
 st.sfl.forEach(f=>{const sw=.05*S.osc(5.1,f.ph),top=[f.x+Math.sin(sw)*300*f.s,760-300*f.s];
   k.strk(c,k.P(`M${f.x},790 Q${f.x},${(790+top[1])/2} ${top[0]},${top[1]}`),INK,15);k.strk(c,k.P(`M${f.x},790 Q${f.x},${(790+top[1])/2} ${top[0]},${top[1]}`),'#3f9a2e',8);
   k.ink(c,k.P(`M${f.x},${700-60*f.s} q50,-34 74,-6 q-38,30 -74,6Z`),'#4fae32',4);k.put(f.head,top[0],top[1],sw*2,f.s*.85)});
 // swing with kitten from the tree branch
 const sa=.2*S.osc(5.1,.1),px=400,py=372,L=290;
 S.at(px,py,sa,1,()=>{[-62,62].forEach(d=>{k.strk(c,k.P(`M${d*.8},0 L${d},${L}`),INK,7);k.strk(c,k.P(`M${d*.8},0 L${d},${L}`),'#e0b070',3)});
   k.pal(st.cat,0,L-6,.6,0,-.45,.45);k.put(st.seat,0,L);});
 // seesaw
 const tl=.15*S.osc(4.1),cx=960,cy=598;
 S.at(cx,cy,tl,1,()=>{k.put(st.plank,0,0);
   const bob=d=>4*S.osc(4.1,d>0?.25:.75);
   k.pal(st.bear,-345,-12-Math.max(0,bob(-1)),1,-tl*.6,2.6+.25*S.osc(1.4),-.6);
   k.pal(st.bunny,345,-12-Math.max(0,bob(1)),1,-tl*.6,.6,-2.6-.25*S.osc(1.4,.5));});
 // hearts rising from the middle
 st.hearts.forEach((h,i)=>{const s=S.saw(6.15,h.off),y=560-s*330,x=cx+h.dx+22*Math.sin(s*TAU*1.5+i);c.save();c.globalAlpha=Math.sin(Math.PI*s)*.95;c.translate(x,y);c.scale(.4+.3*s,.4+.3*s);
   c.fillStyle=st.hcols[i%4];c.fill(k.heart);c.lineWidth=7;c.strokeStyle=INK;c.stroke(k.heart);c.restore()});
 // butterflies
 st.bfl.forEach((b,i)=>{const x=b.x+b.ax*S.osc(15.4,b.ph),y=b.y+b.ay*S.osc(7.7,b.ph+.2);k.bfly(x,y,1.1,S.osc(.55,b.ph),b.c1,b.c2,.25*S.osc(15.4,b.ph+.25))});
 c.drawImage(st.fg,0,0);
 // snail crawling along the front grass
 const sx=S.wrap(200,123,1920,120,-1);k.put(st.snail,sx,960+16*Math.sin(sx/260+1)+9*Math.sin(sx/97)+30,0,[-.9,.9]);
 c.drawImage(st.grain,0,0);
}});

/* =====================================================================
   2: FRIENDSHIP BOAT - sunset lake, frog + duck + piglet in a sailboat
   ===================================================================== */
BIS.scene('ps3-2',{title:'Friendship Boat',blurb:'A frog, a duck and a piglet sail a little heart-sail boat across a sunset lake, with jumping fish and swaying reeds.',
setup(S){const st=S.state,k=st.k=kit(S),{ink,hatch,strk,P,circ,ell,spr,layer,R}=k;
 const HZ=610;st.HZ=HZ;
 st.bg=layer(c=>{
  c.fillStyle=k.vgrad(c,0,HZ,['#5a3f9e','#9a4fa8','#e0628f','#ff9a5c','#ffd26a']);c.fillRect(0,0,1920,HZ+2);
  k.scribble(c,null,['#ffb87a','#ff8fb0','#c47ad0'],300,[40,110],[3,7],.18,[0,0,1920,HZ]);
  k.glowC(c,1420,500,620,'rgba(255,220,120,.85)');
 });
 st.land=layer(c=>{
  // far mountains
  const m1=x=>HZ-60-150*Math.exp(-(((x-300)/260)**2))-110*Math.exp(-(((x-760)/200)**2))-90*Math.exp(-(((x-1820)/220)**2))+10*Math.sin(x/60);
  ink(c,k.hillPath(m1,-60,1980,40,HZ+20),hatch(c,'#b06ab8',['#9a58a8','#c47ac8','#a060b0'],50,10,4),5,'#5a2f6a');
  const m2=x=>HZ-20-120*Math.exp(-(((x-120)/240)**2))-60*Math.exp(-(((x-560)/160)**2))-80*Math.exp(-(((x-1750)/180)**2))+6*Math.sin(x/45);
  ink(c,k.hillPath(m2,-60,1980,40,HZ+20),hatch(c,'#7a4a9a',['#6a3c88','#8c5aac','#5e3480'],50,10,4),6,'#3a1f50');
  // pine trees on the near shores
  const pine=hatch(c,'#2f6e6a',['#24605c','#3c827c','#1c504c'],40,10,4);
  const pines=[[40,HZ+10,1.2],[120,HZ+14,.9],[190,HZ+8,1.1],[270,HZ+12,.8],[1640,HZ+12,.85],[1720,HZ+8,1.15],[1800,HZ+14,.9],[1880,HZ+10,1.25],[340,HZ+12,.6],[1580,HZ+12,.6]];
  pines.forEach(([x,y,s])=>{c.save();c.translate(x,y);c.scale(s,s);ink(c,P('M-8,0 L-8,-30 L8,-30 L8,0Z'),'#6a3a2a',4);
    ink(c,P('M0,-200 L40,-120 L22,-122 L58,-60 L34,-62 L70,-24 L-70,-24 L-34,-62 L-58,-60 L-22,-122 L-40,-120Z'),pine,5);c.restore()});
  // water
  c.fillStyle=k.vgrad(c,HZ,1080,['#ffb070','#e07a9a','#8a5ab0','#4a3e94','#33307a']);c.fillRect(0,HZ,1920,470);
  k.scribble(c,P(`M0,${HZ}H1920V1080H0Z`),['#ffd0a0','#c48ad8','#6a5ac0','#ff9ab0'],900,[30,90],[2.5,5],.22,[0,HZ,1920,470]);
  strk(c,S.wline(-10,HZ,1930,HZ,2),'#3a1f50',5);
  // reflection of mountains (soft)
  c.save();c.globalAlpha=.25;c.translate(0,2*HZ);c.scale(1,-1);c.fillStyle='#7a4a9a';c.fill(k.hillPath(m2,-60,1980,40,HZ+20));c.restore();
  // sun disc reflection glow on water
  k.glowC(c,1420,HZ+160,300,'rgba(255,200,110,.45)');
 });
 st.sunR=spr(560,560,280,280,c=>{for(let i=0;i<18;i++){const a=i/18*TAU,r1=R(130,140),r2=R(190,250);strk(c,S.wline(Math.cos(a)*r1,Math.sin(a)*r1,Math.cos(a)*r2,Math.sin(a)*r2,3),'#ffe066',R(8,12))}});
 st.sun=spr(280,280,140,140,c=>{ink(c,S.blob(0,0,112,108,{jit:.025}),hatch(c,'#ffb43a',['#ff9a1a','#ffd060','#ffc040'],30,10,3),7,'#e0601a');
   [-1,1].forEach(d=>strk(c,P(`M${d*34-14},-12 q14,-14 28,0`),'#7a2a12',6));k.blush(c,0,22,60,'rgba(255,80,80,.5)');strk(c,P('M-24,22 q24,24 48,0'),'#7a2a12',6)});
 st.clouds=[[300,90,.9,.1,140,150],[380,110,.75,.55,260,190],[240,80,.7,.8,90,130]].map(([w,h,s,x,y,sec])=>({sp:k.cloudSpr(w,h,'rgba(255,190,200,.55)','#ffe3ec',7),s,x:x*1920,y,sec}));
 // boat parts
 const hullP=P('M-350,-80 Q-340,40 -236,74 L236,74 Q340,40 350,-80 Q0,-48 -350,-80Z');
 st.hull=spr(760,200,380,110,c=>{ink(c,hullP,hatch(c,'#e8453c',['#d0302a','#ff6a5a','#c42a24'],40,10,4),8);
   c.save();c.clip(hullP);strk(c,P('M-360,-14 Q0,10 360,-14'),'#fff6e0',22);strk(c,P('M-360,-14 Q0,10 360,-14'),'rgba(0,0,0,.25)',2);c.restore();
   [-200,0,200].forEach(x=>{ink(c,circ(x,34,16),'#ffe066',5)});
   [-110,110].forEach(x=>{c.save();c.translate(x,-40);c.scale(.36,.36);ink(c,k.heart,'#ffd0dc',10);c.restore()});
   strk(c,P('M-350,-80 Q0,-48 350,-80'),'#8a2a20',4)});
 st.sails=spr(700,640,330,600,c=>{ink(c,k.rr(-10,-575,20,560,8),hatch(c,'#c98a50',['#a56a35','#e0a870'],30,8,3),6);
   ink(c,P('M18,-545 Q120,-330 300,-150 L18,-130Z'),hatch(c,'#fff6e2',['#f2e2c2','#ffffff','#f6e8cc'],40,10,3.4),7);
   c.save();c.translate(130,-280);c.scale(1.35,1.35);ink(c,k.heart,hatch(c,'#ff4f6d',['#e83a58','#ff7a90'],30,8,3),7);c.restore();
   ink(c,P('M-18,-505 Q-110,-320 -250,-150 L-18,-140Z'),hatch(c,'#8fd0ff',['#6ab8f0','#b0e0ff'],36,9,3.4),7);
   [-1,0,1].forEach(i=>strk(c,P(`M-26,${-420+i*90} L${-90-i*60},${-420+i*90+30}`),'#ffffff',8));});
 st.frog=k.mk('frog',cp(FUR.frog));st.duck=k.mk('duck',cp(FUR.duck),84);st.pig=k.mk('pig',cp(FUR.pig));
 // fish
 st.fish=spr(140,90,70,45,c=>{ink(c,P('M-40,0 Q-10,-34 30,-6 L52,-28 L50,26 L30,6 Q-10,34 -40,0Z'),hatch(c,'#ff8a2a',['#ff6a10','#ffb060'],26,8,3),5);k.eyes(c,-22,-4,0,5);strk(c,P('M-6,-16 q8,16 0,32'),INK,3)});
 st.fishes=[{x:300,y:820,sec:10.25,off:0,d:1},{x:1500,y:900,sec:12.3,off:.5,d:-1}];
 // lily pads + lotus foreground layer
 st.fg=layer(c=>{const pad=hatch(c,'#3fae5a',['#2f964a','#5cc86e','#2a8a44'],40,10,4);
  const pads=[[150,980,150,52],[420,1040,170,54],[80,860,90,30],[1760,990,170,56],[1500,1050,150,48],[1860,870,90,30],[640,1060,110,34],[1250,1070,120,34]];
  pads.forEach(([x,y,rx,ry])=>{const a=R(0,TAU);const p=new Path2D();p.ellipse(x,y,rx,ry,0,a+.25,a+TAU-.25);p.lineTo(x,y);p.closePath();ink(c,p,pad,6);
    for(let j=0;j<5;j++){const t=a+.6+j*1.1;strk(c,P(`M${x},${y} L${x+Math.cos(t)*rx*.8},${y+Math.sin(t)*ry*.8}`),'#2a7a3c',3)}});
  [[220,960,1],[1700,975,1.1],[470,1022,.8]].forEach(([x,y,s])=>{c.save();c.translate(x,y);c.scale(s,s);
    for(let j=0;j<7;j++){const t=-Math.PI/2+(j-3)*.42;ink(c,ell(Math.cos(t)*30,-16+Math.sin(t)*34,15,34,t+Math.PI/2),j%2?'#ffb8d0':'#ff8fb8',4)}
    ink(c,circ(0,-14,13),'#ffd84a',4);c.restore()});
 });
 st.reeds=[];[[0,1],[1,-1]].forEach(([side,dir])=>{for(let i=0;i<9;i++){const x=side?1920-R(0,170):R(0,170);st.reeds.push({x,h:R(220,420),ph:R(0,1),cat:i%2==0,dir,y:R(1000,1090)})}});
 st.ripl=[];for(let i=0;i<70;i++)st.ripl.push({x:R(0,1920),y:R(HZ+20,1060),l:R(30,90),sec:S.pick([61.5,41,123]),col:S.pick(['rgba(255,230,190,.55)','rgba(255,255,255,.4)','rgba(200,160,240,.45)'])});
 st.sunRef=[];for(let i=0;i<12;i++)st.sunRef.push({y:HZ+14+i*i*3.2+i*10,w:150-i*7,ph:R(0,1)});
 st.dfly=[0,1].map(i=>({x:[420,1700][i],y:[700,720][i],ph:R(0,1)}));
 st.gulls=[0,1,2].map(i=>({x:R(0,1920),y:R(110,300),s:R(.7,1),ph:R(0,1)}));
 st.grain=k.grain;
},
draw(S){const c=S.ctx,st=S.state,k=st.k,HZ=st.HZ;
 c.drawImage(st.bg,0,0);
 // sun sits just above the horizon behind the far right hills
 c.save();c.beginPath();c.rect(0,0,1920,HZ);c.clip();k.put(st.sunR,1420,500,S.p*TAU*S.cycles(61.5),1,.85);k.put(st.sun,1420,500,0,1+.03*S.osc(4.1));c.restore();
 st.clouds.forEach(cl=>k.put(cl.sp,S.wrap(cl.x,cl.sec,1920,320),cl.y,0,cl.s));
 st.gulls.forEach(g=>k.bird(S.wrap(g.x,41,1920,80,-1),g.y+12*S.osc(9,g.ph),g.s,S.osc(.9,g.ph),'#4a2a5a'));
 c.drawImage(st.land,0,0);
 // sun reflection shimmer
 st.sunRef.forEach((r,i)=>{const w=r.w*(.75+.25*S.osc(3.1,r.ph));c.strokeStyle=i%2?'#ffe08a':'#ffc860';c.lineWidth=7-i*.3;c.lineCap='round';c.beginPath();
   c.moveTo(1420-w/2+20*S.osc(6.15,r.ph),r.y);c.lineTo(1420+w/2+20*S.osc(6.15,r.ph),r.y);c.stroke()});
 // drifting water ripples
 c.lineCap='round';st.ripl.forEach(r=>{const x=S.wrap(r.x,r.sec,1920,100);c.strokeStyle=r.col;c.lineWidth=4;c.beginPath();c.moveTo(x,r.y);c.quadraticCurveTo(x+r.l/2,r.y-5,x+r.l,r.y);c.stroke()});
 // fish jumps
 st.fishes.forEach(f=>{const s=S.saw(f.sec,f.off);if(s>.012&&s<.288){const t=s/.3,x=f.x+f.d*t*220,y=f.y-Math.sin(Math.PI*t)*170;k.put(st.fish,x,y,f.d*(t-.5)*2.4,[f.d*-.9,.9])}
   const sp=(xx,a)=>{c.strokeStyle='rgba(255,240,220,'+a+')';c.lineWidth=5;c.beginPath();c.ellipse(xx,f.y+4,30+60*(1-a),9+12*(1-a),0,0,TAU);c.stroke()};
   if(s>.25&&s<.5){const a=1-(s-.25)/.25;sp(f.x+f.d*220,a)}if(s<.2)sp(f.x,1-s/.2)});
 // the boat
 const bx=960,by=780+9*S.osc(5.1,.25),rk=.035*S.osc(5.1);
 // reflection
 c.save();c.globalAlpha=.22;c.translate(bx,by+150);c.scale(1,-.6);c.rotate(-rk);c.drawImage(st.hull.cv,-st.hull.ox,-st.hull.oy);c.restore();
 S.at(bx,by,rk,1,()=>{k.put(st.sails,40,-60);
   // flag
   const fx=40,fy=-640,w=S.osc(1.5);c.beginPath();c.moveTo(fx,fy);c.quadraticCurveTo(fx+40,fy-14+8*w,fx+86,fy+4*w);c.lineTo(fx+80,fy+34+6*w);c.quadraticCurveTo(fx+40,fy+28-8*w,fx,fy+40);c.closePath();
   c.fillStyle='#ffd84a';c.fill();c.lineWidth=5;c.strokeStyle=INK;c.lineJoin='round';c.stroke();
   k.pal(st.frog,-215,-40,.78,.04*S.osc(4.1,.2),2.6+.3*S.osc(1.4),-.4);
   k.pal(st.duck,10,-55,.74,-.04*S.osc(4.1,.6),.5,-.5);
   k.pal(st.pig,230,-40,.78,.04*S.osc(4.1,.9),.4,-2.6-.3*S.osc(1.4,.5));
   k.put(st.hull,0,0);});
 // ripple rings around the hull
 for(let i=0;i<3;i++){const s=S.saw(3.07,i/3);c.strokeStyle=`rgba(255,240,230,${.6*(1-s)})`;c.lineWidth=5;c.beginPath();c.ellipse(bx,by+74,380+180*s,26+26*s,0,0,TAU);c.stroke()}
 // dragonflies
 st.dfly.forEach((d,i)=>{const x=d.x+120*S.osc(20.5,d.ph),y=d.y+40*S.osc(10.25,d.ph+.3),fl=S.osc(.3,d.ph);c.save();c.translate(x,y);c.rotate(.15*S.osc(20.5,d.ph+.25));
   c.fillStyle='rgba(220,250,255,.75)';c.strokeStyle=INK;c.lineWidth=3;[[-1],[1]].forEach(([s])=>{c.beginPath();c.ellipse(s*26,-6+fl*3,26,8,s*.2,0,TAU);c.fill();c.stroke();c.beginPath();c.ellipse(s*22,8-fl*3,22,7,-s*.2,0,TAU);c.fill();c.stroke()});
   c.fillStyle=i?'#4ad0c8':'#ff5a8a';c.beginPath();c.ellipse(0,10,6,30,0,0,TAU);c.fill();c.stroke();c.beginPath();c.arc(0,-24,9,0,TAU);c.fill();c.stroke();c.restore()});
 c.drawImage(st.fg,0,0);
 // reeds and cattails swaying at both edges
 st.reeds.forEach(r=>{const sw=r.dir*12*S.osc(6.15,r.ph)+r.dir*16,tx=r.x+sw,ty=r.y-r.h,pth=k.P(`M${r.x},${r.y} Q${r.x},${r.y-r.h*.5} ${tx},${ty}`);
   k.strk(c,pth,INK,13);k.strk(c,pth,'#4f9a3a',7);
   if(r.cat){c.save();c.translate(tx,ty+20);c.rotate(sw/260);k.ink(c,k.rr(-12,-34,24,64,12),'#8a4a2a',5);c.restore()}
   else{k.strk(c,k.P(`M${r.x+4},${r.y-r.h*.4} Q${r.x+r.dir*-50},${r.y-r.h*.6} ${r.x+r.dir*-70+sw*.5},${r.y-r.h*.85}`),'#3c8a30',6)}});
 c.drawImage(st.grain,0,0);
}});

/* =====================================================================
   3: FIREFLY NIGHT - moonlit hill, fox + hedgehog sharing a jar of fireflies
   ===================================================================== */
BIS.scene('ps3-3',{title:'Firefly Night',blurb:'A fox and a hedgehog share a glowing jar of fireflies on a log under a smiling moon, with an owl, a tent and twinkling stars.',
setup(S){const st=S.state,k=st.k=kit(S),{ink,hatch,strk,P,circ,ell,spr,layer,R}=k;
 const midF=x=>730+0.00011*(x-960)**2+10*Math.sin(x/150);
 const fgF=x=>960+14*Math.sin(x/230+2)+8*Math.sin(x/83);
 st.bg=layer(c=>{
  c.fillStyle=k.vgrad(c,0,760,['#121a4e','#1f2a6e','#3a3a90','#5e4fa8','#8a6ab8']);c.fillRect(0,0,1920,1080);
  k.scribble(c,null,['#2a3a8a','#4a4aa8','#1a2260'],380,[40,120],[3,7],.25,[0,0,1920,760]);
  // milky band
  c.save();c.translate(960,300);c.rotate(-.25);const g=c.createLinearGradient(0,-140,0,140);g.addColorStop(0,'rgba(180,170,255,0)');g.addColorStop(.5,'rgba(190,180,255,.18)');g.addColorStop(1,'rgba(180,170,255,0)');c.fillStyle=g;c.fillRect(-1300,-140,2600,280);c.restore();
  for(let i=0;i<220;i++){const x=R(0,1920),y=R(0,640),r=R(1,2.8);c.fillStyle=`rgba(255,250,220,${R(.35,.9)})`;c.beginPath();c.arc(x,y,r,0,TAU);c.fill()}
  k.glowC(c,330,230,420,'rgba(255,240,180,.45)');
  // far hills with a little village
  const f1=x=>600+34*Math.sin(x/210+1)+20*Math.sin(x/80);
  ink(c,k.hillPath(f1),hatch(c,'#3a3f8a',['#323680','#464c9c','#2c3078'],50,10,4),5,'#1a1c4a');
  for(let x=900;x<1500;x+=R(50,80)){const y=f1(x)+10,h=R(30,46);c.save();c.translate(x,y);ink(c,P(`M-20,0 L-20,${-h} L0,${-h-22} L20,${-h} L20,0Z`),'#4a4e9a',4,'#1a1c4a');
    c.fillStyle='#ffd86a';c.fillRect(-6,-h+8,12,12);c.restore()}
  const f2=x=>660+26*Math.sin(x/170)+16*Math.sin(x/64+2);
  ink(c,k.hillPath(f2),hatch(c,'#2c4a7a',['#244070','#365a8a','#1e3a66'],50,10,4),6,'#121a3a');
  const mid=k.hillPath(midF);ink(c,mid,hatch(c,'#2f5e6a',['#26525e','#3a7078','#1f4652','#447e84'],52,12,4.5),7);
  k.scribble(c,mid,['#244a56','#4a8a8c','#1c3c48'],700,[18,46],[3,6],.28,[0,700,1920,380]);
  for(let i=0;i<60;i++){const x=R(0,1920),y=midF(x)+R(20,200);k.tuft(c,x,y,R(.6,1),'#5a9a8a')}
  for(let i=0;i<30;i++){const x=R(0,1920);if(Math.abs(x-960)<260)continue;k.flower(c,x,midF(x)+R(40,180),R(.35,.5),S.pick(['#cfe0ff','#a8b8ff','#fff']),'#2a5a50')}
  // tree on the right with owl branch
  const bark=hatch(c,'#5a3a4a',['#4a2c3a','#6e4a5a','#3c2230'],40,10,4);
  ink(c,P('M1660,1000 C1690,860 1700,700 1690,560 C1685,480 1660,420 1630,350 L1700,370 C1720,420 1740,380 1780,330 L1810,350 C1770,400 1760,470 1770,560 C1780,700 1800,860 1860,1000Z'),bark,8);
  ink(c,P('M1700,470 C1640,440 1560,440 1450,450 L1450,474 C1550,470 1630,474 1690,500Z'),bark,7);
  const leaf=hatch(c,'#2a5a5a',['#1f4a4c','#367070','#183c40','#3f7c78'],50,12,4.5);
  [[1720,250,280,180],[1890,330,160,140],[1560,210,170,120],[1760,100,220,120]].forEach(([x,y,rx,ry])=>ink(c,S.blob(x,y,rx,ry,{bumps:8,amp:.16,jit:.02,n:90}),leaf,8));
  for(let i=0;i<45;i++){const a=R(0,TAU),r=Math.sqrt(R(0,1));const x=1730+Math.cos(a)*r*280,y=230+Math.sin(a)*r*170;strk(c,P(`M${x},${y} q10,-9 22,0`),'#122e30',4)}
  // tent on the left
  const tent=hatch(c,'#e8604a',['#d04a36','#ff7a62','#c03e2c'],40,10,4);
  ink(c,P('M150,830 L370,520 L590,830Z'),tent,8);
  [0,1,2].forEach(i=>{const t=(i+1)/4;strk(c,P(`M${370-220*t},${520+310*t} L${370+220*t},${520+310*t}`),'rgba(255,230,180,.0)',1)});
  strk(c,P('M370,520 L330,830 M370,520 L410,830'),'rgba(255,220,200,.35)',10);
  ink(c,P('M300,830 Q370,640 440,830Z'),'#ffcf6a',6);
  strk(c,P('M370,520 L370,470'),INK,8);ink(c,P('M372,470 L420,484 L372,500Z'),'#ffd84a',4);
  // bunting from tent to a pole
  ink(c,P('M640,838 L646,600 L662,600 L666,838Z'),hatch(c,'#8a5a3a',['#6e4024','#a56c42'],30,6,3),5);
  const bunt=[];for(let i=0;i<=8;i++){const t=i/8;bunt.push([380+(652-380)*t,505+(608-505)*t+60*Math.sin(Math.PI*t)])}
  strk(c,S.smooth(bunt,false),INK,4);
  for(let i=1;i<8;i++){const [x,y]=bunt[i];ink(c,P(`M${x-14},${y} L${x+14},${y} L${x},${y+30}Z`),['#ffd84a','#ff8fb8','#8fd0ff','#9ae06a'][i%4],3.5)}
 });
 st.fg=layer(c=>{const g=k.hillPath(fgF);ink(c,g,hatch(c,'#1f3e4a',['#18343e','#2c5260','#132c36','#2f5a64'],52,12,4.5),7);
  k.scribble(c,g,['#2c5a66','#14303a','#3a6a70'],600,[20,50],[3,6],.3,[0,930,1920,150]);
  for(let x=10;x<1920;x+=R(18,34))k.tuft(c,x,fgF(x)+R(4,26),R(.8,1.2),'#3f7a70');
  for(let x=30;x<1920;x+=R(80,140))k.flower(c,x,fgF(x)+R(40,110),R(.5,.7),S.pick(['#cfe0ff','#ffffff','#b8a8ff','#ffd8f0']),'#2a5a50');
  // glowing mushrooms
  [[120,1000,1.1,'#ff6a9a'],[210,1030,.8,'#4ad0d0'],[1720,1010,1,'#4ad0d0'],[1820,1040,.75,'#ff6a9a'],[560,1050,.7,'#ffb84a'],[1380,1050,.8,'#ff6a9a']].forEach(([x,y,s,col])=>{
   k.glowC(c,x,y-60*s,110*s,col==='#4ad0d0'?'rgba(80,230,230,.35)':'rgba(255,140,170,.3)');
   c.save();c.translate(x,y);c.scale(s,s);ink(c,P('M-16,0 Q-20,-50 -12,-60 L12,-60 Q20,-50 16,0Z'),'#f6ead8',5);
   ink(c,P('M-62,-56 Q-60,-120 0,-124 Q60,-120 62,-56 Q0,-70 -62,-56Z'),col,6);
   [[-30,-90,9],[8,-104,7],[34,-80,8]].forEach(([dx,dy,r])=>k.dot(c,dx,dy,r,r*.8,'#fff8e8'));c.restore()});
 });
 st.grain=k.grain;
 // moon
 st.moon=spr(340,340,170,170,c=>{ink(c,S.blob(0,0,140,136,{jit:.02}),hatch(c,'#fff2b0',['#ffe680','#fff8d0','#f6dc80'],34,10,3.4),7,'#c8a040');
   [[-60,-60,24],[50,60,18],[70,-30,12],[-40,70,14]].forEach(([x,y,r])=>k.dot(c,x,y,r,r*.9,'rgba(220,180,90,.35)'));
   [-1,1].forEach(d=>strk(c,P(`M${d*44-16},-10 q16,14 32,0`),'#6a4a1a',6));k.blush(c,0,24,70,'rgba(255,150,120,.45)');strk(c,P('M-22,34 q22,18 44,0'),'#6a4a1a',6)});
 st.star=spr(80,80,40,40,c=>ink(c,S.starPath(30,14,5),hatch(c,'#ffe066',['#ffd030','#fff4a0'],20,6,2.5),4,'#3a2a10'));
 st.stars=[];for(let i=0;i<34;i++){let x=R(30,1890),y=R(30,560);if(Math.hypot(x-330,y-230)<210)x=(x+700)%1920;st.stars.push({x,y,s:R(.35,.75),ph:R(0,1),sec:S.pick([3.1,4.1,5.1])})}
 st.glow=spr(80,80,40,40,c=>{const g=c.createRadialGradient(0,0,0,0,0,40);g.addColorStop(0,'rgba(255,255,190,1)');g.addColorStop(.18,'rgba(240,255,140,.9)');g.addColorStop(.45,'rgba(200,255,100,.3)');g.addColorStop(1,'rgba(200,255,100,0)');c.fillStyle=g;c.fillRect(-40,-40,80,80)});
 st.ff=[];for(let i=0;i<70;i++)st.ff.push({x:R(0,1920),y:R(380,1000),ax:R(30,90),ay:R(20,60),ph:R(0,1),s:R(.5,1.1),sx:S.pick([20.5,30.75,41]),sy:S.pick([10.25,15.4,24.6]),tw:S.pick([2.05,2.56,3.07])});
 // heroes
 st.fox=k.mk('fox',cp(FUR.fox));st.hog=k.mk('hedgehog',cp(FUR.hedgehog),84);
 st.log=spr(640,140,320,70,c=>{const bark=hatch(c,'#8a5a3a',['#6e4024','#a56c42','#5c341c'],36,10,3.4);ink(c,k.rr(-280,-36,560,76,38),bark,8);
   ink(c,ell(260,2,26,36),'#e8c08a',6);strk(c,P('M252,2 a8,10 0 1 1 16,0 a16,20 0 1 1 -30,4'),'#a56c42',3);
   strk(c,P('M-220,-14 q60,-8 120,0 M-40,14 q70,8 150,-2 M120,-18 q40,-6 80,2'),'#4a2a14',4);
   ink(c,P('M-150,-36 q-10,-30 10,-44 q14,18 -10,44Z'),'#5cbe5a',4)});
 st.jar=spr(150,170,75,140,c=>{ink(c,k.rr(-46,-110,92,110,24),'rgba(220,240,255,.35)',6);ink(c,k.rr(-38,-132,76,26,8),'#c98a50',5);strk(c,P('M-30,-92 q-8,30 0,70'),'rgba(255,255,255,.7)',6)});
 st.owl=spr(200,220,100,180,c=>{const f=hatch(c,'#9a7a6a',['#86665a','#b0907c','#7a5a4c'],34,10,3.4);
   ink(c,P('M-60,-120 L-48,-170 L-20,-136Z M60,-120 L48,-170 L20,-136Z'),f,5);ink(c,S.blob(0,-70,66,74,{jit:.03}),f,7);ink(c,S.blob(0,-44,40,38,{jit:.03}),'#e8d4b8',0);
   for(let i=0;i<6;i++)strk(c,P(`M${-24+(i%3)*24},${-56+Math.floor(i/3)*20} q6,6 12,0`),'#a08060',3);
   [-1,1].forEach(d=>ink(c,circ(d*28,-100,26),'#f8ecd0',5));ink(c,P('M-8,-86 L0,-72 L8,-86Z'),'#ffb000',4);
   [-1,1].forEach(d=>ink(c,S.blob(d*36,-2,12,8),'#ffb000',3))});
 st.lid=spr(150,60,75,30,c=>{[-1,1].forEach(d=>{ink(c,P(`M${d*28-26},-2 a26,26 0 0 1 52,0Z`),'#9a7a6a',4)})});
 st.jarFF=[0,1,2,3,4].map(i=>({ph:R(0,1),x:R(-28,28),y:R(-90,-20)}));
},
draw(S){const c=S.ctx,st=S.state,k=st.k;
 c.drawImage(st.bg,0,0);
 // moon breathing
 k.put(st.moon,330,230,.05*S.osc(10.25),1+.025*S.osc(5.1));
 // twinkling crayon stars
 st.stars.forEach(s=>k.put(st.star,s.x,s.y,.3*S.osc(s.sec*3,s.ph),s.s*(.75+.3*S.osc(s.sec,s.ph))));
 // a slow shooting star
 {const s=S.saw(41,.3);if(s<.08){const t=s/.08,x=700+t*600,y=80+t*220;const g=c.createLinearGradient(x-200,y-73,x,y);g.addColorStop(0,'rgba(255,255,220,0)');g.addColorStop(1,`rgba(255,255,220,${Math.sin(Math.PI*t)})`);
   c.strokeStyle=g;c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(x-200,y-73);c.lineTo(x,y);c.stroke()}}
 // owl on the branch, blinking
 const ox=1500,oy=452+0*S.osc(6.15);k.put(st.owl,ox,oy,.05*S.osc(6.15),1);
 const bl=S.pulse(4.1,.2,40)>.5;
 if(bl)k.put(st.lid,ox,oy-100);else{[-1,1].forEach(d=>{k.dot(c,ox+d*28+3*S.osc(8.2),oy-100,10,12,INK);k.dot(c,ox+d*28+3*S.osc(8.2)+4,oy-105,3.5,3.5,'#fff')})}
 // tent door glow
 c.save();c.globalAlpha=.5+.15*S.osc(3.07);k.glowC(c,370,780,220,'rgba(255,200,100,.7)');c.restore();
 // log + friends leaning together
 const cx=960,ly=720;
 const lean=S.osc(6.15);
 const jg=.75+.25*S.osc(3.07);
 c.save();c.globalAlpha=jg;k.glowC(c,cx,ly-110,360,'rgba(255,240,150,.55)');c.restore();
 k.pal(st.fox,cx-150,ly-26,1.05,.05+.04*lean,.15,-.85);
 k.pal(st.hog,cx+150,ly-26,1.0,-.05-.04*lean,.85,.55);
 k.put(st.log,cx,ly);
 // jar with fireflies
 S.at(cx,ly-36,0,1,()=>{k.put(st.jar,0,0);st.jarFF.forEach((f,i)=>k.put(st.glow,f.x+10*S.osc(3.07,f.ph),f.y+12*S.osc(2.05,f.ph+.3),0,.5+.25*S.osc(1.54,f.ph)))});
 // fireflies
 c.save();c.globalCompositeOperation='lighter';
 st.ff.forEach(f=>{const x=f.x+f.ax*S.osc(f.sx,f.ph),y=f.y+f.ay*S.osc(f.sy,f.ph+.4),a=.35+.65*S.osc01(f.tw,f.ph);k.put(st.glow,x,y,0,f.s,a)});
 c.restore();
 c.drawImage(st.fg,0,0);
 c.drawImage(st.grain,0,0);
}});
})();
