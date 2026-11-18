/* Grade 7B - The Sun Will Rise (choral speaking, 90 s)
   Round 2: three distinct dawns. 1 = first light on the Tian Shan above a still lake,
   2 = a low sun over a calm sea from a pine headland, 3 = backlit dandelion seeds (macro). */
(function(){
const TAU=Math.PI*2,W=1920,H=1080;
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')]};
function glowSprite(r,rgb,a0=1){const [c,x]=mk(r*2,r*2);
  const g=x.createRadialGradient(r,r,0,r,r,r);g.addColorStop(0,`rgba(${rgb},${a0})`);g.addColorStop(.3,`rgba(${rgb},${a0*.4})`);g.addColorStop(.65,`rgba(${rgb},${a0*.1})`);g.addColorStop(1,`rgba(${rgb},0)`);
  x.fillStyle=g;x.fillRect(0,0,r*2,r*2);return c}
function rad(x,cx,cy,r,col){const g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,col);g.addColorStop(1,col.replace(/[\d.]+\)$/,'0)'));x.fillStyle=g;x.fillRect(cx-r,cy-r,2*r,2*r)}
function grain(S,a){const [c,x]=mk(256,256);const id=x.createImageData(256,256),d=id.data;
  for(let i=0;i<d.length;i+=4){const v=S.rnd()<.5?0:255;d[i]=d[i+1]=d[i+2]=v;d[i+3]=S.rnd()*a*255}x.putImageData(id,0,0);return S.ctx.createPattern(c,'repeat')}
function vignette(a,col='10,8,30'){const [c,x]=mk(W,H);const g=x.createRadialGradient(W/2,H*.45,H*.35,W/2,H*.5,H*1.15);
  g.addColorStop(0,`rgba(${col},0)`);g.addColorStop(1,`rgba(${col},${a})`);x.fillStyle=g;x.fillRect(0,0,W,H);return c}
// midpoint-displacement ridge through control points
function ridge(S,ctrl,step,rough){let pts=ctrl.map(p=>p.slice()),amp=rough;
  for(let it=0;it<10;it++){let mx=0;for(let i=0;i<pts.length-1;i++)mx=Math.max(mx,pts[i+1][0]-pts[i][0]);if(mx<=step)break;
    const n=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];n.push(a);n.push([(a[0]+b[0])/2,(a[1]+b[1])/2+S.R(-amp,amp)*(b[0]-a[0])/400])}
    n.push(pts[pts.length-1]);pts=n;amp*=.58}
  return pts}
const ry=(pts,x)=>{let lo=0,hi=pts.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(pts[m][0]<=x)lo=m;else hi=m}const a=pts[lo],b=pts[hi],t=(x-a[0])/((b[0]-a[0])||1);return a[1]+(b[1]-a[1])*S_clamp(t)};
const S_clamp=t=>Math.max(0,Math.min(1,t));
function fillRidge(x,pts,bottom=H){x.beginPath();x.moveTo(pts[0][0],bottom);for(const p of pts)x.lineTo(p[0],p[1]);x.lineTo(pts[pts.length-1][0],bottom);x.closePath()}
function ridgePath(pts,bottom=H){const p=new Path2D();p.moveTo(pts[0][0],bottom);for(const q of pts)p.lineTo(q[0],q[1]);p.lineTo(pts[pts.length-1][0],bottom);p.closePath();return p}
// slender Tian Shan spruce
function spruce(x,cx,y,h){const w=h*.2,n=8,yt=t=>y-h+h*.92*t;x.beginPath();x.moveTo(cx,y-h);
  for(let i=1;i<=n;i++){const t=i/n;x.lineTo(cx+w*t,yt(t));if(i<n)x.lineTo(cx+w*t*.35,yt(t)-h*.015)}
  x.lineTo(cx+w*.08,y);x.lineTo(cx-w*.08,y);
  for(let i=n;i>=1;i--){const t=i/n;x.lineTo(cx-w*t,yt(t));if(i>1)x.lineTo(cx-w*(i-1)/n*.35,yt((i-1)/n)-h*.015)}
  x.closePath();x.fill()}

