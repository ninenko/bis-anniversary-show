(function(){
const TAU=Math.PI*2;
function spr(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c}
function glowSpr(hue,sat,l,a=1,size=256){return spr(size,size,(x,w)=>{const g=x.createRadialGradient(w/2,w/2,0,w/2,w/2,w/2);g.addColorStop(0,`hsla(${hue},${sat}%,${l}%,${a})`);g.addColorStop(.5,`hsla(${hue},${sat}%,${l}%,${a*.4})`);g.addColorStop(1,`hsla(${hue},${sat}%,${l}%,0)`);x.fillStyle=g;x.fillRect(0,0,w,w)})}
function sparkSpr(){return spr(128,128,(x)=>{x.translate(64,64);const g=x.createRadialGradient(0,0,0,0,0,40);g.addColorStop(0,'rgba(255,255,255,.9)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(-64,-64,128,128);x.fillStyle='#fff';x.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,r=i%2?5:60;x.lineTo(Math.cos(a)*r,Math.sin(a)*r)}x.closePath();x.fill()})}

/* 1 Opal shimmer */
BIS.scene('g1-1',{title:'Opal Shimmer',blurb:'Slow milky iridescent colour clouds drift and blend like an opal, with tiny twinkling sparkles.',
setup(S){const st=S.state;st.hues=[320,185,265,50,150,210,345,170];st.spr=st.hues.map(h=>glowSpr(h,80,62,.6));
 st.blobs=[];for(let i=0;i<18;i++)st.blobs.push({k:i%8,bx:S.R(150,1770),by:S.R(100,980),ax:S.R(120,380),ay:S.R(80,250),sx:S.R(24,48),sy:S.R(26,55),ox:S.R(0,1),oy:S.R(0,1),r:S.R(380,620),sr:S.R(30,60),a:S.R(.25,.5)});
 st.sp=sparkSpr();st.stars=[];for(let i=0;i<70;i++)st.stars.push({x:S.R(40,1880),y:S.R(40,1040),s:S.R(.2,.55),sec:S.R(5,11),o:S.R(0,1),rot:S.R(0,1)})},
draw(S){const c=S.ctx,st=S.state;S.bg('#2b2358','#4a3a7c','#6f5090');
 c.globalCompositeOperation='lighter';
 for(const b of st.blobs){const x=b.bx+b.ax*S.osc(b.sx,b.ox),y=b.by+b.ay*S.osc(b.sy,b.oy),r=b.r*(1+.12*S.osc(b.sr,b.ox));c.globalAlpha=b.a*(.75+.25*S.osc01(b.sr,b.oy));c.drawImage(st.spr[b.k],x-r,y-r,2*r,2*r)}
 c.globalAlpha=1;
 const sx=S.wrap(0,40,1920,500,1);const g=c.createLinearGradient(sx-400,0,sx+400,1080);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,240,255,.07)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(0,0,1920,1080);
 for(const s of st.stars){const t=S.pulse(s.sec,s.o,3);if(t<.02)continue;const sz=128*s.s*(.3+.9*t);c.globalAlpha=t;S.at(s.x,s.y,s.rot*TAU+.4*S.osc(s.sec*2,s.o),1,()=>c.drawImage(st.sp,-sz/2,-sz/2,sz,sz))}
 c.globalAlpha=1;c.globalCompositeOperation='source-over'}});

/* 2 Hearts through bokeh */
BIS.scene('g1-2',{title:'Rising Hearts',blurb:'Soft glowing hearts float upward through warm pink bokeh lights.',
setup(S){const st=S.state;
 st.bok=[];const hues=[335,350,15,40,300,320];for(let i=0;i<55;i++){const h=S.pick(hues),r=S.R(34,120);st.bok.push({x:S.R(0,1920),y:S.R(0,1080),r,sec:S.R(60,110),a:S.R(.15,.4),o:S.R(0,1),ts:S.R(8,16),
  img:spr(256,256,(x)=>{const g=x.createRadialGradient(128,128,0,128,128,126);g.addColorStop(0,`hsla(${h},90%,75%,.35)`);g.addColorStop(.85,`hsla(${h},90%,70%,.5)`);g.addColorStop(1,`hsla(${h},90%,70%,0)`);x.fillStyle=g;x.beginPath();x.arc(128,128,126,0,TAU);x.fill()})})}
 const cols=[['#ffd6e4','#ff6f9f'],['#ffe2ef','#f2528c'],['#ffc8d9','#e8457f'],['#ffe9c9','#ff8aa0'],['#f6d3ff','#c768d8']];
 st.hs=cols.map(([a,b])=>spr(300,300,(x)=>{x.translate(150,150);const p=S.heartPath(80);x.shadowColor=b;x.shadowBlur=45;const g=x.createLinearGradient(0,-90,0,60);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fill(p);x.shadowBlur=0;x.fillStyle='rgba(255,255,255,.55)';x.beginPath();x.ellipse(-30,-40,16,9,-.7,0,TAU);x.fill()}));
 st.hearts=[];for(let i=0;i<30;i++)st.hearts.push({k:i%5,x:S.R(80,1840),y:S.R(0,1180),s:S.R(.28,.75),sec:S.R(22,40),sw:S.R(30,80),sws:S.R(9,16),o:S.R(0,1),rot:S.R(.1,.3)})},
draw(S){const c=S.ctx,st=S.state;S.bg('#35133f','#6e2461','#c24f78');
 S.glow(960,1180,1100,'rgba(255,150,150,.5)',1);
 for(const b of st.bok){const y=S.wrap(b.y,b.sec,1080,140,-1),x=b.x+25*S.osc(b.ts,b.o);c.globalAlpha=b.a*(.6+.4*S.osc01(b.ts,b.o));c.drawImage(b.img,x-b.r,y-b.r,2*b.r,2*b.r)}
 c.globalAlpha=1;
 for(const h of st.hearts){const y=S.wrap(h.y,h.sec,1080,180,-1),x=h.x+h.sw*S.osc(h.sws,h.o),sc=h.s*(1+.06*S.pulse(4,h.o,2)),w=300*sc;
  const fade=Math.min(1,y/260+.15);c.globalAlpha=.9*Math.max(0,Math.min(1,fade));S.at(x,y,h.rot*S.osc(h.sws,h.o+.25),1,()=>c.drawImage(st.hs[h.k],-w/2,-w/2,w,w))}
 c.globalAlpha=1}});

/* 3 Prism */
BIS.scene('g1-3',{title:'Crystal Prism',blurb:'A slowly turning crystal throws rainbow light rays while glints float by in a deep violet night.',
setup(S){const st=S.state;st.cx=960;st.cy=470;st.sp=sparkSpr();st.beams=[];const c=S.ctx;
 for(let i=0;i<14;i++){const h=(i*360/14+300)%360;const g=c.createRadialGradient(0,0,40,0,0,1500);g.addColorStop(0,`hsla(${h},90%,70%,.42)`);g.addColorStop(1,`hsla(${h},90%,70%,0)`);st.beams.push({g,a:i*TAU/14,w:S.R(.045,.08)})}
 st.glints=[];for(let i=0;i<55;i++)st.glints.push({x:S.R(0,1920),y:S.R(0,1080),s:S.R(.15,.5),sec:S.R(40,90),o:S.R(0,1),ts:S.R(5,10)});
 st.glow=glowSpr(280,70,70,.9);
 const R=250,top=[0,-R*1.15,0],bot=[0,R*1.15,0];st.ring=[];for(let i=0;i<6;i++){const a=i*TAU/6;st.ring.push([Math.cos(a)*R*.8,0,Math.sin(a)*R*.8])}
 st.faces=[];for(let i=0;i<6;i++){const a=st.ring[i],b=st.ring[(i+1)%6];st.faces.push([top,a,b,0,i]);st.faces.push([bot,b,a,1,i])}},
draw(S){const c=S.ctx,st=S.state;S.bg('#150d30','#2a1650','#3f1f66');
 S.glow(960,1100,900,'rgba(180,90,220,.35)',1);
 const cx=st.cx,cy=st.cy;
 c.globalCompositeOperation='lighter';
 const spin=TAU*S.saw(80);
 for(const b of st.beams){c.fillStyle=b.g;S.at(cx,cy,b.a+spin,1,()=>{c.beginPath();c.moveTo(0,0);c.lineTo(1700,-1700*Math.tan(b.w));c.lineTo(1700,1700*Math.tan(b.w));c.closePath();c.fill()})}
 c.globalCompositeOperation='source-over';
 S.glow(cx,cy,420*(1+.03*S.osc(9)),'rgba(220,170,255,.5)',1);
 const ay=TAU*S.saw(54),tilt=.45;const cy_=Math.cos(ay),sy=Math.sin(ay),ct=Math.cos(tilt),stl=Math.sin(tilt);
 const P=v=>{const x=v[0]*cy_+v[2]*sy,z=-v[0]*sy+v[2]*cy_,y=v[1];return [x,y*ct-z*stl,y*stl+z*ct]};
 const fs=st.faces.map(f=>{const a=P(f[0]),b=P(f[1]),d=P(f[2]);const cz=(a[2]+b[2]+d[2])/3;const e1=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],e2=[d[0]-a[0],d[1]-a[1],d[2]-a[2]];let n=[e1[1]*e2[2]-e1[2]*e2[1],e1[2]*e2[0]-e1[0]*e2[2],e1[0]*e2[1]-e1[1]*e2[0]];const l=Math.hypot(...n)||1;n=n.map(v=>v/l);
  const mc=[(a[0]+b[0]+d[0])/3,(a[1]+b[1]+d[1])/3,cz];if(n[0]*mc[0]+n[1]*mc[1]+n[2]*mc[2]<0)n=n.map(v=>-v);return {pts:[a,b,d],cz,n,i:f[4]}}).sort((p,q)=>p.cz-q.cz);
 c.lineJoin='round';
 for(const f of fs){const hue=(260+f.i*55+f.n[0]*80+f.n[1]*60+S.saw(54)*360)%360;const li=40+30*Math.max(0,f.n[2])+12*(-f.n[1]);
  c.beginPath();f.pts.forEach((p,k)=>k?c.lineTo(cx+p[0],cy+p[1]):c.moveTo(cx+p[0],cy+p[1]));c.closePath();
  c.fillStyle=`hsla(${hue},85%,${Math.min(85,li)}%,${f.n[2]>0?.8:.5})`;c.fill();c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=3;c.stroke()}
 c.globalCompositeOperation='lighter';
 const gl=520+40*S.osc(7);c.globalAlpha=.5;c.drawImage(st.glow,cx-gl/2,cy-gl/2,gl,gl);c.globalAlpha=1;
 for(const g of st.glints){const y=S.wrap(g.y,g.sec,1080,60,-1),t=S.pulse(g.ts,g.o,2),sz=128*g.s*(.5+t);c.globalAlpha=.25+.75*t;c.drawImage(st.sp,g.x-sz/2,y-sz/2,sz,sz)}
 c.globalAlpha=1;c.globalCompositeOperation='source-over'}});
})();
