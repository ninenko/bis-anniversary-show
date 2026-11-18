/* Grade 7B - The Sun Will Rise (90 s) */
(function(){
const TAU=Math.PI*2;
// pre-rendered soft glow sprite
function glowSprite(r,rgb,a0=1){const c=document.createElement('canvas');c.width=c.height=r*2;const x=c.getContext('2d');
  const g=x.createRadialGradient(r,r,0,r,r,r);g.addColorStop(0,`rgba(${rgb},${a0})`);g.addColorStop(.35,`rgba(${rgb},${a0*.35})`);g.addColorStop(1,`rgba(${rgb},0)`);
  x.fillStyle=g;x.fillRect(0,0,r*2,r*2);return c}
function cloudSprite(S,w,h,col){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');
  for(let i=0;i<9;i++){const cx=w*(.18+.64*S.rnd()),cy=h*(.5+.12*S.R(-1,1)),r=h*S.R(.22,.42);
    const g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,col+'.55)');g.addColorStop(1,col+'0)');x.fillStyle=g;x.fillRect(cx-r,cy-r,r*2,r*2)}
  return c}

/* ---------- 1: Horizon Sun ---------- */
BIS.scene('g7b-1',{title:'Horizon Sun',blurb:'A warm sun at the horizon with slowly turning rays, drifting clouds and soaring birds.',
 setup(S){const st=S.state;
  st.glow=glowSprite(600,'255,214,140',1);
  st.clouds=Array.from({length:7},(_,i)=>({s:cloudSprite(S,520,180,'rgba(255,236,214,'),x:S.R(0,1920),y:S.R(120,520),sec:S.R(70,130),sc:S.R(.8,1.5),a:S.R(.35,.7)}));
  st.rays=Array.from({length:18},(_,i)=>({a:i/18*TAU,w:S.R(.05,.09),l:S.R(1.0,1.5)}));
  st.birds=Array.from({length:9},()=>({x:S.R(0,1920),y:S.R(180,560),sec:S.R(40,80),sc:S.R(.6,1.1),ph:S.R(0,1),fl:S.R(1.1,1.6)}));
  // hills
  const hill=(base,amp,seed)=>{const p=new Path2D();p.moveTo(0,1080);for(let x=0;x<=1920;x+=40){p.lineTo(x,base+Math.sin(x*.0035+seed)*amp+Math.sin(x*.009+seed*2)*amp*.35)}p.lineTo(1920,1080);p.closePath();return p};
  st.hills=[hill(790,28,1),hill(850,35,3),hill(930,30,5)];
 },
 draw(S){const c=S.ctx,st=S.state;
  S.bg('#2b2a5e','#8a4a7e','#e9806a','#ffc27a','#ffe3a8');
  const sx=960,sy=760,br=S.osc01(12);
  c.save();c.globalAlpha=.8+.2*br;c.drawImage(st.glow,sx-600,sy-600);c.restore();
  // rays
  c.save();c.translate(sx,sy);c.rotate(S.osc(45)*.2);c.globalCompositeOperation='lighter';
  for(const r of st.rays){const a=r.a,L=1600*r.l,k=.5+.5*Math.sin(TAU*(S.cycles(15)*S.p)+r.a*3);
    const g=c.createLinearGradient(0,0,Math.cos(a)*L,Math.sin(a)*L);g.addColorStop(0,`rgba(255,220,150,${.13*(.55+.45*k)})`);g.addColorStop(1,'rgba(255,200,130,0)');
    c.fillStyle=g;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(a-r.w)*L,Math.sin(a-r.w)*L);c.lineTo(Math.cos(a+r.w)*L,Math.sin(a+r.w)*L);c.fill()}
  c.restore();
  // sun disc
  c.fillStyle=S.radial(sx,sy,140+8*br,'#fffbe6','#ffd37a');c.beginPath();c.arc(sx,sy,135+6*br,0,TAU);c.fill();
  // clouds
  for(const k of st.clouds){const x=S.wrap(k.x,k.sec,1920,300);c.globalAlpha=k.a;c.drawImage(k.s,x-260*k.sc,k.y+S.osc(25,k.x/1920)*8,520*k.sc,180*k.sc)}
  c.globalAlpha=1;
  // birds
  c.strokeStyle='rgba(60,30,60,.7)';c.lineCap='round';
  for(const b of st.birds){const x=S.wrap(b.x,b.sec,1920,80),y=b.y+S.osc(14,b.ph)*22,f=S.osc(b.fl*1.2+1,b.ph)*.5;
    c.lineWidth=3*b.sc;c.beginPath();const w=34*b.sc;c.moveTo(x-w,y-w*.45*(1+f));c.quadraticCurveTo(x-w*.5,y-w*.7*(1+f)-4,x,y);c.quadraticCurveTo(x+w*.5,y-w*.7*(1+f)-4,x+w,y-w*.45*(1+f));c.stroke()}
  // hills
  const cols=['#7a4a6e','#53345f','#2f2149'];
  st.hills.forEach((h,i)=>{c.fillStyle=cols[i];c.fill(h)});
  const g=c.createLinearGradient(0,900,0,1080);g.addColorStop(0,'rgba(20,12,40,0)');g.addColorStop(1,'rgba(20,12,40,.6)');c.fillStyle=g;c.fillRect(0,900,1920,180);
 }});

