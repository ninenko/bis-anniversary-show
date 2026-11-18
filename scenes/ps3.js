/* Preschool 3 - You've Got a Friend in Me - crayon style (original visuals) */
(function(){
function dot(S,x,y,r,col){const c=S.ctx;c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,S.TAU);c.fill();}
function smile(S,r,eyeY,eyeX,mouth){const c=S.ctx;dot(S,-eyeX,eyeY,r*.08,S.INK);dot(S,eyeX,eyeY,r*.08,S.INK);c.strokeStyle=S.INK;c.lineWidth=Math.max(3,r*.07);c.lineCap='round';c.beginPath();c.arc(0,eyeY+r*.12,mouth,.25,Math.PI-.25);c.stroke();
  c.fillStyle='rgba(255,110,130,.45)';c.beginPath();c.arc(-eyeX*1.5,eyeY+r*.22,r*.1,0,S.TAU);c.arc(eyeX*1.5,eyeY+r*.22,r*.1,0,S.TAU);c.fill();}
function sun(S,x,y,r){const c=S.ctx;S.at(x,y,0,1,()=>{c.strokeStyle='#ffb020';c.lineWidth=9;c.lineCap='round';for(let i=0;i<12;i++){const a=i/12*S.TAU+S.p*S.TAU*S.cycles(60);c.beginPath();c.moveTo(Math.cos(a)*r*1.25,Math.sin(a)*r*1.25);c.lineTo(Math.cos(a)*r*1.6,Math.sin(a)*r*1.6);c.stroke();}
  S.ink(S.state.sunP,'#ffd84a',7);S.at(0,0,0,r/70,()=>smile(S,70,-8,22,24));});}

/* ---------- 1: balloon pairs ---------- */
BIS.scene('ps3-1',{title:'Balloon Buddies',blurb:'Pairs of smiling balloons tied together float up into a sunny sky above green hills.',
setup(S){const st=S.state;st.sunP=S.blob(0,0,70,70,{jit:.02});
 st.hillP=S.hatch('#7fdc6a',['#5fc450','#a8f08a','#4fb046'],50,10,4);st.hillP2=S.hatch('#a6e87a',['#86d466','#c8f59a'],50,10,4);
 st.h1=S.smooth([[-50,900],[300,820],[800,880],[1300,810],[2000,870],[2000,1100],[-50,1100]]);
 st.h2=S.smooth([[-50,980],[500,930],[1000,990],[1500,940],[2000,990],[2000,1100],[-50,1100]]);
 st.cl=[0,1,2,3].map(i=>({p:S.cloudPath(S.R(260,340),S.R(100,140)),x:i*520,y:S.R(80,300),sec:S.pick([70,90,120])}));
 const cols=['#ff5a6e','#ffd84a','#4fb8f5','#8be05a','#b78cf0','#ff9a3c','#ff8fc0','#3fd0c0'];
 st.pairs=[];for(let i=0;i<9;i++){const a=cols[i%8],b=cols[(i+3)%8];
   st.pairs.push({x:130+i*207+S.R(-10,10),y0:((i*.62*1080+S.R(-50,50))%1080+1080)%1080,sec:i%3==0?60:40,s:S.R(.68,.85),a,b,ph:S.R(0,1),bal:S.blob(0,0,72,88,{jit:.02}),knot:S.R(190,240)});}
 st.hp=S.heartPath(22);},
draw(S){const c=S.ctx,st=S.state;S.bg('#8fd8ff','#fff1c9');
 sun(S,1700,170,75);
 st.cl.forEach(k=>S.at(S.wrap(k.x,k.sec,1920,260),k.y,0,1,()=>S.ink(k.p,'#fff',6)));
 st.pairs.forEach(P=>{const y=S.wrap(P.y0%1080,P.sec,1080,340,-1)+40;const sw=S.osc(8,P.ph)*.1;
   S.at(P.x,y,sw,P.s,()=>{
    c.strokeStyle='#444';c.lineWidth=3;c.lineCap='round';
    [[-64,P.a],[64,P.b]].forEach(([bx,col],i)=>{c.beginPath();c.moveTo(bx*.95,88);c.quadraticCurveTo(bx*.3,P.knot*.6,0,P.knot);c.stroke();});
    // bow
    c.fillStyle='#fff';c.lineWidth=4;c.strokeStyle=S.INK;c.beginPath();c.moveTo(0,P.knot);c.lineTo(-24,P.knot-12);c.lineTo(-24,P.knot+14);c.closePath();c.moveTo(0,P.knot);c.lineTo(24,P.knot-12);c.lineTo(24,P.knot+14);c.closePath();c.fill();c.stroke();
    [[-64,P.a,-1],[64,P.b,1]].forEach(([bx,col,d])=>{S.at(bx,Math.sin(d*S.p*S.TAU*S.cycles(6))*0+S.osc(6,P.ph+(d>0?.25:0))*6,d*.12,1,()=>{S.ink(P.bal,col,7);
      c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(-26,-40,12,22,.5,0,S.TAU);c.fill();
      S.at(0,0,0,1,()=>smile(S,72,-6,24,22));
      c.fillStyle=col;c.strokeStyle=S.INK;c.lineWidth=5;c.beginPath();c.moveTo(0,90);c.lineTo(-10,106);c.lineTo(10,106);c.closePath();c.fill();c.stroke();});});
   });});
 S.ink(st.h1,st.hillP,7);S.ink(st.h2,st.hillP2,7);
}});

/* ---------- 2: paper-doll chain ---------- */
BIS.scene('ps3-2',{title:'Paper-Doll Parade',blurb:'A chain of colourful holding-hands figures marches across sunny rolling hills.',
setup(S){const st=S.state;st.sunP=S.blob(0,0,70,70,{jit:.02});
 st.far=S.hatch('#bfeaa0',['#a6dc88','#d6f6b8'],50,9,4);st.mid=S.hatch('#8fdc6a',['#6fcb55','#b8ee8a'],50,10,4);st.near=S.hatch('#5fc45a',['#47b04a','#86e07a'],50,10,4);
 const hill=(base,amp,ph,k)=>{const pts=[];for(let i=0;i<=24;i++){const x=i*80-0;pts.push([x,base+Math.sin(i/24*S.TAU*k+ph)*amp]);}pts.push([1920,1100],[0,1100]);return S.smooth(pts.slice(0,-2).concat([[1920,1100],[0,1100]]),true);};
 st.hFar=hill(560,40,1,2);st.hMid=hill(760,50,0,2);
 st.cl=[0,1,2].map(i=>({p:S.cloudPath(320,130),x:i*680,y:70+i*45}));
 st.cols=['#ff5a6e','#ffd84a','#4fb8f5','#8be05a','#b78cf0','#ff9a3c','#ff8fc0','#3fd0c0','#ffb3c8','#6f8cff','#e8d84a','#ff7a3c'];
 st.skin=['#ffd9b0','#e8b080','#c88a5a','#f5c8a0'];
 st.fl=[];for(let i=0;i<30;i++)st.fl.push({x:S.R(0,1920),y:S.R(930,1050),c:S.pick(['#fff','#ffd84a','#ff9ec0'])});},
draw(S){const c=S.ctx,st=S.state;S.bg('#ffe9a8','#c9f0ff');
 sun(S,300,190,80);
 st.cl.forEach(k=>S.at(S.wrap(k.x,100,1920,260),k.y,0,1,()=>S.ink(k.p,'#fff',6)));
 S.ink(st.hFar,st.far,6);
 const hy=(x,base,amp,k,ph)=>base+Math.sin(x/1920*S.TAU*k+ph)*amp;
 const chain=(n,scale,base,amp,k,ph,sec,dir,seed)=>{const sp=1920/n,off=S.saw(sec)*1920*dir;
   const hand=(x)=>hy(x,base,amp,k,ph)-76*scale;
   // arms first
   c.lineCap='round';
   for(let i=-1;i<=n;i++){const x=((i*sp+off)%1920+1920)%1920;for(const t of [0,1920]){const X=x+t-sp;if(X<-sp||X>1920+sp)continue;
     const x1=X+22*scale,x2=X+sp-22*scale,y1=hand(X)+S.osc(1.4,i*.1)*3,y2=hand(X+sp)+S.osc(1.4,(i+1)*.1)*3;
     c.strokeStyle=S.INK;c.lineWidth=16*scale;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();c.strokeStyle='#ffe0bd';c.lineWidth=9*scale;c.stroke();}}
   for(let j=-1;j<=n;j++){let X=((j*sp+off)%1920+1920)%1920-sp;for(const t of [0,1920]){const x=X+t;if(x<-sp||x>1920+sp)continue;
     const idx=((Math.round((x-off)/sp)%n)+n)%n,col=st.cols[(idx+seed)%12],sk=st.skin[idx%4];const by=hy(x,base,amp,k,ph);
     const step=S.osc(1.4,idx*.1),bob=Math.abs(step)*-8*scale;
     S.at(x,by+bob,0,scale,()=>{
      // paper cut-out white edge then colour
      const body=new Path2D();body.moveTo(0,-90);body.lineTo(-34,-20);body.lineTo(34,-20);body.closePath();
      c.lineJoin='round';
      // legs
      c.lineCap='round';[-1,1].forEach(d=>{c.strokeStyle=S.INK;c.lineWidth=17;c.beginPath();c.moveTo(d*10,-22);c.lineTo(d*10+step*d*14,0);c.stroke();c.strokeStyle=sk;c.lineWidth=9;c.stroke();});
      c.strokeStyle='#fff';c.lineWidth=16;c.stroke(body);S.ink(body,col,6);
      c.strokeStyle='#fff';c.lineWidth=14;c.beginPath();c.arc(0,-112,28,0,S.TAU);c.stroke();
      S.ink((()=>{const p=new Path2D();p.arc(0,-112,28,0,S.TAU);return p;})(),sk,6);
      // hair cap
      c.fillStyle=idx%3==0?'#5a3a22':idx%3==1?'#e8b030':'#2a2a2a';c.beginPath();c.arc(0,-116,28,Math.PI*1.08,Math.PI*1.92);c.closePath();c.fill();
      dot(S,-9,-110,3.5,S.INK);dot(S,9,-110,3.5,S.INK);c.strokeStyle=S.INK;c.lineWidth=3.5;c.beginPath();c.arc(0,-106,10,.25,Math.PI-.25);c.stroke();
      c.fillStyle='rgba(255,110,130,.5)';c.beginPath();c.arc(-17,-102,5,0,S.TAU);c.arc(17,-102,5,0,S.TAU);c.fill();});
   }}
   // hands as small dots
 };
 chain(16,.62,560,40,2,1,70,-1,5);
 S.ink(st.hMid,st.mid,6);
 chain(12,1.05,760,50,2,0,50,1,0);
}});

/* ---------- 3: toy train ---------- */
BIS.scene('ps3-3',{title:'Little Wooden Train',blurb:'A cheerful wooden toy train loops around a hilly track carrying hearts and stars.',
setup(S){const st=S.state;st.sunP=S.blob(0,0,70,70,{jit:.02});
 st.g1=S.hatch('#c8f0a0',['#a8e080','#e0fabc'],50,9,4);st.g2=S.hatch('#8fdc6a',['#6fcb55','#b8ee8a'],50,10,4);st.g3=S.hatch('#6fd060',['#52bb4c','#9af088'],50,10,4);
 const hill=(base,amp,ph,k)=>{const pts=[];for(let i=0;i<=24;i++)pts.push([i*80,base+Math.sin(i/24*S.TAU*k+ph)*amp]);pts.push([1920,1100],[0,1100]);return S.smooth(pts,true);};
 st.hA=hill(520,50,.5,2);st.hB=hill(700,60,2,2);st.hC=hill(900,40,0,3);
 st.cl=[0,1,2].map(i=>({p:S.cloudPath(300,120),x:i*680,y:70+i*50}));
 // track as closed curve with arc-length table
 const f=a=>[960+Math.cos(a)*790,700+Math.sin(a)*190+Math.sin(a*3)*45];
 const N=900,pts=[],cum=[0];for(let i=0;i<=N;i++){pts.push(f(i/N*S.TAU));if(i)cum.push(cum[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));}
 st.pts=pts;st.cum=cum;st.total=cum[N];st.N=N;
 st.track=S.smooth(pts.filter((_,i)=>i%15==0&&i<N),true);
 st.sleep=[];for(let s=0;s<st.total;s+=44)st.sleep.push(s);
 st.heart=S.heartPath(24);st.star=S.starPath(30,13,5);
 st.hills2=[];for(let i=0;i<14;i++)st.hills2.push({x:S.R(60,1860),y:S.R(380,480),c:S.pick(['#ff9ec0','#fff','#ffd84a'])});},
draw(S){const c=S.ctx,st=S.state;S.bg('#c7e6ff','#fff0d8');
 sun(S,1650,170,70);
 st.cl.forEach(k=>S.at(S.wrap(k.x,100,1920,260),k.y,0,1,()=>S.ink(k.p,'#fff',6)));
 S.ink(st.hA,st.g1,6);S.ink(st.hB,st.g2,6);S.ink(st.hC,st.g3,6);
 const at=s=>{s=((s%st.total)+st.total)%st.total;let lo=0,hi=st.N;while(hi-lo>1){const m=(lo+hi)>>1;if(st.cum[m]<=s)lo=m;else hi=m;}
   const a=st.pts[lo],b=st.pts[Math.min(lo+1,st.N)];return[a[0]+(b[0]-a[0])*.5,a[1]+(b[1]-a[1])*.5,Math.atan2(b[1]-a[1],b[0]-a[0])];};
 // track
 const rail=(off,col,w)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();for(let i=0;i<=st.N;i+=3){const p=st.pts[i%st.N],q=st.pts[(i+1)%st.N],a=Math.atan2(q[1]-p[1],q[0]-p[0]);const x=p[0]-Math.sin(a)*off,y=p[1]+Math.cos(a)*off;i?c.lineTo(x,y):c.moveTo(x,y);}c.closePath();c.stroke();};
 c.lineCap='round';
 st.sleep.forEach(s=>{const[x,y,a]=at(s);c.strokeStyle=S.INK;c.lineWidth=14;c.beginPath();c.moveTo(x+Math.sin(a)*24,y-Math.cos(a)*24);c.lineTo(x-Math.sin(a)*24,y+Math.cos(a)*24);c.stroke();c.strokeStyle='#d9a05a';c.lineWidth=7;c.stroke();});
 rail(11,S.INK,9);rail(-11,S.INK,9);rail(11,'#ccd2dc',4);rail(-11,'#ccd2dc',4);
 // train
 const s0=S.saw(41)*st.total;
 const car=(s,fn)=>{const[x,y,a]=at(s),dir=Math.cos(a)>=0?1:-1;S.at(x,y,dir>0?a:a+Math.PI,[dir,1],fn);};
 const wheels=(w)=>{[-w*.3,w*.3].forEach(wx=>{S.at(wx,-14,S.p*S.TAU*S.cycles(2)*-1,1,()=>{c.fillStyle='#ffd84a';c.strokeStyle=S.INK;c.lineWidth=5;c.beginPath();c.arc(0,0,17,0,S.TAU);c.fill();c.stroke();c.beginPath();c.moveTo(-17,0);c.lineTo(17,0);c.moveTo(0,-17);c.lineTo(0,17);c.stroke();});});};
 const cargo=['heart','star','heart','star'],ccol=['#ffd84a','#4fb8f5','#8be05a','#ff9ec0'],cargoC=['#ff4f6d','#ffd84a','#ff8fb3','#ff9a3c'];
 for(let k=3;k>=0;k--){car(s0-(k+1)*150,()=>{
   c.strokeStyle=S.INK;c.lineWidth=5;c.beginPath();c.moveTo(75,-26);c.lineTo(48,-26);c.stroke();
   c.fillStyle=ccol[k];c.beginPath();c.roundRect(-58,-80,116,52,10);c.fill();c.stroke();
   c.fillStyle='rgba(255,255,255,.45)';c.fillRect(-48,-72,96,6);
   wheels(116);
   const b=S.osc(2,k*.2)*4;S.at(0,-96+b,S.osc(3,k*.25)*.15,1,()=>S.ink(cargo[k]=='heart'?st.heart:st.star,cargoC[k],5));});}
 car(s0,()=>{
   // smoke
   for(let k=0;k<4;k++){const u=S.frac(S.saw(4)+k/4);c.globalAlpha=(1-u)*.9;c.fillStyle='#fff';c.strokeStyle='#cfd8e8';c.lineWidth=3;c.beginPath();c.arc(30-u*50,-170-u*90,12+u*24,0,S.TAU);c.fill();c.stroke();}
   c.globalAlpha=1;
   c.fillStyle='#ff5a6e';c.strokeStyle=S.INK;c.lineWidth=6;c.lineJoin='round';
   c.beginPath();c.roundRect(-62,-86,125,60,10);c.fill();c.stroke();
   c.fillStyle='#4fb8f5';c.beginPath();c.roundRect(-70,-130,60,66,8);c.fill();c.stroke();   // cab
   c.fillStyle='#fff';c.beginPath();c.roundRect(-58,-120,34,26,6);c.fill();c.stroke();
   c.fillStyle='#ffd84a';c.beginPath();c.moveTo(-76,-132);c.lineTo(-4,-132);c.lineTo(-10,-146);c.lineTo(-70,-146);c.closePath();c.fill();c.stroke();
   c.fillStyle='#8be05a';c.beginPath();c.roundRect(24,-128,26,44,6);c.fill();c.stroke();     // chimney
   c.fillStyle='#ffd84a';c.fillRect(18,-136,38,12);c.strokeRect(18,-136,38,12);
   c.fillStyle='#ffd84a';c.beginPath();c.arc(62,-56,14,0,S.TAU);c.fill();c.stroke();
   S.at(18,-56,0,1,()=>{dot(S,-4,-4,0,S.INK);});
   wheels(125);
   c.fillStyle=S.INK;c.beginPath();c.arc(8,-62,5,0,S.TAU);c.arc(34,-62,5,0,S.TAU);c.fill();c.strokeStyle=S.INK;c.lineWidth=4;c.beginPath();c.arc(21,-58,11,.3,Math.PI-.3);c.stroke();});
}});
})();
