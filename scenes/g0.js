/* Grade 0 - Isn't She Lovely - animated frames around a photo window */
(function(){
const WX=310,WY=140,WW=1300,WH=800;
function rrPts(x,y,w,h,r,step){const P=[],add=(px,py,nx,ny)=>P.push({x:px,y:py,nx,ny});
  const seg=[];const q=Math.PI/2;
  const line=(x1,y1,x2,y2,nx,ny)=>{const L=Math.hypot(x2-x1,y2-y1);for(let s=0;s<L;s+=2)seg.push([x1+(x2-x1)*s/L,y1+(y2-y1)*s/L,nx,ny]);};
  const arc=(cx,cy,a0)=>{for(let s=0;s<r*q;s+=2){const a=a0+s/r;seg.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r,Math.cos(a),Math.sin(a)]);}};
  line(x+r,y,x+w-r,y,0,-1);arc(x+w-r,y+r,-q);line(x+w,y+r,x+w,y+h-r,1,0);arc(x+w-r,y+h-r,0);
  line(x+w-r,y+h,x+r,y+h,0,1);arc(x+r,y+h-r,q);line(x,y+h-r,x,y+r,-1,0);arc(x+r,y+r,2*q);
  const k=Math.max(1,Math.round(step/2));for(let i=0;i<seg.length;i+=k)add(...seg[i]);return P;}
function outside(S,fn){const c=S.ctx;c.save();const p=new Path2D();p.rect(0,0,1920,1080);p.roundRect(WX,WY,WW,WH,28);c.clip(p,'evenodd');fn();c.restore();}
function sparkle(S,path,x,y,s,a,col){const c=S.ctx;c.save();c.globalAlpha*=a;S.at(x,y,0,s,()=>{c.fillStyle=col;c.fill(path);});c.restore();}

/* ---------- 1: soft pink hearts ---------- */
BIS.scene('g0-1',{title:'Pink Hearts',blurb:'A soft pink frame with floating hearts and twinkling sparkles around the photo window.',
setup(S){const st=S.state;st.hp=S.heartPath(40);st.sp=S.starPath(40,9,4);
 st.hearts=[];for(let i=0;i<46;i++){const left=S.rnd()<.5;st.hearts.push({x:S.rnd()<.7?(left?S.R(10,300):S.R(1620,1910)):S.R(300,1620),y0:S.R(0,1080),sec:S.R(22,40),s:S.R(.4,1.3),ph:S.R(0,1),c:S.pick(['#ff6f9c','#ff9fbd','#ffc2d6','#ff4f86','#fff0f5']),a:S.R(.55,.95)});}
 st.sparks=[];for(let i=0;i<36;i++)st.sparks.push({x:S.R(0,1920),y:S.R(0,1080),s:S.R(.3,.9),ph:S.R(0,1)});
 st.ring=new Path2D();st.ring.roundRect(WX-44,WY-44,WW+88,WH+88,64);st.ring.roundRect(WX,WY,WW,WH,28);
 st.big=S.heartPath(60);
 st.bk=[];for(let i=0;i<10;i++)st.bk.push({x:S.R(0,1920),y:S.R(0,1080),r:S.R(150,330),ph:S.R(0,1),c:S.pick(['255,255,255','255,170,200','255,120,160'])});},
draw(S){const c=S.ctx,st=S.state;S.bg('#ffdce8','#ff9ebb');
 st.bk.forEach(b=>{c.globalAlpha=.12+.1*S.osc01(20,b.ph);c.fillStyle=S.radial(b.x,b.y,b.r,'rgba('+b.c+',1)','rgba('+b.c+',0)');c.fillRect(b.x-b.r,b.y-b.r,b.r*2,b.r*2);});c.globalAlpha=1;
 outside(S,()=>{
  st.hearts.forEach(h=>{const y=S.wrap(h.y0,h.sec,1080,90,-1);c.globalAlpha=h.a*(.8+.2*S.osc01(5,h.ph));c.fillStyle=h.c;S.at(h.x+S.osc(9,h.ph)*26,y,S.osc(7,h.ph)*.2,h.s,()=>c.fill(st.hp));});c.globalAlpha=1;
  st.sparks.forEach(k=>sparkle(S,st.sp,k.x,k.y,k.s*(.7+.6*S.pulse(4,k.ph,2)),S.pulse(4,k.ph,2),'#fff'));});
 // frame: soft shadow, white ring, pink inner lines
 c.fillStyle='rgba(160,40,90,.18)';for(let i=3;i>=1;i--){c.beginPath();c.roundRect(WX-44-i*8,WY-44-i*8+10,WW+88+i*16,WH+88+i*16,64+i*8);c.fill();}
 c.fillStyle='#fff6f9';c.fill(st.ring,'evenodd');
 c.strokeStyle='#ff9fbd';c.lineWidth=5;c.beginPath();c.roundRect(WX-26,WY-26,WW+52,WH+52,50);c.stroke();
 c.strokeStyle='#ffc2d6';c.lineWidth=3;c.setLineDash([2,16]);c.lineCap='round';c.beginPath();c.roundRect(WX-36,WY-36,WW+72,WH+72,58);c.lineDashOffset=-S.saw(20)*(1860*0+18)*0;c.stroke();c.setLineDash([]);
 S.photoWindow(WX,WY,WW,WH,28);
 // corner hearts on frame (pulse)
 [[WX-34,WY-34],[WX+WW+34,WY-34],[WX-34,WY+WH+34],[WX+WW+34,WY+WH+34]].forEach(([x,y],i)=>{S.at(x,y,(i%2?1:-1)*.2,.75+.12*S.osc01(3,i*.25),()=>{S.ink(st.big,'#ff5f93',5,'#fff');});});
 // top & bottom mid sparkles on frame
 [[960,WY-44],[960,WY+WH+44],[WX-44,540],[WX+WW+44,540]].forEach(([x,y],i)=>sparkle(S,st.sp,x,y,1.2*(.7+.5*S.pulse(3,i*.25,2)),.4+.6*S.pulse(3,i*.25,2),'#ff7aa6'));
}});

