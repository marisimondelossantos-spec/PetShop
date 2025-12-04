// Contact Page JavaScript
// This file handles contact form submission and validation

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.querySelector('.contact-section form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = {
                firstName: document.getElementById('fname').value,
                lastName: document.getElementById('lname').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            // Log form data (in production, this would send to a server)
            console.log('Contact Form Submitted:', formData);

            // Show success message
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');

            // Reset form
            contactForm.reset();
        });
    }
});

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10000;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    font-weight: 500;
    transform: translateX(400px);
    transition: transform 0.3s ease;
  `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
