/* Grade 6 — House of Memories (elegant, cinematic: warm light, grain, bokeh, depth) */
(function(){
const TAU=Math.PI*2,W=1920,H=1080;
const mk=(w,h,f)=>{const c=document.createElement('canvas');c.width=Math.ceil(w);c.height=Math.ceil(h);const x=c.getContext('2d');if(f)f(x,c);return c};
const G=(x,x0,y0,x1,y1,st)=>{const g=x.createLinearGradient(x0,y0,x1,y1);st.forEach(s=>g.addColorStop(s[0],s[1]));return g};
const RG=(x,cx,cy,r0,r1,st)=>{const g=x.createRadialGradient(cx,cy,r0,cx,cy,r1);st.forEach(s=>g.addColorStop(s[0],s[1]));return g};
const disc=(x,cx,cy,r)=>{x.beginPath();x.arc(cx,cy,r,0,TAU);x.fill()};
const ell=(x,cx,cy,rx,ry)=>{x.beginPath();x.ellipse(cx,cy,Math.max(.1,rx),Math.max(.1,ry),0,0,TAU);x.fill()};
const glowSprite=(rgb,size=256,mid=.35)=>mk(size,size,x=>{x.fillStyle=RG(x,size/2,size/2,0,size/2,[[0,`rgba(${rgb},1)`],[mid,`rgba(${rgb},.4)`],[1,`rgba(${rgb},0)`]]);x.fillRect(0,0,size,size)});
const bokehSprite=(rgb,size=160)=>mk(size,size,x=>{const r=size/2;x.fillStyle=RG(x,r,r,0,r,[[0,`rgba(${rgb},.45)`],[.78,`rgba(${rgb},.55)`],[.9,`rgba(${rgb},.7)`],[1,`rgba(${rgb},0)`]]);x.fillRect(0,0,size,size)});
const vignetteCanvas=(a=.7,inner=380)=>mk(W,H,x=>{x.fillStyle=RG(x,W/2,H*.48,inner,1180,[[0,'rgba(12,6,2,0)'],[1,`rgba(12,6,2,${a})`]]);x.fillRect(0,0,W,H)});
/* film grain: 4 neutral-grey noise tiles, swapped 12x per second (whole number per loop) */
function initGrain(S){const g={pats:[],offs:[]};
  for(let k=0;k<4;k++){const c=mk(256,256,x=>{const d=x.createImageData(256,256);for(let i=0;i<d.data.length;i+=4){const v=128+(S.rnd()+S.rnd()-1)*70;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}x.putImageData(d,0,0)});
    g.pats.push(S.ctx.createPattern(c,'repeat'));g.offs.push([S.RI(0,255),S.RI(0,255)])}
  return g}
function drawGrain(S,g,a){const c=S.ctx,i=Math.floor(S.p*S.L*12)%4,o=g.offs[i];
  c.save();c.globalCompositeOperation='overlay';c.globalAlpha=a;c.translate(o[0],o[1]);c.fillStyle=g.pats[i];c.fillRect(-o[0],-o[1],W,H);c.restore()}

/* ---------- little painted memories (used in frames and photographs) ---------- */
function figure(x,fx,fy,h,lh,rh){
  const kid=h<.25*x.canvas.height,hr=h*(kid?.11:.09),sw=h*.15,top=fy-h+hr*2.1,hip=fy-h*.46;
  disc(x,fx,fy-h+hr,hr);
  x.beginPath();x.moveTo(fx-sw*.42,top);x.quadraticCurveTo(fx-sw*.62,(top+hip)/2,fx-sw*.42,hip);x.lineTo(fx+sw*.42,hip);x.quadraticCurveTo(fx+sw*.62,(top+hip)/2,fx+sw*.42,top);x.closePath();x.fill();
  x.strokeStyle=x.fillStyle;x.lineCap='round';
  x.lineWidth=h*.075;x.beginPath();x.moveTo(fx-sw*.2,hip-2);x.lineTo(fx-sw*.26,fy);x.moveTo(fx+sw*.2,hip-2);x.lineTo(fx+sw*.26,fy);x.stroke();
  x.lineWidth=h*.05;const sy=top+h*.035,L=lh||[fx-sw*.6,hip+h*.05],R=rh||[fx+sw*.6,hip+h*.05];
  x.beginPath();x.moveTo(fx-sw*.4,sy);x.lineTo(L[0],L[1]);x.moveTo(fx+sw*.4,sy);x.lineTo(R[0],R[1]);x.stroke()}
function group(x,fy,L){for(let i=0;i<L.length;i++){const [fx,hh]=L[i];let lh=null,rh=null;
  if(i>0){const [px,ph]=L[i-1];lh=[(px+fx)/2,fy-Math.min(ph,hh)*.48]}
  if(i<L.length-1){const [nx,nh]=L[i+1];rh=[(nx+fx)/2,fy-Math.min(nh,hh)*.48]}
  figure(x,fx,fy,hh,lh,rh)}}
function canopy(S,x,cx,cy,r,cols,n=14){for(let i=0;i<n;i++){x.fillStyle=cols[i%cols.length];const a=S.R(0,TAU),d=S.R(0,r*.6);disc(x,cx+Math.cos(a)*d,cy+Math.sin(a)*d*.7,r*S.R(.35,.55))}}
const PAINT={
beach(S,x,w,h){
  x.fillStyle=G(x,0,0,0,h*.62,[[0,'#cf6f5a'],[.45,'#f2a970'],[1,'#fde0a8']]);x.fillRect(0,0,w,h);
  const sx=w*.58,sy=h*.6;x.fillStyle=RG(x,sx,sy,0,w*.6,[[0,'rgba(255,245,210,.9)'],[1,'rgba(255,220,160,0)']]);x.fillRect(0,0,w,h*.62);
  x.fillStyle='rgba(255,190,160,.45)';for(let i=0;i<5;i++)ell(x,S.R(0,w),S.R(h*.1,h*.42),S.R(w*.12,w*.3),h*.012);
  x.fillStyle='#fff6dc';disc(x,sx,sy,w*.075);
  x.fillStyle=G(x,0,h*.6,0,h*.88,[[0,'#e6a070'],[1,'#5e3a52']]);x.fillRect(0,h*.6,w,h*.4);
  for(let i=0;i<16;i++){const y=h*.612+i*h*.015,ww=w*(.14-i*.006)*S.R(.6,1.3);x.fillStyle=`rgba(255,236,190,${.75-i*.04})`;x.fillRect(sx-ww/2+S.R(-5,5),y,ww,Math.max(1,h*.005))}
  x.fillStyle='#3b2432';x.beginPath();x.moveTo(0,h*.86);x.quadraticCurveTo(w*.5,h*.81,w,h*.88);x.lineTo(w,h);x.lineTo(0,h);x.fill();
  x.fillStyle='#22141c';group(x,h*.92,[[w*.36,h*.36],[w*.47,h*.23]])},
mountains(S,x,w,h){
  x.fillStyle=G(x,0,0,0,h*.65,[[0,'#6c9fce'],[1,'#f0dcc0']]);x.fillRect(0,0,w,h);
  x.fillStyle='rgba(255,255,255,.5)';for(let i=0;i<4;i++)ell(x,S.R(0,w),S.R(h*.08,h*.25),S.R(w*.08,w*.18),h*.025);
  const peaks=(y0,amp,n,col,snow)=>{x.beginPath();x.moveTo(-5,h);for(let i=0;i<=n;i++)x.lineTo(i/n*(w+10)-5,y0-amp*(i%2?S.R(.65,1):S.R(.05,.3)));x.lineTo(w+5,h);x.closePath();x.fillStyle=col;x.fill();
    if(snow){x.save();x.clip();x.fillStyle='rgba(250,248,242,.95)';x.beginPath();x.moveTo(0,0);x.lineTo(w,0);for(let i=14;i>=0;i--)x.lineTo(i/14*w,y0-amp*(.55+S.R(-.12,.1)));x.closePath();x.fill();x.restore()}};
  peaks(h*.52,h*.32,7,'#7f96b8',true);
  x.fillStyle=G(x,0,h*.3,0,h*.6,[[0,'rgba(240,225,205,0)'],[1,'rgba(240,225,205,.45)']]);x.fillRect(0,h*.3,w,h*.3);
  peaks(h*.64,h*.12,9,'#4e6c74',false);
  x.fillStyle=G(x,0,h*.62,0,h,[[0,'#b2bf64'],[1,'#5a7834']]);x.beginPath();x.moveTo(0,h*.66);x.quadraticCurveTo(w*.5,h*.6,w,h*.68);x.lineTo(w,h);x.lineTo(0,h);x.fill();
  x.fillStyle='#34502a';for(let i=0;i<5;i++){const tx=S.R(.05,.4)*w;ell(x,tx,h*.66,w*.018,h*.07)}
  const cx=w*.62,cy=h*.8,s=w*.16;x.fillStyle='rgba(0,0,0,.18)';ell(x,cx+s*.1,cy+2,s*.6,s*.06);
  x.fillStyle='#f3ece0';x.fillRect(cx-s/2,cy-s*.36,s,s*.36);x.beginPath();x.moveTo(cx-s/2-2,cy-s*.35);x.quadraticCurveTo(cx,cy-s*.95,cx+s/2+2,cy-s*.35);x.fill();
  x.fillStyle='rgba(120,90,60,.25)';x.fillRect(cx+s*.15,cy-s*.36,s*.35,s*.36);
  x.fillStyle='#b23a2a';x.fillRect(cx-s/2,cy-s*.33,s,s*.05);x.fillStyle='#7a3a20';x.fillRect(cx-s*.08,cy-s*.22,s*.16,s*.22);
  x.fillStyle='rgba(255,240,220,.7)';for(let i=0;i<30;i++)disc(x,S.R(0,w),S.R(h*.7,h),1.2)},
kite(S,x,w,h){
  x.fillStyle=G(x,0,0,0,h,[[0,'#4f93cf'],[.7,'#cfe6ef'],[1,'#e8efd8']]);x.fillRect(0,0,w,h);
  x.fillStyle='rgba(255,255,255,.85)';for(let i=0;i<3;i++){const cx=S.R(0,w),cy=S.R(h*.15,h*.45);for(let k=0;k<5;k++)ell(x,cx+(k-2)*w*.04,cy+S.R(-6,4),w*S.R(.05,.08),h*S.R(.03,.05))}
  x.fillStyle=G(x,0,h*.6,0,h,[[0,'#8fbc52'],[1,'#3f6a2a']]);x.beginPath();x.moveTo(0,h*.8);x.quadraticCurveTo(w*.35,h*.55,w,h*.82);x.lineTo(w,h);x.lineTo(0,h);x.fill();
  const kx=w*.76,ky=h*.2,ks=w*.07,hx=w*.33,hy=h*.58;
  x.strokeStyle='rgba(60,60,60,.7)';x.lineWidth=1;x.beginPath();x.moveTo(hx+w*.03,hy-h*.12);x.quadraticCurveTo(w*.6,h*.42,kx,ky+ks);x.stroke();
  const q=[[kx,ky-ks],[kx+ks*.75,ky],[kx,ky+ks*1.2],[kx-ks*.75,ky]];
  x.fillStyle='#d8432e';x.beginPath();x.moveTo(...q[0]);x.lineTo(...q[1]);x.lineTo(...q[2]);x.closePath();x.fill();
  x.fillStyle='#f2c230';x.beginPath();x.moveTo(...q[0]);x.lineTo(...q[3]);x.lineTo(...q[2]);x.closePath();x.fill();
  x.strokeStyle='#d8432e';x.beginPath();x.moveTo(kx,ky+ks*1.2);x.bezierCurveTo(kx-ks,ky+ks*2,kx+ks,ky+ks*2.6,kx-ks*.3,ky+ks*3.4);x.stroke();
  x.fillStyle='#2c3a28';figure(x,hx,h*.64,h*.2,null,[hx+w*.035,hy-h*.12])},
cake(S,x,w,h){
  x.fillStyle=RG(x,w*.5,h*.55,0,w*.8,[[0,'#6a3a22'],[1,'#140906']]);x.fillRect(0,0,w,h);
  for(let i=0;i<14;i++){x.fillStyle=`rgba(255,${S.RI(170,220)},120,${S.R(.08,.22)})`;disc(x,S.R(0,w),S.R(0,h*.5),S.R(w*.03,w*.08))}
  x.fillStyle='#3a1e12';x.fillRect(0,h*.78,w,h*.22);x.fillStyle='rgba(255,200,140,.12)';x.fillRect(0,h*.78,w,3);
  x.fillStyle='#e8e0d4';ell(x,w*.5,h*.8,w*.34,h*.04);
  const tier=(cy,tw,th)=>{x.fillStyle=G(x,w*.5-tw/2,0,w*.5+tw/2,0,[[0,'#d8b894'],[.4,'#fbe9d2'],[1,'#c4a07c']]);x.fillRect(w*.5-tw/2,cy-th,tw,th);ell(x,w*.5,cy,tw/2,h*.025);
    x.fillStyle='#fdf3e6';ell(x,w*.5,cy-th,tw/2,h*.025);x.fillStyle='#e48aa0';x.fillRect(w*.5-tw/2,cy-th,tw,th*.16);for(let i=0;i<8;i++)ell(x,w*.5-tw/2+(i+.5)*tw/8,cy-th*.84,tw/26,th*.1)};
  tier(h*.78,w*.5,h*.17);tier(h*.6,w*.32,h*.13);
  for(let i=0;i<5;i++){const cx=w*.5+(i-2)*w*.055,cy=h*.47;x.fillStyle='#f2f2f8';x.fillRect(cx-2.5,cy-h*.07,5,h*.07);x.fillStyle='#e48aa0';for(let k=0;k<3;k++)x.fillRect(cx-2.5,cy-h*.06+k*h*.022,5,h*.007);
    x.save();x.globalCompositeOperation='lighter';x.fillStyle=RG(x,cx,cy-h*.09,0,w*.09,[[0,'rgba(255,200,110,.7)'],[1,'rgba(255,160,60,0)']]);x.fillRect(cx-w*.1,cy-h*.2,w*.2,h*.2);x.restore();
    x.fillStyle='#ffd270';x.beginPath();x.moveTo(cx,cy-h*.115);x.quadraticCurveTo(cx+5,cy-h*.085,cx,cy-h*.072);x.quadraticCurveTo(cx-5,cy-h*.085,cx,cy-h*.115);x.fill()}},
house(S,x,w,h){
  x.fillStyle=G(x,0,0,0,h*.7,[[0,'#94b8cc'],[1,'#f2e2c4']]);x.fillRect(0,0,w,h);
  x.fillStyle=G(x,0,h*.68,0,h,[[0,'#a0904a'],[1,'#5c4a26']]);x.fillRect(0,h*.68,w,h*.32);
  const bx=w*.18,by=h*.44,bw=w*.42,bh=h*.28;
  x.fillStyle='#ead9bc';x.fillRect(bx,by,bw,bh);x.fillStyle='rgba(120,80,40,.18)';x.fillRect(bx+bw*.7,by,bw*.3,bh);
  x.fillStyle='#7a5a44';x.fillRect(bx+bw*.68,by-h*.18,bw*.1,h*.14);
  x.fillStyle='#9a3b2a';x.beginPath();x.moveTo(bx-w*.03,by+2);x.lineTo(bx+bw/2,by-h*.2);x.lineTo(bx+bw+w*.03,by+2);x.fill();
  x.fillStyle='#ffd47a';[[.12,.2],[.62,.2]].forEach(([u,v])=>{x.fillRect(bx+bw*u,by+bh*v,bw*.22,bh*.32)});x.fillStyle='#5a3020';x.fillRect(bx+bw*.42,by+bh*.4,bw*.15,bh*.6);
  x.strokeStyle='#ead9bc';x.lineWidth=2;[[.12,.2],[.62,.2]].forEach(([u,v])=>{x.beginPath();x.moveTo(bx+bw*(u+.11),by+bh*v);x.lineTo(bx+bw*(u+.11),by+bh*(v+.32));x.stroke()});
  x.fillStyle='#4a2c18';x.fillRect(w*.77,h*.42,w*.035,h*.34);canopy(S,x,w*.79,h*.33,w*.2,['#d9772a','#e8a23a','#b5521f','#c9622a'],16);
  x.fillStyle='#e0902e';for(let i=0;i<40;i++)disc(x,S.R(w*.55,w),S.R(h*.74,h*.85),1.6);
  x.strokeStyle='#f2ead8';x.lineWidth=2;x.beginPath();x.moveTo(0,h*.83);x.lineTo(w,h*.83);x.stroke();for(let i=0;i<w;i+=w/18){x.beginPath();x.moveTo(i,h*.78);x.lineTo(i,h*.88);x.stroke()}},
family(S,x,w,h){
  x.fillStyle=G(x,0,0,0,h,[[0,'#f6c27e'],[.55,'#f0a35c'],[1,'#c2603e']]);x.fillRect(0,0,w,h);
  x.fillStyle=RG(x,w*.3,h*.66,0,w*.55,[[0,'rgba(255,248,215,1)'],[.12,'rgba(255,236,190,.8)'],[1,'rgba(255,200,140,0)']]);x.fillRect(0,0,w,h);
  x.fillStyle='#3c2420';x.beginPath();x.moveTo(0,h*.82);x.quadraticCurveTo(w*.5,h*.77,w,h*.83);x.lineTo(w,h);x.lineTo(0,h);x.fill();
  x.strokeStyle='#3c2420';x.lineWidth=1.5;for(let i=0;i<90;i++){const gx=S.R(0,w),gy=h*.8+S.R(0,.04)*h;x.beginPath();x.moveTo(gx,gy+6);x.lineTo(gx+S.R(-4,4),gy-S.R(4,12));x.stroke()}
  x.fillStyle='#3c2420';x.beginPath();x.moveTo(w*.8,h*.82);x.lineTo(w*.83,h*.4);x.lineTo(w*.86,h*.82);x.fill();
  x.lineWidth=w*.012;x.strokeStyle='#3c2420';[[-1,.5],[1,.45],[-.5,.38]].forEach(([d,v])=>{x.beginPath();x.moveTo(w*.83,h*v);x.lineTo(w*.83+d*w*.14,h*(v-.12));x.stroke()});
  canopy(S,x,w*.84,h*.25,w*.24,['#3c2420','#462a24'],22);
  x.fillStyle='#2e1c1a';group(x,h*.86,[[w*.2,h*.36],[w*.3,h*.22],[w*.4,h*.33],[w*.5,h*.19]])},
campfire(S,x,w,h){
  x.fillStyle=G(x,0,0,0,h,[[0,'#0c1636'],[.7,'#2a3f6e'],[1,'#3a3050']]);x.fillRect(0,0,w,h);
  for(let i=0;i<70;i++){x.fillStyle=`rgba(255,250,230,${S.R(.3,.9)})`;disc(x,S.R(0,w),S.R(0,h*.6),S.R(.5,1.4))}
  x.fillStyle='#0a1020';for(let i=0;i<11;i++){const px=i/10*w+S.R(-10,10),ph=h*S.R(.18,.32),pw=w*.05;x.beginPath();x.moveTo(px-pw,h*.74);x.lineTo(px,h*.74-ph);x.lineTo(px+pw,h*.74);x.fill()}
  x.fillStyle='#141828';x.fillRect(0,h*.72,w,h*.28);
  const fx=w*.66,fy=h*.86;
  x.save();x.globalCompositeOperation='lighter';x.fillStyle=RG(x,fx,fy,0,w*.45,[[0,'rgba(255,170,80,.7)'],[1,'rgba(255,120,40,0)']]);x.fillRect(0,0,w,h);x.restore();
  const tx=w*.3,ty=h*.84;x.fillStyle=G(x,tx-w*.2,0,tx+w*.2,0,[[0,'#7a3a1e'],[1,'#e89a4a']]);x.beginPath();x.moveTo(tx-w*.19,ty);x.lineTo(tx,ty-h*.28);x.lineTo(tx+w*.19,ty);x.fill();
  x.fillStyle='#2a140c';x.beginPath();x.moveTo(tx-w*.04,ty);x.lineTo(tx,ty-h*.16);x.lineTo(tx+w*.04,ty);x.fill();
  x.fillStyle='#3a2414';x.fillRect(fx-w*.06,fy,w*.12,h*.02);
  [['#ff8a2a',.08,.16],['#ffc04a',.055,.12],['#fff0b0',.025,.06]].forEach(([c,fw,fh])=>{x.fillStyle=c;x.beginPath();x.moveTo(fx-w*fw,fy+2);x.quadraticCurveTo(fx-w*fw*.6,fy-h*fh*.6,fx,fy-h*fh);x.quadraticCurveTo(fx+w*fw*.6,fy-h*fh*.6,fx+w*fw,fy+2);x.fill()});
  x.fillStyle='#ffd080';for(let i=0;i<12;i++)disc(x,fx+S.R(-w*.06,w*.06),fy-S.R(h*.18,h*.4),1.2)},
sunflowers(S,x,w,h){
  x.fillStyle=G(x,0,0,0,h*.6,[[0,'#7fb6e2'],[1,'#f6ecc8']]);x.fillRect(0,0,w,h);
  x.fillStyle='#9eb468';x.beginPath();x.moveTo(0,h*.55);x.quadraticCurveTo(w*.6,h*.46,w,h*.56);x.lineTo(w,h);x.lineTo(0,h);x.fill();
  x.fillStyle='#4f7a2c';x.fillRect(0,h*.58,w,h*.42);
  const fl=[];for(let i=0;i<70;i++){const y=S.R(.56,1.05)*h;fl.push([S.R(-.05,1.05)*w,y])}fl.sort((a,b)=>a[1]-b[1]);
  for(const [fx,fy] of fl){const r=(fy/h-.5)*w*.12+2;x.strokeStyle='#3e6a24';x.lineWidth=Math.max(1,r*.18);x.beginPath();x.moveTo(fx,fy);x.lineTo(fx,fy+r*4);x.stroke();
    x.fillStyle='#f2b520';for(let k=0;k<12;k++){const a=k/12*TAU;ell(x,fx+Math.cos(a)*r*.75,fy+Math.sin(a)*r*.75*.8,r*.45,r*.45)}x.fillStyle='#5a3412';ell(x,fx,fy,r*.55,r*.48)}},
sea(S,x,w,h){
  x.fillStyle=G(x,0,0,0,h*.6,[[0,'#a8c8da'],[1,'#f6e6c8']]);x.fillRect(0,0,w,h);
  x.fillStyle=G(x,0,h*.58,0,h,[[0,'#6e9cb0'],[1,'#2a4a62']]);x.fillRect(0,h*.58,w,h*.42);
  x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=1.5;for(let i=0;i<22;i++){const y=S.R(h*.62,h),l=S.R(8,30),px=S.R(0,w);x.beginPath();x.moveTo(px,y);x.lineTo(px+l,y);x.stroke()}
  x.fillStyle='#4a3e3a';x.beginPath();x.moveTo(0,h*.66);x.quadraticCurveTo(w*.12,h*.56,w*.28,h*.66);x.lineTo(0,h*.7);x.fill();
  x.fillStyle='#f2ede4';x.fillRect(w*.12,h*.36,w*.05,h*.24);x.fillStyle='#c0392b';x.fillRect(w*.12,h*.42,w*.05,h*.04);x.fillRect(w*.12,h*.52,w*.05,h*.04);x.fillStyle='#ffe8a0';x.fillRect(w*.125,h*.33,w*.04,h*.035);
  const bx=w*.6,by=h*.7;x.fillStyle='#3a2a24';x.beginPath();x.moveTo(bx-w*.12,by);x.lineTo(bx+w*.12,by);x.lineTo(bx+w*.08,by+h*.05);x.lineTo(bx-w*.08,by+h*.05);x.fill();
  x.fillStyle='#fbf6ec';x.beginPath();x.moveTo(bx,by-h*.4);x.lineTo(bx,by-h*.02);x.lineTo(bx+w*.12,by-h*.02);x.fill();x.fillStyle='#ece2d0';x.beginPath();x.moveTo(bx-2,by-h*.34);x.lineTo(bx-2,by-h*.02);x.lineTo(bx-w*.1,by-h*.02);x.fill();
  x.strokeStyle='#3a3a40';x.lineWidth=1.4;for(let i=0;i<3;i++){const gx=S.R(w*.3,w*.9),gy=S.R(h*.1,h*.3),s=S.R(5,9);x.beginPath();x.moveTo(gx-s,gy);x.quadraticCurveTo(gx-s/2,gy-s/2,gx,gy);x.quadraticCurveTo(gx+s/2,gy-s/2,gx+s,gy);x.stroke()}},
winter(S,x,w,h){
  x.fillStyle=G(x,0,0,0,h*.7,[[0,'#16244a'],[1,'#5a6e96']]);x.fillRect(0,0,w,h);
  x.fillStyle='#dfe8f2';x.beginPath();x.moveTo(0,h*.66);x.quadraticCurveTo(w*.5,h*.58,w,h*.7);x.lineTo(w,h);x.lineTo(0,h);x.fill();
  for(let i=0;i<6;i++){const px=S.R(0,w),py=h*S.R(.62,.7),s=h*S.R(.12,.22);x.fillStyle='#16283a';x.beginPath();x.moveTo(px-s*.4,py);x.lineTo(px,py-s);x.lineTo(px+s*.4,py);x.fill();x.fillStyle='#e8eef6';x.beginPath();x.moveTo(px-s*.15,py-s*.62);x.lineTo(px,py-s);x.lineTo(px+s*.15,py-s*.62);x.fill()}
  const bx=w*.5,by=h*.68;x.fillStyle='#3a2a30';x.fillRect(bx,by-h*.16,w*.22,h*.16);x.fillStyle='#f0f4fa';x.beginPath();x.moveTo(bx-w*.02,by-h*.15);x.lineTo(bx+w*.11,by-h*.28);x.lineTo(bx+w*.24,by-h*.15);x.fill();
  x.fillStyle='#ffc860';x.fillRect(bx+w*.03,by-h*.12,w*.06,h*.06);x.fillRect(bx+w*.13,by-h*.12,w*.06,h*.06);
  x.save();x.globalCompositeOperation='lighter';x.fillStyle=RG(x,bx+w*.11,by-h*.09,0,w*.2,[[0,'rgba(255,190,90,.45)'],[1,'rgba(255,160,60,0)']]);x.fillRect(0,0,w,h);x.restore();
  x.fillStyle='#f6f8fc';disc(x,w*.25,h*.82,h*.07);disc(x,w*.25,h*.72,h*.05);disc(x,w*.25,h*.645,h*.035);x.fillStyle='#d9542a';x.fillRect(w*.25,h*.64,w*.03,h*.012);
  x.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<60;i++)disc(x,S.R(0,w),S.R(0,h),S.R(.6,1.8))}
};
const KINDS=Object.keys(PAINT);
function paint(S,kind,w,h,sep=0){return mk(w,h,x=>{
  PAINT[kind](S,x,w,h);
  if(sep>0){x.globalCompositeOperation='color';x.globalAlpha=sep;x.fillStyle='#a8805a';x.fillRect(0,0,w,h)}
  x.globalAlpha=1;x.globalCompositeOperation='soft-light';x.fillStyle='rgba(255,186,120,.5)';x.fillRect(0,0,w,h);
  x.globalCompositeOperation='source-over';x.fillStyle='rgba(250,232,200,.09)';x.fillRect(0,0,w,h);
  x.fillStyle=RG(x,w/2,h/2,Math.min(w,h)*.3,Math.max(w,h)*.75,[[0,'rgba(40,20,10,0)'],[1,'rgba(40,20,10,.5)']]);x.fillRect(0,0,w,h);
  for(let i=0;i<w*h/50;i++){x.fillStyle=S.rnd()<.5?`rgba(255,240,210,${S.R(.03,.1)})`:`rgba(30,15,0,${S.R(.03,.1)})`;x.fillRect(S.R(0,w),S.R(0,h),1.5,1.5)}})}

/* =====================================================================
   1 — Golden Afternoon: a sunlit room full of framed memories
   ===================================================================== */
function hull(P){P=P.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);const lo=[],up=[];
  for(const p of P){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p)}
  for(let i=P.length-1;i>=0;i--){const p=P[i];while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0)up.pop();up.push(p)}
  return lo.slice(0,-1).concat(up.slice(0,-1))}
