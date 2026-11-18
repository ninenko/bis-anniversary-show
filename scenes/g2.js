/* Grade 2 — Can't Stop the Feeling! (dance, ~113 bpm, loop 236 s) */
(function(){
const TAU=Math.PI*2,W=1920,H=1080;
const frac=x=>x-Math.floor(x);
const hash=n=>frac(Math.sin(n*127.1+311.7)*43758.5453);
/* beat clock: 444 beats per loop (round(236*113/60)); n must divide 444 (1,2,3,4,6,12) */
const BEATS=444;
const beat=(S,n=1,off=0)=>frac(BEATS/n*S.p+off);
const kick=(S,n=1,off=0,k=3)=>{const f=beat(S,n,off);return f<.06?f/.06:Math.pow(1-(f-.06)/.94,k)}; // soft attack, smooth decay
const bounce=(S,n=1,off=0)=>Math.abs(Math.sin(Math.PI*beat(S,n,off)));
function mk(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),c);return c}
function sprite(col,size=128){return mk(size,size,x=>{const g=x.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,size,size)})}
function grainPat(S,a=.06){return mk(200,200,x=>{for(let i=0;i<2600;i++){x.fillStyle=S.rnd()<.5?`rgba(255,255,255,${a})`:`rgba(0,0,0,${a})`;x.fillRect(S.R(0,200),S.R(0,200),S.R(1,2.5),S.R(1,2.5))}})}
function grain(S,x,w,h,a){x.fillStyle=x.createPattern(grainPat(S,a),'repeat');x.fillRect(0,0,w,h)}
function cloud(S,w,h,top,bot){return mk(w,h,x=>{const p=new Path2D();const n=6;
  p.ellipse(w/2,h*.72,w*.46,h*.24,0,0,TAU);
  for(let i=0;i<n;i++){const t=i/(n-1),cx=w*(.16+.68*t),r=h*(.2+.2*Math.sin(Math.PI*t))*S.R(.85,1.15);p.moveTo(cx+r,h*.62);p.arc(cx,h*.66-r*.55,r,0,TAU)}
  const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,top);g.addColorStop(.62,top);g.addColorStop(1,bot);x.fillStyle=g;x.fill(p)})}
function hillPath(S,y0,amp,n,seed){const pts=[];for(let i=0;i<=n;i++){const x=-60+i*(2040/n);pts.push([x,y0+amp*Math.sin(i*1.3+seed)+S.R(-amp*.35,amp*.35)])}
  const p=new Path2D();p.moveTo(-60,H+20);p.lineTo(pts[0][0],pts[0][1]);
  for(let i=0;i<n;i++){const a=pts[i],b=pts[i+1],mx=(a[0]+b[0])/2;p.bezierCurveTo(mx,a[1],mx,b[1],b[0],b[1])}
  p.lineTo(W+60,H+20);p.closePath();return{p,pts}}
function yOn(pts,x){for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];if(x>=a[0]&&x<=b[0]){const t=(x-a[0])/(b[0]-a[0]),s=t*t*(3-2*t);return a[1]+(b[1]-a[1])*s}}return pts[0][1]}
function petals(n,r,pw){const p=new Path2D();for(let i=0;i<n;i++){const a=i/n*TAU,cx=Math.cos(a)*r*.55,cy=Math.sin(a)*r*.55;p.moveTo(cx+Math.cos(a)*r*.5,cy+Math.sin(a)*r*.5);p.ellipse(cx,cy,r*.5,pw,a,0,TAU)}return p}
const sparkle=(r)=>{const p=new Path2D();p.moveTo(0,-r);p.quadraticCurveTo(0,0,r,0);p.quadraticCurveTo(0,0,0,r);p.quadraticCurveTo(0,0,-r,0);p.quadraticCurveTo(0,0,0,-r);p.closePath();return p};

