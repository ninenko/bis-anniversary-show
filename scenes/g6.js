/* Grade 6 — House of Memories (elegant, cinematic, sepia) */
(function(){
const TAU=Math.PI*2;
const sm=t=>t*t*(3-2*t);
function sprite(color,size=128){const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');
  const g=x.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);g.addColorStop(0,color);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,size,size);return c}
function vignette(S){const c=document.createElement('canvas');c.width=1920;c.height=1080;const x=c.getContext('2d');
  const g=x.createRadialGradient(960,540,300,960,540,1150);g.addColorStop(0,'rgba(10,5,0,0)');g.addColorStop(1,'rgba(10,5,0,.75)');x.fillStyle=g;x.fillRect(0,0,1920,1080);return c}

/* soft abstract sepia scene painted into an offscreen canvas */
function memory(S,kind,w,h){
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;const x=cv.getContext('2d');
  const sky=x.createLinearGradient(0,0,0,h);
  if(kind==='sunset'){sky.addColorStop(0,'#6b4426');sky.addColorStop(.6,'#d9a05a');sky.addColorStop(1,'#f3d49a');x.fillStyle=sky;x.fillRect(0,0,w,h);
    const sy=h*S.R(.5,.62);x.fillStyle=S.radial(w*S.R(.35,.65),sy,w*.5,'rgba(255,240,200,.95)','rgba(255,220,150,0)');x.fillRect(0,0,w,h);
    x.fillStyle='#fff3cf';x.beginPath();x.arc(w*.5,sy,w*.09,0,TAU);x.fill();
    for(let k=0;k<3;k++){x.fillStyle=['#7a5230','#52361f','#2e1d10'][k];x.beginPath();x.moveTo(0,h);let y=h*(.68+k*.1);x.lineTo(0,y);for(let i=0;i<=8;i++)x.lineTo(i/8*w,y+S.R(-18,18)-k*4);x.lineTo(w,h);x.fill()}}
  else if(kind==='sea'){sky.addColorStop(0,'#8a6a45');sky.addColorStop(1,'#efd9ae');x.fillStyle=sky;x.fillRect(0,0,w,h*.52);
    const sea=x.createLinearGradient(0,h*.52,0,h);sea.addColorStop(0,'#b88f58');sea.addColorStop(1,'#4a3220');x.fillStyle=sea;x.fillRect(0,h*.52,w,h*.48);
    x.fillStyle='#fff1cc';x.beginPath();x.arc(w*S.R(.3,.7),h*.4,w*.07,0,TAU);x.fill();
    x.strokeStyle='rgba(255,236,190,.5)';x.lineWidth=3;for(let i=0;i<14;i++){const y=h*.56+i*h*.03,l=S.R(30,w*.4),px=S.R(0,w-l);x.beginPath();x.moveTo(px,y);x.quadraticCurveTo(px+l/2,y-5,px+l,y);x.stroke()}
    x.fillStyle='rgba(255,230,170,.35)';x.fillRect(w*.42,h*.53,w*.12,h*.4)}
  else {sky.addColorStop(0,'#c9a46c');sky.addColorStop(1,'#f1deb2');x.fillStyle=sky;x.fillRect(0,0,w,h);
    x.fillStyle='rgba(255,245,215,.6)';x.beginPath();x.arc(w*.7,h*.28,w*.14,0,TAU);x.fill();
    const g=x.createLinearGradient(0,h*.7,0,h);g.addColorStop(0,'#6a4a2a');g.addColorStop(1,'#35220f');x.fillStyle=g;x.fillRect(0,h*.72,w,h*.28);
    for(let i=0;i<7;i++){const tx=S.R(.05,.95)*w,th=S.R(.3,.55)*h,tr=S.R(.1,.17)*w,ty=h*.75;
      x.fillStyle='#3a2512';x.fillRect(tx-4,ty-th*.45,8,th*.45);x.fillStyle=['#5a3d20','#7a5530','#46301a'][i%3];x.beginPath();x.arc(tx,ty-th*.55,tr,0,TAU);x.arc(tx-tr*.6,ty-th*.4,tr*.7,0,TAU);x.arc(tx+tr*.6,ty-th*.4,tr*.7,0,TAU);x.fill()}}
  // grain + vignette
  for(let i=0;i<w*h/60;i++){x.fillStyle=`rgba(${S.rnd()<.5?'255,240,200':'30,15,0'},${S.R(.03,.09)})`;x.fillRect(S.R(0,w),S.R(0,h),2,2)}
  const v=x.createRadialGradient(w/2,h/2,w*.25,w/2,h/2,w*.8);v.addColorStop(0,'rgba(40,20,0,0)');v.addColorStop(1,'rgba(40,20,0,.5)');x.fillStyle=v;x.fillRect(0,0,w,h);
  return cv}

