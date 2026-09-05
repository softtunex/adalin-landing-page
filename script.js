(function(){
  const nav = document.getElementById('mainNav');
  const progress = document.getElementById('scrollProgress');
  function updateScroll(){
    nav.classList.toggle('scrolled', window.scrollY > 12);
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progress.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateScroll);
  updateScroll();

  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('mobileMenu');
  toggle.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:0.12});
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

  document.querySelectorAll('#buildPicks .pick-card').forEach(p => {
    p.addEventListener('click', () => {
      document.querySelectorAll('#buildPicks .pick-card').forEach(x => x.classList.remove('selected'));
      p.classList.add('selected');
    });
  });

  const qForm = document.getElementById('quoteForm');
  const qSuccess = document.getElementById('quoteSuccess');
  const qError = document.getElementById('quoteError');
  const qSubmitBtn = qForm.querySelector('button[type="submit"]');
  const qSubmitLabel = qSubmitBtn.textContent;

  qForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    qSuccess.style.display = 'none';
    qError.style.display = 'none';

    const selectedCard = document.querySelector('#buildPicks .pick-card.selected');
    const payload = {
      service: selectedCard ? selectedCard.dataset.build : 'Not specified',
      name: document.getElementById('qName').value,
      email: document.getElementById('qEmail').value,
      phone: document.getElementById('qPhone').value,
      notes: document.getElementById('qNote').value,
    };

    qSubmitBtn.disabled = true;
    qSubmitBtn.textContent = 'Sending...';

    try {
      const res = await fetch('/api/send-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok || !result.success) throw new Error(result.error || 'Submission failed');

      qSubmitBtn.textContent = 'Proposal Request Sent!';
      qSuccess.style.display = 'block';
      qForm.reset();
      document.querySelectorAll('.pick-card.selected').forEach(x => x.classList.remove('selected'));
      setTimeout(() => {
        qSubmitBtn.disabled = false;
        qSubmitBtn.textContent = qSubmitLabel;
      }, 2500);
    } catch (err) {
      qSubmitBtn.disabled = false;
      qSubmitBtn.textContent = qSubmitLabel;
      qError.style.display = 'block';
    }
  });
})();
