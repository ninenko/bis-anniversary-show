/* Grade 7Y - Together We Rise (90 s) - Round 2 */
(function(){
const TAU=Math.PI*2,W=1920,H=1080;
const mk=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),c);return c};
const ss=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
function glowSprite(r,rgb,a0=1,mid=.35){return mk(r*2,r*2,x=>{const g=x.createRadialGradient(r,r,0,r,r,r);
  g.addColorStop(0,`rgba(${rgb},${a0})`);g.addColorStop(mid,`rgba(${rgb},${a0*.32})`);g.addColorStop(1,`rgba(${rgb},0)`);x.fillStyle=g;x.fillRect(0,0,r*2,r*2)})}
function grain(S,a=18){return mk(256,256,(x)=>{const d=x.createImageData(256,256);for(let i=0;i<d.data.length;i+=4){const v=S.rnd()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=a}x.putImageData(d,0,0)})}
function vignette(str=.55){return mk(W,H,x=>{const g=x.createRadialGradient(W/2,H*.45,H*.35,W/2,H*.5,H*1.05);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${str})`);x.fillStyle=g;x.fillRect(0,0,W,H)})}
// midpoint displacement ridge -> array of [x,y]
function ridge(S,{y,amp,n=8,rough=.55,shape}){const N=1<<n,a=new Array(N+1).fill(0);a[0]=S.R(0,1);a[N]=S.R(0,1);
  let step=N,am=.8;while(step>1){const h=step/2;for(let i=h;i<N;i+=step)a[i]=(a[i-h]+a[i+h])/2+S.R(-am,am);am*=rough;step=h}
  let lo=Math.min(...a),hi=Math.max(...a);const pts=[];
  for(let i=0;i<=N;i++){const x=-20+i/N*(W+40),k=shape?shape(x/W):1;pts.push([x,y-amp*k*(a[i]-lo)/(hi-lo)])}return pts}
function fillRidge(x,pts,fill,bottom=H,dy=0){x.beginPath();x.moveTo(pts[0][0],bottom);for(const p of pts)x.lineTo(p[0],p[1]+dy);x.lineTo(pts[pts.length-1][0],bottom);x.closePath();x.fillStyle=fill;x.fill()}

/* ================= 1: Lantern Lake ================= */
BIS.scene('g7y-1',{title:'Lantern Lake',blurb:'Friends hand in hand on a jetty release a stream of glowing lanterns that rise together over a moonlit mountain lake.',
 setup(S){const st=S.state,HZ=760;
  st.HZ=HZ;
  // ---- sky + mountains (above horizon) ----
  const top=mk(W,HZ,x=>{
    const g=x.createLinearGradient(0,0,0,HZ);g.addColorStop(0,'#04061a');g.addColorStop(.45,'#0d1440');g.addColorStop(.8,'#262a63');g.addColorStop(1,'#4a3f78');x.fillStyle=g;x.fillRect(0,0,W,HZ);
    // milky band
    x.save();x.translate(W*.45,HZ*.35);x.rotate(-.42);
    for(let i=0;i<22;i++){const cx=S.R(-900,900),cy=S.R(-50,50),r=S.R(90,200);const gg=x.createRadialGradient(cx,cy,0,cx,cy,r);gg.addColorStop(0,'rgba(150,160,230,.07)');gg.addColorStop(1,'rgba(150,160,230,0)');x.fillStyle=gg;x.fillRect(cx-r,cy-r,2*r,2*r)}
    for(let i=0;i<900;i++){x.fillStyle=`rgba(230,230,255,${S.R(.1,.5)})`;const r=S.R(.4,1.1);x.fillRect(S.R(-1000,1000),S.R(-90,90)*S.rnd(),r,r)}
    x.restore();
    for(let i=0;i<380;i++){const r=S.R(.5,1.8);x.fillStyle=`rgba(255,250,240,${S.R(.25,.9)})`;x.beginPath();x.arc(S.R(0,W),S.R(0,HZ-80),r,0,TAU);x.fill()}
    // moon
    const mx=1490,my=170;
    let gg=x.createRadialGradient(mx,my,0,mx,my,420);gg.addColorStop(0,'rgba(200,210,255,.35)');gg.addColorStop(.25,'rgba(150,160,230,.12)');gg.addColorStop(1,'rgba(120,130,220,0)');x.fillStyle=gg;x.fillRect(0,0,W,HZ);
    gg=x.createRadialGradient(mx-12,my-12,4,mx,my,52);gg.addColorStop(0,'#fffdf2');gg.addColorStop(1,'#d9dcf0');x.fillStyle=gg;x.beginPath();x.arc(mx,my,52,0,TAU);x.fill();
    x.fillStyle='rgba(150,155,190,.25)';[[-14,-8,12],[16,10,9],[-4,20,7],[20,-18,6]].forEach(([a,b,r])=>{x.beginPath();x.arc(mx+a,my+b,r,0,TAU);x.fill()});
    // far range with snow
    const far=ridge(S,{y:HZ-8,amp:300,n:8,rough:.58,shape:u=>.45+.55*Math.pow(Math.sin(u*Math.PI*1.4+.5)**2,.8)});
    fillRidge(x,far,'#8e93c9',HZ);
    x.save();x.beginPath();x.moveTo(far[0][0],HZ);for(const p of far)x.lineTo(p[0],p[1]);x.lineTo(W+20,HZ);x.clip();
    const sn=[];for(const p of far)sn.push([p[0],p[1]+Math.max(3,Math.min(110,(HZ-120-p[1])*.75))+S.R(-6,10)]);
    const mg=x.createLinearGradient(0,HZ-300,0,HZ);mg.addColorStop(0,'#3b4180');mg.addColorStop(1,'#232755');fillRidge(x,sn,mg,HZ);
    // moonlit right faces
    x.restore();
    // haze
    let hz=x.createLinearGradient(0,HZ-180,0,HZ);hz.addColorStop(0,'rgba(90,80,140,0)');hz.addColorStop(1,'rgba(110,95,160,.55)');x.fillStyle=hz;x.fillRect(0,HZ-180,W,180);
    const mid=ridge(S,{y:HZ+2,amp:110,n:7,rough:.68,shape:u=>.5+.5*Math.sin(u*9+1)**2});fillRidge(x,mid,'#1a1d45',HZ);
    // conifer treeline
    x.fillStyle='#0a0c26';x.beginPath();x.moveTo(0,HZ);for(let tx=0;tx<=W;tx+=S.R(9,18)){const th=S.R(14,46)*(.6+.4*Math.sin(tx*.004));x.lineTo(tx,HZ-4);x.lineTo(tx+5,HZ-4-th);x.lineTo(tx+10,HZ-4)}x.lineTo(W,HZ);x.closePath();x.fill();
  });
  // ---- full base with reflected lake ----
  st.base=mk(W,H,x=>{x.drawImage(top,0,0);
    x.save();x.translate(0,2*HZ);x.scale(1,-1);x.globalAlpha=.85;x.drawImage(top,0,HZ-(H-HZ),W,H-HZ,0,HZ-(H-HZ),W,H-HZ);x.restore();
    const lg=x.createLinearGradient(0,HZ,0,H);lg.addColorStop(0,'rgba(10,12,40,.35)');lg.addColorStop(1,'rgba(3,4,16,.85)');x.fillStyle=lg;x.fillRect(0,HZ,W,H-HZ);
    for(let i=0;i<700;i++){const y=HZ+Math.pow(S.rnd(),1.6)*(H-HZ),k=(y-HZ)/(H-HZ);x.fillStyle=S.rnd()<.5?`rgba(160,170,240,${.05+.08*S.rnd()})`:`rgba(0,0,10,${.15+.2*S.rnd()})`;x.fillRect(S.R(-50,W),y,S.R(30,220)*(.3+k),1+2*k)}
    // shoreline glint
    x.fillStyle='rgba(170,160,230,.25)';x.fillRect(0,HZ,W,1.5);
  });
  // ---- foreground: jetty + figures ----
  st.fg=mk(W,H,x=>{const D='#04050e';
    x.fillStyle=D;
    // posts + reflections
    for(let px=-10;px<770;px+=72){x.fillRect(px,880,12,90);const g=x.createLinearGradient(0,970,0,1080);g.addColorStop(0,'rgba(4,5,14,.6)');g.addColorStop(1,'rgba(4,5,14,0)');x.fillStyle=g;x.fillRect(px+1,970,10,110);x.fillStyle=D}
    x.beginPath();x.moveTo(-20,866);x.lineTo(780,872);x.lineTo(780,892);x.lineTo(-20,896);x.closePath();x.fill();
    x.fillStyle='rgba(255,190,120,.22)';x.fillRect(-20,866,800,3);
    // deck reflection
    x.fillStyle='rgba(4,5,14,.45)';x.fillRect(-20,970,800,14);
    // figures, hand in hand
    const figs=[[150,1.35,0],[290,1.22,1],[420,1.4,2],[555,1.2,3],[680,1.3,4]];
    const hands=[];
    figs.forEach(([fx,k,i])=>{const h=150*k,hy=868-h;x.fillStyle=D;
      x.beginPath();x.arc(fx,hy+16*k,16*k,0,TAU);x.fill();
      x.beginPath();x.moveTo(fx-20*k,hy+38*k);x.quadraticCurveTo(fx,hy+28*k,fx+20*k,hy+38*k);x.lineTo(fx+17*k,hy+95*k);x.lineTo(fx+12*k,868);x.lineTo(fx+3*k,868);x.lineTo(fx,hy+100*k);x.lineTo(fx-3*k,868);x.lineTo(fx-12*k,868);x.lineTo(fx-17*k,hy+95*k);x.closePath();x.fill();
      // hair variation
      if(i%2){x.beginPath();x.ellipse(fx,hy+20*k,18*k,22*k,0,Math.PI*1.05,TAU*.98);x.fill()}
      hands.push([fx,hy,k]);
      // rim light from lanterns above
      x.strokeStyle='rgba(255,190,110,.35)';x.lineWidth=2;x.beginPath();x.arc(fx,hy+16*k,16*k,Math.PI*1.1,Math.PI*1.9);x.stroke()});
    x.strokeStyle=D;x.lineCap='round';x.lineWidth=9;
    for(let i=0;i<hands.length-1;i++){const [ax,ay,ak]=hands[i],[bx,by,bk]=hands[i+1];const mx=(ax+bx)/2,my=Math.min(ay,by)+75;
      x.beginPath();x.moveTo(ax+16*ak,ay+42*ak);x.quadraticCurveTo(ax+30,ay+70*ak,mx,my);x.quadraticCurveTo(bx-30,by+70*bk,bx-16*bk,by+42*bk);x.stroke()}
    // outer arms raised
    [[hands[0],-1],[hands[4],1]].forEach(([[fx,hy,k],s])=>{x.beginPath();x.moveTo(fx+s*16*k,hy+42*k);x.quadraticCurveTo(fx+s*40*k,hy+10*k,fx+s*34*k,hy-30*k);x.stroke()});
    // shore grass bank bottom-left
    x.fillStyle=D;x.beginPath();x.moveTo(-20,H);x.lineTo(-20,1000);x.quadraticCurveTo(140,985,330,1040);x.quadraticCurveTo(420,1065,470,H);x.closePath();x.fill();
    // bottom-right bank
    x.beginPath();x.moveTo(W+20,H);x.lineTo(W+20,990);x.quadraticCurveTo(1760,1000,1600,1050);x.quadraticCurveTo(1520,1072,1480,H);x.closePath();x.fill();
  });
  st.glow=glowSprite(128,'255,180,90',1,.25);
  st.soft=glowSprite(64,'255,210,150',.9,.4);
  st.moonGlint=glowSprite(40,'210,215,255',.8);
  // lantern sprites (3 warm hues)
  st.lan=[[38,95,62],[28,95,58],[14,90,58]].map(([h,s,l])=>mk(44,60,x=>{
    const g=x.createLinearGradient(0,4,0,56);g.addColorStop(0,`hsl(${h},${s}%,${l-10}%)`);g.addColorStop(.6,`hsl(${h+8},100%,${l+14}%)`);g.addColorStop(1,`hsl(${h+14},100%,${l+28}%)`);
    x.fillStyle=g;x.beginPath();x.moveTo(8,4);x.lineTo(36,4);x.quadraticCurveTo(44,30,37,54);x.lineTo(7,54);x.quadraticCurveTo(0,30,8,4);x.closePath();x.fill();
    x.fillStyle='rgba(255,250,220,.75)';x.beginPath();x.ellipse(22,44,8,9,0,0,TAU);x.fill();
    x.strokeStyle='rgba(120,50,20,.35)';x.lineWidth=1;for(const vx of [15,22,29]){x.beginPath();x.moveTo(vx,6);x.lineTo(vx,53);x.stroke()}
    x.fillStyle='rgba(90,35,20,.75)';x.fillRect(7,2,30,4);x.fillRect(6,52,32,4)}));
  // sky lanterns: ribbon released from jetty + others from across lake
  st.L=[];
  for(let i=0;i<120;i++){const fromJetty=i<70;
    const xs=fromJetty?S.R(150,700):S.R(760,1880),ys=fromJetty?S.R(600,680):S.R(700,780),sc=fromJetty?S.R(.95,1.25):S.R(.35,.6);
    st.L.push({xs,ys,sc,dx:fromJetty?S.R(150,1150):S.R(-250,250),ph:S.rnd(),cyc:fromJetty?45:S.pick([45,90]),sw:S.R(8,24),sp:S.rnd(),v:S.RI(0,2),fl:S.R(2.5,4.5)})}
  st.L.sort((a,b)=>a.sc-b.sc);
  // floating water lanterns
  st.F=Array.from({length:16},()=>{const y=S.R(790,980);return{x:S.R(0,W),y,sc:.25+.55*(y-760)/320,ph:S.rnd(),v:S.RI(0,2)}});
  st.reeds=Array.from({length:46},()=>{const left=S.rnd()<.3;return{x:left?S.R(-10,420):S.R(1500,1935),h:S.R(120,330),lean:S.R(-30,30),ph:S.rnd(),w:S.R(2,5)}});
  st.tw=Array.from({length:50},()=>({x:S.R(0,W),y:S.R(0,600),r:S.R(1,2.2),ph:S.rnd(),s:S.R(4,9)}));
  st.grain=grain(S,14);st.vig=vignette(.5);
 },
 draw(S){const c=S.ctx,st=S.state,HZ=st.HZ;
  c.drawImage(st.base,0,0);
  // twinkles
  c.fillStyle='#fff';for(const s of st.tw){c.globalAlpha=.15+.75*S.pulse(s.s,s.ph,2);c.beginPath();c.arc(s.x,s.y,s.r,0,TAU);c.fill()}
  c.globalAlpha=1;
  c.save();c.globalCompositeOperation='lighter';
  // moon path on water
  for(let i=0;i<26;i++){const y=HZ+8+i*i*.47,w=(20+i*6)*(.6+.4*S.osc01(6,i*.37));c.globalAlpha=.10+.22*S.osc01(4.5,i*.21);c.drawImage(st.moonGlint,1490-w+S.osc(9,i*.13)*8,y-3,w*2,6+i*.25)}
  // floating water lanterns
  for(const f of st.F){const x=S.wrap(f.x,180,W,80),y=f.y+S.osc(7,f.ph)*2,k=f.sc;
    c.globalAlpha=.55;c.drawImage(st.glow,x-70*k,y-70*k,140*k,140*k);
    c.globalAlpha=.35;c.drawImage(st.soft,x-14*k,y+6*k,28*k,90*k)}
  // reflections of low sky lanterns
  for(const l of st.L){const t=S.saw(l.cyc,l.ph);const y=S.lerp(l.ys,-120,t);if(l.sc<.9||y<560)continue;const k=l.sc*(1-.6*t);
    const x=l.xs+l.dx*t*t+S.osc(15,l.sp)*l.sw,ry=2*(l.ys+150)-y;if(ry>H+40)continue;c.globalAlpha=.22*ss(t/.05);c.drawImage(st.soft,x-30*k,ry-50*k,60*k,100*k)}
  c.restore();
  c.globalAlpha=1;
  c.drawImage(st.fg,0,0);
  // warm wash around the friends
  c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.16+.04*S.osc(11);c.drawImage(st.glow,20,480,820,480);c.restore();
  // sky lanterns: glow pass then bodies
  const Ls=st.L,pos=[];
  for(const l of Ls){const t=S.saw(l.cyc,l.ph),y=S.lerp(l.ys,-120,t),k=l.sc*(1-.62*t);
    const x=l.xs+l.dx*(t*t*.6+t*.4)+S.osc(15,l.sp)*l.sw*(.4+t);
    const a=ss(t/.06)*ss((1-t)/.08)*(.9+.1*S.osc(l.fl,l.ph));pos.push([x,y,k,a,l])}
  c.save();c.globalCompositeOperation='lighter';
  for(const [x,y,k,a] of pos){if(a<=0)continue;c.globalAlpha=.75*a;c.drawImage(st.glow,x-80*k,y-74*k,160*k,160*k)}
  c.restore();
  for(const [x,y,k,a,l] of pos){if(a<=0)continue;c.globalAlpha=a;c.drawImage(st.lan[l.v],x-22*k,y-30*k,44*k,60*k)}
  c.globalAlpha=1;
  // reeds sway
  c.strokeStyle='#04050e';c.lineCap='round';
  for(const r of st.reeds){const sw=S.osc(9,r.ph)*12*(r.h/300);c.lineWidth=r.w;c.beginPath();c.moveTo(r.x,H+5);c.quadraticCurveTo(r.x+r.lean*.4,H-r.h*.6,r.x+r.lean+sw,H-r.h);c.stroke()}
  c.fillStyle=c.createPattern(st.grain,'repeat');c.fillRect(0,0,W,H);
  c.drawImage(st.vig,0,0);
 }});

/* ================= 2: Woven Together ================= */
BIS.scene('g7y-2',{title:'Woven Together',blurb:'Silk ribbons of many colours sweep in from all sides and twist into one shining rope that rises towards the light.',
 setup(S){const st=S.state;
  st.bg=mk(W,H,x=>{
    const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0e2a3c');g.addColorStop(.45,'#082033');g.addColorStop(1,'#040c18');x.fillStyle=g;x.fillRect(0,0,W,H);
    let r=x.createRadialGradient(960,-60,0,960,-60,900);r.addColorStop(0,'rgba(255,236,190,.95)');r.addColorStop(.12,'rgba(255,214,150,.55)');r.addColorStop(.45,'rgba(80,170,180,.16)');r.addColorStop(1,'rgba(20,60,90,0)');x.fillStyle=r;x.fillRect(0,0,W,H);
    // light rays
    x.save();x.globalCompositeOperation='lighter';
    for(let i=0;i<16;i++){const a=Math.PI/2+S.R(-.75,.75),w=S.R(.015,.05),len=1300;x.beginPath();x.moveTo(960,-60);x.lineTo(960+Math.cos(a-w)*len,-60+Math.sin(a-w)*len);x.lineTo(960+Math.cos(a+w)*len,-60+Math.sin(a+w)*len);x.closePath();
      const lg=x.createLinearGradient(960,-60,960,1000);lg.addColorStop(0,`rgba(255,230,180,${S.R(.04,.1)})`);lg.addColorStop(1,'rgba(255,230,180,0)');x.fillStyle=lg;x.fill()}
    x.restore();
    // static bokeh deep layer
    for(let i=0;i<70;i++){const bx=S.R(0,W),by=S.R(0,H*.8),br=S.R(10,46);x.fillStyle=`hsla(${S.pick([45,180,190,330])},70%,70%,${S.R(.03,.08)})`;x.beginPath();x.arc(bx,by,br,0,TAU);x.fill()}
    // floor mist
    const m=x.createLinearGradient(0,820,0,H);m.addColorStop(0,'rgba(60,140,160,0)');m.addColorStop(.6,'rgba(60,130,150,.14)');m.addColorStop(1,'rgba(20,50,70,.3)');x.fillStyle=m;x.fillRect(0,820,W,H-820);
    // reflective floor line
    const fl=x.createRadialGradient(960,1000,0,960,1000,900);fl.addColorStop(0,'rgba(255,220,160,.12)');fl.addColorStop(1,'rgba(255,220,160,0)');x.save();x.scale(1,.25);x.fillStyle=fl;x.fillRect(0,3600,W,800);x.restore();
  });
  st.core=mk(400,1100,x=>{const g=x.createLinearGradient(0,0,400,0);g.addColorStop(0,'rgba(255,220,160,0)');g.addColorStop(.5,'rgba(255,220,160,.16)');g.addColorStop(1,'rgba(255,220,160,0)');x.fillStyle=g;x.fillRect(0,0,400,1100);
    const v=x.createLinearGradient(0,0,0,1100);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(.75,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,1)');x.globalCompositeOperation='destination-out';x.fillStyle=v;x.fillRect(0,0,400,1100)});
  st.cols=[[42,90,60],[12,85,64],[172,70,50],[268,55,66],[200,80,62],[335,70,68],[95,55,55]];
  st.N=st.cols.length;
  // fan targets at bottom: spread across, outer ones come from sides
  st.fan=st.cols.map((_,i)=>{const u=i/(st.N-1)*2-1;return{u,x:960+u*980,sw:S.R(0,1)}});
  st.ord=[3,0,5,2,6,1,4];
  st.sparks=Array.from({length:170},()=>({i:S.RI(0,st.N-1),ph:S.rnd(),cyc:S.pick([18,22.5,30]),r:S.R(1.2,3.2),tw:S.rnd()}));
  st.bok=Array.from({length:40},()=>({x:S.R(0,W),y:S.R(0,H),r:S.R(14,60),h:S.pick(['255,220,160','140,230,220','255,170,190']),a:S.R(.04,.12),ph:S.rnd(),sec:S.pick([45,90])}));
  st.dot=glowSprite(24,'255,240,210',1,.3);
  st.bk={};for(const h of ['255,220,160','140,230,220','255,170,190'])st.bk[h]=mk(128,128,x=>{const g=x.createRadialGradient(64,64,40,64,64,64);g.addColorStop(0,`rgba(${h},.75)`);g.addColorStop(.85,`rgba(${h},1)`);g.addColorStop(1,`rgba(${h},0)`);x.fillStyle=g;x.beginPath();x.arc(64,64,64,0,TAU);x.fill()});
  st.grain=grain(S,12);st.vig=vignette(.55);
 },
 draw(S){const c=S.ctx,st=S.state,N=st.N;
  c.drawImage(st.bg,0,0);
  // drifting bokeh
  c.save();c.globalCompositeOperation='lighter';
  for(const b of st.bok){const y=S.wrap(b.y,b.sec,H,80,-1),x=b.x+S.osc(30,b.ph)*30;c.globalAlpha=b.a*(.7+.3*S.osc(10,b.ph));c.drawImage(st.bk[b.h],x-b.r,y-b.r,b.r*2,b.r*2)}
  c.globalAlpha=.9+.1*S.osc(15);c.drawImage(st.core,760,-40);
  c.restore();
  const flow=TAU*S.saw(18),breath=S.osc(30);
  const K=.0105;
  // strand position at y
  const P=(i,y)=>{const s=ss((y-470)/620);const R=S.lerp(26,118,S.clamp((y+60)/560));
    const ang=i/N*TAU+y*K+flow;const bx=960+R*Math.sin(ang);
    const f=st.fan[i];const fx=f.x+S.osc(30,f.sw)*40+breath*f.u*30;
    const e=s*s;const x=bx*(1-e)+fx*e;const yy=y+e*Math.abs(f.u)*-60;
    return[x,yy,Math.cos(ang)*(1-s),s,ang]};
  // build segments
  const segs=[];const step=10;
  for(let i=0;i<N;i++){const [h,sa,l]=st.cols[i];let prev=null;
    for(let y=-80;y<=H+120;y+=step){const q=P(i,y);const w=S.lerp(5,30,ss((y+60)/1120))*(.42+.58*Math.abs(Math.cos(q[4]*1.0+.3)));
      if(prev){const dx=q[0]-prev[0],dy=q[1]-prev[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;
        segs.push({d:(q[2]+prev[2])/2+(q[3]>.95?st.ord[i]*.001:0),i,a:prev,b:q,nx,ny,w0:prev[5],w1:w,h,sa,l})}
      q[5]=w;prev=q}}
  segs.sort((A,B)=>A.d-B.d);
  for(const g of segs){const lt=g.l+g.d*16-(g.a[3])*8,sh=Math.round(lt/3)*3;
    c.fillStyle=`hsl(${g.h},${g.sa}%,${sh}%)`;
    const a=g.a,b=g.b;c.beginPath();c.moveTo(a[0]+g.nx*g.w0/2,a[1]+g.ny*g.w0/2);c.lineTo(b[0]+g.nx*g.w1/2,b[1]+g.ny*g.w1/2);
    c.lineTo(b[0]-g.nx*g.w1/2,b[1]-g.ny*g.w1/2);c.lineTo(a[0]-g.nx*g.w0/2,a[1]-g.ny*g.w0/2);c.closePath();c.fill();
    if(g.d>.35){c.fillStyle='rgba(255,250,235,'+(.28*(g.d-.35))+')';c.beginPath();c.moveTo(a[0]+g.nx*g.w0*.15,a[1]);c.lineTo(b[0]+g.nx*g.w1*.15,b[1]);c.lineTo(b[0]+g.nx*g.w1*.4,b[1]);c.lineTo(a[0]+g.nx*g.w0*.4,a[1]);c.closePath();c.fill()}}
  // sparks travelling up the strands
  c.save();c.globalCompositeOperation='lighter';
  for(const s of st.sparks){const t=S.saw(s.cyc,s.ph),y=H+100-t*(H+200);const q=P(s.i,y);if(q[2]<-.2)continue;
    const r=s.r*(1.4-t*.6)*4;c.globalAlpha=(.4+.6*S.osc01(3,s.tw))*ss(t/.1)*ss((1-t)/.15);c.drawImage(st.dot,q[0]-r,q[1]-r,r*2,r*2)}
  // top light bloom
  c.globalAlpha=.5+.12*S.osc(22);c.drawImage(st.dot,960-260,-300,520,520);
  c.restore();
  c.fillStyle=c.createPattern(st.grain,'repeat');c.fillRect(0,0,W,H);
  c.drawImage(st.vig,0,0);
 }});

/* ================= 3: Murmuration ================= */
BIS.scene('g7y-3',{title:'Murmuration',blurb:'A great flock of starlings swirls as one living shape above a quiet valley of poplars and mountains at dusk.',
 setup(S){const st=S.state,HZ=640;
  st.bg=mk(W,H,x=>{
    const g=x.createLinearGradient(0,0,0,HZ+60);g.addColorStop(0,'#1b2346');g.addColorStop(.35,'#3b3f72');g.addColorStop(.68,'#8a6f9c');g.addColorStop(.9,'#d8a2a6');g.addColorStop(1,'#efc0a8');x.fillStyle=g;x.fillRect(0,0,W,H);
    // moon
    const mx=360,my=190;let r=x.createRadialGradient(mx,my,0,mx,my,260);r.addColorStop(0,'rgba(255,245,235,.35)');r.addColorStop(1,'rgba(255,245,235,0)');x.fillStyle=r;x.fillRect(0,0,W,H);
    x.fillStyle='#fbf2ea';x.beginPath();x.arc(mx,my,34,0,TAU);x.fill();x.fillStyle='rgba(180,160,190,.22)';x.beginPath();x.arc(mx+9,my-6,8,0,TAU);x.arc(mx-12,my+10,6,0,TAU);x.fill();
    for(let i=0;i<90;i++){x.fillStyle=`rgba(255,255,255,${S.R(.15,.6)*(1-0)})`;const y=S.R(0,300);x.globalAlpha=1-y/300;x.fillRect(S.R(0,W),y,1.4,1.4)}x.globalAlpha=1;
    // long cloud streaks lit from below
    for(let i=0;i<9;i++){const cy=S.R(330,560),cx=S.R(0,W),cw=S.R(300,800),ch=S.R(8,20);x.save();x.translate(cx,cy);x.scale(1,ch/cw);
      const cg=x.createRadialGradient(0,0,0,0,0,cw);cg.addColorStop(0,`rgba(250,190,180,${S.R(.18,.32)})`);cg.addColorStop(1,'rgba(250,190,180,0)');x.fillStyle=cg;x.fillRect(-cw,-cw,cw*2,cw*2);x.restore()}
    // mountain ranges: explicit sharp peaks + crag noise, three depth layers with haze
    const range=(base,pk,crag)=>{const N=512,nz=[];let a=0,b=0;for(let i=0;i<=N;i++){a+=S.R(-1,1);a*=.9;b+=S.R(-1,1);b*=.6;nz.push(a*.7+b*.5)}
      const pts=[];for(let i=0;i<=N;i++){const X=-20+i/N*(W+40);let hgt=0;for(const [px,ph,pw] of pk){const d=Math.abs(X-px)/pw;if(d<1)hgt=Math.max(hgt,ph*Math.pow(1-d,1.15))}
        pts.push([X,base-hgt-nz[i]*crag*(.35+hgt/400)])}return pts};
    const shade=(pts,pk,col,base)=>{x.fillStyle=col;for(const [px,ph,pw] of pk){let j=0;while(j<pts.length-1&&pts[j][0]<px)j++;let k=j;while(k<pts.length-1&&pts[k][0]<px+pw*.9)k++;
      x.beginPath();x.moveTo(pts[j][0],pts[j][1]);for(let q=j;q<=k;q++)x.lineTo(pts[q][0],pts[q][1]);x.lineTo(px+pw*.25,base);x.lineTo(px+pw*.05,base);x.lineTo(pts[j][0]+4,pts[j][1]+ph*.35);x.closePath();x.fill()}};
    const snow=(pts,line,col)=>{x.save();x.beginPath();x.moveTo(pts[0][0],H);for(const p of pts)x.lineTo(p[0],p[1]);x.lineTo(W+20,H);x.clip();
      x.fillStyle=col;x.beginPath();x.moveTo(pts[0][0],pts[0][1]);for(const p of pts)x.lineTo(p[0],p[1]);
      for(let i=pts.length-1;i>=0;i--){const p=pts[i],d=Math.max(0,line-p[1]);x.lineTo(p[0],p[1]+(d>0?Math.min(d*.55,80)+S.R(-4,10)*(d>20?1:0):0))}x.closePath();x.fill();x.restore()};
    const pk1=[[120,300,380],[520,360,420],[860,250,300],[1180,330,380],[1520,390,440],[1860,290,360]];
    const r1=range(HZ-10,pk1,22);fillRidge(x,r1,'#a993bd');snow(r1,HZ-250,'rgba(238,220,232,.55)');
    let hz=x.createLinearGradient(0,HZ-320,0,HZ+20);hz.addColorStop(0,'rgba(220,170,185,0)');hz.addColorStop(1,'rgba(225,170,175,.55)');x.fillStyle=hz;x.fillRect(0,HZ-320,W,340);
    const pk2=[[-40,230,330],[330,270,340],[700,180,260],[1330,220,300],[1700,260,340],[2000,200,300]];
    const r2=range(HZ+20,pk2,16);const g2=x.createLinearGradient(0,HZ-260,0,HZ+20);g2.addColorStop(0,'#8a72a6');g2.addColorStop(1,'#76629a');fillRidge(x,r2,g2);
    snow(r2,HZ-150,'rgba(236,214,226,.85)');
    // rim light on left-facing slopes catching the afterglow
    x.strokeStyle='rgba(255,215,205,.55)';x.lineWidth=1.6;x.beginPath();for(let i=1;i<r2.length;i++){if(r2[i][1]<r2[i-1][1]-.4){x.moveTo(r2[i-1][0],r2[i-1][1]);x.lineTo(r2[i][0],r2[i][1])}}x.stroke();
    hz=x.createLinearGradient(0,HZ-120,0,HZ+60);hz.addColorStop(0,'rgba(230,170,170,0)');hz.addColorStop(1,'rgba(230,170,170,.45)');x.fillStyle=hz;x.fillRect(0,HZ-120,W,180);
    // mid hills
    const h1=ridge(S,{y:HZ+60,amp:110,n:6,rough:.45});fillRidge(x,h1,'#6a5585');
    let hz2=x.createLinearGradient(0,HZ,0,HZ+90);hz2.addColorStop(0,'rgba(220,160,170,.25)');hz2.addColorStop(1,'rgba(220,160,170,0)');x.fillStyle=hz2;x.fillRect(0,HZ,W,90);
    const h2=ridge(S,{y:HZ+150,amp:120,n:6,rough:.45});fillRidge(x,h2,'#45365f');
    // poplar rows
    const poplar=(px,py,h,col)=>{x.fillStyle=col;x.beginPath();x.ellipse(px,py-h/2,h*.065,h/2,0,0,TAU);x.fill();x.fillRect(px-1.5,py-4,3,8)};
    for(let px=-20;px<W+20;px+=S.R(22,34)){if(px>820&&px<1250)continue;const py=HZ+150+Math.sin(px*.003)*20,h=S.R(70,120);poplar(px,py,h,'#33284a')}
    // near field
    const h3=ridge(S,{y:H-170,amp:90,n:6,rough:.4});const ng=x.createLinearGradient(0,H-260,0,H);ng.addColorStop(0,'#2a2140');ng.addColorStop(1,'#120e1f');
    x.save();fillRidge(x,h3,ng);x.restore();
    // river winding toward viewer: reflected sky, soft banks, shimmer
    const rv=[];for(let i=0;i<=40;i++){const t=i/40,y=HZ+70+t*(H-HZ-70+10),cx=1000+Math.sin(t*5.6+.3)*240*Math.pow(t,.9)-40*t,w=6+Math.pow(t,2.1)*1000;rv.push([cx,y,w])}
    st.rv=rv;
    const rp=new Path2D();rv.forEach(([cx,y,w],i)=>i?rp.lineTo(cx-w/2,y):rp.moveTo(cx-w/2,y));for(let i=rv.length-1;i>=0;i--)rp.lineTo(rv[i][0]+rv[i][2]/2,rv[i][1]);rp.closePath();
    const rg=x.createLinearGradient(0,HZ+70,0,H);rg.addColorStop(0,'#f2c3b4');rg.addColorStop(.25,'#c493ad');rg.addColorStop(.6,'#6d5f97');rg.addColorStop(1,'#2b2d5c');
    x.save();{const hc=new Path2D();hc.moveTo(h2[0][0],H);for(const q of h2)hc.lineTo(q[0],q[1]+4);hc.lineTo(W+20,H);hc.closePath();x.clip(hc)}x.fillStyle=rg;x.fill(rp);x.clip(rp);
    // reflected flank shadows + mirrored poplar smudges
    // soft banks: dark feathered edges
    for(let k=0;k<5;k++){x.strokeStyle=`rgba(20,14,34,${.14-k*.025})`;x.lineWidth=4+k*6;x.stroke(rp)}
    
    for(let i=0;i<220;i++){const t=Math.pow(S.rnd(),.8),q=rv[Math.min(40,Math.floor(t*40))];x.fillStyle=`rgba(${S.rnd()<.7?'255,225,225':'150,140,210'},${S.R(.05,.16)})`;x.fillRect(q[0]+S.R(-.38,.3)*q[2],q[1]+S.R(0,10),(S.R(8,60)*t+4)*(1+t),1+t*1.5)}
    x.restore();
    
    for(let px=-30;px<W+30;px+=S.R(30,48)){if(px>620&&px<1300)continue;const py=H-150+S.R(-10,30),h=S.R(170,280);poplar(px,py+60,h,'#170f26')}
    // texture strokes on near field
    for(let i=0;i<600;i++){x.strokeStyle=`rgba(${S.rnd()<.5?'0,0,0':'180,140,190'},${S.R(.05,.12)})`;x.lineWidth=1;const px=S.R(0,W),py=S.R(H-180,H);x.beginPath();x.moveTo(px,py);x.lineTo(px+S.R(-3,3),py-S.R(5,16));x.stroke()}
  });
  // birds: parameters inside an elongated cloud
  st.B=Array.from({length:390},()=>{let u,v;do{const r=Math.sqrt(-2*Math.log(S.R(1e-6,1)))*.36,a=S.R(0,TAU);u=r*Math.cos(a);v=r*Math.sin(a)}while(u*u+v*v>1.2);return{u,v,z:S.rnd(),ph:S.rnd(),f:S.R(.9,1.3)}});
  st.str=Array.from({length:10},()=>({x:S.R(0,W),y:S.R(120,520),ph:S.rnd(),sec:S.pick([30,45])}));
  st.grass=Array.from({length:150},()=>{const side=S.rnd()<.5;return{x:side?S.R(-10,720):S.R(1200,1930),h:S.R(30,110),l:S.R(-14,14),ph:S.rnd()}});
  st.ff=Array.from({length:22},()=>({x:S.rnd()<.5?S.R(40,700):S.R(1220,1880),y:S.R(880,1040),ph:S.rnd(),r:S.R(14,30)}));
  st.shim=Array.from({length:60},()=>({i:S.RI(6,40),u:S.R(-.35,.25),dy:S.R(0,10),l:S.R(30,110),ph:S.rnd(),sec:S.pick([3,4.5,6])}));
  st.fly=glowSprite(18,'255,220,150',1,.3);
  st.grain=grain(S,14);st.vig=vignette(.45);
 },
 draw(S){const c=S.ctx,st=S.state,p=S.p,s=k=>Math.sin(TAU*k*p);
  c.drawImage(st.bg,0,0);
  // flock shape (integer harmonics => seamless)
  const cx=960+300*Math.sin(TAU*p+.4)+90*Math.sin(TAU*3*p+1.1),cy=290+50*Math.sin(TAU*2*p+.3)+25*Math.sin(TAU*5*p);
  const rot=.35*Math.sin(TAU*2*p+.9)+.15*Math.sin(TAU*3*p),sx=450+110*Math.sin(TAU*3*p+2)+50*Math.sin(TAU*5*p+.6),sy=170+50*Math.sin(TAU*2*p+1.4)+20*Math.sin(TAU*4*p+.2);
  const cr=Math.cos(rot),sr=Math.sin(rot);
  const flap=TAU*S.cycles(.5)*p;
  c.fillStyle='#14102a';c.beginPath();
  for(const b of st.B){
    let u=b.u+.22*Math.sin(b.v*2.6+TAU*2*p+1)+.12*Math.sin(b.v*4+TAU*3*p),v=b.v+.35*Math.sin(b.u*2.2+TAU*3*p)+.15*Math.sin(b.u*5+TAU*4*p+.5);
    // fold: compress one end
    const fold=1-.35*(.5+.5*Math.sin(TAU*2*p+b.u*1.5));u*=fold;
    let x=u*sx,y=v*sy;const X=cx+x*cr-y*sr+6*Math.sin(TAU*S.cycles(6)*p+b.ph*TAU),Y=cy+x*sr+y*cr+5*Math.cos(TAU*S.cycles(7)*p+b.ph*TAU);
    const k=3.6+b.z*3.8,wy=Math.sin(flap*b.f+b.ph*TAU)*k*.9;
    c.moveTo(X-k*1.6,Y+wy);c.lineTo(X,Y+k*.5);c.lineTo(X+k*1.6,Y+wy);c.lineTo(X,Y-k*.25);c.closePath()}
  c.fill();
  // stragglers
  for(const t of st.str){const x=S.wrap(t.x,t.sec,W,40),y=t.y+S.osc(12,t.ph)*20,wy=Math.sin(flap+t.ph*TAU)*3;c.beginPath();c.moveTo(x-6,y+wy);c.lineTo(x,y+1.5);c.lineTo(x+6,y+wy);c.lineTo(x,y-.8);c.closePath();c.fill()}
  // river shimmer
  c.save();c.globalCompositeOperation='lighter';c.fillStyle='rgb(255,215,215)';
  for(const m of st.shim){const q=st.rv[m.i],x=q[0]+m.u*q[2]+S.osc(8,m.ph)*q[2]*.04;c.globalAlpha=.22*S.osc01(m.sec,m.ph)*(.4+m.i/40);c.fillRect(x,q[1]+m.dy,m.l*(.3+m.i/40),1+m.i/20)}
  c.restore();
  // grass sway
  c.strokeStyle='#0d0918';c.lineCap='round';c.lineWidth=2.4;c.beginPath();
  for(const g of st.grass){const sw=S.osc(10,g.ph+g.x*.0004)*g.h*.08;c.moveTo(g.x,H+4);c.quadraticCurveTo(g.x+g.l*.5,H-g.h*.5,g.x+g.l+sw,H-g.h)}c.stroke();
  // fireflies
  c.save();c.globalCompositeOperation='lighter';
  for(const f of st.ff){const x=f.x+S.osc(20,f.ph)*f.r,y=f.y+S.osc(15,f.ph+.3)*f.r*.6;c.globalAlpha=.25+.6*S.pulse(5,f.ph,3);c.drawImage(st.fly,x-14,y-14,28,28)}
  c.restore();
  c.fillStyle=c.createPattern(st.grain,'repeat');c.fillRect(0,0,W,H);
  c.drawImage(st.vig,0,0);
 }});
})();
