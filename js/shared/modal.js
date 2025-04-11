const ModalModule = {
    containerId: 'modals-container',
    
    init() {
        console.log('Initializing Modal Module');
        this.bindEvents();
    },
    
    bindEvents() {
        const modalOverlay = document.getElementById('modal-overlay');
        const closeButtons = document.querySelectorAll('.modal-close-btn');
        const logoutLink = document.querySelector('.modal-link');
        
        // Close buttons in all modals
        if (closeButtons) {
            closeButtons.forEach(button => {
                ComponentLoader.registerEventListener(
                    this.containerId,
                    button,
                    'click',
                    () => {
                        this.closeModal();
                    }
                );
            });
        }
        
        // Modal overlay background click closes all modals
        if (modalOverlay) {
            ComponentLoader.registerEventListener(
                'modal-overlay',
                modalOverlay,
                'click',
                () => {
                    this.closeModal();
                }
            );
        }
        
        // Logout link in user modal
        if (logoutLink) {
            ComponentLoader.registerEventListener(
                this.containerId,
                logoutLink,
                'click',
                (e) => {
                    e.preventDefault();
                    console.log('Log out clicked');
                    
                    // Clear authentication token
                    localStorage.removeItem('auth_token');
                    
                    // Redirect to login page
                    window.location.replace('index.html');
                }
            );
        }
        
        // Stop propagation for clicks inside modals
        const modals = document.querySelectorAll('.modal');
        if (modals) {
            modals.forEach(modal => {
                ComponentLoader.registerEventListener(
                    this.containerId,
                    modal,
                    'click',
                    (e) => {
                        e.stopPropagation();
                    }
                );
            });
        }
        
        // Menu options in all modals
        const menuOptions = document.querySelectorAll('.settings-item, .help-option, .new-menu-option');
        if (menuOptions) {
            menuOptions.forEach(option => {
                ComponentLoader.registerEventListener(
                    this.containerId,
                    option,
                    'click',
                    function() {
                        const label = this.querySelector('.settings-label, .help-label, .new-menu-label');
                        if (label) {
                            console.log('Menu option clicked:', label.textContent);
                            ModalModule.closeModal();
                        }
                    }
                );
            });
        }
    },
    
    openModal(modalId) {
        console.log('Opening modal:', modalId);
        
        // Hide all modals first
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        
        // Show overlay and the requested modal
        const modalOverlay = document.getElementById('modal-overlay');
        const targetModal = document.getElementById(modalId);
        
        if (modalOverlay) modalOverlay.style.display = 'block';
        if (targetModal) targetModal.style.display = 'block';
    },
    
    closeModal() {
        console.log('Closing modals');
        
        // Hide all modals and the overlay
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) modalOverlay.style.display = 'none';
    },
    
    cleanup() {
        console.log('Cleaning up Modal Module');
        // Any specific modal cleanup
    }
};