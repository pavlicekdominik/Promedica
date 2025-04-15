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
        // Desktop patient rows
        const patientRows = document.querySelectorAll('.patient-row');
        if (patientRows) {
            patientRows.forEach(row => {
                ComponentLoader.registerEventListener(
                    this.containerId,
                    row,
                    'click',
                    this.handlePatientSelection
                );
            });
        }
        
        // Mobile patient cards
        const patientCards = document.querySelectorAll('.patient-card');
        if (patientCards) {
            patientCards.forEach(card => {
                ComponentLoader.registerEventListener(
                    this.containerId,
                    card,
                    'click',
                    this.handlePatientSelection
                );
            });
        }
        
        // Detail links in mobile cards (right arrow)
        const detailLinks = document.querySelectorAll('.detail-link');
        if (detailLinks) {
            detailLinks.forEach(link => {
                ComponentLoader.registerEventListener(
                    this.containerId,
                    link,
                    'click',
                    function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        const patientId = this.closest('.patient-card').getAttribute('data-id');
                        PatientsListModule.navigateToPatient(patientId);
                    }
                );
            });
        }
        
        // New Patient button (desktop)
        const newButton = document.querySelector('.new-button');
        if (newButton) {
            ComponentLoader.registerEventListener(
                this.containerId,
                newButton,
                'click',
                this.handleNewPatient
            );
        }
        
        // Mobile New button (bottom navigation)
        const mobileNewButton = document.querySelector('.mobile-nav-item:nth-child(1)');
        if (mobileNewButton) {
            ComponentLoader.registerEventListener(
                this.containerId,
                mobileNewButton,
                'click',
                this.handleNewPatient
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
                    console.log('Mobile Deactivate button clicked');
                    // Handle deactivation logic
                }
            );
        }
        
        // Mobile Edit button (bottom navigation)
        const mobileEditButton = document.querySelector('.mobile-nav-item:nth-child(3)');
        if (mobileEditButton) {
            ComponentLoader.registerEventListener(
                this.containerId,
                mobileEditButton,
                'click',
                function(e) {
                    e.preventDefault();
                    console.log('Mobile Edit button clicked');
                    // Handle edit logic
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

        // Mobile menu button
        const menuButton = document.querySelector('.menu-btn');
        if (menuButton) {
            ComponentLoader.registerEventListener(
                this.containerId,
                menuButton,
                'click',
                function() {
                    console.log('Menu button clicked');
                    // Toggle mobile sidebar/menu
                    // Implementation will depend on how the mobile menu is designed
                }
            );
        }
    },
    
    handlePatientSelection: function(e) {
        if (!e.target.classList.contains('edit-row-btn') && 
            !e.target.closest('input[type="checkbox"]') &&
            !e.target.closest('.detail-link')) {
            const patientId = this.getAttribute('data-id');
            PatientsListModule.navigateToPatient(patientId);
        }
    },
    
    navigateToPatient: function(patientId) {
        console.log('Patient selected:', patientId);
        
        if (window.App && App.state) {
            App.state.setActivePatient(patientId);
        }
        
        window.dispatchEvent(new CustomEvent('app:navigate', {
            detail: { page: 'patient-detail' }
        }));
    },
    
    handleNewPatient: function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('New Patient button clicked');
        
        window.dispatchEvent(new CustomEvent('app:openModal', {
            detail: { modalId: 'new-patient-modal' }
        }));
    },
    
    cleanup() {
        console.log('Cleaning up Patients List Module');
        // Save any user selections or filters
    }
};