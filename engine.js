/* BIS Anniversary Show — shared loop engine.
   Each scene: BIS.scene('ps2-1', {title, blurb, setup(S){...}, draw(S){...}})
   Draw on a fixed 1920x1080 canvas. Time ONLY through S.p (loop phase 0..1) or the
   helpers below, which snap every motion to a whole number of cycles per loop,
   so the last frame flows into the first with no jump. */
(function(){
const W=1920,H=1080,TAU=Math.PI*2;
const BIS=window.BIS={W,H,TAU,scenes:{}};
BIS.scene=(id,def)=>{BIS.scenes[id]=def};
const frac=x=>x-Math.floor(x);
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

BIS.api=function(ctx,L,seed){
  const r=mulberry(seed||7);
  const S={ctx,W,H,L,TAU,p:0,t:0,now:0,photos:[],state:{},
    rnd:r,R:(a,b)=>a+r()*(b-a),RI:(a,b)=>Math.floor(a+r()*(b-a+1)),pick:a=>a[Math.floor(r()*a.length)],
    frac,lerp:(a,b,t)=>a+(b-a)*t,clamp:(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),
    ease:t=>t*t*(3-2*t)};
  // whole cycles per loop for a motion that should take ~sec seconds
  S.cycles=sec=>Math.max(1,Math.round(L/sec));
  S.osc=(sec,off=0)=>Math.sin(TAU*(S.cycles(sec)*S.p+off));   // -1..1
  S.osc01=(sec,off=0)=>.5+.5*S.osc(sec,off);                  //  0..1
  S.saw=(sec,off=0)=>frac(S.cycles(sec)*S.p+off);              //  0..1 ramp
  // position wrapping across [-m, span+m): x0 start, ~sec per full crossing, dir ±1
  S.wrap=(x0,sec,span,m=0,dir=1)=>frac((x0+m)/(span+2*m)+dir*S.saw(sec))*(span+2*m)-m;
  // pulse 0..1 peaking once per cycle (good for beats/twinkles)
  S.pulse=(sec,off=0,sharp=4)=>Math.pow(S.osc01(sec,off),sharp);

  /* colour */
  S.hsl=(h,s,l,a=1)=>`hsla(${h},${s}%,${l}%,${a})`;
  S.mix=(c1,c2,t)=>{const a=parseInt(c1.slice(1),16),b=parseInt(c2.slice(1),16);
    const m=(s)=>Math.round(((a>>s)&255)*(1-t)+((b>>s)&255)*t);return `rgb(${m(16)},${m(8)},${m(0)})`};

  /* drawing */
  S.bg=(...stops)=>{const g=ctx.createLinearGradient(0,0,0,H);stops.forEach((c,i)=>g.addColorStop(i/(stops.length-1),c));ctx.fillStyle=g;ctx.fillRect(0,0,W,H)};
  S.radial=(x,y,r,inner,outer)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,inner);g.addColorStop(1,outer);return g};
  S.glow=(x,y,r,color,a=1)=>{ctx.save();ctx.globalAlpha*=a;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,2*r,2*r);ctx.restore()};
  S.at=(x,y,rot,sc,fn)=>{ctx.save();ctx.translate(x,y);if(rot)ctx.rotate(rot);if(sc!=null&&sc!==1)Array.isArray(sc)?ctx.scale(sc[0],sc[1]):ctx.scale(sc,sc);fn();ctx.restore()};
  // Path2D builders (centred on 0,0) — build once in setup, reuse in draw
  S.heartPath=(s=50)=>{const p=new Path2D();p.moveTo(0,s*.35);p.bezierCurveTo(-s*1.1,-s*.35,-s*.55,-s*1.15,0,-s*.55);p.bezierCurveTo(s*.55,-s*1.15,s*1.1,-s*.35,0,s*.35);p.closePath();return p};
  S.starPath=(r1=50,r2=22,n=5)=>{const p=new Path2D();for(let i=0;i<2*n;i++){const a=-Math.PI/2+i*Math.PI/n,r=i%2?r2:r1;i?p.lineTo(Math.cos(a)*r,Math.sin(a)*r):p.moveTo(Math.cos(a)*r,Math.sin(a)*r)}p.closePath();return p};
  S.smooth=(pts,closed=true)=>{const n=pts.length,g=i=>closed?pts[(i+n)%n]:pts[Math.max(0,Math.min(n-1,i))];let d=`M${pts[0][0]},${pts[0][1]}`;
    for(let i=0;i<(closed?n:n-1);i++){const p0=g(i-1),p1=g(i),p2=g(i+1),p3=g(i+2);
      d+=` C${p1[0]+(p2[0]-p0[0])/6},${p1[1]+(p2[1]-p0[1])/6} ${p2[0]-(p3[0]-p1[0])/6},${p2[1]-(p3[1]-p1[1])/6} ${p2[0]},${p2[1]}`}
    return new Path2D(d+(closed?'Z':''))};
  // wobbly blob; bumps>0 gives cloud/bush edges
  S.blob=(cx,cy,rx,ry,{bumps=0,amp=0,jit=.03,n=48}={})=>{const pts=[],ph=S.R(0,TAU);for(let i=0;i<n;i++){const t=i/n*TAU;let k=1+S.R(-jit,jit);if(bumps)k+=amp*Math.pow(Math.abs(Math.sin(t*bumps/2+ph)),.6);pts.push([cx+Math.cos(t)*rx*k,cy+Math.sin(t)*ry*k])}return S.smooth(pts)};
  S.wline=(x1,y1,x2,y2,j=2)=>{const pts=[];for(let i=0;i<=4;i++){const t=i/4;pts.push([x1+(x2-x1)*t+S.R(-j,j),y1+(y2-y1)*t+S.R(-j,j)])}return S.smooth(pts,false)};
  // crayon look: fill + bold ink outline
  S.INK='#1c1c1c';
  S.ink=(path,fill,w=6,ink=S.INK)=>{if(fill){ctx.fillStyle=fill;ctx.fill(path)}if(w){ctx.lineWidth=w;ctx.strokeStyle=ink;ctx.lineJoin=ctx.lineCap='round';ctx.stroke(path)}};
  // crayon scribble fill pattern (build once in setup)
  S.hatch=(base,marks,size=46,count=9,wid=3)=>{const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,size,size);x.lineCap='round';x.lineWidth=wid;x.globalAlpha=.75;
    for(let i=0;i<count;i++){const a=S.R(-.5,.2),l=S.R(6,16),px=S.R(0,size),py=S.R(0,size);x.strokeStyle=marks[i%marks.length];x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*l,py+Math.sin(a)*l);x.stroke()}
    return ctx.createPattern(c,'repeat')};
  S.cloudPath=(w=300,h=120)=>S.blob(0,0,w/2,h/2,{bumps:5,amp:.45,jit:.02,n:70});

  /* photo window for frame scenes (Grade 0). Uses S.photos (Image/ImageBitmap list).
     Crossfades through them using real time S.now; draws a placeholder if empty. */
  S.photoWindow=(x,y,w,h,rad=24,slideSec)=>{ctx.save();const p=new Path2D();p.roundRect(x,y,w,h,rad);ctx.clip(p);
    const ph=S.photos;if(!ph.length){ctx.fillStyle='rgba(255,255,255,.18)';ctx.fill(p);ctx.fillStyle='rgba(255,255,255,.85)';ctx.font='600 44px system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText('Photo slideshow plays here',x+w/2,y+h/2-26);ctx.font='28px system-ui,sans-serif';ctx.fillText('Click "Add photos" (photos stay on this computer)',x+w/2,y+h/2+28);ctx.restore();return}
    const sec=slideSec||Math.max(4,L/ph.length),k=S.now/sec,i=Math.floor(k)%ph.length,f=frac(k),fade=.8/sec;
    const drawImg=(img,a)=>{if(!img)return;const s=Math.max(w/img.width,h/img.height),iw=img.width*s,ih=img.height*s;ctx.globalAlpha=a;ctx.drawImage(img,x+(w-iw)/2,y+(h-ih)/2,iw,ih)};
    ctx.fillStyle='#000';ctx.fill(p);drawImg(ph[i],1);if(f>1-fade)drawImg(ph[(i+1)%ph.length],(f-(1-fade))/fade);ctx.restore()};
  return S;
};
})();