/* =================== 1: Tian Shan Dawn =================== */
BIS.scene('g7b-1',{title:'Mountain Dawn',blurb:'First light turns snowy Tian Shan peaks rose and gold above a still lake, with a yurt on the shore and cranes flying past.',
 setup(S){const st=S.state,HZ=860;st.HZ=HZ;
  // sky
  const [sky,sx]=mk(W,H);let g=sx.createLinearGradient(0,0,0,HZ);
  g.addColorStop(0,'#10163d');g.addColorStop(.3,'#2e3270');g.addColorStop(.55,'#7a5f9a');g.addColorStop(.72,'#d98e98');g.addColorStop(.86,'#f7b88e');g.addColorStop(1,'#ffe1b0');
  sx.fillStyle=g;sx.fillRect(0,0,W,H);rad(sx,200,720,1000,'rgba(255,196,140,.55)');rad(sx,1700,520,700,'rgba(120,110,190,.25)');
  st.sky=sky;st.dawn=glowSprite(700,'255,205,150');
  st.stars=Array.from({length:150},()=>{const y=Math.pow(S.rnd(),1.6)*430;return{x:S.R(0,W),y,r:S.R(.7,2.2),a:Math.pow(1-y/430,1.3)*S.R(.4,1),ph:S.rnd(),sec:S.R(3,7)}});
  // far range
  const [far,fx]=mk(W,H);
  const fr=ridge(S,[[-20,500],[200,400],[380,450],[600,350],[820,430],[1020,380],[1180,440],[1420,345],[1660,420],[1940,380]],4,70);
  g=fx.createLinearGradient(0,340,0,700);g.addColorStop(0,'#9a8cc0');g.addColorStop(1,'#b48fae');fx.fillStyle=g;fillRidge(fx,fr);fx.fill();
  fx.save();fx.clip(ridgePath(fr));fx.fillStyle='rgba(255,226,222,.55)';fx.beginPath();fx.moveTo(fr[0][0],fr[0][1]);for(const p of fr)fx.lineTo(p[0],p[1]);
  for(let i=fr.length-1;i>=0;i--){const p=fr[i];fx.lineTo(p[0],Math.max(p[1],395+18*Math.sin(p[0]*.02)+S.R(-4,4)))}fx.fill();
  g=fx.createLinearGradient(0,380,0,660);g.addColorStop(0,'rgba(220,170,190,0)');g.addColorStop(1,'rgba(232,170,170,.85)');fx.fillStyle=g;fx.fillRect(0,0,W,H);fx.restore();
  st.far=far;
  // main range
  const ctrl=[[-20,560],[150,360],[330,520],[600,175],[830,470],[960,350],[1080,500],[1320,215],[1540,470],[1760,320],[1940,500]];
  const mr=ridge(S,ctrl,3,85),mPath=ridgePath(mr);
  const a1=S.R(0,6),a2=S.R(0,6),a3=S.R(0,6);
  const snowY=x=>420+34*Math.sin(x*.011+a1)+20*Math.sin(x*.029+a2)+12*Math.sin(x*.083+a3);
  const snow=new Path2D();snow.moveTo(mr[0][0],mr[0][1]);for(const p of mr)snow.lineTo(p[0],p[1]);
  for(let i=mr.length-1;i>=0;i--){const p=mr[i];snow.lineTo(p[0],Math.max(p[1],snowY(p[0])+S.R(-5,5)))}snow.closePath();
  // left (lit) faces of each peak
  const lit=new Path2D();
  for(let k=1;k<ctrl.length-1;k+=2){const [px]=ctrl[k],vL=ctrl[k-1][0],vR=ctrl[k+1][0],py=ry(mr,px);
    const vy=ry(mr,vL),cx0=vL-(px-vL)*.25,by0=vy+(760-vy)*.9;lit.moveTo(cx0,H);lit.lineTo(cx0,by0);for(let t=.9;t>0;t-=.1)lit.lineTo(vL+(cx0-vL)*t+S.R(-6,6),vy+(by0-vy)*t);
    for(const p of mr)if(p[0]>=vL&&p[0]<=px)lit.lineTo(p[0],p[1]);
    const ex=px+(vR-px)*.55,ey=Math.max(ry(mr,vR)+120,640);for(let t=.06;t<=1.001;t+=.06)lit.lineTo(px+(ex-px)*Math.pow(t,.85)+S.R(-10,10)*t,py+(ey-py)*t);lit.lineTo(ex,H);lit.closePath()}
  const streaks=(x,col,n)=>{x.strokeStyle=col;x.lineCap='round';for(let i=0;i<n;i++){const X=S.R(0,W),top=ry(mr,X),sy=snowY(X);if(sy<top+10)continue;
      const y0=S.R(top+15,sy),len=S.R(30,110),dx=S.R(-.45,.45);x.lineWidth=S.R(1.2,3.2);x.beginPath();x.moveTo(X,y0);x.quadraticCurveTo(X+dx*len*.5+S.R(-6,6),y0+len*.5,X+dx*len,y0+len);x.stroke()}};
  const [mt,mx]=mk(W,H);mx.save();mx.clip(mPath);
  g=mx.createLinearGradient(0,180,0,820);g.addColorStop(0,'#55568e');g.addColorStop(1,'#272a58');mx.fillStyle=g;mx.fillRect(0,0,W,H);
  g=mx.createLinearGradient(0,180,0,560);g.addColorStop(0,'#b7bde6');g.addColorStop(1,'#8a90c4');mx.fillStyle=g;mx.fill(snow);
  streaks(mx,'rgba(52,54,104,.55)',260);mx.restore();st.mt=mt;
  const [lt,lx]=mk(W,H);lx.save();lx.clip(mPath);lx.clip(lit);
  g=lx.createLinearGradient(0,180,0,820);g.addColorStop(0,'#c27f9e');g.addColorStop(1,'#4a3a72');lx.fillStyle=g;lx.fillRect(0,0,W,H);
  lx.save();lx.clip(snow);g=lx.createLinearGradient(0,180,0,560);g.addColorStop(0,'#fff3e2');g.addColorStop(.5,'#ffc9b6');g.addColorStop(1,'#e898a6');lx.fillStyle=g;lx.fillRect(0,0,W,H);lx.restore();
  streaks(lx,'rgba(140,80,120,.45)',200);
  lx.strokeStyle='rgba(255,240,215,.95)';lx.lineWidth=3;lx.beginPath();for(const p of mr)lx.lineTo(p[0],p[1]);lx.stroke();lx.restore();
  st.lt=lt;
  // foothills, forests, shore (static)
  const [fh,hx]=mk(W,H);
  g=hx.createLinearGradient(0,520,0,800);g.addColorStop(0,'rgba(150,120,170,0)');g.addColorStop(1,'rgba(170,130,170,.75)');hx.fillStyle=g;hx.fillRect(0,480,W,400);
  const r1=ridge(S,[[-20,690],[300,630],[620,700],[980,640],[1300,690],[1640,630],[1940,680]],6,40);
  g=hx.createLinearGradient(0,620,0,860);g.addColorStop(0,'#5a4a80');g.addColorStop(1,'#7a5f8e');hx.fillStyle=g;fillRidge(hx,r1);hx.fill();
  g=hx.createLinearGradient(0,640,0,820);g.addColorStop(0,'rgba(220,160,170,0)');g.addColorStop(1,'rgba(225,165,170,.6)');hx.fillStyle=g;hx.fillRect(0,600,W,260);
  const r2=ridge(S,[[-20,760],[260,715],[560,770],[900,730],[1240,775],[1580,720],[1940,760]],6,30);
  hx.fillStyle='#3b2f5e';fillRidge(hx,r2);hx.fill();hx.fillStyle='#352a57';
  for(let X=-10;X<W+10;X+=S.R(7,16)){const y=ry(r2,X)+S.R(2,14);spruce(hx,X,y,S.R(26,58))}
  g=hx.createLinearGradient(0,760,0,860);g.addColorStop(0,'rgba(200,150,170,0)');g.addColorStop(1,'rgba(205,150,165,.45)');hx.fillStyle=g;hx.fillRect(0,740,W,130);
  const r3=ridge(S,[[-20,835],[420,820],[860,850],[1200,838],[1600,826],[1940,840]],6,10);
  hx.fillStyle='#211b3c';fillRidge(hx,r3.map(p=>[p[0],Math.min(p[1],HZ)]),HZ+2);hx.fill();
  for(let X=-10;X<W+10;X+=S.R(12,40)){if(X>1380&&X<1650)continue;if(S.rnd()<.35)continue;spruce(hx,X,ry(r3,X)+4,S.R(30,74))}
  st.fh=fh;
  // lake reflection of everything above
  const [src,cx]=mk(W,H);cx.drawImage(sky,0,0);cx.drawImage(far,0,0);cx.drawImage(mt,0,0);cx.globalAlpha=.8;cx.drawImage(lt,0,0);cx.globalAlpha=1;cx.drawImage(fh,0,0);
  const LD=H-HZ,[rc,rx]=mk(W,LD);rx.setTransform(1,0,0,-1/1.5,0,HZ/1.5);rx.drawImage(src,0,0);rx.setTransform(1,0,0,1,0,0);
  g=rx.createLinearGradient(0,0,0,LD);g.addColorStop(0,'rgba(30,26,70,.25)');g.addColorStop(1,'rgba(14,14,44,.7)');rx.fillStyle=g;rx.fillRect(0,0,W,LD);
  st.rc=rc;st.LD=LD;
  st.shim=Array.from({length:70},()=>{const y=HZ+4+Math.pow(S.rnd(),1.4)*(LD-10);return{x:S.R(0,W),y,w:S.R(30,140)*(1+(y-HZ)/LD),ph:S.rnd(),sec:S.R(5,9)}});
  // foreground framing: dark banks with spruces at the corners
  const [fg,gx]=mk(W,H);gx.fillStyle='#120f26';
  gx.beginPath();gx.moveTo(0,880);gx.bezierCurveTo(160,885,300,960,420,1080);gx.lineTo(0,1080);gx.fill();
  gx.beginPath();gx.moveTo(W,900);gx.bezierCurveTo(1760,905,1620,980,1500,1080);gx.lineTo(W,1080);gx.fill();
  gx.beginPath();gx.moveTo(0,1060);gx.bezierCurveTo(600,1040,1300,1045,W,1060);gx.lineTo(W,H);gx.lineTo(0,H);gx.fill();
  [[40,1000,330],[130,1010,250],[230,1040,190],[-30,980,380],[1880,1010,350],[1790,1020,260],[1700,1050,190],[1960,990,400]].forEach(([X,Y,h])=>spruce(gx,X,Y,h));
  gx.strokeStyle='rgba(255,190,160,.35)';gx.lineWidth=2;gx.beginPath();gx.moveTo(0,880);gx.bezierCurveTo(160,885,300,960,420,1080);gx.stroke();
  st.fg=fg;
  st.cranes=[[0,0],[-46,-22],[-92,-40],[-138,-56],[-40,24],[-84,46],[-126,66]].map(([dx,dy],i)=>({dx,dy,ph:i*.09}));
  st.smoke=Array.from({length:9},(_,i)=>({ph:i/9,dx:S.R(-6,6)}));
  st.mist=Array.from({length:6},(_,i)=>({x:S.R(0,W),y:[660,700,745,790,815,700][i],w:S.R(700,1100),h:S.R(50,90),ph:S.rnd(),a:S.R(.25,.45)}));
  st.mistS=glowSprite(200,'246,206,214');
  st.grain=grain(S,.06);st.vig=vignette(.55);
 },
 draw(S){const c=S.ctx,st=S.state,HZ=st.HZ;
  const L=S.osc01(90,.75); // slow breath of dawn light
  c.drawImage(st.sky,0,0);
  c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.25+.3*L;c.drawImage(st.dawn,-500,40,1400,1400);c.restore();
  c.fillStyle='#fff';
  for(const s of st.stars){const a=s.a*(.45+.55*S.osc01(s.sec,s.ph))*(1-.45*L);if(a<.03)continue;c.globalAlpha=a;c.beginPath();c.arc(s.x,s.y,s.r,0,TAU);c.fill()}
  c.globalAlpha=1;
  c.drawImage(st.far,0,0);c.drawImage(st.mt,0,0);
  c.globalAlpha=.55+.45*L;c.drawImage(st.lt,0,0);c.globalAlpha=1;
  c.drawImage(st.fh,0,0);
  // valley mist
  for(const m of st.mist){const x=m.x+S.osc(90,m.ph)*140;c.globalAlpha=m.a*(.7+.3*S.osc01(45,m.ph));c.drawImage(st.mistS,x-m.w/2,m.y-m.h/2,m.w,m.h);
    if(x+m.w/2>W)c.drawImage(st.mistS,x-W-m.w/2,m.y-m.h/2,m.w,m.h);if(x-m.w/2<0)c.drawImage(st.mistS,x+W-m.w/2,m.y-m.h/2,m.w,m.h)}
  c.globalAlpha=1;
  // lake: rippled reflection
  const LD=st.LD;for(let y=0;y<LD;y+=4){const k=y/LD,off=S.osc(7,y*.011)*(1.5+k*7)+S.osc(5,y*.023+.3)*k*3;c.drawImage(st.rc,0,y,W,4,-10+off,HZ+y,W+20,4)}
  c.save();c.globalCompositeOperation='lighter';
  for(const s of st.shim){const a=.22*S.pulse(s.sec,s.ph,3);if(a<.01)continue;c.fillStyle=`rgba(255,215,190,${a})`;c.fillRect(s.x+S.osc(9,s.ph)*20-s.w/2,s.y,s.w,1.6)}
  c.restore();
  c.fillStyle='rgba(255,226,200,.5)';c.fillRect(0,HZ,W,1.5);
  // yurt on the shore
  S.at(1515,HZ+2,0,1,()=>{c.fillStyle='#1d1836';c.beginPath();c.moveTo(-62,0);c.lineTo(-60,-38);c.quadraticCurveTo(-30,-74,0,-80);c.quadraticCurveTo(30,-74,60,-38);c.lineTo(62,0);c.closePath();c.fill();
    c.fillRect(-9,-86,18,8);c.strokeStyle='rgba(255,200,170,.55)';c.lineWidth=2;c.beginPath();c.moveTo(-60,-38);c.quadraticCurveTo(-30,-74,0,-80);c.stroke();
    c.strokeStyle='rgba(255,220,190,.25)';c.beginPath();c.moveTo(-60,-36);c.lineTo(60,-36);c.stroke();
    const d=.75+.25*S.osc01(6);c.fillStyle=`rgba(255,170,90,${d})`;c.fillRect(-10,-28,20,28);});
  S.glow(1515,HZ-14,60,'rgba(255,170,90,.35)');
  for(const p of st.smoke){const t=S.saw(9,p.ph),y=HZ-88-t*170,x=1515+p.dx+t*t*70+S.osc(9,p.ph)*6;c.globalAlpha=.32*Math.sin(Math.PI*t);c.drawImage(st.mistS,x-18-t*30,y-14-t*20,36+t*60,28+t*40)}
  c.globalAlpha=1;
  // cranes
  const gx=S.wrap(-200,90,W,260),gy=300+S.osc(30)*24;c.fillStyle='#2b2148';c.strokeStyle='#2b2148';c.lineCap='round';
  for(const b of st.cranes){const x=gx+b.dx*1.5,y=gy+b.dy*1.5+S.osc(15,b.ph)*3,f=S.osc(2.2,b.ph*2);
    c.lineWidth=3;c.beginPath();c.moveTo(x-30,y+1);c.lineTo(x+24,y-1);c.stroke();
    c.lineWidth=2.6;c.beginPath();c.moveTo(x-3,y);c.quadraticCurveTo(x-12,y-15-f*15,x-30,y-6-f*24);c.moveTo(x-3,y);c.quadraticCurveTo(x+3,y-12-f*13,x-9,y-3-f*22);c.stroke()}
  c.drawImage(st.fg,0,0);
  c.fillStyle=st.grain;c.fillRect(0,0,W,H);c.drawImage(st.vig,0,0);
 }});

