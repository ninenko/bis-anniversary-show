/* Grade 0 - Isn't She Lovely - crayon frames around a photo window (preschool crayon style) */
(function(){
const WX=310,WY=140,WW=1300,WH=800,B=26;
const PAL={red:'#ff5a6e',pink:'#ff9ec0',yel:'#ffd84a',org:'#ff9a3c',grn:'#5fcf6a',blu:'#59b9f0',pur:'#b78cf0'};
function dot(S,x,y,r){const c=S.ctx;c.fillStyle=S.INK;c.beginPath();c.arc(x,y,r,0,S.TAU);c.fill();}
function sun(S,x,y,r,sec){const c=S.ctx,st=S.state;
  S.at(x,y,S.p*S.TAU*S.cycles(sec),1,()=>{c.fillStyle=PAL.org;c.strokeStyle=S.INK;c.lineWidth=5;c.lineJoin='round';
    for(let i=0;i<12;i++){c.save();c.rotate(i/12*S.TAU);c.beginPath();c.moveTo(r*1.12,-14);c.lineTo(r*1.6,0);c.lineTo(r*1.12,14);c.closePath();c.fill();c.stroke();c.restore();}});
  S.at(x,y,0,r/70,()=>{S.ink(st.sunP,PAL.yel,7);dot(S,-21,-7,6);dot(S,21,-7,6);c.strokeStyle=S.INK;c.lineWidth=5;c.lineCap='round';c.beginPath();c.arc(0,7,25,.2,Math.PI-.2);c.stroke();
    c.fillStyle='rgba(255,120,120,.5)';c.beginPath();c.arc(-38,18,10,0,S.TAU);c.arc(38,18,10,0,S.TAU);c.fill();});}
function daisyPath(S,r){const p=new Path2D();for(let i=0;i<8;i++){const a=i/8*S.TAU;p.ellipse(Math.cos(a)*r,Math.sin(a)*r,r*.62,r*.34,a,0,S.TAU);}return p;}
function daisy(S,x,y,sc,col,ph,stem){const c=S.ctx,st=S.state;
  S.at(x,y,S.osc(6,ph)*.1,sc,()=>{if(stem){c.strokeStyle=S.INK;c.lineWidth=5;c.lineCap='round';c.beginPath();c.moveTo(0,0);c.lineTo(0,stem);c.stroke();}
    S.ink(st.daisy,col,4);S.ink(st.cen,PAL.yel,4);});}
function tulip(S,x,y,sc,col,ph,stem){const c=S.ctx,st=S.state;
  S.at(x,y,S.osc(7,ph)*.09,1,()=>{c.strokeStyle=S.INK;c.lineWidth=11;c.lineCap='round';c.beginPath();c.moveTo(0,0);c.lineTo(0,stem);c.stroke();
    c.strokeStyle='#4fbf55';c.lineWidth=5;c.beginPath();c.moveTo(0,0);c.lineTo(0,stem);c.stroke();
    S.at(0,stem,0,sc,()=>S.ink(st.tulip,col,5));});}
function cloud(S,k,x,y){S.at(x,y,0,1,()=>S.ink(k.p,'#fff',6));}
function border(S,fill){const c=S.ctx,st=S.state;
  c.fillStyle=fill;c.fill(st.ring,'evenodd');c.lineWidth=7;c.strokeStyle=S.INK;c.lineJoin='round';c.stroke(st.ring);}
function mkRing(){const p=new Path2D();p.roundRect(WX-B,WY-B,WW+2*B,WH+2*B,48);p.roundRect(WX,WY,WW,WH,24);return p;}
function butterfly(S,x,y,sc,col,rot,ph){const c=S.ctx,st=S.state,f=.35+.65*Math.abs(S.osc(1.4,ph));
  S.at(x,y,rot,sc,()=>{[-1,1].forEach(d=>S.at(0,0,0,[d*f,1],()=>{S.ink(st.wingU,col,5);S.ink(st.wingL,PAL.yel,5);}));
    c.strokeStyle=S.INK;c.lineWidth=9;c.lineCap='round';c.beginPath();c.moveTo(0,-22);c.lineTo(0,24);c.stroke();
    c.lineWidth=3;c.beginPath();c.moveTo(0,-22);c.lineTo(-10,-38);c.moveTo(0,-22);c.lineTo(10,-38);c.stroke();});}
function heartMotif(S,x,y,sc,rot,col){S.at(x,y,rot,sc,()=>S.ink(S.state.hp,col,5));}

/* ---------- 1: crayon hearts & flowers ---------- */
BIS.scene('g0-1',{title:'Hearts and Flowers',blurb:'A sky-blue page with a smiling sun, bobbing crayon hearts and wiggling flowers around the photo.',
setup(S){const st=S.state;
 st.sunP=S.blob(0,0,70,70,{jit:.02});st.hp=S.heartPath(34);st.daisy=daisyPath(S,20);st.cen=S.blob(0,0,13,13,{jit:.05,n:16});
 st.tulip=S.smooth([[-22,-6],[-26,-34],[-12,-20],[0,-40],[12,-20],[26,-34],[22,-6],[10,12],[-10,12]]);
 st.ring=mkRing();st.bp=S.hatch('#ffb3c8',['#ff8fb3','#ffd0de','#ff7aa6'],46,9,4);
 st.gp=S.hatch('#8fdc6a',['#6fcb55','#b8ee8a','#58b84c'],50,10,4);
 st.hill=S.smooth([[-50,1010],[300,985],[700,1010],[1200,980],[1650,1005],[2000,985],[2000,1100],[-50,1100]]);
 st.clouds=[0,1,2].map(i=>({p:S.cloudPath(S.R(240,320),S.R(90,120)),x:i*640+S.R(0,100),y:S.R(40,75),sec:S.pick([70,90,110])}));
 st.hs=[];const hc=['#ff5a6e','#ff9ec0','#ffd84a','#b78cf0','#ff7a9a'];
 for(let i=0;i<9;i++){st.hs.push({x:70+i%3*95+S.R(-12,12),y:300+Math.floor(i/3)*210+S.R(-30,30),s:S.R(.7,1.15),c:hc[i%5],ph:S.R(0,1)});}
 for(let i=0;i<9;i++){st.hs.push({x:1690+i%3*95+S.R(-12,12),y:240+Math.floor(i/3)*210+S.R(-30,30),s:S.R(.7,1.15),c:hc[(i+2)%5],ph:S.R(0,1)});}
 st.fl=[];const fc=['#fff',PAL.pink,'#fff',PAL.pur,'#ffe9a0'];
 for(let i=0;i<22;i++){const x=i*88+S.R(0,30);st.fl.push({x,sc:S.R(.9,1.3),c:fc[i%5],ph:S.R(0,1),stem:S.R(40,70),tul:i%3==1});}
},
draw(S){const c=S.ctx,st=S.state;S.bg('#8fd4ff','#d8f3ff');
 sun(S,150,125,62,40);
 st.clouds.forEach(k=>cloud(S,k,S.wrap(k.x,k.sec,1920,280),k.y+45));
 S.ink(st.hill,st.gp,7);
 st.fl.forEach(f=>{if(f.tul)tulip(S,f.x,1050,f.sc,f.c==='#fff'?PAL.red:f.c,f.ph,-f.stem);else daisy(S,f.x,1050-f.stem,f.sc*.9,f.c,f.ph,f.stem);});
 st.hs.forEach(h=>{const y=h.y+S.osc(5,h.ph)*16;heartMotif(S,h.x+S.osc(8,h.ph+.3)*10,y,h.s*(1+.06*S.osc(2.5,h.ph)),S.osc(6,h.ph)*.2,h.c);});
 S.photoWindow(WX,WY,WW,WH,24);
 border(S,st.bp);
 [[WX+WW/2,WY-B/2],[WX+WW/2,WY+WH+B/2]].forEach(([x,y],i)=>{for(let k=-4;k<=4;k++)heartMotif(S,x+k*140,y,.4*(1+.08*S.osc(3,k*.1+i*.3)),0,k%2?'#fff':PAL.red);});
 [[WX-B/2,WY+WH/2],[WX+WW+B/2,WY+WH/2]].forEach(([x,y])=>{for(let k=-2;k<=2;k++)S.at(x,y+k*150,0,.5*(1+.06*S.osc(3,k*.13)),()=>{S.ink(st.daisy,'#fff',3);S.ink(st.cen,PAL.yel,3);});});
}});

/* ---------- 2: garden border ---------- */
BIS.scene('g0-2',{title:'Garden Border',blurb:'Green grass, swaying tulips and daisies, butterflies, a ladybird and a mother bird with her chick on top of the frame.',
setup(S){const st=S.state;
 st.sunP=S.blob(0,0,70,70,{jit:.02});st.daisy=daisyPath(S,20);st.cen=S.blob(0,0,13,13,{jit:.05,n:16});
 st.tulip=S.smooth([[-22,-6],[-26,-34],[-12,-20],[0,-40],[12,-20],[26,-34],[22,-6],[10,12],[-10,12]]);
 st.ring=mkRing();st.bp=S.hatch('#c98a50',['#a56a35','#e0a870','#b87a42'],46,9,4);
 st.gp=S.hatch('#8fdc6a',['#6fcb55','#b8ee8a','#58b84c'],50,10,4);
 st.hill=S.smooth([[-50,975],[300,950],[700,975],[1200,945],[1650,970],[2000,950],[2000,1100],[-50,1100]]);
 st.wingU=S.blob(24,-16,26,20,{jit:.04,n:20});st.wingL=S.blob(18,16,18,14,{jit:.04,n:20});
 st.clouds=[0,1].map(i=>({p:S.cloudPath(S.R(200,260),S.R(80,100)),x:i*900+S.R(0,100),y:S.R(40,70),sec:S.pick([80,100])}));
 st.bird=S.blob(0,0,46,38,{jit:.02});st.baby=S.blob(0,0,26,22,{jit:.02});
 st.fl=[];const tc=[PAL.red,PAL.org,PAL.pink,PAL.pur,PAL.yel],dc=['#fff','#fff',PAL.pink,'#ffe9a0'];
 for(let i=0;i<24;i++){const x=i*82+S.R(0,26),side=x<300||x>1620;st.fl.push({x,sc:S.R(.95,1.35),c:i%2?tc[(i>>1)%5]:dc[(i>>1)%4],tul:i%2==1,ph:S.R(0,1),stem:side?S.R(120,300):S.R(50,90)});}
 st.bf=[{cx:150,cy:330,rx:70,ry:140,c:'#ff8fb0',ph:0},{cx:1780,cy:420,rx:70,ry:150,c:'#ffb347',ph:.4},{cx:960,cy:62,rx:520,ry:20,c:'#b78cf0',ph:.6},{cx:150,cy:640,rx:60,ry:100,c:"#5fd0f0",ph:.2}];
},
draw(S){const c=S.ctx,st=S.state;S.bg('#9fdcff','#eaf8ff');
 sun(S,1790,110,58,45);
 st.clouds.forEach(k=>cloud(S,k,S.wrap(k.x,k.sec,1920,260),k.y+50));
 S.ink(st.hill,st.gp,7);
 st.fl.forEach(f=>{if(f.tul)tulip(S,f.x,1060,f.sc,f.c,f.ph,-f.stem);else daisy(S,f.x,1060-f.stem,f.sc,f.c,f.ph,f.stem);});
 S.photoWindow(WX,WY,WW,WH,24);
 border(S,st.bp);
 const by=WY-B-2;
 S.at(760,by,0,1,()=>{const bob=S.osc(3)*3;
   c.strokeStyle=S.INK;c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(-12,-6);c.lineTo(-12,4);c.moveTo(12,-6);c.lineTo(12,4);c.stroke();
   S.at(0,-44+bob,S.osc(4)*.04,1,()=>{S.ink(st.bird,'#ff7a7a',6);c.strokeStyle=S.INK;c.lineWidth=6;c.beginPath();c.moveTo(-8,-6);c.quadraticCurveTo(-34,-6,-40,18);c.stroke();
     dot(S,22,-14,5);c.fillStyle=PAL.org;c.strokeStyle=S.INK;c.lineWidth=4;c.beginPath();c.moveTo(38,-8);c.lineTo(62,0);c.lineTo(38,8);c.closePath();c.fill();c.stroke();
     c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.arc(20,0,8,0,S.TAU);c.fill();});});
 S.at(860,by,0,1,()=>{const bob=Math.max(0,S.osc(2.5,.2))*6;
   c.strokeStyle=S.INK;c.lineWidth=5;c.lineCap='round';c.beginPath();c.moveTo(-6,-4);c.lineTo(-6,2);c.moveTo(7,-4);c.lineTo(7,2);c.stroke();
   S.at(0,-26-bob,0,1,()=>{S.ink(st.baby,'#ffd84a',5);dot(S,12,-6,4);c.fillStyle=PAL.org;c.strokeStyle=S.INK;c.lineWidth=3;c.beginPath();c.moveTo(22,-3);c.lineTo(36,2);c.lineTo(22,7);c.closePath();c.fill();c.stroke();
     c.strokeStyle=S.INK;c.lineWidth=4;c.beginPath();c.moveTo(0,-20);c.lineTo(-4,-30);c.moveTo(6,-20);c.lineTo(10,-29);c.stroke();});});
 st.bf.forEach(b=>{const a=S.p*S.TAU*S.cycles(26)+b.ph*S.TAU,x=b.cx+Math.sin(a)*b.rx,y=b.cy+Math.sin(a*2)*b.ry*.5+Math.cos(a)*b.ry*.5;
   butterfly(S,x,y,.95,b.c,Math.sin(a*1.5)*.25,b.ph);});
 const lx=S.wrap(0,60,1920,60);
 S.at(lx,968,Math.sin(lx*.03)*.05,1,()=>{S.ink(st.baby,'#ff3b3b',5);c.strokeStyle=S.INK;c.lineWidth=4;c.beginPath();c.moveTo(0,-22);c.lineTo(0,22);c.stroke();
   [[-10,-5],[9,-7],[-8,8],[10,7]].forEach(d=>dot(S,d[0],d[1],4));S.at(28,0,0,.6,()=>S.ink(st.baby,S.INK,3));});
}});

/* ---------- 3: rainbow & balloons ---------- */
BIS.scene('g0-3',{title:'Rainbow and Balloons',blurb:'A crayon rainbow arches over the frame while clouds drift and balloon bunches float up the sides.',
setup(S){const st=S.state;
 st.ring=mkRing();st.bp=S.hatch('#fff6c8',['#ffe9a0','#fff','#ffd84a'],46,9,4);
 st.gp=S.hatch('#8fdc6a',['#6fcb55','#b8ee8a','#58b84c'],50,10,4);
 st.hill=S.smooth([[-50,1030],[400,1005],[900,1030],[1400,1000],[2000,1025],[2000,1100],[-50,1100]]);
 st.bl=S.blob(0,0,36,44,{jit:.02,n:28});
 st.cl=[0,1,2,3].map(i=>({p:S.cloudPath(S.R(240,320),S.R(100,130)),x:i*480+S.R(0,100),y:S.R(60,120),sec:S.pick([70,90,110])}));
 st.cbase=[0,1].map(()=>S.cloudPath(300,130));
 st.bunch=[];const cols=['#ff5a6e','#ffd84a','#59b9f0','#5fcf6a','#b78cf0','#ff9a3c','#ff9ec0'];
 [0,1,2,3].forEach(i=>{const left=i%2==0;st.bunch.push({x:left?130:1790,y0:i*270+S.R(0,100),sec:S.pick([30,38,46]),ph:S.R(0,1),
   b:[[-34,-18],[34,-30],[0,-62]].map((o,j)=>({dx:o[0],dy:o[1],c:cols[(i*3+j*3)%7]}))});});
 st.rb=['#ff5a6e','#ff9a3c','#ffd84a','#5fcf6a','#59b9f0','#7a7af0','#b78cf0'];
 st.rp=st.rb.map((_,i)=>{const p=new Path2D();p.ellipse(960,560,740+i*10,470+i*10,0,Math.PI,S.TAU);return p;});
 st.rmid=new Path2D();st.rmid.ellipse(960,560,775,505,0,Math.PI,S.TAU);
},
draw(S){const c=S.ctx,st=S.state;S.bg('#a6e0ff','#fff1d6');
 st.cl.forEach(k=>cloud(S,k,S.wrap(k.x,k.sec,1920,280),k.y));
 c.lineCap='butt';c.strokeStyle=S.INK;c.lineWidth=88;c.stroke(st.rmid);
 st.rp.forEach((p,i)=>{c.strokeStyle=st.rb[i];c.lineWidth=11;c.stroke(p);});
 [[185,575],[1735,575]].forEach(([x,y],i)=>S.at(x+S.osc(20,i*.4)*14,y,0,1,()=>S.ink(st.cbase[i],'#fff',6)));
 S.ink(st.hill,st.gp,7);
 S.photoWindow(WX,WY,WW,WH,24);
 border(S,st.bp);
 for(let k=0;k<9;k++){const x=WX+90+k*140;[WY-B/2,WY+WH+B/2].forEach((y,j)=>{c.fillStyle=st.rb[(k+j*3)%7];c.strokeStyle=S.INK;c.lineWidth=3;c.beginPath();c.arc(x,y,7,0,S.TAU);c.fill();c.stroke();});}
 st.bunch.forEach(g=>{const y=S.wrap(g.y0,g.sec,1080,170,-1),x=g.x+S.osc(9,g.ph)*22,sw=S.osc(6,g.ph)*.06;
   S.at(x,y,sw,1,()=>{c.strokeStyle=S.INK;c.lineWidth=3;c.lineCap='round';
     g.b.forEach(b=>{c.beginPath();c.moveTo(0,70);c.quadraticCurveTo(b.dx*.3+S.osc(3,b.dx*.01)*8,20,b.dx,b.dy+44);c.stroke();});
     g.b.forEach(b=>S.at(b.dx,b.dy,0,1,()=>{S.ink(st.bl,b.c,5);c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(-12,-16,6,10,.5,0,S.TAU);c.fill();
       c.fillStyle=b.c;c.strokeStyle=S.INK;c.lineWidth=4;c.beginPath();c.moveTo(0,44);c.lineTo(-7,54);c.lineTo(7,54);c.closePath();c.fill();c.stroke();}));});});
}});
})();