function poly(x,P){x.beginPath();x.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)x.lineTo(P[i][0],P[i][1]);x.closePath()}
function frameOn(S,x,rx,ry,rw,rh,kind,style,oval,sep){
  const b=Math.max(12,Math.min(24,rw*.08)),shape=(ix,iy,iw,ih)=>{x.beginPath();oval?x.ellipse(ix+iw/2,iy+ih/2,iw/2,ih/2,0,0,TAU):x.rect(ix,iy,iw,ih)};
  x.save();x.filter='blur(12px)';x.fillStyle='rgba(30,12,0,.5)';shape(rx+18,ry+16,rw,rh);x.fill();x.restore();
  const st=style==='gold'?[[0,'#f6d898'],[.3,'#a8772e'],[.55,'#ecc674'],[1,'#6e4818']]:style==='wood'?[[0,'#7a4a2a'],[.5,'#3e2212'],[1,'#5a341c']]:[[0,'#3a2c22'],[1,'#120c08']];
  x.fillStyle=G(x,rx,ry,rx+rw,ry+rh,st);shape(rx,ry,rw,rh);x.fill();
  x.strokeStyle='rgba(255,235,190,.35)';x.lineWidth=2;shape(rx+3,ry+3,rw-6,rh-6);x.stroke();
  let m=0;if(style!=='gold'){m=b*.9;x.fillStyle='#efe6d2';shape(rx+b,ry+b,rw-2*b,rh-2*b);x.fill()}
  const ix=rx+b+m,iy=ry+b+m,iw=rw-2*(b+m),ih=rh-2*(b+m);
  x.save();shape(ix,iy,iw,ih);x.clip();x.drawImage(paint(S,kind,iw,ih,sep),ix,iy);
  x.strokeStyle='rgba(0,0,0,.45)';x.lineWidth=5;shape(ix,iy,iw,ih);x.stroke();
  x.fillStyle=G(x,ix,iy,ix+iw,iy+ih,[[0,'rgba(255,255,255,0)'],[.35,'rgba(255,255,255,.1)'],[.45,'rgba(255,255,255,0)']]);x.fillRect(ix,iy,iw,ih);x.restore()}

