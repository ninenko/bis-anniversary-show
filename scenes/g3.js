/* Grade 3 — "Somewhere Only We Know" — theme: Dreams. Loop 111 s. */
(function(){
const TAU=Math.PI*2,W=1920,H=1080;
function cv(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');if(fn)fn(x,w,h);return c}
function glowSpr(r,g,b,a=1,size=128,mid=.35){return cv(size,size,(x,w)=>{const gr=x.createRadialGradient(w/2,w/2,0,w/2,w/2,w/2);gr.addColorStop(0,`rgba(${r},${g},${b},${a})`);gr.addColorStop(mid,`rgba(${r},${g},${b},${a*.3})`);gr.addColorStop(1,`rgba(${r},${g},${b},0)`);x.fillStyle=gr;x.fillRect(0,0,w,w)})}
function sparkSpr(r,g,b){return cv(96,96,(x)=>{const gr=x.createRadialGradient(48,48,0,48,48,48);gr.addColorStop(0,`rgba(${r},${g},${b},1)`);gr.addColorStop(.12,`rgba(${r},${g},${b},.6)`);gr.addColorStop(.4,`rgba(${r},${g},${b},.1)`);gr.addColorStop(1,`rgba(${r},${g},${b},0)`);x.fillStyle=gr;x.fillRect(0,0,96,96);
  x.fillStyle=`rgba(${r},${g},${b},.8)`;x.beginPath();x.moveTo(48,2);x.lineTo(50,46);x.lineTo(94,48);x.lineTo(50,50);x.lineTo(48,94);x.lineTo(46,50);x.lineTo(2,48);x.lineTo(46,46);x.closePath();x.fill()})}
// bake fine film grain into an offscreen layer (setup only)
function grain(S,x,w,h,a=.05){const n=cv(256,256,(g)=>{const id=g.createImageData(256,256);for(let i=0;i<id.data.length;i+=4){const v=S.rnd()*255;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=255}g.putImageData(id,0,0)});
  x.save();x.globalAlpha=a;x.globalCompositeOperation='overlay';x.fillStyle=x.createPattern(n,'repeat');x.fillRect(0,0,w,h);x.restore()}
function grad(x,x0,y0,x1,y1,stops){const g=x.createLinearGradient(x0,y0,x1,y1);stops.forEach(([o,c])=>g.addColorStop(o,c));return g}
// gaussian-ish random in -1..1
const gs=S=>(S.R(-1,1)+S.R(-1,1)+S.R(-1,1))/3;
// pine silhouette
function pine(x,cx,b,h){const w=h*.32;x.beginPath();x.moveTo(cx,b-h);const n=6;for(let k=0;k<n;k++){const yy=b-h+h*(k+1)/n*.92,ww=w*(k+1)/n;x.lineTo(cx+ww,yy);x.lineTo(cx+ww*.45,yy-h*.03)}
  x.lineTo(cx+w*.07,b);x.lineTo(cx-w*.07,b);for(let k=n-1;k>=0;k--){const yy=b-h+h*(k+1)/n*.92,ww=w*(k+1)/n;x.lineTo(cx-ww*.45,yy-h*.03);x.lineTo(cx-ww,yy)}x.closePath();x.fill()}

/* ============ 1. Dream Tree ============ */
BIS.scene('g3-1',{title:'Dream Tree',blurb:'A great old tree with a swing and glowing lights stands on a moonlit hill under the Milky Way, with fireflies and drifting dandelion seeds.',
setup(S){const st=S.state,mx=520,my=280;st.mx=mx;st.my=my;
 // --- sky, milky way, moon, far mountains
 st.bg=cv(W,H,(x)=>{
  x.fillStyle=grad(x,0,0,0,H,[[0,'#050920'],[.38,'#111946'],[.6,'#262863'],[.74,'#46397a'],[.86,'#7a5288'],[1,'#a86c8a']]);x.fillRect(0,0,W,H);
  x.globalCompositeOperation='lighter';
  const ax=760,ay=-80,bx=1980,by=640,len=Math.hypot(bx-ax,by-ay),nx=-(by-ay)/len,ny=(bx-ax)/len;
  const blobs=[glowSpr(120,110,230,1,256),glowSpr(200,130,210,1,256),glowSpr(110,160,230,1,256)];
  for(let i=0;i<60;i++){const t=S.R(0,1),o=gs(S)*170,px=ax+(bx-ax)*t+nx*o,py=ay+(by-ay)*t+ny*o,r=S.R(120,320);x.globalAlpha=S.R(.05,.13);x.drawImage(blobs[i%3],px-r,py-r,2*r,2*r)}
  for(let i=0;i<2600;i++){const t=S.R(0,1),o=gs(S)*200,px=ax+(bx-ax)*t+nx*o,py=ay+(by-ay)*t+ny*o,s=S.R(.6,1.9);x.globalAlpha=S.R(.15,.75);x.fillStyle=S.pick(['#ffffff','#dfe4ff','#ffe9f4']);x.fillRect(px,py,s,s)}
  // dark dust lane
  x.globalCompositeOperation='source-over';
  for(let i=0;i<30;i++){const t=S.R(.1,.95),o=gs(S)*40,px=ax+(bx-ax)*t+nx*o,py=ay+(by-ay)*t+ny*o,r=S.R(50,120);const g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,'rgba(8,10,35,.35)');g.addColorStop(1,'rgba(8,10,35,0)');x.fillStyle=g;x.fillRect(px-r,py-r,2*r,2*r)}
  for(let i=0;i<500;i++){x.globalAlpha=S.R(.2,.8);const s=S.R(.8,2);x.fillStyle='#fff';x.fillRect(S.R(0,W),S.R(0,700)*S.R(.3,1),s,s)}
  x.globalAlpha=1;
  // moon halo + disc
  let g=x.createRadialGradient(mx,my,0,mx,my,760);g.addColorStop(0,'rgba(200,205,255,.5)');g.addColorStop(.18,'rgba(160,170,255,.22)');g.addColorStop(.5,'rgba(130,120,220,.07)');g.addColorStop(1,'rgba(120,100,200,0)');x.fillStyle=g;x.fillRect(0,0,W,H);
  g=x.createRadialGradient(mx-40,my-40,10,mx,my,128);g.addColorStop(0,'#fffef4');g.addColorStop(.7,'#f6efd2');g.addColorStop(1,'#e2d8bc');x.fillStyle=g;x.beginPath();x.arc(mx,my,125,0,TAU);x.fill();
  x.fillStyle='rgba(170,160,140,.22)';[[-30,-20,30],[40,25,22],[10,55,16],[-55,35,14],[50,-45,12],[-10,-70,10]].forEach(([dx,dy,r])=>{x.beginPath();x.arc(mx+dx,my+dy,r,0,TAU);x.fill()});
  // far mountains with haze
  const ridge=(base,amps,c1,c2)=>{const ph=amps.map(()=>S.R(0,TAU));x.beginPath();x.moveTo(0,H);for(let px=0;px<=W;px+=12){let y=base;amps.forEach(([a,f],i)=>y-=a*Math.pow(Math.abs(Math.sin(px*f+ph[i])),1.3));x.lineTo(px,y)}x.lineTo(W,H);x.closePath();x.fillStyle=grad(x,0,base-160,0,base+80,[[0,c1],[1,c2]]);x.fill()};
  ridge(720,[[90,.0021],[40,.006],[10,.02]],'#5a4a8c','#3d3474');
  x.fillStyle=grad(x,0,560,0,800,[[0,'rgba(190,140,200,0)'],[1,'rgba(190,140,200,.35)']]);x.fillRect(0,560,W,240);
  ridge(780,[[60,.003],[30,.008],[8,.03]],'#3a3170','#2a2560');
  grain(S,x,W,H,.035)});
 // --- left mid hill with little trees
 st.mid=cv(W,H,(x)=>{x.beginPath();x.moveTo(0,H);x.lineTo(0,790);x.bezierCurveTo(260,760,560,790,860,835);x.bezierCurveTo(1100,870,1300,880,1600,900);x.lineTo(1600,H);x.closePath();
  x.fillStyle=grad(x,0,760,0,950,[[0,'#2a2560'],[1,'#17163f']]);x.fill();
  x.fillStyle='#1d1a4c';for(let i=0;i<14;i++){const tx=S.R(40,800),ty=790+(tx/860)*40-4;const h=S.R(30,70);pine(x,tx,ty+6,h)}
  x.strokeStyle='rgba(180,170,255,.25)';x.lineWidth=2;x.beginPath();x.moveTo(0,790);x.bezierCurveTo(260,760,560,790,860,835);x.stroke()});
 // --- tree hill + tree
 const ends=[],clumps=[];
 st.tree=cv(W,H,(x)=>{
  const top=new Path2D();top.moveTo(560,H);top.bezierCurveTo(700,900,950,790,1250,772);top.bezierCurveTo(1450,758,1700,748,1920,768);
  const hill=new Path2D(top);hill.lineTo(1920,H);hill.closePath();
  x.fillStyle=grad(x,0,750,0,H,[[0,'#16154a'],[.4,'#0d0d30'],[1,'#07071c']]);x.fill(hill);
  x.strokeStyle='rgba(170,165,255,.35)';x.lineWidth=3;x.stroke(top);
  // grass tufts on hill crest
  x.fillStyle='#0e0e32';for(let i=0;i<260;i++){const px=S.R(700,1920),py=px<1250?900-(px-700)/550*128:772-(px-1250)/670*10;const h=S.R(6,22);x.beginPath();x.moveTo(px-2,py+4);x.lineTo(px+S.R(-4,4),py-h);x.lineTo(px+2,py+4);x.fill()}
  // trunk + branches
  x.strokeStyle='#0a0a24';x.lineCap='round';
  const br=(x0,y0,ang,len,w,d)=>{const x1=x0+Math.cos(ang)*len,y1=y0+Math.sin(ang)*len;x.lineWidth=w;x.beginPath();x.moveTo(x0,y0);x.quadraticCurveTo((x0+x1)/2+S.R(-len*.12,len*.12),(y0+y1)/2+S.R(-len*.08,len*.08),x1,y1);x.stroke();
   if(d<=0){ends.push([x1,y1]);return}const n=d>3?2:S.RI(2,3);for(let i=0;i<n;i++){let a=ang+(i-(n-1)/2)*S.R(.45,.75)+S.R(-.15,.15);a=Math.max(-Math.PI+.25,Math.min(-.25,a));br(x1,y1,a,len*S.R(.68,.82),w*.64,d-1);if(d<=2)ends.push([x1,y1])}};
  // roots / trunk flare
  x.fillStyle='#0a0a24';x.beginPath();x.moveTo(1440,790);x.quadraticCurveTo(1500,770,1498,700);x.lineTo(1545,700);x.quadraticCurveTo(1545,770,1610,792);x.closePath();x.fill();
  br(1522,790,-Math.PI/2-.04,200,66,5);
  // swing limb
  x.fillStyle='#0a0a24';x.beginPath();x.moveTo(1515,640);x.quadraticCurveTo(1330,598,1150,606);x.quadraticCurveTo(1330,622,1512,676);x.closePath();x.fill();
  x.strokeStyle='rgba(150,145,240,.35)';x.lineWidth=2;x.beginPath();x.moveTo(1500,642);x.quadraticCurveTo(1330,600,1155,606);x.stroke();
  // foliage clumps
  for(const [ex,ey] of ends){const n=S.RI(1,3);for(let k=0;k<n;k++)clumps.push([ex+S.R(-45,45),ey+S.R(-35,25),S.R(34,64)])}
  const sub=[];for(const [cx,cy,r] of clumps.slice())for(let k=0;k<5;k++){const a=S.R(0,TAU);sub.push([cx+Math.cos(a)*r*.95,cy+Math.sin(a)*r*.85,r*S.R(.28,.42)])}clumps.push(...sub);
  for(const [cx,cy,r] of clumps){x.fillStyle='#3e3b8c';x.beginPath();x.arc(cx-10,cy-8,r,0,TAU);x.fill()}
  for(const [cx,cy,r] of clumps){x.fillStyle='#1e1d55';x.beginPath();x.arc(cx-4,cy-3,r,0,TAU);x.fill()}
  for(const [cx,cy,r] of clumps){x.fillStyle='#0c0c2a';x.beginPath();x.arc(cx+2,cy+2,r*.97,0,TAU);x.fill()}
  // leaf speckle on edges
  for(const [cx,cy,r] of clumps)for(let k=0;k<4;k++){const a=S.R(Math.PI*.9,Math.PI*1.6),rr=r*S.R(.85,1.1);x.fillStyle='#34327a';x.globalAlpha=.5;x.beginPath();x.ellipse(cx+Math.cos(a)*rr-6,cy+Math.sin(a)*rr-6,5,3,a,0,TAU);x.fill()}
  x.globalAlpha=1;
  grain(S,x,W,H,.05)});
 // hanging lights from lowest clumps
 const low=clumps.filter(c=>c[0]>1180&&c[0]<1860).sort((a,b)=>(b[1]+b[2])-(a[1]+a[2]));st.lights=[];
 for(const c of low){if(st.lights.length>=11)break;if(st.lights.some(l=>Math.abs(l.x-c[0])<55))continue;if(Math.abs(c[0]-1240)<70)continue;st.lights.push({x:c[0],y:c[1]+c[2]*.7,len:S.R(25,75),o:S.R(0,1),sec:S.R(5,9),ps:S.R(3,6)})}
 // foreground
 st.fg=cv(W,H,(x)=>{const top=[];for(let px=0;px<=W;px+=20)top.push([px,985+18*Math.sin(px*.004+1)+8*Math.sin(px*.013)+(px<300?(300-px)*.25*-1:0)+(px>1650?-(px-1650)*.18:0)]);
  x.beginPath();x.moveTo(0,H);top.forEach(([a,b])=>x.lineTo(a,b));x.lineTo(W,H);x.closePath();x.fillStyle='#05061a';x.fill();
  x.fillStyle='#05061a';for(let i=0;i<700;i++){const px=S.R(0,W),k=Math.floor(px/20),py=top[Math.min(k,top.length-1)][1]+4,side=Math.max(0,1-Math.min(px,W-px)/420);const h=S.R(8,30)+side*S.R(30,130);const lean=S.R(-.25,.25)*h;
   x.beginPath();x.moveTo(px-2.5,py);x.quadraticCurveTo(px+lean*.3,py-h*.6,px+lean,py-h);x.quadraticCurveTo(px+lean*.3+1,py-h*.6,px+2.5,py);x.fill()}
  // dandelions at the sides
  const dand=(dx,dy,h,r)=>{x.strokeStyle='#05061a';x.lineWidth=3;x.beginPath();x.moveTo(dx,dy);x.quadraticCurveTo(dx+10,dy-h*.5,dx+4,dy-h);x.stroke();
   x.strokeStyle='rgba(200,195,255,.55)';x.lineWidth=1;for(let i=0;i<40;i++){const a=i/40*TAU;x.beginPath();x.moveTo(dx+4,dy-h);x.lineTo(dx+4+Math.cos(a)*r,dy-h+Math.sin(a)*r);x.stroke()}
   x.fillStyle='rgba(225,220,255,.75)';for(let i=0;i<40;i++){const a=i/40*TAU;x.beginPath();x.arc(dx+4+Math.cos(a)*r,dy-h+Math.sin(a)*r,1.8,0,TAU);x.fill()}};
  dand(120,1000,230,26);dand(220,1010,170,20);dand(1760,1000,250,28);dand(1850,1015,180,22);dand(60,1030,120,16);
  grain(S,x,W,H,.04)});
 // clouds
 st.cloud=[0,1,2].map(i=>cv(1000,260,(x)=>{for(let k=0;k<22;k++){const px=S.R(150,850),py=130+gs(S)*50,r=S.R(50,120);x.save();x.translate(px,py);x.scale(2.2,.6);const g=x.createRadialGradient(0,0,0,0,0,r);g.addColorStop(0,'rgba(190,180,250,.14)');g.addColorStop(1,'rgba(190,180,250,0)');x.fillStyle=g;x.fillRect(-r,-r,2*r,2*r);x.restore()}}));
 st.clouds=[{k:0,x:200,y:200,dir:1,a:.9},{k:1,x:1300,y:390,dir:1,a:.7},{k:2,x:900,y:110,dir:-1,a:.5}];
 st.star=[];for(let i=0;i<150;i++){let px,py;do{px=S.R(0,W);py=S.R(0,680)}while(Math.hypot(px-mx,py-my)<200);st.star.push({x:px,y:py,s:S.R(2,4),sec:S.R(4,11),o:S.R(0,1),big:i<22})}
 st.spk=sparkSpr(235,235,255);st.warm=glowSpr(255,205,130,1);st.fly=glowSpr(255,236,140,1);st.seedG=glowSpr(220,220,255,1,64);
 st.flies=[];for(let i=0;i<46;i++){const right=i<28;st.flies.push({x:right?S.R(1050,1900):S.R(60,900),y:right?S.R(560,960):S.R(820,1040),ax:S.R(25,80),ay:S.R(15,50),sx:S.R(9,19),sy:S.R(8,16),o:S.R(0,1),o2:S.R(0,1),ts:S.R(3,6)})}
 st.seeds=[];for(let i=0;i<26;i++)st.seeds.push({x:S.R(0,W),y:S.R(150,950),sec:111/S.RI(1,2),o:S.R(0,1),amp:S.R(20,60),ws:S.R(8,16),r:S.R(7,12)});
 st.mist=[];st.mspr=cv(256,128,(x)=>{x.scale(1,.5);const g=x.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,'rgba(200,180,255,1)');g.addColorStop(1,'rgba(200,180,255,0)');x.fillStyle=g;x.fillRect(0,0,256,256)});
 for(let i=0;i<9;i++)st.mist.push({x:S.R(0,W),y:S.R(770,880),w:S.R(700,1200),h:S.R(80,150),sec:111,dir:i%2?1:-1,a:S.R(.12,.22)});
 st.shoot=[{sec:37,off:.15,x:1150,y:120,len:340,ang:.48},{sec:55.5,off:.62,x:1500,y:60,len:300,ang:.55}]},
draw(S){const c=S.ctx,st=S.state;
 c.drawImage(st.bg,0,0);
 // moon breathing glow
 S.glow(st.mx,st.my,420,'rgba(210,210,255,.22)',.6+.4*S.osc(18.5));
 // stars
 for(const s of st.star){const t=.3+.7*S.osc01(s.sec,s.o);if(s.big){c.globalAlpha=t;const r=10+10*t;c.drawImage(st.spk,s.x-r,s.y-r,2*r,2*r)}else{c.globalAlpha=t*.9;c.fillStyle='#fff';c.fillRect(s.x,s.y,s.s*.7,s.s*.7)}}
 c.globalAlpha=1;
 // shooting stars
 for(const s of st.shoot){const t=S.saw(s.sec,s.off);if(t>.06)continue;const u=t/.06,hx=s.x+Math.cos(s.ang)*s.len*u*1.4,hy=s.y+Math.sin(s.ang)*s.len*u*1.4,a=Math.sin(u*Math.PI);
  const tx=hx-Math.cos(s.ang)*s.len*.7,ty=hy-Math.sin(s.ang)*s.len*.7;const gr=c.createLinearGradient(tx,ty,hx,hy);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(1,`rgba(255,250,235,${a})`);c.strokeStyle=gr;c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(tx,ty);c.lineTo(hx,hy);c.stroke();
  c.globalAlpha=a;c.drawImage(st.warm,hx-24,hy-24,48,48);c.globalAlpha=1}
 // clouds
 for(const k of st.clouds){const x=S.wrap(k.x,111,W,1000,k.dir);c.globalAlpha=k.a;c.drawImage(st.cloud[k.k],x-500,k.y-130)}c.globalAlpha=1;
 // mist + mid hill
 for(let i=0;i<5;i++){const m=st.mist[i],x=S.wrap(m.x,m.sec,W,m.w/2,m.dir);c.globalAlpha=m.a;c.drawImage(st.mspr,x-m.w/2,m.y-m.h/2,m.w,m.h)}c.globalAlpha=1;
 c.drawImage(st.mid,0,0);
 for(let i=5;i<9;i++){const m=st.mist[i],x=S.wrap(m.x,m.sec,W,m.w/2,m.dir);c.globalAlpha=m.a*.8;c.drawImage(st.mspr,x-m.w/2,m.y+40-m.h/2,m.w,m.h)}c.globalAlpha=1;
 c.drawImage(st.tree,0,0);
 // swing
 const sa=.09*S.osc(6.94);
 S.at(1240,613,sa,1,()=>{c.strokeStyle='#0a0a24';c.lineWidth=3;c.beginPath();c.moveTo(-28,0);c.lineTo(-34,140);c.moveTo(28,0);c.lineTo(34,140);c.stroke();
  c.strokeStyle='rgba(170,165,255,.4)';c.lineWidth=1.2;c.beginPath();c.moveTo(-29,0);c.lineTo(-35,140);c.stroke();
  c.fillStyle='#0a0a24';c.fillRect(-46,138,92,10);c.fillStyle='rgba(170,165,255,.45)';c.fillRect(-46,138,92,2)});
 // hanging lights
 c.globalCompositeOperation='lighter';
 for(const l of st.lights){const a=.12*S.osc(l.sec,l.o),bx=l.x+Math.sin(a)*l.len,by=l.y+Math.cos(a)*l.len,p=.55+.45*S.osc01(l.ps,l.o);
  c.globalCompositeOperation='source-over';c.strokeStyle='rgba(30,28,70,.9)';c.lineWidth=1.2;c.beginPath();c.moveTo(l.x,l.y);c.lineTo(bx,by);c.stroke();c.globalCompositeOperation='lighter';
  c.globalAlpha=.5*p;c.drawImage(st.warm,bx-60,by-60,120,120);c.globalAlpha=p;c.drawImage(st.warm,bx-16,by-16,32,32);c.fillStyle='#fff3cf';c.beginPath();c.arc(bx,by,3.5,0,TAU);c.fill()}
 c.globalAlpha=1;c.globalCompositeOperation='source-over';
 c.drawImage(st.fg,0,0);
 // fireflies + seeds
 c.globalCompositeOperation='lighter';
 for(const f of st.flies){const x=f.x+f.ax*S.osc(f.sx,f.o),y=f.y+f.ay*S.osc(f.sy,f.o2),a=Math.pow(S.osc01(f.ts,f.o),2);c.globalAlpha=.12+.88*a;const r=10+14*a;c.drawImage(st.fly,x-r,y-r,2*r,2*r)}
 for(const s of st.seeds){const t=S.saw(s.sec,s.o),x=S.wrap(s.x,s.sec,W,60,1)+s.amp*S.osc(s.ws,s.o),y=s.y-120*t+30*S.osc(s.ws*1.3,s.o);c.globalAlpha=.7*Math.sin(t*Math.PI);
  c.drawImage(st.seedG,x-s.r*2,y-s.r*2,s.r*4,s.r*4);c.strokeStyle='rgba(235,235,255,.7)';c.lineWidth=1;c.beginPath();for(let k=0;k<6;k++){const a=k/6*Math.PI-Math.PI;c.moveTo(x,y);c.lineTo(x+Math.cos(a)*s.r,y+Math.sin(a)*s.r)}c.moveTo(x,y);c.lineTo(x,y+s.r*1.4);c.stroke()}
 c.globalAlpha=1;c.globalCompositeOperation='source-over'}});

/* ============ 2. Cloud Islands ============ */
BIS.scene('g3-2',{title:'Cloud Islands',blurb:'Floating islands with a blossom tree, a little cottage and a waterfall drift above a pink sea of clouds at sunrise, with hot-air balloons and birds.',
setup(S){const st=S.state,sx=980,sy=610;st.sx=sx;st.sy=sy;
 st.sky=cv(W,H,(x)=>{x.fillStyle=grad(x,0,0,0,H,[[0,'#5767b4'],[.25,'#8f8bcf'],[.45,'#d4a6cf'],[.6,'#f7bcb8'],[.72,'#ffd8b8'],[1,'#ffe6c4']]);x.fillRect(0,0,W,H);
  let g=x.createRadialGradient(sx,sy,0,sx,sy,1000);g.addColorStop(0,'rgba(255,248,225,.95)');g.addColorStop(.15,'rgba(255,225,190,.55)');g.addColorStop(.45,'rgba(255,190,180,.18)');g.addColorStop(1,'rgba(255,180,180,0)');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.fillStyle='#fffaf0';x.beginPath();x.arc(sx,sy,95,0,TAU);x.fill();
  // high wispy streaks
  for(let i=0;i<26;i++){const px=S.R(-200,W),py=S.R(60,380),w=S.R(200,600),h=S.R(8,22);x.save();x.translate(px,py);x.rotate(-.04);const gg=x.createLinearGradient(0,0,w,0);gg.addColorStop(0,'rgba(255,220,230,0)');gg.addColorStop(.5,`rgba(255,${S.RI(200,235)},230,${S.R(.12,.3)})`);gg.addColorStop(1,'rgba(255,220,230,0)');x.fillStyle=gg;x.beginPath();x.ellipse(w/2,0,w/2,h,0,0,TAU);x.fill();x.restore()}
  grain(S,x,W,H,.05)});
 st.rays=cv(2200,2200,(x)=>{x.translate(1100,1100);const N=18;for(let i=0;i<N;i++){const a=i/N*TAU,wd=TAU/N*S.R(.25,.5);const g=x.createRadialGradient(0,0,80,0,0,1100);g.addColorStop(0,'rgba(255,248,225,.55)');g.addColorStop(1,'rgba(255,248,225,0)');x.fillStyle=g;x.beginPath();x.moveTo(0,0);x.arc(0,0,1100,a,a+wd);x.closePath();x.fill()}});
 // cloud bank layers (tileable)
 const layer=(h,base,rMin,rMax,n,top,mid,bot,shade)=>cv(W,h,(x)=>{
  const ps=[];for(let i=0;i<n;i++)ps.push({x:S.R(0,W),y:base+S.R(-rMax*.25,rMax*1.1)*S.R(.4,1),r:S.R(rMin,rMax)});for(let px=0;px<W;px+=rMin*1.1)ps.push({x:px+S.R(-10,10),y:base+rMax*.55+S.R(-10,20),r:S.R(rMin,(rMin+rMax)/2)});ps.sort((a,b)=>a.y-b.y);
  // silhouette
  x.fillStyle=mid;x.fillRect(0,base+rMax*.7,W,h);for(const p of ps)for(const o of[-W,0,W]){x.beginPath();x.arc(p.x+o,p.y,p.r,0,TAU);x.fill()}
  // shading painted sharp on a wide canvas, then blurred once
  const t=cv(W*3,h,(y)=>{y.fillStyle=mid;y.fillRect(0,0,W*3,h);for(const p of ps)for(const o of[0,W,2*W]){y.fillStyle=shade;y.beginPath();y.arc(p.x+o,p.y,p.r,0,TAU);y.fill();
    y.fillStyle=top;y.beginPath();y.arc(p.x+o-p.r*.06,p.y-p.r*.14,p.r*.86,0,TAU);y.fill()}
    y.fillStyle=grad(y,0,base,0,h,[[0,'rgba(0,0,0,0)'],[.3,'rgba(0,0,0,0)'],[1,bot]]);y.globalAlpha=.85;y.fillRect(0,0,W*3,h)});
  const b=cv(W*3,h,(y)=>{y.filter='blur('+Math.round(rMin*.22)+'px)';y.drawImage(t,0,0)});
  x.globalCompositeOperation='source-atop';x.drawImage(b,-W,0);x.globalCompositeOperation='source-over';
  grain(S,x,W,h,.03)});
 st.L0=layer(460,90,30,80,110,'#fff2f0','#f1c6d6','#dcb2d8','#e3b4cf');
 st.L1=layer(440,110,45,120,80,'#fff6ee','#f4c3d0','#cba2d0','#dcaacb');
 st.L2=layer(420,120,70,150,55,'#fffbf4','#f3c2d0','#a888c2','#d39fc4');
 st.L3=layer(260,90,80,150,30,'#fff8f8','#efbdd0','#8f74b2','#c895bd');
 // islands
 const island=(w,opt)=>{const cw=Math.round(w*1.5),ch=Math.round(w*1.75),cx=cw/2,ty=w*.62;return {cx,ty,w,c:cv(cw,ch,(x)=>{
  // underside rock
  const L=[],R=[],n=9,depth=w*.95;for(let i=0;i<=n;i++){const t=i/n;L.push([cx-w/2*Math.pow(1-t,.75)+S.R(-10,10)*(1-t)-w*.04*t,ty+depth*Math.pow(t,1.15)+S.R(-8,8)]);R.push([cx+w/2*Math.pow(1-t,.75)+S.R(-10,10)*(1-t)-w*.04*t,ty+depth*Math.pow(t,1.15)+S.R(-8,8)])}
  x.beginPath();x.moveTo(L[0][0],ty);L.forEach(p=>x.lineTo(p[0],p[1]));R.slice().reverse().forEach(p=>x.lineTo(p[0],p[1]));x.closePath();
  x.fillStyle=grad(x,cx-w/2,0,cx+w/2,0,[[0,'#d99a8c'],[.4,'#b4788a'],[1,'#6a4c80']]);x.fill();
  x.save();x.clip();x.fillStyle=grad(x,0,ty,0,ty+depth,[[0,'rgba(60,30,70,0)'],[1,'rgba(60,30,90,.55)']]);x.fillRect(0,ty,cw,depth+20);
  x.strokeStyle='rgba(255,215,200,.35)';x.lineWidth=2;for(let k=1;k<6;k++){const yy=ty+k*depth/7;x.beginPath();x.moveTo(0,yy);for(let px=0;px<=cw;px+=20)x.lineTo(px,yy+6*Math.sin(px*.05+k));x.stroke()}
  x.strokeStyle='rgba(70,40,90,.35)';for(let k=0;k<8;k++){const px=S.R(cx-w/2,cx+w/2),py=ty+S.R(10,depth*.5);x.beginPath();x.moveTo(px,py);x.lineTo(px+S.R(-15,15),py+S.R(20,60));x.stroke()}x.restore();
  // hanging vines
  for(let k=0;k<opt.vines;k++){const px=S.R(cx-w*.45,cx+w*.4),len=S.R(30,w*.35);x.strokeStyle='#5f9f80';x.lineWidth=2;x.beginPath();x.moveTo(px,ty+4);x.quadraticCurveTo(px+8,ty+len/2,px+2,ty+len);x.stroke();x.fillStyle='#86c79a';for(let j=10;j<len;j+=12){x.beginPath();x.ellipse(px+4+(j%24?4:-4),ty+j,4,2.5,.5,0,TAU);x.fill()}}
  // grass top
  x.fillStyle='#4f9677';x.beginPath();x.ellipse(cx,ty+6,w/2+8,w*.075,0,0,TAU);x.fill();
  x.fillStyle=grad(x,0,ty-w*.07,0,ty+w*.06,[[0,'#c8f0b0'],[1,'#7cc493']]);x.beginPath();x.ellipse(cx,ty,w/2+4,w*.07,0,0,TAU);x.fill();
  x.fillStyle='#62ad86';for(let k=0;k<w/5;k++){const a=S.R(.1,Math.PI-.1),px=cx+Math.cos(a)*(w/2+4),py=ty+Math.sin(a)*w*.07;x.beginPath();x.moveTo(px-5,py-2);x.lineTo(px+S.R(-3,3),py+S.R(6,16));x.lineTo(px+5,py-2);x.fill()}
  // bushes
  for(let k=0;k<opt.bush;k++){const px=S.R(cx-w*.42,cx+w*.42),py=ty-2,r=S.R(w*.03,w*.06);x.fillStyle='#5aa77e';x.beginPath();x.arc(px,py,r,Math.PI,0);x.fill();x.fillStyle='#9ad8a4';x.beginPath();x.arc(px-r*.25,py-r*.25,r*.55,Math.PI,0);x.fill()}
  // cottage
  if(opt.house){const hx=cx+w*.12,hy=ty-2,hw=w*.16,hh=w*.12;x.fillStyle='#f5e4d2';x.fillRect(hx-hw/2,hy-hh,hw,hh);x.fillStyle='#d9bfae';x.fillRect(hx+hw*.1,hy-hh,hw*.4,hh);
   x.fillStyle='#b65a7a';x.beginPath();x.moveTo(hx-hw*.62,hy-hh+2);x.lineTo(hx,hy-hh-hw*.55);x.lineTo(hx+hw*.62,hy-hh+2);x.closePath();x.fill();x.fillStyle='#8e4466';x.beginPath();x.moveTo(hx,hy-hh-hw*.55);x.lineTo(hx+hw*.62,hy-hh+2);x.lineTo(hx+hw*.2,hy-hh+2);x.closePath();x.fill();
   x.fillStyle='#9a5a6a';x.fillRect(hx+hw*.22,hy-hh-hw*.5,hw*.1,hw*.3);
   x.fillStyle='#ffd27a';x.fillRect(hx-hw*.32,hy-hh*.65,hw*.22,hw*.22);x.fillStyle='#7a4a5a';x.fillRect(hx+hw*.08,hy-hh*.6,hw*.18,hh*.6)}
  // blossom tree
  if(opt.tree){const tx=cx-w*opt.tree,tb=ty+2,th=w*.42;x.strokeStyle='#6d4a5e';x.lineCap='round';x.lineWidth=w*.035;x.beginPath();x.moveTo(tx,tb);x.quadraticCurveTo(tx+w*.03,tb-th*.5,tx-w*.01,tb-th*.8);x.stroke();
   x.lineWidth=w*.015;x.beginPath();x.moveTo(tx,tb-th*.45);x.lineTo(tx-w*.12,tb-th*.8);x.moveTo(tx+w*.01,tb-th*.55);x.lineTo(tx+w*.13,tb-th*.85);x.stroke();
   const bl=[];for(let k=0;k<30;k++)bl.push([tx+gs(S)*w*.3,tb-th*.9+gs(S)*w*.16,S.R(w*.04,w*.075)]);
   for(const [a,b,r] of bl){x.fillStyle='#d4789e';x.beginPath();x.arc(a+r*.15,b+r*.2,r,0,TAU);x.fill()}
   for(const [a,b,r] of bl){x.fillStyle='#f7a9c2';x.beginPath();x.arc(a,b,r*.88,0,TAU);x.fill()}
   for(const [a,b,r] of bl){x.fillStyle='#ffe0ea';x.beginPath();x.arc(a-r*.25,b-r*.3,r*.45,0,TAU);x.fill()}}
 })}};
 st.isl=[{...island(560,{vines:9,bush:7,house:1,tree:.24}),x:1360,y:300,bob:10,sec:13.875,o:0,a:1},
  {...island(300,{vines:5,bush:4,tree:.02}),x:380,y:250,bob:14,sec:18.5,o:.3,a:.92},
  {...island(170,{vines:3,bush:3,tree:.05}),x:760,y:160,bob:8,sec:22.2,o:.6,a:.75}];
 // balloons
 const balloon=(c1,c2)=>cv(180,270,(x)=>{const env=new Path2D();env.moveTo(90,200);env.bezierCurveTo(20,160,6,110,6,86);env.arc(90,86,84,Math.PI,0);env.bezierCurveTo(174,110,160,160,90,200);
  x.save();x.clip(env);x.fillStyle=c1;x.fillRect(0,0,180,210);x.fillStyle=c2;for(const k of[1,3,5]){x.beginPath();x.ellipse(90,100,k*14+8,130,0,0,TAU);x.ellipse(90,100,k*14-6,130,0,0,TAU,true);x.fill('evenodd')}
  const g=x.createRadialGradient(60,60,5,90,100,130);g.addColorStop(0,'rgba(255,255,255,.45)');g.addColorStop(.5,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(80,40,110,.45)');x.fillStyle=g;x.fillRect(0,0,180,210);x.restore();
  x.strokeStyle='#6a4a5c';x.lineWidth=1.5;x.beginPath();x.moveTo(62,182);x.lineTo(76,236);x.moveTo(118,182);x.lineTo(104,236);x.stroke();x.fillStyle='#8a5a48';x.fillRect(74,234,32,24);x.fillStyle='#a87258';x.fillRect(74,234,32,5)});
 st.balls=[{c:balloon('#ff8f7e','#ffd59a'),x:300,y:470,s:.75,dir:1,o:.0,a:1},{c:balloon('#76c9c2','#f4f0e0'),x:1500,y:620,s:.5,dir:-1,o:.4,a:.85},{c:balloon('#b48ad8','#ffc6d6'),x:1000,y:230,s:.35,dir:1,o:.7,a:.7}];
 st.mspr=glowSpr(255,255,255,1);st.spk=sparkSpr(255,245,230);
 st.birds=[];for(let i=0;i<7;i++)st.birds.push({dx:S.R(-160,160),dy:S.R(-60,60)+i*8,s:S.R(.7,1.2),o:S.R(0,1)});
 st.pet=[];for(let i=0;i<55;i++)st.pet.push({x:S.R(0,W),y:S.R(80,980),sec:111/S.RI(1,3),o:S.R(0,1),amp:S.R(15,45),ws:S.R(6,12),r:S.R(4,8),rs:S.R(4,9)});
 st.wf=[];for(let i=0;i<14;i++)st.wf.push({dx:S.R(-12,12),o:S.R(0,1),l:S.R(30,80)})},
draw(S){const c=S.ctx,st=S.state;
 c.drawImage(st.sky,0,0);
 c.save();c.globalAlpha=.22+.06*S.osc(27.75);c.translate(st.sx,st.sy);c.rotate(TAU/18*S.saw(111));c.drawImage(st.rays,-1100,-1100);c.restore();
 const tile=(cvs,x,y,a)=>{c.globalAlpha=a;const xx=((x%W)+W)%W;c.drawImage(cvs,xx-W,y);c.drawImage(cvs,xx,y);c.globalAlpha=1};
 const isl=(I)=>{const y=I.y+I.bob*S.osc(I.sec,I.o);c.globalAlpha=I.a;c.drawImage(I.c,I.x-I.cx,y-I.ty);c.globalAlpha=1;return y};
 isl(st.isl[2]);
 tile(st.L0,30*S.osc(111),540,1);
 // far balloon
 const ball=(b)=>{const x=S.wrap(b.x,111,W,120,b.dir),y=b.y+14*S.osc(15.86,b.o);c.globalAlpha=b.a;c.drawImage(b.c,x-90*b.s,y-135*b.s,180*b.s,270*b.s);c.globalAlpha=1};
 ball(st.balls[2]);
 isl(st.isl[1]);
 // main island + waterfall
 const M=st.isl[0],my=M.y+M.bob*S.osc(M.sec,M.o),wx=M.x+M.w*.33,wy=my+M.w*.03;
 const wg=c.createLinearGradient(0,wy,0,wy+520);wg.addColorStop(0,'rgba(235,248,255,.95)');wg.addColorStop(.6,'rgba(220,235,255,.55)');wg.addColorStop(1,'rgba(220,235,255,0)');
 c.fillStyle=wg;c.beginPath();c.moveTo(wx-14,wy);c.lineTo(wx+14,wy);c.lineTo(wx+22,wy+520);c.lineTo(wx-22,wy+520);c.closePath();c.fill();
 c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=2;c.lineCap='round';
 for(const f of st.wf){const t=S.saw(2.4,f.o),yy=wy+t*480;c.globalAlpha=1-t;c.beginPath();c.moveTo(wx+f.dx*(1+t*.6),yy);c.lineTo(wx+f.dx*(1+t*.6),yy+f.l);c.stroke()}c.globalAlpha=1;
 isl(M);
 for(let k=0;k<3;k++){const r=60+20*S.osc01(3.7,k/3);c.globalAlpha=.35;c.drawImage(st.mspr,wx-r+(k-1)*30,wy+500-r,2*r,2*r)}c.globalAlpha=1;
 tile(st.L1,60*S.osc(111,.25),620,1);
 ball(st.balls[1]);
 tile(st.L2,W*S.saw(111),720,1);
 ball(st.balls[0]);
 // birds
 const bx0=S.wrap(200,55.5,W,300,1),by0=180+30*S.osc(27.75);c.strokeStyle='rgba(90,70,120,.75)';c.lineWidth=3;c.lineJoin='round';
 for(const b of st.birds){const x=bx0+b.dx,y=by0+b.dy,f=S.osc(1.73,b.o)*10*b.s,s=14*b.s;c.beginPath();c.moveTo(x-s,y-f);c.quadraticCurveTo(x-s*.4,y-f*.4-3,x,y);c.quadraticCurveTo(x+s*.4,y-f*.4-3,x+s,y-f);c.stroke()}
 // petals
 c.fillStyle='#ffd3e0';
 for(const p of st.pet){const x=S.wrap(p.x,p.sec,W,40,1)+p.amp*S.osc(p.ws,p.o),y=p.y+p.amp*S.osc(p.ws*1.4,p.o+.3)+0;c.globalAlpha=.75;S.at(x,y,TAU*S.saw(p.rs,p.o),1,()=>{c.beginPath();c.ellipse(0,0,p.r,p.r*.55,0,0,TAU);c.fill()})}
 c.globalAlpha=1;
 tile(st.L3,W*S.saw(55.5),880,1);
 c.globalCompositeOperation='lighter';
 for(let i=0;i<20;i++){const p=st.pet[i],t=S.pulse(p.rs+3,p.o,3);c.globalAlpha=t*.6;const r=12+10*t;c.drawImage(st.spk,p.x-r,(p.y*.6)-r,2*r,2*r)}
 c.globalAlpha=1;c.globalCompositeOperation='source-over'}});

/* ============ 3. Aurora Lake ============ */
BIS.scene('g3-3',{title:'Aurora Lake',blurb:'Green and violet northern lights ripple over snowy mountains and a mirror lake, where a little boat with a lantern carries two friends.',
setup(S){const st=S.state,hz=650;st.hz=hz;
 const mtn=(base,a1,a2,seed)=>{const p=[S.R(0,TAU),S.R(0,TAU),S.R(0,TAU)];const ys=[];for(let px=0;px<=W;px+=6)ys.push(base-a1*Math.pow(Math.abs(Math.sin(px*.0024+p[0])),1.5)-a2*Math.pow(Math.abs(Math.sin(px*.0071+p[1])),1.2)-10*Math.sin(px*.031+p[2]));return ys};
 const farY=mtn(hz-40,200,80),nearY=mtn(hz+5,90,50);
 const drawMtn=(x,ys,base,body,snowT,snowB,rim,snowAmt)=>{x.beginPath();x.moveTo(0,H);ys.forEach((y,i)=>x.lineTo(i*6,y));x.lineTo(W,H);x.closePath();x.fillStyle=grad(x,0,base-280,0,base+40,body);x.fill();
  // snow caps
  x.beginPath();ys.forEach((y,i)=>i?x.lineTo(i*6,y):x.moveTo(0,y));for(let i=ys.length-1;i>=0;i--){const y=ys[i],cap=Math.max(0,(base-y-snowAmt))*.55+(base-y>snowAmt?6*Math.sin(i*1.7)+8*Math.sin(i*.43):0);x.lineTo(i*6,y+cap)}x.closePath();
  x.fillStyle=grad(x,0,base-280,0,base-60,[[0,snowT],[1,snowB]]);x.fill();
  // ridge shading strokes
  x.strokeStyle=rim;x.lineWidth=2;x.beginPath();ys.forEach((y,i)=>i?x.lineTo(i*6,y):x.moveTo(0,y));x.stroke()};
 st.sky=cv(W,hz+10,(x)=>{x.fillStyle=grad(x,0,0,0,hz,[[0,'#020614'],[.4,'#05172e'],[.75,'#0b3044'],[1,'#17505a']]);x.fillRect(0,0,W,hz+10);
  for(let i=0;i<900;i++){x.globalAlpha=S.R(.15,.7)*(1-S.R(0,.5));const s=S.R(.7,1.8);x.fillStyle='#e6f4ff';x.fillRect(S.R(0,W),S.R(0,hz)*S.R(.2,1),s,s)}x.globalAlpha=1;grain(S,x,W,hz+10,.05)});
 st.mtn=cv(W,H,(x)=>{drawMtn(x,farY,hz-40,[[0,'#1e3b58'],[1,'#10243a']],'#d6f2ee','#5d8aa6','rgba(160,255,220,.35)',90);
  x.fillStyle=grad(x,0,hz-160,0,hz,[[0,'rgba(40,110,120,0)'],[1,'rgba(40,110,120,.35)']]);x.fillRect(0,hz-160,W,160);
  drawMtn(x,nearY,hz+5,[[0,'#0f2638'],[1,'#071423']],'#a8d4d4','#3d6680','rgba(140,240,210,.25)',60);
  // tiny far-shore pines
  x.fillStyle='#061420';for(let px=0;px<W;px+=S.R(6,14)){pine(x,px,hz+2,S.R(8,26))}x.fillRect(0,hz-2,W,12)});
 // pine banks (left & right)
 const banks=[{base:735,from:-40,to:560,dir:1},{base:715,from:1360,to:1960,dir:-1}];
 banks.forEach(b=>{b.p=[];for(let px=b.from;px<b.to;px+=S.R(22,48)){const edge=b.dir>0?(b.to-px)/(b.to-b.from):(px-b.from)/(b.to-b.from);b.p.push([px,S.R(.6,1)*(120+380*Math.pow(1-edge,1.3))+S.R(0,40)])}});
 const drawBanks=(x)=>{banks.forEach(b=>{x.fillStyle='#030a12';x.beginPath();x.moveTo(b.from,b.base+4);x.quadraticCurveTo((b.from+b.to)/2,b.base-14,b.to+(b.dir>0?80:-80),b.base+6);x.lineTo(b.from,b.base+8);x.fill();for(const [px,h] of b.p)pine(x,px,b.base+2,h)})};
 st.banks=cv(W,H,(x)=>{drawBanks(x);x.strokeStyle='rgba(120,240,200,.18)';x.lineWidth=1.5;banks.forEach(b=>{for(const [px,h] of b.p){x.beginPath();x.moveTo(px,b.base-h);x.lineTo(px-h*.15,b.base-h*.55);x.stroke()}})});
 // lake with static reflection
 st.lake=cv(W,H-hz,(x)=>{const lh=H-hz;x.fillStyle=grad(x,0,0,0,lh,[[0,'#174a56'],[.3,'#0b2c3e'],[1,'#030b16']]);x.fillRect(0,0,W,lh);
  const ref=cv(W,H,(r)=>{r.drawImage(st.mtn,0,0);r.drawImage(st.banks,0,0)});
  x.save();x.globalAlpha=.7;for(let y=0;y<lh;y+=3){const sy=hz-y-1;if(sy<0)break;const off=Math.sin(y*.21)*2+Math.sin(y*.05)*3;x.drawImage(ref,0,sy,W,3,off,y,W,3)}x.restore();
  // pine banks reflect around their own base
  x.save();x.globalAlpha=.85;banks.forEach(b=>{for(let y=b.base-hz;y<lh;y+=3){const sy=2*b.base-(y+hz);if(sy<0||sy>b.base)continue;const off=Math.sin(y*.19)*2.5;x.drawImage(st.banks,b.from<0?0:b.from-60,sy,700,3,(b.from<0?0:b.from-60)+off,y,700,3)}});x.restore();
  x.fillStyle=grad(x,0,0,0,lh,[[0,'rgba(3,11,22,0)'],[.6,'rgba(3,11,22,.35)'],[1,'rgba(3,11,22,.8)']]);x.fillRect(0,0,W,lh);
  x.strokeStyle='rgba(150,220,220,.07)';x.lineWidth=1;for(let i=0;i<220;i++){const y=S.R(4,lh),px=S.R(0,W),l=S.R(30,200)*(.3+y/lh);x.beginPath();x.moveTo(px,y);x.lineTo(px+l,y);x.stroke()}
  grain(S,x,W,lh,.05)});
 // foreground shore
 st.fg=cv(W,H,(x)=>{const top=[];for(let px=0;px<=W;px+=10){const side=Math.max(0,1-Math.min(px,W-px)/500);top.push([px,1010+12*Math.sin(px*.011)+6*Math.sin(px*.037)-side*side*120])}
  x.beginPath();x.moveTo(0,H);top.forEach(([a,b])=>x.lineTo(a,b));x.lineTo(W,H);x.closePath();x.fillStyle='#02060c';x.fill();
  for(let i=0;i<18;i++){const px=S.R(0,W),k=Math.min(top.length-1,Math.floor(px/10)),py=top[k][1];x.beginPath();x.ellipse(px,py+8,S.R(20,60),S.R(10,26),0,Math.PI,0);x.fill()}
  for(let i=0;i<260;i++){const px=Math.pow(S.R(0,1),1.6)*(S.rnd()<.5?1:-1)*900+960,k=Math.min(top.length-1,Math.max(0,Math.floor(px/10))),py=top[k][1]+6,side=Math.max(0,1-Math.min(px,W-px)/450),h=S.R(10,30)+side*S.R(40,170),lean=S.R(-.2,.2)*h;
   x.beginPath();x.moveTo(px-2,py);x.quadraticCurveTo(px+lean*.3,py-h*.6,px+lean,py-h);x.quadraticCurveTo(px+lean*.3+1,py-h*.6,px+2,py);x.fill()}
  x.strokeStyle='rgba(120,240,200,.22)';x.lineWidth=2;x.beginPath();top.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.stroke()});
 // aurora
 st.aur=cv(960,340);st.strip=cv(8,256,(x)=>{x.fillStyle=grad(x,0,0,0,256,[[0,'rgba(170,80,230,0)'],[.3,'rgba(170,90,235,.3)'],[.62,'rgba(60,235,175,.65)'],[.88,'rgba(170,255,220,.95)'],[1,'rgba(80,255,180,0)']]);x.fillRect(0,0,8,256)});
 st.curt=[{base:235,amp:34,f:.0062,h:190,k:[1,2,1,3],ph:S.R(0,TAU),x0:20,x1:940,a:.55},{base:175,amp:26,f:.0095,h:140,k:[-1,1,2,-2],ph:S.R(0,TAU),x0:280,x1:960,a:.45},{base:205,amp:20,f:.012,h:120,k:[2,-1,1,1],ph:S.R(0,TAU),x0:0,x1:520,a:.35}];
 st.star=[];for(let i=0;i<120;i++)st.star.push({x:S.R(0,W),y:S.R(0,hz-200),s:S.R(1.5,3),sec:S.R(4,10),o:S.R(0,1),big:i<14});
 st.spk=sparkSpr(230,250,255);st.warm=glowSpr(255,200,120,1);st.mspr=cv(256,128,(x)=>{x.scale(1,.5);const g=x.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,'rgba(170,230,230,1)');g.addColorStop(1,'rgba(170,230,230,0)');x.fillStyle=g;x.fillRect(0,0,256,256)});
 st.mist=[];for(let i=0;i<6;i++)st.mist.push({x:S.R(0,W),y:S.R(hz+10,hz+90),w:S.R(800,1300),h:S.R(60,110),dir:i%2?1:-1,a:S.R(.06,.12)});
 st.rip=[];for(let i=0;i<90;i++){const y=S.R(hz+30,1000);st.rip.push({x:S.R(0,W),y,w:S.R(30,160)*(.4+(y-hz)/400),sec:S.R(5,11),o:S.R(0,1)})}
 st.motes=[];for(let i=0;i<30;i++)st.motes.push({x:S.R(0,W),y:S.R(500,1000),sec:111/S.RI(1,2),o:S.R(0,1),amp:S.R(15,40),ws:S.R(7,14)});
 st.mote=glowSpr(150,255,210,1,64);
 st.boat=cv(320,220,(x)=>{x.fillStyle='#050b14';x.beginPath();x.moveTo(20,150);x.quadraticCurveTo(160,150,300,138);x.quadraticCurveTo(270,190,170,192);x.quadraticCurveTo(70,192,20,150);x.fill();
  x.strokeStyle='rgba(140,240,210,.4)';x.lineWidth=2;x.beginPath();x.moveTo(22,150);x.quadraticCurveTo(160,150,298,138);x.stroke();
  // two friends sitting
  x.fillStyle='#050b14';x.beginPath();x.arc(120,92,15,0,TAU);x.fill();x.beginPath();x.moveTo(100,152);x.quadraticCurveTo(98,110,120,106);x.quadraticCurveTo(142,110,142,152);x.fill();
  x.beginPath();x.arc(163,108,11,0,TAU);x.fill();x.beginPath();x.moveTo(148,152);x.quadraticCurveTo(147,122,163,118);x.quadraticCurveTo(180,122,180,152);x.fill();
  x.strokeStyle='rgba(140,240,210,.35)';x.lineWidth=1.5;x.beginPath();x.arc(120,92,15,Math.PI*1.05,Math.PI*1.7);x.stroke();x.beginPath();x.arc(163,108,11,Math.PI*1.05,Math.PI*1.7);x.stroke();
  // lantern pole
  x.strokeStyle='#050b14';x.lineWidth=4;x.beginPath();x.moveTo(270,144);x.lineTo(280,40);x.quadraticCurveTo(290,30,300,40);x.stroke();
  x.fillStyle='#3a2410';x.fillRect(293,44,14,4)});
 st.shoot=[{sec:55.5,off:.3,x:300,y:90,len:320,ang:.35}]},
draw(S){const c=S.ctx,st=S.state,hz=st.hz;
 c.drawImage(st.sky,0,0);
 for(const s of st.star){const t=.3+.7*S.osc01(s.sec,s.o);c.globalAlpha=t;if(s.big){const r=8+8*t;c.drawImage(st.spk,s.x-r,s.y-r,2*r,2*r)}else{c.fillStyle='#fff';c.fillRect(s.x,s.y,s.s*.7,s.s*.7)}}c.globalAlpha=1;
 for(const s of st.shoot){const t=S.saw(s.sec,s.off);if(t<.06){const u=t/.06,hx=s.x+Math.cos(s.ang)*s.len*u*1.4,hy=s.y+Math.sin(s.ang)*s.len*u*1.4,a=Math.sin(u*Math.PI);const tx=hx-Math.cos(s.ang)*s.len*.7,ty=hy-Math.sin(s.ang)*s.len*.7;const gr=c.createLinearGradient(tx,ty,hx,hy);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(1,`rgba(235,255,250,${a})`);c.strokeStyle=gr;c.lineWidth=3;c.lineCap='round';c.beginPath();c.moveTo(tx,ty);c.lineTo(hx,hy);c.stroke()}}
 // aurora (half-res offscreen)
 const a=st.aur.getContext('2d');a.clearRect(0,0,960,340);a.globalCompositeOperation='lighter';const P=TAU*S.p;
 for(const C of st.curt){const [k1,k2,k3,k4]=C.k;for(let x=C.x0;x<C.x1;x+=4){const e=Math.min(1,(x-C.x0)/140,(C.x1-x)/140);if(e<=0)continue;
  const yb=C.base+C.amp*Math.sin(x*C.f+P*k1+C.ph)+C.amp*.45*Math.sin(x*C.f*2.3-P*k2+C.ph*2);const h=C.h*(.6+.4*Math.sin(x*C.f*1.7+P*k3+C.ph));
  const v=.45+.55*(.5+.5*Math.sin(x*.045+P*k4+C.ph))*(.6+.4*Math.sin(x*.013-P*k1));a.globalAlpha=C.a*e*v;a.drawImage(st.strip,x,yb-h,5,h)}}
 a.globalAlpha=1;a.globalCompositeOperation='source-over';
 c.globalCompositeOperation='lighter';c.drawImage(st.aur,0,0,1920,680);c.globalCompositeOperation='source-over';
 c.drawImage(st.mtn,0,0);
 c.drawImage(st.lake,0,hz);
 // aurora reflection
 c.save();c.beginPath();c.rect(0,hz,W,H-hz);c.clip();c.globalCompositeOperation='lighter';c.globalAlpha=.22;c.translate(0,2*hz+30);c.scale(1,-1);c.drawImage(st.aur,0,0,1920,680);c.restore();
 // mist over water
 for(const m of st.mist){const x=S.wrap(m.x,111,W,m.w/2,m.dir);c.globalAlpha=m.a;c.drawImage(st.mspr,x-m.w/2,m.y-m.h/2,m.w,m.h)}c.globalAlpha=1;
 c.drawImage(st.banks,0,0);
 // ripples
 c.lineWidth=2;c.lineCap='round';
 for(const r of st.rip){const g=.5+.5*Math.sin(r.x*.004+P);c.strokeStyle=g>.5?'rgba(140,255,210,.5)':'rgba(190,210,255,.4)';c.globalAlpha=.06+.32*S.osc01(r.sec,r.o);const x=r.x+12*S.osc(r.sec*1.5,r.o);c.beginPath();c.moveTo(x,r.y);c.lineTo(x+r.w,r.y);c.stroke()}
 c.globalAlpha=1;
 // boat + lantern
 const bx=1180+30*S.osc(111),by=780+4*S.osc(5.55),br=.02*S.osc(5.55,.25),lp=.75+.25*S.osc01(3.08);
 // lantern reflection streak
 c.globalCompositeOperation='lighter';
 for(let i=0;i<14;i++){const yy=by+60+i*14,w=26+i*3+8*S.osc(2.47,i*.13);c.globalAlpha=(.5-.032*i)*lp;c.fillStyle='rgba(255,190,110,.6)';c.fillRect(bx+125-w/2+5*S.osc(3.7,i*.21),yy,w,3)}
 c.globalAlpha=1;c.globalCompositeOperation='source-over';
 S.at(bx,by,br,1,()=>{c.drawImage(st.boat,-160,-150);c.globalCompositeOperation='lighter';c.globalAlpha=lp*.7;c.drawImage(st.warm,140-90,-104-90,180,180);c.globalAlpha=1;c.drawImage(st.warm,140-22,-104-22,44,44);c.fillStyle='#fff0c8';c.beginPath();c.arc(140,-104,5,0,TAU);c.fill();c.globalCompositeOperation='source-over'});
 c.drawImage(st.fg,0,0);
 c.globalCompositeOperation='lighter';
 for(const m of st.motes){const t=S.saw(m.sec,m.o),x=m.x+m.amp*S.osc(m.ws,m.o),y=m.y-160*t;c.globalAlpha=.7*Math.sin(t*Math.PI);c.drawImage(st.mote,x-12,y-12,24,24)}
 c.globalAlpha=1;c.globalCompositeOperation='source-over'}});
})();
