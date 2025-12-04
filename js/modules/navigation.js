/**
 * Navigation utility module for setting active nav links
 */
export class NavigationManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        return filename || 'index.html';
    }

    setActiveLink() {
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Remove active class from all links
            link.classList.remove('active');
            
            // Add active class to current page link
            if (href === this.currentPage) {
                link.classList.add('active');
            }
        });
    }

    init() {
        // Only run after DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setActiveLink();
            });
        } else {
            this.setActiveLink();
        }
    }
}

// Auto-initialize
new NavigationManager();
