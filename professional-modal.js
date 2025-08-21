// =====================================================
// Professional Modal & Alert System
// =====================================================

class ProfessionalUI {
    constructor() {
        this.modalContainer = null;
        this.alertContainer = null;
        this.init();
    }
    
    init() {
        this.createModalContainer();
        this.createAlertContainer();
        this.addGlobalStyles();
    }
    
    createModalContainer() {
        this.modalContainer = document.createElement('div');
        this.modalContainer.id = 'professional-modal-container';
        this.modalContainer.className = 'professional-modal-overlay';
        document.body.appendChild(this.modalContainer);
    }
    
    createAlertContainer() {
        this.alertContainer = document.createElement('div');
        this.alertContainer.id = 'professional-alert-container';
        this.alertContainer.className = 'professional-alert-container';
        document.body.appendChild(this.alertContainer);
    }
    
    addGlobalStyles() {
        if (document.getElementById('professional-ui-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'professional-ui-styles';
        style.textContent = `
            /* Professional Modal System */
            .professional-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                padding: 20px;
                box-sizing: border-box;
            }
            
            .professional-modal-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            .professional-modal {
                background: linear-gradient(145deg, rgba(20, 20, 20, 0.98) 0%, rgba(0, 0, 0, 0.95) 100%);
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 16px;
                width: 100%;
                max-width: 1000px;
                max-height: 90vh;
                box-shadow: 
                    0 30px 80px rgba(0, 0, 0, 0.6),
                    0 10px 40px rgba(255, 0, 0, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.08);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transform: scale(0.9) translateY(20px);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .professional-modal-overlay.active .professional-modal {
                transform: scale(1) translateY(0);
            }
            
            .professional-modal-header {
                padding: 24px 24px 16px 24px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-shrink: 0;
                position: relative;
            }
            
            .professional-modal-title {
                font-size: 1.5rem;
                font-weight: 600;
                color: #ffffff;
                margin: 0;
                padding-right: 40px;
            }
            
            .professional-modal-close {
                position: absolute;
                top: 16px;
                right: 16px;
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                color: rgba(255, 255, 255, 0.7);
            }
            
            .professional-modal-close:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.2);
                color: #ffffff;
                transform: scale(1.05);
            }
            
            .professional-modal-close:active {
                transform: scale(0.95);
            }
            
            .professional-modal-body {
                padding: 20px 24px 24px 24px;
                flex: 1;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            
            .professional-modal-actions {
                padding: 0 24px 24px 24px;
                flex-shrink: 0;
                display: flex;
                gap: 12px;
                justify-content: center;
            }
            
            .professional-code-area {
                background: #000000;
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 8px;
                padding: 20px;
                font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
                font-size: 13px;
                line-height: 1.4;
                color: #00ff00;
                white-space: pre;
                overflow: auto;
                flex: 1;
                min-height: 400px;
                max-height: 500px;
                text-align: left;
                word-wrap: normal;
                scrollbar-width: thin;
                scrollbar-color: rgba(255, 255, 255, 0.3) rgba(0, 0, 0, 0.1);
            }
            
            .professional-code-area::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            
            .professional-code-area::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
            }
            
            .professional-code-area::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 4px;
            }
            
            .professional-code-area::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.5);
            }
            
            /* Professional Alert System */
            .professional-alert-container {
                position: fixed;
                top: 90px;
                right: 20px;
                z-index: 20000;
                display: flex;
                flex-direction: column;
                gap: 12px;
                pointer-events: none;
            }
            
            .professional-alert {
                background: linear-gradient(145deg, rgba(20, 20, 20, 0.98) 0%, rgba(0, 0, 0, 0.95) 100%);
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 12px;
                padding: 16px 20px;
                min-width: 320px;
                max-width: 400px;
                box-shadow: 
                    0 20px 40px rgba(0, 0, 0, 0.5),
                    0 8px 20px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.08);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                display: flex;
                align-items: flex-start;
                gap: 12px;
                transform: translateX(100%) scale(0.9);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: auto;
                cursor: pointer;
            }
            
            .professional-alert.show {
                transform: translateX(0) scale(1);
                opacity: 1;
            }
            
            .professional-alert.removing {
                transform: translateX(100%) scale(0.9);
                opacity: 0;
            }
            
            .professional-alert-icon {
                width: 24px;
                height: 24px;
                flex-shrink: 0;
                margin-top: 2px;
            }
            
            .professional-alert-content {
                flex: 1;
                min-width: 0;
            }
            
            .professional-alert-title {
                font-size: 14px;
                font-weight: 600;
                margin: 0 0 4px 0;
                color: #ffffff;
            }
            
            .professional-alert-message {
                font-size: 13px;
                margin: 0;
                color: rgba(255, 255, 255, 0.8);
                line-height: 1.4;
            }
            
            .professional-alert.error {
                border-color: rgba(239, 68, 68, 0.3);
                background: linear-gradient(145deg, rgba(40, 20, 20, 0.98) 0%, rgba(20, 0, 0, 0.95) 100%);
            }
            
            .professional-alert.error .professional-alert-icon {
                color: #ef4444;
            }
            
            .professional-alert.warning {
                border-color: rgba(245, 158, 11, 0.3);
                background: linear-gradient(145deg, rgba(40, 30, 20, 0.98) 0%, rgba(20, 15, 0, 0.95) 100%);
            }
            
            .professional-alert.warning .professional-alert-icon {
                color: #f59e0b;
            }
            
            .professional-alert.success {
                border-color: rgba(34, 197, 94, 0.3);
                background: linear-gradient(145deg, rgba(20, 40, 20, 0.98) 0%, rgba(0, 20, 0, 0.95) 100%);
            }
            
            .professional-alert.success .professional-alert-icon {
                color: #22c55e;
            }
            
            .professional-alert.info {
                border-color: rgba(59, 130, 246, 0.3);
                background: linear-gradient(145deg, rgba(20, 25, 40, 0.98) 0%, rgba(0, 5, 20, 0.95) 100%);
            }
            
            .professional-alert.info .professional-alert-icon {
                color: #3b82f6;
            }
            
            /* Mobile Responsiveness */
            @media (max-width: 768px) {
                .professional-modal {
                    margin: 10px;
                    max-width: calc(100vw - 20px);
                }
                
                .professional-alert-container {
                    right: 10px;
                    left: 10px;
                }
                
                .professional-alert {
                    min-width: auto;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Modal Methods
    showModal(title, content, actions = []) {
        const modal = document.createElement('div');
        modal.className = 'professional-modal';
        
        const closeButton = document.createElement('div');
        closeButton.className = 'professional-modal-close';
        closeButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;
        
        modal.innerHTML = `
            <div class="professional-modal-header">
                <h2 class="professional-modal-title">${title}</h2>
            </div>
            <div class="professional-modal-body">
                ${content}
            </div>
            ${actions.length > 0 ? `
                <div class="professional-modal-actions">
                    ${actions.map(action => `
                        <button class="btn-enhanced ${action.class || 'btn-secondary-enhanced'}" data-action="${action.action}">
                            ${action.icon ? `<i data-lucide="${action.icon}" class="icon"></i>` : ''}
                            ${action.text}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        `;
        
        modal.querySelector('.professional-modal-header').appendChild(closeButton);
        
        this.modalContainer.innerHTML = '';
        this.modalContainer.appendChild(modal);
        
        // Add event listeners
        const closeModal = () => {
            this.modalContainer.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        closeButton.addEventListener('click', closeModal);
        this.modalContainer.addEventListener('click', (e) => {
            if (e.target === this.modalContainer) closeModal();
        });
        
        // Handle action buttons
        modal.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.closest('[data-action]').dataset.action;
                if (actions.find(a => a.action === action)?.callback) {
                    actions.find(a => a.action === action).callback();
                }
            });
        });
        
        // Handle keyboard
        const handleKeydown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleKeydown);
            }
        };
        document.addEventListener('keydown', handleKeydown);
        
        // Show modal
        this.modalContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Initialize Lucide icons if available
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        return modal;
    }
    
    showCodeModal(title, code) {
        const actions = [
            {
                text: 'Copy Code',
                icon: 'copy',
                class: 'btn-primary-enhanced',
                action: 'copy',
                callback: () => this.copyToClipboard(code)
            }
        ];
        
        const content = `<div class="professional-code-area">${this.escapeHtml(code)}</div>`;
        return this.showModal(title, content, actions);
    }
    
    // Alert Methods
    showAlert(type, title, message, duration = 5000) {
        const alert = document.createElement('div');
        alert.className = `professional-alert ${type}`;
        
        const iconMap = {
            error: 'alert-circle',
            warning: 'alert-triangle',
            success: 'check-circle',
            info: 'info'
        };
        
        alert.innerHTML = `
            <div class="professional-alert-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${this.getIconSVG(iconMap[type])}
                </svg>
            </div>
            <div class="professional-alert-content">
                <div class="professional-alert-title">${title}</div>
                <div class="professional-alert-message">${message}</div>
            </div>
        `;
        
        this.alertContainer.appendChild(alert);
        
        // Show alert
        requestAnimationFrame(() => {
            alert.classList.add('show');
        });
        
        // Auto remove
        setTimeout(() => {
            this.removeAlert(alert);
        }, duration);
        
        // Manual remove on click
        alert.addEventListener('click', () => {
            this.removeAlert(alert);
        });
        
        return alert;
    }
    
    removeAlert(alert) {
        alert.classList.add('removing');
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 400);
    }
    
    // Utility Methods
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showAlert('success', 'Copied!', 'Code copied to clipboard successfully.');
        } catch (err) {
            // Fallback method
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showAlert('success', 'Copied!', 'Code copied to clipboard successfully.');
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    getIconSVG(iconName) {
        const icons = {
            'alert-circle': '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>',
            'alert-triangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>',
            'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline>',
            'info': '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'
        };
        return icons[iconName] || icons['info'];
    }
}

// Global instance
window.ProfessionalUI = new ProfessionalUI();