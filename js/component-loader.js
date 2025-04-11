const ComponentLoader = {
    async loadComponent(containerId, componentPath) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        
        try {
            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
            
            const html = await response.text();
            container.innerHTML = html;
            
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
    }
};