/* Grade 5 — Hold My Hand (connection, support) */
(function(){
const TAU=Math.PI*2;
function sprite(color,size=128){const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');
  const g=x.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);g.addColorStop(0,color);g.addColorStop(.35,color.replace(/[\d.]+\)$/,'.35)'));g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,size,size);return c}

/* ---------- 1: constellation network ---------- */
BIS.scene('g5-1',{title:'Constellation',blurb:'Drifting points of light join with glowing lines whenever they come close.',
setup(S){
  const st=S.state;st.pts=[];
  for(let i=0;i<120;i++)st.pts.push({x:S.R(-40,1960),y:S.R(-40,1120),ax:S.R(60,200),ay:S.R(50,160),sx:S.R(24,60),sy:S.R(24,60),ox:S.R(0,1),oy:S.R(0,1),r:S.R(3,6.5),h:S.R(0,1)});
  for(let i=0;i<8;i++){const p=st.pts[i];p.r=S.R(9,13);p.hub=true}
  st.cy=sprite('rgba(120,220,255,1)');st.go=sprite('rgba(255,200,120,1)');st.wh=sprite('rgba(255,255,255,1)');
  st.neb=[];for(let i=0;i<7;i++)st.neb.push({x:S.R(100,1820),y:S.R(100,980),r:S.R(300,600),c:S.pick(['rgba(70,60,200,1)','rgba(30,130,190,1)','rgba(150,50,170,1)']),sec:S.R(20,40),off:S.R(0,1)});
  st.bs=[];for(let i=0;i<150;i++)st.bs.push({x:S.R(0,1920),y:S.R(0,1080),r:S.R(1,2.4),sec:S.R(5,12),off:S.R(0,1)});
},
draw(S){
  const c=S.ctx,st=S.state,W=S.W,H=S.H;
  S.bg('#070b2a','#101a4d','#1b1f5e');
  c.globalCompositeOperation='lighter';
  for(const n of st.neb){c.globalAlpha=.18+.07*S.osc01(n.sec,n.off);c.drawImage(st.wh,n.x-n.r,n.y-n.r,n.r*2,n.r*2);
    c.globalAlpha=.16;c.fillStyle='transparent'}
  c.globalAlpha=1;
  // tint nebulas
  for(const n of st.neb){c.globalAlpha=.1;const g=c.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r);g.addColorStop(0,n.c);g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(n.x-n.r,n.y-n.r,n.r*2,n.r*2)}
  c.globalAlpha=1;c.fillStyle='#cfe6ff';
  for(const b of st.bs){c.globalAlpha=.15+.5*S.osc01(b.sec,b.off);c.beginPath();c.arc(b.x,b.y,b.r,0,TAU);c.fill()}
  c.globalAlpha=1;
  const P=st.pts,n=P.length;
  for(const p of P){p.cx=p.x+p.ax*S.osc(p.sx,p.ox);p.cy2=p.y+p.ay*S.osc(p.sy,p.oy)}
  const D=210,bins=[[],[],[]];
  for(let i=0;i<n;i++){const a=P[i];for(let j=i+1;j<n;j++){const b=P[j],dx=a.cx-b.cx;if(dx>D||dx<-D)continue;const dy=a.cy2-b.cy2,d=Math.sqrt(dx*dx+dy*dy);if(d<D){const k=1-d/D;bins[k<.33?0:k<.66?1:2].push(a.cx,a.cy2,b.cx,b.cy2)}}}
  c.lineCap='round';
  const al=[.22,.45,.75],lw=[1.4,2,2.8];
  for(let k=0;k<3;k++){c.strokeStyle=`rgba(150,215,255,${al[k]})`;c.lineWidth=lw[k];c.beginPath();const a=bins[k];for(let i=0;i<a.length;i+=4){c.moveTo(a[i],a[i+1]);c.lineTo(a[i+2],a[i+3])}c.stroke()}
  for(const p of P){
    const warm=p.h>.78,sp=warm?st.go:st.cy,r=p.r*(p.hub?1+.2*S.osc01(6,p.ox):1);
    c.globalCompositeOperation='lighter';c.globalAlpha=p.hub?.9:.7;c.drawImage(sp,p.cx-r*4,p.cy2-r*4,r*8,r*8);
    c.globalAlpha=1;c.globalCompositeOperation='source-over';c.fillStyle=warm?'#fff0cf':'#eaf8ff';c.beginPath();c.arc(p.cx,p.cy2,r*.55,0,TAU);c.fill();
  }
}});

