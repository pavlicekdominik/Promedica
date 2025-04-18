const PatientDetailModule = {
    containerId: 'page-container',
    
    init() {
        console.log('Initializing Patient Detail Module');
        this.loadPatientData();
        this.bindEvents();
        
        if (window.SidebarModule) {
            SidebarModule.setActivePage('patient-detail');
        }
    },
    
    loadPatientData() {
        let patientId = null;
        if (window.App && App.state) {
            patientId = App.state.getActivePatient();
        }
        
        console.log('Loading data for patient ID:', patientId || 'default');
    },
    
    bindEvents() {
        const deactivateButton = document.querySelector('.deactivate-button');
        if (deactivateButton) {
            ComponentLoader.registerEventListener(
                this.containerId,
                deactivateButton,
                'click',
                function() {
                    window.dispatchEvent(new CustomEvent('app:openModal', {
                        detail: { modalId: 'deactivation-confirm-modal' }
                    }));
                }
            );
        }
        
        // Mobile Deactivate button (bottom navigation)
        const mobileDeactivateButton = document.querySelector('.mobile-nav-item:nth-child(2)');
        if (mobileDeactivateButton) {
            ComponentLoader.registerEventListener(
                this.containerId,
                mobileDeactivateButton,
                'click',
                function(e) {
                    e.preventDefault();
                    window.dispatchEvent(new CustomEvent('app:openModal', {
                        detail: { modalId: 'deactivation-confirm-modal' }
                    }));
                }
            );
        }
        
        // Use querySelectorAll to get all back buttons (desktop and mobile)
        const backBtns = document.querySelectorAll('.back-btn');
        if (backBtns.length) {
            backBtns.forEach(btn => {
                ComponentLoader.registerEventListener(
                    this.containerId,
                    btn,
                    'click',
                    function(e) {
                        e.preventDefault();
                        console.log('Back to patients list');
                        
                        window.dispatchEvent(new CustomEvent('app:navigate', {
                            detail: { page: 'patients-list' }
                        }));
                    }
                );
                
                // Add touch event for mobile
                ComponentLoader.registerEventListener(
                    this.containerId,
                    btn,
                    'touchstart',
                    function(e) {
                        e.preventDefault();
                        console.log('Back to patients list (touch)');
                        
                        window.dispatchEvent(new CustomEvent('app:navigate', {
                            detail: { page: 'patients-list' }
                        }));
                    }
                );
            });
        }
        
        // Rest of the code remains the same
        // Patient tabs
        const patientTabs = document.querySelectorAll('.patient-tabs li a');
        if (patientTabs) {
            patientTabs.forEach(tab => {
                ComponentLoader.registerEventListener(
                    this.containerId,
                    tab,
                    'click',
                    function(e) {
                        e.preventDefault();
                        
                        document.querySelectorAll('.patient-tabs li').forEach(item => {
                            item.classList.remove('active');
                        });
                        
                        this.parentElement.classList.add('active');
                        console.log('Patient tab clicked:', this.textContent.trim());
                    }
                );
            });
        }
        
        // Form fields
        const formInputs = document.querySelectorAll('input, select');
        if (formInputs) {
            formInputs.forEach(input => {
                ComponentLoader.registerEventListener(
                    this.containerId,
                    input,
                    'change',
                    function() {
                        console.log('Form field changed:', this.name || this.id, 'Value:', this.value);
                    }
                );
            });
        }
    },
    
    cleanup() {
        console.log('Cleaning up Patient Detail Module');
        this.saveFormData();
    },
    
    saveFormData() {
        console.log('Saving patient form data');
    }
};