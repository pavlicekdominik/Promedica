const PatientsListModule = {
    containerId: 'page-container',
    
    init() {
        console.log('Initializing Patients List Module');
        this.bindEvents();
        
        // Update sidebar state
        if (window.SidebarModule) {
            SidebarModule.setActivePage('patients-list');
        }
    },
    
    bindEvents() {
        const patientRows = document.querySelectorAll('.patient-row');
        
        if (patientRows) {
            patientRows.forEach(row => {
                ComponentLoader.registerEventListener(
                    this.containerId,
                    row,
                    'click',
                    function(e) {
                        if (!e.target.classList.contains('edit-row-btn') && 
                            !e.target.closest('input[type="checkbox"]')) {
                            const patientId = this.getAttribute('data-id');
                            console.log('Patient clicked:', patientId);
                            
                            // Store the selected patient ID in App state
                            if (window.App && App.state) {
                                App.state.setActivePatient(patientId);
                            }
                            
                            // Navigate to patient detail page
                            window.dispatchEvent(new CustomEvent('app:navigate', {
                                detail: { page: 'patient-detail' }
                            }));
                        }
                    }
                );
            });
        }
        
        // New Button - Open New Patient Modal
        const newButton = document.querySelector('.new-button');
        if (newButton) {
            ComponentLoader.registerEventListener(
                this.containerId,
                newButton,
                'click',
                function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('New Patient button clicked');
                    
                    // Open the new patient modal
                    window.dispatchEvent(new CustomEvent('app:openModal', {
                        detail: { modalId: 'new-patient-modal' }
                    }));
                }
            );
        }
        
        // Pagination buttons
        const paginationButtons = document.querySelectorAll('.pagination-btn');
        if (paginationButtons) {
            paginationButtons.forEach(button => {
                ComponentLoader.registerEventListener(
                    this.containerId,
                    button,
                    'click',
                    function() {
                        console.log('Pagination button clicked:', this.className);
                        // In a real app, this would load the next page of patients
                    }
                );
            });
        }
    },
    
    cleanup() {
        console.log('Cleaning up Patients List Module');
        // Save any user selections or filters
    }
};