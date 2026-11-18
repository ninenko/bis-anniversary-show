/* Grade 4 — We're All in This Together (friendship, upbeat) */
(function(){
const TAU=Math.PI*2;
const sm=t=>t*t*(3-2*t);
function sprite(color,size=128){const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');
  const g=x.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);g.addColorStop(0,color);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,size,size);return c}

/* ---------- 1: ring of friends around a glowing globe ---------- */
BIS.scene('g4-1',{title:'Circle of Friends',blurb:'A ring of colourful friends holds hands and circles a glowing globe.',
setup(S){
  const st=S.state;
  st.cols=['#ff5a5f','#ffb627','#2ec4b6','#5b8cff','#b46bff','#ff7ab8','#7bd957','#ff8a3d'];
  st.n=16;
  st.fig=[];for(let i=0;i<st.n;i++)st.fig.push({c:st.cols[i%st.cols.length],hc:S.pick(['#ffd9b3','#f2b98b','#c98b5e','#8d5a3b','#ffe0c2']),ph:S.R(0,1),h:S.R(.92,1.08)});
  st.land=[];for(let i=0;i<9;i++)st.land.push({lon:S.R(0,TAU),lat:S.R(-1,1),r:S.R(.18,.34)});
  st.stars=[];for(let i=0;i<70;i++)st.stars.push({x:S.R(0,1920),y:S.R(0,1080),r:S.R(2,6),sec:S.R(6,14),off:S.R(0,1)});
  st.gs=sprite('rgba(255,255,255,1)');st.gw=sprite('rgba(255,210,120,1)');
  st.star=S.starPath(14,6,4);
  st.bokeh=[];for(let i=0;i<22;i++)st.bokeh.push({x:S.R(0,1920),y:S.R(0,1080),r:S.R(40,140),c:S.pick(['#ff5ab8','#5b8cff','#ffb627','#2ec4b6']),sec:S.R(14,30),off:S.R(0,1)});
},
draw(S){
  const c=S.ctx,st=S.state,W=S.W,H=S.H;
  S.bg('#2a1a6e','#6a2c9a','#e0508f');
  c.globalCompositeOperation='lighter';
  for(const b of st.bokeh){c.globalAlpha=.16+.08*S.osc01(b.sec,b.off);c.drawImage(st.gs,b.x-b.r,b.y-b.r,b.r*2,b.r*2)}
  c.globalAlpha=1;c.globalCompositeOperation='source-over';
  for(const s of st.stars){c.globalAlpha=.25+.55*S.osc01(s.sec,s.off);c.fillStyle='#fff';S.at(s.x,s.y,0,s.r/10,()=>c.fill(st.star))}
  c.globalAlpha=1;
  const gx=960,gy=420,gr=190,cy=700,rx=720,ry=150;
  const rot=TAU*S.saw(70);
  const pos=st.fig.map((f,i)=>{const a=rot+i/st.n*TAU;return{a,x:gx+Math.cos(a)*rx,y:cy+Math.sin(a)*ry,z:Math.sin(a),f}});
  const hands=(p,q)=>{ // arms meet halfway
    const mx=(p.x+q.x)/2,my=(p.y+q.y)/2+8;return[mx,my]};
  const fig=(p,i)=>{
    const sc=.78+.32*(p.z*.5+.5),bob=Math.abs(Math.sin(TAU*(S.cycles(1.9)*S.p+p.f.ph)))*14*sc;
    const fx=p.x,fy=p.y-bob,hh=p.f.h*sc;
    const q=pos[(i+1)%st.n],nq={x:q.x,y:q.y};
    const[mx,my]=hands(p,q);
    c.lineCap='round';c.strokeStyle=p.f.c;c.lineWidth=17*sc;
    c.beginPath();c.moveTo(fx,fy-118*hh*.0-70*sc*hh);c.lineTo(mx,my-30*sc);c.stroke();
    const pq=pos[(i+st.n-1)%st.n];const[mx2,my2]=hands(pq,p);
    c.beginPath();c.moveTo(fx,fy-70*sc*hh);c.lineTo(mx2,my2-30*sc);c.stroke();
    c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(p.x,p.y+8*sc,38*sc,11*sc,0,0,TAU);c.fill();
    // legs
    c.lineWidth=15*sc;c.strokeStyle='#2b2250';
    const sw=Math.sin(TAU*(S.cycles(1.9)*S.p+p.f.ph))*8*sc;
    c.beginPath();c.moveTo(fx-9*sc,fy-30*sc);c.lineTo(fx-11*sc+sw,p.y);c.moveTo(fx+9*sc,fy-30*sc);c.lineTo(fx+11*sc-sw,p.y);c.stroke();
    // body
    c.fillStyle=p.f.c;c.beginPath();c.roundRect(fx-26*sc,fy-100*sc*hh,52*sc,76*sc*hh,[22*sc,22*sc,12*sc,12*sc]);c.fill();
    c.fillStyle='rgba(255,255,255,.28)';c.beginPath();c.roundRect(fx-26*sc,fy-100*sc*hh,52*sc,22*sc,[22*sc,22*sc,0,0]);c.fill();
    c.fillStyle=p.f.hc;c.beginPath();c.arc(fx,fy-128*sc*hh,25*sc,0,TAU);c.fill();
    c.fillStyle='rgba(60,30,20,.85)';c.beginPath();c.arc(fx,fy-136*sc*hh,25*sc,Math.PI*1.05,Math.PI*1.95);c.fill();
    // hand dots
    c.fillStyle=p.f.hc;c.beginPath();c.arc(mx,my-30*sc,9*sc,0,TAU);c.fill();
  };
  // back half
  pos.map((p,i)=>[p,i]).filter(([p])=>p.z<0).sort((a,b)=>a[0].z-b[0].z).forEach(([p,i])=>fig(p,i));
  // globe
  const pulse=S.osc01(6);
  c.globalCompositeOperation='lighter';c.globalAlpha=.55+.2*pulse;c.drawImage(st.gw,gx-gr*2.2,gy-gr*2.2,gr*4.4,gr*4.4);c.globalAlpha=1;c.globalCompositeOperation='source-over';
  c.fillStyle=S.radial(gx-60,gy-70,gr*1.3,'#9be8ff','#2563d8');c.beginPath();c.arc(gx,gy,gr,0,TAU);c.fill();
  c.save();c.beginPath();c.arc(gx,gy,gr,0,TAU);c.clip();
  const gr2=TAU*S.saw(60);
  c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=3;
  for(let k=0;k<6;k++){const a=gr2+k/6*Math.PI;c.beginPath();c.ellipse(gx,gy,Math.abs(Math.cos(a))*gr,gr,0,0,TAU);c.stroke()}
  for(let k=-2;k<=2;k++){const yy=gy+k*gr*.34,rr=Math.sqrt(Math.max(0,gr*gr-(k*gr*.34)**2));c.beginPath();c.ellipse(gx,yy,rr,rr*.12,0,0,TAU);c.stroke()}
  c.fillStyle='rgba(120,230,140,.8)';
  for(const l of st.land){const a=l.lon+gr2;const vis=Math.cos(a);if(vis<-.2)continue;const y=gy+Math.sin(l.lat*1.2)*gr*.7,x=gx+Math.sin(a)*gr*Math.cos(l.lat*1.2)*.95;
    c.beginPath();c.ellipse(x,y,gr*l.r*Math.max(.15,vis),gr*l.r*.8,0,0,TAU);c.fill()}
  c.fillStyle=S.radial(gx+70,gy+80,gr*1.4,'rgba(0,0,40,0)','rgba(0,0,40,.55)');c.fillRect(gx-gr,gy-gr,gr*2,gr*2);
  c.restore();
  c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=4;c.beginPath();c.arc(gx,gy,gr,0,TAU);c.stroke();
  // front half
  pos.map((p,i)=>[p,i]).filter(([p])=>p.z>=0).sort((a,b)=>a[0].z-b[0].z).forEach(([p,i])=>fig(p,i));
}});

