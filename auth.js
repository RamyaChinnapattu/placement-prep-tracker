// Authentication and session management
class AuthManager {
    constructor() {
        this.init();
    }

    init() {
        // Check if we're on the login page
        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            this.setupLoginPage();
        }
        
        // Check if we're on the dashboard
        if (window.location.pathname.includes('dashboard.html')) {
            this.checkAuth();
        }
    }

    setupLoginPage() {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const showSignup = document.getElementById('showSignup');
        const showLogin = document.getElementById('showLogin');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }

        if (showSignup) {
            showSignup.addEventListener('click', (e) => {
                e.preventDefault();
                loginForm.classList.add('hidden');
                signupForm.classList.remove('hidden');
            });
        }

        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                signupForm.classList.add('hidden');
                loginForm.classList.remove('hidden');
            });
        }
    }

    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('authError');

        try {
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            
            if (users[email] && users[email].password === password) {
                localStorage.setItem('currentUser', email);
                localStorage.setItem('isAuthenticated', 'true');
                window.location.href = 'dashboard.html';
            } else {
                this.showError(errorDiv, 'Invalid email or password');
            }
        } catch (error) {
            this.showError(errorDiv, 'An error occurred. Please try again.');
            console.error('Login error:', error);
        }
    }

    handleSignup() {
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirm = document.getElementById('signupConfirm').value;
        const errorDiv = document.getElementById('signupError');

        if (password !== confirm) {
            this.showError(errorDiv, 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            this.showError(errorDiv, 'Password must be at least 6 characters');
            return;
        }

        try {
            const users = JSON.parse(localStorage.getItem('users') || '{}');
            
            if (users[email]) {
                this.showError(errorDiv, 'Email already registered');
                return;
            }

            users[email] = { password, createdAt: new Date().toISOString() };
            localStorage.setItem('users', JSON.stringify(users));
            
            // Initialize user data
            this.initializeUserData(email);
            
            this.showError(errorDiv, 'Account created successfully! Please login.', 'success');
            setTimeout(() => {
                document.getElementById('signupForm').classList.add('hidden');
                document.getElementById('loginForm').classList.remove('hidden');
            }, 2000);
        } catch (error) {
            this.showError(errorDiv, 'An error occurred. Please try again.');
            console.error('Signup error:', error);
        }
    }

    initializeUserData(email) {
        const userData = {
            topics: {
                dsa: {
                    arrays: 'not-started',
                    linkedlists: 'not-started',
                    trees: 'not-started',
                    graphs: 'not-started',
                    dp: 'not-started'
                },
                aptitude: {
                    arithmetic: 'not-started',
                    algebra: 'not-started',
                    probability: 'not-started'
                },
                cs: {
                    os: 'not-started',
                    dbms: 'not-started',
                    cn: 'not-started',
                    oop: 'not-started'
                }
            },
            dailyGoals: [],
            resources: [],
            interviews: [],
            companies: [],
            streak: 0,
            theme: 'light'
        };
        
        localStorage.setItem(`userData_${email}`, JSON.stringify(userData));
    }

    checkAuth() {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const currentUser = localStorage.getItem('currentUser');
        
        if (!isAuthenticated || !currentUser) {
            window.location.href = 'index.html';
            return;
        }
        
        // Setup logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.logout();
            });
        }
    }

    logout() {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    getCurrentUser() {
        return localStorage.getItem('currentUser');
    }

    getUserData() {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return null;
        
        try {
            return JSON.parse(localStorage.getItem(`userData_${currentUser}`) || '{}');
        } catch (error) {
            console.error('Error loading user data:', error);
            return null;
        }
    }

    saveUserData(data) {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return;
        
        try {
            localStorage.setItem(`userData_${currentUser}`, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    showError(element, message, type = 'error') {
        if (element) {
            element.textContent = message;
            element.className = type === 'success' ? 'success-message' : 'error-message';
            element.style.display = 'block';
            
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
    }
}

// Initialize auth manager
const authManager = new AuthManager();
