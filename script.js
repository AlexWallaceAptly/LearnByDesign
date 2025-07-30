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

// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const formMessage = document.getElementById('formMessage');
        
        // Google Apps Script URL - UPDATE WITH YOUR BRAND NEW DEPLOYMENT URL
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxZPvuGbZLSIOtu2GiP9-5KqmMT8FOJje92-cdgVxBmLGzfiZO-4XhPyQjktzQ3a4xKBg/exec';
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            btnLoading.classList.remove('hidden');
            formMessage.classList.add('hidden');
            
            // Get form data
            const formData = {
                name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`.trim(),
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                childAge: document.getElementById('childAge').value,
                serviceInterest: document.getElementById('serviceInterest').value,
                message: document.getElementById('message').value,
                consent: document.getElementById('consent').checked
            };
            
            // Send data to Google Apps Script
            fetch(SCRIPT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage('Thank you! Your message has been sent successfully. We\'ll get back to you within 72 hours.', 'success');
                    contactForm.reset();
                } else {
                    showMessage('Sorry, there was an error sending your message. Please try again or call us directly at (530) 919-6248.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('Sorry, there was an error sending your message. Please try again or call us directly at (530) 919-6248.', 'error');
            })
            .finally(() => {
                // Reset button state
                submitBtn.disabled = false;
                btnText.classList.remove('hidden');
                btnLoading.classList.add('hidden');
            });
        });
        
        function showMessage(message, type) {
            formMessage.textContent = message;
            formMessage.className = `mt-4 text-center p-4 rounded-lg ${type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`;
            formMessage.classList.remove('hidden');
            
            // Auto-hide success messages after 8 seconds
            if (type === 'success') {
                setTimeout(() => {
                    formMessage.classList.add('hidden');
                }, 8000);
            }
        }
    }
}); 