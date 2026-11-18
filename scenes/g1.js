/* Grade 1 — "Opalite" (dance). Request: "Love." Flat vector, soft gradients, glow and light. */
(function(){
const TAU=Math.PI*2,W=1920,H=1080;
function cv(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c}
function rg(x,cx,cy,r,stops){const g=x.createRadialGradient(cx,cy,0,cx,cy,r);stops.forEach(s=>g.addColorStop(s[0],s[1]));x.fillStyle=g;x.fillRect(cx-r,cy-r,2*r,2*r)}
function lg(x,y0,y1,stops){const g=x.createLinearGradient(0,y0,0,y1);stops.forEach((c,i)=>g.addColorStop(Array.isArray(c)?c[0]:i/(stops.length-1),Array.isArray(c)?c[1]:c));return g}
function glowSpr(h,s,l,a=1,size=256){return cv(size,size,(x,w)=>rg(x,w/2,w/2,w/2,[[0,`hsla(${h},${s}%,${l}%,${a})`],[.35,`hsla(${h},${s}%,${l}%,${a*.45})`],[1,`hsla(${h},${s}%,${l}%,0)`]]))}
function sparkSpr(col='255,255,255'){return cv(128,128,x=>{x.translate(64,64);rg(x,0,0,40,[[0,`rgba(${col},.85)`],[1,`rgba(${col},0)`]]);x.fillStyle=`rgb(${col})`;x.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,r=i%2?5:60;x.lineTo(Math.cos(a)*r,Math.sin(a)*r)}x.closePath();x.fill()})}
function grain(S){const g=cv(256,256,x=>{const d=x.createImageData(256,256);for(let i=0;i<d.data.length;i+=4){const v=S.rnd()<.5?0:255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=Math.floor(S.R(0,20))}x.putImageData(d,0,0)});return S.ctx.createPattern(g,'repeat')}
function drawGrain(S){const c=S.ctx;c.globalAlpha=1;c.globalCompositeOperation='source-over';c.fillStyle=S.state.grain;c.fillRect(0,0,W,H)}
// ridge line function: base minus a sum of sines (peaky = mountain-like)
function ridge(S,base,amp,n=3,peaky=false){const q=[];for(let i=0;i<n;i++)q.push([S.R(.65,1)*amp/(i+1),S.R(.0025,.0045)*(i*1.8+1),S.R(0,TAU)]);
  return px=>base-q.reduce((s,k)=>s+k[0]*(peaky?Math.pow(1-Math.abs(Math.sin(px*k[1]*.5+k[2])),1.6):.5+.5*Math.sin(px*k[1]+k[2])),0)}
function fillRidge(x,f,fill){x.beginPath();x.moveTo(-10,H+10);for(let px=-10;px<=W+10;px+=6)x.lineTo(px,f(px));x.lineTo(W+10,H+10);x.closePath();x.fillStyle=fill;x.fill()}
function strokeRidge(x,f,col,w){x.beginPath();for(let px=-10;px<=W+10;px+=6)px<=-10?x.moveTo(px,f(px)):x.lineTo(px,f(px));x.strokeStyle=col;x.lineWidth=w;x.stroke()}
function heartSpr(S,a,b,size=160){return cv(size,size,x=>{x.translate(size/2,size*.56);const p=S.heartPath(size*.42);const g=x.createLinearGradient(0,-size*.45,0,size*.2);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fill(p);x.fillStyle='rgba(255,255,255,.6)';x.beginPath();x.ellipse(-size*.17,-size*.24,size*.07,size*.04,-.7,0,TAU);x.fill()})}

/* ===================== 1  OPAL MOON ===================== */
function ribbon(S,yb,amp,k,thick,hue0,hueAmp,a){const p1=S.R(0,TAU),p2=S.R(0,TAU),p3=S.R(0,TAU);
  return cv(W,620,x=>{for(let px=0;px<W;px+=3){const t=px/W,yc=yb+amp*Math.sin(TAU*k*t+p1)+amp*.4*Math.sin(TAU*(k+2)*t+p2),th=thick*(.65+.35*Math.sin(TAU*3*t+p3)),
    h=((hue0+hueAmp*Math.sin(TAU*2*t+p1))%360+360)%360,g=x.createLinearGradient(0,yc-th,0,yc+th*.3);
    g.addColorStop(0,`hsla(${h},90%,76%,0)`);g.addColorStop(.72,`hsla(${h},90%,76%,${a})`);g.addColorStop(.82,`hsla(${(h+40)%360},90%,82%,${a*1.1})`);g.addColorStop(1,`hsla(${h},90%,80%,0)`);
    x.fillStyle=g;x.fillRect(px,yc-th,3.5,th*1.3)}})}
function crystal(x,X,Y,h,w,ang,hue){x.save();x.translate(X,Y);x.rotate(ang);
  const L=-w/2,R=w/2,a=-.14*w,b=.2*w,s=-.74*h,T=-h;
  const F=[[[L,0],[L,s],[0,T],[a,s+.05*h],[a,0]],[[a,0],[a,s+.05*h],[0,T],[b,s+.03*h],[b,0]],[[b,0],[b,s+.03*h],[0,T],[R,s],[R,0]]],li=[44,68,56];
  F.forEach((f,i)=>{const g=x.createLinearGradient(0,0,0,T);g.addColorStop(0,`hsla(${hue},65%,${li[i]-24}%,.97)`);g.addColorStop(.55,`hsla(${hue+30},75%,${li[i]}%,.95)`);g.addColorStop(1,`hsla(${hue+70},85%,${Math.min(92,li[i]+22)}%,.97)`);
    x.fillStyle=g;x.beginPath();f.forEach((p,k)=>k?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.fill()});
  // inner sheen strip
  x.globalCompositeOperation='lighter';const g=x.createLinearGradient(a,0,b,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,240,255,.22)');g.addColorStop(1,'rgba(255,255,255,0)');
  x.fillStyle=g;x.beginPath();x.moveTo(a+w*.05,0);x.lineTo(a+w*.05,s);x.lineTo(0,T*.97);x.lineTo(b-w*.08,s);x.lineTo(b-w*.08,0);x.fill();x.globalCompositeOperation='source-over';
  x.lineJoin='round';x.strokeStyle='rgba(255,245,255,.6)';x.lineWidth=Math.max(1.5,w*.025);
  x.beginPath();x.moveTo(L,0);x.lineTo(L,s);x.lineTo(0,T);x.lineTo(R,s);x.lineTo(R,0);x.stroke();
  x.strokeStyle='rgba(255,245,255,.35)';x.beginPath();x.moveTo(a,0);x.lineTo(a,s+.05*h);x.lineTo(0,T);x.lineTo(b,s+.03*h);x.lineTo(b,0);x.stroke();x.restore()}

BIS.scene('g1-1',{title:'Opal Moon',blurb:'A big shimmering opal moon glows over a lilac lake, with aurora ribbons, sparkling crystal hills and floating lights.',
setup(S){const st=S.state;st.grain=grain(S);
  st.sky=cv(W,H,x=>{x.fillStyle=lg(x,0,660,[[0,'#120d36'],[.4,'#2b2064'],[.75,'#6a4c9c'],[1,'#e8a8c8']]);x.fillRect(0,0,W,H);
    rg(x,960,650,1000,[[0,'hsla(335,85%,84%,.55)'],[.5,'hsla(300,70%,70%,.15)'],[1,'hsla(300,70%,70%,0)']]);
    for(let i=0;i<320;i++){const sy=Math.pow(S.rnd(),1.6)*600;x.fillStyle=`rgba(255,248,255,${(S.R(.2,.9)*(1-sy/650)).toFixed(3)})`;x.beginPath();x.arc(S.R(0,W),sy,S.R(.5,2),0,TAU);x.fill()}});
  st.rib=[ribbon(S,230,55,2,170,300,70,.3),ribbon(S,150,40,3,120,175,55,.24)];
  st.moon=cv(420,420,x=>{x.translate(210,210);const g=x.createRadialGradient(-40,-50,10,0,0,150);g.addColorStop(0,'#fffaf6');g.addColorStop(.6,'#f1e5fb');g.addColorStop(1,'#cbb6ea');x.fillStyle=g;x.beginPath();x.arc(0,0,150,0,TAU);x.fill()});
  const sw=()=>cv(420,420,x=>{x.translate(210,210);x.beginPath();x.arc(0,0,150,0,TAU);x.clip();const hs=[330,185,150,275,45,200,310,165];
    for(let i=0;i<18;i++){const a=S.R(0,TAU),d=S.R(0,125),r=S.R(35,90),h=hs[i%8];rg(x,Math.cos(a)*d,Math.sin(a)*d,r,[[0,`hsla(${h},90%,70%,.6)`],[1,`hsla(${h},90%,70%,0)`]])}});
  st.sw1=sw();st.sw2=sw();
  st.moonTop=cv(420,420,x=>{x.translate(210,210);x.save();x.beginPath();x.arc(0,0,150,0,TAU);x.clip();const g=x.createRadialGradient(-60,-70,0,-20,-20,230);
    g.addColorStop(0,'rgba(255,255,255,.6)');g.addColorStop(.4,'rgba(255,255,255,0)');g.addColorStop(.78,'rgba(70,30,120,0)');g.addColorStop(1,'rgba(70,30,120,.4)');x.fillStyle=g;x.fillRect(-150,-150,300,300);x.restore();
    x.lineWidth=3;x.strokeStyle='rgba(255,255,255,.7)';x.beginPath();x.arc(0,0,149,0,TAU);x.stroke()});
  st.halo=glowSpr(300,80,86,.6,512);st.spark=sparkSpr();st.pool=glowSpr(300,85,72,.8);
  st.moteSpr=[325,185,270,155,45].map(h=>glowSpr(h,95,78,1,64));
  st.land=cv(W,H,x=>{const fA=ridge(S,645,135,3,true),fB=ridge(S,648,70,3,false);
    fillRidge(x,fA,lg(x,470,645,['#9878c6','#d6a6d2']));
    x.fillStyle=lg(x,540,648,['rgba(240,180,215,0)','rgba(245,185,218,.6)']);x.fillRect(0,540,W,108);
    fillRidge(x,fB,lg(x,560,648,['#5a4092','#8c6ab6']));
    x.fillStyle=lg(x,646,860,[[0,'#cf9acb'],[.3,'#8466b2'],[1,'#2e2266']]);x.fillRect(0,646,W,H-646);
    x.save();x.beginPath();x.rect(0,648,W,300);x.clip();x.globalAlpha=.28;x.translate(0,1296);x.scale(1,-1);fillRidge(x,fB,'#4a3482');x.restore();
    x.strokeStyle='rgba(255,230,250,.18)';x.lineWidth=2;for(let i=0;i<40;i++){const y=S.R(655,840),cx=S.R(0,W),w=S.R(40,220);x.beginPath();x.moveTo(cx-w/2,y);x.lineTo(cx+w/2,y);x.stroke()}
    const fG=px=>700+150*Math.exp(-Math.pow((px-960)/520,2))+10*Math.sin(px*.011)+6*Math.sin(px*.027+1);
    fillRidge(x,fG,lg(x,700,1080,['#2c1d5a','#120a2e']));strokeRidge(x,fG,'rgba(255,190,235,.4)',3);
    for(let i=0;i<170;i++){const px=S.R(0,W),py=S.R(fG(px)+12,1075),h=S.pick([325,185,270,155,45]),r=S.R(4,11)*(.6+.6*(py-700)/380);
      rg(x,px,py,r*3,[[0,`hsla(${h},90%,75%,.45)`],[1,`hsla(${h},90%,75%,0)`]]);x.fillStyle=`hsla(${h},90%,88%,.95)`;x.beginPath();x.arc(px,py,r*.35,0,TAU);x.fill()}
    x.strokeStyle='#170d3a';x.lineCap='round';for(let px=0;px<W;px+=9){const y=fG(px)+3;for(let k=0;k<2;k++){const l=S.R(8,26);x.lineWidth=S.R(1.5,3);x.beginPath();x.moveTo(px+S.R(-4,4),y);x.quadraticCurveTo(px+S.R(-6,6),y-l*.6,px+S.R(-10,10),y-l);x.stroke()}}});
  st.tips=[];st.pools=[];
  st.fg=cv(W,H,x=>{const hues=[325,190,268,160,300,205];
    const cluster=(cx,cy,n,hmin,hmax,spread)=>{st.pools.push([cx,cy-hmax*.4,hmax*1.5]);const arr=[];
      for(let i=0;i<n;i++){const h=i==0?hmax:S.R(hmin,hmax);arr.push({h,ang:S.R(-spread,spread)*(1.15-h/hmax*.75),dx:S.R(-hmax*.14,hmax*.14),w:h*S.R(.2,.27),hue:S.pick(hues)})}
      arr.sort((a,b)=>b.h-a.h);for(const c of arr){crystal(x,cx+c.dx,cy,c.h,c.w,c.ang,c.hue);if(c.h>hmin+(hmax-hmin)*.25)st.tips.push([cx+c.dx+Math.sin(c.ang)*c.h,cy-Math.cos(c.ang)*c.h,S.R(5,10),S.R(0,1)])}
      {const gc=cy>1000?'23,13,54':'32,21,72',rx=hmax*.5;{const ry=hmax*.08+30,g=x.createRadialGradient(cx,cy+6,0,cx,cy+6,rx);g.addColorStop(0,`rgba(${gc},1)`);g.addColorStop(.55,`rgba(${gc},.9)`);g.addColorStop(1,`rgba(${gc},0)`);x.save();x.translate(cx,cy+6);x.scale(1,ry/rx);x.translate(-cx,-cy-6);x.fillStyle=g;x.beginPath();x.arc(cx,cy+6,rx,0,TAU);x.fill();x.restore()}
      x.strokeStyle='#170d3a';x.lineCap='round';for(let i=0;i<hmax*.22;i++){const px=cx+S.R(-rx*.85,rx*.85),py=cy+S.R(-6,10),l=S.R(10,30)*(hmax>300?1.3:1);x.lineWidth=S.R(1.5,3.2);x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px+S.R(-6,6),py-l*.6,px+S.R(-12,12),py-l);x.stroke()}}};
    cluster(200,1030,8,230,650,.75);cluster(1720,1030,8,230,630,.75);cluster(590,905,5,70,200,.6);cluster(1335,915,5,80,215,.6);cluster(55,790,3,60,150,.5);cluster(1880,800,3,60,150,.5);
    for(let i=0;i<9;i++){const px=S.R(720,1200),py=S.R(1010,1078),h=S.R(26,60);crystal(x,px,py,h,h*.26,S.R(-.5,.5),S.pick(hues))}});
  st.tw=[];for(let i=0;i<40;i++)st.tw.push({x:S.R(30,1890),y:Math.pow(S.rnd(),1.3)*560+20,s:S.R(18,46),sec:S.R(4,9),o:S.R(0,1)});
  st.refl=[];for(let i=0;i<16;i++){const y=652+i*12.5+S.R(-3,3);st.refl.push({y,dx:S.R(-14,14),w:S.R(60,220)*(1-i/26),h:S.R(3,6),sec:S.R(3,7),o:S.R(0,1),a:S.R(.25,.55)*(1-i/22)})}
  st.motes=[];for(let i=0;i<110;i++)st.motes.push({x:S.R(0,W),y:S.R(0,H),k:i%5,s:S.R(10,30),sec:S.R(70,170),sw:S.R(15,50),ss:S.R(9,20),o:S.R(0,1),ts:S.R(3,7)})},
draw(S){const c=S.ctx,st=S.state;
  c.globalAlpha=1;c.globalCompositeOperation='source-over';c.drawImage(st.sky,0,0);
  c.globalCompositeOperation='lighter';
  for(const s of st.tw){const t=S.pulse(s.sec,s.o,3);c.globalAlpha=.1+.9*t;const z=s.s*(.4+.7*t);c.drawImage(st.spark,s.x-z/2,s.y-z/2,z,z)}
  const o1=S.saw(162)*W,o2=(1-S.saw(81))*W,y1=30*S.osc(54);
  c.globalAlpha=.7+.3*S.osc(41);c.drawImage(st.rib[0],-o1,y1);c.drawImage(st.rib[0],W-o1,y1);
  c.globalAlpha=.55+.35*S.osc(27,.3);c.drawImage(st.rib[1],-o2,0);c.drawImage(st.rib[1],W-o2,0);
  c.globalAlpha=.8+.2*S.osc(18);const hr=540+30*S.osc(18);c.drawImage(st.halo,960-hr,280-hr,2*hr,2*hr);
  c.globalAlpha=1;c.globalCompositeOperation='source-over';
  c.save();c.translate(960,280);c.drawImage(st.moon,-210,-210);c.save();c.rotate(TAU*S.saw(162));c.globalAlpha=.8;c.drawImage(st.sw1,-210,-210);c.restore();
  c.rotate(1.3-TAU*S.saw(81));c.globalAlpha=.5+.3*S.osc(23);c.drawImage(st.sw2,-210,-210);c.restore();c.globalAlpha=1;
  c.drawImage(st.moonTop,750,70);
  c.drawImage(st.land,0,0);
  c.globalCompositeOperation='lighter';c.fillStyle='#fff0fa';
  for(const r of st.refl){const w=r.w*(.5+.5*S.osc01(r.sec,r.o));c.globalAlpha=r.a;c.beginPath();c.roundRect(960+r.dx-w/2,r.y,w,r.h,r.h/2);c.fill()}
  for(let i=0;i<st.pools.length;i++){const p=st.pools[i],z=p[2]*(1+.06*S.osc(11,i*.17));c.globalAlpha=.32+.2*S.osc(11,i*.17);c.drawImage(st.pool,p[0]-z/2,p[1]-z/2,z,z)}
  c.globalAlpha=1;c.globalCompositeOperation='source-over';
  c.drawImage(st.fg,0,0);
  c.globalCompositeOperation='lighter';
  for(const t of st.tips){const k=S.pulse(t[2],t[3],5);if(k<.02)continue;c.globalAlpha=k;const z=70*(.3+k);c.drawImage(st.spark,t[0]-z/2,t[1]-z/2,z,z)}
  for(const m of st.motes){const y=S.wrap(m.y,m.sec,H,40,-1),x=m.x+m.sw*S.osc(m.ss,m.o);c.globalAlpha=.35+.55*S.osc01(m.ts,m.o);c.drawImage(st.moteSpr[m.k],x-m.s/2,y-m.s/2,m.s,m.s)}
  drawGrain(S)}});

/* ===================== 2  HEART BALLOONS ===================== */
function puffCloud(S,w,h,cols,flat=.78){return cv(w,h,x=>{x.fillStyle=lg(x,0,h*flat,cols);x.save();x.beginPath();x.rect(0,0,w,h*flat);x.clip();
  const n=Math.max(4,Math.round(w/55));for(let i=0;i<n;i++){const t=(i+.5)/n,px=w*(.07+.86*t),env=Math.sin(Math.PI*t),r=h*(.13+.27*env)*S.R(.8,1.08);x.beginPath();x.arc(px+S.R(-12,12),h*flat-r*.7+S.R(-5,5),r,0,TAU);x.fill()}x.restore()})}
function roundBalloon(S,cols,haze){const R=120;return cv(300,470,x=>{x.translate(150,140);
  const p=new Path2D();p.moveTo(-R*.26,R*1.2);p.bezierCurveTo(-R*.9,R*.78,-R*1.02,R*.28,-R,0);p.arc(0,0,R,Math.PI,TAU);p.bezierCurveTo(R*1.02,R*.28,R*.9,R*.78,R*.26,R*1.2);p.closePath();
  x.save();x.clip(p);const n=7;for(let i=0;i<n;i++){x.fillStyle=cols[i%cols.length];x.beginPath();x.ellipse(0,R*.1,R*1.08*(1-i/n),R*1.5,0,0,TAU);x.fill()}
  let g=x.createLinearGradient(-R,0,R,0);g.addColorStop(0,'rgba(255,255,255,.28)');g.addColorStop(.35,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(70,10,50,.38)');x.fillStyle=g;x.fillRect(-R*1.2,-R*1.2,R*2.4,R*2.6);
  rg(x,-R*.2,R*1.3,R*1.1,[[0,'rgba(255,200,130,.45)'],[1,'rgba(255,200,130,0)']]);
  x.fillStyle='rgba(255,255,255,.45)';x.beginPath();x.ellipse(-R*.45,-R*.5,R*.16,R*.09,-.8,0,TAU);x.fill();x.restore();
  x.fillStyle='#d9a441';x.beginPath();x.moveTo(-R*.26,R*1.19);x.lineTo(R*.26,R*1.19);x.lineTo(R*.18,R*1.32);x.lineTo(-R*.18,R*1.32);x.closePath();x.fill();
  x.strokeStyle='rgba(80,40,40,.8)';x.lineWidth=2;x.beginPath();x.moveTo(-R*.18,R*1.32);x.lineTo(-R*.22,R*1.72);x.moveTo(R*.18,R*1.32);x.lineTo(R*.22,R*1.72);x.stroke();
  basket(x,0,R*1.72,R*.5,R*.36);
  if(haze){x.globalCompositeOperation='source-atop';x.fillStyle=haze;x.fillRect(-150,-140,300,470)}})}
function basket(x,cx,y,w,h){const g=x.createLinearGradient(cx-w/2,0,cx+w/2,0);g.addColorStop(0,'#c98a4b');g.addColorStop(1,'#7a4724');x.fillStyle=g;x.beginPath();x.roundRect(cx-w/2,y,w,h,[3,3,8,8]);x.fill();
  x.strokeStyle='rgba(60,30,10,.45)';x.lineWidth=1.5;for(let i=1;i<4;i++){x.beginPath();x.moveTo(cx-w/2,y+h*i/4);x.lineTo(cx+w/2,y+h*i/4);x.stroke()}
  x.fillStyle='#5e3418';x.fillRect(cx-w/2-3,y-3,w+6,6)}

BIS.scene('g1-2',{title:'Heart Balloons',blurb:'A big heart-shaped hot-air balloon and friends float over a cosy village at golden sunset, with tiny hearts rising.',
setup(S){const st=S.state;st.grain=grain(S);
  st.sky=cv(W,H,x=>{x.fillStyle=lg(x,0,720,[[0,'#4a3a88'],[.3,'#9a5ca2'],[.58,'#ea8c9c'],[.82,'#ffbe8a'],[1,'#ffe3a8']]);x.fillRect(0,0,W,H);
    rg(x,960,705,1150,[[0,'hsla(40,100%,86%,.75)'],[.35,'hsla(25,100%,76%,.3)'],[1,'hsla(20,100%,70%,0)']]);
    rg(x,960,705,300,[[0,'rgba(255,250,225,.95)'],[1,'rgba(255,230,160,0)']]);
    const g=x.createRadialGradient(960,705,0,960,705,115);g.addColorStop(0,'#fffcea');g.addColorStop(1,'#ffe39a');x.fillStyle=g;x.beginPath();x.arc(960,705,115,0,TAU);x.fill()});
  st.rays=cv(1800,1800,x=>{x.translate(900,900);for(let i=0;i<20;i++){const a=i*TAU/20+S.R(-.05,.05),w=S.R(.025,.06);const g=x.createRadialGradient(0,0,100,0,0,900);g.addColorStop(0,'rgba(255,240,200,.55)');g.addColorStop(1,'rgba(255,240,200,0)');x.fillStyle=g;x.beginPath();x.moveTo(0,0);x.arc(0,0,900,a-w,a+w);x.closePath();x.fill()}});
  st.clouds=[];const ccol=[['#a86fa8','#ee9fb0','#ffd8a4'],['#b97cab','#f4abb1','#ffdcaa'],['#8f64a0','#d993b2','#f9c9a6']];
  [[200,120,560,170,.75],[1100,60,700,190,.7],[1500,280,480,150,.85],[600,360,420,130,.9],[300,500,620,150,.95],[1650,500,520,140,.95]].forEach((d,i)=>st.clouds.push({x:d[0],y:d[1],img:puffCloud(S,d[2],d[3],ccol[i%3]),a:d[4],sec:i%2?162:324}));
  st.heroImg=cv(480,700,x=>{x.translate(240,260);const hp=S.heartPath(230);
    let g=x.createLinearGradient(-200,0,200,0);g.addColorStop(0,'#ffb6c8');g.addColorStop(.3,'#ff6390');g.addColorStop(.7,'#d8346c');g.addColorStop(1,'#8e1c4e');x.fillStyle=g;x.fill(hp);
    x.save();x.clip(hp);x.strokeStyle='rgba(120,15,60,.28)';x.lineWidth=4;for(let k=-4;k<=4;k++){x.beginPath();x.moveTo(k*52,-270);x.quadraticCurveTo(k*60,-40,0,85);x.stroke()}
    x.fillStyle='rgba(255,214,120,.9)';x.fillRect(-200,20,400,14);
    rg(x,-150,90,260,[[0,'rgba(255,205,140,.5)'],[1,'rgba(255,205,140,0)']]);
    x.lineWidth=10;x.strokeStyle='rgba(255,220,170,.5)';x.stroke(hp);
    rg(x,-90,-170,150,[[0,'rgba(255,255,255,.45)'],[1,'rgba(255,255,255,0)']]);x.restore();
    x.fillStyle='rgba(255,255,255,.7)';x.beginPath();x.ellipse(-105,-165,30,15,-.75,0,TAU);x.fill();
    x.fillStyle='#e0ad4c';x.beginPath();x.moveTo(-24,62);x.lineTo(24,62);x.lineTo(16,110);x.lineTo(-16,110);x.closePath();x.fill();
    x.strokeStyle='rgba(80,40,40,.85)';x.lineWidth=2.5;x.beginPath();x.moveTo(-16,110);x.lineTo(-34,200);x.moveTo(16,110);x.lineTo(34,200);x.moveTo(-6,110);x.lineTo(-12,200);x.moveTo(6,110);x.lineTo(12,200);x.stroke();
    basket(x,0,200,76,56)});
  st.balloons=[
    {img:roundBalloon(S,['#ffd166','#ff8c61']),x:430,y:250,s:.62,bs:14,o:.2},
    {img:roundBalloon(S,['#7fd8d0','#fff1c9'],'rgba(240,170,190,.28)'),x:760,y:120,s:.36,bs:17,o:.5},
    {img:roundBalloon(S,['#c79bf2','#ffffff'],'rgba(240,170,190,.22)'),x:1700,y:160,s:.42,bs:12,o:.8},
    {img:roundBalloon(S,['#ff8fab','#ffe0ea'],'rgba(240,160,180,.45)'),x:200,y:420,s:.22,bs:19,o:.1,drift:1}];
  st.land=cv(W,H,x=>{const fF=ridge(S,705,110,3),fM=ridge(S,785,110,3),fN=ridge(S,880,100,2);
    fillRidge(x,fF,lg(x,600,705,['#c681ad','#eaa2a8']));strokeRidge(x,fF,'rgba(255,215,170,.55)',3);
    x.fillStyle='#b9739f';for(let i=0;i<40;i++){const px=S.R(0,W),y=fF(px),r=S.R(6,12);x.beginPath();x.arc(px,y-r*.6,r,0,TAU);x.fill()}
    x.fillStyle=lg(x,640,760,['rgba(255,200,170,0)','rgba(255,205,175,.45)']);x.fillRect(0,640,W,140);
    fillRidge(x,fM,lg(x,660,800,['#a05994','#b9709a']));strokeRidge(x,fM,'rgba(255,200,160,.55)',3);
    const tree=(px,y,r,col)=>{x.fillStyle=col;x.fillRect(px-r*.12,y-r*1.2,r*.24,r*1.3);x.beginPath();x.arc(px,y-r*1.55,r,0,TAU);x.fill()};
    for(let i=0;i<26;i++){const px=S.R(0,W);if(Math.abs(px-960)<170)continue;tree(px,fM(px)+4,S.R(10,20),'#8d4b86')}
    const house=(px,y,s)=>{x.fillStyle='#7a3a74';x.fillRect(px-s*.5,y-s*.75,s,s*.8);x.beginPath();x.moveTo(px-s*.62,y-s*.72);x.lineTo(px,y-s*1.22);x.lineTo(px+s*.62,y-s*.72);x.closePath();x.fill();
      rg(x,px,y-s*.4,s*.7,[[0,'rgba(255,210,120,.55)'],[1,'rgba(255,210,120,0)']]);x.fillStyle='#ffd77e';x.fillRect(px-s*.17,y-s*.52,s*.22,s*.22)};
    [300,350,410,465,520,1400,1450,1510,1570].forEach((px,i)=>house(px,fM(px)+10,S.R(30,44)));
    fillRidge(x,fN,lg(x,760,900,['#733879','#874482']));strokeRidge(x,fN,'rgba(255,190,150,.45)',3);
    for(let i=0;i<18;i++){const px=S.R(0,W);if(Math.abs(px-960)<260)continue;tree(px,fN(px)+5,S.R(16,30),'#5e2a65')}
    const fG=px=>1000-170*Math.pow(Math.abs(px-960)/960,1.8)+8*Math.sin(px*.013);
    fillRidge(x,fG,lg(x,830,1080,['#4a2152','#22102c']));strokeRidge(x,fG,'rgba(255,180,150,.35)',3);
    x.lineCap='round';for(let px=0;px<W;px+=11){const y=fG(px)+2;x.strokeStyle='#2f1438';for(let k=0;k<2;k++){const l=S.R(10,30);x.lineWidth=S.R(2,3.5);x.beginPath();x.moveTo(px+S.R(-4,4),y);x.quadraticCurveTo(px+S.R(-6,6),y-l*.6,px+S.R(-10,10),y-l);x.stroke()}}
    for(let i=0;i<60;i++){const px=S.R(0,W);if(Math.abs(px-960)<200&&S.rnd()<.7)continue;const y=fG(px)+S.R(-2,6),l=S.R(26,60),hue=S.pick([340,10,45,320]);
      x.strokeStyle='#2f1438';x.lineWidth=2.5;x.beginPath();x.moveTo(px,y);x.lineTo(px+S.R(-6,6),y-l);x.stroke();
      x.fillStyle=`hsl(${hue},75%,${S.R(55,70)}%)`;x.beginPath();x.ellipse(px,y-l-5,7,10,0,0,TAU);x.fill();x.fillStyle='rgba(255,230,190,.6)';x.beginPath();x.ellipse(px-2,y-l-8,2.5,4,0,0,TAU);x.fill()}
    // big framing tree, left
    x.fillStyle='#2c1236';x.beginPath();x.moveTo(40,H);x.bezierCurveTo(70,900,90,760,120,640);x.lineTo(170,640);x.bezierCurveTo(165,780,175,920,210,H);x.closePath();x.fill();
    x.strokeStyle='#2c1236';x.lineWidth=18;x.beginPath();x.moveTo(150,720);x.quadraticCurveTo(240,640,300,600);x.stroke();
    const can=[[150,520,210,170],[310,560,120,95],[40,600,120,110],[230,420,140,110]];
    for(const k of can){x.fillStyle='rgba(255,170,140,.55)';x.fill(S.blob(k[0]+7,k[1]-6,k[2],k[3],{bumps:7,amp:.12,jit:.03}))}
    for(const k of can){x.fillStyle='#3a1844';x.fill(S.blob(k[0],k[1],k[2],k[3],{bumps:7,amp:.12,jit:.03}))}
    for(let i=0;i<14;i++){const a=S.R(0,TAU),d=S.R(0,1);x.fillStyle=S.pick(['#ff7aa2','#ff9fbf','#ffc0d4']);x.save();x.translate(150+Math.cos(a)*200*d,500+Math.sin(a)*150*d);x.scale(.18,.18);x.fill(S.heartPath(60));x.restore()}
    // right bushes
    for(const k of [[1840,820,170,110],[1700,880,120,80]]){x.fillStyle='rgba(255,170,140,.5)';x.fill(S.blob(k[0]-6,k[1]-6,k[2],k[3],{bumps:6,amp:.15}));x.fillStyle='#3a1844';x.fill(S.blob(k[0],k[1],k[2],k[3],{bumps:6,amp:.15}))}});
  st.motes=glowSpr(40,100,80,1,64);st.mm=[];for(let i=0;i<80;i++)st.mm.push({x:S.R(0,W),y:S.R(0,H),s:S.R(8,24),sec:S.R(60,160),sw:S.R(15,40),ss:S.R(8,18),o:S.R(0,1),ts:S.R(3,7)});
  st.hs=[heartSpr(S,'#ffd3e0','#ff5f8f'),heartSpr(S,'#ffe6ee','#f24b7d'),heartSpr(S,'#ffe2c4','#ff8a8a')];
  st.hh=[];for(let i=0;i<20;i++)st.hh.push({k:i%3,x:i<10?S.R(40,700):S.R(1220,1880),y:S.R(0,H),s:S.R(22,50),sec:S.R(40,81),sw:S.R(20,50),ss:S.R(7,14),o:S.R(0,1)});
  st.birds=[];for(let i=0;i<7;i++){const r=Math.ceil(i/2)*(i%2?1:-1);st.birds.push({dx:Math.abs(r)*38,dy:r*20,s:S.R(.8,1.1),o:S.R(0,1)})}},
draw(S){const c=S.ctx,st=S.state;
  c.globalAlpha=1;c.globalCompositeOperation='source-over';c.drawImage(st.sky,0,0);
  c.globalCompositeOperation='lighter';c.globalAlpha=.22+.08*S.osc(20);S.at(960,705,.12*S.osc(81),1,()=>c.drawImage(st.rays,-900,-900));
  c.globalAlpha=1;c.globalCompositeOperation='source-over';
  for(const cl of st.clouds){const w=cl.img.width;c.globalAlpha=cl.a;c.drawImage(cl.img,S.wrap(cl.x,cl.sec,W,w,-1),cl.y+6*S.osc(30,cl.x/1000))}
  c.globalAlpha=1;
  // birds
  const bx=S.wrap(1300,81,W,300,-1),by=230+20*S.osc(40);c.strokeStyle='rgba(70,35,80,.75)';c.lineWidth=3;c.lineCap='round';
  for(const b of st.birds){const x=bx+b.dx,y=by+b.dy,f=10*b.s*S.osc(1.3,b.o),w=16*b.s;c.beginPath();c.moveTo(x-w,y-f);c.quadraticCurveTo(x-w*.4,y-f*.2-3,x,y);c.quadraticCurveTo(x+w*.4,y-f*.2-3,x+w,y-f);c.stroke()}
  for(const b of st.balloons){const iw=300*b.s,ih=470*b.s;const x=b.drift?S.wrap(b.x,162,W,iw,1):b.x+12*S.osc(b.bs*2,b.o),y=b.y+14*S.osc(b.bs,b.o);c.drawImage(b.img,x-iw/2,y-140*b.s,iw,ih)}
  const hx=1380+28*S.osc(27),hy=300+20*S.osc(12);S.at(hx,hy,.035*S.osc(13,.2),1,()=>c.drawImage(st.heroImg,-240,-260));
  c.drawImage(st.land,0,0);
  c.globalCompositeOperation='lighter';
  for(const m of st.mm){const y=S.wrap(m.y,m.sec,H,30,-1),x=m.x+m.sw*S.osc(m.ss,m.o);c.globalAlpha=.25+.5*S.osc01(m.ts,m.o);c.drawImage(st.motes,x-m.s/2,y-m.s/2,m.s,m.s)}
  c.globalCompositeOperation='source-over';
  for(const h of st.hh){const y=S.wrap(h.y,h.sec,H,60,-1),x=h.x+h.sw*S.osc(h.ss,h.o);c.globalAlpha=.85*Math.min(1,Math.max(0,(y+40)/300));S.at(x,y,.25*S.osc(h.ss,h.o+.25),1,()=>c.drawImage(st.hs[h.k],-h.s/2,-h.s/2,h.s,h.s))}
  drawGrain(S)}});

/* ===================== 3  RAINBOW BUBBLES ===================== */
function fluffy(S,w,h,shadow,flatBottom=true){return cv(w,h,x=>{const pts=[];const n=Math.max(5,Math.round(w/70));
  for(let i=0;i<n;i++){const t=(i+.5)/n,env=Math.sin(Math.PI*t),r=h*(.13+.25*env)*S.R(.8,1.1);pts.push([w*(.08+.84*t)+S.R(-15,15),h*.72-r*.65,r])}
  for(let i=0;i<Math.round(n/2);i++){const t=S.R(.25,.75),r=h*S.R(.18,.3);pts.push([w*t,h*.45-r*.3,r])}
  x.save();if(flatBottom){x.beginPath();x.rect(0,0,w,h*.8);x.clip()}
  x.fillStyle=shadow;for(const p of pts){x.beginPath();x.arc(p[0],p[1]+h*.06,p[2],0,TAU);x.fill()}
  for(const p of pts){const g=x.createRadialGradient(p[0]-p[2]*.3,p[1]-p[2]*.45,p[2]*.1,p[0],p[1],p[2]);g.addColorStop(0,'#ffffff');g.addColorStop(.75,'#fbfbff');g.addColorStop(1,'#e6e9fb');x.fillStyle=g;x.beginPath();x.arc(p[0],p[1],p[2]*.96,0,TAU);x.fill()}
  x.restore()})}
function bubbleSpr(){return cv(256,256,x=>{x.translate(128,128);const r=118;
  {const g=x.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,'rgba(255,255,255,.03)');g.addColorStop(.75,'rgba(255,255,255,.08)');g.addColorStop(1,'rgba(255,255,255,.3)');x.fillStyle=g;x.beginPath();x.arc(0,0,r,0,TAU);x.fill()}
  const cg=x.createConicGradient(0,0,0);[[0,'hsla(320,95%,72%,.9)'],[.18,'hsla(45,100%,65%,.8)'],[.36,'hsla(150,85%,55%,.75)'],[.55,'hsla(200,95%,62%,.85)'],[.75,'hsla(270,90%,70%,.85)'],[1,'hsla(320,95%,72%,.9)']].forEach(s=>cg.addColorStop(s[0],s[1]));
  x.save();x.filter='blur(5px)';x.globalAlpha=.4;x.strokeStyle=cg;x.lineWidth=22;x.beginPath();x.arc(0,0,r-16,0,TAU);x.stroke();x.restore();
  x.strokeStyle=cg;x.lineWidth=5;x.beginPath();x.arc(0,0,r-4,0,TAU);x.stroke();
  x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=2;x.beginPath();x.arc(0,0,r-1,0,TAU);x.stroke();
  x.fillStyle='rgba(255,255,255,.9)';x.beginPath();x.ellipse(-46,-56,26,13,-.75,0,TAU);x.fill();
  x.fillStyle='rgba(255,255,255,.55)';x.beginPath();x.ellipse(50,58,11,6,-.75,0,TAU);x.fill()})}
function flowerSpr(S,petal,center,size=96){return cv(size,size,x=>{x.translate(size/2,size/2);const r=size*.22;x.fillStyle=petal;
  for(let i=0;i<5;i++){const a=i*TAU/5;x.beginPath();x.ellipse(Math.cos(a)*r,Math.sin(a)*r,r*.95,r*.7,a,0,TAU);x.fill()}
  x.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<5;i++){const a=i*TAU/5;x.beginPath();x.ellipse(Math.cos(a)*r*1.1,Math.sin(a)*r*1.1,r*.4,r*.22,a,0,TAU);x.fill()}
  x.fillStyle=center;x.beginPath();x.arc(0,0,r*.55,0,TAU);x.fill()})}