/* ---------- 2: Waking Meadow ---------- */
BIS.scene('g7b-2',{title:'Waking Meadow',blurb:'A meadow of flowers opening and closing in slow waves under morning light.',
 setup(S){const st=S.state;
  st.glow=glowSprite(500,'255,240,190',1);
  const pal=['#ff8fa3','#ffd166','#fff1c9','#ff9f68','#c8a2ff','#8fd3ff'];
  st.fl=[];
  for(let i=0;i<190;i++){const row=Math.pow(S.rnd(),.8),y=520+row*520,sc=.45+row*1.05;
    st.fl.push({x:S.R(-30,1950),y,sc,col:S.pick(pal),n:S.RI(5,8),h:S.R(60,150)*sc,lean:S.R(-.2,.2),ph:S.R(0,1)})}
  st.fl.sort((a,b)=>a.y-b.y);
  st.grass=Array.from({length:260},()=>({x:S.R(0,1920),y:S.R(640,1080),h:S.R(30,90),lean:S.R(-.3,.3),ph:S.rnd()}));
  st.motes=Array.from({length:60},()=>({x:S.R(0,1920),y:S.R(100,800),sec:S.R(60,120),r:S.R(1.5,4),ph:S.rnd()}));
 },
 draw(S){const c=S.ctx,st=S.state;
  S.bg('#a5dcf0','#d9f1e6','#fff3cf');
  c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.35;c.drawImage(st.glow,1300-500,180-500,1000,1000);c.restore();
  // light shafts
  c.save();c.globalCompositeOperation='lighter';
  for(let i=0;i<5;i++){const a=.9+i*.12+S.osc(30,i/5)*.03,x0=1300,y0=150,L=1500;const g=c.createLinearGradient(x0,y0,x0+Math.cos(a)*L,y0+Math.sin(a)*L);
    g.addColorStop(0,'rgba(255,245,200,.16)');g.addColorStop(1,'rgba(255,245,200,0)');c.fillStyle=g;c.beginPath();c.moveTo(x0,y0);c.lineTo(x0+Math.cos(a-.035)*L,y0+Math.sin(a-.035)*L);c.lineTo(x0+Math.cos(a+.035)*L,y0+Math.sin(a+.035)*L);c.fill()}
  c.restore();
  // far hills
  c.fillStyle='#b5e0b0';c.beginPath();c.moveTo(0,640);for(let x=0;x<=1920;x+=60)c.lineTo(x,560+Math.sin(x*.004)*40+Math.sin(x*.011)*14);c.lineTo(1920,1080);c.lineTo(0,1080);c.fill();
  const gg=c.createLinearGradient(0,560,0,1080);gg.addColorStop(0,'#8fd18c');gg.addColorStop(1,'#3f8f58');c.fillStyle=gg;c.beginPath();c.moveTo(0,640);for(let x=0;x<=1920;x+=60)c.lineTo(x,640+Math.sin(x*.003+2)*30);c.lineTo(1920,1080);c.lineTo(0,1080);c.fill();
  // grass blades
  c.strokeStyle='rgba(40,120,70,.55)';c.lineWidth=3;c.lineCap='round';
  for(const g of st.grass){const sw=S.osc(9,g.ph)*8;c.beginPath();c.moveTo(g.x,g.y);c.quadraticCurveTo(g.x+g.lean*g.h*.5+sw*.5,g.y-g.h*.6,g.x+g.lean*g.h+sw,g.y-g.h);c.stroke()}
  // flowers: open in a wave moving across
  for(const f of st.fl){
    const open=.5+.5*Math.sin(TAU*(S.cycles(18)*S.p-f.x/1920*1.2+f.y/1080*.4));
    const o=.15+.85*S.ease(open),sw=S.osc(11,f.ph)*.05;
    const tx=f.x+Math.sin(f.lean+sw)*f.h,ty=f.y-f.h;
    c.strokeStyle='#3c8a52';c.lineWidth=4*f.sc;c.beginPath();c.moveTo(f.x,f.y);c.quadraticCurveTo(f.x+f.lean*f.h*.6,f.y-f.h*.6,tx,ty);c.stroke();
    const pr=28*f.sc,pl=pr*(.55+.55*o),pw=pr*(.28+.22*o);
    c.save();c.translate(tx,ty);c.rotate(sw);c.scale(1,.55+.45*o);
    c.fillStyle=f.col;
    for(let i=0;i<f.n;i++){c.save();c.rotate(i/f.n*TAU+o*.4);c.beginPath();c.ellipse(0,-pl*.8,pw,pl,0,0,TAU);c.fill();c.restore()}
    c.fillStyle='#ffe28a';c.beginPath();c.arc(0,0,pr*.28,0,TAU);c.fill();c.restore();
  }
  // floating motes
  c.fillStyle='rgba(255,250,215,.8)';
  for(const m of st.motes){const x=S.wrap(m.x,m.sec,1920,40),y=m.y+S.osc(16,m.ph)*30;c.globalAlpha=.4+.4*S.osc01(8,m.ph);c.beginPath();c.arc(x,y,m.r,0,TAU);c.fill()}
  c.globalAlpha=1;
 }});

