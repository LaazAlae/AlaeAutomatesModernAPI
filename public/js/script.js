// =====================================================
// NASA-Level Performance Optimized JavaScript
// =====================================================

// Performance monitoring and utilities
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            frameDrops: 0,
            avgFrameTime: 0,
            layoutShifts: 0
        };
        this.frameCount = 0;
        this.lastFrameTime = performance.now();
        this.init();
    }
    
    init() {
        // Monitor frame drops
        this.monitorFrameRate();
        
        // Monitor layout shifts
        if ('LayoutShiftScore' in window) {
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        this.metrics.layoutShifts += entry.value;
                    }
                }
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }
    
    monitorFrameRate() {
        const frame = () => {
            const now = performance.now();
            const frameTime = now - this.lastFrameTime;
            
            if (frameTime > 16.67) { // Dropped frame (60fps = 16.67ms)
                this.metrics.frameDrops++;
            }
            
            this.metrics.avgFrameTime = (this.metrics.avgFrameTime * this.frameCount + frameTime) / (this.frameCount + 1);
            this.frameCount++;
            this.lastFrameTime = now;
            
            requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
    }
}

// Utility functions
const Utils = {
    // Debounce with immediate option
    debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    },
    
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Optimized DOM query with caching
    cached: new Map(),
    $(selector, useCache = true) {
        if (useCache && this.cached.has(selector)) {
            return this.cached.get(selector);
        }
        const element = document.querySelector(selector);
        if (useCache && element) {
            this.cached.set(selector, element);
        }
        return element;
    },
    
    $$(selector, useCache = true) {
        if (useCache && this.cached.has(selector + '_all')) {
            return this.cached.get(selector + '_all');
        }
        const elements = document.querySelectorAll(selector);
        if (useCache && elements.length) {
            this.cached.set(selector + '_all', elements);
        }
        return elements;
    },
    
    // Clear cache (useful for dynamic content)
    clearCache() {
        this.cached.clear();
    }
};