/* ---------- 2: puzzle pieces forming a heart ---------- */
BIS.scene('g4-2',{title:'Pieces Fit Together',blurb:'Colourful puzzle pieces drift together into a heart, then float apart again.',
setup(S){
  const st=S.state,cell=66,hp=S.heartPath(500);
  const cv=document.createElement('canvas').getContext('2d');
  const pieces=[],cols=['#ff5a5f','#ffb627','#2ec4b6','#5b8cff','#b46bff','#ff7ab8','#7bd957'];
  const x0=-740/2-cell,y0=-300,cx=960,cy=470;
  const nx=16,ny=14;
  const hE=[],vE=[];
  for(let i=0;i<=nx+1;i++){hE[i]=[];vE[i]=[];for(let j=0;j<=ny+1;j++){hE[i][j]=S.rnd()<.5?1:-1;vE[i][j]=S.rnd()<.5?1:-1}}
  const knob=(p,ax,ay,bx,by,sign)=>{ // edge A->B with knob toward outward normal*sign
    const dx=bx-ax,dy=by-ay,nxv=dy,nyv=-dx; // right-hand normal
    const f=(t,h)=>[ax+dx*t+nxv*h*sign,ay+dy*t+nyv*h*sign];
    let q;
    p.lineTo(...f(.35,0));
    p.bezierCurveTo(...f(.35,.1),...f(.27,.14),...f(.3,.21),...f(.32,.3));
    p.bezierCurveTo(...f(.34,.3),...f(.66,.3),...f(.7,.3));
    p.bezierCurveTo(...f(.73,.14),...f(.65,.1),...f(.65,0),...f(.65,0));
    p.lineTo(bx,by)};
  const tile=(i,j)=>{const p=new Path2D(),h=cell/2;const s=cell;
    p.moveTo(-h,-h);
    knob2(p,-h,-h,h,-h,-vE[i][j]);       // top
    knob2(p,h,-h,h,h,-hE[i+1][j]);       // right
    knob2(p,h,h,-h,h,-vE[i][j+1]);       // bottom
    knob2(p,-h,h,-h,-h,-hE[i][j]);       // left
    p.closePath();return p};
  function knob2(p,ax,ay,bx,by,sign){
    const dx=bx-ax,dy=by-ay,nxv=dy,nyv=-dx;
    const f=(t,h)=>[ax+dx*t+nxv*h*sign,ay+dy*t+nyv*h*sign];
    p.lineTo(...f(.36,0));
    p.bezierCurveTo(...f(.36,.07),...f(.28,.1),...f(.3,.17));
    p.bezierCurveTo(...f(.32,.25),...f(.68,.25),...f(.7,.17));
    p.bezierCurveTo(...f(.72,.1),...f(.64,.07),...f(.64,0));
    p.lineTo(bx,by)}
  for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){
    const tx=(i-nx/2+.5)*cell,ty=(j-ny/2+.5)*cell-120;
    // inside heart? heart local coords centred 0,0
    if(!cv.isPointInPath(hp,tx,ty))continue;
    const ang=S.R(0,TAU);
    pieces.push({tx:cx+tx,ty:cy+ty+130,path:tile(i,j),col:cols[(i+j*2)%cols.length],
      sx:S.R(100,1820),sy:S.R(80,1000),sr:S.R(-1.2,1.2),ph:S.R(0,TAU),sec:S.R(9,18),d:S.R(0,.18)});
  }
  st.pieces=pieces;
  st.dots=[];for(let i=0;i<60;i++)st.dots.push({x:S.R(0,1920),y:S.R(0,1080),r:S.R(3,12),sec:S.R(40,90),dir:S.pick([-1,1]),a:S.R(.1,.35)});
  st.gs=sprite('rgba(255,255,255,1)');
},
draw(S){
  const c=S.ctx,st=S.state;
  S.bg('#0f3b6e','#1b6c9a','#2ec4b6');
  c.globalCompositeOperation='lighter';
  c.globalAlpha=.25+.1*S.osc01(10);c.drawImage(st.gs,420,-60,1100,1100);c.globalAlpha=1;
  c.globalCompositeOperation='source-over';
  for(const d of st.dots){c.globalAlpha=d.a;c.fillStyle='#fff';c.beginPath();c.arc(d.x,S.wrap(d.y,d.sec,1080,30,d.dir),d.r,0,TAU);c.fill()}
  c.globalAlpha=1;
  // gather cycle: 0 apart, 1 together
  const raw=S.osc01(46,.0),g=sm(S.clamp((raw-.25)/.5));
  const beat=1+.012*Math.sin(TAU*S.cycles(1.2)*S.p)*g;
  const hb=g>.98?1:0;
  c.lineWidth=3;
  for(const p of st.pieces){
    const gg=sm(S.clamp((g-p.d)/(1-p.d)));
    const fx=p.sx+Math.sin(TAU*(S.cycles(p.sec)*S.p)+p.ph)*70,fy=p.sy+Math.cos(TAU*(S.cycles(p.sec)*S.p)+p.ph)*55;
    const x=fx+(p.tx-fx)*gg,y=fy+(p.ty-fy)*gg,r=(p.sr+Math.sin(TAU*S.cycles(p.sec*1.5)*S.p+p.ph)*.4)*(1-gg);
    c.save();c.translate(960+(x-960)*(1+(beat-1)),470+(y-470)*beat);c.rotate(r);const sc=.9+.1*gg;c.scale(sc,sc);
    c.fillStyle=p.col;c.fill(p.path);
    c.strokeStyle='rgba(255,255,255,.55)';c.stroke(p.path);
    c.restore();
  }
  c.globalCompositeOperation='lighter';c.globalAlpha=sm(S.clamp((g-.8)/.2))*.35;c.drawImage(st.gs,460,50,1000,1000);
  c.globalAlpha=1;c.globalCompositeOperation='source-over';
}});