/* ---------- 3: Golden Light ---------- */
BIS.scene('g7b-3',{title:'Golden Light',blurb:'Abstract golden beams sweep slowly through a deep indigo space full of floating dust.',
 setup(S){const st=S.state;
  st.glow=glowSprite(300,'255,205,120',1);
  st.motes=Array.from({length:170},()=>({x:S.R(0,1920),y:S.R(0,1080),sec:S.R(50,140),r:S.R(1,4.5),ph:S.rnd(),dy:S.R(10,60),dir:S.rnd()<.5?-1:1,tw:S.R(5,12)}));
  st.beams=Array.from({length:7},(_,i)=>({ox:S.R(200,1700),a:S.R(-.5,.5),w:S.R(.05,.13),sec:S.R(40,90),ph:i/7,amp:S.R(.25,.5)}));
 },
 draw(S){const c=S.ctx,st=S.state;
  S.bg('#120c33','#2a1650','#55264f','#8c3c3a');
  c.save();c.globalCompositeOperation='lighter';
  // base glow from below
  c.fillStyle=S.radial(960,1180,900,'rgba(255,170,90,.35)','rgba(255,170,90,0)');c.fillRect(0,0,1920,1080);
  for(const b of st.beams){const a=Math.PI/2+b.a+S.osc(b.sec,b.ph)*b.amp,x0=b.ox+S.osc(b.sec*1.3,b.ph+.3)*200,y0=-120,L=1800;
    const g=c.createLinearGradient(x0,y0,x0+Math.cos(a)*L,y0+Math.sin(a)*L);const k=.6+.4*S.osc01(20,b.ph);
    g.addColorStop(0,`rgba(255,215,130,${.20*k})`);g.addColorStop(.6,`rgba(255,180,100,${.12*k})`);g.addColorStop(1,'rgba(255,160,90,0)');
    c.fillStyle=g;c.beginPath();c.moveTo(x0-20,y0);c.lineTo(x0+20,y0);c.lineTo(x0+Math.cos(a+b.w)*L,y0+Math.sin(a+b.w)*L);c.lineTo(x0+Math.cos(a-b.w)*L,y0+Math.sin(a-b.w)*L);c.fill()}
  // motes
  for(const m of st.motes){const x=S.wrap(m.x,m.sec,1920,40,m.dir),y=m.y+S.osc(m.sec/3,m.ph)*m.dy,tw=.35+.65*S.osc01(m.tw,m.ph);
    c.globalAlpha=tw;const r=m.r*8;c.drawImage(st.glow,x-r,y-r,r*2,r*2)}
  c.restore();
  c.globalAlpha=1;
  // soft vignette
  const v=c.createRadialGradient(960,540,500,960,540,1200);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(10,5,30,.5)');c.fillStyle=v;c.fillRect(0,0,1920,1080);
 }});
})();
