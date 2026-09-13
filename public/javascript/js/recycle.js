/* ========================================
   RECICLAJA - recycle.js
   Recycling request functionality
   ======================================== */

const RECYCLING_STORAGE_KEY = 'reciclaja_recycling';

// ---------- Recycling State ----------
function getRecyclingRequests() {
    return getStorage(RECYCLING_STORAGE_KEY, []);
}

function saveRecyclingRequests(requests) {
    setStorage(RECYCLING_STORAGE_KEY, requests);
}

// ---------- Submit Recycling Request ----------
function submitRecyclingRequest(formData) {
    const request = {
        id: generateId(),
        ...formData,
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const requests = getRecyclingRequests();
    requests.push(request);
    saveRecyclingRequests(requests);

    // Reset form
    document.getElementById('recycle-form').reset();

    showToast('♻️ Recycling pickup scheduled successfully!', 'success');
    return true;
}

// ---------- Form Validation ----------
function validateRecyclingForm() {
    const form = document.getElementById('recycle-form');
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            const errorEl = input.parentElement.querySelector('.form-error');
            if (errorEl) {
                errorEl.textContent = `${input.placeholder || 'This field'} is required`;
                errorEl.classList.add('visible');
            }
            isValid = false;
        } else {
            input.classList.remove('error');
            const errorEl = input.parentElement.querySelector('.form-error');
            if (errorEl) {
                errorEl.classList.remove('visible');
            }
        }
    });

    // Email validation
    const email = document.getElementById('recycle-email');
    if (email && email.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            email.classList.add('error');
            const errorEl = email.parentElement.querySelector('.form-error');
            if (errorEl) {
                errorEl.textContent = 'Please enter a valid email address';
                errorEl.classList.add('visible');
            }
            isValid = false;
        }
    }

    // Phone validation
    const phone = document.getElementById('recycle-phone');
    if (phone && phone.value.trim()) {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone.value.trim())) {
            phone.classList.add('error');
            const errorEl = phone.parentElement.querySelector('.form-error');
            if (errorEl) {
                errorEl.textContent = 'Please enter a valid 10-digit phone number';
                errorEl.classList.add('visible');
            }
            isValid = false;
        }
    }

    return isValid;
}

// ---------- Handle Form Submit ----------
function handleRecycleSubmit(e) {
    e.preventDefault();

    if (!validateRecyclingForm()) {
        showToast('Please fix the errors in the form', 'warning');
        return;
    }

    const form = document.getElementById('recycle-form');
    const formData = new FormData(form);

    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address'),
        city: formData.get('city'),
        pincode: formData.get('pincode'),
        clothingCount: formData.get('clothing-count'),
        clothingType: formData.get('clothing-type'),
        clothingCondition: formData.get('clothing-condition'),
        pickupDate: formData.get('pickup-date'),
        pickupTime: formData.get('pickup-time'),
        notes: formData.get('notes') || ''
    };

    submitRecyclingRequest(data);
}

// ---------- Initialize Recycle Page ----------
function initRecyclePage() {
    const form = document.getElementById('recycle-form');
    if (form) {
        form.addEventListener('submit', handleRecycleSubmit);
    }

    // Set min date for pickup
    const pickupDate = document.getElementById('pickup-date');
    if (pickupDate) {
        const today = new Date().toISOString().split('T')[0];
        pickupDate.setAttribute('min', today);
    }

    // Real-time validation on blur
    document.querySelectorAll('#recycle-form .form-control').forEach(input => {
        input.addEventListener('blur', () => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.classList.add('error');
                const errorEl = input.parentElement.querySelector('.form-error');
                if (errorEl) {
                    errorEl.textContent = `${input.placeholder || 'This field'} is required`;
                    errorEl.classList.add('visible');
                }
            } else {
                input.classList.remove('error');
                const errorEl = input.parentElement.querySelector('.form-error');
                if (errorEl) {
                    errorEl.classList.remove('visible');
                }
            }
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('error') && input.value.trim()) {
                input.classList.remove('error');
                const errorEl = input.parentElement.querySelector('.form-error');
                if (errorEl) {
                    errorEl.classList.remove('visible');
                }
            }
        });
    });

    // Set default clothing count
    const countInput = document.getElementById('clothing-count');
    if (countInput && !countInput.value) {
        countInput.value = 1;
    }
}

// ---------- Get Recycling Statistics ----------
function getRecyclingStats() {
    const requests = getRecyclingRequests();
    const total = requests.length;
    const completed = requests.filter(r => r.status === 'Completed').length;
    const pending = requests.filter(r => r.status === 'Pending').length;

    // Estimate savings (rough numbers)
    const waterPerItem = 2700; // liters per item
    const co2PerItem = 3.5; // kg per item

    return {
        total,
        completed,
        pending,
        waterSaved: total * waterPerItem,
        co2Avoided: total * co2PerItem,
        wasteDiverted: total * 0.5 // kg per item
    };
}

// ---------- Initialize ----------
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('recycle-form')) {
        initRecyclePage();
    }

    // Update recycling stats if on recycle page
    const statsContainer = document.getElementById('recycling-stats');
    if (statsContainer) {
        const stats = getRecyclingStats();
        // Stats are shown in the HTML, we could update them dynamically
        // But for demo, we keep static numbers
    }
});

// Export
window.recycle = {
    getRecyclingRequests,
    submitRecyclingRequest,
    getRecyclingStats,
    validateRecyclingForm
};