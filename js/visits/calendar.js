const CalendarModule = {
    containerId: 'page-container',
    
    init() {
        console.log('Initializing Calendar Module');
        this.bindEvents();
        
        // Start any timers or interval updates for the calendar
        this.startTimeUpdates();
        
        // Update sidebar state
        if (window.SidebarModule) {
            SidebarModule.setActivePage('calendar');
        }
    },
    
    bindEvents() {
        // Calendar appointments
        const appointments = document.querySelectorAll('.appointment');
        if (appointments) {
            appointments.forEach(appointment => {
                ComponentLoader.registerEventListener(
                    this.containerId,
                    appointment,
                    'click',
                    function() {
                        console.log('Appointment clicked:', this.querySelector('.appointment-title').textContent);
                        
                        // Show appointment details
                        const detailPanel = document.querySelector('.appointment-detail');
                        if (detailPanel) {
                            detailPanel.style.display = detailPanel.style.display === 'block' ? 'none' : 'block';
                        }
                    }
                );
            });
        }
        
        // Close appointment detail panel
        const closeDetailBtn = document.querySelector('.close-detail-btn');
        if (closeDetailBtn) {
            ComponentLoader.registerEventListener(
                this.containerId,
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
        
        // Action buttons
        const actionButtons = document.querySelectorAll('.page-controls .btn');
        if (actionButtons) {
            actionButtons.forEach(button => {
                ComponentLoader.registerEventListener(
                    this.containerId,
                    button,
                    'click',
                    function() {
                        console.log('Calendar action clicked:', this.textContent.trim());
                        // Handle specific calendar actions
                    }
                );
            });
        }
    },
    
    startTimeUpdates() {
        // Update the current time indicator every minute
        this.timeUpdateInterval = setInterval(() => {
            this.updateCurrentTime();
        }, 60000); // 60 seconds
        
        // Initial time update
        this.updateCurrentTime();
    },
    
    updateCurrentTime() {
        // In a real calendar app, this would update a visual indicator for the current time
        console.log('Updating current time indicator:', new Date().toLocaleTimeString());
    },
    
    cleanup() {
        console.log('Cleaning up Calendar Module');
        
        // Stop any active timers
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
            this.timeUpdateInterval = null;
        }
    }
};