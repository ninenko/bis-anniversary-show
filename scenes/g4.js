/* Grade 4 — We're All in This Together (friendship, upbeat) — Round 2 */
(function(){
const TAU=Math.PI*2,W=1920,H=1080;
function mk(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return[c,c.getContext('2d')]}
function lg(x,x0,y0,x1,y1,stops){const g=x.createLinearGradient(x0,y0,x1,y1);stops.forEach(([o,c])=>g.addColorStop(o,c));return g}
function glowSprite(col,size=256){const[c,x]=mk(size,size);const g=x.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,size,size);return c}
function grain(S,x,w,h,a,mode='overlay'){const[t,tx]=mk(256,256);const id=tx.createImageData(256,256);
  for(let i=0;i<id.data.length;i+=4){const v=S.rnd()*255;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=255}
  tx.putImageData(id,0,0);x.save();x.globalAlpha=a;x.globalCompositeOperation=mode;x.fillStyle=x.createPattern(t,'repeat');x.fillRect(0,0,w,h);x.restore()}
function ridgePath(fn,x0,x1,step,bottom){const p=new Path2D();p.moveTo(x0,bottom);for(let x=x0;x<x1;x+=step)p.lineTo(x,fn(x));p.lineTo(x1,fn(x1));p.lineTo(x1,bottom);p.closePath();return p}
function wave(S,n=4,base=.0025){const c=[];for(let i=0;i<n;i++)c.push({f:base*(i+1)*S.R(.7,1.3),a:S.R(.5,1)/(i+1),p:S.R(0,TAU)});return x=>c.reduce((s,k)=>s+Math.sin(x*k.f+k.p)*k.a,0)}
function softEllipse(x,cx,cy,rx,ry,col){x.save();x.translate(cx,cy);x.scale(1,ry/rx);const g=x.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(-rx,-rx,2*rx,2*rx);x.restore()}

/* =========================================================
   1: Paper Planes — a squadron loops over a cheerful town
   ========================================================= */
function cloudSprite(S,cw,ch,top,shade,warm){const[cc,cx]=mk(cw+60,ch+60);const P=new Path2D();
  for(let j=0;j<6;j++){const t=j/5;P.addPath(S.blob(30+cw*(.12+.76*t),30+ch*(.72-.36*Math.sin(t*Math.PI))+S.R(-5,5),cw*S.R(.13,.2),ch*S.R(.3,.44),{bumps:4,amp:.2}))}
  cx.fillStyle=top;cx.fill(P);cx.save();cx.globalCompositeOperation='source-atop';
  let g=cx.createLinearGradient(0,30+ch*.35,0,30+ch);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,shade);cx.fillStyle=g;cx.fillRect(0,0,cw+60,ch+60);
  g=cx.createLinearGradient(0,0,cw+60,0);g.addColorStop(0,warm);g.addColorStop(.6,'rgba(255,255,255,0)');cx.fillStyle=g;cx.fillRect(0,0,cw+60,ch+60);cx.restore();return cc}
function townRow(S,base,sc,n0,haze,pal,roofs,door){
  const[rc,x]=mk(W,H);const R=S.R,tops=[];let px=R(-60,-10);
  while(px<W+20){
    // tree between houses sometimes
    if(S.rnd()<.35){const tr=R(22,36)*sc*1.6,tx=px+tr;x.fillStyle='#7a5a3a';x.fillRect(tx-4*sc,base-tr*1.6,8*sc,tr*1.6);
      x.fillStyle=S.pick(['#5fbf5a','#79cc5a','#4fae6a']);x.beginPath();x.arc(tx,base-tr*1.9,tr,0,TAU);x.fill();
      x.fillStyle='rgba(255,255,220,.3)';x.beginPath();x.arc(tx-tr*.3,base-tr*2.2,tr*.5,0,TAU);x.fill();px+=tr*1.6}
    const w=R(80,150)*sc,hgt=R(n0[0],n0[1])*sc,wall=S.pick(pal),roof=S.pick(roofs),top=base-hgt,kind=S.rnd();
    x.fillStyle=wall;x.fillRect(px,top,w,hgt+4);
    x.fillStyle='rgba(60,30,60,.12)';x.fillRect(px+w*.82,top,w*.18,hgt+4);
    x.fillStyle=roof;
    if(kind<.55){x.beginPath();x.moveTo(px-7*sc,top+2);x.lineTo(px+w/2,top-w*.42);x.lineTo(px+w+7*sc,top+2);x.closePath();x.fill();
      x.fillStyle='rgba(255,255,255,.18)';x.beginPath();x.moveTo(px-7*sc,top+2);x.lineTo(px+w/2,top-w*.42);x.lineTo(px+w/2,top+2);x.closePath();x.fill();
      if(S.rnd()<.5){x.fillStyle='#b5664a';x.fillRect(px+w*.68,top-w*.36,10*sc,w*.28)}tops.push([px+w/2,top-w*.42])}
    else if(kind<.8){x.fillRect(px-4*sc,top-10*sc,w+8*sc,12*sc);tops.push([px+w*.2,top-10*sc])}
    else{const tw=w*.42,tx=px+w/2;x.fillStyle=wall;x.fillRect(tx-tw/2,top-50*sc,tw,52*sc);x.fillStyle=roof;x.beginPath();x.moveTo(tx-tw/2-5*sc,top-48*sc);x.lineTo(tx,top-50*sc-tw*1.2);x.lineTo(tx+tw/2+5*sc,top-48*sc);x.closePath();x.fill();
      x.fillStyle='#fff6d8';x.beginPath();x.arc(tx,top-28*sc,tw*.22,0,TAU);x.fill();tops.push([tx,top-50*sc-tw*1.2])}
    const cols=Math.max(1,Math.floor(w/(34*sc))),rows=Math.max(1,Math.floor((hgt-30*sc)/(44*sc))),ww=15*sc,wh=21*sc;
    for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const wx=px+(i+.5)*w/cols-ww/2,wy=top+16*sc+j*44*sc;if(door&&j===rows-1&&i===Math.floor(cols/2))continue;
      x.fillStyle='#ffffff';x.fillRect(wx-2*sc,wy-2*sc,ww+4*sc,wh+4*sc);x.fillStyle=S.rnd()<.3?'#ffe9a8':'#a9dcf5';x.fillRect(wx,wy,ww,wh);
      x.fillStyle='rgba(255,255,255,.6)';x.fillRect(wx,wy,ww*.35,wh);
      if(S.rnd()<.25){x.fillStyle=S.pick(['#ff6f7d','#ffb84d','#9b6bff']);x.fillRect(wx-3*sc,wy+wh,ww+6*sc,5*sc)}}
    if(door){x.fillStyle=S.pick(['#3f6fb5','#c0392b','#2a9d8f','#7a4b9e']);const dw=20*sc;x.beginPath();x.roundRect(px+w/2-dw/2,base-34*sc,dw,34*sc,[dw/2,dw/2,0,0]);x.fill()}
    px+=w+R(2,14)*sc}
  if(haze){x.save();x.globalCompositeOperation='source-atop';x.fillStyle=haze;x.fillRect(0,0,W,H);x.restore()}
  return{cv:rc,tops};
}
function paperPlane(c,L,c1,c2,c3,bank){
  c.save();c.scale(1,bank);
  c.fillStyle=c3;c.beginPath();c.moveTo(L*.5,0);c.lineTo(-L*.42,L*.05);c.lineTo(-L*.36,L*.24);c.closePath();c.fill();
  c.fillStyle=c1;c.beginPath();c.moveTo(L*.5,0);c.lineTo(-L*.5,-L*.34);c.lineTo(-L*.42,L*.05);c.closePath();c.fill();
  c.fillStyle=c2;c.beginPath();c.moveTo(L*.5,0);c.lineTo(-L*.42,L*.05);c.lineTo(-L*.5,L*.14);c.closePath();c.fill();
  c.restore()}
