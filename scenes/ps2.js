/* Preschool 2 - We Are Family - crayon style */
(function(){
const PAL={red:'#ff5a6e',pink:'#ff9ec0',yel:'#ffd84a',org:'#ff9a3c',grn:'#5fcf6a',blu:'#59b9f0',brn:'#b9783f',pur:'#b78cf0'};
function eye(S,x,y,r){const c=S.ctx;c.fillStyle=S.INK;c.beginPath();c.arc(x,y,r||5,0,S.TAU);c.fill();}
function sunDraw(S,x,y,r,sec){const c=S.ctx,st=S.state;
  S.at(x,y,S.p*S.TAU*S.cycles(sec),1,()=>{c.fillStyle=PAL.org;c.strokeStyle=S.INK;c.lineWidth=5;c.lineJoin='round';
    for(let i=0;i<12;i++){c.save();c.rotate(i/12*S.TAU);c.beginPath();c.moveTo(r*1.12,-14);c.lineTo(r*1.6,0);c.lineTo(r*1.12,14);c.closePath();c.fill();c.stroke();c.restore();}});
  S.at(x,y,0,r/70,()=>{S.ink(st.sunP,PAL.yel,7);eye(S,-21,-7,6);eye(S,21,-7,6);c.strokeStyle=S.INK;c.lineWidth=5;c.lineCap='round';c.beginPath();c.arc(0,7,25,.2,Math.PI-.2);c.stroke();
    c.fillStyle='rgba(255,120,120,.5)';c.beginPath();c.arc(-38,18,10,0,S.TAU);c.arc(38,18,10,0,S.TAU);c.fill();});}

/* ---------- 1: family tree ---------- */
BIS.scene('ps2-1',{title:'Family Tree',blurb:'A big tree with swaying heart fruit, a bird family in the nest, a smiling sun and drifting clouds.',
setup(S){const st=S.state;
 st.gp=S.hatch('#8fdc6a',['#6fcb55','#b8ee8a','#58b84c'],50,10,4);
 st.tp=S.hatch('#c98a50',['#a56a35','#e0a870'],46,8,4);
 st.leafP=S.hatch('#58c25a',['#3fa84a','#8be07a','#2f9340'],50,10,4);
 st.sunP=S.blob(0,0,70,70,{jit:.02});
 st.clouds=[0,1,2,3].map(i=>({p:S.cloudPath(S.R(260,360),S.R(110,150)),x:i*480+S.R(0,100),y:S.R(70,300),sec:S.pick([60,80,100])}));
 st.trunk=S.smooth([[800,1000],[840,800],[850,620],[880,520],[960,470],[1040,520],[1070,620],[1080,800],[1130,1000],[1000,1020]]);
 st.br1=S.smooth([[900,640],[760,560],[640,470]],false);st.br2=S.smooth([[1030,640],[1170,540],[1300,450]],false);
 st.leaf=[[960,330,340,230],[740,420,230,170],[1190,410,240,180],[860,260,210,150],[1080,250,220,150],[620,500,150,110],[1310,500,160,110]].map(a=>S.blob(a[0],a[1],a[2],a[3],{bumps:9,amp:.14,jit:.02}));
 st.hearts=[];const hc=['#ff4f6d','#ff8fb3','#ff6b6b','#ffb3c8','#ff5a8a'];
 for(let i=0;i<22;i++){const a=S.R(0,S.TAU),r=Math.sqrt(S.rnd());st.hearts.push({x:960+Math.cos(a)*r*430,y:370+Math.sin(a)*r*190,len:S.R(20,50),c:hc[i%5],s:S.R(22,30),ph:S.R(0,1)});}
 st.hp=S.heartPath(30);
 st.nest=S.smooth([[-95,-20],[-70,40],[0,62],[70,40],[95,-20],[0,-6]]);
 st.egg=S.blob(0,0,18,24,{jit:.01});st.bird=S.blob(0,0,34,28,{jit:.02});st.bird2=S.blob(0,0,24,20,{jit:.02});
 st.fl=[];for(let i=0;i<40;i++)st.fl.push({x:S.R(0,1920),y:S.R(900,1040),c:S.pick([PAL.pink,PAL.yel,'#fff',PAL.pur]),ph:S.R(0,1)});
 st.hill=S.smooth([[-50,800],[400,740],[900,780],[1400,730],[2000,790],[2000,1100],[-50,1100]]);},
draw(S){const c=S.ctx,st=S.state;S.bg('#9fdcff','#e6f7ff');
 sunDraw(S,230,200,80,40);
 st.clouds.forEach(k=>S.at(S.wrap(k.x,k.sec,1920,260),k.y,0,1,()=>S.ink(k.p,'#fff',6)));
 S.ink(st.hill,st.gp,7);
 st.fl.forEach(f=>{S.at(f.x,f.y,S.osc(6,f.ph)*.12,1,()=>{c.strokeStyle='#3f9a40';c.lineWidth=4;c.beginPath();c.moveTo(0,0);c.lineTo(0,34);c.stroke();c.fillStyle=f.c;for(let i=0;i<5;i++){c.beginPath();c.arc(Math.cos(i*1.256)*9,Math.sin(i*1.256)*9,7,0,S.TAU);c.fill();}c.fillStyle=PAL.yel;c.beginPath();c.arc(0,0,6,0,S.TAU);c.fill();});});
 S.ink(st.trunk,st.tp,8);
 [st.br1,st.br2].forEach(b=>{c.lineCap='round';c.strokeStyle=S.INK;c.lineWidth=28;c.stroke(b);c.strokeStyle='#c98a50';c.lineWidth=16;c.stroke(b);});
 st.leaf.forEach((l,i)=>{S.at(0,S.osc(9,i*.13)*5,0,1,()=>S.ink(l,st.leafP,7));});
 // nest on the right branch
 S.at(1300,500,0,1,()=>{S.ink(st.nest,'#d9a35c',7);
   S.at(-35,-30-S.osc01(4)*3,0,1,()=>{S.ink(st.bird,'#5fb8ff',6);eye(S,-6,-8,4);eye(S,14,-8,4);c.fillStyle=PAL.org;c.beginPath();c.moveTo(26,-4);c.lineTo(44,2);c.lineTo(26,6);c.fill();});
   S.at(35,-22-S.osc01(4,.3)*3,0,1,()=>{S.ink(st.bird2,'#ffc94a',6);eye(S,-6,-5,3.5);eye(S,8,-5,3.5);c.fillStyle=PAL.org;c.beginPath();c.moveTo(14,-2);c.lineTo(28,2);c.lineTo(14,6);c.fill();});
   S.at(-2,-6,0,1,()=>S.ink(st.egg,'#fff6e0',5));
   S.at(0,22,0,1,()=>{c.strokeStyle=S.INK;c.lineWidth=7;c.fillStyle='#d9a35c';c.beginPath();c.ellipse(0,16,92,36,0,0,Math.PI);c.fill();c.stroke();});});
 // flying parent bird
 const bx=S.wrap(0,34,1920,100),by=200+Math.sin(bx*.006)*40;
 S.at(bx,by,Math.cos(bx*.006)*.15,1,()=>{S.ink(st.bird2,'#ff7a7a',5);const f=S.osc(1.2);c.strokeStyle=S.INK;c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(-5,-4);c.quadraticCurveTo(-25,-35-f*18,-45,-12-f*18);c.stroke();eye(S,10,-6,3.5);c.fillStyle=PAL.org;c.beginPath();c.moveTo(22,-3);c.lineTo(38,2);c.lineTo(22,6);c.fill();});
 // heart fruit
 st.hearts.forEach(h=>{const a=S.osc(7,h.ph)*.16;S.at(h.x,h.y-h.len,a,1,()=>{c.strokeStyle=S.INK;c.lineWidth=3;c.beginPath();c.moveTo(0,0);c.lineTo(0,h.len);c.stroke();S.at(0,h.len+h.s*.5,0,h.s/30,()=>S.ink(st.hp,h.c,5));});});
}});

/* ---------- 2: village street ---------- */
BIS.scene('ps2-2',{title:'Cosy Village',blurb:'A slow-scrolling crayon street of houses with heart windows and chimney smoke that curls into hearts.',
setup(S){const st=S.state;st.gp=S.hatch('#9be07a',['#7fd065','#c0f090'],50,10,4);st.road=S.hatch('#f3d9a4',['#e2c07e','#fff0c8'],50,8,4);
 st.hearts=S.heartPath(22);st.hw=S.heartPath(26);st.sunP=S.blob(0,0,70,70,{jit:.02});
 const cols=['#ff7a7a','#ffb347','#7ad0ff','#c79bff','#ffd84a','#ff9ec0'],roofs=['#7a4fb0','#c44f4f','#3f8fc4','#4f9f5f','#c4783a','#7a4fb0'];
 st.houses=[];[40,350,680,1010,1330,1640].forEach((x,i)=>{const w=S.R(220,250),h=S.R(170,210);
   st.houses.push({x,w,h,c:cols[i],rc:roofs[i],body:S.blob(w/2,-h/2,w/2*1.02,h/2*1.02,{jit:.012,n:12}),roof:S.smooth([[-18,-h+6],[w/2,-h-80],[w+18,-h+6],[w/2,-h+30]]),ph:S.R(0,1)});});
 st.trees=[0,1,2,3,4,5].map(i=>({x:200+i*320+S.R(-30,30),s:S.R(.8,1.1),top:S.blob(0,-190,70,70,{bumps:7,amp:.1,jit:.02})}));
 st.far=[];for(let i=0;i<8;i++)st.far.push({x:i*240+S.R(-20,20),w:S.R(100,150),h:S.R(110,170),c:S.pick(['#c9e8ff','#e6d6ff','#ffe3c9','#d6f5d0'])});
 st.hills=S.smooth([[0,720],[300,660],[700,710],[1100,650],[1500,700],[1920,680],[1920,1080],[0,1080]]);
 st.cl=[0,1,2].map(i=>({p:S.cloudPath(300,120),x:i*640,y:90+i*50}));},
draw(S){const c=S.ctx,st=S.state;S.bg('#b8e6ff','#fff4dc');
 S.at(1650,170,0,1,()=>{c.strokeStyle=PAL.yel;c.lineWidth=8;c.lineCap='round';for(let i=0;i<10;i++){const a=i/10*S.TAU+S.p*S.TAU*2;c.beginPath();c.moveTo(Math.cos(a)*88,Math.sin(a)*88);c.lineTo(Math.cos(a)*118,Math.sin(a)*118);c.stroke();}S.ink(st.sunP,PAL.yel,6);});
 st.cl.forEach(k=>S.at(S.wrap(k.x,90,1920,260),k.y,0,1,()=>S.ink(k.p,'#fff',6)));
 S.ink(st.hills,'#bde88a',6);
 const o1=-S.saw(160)*1920;
 for(let t=0;t<2;t++)st.far.forEach(f=>{const x=f.x+o1+t*1920;if(x<-200||x>2000)return;c.fillStyle=f.c;c.strokeStyle=S.INK;c.lineWidth=4;c.beginPath();c.rect(x,740-f.h,f.w,f.h);c.fill();c.stroke();});
 c.fillStyle=st.gp;c.fillRect(0,740,1920,340);c.strokeStyle=S.INK;c.lineWidth=7;c.beginPath();c.moveTo(0,742);c.lineTo(1920,742);c.stroke();
 c.fillStyle=st.road;c.fillRect(0,880,1920,200);c.beginPath();c.moveTo(0,880);c.lineTo(1920,880);c.stroke();
 const o=-S.saw(56)*1920;
 for(let t=0;t<2;t++){const ox=o+t*1920;
  st.trees.forEach(tr=>{S.at(tr.x+ox,830,0,tr.s,()=>{c.fillStyle='#b9783f';c.strokeStyle=S.INK;c.lineWidth=6;c.fillRect(-14,-120,28,120);c.strokeRect(-14,-120,28,120);S.ink(tr.top,'#5fc860',6);});});
  st.houses.forEach(h=>{const hx=h.x+ox;if(hx<-350||hx>1980)return;S.at(hx,850,0,1,()=>{
    S.ink(h.body,h.c,7);
    c.fillStyle='#d9733c';c.strokeStyle=S.INK;c.lineWidth=6;c.fillRect(h.w*.7,-h.h-115,34,100);c.strokeRect(h.w*.7,-h.h-115,34,100);
    S.ink(h.roof,h.rc,7);
    S.at(h.w*.3,-h.h*.55,0,1.1,()=>S.ink(st.hw,'#fff3a8',5));
    c.fillStyle='#8a5a2c';c.beginPath();c.roundRect(h.w*.55,-70,50,70,[24,24,0,0]);c.fill();c.stroke();
    c.fillStyle=PAL.yel;c.beginPath();c.arc(h.w*.55+38,-34,4,0,S.TAU);c.fill();
    for(let k=0;k<3;k++){const u=S.frac(S.saw(9,h.ph)+k/3);const sx=h.w*.7+17+Math.sin(u*7)*22+u*40,sy=-h.h-130-u*230;
      if(u<.5){c.globalAlpha=Math.min(1,u*6);c.fillStyle='#fff';c.strokeStyle='#cfd8e8';c.lineWidth=3;c.beginPath();c.arc(sx,sy,14+u*34,0,S.TAU);c.fill();c.stroke();}
      else{c.globalAlpha=Math.min(1,(1-u)*2.2);S.at(sx,sy,Math.sin(u*9)*.2,.9+u*.9,()=>S.ink(st.hearts,'#ff8fb3',4));}
      c.globalAlpha=1;}
  });});}
 for(let i=0;i<14;i++){const x=(((i*140+o)%1960)+1960)%1960-40;c.fillStyle='#fff';c.strokeStyle=S.INK;c.lineWidth=4;c.beginPath();c.roundRect(x,945,70,16,8);c.fill();c.stroke();}
}});

/* ---------- 3: duck pond ---------- */
BIS.scene('ps2-3',{title:'Duck Family Pond',blurb:'Mama duck leads her ducklings round a sunny pond with lily pads and dragonflies.',
setup(S){const st=S.state;st.water=S.hatch('#6ec8ff',['#4fb2f0','#9fe0ff','#3a9fe0'],50,10,4);st.bank=S.hatch('#8fdc6a',['#6fcb55','#b8ee8a'],50,10,4);
 st.pondP=S.blob(960,650,900,320,{jit:.01,n:40});
 st.duck=S.blob(0,0,70,48,{jit:.02});st.head=S.blob(0,0,34,32,{jit:.02});st.dl=S.blob(0,0,34,24,{jit:.02});st.dh=S.blob(0,0,20,19,{jit:.02});
 st.pad=[[400,560,60],[620,850,70],[1400,520,55],[1560,800,75],[1000,480,50],[300,760,55],[1250,910,60]].map(a=>({x:a[0],y:a[1],p:S.blob(0,0,a[2],a[2]*.55,{jit:.015}),f:S.rnd()<.7,ph:S.R(0,1)}));
 st.rush=[];for(let i=0;i<9;i++)st.rush.push({x:S.R(60,230)+(i%2?1630:0),y:S.R(760,960),h:S.R(90,160),ph:S.R(0,1)});
 st.cl=[0,1,2].map(i=>({p:S.cloudPath(300,120),x:i*700,y:70+i*30}));
 st.dfly=[0,1,2].map(i=>({cx:[500,1350,950][i],cy:[300,260,880][i],c:['#ff6bb0','#6b7bff','#ffb020'][i],ph:i*.33}));
 st.sunP=S.blob(0,0,60,60,{jit:.02});},
draw(S){const c=S.ctx,st=S.state;S.bg('#bfe8ff','#fff3d6');
 S.at(180,160,0,1,()=>{c.strokeStyle=PAL.yel;c.lineWidth=8;c.lineCap='round';for(let i=0;i<10;i++){const a=i/10*S.TAU+S.p*S.TAU*2;c.beginPath();c.moveTo(Math.cos(a)*76,Math.sin(a)*76);c.lineTo(Math.cos(a)*104,Math.sin(a)*104);c.stroke();}S.ink(st.sunP,PAL.yel,6);});
 st.cl.forEach(k=>S.at(S.wrap(k.x,90,1920,260),k.y,0,1,()=>S.ink(k.p,'#fff',6)));
 c.fillStyle=st.bank;c.fillRect(0,330,1920,750);c.strokeStyle=S.INK;c.lineWidth=7;c.beginPath();c.moveTo(0,332);c.lineTo(1920,332);c.stroke();
 S.ink(st.pondP,st.water,9);
 c.lineWidth=4;for(let i=0;i<6;i++){const u=S.saw(10,i/6),rx=500+i*180,ry=700+(i%3)*60;c.strokeStyle='rgba(255,255,255,'+(1-u)*.8+')';c.beginPath();c.ellipse(rx,ry,20+u*60,8+u*24,0,0,S.TAU);c.stroke();}
 st.pad.forEach(p=>{S.at(p.x,p.y+S.osc(6,p.ph)*4,0,1,()=>{S.ink(p.p,'#4fc15a',6);if(p.f)S.at(10,-8,0,1,()=>{c.fillStyle='#ff9ec0';c.strokeStyle=S.INK;c.lineWidth=4;for(let i=0;i<6;i++){c.save();c.rotate(i/6*S.TAU);c.beginPath();c.ellipse(0,-17,8,16,0,0,S.TAU);c.fill();c.stroke();c.restore();}c.fillStyle=PAL.yel;c.beginPath();c.arc(0,0,8,0,S.TAU);c.fill();});});});
 const cx=960,cy=650;
 const pos=u=>{const a=u*S.TAU;return[cx+Math.cos(a)*720,cy+Math.sin(a)*190];};
 const duck=(u,big,col)=>{const p=pos(u),q=pos(u+.002),x=p[0],y=p[1],dir=q[0]>=x?1:-1;
  S.at(x,y+S.osc(2.2,u*3)*(big?3:2),0,[dir*(big?1:.5),big?1:.62],()=>{
   c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(0,38,big?90:80,12,0,0,S.TAU);c.fill();
   if(big){S.ink(st.duck,'#ffd84a',7);S.at(10,8,-.2,1,()=>{c.fillStyle='#ffc020';c.strokeStyle=S.INK;c.lineWidth=6;c.beginPath();c.ellipse(0,0,36,20,0,0,S.TAU);c.fill();c.stroke();});
    S.at(52,-52,0,1,()=>{S.ink(st.head,'#ffd84a',7);c.fillStyle=PAL.org;c.strokeStyle=S.INK;c.lineWidth=5;c.beginPath();c.ellipse(34,8,22,11,0,0,S.TAU);c.fill();c.stroke();eye(S,6,-6,5);c.fillStyle='rgba(255,120,120,.5)';c.beginPath();c.arc(-6,10,8,0,S.TAU);c.fill();});}
   else{S.ink(st.dl,col,6);S.at(30,-34,0,1,()=>{S.ink(st.dh,col,6);c.fillStyle=PAL.org;c.strokeStyle=S.INK;c.lineWidth=4;c.beginPath();c.ellipse(20,6,13,7,0,0,S.TAU);c.fill();c.stroke();eye(S,4,-4,4);});}
  });};
 const base=S.saw(34),cols=['#fff1a0','#ffe27a','#fff1a0','#ffe27a','#fff1a0'];
 [5,4,3,2,1].forEach((k,i)=>duck(base-k*.026,false,cols[i]));
 duck(base,true);
 st.rush.forEach(r=>{S.at(r.x,r.y,S.osc(5,r.ph)*.07,1,()=>{c.strokeStyle='#3f9a40';c.lineWidth=7;c.lineCap='round';c.beginPath();c.moveTo(0,0);c.lineTo(0,-r.h);c.stroke();c.fillStyle='#a56a35';c.strokeStyle=S.INK;c.lineWidth=4;c.beginPath();c.ellipse(0,-r.h-14,9,24,0,0,S.TAU);c.fill();c.stroke();});});
 st.dfly.forEach(d=>{const t=S.saw(30,d.ph)*S.TAU,x=d.cx+Math.sin(t)*260,y=d.cy+Math.sin(t*2)*60,dir=Math.cos(t)>=0?1:-1;
  S.at(x,y,0,[dir,1],()=>{const fl=S.osc(.6)*.3;c.strokeStyle=S.INK;c.lineWidth=4;c.fillStyle='rgba(255,255,255,.85)';
   [-1,1].forEach(s=>{S.at(s*8,-4,(-.2+fl)*s,1,()=>{c.beginPath();c.ellipse(0,-20,10,24,0,0,S.TAU);c.fill();c.stroke();});});
   c.lineCap='round';c.strokeStyle=S.INK;c.lineWidth=14;c.beginPath();c.moveTo(-50,0);c.lineTo(20,0);c.stroke();c.strokeStyle=d.c;c.lineWidth=8;c.beginPath();c.moveTo(-50,0);c.lineTo(20,0);c.stroke();
   c.fillStyle=d.c;c.strokeStyle=S.INK;c.lineWidth=4;c.beginPath();c.arc(26,0,11,0,S.TAU);c.fill();c.stroke();eye(S,30,-3,3);});});
}});
})();
