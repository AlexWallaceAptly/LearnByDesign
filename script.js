// Mobile Menu Toggle with Accessibility
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;
    
    // Toggle visibility
    mobileMenu.classList.toggle('hidden', !newState);
    
    // Update ARIA attributes
    mobileMenuButton.setAttribute('aria-expanded', newState);
    mobileMenu.setAttribute('aria-expanded', newState);
    
    // Manage focus
    if (newState) {
        // Menu opened - focus first link
        const firstLink = mobileMenu.querySelector('a');
        if (firstLink) firstLink.focus();
    }
});

// Close mobile menu with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-expanded', 'false');
        mobileMenuButton.focus();
    }
});

// Trap focus within mobile menu when open
mobileMenu.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        const focusableElements = mobileMenu.querySelectorAll('a, button');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});

// Back to Top Button
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.remove('opacity-0', 'invisible');
        backToTopButton.classList.add('opacity-100', 'visible');
    } else {
        backToTopButton.classList.remove('opacity-100', 'visible');
        backToTopButton.classList.add('opacity-0', 'invisible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form Submission with Accessibility
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Clear previous errors
        clearFormErrors();
        
        // Get form values
        const formData = getFormData();
        
        // Validate form
        const errors = validateForm(formData);
        
        if (errors.length > 0) {
            displayFormErrors(errors);
            // Focus first error field
            const firstErrorField = document.querySelector('.form-error').previousElementSibling;
            if (firstErrorField) firstErrorField.focus();
            return;
        }
        
        // Show success message
        showStatusMessage('success', `Thank you, ${formData.name}! We've received your message and will contact you soon.`);
        
        // Reset form
        contactForm.reset();
        
        // Focus back to first form field
        const firstField = contactForm.querySelector('input, textarea, select');
        if (firstField) firstField.focus();
    });
}

function getFormData() {
    const name = document.getElementById('name')?.value || document.getElementById('first-name')?.value;
    const lastName = document.getElementById('last-name')?.value;
    const email = document.getElementById('email')?.value;
    const phone = document.getElementById('phone')?.value;
    const message = document.getElementById('message')?.value;
    
    return {
        name: name + (lastName ? ` ${lastName}` : ''),
        email,
        phone,
        message
    };
}

function validateForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
    
    if (!data.phone || data.phone.trim().length < 10) {
        errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function displayFormErrors(errors) {
    errors.forEach(error => {
        const field = document.getElementById(error.field) || document.getElementById('first-name');
        if (field) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle form-error-icon" aria-hidden="true"></i>${error.message}`;
            errorDiv.setAttribute('role', 'alert');
            field.parentNode.appendChild(errorDiv);
            field.setAttribute('aria-invalid', 'true');
            field.setAttribute('aria-describedby', errorDiv.id = `${error.field}-error`);
        }
    });
}

function clearFormErrors() {
    const errors = document.querySelectorAll('.form-error');
    errors.forEach(error => error.remove());
    
    const invalidFields = document.querySelectorAll('[aria-invalid="true"]');
    invalidFields.forEach(field => {
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    });
}

function showStatusMessage(type, message) {
    // Remove existing status messages
    const existingMessages = document.querySelectorAll('.status-message');
    existingMessages.forEach(msg => msg.remove());
    
    const statusDiv = document.createElement('div');
    statusDiv.className = `status-message status-${type}`;
    statusDiv.setAttribute('role', 'alert');
    statusDiv.setAttribute('aria-live', 'polite');
    statusDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}" aria-hidden="true"></i>
        ${message}
    `;
    
    // Insert before the form
    if (contactForm) {
        contactForm.parentNode.insertBefore(statusDiv, contactForm);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            statusDiv.remove();
        }, 5000);
    }
} 