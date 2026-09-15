const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];

const glow=$('.cursor-glow');
if(glow){
  window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'},{passive:true});
}

const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12,rootMargin:'0px 0px -30px 0px'});
$$('.reveal').forEach(el=>revealObserver.observe(el));

const scrollBar=$('.scroll-progress span');
const topButton=$('.top-button');
const sections=$$('main section[id]');
const navLinks=$$('.desktop-nav a, .mobile-menu a');

function updateScroll(){
  const doc=document.documentElement;
  const max=doc.scrollHeight-doc.clientHeight;
  scrollBar.style.width=(max?window.scrollY/max*100:0)+'%';
  topButton.classList.toggle('show',window.scrollY>650);
  let current='home';
  sections.forEach(section=>{if(window.scrollY>=section.offsetTop-190)current=section.id;});
  navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+current));
}
window.addEventListener('scroll',updateScroll,{passive:true});
updateScroll();

topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const href=a.getAttribute('href');
    if(!href || href==='#') return;
    const target=$(href);
    if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});}
  });
});

/* Tutor filtering */
$$('.filter').forEach(btn=>{
  btn.addEventListener('click',()=>{
    $$('.filter').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const filter=btn.dataset.filter;
    $$('.tutor-card').forEach(card=>{
      const match=filter==='all'||card.dataset.subject.split(' ').includes(filter);
      card.classList.toggle('filtered-out',!match);
      card.style.display=match?'':'none';
    });
  });
});

/* Parent Dashboard Tabs */
$$('.dash-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    $$('.dash-tab').forEach(t=>t.classList.remove('active'));
    $$('.dash-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    const targetPanel=$('#panel-'+tab.dataset.tab);
    if(targetPanel) targetPanel.classList.add('active');
  });
});

/* Interactive Learner Quick-Match Tool */
const matchData={
  adhd:{
    title:'ADHD & Focus',
    desc:'Body-doubling techniques, 15-minute visual task chunking, low sensory distraction, and instant positive feedback loops.',
    badges:['✦ Visual Task Timers','✦ Active Movement Breaks','✦ High-Engagement Gamification']
  },
  dyslexia:{
    title:'Dyslexia & Phonics',
    desc:'Orton-Gillingham multisensory approach, visual sound-to-letter mapping, and color-coded syllable chunking.',
    badges:['✦ Orton-Gillingham Method','✦ Audio-Visual Mapping','✦ Stress-Free Reading Pacing']
  },
  math:{
    title:'Math Anxiety & Dyscalculia',
    desc:'Tactile visual blocks, real-world context storytelling, step-by-step problem breakdown, and zero timed speed drills.',
    badges:['✦ Manipulative Block Models','✦ Step-by-Step Canvas','✦ Formula-Free Intuition']
  },
  executive:{
    title:'Executive Functioning',
    desc:'Task prioritization matrices, visual study schedules, color-coded organization systems, and self-monitoring routines.',
    badges:['✦ Task Chunking Systems','✦ Binder & File Setup','✦ Time-Estimation Coaching']
  },
  autism:{
    title:'Autism Spectrum Support',
    desc:'Strengths-based passion-led learning, explicit sensory-friendly routines, predictable session agendas, and clear visual prompts.',
    badges:['✦ Passion-Led Curriculum','✦ Sensory-Friendly Environment','✦ Clear Predictable Agendas']
  }
};

$$('.match-pill').forEach(pill=>{
  pill.addEventListener('click',()=>{
    $$('.match-pill').forEach(p=>p.classList.remove('active'));
    pill.classList.add('active');
    const key=pill.dataset.match;
    const data=matchData[key];
    const resultBox=$('#matchResult');
    if(data && resultBox){
      resultBox.innerHTML=`
        <div class="match-result-card">
          <h4>Recommended Strategy for <span>${data.title}</span></h4>
          <p>${data.desc}</p>
          <div class="match-badges">
            ${data.badges.map(b=>`<span>${b}</span>`).join('')}
          </div>
        </div>
      `;
    }
  });
});

/* Plan Tracks Selection */
$$('.plan-track-card').forEach(card=>{
  card.addEventListener('click',()=>{
    $$('.plan-track-card').forEach(c=>c.classList.remove('active'));
    card.classList.add('active');
  });
});

/* Live Accessibility Toolbar Controls */
const toggleDyslexic=$('#toggleDyslexicFont');
const toggleContrast=$('#toggleHighContrast');
const toggleSize=$('#toggleTextSize');

toggleDyslexic?.addEventListener('click',()=>{
  const isDyslexic=document.body.classList.toggle('dyslexic-font');
  toggleDyslexic.querySelector('span').textContent=isDyslexic?'Atkinson Hyperlegible':'Standard';
  showToast(isDyslexic?'Switched to Atkinson Hyperlegible (Dyslexia-friendly font)':'Switched to Standard font');
});