/* ---------- 1: drifting instant photos ---------- */
BIS.scene('g6-1',{title:'Drifting Snapshots',blurb:'Instant-photo frames with soft sepia memories drift and turn slowly through warm light.',
setup(S){
  const st=S.state,kinds=['sunset','sea','trees'];
  st.imgs=[];for(let i=0;i<9;i++)st.imgs.push(memory(S,kinds[i%3],240,210));
  st.vig=vignette(S);st.glow=sprite('rgba(255,200,120,1)');
  st.fr=[];
  for(let i=0;i<15;i++){const z=S.R(.55,1.25);st.fr.push({img:st.imgs[i%9],z,x:(i+.5)/15*1920+S.R(-60,60),y:S.R(0,1500),sec:S.R(85,150)/z,sw:S.R(20,70),swsec:S.R(20,40),off:S.R(0,1),rot:S.R(-.35,.35),rsec:S.R(24,50),ramp:S.R(.12,.3)})}
  st.fr.sort((a,b)=>a.z-b.z);
  st.bok=[];for(let i=0;i<26;i++)st.bok.push({x:S.R(0,1920),y:S.R(0,1080),r:S.R(40,130),sec:S.R(12,28),off:S.R(0,1),a:S.R(.05,.14)});
},
draw(S){
  const c=S.ctx,st=S.state;
  S.bg('#1c0f08','#3a2212','#5a3a1c');
  c.globalCompositeOperation='lighter';
  for(const b of st.bok){c.globalAlpha=b.a*(.6+.8*S.osc01(b.sec,b.off));c.drawImage(st.glow,b.x-b.r,b.y-b.r,b.r*2,b.r*2)}
  c.globalAlpha=.3;c.drawImage(st.glow,360,60,1200,1000);c.globalAlpha=1;c.globalCompositeOperation='source-over';
  for(const f of st.fr){
    const y=S.wrap(f.y,f.sec,1080,320,-1),x=f.x+f.sw*S.osc(f.swsec,f.off),rot=f.rot+f.ramp*S.osc(f.rsec,f.off);
    const w=240*f.z,h=210*f.z,pad=14*f.z,bot=48*f.z;
    c.save();c.translate(x,y);c.rotate(rot);c.globalAlpha=.55+.45*(f.z-.55)/.7;
    c.fillStyle='rgba(0,0,0,.35)';c.fillRect(-w/2-pad+8,-h/2-pad+12,w+pad*2,h+pad+bot);
    c.fillStyle='#f4ead2';c.fillRect(-w/2-pad,-h/2-pad,w+pad*2,h+pad+bot);
    c.drawImage(f.img,-w/2,-h/2,w,h);
    c.fillStyle='rgba(255,230,170,.1)';c.fillRect(-w/2-pad,-h/2-pad,w+pad*2,h+pad+bot);
    c.restore();
  }
  c.globalAlpha=1;c.drawImage(st.vig,0,0);
}});

