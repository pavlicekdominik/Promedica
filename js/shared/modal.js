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
        
        if (logoutLink) {
            ComponentLoader.registerEventListener(
                this.containerId,
                logoutLink,
                'click',
                (e) => {
                    e.preventDefault();
                    localStorage.removeItem('auth_token');
                    window.location.replace('index.html');
                }
            );
        }
        
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
                            // For new patient option, open the new patient modal
                            if (this.id === 'new-patient-option') {
                                ModalModule.closeModal();
                                setTimeout(() => {
                                    ModalModule.openModal('new-patient-modal');
                                }, 300);
                            } else {
                                ModalModule.closeModal();
                            }
                        }
                    }
                );
            });
        }
        
        // Add event listeners for the new patient modal buttons
        const cancelNewPatientBtn = document.getElementById('cancel-new-patient');
        if (cancelNewPatientBtn) {
            ComponentLoader.registerEventListener(
                this.containerId,
                cancelNewPatientBtn,
                'click',
                () => {
                    this.closeModal();
                }
            );
        }
        
        const continueNewPatientBtn = document.getElementById('continue-new-patient');
        if (continueNewPatientBtn) {
            ComponentLoader.registerEventListener(
                this.containerId,
                continueNewPatientBtn,
                'click',
                () => {
                    // Handle form submission here
                    console.log('New patient form submitted');
                    this.closeModal();
                    // Redirect to patient detail or other page as needed
                }
            );
        }
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    },
    
    openModal(modalId) {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
            modal.classList.remove('visible');
        });
        
        const modalOverlay = document.getElementById('modal-overlay');
        const targetModal = document.getElementById(modalId);
        
        if (modalOverlay) {
            modalOverlay.style.display = 'block';
            setTimeout(() => {
                modalOverlay.classList.add('visible');
            }, 10);
        }
        
        if (targetModal) {
            targetModal.style.display = 'block';
            setTimeout(() => {
                targetModal.classList.add('visible');
            }, 10);
        }
        
        document.body.classList.add('modal-open');
        document.documentElement.classList.add('blur-background');
    },
    
    closeModal() {
        const activeModals = document.querySelectorAll('.modal[style*="display: block"]');
        const modalOverlay = document.getElementById('modal-overlay');
        
        if (modalOverlay) {
            modalOverlay.classList.remove('visible');
        }
        
        activeModals.forEach(modal => {
            modal.classList.remove('visible');
        });
        
        setTimeout(() => {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            
            if (modalOverlay) modalOverlay.style.display = 'none';
            
            document.body.classList.remove('modal-open');
            document.documentElement.classList.remove('blur-background');
        }, 300);
    },
    
    cleanup() {
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('blur-background');
    }
};