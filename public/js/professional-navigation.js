// Ferrari-Level Professional Navigation System
class ProfessionalNavigation {
    constructor() {
        this.activeIndicator = null;
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    init() {
        this.createActiveIndicator();
        this.bindEvents();
        this.updateActiveStates();
        console.log('Ferrari-level navigation initialized');
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'homepage.html';
        return filename.replace('.html', '');
    }

    createActiveIndicator() {
        const secondaryNavList = document.querySelector('.alae-secondary-nav-list');
        if (!secondaryNavList) return;

        this.activeIndicator = document.createElement('div');
        this.activeIndicator.className = 'alae-nav-active-indicator';
        secondaryNavList.appendChild(this.activeIndicator);
    }

    updateActiveStates() {
        // Update primary navigation
        this.updatePrimaryNav();
        
        // Update secondary navigation
        this.updateSecondaryNav();
    }

    updatePrimaryNav() {
        const brandLogo = document.querySelector('.alae-brand-logo');
        if (brandLogo) {
            brandLogo.addEventListener('click', () => {
                this.navigateToPage('/homepage.html');
            });
        }
    }

    updateSecondaryNav() {
        const navItems = document.querySelectorAll('.alae-secondary-nav-item');
        const activeItem = document.querySelector(`.alae-secondary-nav-item[href*="${this.currentPage}"]`) ||
                          document.querySelector('.alae-secondary-nav-item.alae-nav-active');

        // Remove all active states
        navItems.forEach(item => {
            item.classList.remove('alae-nav-active');
        });

        // Set active state
        if (activeItem) {
            activeItem.classList.add('alae-nav-active');
            this.animateIndicatorToItem(activeItem);
        }
    }

    animateIndicatorToItem(targetItem) {
        if (!this.activeIndicator || !targetItem) return;

        const targetRect = targetItem.getBoundingClientRect();
        const containerRect = targetItem.parentElement.getBoundingClientRect();
        
        const left = targetRect.left - containerRect.left;
        const width = targetRect.width;

        // Smooth animation to new position
        this.activeIndicator.style.transform = `translateX(${left}px)`;
        this.activeIndicator.style.width = `${width}px`;
    }

    bindEvents() {
        // Handle secondary navigation clicks
        const navItems = document.querySelectorAll('.alae-secondary-nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active from all items
                navItems.forEach(navItem => {
                    navItem.classList.remove('alae-nav-active');
                });
                
                // Add active to clicked item
                item.classList.add('alae-nav-active');
                
                // Animate indicator
                this.animateIndicatorToItem(item);
                
                // Navigate after animation
                setTimeout(() => {
                    const href = item.getAttribute('href');
                    if (href) {
                        this.navigateToPage(href);
                    }
                }, 300);
            });
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            const activeItem = document.querySelector('.alae-secondary-nav-item.alae-nav-active');
            if (activeItem) {
                this.animateIndicatorToItem(activeItem);
            }
        });
    }

    navigateToPage(url) {
        // Handle navigation with smooth transition
        document.body.style.opacity = '0.95';
        document.body.style.transition = 'opacity 0.2s ease';
        
        setTimeout(() => {
            if (url.startsWith('/')) {
                window.location.href = url;
            } else {
                window.location.href = '/' + url;
            }
        }, 100);
    }
}

// Global navigation function for compatibility
function navigateTo(url) {
    const nav = new ProfessionalNavigation();
    nav.navigateToPage(url);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.professionalNav = new ProfessionalNavigation();
});

// Handle page visibility changes for smooth transitions
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page became visible, ensure navigation is updated
        if (window.professionalNav) {
            window.professionalNav.updateActiveStates();
        }
    }
});