BIS.scene('g4-1',{title:'Paper Planes',blurb:'A squadron of colourful paper planes loops and swoops together over a cheerful town, leaving dotted trails.',
setup(S){
  const st=S.state,R=S.R;
  const SX=st.sx=330,SY=st.sy=170;
  const[sky,k]=mk(W,H);
  k.fillStyle=lg(k,0,0,0,H,[[0,'#1fa9d6'],[.38,'#5fd0e6'],[.62,'#bff0e6'],[.78,'#fff3d2'],[1,'#fff3d2']]);k.fillRect(0,0,W,H);
  for(const[r,cl]of[[900,'rgba(255,250,215,.45)'],[300,'rgba(255,252,230,.8)'],[90,'rgba(255,255,245,1)']]){const g=k.createRadialGradient(SX,SY,0,SX,SY,r);g.addColorStop(0,cl);g.addColorStop(1,'rgba(255,250,215,0)');k.fillStyle=g;k.fillRect(0,0,W,H)}
  // distant hills
  const f1=wave(S,3,.003);k.fillStyle='#a9dcc0';k.fill(ridgePath(x=>700-40*f1(x),-10,W+10,6,H));
  const f2=wave(S,3,.004);k.fillStyle='#8fd0a5';k.fill(ridgePath(x=>745-28*f2(x),-10,W+10,6,H));
  grain(S,k,W,H,.05);st.sky=sky;
  const RS=1700;const[ray,rx]=mk(RS,RS);rx.translate(RS/2,RS/2);
  for(let i=0;i<14;i++){const a=i/14*TAU+R(-.1,.1),w=R(.03,.07);const g=rx.createRadialGradient(0,0,60,0,0,RS/2);g.addColorStop(0,'rgba(255,255,230,.35)');g.addColorStop(1,'rgba(255,255,230,0)');rx.fillStyle=g;rx.beginPath();rx.moveTo(0,0);rx.arc(0,0,RS/2,a-w,a+w);rx.closePath();rx.fill()}
  st.ray=ray;
  st.clouds=[];const cy=[60,150,250,110,330,200];
  for(let i=0;i<6;i++){const cw=R(260,480);st.clouds.push({img:cloudSprite(S,cw,cw*R(.34,.46),'#ffffff','rgba(120,190,215,.55)','rgba(255,236,200,.35)'),y:cy[i],x0:R(0,W),sec:i%2?230:115,a:R(.85,1)})}
  // town
  const pal=['#ff8f7e','#ffc75f','#7fd6c6','#f9a8c9','#a8dc72','#8fb8ff','#ffe3a3','#c7a6ff'],roofs=['#e0574f','#3f7f9e','#6a4fa0','#e98a2a','#2a9d8f'];
  const far=townRow(S,790,.48,[110,240],'rgba(200,236,232,.55)',pal,roofs,false);
  const mid=townRow(S,915,.72,[130,260],'rgba(200,236,232,.22)',pal,roofs,true);
  const front=townRow(S,1100,1.05,[150,240],null,pal,roofs,true);
  const[tn,t]=mk(W,H);t.drawImage(far.cv,0,0);
  t.fillStyle=lg(t,0,780,0,830,[[0,'#8fd0a5'],[1,'#7cc493']]);t.fillRect(0,788,W,140);
  t.drawImage(mid.cv,0,0);
  t.fillStyle='#6db882';t.fillRect(0,912,W,200);
  t.drawImage(front.cv,0,0);
  grain(S,t,W,H,.05,'source-atop');st.town=tn;
  st.flags=[...mid.tops.filter(()=>S.rnd()<.35).map(p=>[...p,.72]),...front.tops.filter(()=>S.rnd()<.45).map(p=>[...p,1.05])].map(([x,y,s])=>({x,y,s,c:S.pick(['#ff5d5d','#ffd34d','#3fb6ff','#9b5cff','#ff6fb0']),o:R(0,1)}));
  // squadron
  const pc=[['#ff6b6b','#e94f5a','#b8344a'],['#ffd34d','#f2b631','#c98a1c'],['#4fd6c4','#2fb8a8','#1d8a80'],['#5aa8ff','#3f86e6','#2a62b8'],['#b98bff','#9a68f0','#7447c4'],['#ff8ac4','#ef66aa','#c4447f'],['#9be15d','#7cc843','#559a2c']];
  st.planes=pc.map((c,i)=>({c,k:i,off:(i%2?1:-1)*R(10,40)}));
  st.solo=[];for(let i=0;i<5;i++)st.solo.push({x0:R(0,W),y:R(90,300),L:R(26,40),sec:S.pick([115,76.67]),o:R(0,1),c:pc[i]});
  st.dot=glowSprite('rgba(255,255,255,1)',32);
},
draw(S){
  const c=S.ctx,st=S.state;
  c.drawImage(st.sky,0,0);
  c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.22+.1*S.osc(17);c.translate(st.sx,st.sy);c.rotate(TAU*S.saw(230));c.drawImage(st.ray,-850,-850);c.restore();
  for(const cl of st.clouds){const x=S.wrap(cl.x0,cl.sec,W,cl.img.width/2+10,1);c.globalAlpha=cl.a;c.drawImage(cl.img,x-cl.img.width/2,cl.y)}
  c.globalAlpha=1;
  // distant solo planes
  for(const p of st.solo){const x=S.wrap(p.x0,p.sec,W,80,1),y=p.y+14*S.osc(9,p.o);c.globalAlpha=.75;S.at(x,y,.05*S.osc(9,p.o+.25),1,()=>paperPlane(c,p.L,p.c[0],p.c[1],p.c[2],1))}
  c.globalAlpha=1;
  c.drawImage(st.town,0,0);
  // rooftop flags
  for(const f of st.flags){const s=f.s;c.strokeStyle='#6b5a5a';c.lineWidth=2.5*s;c.beginPath();c.moveTo(f.x,f.y);c.lineTo(f.x,f.y-40*s);c.stroke();
    const w=S.osc(2.4,f.o);c.fillStyle=f.c;c.beginPath();c.moveTo(f.x,f.y-40*s);c.quadraticCurveTo(f.x+16*s,f.y-(40+w*5)*s,f.x+30*s,f.y-(33+w*3)*s);c.quadraticCurveTo(f.x+14*s,f.y-(28-w*4)*s,f.x,f.y-24*s);c.closePath();c.fill()}
  // squadron on a figure-eight
  const pathAt=a=>[960+770*Math.sin(a),340+165*Math.sin(2*a)+40*Math.cos(a)];
  const base=TAU*S.saw(28);
  const items=st.planes.map(p=>{const a=base-p.k*.13,P=pathAt(a),Q=pathAt(a+.004),ang=Math.atan2(Q[1]-P[1],Q[0]-P[0]),nx=-Math.sin(ang),ny=Math.cos(ang);return{p,a,x:P[0]+nx*p.off,y:P[1]+ny*p.off,ang,nx,ny,z:Math.cos(a)}});
  // trails
  for(const it of items){c.fillStyle=it.p.c[0];
    for(let j=2;j<26;j++){const a=it.a-j*.017,P=pathAt(a);const al=(1-j/26);c.globalAlpha=.75*al;const r=(2.5+4*al)*(1+.2*Math.cos(a));c.beginPath();c.arc(P[0]+it.nx*it.p.off,P[1]+it.ny*it.p.off,r,0,TAU);c.fill()}}
  c.globalAlpha=1;
  items.sort((a,b)=>a.z-b.z);
  for(const it of items){const L=112*(1+.25*it.z),flip=Math.cos(it.ang)<0?-1:1;
    c.fillStyle='rgba(40,90,110,.12)';c.beginPath();c.ellipse(it.x+10,it.y+L*.55,L*.35,L*.07,0,0,TAU);c.fill();
    S.at(it.x,it.y,it.ang,[1,flip],()=>paperPlane(c,L,it.p.c[0],it.p.c[1],it.p.c[2],.75+.25*S.osc(5,it.p.k*.07)))}
}});