/* =================== 2: Morning Sea =================== */
function cloudBand(S,w,h,top,bot,n){const [m,mx]=mk(w,h);mx.fillStyle='#000';
  for(let i=0;i<n;i++){const u=S.R(.04,.96),env=Math.sin(Math.PI*u),cx=u*w,r=h*S.R(.1,.24)*(.4+.6*env),cy=h*.68-r*.4-S.R(0,h*.22)*env;
    mx.globalAlpha=S.R(.5,.9);mx.beginPath();mx.arc(cx,Math.min(cy,h*.72-r),r,0,TAU);mx.fill();mx.beginPath();mx.ellipse(cx,h*.66,r*1.8,r*.35,0,0,TAU);mx.fill()}
  mx.globalAlpha=1;mx.globalCompositeOperation='source-in';const g=mx.createLinearGradient(0,0,0,h);g.addColorStop(0,top);g.addColorStop(.5,top);g.addColorStop(.8,bot);g.addColorStop(1,bot);mx.fillStyle=g;mx.fillRect(0,0,w,h);
  const [o,ox]=mk(w,h);ox.filter='blur(3px)';ox.drawImage(m,0,0);return o}
BIS.scene('g7b-2',{title:'Morning Sea',blurb:'A low morning sun glitters a path across a calm sea, seen from a pine-topped headland with gulls and distant sails.',
 setup(S){const st=S.state,HZ=640;st.HZ=HZ;st.sx=1250;st.sy=420;
  const [sky,x]=mk(W,H);let g=x.createLinearGradient(0,0,0,HZ);
  g.addColorStop(0,'#4f86b2');g.addColorStop(.42,'#a6c2d0');g.addColorStop(.74,'#f1d4b8');g.addColorStop(1,'#ffc79c');x.fillStyle=g;x.fillRect(0,0,W,HZ+2);
  rad(x,st.sx,st.sy,900,'rgba(255,214,170,.4)');rad(x,st.sx,HZ,700,'rgba(255,190,140,.35)');
  // distant headlands
  x.fillStyle='rgba(126,150,178,.75)';const d1=ridge(S,[[1430,HZ],[1520,HZ-26],[1660,HZ-52],[1800,HZ-38],[1940,HZ-60]],5,12);x.beginPath();x.moveTo(1430,HZ+1);for(const p of d1)x.lineTo(p[0],p[1]);x.lineTo(1940,HZ+1);x.fill();
  x.fillStyle='rgba(150,165,190,.55)';const d2=ridge(S,[[620,HZ],[700,HZ-14],[820,HZ-20],[960,HZ-8],[1020,HZ]],5,5);x.beginPath();x.moveTo(620,HZ+1);for(const p of d2)x.lineTo(p[0],p[1]);x.lineTo(1020,HZ+1);x.fill();
  // sea
  g=x.createLinearGradient(0,HZ,0,H);g.addColorStop(0,'#f0c9ae');g.addColorStop(.18,'#b9c3c2');g.addColorStop(.5,'#6b9aa6');g.addColorStop(1,'#2c5f74');x.fillStyle=g;x.fillRect(0,HZ,W,H-HZ);
  x.save();x.translate(st.sx,HZ);x.scale(1,2.2);rad(x,0,0,420,'rgba(255,214,160,.55)');x.restore();
  st.sky=x.canvas;st.sun=glowSprite(360,'255,236,200');st.halo=glowSprite(140,'255,250,235');
  // clouds
  const bands=[[1640,90,900,120,.6],[300,130,1500,150,.85],[1120,250,1100,110,.8],[520,380,900,90,.7],[1500,520,800,70,.75],[150,560,700,60,.6],[1280,440,520,34,.65]];
  st.clouds=bands.map(([cx,cy,w,h,a],i)=>({c:cloudBand(S,w,h,i<3?'rgba(150,150,188,1)':'rgba(190,160,180,1)',cy>380?'rgba(255,214,176,1)':'rgba(255,224,200,1)',Math.round(w/(h<80?3:9))),cx,cy,w,h,a,ph:S.rnd()}));
  // wave texture (wider than screen for drift)
  const [wv,wx]=mk(W+240,H-HZ);
  for(let y=2;y<H-HZ;){const k=y/(H-HZ),dy=1.5+k*k*14;
    for(let X=0;X<W+240;){const len=S.R(10,40)*(.3+k*2.6);wx.fillStyle=S.rnd()<.5?`rgba(255,238,220,${.10+.12*(1-k)})`:`rgba(24,64,84,${.10+.14*k})`;
      wx.fillRect(X,y,len,Math.max(1,k*3.2));X+=len+S.R(8,60)*(.3+k*2)}
    y+=dy}
  st.wv=wv;
  st.glint=Array.from({length:300},()=>{const t=Math.pow(S.rnd(),1.25),y=HZ+3+t*(H-HZ-6);let gsum=0;for(let i=0;i<4;i++)gsum+=S.rnd();gsum=(gsum-2)/1.15;
    return{x:st.sx+gsum*(26+t*420),y,w:2+t*16,h:1+t*2.2,ph:S.rnd(),sec:S.R(1.6,3.6)}});
  // headland on the left
  const [hd,hx]=mk(W,H);
  const top=ridge(S,[[-20,300],[140,318],[300,360],[420,410],[520,480],[600,560],[650,625],[690,672]],4,22);
  const cliff=new Path2D();cliff.moveTo(-20,H);for(const p of top)cliff.lineTo(p[0],p[1]);cliff.lineTo(720,690);cliff.lineTo(640,760);cliff.lineTo(520,880);cliff.lineTo(380,1000);cliff.lineTo(260,H);cliff.closePath();
  g=hx.createLinearGradient(0,300,700,800);g.addColorStop(0,'#253a4e');g.addColorStop(1,'#1a2c3e');hx.fillStyle=g;hx.fill(cliff);
  hx.save();hx.clip(cliff);
  for(let i=0;i<30;i++){const y=S.R(340,1000),X0=S.R(-20,500);hx.strokeStyle=`rgba(${S.rnd()<.6?'255,196,160':'10,20,34'},${S.R(.05,.13)})`;hx.lineWidth=S.R(1.5,3);
    hx.beginPath();hx.moveTo(X0,y);hx.quadraticCurveTo(X0+80,y+S.R(-10,20),X0+S.R(120,260),y+S.R(10,50));hx.stroke()}
  g=hx.createLinearGradient(380,0,720,0);g.addColorStop(0,'rgba(255,190,150,0)');g.addColorStop(1,'rgba(255,190,150,.32)');hx.fillStyle=g;hx.fillRect(0,0,W,H);hx.restore();
  hx.strokeStyle='rgba(255,214,170,.8)';hx.lineWidth=3;hx.beginPath();for(const p of top)if(p[0]>260)hx.lineTo(p[0],p[1]);hx.lineTo(720,690);hx.stroke();
  // wind-bent pines on the headland
  const pine=(px,py,h,lean)=>{hx.strokeStyle='#132131';hx.lineWidth=h*.05;hx.lineCap='round';hx.beginPath();hx.moveTo(px,py);hx.quadraticCurveTo(px+lean*.3,py-h*.6,px+lean,py-h);hx.stroke();
    for(let k=0;k<5;k++){const t=.55+k*.1,cx=px+lean*t+(k%2?1:-1)*h*S.R(.08,.2),cy=py-h*t-h*.04,pw=h*S.R(.2,.32)*(1.1-k*.12);
      hx.lineWidth=h*.025;hx.beginPath();hx.moveTo(px+lean*t,py-h*t+h*.04);hx.lineTo(cx,cy+h*.02);hx.stroke();
      for(let j=0;j<16;j++){const u=S.R(-1,1),bx=cx+u*pw,by=cy-S.R(0,h*.07)*(1-u*u*.7);hx.fillStyle='#132233';hx.beginPath();hx.arc(bx,by,h*S.R(.03,.055),0,TAU);hx.fill();
        }}};
  pine(90,ry(top,90)+6,300,70);pine(220,ry(top,220)+6,220,50);pine(340,ry(top,340)+5,150,34);pine(-10,ry(top,0)+8,360,46);pine(420,ry(top,420)+4,90,20);
  // foreground rocks bottom-right
  hx.fillStyle='#16283a';hx.beginPath();hx.moveTo(W,930);hx.bezierCurveTo(1840,940,1780,990,1740,1010);hx.bezierCurveTo(1700,1030,1640,1050,1600,H);hx.lineTo(W,H);hx.fill();
  hx.strokeStyle='rgba(255,210,170,.5)';hx.lineWidth=2;hx.beginPath();hx.moveTo(W,930);hx.bezierCurveTo(1840,940,1780,990,1740,1010);hx.stroke();
  st.hd=hd;
  st.foam=[[720,690,90],[640,762,130],[520,882,170],[380,1002,200],[1740,1012,140],[1620,1066,160]];
  st.foamS=glowSprite(120,'255,246,236');
  st.gulls=Array.from({length:6},(_,i)=>({x:S.R(0,W),y:S.R(160,420),sec:i%2?90:45,sc:S.R(.6,1.1),ph:S.rnd()}));
  st.boats=[{x:930,y:HZ+4,s:1.1,ph:.1},{x:1640,y:HZ+7,s:1.6,ph:.6}];
  st.grain=grain(S,.05);st.vig=vignette(.45,'18,30,48');
 },
 draw(S){const c=S.ctx,st=S.state,HZ=st.HZ,sx=st.sx,sy=st.sy;
  c.drawImage(st.sky,0,0);
  const b=S.osc01(18);
  c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.32+.12*b;c.drawImage(st.sun,sx-520,sy-520,1040,1040);c.globalAlpha=.7;c.drawImage(st.halo,sx-140,sy-140);c.restore();
  c.fillStyle=S.radial(sx,sy,76,'#fffdf4','#ffe2a8');c.beginPath();c.arc(sx,sy,74,0,TAU);c.fill();
  for(const k of st.clouds){const x=k.cx+S.osc(90,k.ph)*90;c.globalAlpha=k.a;c.drawImage(k.c,x-k.w/2,k.cy-k.h/2)}
  c.globalAlpha=1;
  // sea texture drifting
  c.save();c.beginPath();c.rect(0,HZ,W,H-HZ);c.clip();
  c.globalAlpha=.9;c.drawImage(st.wv,-120+S.osc(30)*60,HZ);c.globalAlpha=.5;c.drawImage(st.wv,-120-S.osc(22,.3)*70,HZ+3);c.globalAlpha=1;
  // boats
  for(const bt of st.boats){const x=bt.x+S.osc(90,bt.ph)*70,y=bt.y+S.osc(6,bt.ph)*1.2,s=bt.s;c.fillStyle='rgba(84,100,126,.85)';
    c.beginPath();c.moveTo(x-20*s,y-4*s);c.lineTo(x+20*s,y-4*s);c.lineTo(x+14*s,y);c.lineTo(x-14*s,y);c.fill();
    c.beginPath();c.moveTo(x,y-6*s);c.lineTo(x,y-52*s);c.lineTo(x+18*s,y-8*s);c.closePath();c.fill();c.beginPath();c.moveTo(x-2*s,y-46*s);c.lineTo(x-16*s,y-8*s);c.lineTo(x-2*s,y-8*s);c.fill()}
  // glitter path
  c.globalCompositeOperation='lighter';
  for(const g of st.glint){const a=S.pulse(g.sec,g.ph,6);if(a<.04)continue;c.fillStyle=`rgba(255,240,205,${a*.9})`;c.fillRect(g.x-g.w/2+S.osc(8,g.ph)*6,g.y,g.w,g.h)}
  c.restore();
  c.fillStyle='rgba(255,236,210,.6)';c.fillRect(0,HZ,W,1.5);
  c.drawImage(st.hd,0,0);
  // foam at rocks
  for(let i=0;i<st.foam.length;i++){const [fx,fy,w]=st.foam[i],a=.35+.35*S.osc01(9,i*.17);c.globalAlpha=a;c.drawImage(st.foamS,fx-w*.6,fy-12,w*1.4,24+8*S.osc01(9,i*.17))}
  c.globalAlpha=1;
  // gulls
  c.strokeStyle='#33465a';c.lineCap='round';c.lineJoin='round';
  for(const gl of st.gulls){const x=S.wrap(gl.x,gl.sec,W,80),y=gl.y+S.osc(20,gl.ph)*26,f=S.osc(2.6,gl.ph),w=30*gl.sc;
    c.lineWidth=2.6*gl.sc;c.beginPath();c.moveTo(x-w,y-w*.2-f*w*.35);c.quadraticCurveTo(x-w*.45,y-w*.45-f*w*.2,x,y);c.quadraticCurveTo(x+w*.45,y-w*.45-f*w*.2,x+w,y-w*.2-f*w*.35);c.stroke()}
  c.fillStyle=st.grain;c.fillRect(0,0,W,H);c.drawImage(st.vig,0,0);
 }});