BIS.scene('g1-3',{title:'Rainbow Bubbles',blurb:'Iridescent soap bubbles and butterflies float over a flowery meadow under a soft pastel rainbow and fluffy clouds.',
setup(S){const st=S.state;st.grain=grain(S);
  st.sky=cv(W,H,x=>{x.fillStyle=lg(x,0,760,[[0,'#6fbdf0'],[.5,'#ade0fb'],[.85,'#e8f4fb'],[1,'#fff1e2']]);x.fillRect(0,0,W,H);
    rg(x,320,190,900,[[0,'rgba(255,250,215,.85)'],[.25,'rgba(255,245,210,.35)'],[1,'rgba(255,245,210,0)']]);
    const g=x.createRadialGradient(320,190,0,320,190,95);g.addColorStop(0,'#fffff4');g.addColorStop(1,'#fff1b0');x.fillStyle=g;x.beginPath();x.arc(320,190,95,0,TAU);x.fill()});
  st.rays=cv(1600,1600,x=>{x.translate(800,800);for(let i=0;i<16;i++){const a=i*TAU/16+S.R(-.06,.06),w=S.R(.03,.07),g=x.createRadialGradient(0,0,90,0,0,800);g.addColorStop(0,'rgba(255,255,230,.6)');g.addColorStop(1,'rgba(255,255,230,0)');x.fillStyle=g;x.beginPath();x.moveTo(0,0);x.arc(0,0,800,a-w,a+w);x.closePath();x.fill()}});
  st.rainbow=cv(W,H,x=>{const cols=['#ff9aa8','#ffc38c','#fff09a','#aeea9e','#93d6ff','#a9a8ff','#dda8ff'];x.filter='blur(7px)';x.globalAlpha=.75;
    cols.forEach((col,i)=>{x.strokeStyle=col;x.lineWidth=30;x.beginPath();x.arc(980,1010,810-i*27,Math.PI,TAU);x.stroke()});
    x.filter='blur(30px)';x.globalAlpha=.3;x.strokeStyle='#ffffff';x.lineWidth=60;x.beginPath();x.arc(980,1010,600,Math.PI,TAU);x.stroke()});
  st.land=cv(W,H,x=>{const fA=ridge(S,760,170,3,true);fillRidge(x,fA,lg(x,560,760,['#aab7ea','#d6dcf6']));
    x.fillStyle=lg(x,640,770,['rgba(240,244,255,0)','rgba(245,247,255,.7)']);x.fillRect(0,640,W,130);
    const bank=(px,py,w,h)=>{const img=fluffy(S,w,h,'#c9d0f0');x.drawImage(img,px-w/2,py-h*.8)};
    bank(170,800,720,330);bank(1760,800,720,330);bank(560,790,420,170);bank(1380,790,440,180);
    const fM=ridge(S,820,70,3);fillRidge(x,fM,lg(x,740,830,['#9edbb0','#b9e8c2']));
    x.fillStyle='#7fcb98';for(let i=0;i<30;i++){const px=S.R(0,W),r=S.R(10,22);x.beginPath();x.arc(px,fM(px)-r*.5,r,0,TAU);x.fill()}
    const fN=px=>930-110*Math.pow(Math.abs(px-960)/960,1.6)+12*Math.sin(px*.009+1)+6*Math.sin(px*.03);
    fillRidge(x,fN,lg(x,820,1080,['#72c98c','#3f9b62']));
    x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=3;x.beginPath();for(let px=0;px<=W;px+=6)px?x.lineTo(px,fN(px)):x.moveTo(px,fN(px));x.stroke();
    x.lineCap='round';for(let i=0;i<900;i++){const px=S.R(0,W),y=S.R(fN(px)+4,1080),l=S.R(8,22)*(.6+(y-820)/260);x.strokeStyle=S.pick(['#4fae6f','#5fbf7c','#3e9860','#86d49b']);x.lineWidth=S.R(1.5,3);x.beginPath();x.moveTo(px,y);x.quadraticCurveTo(px+S.R(-5,5),y-l*.6,px+S.R(-8,8),y-l);x.stroke()}
    const fl=[['#ffb3c7','#ffe27a'],['#ffffff','#ffd25e'],['#d9b8ff','#fff3a6'],['#ffd1a1','#ff8fa8'],['#a8dcff','#ffffff']];
    for(let i=0;i<260;i++){const px=S.R(0,W),side=Math.abs(px-960)/960,y=S.R(fN(px)+8,1078);if(side<.25&&S.rnd()<.6)continue;const k=S.pick(fl),r=S.R(4,10)*(.5+(y-820)/260);
      x.fillStyle=k[0];for(let j=0;j<5;j++){const a=j*TAU/5;x.beginPath();x.arc(px+Math.cos(a)*r,y+Math.sin(a)*r*.8,r*.75,0,TAU);x.fill()}x.fillStyle=k[1];x.beginPath();x.arc(px,y,r*.5,0,TAU);x.fill()}});
  st.dcl=[];[[300,330,420,150],[1250,110,520,170],[1650,380,360,130],[760,250,300,110]].forEach((d,i)=>st.dcl.push({x:d[0],y:d[1],img:fluffy(S,d[2],d[3],'#d6dcf5'),sec:i%2?162:324}));
  st.heartCloud=cv(360,320,x=>{x.translate(180,190);const k=120,bz=(a,b,c,d,t)=>{const u=1-t;return u*u*u*a+3*u*u*t*b+3*u*t*t*c+t*t*t*d},pts=[];
    for(let t=0;t<1;t+=1/14){pts.push([bz(0,-1.1*k,-.55*k,0,t),bz(.35*k,-.35*k,-1.15*k,-.55*k,t)]);pts.push([bz(0,.55*k,1.1*k,0,t),bz(-.55*k,-1.15*k,-.35*k,.35*k,t)])}
    x.fillStyle='#dfe2f7';x.fill(S.heartPath(k));x.translate(0,-6);
    const g=x.createLinearGradient(0,-140,0,40);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#f6f2fd');x.fillStyle=g;x.fill(S.heartPath(k*.97));
    for(const q of pts){const r=S.R(13,20);x.beginPath();x.arc(q[0]*.93,q[1]*.93-6,r,0,TAU);x.fill()}
    x.fillStyle='rgba(255,170,200,.3)';x.beginPath();x.ellipse(-38,-30,16,9,0,0,TAU);x.ellipse(38,-30,16,9,0,0,TAU);x.fill()});
  st.hc=[{x:900,y:170,s:.85,sec:162},{x:100,y:70,s:.6,sec:324}];
  st.bub=bubbleSpr();st.bb=[];for(let i=0;i<34;i++){const side=S.rnd()<.75;const x=side?(S.rnd()<.5?S.R(30,640):S.R(1280,1890)):S.R(640,1280);st.bb.push({x,y:S.R(0,H),r:side?S.R(30,110):S.R(20,55),sec:S.R(50,110),sw:S.R(20,60),ss:S.R(8,18),o:S.R(0,1),rs:S.R(20,54),wb:S.R(2.5,4.5)})}
  st.spark=sparkSpr('255,250,230');st.tw=[];for(let i=0;i<26;i++){const a=S.R(Math.PI*1.05,Math.PI*1.95),r=S.R(620,850);st.tw.push({x:980+Math.cos(a)*r,y:1010+Math.sin(a)*r,s:S.R(22,50),sec:S.R(4,9),o:S.R(0,1)})}
  st.fls=[flowerSpr(S,'#ffb3c7','#ffe27a'),flowerSpr(S,'#ffffff','#ffcf4d'),flowerSpr(S,'#d6b4ff','#fff3a6'),flowerSpr(S,'#ffcf9e','#ff8fa8')];
  st.big=[];[[60,1080,220],[150,1080,170],[240,1080,250],[350,1085,150],[1570,1085,150],[1680,1080,240],[1780,1080,180],[1870,1080,230],[480,1090,110],[1440,1090,110]].forEach((d,i)=>st.big.push({x:d[0],y:d[1],l:d[2],k:i%4,s:S.R(60,95),o:S.R(0,1),sec:S.R(6,10)}));
  st.wing=['#ff9ec4','#ffd36e','#9fd4ff'].map(col=>cv(80,80,x=>{x.translate(40,40);x.fillStyle=col;x.beginPath();x.ellipse(-16,-12,20,16,-.5,0,TAU);x.fill();x.beginPath();x.ellipse(-12,12,12,10,.5,0,TAU);x.fill();x.fillStyle='rgba(255,255,255,.55)';x.beginPath();x.arc(-18,-14,6,0,TAU);x.fill()}));
  st.bf=[{cx:520,cy:330,ax:260,ay:120,sx:54,sy:27,k:0,o:.1},{cx:1450,cy:380,ax:240,ay:140,sx:81,sy:23,k:1,o:.6},{cx:1100,cy:180,ax:300,ay:70,sx:162,sy:32,k:2,o:.35}]},
draw(S){const c=S.ctx,st=S.state;
  c.globalAlpha=1;c.globalCompositeOperation='source-over';c.drawImage(st.sky,0,0);
  c.globalCompositeOperation='lighter';c.globalAlpha=.2+.08*S.osc(17);S.at(320,190,.1*S.osc(81),1,()=>c.drawImage(st.rays,-800,-800));
  c.globalCompositeOperation='source-over';c.globalAlpha=.78+.22*S.osc(32);c.drawImage(st.rainbow,0,0);
  c.globalCompositeOperation='lighter';for(const s of st.tw){const t=S.pulse(s.sec,s.o,4);if(t<.02)continue;c.globalAlpha=t;const z=s.s*(.4+.7*t);c.drawImage(st.spark,s.x-z/2,s.y-z/2,z,z)}
  c.globalCompositeOperation='source-over';
  for(const d of st.dcl){const w=d.img.width;c.globalAlpha=.95;c.drawImage(d.img,S.wrap(d.x,d.sec,W,w,1),d.y+8*S.osc(36,d.x/900))}
  for(const h of st.hc){const w=360*h.s;c.globalAlpha=.95;c.drawImage(st.heartCloud,S.wrap(h.x,h.sec,W,w,1)-w/2,h.y+10*S.osc(24,h.x/700),w,320*h.s)}
  c.globalAlpha=1;c.drawImage(st.land,0,0);
  for(const b of st.bf){const x=b.cx+b.ax*S.osc(b.sx,b.o),y=b.cy+b.ay*S.osc(b.sy,b.o+.2),f=Math.abs(S.osc(.7,b.o))*.8+.2,lean=.25*S.osc(b.sx,b.o+.25);
    S.at(x,y,lean,1.7,()=>{c.save();c.scale(f,1);c.drawImage(st.wing[b.k],-40,-40);c.restore();c.save();c.scale(-f,1);c.drawImage(st.wing[b.k],-40,-40);c.restore();c.fillStyle='#5a4a6e';c.beginPath();c.ellipse(0,0,3.5,14,0,0,TAU);c.fill()})}
  for(const b of st.bb){const y=S.wrap(b.y,b.sec,H,130,-1),x=b.x+b.sw*S.osc(b.ss,b.o),wb=.035*S.osc(b.wb,b.o),r=b.r;c.globalAlpha=Math.min(1,Math.max(0,(H+60-y)/260));
    S.at(x,y,TAU*S.saw(b.rs,b.o),[1+wb,1-wb],()=>c.drawImage(st.bub,-r*1.085,-r*1.085,r*2.17,r*2.17))}
  c.globalAlpha=1;c.lineCap='round';
  for(const f of st.big){const a=.07*S.osc(f.sec,f.o),tx=f.x+Math.sin(a)*f.l,ty=f.y-Math.cos(a)*f.l;c.strokeStyle='#3f9a5e';c.lineWidth=5;c.beginPath();c.moveTo(f.x,f.y);c.quadraticCurveTo(f.x+Math.sin(a)*f.l*.3+10,f.y-f.l*.5,tx,ty);c.stroke();
    c.fillStyle='#4fae6f';S.at(f.x+Math.sin(a)*f.l*.4,f.y-f.l*.4,-.6+a,1,()=>{c.beginPath();c.ellipse(14,0,18,7,0,0,TAU);c.fill()});
    S.at(tx,ty,a*2+f.o*TAU,1,()=>c.drawImage(st.fls[f.k],-f.s/2,-f.s/2,f.s,f.s))}
  drawGrain(S)}});
})();
