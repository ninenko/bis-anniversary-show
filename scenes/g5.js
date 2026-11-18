/* Grade 5 — Hold My Hand (connection, support, being there for one another) */
(function(){
const TAU=Math.PI*2,W=1920,H=1080;
function cv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return[c,c.getContext('2d')]}
function glowSprite(rgb,size=128,mid=.3,midA=.35){const[c,x]=cv(size,size);const g=x.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);
  g.addColorStop(0,`rgba(${rgb},1)`);g.addColorStop(mid,`rgba(${rgb},${midA})`);g.addColorStop(1,`rgba(${rgb},0)`);x.fillStyle=g;x.fillRect(0,0,size,size);return c}
function grain(S,x,w,h,amt){const d=x.getImageData(0,0,w,h),a=d.data;for(let i=0;i<a.length;i+=4){if(!a[i+3])continue;const n=(S.rnd()-.5)*amt;a[i]+=n;a[i+1]+=n;a[i+2]+=n}x.putImageData(d,0,0)}
// midpoint-displacement ridge noise
function md(S,lv,rough){let a=[S.R(-1,1),S.R(-1,1)],amp=1;for(let l=0;l<lv;l++){const b=[];for(let i=0;i<a.length-1;i++)b.push(a[i],(a[i]+a[i+1])/2+S.R(-amp,amp));b.push(a[a.length-1]);a=b;amp*=rough}return a}
function range(S,base,amp,lv=8,rough=.55){const n=md(S,lv,rough),N=n.length-1,pts=[];for(let i=0;i<=N;i++){const x=-20+i*(W+40)/N;pts.push([x,base(x)+n[i]*amp])}return pts}
function rangePath(pts,bottom=H+10){const p=new Path2D();p.moveTo(-20,bottom);for(const q of pts)p.lineTo(q[0],q[1]);p.lineTo(W+20,bottom);p.closePath();return p}
function vgrad(x,y0,y1,stops){const g=x.createLinearGradient(0,y0,0,y1);stops.forEach((s,i)=>g.addColorStop(i/(stops.length-1),s));return g}
// snow caps + faceted moonlight on a mountain silhouette (lit = slopes facing dir)
function snowStreaks(S,x,pts,path,line,col,colLit,dir){x.save();x.clip(path);
  const n=md(S,8,.6);
  for(let pass=0;pass<2;pass++){x.beginPath();x.moveTo(pts[0][0],pts[0][1]);for(const q of pts)x.lineTo(q[0],q[1]);
    for(let i=pts.length-1;i>=0;i--){const[px,py]=pts[i],d=Math.max(0,line(px)-py);x.lineTo(px,py+(d>0?Math.max(0,d*(pass?.35:.75)+n[i%n.length]*18):0))}
    x.closePath();x.fillStyle=pass?colLit:col;x.fill()}
  x.restore()}
// standing silhouette: feet at (x,y), height h, hands in world coords
function figPath(x,y,h,o){const p=new Path2D(),sw=h*.105,sh=y-h*.76;
  p.ellipse(x+(o.tilt||0),y-h*.875,h*.085,h*.09,0,0,TAU);
  if(o.pony){p.moveTo(x+o.pony*h*.1+h*.04,y-h*.86);p.ellipse(x+o.pony*h*.1,y-h*.86,h*.04,h*.055,o.pony*.5,0,TAU)}
  if(o.bun){p.moveTo(x+h*.04,y-h*.975);p.arc(x,y-h*.975,h*.04,0,TAU)}
  if(o.hat){p.moveTo(x-h*.095,y-h*.88);p.arc(x,y-h*.885,h*.095,Math.PI,0);p.closePath();p.moveTo(x+h*.035,y-h*.99);p.arc(x,y-h*.99,h*.035,0,TAU)}
  p.rect(x-h*.03,y-h*.8,h*.06,h*.06);
  p.roundRect(x-sw,sh,sw*2,h*.36,h*.045);
  if(o.dress){p.moveTo(x+sw*.95,y-h*.52);p.lineTo(x+sw*1.55,y-h*.27);p.quadraticCurveTo(x,y-h*.24,x-sw*1.55,y-h*.27);p.lineTo(x-sw*.95,y-h*.52);p.closePath()}
  if(o.coat){p.moveTo(x+sw*1.05,y-h*.6);p.lineTo(x+sw*1.3,y-h*.33);p.lineTo(x-sw*1.3,y-h*.33);p.lineTo(x-sw*1.05,y-h*.6);p.closePath()}
  p.roundRect(x-sw*.82,y-h*.45,h*.075,h*.45,h*.03);p.roundRect(x+sw*.82-h*.075,y-h*.45,h*.075,h*.45,h*.03);
  p.ellipse(x-sw*.6,y-h*.015,h*.055,h*.022,0,0,TAU);p.ellipse(x+sw*.6,y-h*.015,h*.055,h*.022,0,0,TAU);
  return p}
function figure(c,x,y,h,o,col,rim,rw){const sw=h*.105,sy=y-h*.73,aw=h*.068;
  const hl=o.l||[x-sw-h*.05,y-h*.38],hr=o.r||[x+sw+h*.05,y-h*.38];
  const body=figPath(x,y,h,o);
  const arms=()=>{c.beginPath();c.moveTo(x-sw*.75,sy);c.lineTo(hl[0],hl[1]);c.moveTo(x+sw*.75,sy);c.lineTo(hr[0],hr[1])};
  c.lineCap=c.lineJoin='round';
  if(rim){c.strokeStyle=rim;c.lineWidth=rw*2;c.stroke(body);arms();c.lineWidth=aw+rw*2;c.stroke()}
  c.fillStyle=col;c.fill(body);arms();c.strokeStyle=col;c.lineWidth=aw;c.stroke();
  c.beginPath();c.arc(hl[0],hl[1],aw*.65,0,TAU);c.arc(hr[0],hr[1],aw*.65,0,TAU);c.fill()}

