// Basic interactivity: modal reviews, menu toggle, form capture, affiliate placeholders

document.addEventListener('DOMContentLoaded', function () {
  // year
  document.getElementById('year').textContent = new Date().getFullYear();

  // menu toggle for mobile
  var menuToggle = document.getElementById('menu-toggle');
  var nav = document.querySelector('.main-nav');
  if(menuToggle){
    menuToggle.addEventListener('click', function(){
      var visible = nav.style.display === 'flex';
      nav.style.display = visible ? 'none' : 'flex';
    });
  }

  // Open review modal
  var reviewModal = document.getElementById('review-modal');
  var reviewBody = document.getElementById('review-body');
  var closeBtn = document.querySelector('.modal-close');

  function openReview(id){
    // Simple content per product id - replace with richer content later
    var content = {
      p1: {
        title: 'Aceite de Rosa Mosqueta — Reseña rápida',
        text: 'Aceite natural, prensado en frío. Bueno para hidratación y combatir manchas leves. Uso: aplicar 2 gotas por la noche.'
      },
      p2: {
        title: 'Colágeno Hidrolizado — Reseña rápida',
        text: 'Fórmula con vitamina C para mejor absorción. Tomar 1 scoop al día con agua o jugo.'
      },
      p3: {
        title: 'Crema Anti-edad Natural — Reseña rápida',
        text: 'Textura ligera, contiene extractos botánicos. Usar por la mañana y noche para mejores resultados.'
      }
    };
    var r = content[id] || {title:'Reseña', text:'Contenido no disponible.'};
    reviewBody.innerHTML = '<h3>'+r.title+'</h3><p>'+r.text+'</p><p><small>Nota: verifica ingredientes y alergias antes de comprar.</small></p>';
    reviewModal.setAttribute('aria-hidden','false');
  }

  document.querySelectorAll('[data-open-review]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var id = btn.getAttribute('data-open-review');
      openReview(id);
    });
  });

  if(closeBtn){
    closeBtn.addEventListener('click', function(){ reviewModal.setAttribute('aria-hidden','true'); });
  }
  reviewModal.addEventListener('click', function(e){
    if(e.target === reviewModal) reviewModal.setAttribute('aria-hidden','true');
  });

  // Lead form - simple local-storage capture and fake success (replace with real mailing service)
  var leadForm = document.getElementById('lead-form');
  if(leadForm){
    leadForm.addEventListener('submit', function(e){
      e.preventDefault();
      var email = document.getElementById('email').value.trim();
      if(!email) return alert('Ingresa tu correo');
      // Save in localStorage (you should replace this with API to mailing provider)
      var leads = JSON.parse(localStorage.getItem('beautymx_leads') || '[]');
      leads.push({email:email, date:new Date().toISOString()});
      localStorage.setItem('beautymx_leads', JSON.stringify(leads));
      document.getElementById('email').value = '';
      alert('¡Gracias! Te agregamos a la lista. Revisa tu correo.');
    });
  }

  // Affiliate placeholders - warn to replace hrefs
  document.querySelectorAll('[data-affiliate]').forEach(function(a){
    a.addEventListener('click', function(){
      // if href is '#' show reminder
      if(a.getAttribute('href') === '#'){
        alert('Recuerda: reemplaza el enlace con tu link de afiliado antes de publicar.');
      }
    });
  });
});