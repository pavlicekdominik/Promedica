const App = {
    currentPage: 'patients-list',
    
    // Session and application state
    state: {
        activePatientId: null,
        
        setActivePatient(patientId) {
            this.activePatientId = patientId;
            return this;
        },
        
        getActivePatient() {
            return this.activePatientId;
        },
        
        // Authentication state checks
        isAuthenticated() {
            return localStorage.getItem('auth_token') !== null;
        },
        
        setAuthenticated(token) {
            localStorage.setItem('auth_token', token);
            return this;
        },
        
        clearAuthentication() {
            localStorage.removeItem('auth_token');
            return this;
        }
    },
    
    init() {
        console.log('Initializing Main Application');
        
        // Check if user is authenticated before loading main app
        if (!this.state.isAuthenticated()) {
            console.log('User not authenticated, redirecting to login');
            window.location.href = 'index.html';
            return;
        }
        
        this.setupInitialView();
        this.bindGlobalEvents();
        this.loadInitialPage();
    },
    
    setupInitialView() {
        // Load the persistent components (sidebar, toolbar)
        Promise.all([
            ComponentLoader.loadComponent('sidebar-container', 'components/layout/sidebar.html'),
            ComponentLoader.loadComponent('toolbar-container', 'components/layout/toolbar.html'),
            ComponentLoader.loadComponent('modals-container', 'components/modals/modals.html')
        ]).then(() => {
            // Initialize the modules for these components
            SidebarModule.init();
            ToolbarModule.init();
            ModalModule.init();
        });
    },
    
    loadInitialPage() {
        // Check URL hash for page to load, or use default
        const pageFromHash = window.location.hash.substring(1);
        const initialPage = pageFromHash || this.currentPage;
        
        this.navigateTo(initialPage);
    },
    
    navigateTo(pageName) {
        // Update current page tracking
        this.currentPage = pageName;
        window.location.hash = pageName;
        
        // Unload current page component
        ComponentLoader.unloadComponent('page-container');
        
        // Load the requested page component
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
                this.currentPage = 'patients-list';
        }
        
        // Load the new page component
        ComponentLoader.loadComponent('page-container', pagePath)
            .then(() => {
                // Initialize the corresponding module
                switch(this.currentPage) {
                    case 'patients-list':
                        PatientsListModule.init();
                        break;
                    case 'patient-detail':
                        PatientDetailModule.init();
                        break;
                    case 'calendar':
                        CalendarModule.init();
                        break;
                }
            });
    },
    
    bindGlobalEvents() {
        // Global navigation event
        window.addEventListener('app:navigate', (e) => {
            this.navigateTo(e.detail.page);
        });
        
        // Handle modal events
        window.addEventListener('app:openModal', (e) => {
            ModalModule.openModal(e.detail.modalId);
        });
        
        window.addEventListener('app:closeModal', () => {
            ModalModule.closeModal();
        });
        
        // Handle logout event
        window.addEventListener('app:logout', () => {
            this.logout();
        });
        
        // Handle back/forward browser navigation
        window.addEventListener('hashchange', () => {
            const pageFromHash = window.location.hash.substring(1);
            if (pageFromHash && pageFromHash !== this.currentPage) {
                this.navigateTo(pageFromHash);
            }
        });
        
        // Handle global error events
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error || e.message);
            // You could show an error modal here
        });
        
        // Global dummy button handler
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('dummy-btn')) {
                console.log('Dummy button clicked:', e.target.textContent.trim() || e.target.className);
                e.preventDefault();
            }
        });
    },
    
    logout() {
        console.log('Logging out user');
        
        // Clear authentication state
        this.state.clearAuthentication();
        
        // Redirect to login page
        window.location.href = 'index.html';
    }
};

// Initialize the app when the document is ready
document.addEventListener('DOMContentLoaded', () => App.init());