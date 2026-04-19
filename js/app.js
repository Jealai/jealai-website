/* Jeal.AI — audit flow + nav + reveal + rotating word + popup + variant cycle */
(function(){
  const $ = (s,p=document)=>p.querySelector(s);
  const $$ = (s,p=document)=>Array.from(p.querySelectorAll(s));

  // ── GHL webhooks ──
  const GHL_WEBHOOK_AUDIT = 'https://services.leadconnectorhq.com/hooks/OWO5inHbQebbSrnXyUp6/webhook-trigger/2a897fcd-daae-4db5-8592-c513cf782e70';
  const GHL_WEBHOOK_CONTACT = 'https://services.leadconnectorhq.com/hooks/OWO5inHbQebbSrnXyUp6/webhook-trigger/nQqqcE39r4ibHAcv3Y0p';
  function splitName(full){const p=full.trim().split(/\s+/);return{firstName:p[0]||'',lastName:p.slice(1).join(' ')||''}}
  function pushToGHL(url,payload){
    fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}).catch(()=>{});
  }

  // Rotating word
  (function(){
    const el=$('#rotating-word'); if(!el) return;
    const words=['Revenue','Efficiency','Sales','Time'];
    let i=0;
    setInterval(()=>{
      el.classList.add('word-exit');
      setTimeout(()=>{
        i=(i+1)%words.length;
        el.textContent=words[i];
        el.classList.remove('word-exit');
        el.classList.add('word-enter');
        el.offsetHeight;
        el.classList.remove('word-enter');
      },260);
    },2600);
  })();

  // Nav scroll
  const nav=$('#nav');
  if(nav) window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40),{passive:true});

  // Reveal
  const revealObs=new IntersectionObserver(es=>{
    es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObs.unobserve(e.target)}});
  },{threshold:0.12});
  $$('.reveal').forEach(el=>revealObs.observe(el));

  // Footer year
  const fy=$('#footer-year'); if(fy) fy.textContent=new Date().getFullYear();

  // ── Audit state ──
  const state={step:-1,contact:{},answers:{},selectedIndex:null};
  const panelGate=$('#panel-gate'), panelQ=$('#panel-questions'), panelR=$('#panel-results');
  const gateForm=$('#gate-form');

  function showPanel(name){
    [panelGate,panelQ,panelR].forEach(p=>p.classList.add('hidden'));
    ({gate:panelGate,questions:panelQ,results:panelR})[name].classList.remove('hidden');
    const y=$('#audit').getBoundingClientRect().top+window.scrollY-60;
    window.scrollTo({top:y,behavior:'smooth'});
  }

  gateForm.addEventListener('submit',e=>{
    e.preventDefault();
    const fields=['fullName','phone','title','businessName','email'];
    let valid=true;
    fields.forEach(f=>{
      const inp=$('#'+f); inp.classList.remove('input-error');
      if(!inp.value.trim()){inp.classList.add('input-error');valid=false}
    });
    const em=$('#email');
    if(em.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)){em.classList.add('input-error');valid=false}
    if(!valid) return;
    state.contact={fullName:$('#fullName').value.trim(),phone:$('#phone').value.trim(),title:$('#title').value.trim(),businessName:$('#businessName').value.trim(),email:$('#email').value.trim()};
    const _gn=splitName(state.contact.fullName);
    pushToGHL(GHL_WEBHOOK_AUDIT,{firstName:_gn.firstName,lastName:_gn.lastName,phone:state.contact.phone,email:state.contact.email,title:state.contact.title,businessName:state.contact.businessName,source:'Website Audit Form'});
    showPanel('questions');
    state.step=0; renderQ(0);
  });

  const qCur=$('#q-current'),qPct=$('#q-pct'),pFill=$('#progress-fill');
  const qCard=$('#question-card'),qCat=$('#q-category'),qText=$('#q-text'),aGrid=$('#answer-grid');
  const bBack=$('#btn-back'),bNext=$('#btn-next');

  function renderQ(idx){
    const q=window.QUESTIONS[idx]; state.step=idx; state.selectedIndex=null;
    const pct=Math.round((idx/window.QUESTIONS.length)*100);
    qCur.textContent=idx+1; qPct.textContent=pct+'%'; pFill.style.width=Math.max(pct,4)+'%';
    qCard.classList.add('exiting');
    setTimeout(()=>{
      qCat.textContent=q.category; qText.textContent=q.text; aGrid.innerHTML='';
      const L=['A','B','C','D'];
      q.options.forEach((opt,i)=>{
        const b=document.createElement('button');
        b.type='button'; b.className='answer-btn'; b.dataset.index=i;
        b.innerHTML=`<span class="answer-letter">${L[i]}</span><span class="answer-text">${opt.label}</span>`;
        b.addEventListener('click',()=>selectA(idx,i));
        aGrid.appendChild(b);
      });
      const prev=state.answers[q.id];
      if(prev!==undefined){
        const pb=aGrid.querySelector(`[data-index="${prev.index}"]`);
        if(pb) pb.classList.add('selected');
        state.selectedIndex=prev.index; bNext.disabled=false;
      } else bNext.disabled=true;
      bBack.style.visibility=idx===0?'hidden':'visible';
      bNext.innerHTML=idx===window.QUESTIONS.length-1?'See My Results <span class="btn__arrow">→</span>':'Next <span class="btn__arrow">→</span>';
      qCard.classList.remove('exiting');
    },180);
  }
  function selectA(qi,ai){
    const q=window.QUESTIONS[qi],opt=q.options[ai];
    $$('.answer-btn').forEach(b=>b.classList.remove('selected'));
    aGrid.querySelector(`[data-index="${ai}"]`).classList.add('selected');
    state.selectedIndex=ai;
    state.answers[q.id]={label:opt.label,score:opt.score,index:ai};
    bNext.disabled=false;
  }
  bNext.addEventListener('click',()=>{
    if(state.selectedIndex===null) return;
    const n=state.step+1;
    if(n<window.QUESTIONS.length) renderQ(n); else buildResults();
  });
  bBack.addEventListener('click',()=>{if(state.step>0) renderQ(state.step-1)});

  // Scoring
  function scores(){
    const a=state.answers, get=id=>(a[id]&&a[id].score!==null)?(a[id].score||0):0;
    const sales=get('q1')+get('q2')+get('q5'), ops=get('q4')+get('q6')+get('q8'), mkt=get('q3')+get('q7');
    const total=sales+ops+mkt;
    const tier=window.TIERS.find(t=>total>=t.min&&total<=t.max)||window.TIERS[window.TIERS.length-1];
    const scored=window.QUESTIONS.filter(q=>q.leakName).map(q=>({q,s:(a[q.id]&&a[q.id].score!==null)?(a[q.id].score||0):0}));
    scored.sort((x,y)=>x.s-y.s);
    const topLeaks=scored.slice(0,3);
    return {total,sales,ops,mkt,tier,topLeaks,wins:topLeaks.map(l=>l.q.quickWin).filter(Boolean)};
  }

  function animateNum(el,from,to,dur){
    const t0=performance.now();
    function tick(now){
      const p=Math.min((now-t0)/dur,1), e=1-Math.pow(1-p,3);
      el.textContent=Math.round(from+(to-from)*e);
      if(p<1) requestAnimationFrame(tick);
    } requestAnimationFrame(tick);
  }
  function hexRgba(h,a){const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return `rgba(${r},${g},${b},${a})`}

  function buildResults(){
    const s=scores(); showPanel('results');
    const _rn=splitName(state.contact.fullName);
    pushToGHL(GHL_WEBHOOK_AUDIT,{firstName:_rn.firstName,lastName:_rn.lastName,phone:state.contact.phone,email:state.contact.email,businessName:state.contact.businessName,auditScore:s.total,auditTier:s.tier.label,auditSalesScore:s.sales,auditOpsScore:s.ops,auditMktScore:s.mkt,source:'Website Audit Results'});
    $('#results-headline').textContent=`${state.contact.businessName} — Systems Audit`;
    $('#results-sub').textContent=`Completed by ${state.contact.fullName} · ${state.contact.title}`;
    const C=2*Math.PI*50, rf=$('#ring-fill');
    rf.style.stroke=s.tier.color;
    setTimeout(()=>{rf.style.strokeDashoffset=C*(1-s.total/24)},200);
    animateNum($('#ring-score'),0,s.total,1100);
    const te=$('#ring-tier');
    te.textContent=s.tier.label; te.style.background=hexRgba(s.tier.color,0.15); te.style.color=s.tier.color;
    $('#score-title').textContent=s.tier.title; $('#score-body').textContent=s.tier.body;
    const cats=[{l:'Sales',v:s.sales,m:9},{l:'Operations',v:s.ops,m:9},{l:'Marketing',v:s.mkt,m:6}];
    const cb=$('#category-bars'); cb.innerHTML='';
    cats.forEach(c=>{
      const p=Math.round(c.v/c.m*100), col=p>=75?'#0B94D3':p>=45?'#F5A524':'#E8692A';
      cb.innerHTML+=`<div><div class="cat-bar-header"><span class="cat-bar-label">${c.l}</span><span class="cat-bar-pct">${c.v}/${c.m}</span></div><div class="cat-bar-track"><div class="cat-bar-fill" style="background:${col};width:${p}%"></div></div></div>`;
    });
    setTimeout(()=>{$$('.cat-bar-fill').forEach(b=>{const w=b.style.width;b.style.width='0%';setTimeout(()=>b.style.width=w,50)})},300);
    const lg=$('#leaks-grid'); lg.innerHTML='';
    s.topLeaks.forEach((it,i)=>{lg.innerHTML+=`<div class="leak-card"><div class="leak-number">${i+1}</div><div><div class="leak-name">${it.q.leakName}</div><div class="leak-desc">${it.q.leakDesc}</div></div></div>`});
    const wl=$('#wins-list'); wl.innerHTML=''; s.wins.forEach(w=>wl.innerHTML+=`<li>${w}</li>`);
    const ol=$('#opps-list'); ol.innerHTML=''; s.tier.opps.forEach(o=>ol.innerHTML+=`<li>${o}</li>`);
  }

  // ── Contact popup ──
  const overlay=$('#popup-overlay'), popup=$('#popup'), popupForm=$('#popup-form'), popupBody=$('#popup-body'), popupSuccess=$('#popup-success');
  function openPopup(){overlay.classList.add('open')}
  function closePopup(){overlay.classList.remove('open');setTimeout(()=>{if(popupBody&&popupSuccess){popupBody.classList.remove('hidden');popupSuccess.classList.add('hidden');popupForm.reset()}},260)}
  $$('[data-open-popup]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openPopup()}));
  $$('[data-close-popup]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();closePopup()}));
  overlay.addEventListener('click',e=>{if(e.target===overlay) closePopup()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape') closePopup()});
  popupForm.addEventListener('submit',e=>{
    e.preventDefault();
    const fields=['p_name','p_email','p_phone','p_business','p_message'];
    let valid=true;
    fields.forEach(f=>{
      const inp=$('#'+f); inp.classList.remove('input-error');
      if(!inp.value.trim()){inp.classList.add('input-error');valid=false}
    });
    const pe=$('#p_email');
    if(pe.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pe.value)){pe.classList.add('input-error');valid=false}
    if(!valid) return;
    const _pn=splitName($('#p_name').value.trim());
    pushToGHL(GHL_WEBHOOK_CONTACT,{firstName:_pn.firstName,lastName:_pn.lastName,email:$('#p_email').value.trim(),phone:$('#p_phone').value.trim(),businessName:$('#p_business').value.trim(),message:$('#p_message').value.trim(),source:'Website Contact Popup'});
    popupBody.classList.add('hidden'); popupSuccess.classList.remove('hidden');
  });

  // ── Variant cycling + Tweaks ──
  const VARIANTS=['operator','circuit','voltage'];
  function applyVariant(v){
    document.body.dataset.variant=v;
    $$('[data-hero]').forEach(el=>el.classList.toggle('hidden',el.dataset.hero!==v));
    $$('[data-services]').forEach(el=>el.classList.toggle('hidden',el.dataset.services!==v));
    const ind=$('#tweak-variant-name'); if(ind) ind.textContent=v;
    try{localStorage.setItem('jeal-variant',v)}catch(e){}
  }
  const saved=(()=>{try{return localStorage.getItem('jeal-variant')}catch(e){return null}})();
  applyVariant(saved&&VARIANTS.includes(saved)?saved:'operator');

  // Tweaks panel
  const tweak=$('#tweaks');
  function activate(){tweak.classList.remove('hidden')}
  function deactivate(){tweak.classList.add('hidden')}
  window.addEventListener('message',e=>{
    if(!e.data||typeof e.data!=='object') return;
    if(e.data.type==='__activate_edit_mode') activate();
    if(e.data.type==='__deactivate_edit_mode') deactivate();
  });
  window.parent.postMessage({type:'__edit_mode_available'},'*');

  $$('[data-set-variant]').forEach(b=>b.addEventListener('click',()=>applyVariant(b.dataset.setVariant)));
})();
