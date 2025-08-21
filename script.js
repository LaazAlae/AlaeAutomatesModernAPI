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
});