const WIN={x:150,y:120,w:540,h:580};
const PANES=[[150,120,263,187],[427,120,263,187],[150,319,263,181],[427,319,263,181],[150,512,263,188],[427,512,263,188]];
const proj=(x,y)=>[330+(x-150)*1.25+(y-120)*.42,1085-(y-120)*.36];

BIS.scene('g6-1',{title:'Golden Afternoon',blurb:'A sunlit room with framed family memories on the wall, sheer curtains stirring and dust glowing in the beams of light.',
setup(S){
  const st=S.state;st.grain=initGrain(S);st.vig=vignetteCanvas(.62,420);st.mote=glowSprite('255,230,180',64,.25);st.lamp=glowSprite('255,190,110',256);
  st.room=mk(W,H,x=>{
    x.fillStyle=G(x,0,0,0,820,[[0,'#6a4529'],[.35,'#a27648'],[1,'#b0845a']]);x.fillRect(0,0,W,820);
    for(let i=0;i<W;i+=64){x.fillStyle='rgba(70,35,10,.07)';x.fillRect(i,0,24,640)}
    x.fillStyle='rgba(255,232,190,.08)';for(let i=32;i<W;i+=64)for(let j=40;j<640;j+=80){x.beginPath();x.moveTo(i+12,j-9);x.lineTo(i+18,j);x.lineTo(i+12,j+9);x.lineTo(i+6,j);x.fill()}
    x.fillStyle=RG(x,420,430,0,1350,[[0,'rgba(255,214,150,.4)'],[1,'rgba(255,214,150,0)']]);x.fillRect(0,0,W,820);
    x.fillStyle=G(x,1200,0,1920,0,[[0,'rgba(30,12,0,0)'],[1,'rgba(30,12,0,.35)']]);x.fillRect(1200,0,720,820);
    x.fillStyle=G(x,0,0,0,200,[[0,'rgba(30,12,0,.45)'],[1,'rgba(30,12,0,0)']]);x.fillRect(0,0,W,200);
    /* wainscot */
    x.fillStyle='#4e2e1a';x.fillRect(0,650,W,170);
    for(let px=10;px<W;px+=240){x.lineWidth=3;x.strokeStyle='rgba(0,0,0,.35)';x.strokeRect(px+17,676,212,118);x.strokeStyle='rgba(255,210,160,.13)';x.strokeRect(px+14,673,212,118)}
    x.fillStyle='#6a4026';x.fillRect(0,636,W,18);x.fillStyle='rgba(255,220,170,.28)';x.fillRect(0,636,W,3);x.fillStyle='rgba(0,0,0,.3)';x.fillRect(0,654,W,6);
    x.fillStyle='#2a170c';x.fillRect(0,800,W,22);
    /* floor */
    x.fillStyle=G(x,0,820,0,H,[[0,'#5a3820'],[1,'#2a180c']]);x.fillRect(0,820,W,260);
    x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=2;for(let k=-34;k<=34;k++){x.beginPath();x.moveTo(960+k*64,822);x.lineTo(960+k*64*3.4,H);x.stroke()}
    for(let i=0;i<120;i++){const k=S.RI(-30,30),y=S.R(835,1075),t=(y-822)/(H-822),xa=960+k*64*(1+2.4*t),xb=960+(k+1)*64*(1+2.4*t);x.beginPath();x.moveTo(xa,y);x.lineTo(xb,y);x.stroke()}
    /* rug */
    const rug=[[640,880],[1280,880],[1540,1090],[380,1090]];poly(x,rug);x.fillStyle='#6a2620';x.fill();
    const ins=(P,d)=>[[P[0][0]+d,P[0][1]+d*.5],[P[1][0]-d,P[1][1]+d*.5],[P[2][0]-d*1.6,P[2][1]],[P[3][0]+d*1.6,P[3][1]]];
    poly(x,ins(rug,22));x.strokeStyle='#c8955a';x.lineWidth=5;x.stroke();poly(x,ins(rug,40));x.strokeStyle='rgba(200,150,90,.5)';x.lineWidth=2;x.stroke();
    x.fillStyle='#a8452e';x.beginPath();x.moveTo(960,925);x.lineTo(1160,990);x.lineTo(960,1060);x.lineTo(760,990);x.closePath();x.fill();x.strokeStyle='#d8a462';x.lineWidth=3;x.stroke();
    x.fillStyle='#2c3e5a';x.beginPath();x.moveTo(960,955);x.lineTo(1060,990);x.lineTo(960,1028);x.lineTo(860,990);x.closePath();x.fill();
    x.strokeStyle='rgba(230,200,150,.6)';x.lineWidth=1.5;for(let i=640;i<=1280;i+=8){x.beginPath();x.moveTo(i,880);x.lineTo(i,872);x.stroke()}
    /* window view */
    const view=mk(WIN.w,WIN.h,v=>{v.fillStyle=G(v,0,0,0,WIN.h,[[0,'#f0cf92'],[.55,'#fff0cc'],[1,'#e2c084']]);v.fillRect(0,0,WIN.w,WIN.h);
      v.fillStyle=RG(v,130,330,0,420,[[0,'rgba(255,255,240,1)'],[1,'rgba(255,240,200,0)']]);v.fillRect(0,0,WIN.w,WIN.h);
      v.filter='blur(6px)';v.fillStyle='rgba(150,150,80,.7)';for(let i=0;i<14;i++)disc(v,S.R(0,WIN.w),S.R(380,460),S.R(30,70));
      v.fillStyle='rgba(92,104,50,.9)';for(let i=0;i<10;i++)disc(v,S.R(-40,WIN.w+40),S.R(470,580),S.R(50,100));
      v.fillStyle='rgba(96,100,48,.75)';for(let i=0;i<8;i++)disc(v,S.R(330,600),S.R(0,250),S.R(40,90));v.filter='none'});
    x.fillStyle='#e8dbc0';x.fillRect(128,98,584,624);x.fillStyle='rgba(0,0,0,.2)';x.fillRect(128,98,584,6);
    x.drawImage(view,WIN.x,WIN.y);
    x.fillStyle='#ece0c6';x.fillRect(413,120,14,580);x.fillRect(150,307,540,12);x.fillRect(150,500,540,12);
    x.fillStyle='rgba(90,60,30,.35)';x.fillRect(150,120,540,5);x.fillRect(150,120,5,580);
    x.fillStyle='#f2e8d4';x.fillRect(100,716,640,24);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(100,740,640,12);
    x.fillStyle='#8a4a2a';x.beginPath();x.moveTo(605,716);x.lineTo(655,716);x.lineTo(648,676);x.lineTo(612,676);x.fill();
    x.fillStyle='#4f6a34';for(let i=0;i<9;i++)ell(x,630+S.R(-30,30),660-S.R(0,50),S.R(10,18),S.R(6,10));
    x.strokeStyle='#7a5a30';x.lineWidth=9;x.beginPath();x.moveTo(60,92);x.lineTo(780,92);x.stroke();x.fillStyle='#b08a4a';disc(x,56,92,13);disc(x,784,92,13);
    /* gallery wall */
    frameOn(S,x,830,120,240,310,'family','gold',false,0);
    frameOn(S,x,1110,130,330,230,'mountains','wood',false,.25);
    frameOn(S,x,1470,110,200,262,'sea','gold',true,.45);
    frameOn(S,x,1110,392,200,168,'house','black',false,.3);
    frameOn(S,x,1340,404,170,170,'kite','wood',false,.15);
    frameOn(S,x,850,462,200,150,'sunflowers','black',false,.2);
    /* sideboard */
    x.save();x.filter='blur(10px)';x.fillStyle='rgba(20,8,0,.5)';x.fillRect(1010,680,690,140);x.restore();
    x.fillStyle='#2a170c';[1015,1660].forEach(lx=>x.fillRect(lx,780,18,42));
    x.fillStyle=G(x,1000,0,1680,0,[[0,'#5a361e'],[.5,'#3e2414'],[1,'#2e1a0e']]);x.fillRect(1000,674,680,110);
    for(let i=0;i<3;i++){const dx=1012+i*224;x.strokeStyle='rgba(255,210,160,.15)';x.lineWidth=2;x.strokeRect(dx,686,208,86);x.fillStyle='#c8a050';disc(x,dx+104,712,5)}
    x.fillStyle='#6a4024';x.fillRect(990,660,700,14);x.fillStyle='rgba(255,220,170,.35)';x.fillRect(990,660,700,2);
    /* vase + flowers */
    x.strokeStyle='#4a6a34';x.lineWidth=2.5;const blooms=[];for(let i=0;i<9;i++){const tx=1070+S.R(-50,50),ty=S.R(560,610);x.beginPath();x.moveTo(1070,622);x.quadraticCurveTo(1070,(ty+620)/2,tx,ty);x.stroke();blooms.push([tx,ty])}
    blooms.forEach(([bx,by],i)=>{x.fillStyle=['#e89a9a','#f4d070','#fff0e0','#d86a6a'][i%4];for(let k=0;k<5;k++){const a=k/5*TAU;disc(x,bx+Math.cos(a)*6,by+Math.sin(a)*6,6)}x.fillStyle='#8a5a2a';disc(x,bx,by,3.5)});
    x.fillStyle=G(x,1046,0,1094,0,[[0,'#1f4a4c'],[.4,'#4a8a88'],[1,'#173638']]);ell(x,1070,636,26,26);x.fillRect(1058,604,24,20);
    /* books + small framed photo */
    [['#7a2a22',1230,22],['#2e4a5e',1236,18],['#b08a4a',1226,16],['#4a5a34',1240,14]].reduce((y,[c,bx,hh])=>{x.fillStyle=c;x.fillRect(bx,y-hh,110,hh);x.fillStyle='rgba(255,240,210,.25)';x.fillRect(bx,y-hh,110,2);return y-hh},660);
    x.fillStyle='#3a2414';x.fillRect(1396,566,104,94);x.drawImage(paint(S,'cake',84,74,.2),1406,576);
    /* lamp */
    x.fillStyle='#b8904a';ell(x,1590,656,34,8);x.fillRect(1586,596,8,60);
    x.fillStyle=G(x,1510,0,1670,0,[[0,'#e8c48a'],[.5,'#fbe8c4'],[1,'#d8a868']]);x.beginPath();x.moveTo(1545,520);x.lineTo(1635,520);x.lineTo(1668,600);x.lineTo(1512,600);x.closePath();x.fill();
    x.fillStyle='rgba(255,250,230,.6)';x.fillRect(1512,596,156,4);
    /* clock */
    x.save();x.filter='blur(10px)';x.fillStyle='rgba(20,8,0,.5)';x.fillRect(1735,230,140,600);x.restore();
    x.fillStyle=G(x,1716,0,1866,0,[[0,'#6a3e20'],[.4,'#4a2a14'],[1,'#2a160a']]);
    x.beginPath();x.moveTo(1716,420);x.lineTo(1716,250);x.quadraticCurveTo(1791,190,1866,250);x.lineTo(1866,420);x.closePath();x.fill();
    x.fillRect(1734,420,114,345);x.fillRect(1722,760,138,60);
    x.fillStyle='#f2e6c8';disc(x,1791,320,50);x.strokeStyle='#c89a4a';x.lineWidth=4;x.beginPath();x.arc(1791,320,52,0,TAU);x.stroke();
    x.strokeStyle='#3a2a1a';for(let i=0;i<12;i++){const a=i/12*TAU;x.lineWidth=i%3?2:4;x.beginPath();x.moveTo(1791+Math.cos(a)*40,320+Math.sin(a)*40);x.lineTo(1791+Math.cos(a)*47,320+Math.sin(a)*47);x.stroke()}
    x.lineWidth=4;x.beginPath();x.moveTo(1791,320);x.lineTo(1791+20,320-14);x.moveTo(1791,320);x.lineTo(1791-6,320-34);x.stroke();
    x.fillStyle='#160c06';x.fillRect(1756,460,70,280);x.strokeStyle='#c89a4a';x.lineWidth=3;x.strokeRect(1756,460,70,280);
  });
  st.glass=mk(70,280,x=>{x.fillStyle=G(x,0,0,70,280,[[0,'rgba(255,255,255,0)'],[.3,'rgba(255,240,210,.14)'],[.4,'rgba(255,255,255,0)'],[.6,'rgba(255,240,210,.06)'],[.7,'rgba(255,255,255,0)']]);x.fillRect(0,0,70,280)});
  /* sun shafts through the panes, plus their patch on the floor */
  const beam=mk(W,H,x=>{x.filter='blur(9px)';
    for(const [px,py,pw,ph] of PANES){const c=[[px,py],[px+pw,py],[px+pw,py+ph],[px,py+ph]],f=c.map(p=>proj(...p));
      poly(x,hull(c.concat(f)));x.fillStyle=G(x,px,py,f[2][0],f[2][1],[[0,'rgba(255,222,160,.30)'],[1,'rgba(255,214,150,.10)']]);x.fill();
      poly(x,f);x.fillStyle='rgba(255,226,170,.42)';x.fill()}
    x.filter='blur(30px)';x.globalCompositeOperation='destination-out';x.fillStyle='rgba(0,0,0,.8)';x.fillRect(150,120,540,580)});
  st.beam=beam;
  const gw=96,gh=54,sm=mk(gw,gh,x=>x.drawImage(beam,0,0,gw,gh)),d=sm.getContext('2d').getImageData(0,0,gw,gh).data;
  st.bgrid=new Float32Array(gw*gh);for(let i=0;i<gw*gh;i++)st.bgrid[i]=d[i*4+3]/255;
  /* sheer curtains */
  st.curt=mk(210,730,x=>{for(let i=0;i<210;i++){const b=.5+.5*Math.sin(i/210*TAU*4.5+Math.sin(i*.07)*1.4);const e=Math.min(1,i/30,(210-i)/30);x.fillStyle=`rgba(255,244,222,${(.1+.22*b)*(.4+.6*e)})`;x.fillRect(i,0,1,730)}
    x.fillStyle='rgba(255,248,235,.22)';x.fillRect(6,714,198,14);x.fillStyle='rgba(120,90,60,.25)';x.fillRect(0,0,210,10)});
  st.motes=[];for(let i=0;i<170;i++)st.motes.push({x:S.R(150,1650),y:S.R(0,1080),sec:S.pick([105,210,70]),sw:S.R(12,40),ss:S.R(18,40),off:S.R(0,1),r:S.R(3,9)});
},
draw(S){
  const c=S.ctx,st=S.state;
  c.drawImage(st.room,0,0);
  /* pendulum: one swing each way per ~2 s */
  const a=.2*S.osc(2);c.save();c.beginPath();c.rect(1756,460,70,280);c.clip();c.translate(1791,462);c.rotate(a);
  c.fillStyle='#b8904a';c.fillRect(-2,0,4,200);c.fillStyle=RG(c,-5,205,0,24,[[0,'#f6d898'],[1,'#8a6020']]);disc(c,0,210,20);c.restore();
  c.drawImage(st.glass,1756,460);
  /* curtains sway */
  const sw=S.osc(14)*.7+S.osc(6,.3)*.3,sw2=S.osc(14,.18)*.7+S.osc(7,.6)*.3;
  for(let j=0;j<730;j+=10){const k=Math.pow(j/730,1.6);c.drawImage(st.curt,0,j,210,10,70+22*k*sw,96+j,210,10);c.drawImage(st.curt,0,j,210,10,560-24*k*sw2,96+j,210,10)}
  /* light breathes slowly */
  c.globalCompositeOperation='lighter';
  c.globalAlpha=.8+.2*S.osc(35);c.drawImage(st.beam,0,0);
  c.globalAlpha=.25+.1*S.osc(35);c.drawImage(st.lamp,1290,260,600,600);
  c.globalAlpha=.18+.06*S.osc(17,.2);c.drawImage(st.lamp,1440,440,300,220);
  for(const m of st.motes){const y=S.wrap(m.y,m.sec,1080,20,1),x=m.x+m.sw*S.osc(m.ss,m.off);
    const gx=Math.min(95,Math.max(0,x/20|0)),gy=Math.min(53,Math.max(0,y/20|0)),a=.05+1.6*st.bgrid[gy*96+gx];
    c.globalAlpha=Math.min(1,a)*(.6+.4*S.osc(m.ss*.5,m.off));c.drawImage(st.mote,x-m.r,y-m.r,m.r*2,m.r*2)}
  c.globalCompositeOperation='source-over';c.globalAlpha=1;
  c.drawImage(st.vig,0,0);drawGrain(S,st.grain,.28);
}});