/* ======================= 1: Hand in Hand — sunset ridge ======================= */
BIS.scene('g5-1',{title:'Hand in Hand',blurb:'A line of children holding hands on a hilltop, backlit by a big golden sunset over the mountains.',
setup(S){
  const st=S.state,SX=960,SY=585;st.SX=SX;st.SY=SY;
  // sky
  const[sky,k]=cv(W,H);
  k.fillStyle=vgrad(k,0,H,['#231d48','#4a2c62','#8a3f74','#d2647a','#f59a6c','#ffcb86','#ffdca0','#ffdca0']);k.fillRect(0,0,W,H);
  let g=k.createRadialGradient(SX,SY,0,SX,SY,1100);g.addColorStop(0,'rgba(255,226,170,.75)');g.addColorStop(.35,'rgba(255,170,120,.3)');g.addColorStop(1,'rgba(255,150,120,0)');k.fillStyle=g;k.fillRect(0,0,W,H);
  // faint early stars at top
  for(let i=0;i<120;i++){const y=S.R(0,260);k.fillStyle=`rgba(255,240,230,${S.R(.1,.5)*(1-y/260)})`;k.beginPath();k.arc(S.R(0,W),y,S.R(.6,1.6),0,TAU);k.fill()}
  grain(S,k,W,H,7);st.sky=sky;
  // ray wheels
  const rays=(n,wd)=>{const[c,x]=cv(1000,1000);x.translate(500,500);for(let i=0;i<n;i++){x.save();x.rotate(i/n*TAU);const gg=x.createLinearGradient(0,0,500,0);
    gg.addColorStop(0,'rgba(255,235,190,0)');gg.addColorStop(.18,'rgba(255,225,175,.55)');gg.addColorStop(1,'rgba(255,210,160,0)');x.fillStyle=gg;
    x.beginPath();x.moveTo(0,0);x.lineTo(500,-500*wd);x.lineTo(500,500*wd);x.closePath();x.fill();x.restore()}return c};
  st.rayA=rays(18,.05);st.rayB=rays(11,.035);
  st.sunGlow=glowSprite('255,205,140',256,.25,.45);
  st.mote=glowSprite('255,236,190',32,.25,.5);
  // clouds
  st.clouds=[];
  for(let i=0;i<6;i++){const cw=Math.round(S.R(520,880)),ch=170,[c,x]=cv(cw,ch);
    for(let b=0;b<26;b++){const u=S.R(.08,.92),e=1-Math.abs(u-.5)*1.7,bx=u*cw,by=ch*.6+S.R(-30,12)*e,r=S.R(26,70)*e+14;
      const gg=x.createRadialGradient(bx,by,0,bx,by,r);gg.addColorStop(0,'rgba(255,255,255,.9)');gg.addColorStop(.55,'rgba(255,255,255,.55)');gg.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gg;x.fillRect(bx-r,by-r,2*r,2*r)}
    x.globalCompositeOperation='source-atop';x.fillStyle=vgrad(x,20,ch-20,['#8a5f98','#d98a9a','#ffd0a0']);x.fillRect(0,0,cw,ch);
    const y=[150,230,320,190,390,280][i];st.clouds.push({img:c,w:cw,h:ch,x:S.R(0,W),y,sec:[224,112,224,149,112,224][i],a:S.R(.55,.85)*(.7+.3*y/390)})}
  // mountains + ridge (static)
  const[mt,m]=cv(W,H);
  const lay=[{b:x=>590-300*Math.pow(Math.abs(x-SX)/960,1.25),a:42,c:['#dc8a88','#f2ad8a'],haze:'255,205,165'},
             {b:x=>650-230*Math.pow(Math.abs(x-SX)/960,1.1)+40*Math.sin(x*.004),a:36,c:['#ad5a7c','#d4807e'],haze:'250,175,150'},
             {b:x=>700-150*Math.pow(Math.abs(x-SX)/960,1)+30*Math.sin(x*.006+2),a:24,c:['#713664','#94496e'],haze:'225,140,140'}];
  for(const L of lay){const pts=range(S,L.b,L.a,8,.55);let mn=H;pts.forEach(p=>mn=Math.min(mn,p[1]));
    m.fillStyle=vgrad(m,mn,760,L.c);m.fill(rangePath(pts));
    const y0=L.b(SX);m.fillStyle=vgrad(m,y0-80,y0+60,[`rgba(${L.haze},0)`,`rgba(${L.haze},.45)`]);m.fillRect(0,y0-80,W,140)}
  const crest=x=>675+.00027*(x-SX)*(x-SX)+6*Math.sin(x*.011)+3*Math.sin(x*.033+1);st.crest=crest;
  const rp=new Path2D();rp.moveTo(-20,H+10);for(let x=-20;x<=W+20;x+=8)rp.lineTo(x,crest(x));rp.lineTo(W+20,H+10);rp.closePath();
  m.fillStyle=vgrad(m,660,H,['#4c2149','#341938','#1f0f26']);m.fill(rp);
  // crest tufts
  m.strokeStyle='#4c2149';m.lineCap='round';for(let x=0;x<W;x+=3){const y=crest(x)+2,l=S.R(3,13),a=S.R(-.5,.5);m.lineWidth=S.R(1.2,2.4);m.beginPath();m.moveTo(x,y);m.lineTo(x+Math.sin(a)*l,y-Math.cos(a)*l);m.stroke()}
  g=m.createRadialGradient(SX,SY,0,SX,SY,1000);g.addColorStop(0,'rgba(255,225,165,.95)');g.addColorStop(.45,'rgba(255,170,120,.45)');g.addColorStop(1,'rgba(255,150,120,0)');
  m.strokeStyle=g;m.lineWidth=3;m.beginPath();for(let x=-20;x<=W+20;x+=8)x<-19?m.moveTo(x,crest(x)):m.lineTo(x,crest(x));m.stroke();
  // soft glow on the hill under the sun
  g=m.createRadialGradient(SX,700,0,SX,700,520);g.addColorStop(0,'rgba(255,170,120,.18)');g.addColorStop(1,'rgba(255,170,120,0)');m.save();m.clip(rp);m.fillStyle=g;m.fillRect(0,600,W,480);m.restore();
  grain(S,m,W,H,6);st.mt=mt;
  // foreground shoulders
  const[fg,f]=cv(W,H);const yL=x=>790+Math.pow(Math.max(0,x)/720,2)*300;st.yL=yL;
  const sp=new Path2D();sp.moveTo(-20,H+10);for(let x=-20;x<=740;x+=10)sp.lineTo(x,yL(x));sp.lineTo(740,H+10);sp.closePath();
  const sp2=new Path2D();sp2.moveTo(W+20,H+10);for(let x=-20;x<=740;x+=10)sp2.lineTo(W-x,yL(x));sp2.lineTo(W-740,H+10);sp2.closePath();
  f.fillStyle=vgrad(f,780,H,['#21102a','#130818']);f.fill(sp);f.fill(sp2);
  f.fillStyle=vgrad(f,860,H,['rgba(19,8,24,0)','rgba(19,8,24,.7)']);f.fillRect(0,860,W,220);
  st.fg=fg;
  // grass & flowers on shoulders
  st.grass=[];for(let i=0;i<160;i++){const side=i%2,u=Math.pow(S.rnd(),1.3)*640,x=side?W-u:u,y=yL(u)+4;
    st.grass.push({x,y,h:S.R(30,120)*(1-u/900),lean:S.R(-.25,.25)*(side?-1:1),amp:S.R(6,14),off:S.R(0,1)})}
  st.flowers=[];for(let i=0;i<14;i++){const side=i%2,u=S.R(20,520),x=side?W-u:u;st.flowers.push({x,y:yL(u)+4,h:S.R(90,170)*(1-u/1000),r:S.R(6,11),daisy:S.rnd()<.5,off:S.R(0,1)})}
  // birds
  st.birds=[];for(let i=0;i<7;i++)st.birds.push({dx:i*42+S.R(-10,10),dy:Math.abs(i-3)*18+S.R(-6,6),s:S.R(9,13),off:S.R(0,1)});
  // motes
  st.motes=[];for(let i=0;i<70;i++)st.motes.push({x:S.R(150,1770),y:S.R(0,1),ax:S.R(10,40),sec:S.R(70,160),sw:S.R(14,30),off:S.R(0,1),s:S.R(6,16)});
  // children
  const hs=[160,182,150,190,170,156,186,152,176],looks=[{pony:-1,dress:1},{},{bun:1,dress:1},{},{pony:1},{dress:1,bun:1},{},{pony:-1,dress:1},{}];
  st.kids=hs.map((h,i)=>{const x=520+i*110+S.R(-6,6);return{x,y:crest(x)+3,h,o:looks[i]}});
},
draw(S){const c=S.ctx,st=S.state,SX=st.SX,SY=st.SY;
  c.drawImage(st.sky,0,0);
  c.globalCompositeOperation='lighter';
  S.at(SX,SY,S.p*TAU/18,1,()=>{c.globalAlpha=.11+.05*S.osc01(28);c.drawImage(st.rayA,-1300,-1300,2600,2600)});
  S.at(SX,SY,-S.p*TAU/11,1,()=>{c.globalAlpha=.08+.05*S.osc01(37,.3);c.drawImage(st.rayB,-1100,-1100,2200,2200)});
  c.globalAlpha=.55+.12*S.osc01(32);c.drawImage(st.sunGlow,SX-760,SY-760,1520,1520);
  c.globalAlpha=1;c.globalCompositeOperation='source-over';
  c.fillStyle=S.radial(SX,SY,165,'#fff8e0','#ffc47e');c.beginPath();c.arc(SX,SY,150,0,TAU);c.fill();
  for(const cl of st.clouds){c.globalAlpha=cl.a;c.drawImage(cl.img,S.wrap(cl.x,cl.sec,W,cl.w)-cl.w/2,cl.y-cl.h/2)}
  c.globalAlpha=1;
  // birds
  const fx=S.wrap(1500,74.7,W,360,-1),fy=250+30*S.osc(56);
  c.strokeStyle='#3d1f45';c.lineWidth=2.6;c.lineCap='round';
  for(const b of st.birds){const x=fx+b.dx,y=fy+b.dy+5*S.osc(9,b.off),f=S.osc(1.2,b.off),s=b.s;
    c.beginPath();c.moveTo(x-s,y-f*s*.6);c.quadraticCurveTo(x-s*.4,y-s*.35-f*s*.2,x,y);c.quadraticCurveTo(x+s*.4,y-s*.35-f*s*.2,x+s,y-f*s*.6);c.stroke()}
  c.drawImage(st.mt,0,0);
  // children, joined hands rising in a slow wave along the line
  const K=st.kids,hands=[];
  for(let i=0;i<K.length-1;i++){const a=K[i],b=K[i+1],hh=(a.h+b.h)/2,sy=(a.y-a.h*.73+b.y-b.h*.73)/2,wv=S.ease(S.pulse(32,-i*.035,3));
    hands.push([(a.x+b.x)/2,sy+S.lerp(hh*.36,-hh*.32,wv)])}
  for(let i=0;i<K.length;i++){const k=K[i],o=Object.assign({},k.o),sy=k.y-k.h*.73;
    const we=S.ease(S.pulse(32,-(i===0?0:K.length-2)*.035,3));
    o.l=i>0?hands[i-1]:[k.x-k.h*.2,sy+S.lerp(k.h*.36,-k.h*.4,we)];
    o.r=i<K.length-1?hands[i]:[k.x+k.h*.2,sy+S.lerp(k.h*.36,-k.h*.4,we)];
    const ra=S.clamp(.95-Math.abs(k.x-SX)/520,.3,.95);
    figure(c,k.x,k.y,k.h,o,'#1e0c24',`rgba(255,210,150,${ra})`,1.6)}
  // motes
  c.globalCompositeOperation='lighter';
  for(const m of st.motes){const y=300+S.frac(m.y-S.saw(m.sec))*620,x=m.x+m.ax*S.osc(m.sw,m.off),a=Math.sin(Math.PI*(y-300)/620)*(.35+.4*S.osc01(7,m.off));
    c.globalAlpha=a;c.drawImage(st.mote,x-m.s/2,y-m.s/2,m.s,m.s)}
  c.globalAlpha=1;c.globalCompositeOperation='source-over';
  c.drawImage(st.fg,0,0);
  c.strokeStyle='#1c0d23';c.lineWidth=3;c.lineCap='round';c.beginPath();
  for(const gr of st.grass){const s=gr.lean*gr.h+gr.amp*S.osc(9,gr.off*.3+gr.x*.0004);c.moveTo(gr.x,gr.y);c.quadraticCurveTo(gr.x+s*.2,gr.y-gr.h*.6,gr.x+s,gr.y-gr.h)}
  c.stroke();
  c.fillStyle='#1c0d23';c.lineWidth=2.2;
  for(const fl of st.flowers){const s=10*S.osc(9,fl.off*.3+fl.x*.0004),tx=fl.x+s,ty=fl.y-fl.h;
    c.beginPath();c.moveTo(fl.x,fl.y);c.quadraticCurveTo(fl.x+s*.2,fl.y-fl.h*.6,tx,ty);c.stroke();
    c.beginPath();if(fl.daisy){for(let j=0;j<8;j++){const a=j/8*TAU;c.moveTo(tx,ty);c.ellipse(tx+Math.cos(a)*fl.r*.8,ty+Math.sin(a)*fl.r*.8,fl.r*.55,fl.r*.22,a,0,TAU)}}
    else c.ellipse(tx,ty,fl.r*.6,fl.r,0,0,TAU);c.fill()}
}});

