/* Ahmed Nasser Portfolio — script.js v3 (updated typed lines) */
const html=document.documentElement,themeBtn=document.getElementById('themeToggle');
let saved='dark';try{saved=localStorage.getItem('pf-theme')||'dark'}catch(e){}
html.setAttribute('data-theme',saved);
themeBtn.addEventListener('click',()=>{const n=html.getAttribute('data-theme')==='dark'?'light':'dark';html.setAttribute('data-theme',n);try{localStorage.setItem('pf-theme',n)}catch(e){}});
// TYPED TEXT
const lines=['AI & Machine Learning Engineer','Computer Vision Specialist','Data Analyst & BI Developer','Creator of DataPilot AI','Deep Learning · PyTorch · CLIP'];
let li=0,ci=0,del=false;const typedEl=document.getElementById('typed-text');
function type(){const cur=lines[li];if(!del){typedEl.textContent=cur.slice(0,++ci);if(ci===cur.length){del=true;setTimeout(type,2000);return}setTimeout(type,60)}else{typedEl.textContent=cur.slice(0,--ci);if(ci===0){del=false;li=(li+1)%lines.length;setTimeout(type,400);return}setTimeout(type,30)}}
type();
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const accentRGB=()=>html.getAttribute('data-theme')==='dark'?{r:100,g:149,b:237}:{r:79,g:120,b:200};
// PARTICLES
const canvas=document.getElementById('particle-canvas'),ctx=canvas.getContext('2d');let particles=[];
function resizeCanvas(){canvas.width=innerWidth;canvas.height=innerHeight}
class Particle{constructor(){this.reset()}
reset(){this.x=Math.random()*canvas.width;this.y=Math.random()*canvas.height;this.r=Math.random()*1.6+.5;this.vx=(Math.random()-.5)*.4;this.vy=(Math.random()-.5)*.4;this.alpha=Math.random()*.5+.2;this.aDir=Math.random()>.5?1:-1;this.aSpeed=Math.random()*.006+.002}
update(){this.x+=this.vx;this.y+=this.vy;this.alpha+=this.aDir*this.aSpeed;if(this.alpha>.7||this.alpha<.08)this.aDir*=-1;if(this.x<0)this.x=canvas.width;if(this.x>canvas.width)this.x=0;if(this.y<0)this.y=canvas.height;if(this.y>canvas.height)this.y=0}
draw(c){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.fillStyle=`rgba(${c.r},${c.g},${c.b},${this.alpha})`;ctx.fill()}}
function buildParticles(){const n=Math.min(Math.floor(canvas.width*canvas.height/12000),100);particles=Array.from({length:n},()=>new Particle())}
function drawLines(c){const m=150;for(let i=0;i<particles.length;i++)for(let j=i+1;j<particles.length;j++){const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<m){ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);ctx.strokeStyle=`rgba(${c.r},${c.g},${c.b},${(1-d/m)*.3})`;ctx.lineWidth=.7;ctx.stroke()}}}
function animateParticles(){requestAnimationFrame(animateParticles);ctx.clearRect(0,0,canvas.width,canvas.height);const c=accentRGB();particles.forEach(p=>{p.update();p.draw(c)});drawLines(c)}
addEventListener('resize',()=>{resizeCanvas();buildParticles()},{passive:true});resizeCanvas();
if(!reduce){buildParticles();animateParticles()}
// AURA
const auraCanvas=document.getElementById('aura-canvas');
if(auraCanvas){const ac=auraCanvas.getContext('2d');let t=0,nodes=[];
function buildNodes(){nodes=Array.from({length:14},(_,i)=>({baseAngle:i/14*Math.PI*2,radiusOffset:Math.sin(i*1.7)*.12,speed:.15+(i%3)*.05,phase:Math.random()*Math.PI*2,size:1.2+Math.random()*1.6}))}
function resizeAura(){auraCanvas.width=auraCanvas.offsetWidth;auraCanvas.height=auraCanvas.offsetHeight;buildNodes()}
new ResizeObserver(resizeAura).observe(auraCanvas);resizeAura();
function animateAura(){requestAnimationFrame(animateAura);const w=auraCanvas.width,h=auraCanvas.height,cx=w/2,cy=h/2,baseR=Math.min(w,h)*.46,c=accentRGB();ac.clearRect(0,0,w,h);t+=.012;
const pos=nodes.map(n=>{const a=n.baseAngle+t*n.speed,r=baseR*(1+n.radiusOffset*Math.sin(t*.5+n.phase));return{x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r,size:n.size}});
for(let i=0;i<pos.length;i++)for(let j=i+1;j<pos.length;j++){const dx=pos[i].x-pos[j].x,dy=pos[i].y-pos[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<baseR*.85){ac.beginPath();ac.moveTo(pos[i].x,pos[i].y);ac.lineTo(pos[j].x,pos[j].y);ac.strokeStyle=`rgba(${c.r},${c.g},${c.b},${(1-d/(baseR*.85))*.35})`;ac.lineWidth=.8;ac.stroke()}}
pos.forEach((p,i)=>{ac.beginPath();ac.moveTo(cx,cy);ac.lineTo(p.x,p.y);ac.strokeStyle=`rgba(${c.r},${c.g},${c.b},${Math.max(.06+.05*Math.sin(t*1.5+i),.02)})`;ac.lineWidth=.5;ac.stroke()});
pos.forEach((p,i)=>{const pulse=.6+.4*Math.sin(t*2+i*.7),g=ac.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size*4);g.addColorStop(0,`rgba(${c.r},${c.g},${c.b},${.9*pulse})`);g.addColorStop(1,`rgba(${c.r},${c.g},${c.b},0)`);ac.beginPath();ac.arc(p.x,p.y,p.size*4,0,Math.PI*2);ac.fillStyle=g;ac.fill();ac.beginPath();ac.arc(p.x,p.y,p.size,0,Math.PI*2);ac.fillStyle=`rgba(${c.r},${c.g},${c.b},${.9*pulse})`;ac.fill()})}
if(!reduce)animateAura()}
// NAVBAR SHADOW
const navbar=document.getElementById('navbar');
addEventListener('scroll',()=>{navbar.style.boxShadow=scrollY>20?'0 4px 24px rgba(0,0,0,.2)':'none'},{passive:true});
// ACTIVE NAV
const navLinks=document.querySelectorAll('.nav-links a');
document.querySelectorAll('section[id]').forEach(s=>{new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)navLinks.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+e.target.id))})},{threshold:.35}).observe(s)});
// FADE-IN
const obs=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
['.section-eyebrow','.section-title','.about-text-block p','.skill-group','.project-card','.timeline-item','.cert-card','.contact-card','.hero-badge','.hero-name','.hero-title','.hero-desc','.hero-cta','.hero-visual'].forEach(sel=>{document.querySelectorAll(sel).forEach((el,i)=>{el.classList.add('fade-in');el.style.transitionDelay=`${i*.05}s`;obs.observe(el)})});
// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}})});
