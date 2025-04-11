const AuthModule = {
    containerId: 'auth-container',
    
    init() {
        console.log('Initializing Auth Module');
        // Check if already authenticated, if so, redirect to app
        if (this.isAuthenticated()) {
            console.log('User already authenticated, redirecting to app');
            window.location.href = 'app.html';
            return;
        }
        
        this.loadLoginComponent()
            .then(() => this.bindEvents());
    },
    
    async loadLoginComponent() {
        await ComponentLoader.loadComponent(this.containerId, 'components/auth/login.html');
    },
    
    bindEvents() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            ComponentLoader.registerEventListener(
                this.containerId,
                loginForm,
                'submit',
                this.handleLogin.bind(this)
            );
        }
    },
    
    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        if (email && password) {
            console.log('Login attempt with:', { email });
            
            // Set authentication token in localStorage
            this.setAuthenticated('demo_token_' + Date.now());
            
            // Redirect to the main application
            window.location.href = 'app.html';
        } else {
            console.log('Login validation failed: Missing required fields');
            alert('Please fill in all required fields');
        }
    },
    
    isAuthenticated() {
        return localStorage.getItem('auth_token') !== null;
    },
    
    setAuthenticated(token) {
        localStorage.setItem('auth_token', token);
    },
    
    cleanup() {
        console.log('Cleaning up Auth Module');
    }
};

// Auto-initialize when the document is ready
document.addEventListener('DOMContentLoaded', () => AuthModule.init());