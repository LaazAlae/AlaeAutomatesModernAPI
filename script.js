function navigateTo(url) {
    // In a self-contained file, we can't navigate to other pages in the same way.
    // We will just log the action to the console.
    console.log("Navigate to:", url);
    if (url === '/') {
        window.location.href = 'homepage.html';
    } else {
        window.location.href = url;
    }
}

function scrollToTools() {
    const toolsSection = document.getElementById('tools-section');
    
    // Show the tools section with animation
    toolsSection.classList.add('visible');
    
    // Smooth scroll to tools section
    setTimeout(() => {
        toolsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Trigger animations after smooth scroll
        setTimeout(() => {
            animateElements();
        }, 800);
    }, 100);
}

function animateElements() {
    const elements = document.querySelectorAll('.fade-in-element');
    
    elements.forEach((element, index) => {
        const delay = parseInt(element.getAttribute('data-delay')) || (index * 100);
        
        setTimeout(() => {
            element.classList.add('visible');
        }, delay);
    });
}

function initializeSecondaryNavSlider() {
    const secondaryNavContainer = document.querySelector('.secondary-nav-container');
    const navItems = document.querySelectorAll('.secondary-nav-item');
    const activeItem = document.querySelector('.secondary-nav-item.active');
    
    if (!secondaryNavContainer || !activeItem) return;
    
    // Create slider element
    let slider = secondaryNavContainer.querySelector('.secondary-nav-slider');
    if (!slider) {
        slider = document.createElement('div');
        slider.className = 'secondary-nav-slider';
        secondaryNavContainer.appendChild(slider);
    }
    
    function updateSlider(targetItem, animate = true) {
        const containerRect = secondaryNavContainer.getBoundingClientRect();
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
        
        // Re-enable transitions after setting without animation
        if (!animate) {
            setTimeout(() => {
                slider.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 50);
        }
    }
    
    // Set initial position without animation on page load
    setTimeout(() => {
        updateSlider(activeItem, false);
    }, 50);
    
    // Add hover effects
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('active')) {
                updateSlider(item, true);
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('active')) {
                const currentActive = document.querySelector('.secondary-nav-item.active');
                if (currentActive) {
                    updateSlider(currentActive, true);
                }
            }
        });
        
        item.addEventListener('click', (e) => {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
            updateSlider(item, true);
        });
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const currentActive = document.querySelector('.secondary-nav-item.active');
            if (currentActive) {
                updateSlider(currentActive, false);
            }
        }, 150);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const isHomepage = document.body.classList.contains('homepage');
    const isFirstLoad = !sessionStorage.getItem('hasVisitedFeaturePage');
    
    const navItems = document.querySelectorAll('.nav-item:not(.old-version)');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('href');
            navigateTo(url);
        });
    });
    
    const oldVersionBtn = document.querySelector('.nav-item.old-version');
    if (oldVersionBtn) {
        oldVersionBtn.addEventListener('click', function(e) {
            document.body.style.opacity = '0.8';
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.fade-in-element').forEach(el => {
        observer.observe(el);
    });
    
    // Initialize secondary nav slider
    initializeSecondaryNavSlider();
});