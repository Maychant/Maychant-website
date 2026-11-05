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
    const neighborhood = $('.hero-world');
    const shopOrder = ['records', 'cafe', 'workshop'];
    let shopIndex = 1;
    let sceneTimer;
    let sceneInView = true;
    let manualScene = false;
    function focusShop(shop, manual = false) {
      const index = shopOrder.indexOf(shop);
      if (index < 0) return;
      shopIndex = index;
      neighborhood.dataset.shop = shop;
      $$('[data-shop-focus]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.shopFocus === shop)));
      if (manual) { manualScene = true; clearInterval(sceneTimer); }
    }
    function cycleNeighborhood() {
      clearInterval(sceneTimer);
      if (paused || manualScene || !sceneInView || document.hidden) return;
      sceneTimer = setInterval(() => focusShop(shopOrder[(shopIndex + 1) % shopOrder.length]), 4800);
    }
    $$('[data-shop-focus]').forEach(button => button.addEventListener('click', () => focusShop(button.dataset.shopFocus, true)));
    $$('.district-shop').forEach(shop => shop.addEventListener('click', () => focusShop(shop.dataset.shop, true)));
    const sceneObserver = new IntersectionObserver(entries => {
      sceneInView = entries[0].isIntersecting;
      neighborhood.classList.toggle('scene-offscreen', !sceneInView);
      cycleNeighborhood();
    }, { threshold: .15 });
    sceneObserver.observe(neighborhood);
    document.addEventListener('visibilitychange', cycleNeighborhood);
    const success = $('#waitlist-success');
    const submit = $('.submit-button');
    function selectRole(role) {
      const radio = $(`input[name="role"][value="${role}"]`, form);
      if (radio) radio.checked = true;
      if (!success.hidden) { success.hidden = true; form.hidden = false; }
    }
    $$('[data-role]').forEach(link => link.addEventListener('click', () => selectRole(link.dataset.role)));
    function selectAudience(role, focus = false) {
      $$('[data-tab]').forEach(button => {
        const active = button.dataset.tab === role;
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
        $(`#${button.getAttribute('aria-controls')}`).hidden = !active;
        if (active && focus) button.focus();
      });
    }
    $$('[data-tab]').forEach(button => {
      button.addEventListener('click', () => selectAudience(button.dataset.tab));
      button.addEventListener('keydown', event => {
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
          event.preventDefault();
          const role = event.key === 'Home' ? 'buyer' : event.key === 'End' ? 'seller' : button.dataset.tab === 'buyer' ? 'seller' : 'buyer';
          selectAudience(role, true);
        }
      });
    });
    $$('[data-audience]').forEach(link => link.addEventListener('click', () => selectAudience(link.dataset.audience)));
    const privacy = $('.privacy-dialog');
    $$('[data-privacy]').forEach(button => button.addEventListener('click', () => privacy.showModal()));
    $('[data-close]', privacy).addEventListener('click', () => privacy.close());
    privacy.addEventListener('click', event => { const r = privacy.getBoundingClientRect(); if (event.target === privacy && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) privacy.close(); });
    function animate(entrance = false) {
      if (motion) { motion.revert(); motion = null; }
      document.documentElement.classList.toggle('motion-paused', paused);
      $$('.motion-toggle').forEach(button => {
        button.setAttribute('aria-pressed', String(paused));
        button.disabled = reduced.matches;
        button.setAttribute('aria-label', reduced.matches ? 'Animation off: system reduced-motion preference' : paused ? 'Enable animation' : 'Pause animation');
        $('.motion-label', button).textContent = reduced.matches ? 'Reduced motion' : paused ? 'Play motion' : button.closest('.street-footer') ? 'Pause' : 'Pause motion';
        const icon = $('.motion-icon', button); if (icon) icon.textContent = reduced.matches ? '−' : paused ? '▷' : 'Ⅱ';
      });
      cycleNeighborhood();
      if (paused || !window.gsap) return;
      motion = gsap.context(() => {
        if (entrance) {
          gsap.from('.hero-copy > *', { opacity: 0, y: 15, duration: .8, stagger: .08, ease: 'power3.out' });
          gsap.from('.street-building', { opacity: 0, y: 25, duration: 1, stagger: .12, ease: 'power3.out', delay: .2 });
        }
        if (window.ScrollTrigger) {
          gsap.registerPlugin(ScrollTrigger);
          ['.belief', '.people-top', '.waitlist-copy', '.questions h2'].forEach(selector => gsap.from(selector, { opacity: .2, y: 22, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: selector, start: 'top 94%', once: true } }));
        }
      });
    }
    $$('.motion-toggle').forEach(button => button.addEventListener('click', () => { paused = !paused; animate(); }));
    reduced.addEventListener('change', event => { paused = event.matches; animate(); });
    animate(true);
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
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true }); else init();
})();
