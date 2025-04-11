const ComponentLoader = {
    // Track active components and their event listeners
    _activeComponents: new Map(),
    
    async loadComponent(containerId, componentPath) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        
        // Unload any existing component in this container first
        this.unloadComponent(containerId);
        
        try {
            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
            
            const html = await response.text();
            container.innerHTML = html;
            
            // Register this as an active component
            this._activeComponents.set(containerId, {
                path: componentPath,
                elements: Array.from(container.querySelectorAll('*')),
                eventListeners: []
            });
            
            return container;
        } catch (error) {
            console.error(`Error loading component ${componentPath}:`, error);
            return null;
        }
    },
    
    async loadMultipleComponents(componentsMap) {
        const promises = Object.entries(componentsMap).map(([containerId, path]) => 
            this.loadComponent(containerId, path)
        );
        
        return Promise.all(promises);
    },
    
    unloadComponent(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return false;
        
        // Get the active component info
        const component = this._activeComponents.get(containerId);
        if (component) {
            // Find the module responsible for this component
            const moduleId = this._getModuleIdForContainer(containerId);
            if (moduleId && window[moduleId] && typeof window[moduleId].cleanup === 'function') {
                window[moduleId].cleanup();
            }
            
            // Clean up registered event listeners
            component.eventListeners.forEach(({ element, type, listener, options }) => {
                element.removeEventListener(type, listener, options);
            });
            
            // Clear component registration
            this._activeComponents.delete(containerId);
        }
        
        // Clear the container
        container.innerHTML = '';
        return true;
    },
    
    _getModuleIdForContainer(containerId) {
        // Map container IDs to their module global variables
        const moduleMap = {
            'auth-container': 'AuthModule',
            'sidebar-container': 'SidebarModule',
            'toolbar-container': 'ToolbarModule',
            'page-container': this._getPageModuleId(),
            'modals-container': 'ModalModule'
        };
        
        return moduleMap[containerId] || null;
    },
    
    _getPageModuleId() {
        // Determine which page module is active based on URL or state
        const currentPage = window.location.hash.substring(1) || 'patients-list';
        
        const pageModuleMap = {
            'patients-list': 'PatientsListModule',
            'patient-detail': 'PatientDetailModule',
            'calendar': 'CalendarModule'
        };
        
        return pageModuleMap[currentPage] || 'PatientsListModule';
    },
    
    unloadAllComponents() {
        for (const containerId of this._activeComponents.keys()) {
            this.unloadComponent(containerId);
        }
    },
    
    // Register an event listener to be cleaned up when component unloads
    registerEventListener(containerId, element, type, listener, options = {}) {
        const component = this._activeComponents.get(containerId);
        if (!component) return false;
        
        // Add the event listener
        element.addEventListener(type, listener, options);
        
        // Store it for cleanup later
        component.eventListeners.push({ element, type, listener, options });
        return true;
    }
};