/* ================= 1: Sunny Groove ================= */
BIS.scene('g2-1',{title:'Sunny Groove',blurb:'A big smiling-bright sun shines over colourful rolling hills, with bunting, balloons, butterflies and flowers bopping to the beat.',
setup(S){const st=S.state;
 const RB=['#ff4f6d','#ff9f1c','#ffd23f','#3ddc84','#2ec4f1','#7b61ff','#ff6fd8'];st.RB=RB;
 st.sun={x:960,y:330};
 // static plate: sky + glow + hills
 const hills=[
   {y:640,a:40,n:6,c1:'#b8a8f5',c2:'#d9c9ff'},
   {y:715,a:45,n:7,c1:'#3fc7b0',c2:'#7fe0c8'},
   {y:800,a:42,n:6,c1:'#7fd65a',c2:'#b4ec7a'},
   {y:905,a:34,n:5,c1:'#2fae58',c2:'#58cd6d'}];
 st.hl=hills.map((h,i)=>hillPath(S,h.y,h.a,h.n,i*2.1+.7));
 st.plate=mk(W,H,x=>{
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1f7fe0');g.addColorStop(.35,'#4fb2f2');g.addColorStop(.6,'#9fdcf5');g.addColorStop(.72,'#ffeab0');g.addColorStop(1,'#ffd59a');x.fillStyle=g;x.fillRect(0,0,W,H);
  const r=x.createRadialGradient(960,330,0,960,330,900);r.addColorStop(0,'rgba(255,245,190,.85)');r.addColorStop(.35,'rgba(255,230,150,.35)');r.addColorStop(1,'rgba(255,230,150,0)');x.fillStyle=r;x.fillRect(0,0,W,H);grain(S,x,W,H,.04)});
 st.hillC=mk(W,H,x=>{
  hills.forEach((h,i)=>{const hp=st.hl[i];const top=Math.min(...hp.pts.map(q=>q[1]));const lg=x.createLinearGradient(0,top-40,0,top+260);lg.addColorStop(0,h.c2);lg.addColorStop(1,h.c1);x.fillStyle=lg;x.fill(hp.p);
   // rim light on hill tops
   x.save();x.clip(hp.p);x.strokeStyle='rgba(255,250,210,.45)';x.lineWidth=7;x.translate(0,3);x.stroke(hp.p);x.restore();
   // haze between layers
   if(i<3){const hz=x.createLinearGradient(0,h.y-60,0,h.y+200);hz.addColorStop(0,'rgba(255,240,200,0)');hz.addColorStop(1,'rgba(255,240,210,.22)');x.fillStyle=hz;x.fillRect(0,h.y-60,W,260)}});
  // flower-field dots on near hills
  x.save();x.clip(st.hl[2].p);for(let i=0;i<500;i++){const px=S.R(0,W),py=S.R(760,1080);x.fillStyle=S.pick(['rgba(255,255,255,.55)','rgba(255,220,90,.6)','rgba(255,120,170,.5)']);x.beginPath();x.arc(px,py,S.R(2,4.5)*(py/900),0,TAU);x.fill()}x.restore();
  x.save();x.clip(st.hl[3].p);x.strokeStyle='rgba(20,110,50,.35)';x.lineWidth=3;x.lineCap='round';for(let i=0;i<700;i++){const px=S.R(0,W),py=S.R(880,1080),l=S.R(8,18);x.beginPath();x.moveTo(px,py);x.lineTo(px+S.R(-4,4),py-l);x.stroke()}x.restore();
  x.save();x.clip(st.hl[0].p);grain(S,x,W,H,.05);x.restore()});
 // sun sprite
 st.sunC=mk(420,420,x=>{const g=x.createRadialGradient(190,180,10,210,210,170);g.addColorStop(0,'#fffbe0');g.addColorStop(.45,'#ffe45c');g.addColorStop(1,'#ffb21f');x.fillStyle=g;x.beginPath();x.arc(210,210,170,0,TAU);x.fill();
   x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=10;x.beginPath();x.arc(210,210,148,Math.PI*1.05,Math.PI*1.5);x.stroke();
   x.strokeStyle='rgba(255,140,0,.5)';x.lineWidth=12;x.beginPath();x.arc(210,210,164,0,TAU);x.stroke()});
 st.glow=sprite('rgba(255,240,170,1)');
 st.clouds=[];for(let i=0;i<6;i++){const w=S.R(300,480);st.clouds.push({c:cloud(S,w,w*.42,'#ffffff','#dcecff'),x:S.R(0,W),y:S.R(120,470),sec:S.R(110,200)*(1+i*.1),w})}
 // trees on hill 1/2
 st.trees=[];for(let i=0;i<11;i++){const li=i%2?1:2,x=S.R(40,W-40);if(li==2&&x>620&&x<1300)continue;const y=yOn(st.hl[li].pts,x)+8;st.trees.push({x,y,s:li==1?.6:1,c:S.pick(['#1f9e5a','#2bb673','#159c8c','#5cc23d']),o:S.R(0,1)})}
 st.trees.sort((a,b)=>a.y-b.y);
 // foreground flowers (sides heavier)
 st.flowers=[];for(let i=0;i<34;i++){let x=S.R(0,W);if(x>650&&x<1270&&S.rnd()<.75)x=S.rnd()<.5?S.R(0,620):S.R(1300,W);const y=yOn(st.hl[3].pts,x)+S.R(20,160);
   st.flowers.push({x,y,h:S.R(50,110),r:S.R(18,30),c:S.pick(RB),n:S.RI(5,8),o:i%2?.5:0,sw:S.R(0,1),path:null})}
 st.flowers.forEach(f=>f.path=petals(f.n,f.r,f.r*.36));st.flowers.sort((a,b)=>a.y-b.y);
 // bunting
 st.bunt=[];for(let s=0;s<2;s++){const n=22,x0=s?-40:-40,x1=s?1960:1960,y0=s?150:40,sag=s?-0:120;for(let i=0;i<n;i++){const t=(i+.5)/n;st.bunt.push({s,t,c:RB[(i+s*3)%7],o:S.R(0,1)})}}
 st.confetti=[];for(let i=0;i<130;i++)st.confetti.push({x:S.R(0,W),y:S.R(0,H),w:S.R(12,22),h:S.R(6,11),c:S.pick(RB),sec:S.R(26,48),sw:S.R(20,60),sws:S.R(5,10),o:S.R(0,1),spin:S.R(2.5,5),rot:S.R(0,TAU)});
 st.balloons=[];for(let i=0;i<9;i++){const side=i%2;st.balloons.push({x:side?S.R(1350,1880):S.R(40,570),y:S.R(0,H),r:S.R(38,58),c:RB[(i*3)%7],sec:S.R(40,70),o:S.R(0,1)})}
 st.bflies=[];for(let i=0;i<5;i++)st.bflies.push({x:S.R(150,1770),y:S.R(560,820),ax:S.R(80,200),ay:S.R(40,90),sx:S.R(20,40),sy:S.R(12,22),c:S.pick(['#ff6fd8','#ffd23f','#7b61ff','#ff9f1c']),o:S.R(0,1)});
},
draw(S){const c=S.ctx,st=S.state,sx=st.sun.x,sy=st.sun.y;
 c.drawImage(st.plate,0,0);
 // rotating rays
 const rot=TAU*S.saw(118)/16*2;
 c.save();c.translate(sx,sy);c.rotate(rot);const rg=c.createRadialGradient(0,0,150,0,0,1150);rg.addColorStop(0,'rgba(255,255,230,.32)');rg.addColorStop(1,'rgba(255,255,230,0)');c.fillStyle=rg;
 c.beginPath();for(let i=0;i<16;i++){const a=i/16*TAU,d=TAU/64;c.moveTo(0,0);c.arc(0,0,1200,a-d,a+d)}c.fill();c.restore();
 const kb=kick(S,1,0,3);
 c.globalCompositeOperation='lighter';c.globalAlpha=.55+.15*kb;const gr=520+30*kb;c.drawImage(st.glow,sx-gr,sy-gr,gr*2,gr*2);c.globalAlpha=1;c.globalCompositeOperation='source-over';
 const ss=1+.03*kb;S.at(sx,sy,0,ss,()=>c.drawImage(st.sunC,-210,-210));
 // clouds
 for(const k of st.clouds){const x=S.wrap(k.x,k.sec,W,k.w,1);c.globalAlpha=.95;c.drawImage(k.c,x-k.w/2,k.y)}c.globalAlpha=1;
 c.drawImage(st.hillC,0,0);
 // trees sway
 for(const t of st.trees){const sw=.04*S.osc(4.2,t.o)+.02*Math.sin(TAU*beat(S,2,t.o));S.at(t.x,t.y,sw,t.s,()=>{c.fillStyle='#7a4b2a';c.fillRect(-7,-70,14,72);c.fillStyle=t.c;c.beginPath();c.arc(0,-112,58,0,TAU);c.arc(-34,-84,36,0,TAU);c.arc(34,-84,36,0,TAU);c.fill();
   c.fillStyle='rgba(255,255,200,.28)';c.beginPath();c.arc(-16,-132,26,0,TAU);c.fill()})}
 // butterflies
 for(const b of st.bflies){const x=b.x+b.ax*S.osc(b.sx,b.o),y=b.y+b.ay*S.osc(b.sy,b.o+.3),fl=.35+.65*Math.abs(Math.sin(Math.PI*beat(S,1,b.o)));
   S.at(x,y,.25*S.osc(b.sx,b.o+.25),1,()=>{c.fillStyle=b.c;c.beginPath();c.ellipse(-14*fl,-6,16*fl,12,-.4,0,TAU);c.ellipse(14*fl,-6,16*fl,12,.4,0,TAU);c.fill();c.beginPath();c.ellipse(-10*fl,9,10*fl,8,.3,0,TAU);c.ellipse(10*fl,9,10*fl,8,-.3,0,TAU);c.fill();c.fillStyle='#3a2a50';c.fillRect(-2.5,-12,5,26)})}
 // flowers bop on beat (alternate on/off-beat)
 c.lineCap='round';
 for(const f of st.flowers){const b=bounce(S,2,f.o),sway=.08*S.osc(5,f.sw);const hx=f.x+Math.sin(sway)*f.h,hy=f.y-f.h*(1+.06*b);
   c.strokeStyle='#1f8a45';c.lineWidth=6;c.beginPath();c.moveTo(f.x,f.y);c.quadraticCurveTo(f.x,f.y-f.h*.5,hx,hy);c.stroke();
   c.fillStyle='#35b858';c.beginPath();c.ellipse(f.x+12,f.y-f.h*.35,14,6,-.5,0,TAU);c.fill();
   S.at(hx,hy,sway*2+.3*b,1+.1*b,()=>{c.fillStyle=f.c;c.fill(f.path);c.fillStyle='#ffe066';c.beginPath();c.arc(0,0,f.r*.38,0,TAU);c.fill();c.fillStyle='rgba(255,255,255,.4)';c.beginPath();c.arc(-f.r*.12,-f.r*.12,f.r*.14,0,TAU);c.fill()})}
 // balloons
 for(const b of st.balloons){const y=S.wrap(b.y,b.sec,H,160,-1),x=b.x+25*S.osc(9,b.o);
   c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=2;c.beginPath();c.moveTo(x,y+b.r*1.15);c.quadraticCurveTo(x+14*S.osc(4,b.o),y+b.r*1.9,x,y+b.r*2.8);c.stroke();
   c.fillStyle=b.c;c.beginPath();c.ellipse(x,y,b.r*.86,b.r,0,0,TAU);c.fill();c.beginPath();c.moveTo(x-7,y+b.r*1.12);c.lineTo(x+7,y+b.r*1.12);c.lineTo(x,y+b.r*.95);c.fill();
   c.fillStyle='rgba(255,255,255,.45)';c.beginPath();c.ellipse(x-b.r*.32,y-b.r*.38,b.r*.16,b.r*.28,-.4,0,TAU);c.fill()}
 // bunting
 for(let s=0;s<2;s++){const y0=s?-10:-10,sag=s?95:160,amp=6*S.osc(6,s*.4);const pt=t=>s?[-40+t*820,y0+sag*4*t*(1-t)+amp]:[1100+t*860,y0+sag*4*t*(1-t)+amp];
   c.strokeStyle='rgba(60,40,90,.6)';c.lineWidth=3;c.beginPath();for(let i=0;i<=20;i++){const q=pt(i/20);i?c.lineTo(q[0],q[1]):c.moveTo(q[0],q[1])}c.stroke();
   for(const fl of st.bunt){if(fl.s!==s)continue;const q=pt(fl.t),q2=pt(fl.t+.02),a=Math.atan2(q2[1]-q[1],q2[0]-q[0]);
     S.at(q[0],q[1],a*.6+.12*S.osc(3.5,fl.o),1,()=>{c.fillStyle=fl.c;c.beginPath();c.moveTo(-22,0);c.lineTo(22,0);c.lineTo(0,48);c.closePath();c.fill();c.fillStyle='rgba(255,255,255,.25)';c.beginPath();c.moveTo(-22,0);c.lineTo(0,0);c.lineTo(0,48);c.fill()})}}
 // confetti
 for(const f of st.confetti){const y=S.wrap(f.y,f.sec,H,30,1),x=f.x+f.sw*S.osc(f.sws,f.o),fl=Math.max(.15,Math.abs(Math.cos(TAU*(S.cycles(f.spin)*S.p+f.o))));
   c.fillStyle=f.c;S.at(x,y,f.rot+.8*S.osc(f.sws,f.o+.25),1,()=>c.fillRect(-f.w/2,-f.h*fl/2,f.w,f.h*fl))}
}});