toggleContrast?.addEventListener('click',()=>{
  const isHighContrast=document.body.classList.toggle('high-contrast');
  toggleContrast.querySelector('span').textContent=isHighContrast?'High Contrast':'Normal';
  showToast(isHighContrast?'Enabled High Contrast mode':'Disabled High Contrast mode');
});

toggleSize?.addEventListener('click',()=>{
  const isLarge=document.body.classList.toggle('text-large');
  toggleSize.querySelector('span').textContent=isLarge?'112% (Large)':'100%';
  showToast(isLarge?'Increased text sizing':'Restored standard text sizing');
});

/* Mobile menu */
const menu=$('.mobile-menu'), menuToggle=$('.menu-toggle'), closeMenu=$('.close-menu');
function setMenu(open){
  menu.classList.toggle('open',open);
  menu.setAttribute('aria-hidden',String(!open));
  menuToggle?.setAttribute('aria-expanded',String(open));
  document.body.classList.toggle('menu-open',open);
}
menuToggle?.addEventListener('click',()=>setMenu(true));
closeMenu?.addEventListener('click',()=>setMenu(false));
$$('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));

/* Login & Signup modal */
const modal=$('#loginModal');
const loginButtons=$$('[data-login]');
const tabLogin=$('#tabLogin');
const tabSignup=$('#tabSignup');
const loginForm=$('#loginForm');
const signupForm=$('#signupForm');
const modalEyebrow=$('#modalEyebrow');
const modalTitle=$('#modalTitle');
const modalCopy=$('#modalCopy');

function setAuthMode(mode){
  const isLogin=mode==='login';
  tabLogin?.classList.toggle('active',isLogin);
  tabSignup?.classList.toggle('active',!isLogin);
  if(loginForm) loginForm.style.display=isLogin?'grid':'none';
  if(signupForm) signupForm.style.display=!isLogin?'grid':'none';
  
  if(modalEyebrow) modalEyebrow.textContent=isLogin?'Welcome back':'Get started for free';
  if(modalTitle) modalTitle.innerHTML=isLogin?'Your learning<br><em>starts here.</em>':'Join the TutorAble<br><em>family.</em>';
  if(modalCopy) modalCopy.textContent=isLogin?'Sign in to continue to your personalized TutorAble space.':'Create your free account to match with top neuro-affirming educators.';
}

tabLogin?.addEventListener('click',()=>setAuthMode('login'));
tabSignup?.addEventListener('click',()=>setAuthMode('signup'));

const closeLogin=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');};
const openLogin=(mode='login')=>{
  setMenu(false);
  setAuthMode(mode);
  modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');
  setTimeout(()=>{
    const targetInput=mode==='login'?$('#loginEmail'):$('#signupName');
    targetInput?.focus();
  },120);
};

loginButtons.forEach(b=>b.addEventListener('click',()=>openLogin('login')));
$$('[data-close-login]').forEach(b=>b.addEventListener('click',closeLogin));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeLogin();setMenu(false)}});

/* Universal Password Visibility Toggle */
$$('.toggle-password').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const targetId=btn.dataset.target;
    const targetInput=$('#'+targetId);
    if(targetInput){
      const isText=targetInput.type==='text';
      targetInput.type=isText?'password':'text';
      btn.textContent=isText?'Show':'Hide';
    }
  });
});

/* Role selection pill toggling */
$$('.role-pill input').forEach(radio=>{
  radio.addEventListener('change',()=>{
    $$('.role-pill').forEach(pill=>pill.classList.remove('active'));
    radio.closest('.role-pill')?.classList.add('active');
  });
});

/* Toast feedback */
const toast=$('.toast');
function showToast(message){
  toast.textContent=message;toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),3000);
}

$('#loginForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  closeLogin();
  showToast('Welcome back! Signed in successfully.');
});

$('#signupForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  closeLogin();
  showToast('Account created! Welcome to the TutorAble family 🎉');
});

$$('.social-btn').forEach(btn=>btn.addEventListener('click',()=>showToast('Google authentication is ready to connect.')));

/* Newsletter Subscription Form */
$('#newsletterForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const input=$('#newsletterEmail');
  if(input && input.value){
    showToast('Thank you! You have subscribed to TutorAble updates.');
    input.value='';
  }
});

/* Stagger visible tutor cards on intersection */
const tutorGrid=$('.tutor-grid');
if(tutorGrid){
  const cardObserver=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){
      $$('.tutor-card').forEach((card,i)=>setTimeout(()=>card.classList.add('card-arrived'),i*120));
      cardObserver.disconnect();
    }
  },{threshold:.15});
  cardObserver.observe(tutorGrid);
}

/* Interactive logo tilt on desktop pointer */
const heroLogo=$('.hero-logo');
if(heroLogo && window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  const wrap=$('.hero-logo-wrap');
  wrap?.addEventListener('pointermove',e=>{
    const r=wrap.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    heroLogo.style.transform=`perspective(900px) rotateY(${x*2.2}deg) rotateX(${y*-2.2}deg) translateY(-4px)`;
  });
  wrap?.addEventListener('pointerleave',()=>heroLogo.style.transform='');
}

