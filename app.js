/* ==========================================================================
   THE SILVER SPOON - LUXURY 3D RESTAURANT INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initThreeJSScene();
  initIntersectionObserver();
  init3DTiltEffects();
  initMenuFilterAndSearch();
  initReservationSystem();
  initCartDrawer();
  initSignatureCarousel();
  initGalleryLightbox();
  initCounters();
});

/* ==========================================================================
   1. STICKY HEADER & SCROLL DETECTION
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   2. MOBILE MENU & FULL-SCREEN OVERLAY (HAMBURGER MORPH TO CROSS)
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggle');
  const fullscreenMenu = document.getElementById('fullscreenMenuOverlay');
  const navLinks = document.querySelectorAll('.fullscreen-nav-link');

  if (!toggleBtn || !fullscreenMenu) return;

  function toggleMenu() {
    const isOpen = toggleBtn.classList.contains('is-active');
    if (isOpen) {
      toggleBtn.classList.remove('is-active');
      fullscreenMenu.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      toggleBtn.classList.add('is-active');
      fullscreenMenu.classList.open = true;
      fullscreenMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  toggleBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('is-active');
      fullscreenMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   3. THREE.JS 3D WEBGL HERO STAGE
   ========================================================================== */
function initThreeJSScene() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Glowing Golden Particles
  const particleCount = 180;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    scales[i] = Math.random() * 1.5 + 0.5;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

  // Particle Material (Golden & Olive Glow)
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xC59B27,
    size: 0.6,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(geometry, particleMaterial);
  scene.add(particleSystem);

  // Floating 3D Golden Octahedron Elements (Abstract Culinary Jewels)
  const gemGeometry = new THREE.OctahedronGeometry(1.2, 0);
  const gemMaterial = new THREE.MeshStandardMaterial({
    color: 0xE5BE53,
    metalness: 0.9,
    roughness: 0.1,
    wireframe: true
  });

  const gems = [];
  for (let i = 0; i < 12; i++) {
    const gem = new THREE.Mesh(gemGeometry, gemMaterial);
    gem.position.set(
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 40
    );
    gem.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    scene.add(gem);
    gems.push(gem);
  }

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0xC59B27, 2, 100);
  pointLight1.position.set(20, 20, 20);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x5B6748, 2, 100);
  pointLight2.position.set(-20, -20, 20);
  scene.add(pointLight2);

  // Mouse Interaction
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    particleSystem.rotation.y += 0.001;
    particleSystem.rotation.x += 0.0005;

    gems.forEach((gem, idx) => {
      gem.rotation.x += 0.008 * (idx % 2 === 0 ? 1 : -1);
      gem.rotation.y += 0.008;
      gem.position.y += Math.sin(Date.now() * 0.001 + idx) * 0.02;
    });

    camera.position.x += (mouseX * 4 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 4 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ==========================================================================
   4. INTERSECTION OBSERVER FOR VIEWPORT SCROLL REVEALS
   ========================================================================== */
function initIntersectionObserver() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. 3D CARD TILT EFFECT (VANILLA TILT-LIKE REACTION)
   ========================================================================== */
function init3DTiltEffects() {
  const tiltCards = document.querySelectorAll('.hero-3d-card, .menu-card, .fusion-card, .event-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================================
   6. MASTER MENU FILTERING & SEARCH
   ========================================================================== */
function initMenuFilterAndSearch() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const menuCards = document.querySelectorAll('.menu-card');
  const searchInput = document.getElementById('menuSearchInput');

  if (!tabBtns.length || !menuCards.length) return;

  let activeCategory = 'all';
  let searchQuery = '';

  function filterMenu() {
    menuCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardTitle = card.querySelector('.menu-item-title').textContent.toLowerCase();
      const cardDesc = card.querySelector('.menu-item-desc').textContent.toLowerCase();

      const matchesCategory = (activeCategory === 'all') || (cardCategory === activeCategory);
      const matchesSearch = cardTitle.includes(searchQuery) || cardDesc.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px) scale(0.95)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter');
      filterMenu();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterMenu();
    });
  }
}

/* ==========================================================================
   7. TABLE RESERVATION SYSTEM
   ========================================================================== */
