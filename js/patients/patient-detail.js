const PatientDetailModule = {
    containerId: 'page-container',
    
    init() {
        console.log('Initializing Patient Detail Module');
        
        // Load data for the active patient
        this.loadPatientData();
        this.bindEvents();
        
        // Update sidebar state
        if (window.SidebarModule) {
            SidebarModule.setActivePage('patient-detail');
        }
    },
    
    loadPatientData() {
        // In a real app, this would fetch patient data from a server
        // For this demo, we'll use the patient ID from App state
        
        let patientId = null;
        if (window.App && App.state) {
            patientId = App.state.getActivePatient();
        }
        
        console.log('Loading data for patient ID:', patientId || 'default');
        
        // We would normally update the UI with patient data here
    },
    
    bindEvents() {
        // Back button
        const backBtn = document.getElementById('back-to-patients');
        if (backBtn) {
            ComponentLoader.registerEventListener(
                this.containerId,
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
                        
                        // Update active tab
                        document.querySelectorAll('.patient-tabs li').forEach(item => {
                            item.classList.remove('active');
                        });
                        
                        this.parentElement.classList.add('active');
                        console.log('Patient tab clicked:', this.textContent.trim());
                        
                        // In a real app, we would load tab-specific content here
                        // const tabName = this.getAttribute('data-tab-name');
                        // PatientDetailModule.loadTabContent(tabName);
                    }
                );
            });
        }
        
        // Form fields - save changes as they happen
        const formInputs = document.querySelectorAll('input, select');
        if (formInputs) {
            formInputs.forEach(input => {
                ComponentLoader.registerEventListener(
                    this.containerId,
                    input,
                    'change',
                    function() {
                        console.log('Form field changed:', this.name || this.id, 'Value:', this.value);
                        // In a real app, we might auto-save this change
                    }
                );
            });
        }
    },
    
    cleanup() {
        console.log('Cleaning up Patient Detail Module');
        
        // Save any unsaved form data
        this.saveFormData();
    },
    
    saveFormData() {
        console.log('Saving patient form data');
        // In a real app, this would collect form data and save it
        // For demo purposes, we just log that it happened
    }
};