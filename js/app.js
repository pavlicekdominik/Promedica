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
    
    const App = {
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
            
            await ComponentLoader.loadComponent('page-container', pagePath);
            
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
            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                loginForm.addEventListener('submit', function(e) {
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
                });
            }
        },
        
        bindNavigationEvents() {
            const navLinks = document.querySelectorAll('.nav-link');
            if (navLinks) {
                navLinks.forEach(link => {
                    link.addEventListener('click', function(e) {
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
                    });
                });
            }
        },
        
        bindToolbarEvents() {
            const userBtn = document.getElementById('open-user-modal');
            const settingsBtn = document.getElementById('open-settings-modal');
            const helpBtn = document.getElementById('open-help-modal');
            const newBtn = document.getElementById('open-new-menu');
            
            if (userBtn) {
                userBtn.addEventListener('click', () => {
                    window.dispatchEvent(new CustomEvent('app:openModal', {
                        detail: { modalId: 'user-modal' }
                    }));
                });
            }
            
            if (settingsBtn) {
                settingsBtn.addEventListener('click', () => {
                    window.dispatchEvent(new CustomEvent('app:openModal', {
                        detail: { modalId: 'settings-modal' }
                    }));
                });
            }
            
            if (helpBtn) {
                helpBtn.addEventListener('click', () => {
                    window.dispatchEvent(new CustomEvent('app:openModal', {
                        detail: { modalId: 'help-modal' }
                    }));
                });
            }
            
            if (newBtn) {
                newBtn.addEventListener('click', () => {
                    window.dispatchEvent(new CustomEvent('app:openModal', {
                        detail: { modalId: 'new-menu-modal' }
                    }));
                });
            }
        },
        
        bindPatientsListEvents() {
            const patientRows = document.querySelectorAll('.patient-row');
            if (patientRows) {
                patientRows.forEach(row => {
                    row.addEventListener('click', function(e) {
                        if (!e.target.classList.contains('edit-row-btn') && 
                            !e.target.closest('input[type="checkbox"]')) {
                            const patientId = this.getAttribute('data-id');
                            console.log('Patient clicked:', patientId);
                            
                            AppState.setActivePatient(patientId);
                            
                            window.dispatchEvent(new CustomEvent('app:navigate', {
                                detail: { page: 'patient-detail' }
                            }));
                        }
                    });
                });
            }
        },
        
        bindPatientDetailEvents() {
            const backBtn = document.getElementById('back-to-patients');
            if (backBtn) {
                backBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Back to patients list');
                    
                    window.dispatchEvent(new CustomEvent('app:navigate', {
                        detail: { page: 'patients-list' }
                    }));
                });
            }
            
            const patientTabs = document.querySelectorAll('.patient-tabs li a');
            patientTabs.forEach(tab => {
                tab.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    document.querySelectorAll('.patient-tabs li').forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    this.parentElement.classList.add('active');
                    console.log('Patient tab clicked:', this.textContent.trim());
                });
            });
        },
        
        bindCalendarEvents() {
            const appointments = document.querySelectorAll('.appointment');
            if (appointments) {
                appointments.forEach(appointment => {
                    appointment.addEventListener('click', function() {
                        console.log('Appointment clicked:', this.querySelector('.appointment-title').textContent);
                        
                        const detailPanel = document.querySelector('.appointment-detail');
                        if (detailPanel) {
                            detailPanel.style.display = detailPanel.style.display === 'block' ? 'none' : 'block';
                        }
                    });
                });
            }
            
            const closeDetailBtn = document.querySelector('.close-detail-btn');
            if (closeDetailBtn) {
                closeDetailBtn.addEventListener('click', function() {
                    const detailPanel = document.querySelector('.appointment-detail');
                    if (detailPanel) {
                        detailPanel.style.display = 'none';
                    }
                });
            }
        },
        
        bindModalEvents() {
            const modalOverlay = document.getElementById('modal-overlay');
            const closeButtons = document.querySelectorAll('.modal-close-btn');
            const logoutLink = document.querySelector('.modal-link');
            
            closeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    window.dispatchEvent(new CustomEvent('app:closeModal'));
                });
            });
            
            if (modalOverlay) {
                modalOverlay.addEventListener('click', () => {
                    window.dispatchEvent(new CustomEvent('app:closeModal'));
                });
            }
            
            if (logoutLink) {
                logoutLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('Log out clicked');
                    window.dispatchEvent(new CustomEvent('app:logout'));
                });
            }
            
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.addEventListener('click', function(e) {
                    e.stopPropagation();
                });
            });
            
            const menuOptions = document.querySelectorAll('.settings-item, .help-option, .new-menu-option');
            menuOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const label = this.querySelector('.settings-label, .help-label, .new-menu-label');
                    if (label) {
                        console.log('Menu option clicked:', label.textContent);
                        window.dispatchEvent(new CustomEvent('app:closeModal'));
                    }
                });
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
    
    App.init();
});