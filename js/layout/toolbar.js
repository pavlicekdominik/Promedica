const ToolbarModule = {
    containerId: 'toolbar-container',
    
    init() {
        console.log('Initializing Toolbar Module');
        this.bindEvents();
    },
    
    bindEvents() {
        // Modal opener buttons
        const userBtn = document.getElementById('open-user-modal');
        const settingsBtn = document.getElementById('open-settings-modal');
        const helpBtn = document.getElementById('open-help-modal');
        const newBtn = document.getElementById('open-new-menu');
        
        if (userBtn) {
            ComponentLoader.registerEventListener(
                this.containerId,
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
                this.containerId,
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
                this.containerId,
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
                this.containerId,
                newBtn,
                'click',
                () => {
                    window.dispatchEvent(new CustomEvent('app:openModal', {
                        detail: { modalId: 'new-menu-modal' }
                    }));
                }
            );
        }
        
        // Search clear button
        const searchClearBtn = document.querySelector('.search-clear-btn');
        if (searchClearBtn) {
            ComponentLoader.registerEventListener(
                this.containerId,
                searchClearBtn,
                'click',
                function() {
                    const searchInput = this.previousElementSibling;
                    if (searchInput) {
                        searchInput.value = '';
                        console.log('Search cleared');
                    }
                }
            );
        }

        const menuBtn = document.querySelector('.menu-btn');
        if (menuBtn) {
            ComponentLoader.registerEventListener(
                this.containerId,
                menuBtn,
                'click',
                (e) => {
                    e.stopPropagation(); // Prevent document click from immediately closing
                    document.body.classList.toggle('mobile-menu-open');
                    console.log('Mobile menu toggled');
                }
            );
            
            // Add document click handler to close menu
            document.addEventListener('click', (e) => {
                // Close menu if clicking outside the sidebar
                if (document.body.classList.contains('mobile-menu-open') && 
                    !e.target.closest('.sidebar') && 
                    !e.target.closest('.menu-btn')) {
                    document.body.classList.remove('mobile-menu-open');
                }
            });
            
            // Prevent sidebar clicks from closing menu
            /*
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                ComponentLoader.registerEventListener(
                    'sidebar-container',
                    sidebar,
                    'click',
                    (e) => {
                        e.stopPropagation();
                    }
                );
            }
            */
        }
    },
    
    cleanup() {
        console.log('Cleaning up Toolbar Module');
        // Any specific toolbar cleanup
    }
};