// Basic interaction + blog loader + testimonials slider + form submit to backend
document.addEventListener('DOMContentLoaded', function(){
  // year footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Animate multiple elements sequentially
  const animated = document.querySelectorAll('.card-animate');
  animated.forEach((el, i) => el.style.animationDelay = (i*80)+'ms');

  // Load posts from posts.json
  fetch('posts.json').then(r => r.json()).then(posts => {
    const container = document.getElementById('posts');
    posts.slice(0,6).forEach(p => {
      const el = document.createElement('article');
      el.className = 'post-card';
      el.innerHTML = `<h4>${escapeHtml(p.title)}</h4>
                      <p class="muted">${escapeHtml(p.excerpt)}</p>
                      <p class="small muted">By ${escapeHtml(p.author)} • ${new Date(p.date).toLocaleDateString()}</p>
                      <div style="margin-top:10px"><a href="${p.url || '#'}" class="btn btn-ghost">Read</a></div>`;
      container.appendChild(el);
    });
  }).catch(()=>{ /* ignore if posts not found */ });

  // Contact form submit -> send to backend
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      const status = document.getElementById('formStatus');
      status.textContent = 'Sending message...';
      const data = {
        name: form.name.value,
        email: form.email.value,
        company: form.company.value,
        message: form.message.value
      };

      try {
        const resp = await fetch('https://REPLACE_WITH_YOUR_BACKEND_URL/api/send', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify(data)
        });
        const json = await resp.json();
        if(resp.ok){
          status.textContent = 'Message sent — we will reply within 24 hours.';
          form.reset();
        } else {
          status.textContent = json.error || 'Failed to send message.';
        }
      } catch(err){
        console.error(err);
        status.textContent = 'Network error. Please try again or email hello@marketpro.example';
      }
    });
  }

  // Testimonials simple slider
  let idx = 0;
  const track = document.getElementById('testTrack');
  window.moveTestimonial = (dir) => {
    const count = track.children.length;
    idx = (idx + dir + count) % count;
    track.style.transform = `translateX(${-idx * 100}%)`;
  };

  // Mobile nav toggle
  window.toggleMobileNav = () => {
    const nav = document.querySelector('.nav-links');
    if(nav.style.display === 'flex') nav.style.display = 'none';
    else nav.style.display = 'flex';
  };
});

// small helper
function escapeHtml(str){
  return (str||'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}