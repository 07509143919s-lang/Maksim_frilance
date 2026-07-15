(() => {
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('.progress span');
  const cursor = document.querySelector('.cursor');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  let lastY = 0;

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${Math.min(100, (y / max) * 100)}%`;
    header.classList.toggle('scrolled', y > 30 && !header.classList.contains('menu-open'));
    if (y > 450 && y > lastY + 8) header.classList.add('hide');
    if (y < lastY - 8) header.classList.remove('hide');
    lastY = Math.max(0, y);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (matchMedia('(pointer:fine)').matches) {
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
    addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    const loop = () => {
      x += (tx - x) * .18; y += (ty - y) * .18;
      cursor.style.transform = `translate(${x - 17}px,${y - 17}px)`;
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll('a,button,input,textarea').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    document.querySelectorAll('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.12}px)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
  }

  menuButton.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    menuButton.setAttribute('aria-expanded', String(open));
    header.classList.toggle('menu-open', open);
    body.style.overflow = open ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menuButton.click()));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .14 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const wordReveal = document.querySelector('.word-reveal');
  if (wordReveal) {
    wordReveal.innerHTML = wordReveal.textContent.trim().split(/\s+/).map(w => `<span class="word">${w}</span>`).join(' ');
    const words = [...wordReveal.querySelectorAll('.word')];
    const updateWords = () => {
      const rect = wordReveal.getBoundingClientRect();
      const start = innerHeight * .78;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (rect.height * .78)));
      const count = Math.ceil(words.length * progress);
      words.forEach((w,i) => w.classList.toggle('on', i < count));
    };
    addEventListener('scroll', updateWords, { passive:true }); updateWords();
  }

  const orbit = document.querySelector('.hero-orbit');
  if (orbit && matchMedia('(pointer:fine)').matches) {
    orbit.addEventListener('mousemove', e => {
      const r = orbit.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width/2) / r.width;
      const dy = (e.clientY - r.top - r.height/2) / r.height;
      orbit.querySelectorAll('[data-depth]').forEach(n => {
        const d = Number(n.dataset.depth || 10);
        const base = n.classList.contains('core') ? 'translate(-50%,-50%) ' : '';
        n.style.transform = `${base}translate(${dx*d}px,${dy*d}px)`;
      });
    });
    orbit.addEventListener('mouseleave', () => orbit.querySelectorAll('[data-depth]').forEach(n => {
      n.style.transform = n.classList.contains('core') ? 'translate(-50%,-50%)' : '';
    }));
  }

  document.querySelectorAll('.service-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.service-item');
      document.querySelectorAll('.service-item').forEach(x => x !== item && x.classList.remove('active'));
      item.classList.toggle('active');
    });
  });

  const clock = document.getElementById('clock');
  const tick = () => { clock.textContent = new Date().toLocaleTimeString('ru-RU', {hour12:false}); };
  tick(); setInterval(tick,1000);

  const form = document.getElementById('lead-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      form.querySelector('.form-success').classList.add('show');
      form.querySelector('.submit-btn span').textContent = 'Задача отправлена';
    });
  }

  // Portfolio loading sequence: brief enough not to annoy, deliberate enough to set the tone.
  const loader = document.querySelector('.loader');
  const loaderCount = document.querySelector('[data-loader-count]');
  const loaderLine = document.querySelector('.loader-track i');
  let loadValue = 0;
  const loadTimer = setInterval(() => {
    loadValue = Math.min(100, loadValue + Math.ceil((100 - loadValue) * .16) + 2);
    loaderCount.textContent = String(loadValue).padStart(2, '0');
    loaderLine.style.width = `${loadValue}%`;
    if (loadValue >= 100) {
      clearInterval(loadTimer);
      setTimeout(() => {
        loader.classList.add('done');
        body.classList.remove('is-loading');
        setTimeout(() => loader.remove(), 1000);
      }, 180);
    }
  }, 45);

  document.querySelectorAll('.scene-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.scene-card');
      const opening = !card.classList.contains('open');
      card.classList.toggle('open', opening);
      button.querySelector('span').textContent = opening ? 'Скрыть разбор' : 'Разобрать работу';
    });
  });

  if (matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.scene-frame').forEach(frame => {
      frame.addEventListener('mousemove', e => {
        const r = frame.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5;
        const py = (e.clientY - r.top) / r.height - .5;
        frame.style.setProperty('--ry', `${px * 1.5}deg`);
        frame.style.setProperty('--rx', `${py * -1.2}deg`);
      });
      frame.addEventListener('mouseleave', () => {
        frame.style.setProperty('--ry', '0deg');
        frame.style.setProperty('--rx', '0deg');
      });
    });
  }

})();