/* ================= 2: Disco Night ================= */
BIS.scene('g2-2',{title:'Disco Night',blurb:'A glittering mirror ball spins above a glowing rainbow dance floor, with coloured spotlights sweeping a velvet stage.',
setup(S){const st=S.state;
 st.hz=700;
 st.plate=mk(W,H,x=>{const g=x.createLinearGradient(0,0,0,st.hz);g.addColorStop(0,'#0d0630');g.addColorStop(.6,'#2a0d5e');g.addColorStop(1,'#5a1670');x.fillStyle=g;x.fillRect(0,0,W,st.hz+5);
  const r=x.createRadialGradient(960,260,0,960,300,900);r.addColorStop(0,'rgba(170,80,255,.35)');r.addColorStop(1,'rgba(170,80,255,0)');x.fillStyle=r;x.fillRect(0,0,W,st.hz);
  // back wall panels
  x.strokeStyle='rgba(255,255,255,.05)';x.lineWidth=2;for(let i=0;i<24;i++){x.beginPath();x.moveTo(i*84,0);x.lineTo(i*84,st.hz);x.stroke()}
  // curtains
  const curt=(x0,dir)=>{const w=360;for(let i=0;i<9;i++){const cx=x0+dir*i*w/9;const lg=x.createLinearGradient(cx-26,0,cx+26,0);lg.addColorStop(0,'#5a0a3a');lg.addColorStop(.5,'#c21d6b');lg.addColorStop(1,'#5a0a3a');x.fillStyle=lg;x.fillRect(cx-26,0,54,H)}};
  curt(30,1);curt(1890,-1);
  // valance at top
  x.fillStyle='#8a1350';x.beginPath();x.moveTo(0,0);x.lineTo(W,0);x.lineTo(W,70);for(let i=12;i>=0;i--){x.quadraticCurveTo(i*160+80,120,i*160,70)}x.closePath();x.fill();
  x.strokeStyle='#ffc94a';x.lineWidth=6;x.beginPath();x.moveTo(W,70);for(let i=12;i>=0;i--){x.quadraticCurveTo(i*160+80,120,i*160,70)}x.stroke();
  grain(S,x,W,H,.05)});
 st.beam=mk(260,1400,x=>{const g=x.createLinearGradient(0,0,0,1400);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.beginPath();x.moveTo(122,0);x.lineTo(138,0);x.lineTo(260,1400);x.lineTo(0,1400);x.closePath();x.fill()});
 st.tint=['#ff3d9a','#29d3ff','#ffd23f','#9b6bff','#3ddc84'];
 st.beamC=st.tint.map(col=>mk(260,1400,x=>{x.drawImage(st.beam,0,0);x.globalCompositeOperation='source-in';x.fillStyle=col;x.fillRect(0,0,260,1400)}));
 st.beams=[{x:420,y:60,c:0,b:.35,sec:9},{x:760,y:60,c:1,b:.15,sec:12},{x:1160,y:60,c:2,b:-.15,sec:11},{x:1500,y:60,c:3,b:-.35,sec:9.5},{x:960,y:60,c:4,b:0,sec:15}];
 st.glow=sprite('rgba(255,255,255,1)');st.glowP=sprite('rgba(255,90,200,1)');
 st.ball={x:960,y:290,r:175};
 st.glowY=sprite('rgba(255,210,90,1)',64);
 st.bulbs=[];for(let y=690;y>160;y-=38)st.bulbs.push([410,y]);for(let x=410;x<=1510;x+=38)st.bulbs.push([x,150]);for(let y=150;y<=690;y+=38)st.bulbs.push([1510,y]);
 st.shade=mk(360,360,x=>{const g=x.createRadialGradient(130,120,10,180,180,178);g.addColorStop(0,'rgba(255,255,255,.25)');g.addColorStop(.6,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(10,0,40,.6)');x.fillStyle=g;x.beginPath();x.arc(180,180,176,0,TAU);x.fill()});
 st.spark=sparkle(1);
 st.dots=[];for(let i=0;i<150;i++){const y=S.R(80,st.hz+40);st.dots.push({x:S.R(0,W),y,r:S.R(4,11),c:S.pick(['#ffffff','#ffe3f6','#bff4ff','#fff1b0']),o:S.R(0,1),tw:S.R(1.2,3)})}
 st.speak=[[150,1],[1770,-1]];
 st.conf=[];for(let i=0;i<70;i++)st.conf.push({x:S.R(0,W),y:S.R(0,H),c:S.pick(st.tint),sec:S.R(30,55),o:S.R(0,1),sp:S.R(2.5,4.5),w:S.R(10,18)});
},
draw(S){const c=S.ctx,st=S.state,hz=st.hz,b=st.ball;
 c.drawImage(st.plate,0,0);
 // reflections drifting on walls (move with ball rotation)
 c.globalCompositeOperation='lighter';
 for(const d of st.dots){const x=S.wrap(d.x,24,W,30,1),tw=.25+.75*S.osc01(d.tw*2,d.o);c.globalAlpha=.55*tw;c.fillStyle=d.c;S.at(x,d.y,0,d.r*(.7+.5*tw),()=>c.fill(st.spark))}
 // beams
 for(const be of st.beams){const a=be.b+.32*S.osc(be.sec*2,be.c*.21);c.globalAlpha=.32+.1*kick(S,2,be.c*.25,2);S.at(be.x,be.y,a,1,()=>c.drawImage(st.beamC[be.c],-130,0))}
 c.globalAlpha=1;c.globalCompositeOperation='source-over';
 // floor
 const rows=8,cols=16,vx=960,vy=hz-520,K=kick(S,2,0,2),step=Math.floor(BEATS/4*S.p);
 const rowY=t=>hz+(H-hz)*Math.pow(t,1.7);
 const colX=(j,y)=>vx+((j/cols)-.5)*3600*((y-vy)/(H-vy));
 for(let i=0;i<rows;i++){const y0=rowY(i/rows),y1=rowY((i+1)/rows);
  for(let j=0;j<cols;j++){const h=hash(i*31+j*7+step*13.7),lit=h>.45;const col=st.tint[Math.floor(hash(i*17+j*5+step*3.1)*5)];
   c.fillStyle=col;c.globalAlpha=lit?.75+.25*K:.32;c.beginPath();c.moveTo(colX(j,y0)+3,y0+2);c.lineTo(colX(j+1,y0)-3,y0+2);c.lineTo(colX(j+1,y1)-3,y1-2);c.lineTo(colX(j,y1)+3,y1-2);c.closePath();
   if(!(i==0&&false)){c.fill()}}}
 c.globalAlpha=1;
 // floor gap lines / darkness toward horizon
 const fg=c.createLinearGradient(0,hz,0,H);fg.addColorStop(0,'rgba(20,5,50,.6)');fg.addColorStop(.45,'rgba(20,5,50,.05)');fg.addColorStop(1,'rgba(20,5,50,.2)');c.fillStyle=fg;c.fillRect(0,hz,W,H-hz);
 c.fillStyle='rgba(255,200,90,.9)';c.fillRect(0,hz-4,W,5);
 // ball glow reflection on floor
 c.globalCompositeOperation='lighter';c.globalAlpha=.25+.1*K;c.drawImage(st.glowP,960-600,hz-60,1200,260);
 // ball glow
 c.globalAlpha=.45+.12*kick(S,1,0,3);c.drawImage(st.glowP,b.x-430,b.y-430,860,860);c.globalAlpha=.35;c.drawImage(st.glow,b.x-260,b.y-260,520,520);
 c.globalAlpha=1;c.globalCompositeOperation='source-over';
 // marquee bulbs: arch frame, chase one step per beat (444 % 3 == 0, seamless)
 const kb=Math.floor(BEATS*S.p)%3;
 for(let i=0;i<st.bulbs.length;i++){const q=st.bulbs[i],on=(i+kb)%3==0;
  if(on){c.globalCompositeOperation='lighter';c.globalAlpha=.5;c.drawImage(st.glowY,q[0]-26,q[1]-26,52,52);c.globalCompositeOperation='source-over'}
  c.globalAlpha=1;c.fillStyle=on?'#fff6c8':'#b07a3a';c.beginPath();c.arc(q[0],q[1],on?8:6,0,TAU);c.fill()}
 // ball string
 c.strokeStyle='#c9b8ff';c.lineWidth=4;c.beginPath();c.moveTo(b.x,60);c.lineTo(b.x,b.y-b.r);c.stroke();
 // facets
 const rot=TAU*S.saw(16),R=b.r,NL=14;
 c.fillStyle='#3a3460';c.beginPath();c.arc(b.x,b.y,R,0,TAU);c.fill();
 for(let i=0;i<NL;i++){const la0=-Math.PI/2+i*Math.PI/NL,la1=la0+Math.PI/NL,lm=(la0+la1)/2,n=Math.max(6,Math.round(28*Math.cos(lm)));
  for(let j=0;j<n;j++){let lo0=j/n*TAU+rot,lo1=lo0+TAU/n,lom=(lo0+lo1)/2;if(Math.cos(lom)<0.05)continue;
   const P=(la,lo)=>[b.x+R*Math.cos(la)*Math.sin(lo),b.y+R*Math.sin(la)];
   const a=P(la0,lo0),bb=P(la0,lo1),cc=P(la1,lo1),d=P(la1,lo0);
   const nx=Math.cos(lm)*Math.sin(lom),ny=Math.sin(lm),nz=Math.cos(lm)*Math.cos(lom);
   const diff=Math.max(0,-.45*nx-.55*ny+.7*nz),spec=Math.pow(Math.max(0,-.3*nx-.5*ny+.81*nz),40);
   const hv=hash(i*97+j*13);let L=40+40*diff+hv*18;
   if(spec>.3||hv>.94){c.fillStyle=hv>.97?st.tint[j%5]:'#ffffff'}else c.fillStyle=`hsl(${250+hv*40},${25+hv*30}%,${L}%)`;
   c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(bb[0],bb[1]);c.lineTo(cc[0],cc[1]);c.lineTo(d[0],d[1]);c.closePath();c.fill()}}
 c.drawImage(st.shade,b.x-180,b.y-180);
 // glints on ball
 c.globalCompositeOperation='lighter';
 for(let g=0;g<3;g++){const tw=S.pulse(1.6,g*.33,3);c.globalAlpha=tw;c.fillStyle='#fff';S.at(b.x-50+g*45,b.y-60+g*30,0,22+20*tw,()=>c.fill(st.spark))}
 c.globalAlpha=1;c.globalCompositeOperation='source-over';
 // speakers
 for(const [sx,dir] of st.speak){const w=230,h=360,x0=sx-w/2,y0=H-h-30;
  c.fillStyle='#160a2c';c.beginPath();c.roundRect(x0,y0,w,h,16);c.fill();c.strokeStyle='rgba(255,120,220,.5)';c.lineWidth=4;c.stroke();
  const pulse=kick(S,1,0,3);
  [[y0+90,48],[y0+235,78]].forEach(([cy,r])=>{c.fillStyle='#2b1a4a';c.beginPath();c.arc(sx,cy,r+10,0,TAU);c.fill();
   c.fillStyle='#0b0418';c.beginPath();c.arc(sx,cy,r*(1+.05*pulse),0,TAU);c.fill();c.strokeStyle='rgba(41,211,255,.6)';c.lineWidth=3;c.beginPath();c.arc(sx,cy,r*(1+.05*pulse),0,TAU);c.stroke();
   c.fillStyle='#3a2a60';c.beginPath();c.arc(sx,cy,r*.32,0,TAU);c.fill()})}
 // drifting confetti glints
 for(const f of st.conf){const y=S.wrap(f.y,f.sec,H,20,1),fl=Math.max(.15,Math.abs(Math.cos(TAU*(S.cycles(f.sp)*S.p+f.o))));c.fillStyle=f.c;c.globalAlpha=.85;S.at(f.x+30*S.osc(7,f.o),y,f.o*TAU,1,()=>c.fillRect(-f.w/2,-4*fl,f.w,8*fl))}
 c.globalAlpha=1;
}});

/* ================= 3: Retro Rainbow ================= */
BIS.scene('g2-3',{title:'Retro Rainbow',blurb:'A big 70s-style rainbow and striped sunset sun glow on a sunburst sky, with daisies, hearts and sparkles dancing around.',
setup(S){const st=S.state;
 st.cx=960;st.cy=1130;
 st.stripes=['#e8475f','#ff8a3d','#ffc23c','#2bb3a3','#5b6bd6'];
 st.plate=mk(W,H,x=>{const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#ff8fab');g.addColorStop(.45,'#ffc4a3');g.addColorStop(1,'#fff0cf');x.fillStyle=g;x.fillRect(0,0,W,H);grain(S,x,W,H,.05)});
 // rainbow (static)
 st.rain=mk(W,H,x=>{const R0=920,sw=86,gap=12;x.lineCap='butt';
  st.stripes.forEach((col,i)=>{const r=R0-i*(sw+gap)-sw/2;x.strokeStyle='#fff6e4';x.lineWidth=sw+gap*1.6;x.beginPath();x.arc(st.cx,st.cy,r,Math.PI,TAU);x.stroke();
   x.strokeStyle=col;x.lineWidth=sw;x.beginPath();x.arc(st.cx,st.cy,r,Math.PI,TAU);x.stroke();
   x.strokeStyle='rgba(255,255,255,.22)';x.lineWidth=10;x.beginPath();x.arc(st.cx,st.cy,r+sw*.3,Math.PI,TAU);x.stroke();
   x.strokeStyle='rgba(0,0,0,.08)';x.lineWidth=12;x.beginPath();x.arc(st.cx,st.cy,r-sw*.32,Math.PI,TAU);x.stroke()});
  grain(S,x,0,0,0)});
 st.R0=920;st.sw=86;st.gap=12;
 // sun with retro stripes
 st.sun=mk(760,420,x=>{const r=340,cx=380,cy=400;x.save();x.beginPath();x.arc(cx,cy,r,Math.PI,TAU);x.closePath();x.clip();
  const g=x.createLinearGradient(0,cy-r,0,cy);g.addColorStop(0,'#ffe066');g.addColorStop(1,'#ff6b4a');x.fillStyle=g;x.fillRect(0,0,760,420);
  x.globalCompositeOperation='destination-out';for(let i=0;i<6;i++){const y=cy-150+i*32,h=6+i*3.2;x.fillRect(0,y,760,h)}x.restore()});
 st.glow=sprite('rgba(255,236,170,1)');
 st.cl=[cloud(S,560,240,'#ffffff','#ffe3ef'),cloud(S,520,220,'#ffffff','#ffe3ef'),cloud(S,300,130,'#ffffff','#ffe9f1'),cloud(S,280,120,'#ffffff','#ffe9f1')];
 st.daisy=[];const spots=[[150,170,1],[420,90,.6],[300,430,.75],[1770,180,1],[1520,95,.6],[1640,440,.8],[90,620,.55],[1840,640,.6],[700,60,.45],[1230,70,.5]];
 const DC=['#ffffff','#ffd6e7','#fff3b0','#c8f2ec'];
 spots.forEach(([x,y,s],i)=>st.daisy.push({x,y,s,c:DC[i%4],path:petals(12,90,20),o:i%2?.5:0,dir:i%2?1:-1}));
 st.heart=S.heartPath(30);
 st.hearts=[];for(let i=0;i<16;i++){const side=i%2;st.hearts.push({x:side?S.R(1260,1880):S.R(40,660),y:S.R(0,H),s:S.R(.9,1.7),c:S.pick(['#ff5d8f','#e8475f','#ff8a3d','#c04bd6']),sec:S.R(45,80),o:S.R(0,1)})}
 st.spark=sparkle(1);
 st.sparks=[];for(let i=0;i<40;i++)st.sparks.push({x:S.R(0,W),y:S.R(0,700),r:S.R(10,24),o:S.R(0,1),sec:S.R(2,4),c:S.pick(['#ffffff','#fff3b0','#ffe0ef'])});
 st.squig=[];for(let i=0;i<6;i++)st.squig.push({x:S.R(0,W),y:S.R(60,560),c:S.pick(st.stripes),sec:S.R(70,110),o:S.R(0,1)});
},
draw(S){const c=S.ctx,st=S.state,cx=st.cx,cy=st.cy;
 c.drawImage(st.plate,0,0);
 // sunburst rays
 const rot=TAU*S.saw(236)/1;
 c.save();c.translate(cx,cy);c.rotate(rot);c.fillStyle='rgba(255,255,255,.2)';c.beginPath();for(let i=0;i<28;i++){const a=i/28*TAU;c.moveTo(0,0);c.arc(0,0,2300,a,a+TAU/56)}c.fill();c.restore();
 // squiggles drifting
 c.lineCap='round';c.lineWidth=9;
 for(const q of st.squig){const x=S.wrap(q.x,q.sec,W,140,1),y=q.y+20*S.osc(13,q.o);c.strokeStyle=q.c;c.globalAlpha=.6;c.beginPath();for(let k=0;k<=20;k++){const t=k/20,px=x-90+180*t,py=y+16*Math.sin(t*TAU*1.5+TAU*S.saw(6,q.o));k?c.lineTo(px,py):c.moveTo(px,py)}c.stroke()}
 c.globalAlpha=1;
 // sparkles
 for(const s of st.sparks){const tw=S.pulse(s.sec,s.o,2);c.globalAlpha=.25+.75*tw;c.fillStyle=s.c;S.at(s.x,s.y,0,s.r*(.5+.6*tw),()=>c.fill(st.spark))}
 c.globalAlpha=1;
 // rainbow + shimmer
 c.drawImage(st.rain,0,0);
 c.lineWidth=st.sw*.55;c.lineCap='round';
 st.stripes.forEach((col,i)=>{const r=st.R0-i*(st.sw+st.gap)-st.sw/2,a=Math.PI+Math.PI*S.saw(12,-i*.06);
  c.strokeStyle='rgba(255,255,255,.33)';c.beginPath();c.arc(cx,cy,r,Math.max(Math.PI,a-.16),Math.min(TAU,a+.16));c.stroke()});
 // sun glow + sun bounce
 const K=kick(S,1,0,3);
 c.globalCompositeOperation='lighter';c.globalAlpha=.5+.12*K;c.drawImage(st.glow,cx-560,cy-700,1120,1120);c.globalAlpha=1;c.globalCompositeOperation='source-over';
 S.at(cx,cy-30,0,1+.025*K,()=>c.drawImage(st.sun,-380,-400));
 // daisies (spin, bop on alternating beats)
 for(const d of st.daisy){const b=bounce(S,2,d.o);S.at(d.x,d.y+8*b,d.dir*TAU*S.saw(40,d.o)+.12*b,d.s*(1+.06*b),()=>{c.fillStyle='rgba(120,40,80,.12)';c.save();c.translate(6,8);c.fill(d.path);c.restore();c.fillStyle=d.c;c.fill(d.path);
   c.fillStyle='#ffb320';c.beginPath();c.arc(0,0,36,0,TAU);c.fill();c.fillStyle='#ff8a1c';c.beginPath();c.arc(4,5,26,0,TAU);c.fill();c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.arc(-10,-10,9,0,TAU);c.fill()})}
 // hearts rising
 for(const h of st.hearts){const y=S.wrap(h.y,h.sec,H,80,-1),x=h.x+30*S.osc(8,h.o);S.at(x,y,.25*S.osc(6,h.o),h.s*(1+.08*bounce(S,2,h.o*2)),()=>{c.fillStyle=h.c;c.fill(st.heart);c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(-12,-16,6,9,-.6,0,TAU);c.fill()})}
 // clouds at rainbow feet, bob on beat
 const cb=bounce(S,2,0),cb2=bounce(S,2,.5);
 c.drawImage(st.cl[0],-40,890-10*cb);c.drawImage(st.cl[1],1440,900-10*cb2);
 c.drawImage(st.cl[2],330,960-6*cb2);c.drawImage(st.cl[3],1300,975-6*cb);
}});
})();
