document.addEventListener('DOMContentLoaded', function() {
    console.log('Medical App Demo initialized');
    
    // Login Form Handling
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (email && password) {
                console.log('Login attempt with:', { email });
                window.location.href = 'main.html';
            } else {
                console.log('Login validation failed: Missing required fields');
                alert('Please fill in all required fields');
            }
        });
    }
    
    // Navigation handling
    const navLinks = document.querySelectorAll('.nav-link');
    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Navigation clicked:', this.textContent.trim());
                
                // Remove active class from all nav items
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to current nav item
                this.parentElement.classList.add('active');
                
                // Handle page switching for implemented pages
                const targetPage = this.getAttribute('data-page');
                if (targetPage) {
                    switchPage(targetPage);
                }
            });
        });
    }
    
    // Switch page function
    function switchPage(pageId) {
        console.log('Switching to page:', pageId);
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.querySelector(`.${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }
    
    // Patient row click handling
    const patientRows = document.querySelectorAll('.patient-row');
    if (patientRows) {
        patientRows.forEach(row => {
            row.addEventListener('click', function(e) {
                if (!e.target.classList.contains('edit-row-btn') && 
                    !e.target.closest('input[type="checkbox"]')) {
                    const patientId = this.getAttribute('data-id');
                    console.log('Patient clicked:', patientId);
                    switchPage('patient-detail');
                }
            });
        });
    }
    
    // Back button handling
    const backToPatients = document.getElementById('back-to-patients');
    if (backToPatients) {
        backToPatients.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Back to patients list');
            switchPage('patients-list');
        });
    }
    
    // Modal handling
    const modalOverlay = document.getElementById('modal-overlay');
    const modalButtons = {
        user: document.getElementById('open-user-modal'),
        settings: document.getElementById('open-settings-modal'),
        help: document.getElementById('open-help-modal'),
        new: document.getElementById('open-new-menu')
    };
    
    const modals = {
        user: document.getElementById('user-modal'),
        settings: document.getElementById('settings-modal'),
        help: document.getElementById('help-modal'),
        new: document.getElementById('new-menu-modal')
    };
    
    // Open modal function
    function openModal(modalId) {
        console.log('Opening modal:', modalId);
        
        // Hide all modals first
        Object.values(modals).forEach(modal => {
            if (modal) modal.style.display = 'none';
        });
        
        // Show the overlay and target modal
        if (modalOverlay) modalOverlay.style.display = 'block';
        if (modals[modalId]) modals[modalId].style.display = 'block';
    }
    
    // Close modal function
    function closeModal() {
        console.log('Closing modal');
        
        // Hide all modals and overlay
        Object.values(modals).forEach(modal => {
            if (modal) modal.style.display = 'none';
        });
        
        if (modalOverlay) modalOverlay.style.display = 'none';
    }
    
    // Modal button click handlers
    Object.entries(modalButtons).forEach(([id, button]) => {
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                openModal(id);
            });
        }
    });
    
    // Close buttons
    const closeButtons = document.querySelectorAll('.modal-close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });
    
    // Close on overlay click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Prevent closing when clicking inside modal content
    const modalContents = document.querySelectorAll('.modal');
    modalContents.forEach(modal => {
        modal.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    // Demo dummy buttons
    const dummyButtons = document.querySelectorAll('.btn, .toolbar-btn, .pagination-btn, .tag-remove, .btn-add-tag');
    dummyButtons.forEach(button => {
        if (!button.id || 
            !['open-user-modal', 'open-settings-modal', 'open-help-modal', 'open-new-menu', 'back-to-patients'].includes(button.id)) {
            button.addEventListener('click', function(e) {
                if (!this.type || this.type !== 'submit') {
                    e.preventDefault();
                }
                console.log('Button clicked:', this.textContent.trim() || this.className);
            });
        }
    });
    
    // Demo dropdown buttons
    const dropdowns = document.querySelectorAll('.dropdown-toggle');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Dropdown clicked:', this.textContent.trim());
        });
    });
    
    // Handle search clear button
    const searchClearBtn = document.querySelector('.search-clear-btn');
    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', function() {
            const searchInput = this.previousElementSibling;
            if (searchInput) {
                searchInput.value = '';
                console.log('Search cleared');
            }
        });
    }
    
    // Patient tabs
    const patientTabs = document.querySelectorAll('.patient-tabs li a');
    patientTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs
            document.querySelectorAll('.patient-tabs li').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to current tab
            this.parentElement.classList.add('active');
            
            console.log('Patient tab clicked:', this.textContent.trim());
        });
    });
    
    // Calendar appointments
    const appointments = document.querySelectorAll('.appointment');
    if (appointments) {
        appointments.forEach(appointment => {
            appointment.addEventListener('click', function() {
                console.log('Appointment clicked:', this.querySelector('.appointment-title').textContent);
                
                // In a real app, this would populate the detail panel
                // For this demo, we'll just toggle the detail panel
                const detailPanel = document.querySelector('.appointment-detail');
                if (detailPanel) {
                    detailPanel.style.display = detailPanel.style.display === 'block' ? 'none' : 'block';
                }
            });
        });
    }
    
    // Close appointment detail
    const closeDetailBtn = document.querySelector('.close-detail-btn');
    if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', function() {
            const detailPanel = document.querySelector('.appointment-detail');
            if (detailPanel) {
                detailPanel.style.display = 'none';
            }
        });
    }
    
    // Modal menu options
    const menuOptions = document.querySelectorAll('.settings-item, .help-option, .new-menu-option');
    menuOptions.forEach(option => {
        option.addEventListener('click', function() {
            const label = this.querySelector('.settings-label, .help-label, .new-menu-label');
            if (label) {
                console.log('Menu option clicked:', label.textContent);
                closeModal();
            }
        });
    });
    
    // Log out link
    const logoutLink = document.querySelector('.modal-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Log out clicked');
            window.location.href = 'index.html';
        });
    }
});