/* ---------- 2: flower garland ---------- */
BIS.scene('g0-2',{title:'Flower Garland',blurb:'A garland of blossoms and leaves sways gently around the window while butterflies drift by.',
setup(S){const st=S.state;
 const P=rrPts(WX-30,WY-30,WW+60,WH+60,60,26);st.pts=P;
 st.items=P.map((p,i)=>({p,leaf:S.R(0,1),side:i%2?1:-1,ph:S.R(0,1),big:i%4==0,c:S.pick(['#ff9fb8','#ffc7a8','#d8b4ff','#fff3c4','#ffb3d1','#fff']),pet:S.RI(5,6),size:S.R(.8,1.25)}));
 st.petal=new Path2D();st.petal.ellipse(0,-20,11,22,0,0,S.TAU);
 st.leafP=new Path2D();st.leafP.moveTo(0,0);st.leafP.quadraticCurveTo(16,-14,0,-40);st.leafP.quadraticCurveTo(-16,-14,0,0);
 st.vine=new Path2D();st.vine.roundRect(WX-30,WY-30,WW+60,WH+60,60);
 st.wc=[];for(let i=0;i<14;i++)st.wc.push({x:S.R(0,1920),y:S.R(0,1080),r:S.R(130,280),c:S.pick(['255,200,215','200,230,200','255,230,170','225,205,255']),ph:S.R(0,1)});
 st.bf=[{cx:150,cy:300,rx:80,ry:140,c:'#ff8fb0',ph:0},{cx:1780,cy:700,rx:90,ry:160,c:'#ffb347',ph:.4},{cx:1770,cy:230,rx:70,ry:90,c:'#a98cff',ph:.7},{cx:150,cy:830,rx:80,ry:100,c:'#6fd3f0',ph:.2},{cx:960,cy:70,rx:420,ry:35,c:'#ff9fd0',ph:.55},{cx:960,cy:1020,rx:420,ry:30,c:'#ffd070',ph:.1}];
 st.wing=S.blob(0,0,30,40,{jit:.03,n:24});},
draw(S){const c=S.ctx,st=S.state;S.bg('#fff8ea','#d9f0dc');
 st.wc.forEach(b=>{c.globalAlpha=.35+.15*S.osc01(25,b.ph);c.fillStyle=S.radial(b.x,b.y,b.r,'rgba('+b.c+',.8)','rgba('+b.c+',0)');c.fillRect(b.x-b.r,b.y-b.r,b.r*2,b.r*2);});c.globalAlpha=1;
 // vine
 c.fillStyle='rgba(70,110,70,.15)';c.beginPath();c.roundRect(WX-14,WY-8,WW+28,WH+28,40);c.fill();
 c.strokeStyle='#4e8f55';c.lineWidth=9;c.lineJoin='round';c.stroke(st.vine);
 c.strokeStyle='#7fc283';c.lineWidth=4;c.stroke(st.vine);
 // leaves
 st.items.forEach((it,i)=>{const p=it.p,sw=S.osc(7,it.ph)*.18,ang=Math.atan2(p.ny,p.nx)+Math.PI/2+it.side*.9+sw;
   S.at(p.x,p.y,ang,1.1,()=>{c.fillStyle=it.leaf>.5?'#5fae6a':'#79c57f';c.fill(st.leafP);c.strokeStyle='rgba(30,80,40,.4)';c.lineWidth=2;c.stroke(st.leafP);});});
 S.photoWindow(WX,WY,WW,WH,28);
 // inner border line
 c.strokeStyle='#fff';c.lineWidth=8;c.beginPath();c.roundRect(WX-6,WY-6,WW+12,WH+12,34);c.stroke();
 // blossoms
 st.items.forEach(it=>{if(!it.big&&it.leaf<.78)return;const p=it.p,sc=(it.big?1.15:.7)*it.size;
   S.at(p.x+p.nx*4,p.y+p.ny*4,S.osc(6,it.ph)*.25,sc*(1+.05*S.osc(5,it.ph)),()=>{
    for(let k=0;k<it.pet;k++){c.save();c.rotate(k/it.pet*S.TAU);c.fillStyle=it.c;c.fill(st.petal);c.strokeStyle='rgba(200,100,130,.45)';c.lineWidth=2;c.stroke(st.petal);c.restore();}
    c.fillStyle='#ffcf4a';c.beginPath();c.arc(0,0,9,0,S.TAU);c.fill();c.fillStyle='#e8903a';c.beginPath();c.arc(0,0,4,0,S.TAU);c.fill();});});
 // butterflies
 st.bf.forEach(b=>{const t=S.saw(28,b.ph)*S.TAU,x=b.cx+Math.sin(t)*b.rx,y=b.cy+Math.sin(t*2)*b.ry*.5+Math.cos(t)*b.ry*.3,ang=Math.atan2(Math.cos(t)*b.rx*.0+Math.sin(t*2)*b.ry,Math.cos(t)*b.rx)*0;
   const flap=.25+.75*Math.abs(S.osc(1.1,b.ph));
   S.at(x,y,Math.sin(t)*.25,1,()=>{c.fillStyle=b.c;c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=3;
     [-1,1].forEach(d=>{S.at(0,0,0,[d*flap,1],()=>{S.at(22,-18,.5,1,()=>{c.globalAlpha=.9;c.fill(st.wing);c.stroke(st.wing);c.globalAlpha=1;});S.at(18,18,-.4,.65,()=>{c.globalAlpha=.9;c.fill(st.wing);c.stroke(st.wing);c.globalAlpha=1;});});});
     c.fillStyle='#4a3a4a';c.beginPath();c.ellipse(0,0,5,22,0,0,S.TAU);c.fill();});});
}});