function initReservationSystem() {
  const form = document.getElementById('reservationForm');
  const modal = document.getElementById('reservationModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const bookingCodeEl = document.getElementById('bookingCode');

  if (!form || !modal) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('resName').value;
    const phone = document.getElementById('resPhone').value;
    const guests = document.getElementById('resGuests').value;
    const date = document.getElementById('resDate').value;
    const time = document.getElementById('resTime').value;

    if (!name || !phone || !date || !time) {
      alert('Please fill out all required fields.');
      return;
    }

    // Generate Booking Code
    const code = 'SS-' + Math.floor(100000 + Math.random() * 900000);
    if (bookingCodeEl) bookingCodeEl.textContent = code;

    modal.classList.add('active');
    form.reset();
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/* ==========================================================================
   8. ONLINE TAKEAWAY CART DRAWER
   ========================================================================== */
let cartItems = [];

function initCartDrawer() {
  const cartToggleBtn = document.getElementById('cartToggleBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const addButtons = document.querySelectorAll('.add-cart-btn');

  if (!cartDrawer) return;

  if (cartToggleBtn) {
    cartToggleBtn.addEventListener('click', () => {
      cartDrawer.classList.add('open');
    });
  }

  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', () => {
      cartDrawer.classList.remove('open');
    });
  }

  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));

      addToCart(name, price);
      cartDrawer.classList.add('open');
    });
  });
}

function addToCart(name, price) {
  const existing = cartItems.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.push({ name, price, qty: 1, spice: 'Medium' });
  }
  renderCart();
}

function renderCart() {
  const cartBody = document.getElementById('cartBody');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartBadgeCount = document.querySelector('.cart-count');

  if (!cartBody) return;

  cartBody.innerHTML = '';
  let subtotal = 0;
  let totalCount = 0;

  if (cartItems.length === 0) {
    cartBody.innerHTML = '<p style="text-align:center; color: var(--text-dim); margin-top: 40px;">Your culinary cart is empty.</p>';
  } else {
    cartItems.forEach((item, index) => {
      subtotal += item.price * item.qty;
      totalCount += item.qty;

      const itemEl = document.createElement('div');
      itemEl.style.cssText = 'background: var(--bg-surface); padding: 14px; border-radius: var(--radius-sm); border: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: center;';
      itemEl.innerHTML = `
        <div>
          <h5 style="color: var(--text-main); font-size: 0.95rem;">${item.name}</h5>
          <p style="color: var(--gold-main); font-size: 0.85rem; font-weight: 600;">₹${item.price} x ${item.qty}</p>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button onclick="changeQty(${index}, -1)" style="background: rgba(255,255,255,0.1); border:none; color:#fff; width:24px; height:24px; border-radius:4px; cursor:pointer;">-</button>
          <span style="font-size: 0.9rem;">${item.qty}</span>
          <button onclick="changeQty(${index}, 1)" style="background: rgba(255,255,255,0.1); border:none; color:#fff; width:24px; height:24px; border-radius:4px; cursor:pointer;">+</button>
        </div>
      `;
      cartBody.appendChild(itemEl);
    });
  }

  if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal}`;
  if (cartBadgeCount) cartBadgeCount.textContent = totalCount;
}

window.changeQty = function(index, delta) {
  cartItems[index].qty += delta;
  if (cartItems[index].qty <= 0) {
    cartItems.splice(index, 1);
  }
  renderCart();
};

/* ==========================================================================
   9. SIGNATURE CAROUSEL
   ========================================================================== */
function initSignatureCarousel() {
  const track = document.getElementById('signatureTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (!track || !prevBtn || !nextBtn) return;

  let index = 0;
  const cards = track.children;

  function updateCarousel() {
    const cardWidth = cards[0].offsetWidth + 30;
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  nextBtn.addEventListener('click', () => {
    if (index < cards.length - 1) {
      index++;
      updateCarousel();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (index > 0) {
      index--;
      updateCarousel();
    }
  });
}

/* ==========================================================================
   10. LIGHTBOX GALLERY
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;

      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.92); z-index:3000; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(10px); cursor:pointer;';
      overlay.innerHTML = `<img src="${img.src}" style="max-width:90%; max-height:85%; border-radius: var(--radius-md); border: 1px solid var(--border-gold); box-shadow: var(--shadow-card);">`;

      overlay.addEventListener('click', () => overlay.remove());
      document.body.appendChild(overlay);
    });
  });
}

/* ==========================================================================
   11. ANIMATED COUNTERS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  let started = false;

  window.addEventListener('scroll', () => {
    const aboutSec = document.getElementById('about');
    if (!aboutSec) return;

    const rect = aboutSec.getBoundingClientRect();
    if (rect.top <= window.innerHeight && !started) {
      started = true;
      counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const speed = target / 60;

        function updateCount() {
          count += speed;
          if (count < target) {
            counter.textContent = Math.ceil(count) + (counter.getAttribute('data-suffix') || '');
            requestAnimationFrame(updateCount);
          } else {
            counter.textContent = target + (counter.getAttribute('data-suffix') || '');
          }
        }

        updateCount();
      });
    }
  });
}