/* =================== 3: Dandelion Light =================== */
function clockSprite(S,r,warm){const pad=r*.3,s=Math.ceil((r+pad)*2),[c,x]=mk(s,s),cx=s/2,n=Math.round(r*1.5);
  const g=x.createRadialGradient(cx,cx,0,cx,cx,r*1.05);g.addColorStop(0,'rgba(255,248,225,.28)');g.addColorStop(.85,'rgba(255,240,210,.12)');g.addColorStop(1,'rgba(255,240,210,0)');x.fillStyle=g;x.fillRect(0,0,s,s);
  x.lineCap='round';
  for(let i=0;i<n;i++){const z=1-2*(i+.5)/n,rr=Math.sqrt(1-z*z),th=i*2.39996+S.R(-.05,.05),dx=Math.cos(th)*rr,dy=Math.sin(th)*rr;
    const ex=cx+dx*r,ey=cx+dy*r,lit=.55+.45*Math.max(0,-(dx+dy)*.7),back=z<0;
    x.globalAlpha=Math.min(1,(back?.45:1)*lit);x.strokeStyle=warm;x.lineWidth=.9;x.beginPath();x.moveTo(cx+dx*r*.1,cx+dy*r*.1);x.lineTo(ex,ey);x.stroke();
    const ang=Math.atan2(dy,dx),tl=r*.17*(.45+.55*rr);x.lineWidth=.7;x.beginPath();
    for(let k=-5;k<=5;k++){const a=ang+k*.2*(.5+.5*rr);x.moveTo(ex,ey);x.lineTo(ex+Math.cos(a)*tl,ey+Math.sin(a)*tl)}x.stroke();
    x.globalAlpha=Math.min(1,lit+.2);x.fillStyle='#fffdf2';x.beginPath();x.arc(ex,ey,1.3,0,TAU);x.fill()}
  x.globalAlpha=1;x.fillStyle='#8c7a46';x.beginPath();x.arc(cx,cx,r*.09,0,TAU);x.fill();return c}