/* =====================================================================
   2 — House by the Lake: blue-hour night, warm windows, reflections
   ===================================================================== */
const HK=1.3,HX=1180,HY=655,HT=(x,y)=>[HX+(x-1100)*HK,HY+(y-650)*HK];
const HWIN=[[990,440,60,80],[1150,440,60,80],[985,575,60,62],[1160,575,60,62],[825,540,50,66],[895,540,50,66],[1081,572,40,78]];
function drawHouse(x,lit){
  x.save();x.transform(HK,0,0,HK,HX-1100*HK,HY-650*HK);
  const body='#1a2238',roof='#121828',rim='rgba(150,175,215,.55)';
  x.fillStyle=body;x.fillRect(1190,290,36,110);x.fillStyle=rim;x.fillRect(1222,290,4,110);x.fillStyle=roof;x.fillRect(1186,284,44,10);
  x.fillStyle=body;x.fillRect(800,500,170,150);x.fillRect(960,410,280,240);
  x.fillStyle=roof;x.beginPath();x.moveTo(782,506);x.lineTo(880,420);x.lineTo(975,420);x.lineTo(975,506);x.closePath();x.fill();
  x.beginPath();x.moveTo(935,418);x.lineTo(1100,250);x.lineTo(1265,418);x.closePath();x.fill();
  x.strokeStyle=rim;x.lineWidth=3;x.beginPath();x.moveTo(1100,250);x.lineTo(1265,418);x.moveTo(880,420);x.lineTo(975,420);x.stroke();
  x.strokeStyle='rgba(150,175,215,.25)';x.beginPath();x.moveTo(1100,250);x.lineTo(935,418);x.stroke();
  x.fillStyle='#232c46';x.fillRect(1234,410,6,240);
  for(const [wx,wy,ww,wh] of HWIN){x.fillStyle=lit?G(x,0,wy,0,wy+wh,[[0,'#ffe2a0'],[1,'#f0a050']]):'#3a2e2a';x.fillRect(wx,wy,ww,wh);
    if(lit){x.fillStyle='rgba(160,60,30,.45)';x.fillRect(wx,wy,ww*.22,wh);x.fillRect(wx+ww*.78,wy,ww*.22,wh)}
    x.fillStyle=roof;if(ww>42){x.fillRect(wx+ww/2-2,wy,4,wh);x.fillRect(wx,wy+wh*.45,ww,4)}x.fillRect(wx-5,wy+wh,ww+10,5)}
  x.fillStyle=lit?'#ffe0a0':'#3a2e2a';disc(x,1100,350,22);x.fillStyle=roof;x.fillRect(1098,328,4,44);x.fillRect(1078,348,44,4);
  x.fillStyle=roof;x.fillRect(925,548,330,12);[935,1040,1160,1245].forEach(px=>x.fillRect(px,560,8,90));
  x.fillStyle='rgba(150,175,215,.35)';x.fillRect(925,548,330,2);
  x.fillStyle='#10141f';x.fillRect(1060,650,80,8);x.fillRect(1050,658,100,8);
  x.restore()}
