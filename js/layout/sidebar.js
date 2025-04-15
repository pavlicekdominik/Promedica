const SidebarModule = {
    containerId: 'sidebar-container',
    
    init() {
        console.log('Initializing Sidebar Module');
        this.bindEvents();
    },
    
    bindEvents() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (navLinks) {
            navLinks.forEach(link => {
                ComponentLoader.registerEventListener(
                    this.containerId,
                    link,
                    'click',
                    function(e) {
                        e.preventDefault();
                        console.log('Navigation clicked:', this.textContent.trim());
                        
                        // Remove active class from all nav items
                        document.querySelectorAll('.nav-item').forEach(item => {
                            item.classList.remove('active');
                        });
                        
                        // Add active class to clicked nav item
                        this.parentElement.classList.add('active');
                        
                        // Get the target page from data attribute
                        const targetPage = this.getAttribute('data-page');
                        if (targetPage) {
                            window.dispatchEvent(new CustomEvent('app:navigate', {
                                detail: { page: targetPage }
                            }));
                        }

                        const mobileMenu = document.querySelector('.mobile-menu-open');

                        if (mobileMenu) {
                            mobileMenu.classList.remove('mobile-menu-open');
                        }

                    }
                );
            });
        }
    },
    
    setActivePage(pageName) {
        // Update the active state in the sidebar based on current page
        document.querySelectorAll('.nav-item').forEach(item => {
            const link = item.querySelector('.nav-link');
            if (link && link.getAttribute('data-page') === pageName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    },
    
    cleanup() {
        console.log('Cleaning up Sidebar Module');
        // Any specific sidebar cleanup
    }
};