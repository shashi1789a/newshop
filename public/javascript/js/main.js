/* ========================================
   RECICLAJA - main.js
   Core functionality, global UI, utilities
   ======================================== */

// ---------- Toast System ----------
const toastContainer = document.getElementById('toast-container') || createToastContainer();

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

function showToast(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="toast-close" aria-label="Close notification">&times;</button>
    `;

    toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        removeToast(toast);
    });

    setTimeout(() => {
        removeToast(toast);
    }, duration);
}

function removeToast(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 300);
}

// ---------- Modal System ----------
function openModal(content, title = '') {
    const overlay = document.getElementById('modal-overlay') || createModalOverlay();
    const modal = overlay.querySelector('.modal');

    let headerHtml = '';
    if (title) {
        headerHtml = `
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" aria-label="Close modal">&times;</button>
            </div>
        `;
    }

    modal.innerHTML = `
        ${headerHtml}
        <div class="modal-body">${content}</div>
    `;

    if (title) {
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', closeModal);
    }

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // Close on ESC
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);

    return overlay;
}

function createModalOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal"></div>`;
    document.body.appendChild(overlay);
    return overlay;
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// ---------- Back to Top ----------
function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '↑';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ---------- Sticky Header ----------
function initStickyHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ---------- Mobile Menu ----------
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const closeBtn = document.querySelector('.mobile-nav-close');

    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            toggle.classList.remove('active');
            mobileNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            mobileNav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// ---------- Dropdown Menus ----------
function initDropdowns() {
    document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
        const dropdown = trigger.closest('.dropdown');
        const menu = dropdown.querySelector('.dropdown-menu');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = menu.classList.contains('open');
            closeAllDropdowns();
            if (!isOpen) {
                menu.classList.add('open');
            }
        });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', closeAllDropdowns);
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu.open').forEach(menu => {
        menu.classList.remove('open');
    });
}

// ---------- Form Validation Helpers ----------
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('.form-control');

    inputs.forEach(input => {
        const errorEl = input.parentElement.querySelector('.form-error');
        const isRequired = input.hasAttribute('required') || input.dataset.required === 'true';

        if (isRequired && !input.value.trim()) {
            input.classList.add('error');
            if (errorEl) {
                errorEl.textContent = `${input.placeholder || 'This field'} is required`;
                errorEl.classList.add('visible');
            }
            isValid = false;
        } else if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
                input.classList.add('error');
                if (errorEl) {
                    errorEl.textContent = 'Please enter a valid email address';
                    errorEl.classList.add('visible');
                }
                isValid = false;
            } else {
                input.classList.remove('error');
                if (errorEl) {
                    errorEl.classList.remove('visible');
                }
            }
        } else {
            input.classList.remove('error');
            if (errorEl) {
                errorEl.classList.remove('visible');
            }
        }
    });

    return isValid;
}

// ---------- Number Formatting ----------
function formatPrice(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatPriceShort(amount) {
    if (amount >= 100000) {
        return '₹' + (amount / 100000).toFixed(1) + 'L';
    }
    if (amount >= 1000) {
        return '₹' + (amount / 1000).toFixed(1) + 'K';
    }
    return '₹' + amount;
}

// ---------- Generate ID ----------
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// ---------- LocalStorage Helpers ----------
function getStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch {
        return defaultValue;
    }
}

function setStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn('Failed to save to localStorage:', e);
    }
}

// ---------- Initialize ----------
document.addEventListener('DOMContentLoaded', () => {
    initBackToTop();
    initStickyHeader();
    initMobileMenu();
    initDropdowns();

    // Add toast container if not exists
    if (!document.getElementById('toast-container')) {
        createToastContainer();
    }

    // Set current year in footer
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Highlight active nav link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a, .mobile-nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    console.log('RECICLAJA initialized successfully! 🎉');
});