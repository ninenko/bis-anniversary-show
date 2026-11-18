(function(){
const TAU=Math.PI*2;
function spr(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c}
function glowSpr(r,g,b,a=1,size=128){return spr(size,size,(x,w)=>{const gr=x.createRadialGradient(w/2,w/2,0,w/2,w/2,w/2);gr.addColorStop(0,`rgba(${r},${g},${b},${a})`);gr.addColorStop(.35,`rgba(${r},${g},${b},${a*.35})`);gr.addColorStop(1,`rgba(${r},${g},${b},0)`);x.fillStyle=gr;x.fillRect(0,0,w,w)})}

/* 1 Dreamy night */
BIS.scene('g3-1',{title:'Dreamy Night Hill',blurb:'Twinkling stars, a crescent moon and the odd shooting star over a quiet hill with one tree and fireflies.',
setup(S){const st=S.state;st.stars=[];for(let i=0;i<230;i++)st.stars.push({x:S.R(0,1920),y:S.R(0,720)**1*S.R(.4,1)*1,s:S.R(1,3.2),sec:S.R(4,12),o:S.R(0,1)});
 st.warm=glowSpr(255,230,150,1);st.fly=glowSpr(255,240,130,1);st.moon=glowSpr(200,215,255,.9,256);
 const hill=new Path2D();hill.moveTo(0,1080);hill.lineTo(0,800);hill.bezierCurveTo(300,740,600,690,900,720);hill.bezierCurveTo(1200,750,1500,830,1920,790);hill.lineTo(1920,1080);hill.closePath();st.hill=hill;
 st.far=new Path2D();st.far.moveTo(0,1080);st.far.lineTo(0,830);st.far.bezierCurveTo(400,770,800,860,1200,810);st.far.bezierCurveTo(1500,775,1700,820,1920,800);st.far.lineTo(1920,1080);st.far.closePath();
 const tree=new Path2D();tree.moveTo(-14,0);tree.bezierCurveTo(-10,-80,-8,-140,-4,-190);tree.lineTo(4,-190);tree.bezierCurveTo(8,-140,10,-80,14,0);tree.closePath();
 [[0,-260,95],[-70,-215,70],[75,-225,72],[-30,-320,60],[40,-310,62],[0,-190,70]].forEach(([x,y,r])=>{tree.moveTo(x+r,y);tree.arc(x,y,r,0,TAU)});st.tree=tree;
 st.flies=[];for(let i=0;i<30;i++)st.flies.push({x:S.R(100,1850),y:S.R(740,1020),ax:S.R(30,90),ay:S.R(20,60),sx:S.R(9,18),sy:S.R(8,16),o:S.R(0,1),o2:S.R(0,1),ts:S.R(3,6)});
 st.shoot=[{sec:37,off:.1,x:1500,y:130,len:360,ang:.5},{sec:55.5,off:.55,x:700,y:70,len:300,ang:.42},{sec:111,off:.3,x:1100,y:200,len:340,ang:.55}]},
draw(S){const c=S.ctx,st=S.state;S.bg('#0a0f36','#1d1a5c','#4a2c78','#a35a8a');
 const g=c.createLinearGradient(0,0,0,1080);g.addColorStop(0,'#090d33');g.addColorStop(.55,'#241a60');g.addColorStop(.8,'#6b3a86');g.addColorStop(1,'#c07a8c');c.fillStyle=g;c.fillRect(0,0,1920,1080);
 for(const s of st.stars){const t=.35+.65*S.osc01(s.sec,s.o);c.globalAlpha=t*(1-s.y/1100*.6);c.fillStyle='#fff';c.fillRect(s.x,s.y,s.s,s.s)}
 c.globalAlpha=1;
 // moon
 const mx=1480,my=250;S.glow(mx,my,330,'rgba(190,205,255,.35)',.8+.2*S.osc(12));
 c.save();c.beginPath();c.rect(0,0,1920,1080);c.moveTo(mx+55+82,my-28);c.arc(mx+55,my-28,82,0,TAU);c.clip('evenodd');c.fillStyle='#fff3c9';c.beginPath();c.arc(mx,my,95,0,TAU);c.fill();c.restore();
 // shooting stars
 for(const s of st.shoot){const t=S.saw(s.sec,s.off);if(t>.1)continue;const u=t/.1,hx=s.x+Math.cos(s.ang)*s.len*u*1.6,hy=s.y+Math.sin(s.ang)*s.len*u*1.6,a=Math.sin(u*Math.PI);
  const tx=hx-Math.cos(s.ang)*s.len*.7,ty=hy-Math.sin(s.ang)*s.len*.7;const gr=c.createLinearGradient(tx,ty,hx,hy);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(1,`rgba(255,255,255,${a})`);c.strokeStyle=gr;c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(tx,ty);c.lineTo(hx,hy);c.stroke();
  c.globalAlpha=a;c.drawImage(st.warm,hx-30,hy-30,60,60);c.globalAlpha=1}
 // hills
 c.fillStyle='#1c1850';c.fill(st.far);c.fillStyle='#0c0c2c';c.fill(st.hill);
 S.at(560,722,0,1,()=>{c.fillStyle='#07071f';c.fill(st.tree)});
 // fireflies
 c.globalCompositeOperation='lighter';
 for(const f of st.flies){const x=f.x+f.ax*S.osc(f.sx,f.o),y=f.y+f.ay*S.osc(f.sy,f.o2),a=Math.pow(S.osc01(f.ts,f.o),2);c.globalAlpha=.15+.85*a;const r=14+14*a;c.drawImage(st.fly,x-r,y-r,2*r,2*r)}
 c.globalAlpha=1;c.globalCompositeOperation='source-over'}});

/* 2 Lanterns on a lake */
BIS.scene('g3-2',{title:'Lanterns Over the Lake',blurb:'Warm paper lanterns drift up into a dusk sky and shimmer in the calm lake below.',
setup(S){const st=S.state;const cols=[['#ffb347','#ff6a3d'],['#ffd27a','#ff9d3d'],['#ff9aa2','#e8576b'],['#ffc78a','#f27f4b']];
 st.lan=cols.map(([a,b])=>spr(160,230,(x)=>{const gl=x.createRadialGradient(80,110,10,80,110,80);gl.addColorStop(0,'rgba(255,200,110,.75)');gl.addColorStop(1,'rgba(255,170,80,0)');x.fillStyle=gl;x.fillRect(0,0,160,230);
  x.beginPath();x.roundRect(40,50,80,110,[26,26,12,12]);const g=x.createLinearGradient(0,50,0,160);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fill();
  x.fillStyle='rgba(255,255,230,.5)';x.beginPath();x.ellipse(80,110,22,38,0,0,TAU);x.fill();x.strokeStyle='rgba(120,40,20,.35)';x.lineWidth=2;for(const dx of[-18,18]){x.beginPath();x.moveTo(80+dx*1.1,52);x.quadraticCurveTo(80+dx*2.2,105,80+dx*1.1,158);x.stroke()}
  x.fillStyle='#6b2d1a';x.fillRect(48,46,64,8);x.fillRect(52,158,56,8)}));
 st.hz=640;st.l=[];for(let i=0;i<16;i++)st.l.push({k:i%4,x:S.R(120,1800),sec:S.R(36,60),o:S.R(0,1),sw:S.R(25,60),sws:S.R(10,20),sc:S.R(.55,1.05)});
 const mt=new Path2D();mt.moveTo(0,640);mt.lineTo(0,560);mt.bezierCurveTo(200,500,350,560,550,520);mt.bezierCurveTo(750,480,900,560,1150,525);mt.bezierCurveTo(1400,490,1650,570,1920,520);mt.lineTo(1920,640);mt.closePath();st.mt=mt;
 st.rip=[];for(let i=0;i<60;i++)st.rip.push({y:S.R(650,1080),x:S.R(0,1920),w:S.R(60,260),sec:S.R(6,14),o:S.R(0,1)});
 st.stars=[];for(let i=0;i<60;i++)st.stars.push({x:S.R(0,1920),y:S.R(0,320),sec:S.R(5,10),o:S.R(0,1)})},
draw(S){const c=S.ctx,st=S.state,hz=st.hz;
 let g=c.createLinearGradient(0,0,0,hz);g.addColorStop(0,'#2a2063');g.addColorStop(.5,'#8a4a8c');g.addColorStop(.85,'#f0907a');g.addColorStop(1,'#ffc58a');c.fillStyle=g;c.fillRect(0,0,1920,hz);
 for(const s of st.stars){c.globalAlpha=.8*S.osc01(s.sec,s.o)*(1-s.y/360);c.fillStyle='#fff';c.fillRect(s.x,s.y,2.5,2.5)}c.globalAlpha=1;
 c.fillStyle='#3d2a6a';c.fill(st.mt);
 // lake
 g=c.createLinearGradient(0,hz,0,1080);g.addColorStop(0,'#e08a82');g.addColorStop(.25,'#7a4a8a');g.addColorStop(1,'#1d1650');c.fillStyle=g;c.fillRect(0,hz,1920,440);
 // reflections of mountains (clipped to lake)
 c.save();c.beginPath();c.rect(0,hz,1920,440);c.clip();c.globalAlpha=.35;c.translate(0,2*hz);c.scale(1,-1);c.fillStyle='#3d2a6a';c.fill(st.mt);c.restore();
 // lantern reflections
 c.save();c.beginPath();c.rect(0,hz,1920,440);c.clip();
 for(const l of st.l){const t=S.saw(l.sec,l.o),y=hz+30-t*(hz+330),x=l.x+l.sw*S.osc(l.sws,l.o),sc=l.sc*(.55+.6*t),a=Math.min(1,t*8)*Math.min(1,(1-t)*6+.2);
  const ry=2*hz-y;c.globalAlpha=.32*a;c.save();c.translate(x+8*S.osc(5,l.o),ry);c.scale(sc,-sc*.9);c.drawImage(st.lan[l.k],-80,-115);c.restore()}
 c.restore();c.globalAlpha=1;
 // ripples
 c.strokeStyle='rgba(255,230,210,.5)';c.lineWidth=2;c.lineCap='round';
 for(const r of st.rip){c.globalAlpha=.05+.3*S.osc01(r.sec,r.o);const x=r.x+14*S.osc(r.sec*1.5,r.o);c.beginPath();c.moveTo(x,r.y);c.lineTo(x+r.w,r.y);c.stroke()}
 c.globalAlpha=1;
 // lanterns
 for(const l of st.l){const t=S.saw(l.sec,l.o),y=hz+30-t*(hz+330),x=l.x+l.sw*S.osc(l.sws,l.o),sc=l.sc*(.55+.6*t),a=Math.min(1,t*8)*Math.min(1,(1-t)*6+.2);
  c.globalAlpha=a;S.at(x,y,.07*S.osc(l.sws,l.o+.25),sc*(1+.04*S.osc(4,l.o)),()=>c.drawImage(st.lan[l.k],-80,-115))}
 c.globalAlpha=1}});

/* 3 Misty forest */
BIS.scene('g3-3',{title:'Misty Forest',blurb:'A slow parallax of pine silhouettes drifts through soft mist and glowing particles.',
setup(S){const st=S.state;
 const layers=[{col:'#5b6aa8',base:620,h:[120,200],n:20,sec:111},{col:'#3f4c8a',base:700,h:[170,280],n:16,sec:55.5},{col:'#273066',base:790,h:[230,380],n:12,sec:37},{col:'#121638',base:900,h:[300,470],n:8,sec:27.75}];
 st.layers=layers.map(L=>{const cv=document.createElement('canvas');cv.width=1920;cv.height=1080;const x=cv.getContext('2d');x.fillStyle=L.col;
  const tri=(cx,b,h)=>{const w=h*.36;x.beginPath();x.moveTo(cx,b-h);for(let k=0;k<5;k++){const yy=b-h+h*(k+1)/5,ww=w*(k+1)/5;x.lineTo(cx+ww,yy);x.lineTo(cx+ww*.55,yy-h*.02)}x.lineTo(cx+w*.1,b);x.lineTo(cx-w*.1,b);for(let k=4;k>=0;k--){const yy=b-h+h*(k+1)/5,ww=w*(k+1)/5;x.lineTo(cx-ww*.55,yy-h*.02);x.lineTo(cx-ww,yy)}x.closePath();x.fill()};
  const sp=1920/L.n;for(let i=0;i<L.n;i++){const cx=i*sp+S.R(-sp*.3,sp*.3),h=S.R(L.h[0],L.h[1]);for(const o of[-1920,0,1920])tri(cx+o,L.base,h)}
  x.fillRect(0,L.base-4,1920,1080);return {cv,sec:L.sec}});
 st.mist=[];for(let i=0;i<10;i++)st.mist.push({x:S.R(0,1920),y:S.R(520,900),w:S.R(700,1300),h:S.R(120,200),sec:S.R(55,111),dir:i%2?1:-1,a:S.R(.1,.2)});
 st.mspr=spr(256,128,(x)=>{x.save();x.scale(1,.5);const g=x.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,'rgba(210,225,255,1)');g.addColorStop(1,'rgba(210,225,255,0)');x.fillStyle=g;x.fillRect(0,0,256,256);x.restore()});
 st.pp=glowSpr(190,255,230,1);st.parts=[];for(let i=0;i<90;i++)st.parts.push({x:S.R(0,1920),y:S.R(150,1000),r:S.R(8,22),sec:S.R(40,111),ts:S.R(3,7),o:S.R(0,1),ay:S.R(20,60),sy:S.R(8,18)})},
draw(S){const c=S.ctx,st=S.state;S.bg('#0f1a40','#2a4a80','#8fb0c8');
 S.glow(1350,260,620,'rgba(255,245,220,.55)',1);c.fillStyle='#fff7e0';c.beginPath();c.arc(1350,260,62,0,TAU);c.fill();
 const mist=(from,to)=>{for(let i=from;i<to;i++){const m=st.mist[i];const x=S.wrap(m.x,m.sec,1920,m.w/2,m.dir);c.globalAlpha=m.a*1.6;c.drawImage(st.mspr,x-m.w/2,m.y-m.h/2,m.w,m.h)}c.globalAlpha=1};
 mist(0,3);
 st.layers.forEach((L,i)=>{const x=-1920*S.saw(L.sec);c.drawImage(L.cv,x,0);c.drawImage(L.cv,x+1920,0);if(i==0)mist(3,6);if(i==1)mist(6,8);if(i==2)mist(8,10)});
 c.globalCompositeOperation='lighter';
 for(const p of st.parts){const x=S.wrap(p.x,p.sec,1920,30,-1),y=p.y+p.ay*S.osc(p.sy,p.o),a=.2+.8*S.osc01(p.ts,p.o);c.globalAlpha=a;const r=p.r*2;c.drawImage(st.pp,x-r,y-r,2*r,2*r)}
 c.globalAlpha=1;c.globalCompositeOperation='source-over'}});
})();