/* ---------- 2: golden threads weaving between circles of light ---------- */
BIS.scene('g5-2',{title:'Golden Threads',blurb:'Glowing golden strings weave and link floating circles of light.',
setup(S){
  const st=S.state;
  st.nodes=[];const n=9;
  for(let i=0;i<n;i++)st.nodes.push({x:200+i*190+S.R(-30,30),y:(i%2?260:420)+S.R(-80,80),r:S.R(38,70),ax:S.R(30,70),ay:S.R(30,70),sx:S.R(24,48),sy:S.R(24,48),ox:S.R(0,1),oy:S.R(0,1)});
  // extra lower, calmer ones
  st.pairs=[];
  for(let i=0;i<n;i++){st.pairs.push([i,(i+1)%n===0?i:(i+1)]);if(i+2<n)st.pairs.push([i,i+2]);if(i+3<n&&i%2==0)st.pairs.push([i,i+3])}
  st.pairs=st.pairs.filter(p=>p[0]!==p[1]);
  st.pairs.forEach(p=>{p.ph=S.R(0,1);p.sec=S.R(14,28);p.amp=S.R(40,110);p.k=S.RI(1,2);p.drop=S.R(0,220)});
  st.gold=sprite('rgba(255,205,110,1)');st.rose=sprite('rgba(255,120,150,1)');
  st.dust=[];for(let i=0;i<90;i++)st.dust.push({x:S.R(0,1920),y:S.R(0,1080),r:S.R(1.5,3.5),sec:S.R(40,90),sw:S.R(10,40),off:S.R(0,1)});
},
draw(S){
  const c=S.ctx,st=S.state;
  S.bg('#2a0a2e','#4a1238','#7a2430');
  c.globalCompositeOperation='lighter';
  c.globalAlpha=.35;c.drawImage(st.rose,200,200,1500,1000);c.globalAlpha=1;
  c.fillStyle='#ffd88a';
  for(const d of st.dust){c.globalAlpha=.2+.4*S.osc01(14,d.off);c.beginPath();c.arc(d.x+d.sw*S.osc(20,d.off),S.wrap(d.y,d.sec,1080,20,-1),d.r,0,TAU);c.fill()}
  c.globalAlpha=1;
  const N=st.nodes;
  for(const o of N){o.cx=o.x+o.ax*S.osc(o.sx,o.ox);o.cy=o.y+o.ay*S.osc(o.sy,o.oy)}
  c.lineCap='round';
  for(const p of st.pairs){
    const a=N[p[0]],b=N[p[1]],mx=(a.cx+b.cx)/2,my=(a.cy+b.cy)/2+p.drop*.5+60;
    for(let k=0;k<5;k++){
      const w=S.osc(p.sec,p.ph+k*.07),w2=S.osc(p.sec*.7,p.ph*1.3+k*.11);
      const cx=mx+p.amp*w*(k-2)*.45,cy=my+p.amp*w2*(.6+k*.12)*(k%2?1:-1)*.6;
      c.strokeStyle=`rgba(255,${200+k*8},${120+k*18},${.15+.1*(2-Math.abs(k-2))})`;c.lineWidth=k==2?3:1.6;
      c.beginPath();c.moveTo(a.cx,a.cy+(k-2)*5);c.quadraticCurveTo(cx,cy,b.cx,b.cy+(k-2)*5);c.stroke();
    }
    // bead travelling
    const t=S.saw(p.sec,p.ph),cx=mx,cy=my;const u=1-t;
    const bx=u*u*a.cx+2*u*t*cx+t*t*b.cx,by=u*u*a.cy+2*u*t*cy+t*t*b.cy;
    c.drawImage(st.gold,bx-26,by-26,52,52);
  }
  for(const o of N){
    const pu=.8+.2*S.osc01(7,o.ox);
    c.globalAlpha=.8*pu;c.drawImage(st.gold,o.cx-o.r*2.4,o.cy-o.r*2.4,o.r*4.8,o.r*4.8);
    c.globalAlpha=.9;c.strokeStyle='rgba(255,230,170,.9)';c.lineWidth=3;c.beginPath();c.arc(o.cx,o.cy,o.r*.7,0,TAU);c.stroke();
    c.globalAlpha=.35;c.strokeStyle='rgba(255,200,140,.8)';c.lineWidth=2;c.beginPath();c.arc(o.cx,o.cy,o.r*(.95+.12*S.osc01(9,o.oy)),0,TAU);c.stroke();
    c.globalAlpha=.5;c.fillStyle='rgba(255,240,200,.5)';c.beginPath();c.arc(o.cx,o.cy,o.r*.25,0,TAU);c.fill();
  }
  c.globalAlpha=1;c.globalCompositeOperation='source-over';
}});

