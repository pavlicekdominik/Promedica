document.addEventListener('DOMContentLoaded', function() {
    console.log('Medical App Demo initialized');
    
    const AppState = {
        currentPage: 'patients-list',
        isAuthenticated: false,
        activePatientId: null,
        
        setCurrentPage(pageName) {
            this.currentPage = pageName;
            return this;
        },
        
        setAuthenticated(status) {
            this.isAuthenticated = status;
            return this;
        },
        
        setActivePatient(patientId) {
            this.activePatientId = patientId;
            return this;
        }
    };
    
    // Component lifecycle handlers
    const componentLifecycle = {
        // Map to store component-specific cleanup functions
        _cleanupHandlers: new Map(),
        
        // Register a cleanup handler for a specific container
        registerCleanup(containerId, cleanupFn) {
            this._cleanupHandlers.set(containerId, cleanupFn);
        },
        
        // Called before a component is unloaded
        onBeforeUnload(containerId) {
            const cleanupFn = this._cleanupHandlers.get(containerId);
            if (cleanupFn && typeof cleanupFn === 'function') {
                try {
                    cleanupFn();
                } catch (error) {
                    console.error(`Error in cleanup for ${containerId}:`, error);
                }
                this._cleanupHandlers.delete(containerId);
            }
        }
    };
    
    const App = {
        componentLifecycle,
        
        async init() {
            await this.setupInitialView();
            this.bindGlobalEvents();
        },
        
        async setupInitialView() {
            if (AppState.isAuthenticated) {
                await this.loadMainApplication();
            } else {
                await this.loadAuthView();
            }
        },
        
        async loadAuthView() {
            document.getElementById('auth-container').classList.add('active');
            document.getElementById('main-container').classList.remove('active');
            
            await ComponentLoader.loadComponent('auth-container', 'components/auth/login.html');
            this.bindAuthEvents();
        },
        
        async loadMainApplication() {
            document.getElementById('auth-container').classList.remove('active');
            document.getElementById('main-container').classList.add('active');
            
            await ComponentLoader.loadMultipleComponents({
                'sidebar-container': 'components/layout/sidebar.html',
                'toolbar-container': 'components/layout/toolbar.html'
            });
            
            await this.loadPage(AppState.currentPage);
            await this.loadModals();
            
            this.bindNavigationEvents();
            this.bindToolbarEvents();
        },
        
        async loadPage(pageName) {
            // First unload the current page
            this.unloadCurrentPage();
            
            // Update app state
            AppState.setCurrentPage(pageName);
            let pagePath;
            
            switch(pageName) {
                case 'patients-list':
                    pagePath = 'components/patients/patients-list.html';
                    break;
                case 'patient-detail':
                    pagePath = 'components/patients/patient-detail.html';
                    break;
                case 'calendar':
                    pagePath = 'components/visits/calendar.html';
                    break;
                default:
                    pagePath = 'components/patients/patients-list.html';
            }
            
            // Load the new page component
            await ComponentLoader.loadComponent('page-container', pagePath);
            
            // Bind page-specific events
            switch(pageName) {
                case 'patients-list':
                    this.bindPatientsListEvents();
                    break;
                case 'patient-detail':
                    this.bindPatientDetailEvents();
                    break;
                case 'calendar':
                    this.bindCalendarEvents();
                    break;
            }
        },
        
        unloadCurrentPage() {
            const currentPage = AppState.currentPage;
            console.log(`Unloading current page: ${currentPage}`);
            
            // Register cleanup for the specific page if needed
            switch(currentPage) {
                case 'patients-list':
                    // Example cleanup - remove any polling intervals
                    this.componentLifecycle.registerCleanup('page-container', () => {
                        console.log('Cleaning up patients list page');
                        // Clear any timers, abort any fetches, etc.
                    });
                    break;
                case 'patient-detail':
                    this.componentLifecycle.registerCleanup('page-container', () => {
                        console.log('Cleaning up patient detail page');
                        // Save draft form data or other cleanup
                    });
                    break;
                case 'calendar':
                    this.componentLifecycle.registerCleanup('page-container', () => {
                        console.log('Cleaning up calendar page');
                        // Clear any calendar-specific timers
                    });
                    break;
            }
        },
        
        async loadModals() {
            await ComponentLoader.loadMultipleComponents({
                'modals-container': 'components/modals/modals.html'
            });
            this.bindModalEvents();
        },
        
        bindGlobalEvents() {
            document.addEventListener('click', function(e) {
                if (e.target.matches('.dummy-btn')) {
                    console.log('Dummy button clicked:', e.target.textContent.trim() || e.target.className);
                    e.preventDefault();
                }
            });
            
            window.addEventListener('app:navigate', (e) => {
                this.loadPage(e.detail.page);
            });
            
            window.addEventListener('app:login', () => {
                AppState.setAuthenticated(true);
                this.loadMainApplication();
            });
            
            window.addEventListener('app:logout', () => {
                AppState.setAuthenticated(false);
                this.loadAuthView();
            });
            
            window.addEventListener('app:openModal', (e) => {
                this.openModal(e.detail.modalId);
            });
            
            window.addEventListener('app:closeModal', () => {
                this.closeModal();
            });
        },
        
        bindAuthEvents() {
            const containerId = 'auth-container';
            const loginForm = document.getElementById('login-form');
            
            if (loginForm) {
                ComponentLoader.registerEventListener(
                    containerId,
                    loginForm,
                    'submit',
                    function(e) {
                        e.preventDefault();
                        const email = document.getElementById('email').value;
                        const password = document.getElementById('password').value;
                        
                        if (email && password) {
                            console.log('Login attempt with:', { email });
                            window.dispatchEvent(new CustomEvent('app:login'));
                        } else {
                            console.log('Login validation failed: Missing required fields');
                            alert('Please fill in all required fields');
                        }
                    }
                );
            }
        },
        
        bindNavigationEvents() {
            const containerId = 'sidebar-container';
            const navLinks = document.querySelectorAll('.nav-link');
            
            if (navLinks) {
                navLinks.forEach(link => {
                    ComponentLoader.registerEventListener(
                        containerId,
                        link,
                        'click',
                        function(e) {
                            e.preventDefault();
                            console.log('Navigation clicked:', this.textContent.trim());
                            
                            document.querySelectorAll('.nav-item').forEach(item => {
                                item.classList.remove('active');
                            });
                            
                            this.parentElement.classList.add('active');
                            
                            const targetPage = this.getAttribute('data-page');
                            if (targetPage) {
                                window.dispatchEvent(new CustomEvent('app:navigate', {
                                    detail: { page: targetPage }
                                }));
                            }
                        }
                    );
                });
            }
        },
        
        bindToolbarEvents() {
            const containerId = 'toolbar-container';
            
            const userBtn = document.getElementById('open-user-modal');
            const settingsBtn = document.getElementById('open-settings-modal');
            const helpBtn = document.getElementById('open-help-modal');
            const newBtn = document.getElementById('open-new-menu');
            
            if (userBtn) {
                ComponentLoader.registerEventListener(
                    containerId,
                    userBtn,
                    'click',
                    () => {
                        window.dispatchEvent(new CustomEvent('app:openModal', {
                            detail: { modalId: 'user-modal' }
                        }));
                    }
                );
            }
            
            if (settingsBtn) {
                ComponentLoader.registerEventListener(
                    containerId,
                    settingsBtn,
                    'click',
                    () => {
                        window.dispatchEvent(new CustomEvent('app:openModal', {
                            detail: { modalId: 'settings-modal' }
                        }));
                    }
                );
            }
            
            if (helpBtn) {
                ComponentLoader.registerEventListener(
                    containerId,
                    helpBtn,
                    'click',
                    () => {
                        window.dispatchEvent(new CustomEvent('app:openModal', {
                            detail: { modalId: 'help-modal' }
                        }));
                    }
                );
            }
            
            if (newBtn) {
                ComponentLoader.registerEventListener(
                    containerId,
                    newBtn,
                    'click',
                    () => {
                        window.dispatchEvent(new CustomEvent('app:openModal', {
                            detail: { modalId: 'new-menu-modal' }
                        }));
                    }
                );
            }
        },
        
        bindPatientsListEvents() {
            const containerId = 'page-container';
            const patientRows = document.querySelectorAll('.patient-row');
            
            if (patientRows) {
                patientRows.forEach(row => {
                    // Using the registerEventListener method to track and clean up events
                    ComponentLoader.registerEventListener(
                        containerId,
                        row,
                        'click',
                        function(e) {
                            if (!e.target.classList.contains('edit-row-btn') && 
                                !e.target.closest('input[type="checkbox"]')) {
                                const patientId = this.getAttribute('data-id');
                                console.log('Patient clicked:', patientId);
                                
                                AppState.setActivePatient(patientId);
                                
                                window.dispatchEvent(new CustomEvent('app:navigate', {
                                    detail: { page: 'patient-detail' }
                                }));
                            }
                        }
                    );
                });
            }
        },
        
        bindPatientDetailEvents() {
            const containerId = 'page-container';
            
            const backBtn = document.getElementById('back-to-patients');
            if (backBtn) {
                ComponentLoader.registerEventListener(
                    containerId,
                    backBtn,
                    'click',
                    function(e) {
                        e.preventDefault();
                        console.log('Back to patients list');
                        
                        window.dispatchEvent(new CustomEvent('app:navigate', {
                            detail: { page: 'patients-list' }
                        }));
                    }
                );
            }
            
            const patientTabs = document.querySelectorAll('.patient-tabs li a');
            patientTabs.forEach(tab => {
                ComponentLoader.registerEventListener(
                    containerId,
                    tab,
                    'click',
                    function(e) {
                        e.preventDefault();
                        
                        document.querySelectorAll('.patient-tabs li').forEach(item => {
                            item.classList.remove('active');
                        });
                        
                        this.parentElement.classList.add('active');
                        console.log('Patient tab clicked:', this.textContent.trim());
                        
                        // Here you would typically load the tab-specific content component
                        // const tabName = this.getAttribute('data-tab');
                        // ComponentLoader.loadComponent('patient-tab-content', `components/patients/patient-tabs/${tabName}.html`);
                    }
                );
            });
            
            // Register cleanup for any form values if needed
            this.componentLifecycle.registerCleanup(containerId, () => {
                // Save form state or perform other cleanup
                console.log('Saving draft patient data before unloading');
                // You could save form data to localStorage here
            });
        },
        
        bindCalendarEvents() {
            const containerId = 'page-container';
            
            const appointments = document.querySelectorAll('.appointment');
            if (appointments) {
                appointments.forEach(appointment => {
                    ComponentLoader.registerEventListener(
                        containerId,
                        appointment,
                        'click',
                        function() {
                            console.log('Appointment clicked:', this.querySelector('.appointment-title').textContent);
                            
                            const detailPanel = document.querySelector('.appointment-detail');
                            if (detailPanel) {
                                detailPanel.style.display = detailPanel.style.display === 'block' ? 'none' : 'block';
                            }
                        }
                    );
                });
            }
            
            const closeDetailBtn = document.querySelector('.close-detail-btn');
            if (closeDetailBtn) {
                ComponentLoader.registerEventListener(
                    containerId,
                    closeDetailBtn,
                    'click',
                    function() {
                        const detailPanel = document.querySelector('.appointment-detail');
                        if (detailPanel) {
                            detailPanel.style.display = 'none';
                        }
                    }
                );
            }
        },
        
        bindModalEvents() {
            const containerId = 'modals-container';
            
            const modalOverlay = document.getElementById('modal-overlay');
            const closeButtons = document.querySelectorAll('.modal-close-btn');
            const logoutLink = document.querySelector('.modal-link');
            
            closeButtons.forEach(button => {
                ComponentLoader.registerEventListener(
                    containerId,
                    button,
                    'click',
                    () => {
                        window.dispatchEvent(new CustomEvent('app:closeModal'));
                    }
                );
            });
            
            if (modalOverlay) {
                ComponentLoader.registerEventListener(
                    'modal-overlay',
                    modalOverlay,
                    'click',
                    () => {
                        window.dispatchEvent(new CustomEvent('app:closeModal'));
                    }
                );
            }
            
            if (logoutLink) {
                ComponentLoader.registerEventListener(
                    containerId,
                    logoutLink,
                    'click',
                    function(e) {
                        e.preventDefault();
                        console.log('Log out clicked');
                        window.dispatchEvent(new CustomEvent('app:logout'));
                    }
                );
            }
            
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                ComponentLoader.registerEventListener(
                    containerId,
                    modal,
                    'click',
                    function(e) {
                        e.stopPropagation();
                    }
                );
            });
            
            const menuOptions = document.querySelectorAll('.settings-item, .help-option, .new-menu-option');
            menuOptions.forEach(option => {
                ComponentLoader.registerEventListener(
                    containerId,
                    option,
                    'click',
                    function() {
                        const label = this.querySelector('.settings-label, .help-label, .new-menu-label');
                        if (label) {
                            console.log('Menu option clicked:', label.textContent);
                            window.dispatchEvent(new CustomEvent('app:closeModal'));
                        }
                    }
                );
            });
        },
        
        openModal(modalId) {
            console.log('Opening modal:', modalId);
            
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            
            const modalOverlay = document.getElementById('modal-overlay');
            const targetModal = document.getElementById(modalId);
            
            if (modalOverlay) modalOverlay.style.display = 'block';
            if (targetModal) targetModal.style.display = 'block';
        },
        
        closeModal() {
            console.log('Closing modal');
            
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = 'none';
            });
            
            const modalOverlay = document.getElementById('modal-overlay');
            if (modalOverlay) modalOverlay.style.display = 'none';
        }
    };
    
    // Make App globally available for component-loader to access lifecycle methods
    window.App = App;
    
    // Initialize the application
    App.init();
});