/* ---------- 2: scrolling film strips ---------- */
BIS.scene('g6-2',{title:'Old Film Reel',blurb:'Sepia film strips scroll past with gentle flicker, dust and warm light leaks.',
setup(S){
  const st=S.state,kinds=['sunset','sea','trees'];
  st.imgs=[];for(let i=0;i<6;i++)st.imgs.push(memory(S,kinds[i%3],300,220));
  st.vig=vignette(S);st.glow=sprite('rgba(255,150,60,1)');st.wh=sprite('rgba(255,225,170,1)');
  st.dust=[];for(let i=0;i<90;i++)st.dust.push({x:S.R(0,1920),y:S.R(0,1080),r:S.R(1,3.2),l:S.R(4,16),a:S.R(0,TAU),sec:S.R(3,9),off:S.R(0,1)});
  st.scr=[];for(let i=0;i<7;i++)st.scr.push({x:S.R(60,1860),sec:S.R(6,14),off:S.R(0,1),w:S.R(1,2)});
  st.leaks=[{x:200,y:200,r:700,sec:31,off:0},{x:1700,y:900,r:800,sec:47,off:.4},{x:1000,y:-100,r:600,sec:23,off:.7}];
},
draw(S){
  const c=S.ctx,st=S.state,W=S.W,H=S.H;
  S.bg('#150b05','#2c1a0c','#3a2410');
  const pitch=400,fw=300,fh=220,per=pitch*6;
  const strip=(cy,rot,dir,sec,z)=>{
    c.save();c.translate(W/2,cy);c.rotate(rot);c.scale(z,z);
    const off=S.saw(sec)*per*dir,band=fh+90;
    c.fillStyle='#120a04';c.fillRect(-1700,-band/2,3400,band);
    c.fillStyle='#2b1c0e';c.fillRect(-1700,-band/2,3400,6);c.fillRect(-1700,band/2-6,3400,6);
    const first=Math.floor((-1700-off)/pitch)-1;
    for(let k=first;k<first+3400/pitch+3;k++){
      const x=k*pitch+off,i=((k%6)+6)%6;
      c.drawImage(st.imgs[i],x-fw/2,-fh/2,fw,fh);
      c.fillStyle='rgba(255,210,140,.06)';c.fillRect(x-fw/2,-fh/2,fw,fh);
      c.fillStyle='#e8d4a0';
      for(let h=0;h<4;h++){const hx=x-pitch/2+(h+.5)*pitch/4;c.beginPath();c.roundRect(hx-12,-band/2+16,24,16,4);c.roundRect(hx-12,band/2-32,24,16,4);c.fill()}
    }
    c.restore()};
  strip(250,-.05,-1,42,1);
  strip(830,-.05,1,42,1.1);
  // light leaks
  c.globalCompositeOperation='lighter';
  for(const l of st.leaks){c.globalAlpha=.18+.2*S.osc01(l.sec,l.off);c.drawImage(st.glow,l.x-l.r+120*S.osc(l.sec,l.off),l.y-l.r,l.r*2,l.r*2)}
  c.globalAlpha=.1+.18*S.osc01(.8)*(.6+.4*S.osc01(1.7,.3));c.drawImage(st.wh,0,-200,1920,1500);
  c.globalCompositeOperation='source-over';
  // dust & scratches
  for(const d of st.dust){const a=Math.pow(S.osc01(d.sec,d.off),10);if(a<.03)continue;c.globalAlpha=a*.7;c.strokeStyle='#f5e2b8';c.lineWidth=d.r;c.beginPath();c.moveTo(d.x,d.y);c.lineTo(d.x+Math.cos(d.a)*d.l,d.y+Math.sin(d.a)*d.l);c.stroke()}
  for(const s of st.scr){const a=Math.pow(S.osc01(s.sec,s.off),14);if(a<.03)continue;c.globalAlpha=a*.4;c.fillStyle='#f5e2b8';c.fillRect(s.x,0,s.w,1080)}
  c.globalAlpha=1;
  // flicker (gentle, < 2 per second)
  const fl=.05*S.osc(.9)+.04*S.osc(1.6,.3);c.fillStyle=fl>0?`rgba(255,220,160,${fl})`:`rgba(0,0,0,${-fl*1.4})`;c.fillRect(0,0,W,H);
  c.drawImage(st.vig,0,0);
}});

