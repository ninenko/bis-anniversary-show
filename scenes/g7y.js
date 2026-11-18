/* Grade 7Y - Together We Rise (90 s) */
(function(){
const TAU=Math.PI*2;
function glowSprite(r,rgb,a0=1){const c=document.createElement('canvas');c.width=c.height=r*2;const x=c.getContext('2d');
  const g=x.createRadialGradient(r,r,0,r,r,r);g.addColorStop(0,`rgba(${rgb},${a0})`);g.addColorStop(.3,`rgba(${rgb},${a0*.4})`);g.addColorStop(1,`rgba(${rgb},0)`);
  x.fillStyle=g;x.fillRect(0,0,r*2,r*2);return c}

/* ---------- 1: Rising Lanterns ---------- */
BIS.scene('g7y-1',{title:'Rising Lanterns',blurb:'Hundreds of glowing lanterns drift upward together in graceful formation over a starry night.',
 setup(S){const st=S.state;
  st.glow=glowSprite(120,'255,190,90',1);
  st.stars=Array.from({length:140},()=>({x:S.R(0,1920),y:S.R(0,800),r:S.R(.8,2.2),ph:S.rnd(),tw:S.R(6,14)}));
  // formation: staggered rows making a wide chevron; whole group rises, each wave of lanterns offset
  st.l=[];
  const rows=8,per=11;
  for(let r=0;r<rows;r++){for(let i=0;i<per;i++){
    const u=(i/(per-1))*2-1; // -1..1
    const x=960+u*(780-r*20)+(r%2?35:0);
    const yb=r/rows*1300+Math.abs(u)*-90; // chevron shape: centre leads
    st.l.push({x,yb,sc:.55+.45*(1-Math.abs(u)*.4)*(.7+.3*S.rnd()),ph:S.rnd(),warm:S.R(0,1),sway:S.R(10,26)})}}
  st.hills=new Path2D();st.hills.moveTo(0,1080);for(let x=0;x<=1920;x+=40)st.hills.lineTo(x,960+Math.sin(x*.004+1)*40+Math.sin(x*.013)*14);st.hills.lineTo(1920,1080);st.hills.closePath();
 },
 draw(S){const c=S.ctx,st=S.state;
  S.bg('#070b2a','#162250','#3a3a7a','#8a5a8a');
  for(const s of st.stars){c.globalAlpha=.3+.7*S.osc01(s.tw,s.ph);c.fillStyle='#fff';c.beginPath();c.arc(s.x,s.y,s.r,0,TAU);c.fill()}
  c.globalAlpha=1;
  // lanterns: one shared rise cycle, formation keeps its shape
  const rise=S.saw(45);
  c.save();c.globalCompositeOperation='lighter';
  const order=st.l;
  for(const l of order){
    const y=((l.yb+ rise*1300) % 1300+1300)%1300; // 0..1300 position going up
    const py=1200-y*1.0;
    if(py<-120||py>1200)continue;
    const x=l.x+S.osc(18,l.ph)*l.sway;
    const k=l.sc,fl=.85+.15*S.osc(5,l.ph);
    const fade=S.clamp(py/260)*S.clamp((1200-py)/160);
    c.globalAlpha=.9*fade*fl;
    const gr=110*k;c.drawImage(st.glow,x-gr,py-gr,gr*2,gr*2);
  }
  c.restore();
  // lantern bodies
  for(const l of order){
    const y=((l.yb+rise*1300)%1300+1300)%1300,py=1200-y;
    if(py<-120||py>1200)continue;
    const x=l.x+S.osc(18,l.ph)*l.sway,k=l.sc,fl=.85+.15*S.osc(5,l.ph);
    const fade=S.clamp(py/260)*S.clamp((1200-py)/160);
    c.globalAlpha=fade;
    const w=30*k,h=42*k;
    const g=c.createLinearGradient(x,py-h,x,py+h);g.addColorStop(0,`hsl(${28+l.warm*12},95%,${68*fl}%)`);g.addColorStop(1,`hsl(${14+l.warm*10},90%,${52*fl}%)`);
    c.fillStyle=g;c.beginPath();c.moveTo(x-w*.7,py-h);c.quadraticCurveTo(x-w*1.15,py,x-w*.8,py+h);c.lineTo(x+w*.8,py+h);c.quadraticCurveTo(x+w*1.15,py,x+w*.7,py-h);c.closePath();c.fill();
    c.fillStyle='rgba(255,240,190,.65)';c.beginPath();c.ellipse(x,py+h*.15,w*.38,h*.5,0,0,TAU);c.fill();
    c.fillStyle='rgba(60,25,30,.7)';c.fillRect(x-w*.7,py-h-3*k,w*1.4,5*k);c.fillRect(x-w*.8,py+h-2*k,w*1.6,5*k);
  }
  c.globalAlpha=1;
  c.fillStyle='#0a0c26';c.fill(st.hills);
 }});

/* ---------- 2: Turning Together ---------- */
BIS.scene('g7y-2',{title:'Turning Together',blurb:'Colourful interlocking gears turn in perfect sync, a picture of teamwork.',
 setup(S){const st=S.state;
  const mod=10;
  const C=[['#ff7a59','#ffb26b'],['#ffd23f','#ffe58a'],['#2ec4b6','#7be0d4'],['#8f6bff','#c1a8ff'],['#ff5d8f','#ff9fbd'],['#4ea8ff','#9bd0ff'],['#3ddc97','#98f0c8'],['#ffa94d','#ffd08a'],['#c77dff','#e3b8ff'],['#ff6b6b','#ffa8a8']];
  const ns=[24,14,28,16,22,12,30,18,26,14];
  const spec=ns.map((n,i)=>i?{n,col:C[i],p:i-1,a:i%2?.3:-.3}:{n,col:C[0],x:100,y:560});
  [[2,16,-1.65,10],[4,14,-1.45,11],[6,18,1.15,12],[8,20,1.5,13],[6,14,-1.3,14],[0,16,-1.0,15]].forEach(([p,n,a,ci],k)=>spec.push({n,col:C[k%10],p,a}));
  spec.forEach((g,i)=>{g.r=g.n*mod/2;if(i){const P=spec[g.p];const d=P.r+g.r+1;g.x=P.x+Math.cos(g.a)*d;g.y=P.y+Math.sin(g.a)*d}});
  st.g=spec;
  // gear path
  const tooth=(n,r)=>{const p=new Path2D(),ro=r+mod*.55,ri=r-mod*.55,step=TAU/n;
    for(let i=0;i<n;i++){const a=i*step;const pts=[[ri,a-step*.5+step*.04],[ro,a-step*.28],[ro,a-step*.08*0],[ro,a+step*.28],[ri,a+step*.5-step*.04]];
      // simple trapezoid tooth
      const A=[ri,a-step*.46],B=[ro,a-step*.22],C=[ro,a+step*.22],D=[ri,a+step*.46];
      [A,B,C,D].forEach((q,j)=>{const x=Math.cos(q[1])*q[0],y=Math.sin(q[1])*q[0];(i===0&&j===0)?p.moveTo(x,y):p.lineTo(x,y)})}
    p.closePath();return p};
  spec.forEach(g=>{g.path=tooth(g.n,g.r)});
  st.dots=Array.from({length:60},()=>({x:S.R(0,1920),y:S.R(0,1080),r:S.R(2,6),sec:S.R(60,120)}));
  st.spec=spec;
 },
 draw(S){const c=S.ctx,st=S.state,g=st.g;
  S.bg('#101c3d','#1c2f66','#2a2f73');
  c.fillStyle='rgba(255,255,255,.06)';
  for(const d of st.dots){c.beginPath();c.arc(d.x,S.wrap(d.y,d.sec,1080,20,-1),d.r,0,TAU);c.fill()}
  // angles via meshing chain
  const th=[];th[0]=TAU*4*S.p;
  for(let i=1;i<g.length;i++){const G=g[i],P=g[G.p];th[i]=G.a+Math.PI+Math.PI/G.n-(th[G.p]-G.a)*P.n/G.n}
  for(let i=0;i<g.length;i++){
    const G=g[i];c.save();c.translate(G.x,G.y);c.rotate(th[i]);
    const ca=Math.cos(-th[i]),sa=Math.sin(-th[i]),ex=G.r*(ca-sa),ey=G.r*(sa+ca);const gr=c.createLinearGradient(-ex,-ey,ex,ey);// light stays fixed while gear turnsgr.addColorStop(0,G.col[1]);gr.addColorStop(1,G.col[0]);
    c.fillStyle=gr;c.fill(G.path);
    c.fillStyle='rgba(255,255,255,.14)';c.beginPath();c.arc(0,0,G.r*.82,0,TAU);c.fill();
    c.fillStyle='rgba(16,28,61,.32)';c.beginPath();c.arc(0,0,G.r*.66,0,TAU);c.fill();
    // spokes
    c.fillStyle=G.col[0];// spoke count chosen so the gear's turn per loop (96/n rev) is a whole number of spoke steps → seamless
    const gcd=(a,b)=>b?gcd(b,a%b):a,q=G.n/gcd(96,G.n);let sp=q<=1?6:q;while(sp<4)sp*=2;if(sp>8)sp=0;
    for(let k=0;k<sp;k++){c.save();c.rotate(k/sp*TAU);c.fillRect(-G.r*.07,0,G.r*.14,G.r*.66);c.restore()}
    c.fillStyle=G.col[1];c.beginPath();c.arc(0,0,G.r*.2,0,TAU);c.fill();
    c.fillStyle='#16224a';c.beginPath();c.arc(0,0,G.r*.09,0,TAU);c.fill();
    c.restore();
  }
 }});

/* ---------- 3: Flock at Dawn ---------- */
BIS.scene('g7y-3',{title:'Flock at Dawn',blurb:'Flocks of birds cross a pink-gold dawn sky in V formations, rising together.',
 setup(S){const st=S.state;
  st.glow=glowSprite(700,'255,200,150',1);
  st.flocks=[
   {y:230,sec:50,x:200,n:11,sc:1.1,sp:62,off:0},
   {y:420,sec:70,x:1300,n:9,sc:.8,sp:46,off:.4},
   {y:140,sec:90,x:900,n:7,sc:.55,sp:34,off:.7},
   {y:560,sec:110,x:1700,n:13,sc:.65,sp:40,off:.15}];
  st.clouds=Array.from({length:6},()=>({x:S.R(0,1920),y:S.R(250,700),w:S.R(500,900),h:S.R(40,80),sec:S.R(120,200),a:S.R(.15,.35)}));
  const hill=(base,amp,s)=>{const p=new Path2D();p.moveTo(0,1080);for(let x=0;x<=1920;x+=40)p.lineTo(x,base+Math.sin(x*.003+s)*amp+Math.sin(x*.008+s*3)*amp*.3);p.lineTo(1920,1080);p.closePath();return p};
  st.hills=[hill(860,35,1),hill(930,30,4),hill(1000,22,7)];
 },
 draw(S){const c=S.ctx,st=S.state;
  S.bg('#4b4f9a','#b86ca0','#ff9a8b','#ffd29a');
  c.save();c.globalCompositeOperation='lighter';c.globalAlpha=.55+.15*S.osc01(20);c.drawImage(st.glow,1500-700,820-700);c.restore();
  c.fillStyle=S.radial(1500,820,90,'#fff6dc','rgba(255,230,170,0)');c.beginPath();c.arc(1500,820,110,0,TAU);c.fill();
  for(const k of st.clouds){const x=S.wrap(k.x,k.sec,1920,500);c.fillStyle=`rgba(255,225,215,${k.a})`;c.beginPath();c.ellipse(x,k.y,k.w/2,k.h,0,0,TAU);c.fill();c.beginPath();c.ellipse(x+k.w*.2,k.y-k.h*.5,k.w*.28,k.h*.8,0,0,TAU);c.fill()}
  // flocks
  c.lineCap='round';c.lineJoin='round';
  for(const f of st.flocks){
    const lead=S.wrap(f.x,f.sec,1920,260);
    const alt=f.y+S.osc(30,f.off)*30;
    const depth=f.sc;
    c.strokeStyle=`rgba(40,22,52,${.55+.35*depth})`;c.lineWidth=3.2*depth;
    for(let i=0;i<f.n;i++){
      const row=Math.ceil(i/2),side=i%2?1:-1; // leader i=0
      const bx=lead-row*54*depth,by=alt+(i===0?0:side*row*34*depth)+S.osc(11,row*.07+f.off)*6;
      const flap=S.osc(1.5+ (i%3)*.07,row*.11+f.off); // birds nearer the tail lag slightly
      const w=30*depth,fl=flap*.6;
      c.beginPath();c.moveTo(bx-w,by-w*.45*(1+fl)+w*.3);c.quadraticCurveTo(bx-w*.5,by-w*.75*(1+fl),bx,by);c.quadraticCurveTo(bx+w*.5,by-w*.75*(1+fl),bx+w,by-w*.45*(1+fl)+w*.3);c.stroke();
    }
  }
  const cols=['#a05a8c','#6a4380','#33265c'];
  st.hills.forEach((h,i)=>{c.fillStyle=cols[i];c.fill(h)});
 }});
})();