/* =========================================================
   2: Treehouse Club — treehouses joined by rope bridges
   ========================================================= */
function qb(p0,p1,p2,t){const u=1-t;return[u*u*p0[0]+2*u*t*p1[0]+t*t*p2[0],u*u*p0[1]+2*u*t*p1[1]+t*t*p2[1]]}
BIS.scene('g4-2',{title:'Treehouse Club',blurb:'Big trees are joined by rope bridges and colourful treehouses, with bunting, a swing, butterflies and drifting leaves.',
setup(S){
  const st=S.state,R=S.R;
  // ---- background forest light ----
  const[bg,b]=mk(W,H);
  b.fillStyle=lg(b,0,0,0,H,[[0,'#fff6c8'],[.3,'#e2f3b0'],[.6,'#a9d98a'],[1,'#7fbf6a']]);b.fillRect(0,0,W,H);
  softEllipse(b,1500,120,900,420,'rgba(255,255,225,.8)');
  for(let i=0;i<18;i++){const x=R(0,W),w=R(18,48);b.fillStyle=`rgba(150,190,130,${R(.35,.6)})`;b.fillRect(x,0,w,H);b.fillStyle='rgba(255,255,230,.18)';b.fillRect(x+w*.6,0,w*.4,H)}
  for(let i=0;i<40;i++){b.fillStyle=S.pick(['rgba(170,215,140,.7)','rgba(190,225,150,.7)','rgba(150,200,125,.7)']);b.fill(S.blob(R(0,W),R(250,700),R(60,140),R(50,110),{bumps:5,amp:.2}))}
  // centre back tree + lookout
  b.fillStyle='#9c9070';b.fillRect(915,0,90,H);b.fillStyle='rgba(255,250,220,.3)';b.fillRect(970,0,35,H);
  b.fillStyle='#b88a58';b.fillRect(850,326,220,16);b.fillStyle='#9a6e42';for(let x=856;x<1070;x+=22)b.fillRect(x,326,2,16);
  b.strokeStyle='#8a6a48';b.lineWidth=5;b.beginPath();b.moveTo(870,342);b.lineTo(945,420);b.moveTo(1050,342);b.lineTo(975,420);
  for(const x of[856,900,1020,1064]){b.moveTo(x,326);b.lineTo(x,282)}b.moveTo(852,286);b.lineTo(1068,286);b.stroke();
  // ground
  const fg=wave(S,3,.004);const gr=st.gr=x=>905-18*fg(x);
  b.fillStyle=lg(b,0,880,0,H,[[0,'#7cc25a'],[1,'#4e9440']]);b.fill(ridgePath(gr,-10,W+10,6,H));
  for(let i=0;i<14;i++)softEllipse(b,R(0,W),R(930,1060),R(80,200),R(14,30),'rgba(255,250,200,.35)');
  for(let i=0;i<700;i++){const x=R(0,W),y=gr(x)+Math.pow(R(0,1),.8)*(H-gr(x));const sc=.6+(y-900)/200;
    if(i%5){b.strokeStyle=S.pick(['#3f8a3a','#5aa64e','#6fbf55']);b.lineWidth=1.6*sc;b.beginPath();b.moveTo(x,y);b.lineTo(x+R(-4,4)*sc,y-R(6,16)*sc);b.stroke()}
    else{b.fillStyle=S.pick(['#ffffff','#ffd84a','#ff7aa8','#c58cff']);b.beginPath();b.arc(x,y,R(1.5,3.2)*sc,0,TAU);b.fill()}}
  const mush=(x,y,s)=>{b.fillStyle='#fff3e0';b.fillRect(x-s*.18,y-s*.6,s*.36,s*.6);b.fillStyle='#e8453c';b.beginPath();b.ellipse(x,y-s*.6,s*.55,s*.4,0,Math.PI,TAU);b.fill();b.fillStyle='#fff';for(const[dx,dy]of[[-.25,-.75],[.15,-.85],[.3,-.68]]){b.beginPath();b.arc(x+dx*s,y+dy*s,s*.07,0,TAU);b.fill()}};
  mush(150,1010,40);mush(195,1022,28);mush(1770,1000,44);mush(1820,1015,30);
  // ---- main trees, houses, bridges ----
  const trunk=(cx,wb,wt,lit)=>{const p=new Path2D(`M${cx-wb*.75},${H+5} C${cx-wb*.5},${H-60} ${cx-wt/2},${H-200} ${cx-wt/2},700 L${cx-wt/2},-10 L${cx+wt/2},-10 L${cx+wt/2},700 C${cx+wt/2},${H-200} ${cx+wb*.5},${H-60} ${cx+wb*.75},${H+5} Z`);
    b.fillStyle=lg(b,cx-wb*.6,0,cx+wb*.6,0,[[0,'#4f3220'],[.55,'#7d5232'],[.85,'#a8743f'],[1,'#c48a4c']]);b.fill(p);
    b.save();b.clip(p);b.strokeStyle='rgba(50,30,15,.35)';b.lineWidth=3;b.lineCap='round';
    for(let i=0;i<34;i++){const x=cx+R(-wb*.5,wb*.5),y=R(0,H),l=R(40,140);b.beginPath();b.moveTo(x,y);b.bezierCurveTo(x+R(-6,6),y+l*.3,x+R(-6,6),y+l*.6,x+R(-4,4),y+l);b.stroke()}
    b.restore()};
  const branch=(x0,y0,x1,y1,w)=>{b.strokeStyle='#6b4428';b.lineCap='round';b.lineWidth=w;b.beginPath();b.moveTo(x0,y0);b.quadraticCurveTo((x0+x1)/2,y0-30,x1,y1);b.stroke();b.lineWidth=w*.5;b.strokeStyle='rgba(200,140,80,.5)';b.beginPath();b.moveTo(x0,y0-w*.2);b.quadraticCurveTo((x0+x1)/2,y0-30-w*.2,x1,y1-w*.2);b.stroke()};
  branch(280,600,690,560,36);
  trunk(250,240,150);trunk(1680,260,170);
  branch(1600,640,1300,600,30);
  const platform=(x0,x1,y)=>{b.fillStyle='#6b4428';b.lineWidth=10;b.strokeStyle='#6b4428';
    b.beginPath();b.moveTo(x0+30,y+24);b.lineTo((x0+x1)/2-40,y+130);b.moveTo(x1-30,y+24);b.lineTo((x0+x1)/2+40,y+130);b.stroke();
    b.fillStyle='#b5824e';b.fillRect(x0,y,x1-x0,26);b.fillStyle='#d9a066';b.fillRect(x0,y,x1-x0,6);b.fillStyle='#8a5c34';for(let x=x0+6;x<x1;x+=24)b.fillRect(x,y+6,2,20)};
  const house=(x0,x1,y,peak,wall,roof,round)=>{const w=x1-x0,h=y-peak-w*.0;
    const top=y-170;b.fillStyle=wall;b.fillRect(x0,top,w,170);
    b.fillStyle='rgba(90,50,20,.18)';for(let x=x0+18;x<x1;x+=22)b.fillRect(x,top,2,170);
    b.fillStyle='rgba(60,30,10,.2)';b.fillRect(x0,top,w*.2,170);
    b.fillStyle=roof;b.beginPath();b.moveTo(x0-34,top+6);b.lineTo((x0+x1)/2,peak);b.lineTo(x1+34,top+6);b.closePath();b.fill();
    b.fillStyle='rgba(255,255,255,.2)';b.beginPath();b.moveTo((x0+x1)/2,peak);b.lineTo(x1+34,top+6);b.lineTo((x0+x1)/2,top+6);b.closePath();b.fill();
    b.strokeStyle='rgba(0,0,0,.15)';b.lineWidth=2;for(let k=1;k<4;k++){const yy=peak+(top+6-peak)*k/4,hw=(w/2+34)*k/4;b.beginPath();b.moveTo((x0+x1)/2-hw,yy);b.lineTo((x0+x1)/2+hw,yy);b.stroke()}
    const wx=x0+w*.26,wy=top+40;b.fillStyle='#fff';if(round){b.beginPath();b.arc(wx,wy+28,36,0,TAU);b.fill();b.fillStyle='#bfe8ff';b.beginPath();b.arc(wx,wy+28,29,0,TAU);b.fill();b.strokeStyle='#fff';b.lineWidth=5;b.beginPath();b.moveTo(wx-29,wy+28);b.lineTo(wx+29,wy+28);b.moveTo(wx,wy-1);b.lineTo(wx,wy+57);b.stroke()}
    else{b.fillRect(wx-36,wy-6,72,70);b.fillStyle='#bfe8ff';b.fillRect(wx-30,wy,60,58);b.fillStyle='rgba(255,255,255,.55)';b.fillRect(wx-30,wy,20,58);b.fillStyle='#ff6f7d';b.fillRect(wx-40,wy+64,80,10)}
    b.fillStyle='#5a7fc0';b.beginPath();b.roundRect(x0+w*.62,y-110,58,110,[29,29,0,0]);b.fill();b.fillStyle='#ffd34d';b.beginPath();b.arc(x0+w*.62+46,y-55,5,0,TAU);b.fill();
  };
  platform(80,580,440);house(150,480,440,150,'#e0a25e','#e4574a',false);
  platform(1400,1890,400);house(1480,1800,400,105,'#f0c27a','#2a9d8f',true);
  // rails on platforms
  b.strokeStyle='#7a4f2c';b.lineWidth=6;b.beginPath();for(const[x0,x1,y]of[[80,580,440],[1400,1890,400]]){for(let x=x0+8;x<=x1;x+=60){if(x>(x0+50)&&x<(x1-50)&&x>((x0===80)?140:1470)&&x<((x0===80)?490:1810))continue;b.moveTo(x,y);b.lineTo(x,y-48)}b.moveTo(x0,y-46);b.lineTo(x0+60,y-46);b.moveTo(x1-60,y-46);b.lineTo(x1,y-46)}b.stroke();
  // rope bridges
  st.bridges=[[[580,446],[715,500],[850,334]],[[1070,334],[1235,470],[1400,406]]];
  for(const[p0,p1,p2]of st.bridges){
    for(let t=0;t<=1.001;t+=1/16){const[x,y]=qb(p0,p1,p2,t);b.fillStyle='#c48d55';b.fillRect(x-8,y-3,16,8);b.fillStyle='#8a5c34';b.fillRect(x-8,y+4,16,2)}
    b.strokeStyle='#8a6a45';b.lineWidth=3;
    for(const dy of[0,-50]){b.beginPath();b.moveTo(p0[0],p0[1]+dy);b.quadraticCurveTo(p1[0],p1[1]+dy*.6,p2[0],p2[1]+dy);b.stroke()}
    for(let t=0;t<=1.001;t+=1/8){const[x,y]=qb(p0,p1,p2,t);const[,yh]=qb([p0[0],p0[1]-50],[p1[0],p1[1]-30],[p2[0],p2[1]-50],t);b.beginPath();b.moveTo(x,y);b.lineTo(x,yh);b.stroke()}}
  // rope ladder
  b.strokeStyle='#8a6a45';b.lineWidth=3;b.beginPath();b.moveTo(1430,426);b.lineTo(1436,gr(1436)+6);b.moveTo(1480,426);b.lineTo(1474,gr(1474)+6);
  for(let y=460;y<gr(1455);y+=42){b.moveTo(1432,y);b.lineTo(1478,y)}b.stroke();
  // corner bushes
  for(const[x,y,rx,ry]of[[-40,1040,260,140],[140,1090,200,110],[1960,1040,260,150],[1780,1095,200,110]]){b.fillStyle='#3f8a3a';b.fill(S.blob(x,y,rx,ry,{bumps:7,amp:.18}));b.fillStyle='rgba(180,230,120,.35)';b.fill(S.blob(x+rx*.15,y-ry*.25,rx*.6,ry*.45,{bumps:5,amp:.2}))}
  grain(S,b,W,H,.05);st.bg=bg;
  // canopy layer (sways)
  const[cn,n]=mk(W+80,420);
  const greens=['#2f7d3a','#3f9644','#56ad4c','#78c75a'];
  for(let layer=0;layer<4;layer++)for(let i=0;i<34;i++){const x=R(-20,W+100),y=R(-40,120+layer*40)*(1-layer*.1),rx=R(70,150);
    n.fillStyle=greens[layer];n.fill(S.blob(x,y,rx,rx*R(.6,.85),{bumps:6,amp:.16}));
    n.fillStyle='rgba(230,255,170,.25)';n.fill(S.blob(x+rx*.25,y-rx*.25,rx*.45,rx*.32,{bumps:4,amp:.2}))}
  for(let i=0;i<16;i++){const x=R(560,1420),y=R(140,270),rx=R(60,110);n.fillStyle=S.pick(greens);n.fill(S.blob(x,y,rx,rx*.7,{bumps:6,amp:.16}));n.fillStyle='rgba(230,255,170,.25)';n.fill(S.blob(x+rx*.25,y-rx*.25,rx*.45,rx*.32,{bumps:4,amp:.2}))}
  st.canopy=cn;
  // beams
  const[bm,bx]=mk(W,H);for(let i=0;i<7;i++){const x=R(700,2000),w=R(40,110);bx.save();bx.translate(x,0);bx.rotate(.38);const g=bx.createLinearGradient(0,0,0,1300);g.addColorStop(0,'rgba(255,255,220,.35)');g.addColorStop(1,'rgba(255,255,220,0)');bx.fillStyle=g;bx.fillRect(-w/2,0,w,1300);bx.restore()}
  st.beams=bm;
  st.bunt=['#ff5d5d','#ffd34d','#3fb6ff','#9b5cff','#ff8a2b','#ff6fb0','#7bd957'];
  st.leaves=[];for(let i=0;i<45;i++)st.leaves.push({x:R(0,W),y:R(0,H),s:R(9,16),sec:S.pick([46,57.5,76.67]),sp:S.pick([7.67,9.2,11.5]),o:R(0,1),c:S.pick(['#7cc44f','#a8d64a','#f2c84b','#5aad45','#e9a23b'])});
  st.leaf=new Path2D('M-10,0 Q0,-6 10,0 Q0,6 -10,0 Z');
  st.flies=[];for(let i=0;i<6;i++)st.flies.push({x:R(300,1700),y:R(200,700),ax:R(60,140),ay:R(30,70),o:R(0,1),c:S.pick(['#ff8a2b','#3fb6ff','#ff6fb0','#ffd34d'])});
  st.mote=glowSprite('rgba(255,255,220,1)',32);
  st.motes=[];for(let i=0;i<70;i++)st.motes.push({x:R(500,1900),y:R(150,900),r:R(4,10),sec:S.pick([57.5,76.67,115]),o:R(0,1)});
  st.birds=[];for(let i=0;i<3;i++)st.birds.push({x0:R(0,W),y:R(180,260),s:R(9,12),o:R(0,1)});
},
draw(S){
  const c=S.ctx,st=S.state;
  c.drawImage(st.bg,0,0);
  // bunting on bridges
  for(const[p0,p1,p2]of st.bridges){const h0=[p0[0],p0[1]-50],h1=[p1[0],p1[1]-30],h2=[p2[0],p2[1]-50];
    for(let j=1;j<14;j++){const[x,y]=qb(h0,h1,h2,j/14);S.at(x,y,.14*S.osc(3,j*.09),1,()=>{c.fillStyle=st.bunt[j%st.bunt.length];c.beginPath();c.moveTo(-10,0);c.lineTo(10,0);c.lineTo(0,24);c.closePath();c.fill()})}}
  // roof pennants
  for(const[x,y,col]of[[315,150,'#ffd34d'],[1640,105,'#ff6fb0']]){c.strokeStyle='#6b4428';c.lineWidth=3;c.beginPath();c.moveTo(x,y);c.lineTo(x,y-50);c.stroke();const w=S.osc(2.2,x*.001);
    c.fillStyle=col;c.beginPath();c.moveTo(x,y-50);c.quadraticCurveTo(x+18,y-52-w*5,x+36,y-42+w*3);c.quadraticCurveTo(x+16,y-34+w*4,x,y-30);c.closePath();c.fill()}
  // swing
  const sa=.2*S.osc(4.6);S.at(640,566,sa,1,()=>{c.strokeStyle='#8a6a45';c.lineWidth=3;c.beginPath();c.moveTo(-34,0);c.lineTo(-40,290);c.moveTo(34,0);c.lineTo(40,290);c.stroke();
    c.fillStyle='#c0392b';c.beginPath();c.roundRect(-58,286,116,14,5);c.fill();c.fillStyle='rgba(255,255,255,.25)';c.fillRect(-56,287,112,4)});
  // light beams & motes
  c.globalCompositeOperation='lighter';c.globalAlpha=.55+.3*S.osc(16);c.drawImage(st.beams,0,0);
  for(const m of st.motes){const y=S.wrap(m.y,m.sec,H,20,-1),x=m.x+20*S.osc(m.sec/6,m.o);c.globalAlpha=.25+.45*S.osc01(6,m.o);c.drawImage(st.mote,x-m.r/2,y-m.r/2,m.r,m.r)}
  c.globalCompositeOperation='source-over';c.globalAlpha=1;
  // birds
  c.strokeStyle='#3a5a40';c.lineWidth=2.4;c.lineCap='round';
  for(const bd of st.birds){const x=S.wrap(bd.x0,115,W,100,1),y=bd.y+8*S.osc(7,bd.o),f=.25+.55*S.osc01(1.3,bd.o);
    c.beginPath();c.moveTo(x-bd.s,y-bd.s*f*.6);c.quadraticCurveTo(x-bd.s*.45,y-bd.s*f,x,y);c.quadraticCurveTo(x+bd.s*.45,y-bd.s*f,x+bd.s,y-bd.s*f*.6);c.stroke()}
  // butterflies
  for(const f of st.flies){const x=f.x+f.ax*S.osc(23,f.o),y=f.y+f.ay*S.osc(11.5,f.o+.3),fl=.25+.75*Math.abs(S.osc(1.6,f.o));
    S.at(x,y,.3*S.osc(23,f.o+.25),1.7,()=>{c.fillStyle=f.c;c.save();c.scale(fl,1);c.beginPath();c.ellipse(-8,-5,9,7,-.5,0,TAU);c.ellipse(8,-5,9,7,.5,0,TAU);c.ellipse(-6,5,6,5,.4,0,TAU);c.ellipse(6,5,6,5,-.4,0,TAU);c.fill();c.restore();c.fillStyle='#3a2a2a';c.fillRect(-1.5,-9,3,17)})}
  // canopy
  c.drawImage(st.canopy,-40+14*S.osc(9),-20+5*S.osc(7,.3));
  // falling leaves
  for(const l of st.leaves){const y=S.wrap(l.y,l.sec,H,30,1),x=l.x+50*S.osc(l.sp,l.o);c.fillStyle=l.c;S.at(x,y,TAU*S.saw(l.sp,l.o),[l.s/10,(l.s/10)*(.4+.6*Math.abs(S.osc(l.sp/2,l.o)))],()=>c.fill(st.leaf))}
}});
/* =========================================================
   3: Balloon Festival — morning mountains, balloons rise together
   ========================================================= */