/* ======================= 2: Lighthouse — twilight harbour ======================= */
BIS.scene('g5-2',{title:'Lighthouse',blurb:'A lighthouse on a rocky point sweeps its warm beam over a calm twilight sea, guiding small boats home to a lit harbour.',
setup(S){
  const st=S.state,HZ=610,LX=1590,LY=300;st.HZ=HZ;st.LX=LX;st.LY=LY;
  const[bg,k]=cv(W,H);
  k.fillStyle=vgrad(k,0,HZ,['#141f45','#26346a','#4b5088','#8a6f9c','#d29a9e','#f3bf9c']);k.fillRect(0,0,W,HZ);
  for(let i=0;i<220;i++){const y=Math.pow(S.rnd(),1.6)*300;k.fillStyle=`rgba(230,235,255,${S.R(.15,.6)*(1-y/300)})`;k.beginPath();k.arc(S.R(0,W),y,S.R(.5,1.4),0,TAU);k.fill()}
  // streaky twilight clouds
  for(let i=0;i<40;i++){const y=S.R(170,470),x=S.R(-100,W),w=S.R(160,520),h=S.R(8,22),t=(y-170)/300;
    const g=k.createRadialGradient(0,0,0,0,0,1);g.addColorStop(0,t>.5?'rgba(255,190,170,.45)':'rgba(200,160,210,.35)');g.addColorStop(1,'rgba(200,160,210,0)');
    k.save();k.translate(x,y);k.scale(w,h);k.fillStyle=g;k.beginPath();k.arc(0,0,1,0,TAU);k.fill();k.restore()}
  // distant headlands on the horizon
  const hd=range(S,x=>HZ-6-50*Math.exp(-Math.pow((x-820)/260,2))-30*Math.exp(-Math.pow((x-1180)/150,2)),10,7,.5);
  k.fillStyle='rgba(120,95,140,.75)';k.fill(rangePath(hd,HZ+2));
  // sea
  k.fillStyle=vgrad(k,HZ,H,['#c8939a','#6a6a98','#34446f','#1c2a4e','#101a36']);k.fillRect(0,HZ,W,H-HZ);
  k.lineCap='round';
  for(let i=0;i<1100;i++){const d=Math.pow(S.rnd(),1.4),y=HZ+3+d*(H-HZ),l=S.R(12,70)*(1+d*5),x=S.R(-60,W),warm=y<HZ+90;
    k.strokeStyle=S.rnd()<.55?(warm?`rgba(255,210,190,${S.R(.08,.22)})`:`rgba(170,185,235,${S.R(.04,.12)})`):`rgba(5,8,25,${S.R(.08,.2)})`;k.lineWidth=1+d*2.5;k.beginPath();k.moveTo(x,y);k.lineTo(x+l,y);k.stroke()}
  // harbour hill with houses (left)
  const hill=x=>470+Math.pow(Math.max(0,x)/760,1.6)*190+8*Math.sin(x*.02);
  const hp=new Path2D();hp.moveTo(-20,H);hp.lineTo(-20,hill(0));for(let x=0;x<=780;x+=10)hp.lineTo(x,hill(x));hp.lineTo(780,HZ+60);hp.lineTo(-20,HZ+60);hp.closePath();
  k.fillStyle=vgrad(k,450,HZ+60,['#3a2f5a','#2a2546']);k.fill(hp);
  st.wins=[];
  const houses=[];for(let r=0;r<4;r++)for(let x=-10+r*25;x<720-r*60;x+=S.R(48,74))houses.push({x,r,w:S.R(42,66),h:S.R(32,56)});
  houses.sort((a,b)=>a.r-b.r);
  for(const hs of houses){const by=hill(hs.x+hs.w/2)+8+hs.r*34;if(by>HZ+40)continue;const tone=S.pick(['#4b3f6c','#55456f','#3f3a62','#5b4a6a']);
    k.fillStyle=tone;k.fillRect(hs.x,by-hs.h,hs.w,hs.h);
    k.fillStyle=vgrad(k,by-hs.h-hs.w*.45,by-hs.h,['#2a2240','#3a2c4c']);k.beginPath();k.moveTo(hs.x-4,by-hs.h);k.lineTo(hs.x+hs.w/2,by-hs.h-hs.w*.42);k.lineTo(hs.x+hs.w+4,by-hs.h);k.fill();
    k.fillStyle='rgba(255,190,160,.35)';k.fillRect(hs.x,by-hs.h,2,hs.h);
    const nw=hs.w>55?2:1;for(let j=0;j<nw;j++){if(S.rnd()<.25)continue;const wx=hs.x+hs.w*(j+.5)/nw-6,wy=by-hs.h*.65;k.fillStyle='#ffc777';k.fillRect(wx,wy,12,13);st.wins.push([wx+6,wy+6,S.R(0,1)])}}
  // quay + breakwater
  k.fillStyle='#211d3a';k.beginPath();k.moveTo(-20,HZ+44);k.lineTo(560,HZ+40);k.quadraticCurveTo(760,HZ+44,900,HZ+62);k.lineTo(900,HZ+74);k.quadraticCurveTo(740,HZ+60,560,HZ+58);k.lineTo(-20,HZ+64);k.fill();
  k.fillStyle='#e8e0ea';k.fillRect(892,HZ+34,10,30);k.fillStyle='#211d3a';k.fillRect(890,HZ+30,14,6);st.qlight=[897,HZ+30];
  // moored boats along the quay
  for(let i=0;i<5;i++){const x=120+i*95+S.R(-15,15),y=HZ+70;k.fillStyle='#1a1630';k.beginPath();k.moveTo(x-30,y-10);k.lineTo(x+30,y-10);k.quadraticCurveTo(x+24,y+4,x,y+5);k.quadraticCurveTo(x-24,y+4,x-30,y-10);k.fill();
    k.strokeStyle='#1a1630';k.lineWidth=2;k.beginPath();k.moveTo(x,y-10);k.lineTo(x+S.R(-3,3),y-75);k.stroke()}
  grain(S,k,W,H,6);st.bg=bg;
  // headland + lighthouse (right), rocks bottom-left
  const[fg,f]=cv(W,H);
  const head=[[1180,H+10],[1210,800],[1290,740],[1380,700],[1440,668],[1520,652],[1700,648],[1820,630],[1940,620],[1940,H+10]];
  const n=md(S,7,.6);const rp=new Path2D();head.forEach((p,i)=>i?rp.lineTo(p[0],p[1]+(i>0&&i<head.length-1?n[i*12%n.length]*10:0)):rp.moveTo(p[0],p[1]));rp.closePath();
  let g=f.createLinearGradient(1180,0,1940,0);g.addColorStop(0,'#3a2f52');g.addColorStop(.4,'#241d3a');g.addColorStop(1,'#15112a');f.fillStyle=g;f.fill(rp);
  f.save();f.clip(rp);
  for(let i=0;i<26;i++){const x=S.R(1220,1900),y=S.R(690,1060),w=S.R(80,260);f.fillStyle='rgba(8,6,22,.32)';f.beginPath();f.moveTo(x,y);f.lineTo(x+w,y+S.R(-12,12));f.lineTo(x+w-S.R(10,40),y+S.R(18,40));f.lineTo(x+S.R(-20,10),y+S.R(16,34));f.closePath();f.fill();f.strokeStyle='rgba(255,200,180,.16)';f.lineWidth=2;f.beginPath();f.moveTo(x,y);f.lineTo(x+w,y);f.stroke()}f.restore();
  f.strokeStyle='rgba(255,215,195,.45)';f.lineWidth=2;f.stroke(rp);
  // keeper's cottage
  f.fillStyle='#d8ccd8';f.fillRect(1440,592,110,62);f.fillStyle='#8a8aa8';f.fillRect(1500,592,50,62);
  f.fillStyle='#5a2c3c';f.beginPath();f.moveTo(1432,594);f.lineTo(1495,556);f.lineTo(1558,594);f.fill();
  f.fillStyle='#ffc777';f.fillRect(1458,612,16,18);f.fillRect(1516,612,16,18);st.cot=[[1466,621],[1524,621]];
  // tower
  const tb=650,tt=LY+42,tw=(y)=>48-(tb-y)/(tb-tt)*15;
  const tp=new Path2D();tp.moveTo(LX-tw(tb),tb);tp.lineTo(LX-tw(tt),tt);tp.lineTo(LX+tw(tt),tt);tp.lineTo(LX+tw(tb),tb);tp.closePath();
  g=f.createLinearGradient(LX-48,0,LX+48,0);g.addColorStop(0,'#fff2ea');g.addColorStop(.45,'#e6dbe6');g.addColorStop(1,'#8f8aac');f.fillStyle=g;f.fill(tp);
  f.save();f.clip(tp);for(let i=0;i<3;i++){const y0=tt+40+i*95;g=f.createLinearGradient(LX-48,0,LX+48,0);g.addColorStop(0,'#e8605a');g.addColorStop(.45,'#c8444a');g.addColorStop(1,'#6e2840');f.fillStyle=g;f.fillRect(LX-60,y0,120,46)}f.restore();
  f.fillStyle='#2a2440';f.fillRect(LX-46,tt-6,92,10);f.strokeStyle='#2a2440';f.lineWidth=2;for(let x=-44;x<=44;x+=11){f.beginPath();f.moveTo(LX+x,tt-6);f.lineTo(LX+x,tt-22);f.stroke()}f.fillRect(LX-46,tt-24,92,3);
  f.fillStyle='#ffe2a8';f.fillRect(LX-24,LY-14,48,46);f.strokeStyle='#2a2440';f.lineWidth=3;f.strokeRect(LX-24,LY-14,48,46);f.beginPath();f.moveTo(LX,LY-14);f.lineTo(LX,LY+32);f.stroke();
  f.fillStyle='#6e2840';f.beginPath();f.moveTo(LX-30,LY-14);f.quadraticCurveTo(LX,LY-52,LX+30,LY-14);f.fill();f.fillRect(LX-2,LY-58,4,12);
  f.fillStyle='#2a2440';f.fillRect(LX-12,tb-30,24,30);
  // bottom-left rocks
  const bl=new Path2D();bl.moveTo(-20,H+10);bl.lineTo(-20,900);bl.quadraticCurveTo(120,880,220,950);bl.quadraticCurveTo(330,990,420,1090);bl.closePath();f.fillStyle='#15112a';f.fill(bl);f.strokeStyle='rgba(255,200,180,.25)';f.stroke(bl);
  grain(S,f,W,H,5);st.fg=fg;
  // beam sprite
  const[bm,b]=cv(1600,400);for(let j=0;j<6;j++){const s=1-j*.15;g=b.createLinearGradient(0,0,1600,0);g.addColorStop(0,`rgba(255,228,170,${.22})`);g.addColorStop(.5,'rgba(255,220,160,.08)');g.addColorStop(1,'rgba(255,220,160,0)');
    b.fillStyle=g;b.beginPath();b.moveTo(0,200-8*s);b.lineTo(1600,200-190*s);b.lineTo(1600,200+190*s);b.lineTo(0,200+8*s);b.closePath();b.fill()}st.beam=bm;
  st.warm=glowSprite('255,200,120',128,.25,.45);st.wh=glowSprite('255,235,210',32,.3,.5);
  st.boats=[{d:.15,x:300,sec:224},{d:.45,x:1100,sec:224},{d:.75,x:700,sec:112},{d:.3,x:1700,sec:149}].map(o=>Object.assign(o,{off:S.R(0,1),s:40+o.d*90}));
  st.boats.sort((a,b)=>a.d-b.d);
  st.gulls=[];for(let i=0;i<5;i++)st.gulls.push({x:S.R(0,W),y:S.R(150,380),s:S.R(18,30),sec:S.pick([75,112]),dir:i%2?1:-1,off:S.R(0,1)});
  st.glit=[];for(let i=0;i<80;i++){const d=Math.pow(S.rnd(),1.3);st.glit.push({x:S.R(0,W),y:HZ+6+d*(H-HZ-10),w:5+d*30,sec:S.R(3,8),off:S.R(0,1),warm:d<.25})}
},
draw(S){const c=S.ctx,st=S.state,HZ=st.HZ,LX=st.LX,LY=st.LY;
  c.drawImage(st.bg,0,0);
  c.globalCompositeOperation='lighter';
  for(const g of st.glit){c.globalAlpha=.5*S.pulse(g.sec,g.off,3);c.drawImage(g.warm?st.warm:st.wh,g.x-g.w/2,g.y-2,g.w,4)}
  for(const[x,y,o]of st.wins){c.globalAlpha=.35+.1*S.osc(9,o);c.drawImage(st.warm,x-22,y-22,44,44);c.globalAlpha=.18;c.drawImage(st.warm,x-4,HZ+66,8,40)}
  const q=S.pulse(8,0,2);c.globalAlpha=.4+.5*q;c.drawImage(st.warm,st.qlight[0]-30,st.qlight[1]-30,60,60);c.globalAlpha=.2+.2*q;c.drawImage(st.warm,st.qlight[0]-6,HZ+76,12,70);
  // sweeping beams (two, opposite)
  const a=TAU*S.saw(20);let flash=0;
  for(let j=0;j<2;j++){const an=a+j*Math.PI,cx=Math.cos(an),sz=Math.sin(an);flash=Math.max(flash,Math.pow(Math.max(0,sz),8));
    c.globalAlpha=.55+.45*Math.max(0,sz);S.at(LX,LY+8,cx<0?-.035:.035,[cx*1.15,1+.25*Math.max(0,sz)],()=>c.drawImage(st.beam,0,-200));
    if(cx<-.2){c.globalAlpha=.28*(-cx);c.drawImage(st.warm,LX+cx*900-260,HZ+50-40,520,110)}}
  c.globalAlpha=.55+.45*flash;c.drawImage(st.warm,LX-150-150*flash,LY+8-150-150*flash,300+300*flash,300+300*flash);
  c.globalAlpha=.25+.2*flash;c.drawImage(st.warm,LX-40,HZ+20,80,360);
  c.globalAlpha=1;c.globalCompositeOperation='source-over';
  // gulls
  for(const g of st.gulls){const x=S.wrap(g.x,g.sec,W,80,g.dir),y=g.y+30*S.osc(g.sec/3,g.off),f=S.osc(2.4,g.off),s=g.s;
    c.fillStyle='#f1eef6';c.beginPath();c.moveTo(x-s,y-f*s*.45);c.quadraticCurveTo(x-s*.45,y-s*.3-f*s*.15,x-s*.12,y);c.quadraticCurveTo(x,y+s*.12,x+s*.12,y);c.quadraticCurveTo(x+s*.45,y-s*.3-f*s*.15,x+s,y-f*s*.45);c.quadraticCurveTo(x+s*.45,y-s*.18-f*s*.1,x,y-s*.04);c.quadraticCurveTo(x-s*.45,y-s*.18-f*s*.1,x-s,y-f*s*.45);c.fill();
    c.fillStyle='#3a3a58';c.beginPath();c.arc(x-s*.98,y-f*s*.45,s*.06,0,TAU);c.arc(x+s*.98,y-f*s*.45,s*.06,0,TAU);c.fill()}
  // boats sailing home (right to left)
  for(const b of st.boats){const s=b.s,x=S.wrap(b.x,b.sec,W,s*2,-1),y=HZ+30+b.d*230+3*S.osc(4,b.off),r=.03*S.osc(5,b.off);
    c.globalCompositeOperation='lighter';c.globalAlpha=.35;c.drawImage(st.warm,x-s*.2,y+s*.1,s*.4,s*1.4);c.globalAlpha=1;c.globalCompositeOperation='source-over';
    S.at(x,y,r,1,()=>{c.fillStyle='rgba(10,10,30,.35)';c.beginPath();c.ellipse(0,s*.2,s*.9,s*.08,0,0,TAU);c.fill();
      c.fillStyle='#1d1834';c.beginPath();c.moveTo(-s*.8,-s*.22);c.lineTo(s*.85,-s*.22);c.quadraticCurveTo(s*.7,s*.12,s*.3,s*.14);c.lineTo(-s*.5,s*.14);c.quadraticCurveTo(-s*.75,s*.05,-s*.8,-s*.22);c.fill();
      c.fillStyle='#c8444a';c.fillRect(-s*.8,-s*.24,s*1.65,s*.05);
      c.fillStyle='#2a2440';c.fillRect(s*.1,-s*.5,s*.36,s*.28);c.fillStyle='#ffc777';c.fillRect(s*.18,-s*.44,s*.1,s*.1);c.fillRect(s*.32,-s*.44,s*.1,s*.1);
      c.strokeStyle='#1d1834';c.lineWidth=Math.max(1.5,s*.04);c.beginPath();c.moveTo(-s*.1,-s*.22);c.lineTo(-s*.1,-s*1.5);c.stroke();
      const sg=c.createLinearGradient(-s*.8,0,0,0);sg.addColorStop(0,'#f7e1dc');sg.addColorStop(1,'#b7a8c8');c.fillStyle=sg;
      c.beginPath();c.moveTo(-s*.14,-s*1.45);c.quadraticCurveTo(-s*.55,-s*.8,-s*.72,-s*.3);c.lineTo(-s*.14,-s*.3);c.closePath();c.fill()});
    c.globalCompositeOperation='lighter';c.globalAlpha=.8;c.drawImage(st.warm,x-s*.1-14,y-s*1.5-14,28,28);c.globalAlpha=1;c.globalCompositeOperation='source-over'}
  c.drawImage(st.fg,0,0);
  c.globalCompositeOperation='lighter';
  for(const[x,y]of st.cot){c.globalAlpha=.45+.08*S.osc(7);c.drawImage(st.warm,x-30,y-30,60,60)}
  c.globalAlpha=1;c.globalCompositeOperation='source-over';
  // gentle swell lines in the foreground sea
  c.lineWidth=2;for(let i=0;i<6;i++){const y=820+i*42,ph=TAU*S.saw(16,i*.17);c.strokeStyle=`rgba(190,200,240,${.07+.03*i})`;c.beginPath();
    for(let x=360;x<=1260;x+=20){const yy=y+5*Math.sin(x*.012+ph)+3*Math.sin(x*.031-ph);x===360?c.moveTo(x,yy):c.lineTo(x,yy)}c.stroke()}
}});