BIS.scene('g6-2',{title:'House by the Lake',blurb:'A family house on a hill at blue hour, its windows glowing warm over a still lake, with fireflies, chimney smoke and slow clouds.',
setup(S){
  const st=S.state;st.grain=initGrain(S);st.vig=vignetteCanvas(.55,450);
  st.gw=glowSprite('255,190,100',256);st.ff=glowSprite('220,255,150',64,.2);st.moonG=glowSprite('200,220,255',256,.15);st.smoke=glowSprite('120,135,165',128,.5);
  st.sky=mk(W,760,x=>{x.fillStyle=G(x,0,0,0,760,[[0,'#08112a'],[.4,'#18305a'],[.72,'#3e6188'],[.9,'#b48a86'],[1,'#e2a878']]);x.fillRect(0,0,W,760);
    for(let i=0;i<260;i++){x.fillStyle=`rgba(230,238,255,${S.R(.1,.6)*(1-i/300)})`;disc(x,S.R(0,W),S.R(0,480)*Math.pow(S.rnd(),.5),S.R(.4,1.3))}
    x.globalCompositeOperation='lighter';x.drawImage(glowSprite('190,210,255',256,.12),1520-330,190-330,660,660);x.globalCompositeOperation='source-over';
    x.fillStyle=RG(x,1505,175,0,66,[[0,'#fffaf0'],[.85,'#eef0f4'],[1,'#d8dde8']]);disc(x,1520,190,62);
    x.fillStyle='rgba(150,160,185,.25)';[[1500,172,12],[1540,205,9],[1512,214,7],[1538,170,6]].forEach(([a,b,r])=>disc(x,a,b,r))});
  st.clouds=[];for(let i=0;i<5;i++){const cw=S.R(420,700),ch=S.R(70,120);
    const P=cw*.3,cv=mk(cw+2*P,ch+2*P,x=>{x.filter='blur(14px)';for(let k=0;k<9;k++){const ex=P+S.R(.1,.9)*cw,ey=P+ch*.55+S.R(-.15,.15)*ch;x.fillStyle='rgba(44,64,100,.85)';ell(x,ex,ey,S.R(.12,.25)*cw,S.R(.25,.45)*ch);x.fillStyle='rgba(150,170,205,.35)';ell(x,ex+8,ey-ch*.18,S.R(.08,.16)*cw,ch*.12)}});
    st.clouds.push({cv,y:S.R(60,380),x0:S.R(0,W),sec:S.pick([210,105]),a:S.R(.55,.85)})}
  const land=mk(W,760,x=>{
    const ridge=(base,amp,n,col,snow)=>{const pts=[[-50,760]];for(let i=0;i<=n;i++)pts.push([i/n*(W+100)-50,base-amp*(i%2?S.R(.6,1):S.R(.1,.35))]);pts.push([W+50,760]);
      poly(x,pts);x.fillStyle=col;x.fill();if(snow){x.save();x.clip();x.fillStyle='rgba(160,180,215,.45)';x.fillRect(0,0,W,base-amp*.62);x.restore()}};
    ridge(600,260,13,'#2e4568',true);x.fillStyle=G(x,0,380,0,700,[[0,'rgba(120,140,175,0)'],[1,'rgba(150,150,170,.45)']]);x.fillRect(0,380,W,320);
    ridge(660,120,17,'#1d2e4a',false);x.fillStyle=G(x,0,560,0,720,[[0,'rgba(120,130,160,0)'],[1,'rgba(150,140,160,.35)']]);x.fillRect(0,560,W,160);
    const hill=S.smooth([[-60,705],[300,690],[700,672],[1000,652],[1300,648],[1600,668],[1800,690],[1990,712],[1990,800],[-60,800]]);
    x.fillStyle='#0f1828';x.fill(hill);x.strokeStyle='rgba(130,155,200,.35)';x.lineWidth=2;x.stroke(hill);
    x.fillStyle='#0f1828';for(let i=0;i<260;i++){const gx=S.R(-20,W+20),gy=665+Math.abs(gx-1150)*.04+S.R(0,30);x.beginPath();x.moveTo(gx-3,gy+8);x.lineTo(gx+S.R(-4,4),gy-S.R(6,16));x.lineTo(gx+3,gy+8);x.fill()}
    x.strokeStyle='#0a101c';x.lineWidth=3;x.beginPath();x.moveTo(1500,668);x.lineTo(1760,686);x.moveTo(1500,680);x.lineTo(1760,698);x.stroke();for(let i=1500;i<=1760;i+=26){x.beginPath();x.moveTo(i,662+(i-1500)*.07);x.lineTo(i,704+(i-1500)*.07);x.stroke()}
    x.fillStyle='#0a101c';x.fillRect(745,560,6,120);x.fillRect(733,552,30,10);
    drawHouse(x,false);
    x.fillStyle=G(x,0,712,0,760,[[0,'#0e1a30'],[1,'#0b1526']]);x.fillRect(0,722,W,40);
  });
  st.land=land;st.lit=mk(W,760,x=>drawHouse(x,true));
  st.wins=HWIN.map((w,i)=>{const [ax,ay]=HT(w[0],w[1]);return {x:ax,y:ay,w:w[2]*HK,h:w[3]*HK,off:S.R(0,1),sec:S.pick([70,105,52.5])}});
  const [ax,ay]=HT(1078,328);st.wins.push({x:ax,y:ay,w:44*HK,h:44*HK,off:.3,sec:105});
  st.tree=mk(1000,900,x=>{x.fillStyle='#0a1020';x.strokeStyle='#0a1020';x.lineCap='round';
    const br=(px,py,a,len,wd,d)=>{const ex=px+Math.cos(a)*len,ey=py+Math.sin(a)*len;x.lineWidth=wd;x.beginPath();x.moveTo(px,py);x.quadraticCurveTo(px+Math.cos(a+.2)*len*.5,py+Math.sin(a+.2)*len*.5,ex,ey);x.stroke();
      if(d>0){br(ex,ey,a-S.R(.3,.6),len*S.R(.65,.8),wd*.65,d-1);br(ex,ey,a+S.R(.3,.6),len*S.R(.65,.8),wd*.65,d-1)}else{for(let k=0;k<7;k++){x.fillStyle=k%3?'#0b1224':'#0e1832';disc(x,ex+S.R(-55,55),ey+S.R(-40,30),S.R(30,58))}}};
    br(480,900,-Math.PI/2-.08,215,46,6);
    x.globalCompositeOperation='source-atop';x.fillStyle=G(x,0,0,700,0,[[0,'rgba(0,0,0,0)'],[.78,'rgba(0,0,0,0)'],[.95,'rgba(110,140,190,.16)']]);x.fillRect(0,0,1000,900)});
  /* lake: reflection of the hill world */
  st.refl=mk(W,440,x=>{x.save();x.translate(0,440);x.scale(1,-1);x.drawImage(land,0,300,W,440,0,0,W,440);x.restore();
    x.fillStyle=G(x,0,0,0,440,[[0,'rgba(8,16,34,.35)'],[1,'rgba(6,12,26,.85)']]);x.fillRect(0,0,W,440)});
  st.reflLit=mk(W,440,x=>{x.filter='blur(3px)';x.save();x.translate(0,440);x.scale(1,-1);x.drawImage(st.lit,0,300,W,440,0,0,W,440);x.restore()});
  st.lake=mk(W,360,x=>{x.fillStyle=G(x,0,0,0,360,[[0,'#1a2c4c'],[1,'#070e1c']]);x.fillRect(0,0,W,360)});
  st.shore=mk(W,240,x=>{x.fillStyle='#04070e';const reeds=(x0,x1,n)=>{for(let i=0;i<n;i++){const rx=S.R(x0,x1),rh=S.R(60,220),lean=S.R(-30,30);x.lineWidth=S.R(2,4);x.strokeStyle='#04070e';x.beginPath();x.moveTo(rx,240);x.quadraticCurveTo(rx+lean*.3,240-rh*.5,rx+lean,240-rh);x.stroke();
      if(S.rnd()<.3){x.fillStyle='#120c0a';ell(x,rx+lean*.95,240-rh*.95,4,13)}}};
    reeds(0,420,70);reeds(1560,1920,60);x.fillStyle=G(x,0,200,0,240,[[0,'rgba(4,7,14,0)'],[1,'#04070e']]);x.fillRect(0,180,W,60);
    x.fillStyle='#04070e';x.beginPath();x.moveTo(0,240);x.quadraticCurveTo(200,190,460,240);x.fill();x.beginPath();x.moveTo(1500,240);x.quadraticCurveTo(1760,180,1920,215);x.lineTo(1920,240);x.fill()});
  st.boat=mk(200,60,x=>{x.fillStyle='#0a0f1a';x.beginPath();x.moveTo(0,10);x.lineTo(200,10);x.quadraticCurveTo(180,48,140,50);x.lineTo(50,50);x.quadraticCurveTo(15,46,0,10);x.fill();x.fillStyle='rgba(150,175,215,.4)';x.fillRect(4,9,192,2)});
  st.dash=[];for(let i=0;i<46;i++)st.dash.push({y:745+i*7+S.R(-2,2),w:S.R(30,110)*(1-i/60),dx:S.R(-25,25),sec:S.R(3,7),off:S.R(0,1)});
  st.ffs=[];for(let i=0;i<64;i++)st.ffs.push({x:S.R(150,1800),y:S.R(560,1020),ax:S.R(20,70),ay:S.R(10,40),s1:S.R(20,40),s2:S.R(15,35),off:S.R(0,1),bs:S.R(3,7),r:S.R(9,20)});
  st.stars=[];for(let i=0;i<70;i++)st.stars.push({x:S.R(0,W),y:S.R(0,420),r:S.R(.9,2),sec:S.R(5,12),off:S.R(0,1)});
},
draw(S){
  const c=S.ctx,st=S.state;
  c.drawImage(st.sky,0,0);
  c.fillStyle='#eef2ff';for(const s of st.stars){c.globalAlpha=.25+.6*S.osc01(s.sec,s.off);disc(c,s.x,s.y,s.r)}c.globalAlpha=1;
  for(const k of st.clouds){const cx=S.wrap(k.x0,k.sec,W,k.cv.width,1);c.globalAlpha=k.a;c.drawImage(k.cv,cx-k.cv.width/2,k.y)}c.globalAlpha=1;
  c.drawImage(st.land,0,0);
  /* windows breathe on, one after another */
  const lv=st.wins.map(w=>.45+.55*S.ease(S.clamp((S.osc(w.sec,w.off)+.6)*1.2)));
  st.wins.forEach((w,i)=>{c.globalAlpha=lv[i];c.drawImage(st.lit,w.x-2,w.y-2,w.w+4,w.h+4,w.x-2,w.y-2,w.w+4,w.h+4)});
  c.globalCompositeOperation='lighter';st.wins.forEach((w,i)=>{c.globalAlpha=.35*lv[i];c.drawImage(st.gw,w.x+w.w/2-w.w*2.2,w.y+w.h/2-w.h*2,w.w*4.4,w.h*4)});
  c.globalAlpha=.5+.08*S.osc(9);c.drawImage(st.gw,748-60,555-60,120,120);c.globalCompositeOperation='source-over';
  /* chimney smoke */
  const [sx,sy]=HT(1208,284);
  for(let i=0;i<9;i++){const t=S.saw(30,i/9),r=20+t*90;c.globalAlpha=.2*Math.sin(Math.PI*t);c.drawImage(st.smoke,sx+t*260+14*S.osc(10,i/9)-r,sy-t*170-r,r*2,r*2)}c.globalAlpha=1;
  /* tree sway */
  c.save();c.translate(260,760);c.rotate(.012*S.osc(12)+.005*S.osc(5,.3));c.drawImage(st.tree,-480,-900);c.restore();
  /* lake */
  c.drawImage(st.lake,0,720);
  for(let j=0;j<360;j+=4){const dx=4*Math.sin(TAU*(j*.03+S.saw(6)))*(.4+j/360);c.globalAlpha=.85;c.drawImage(st.refl,0,j,W,4,dx,720+j,W,4)}
  c.globalCompositeOperation='lighter';
  for(let j=0;j<360;j+=4){const dx=5*Math.sin(TAU*(j*.035+S.saw(6,.2)))*(.5+j/360);c.globalAlpha=.4*(1-j/420);c.drawImage(st.reflLit,0,j,W,4,dx,720+j,W,4)}
  st.wins.forEach((w,i)=>{c.globalAlpha=.16*lv[i];c.drawImage(st.gw,w.x+w.w/2-60,1440-(w.y+w.h)-40,120,(w.y+w.h)>0?260:0)});
  for(const d of st.dash){c.globalAlpha=.12+.35*S.osc01(d.sec,d.off);c.fillStyle='#dfe6ff';c.fillRect(1520-d.w/2+d.dx+8*S.osc(d.sec*1.3,d.off),d.y,d.w,2)}
  c.globalCompositeOperation='source-over';c.globalAlpha=1;
  c.drawImage(st.boat,1420,780+3*S.osc(7));
  c.drawImage(st.shore,0,840);
  c.globalCompositeOperation='lighter';
  for(const f of st.ffs){const a=Math.pow(S.osc01(f.bs,f.off),3);if(a<.03)continue;const x=f.x+f.ax*S.osc(f.s1,f.off),y=f.y+f.ay*S.osc(f.s2,f.off+.3);c.globalAlpha=a*.9;c.drawImage(st.ff,x-f.r,y-f.r,f.r*2,f.r*2)}
  c.globalCompositeOperation='source-over';c.globalAlpha=1;
  c.drawImage(st.vig,0,0);drawGrain(S,st.grain,.22);
}});