/* ---------- 3: a house at dusk ---------- */
BIS.scene('g6-3',{title:'House at Dusk',blurb:'A house at dusk whose windows glow on and off one by one, with autumn leaves falling.',
setup(S){
  const st=S.state;
  st.glow=sprite('rgba(255,190,90,1)');st.moon=sprite('rgba(255,240,210,1)');
  st.stars=[];for(let i=0;i<90;i++)st.stars.push({x:S.R(0,1920),y:S.R(0,520),r:S.R(.8,2.2),sec:S.R(6,14),off:S.R(0,1)});
  // windows: {x,y,w,h}
  const hx=960,hy=840;
  st.win=[[-210,-250],[-100,-250],[60,-250],[170,-250],[-210,-110],[-100,-110],[60,-110],[170,-110]].map((p,i)=>({x:hx+p[0],y:hy+p[1],w:62,h:82,sec:42,off:i/8}));
  st.door={x:hx-30,y:hy-90,w:60,h:90};
  st.leaves=[];for(let i=0;i<55;i++)st.leaves.push({x:S.R(0,1920),y:S.R(0,1080),sec:S.R(26,50),sw:S.R(40,110),swsec:S.R(5,11),off:S.R(0,1),s:S.R(9,17),rs:S.R(3,8),c:S.pick(['#d98a32','#b4561f','#e3b04a','#8f3d1a','#c97a2a'])});
  const tree=(x,y,sz)=>{const p=new Path2D();p.rect(x-10*sz,y-210*sz,20*sz,210*sz);p.moveTo(x+170*sz,y-260*sz);
    [[0,-300,150],[-110,-250,110],[110,-250,110],[-60,-360,100],[60,-350,100]].forEach(([dx,dy,r])=>{p.moveTo(x+(dx+r)*sz,y+dy*sz);p.arc(x+dx*sz,y+dy*sz,r*sz,0,TAU)});return p};
  st.t1=tree(250,880,1);st.t2=tree(1690,900,1.15);st.t3=tree(70,900,.7);
  st.hillb=S.smooth([[-100,760],[400,720],[900,760],[1400,720],[2020,750],[2020,1100],[-100,1100]]);
  st.hillf=S.smooth([[-100,880],[500,850],[960,860],[1500,850],[2020,880],[2020,1100],[-100,1100]]);
  const hx2=960,hy2=840,p=new Path2D();p.rect(hx2-290,hy2-340,580,340);p.moveTo(hx2-340,hy2-340);p.lineTo(hx2,hy2-560);p.lineTo(hx2+340,hy2-340);p.closePath();p.rect(hx2+170,hy2-520,50,150);st.house=p;
},
draw(S){
  const c=S.ctx,st=S.state,W=S.W,H=S.H;
  const g=c.createLinearGradient(0,0,0,900);g.addColorStop(0,'#0e1230');g.addColorStop(.5,'#3a2f63');g.addColorStop(.8,'#a8587a');g.addColorStop(1,'#f0a368');c.fillStyle=g;c.fillRect(0,0,W,H);
  c.fillStyle='#fff';for(const s of st.stars){c.globalAlpha=(.15+.55*S.osc01(s.sec,s.off))*(1-s.y/700);c.beginPath();c.arc(s.x,s.y,s.r,0,TAU);c.fill()}
  c.globalAlpha=1;
  c.globalCompositeOperation='lighter';c.globalAlpha=.6;c.drawImage(st.moon,1380,40,300,300);c.globalAlpha=1;c.globalCompositeOperation='source-over';
  c.fillStyle='#f6ecd0';c.beginPath();c.arc(1530,190,48,0,TAU);c.fill();
  c.fillStyle='#4a3463';c.fill(st.hillb);
  c.fillStyle='#1a1226';c.fill(st.t3);c.fill(st.t1);c.fill(st.t2);
  c.fillStyle='#1b1428';c.fill(st.hillf);
  c.fillStyle='#120c1c';c.fill(st.house);
  // windows
  let lit=0;
  for(const w of st.win){
    const v=sm(S.clamp((S.osc(w.sec,w.off)+.35)*3));
    c.fillStyle='#2a1e38';c.fillRect(w.x,w.y,w.w,w.h);
    if(v>0){
      c.globalCompositeOperation='lighter';c.globalAlpha=.7*v;c.drawImage(st.glow,w.x+w.w/2-150,w.y+w.h/2-150,300,300);c.globalCompositeOperation='source-over';
      c.globalAlpha=v;c.fillStyle='#ffc766';c.fillRect(w.x,w.y,w.w,w.h);c.fillStyle='#fff0b8';c.fillRect(w.x+6,w.y+6,w.w-12,w.h-12);
      c.globalAlpha=1;
    }
    c.globalAlpha=1;c.fillStyle='#120c1c';c.fillRect(w.x+w.w/2-2,w.y,4,w.h);c.fillRect(w.x,w.y+w.h/2-2,w.w,4);
  }
  const dv=.7+.3*S.osc01(14);
  c.globalCompositeOperation='lighter';c.globalAlpha=.4*dv;c.drawImage(st.glow,st.door.x-80,st.door.y-60,220,220);c.globalCompositeOperation='source-over';
  c.globalAlpha=.9;c.fillStyle='#d98a32';c.fillRect(st.door.x,st.door.y,st.door.w,st.door.h);c.globalAlpha=1;
  // leaves
  for(const l of st.leaves){
    const y=S.wrap(l.y,l.sec,1080,40,1),x=l.x+l.sw*S.osc(l.swsec,l.off),r=TAU*S.saw(l.rs,l.off)+.6*S.osc(l.swsec,l.off+.25);
    c.save();c.translate(x,y);c.rotate(r);c.scale(1,.55+.45*Math.abs(Math.cos(r*1.3)));c.fillStyle=l.c;c.globalAlpha=.9;
    c.beginPath();c.moveTo(0,-l.s);c.quadraticCurveTo(l.s*.9,-l.s*.1,0,l.s);c.quadraticCurveTo(-l.s*.9,-l.s*.1,0,-l.s);c.fill();c.restore();
  }
  c.globalAlpha=1;
}});
})();