function seedSprite(){const [c,x]=mk(64,64);x.lineCap='round';x.strokeStyle='rgba(255,252,238,.95)';x.lineWidth=1;
  x.beginPath();x.moveTo(32,26);x.lineTo(32,52);x.stroke();x.fillStyle='#9b8650';x.beginPath();x.ellipse(32,56,2,5,0,0,TAU);x.fill();
  x.lineWidth=.8;x.beginPath();for(let k=0;k<15;k++){const a=-Math.PI+.2+k*(Math.PI-.4)/14;x.moveTo(32,26);x.lineTo(32+Math.cos(a)*22,26+Math.sin(a)*14)}x.stroke();
  x.fillStyle='rgba(255,255,245,.9)';for(let k=0;k<15;k++){const a=-Math.PI+.2+k*(Math.PI-.4)/14;x.beginPath();x.arc(32+Math.cos(a)*22,26+Math.sin(a)*14,1,0,TAU);x.fill()}
  return c}
BIS.scene('g7b-3',{title:'Dandelion Light',blurb:'Close-up dandelion clocks glow against the rising sun as their seeds drift away through soft golden light.',
 setup(S){const st=S.state;st.sx=470;st.sy=250;
  const [bg,x]=mk(W,H);let g=x.createLinearGradient(0,0,0,H);
  g.addColorStop(0,'#c98f6a');g.addColorStop(.35,'#c99467');g.addColorStop(.62,'#8e8450');g.addColorStop(.82,'#545c30');g.addColorStop(1,'#232a14');x.fillStyle=g;x.fillRect(0,0,W,H);
  g=x.createLinearGradient(0,0,W,0);g.addColorStop(0,'rgba(255,220,160,.35)');g.addColorStop(1,'rgba(90,50,80,.3)');x.fillStyle=g;x.fillRect(0,0,W,H);
  rad(x,1550,350,800,'rgba(150,100,150,.25)');rad(x,st.sx,st.sy,900,'rgba(255,228,180,.7)');
  // blurred background meadow + bokeh
  x.filter='blur(14px)';
  for(let i=0;i<120;i++){const X=S.R(0,W),Y=S.R(560,900),h=S.R(80,260);x.strokeStyle=`rgba(${S.rnd()<.5?'90,100,50':'150,140,80'},${S.R(.25,.5)})`;x.lineWidth=S.R(4,10);x.beginPath();x.moveTo(X,Y+h);x.quadraticCurveTo(X+S.R(-30,30),Y+h/2,X+S.R(-40,40),Y);x.stroke()}
  for(let i=0;i<12;i++){const X=S.R(0,W),Y=S.R(480,760),r=S.R(26,50);x.fillStyle='rgba(255,246,220,.45)';x.beginPath();x.arc(X,Y,r,0,TAU);x.fill()}
  x.filter='blur(3px)';
  const bok=['255,236,190','255,214,160','230,210,240','255,250,230'];
  for(let i=0;i<70;i++){const X=S.R(0,W),Y=S.R(0,820),r=S.R(14,60),col=S.pick(bok),a=S.R(.08,.22)*(1-Y/1100);
    x.fillStyle=`rgba(${col},${a})`;x.beginPath();x.arc(X,Y,r,0,TAU);x.fill();x.strokeStyle=`rgba(${col},${a*1.4})`;x.lineWidth=2;x.stroke()}
  x.filter='none';
  st.bg=bg;st.sun=glowSprite(420,'255,250,232');st.core=glowSprite(90,'255,255,248');
  st.bokeh=Array.from({length:26},()=>({x:S.R(0,W),y:S.R(60,760),r:S.R(18,70),col:S.pick(bok),a:S.R(.12,.28),ph:S.rnd()}));
  st.bokS={};for(const k of bok){const [bc,bx]=mk(128,128);bx.fillStyle=`rgba(${k},.55)`;bx.beginPath();bx.arc(64,64,60,0,TAU);bx.fill();bx.strokeStyle=`rgba(${k},.9)`;bx.lineWidth=3;bx.stroke();st.bokS[k]=bc}
  // midground blurred clocks
  const [mid,mx]=mk(W,H);mx.filter='blur(5px)';
  [[820,520,70,880],[1120,600,55,940],[640,640,46,960],[1300,470,60,900]].forEach(([X,Y,r,b])=>{mx.strokeStyle='rgba(80,90,46,.7)';mx.lineWidth=6;mx.beginPath();mx.moveTo(X+10,b+200);mx.quadraticCurveTo(X-10,(Y+b)/2,X,Y);mx.stroke();
    mx.drawImage(clockSprite(S,r,'#fff6e0'),X-r*1.3,Y-r*1.3)});
  mx.filter='none';st.mid=mid;
  // hero clocks
  st.heroes=[{bx:1560,by:1120,tx:-70,ty:-760,r:175,ph:.1},{bx:1830,by:1120,tx:-40,ty:-500,r:110,ph:.45},{bx:250,by:1120,tx:60,ty:-560,r:120,ph:.7}]
    .map(h=>Object.assign(h,{spr:clockSprite(S,h.r,'#fffbea')}));
  st.seed=seedSprite();
  st.seeds=Array.from({length:110},()=>{const z=S.R(.35,1.25);return{x:S.R(0,W),y:S.R(0,H),z,secx:S.rnd()<.6?90:45,ph:S.rnd(),rot:S.R(-.5,.5),bob:S.R(12,40)}});
  st.blades=Array.from({length:80},()=>({x:S.R(-20,W+20),h:S.R(90,320)*(S.rnd()<.2?1.4:1),w:S.R(6,14),lean:S.R(-.35,.35),ph:S.rnd()})).sort((a,b)=>b.h-a.h);
  const [gr,gx]=mk(W,H);g=gx.createLinearGradient(0,940,0,H);g.addColorStop(0,'rgba(34,42,18,0)');g.addColorStop(1,'rgba(30,36,16,.95)');gx.fillStyle=g;gx.fillRect(0,900,W,180);st.gr=gr;
  st.grain=grain(S,.05);st.vig=vignette(.5,'40,28,10');
 },
 draw(S){const c=S.ctx,st=S.state,sx=st.sx,sy=st.sy;
  c.drawImage(st.bg,0,0);
  const b=S.osc01(90);
  // sun bloom and rays
  c.save();c.globalCompositeOperation='lighter';
  c.globalAlpha=.45+.2*b;c.drawImage(st.sun,sx-420,sy-420,840,840);c.globalAlpha=1;c.drawImage(st.core,sx-90,sy-90);
  for(let i=0;i<7;i++){const a=.15+i*.2+S.osc(90,i/7)*.05,L=1900,w=.025+.012*(i%3),k=.035+.035*S.osc01(30,i/7);
    const g=c.createLinearGradient(sx,sy,sx+Math.cos(a)*L,sy+Math.sin(a)*L);g.addColorStop(0,`rgba(255,240,200,${k})`);g.addColorStop(1,'rgba(255,240,200,0)');
    c.fillStyle=g;c.beginPath();c.moveTo(sx,sy);c.lineTo(sx+Math.cos(a-w)*L,sy+Math.sin(a-w)*L);c.lineTo(sx+Math.cos(a+w)*L,sy+Math.sin(a+w)*L);c.fill()}
  for(const k of st.bokeh){const x=k.x+S.osc(90,k.ph)*60,y=k.y+S.osc(45,k.ph)*20;c.globalAlpha=k.a*(.6+.4*S.osc01(15,k.ph));c.drawImage(st.bokS[k.col],x-k.r,y-k.r,k.r*2,k.r*2)}
  c.restore();c.globalAlpha=1;
  c.drawImage(st.mid,S.osc(90,.2)*6,0);
  // far seeds (behind heroes)
  const drawSeeds=(near)=>{for(const s of st.seeds){if((s.z>.85)!==near)continue;
    const x=S.wrap(s.x,s.secx,W,60),y=S.wrap(s.y,90,H,60,-1)+S.osc(15,s.ph)*s.bob,sc=s.z,r=s.rot+S.osc(9,s.ph)*.25;
    c.globalAlpha=Math.min(1,.45+.5*s.z);c.save();c.translate(x,y);c.rotate(r);c.drawImage(st.seed,-32*sc,-32*sc,64*sc,64*sc);c.restore()}c.globalAlpha=1};
  drawSeeds(false);
  // hero dandelions
  for(const h of st.heroes){const sw=S.osc(11,h.ph)*.022+S.osc(23,h.ph+.3)*.012;
    S.at(h.bx,h.by,sw,1,()=>{c.lineCap='round';c.strokeStyle='#4c5428';c.lineWidth=h.r*.07;c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(h.tx*.2,h.ty*.55,h.tx,h.ty);c.stroke();
      c.strokeStyle='rgba(255,226,170,.55)';c.lineWidth=h.r*.018;c.beginPath();c.moveTo(-h.r*.03,0);c.quadraticCurveTo(h.tx*.2-h.r*.03,h.ty*.55,h.tx-h.r*.025,h.ty);c.stroke();
      const s=h.spr.width;c.drawImage(h.spr,h.tx-s/2,h.ty-s/2)})}
  drawSeeds(true);
  // foreground grass
  c.drawImage(st.gr,0,0);
  for(const g of st.blades){const sw=S.osc(9,g.ph)*12+S.osc(4.5,g.ph*2)*3,tx=g.x+g.lean*g.h+sw,ty=H-g.h;
    c.fillStyle='#283014';c.beginPath();c.moveTo(g.x-g.w,H+4);c.quadraticCurveTo(g.x+g.lean*g.h*.4,H-g.h*.55,tx,ty);c.quadraticCurveTo(g.x+g.lean*g.h*.4+g.w*.6,H-g.h*.5,g.x+g.w,H+4);c.fill();
    c.strokeStyle='rgba(255,214,140,.45)';c.lineWidth=1.5;c.beginPath();c.moveTo(g.x-g.w*.8,H);c.quadraticCurveTo(g.x+g.lean*g.h*.4-g.w*.3,H-g.h*.55,tx,ty);c.stroke()}
  c.fillStyle=st.grain;c.fillRect(0,0,W,H);c.drawImage(st.vig,0,0);
 }});
})();