/* ---------- 3: gold polaroid ---------- */
BIS.scene('g0-3',{title:'Golden Polaroid',blurb:'A cream polaroid card with a shimmering gold edge, twinkling stars and soft bokeh lights.',
setup(S){const st=S.state;
 st.sp=S.starPath(40,9,4);st.star5=S.starPath(40,18,5);
 st.bokeh=[];for(let i=0;i<34;i++)st.bokeh.push({x:S.R(0,1920),y:S.R(0,1080),r:S.R(40,150),sec:S.pick([80,100,140]),ph:S.R(0,1),a:S.R(.15,.4),h:S.pick([42,36,330,20,48,300])});
 // pre-rendered bokeh sprite
 const cv=document.createElement('canvas');cv.width=cv.height=256;const x=cv.getContext('2d');const g=x.createRadialGradient(128,128,0,128,128,126);g.addColorStop(0,'rgba(255,255,255,.55)');g.addColorStop(.8,'rgba(255,255,255,.7)');g.addColorStop(.92,'rgba(255,255,255,.9)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.beginPath();x.arc(128,128,126,0,Math.PI*2);x.fill();st.spr=cv;
 const tint=(h)=>{const t=document.createElement('canvas');t.width=t.height=256;const y=t.getContext('2d');y.drawImage(cv,0,0);y.globalCompositeOperation='source-in';y.fillStyle='hsl('+h+',90%,65%)';y.fillRect(0,0,256,256);return t;};
 st.tints={};st.bokeh.forEach(b=>{if(!st.tints[b.h])st.tints[b.h]=tint(b.h);});
 st.stars=[];for(let i=0;i<44;i++){let x,y;do{x=S.R(0,1920);y=S.R(0,1080);}while(x>230&&x<1690&&y>30&&y<1060);st.stars.push({x,y,s:S.R(.3,.9),ph:S.R(0,1),five:S.rnd()<.3});}
 st.CX=250;st.CY=40;st.CW=1420;st.CH=1000;},
draw(S){const c=S.ctx,st=S.state;S.bg('#1b1236','#4a2358');
 c.globalCompositeOperation='lighter';
 st.bokeh.forEach(b=>{const x=S.wrap(b.x,b.sec,1920,150),y=b.y+S.osc(b.sec/2,b.ph)*50;c.globalAlpha=b.a*(.55+.45*S.osc01(12,b.ph));c.drawImage(st.tints[b.h],x-b.r,y-b.r,b.r*2,b.r*2);});
 c.globalAlpha=1;c.globalCompositeOperation='source-over';
 st.stars.forEach(k=>sparkle(S,k.five?st.star5:st.sp,k.x,k.y,k.s*(.6+.6*S.pulse(4,k.ph,2)),.25+.75*S.pulse(4,k.ph,2),'#ffe9a8'));
 const X=st.CX,Y=st.CY,W=st.CW,H=st.CH;
 c.fillStyle='rgba(0,0,0,.25)';for(let i=3;i>=1;i--){c.beginPath();c.roundRect(X-i*10,Y-i*6+14,W+i*20,H+i*20,14+i*4);c.fill();}
 c.fillStyle='#fdf6e6';c.beginPath();c.roundRect(X,Y,W,H,14);c.fill();
 // gold edge with moving shimmer
 const sh=S.saw(8)*3000-500,g=c.createLinearGradient(sh-600,0,sh+600,300);
 g.addColorStop(0,'#b8860b');g.addColorStop(.3,'#e9c15a');g.addColorStop(.5,'#fff3b0');g.addColorStop(.7,'#e9c15a');g.addColorStop(1,'#b8860b');
 c.strokeStyle=g;c.lineWidth=12;c.beginPath();c.roundRect(X+2,Y+2,W-4,H-4,14);c.stroke();
 c.lineWidth=4;c.strokeStyle='#c99a2e';c.beginPath();c.roundRect(X+22,Y+22,W-44,H-44,8);c.stroke();
 // window frame gold
 c.lineWidth=8;c.strokeStyle=g;c.beginPath();c.roundRect(WX-8,WY-38,WW+16,WH+16,6);c.stroke();
 c.fillStyle='#3a2442';c.fillRect(WX,WY-34,WW,WH);S.photoWindow(WX,WY-34,WW,WH,4);
 // corner stars on card
 [[X+4,Y+4],[X+W-4,Y+4],[X+4,Y+H-4],[X+W-4,Y+H-4],[960,Y+H-60],[X+W/2-300,Y+H-60],[X+W/2+300,Y+H-60]].forEach(([x,y],i)=>{const p=S.pulse(3,i*.17,2);sparkle(S,i<4?st.star5:st.sp,x,y,(i<4?1.1:.8)*(.7+.5*p),.5+.5*p,'#f6cf5a');});
 // little hearts-free decoration: gold dots along bottom strip
 for(let i=0;i<9;i++){const x=1030-4*60+i*60;c.fillStyle='rgba(201,154,46,'+(.35+.4*S.osc01(4,i*.11))+')';c.beginPath();c.arc(x-70,Y+H-60,6,0,S.TAU);c.fill();}
}});
})();
