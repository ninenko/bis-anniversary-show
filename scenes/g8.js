/* Grade 8 - Music performance, love (120 s) */
(function(){
const TAU=Math.PI*2;
function glowSprite(r,rgb,a0=1){const c=document.createElement('canvas');c.width=c.height=r*2;const x=c.getContext('2d');
  const g=x.createRadialGradient(r,r,0,r,r,r);g.addColorStop(0,`rgba(${rgb},${a0})`);g.addColorStop(.3,`rgba(${rgb},${a0*.4})`);g.addColorStop(1,`rgba(${rgb},0)`);
  x.fillStyle=g;x.fillRect(0,0,r*2,r*2);return c}

/* ---------- 1: Heartbeat ---------- */
BIS.scene('g8-1',{title:'Heartbeat',blurb:'A glowing heartbeat line draws across a deep crimson night and every peak releases a heart.',
 setup(S){const st=S.state;
  st.glow=glowSprite(200,'255,80,120',1);st.glowW=glowSprite(60,'255,200,215',1);
  st.heart=S.heartPath(1);
  st.bokeh=Array.from({length:40},()=>({x:S.R(0,1920),y:S.R(0,1080),r:S.R(30,110),a:S.R(.03,.09),sec:S.R(60,120),ph:S.rnd()}));
  st.beats=6;st.spacing=1920/st.beats;st.base=640;
  // waveform (periodic in x with period spacing); u = 0..1 within a beat
  st.wave=x=>{const u=((x%st.spacing)+st.spacing)%st.spacing/st.spacing;const g=(m,w,a)=>a*Math.exp(-Math.pow((u-m)/w,2));
    return st.base-(g(.22,.025,40)+g(.34,.012,-30)+g(.38,.014,330)+g(.42,.014,-120)+g(.62,.05,70))};
  st.peakX=k=>(k+.38)*st.spacing;
 },
 draw(S){const c=S.ctx,st=S.state;
  S.bg('#12040f','#2a0a1f','#4a1230');
  for(const b of st.bokeh){c.fillStyle=`rgba(255,110,150,${b.a*(.6+.4*S.osc(20,b.ph))})`;c.beginPath();c.arc(S.wrap(b.x,b.sec,1920,150),b.y+S.osc(40,b.ph)*30,b.r,0,TAU);c.fill()}
  const beat=S.pulse(2,0,6); // soft pulse behind
  c.save();c.globalAlpha=.25+.2*beat;c.drawImage(st.glow,960-600,st.base-250-600,1200,1200);c.restore();
  const sw=12,xh=S.saw(sw)*1920,trail=1500;
  // trace
  c.lineCap=c.lineJoin='round';
  const step=8;
  for(let pass=0;pass<2;pass++){
    for(let d=0;d<1920;d+=step){
      const x1=xh-d,x2=xh-d-step;const w1=(x1+1920)%1920,w2=(x2+1920)%1920;if(w2>w1)continue;
      const a=d<trail?Math.pow(1-d/trail,1.6):0,al=.14+.86*a;
      c.strokeStyle=pass?`rgba(255,235,240,${al})`:`rgba(255,70,110,${al*.55})`;c.lineWidth=pass?4:14;
      c.beginPath();c.moveTo(w1,st.wave(w1));c.lineTo(w2,st.wave(w2));c.stroke();
    }
  }
  // head
  c.save();c.globalCompositeOperation='lighter';c.drawImage(st.glowW,xh-60,st.wave(xh)-60,120,120);c.restore();
  // hearts released at each peak
  const dur=sw*.9; // seconds visible
  for(let k=0;k<st.beats;k++){const px=st.peakX(k);let age=((xh-px)/1920+1)%1*sw; // seconds since head passed
    if(age>dur)continue;const f=age/dur,sc=(24+66*Math.sin(Math.min(1,f*3)*Math.PI/2))*(1+.06*Math.sin(f*20)),y=st.wave(px)-60-f*230,al=Math.sin(Math.min(1,f*5)*Math.PI/2)*(1-Math.pow(f,2.2));
    const x=px+Math.sin(f*5+k)*18;
    c.save();c.globalAlpha=al*.35;c.drawImage(st.glow,x-sc*3,y-sc*3,sc*6,sc*6);c.restore();
    c.save();c.globalAlpha=al;c.translate(x,y);c.rotate(Math.sin(f*4+k)*.18);c.scale(sc,sc);c.fillStyle=S.hsl(345+k*3,90,62);c.fill(st.heart);
    c.globalAlpha=al*.5;c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.ellipse(-.38,-.4,.16,.1,-.5,0,TAU);c.fill();c.restore();
  }
  c.globalAlpha=1;
 }});

/* ---------- 2: Tree of Seasons ---------- */
BIS.scene('g8-2',{title:'Tree of Seasons',blurb:'One tree passes through blossom, summer green, autumn gold and winter snow, then blossoms again.',
 setup(S){const st=S.state;
  const segs=[],leaves=[];
  (function grow(x,y,a,len,w,d){
    const x2=x+Math.cos(a)*len,y2=y+Math.sin(a)*len;segs.push({x,y,x2,y2,w,d});
    if(d>=8||len<14){return}
    if(d>=4)for(let i=0;i<2;i++)leaves.push({x:x2+S.R(-26,26),y:y2+S.R(-26,26),th:S.rnd(),ph:S.rnd(),r:S.R(9,16),h:S.rnd(),ang:S.R(0,TAU)});
    const n=d<2?2:(S.rnd()<.2?3:2);
    for(let i=0;i<n;i++){const da=(n===2?(i?1:-1)*S.R(.28,.55):(i-1)*S.R(.35,.55));grow(x2,y2,a+da,len*S.R(.74,.84),w*.7,d+1)}
  })(1000,930,-Math.PI/2,190,34,0);
  st.segs=segs;st.leaves=leaves.slice(0,520);
  st.flakes=Array.from({length:130},()=>({x:S.R(0,1920),y:S.R(0,1080),sec:S.R(14,30),sw:S.R(10,40),ph:S.rnd(),r:S.R(3,8),rot:S.R(0,TAU)}));
  st.glow=glowSprite(400,'255,255,255',1);
 },
 draw(S){const c=S.ctx,st=S.state;
  // seasons keyed at p = 0, .25, .5, .75 (spring, summer, autumn, winter), cyclic
  const P=S.p*4,i0=Math.floor(P)%4,i1=(i0+1)%4,f=S.ease(P-Math.floor(P));
  const mixc=(a,b)=>{const x=a.map((v,i)=>v+(b[i]-v)*f);return `rgb(${x[0]|0},${x[1]|0},${x[2]|0})`};
  const K=(arr)=>mixc(arr[i0],arr[i1]),N=(arr)=>arr[i0]+(arr[i1]-arr[i0])*f;
  const sky=[[[250,205,220],[255,235,230]],[[110,185,235],[220,240,250]],[[240,150,90],[255,215,150]],[[150,165,200],[235,238,245]]];
  const g=c.createLinearGradient(0,0,0,1080);
  const top=[[250,205,220],[110,185,235],[240,150,90],[150,165,200]].map(v=>v),bot=[[255,235,230],[220,240,250],[255,215,150],[235,238,245]];
  g.addColorStop(0,K(top));g.addColorStop(1,K(bot));c.fillStyle=g;c.fillRect(0,0,1920,1080);
  // sun
  const sunx=[1500,1560,1500,1450],suny=[250,200,260,300];
  c.save();c.globalCompositeOperation='lighter';c.globalAlpha=N([.45,.7,.55,.3]);c.drawImage(st.glow,N(sunx)-400,N(suny)-400);c.restore();
  // ground
  const gnd=[[160,205,150],[90,170,90],[170,120,60],[240,244,250]],far=[[190,220,175],[130,190,120],[190,150,90],[218,226,238]];
  c.fillStyle=K(far);c.beginPath();c.moveTo(0,1080);for(let x=0;x<=1920;x+=60)c.lineTo(x,790+Math.sin(x*.0035+1)*45);c.lineTo(1920,1080);c.fill();
  c.fillStyle=K(gnd);c.beginPath();c.moveTo(0,1080);for(let x=0;x<=1920;x+=60)c.lineTo(x,900+Math.sin(x*.004+3)*30-Math.exp(-Math.pow((x-1000)/420,2))*30);c.lineTo(1920,1080);c.fill();
  // branches
  const wsnow=N([0,0,0,1]);
  const sway=S.osc(12)*.0;
  c.lineCap='round';
  for(const s of st.segs){c.strokeStyle='#4a3326';c.lineWidth=s.w;c.beginPath();c.moveTo(s.x,s.y);c.lineTo(s.x2,s.y2);c.stroke()}
  if(wsnow>.01){c.strokeStyle=`rgba(255,255,255,${wsnow*.9})`;for(const s of st.segs){if(s.d<2)continue;c.lineWidth=Math.max(2,s.w*.45);c.beginPath();c.moveTo(s.x,s.y-s.w*.4);c.lineTo(s.x2,s.y2-s.w*.4);c.stroke()}}
  // leaves
  const dens=N([.65,1.05,.8,-.1]);
  const lc=[[255,170,200],[70,150,70],[235,120,40],[255,255,255]];
  for(const l of st.leaves){
    const v=S.clamp((dens-l.th)*5);if(v<=.01)continue;
    // colour per leaf: spring pink/white, summer greens, autumn mix of reds/golds
    const a0=[[255,175+l.h*50|0,200+l.h*40|0],[50+l.h*50|0,140+l.h*40|0,60],[200+l.h*55|0,70+l.h*130|0,30],[255,255,255]];
    const col=[a0[i0],a0[i1]].map(()=>0);const u=a0[i0].map((x,i)=>x+(a0[i1][i]-x)*f);
    c.globalAlpha=v;c.fillStyle=`rgb(${u[0]|0},${u[1]|0},${u[2]|0})`;
    const sx=l.x+S.osc(10,l.ph)*5,sy=l.y+S.osc(14,l.ph+.3)*3;
    c.save();c.translate(sx,sy);c.rotate(l.ang+S.osc(12,l.ph)*.3);c.scale(v*(i0===0&&f<1?1:1),v);c.beginPath();c.ellipse(0,0,l.r,l.r*.6,0,0,TAU);c.fill();c.restore();
  }
  c.globalAlpha=1;
  // falling petals / leaves / snow
  const w=[0,0,0,0];w[i0]+=1-f;w[i1]+=f;
  for(const fl of st.flakes){
    const y=S.wrap(fl.y,fl.sec,1080,30),x=fl.x+S.osc(fl.sec/2,fl.ph)*fl.sw;
    let a=0,col;
    if(w[0]>.01&&fl.ph<.6){a=w[0]*.9;col='rgb(255,190,215)'}
    else if(w[2]>.01&&fl.ph>=.4&&fl.ph<.85){a=w[2]*.9;col=fl.ph>.62?'rgb(230,110,40)':'rgb(250,180,60)'}
    else if(w[3]>.01){a=w[3]*.9;col='#fff'}
    if(i0===1&&f<.5||false)a*=1;
    if(a<=.01)continue;
    c.globalAlpha=a;c.fillStyle=col;c.save();c.translate(x,y);c.rotate(fl.rot+S.osc(fl.sec/1.5,fl.ph)*1.2);
    if(w[3]>.5&&col==='#fff'){c.beginPath();c.arc(0,0,fl.r*.7,0,TAU);c.fill()}else{c.beginPath();c.ellipse(0,0,fl.r*1.2,fl.r*.7,0,0,TAU);c.fill()}
    c.restore();
  }
  c.globalAlpha=1;
 }});

/* ---------- 3: Heart Constellation ---------- */
BIS.scene('g8-3',{title:'Heart Constellation',blurb:'Stars twinkle into a heart constellation beside a slowly turning spiral galaxy.',
 setup(S){const st=S.state;
  st.glow=glowSprite(64,'255,240,220',1);st.glowP=glowSprite(64,'255,150,190',1);
  st.stars=Array.from({length:260},()=>({x:S.R(0,1920),y:S.R(0,1080),r:S.R(.8,2.6),ph:S.rnd(),tw:S.R(4,12),hue:S.pick(['255,255,255','255,230,200','200,220,255'])}));
  // heart constellation points (parametric heart)
  const N=22;st.hp=[];
  for(let i=0;i<N;i++){const t=i/N*TAU,x=16*Math.pow(Math.sin(t),3),y=-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t));
    st.hp.push({x:700+x*17,y:430+y*17+ -10,ph:S.rnd(),r:S.R(3,6)})}

  // galaxy particles
  st.gal=[];const arms=3;
  for(let i=0;i<330;i++){const arm=i%arms,r=Math.pow(S.rnd(),.7)*300+10,a=arm/arms*TAU+r*.018+S.R(-.35,.35)*(1-r/360);
    st.gal.push({r,a,sz:S.R(1,3.2)*(1.3-r/450),ph:S.rnd(),col:r<110?'255,220,170':r<220?'210,200,255':'160,190,255'})}
  st.dust=null;
 },
 draw(S){const c=S.ctx,st=S.state;
  S.bg('#05061a','#0b1033','#1a1b4a');
  // faint nebula
  c.save();c.globalCompositeOperation='lighter';
  c.fillStyle=S.radial(500,300,800,'rgba(120,60,140,.18)','rgba(120,60,140,0)');c.fillRect(0,0,1920,1080);
  c.fillStyle=S.radial(1500,800,800,'rgba(60,90,170,.2)','rgba(60,90,170,0)');c.fillRect(0,0,1920,1080);
  c.restore();
  // stars
  c.fillStyle='#fff';
  for(const s of st.stars){const t=.35+.65*S.osc01(s.tw,s.ph);c.globalAlpha=t;c.fillStyle=`rgb(${s.hue})`;c.beginPath();c.arc(s.x,s.y,s.r*(.8+.4*t),0,TAU);c.fill()}
  // galaxy
  const gx=1400,gy=640,tilt=-.35;
  c.save();c.translate(gx,gy);c.rotate(tilt);
  c.globalCompositeOperation='lighter';
  c.save();c.scale(1,.42);c.fillStyle=S.radial(0,0,360,'rgba(255,225,180,.55)','rgba(255,200,160,0)');c.fillRect(-360,-360,720,720);c.restore();
  const rot=S.p*TAU;
  for(const p of st.gal){const a=p.a+rot,x=Math.cos(a)*p.r,y=Math.sin(a)*p.r*.42;c.globalAlpha=(.45+.45*S.osc01(9,p.ph))*(1-p.r/420);c.fillStyle=`rgb(${p.col})`;c.beginPath();c.arc(x,y,p.sz*1.3,0,TAU);c.fill()}
  c.restore();
  // constellation
  c.globalAlpha=1;
  const pulse=.55+.45*S.osc01(6),ln=.35+.25*S.osc01(20);
  c.strokeStyle=`rgba(255,190,215,${ln})`;c.lineWidth=2.2;c.lineJoin='round';c.beginPath();
  const n=st.hp.length-1;for(let i=0;i<=n;i++){const p=st.hp[i%n];i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y)}c.stroke();
  c.save();c.globalCompositeOperation='lighter';
  for(const p of st.hp){const t=.55+.45*S.osc01(5,p.ph),r=p.r*7*(.8+.4*t);c.globalAlpha=.35+.6*t;c.drawImage(st.glowP,p.x-r,p.y-r,r*2,r*2);const r2=p.r*3.2;c.globalAlpha=.9*t+.1;c.drawImage(st.glow,p.x-r2,p.y-r2,r2*2,r2*2)}
  c.restore();c.globalAlpha=1;
 }});
})();
