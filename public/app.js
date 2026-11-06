(() => {
  'use strict';
  function init() {
    const form = document.querySelector('#waitlist-form');
    if (!form || form.dataset.ready) return;
    form.dataset.ready = 'true';
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let paused = reduced.matches;
    let motion;
    let submitting = false;
    const success = $('#waitlist-success');
    const submit = $('.submit-button');
    function selectRole(role) {
      const radio = $(`input[name="role"][value="${role}"]`, form);
      if (radio) radio.checked = true;
      if (!success.hidden) { success.hidden = true; form.hidden = false; }
    }
    $$('[data-role]').forEach(link => link.addEventListener('click', () => selectRole(link.dataset.role)));
    const privacy = $('.privacy-dialog');
    $$('[data-privacy]').forEach(button => button.addEventListener('click', () => privacy.showModal()));
    $('[data-close]', privacy).addEventListener('click', () => privacy.close());
    privacy.addEventListener('click', event => { const r = privacy.getBoundingClientRect(); if (event.target === privacy && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) privacy.close(); });
    function clearErrors() {
      $('#form-error').hidden = true;
      $$('[data-error]', form).forEach(e => e.textContent = '');
      $$('[aria-invalid]', form).forEach(e => e.removeAttribute('aria-invalid'));
    }
    form.addEventListener('input', event => {
      if (event.target.name) {
        const message = $(`[data-error="${event.target.name}"]`, form);
        if (message) message.textContent = '';
        event.target.removeAttribute('aria-invalid');
      }
    });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (submitting || !form.reportValidity()) return;
      clearErrors();
      submitting = true;
      submit.disabled = true;
      form.setAttribute('aria-busy', 'true');
      $('.submit-label').textContent = 'Joining…';
      const values = new FormData(form);
      const payload = { name: String(values.get('name') || '').trim(), email: String(values.get('email') || '').trim(), role: values.get('role'), location: String(values.get('location') || '').trim(), consent: values.get('consent') === 'on', website: String(values.get('website') || '') };
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
        const result = await response.json();
        if (!response.ok || result.ok !== true) {
          Object.entries(result.fields || {}).forEach(([name, message]) => {
            const output = $(`[data-error="${name}"]`, form);
            if (output) output.textContent = String(message);
            const input = $(`[name="${name}"]`, form);
            if (input) input.setAttribute('aria-invalid', 'true');
          });
          throw new Error(result.error || 'We couldn’t save your place. Please try again.');
        }
        form.hidden = true;
        success.hidden = false;
        success.focus({ preventScroll: true });
        success.scrollIntoView({ block: 'center', behavior: paused ? 'instant' : 'smooth' });
      } catch (error) {
        const message = error.name === 'AbortError' ? 'That took longer than expected. Please try again; you won’t be added twice.' : error instanceof TypeError ? 'We couldn’t connect. Check your connection and try again.' : error.message;
        $('#form-error').textContent = message;
        $('#form-error').hidden = false;
        const first = $('[aria-invalid="true"]', form); if (first) first.focus();
      } finally {
        clearTimeout(timeout);
        submitting = false;
        submit.disabled = false;
        form.removeAttribute('aria-busy');
        $('.submit-label').textContent = 'Join the waitlist';
      }
    });
    submit.disabled = false;
    $('#add-another').addEventListener('click', () => {
      form.reset(); clearErrors(); success.hidden = true; form.hidden = false;
      $('#waitlist-name').focus();
    });
    function initExperience() {
      const neighborhood = $('.hero-world');
      const shops = $$('.district-shop');
      shops.forEach(shop => {
        function activate() {
          const wasActive = shop.getAttribute('aria-pressed') === 'true';
          shops.forEach(other => other.setAttribute('aria-pressed', String(other === shop && !wasActive)));
        }
        shop.addEventListener('click', activate);
        shop.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); }
        });
      });
      if (neighborhood && 'IntersectionObserver' in window) {
        const sceneObserver = new IntersectionObserver(entries => neighborhood.classList.toggle('scene-offscreen', !entries[0].isIntersecting), { threshold: .1 });
        sceneObserver.observe(neighborhood);
      }
      function selectAudience(role) {
        if (!['buyer', 'seller'].includes(role)) return;
        $('#people').dataset.active = role;
        $$('[data-audience-select]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.audienceSelect === role)));
      }
      $$('[data-audience-select]').forEach(button => button.addEventListener('click', () => selectAudience(button.dataset.audienceSelect)));
      $$('[data-audience]').forEach(link => link.addEventListener('click', () => selectAudience(link.dataset.audience)));
      const chapters = {
        people: { title: 'Familiar faces.<br>New beginnings.', description: 'The team that knows the ropes. The customers who keep coming back. The relationships that make a business, a business.', index: '01 / 03' },
        knowledge: { title: 'Years of practice.<br>A head start.', description: 'The little details no manual can teach. How the work gets done, who to call, and what makes this business its own.', index: '02 / 03' },
        future: { title: 'A strong foundation.<br>Room to grow.', description: 'Keep the things people love. Bring a fresh perspective to the rest. A new owner can build on a story that is already worth telling.', index: '03 / 03' }
      };
      const chapterButtons = $$('.chapter-step');
      function selectChapter(key, focus = false) {
        const chapter = chapters[key]; if (!chapter) return;
        const paper = $('.chapter-paper');
        $('.chapter-object').dataset.chapter = key;
        paper.setAttribute('aria-labelledby', `chapter-tab-${key}`);
        $('.paper-title').innerHTML = chapter.title;
        $('.paper-description').textContent = chapter.description;
        $('.paper-index').textContent = chapter.index;
        chapterButtons.forEach(button => { const active = button.dataset.chapter === key; button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; if (active && focus) button.focus(); });
        paper.classList.remove('is-changing');
        if (!paused) { void paper.offsetWidth; paper.classList.add('is-changing'); }
      }
      chapterButtons.forEach((button, index) => {
        button.addEventListener('click', () => selectChapter(button.dataset.chapter));
        button.addEventListener('keydown', event => {
          if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowDown' ? 1 : 2)) % 3;
          selectChapter(chapterButtons[next].dataset.chapter, true);
        });
      });
      function animate(entrance = false) {
        if (motion) { motion.revert(); motion = null; }
        document.documentElement.classList.toggle('motion-paused', paused);
        $$('.motion-toggle').forEach(button => {
          button.setAttribute('aria-pressed', String(paused)); button.disabled = reduced.matches;
          button.setAttribute('aria-label', reduced.matches ? 'Animation off: system reduced-motion preference' : paused ? 'Enable animation' : 'Pause animation');
          $('.motion-label', button).textContent = reduced.matches ? 'Reduced motion' : paused ? 'Play motion' : 'Pause motion';
          const icon = $('.motion-icon', button); if (icon) icon.textContent = reduced.matches ? '−' : paused ? '▷' : 'Ⅱ';
        });
        if (paused || !window.gsap) return;
        motion = gsap.context(() => {
          if (entrance) {
            gsap.from('.hero-copy > *', { opacity: 0, y: 20, duration: .85, stagger: .09, ease: 'power3.out', clearProps: 'opacity,transform' });
            gsap.from('.district-reveal', { opacity: 0, y: 80, scale: .88, rotation: -3, duration: 1.15, stagger: .23, delay: .45, ease: 'back.out(1.25)', clearProps: 'opacity,transform' });
          }
          if (window.ScrollTrigger) {
            gsap.registerPlugin(ScrollTrigger);
            ['.belief h2', '.belief-bottom', '.people-top', '.chapter-heading', '.waitlist-copy', '.questions h2'].forEach(selector => gsap.from(selector, { opacity: .25, y: 28, duration: .9, ease: 'power3.out', clearProps: 'opacity,transform', scrollTrigger: { trigger: selector, start: 'top 93%', once: true } }));
            gsap.from('.audience-card', { y: 60, opacity: .4, duration: 1, stagger: .18, ease: 'power3.out', clearProps: 'opacity,transform', scrollTrigger: { trigger: '.audience-spread', start: 'top 88%', once: true } });
            const scroll = { trigger: '.chapter-stage', start: 'top 95%', end: 'bottom 15%', scrub: 1 };
            gsap.fromTo('.chapter-paper', { y: 45, rotation: -8 }, { y: -12, rotation: 1.5, ease: 'none', scrollTrigger: scroll });
            gsap.fromTo('.paper-back-one', { rotation: -7, x: 0 }, { rotation: -15, x: -12, ease: 'none', scrollTrigger: scroll });
            gsap.fromTo('.paper-back-two', { rotation: 5, x: 0 }, { rotation: 13, x: 12, ease: 'none', scrollTrigger: scroll });
            gsap.to('.chapter-orbit', { rotation: 25, ease: 'none', scrollTrigger: scroll });
            gsap.fromTo('.belief-mark', { rotation: -20 }, { rotation: 35, ease: 'none', scrollTrigger: { trigger: '.belief', start: 'top bottom', end: 'bottom top', scrub: 1 } });
            document.fonts.ready.then(() => ScrollTrigger.refresh());
          }
        });
      }
      $$('.motion-toggle').forEach(button => button.addEventListener('click', () => { paused = !paused; animate(); }));
      reduced.addEventListener('change', event => { paused = event.matches; animate(); });
      animate(true);
    }
    // Optional motion must never prevent the waitlist from becoming usable.
    try { initExperience(); } catch (error) { console.warn('Maychant motion unavailable.', error); }

  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