/* =====================================================================
   3 — Memory Line: photographs on strings of lights at a rose sunset
   ===================================================================== */
function card(S,kind,sep,blur,dim){
  const pic=paint(S,kind,260,260,sep),base=mk(300,360,x=>{x.fillStyle=G(x,0,0,300,360,[[0,'#fbf5ea'],[1,'#e6dac4']]);x.fillRect(0,0,300,360);
    for(let i=0;i<500;i++){x.fillStyle=`rgba(120,90,60,${S.R(.02,.07)})`;x.fillRect(S.R(0,300),S.R(0,360),1.5,1.5)}
    x.drawImage(pic,20,20);x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=2;x.strokeRect(20,20,260,260);
    x.fillStyle=G(x,0,0,0,360,[[0,'rgba(80,40,90,.12)'],[1,'rgba(255,160,110,.22)']]);x.fillRect(0,0,300,360)});
  if(!blur&&!dim)return base;
  return mk(312,372,x=>{x.filter=`blur(${blur}px) brightness(${1-dim})`;x.drawImage(base,6,6)})}
const strPt=(s,u,sag)=>{const mx=(s.x0+s.x1)/2,my=(s.y0+s.y1)/2+2*sag,v=1-u;return [v*v*s.x0+2*u*v*mx+u*u*s.x1,v*v*s.y0+2*u*v*my+u*u*s.y1]};
BIS.scene('g6-3',{title:'Memory Line',blurb:'Old photographs hang on strings of fairy lights against a rose-gold sunset, while paper lanterns rise over the hills.',
setup(S){
  const st=S.state;st.grain=initGrain(S);st.vig=vignetteCanvas(.5,460);
  st.bulb=glowSprite('255,205,130',96,.2);st.lan=glowSprite('255,170,90',128,.3);st.mote=glowSprite('255,225,180',32,.3);
  st.bg=mk(W,H,x=>{
    x.fillStyle=G(x,0,0,0,880,[[0,'#241a44'],[.32,'#5e3a6c'],[.6,'#b8627a'],[.82,'#f0a07a'],[1,'#f9cc98']]);x.fillRect(0,0,W,H);
    x.fillStyle=RG(x,960,860,0,900,[[0,'rgba(255,236,190,.9)'],[.25,'rgba(255,200,150,.35)'],[1,'rgba(255,170,130,0)']]);x.fillRect(0,0,W,H);
    const ridge=(pts,col)=>{x.fillStyle=col;x.fill(S.smooth(pts.concat([[W+60,H+60],[-60,H+60]])))};
    const rp=(base,amp,n)=>{const p=[];for(let i=0;i<=n;i++)p.push([i/n*(W+120)-60,base-amp*(i%2?S.R(.55,1):S.R(.05,.35))]);return p};
    ridge(rp(760,230,11),'#a57a9e');x.fillStyle=G(x,0,560,0,800,[[0,'rgba(255,200,180,0)'],[1,'rgba(255,200,170,.45)']]);x.fillRect(0,560,W,240);
    ridge(rp(830,150,15),'#73527f');x.fillStyle=G(x,0,720,0,860,[[0,'rgba(250,180,170,0)'],[1,'rgba(250,180,170,.32)']]);x.fillRect(0,720,W,140);
    ridge(rp(900,80,19),'#45305a');
    for(let i=0;i<16;i++){const hx=S.R(120,1800),hy=868+S.R(-12,20),s=S.R(14,24);x.fillStyle='#382650';x.fillRect(hx,hy-s,s*1.4,s);x.beginPath();x.moveTo(hx-3,hy-s);x.lineTo(hx+s*.7,hy-s*1.6);x.lineTo(hx+s*1.4+3,hy-s);x.fill();x.fillStyle='#ffc878';x.fillRect(hx+s*.3,hy-s*.65,s*.3,s*.3)}
    x.fillStyle='#24163a';x.fill(S.smooth([[-60,965],[400,945],[900,960],[1400,940],[1980,958],[1980,1140],[-60,1140]]));
    x.strokeStyle='#24163a';x.lineCap='round';for(let i=0;i<420;i++){const gx=S.R(-10,W+10),gy=S.R(950,1080),l=S.R(10,40)*(gy-900)/180;x.lineWidth=S.R(1.5,3);x.beginPath();x.moveTo(gx,gy);x.quadraticCurveTo(gx+S.R(-6,6),gy-l*.6,gx+S.R(-12,12),gy-l);x.stroke()}
    for(let i=0;i<90;i++){x.fillStyle=S.pick(['#f2a6b4','#ffd890','#e8d0f0','#f6b38a']);x.globalAlpha=S.R(.4,.85);disc(x,S.R(0,W),S.R(975,1075),S.R(1.5,3.5))}x.globalAlpha=1});
  st.cl=mk(W,520,x=>{x.filter='blur(10px)';for(let i=0;i<26;i++){const cx=S.R(0,W),cy=S.R(120,500),rx=S.R(140,420),ry=S.R(10,26);
    for(const off of [-W,0,W]){x.fillStyle='rgba(110,60,110,.32)';ell(x,cx+off,cy,rx,ry);x.fillStyle=`rgba(255,${S.RI(150,190)},150,${(cy/500)*.45})`;ell(x,cx+off+10,cy+ry*.5,rx*.8,ry*.45)}}});
  /* strings: back (smaller, softer) and front */
  st.strs=[{x0:-60,y0:40,x1:1980,y1:70,sag:150,n:9,sc:.5,blur:2.2,dim:.28,col:'rgba(40,24,40,.6)',bulbs:26},
           {x0:-60,y0:150,x1:1980,y1:170,sag:220,n:7,sc:.76,blur:0,dim:0,col:'rgba(30,18,24,.85)',bulbs:22}];
  let ki=S.RI(0,9);
  for(const s of st.strs){s.ph=[];for(let i=0;i<s.n;i++){const kind=KINDS[ki++%KINDS.length];
      s.ph.push({u:(i+.5)/s.n+S.R(-.02,.02),cv:card(S,kind,S.pick([0,.15,.35,.6]),s.blur,s.dim),rot:S.R(-.12,.12),sec:S.R(7,13),off:S.R(0,1),amp:S.R(.025,.05)})}
    s.bl=[];for(let i=0;i<s.bulbs;i++)s.bl.push({u:(i+.5)/s.bulbs,sec:S.R(4,9),off:S.R(0,1)})}
  st.lans=[];for(let i=0;i<16;i++){const z=S.R(.35,1);st.lans.push({x:S.R(80,1840),y:S.R(0,1080),z,sec:z>.7?105:210,sw:S.R(15,45),ss:S.R(16,30),off:S.R(0,1)})}
  st.lans.sort((a,b)=>a.z-b.z);
  st.motes=[];for(let i=0;i<70;i++)st.motes.push({x:S.R(0,W),y:S.R(0,H),sec:S.pick([105,70,210]),sw:S.R(10,40),ss:S.R(15,35),off:S.R(0,1),r:S.R(3,7)});
},
draw(S){
  const c=S.ctx,st=S.state;
  c.drawImage(st.bg,0,0);
  const cx=S.saw(210)*W;c.globalAlpha=.9;c.drawImage(st.cl,cx-W,0);c.drawImage(st.cl,cx,0);c.globalAlpha=1;
  /* rising sky lanterns */
  for(const l of st.lans){const y=S.wrap(l.y,l.sec,1080,120,-1),x=l.x+l.sw*S.osc(l.ss,l.off),z=l.z;
    const a=S.clamp((y+120)/420)*S.clamp((1060-y)/160)*(.5+.5*z);if(a<.02)continue;
    c.globalCompositeOperation='lighter';c.globalAlpha=a*.7;c.drawImage(st.lan,x-60*z,y-60*z,120*z,120*z);c.globalCompositeOperation='source-over';
    c.globalAlpha=a;c.fillStyle=G(c,0,y-16*z,0,y+16*z,[[0,'#ffd9a0'],[1,'#f08a40']]);c.beginPath();c.moveTo(x-11*z,y-15*z);c.lineTo(x+11*z,y-15*z);c.lineTo(x+8*z,y+15*z);c.lineTo(x-8*z,y+15*z);c.closePath();c.fill()}
  c.globalAlpha=1;
  /* strings of photos and lights */
  const breeze=S.osc(12);
  for(const s of st.strs){const sag=s.sag+10*breeze;
    c.strokeStyle=s.col;c.lineWidth=2.5*s.sc+.5;c.beginPath();const [a0,b0]=strPt(s,0,sag),m=strPt(s,.5,sag);c.moveTo(a0,b0);c.quadraticCurveTo((s.x0+s.x1)/2,(s.y0+s.y1)/2+2*sag,s.x1,s.y1);c.stroke();
    for(const p of s.ph){const [px,py]=strPt(s,p.u,sag),r=p.rot+p.amp*S.osc(p.sec,p.off)+.02*breeze,w=p.cv.width*s.sc,h=p.cv.height*s.sc;
      c.save();c.translate(px,py);c.rotate(r);c.globalAlpha=.35;c.fillStyle='#1a0e20';c.fillRect(-w/2+6*s.sc,8*s.sc,w,h);c.globalAlpha=1;c.drawImage(p.cv,-w/2,2,w,h);
      c.fillStyle='#c49a68';c.fillRect(-6*s.sc,-12*s.sc,12*s.sc,34*s.sc);c.fillStyle='rgba(0,0,0,.3)';c.fillRect(-1,-12*s.sc,2,34*s.sc);c.restore()}
    c.globalCompositeOperation='lighter';
    for(const b of s.bl){const [bx,by]=strPt(s,b.u,sag),a=.55+.45*S.osc01(b.sec,b.off),R=44*s.sc+12;c.globalAlpha=a*(s.sc>.6?.85:.6);c.drawImage(st.bulb,bx-R,by+4-R,R*2,R*2)}
    c.globalCompositeOperation='source-over';c.globalAlpha=1;
    c.fillStyle='#fff3d8';for(const b of s.bl){const [bx,by]=strPt(s,b.u,sag);disc(c,bx,by+4,3*s.sc+1.5)}}
  c.globalCompositeOperation='lighter';
  for(const m of st.motes){const y=S.wrap(m.y,m.sec,1080,20,-1),x=m.x+m.sw*S.osc(m.ss,m.off);c.globalAlpha=.25+.35*S.osc01(m.ss*.4,m.off);c.drawImage(st.mote,x-m.r,y-m.r,m.r*2,m.r*2)}
  c.globalCompositeOperation='source-over';c.globalAlpha=1;
  c.drawImage(st.vig,0,0);drawGrain(S,st.grain,.24);
}});
})();