/* ---------- 3: team-colour diagonal stripes, stars, bursts ---------- */
BIS.scene('g4-3',{title:'Team Colours',blurb:'Bold team-colour stripes slide across the screen with spinning stars and soft bursts.',
setup(S){
  const st=S.state;
  st.pal=[['#e63946','#ffd23f'],['#1d4ed8','#f8fafc'],['#ff8a1f','#ffd23f'],['#1d4ed8','#e63946'],['#16a34a','#ffd23f'],['#e63946','#f8fafc']];
  st.star=S.starPath(40,17,5);
  st.stars=[];for(let i=0;i<14;i++)st.stars.push({x:S.R(60,1860),y:S.R(40,1040),s:S.R(.5,1.3),sec:S.R(10,20),dir:S.pick([-1,1]),off:S.R(0,1),c:S.pick(['#fff','#ffd23f','#fff'])});
  st.bursts=[];for(let i=0;i<5;i++)st.bursts.push({x:S.R(160,1760),y:S.R(100,900),r:S.R(130,230),n:S.pick([10,12,14]),sec:S.R(7,12),off:S.R(0,1),c:S.pick(['#fff','#ffd23f'])});
  const bp=new Path2D();st.burst=bp;
  st.shade=null;
},
draw(S){
  const c=S.ctx,st=S.state,W=S.W,H=S.H;
  c.fillStyle='#1d4ed8';c.fillRect(0,0,W,H);
  c.save();c.translate(W/2,H/2);c.rotate(-.5);
  const sw=150,cols=['#e63946','#ffd23f','#1d4ed8','#f8fafc','#ff8a1f','#16a34a'],per=sw*cols.length,off=S.saw(30)*per;
  for(let k=-14;k<22;k++){const x=-1500+k*sw+off;c.fillStyle=cols[((k%6)+6)%6];c.fillRect(x,-1400,sw+1,2800)}
  const off2=-S.saw(24)*sw*2;
  c.fillStyle='rgba(255,255,255,.22)';
  for(let k=-14;k<24;k++){const x=-1500+k*sw*2+off2+sw*.3;c.fillRect(x,-1400,22,2800)}
  c.fillStyle='rgba(20,30,100,.16)';
  for(let k=-14;k<24;k++){const x=-1500+k*sw*2+off2+sw*1.2;c.fillRect(x,-1400,60,2800)}
  c.restore();
  // calm lower-middle: soft dark wash
  const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(10,20,80,0)');g.addColorStop(.55,'rgba(10,20,80,.18)');g.addColorStop(1,'rgba(10,20,80,.45)');c.fillStyle=g;c.fillRect(0,0,W,H);
  // bursts
  for(const b of st.bursts){
    const k=S.osc01(b.sec,b.off),r=b.r*(.75+.35*k);
    c.save();c.translate(b.x,b.y);c.rotate(TAU*S.saw(40)*(b.n%2?1:-1));c.globalAlpha=.18+.3*k;c.fillStyle=b.c;
    for(let i=0;i<b.n;i++){const a=i/b.n*TAU,w=.09;c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(a-w)*r,Math.sin(a-w)*r);c.lineTo(Math.cos(a)*r*1.18,Math.sin(a)*r*1.18);c.lineTo(Math.cos(a+w)*r,Math.sin(a+w)*r);c.closePath();c.fill()}
    c.beginPath();c.arc(0,0,r*.28,0,TAU);c.fill();
    c.restore();
  }
  c.globalAlpha=1;
  for(const s of st.stars){
    c.save();c.translate(s.x,s.y);c.rotate(TAU*S.saw(s.sec)*s.dir);const k=.85+.25*S.osc(s.sec/2,s.off);c.scale(s.s*k,s.s*k);
    c.fillStyle=s.c;c.strokeStyle='rgba(20,30,100,.55)';c.lineWidth=5;c.lineJoin='round';c.fill(st.star);c.stroke(st.star);c.restore();
  }
}});
})();