/* ---------- 3: sunset with string-light garland and fireflies ---------- */
BIS.scene('g5-3',{title:'Garland at Sunset',blurb:'A warm sunset with swaying string lights and drifting fireflies.',
setup(S){
  const st=S.state;
  st.warm=sprite('rgba(255,200,110,1)');st.yel=sprite('rgba(220,255,140,1)');st.sun=sprite('rgba(255,170,90,1)');
  st.strings=[{y0:150,sag:130,sec:11,off:0,n:17,x0:-80,x1:2000},{y0:300,sag:150,sec:14,off:.3,n:15,x0:-60,x1:1980},{y0:90,sag:80,sec:9,off:.6,n:13,x0:100,x1:1820}];
  st.strings.forEach(s=>{s.b=[];for(let i=0;i<s.n;i++)s.b.push({u:(i+.5)/s.n,h:S.pick([28,40,34]),c:S.pick(['255,196,100','255,150,110','255,225,150','255,175,80']),ph:S.R(0,1),sec:S.R(3,6)})});
  st.ff=[];for(let i=0;i<55;i++)st.ff.push({x:S.R(0,1920),y:S.R(450,1020),ax:S.R(40,140),ay:S.R(30,100),sx:S.R(14,32),sy:S.R(14,32),ox:S.R(0,1),oy:S.R(0,1),ps:S.R(3,8),po:S.R(0,1)});
  st.hill1=S.smooth([[-100,860],[300,800],[700,830],[1100,780],[1500,830],[2000,790],[2020,1100],[-100,1100]]);
  st.hill2=S.smooth([[-100,930],[400,900],[900,950],[1400,905],[2000,940],[2020,1100],[-100,1100]]);
  st.hill0=S.smooth([[-100,760],[250,700],[600,740],[900,690],[1350,745],[1700,700],[2020,730],[2020,1100],[-100,1100]]);
  st.stars=[];for(let i=0;i<40;i++)st.stars.push({x:S.R(0,1920),y:S.R(0,260),r:S.R(1,2.2),sec:S.R(6,12),off:S.R(0,1)});
},
draw(S){
  const c=S.ctx,st=S.state,W=S.W,H=S.H;
  S.bg('#3b2a6b','#a14a8a','#f0705a','#ffb067','#ffd89a');
  const g=c.createLinearGradient(0,0,0,760);g.addColorStop(0,'#2a2060');g.addColorStop(.45,'#8b3f86');g.addColorStop(.75,'#ec6a5a');g.addColorStop(1,'#ffc27a');c.fillStyle=g;c.fillRect(0,0,W,780);
  c.fillStyle='#fff';for(const s of st.stars){c.globalAlpha=.1+.5*S.osc01(s.sec,s.off);c.beginPath();c.arc(s.x,s.y,s.r,0,TAU);c.fill()}
  c.globalAlpha=1;
  const sy=700+10*S.osc(60);
  c.globalCompositeOperation='lighter';c.globalAlpha=.8;c.drawImage(st.sun,960-650,sy-650,1300,1300);c.globalAlpha=1;c.globalCompositeOperation='source-over';
  c.fillStyle=S.radial(960,sy,170,'#fff4c8','#ffb86a');c.beginPath();c.arc(960,sy,150,0,TAU);c.fill();
  c.fillStyle='#8a3a6a';c.fill(st.hill0);
  c.fillStyle='#4e2352';c.fill(st.hill1);
  c.fillStyle='#2a1238';c.fill(st.hill2);
  // fireflies
  c.globalCompositeOperation='lighter';
  for(const f of st.ff){const x=f.x+f.ax*S.osc(f.sx,f.ox),y=f.y+f.ay*S.osc(f.sy,f.oy);
    c.globalAlpha=Math.pow(S.osc01(f.ps,f.po),2)*.95;c.drawImage(st.yel,x-22,y-22,44,44)}
  c.globalAlpha=1;
  // garlands
  for(const s of st.strings){
    const sway=.12*S.osc(s.sec,s.off),ph=S.osc(s.sec*1.7,s.off+.2);
    const pt=u=>{const x=s.x0+(s.x1-s.x0)*u,sag=s.sag*(1+.12*ph);return[x+ sway*60*Math.sin(Math.PI*u),s.y0+sag*Math.sin(Math.PI*u)+ (u-.5)*sway*80]};
    c.strokeStyle='rgba(30,12,40,.8)';c.lineWidth=3;c.beginPath();for(let i=0;i<=60;i++){const[p,q]=pt(i/60);i?c.lineTo(p,q):c.moveTo(p,q)}c.stroke();
    for(const b of s.b){const[x,y]=pt(b.u),by=y+b.h;
      c.strokeStyle='rgba(30,12,40,.8)';c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.lineTo(x,y+b.h*.5);c.stroke();
      const tw=.8+.2*S.osc(b.sec,b.ph);
      c.globalCompositeOperation='lighter';c.globalAlpha=.75*tw;c.drawImage(st.warm,x-52,by-52+8,104,104);c.globalAlpha=1;c.globalCompositeOperation='source-over';
      c.fillStyle=`rgba(${b.c},1)`;c.beginPath();c.ellipse(x,by+6,8,11,0,0,TAU);c.fill();c.fillStyle='rgba(255,255,230,.9)';c.beginPath();c.ellipse(x-2,by+3,3,5,0,0,TAU);c.fill()}
  }
}});
})();