function balloonSprite(r,cols,belt){
  const pad=6,w=Math.ceil(2.1*r+pad*2),h=Math.ceil(2.65*r+pad*2);const[cv,x]=mk(w,h);
  const ax=w/2,ay=pad+1.12*r;x.translate(ax,ay);
  const env=new Path2D();env.moveTo(-.22*r,r);env.bezierCurveTo(-.62*r,.64*r,-r,.3*r,-r,-.12*r);env.bezierCurveTo(-r,-.8*r,-.56*r,-1.1*r,0,-1.1*r);
  env.bezierCurveTo(.56*r,-1.1*r,r,-.8*r,r,-.12*r);env.bezierCurveTo(r,.3*r,.62*r,.64*r,.22*r,r);env.closePath();
  x.strokeStyle='#4c3a33';x.lineWidth=Math.max(1,r*.014);x.beginPath();for(const s of[-1,-.35,.35,1]){x.moveTo(s*.2*r,r);x.lineTo(s*.13*r,1.3*r)}x.stroke();
  x.fillStyle='#8f5b34';x.beginPath();x.roundRect(-.15*r,1.28*r,.3*r,.2*r,.03*r);x.fill();
  x.fillStyle='#6d4024';x.fillRect(-.15*r,1.28*r,.3*r,.04*r);x.fillStyle='rgba(255,220,170,.35)';x.fillRect(.02*r,1.32*r,.12*r,.15*r);
  x.save();x.clip(env);
  x.fillStyle=cols[0];x.fillRect(-1.2*r,-1.2*r,2.4*r,2.4*r);
  const G=5;for(let g=G;g>=1;g--){x.fillStyle=cols[g%cols.length];x.beginPath();x.ellipse(0,-.08*r,1.02*r*Math.sin(g/G*Math.PI/2),1.25*r,0,0,TAU);x.fill()}
  if(belt){x.fillStyle=belt;x.fillRect(-r*1.1,-.06*r,2.2*r,.16*r);x.fillStyle='rgba(255,255,255,.85)';
    for(let t=-1.1;t<1.1;t+=.16){x.beginPath();x.moveTo(t*r,-.06*r);x.lineTo((t+.08)*r,.04*r);x.lineTo((t+.16)*r,-.06*r);x.fill()}}
  let g=x.createLinearGradient(-r,0,.5*r,0);g.addColorStop(0,'rgba(40,30,90,.45)');g.addColorStop(1,'rgba(40,30,90,0)');x.fillStyle=g;x.fillRect(-1.2*r,-1.2*r,2.4*r,2.4*r);
  g=x.createRadialGradient(.42*r,-.55*r,0,.42*r,-.55*r,1.0*r);g.addColorStop(0,'rgba(255,255,240,.55)');g.addColorStop(1,'rgba(255,255,240,0)');x.fillStyle=g;x.fillRect(-1.2*r,-1.2*r,2.4*r,2.4*r);
  g=x.createLinearGradient(0,.4*r,0,r);g.addColorStop(0,'rgba(30,20,60,0)');g.addColorStop(1,'rgba(30,20,60,.3)');x.fillStyle=g;x.fillRect(-1.2*r,-1.2*r,2.4*r,2.4*r);
  x.restore();
  x.strokeStyle='rgba(255,250,230,.6)';x.lineWidth=Math.max(1.5,r*.025);x.beginPath();x.arc(0,-.12*r,r*.97,-1.2,.35);x.stroke();
  x.fillStyle='#3d2d3a';x.fillRect(-.22*r,.98*r,.44*r,.06*r);
  return{cv,ax,ay,r};
}
BIS.scene('g4-3',{title:'Balloon Festival',blurb:'Colourful hot-air balloons rise together over snowy mountains, linked by a string of party flags.',
setup(S){
  const st=S.state,R=S.R;
  const SX=1580,SY=210;
  const[bg,b]=mk(W,H);
  b.fillStyle=lg(b,0,0,0,760,[[0,'#2f7fcf'],[.4,'#7cc0ec'],[.75,'#ffd7bd'],[1,'#ffe8cf']]);b.fillRect(0,0,W,H);
  for(const[r,cl]of[[1000,'rgba(255,240,200,.45)'],[380,'rgba(255,250,225,.7)'],[110,'rgba(255,255,245,1)']]){const g=b.createRadialGradient(SX,SY,0,SX,SY,r);g.addColorStop(0,cl);g.addColorStop(1,'rgba(255,240,200,0)');b.fillStyle=g;b.fillRect(0,0,W,H)}
  grain(S,b,W,H,.05);st.sky=bg;
  st.halo=glowSprite('rgba(255,245,215,.8)',256);
  // clouds
  st.clouds=[];
  for(let i=0;i<7;i++){const cw=R(240,520),ch=cw*R(.32,.45);const[cc,cx]=mk(cw+60,ch+60);const parts=[];
    for(let j=0;j<6;j++){const t=j/5;parts.push(S.blob(30+cw*(.12+.76*t),30+ch*(.7-.35*Math.sin(t*Math.PI))+R(-6,6),cw*R(.13,.2),ch*R(.28,.42),{bumps:4,amp:.2}))}
    cx.fillStyle='#fbfcff';for(const p of parts)cx.fill(p);
    cx.save();cx.globalCompositeOperation='source-atop';
    let tg=cx.createLinearGradient(0,0,cw+60,0);tg.addColorStop(0,'rgba(150,170,220,.22)');tg.addColorStop(1,'rgba(255,225,190,.3)');cx.fillStyle=tg;cx.fillRect(0,0,cw+60,ch+60);
    tg=cx.createLinearGradient(0,30+ch*.35,0,30+ch);tg.addColorStop(0,'rgba(140,160,210,0)');tg.addColorStop(1,'rgba(140,160,210,.6)');cx.fillStyle=tg;cx.fillRect(0,0,cw+60,ch+60);cx.restore();
    st.clouds.push({img:cc,y:[90,170,300,380,130,250,420][i],x0:R(0,W),sec:i%3?230:115,a:R(.85,1)})}
  // land
  const[ld,l]=mk(W,H);
  // snowy range
  const pts=[];let x=-80,up=true;while(x<W+120){pts.push([x,up?R(360,480):R(560,600)]);x+=up?R(110,180):R(90,150);up=!up}
  const m1=new Path2D();m1.moveTo(-80,H);const fine=[];
  for(let i=0;i<pts.length;i++){fine.push(pts[i]);if(i<pts.length-1){const a=pts[i],c2=pts[i+1];for(const t of[.33,.66])fine.push([a[0]+(c2[0]-a[0])*t+R(-8,8),a[1]+(c2[1]-a[1])*t+R(-14,14)])}}
  for(const p of fine)m1.lineTo(p[0],p[1]);m1.lineTo(W+200,H);m1.closePath();
  l.save();l.clip(m1);
  l.fillStyle=lg(l,0,360,0,700,[[0,'#8d97cf'],[1,'#b8b5df']]);l.fillRect(0,0,W,H);
  l.fillStyle='#f6f3ff';l.beginPath();l.moveTo(-100,0);l.lineTo(W+200,0);for(let xx=W+200;xx>=-100;xx-=26)l.lineTo(xx,500+22*Math.sin(xx*.03)+R(-14,14));l.closePath();l.fill();
  for(let i=1;i<pts.length;i+=2){if(i%2===0)continue;}
  for(let i=0;i<pts.length;i++){const p=pts[i];if(p[1]>520)continue;const v=pts[i-1]||[p[0]-150,600];
    l.fillStyle='rgba(70,60,140,.28)';l.beginPath();l.moveTo(p[0],p[1]);l.lineTo(v[0],v[1]);l.lineTo(v[0]+20,H);l.lineTo(p[0]+10,H);l.closePath();l.fill()}
  l.fillStyle=lg(l,0,480,0,700,[[0,'rgba(255,230,210,0)'],[1,'rgba(255,230,210,.9)']]);l.fillRect(0,0,W,H);
  l.restore();
  // second range
  const f2=wave(S,4,.003);const r2=x=>640-45*f2(x)-30*Math.abs(f2(x*1.7));
  l.fillStyle=lg(l,0,560,0,720,[[0,'#7f98c4'],[1,'#e5d6dc']]);l.fill(ridgePath(r2,-10,W+10,6,H));
  // green hills
  const f3=wave(S,3,.0035);const r3=st.r3=x=>715-22*f3(x);
  l.fillStyle=lg(l,0,690,0,800,[[0,'#8cc277'],[1,'#6aa860']]);l.fill(ridgePath(r3,-10,W+10,6,H));
  l.fillStyle='rgba(255,240,220,.35)';l.fill(ridgePath(r3,-10,W+10,6,H));
  // poplars rows
  for(let i=0;i<70;i++){const x=R(0,W),y=r3(x)+R(8,60),hh=R(30,64)*(1+(y-715)/120);
    l.fillStyle='#3f7d4b';l.beginPath();l.ellipse(x,y-hh/2,hh*.16,hh/2,0,0,TAU);l.fill();
    l.fillStyle='#78b56a';l.beginPath();l.ellipse(x+hh*.05,y-hh/2,hh*.09,hh*.45,0,-1.2,1.2);l.fill()}
  // meadow foreground
  const f4=wave(S,3,.004);const r4=x=>820-30*f4(x)+Math.pow((x-960)/960,2)*-40;
  l.fillStyle=lg(l,0,780,0,H,[[0,'#6fb35d'],[.5,'#4c9a4a'],[1,'#2f7638']]);l.fill(ridgePath(r4,-10,W+10,6,H));
  l.strokeStyle='rgba(255,250,210,.5)';l.lineWidth=2;l.beginPath();for(let xx=-10;xx<=W+10;xx+=6)xx===-10?l.moveTo(xx,r4(xx)):l.lineTo(xx,r4(xx));l.stroke();
  // yurts
  const yurt=(x,y,s)=>{l.fillStyle='rgba(30,60,30,.25)';l.beginPath();l.ellipse(x+s*.15,y+2,s*1.1,s*.18,0,0,TAU);l.fill();
    l.fillStyle='#f6efe2';l.fillRect(x-s,y-s*.7,2*s,s*.7);l.fillStyle='#e7dcca';l.fillRect(x-s,y-s*.7,s*.7,s*.7);
    l.fillStyle='#c0392b';l.fillRect(x-s,y-s*.52,2*s,s*.12);
    l.fillStyle='#fffaf0';l.beginPath();l.moveTo(x-s*1.05,y-s*.68);l.quadraticCurveTo(x,y-s*1.55,x+s*1.05,y-s*.68);l.closePath();l.fill();
    l.fillStyle='#8b5a3c';l.fillRect(x-s*.18,y-s*.45,s*.36,s*.45)};
  yurt(300,r4(300)+40,34);yurt(390,r4(390)+58,26);yurt(1620,r4(1620)+44,36);
  // grass + flowers
  for(let i=0;i<900;i++){const xx=R(0,W),y=r4(xx)+Math.pow(R(0,1),.8)*(H-r4(xx));const sc=.5+(y-800)/280;
    if(i%3){l.strokeStyle=S.pick(['#3d8a40','#5aa64e','#2e6e35']);l.lineWidth=1.5*sc;l.beginPath();l.moveTo(xx,y);l.lineTo(xx+R(-4,4)*sc,y-R(6,16)*sc);l.stroke()}
    else{l.fillStyle=S.pick(['#ffffff','#ffd84a','#ff7aa8','#c58cff','#ff6b5e']);l.beginPath();l.arc(xx,y,R(1.5,3.5)*sc,0,TAU);l.fill()}}
  grain(S,l,W,H,.05,'source-atop');
  st.land=ld;
  // balloons
  const pal=[['#ff5d5d','#ffd34d'],['#20c1b5','#ffffff','#1a8fd8'],['#9b5cff','#ff7ac0'],['#ff8a2b','#ffe36e','#e8425a'],['#3fb6ff','#ffe066'],['#ff6fb0','#ffffff'],['#7bd957','#2a9d8f']];
  const near=[{x:470,y:330,r:150,p:0,belt:'#2a6fdb'},{x:1270,y:290,r:118,p:1,belt:0},{x:1730,y:540,r:78,p:2,belt:'#ffd34d'},{x:150,y:610,r:56,p:3,belt:0},{x:890,y:150,r:44,p:4,belt:0}];
  st.near=near.map((q,i)=>({...q,sp:balloonSprite(q.r,pal[q.p],q.belt),o:R(0,1),sec:[11,13,9.5,10,12][i]}));
  st.far=[];for(let i=0;i<9;i++){const r=R(12,26);st.far.push({x0:R(0,W),y:R(300,640),r,sp:balloonSprite(r,pal[i%pal.length],0),sec:S.pick([230,115]),o:R(0,1),dir:i%2?1:-1})}
  st.flags=['#ff5d5d','#ffd34d','#20c1b5','#9b5cff','#ff8a2b','#3fb6ff','#ff6fb0'];
  st.gw=glowSprite('rgba(255,180,80,1)',128);
  st.fluff=[];for(let i=0;i<60;i++)st.fluff.push({x0:R(0,W),y:R(80,1000),s:R(2,5),sec:S.pick([57.5,76.7,115]),o:R(0,1),a:R(20,50)});
  st.birds=[];for(let i=0;i<5;i++)st.birds.push({x0:1100+i*50+R(-10,10),y:120+i*14+R(-10,10),s:R(8,11),o:R(0,1)});
},
draw(S){
  const c=S.ctx,st=S.state;
  c.drawImage(st.sky,0,0);
  c.globalCompositeOperation='lighter';c.globalAlpha=.22+.14*S.osc(19);c.drawImage(st.halo,1580-420,210-420,840,840);
  c.globalCompositeOperation='source-over';c.globalAlpha=1;
  for(const cl of st.clouds){const x=S.wrap(cl.x0,cl.sec,W,cl.img.width/2+10,1);c.globalAlpha=cl.a;c.drawImage(cl.img,x-cl.img.width/2,cl.y)}
  c.globalAlpha=1;
  c.drawImage(st.land,0,0);
  // far balloons (in front of mountains, hazy)
  for(const f of st.far){const x=S.wrap(f.x0,f.sec,W,60,f.dir),y=f.y+6*S.osc(8,f.o);c.globalAlpha=.8;c.drawImage(f.sp.cv,x-f.sp.ax,y-f.sp.ay)}
  c.globalAlpha=1;
  c.strokeStyle='#4a5a7a';c.lineWidth=2.2;c.lineCap='round';
  for(const b of st.birds){const x=S.wrap(b.x0,230,W,120,-1),y=b.y+6*S.osc(8,b.o),f=.25+.55*S.osc01(1.4,b.o);
    c.beginPath();c.moveTo(x-b.s,y-b.s*f*.6);c.quadraticCurveTo(x-b.s*.45,y-b.s*f,x,y);c.quadraticCurveTo(x+b.s*.45,y-b.s*f,x+b.s,y-b.s*f*.6);c.stroke()}
  // near balloons, small to large
  const pos=st.near.map(q=>({q,x:q.x+12*S.osc(q.sec*1.7,q.o),y:q.y+16*S.osc(q.sec,q.o),rot:.025*S.osc(q.sec*1.3,q.o+.25)}));
  const order=[...pos].sort((a,b)=>a.q.r-b.q.r);
  const drawB=p=>{const sp=p.q.sp;S.at(p.x,p.y,p.rot,1,()=>{c.drawImage(sp.cv,-sp.ax,-sp.ay);
    const g=S.pulse(9,p.q.o,6);if(g>.02){c.globalCompositeOperation='lighter';c.globalAlpha=g*.85;const rr=p.q.r*.5;c.drawImage(st.gw,-rr,p.q.r*1.05-rr,2*rr,2*rr);c.globalCompositeOperation='source-over';c.globalAlpha=1}})};
  // bunting between A and B
  const A=pos[0],B=pos[1];
  const p0=[A.x+A.q.r*.72,A.y+A.q.r*.55],p2=[B.x-B.q.r*.74,B.y+B.q.r*.5],p1=[(p0[0]+p2[0])/2,(p0[1]+p2[1])/2+120+10*S.osc(6)];
  for(const p of order){if(p===A||p===B)continue;drawB(p)}
  drawB(B);
  c.strokeStyle='#5b4a52';c.lineWidth=2;c.beginPath();c.moveTo(p0[0],p0[1]);c.quadraticCurveTo(p1[0],p1[1],p2[0],p2[1]);c.stroke();
  const m=15;for(let j=1;j<=m;j++){const t=j/(m+1),u=1-t;const x=u*u*p0[0]+2*u*t*p1[0]+t*t*p2[0],y=u*u*p0[1]+2*u*t*p1[1]+t*t*p2[1];
    S.at(x,y,.12*S.osc(3.5,j*.11),1,()=>{c.fillStyle=st.flags[j%st.flags.length];c.beginPath();c.moveTo(-13,0);c.lineTo(13,0);c.lineTo(0,32);c.closePath();c.fill();
      c.fillStyle='rgba(255,255,255,.25)';c.beginPath();c.moveTo(0,0);c.lineTo(13,0);c.lineTo(0,32);c.closePath();c.fill()})}
  drawB(A);
  // floating seeds
  c.fillStyle='rgba(255,255,250,.85)';
  for(const f of st.fluff){const x=S.wrap(f.x0,f.sec,W,20,1),y=f.y+f.a*S.osc(f.sec/4,f.o);c.globalAlpha=.4+.5*S.osc01(5,f.o);c.beginPath();c.arc(x,y,f.s,0,TAU);c.fill()}
  c.globalAlpha=1;
}});
})();
