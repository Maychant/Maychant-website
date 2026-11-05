(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const arrow = '<svg aria-hidden="true"><use href="#arrow"/></svg>';
  const escape = (value) => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let motionPaused = reducedMotion.matches;
  let animationContext;
  let toastTimer;
  const showToast = (message) => { const toast = $('.toast'); toast.textContent = message; toast.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500); };

  // Native dialogs provide modal focus containment and Escape behavior.
  const openDialog = (dialog) => { dialog.showModal(); document.body.style.overflow = 'hidden'; };
  $$('dialog').forEach(dialog => {
    $('[data-close]', dialog)?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { const r = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close(); });
    dialog.addEventListener('close', () => { if (!$('dialog[open]')) document.body.style.overflow = ''; if (dialog.id === 'film-dialog') $('#brand-film').pause(); });
  });

  const menuButton = $('.menu-toggle');
  const mobileMenu = $('#mobile-menu');
  const closeMenu = () => { mobileMenu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation'); };
  menuButton.addEventListener('click', () => { const open = mobileMenu.hidden; mobileMenu.hidden = !open; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
  $$('a,button', mobileMenu).forEach(item => item.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileMenu.hidden) { closeMenu(); menuButton.focus(); } });
  document.addEventListener('click', event => { if (!event.target.closest('.site-header')) closeMenu(); });

  function selectAudience(role) {
    $$('.audience-panel').forEach(panel => {
      const active = panel.dataset.audience === role;
      panel.classList.toggle('is-active', active);
      $('.audience-toggle', panel).setAttribute('aria-expanded', String(active));
      $('.expand-icon', panel).textContent = active ? '−' : '+';
      $('.audience-details', panel).hidden = !active;
    });
    if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), motionPaused ? 0 : 850);
  }
  $$('.audience-toggle').forEach(button => button.addEventListener('click', () => selectAudience(button.closest('[data-audience]').dataset.audience)));
  $$('[data-audience-link]').forEach(link => link.addEventListener('click', () => selectAudience(link.dataset.audienceLink)));

  const chapters = [
    { title: 'Get a clearer<br> picture.', description: "Start with where you are, what you want, and what still feels uncertain. You don't need to have it all figured out." },
    { title: 'Capture what<br> matters.', description: "The records tell one part of the story. The everyday know-how, trusted relationships, and people tell the rest." },
    { title: 'Start the right<br> conversation.', description: "Turn the questions into a practical next-step plan. Keep it, share it with your adviser, and decide what comes next." }
  ];
  let activeChapter = -1;
  let chapterOverrideUntil = 0;
  function setChapter(index, animate = false) {
    if (activeChapter === index) return;
    activeChapter = index;
    $('#chapter-number').textContent = `0${index + 1}`;
    $('#chapter-title').innerHTML = chapters[index].title;
    $('#chapter-description').textContent = chapters[index].description;
    $$('.chapter-button').forEach((button, i) => { button.classList.toggle('is-active', i === index); button.setAttribute('aria-pressed', String(i === index)); });
    $$('.sheet-row').forEach((row, i) => row.classList.toggle('complete', i <= index));
    if (animate && !motionPaused && window.gsap) gsap.fromTo(['#chapter-title', '#chapter-description'], { opacity: .35, y: 10 }, { opacity: 1, y: 0, stagger: .06, duration: .45, ease: 'power2.out', overwrite: true });
  }
  $$('.chapter-button').forEach(button => button.addEventListener('click', () => { chapterOverrideUntil = performance.now() + 2200; setChapter(Number(button.dataset.chapter), true); }));
  setChapter(0);

  // Keep the readable document order and a static fallback if animation is unavailable.
  const manifesto = $('.manifesto-text');
  [...manifesto.childNodes].forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const fragment = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(word => { if (/\S/.test(word)) { const span = document.createElement('span'); span.className = 'manifesto-word'; span.textContent = word; fragment.append(span); } else fragment.append(document.createTextNode(word)); });
      node.replaceWith(fragment);
    }
  });
  function setupAnimation(entrance = false) {
    if (animationContext) { animationContext.revert(); animationContext = null; }
    document.documentElement.classList.toggle('is-motion-paused', motionPaused);
    $$('.motion-toggle').forEach(button => { button.setAttribute('aria-pressed', String(motionPaused)); $('.motion-label', button).textContent = motionPaused ? 'Enable motion' : 'Pause motion'; });
    if (motionPaused || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    animationContext = gsap.context(() => {
      if (entrance) {
        const opening = gsap.timeline({ defaults: { ease: 'power3.out' } });
        opening.from('.hero-line', { y: 28, opacity: 0, duration: .85, stagger: .11 })
          .from(['.hero-description', '.hero-actions', '.hero-note'], { y: 15, opacity: 0, duration: .65, stagger: .08 }, '-=.65')
          .from('.hero-photo', { opacity: 0, scale: .91, duration: 1.1, stagger: .12 }, '-=.7');
      }
      gsap.to('.photo-left', { y: -10, rotationZ: -2.4, duration: 5.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.photo-center', { y: -8, duration: 5.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.photo-right', { y: 8, rotationZ: 2.4, duration: 5.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.reading-progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: .2 } });
      gsap.fromTo('.manifesto-word', { opacity: .25 }, { opacity: 1, stagger: .15, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top 75%', end: 'bottom 65%', scrub: .5 } });
      gsap.fromTo('.hero-stage', { scale: 1 }, { scale: .94, opacity: .65, ease: 'none', scrollTrigger: { trigger: '.hero-stage', start: 'top 30%', end: 'bottom top', scrub: .6 } });
      ['.section-heading', '.faq-intro', '.final-cta h2'].forEach(selector => gsap.from(selector, { y: 26, opacity: 0, duration: .8, scrollTrigger: { trigger: selector, start: 'top 90%', once: true } }));
      gsap.from('.audience-panels', { y: 30, opacity: 0, duration: .9, scrollTrigger: { trigger: '.audience-panels', start: 'top 90%', once: true } });
      if (matchMedia('(min-width: 701px)').matches) {
        gsap.fromTo('.plan-sheet', { rotation: 10, y: 35 }, { rotation: 2, y: -16, ease: 'none', scrollTrigger: { trigger: '.journey-scroll', start: 'top 65%', end: 'bottom 90%', scrub: .8 } });
        gsap.fromTo('.keys-photo', { scale: .88, rotation: -9 }, { scale: 1.03, rotation: -3, ease: 'none', scrollTrigger: { trigger: '.journey-scroll', start: 'top 65%', end: 'bottom 90%', scrub: .8 } });
        ScrollTrigger.create({ trigger: '.journey-scroll', start: 'top 25%', end: 'bottom 95%', onUpdate: self => { if (performance.now() > chapterOverrideUntil) setChapter(Math.min(2, Math.floor(self.progress * 3)), true); } });
      }
    });
  }
  $$('.motion-toggle').forEach(button => button.addEventListener('click', () => { motionPaused = !motionPaused; setupAnimation(); if (motionPaused) $('#brand-film').pause(); }));
  reducedMotion.addEventListener('change', event => { motionPaused = event.matches; setupAnimation(); });
  const widthMedia = matchMedia('(min-width: 701px)');
  widthMedia.addEventListener('change', () => { closeMenu(); setupAnimation(); });
  setupAnimation(true);

  $('#watch-story').addEventListener('click', () => { openDialog($('#film-dialog')); const video = $('#brand-film'); video.currentTime = 0; video.play().catch(() => {}); });
  $$('[data-privacy]').forEach(button => button.addEventListener('click', () => openDialog($('#privacy-dialog'))));

  const roles = { owner: { label: 'Business owner', title: 'I built a business.', description: 'Make what you know easier to pass on.' }, operator: { label: 'Future operator', title: 'I want to run one.', description: 'Prepare for the work behind ownership.' }, adviser: { label: 'Adviser', title: 'I help owners move forward.', description: 'Bring clarity to a handover conversation.' } };
  const horizons = { exploring: 'Just exploring', years: 'In the next few years', year: 'Within a year', now: 'Already in a transition' };
  const answers = { yes: 'Yes', partly: 'Partly', notyet: 'Not yet', unknown: 'Not sure' };
  const dimensions = [
    { id: 'records', title: 'Make the records easier to understand.', owner: 'Are recent financial records organized and understandable?', operator: 'Do you know which financial records you would need to review?', ownerAction: 'Gather the records you already have and list what is missing. Agree the next document request with your accountant or adviser.', operatorAction: 'Write a document-request list with an accountant or adviser before evaluating a specific business.' },
    { id: 'work', title: 'Bring the everyday work into view.', owner: 'Could someone else see how the essential work gets done?', operator: 'Do you understand the day-to-day work you would be taking on?', ownerAction: 'Choose one essential weekly task. Document how it works, who owns it, and what a new operator would need to learn.', operatorAction: 'Map the essential operating responsibilities. Identify which you can handle and where you need training or an experienced partner.' },
    { id: 'people', title: 'Identify the people and support you need.', owner: 'Is it clear which responsibilities need a successor or support?', operator: 'Have you identified the experience and support you would need?', ownerAction: 'List responsibilities that depend on you. Discuss who could take them on and what support or transition time they would need.', operatorAction: 'Describe your strengths and gaps. Identify an operator, mentor, or adviser who can help test your assumptions.' },
    { id: 'relationships', title: 'Capture the relationships that matter.', owner: 'Are key customer, supplier, and lease relationships documented?', operator: 'Do you know which customer, supplier, and lease relationships need investigation?', ownerAction: 'Map the key customer, supplier, and property relationships. Note terms or permissions that an adviser should review.', operatorAction: 'List the relationships a business depends on. Ask what would need to continue or change under new ownership.' },
    { id: 'decision', title: 'Choose the next conversation.', owner: 'Is there a clear next decision and someone qualified to help?', operator: 'Is there a clear next decision and someone qualified to help?', ownerAction: 'Write down one decision you need to make and who can help. Bring your open questions to that conversation.', operatorAction: 'Pick one decision to clarify with a qualified adviser. Explore what evidence you need before committing to a transaction.' }
  ];
  let state = { step: 0, role: '', horizon: '', answers: {} };
  let currentPriorities = [];
  const checkDialog = $('#assessment-dialog');
  const questionFor = dim => state.role === 'operator' ? dim.operator : dim.owner;
  const actionFor = dim => state.role === 'operator' ? dim.operatorAction : dim.ownerAction;
  const progress = step => `<div class="step-progress" aria-label="Step ${step + 1} of 3">${[0,1,2].map(i => `<i class="${i <= step ? 'active' : ''}"></i>`).join('')}<span>${step + 1} / 3</span></div>`;
  const footer = (step, label = 'Continue') => `<p class="field-error" id="assessment-error" role="alert"></p><div class="step-footer">${step ? '<button type="button" class="back-button" id="check-back">← Back</button>' : '<span></span>'}<button class="button" type="submit">${label} ${arrow}</button></div><p class="private-note">Your answers stay in this page. No account or financial documents needed.</p>`;
  function renderCheck(focus = true) {
    const container = $('#assessment-content');
    if (state.step === 0) {
      container.innerHTML = `<form id="check-form" class="assessment-body" novalidate>${progress(0)}<h2 id="assessment-title" tabindex="-1">Where does your<br> next chapter start?</h2><p class="step-description">Choose the perspective that feels like you.</p><div class="choice-list">${Object.entries(roles).map(([key, role]) => `<label class="choice"><input type="radio" name="role" value="${key}" ${state.role === key ? 'checked' : ''} required><span><strong>${role.title}</strong><small>${role.description}</small></span></label>`).join('')}</div>${footer(0)}</form>`;
    } else if (state.step === 1) {
      container.innerHTML = `<form id="check-form" class="assessment-body" novalidate>${progress(1)}<h2 id="assessment-title" tabindex="-1">What's your<br> time horizon?</h2><p class="step-description">It's okay if you're still figuring it out.${state.role === 'adviser' ? ' Think about one client situation, without including identifying details.' : ''}</p><div class="choice-list">${Object.entries(horizons).map(([key, label]) => `<label class="choice"><input type="radio" name="horizon" value="${key}" ${state.horizon === key ? 'checked' : ''} required><span><strong>${label}</strong></span></label>`).join('')}</div>${footer(1)}</form>`;
    } else if (state.step === 2) {
      container.innerHTML = `<form id="check-form" class="assessment-body" novalidate>${progress(2)}<h2 id="assessment-title" tabindex="-1">What's clear<br> already?</h2><p class="step-description">A few honest answers make a more useful starting point. “Not sure” is a perfectly good answer.</p>${dimensions.map(dim => `<fieldset class="question-group"><legend>${questionFor(dim)}</legend><div class="answer-options">${Object.entries(answers).map(([key, label]) => `<label><input type="radio" name="${dim.id}" value="${key}" ${state.answers[dim.id] === key ? 'checked' : ''} required><span>${label}</span></label>`).join('')}</div></fieldset>`).join('')}${footer(2, 'See my next steps')}</form>`;
    } else { renderResult(); return; }
    $('#check-form').addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      let missing;
      if (state.step === 0) { missing = !data.get('role'); if (!missing) { if (state.role && state.role !== data.get('role')) state.answers = {}; state.role = data.get('role'); } }
      if (state.step === 1) { missing = !data.get('horizon'); if (!missing) state.horizon = data.get('horizon'); }
      if (state.step === 2) { dimensions.forEach(dim => { if (data.get(dim.id)) state.answers[dim.id] = data.get(dim.id); }); missing = dimensions.some(dim => !data.get(dim.id)); }
      if (missing) { $('#assessment-error').textContent = state.step === 2 ? 'Please choose an answer for each question. “Not sure” is welcome.' : 'Choose an option to continue.'; const firstEmpty = state.step === 2 ? dimensions.find(dim => !data.get(dim.id)).id : state.step === 0 ? 'role' : 'horizon'; $(`input[name="${firstEmpty}"]`).focus(); return; }
      state.step++; renderCheck();
    });
    $('#check-back')?.addEventListener('click', () => { saveCurrentAnswers(); state.step--; renderCheck(); });
    if (focus) { $('#assessment-title').focus({ preventScroll: true }); checkDialog.scrollTop = 0; }
  }
  function saveCurrentAnswers() {
    const form = $('#check-form'); if (!form) return;
    const data = new FormData(form);
    if (state.step === 1 && data.get('horizon')) state.horizon = data.get('horizon');
    if (state.step === 2) dimensions.forEach(dim => { if (data.get(dim.id)) state.answers[dim.id] = data.get(dim.id); });
  }
  function getPriorities() {
    const unresolved = dimensions.filter(dim => state.answers[dim.id] !== 'yes');
    const order = { notyet: 0, unknown: 1, partly: 2, yes: 3 };
    unresolved.sort((a, b) => order[state.answers[a.id]] - order[state.answers[b.id]]);
    if (!unresolved.length) return [
      { title: 'Test your starting point with someone qualified.', action: 'Your answers suggest a useful starting point. Ask an adviser to review the underlying records and assumptions before drawing conclusions.' },
      { title: 'Agree the next decision.', action: 'Choose one question to resolve and the people who should be involved. A positive self-check does not establish that a business is ready to sell or buy.' },
      { title: 'Keep the handover practical.', action: 'Discuss how responsibilities, relationships, and everyday knowledge would actually pass from one operator to another.' }
    ];
    return unresolved.slice(0, 3).map(dim => ({ title: dim.title, action: actionFor(dim) }));
  }
  function renderResult() {
    currentPriorities = getPriorities();
    const horizonNote = state.horizon === 'now' ? 'Since a transition is already underway, bring these questions to the people supporting it soon.' : state.horizon === 'year' ? 'With a transition in view, agree an order of work and review it with your adviser.' : 'You can take this at your own pace. Begin with one useful conversation.';
    $('#assessment-content').innerHTML = `<div class="assessment-body result-body"><div class="result-badge"><svg><use href="#check"/></svg>Your starting point, made clearer</div><h2 id="assessment-title" tabindex="-1">Your next chapter<br> starts here.</h2><p class="step-description">${horizonNote}</p><div class="result-context"><span>${roles[state.role].label}</span><span>${horizons[state.horizon]}</span></div><ol class="priority-list">${currentPriorities.map(item => `<li><strong>${item.title}</strong><p>${item.action}</p></li>`).join('')}</ol><div class="result-buttons"><button class="button" id="download-plan">Download my plan ${arrow}</button><button class="button outline" id="copy-plan">Copy plan</button></div><div class="result-links"><button id="review-answers">Review my answers</button><button id="start-again">Start again</button></div><p class="private-note">Based on your answers. This is a preparation checklist, not a valuation or professional review. Download format: plain text.</p><p id="plan-status" class="private-note" role="status"></p></div>`;
    $('#download-plan').addEventListener('click', () => { const blob = new Blob([buildPlanText()], { type: 'text/plain;charset=utf-8' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'maychant-next-step-plan.txt'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000); $('#plan-status').textContent = 'Your plan download is ready. Keep it for your next conversation.'; });
    $('#copy-plan').addEventListener('click', async () => { try { await navigator.clipboard.writeText(buildPlanText()); $('#plan-status').textContent = 'Plan copied to your clipboard.'; } catch { $('#plan-status').textContent = 'Clipboard access is unavailable. Use Download my plan instead.'; } });
    $('#review-answers').addEventListener('click', () => { state.step = 2; renderCheck(); });
    $('#start-again').addEventListener('click', () => { state = { step: 0, role: '', horizon: '', answers: {} }; renderCheck(); });
    $('#assessment-title').focus({ preventScroll: true }); checkDialog.scrollTop = 0;
  }
  function buildPlanText() {
    return [
      'MAYCHANT — YOUR NEXT-STEP PLAN',
      `Created: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      `Perspective: ${roles[state.role].label}`, `Time horizon: ${horizons[state.horizon]}`, '',
      'YOUR PRIORITIES', ...currentPriorities.flatMap((item, i) => [`${i + 1}. ${item.title}`, item.action, '']),
      'YOUR ANSWERS', ...dimensions.map(dim => `${questionFor(dim)} — ${answers[state.answers[dim.id]]}`), '',
      'TAKE INTO YOUR NEXT CONVERSATION', '• What is the next decision to make?', '• Which records or assumptions should someone qualified review?', '• Who needs to be involved, and what is the first practical action?', '',
      'This is a preparation checklist based on your own answers, not a valuation, professional review, financing decision, or confirmation that a business is ready to sell or buy.',
      'Your answers were kept in this browser page and were not submitted to Maychant.', '', 'Good businesses. Great next chapters. — Maychant'
    ].join('\n');
  }
  $$('[data-start]').forEach(button => button.addEventListener('click', () => { state = { step: 0, role: button.dataset.start || '', horizon: '', answers: {} }; renderCheck(false); openDialog(checkDialog); $('#assessment-title').focus({ preventScroll: true }); }));

  let contactText = '';
  function updateContact() {
    const role = $('#contact-role').value;
    const note = $('#contact-note').value.trim();
    contactText = `Hello Krish,\n\nI'm interested in Maychant as a ${role}.\n\n${note || "I'd like to learn more and share what would make business succession easier."}\n\nThanks,`;
    $('#email-draft').href = `mailto:krishdw@umich.edu?subject=${encodeURIComponent('Maychant — a conversation about my next chapter')}&body=${encodeURIComponent(contactText)}`;
  }
  $$('[data-contact]').forEach(button => button.addEventListener('click', () => { $('#contact-status').textContent = ''; updateContact(); openDialog($('#contact-dialog')); }));
  $('#contact-role').addEventListener('change', updateContact);
  $('#contact-note').addEventListener('input', updateContact);
  $('#email-draft').addEventListener('click', () => { $('#contact-status').textContent = 'Your draft is ready. Review and send it from your email app to share your interest.'; });
  $('#copy-message').addEventListener('click', async () => { updateContact(); try { await navigator.clipboard.writeText(`To: krishdw@umich.edu\nSubject: Maychant — a conversation about my next chapter\n\n${contactText}`); $('#contact-status').textContent = 'Message copied. Paste it into an email to krishdw@umich.edu when you are ready.'; } catch { $('#contact-status').textContent = 'Clipboard access is unavailable. You can use Open email draft or email krishdw@umich.edu directly.'; } });
  updateContact();
})();
