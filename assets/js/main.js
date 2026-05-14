/**
 * Do It Fast IT — Main JavaScript v2.0
 * Features: Theme toggle, Cookie consent, Scroll reveal,
 *           Counter animation, Mobile menu, Contact form
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. THEME SYSTEM ──────────────────────────────────────
    const savedTheme = localStorage.getItem('difi-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(initialTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            applyTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('difi-theme', theme);
        const icon = document.getElementById('theme-icon');
        if (icon) {
            icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    }

    // ── 2. MOBILE MENU ────────────────────────────────────────
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('block');
                mobileMenuBtn.innerHTML = '<i class="fa-solid fa-xmark text-2xl"></i>';
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('block');
                mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars-staggered text-2xl"></i>';
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            const nav = document.querySelector('nav');
            if (nav && !nav.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('block');
                mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars-staggered text-2xl"></i>';
            }
        });
    }

    // ── 3. STICKY HEADER GLASS EFFECT ────────────────────────
    const nav = document.querySelector('nav');
    if (nav) {
        const handleScroll = () => {
            if (window.scrollY > 24) {
                nav.classList.add('glass', 'shadow-sm');
            } else {
                nav.classList.remove('glass', 'shadow-sm');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // run on load
    }

    // ── 4. COOKIE CONSENT ─────────────────────────────────────
    const COOKIE_KEY = 'difi-cookies';
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieReject = document.getElementById('cookie-reject');

    if (cookieBanner && !localStorage.getItem(COOKIE_KEY)) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1200);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem(COOKIE_KEY, 'accepted');
            hideCookieBanner();
        });
    }

    if (cookieReject) {
        cookieReject.addEventListener('click', () => {
            localStorage.setItem(COOKIE_KEY, 'rejected');
            hideCookieBanner();
        });
    }

    function hideCookieBanner() {
        if (cookieBanner) {
            cookieBanner.classList.remove('visible');
            setTimeout(() => cookieBanner.remove(), 500);
        }
    }

    // ── 5. SCROLL REVEAL ──────────────────────────────────────
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => observer.observe(el));
    }

    // ── 6. COUNTER ANIMATION ──────────────────────────────────
    const counters = document.querySelectorAll('[data-count]');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => counterObserver.observe(el));
    }

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 1800;
        const start = performance.now();
        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }

    // ── 7. CONTACT FORM ───────────────────────────────────────
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;

            // Turnstile check
            const formData = new FormData(contactForm);
            const turnstileToken = formData.get('cf-turnstile-response');
            if (!turnstileToken) {
                showToast('Please complete the anti-spam check first.', 'error');
                return;
            }

            const data = Object.fromEntries(formData.entries());

            // Client-side validation
            if (!data.name || data.name.trim().length < 2) {
                showToast('Please enter your full name.', 'error'); return;
            }
            if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                showToast('Please enter a valid email address.', 'error'); return;
            }
            if (!data.subject) {
                showToast('Please select a subject.', 'error'); return;
            }
            if (!data.message || data.message.trim().length < 10) {
                showToast('Please write a message (at least 10 characters).', 'error'); return;
            }

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin mr-2"></i>Sending...';

                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    showSuccessModal();
                    contactForm.reset();
                    // Reset Turnstile if available
                    if (typeof turnstile !== 'undefined') turnstile.reset();
                } else {
                    throw new Error(result.message || 'Something went wrong. Please try again.');
                }
            } catch (err) {
                showToast(err.message, 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
            }
        });
    }

    // ── 8. ACTIVE NAV LINK ────────────────────────────────────
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

});

// ── TOAST NOTIFICATION ──────────────────────────────────────
function showToast(message, type = 'info') {
    const existing = document.querySelectorAll('.toast');
    existing.forEach(t => t.remove());

    const icons = { success: 'fa-check-circle', error: 'fa-circle-xmark', info: 'fa-circle-info' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'none';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(24px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4500);
}

// ── SUCCESS MODAL ────────────────────────────────────────────
function showSuccessModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 flex items-center justify-center z-[200] p-4';
    modal.style.cssText = 'background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); animation: fadeInUp 0.4s ease both;';
    modal.innerHTML = `
        <div style="background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--r-2xl); padding: 2.5rem; max-width: 420px; width: 100%; text-align: center; box-shadow: var(--shadow-lg);">
            <div style="width:72px;height:72px;background:rgba(16,185,129,0.15);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;font-size:1.75rem;color:#10B981;">
                <i class="fa-solid fa-check"></i>
            </div>
            <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:0.75rem;color:var(--text);">Message Sent!</h2>
            <p style="color:var(--text-muted);line-height:1.6;margin-bottom:2rem;font-size:0.9375rem;">
                Thank you for reaching out. We'll review your inquiry and get back to you within 24 hours.
            </p>
            <button onclick="this.closest('.fixed').remove()" class="btn-primary" style="width:100%;justify-content:center;">
                Got it <i class="fa-solid fa-check ml-1"></i>
            </button>
        </div>
    `;
    document.body.appendChild(modal);
}