/* ======================= 3: Shared Umbrella — rainy evening street ======================= */
BIS.scene('g5-3',{title:'Shared Umbrella',blurb:'Two friends share one big umbrella on a rainy evening street lit by warm shop windows and lamps.',
setup(S){
  const st=S.state,VX=960,VY=560,F=300,CH=1.2;
  const P=(X,Y,Z)=>[VX+F*X/Z,VY+F*Y/Z];st.P=P;st.CH=CH;
  const[bg,k]=cv(W,H);
  // sky
  k.fillStyle=vgrad(k,0,VY+40,['#120f30','#24204e','#463a72','#7a5a86','#b07e8e']);k.fillRect(0,0,W,H);
  let g=k.createRadialGradient(VX,VY,0,VX,VY,700);g.addColorStop(0,'rgba(255,200,170,.45)');g.addColorStop(1,'rgba(255,200,170,0)');k.fillStyle=g;k.fillRect(0,0,W,H);
  const quad=(a,b,c2,d,fill)=>{k.beginPath();k.moveTo(...a);k.lineTo(...b);k.lineTo(...c2);k.lineTo(...d);k.closePath();k.fillStyle=fill;k.fill()};
  // ground: road + pavements, wet
  quad(P(-30,CH,.3),P(30,CH,.3),P(30,CH,200),P(-30,CH,200),vgrad(k,VY,H,['#5a4a6a','#2a2440','#1a1630','#120f24']));
  for(const s of[-1,1]){quad(P(s*3.6,CH,.4),P(s*30,CH,.4),P(s*30,CH,200),P(s*3.6,CH,200),'rgba(80,70,110,.35)');
    k.strokeStyle='rgba(220,200,230,.35)';k.lineWidth=2;k.beginPath();k.moveTo(...P(s*3.6,CH,.45));k.lineTo(...P(s*3.6,CH,120));k.stroke()}
  for(let z=.6;z<120;z*=1.06){const a=P(-30,CH,z),b=P(30,CH,z);k.strokeStyle=`rgba(0,0,10,${.12})`;k.lineWidth=Math.max(.5,3/z);k.beginPath();k.moveTo(a[0],a[1]);k.lineTo(b[0],b[1]);k.stroke()}
  for(let i=0;i<14;i++){const z0=1.2+i*2.2;const a=P(-.06,CH,z0),b=P(.06,CH,z0),c2=P(.06,CH,z0+1),d=P(-.06,CH,z0+1);quad(a,b,c2,d,'rgba(230,210,200,.18)')}
  const refl=[];
  // buildings on both sides, far to near
  const tones=['#2c2850','#33294a','#263050','#3a2c48','#2a3448'],awn=['#3f8a86','#a8484e','#c08a3a','#5a6aa8','#7a4a8a'];
  for(const s of[-1,1]){const segs=[];let z=1.7;while(z<60){const w=S.R(2.6,5)*(1+z*.04);segs.push({z0:z,z1:z+w,h:S.R(7,12),tone:S.pick(tones),awn:S.pick(awn),shop:S.rnd()<.75||z<4});z+=w}
    segs.reverse();const X=s*5.2;
    for(const sg of segs){const top=CH-sg.h,[a,b,c2,d]=[P(X,CH,sg.z0),P(X,top,sg.z0),P(X,top,sg.z1),P(X,CH,sg.z1)];
      quad(a,b,c2,d,sg.tone);
      // edge shading + cornice
      k.strokeStyle='rgba(0,0,0,.35)';k.lineWidth=Math.max(1,6/sg.z0);k.beginPath();k.moveTo(...a);k.lineTo(...b);k.stroke();
      quad(P(X,top,sg.z0),P(X,top+.35,sg.z0),P(X,top+.35,sg.z1),P(X,top,sg.z1),'rgba(255,220,200,.12)');
      // upper windows
      const fl=Math.floor((sg.h-3.4)/2.6),cols=Math.max(1,Math.floor((sg.z1-sg.z0)/1.5));
      for(let fi=0;fi<fl;fi++)for(let ci=0;ci<cols;ci++){const za=sg.z0+(sg.z1-sg.z0)*(ci+.28)/cols,zb=sg.z0+(sg.z1-sg.z0)*(ci+.72)/cols,ya=CH-3.9-fi*2.6-1.5,yb=ya+1.4;
        const lit=S.rnd()<.4;quad(P(X,ya,za),P(X,yb,za),P(X,yb,zb),P(X,ya,zb),lit?S.pick(['#ffc56e','#ffb060','#ffd790']):'rgba(20,18,45,.85)');
        if(!lit){k.strokeStyle='rgba(180,160,220,.15)';k.lineWidth=1;k.beginPath();k.moveTo(...P(X,ya,za));k.lineTo(...P(X,ya,zb));k.stroke()}}
      // ground floor
      const za=sg.z0+.35,zb=sg.z1-.35;
      if(sg.shop){const sw=k.createLinearGradient(0,P(X,CH-2.8,za)[1],0,P(X,CH-.3,za)[1]);sw.addColorStop(0,'#ffd590');sw.addColorStop(1,'#e88a48');
        quad(P(X,CH-2.6,za),P(X,CH-.35,za),P(X,CH-.35,zb),P(X,CH-2.6,zb),sw);
        k.strokeStyle='rgba(60,30,30,.6)';k.lineWidth=Math.max(1,5/za);const zm=(za+zb)/2;k.beginPath();k.moveTo(...P(X,CH-2.6,zm));k.lineTo(...P(X,CH-.35,zm));k.stroke();
        // shelf silhouettes
        for(let q=0;q<4;q++){const zz=S.lerp(za,zb,S.R(.1,.85)),ww=S.R(.2,.45);quad(P(X,CH-.35-S.R(.4,1.1),zz),P(X,CH-.35,zz),P(X,CH-.35,zz+ww),P(X,CH-.35-S.R(.4,1.1),zz+ww),'rgba(120,50,40,.5)')}
        quad(P(X,CH-3.05,sg.z0+.15),P(X+(-s)*1.1,CH-2.45,sg.z0+.15),P(X+(-s)*1.1,CH-2.45,sg.z1-.15),P(X,CH-3.05,sg.z1-.15),sg.awn);
        quad(P(X+(-s)*1.1,CH-2.45,sg.z0+.15),P(X+(-s)*1.1,CH-2.25,sg.z0+.15),P(X+(-s)*1.1,CH-2.25,sg.z1-.15),P(X+(-s)*1.1,CH-2.45,sg.z1-.15),'rgba(0,0,0,.35)');
        refl.push({X:X*.92,Z:(za+zb)/2,w:(zb-za),hot:1})}
      else{quad(P(X,CH-2.3,za+.3),P(X,CH,za+.3),P(X,CH,za+1.2),P(X,CH-2.3,za+1.2),'#1a1630')}}}
  // street lamps
  st.lamps=[];for(const s of[-1,1])for(let z=2.6+(s>0?1.6:0);z<40;z+=4.2){const X=s*4.2,base=P(X,CH,z),top=P(X,CH-4.4,z),wd=Math.max(1,F*.09/z);
    k.fillStyle='#120f24';k.fillRect(base[0]-wd/2,top[1],wd,base[1]-top[1]);
    const arm=P(X-s*.5,CH-4.4,z);k.fillRect(Math.min(arm[0],top[0]),top[1]-wd/2,Math.abs(arm[0]-top[0]),wd);
    const hd=P(X-s*.5,CH-4.2,z),hs=F*.35/z;k.fillStyle='#120f24';k.beginPath();k.moveTo(hd[0]-hs*.6,hd[1]-hs*.2);k.lineTo(hd[0]+hs*.6,hd[1]-hs*.2);k.lineTo(hd[0],hd[1]-hs*.7);k.fill();
    k.fillStyle='#ffe2a8';k.fillRect(hd[0]-hs*.35,hd[1]-hs*.2,hs*.7,hs*.5);st.lamps.push({x:hd[0],y:hd[1],r:F*2.4/z,z});refl.push({X:X-s*.5,Z:z,w:.5,hot:2})}
  // wet reflections
  k.globalCompositeOperation='lighter';
  for(const r of refl){const[x,y]=P(r.X,CH,r.Z),len=Math.min(380,F*3/r.Z),wd=Math.max(3,F*(r.hot>1?.22:.45)/r.Z);
    const gg=k.createLinearGradient(0,y,0,y+len);gg.addColorStop(0,`rgba(255,190,110,${r.hot>1?.5:.35})`);gg.addColorStop(1,'rgba(255,170,90,0)');k.fillStyle=gg;
    k.fillRect(x-wd/2,y,wd,len);k.fillStyle='rgba(255,230,190,.12)';k.fillRect(x-wd*.15,y,wd*.3,len*.7);}
  k.globalCompositeOperation='source-over';
  // distant haze at the end of the street
  g=k.createRadialGradient(VX,VY,0,VX,VY,260);g.addColorStop(0,'rgba(255,210,185,.5)');g.addColorStop(1,'rgba(255,210,185,0)');k.fillStyle=g;k.fillRect(VX-260,VY-260,520,520);
  grain(S,k,W,H,6);st.bg=bg;
  st.warm=glowSprite('255,205,130',128,.22,.4);st.wh=glowSprite('220,225,255',32,.3,.5);
  // the friends under one umbrella
  st.fz=2.05;const[fx,fy]=P(.25,CH,st.fz),sc=F/st.fz;st.fx=fx;st.fy=fy;st.sc=sc;
  st.rain=[];for(let i=0;i<300;i++){const near=i<40;st.rain.push({x:S.R(-100,W+100),y:S.R(0,1),l:near?S.R(40,70):S.R(14,32),sec:near?S.R(.9,1.2):S.R(1.4,2.2),a:near?.35:S.R(.12,.28)})}
  st.rip=[];for(let i=0;i<26;i++)st.rip.push({X:S.R(-4,4),Z:S.R(1.2,9),sec:S.R(1.6,2.6),off:S.R(0,1)});
  st.drip=[];for(let i=0;i<6;i++)st.drip.push({u:i/5,sec:S.R(1.2,1.8),off:S.R(0,1)});
},
draw(S){const c=S.ctx,st=S.state,P=st.P,CH=st.CH;
  c.drawImage(st.bg,0,0);
  c.globalCompositeOperation='lighter';
  for(const l of st.lamps){c.globalAlpha=.55+.08*S.osc(11,l.z*.1);c.drawImage(st.warm,l.x-l.r,l.y-l.r*.8,l.r*2,l.r*2)}
  c.globalAlpha=1;c.globalCompositeOperation='source-over';
  // puddle ripples
  c.lineWidth=1.5;for(const r of st.rip){const t=S.saw(r.sec,r.off),[x,y]=P(r.X,CH,r.Z),rad=(.05+t*.35)*300/r.Z;c.strokeStyle=`rgba(255,220,200,${.35*(1-t)})`;c.beginPath();c.ellipse(x,y,rad,rad*.22,0,0,TAU);c.stroke()}
  // two friends sharing an umbrella
  const fx=st.fx,fy=st.fy,sc=st.sc,sw=.035*S.osc(6),bob=2*S.osc(3);
  const A=sc*1.45,B=sc*1.25,ax=fx-sc*.22,bx=fx+sc*.24,hand=[fx-sc*.02,fy-A*.42];
  const draw2=(alpha,flip)=>{c.save();c.globalAlpha=alpha;if(flip){c.beginPath();c.rect(0,fy,W,A*.8);c.clip();c.translate(0,fy*2);c.scale(1,-1)}
    figure(c,ax,fy,A,{coat:1,pony:-1,l:[ax-A*.16,fy-A*.36],r:hand},'#120d22',null,0);
    figure(c,bx,fy,B,{coat:1,l:hand,r:[bx+B*.12,fy-B*.36]},'#120d22',null,0);
    // umbrella held by the first friend's hand
    const hx=fx-sc*.05,hy=fy-A*.62+bob;S.at(hx,hy,sw,1,()=>{const R=sc*.95,top=-A*.62;
      c.strokeStyle='#120d22';c.lineWidth=Math.max(3,sc*.02);c.beginPath();c.moveTo(0,A*.12);c.lineTo(0,top);c.stroke();
      c.beginPath();c.arc(sc*.04,A*.12,sc*.04,0,Math.PI);c.stroke();
      const ug=c.createLinearGradient(-R,0,R,0);ug.addColorStop(0,'#f07a6a');ug.addColorStop(.5,'#d84f55');ug.addColorStop(1,'#8e2f48');c.fillStyle=ug;
      c.beginPath();c.moveTo(-R,top+R*.42);c.quadraticCurveTo(-R*.9,top-R*.18,0,top-R*.3);c.quadraticCurveTo(R*.9,top-R*.18,R,top+R*.42);
      for(let i=4;i>0;i--){const x1=-R+R*2*(i-1)/4,x0=-R+R*2*i/4;c.quadraticCurveTo((x0+x1)/2,top+R*.28,x1,top+R*.42)}c.closePath();c.fill();
      c.strokeStyle='rgba(255,210,190,.45)';c.lineWidth=2;c.beginPath();c.moveTo(-R*.92,top+R*.3);c.quadraticCurveTo(-R*.8,top-R*.15,0,top-R*.28);c.stroke();
      c.strokeStyle='rgba(60,10,30,.35)';for(let i=1;i<4;i++){const x=-R+R*2*i/4;c.beginPath();c.moveTo(0,top-R*.3);c.quadraticCurveTo(x*.7,top-R*.05,x,top+R*.36);c.stroke()}
      c.fillStyle='#120d22';c.fillRect(-2,top-R*.42,4,R*.14);
      if(!flip){c.fillStyle='rgba(220,230,255,.75)';for(const d of st.drip){const t=S.saw(d.sec,d.off),x=-R+R*2*d.u;c.globalAlpha=alpha*(1-t);c.fillRect(x-1,top+R*.42+t*sc*.9,2,8)}}});
    c.restore()};
  draw2(.28,true);
  c.globalCompositeOperation='lighter';c.globalAlpha=.25;c.drawImage(st.warm,fx-sc*1.2,fy-sc*2.2,sc*2.4,sc*2.4);c.globalAlpha=1;c.globalCompositeOperation='source-over';
  draw2(1,false);
  // rain
  c.lineCap='round';
  for(const pass of[0,1]){c.strokeStyle=pass?'rgba(225,230,255,.38)':'rgba(200,205,240,.2)';c.lineWidth=pass?2:1.2;c.beginPath();
    for(const r of st.rain){if((r.l>36)!==!!pass)continue;const y=S.frac(r.y+S.saw(r.sec))*(H+120)-60,x=r.x-y*.12;c.moveTo(x,y);c.lineTo(x-r.l*.12,y+r.l)}c.stroke()}
}});
})();
