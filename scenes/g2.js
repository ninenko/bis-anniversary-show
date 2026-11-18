(function(){
const TAU=Math.PI*2;
const BEAT=0.53;
const RAIN=['#ff4d6d','#ff9f1c','#ffd60a','#3ddc84','#2ec4f1','#6a5cff','#c04bff'];

/* 1 Confetti party */
BIS.scene('g2-1',{title:'Confetti Party',blurb:'Gentle confetti bursts and falling streamers over a sunset-pink party sky, with big circles bouncing to the beat.',
setup(S){const st=S.state;
 st.fall=[];for(let i=0;i<150;i++)st.fall.push({x:S.R(0,1920),y:S.R(0,1080),w:S.R(14,30),h:S.R(8,16),col:S.pick(RAIN),sec:S.R(20,45),sw:S.R(20,70),sws:S.R(5,11),o:S.R(0,1),spin:S.R(4,9),rot:S.R(0,TAU),circ:S.rnd()<.3});
 st.bursts=[];const pts=[[400,320],[1500,260],[960,180],[1700,620],[250,650]];
 pts.forEach((p,bi)=>{const n=26;for(let i=0;i<n;i++){const a=S.R(0,TAU),v=S.R(160,420);st.bursts.push({ox:p[0],oy:p[1],vx:Math.cos(a)*v,vy:Math.sin(a)*v,col:S.pick(RAIN),w:S.R(12,24),h:S.R(7,13),per:30,off:bi/pts.length,rot:S.R(0,TAU),sp:S.R(3,9)})}});
 st.balls=[];for(let i=0;i<9;i++)st.balls.push({x:110+i*212+S.R(-30,30),r:S.R(55,95),col:RAIN[i%7],o:S.R(0,.5),base:S.R(920,1000)});
 st.bokeh=[];for(let i=0;i<14;i++)st.bokeh.push({x:S.R(0,1920),y:S.R(0,700),r:S.R(60,160),o:S.R(0,1),sec:S.R(10,20)})},
draw(S){const c=S.ctx,st=S.state;S.bg('#ff6fa5','#ff9a72','#ffc857');
 for(const b of st.bokeh){c.globalAlpha=.1+.07*S.osc01(b.sec,b.o);c.fillStyle='#fff';c.beginPath();c.arc(b.x,b.y,b.r,0,TAU);c.fill()}
 c.globalAlpha=1;
 // bursts: expand and fade, then loop
 for(const b of st.bursts){const t=S.saw(b.per,b.off);const e=1-Math.pow(1-Math.min(1,t*3.2),2.2);if(t>.28)continue;const a=t<.04?t/.04:1-(t-.04)/.24;const x=b.ox+b.vx*e+0,y=b.oy+b.vy*e+260*t*t*12;
  c.globalAlpha=Math.max(0,a);c.fillStyle=b.col;const sc=.4+.6*Math.abs(Math.cos(b.sp*TAU*t*3));S.at(x,y,b.rot+t*14,1,()=>c.fillRect(-b.w/2,-b.h*sc/2,b.w,b.h*sc))}
 c.globalAlpha=1;
 for(const f of st.fall){const y=S.wrap(f.y,f.sec,1080,40,1),x=f.x+f.sw*S.osc(f.sws,f.o),flip=Math.abs(Math.cos(TAU*(S.cycles(f.spin)*S.p+f.o)));c.fillStyle=f.col;c.globalAlpha=.9;
  S.at(x,y,f.rot+.8*S.osc(f.sws,f.o+.25),1,()=>{if(f.circ){c.beginPath();c.ellipse(0,0,f.h*.6,f.h*.6*Math.max(.15,flip),0,0,TAU);c.fill()}else c.fillRect(-f.w/2,-f.h*Math.max(.12,flip)/2,f.w,f.h*Math.max(.12,flip))})}
 c.globalAlpha=1;
 // beat balls (calm, along the lower edge)
 for(const b of st.balls){const pu=S.pulse(BEAT,b.o,2),sq=1+.1*pu,y=b.base-34*pu;c.globalAlpha=.9;c.fillStyle=b.col;S.at(b.x,y+b.r*(1-sq)*.5+ (b.r*.0),0,[1/sq*1.03,sq],()=>{c.beginPath();c.arc(0,0,b.r,0,TAU);c.fill();c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.arc(-b.r*.3,-b.r*.35,b.r*.28,0,TAU);c.fill()})}
 c.globalAlpha=1}});

/* 2 Rainbow waves */
BIS.scene('g2-2',{title:'Rainbow Waves',blurb:'Seven stacked rainbow ribbons flow across a deep purple stage and swell gently on the beat.',
setup(S){const st=S.state;st.dots=[];for(let i=0;i<50;i++)st.dots.push({x:S.R(0,1920),y:S.R(0,1080),r:S.R(4,11),col:S.pick(RAIN),sec:S.R(25,60),o:S.R(0,1),ts:S.R(5,9)});
 st.waves=RAIN.map((col,i)=>({col,y:230+i*95,amp:S.R(50,90),k:S.R(.0028,.0045),sec:S.R(14,22)*(i%2?1:-1),o:S.R(0,1),w:46}))},
draw(S){const c=S.ctx,st=S.state;S.bg('#1c0f45','#2b1366','#40197a');
 S.glow(960,540,1100,'rgba(255,120,200,.2)',1);
 // beat rings from centre
 for(let r=0;r<2;r++){const t=S.saw(BEAT*8,r*.5);c.globalAlpha=(1-t)*.35;c.strokeStyle='#fff';c.lineWidth=6;c.beginPath();c.arc(960,540,150+t*900,0,TAU);c.stroke()}
 c.globalAlpha=1;
 const bp=S.pulse(BEAT,0,3);c.lineCap='round';c.lineJoin='round';
 for(const w of st.waves){const ph=TAU*S.saw(Math.abs(w.sec))*Math.sign(w.sec)+w.o*TAU;const amp=w.amp*(1+.12*bp);
  c.beginPath();for(let x=-40;x<=1960;x+=24){const y=w.y+amp*Math.sin(x*w.k*TAU+ph)*(0.6+0.4*Math.sin(x*.0021+ph))*(1-.35*Math.max(0,(w.y-500))/500);x<0?c.moveTo(x,y):c.lineTo(x,y)}
  c.strokeStyle='rgba(0,0,0,.22)';c.lineWidth=w.w+10;c.stroke();c.strokeStyle=w.col;c.lineWidth=w.w;c.stroke();
  c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=7;c.stroke()}
 for(const d of st.dots){const y=S.wrap(d.y,d.sec,1080,30,-1);c.globalAlpha=.4+.5*S.osc01(d.ts,d.o);c.fillStyle=d.col;c.beginPath();c.arc(d.x,y,d.r*(1+.3*bp),0,TAU);c.fill()}
 c.globalAlpha=1}});

/* 3 Memphis pop */
BIS.scene('g2-3',{title:'Pop Shapes & Equaliser',blurb:'Bouncing, spinning zigzags, dots, triangles and squiggles on sunny yellow, with a rainbow equaliser along the bottom.',
setup(S){const st=S.state,c=S.ctx;const pal=['#ff3d81','#12b5cb','#3b4cca','#ff7a00','#ffffff','#7bd957','#9b5de5'];
 const zig=(w,n,h)=>{const p=new Path2D();p.moveTo(-w/2,0);for(let i=1;i<=n;i++)p.lineTo(-w/2+w*i/n,i%2?-h:0);return p};
 const squig=(w,n,h)=>{const p=new Path2D();for(let i=0;i<=40;i++){const x=-w/2+w*i/40,y=Math.sin(i/40*TAU*n)*h;i?p.lineTo(x,y):p.moveTo(x,y)}return p};
 const tri=r=>{const p=new Path2D();for(let i=0;i<3;i++){const a=-Math.PI/2+i*TAU/3;i?p.lineTo(Math.cos(a)*r,Math.sin(a)*r):p.moveTo(Math.cos(a)*r,Math.sin(a)*r)}p.closePath();return p};
 const dot=r=>{const p=new Path2D();p.arc(0,0,r,0,TAU);return p};
 const plus=r=>{const p=new Path2D();p.rect(-r,-r*.28,2*r,r*.56);p.rect(-r*.28,-r,r*.56,2*r);return p};
 const kinds=['zig','squig','tri','dot','ring','plus'];
 st.shapes=[];const cols=24,rows=3;
 for(let i=0;i<34;i++){const k=kinds[i%6];let path,line=false,sz=1;
  if(k=='zig'){path=zig(S.R(110,170),S.RI(4,6),S.R(24,34));line=true}else if(k=='squig'){path=squig(S.R(120,180),2,16);line=true}else if(k=='tri')path=tri(S.R(34,56));else if(k=='dot')path=dot(S.R(16,34));else if(k=='ring'){path=dot(S.R(30,46));line=true}else path=plus(S.R(26,38));
  const x=(i%11+.5)*175+S.R(-50,50),y=90+Math.floor(i/11)*250+S.R(-30,60);
  st.shapes.push({path,line,col:pal[(i*3+Math.floor(i/6))%7],x,y,bounce:S.R(25,55),bsec:S.R(4,7),o:S.R(0,1),spin:S.R(10,40)*(S.rnd()<.5?-1:1),rot:S.R(0,TAU),spinOn:k!='dot'})}
 // dot pattern
 st.pat=(function(){const cv=document.createElement('canvas');cv.width=cv.height=48;const x=cv.getContext('2d');x.fillStyle='rgba(255,160,0,.25)';x.beginPath();x.arc(12,12,5,0,TAU);x.arc(36,36,5,0,TAU);x.fill();return c.createPattern(cv,'repeat')})();
 st.bars=[];for(let i=0;i<40;i++)st.bars.push({a:S.R(3,7),b:S.R(5,12),o1:S.R(0,1),o2:S.R(0,1),col:RAIN[Math.floor(i/40*7)]})},
draw(S){const c=S.ctx,st=S.state;S.bg('#ffd23f','#ffc21a','#ffb703');
 c.fillStyle=st.pat;c.fillRect(0,0,1920,1080);
 const bp=S.pulse(BEAT,0,3);
 c.lineCap='round';c.lineJoin='round';
 for(const s of st.shapes){const by=s.y-s.bounce*S.osc01(s.bsec,s.o),rot=s.rot+(s.spinOn?TAU*S.saw(s.spin,s.o)*Math.sign(s.spin):.4*S.osc(s.bsec,s.o)),sc=1+.12*bp;
  S.at(s.x,by,rot,sc,()=>{if(s.line){c.strokeStyle='#1c1c3a';c.lineWidth=17;c.stroke(s.path);c.strokeStyle=s.col;c.lineWidth=10;c.stroke(s.path)}else{c.fillStyle=s.col;c.fill(s.path,'evenodd');c.strokeStyle='#1c1c3a';c.lineWidth=5;c.stroke(s.path)}})}
 // equaliser
 const n=st.bars.length,bw=1920/n;
 for(let i=0;i<n;i++){const b=st.bars[i];const v=.5*(.5+.5*Math.sin(TAU*(S.cycles(b.a)*S.p+b.o1)))+.3*(.5+.5*Math.sin(TAU*(S.cycles(b.b)*S.p+b.o2)))+.2*bp;const h=40+v*210;
  c.fillStyle='#1c1c3a';c.fillRect(i*bw+5,1080-h-6,bw-10,h+6);c.fillStyle=b.col;c.fillRect(i*bw+8,1080-h,bw-16,h)}
 c.globalAlpha=1}});
})();