// Advanced Navigation Manager
class NavigationManager {
    constructor() {
        this.hasInitialized = sessionStorage.getItem('navigation_initialized') === 'true';
        this.currentPage = this.getCurrentPage();
        this.isTransitioning = false;
        this.init();
    }
    
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('homepage.html') || path === '/') return 'homepage';
        if (path.includes('invoices.html')) return 'invoices';
        if (path.includes('monthly_statements.html')) return 'monthly_statements';
        if (path.includes('cc_batch.html')) return 'cc_batch';
        if (path.includes('excel_macros.html')) return 'excel_macros';
        if (path.includes('help.html')) return 'help';
        return 'homepage';
    }
    
    init() {
        this.setupNavigationAnimation();
        this.setupViewTransitions();
        this.initializeSecondaryNav();
        
        // Mark as initialized
        if (!this.hasInitialized) {
            sessionStorage.setItem('navigation_initialized', 'true');
        }
    }
    
    setupNavigationAnimation() {
        const navItems = Utils.$$('.nav-item', false); // Don't cache for initial setup
        
        navItems.forEach((item, index) => {
            // Persistent items (logo, old version) should never animate after first load
            if (item.classList.contains('old-version') || item.closest('.nav-brand')) {
                item.classList.add('persistent');
                return;
            }
            
            // Only animate on first visit
            if (!this.hasInitialized) {
                item.classList.add('first-load');
            }
        });
    }
    
    setupViewTransitions() {
        // Modern View Transitions API support
        if ('startViewTransition' in document) {
            const links = Utils.$$('a[href$=".html"], .nav-item, .tool-card');
            
            links.forEach(link => {
                // Skip buttons with onclick handlers for macro display
                if (link.tagName === 'BUTTON' && link.hasAttribute('onclick')) {
                    return;
                }
                
                // Skip elements that have non-navigation onclick handlers
                const onclickAttr = link.getAttribute('onclick');
                if (onclickAttr && !onclickAttr.includes('navigateTo')) {
                    return;
                }
                
                link.addEventListener('click', (e) => {
                    if (this.isTransitioning) return;
                    
                    const href = link.getAttribute('href') || link.getAttribute('onclick')?.match(/navigateTo\('(.+)'\)/)?.[1];
                    if (!href || href.startsWith('http')) return;
                    
                    e.preventDefault();
                    this.navigateWithTransition(href);
                });
            });
        }
    }
    
    async navigateWithTransition(url) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        try {
            if ('startViewTransition' in document) {
                await document.startViewTransition(() => {
                    window.location.href = url;
                });
            } else {
                // Fallback for browsers without View Transitions
                const body = document.body;
                body.classList.add('page-transition', 'fade-out');
                
                await new Promise(resolve => setTimeout(resolve, 150));
                window.location.href = url;
            }
        } catch (error) {
            console.warn('Navigation transition failed:', error);
            window.location.href = url;
        }
        
        this.isTransitioning = false;
    }
    
    initializeSecondaryNav() {
        const container = Utils.$('.secondary-nav-container');
        const navItems = Utils.$$('.secondary-nav-item');
        const activeItem = Utils.$('.secondary-nav-item.active');
        
        if (!container || !activeItem) return;
        
        this.setupSecondaryNavSlider(container, navItems, activeItem);
    }
    
    setupSecondaryNavSlider(container, navItems, activeItem) {
        let slider = Utils.$('.secondary-nav-slider');
        if (!slider) {
            slider = document.createElement('div');
            slider.className = 'secondary-nav-slider';
            container.appendChild(slider);
        }
        
        const updateSlider = (targetItem, animate = true) => {
            if (!container || !targetItem) return;
            
            const containerRect = container.getBoundingClientRect();
            const targetRect = targetItem.getBoundingClientRect();
            
            const left = targetRect.left - containerRect.left;
            const width = targetRect.width;
            
            if (!animate) {
                slider.style.transition = 'none';
            } else {
                slider.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            }
            
            slider.style.left = `${left}px`;
            slider.style.width = `${width}px`;
            
            if (!animate) {
                requestAnimationFrame(() => {
                    slider.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                });
            }
        };
        
        // Set initial position without animation
        requestAnimationFrame(() => {
            updateSlider(activeItem, false);
        });
        
        // Optimized event handlers
        const handleMouseEnter = Utils.throttle((item) => {
            if (!item.classList.contains('active')) {
                updateSlider(item, true);
            }
        }, 16); // 60fps
        
        const handleMouseLeave = Utils.throttle(() => {
            const currentActive = Utils.$('.secondary-nav-item.active');
            if (currentActive) {
                updateSlider(currentActive, true);
            }
        }, 16);
        
        navItems.forEach(item => {
            item.addEventListener('mouseenter', () => handleMouseEnter(item), { passive: true });
            item.addEventListener('mouseleave', handleMouseLeave, { passive: true });
            
            item.addEventListener('click', (e) => {
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                updateSlider(item, true);
            });
        });
        
        // Optimized resize handler
        const handleResize = Utils.debounce(() => {
            const currentActive = Utils.$('.secondary-nav-item.active');
            if (currentActive) {
                updateSlider(currentActive, false);
            }
        }, 150);
        
        window.addEventListener('resize', handleResize, { passive: true });
    }
}

// Feature Card Animation Manager
class FeatureCardManager {
    constructor() {
        this.hasVisitedFeaturePage = sessionStorage.getItem('hasVisitedFeaturePage') === 'true';
        this.lastFeaturePage = sessionStorage.getItem('lastFeaturePage');
        this.currentFeaturePage = this.getCurrentFeaturePage();
        this.init();
    }
    
