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
    const waitlist = $('#waitlist-dialog');
    const privacy = $('.privacy-dialog');
    let waitlistOpener;
    let privacyOpener;
    let scrollLocked = false;
    let previousOverflow = '';

    function syncScrollLock() {
      const anyDialogOpen = Boolean($('dialog[open]'));
      if (anyDialogOpen && !scrollLocked) {
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        scrollLocked = true;
      } else if (!anyDialogOpen && scrollLocked) {
        document.body.style.overflow = previousOverflow;
        scrollLocked = false;
      }
    }
    function restoreFocus(element) {
      if (!element?.isConnected || element.closest('dialog:not([open])') || !element.getClientRects().length) return false;
      element.focus({ preventScroll: true });
      return document.activeElement === element;
    }
    function updateWaitlistTitle() {
      const heading = $('#waitlist-title');
      if (!heading) return;
      const role = $('input[name="role"]:checked', form)?.value;
      heading.textContent = role === 'buyer' ? 'Join the buyer waitlist.'
        : role === 'seller' ? 'Join the seller waitlist.'
        : 'Join the waitlist.';
    }
    function selectRole(role) {
      if (!['buyer', 'seller', 'both'].includes(role)) return;
      const radio = $(`input[name="role"][value="${role}"]`, form);
      if (radio) radio.checked = true;
      $$('input[name="role"]', form).forEach(input => input.removeAttribute('aria-invalid'));
      const error = $('[data-error="role"]', form);
      if (error) error.textContent = '';
    }
    function focusWaitlistField(input) {
      if (!input || !waitlist?.open || privacy?.open) return;
      input.focus({ preventScroll: true });
      const dialogTop = waitlist.getBoundingClientRect().top;
      const topbarHeight = $('.dialog-topbar', waitlist)?.getBoundingClientRect().height || 0;
      const targetTop = input.getBoundingClientRect().top - dialogTop + waitlist.scrollTop;
      waitlist.scrollTo({ top: Math.max(0, targetTop - topbarHeight - 32), behavior: 'instant' });
    }
    function focusWaitlist() {
      if (!waitlist?.open || privacy?.open) return;
      const target = success.hidden ? $('#waitlist-title') || $('#waitlist-name') : success;
      if (target) {
        if (!target.hasAttribute('tabindex') && target.tagName !== 'INPUT') target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
      waitlist.scrollTop = 0;
    }
    $$('[data-waitlist-open]').forEach(button => button.addEventListener('click', () => {
      if (!waitlist) return;
      waitlistOpener = button;
      // Reopening a saved signup must not quietly begin another registration.
      if (success.hidden) {
        if (!submitting) selectRole(button.dataset.role);
        updateWaitlistTitle();
      }
      if (!waitlist.open) waitlist.showModal();
      syncScrollLock();
      focusWaitlist();
    }));
    $$('input[name="role"]', form).forEach(input => input.addEventListener('change', updateWaitlistTitle));
    if (waitlist) {
      $$('[data-waitlist-close]', waitlist).forEach(button => button.addEventListener('click', () => waitlist.close()));
      waitlist.addEventListener('close', () => {
        syncScrollLock();
        if (!$('dialog[open]')) restoreFocus(waitlistOpener);
      });
    }
    $$('[data-privacy]').forEach(button => button.addEventListener('click', () => {
      if (!privacy) return;
      privacyOpener = button;
      if (!privacy.open) privacy.showModal();
      syncScrollLock();
    }));
    if (privacy) {
      $('[data-close]', privacy)?.addEventListener('click', () => privacy.close());
      privacy.addEventListener('close', () => {
        syncScrollLock();
        if (!restoreFocus(privacyOpener)) {
          if (waitlist?.open) focusWaitlist();
          else if (!$('dialog[open]')) restoreFocus(waitlistOpener);
        }
      });
    }
    [waitlist, privacy].filter(Boolean).forEach(dialog => {
      let startedOnBackdrop = false;
      const isBackdrop = event => {
        const rect = dialog.getBoundingClientRect();
        return event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right
          || event.clientY < rect.top || event.clientY > rect.bottom);
      };
      dialog.addEventListener('pointerdown', event => { startedOnBackdrop = isBackdrop(event); });
      dialog.addEventListener('click', event => {
        if (startedOnBackdrop && isBackdrop(event)) dialog.close();
        startedOnBackdrop = false;
      });
    });
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
      const payload = { name: String(values.get('name') || '').trim(), contact: String(values.get('contact') || '').trim(), role: values.get('role'), consent: true, website: String(values.get('website') || '') };
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
        focusWaitlist();
      } catch (error) {
        const message = error.name === 'AbortError' ? 'That took longer than expected. Please try again; you won’t be added twice.' : error instanceof TypeError ? 'We couldn’t connect. Check your connection and try again.' : error.message;
        $('#form-error').textContent = message;
        $('#form-error').hidden = false;
        const first = $('[aria-invalid="true"]', form);
        if (first) focusWaitlistField(first);
      } finally {
        clearTimeout(timeout);
        submitting = false;
        submit.disabled = false;
        form.removeAttribute('aria-busy');
        $('.submit-label').textContent = 'Join the waitlist';
      }
    });
    submit.disabled = false;
    // Match the glass navigation's foreground to the section directly beneath it.
    const header = $('.site-header');
    const darkChapter = $('.chapter');
    if (header && darkChapter) {
      let framePending = false;
      function syncHeaderSurface() {
        framePending = false;
        const nav = header.getBoundingClientRect();
        const dark = darkChapter.getBoundingClientRect();
        const midpoint = nav.top + nav.height / 2;
        header.dataset.surface = dark.top <= midpoint && dark.bottom > midpoint ? 'dark' : 'light';
      }
      function queueHeaderSurface() {
        if (!framePending) { framePending = true; requestAnimationFrame(syncHeaderSurface); }
      }
      window.addEventListener('scroll', queueHeaderSurface, { passive: true });
      window.addEventListener('resize', queueHeaderSurface, { passive: true });
      window.addEventListener('pageshow', queueHeaderSurface);
      if ('ResizeObserver' in window) new ResizeObserver(queueHeaderSurface).observe($('#main'));
      syncHeaderSurface();
    }
    $('#add-another').addEventListener('click', () => {
      form.reset(); clearErrors(); success.hidden = true; form.hidden = false;
      updateWaitlistTitle();
      if (waitlist?.open && !privacy?.open) {
        waitlist.scrollTop = 0;
        focusWaitlistField($('#waitlist-name'));
      }
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
        $$('[data-audience-select]').forEach(button => {
          const active = button.dataset.audienceSelect === role;
          button.setAttribute('aria-expanded', String(active));
          const details = $(`#${button.getAttribute('aria-controls')}`);
          if (details) details.inert = !active;
        });
        if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), paused ? 0 : 800);
      }
      $$('[data-audience-select]').forEach(button => button.addEventListener('click', () => selectAudience(button.dataset.audienceSelect)));
      $$('[data-audience]').forEach(link => link.addEventListener('click', () => selectAudience(link.dataset.audience)));
      $$('.audience-card').forEach(card => card.addEventListener('click', event => {
        if (event.target.closest('button,a')) return;
        selectAudience(card.id === 'buyer-panel' ? 'buyer' : 'seller');
      }));
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
        chapterButtons.forEach(button => {
          const active = button.dataset.chapter === key;
          button.setAttribute('aria-expanded', String(active));
          button.closest('.chapter-item').dataset.expanded = String(active);
          const detail = $(`#${button.getAttribute('aria-controls')}`);
          if (detail) detail.inert = !active;
          if (active && focus) button.focus();
        });
        if (window.ScrollTrigger) setTimeout(() => ScrollTrigger.refresh(), paused ? 0 : 650);
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
            ['.people-top', '.chapter-heading', '.closing-invite', '.questions h2'].forEach(selector => gsap.from(selector, { opacity: .25, y: 28, duration: .9, ease: 'power3.out', clearProps: 'opacity,transform', scrollTrigger: { trigger: selector, start: 'top 93%', once: true } }));
            gsap.from('.audience-card', { y: 60, opacity: .4, duration: 1, stagger: .18, ease: 'power3.out', clearProps: 'opacity,transform', scrollTrigger: { trigger: '.audience-spread', start: 'top 88%', once: true } });
            const scroll = { trigger: '.chapter-stage', start: 'top 95%', end: 'bottom 15%', scrub: 1 };
            gsap.fromTo('.chapter-paper', { y: 45, rotation: -8 }, { y: -12, rotation: 1.5, ease: 'none', scrollTrigger: scroll });
            gsap.fromTo('.paper-back-one', { rotation: -7, x: 0 }, { rotation: -15, x: -12, ease: 'none', scrollTrigger: scroll });
            gsap.fromTo('.paper-back-two', { rotation: 5, x: 0 }, { rotation: 13, x: 12, ease: 'none', scrollTrigger: scroll });
            gsap.to('.chapter-orbit', { rotation: 25, ease: 'none', scrollTrigger: scroll });
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