    getCurrentFeaturePage() {
        const path = window.location.pathname;
        if (path.includes('invoices.html')) return 'invoices';
        if (path.includes('monthly_statements.html')) return 'monthly_statements';
        if (path.includes('cc_batch.html')) return 'cc_batch';
        if (path.includes('excel_macros.html')) return 'excel_macros';
        return null;
    }
    
    init() {
        if (!this.currentFeaturePage) return;
        
        const featureCard = Utils.$('.feature-card');
        if (!featureCard) return;
        
        // Determine animation type
        if (!this.hasVisitedFeaturePage) {
            // First time visiting any feature page - full entrance animation
            featureCard.classList.add('page-enter');
            sessionStorage.setItem('hasVisitedFeaturePage', 'true');
        } else if (this.lastFeaturePage && this.lastFeaturePage !== this.currentFeaturePage) {
            // Transitioning between feature pages - subtle transition
            featureCard.classList.add('page-transition');
        }
        
        // Update last visited page
        sessionStorage.setItem('lastFeaturePage', this.currentFeaturePage);
    }
}

// Optimized Scroll Manager
class ScrollManager {
    constructor() {
        this.ticking = false;
        this.scrollThreshold = 10;
        this.init();
    }
    
    init() {
        this.setupSmoothScrolling();
        this.setupIntersectionObserver();
    }
    
    setupSmoothScrolling() {
        // Optimized scroll to tools function
        window.scrollToTools = () => {
            const toolsSection = Utils.$('#tools-section');
            if (!toolsSection) return;
            
            toolsSection.classList.add('visible');
            
            requestAnimationFrame(() => {
                toolsSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                setTimeout(() => {
                    this.animateElements();
                }, 400);
            });
        };
        
        // Generic smooth scroll utility
        window.smoothScrollToElement = (element, options = {}) => {
            if (!element) return;
            
            const defaultOptions = {
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            };
            
            const scrollOptions = { ...defaultOptions, ...options };
            
            requestAnimationFrame(() => {
                element.scrollIntoView(scrollOptions);
            });
        };
    }
    
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
                    
                    if (delay > 0) {
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, delay);
                    } else {
                        entry.target.classList.add('visible');
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Cache DOM query for fade-in elements
        Utils.$$('.fade-in-element').forEach(el => {
            observer.observe(el);
        });
    }
    
    animateElements() {
        const elements = Utils.$$('.fade-in-element:not(.visible)');
        
        elements.forEach((element, index) => {
            const delay = parseInt(element.getAttribute('data-delay')) || (index * 50); // Reduced delay
            
            setTimeout(() => {
                element.classList.add('visible');
            }, delay);
        });
    }
}

// Legacy navigation function (for backward compatibility)
function navigateTo(url) {
    if (url === '/') {
        window.location.href = '/homepage.html';
    } else if (url.startsWith('/')) {
        // Already absolute path
        window.location.href = url;
    } else {
        // Make relative paths absolute
        window.location.href = '/' + url;
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize performance monitoring in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        new PerformanceMonitor();
    }
    
    // Initialize core managers
    new NavigationManager();
    new FeatureCardManager();
    new ScrollManager();
    
    // Legacy support for existing event listeners
    const navItems = Utils.$$('.nav-item:not(.old-version)');
    navItems.forEach(item => {
        if (!item.hasAttribute('data-enhanced')) {
            item.addEventListener('click', function(e) {
                if (!item.getAttribute('href')?.startsWith('http')) {
                    e.preventDefault();
                    const url = this.getAttribute('href');
                    navigateTo(url);
                }
            });
            item.setAttribute('data-enhanced', 'true');
        }
    });
    
    // Enhanced old version button behavior
    const oldVersionBtn = Utils.$('.nav-item.old-version');
    if (oldVersionBtn) {
        oldVersionBtn.addEventListener('click', function(e) {
            document.body.style.opacity = '0.9';
            // Visual feedback for external link
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }
}, { once: true });

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    Utils.clearCache();
});