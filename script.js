// Main application functionality
class PlacementTracker {
    constructor() {
        this.authManager = authManager;
        this.userData = this.authManager.getUserData() || {};
        this.init();
    }

    init() {
        if (window.location.pathname.includes('dashboard.html')) {
            this.setupDashboard();
            this.loadUserData();
            this.setupEventListeners();
            this.updateAllProgress();
            this.updateAnalytics();
        }
    }

    setupDashboard() {
        // Setup theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
            this.loadTheme();
        }

        // Setup navigation
        this.setupNavigation();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.sidebar a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        this.userData.theme = newTheme;
        this.authManager.saveUserData(this.userData);
    }

    loadTheme() {
        const savedTheme = this.userData.theme || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    loadUserData() {
        this.userData = this.authManager.getUserData() || {};
        this.renderAllData();
    }

    renderAllData() {
        this.renderTopics();
        this.renderDailyGoals();
        this.renderResources();
        this.renderInterviews();
        this.renderCompanies();
    }

    // Topic Tracker Functions
    updateTopicStatus(button, category, topic) {
        const statuses = ['not-started', 'in-progress', 'completed'];
        const currentStatus = this.userData.topics?.[category]?.[topic] || 'not-started';
        const currentIndex = statuses.indexOf(currentStatus);
        const nextIndex = (currentIndex + 1) % statuses.length;
        const newStatus = statuses[nextIndex];

        if (!this.userData.topics) this.userData.topics = {};
        if (!this.userData.topics[category]) this.userData.topics[category] = {};
        
        this.userData.topics[category][topic] = newStatus;
        this.authManager.saveUserData(this.userData);

        button.className = `status-btn ${newStatus}`;
        button.textContent = newStatus.replace('-', ' ').toUpperCase();
        
        this.updateCategoryProgress(category);
        this.updateOverallProgress();
        this.updateAnalytics();
    }

    renderTopics() {
        const categories = ['dsa', 'aptitude', 'cs'];
        categories.forEach(category => {
            this.updateCategoryProgress(category);
        });
    }

    updateCategoryProgress(category) {
        const topics = this.userData.topics?.[category] || {};
        const total = Object.keys(topics).length;
        const completed = Object.values(topics).filter(status => status === 'completed').length;
        
        const progressBar = document.getElementById(`${category}Progress`);
        const progressText = document.getElementById(`${category}ProgressText`);
        
        if (progressBar && progressText) {
            const percentage = total > 0 ? (completed / total) * 100 : 0;
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `${completed}/${total} completed`;
        }
    }

    updateOverallProgress() {
        let totalTopics = 0;
        let completedTopics = 0;

        Object.values(this.userData.topics || {}).forEach(category => {
            Object.values(category).forEach(status => {
                totalTopics++;
                if (status === 'completed') completedTopics++;
            });
        });

        const percentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;
        const progressBar = document.getElementById('overallProgress');
        const progressText = document.getElementById('overallProgressText');
        
        if (progressBar && progressText) {
            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `${Math.round(percentage)}%`;
        }
    }

    // Daily Goals Functions
    addDailyGoal() {
        const input = document.getElementById('goalInput');
        const goal = input.value.trim();
        
        if (goal) {
            if (!this.userData.dailyGoals) this.userData.dailyGoals = [];
            this.userData.dailyGoals.push({ text: goal, completed: false });
            this.authManager.saveUserData(this.userData);
            input.value = '';
            this.renderDailyGoals();
        }
    }

    renderDailyGoals() {
        const container = document.getElementById('goalsContainer');
        if (!container) return;

        container.innerHTML = '';
        this.userData.dailyGoals?.forEach((goal, index) => {
            const goalDiv = document.createElement('div');
            goalDiv.className = 'goal-item';
            goalDiv.innerHTML = `
                <input type="checkbox" ${goal.completed ? 'checked' : ''} 
                       onchange="tracker.toggleGoal(${index})">
                <span>${goal.text}</span>
                <button onclick="tracker.removeGoal(${index})">Remove</button>
            `;
            container.appendChild(goalDiv);
        });
    }

    toggleGoal(index) {
        if (this.userData.dailyGoals?.[index]) {
            this.userData.dailyGoals[index].completed = !this.userData.dailyGoals[index].completed;
            this.authManager.saveUserData(this.userData);
            this.renderDailyGoals();
        }
    }

    removeGoal(index) {
        this.userData.dailyGoals?.splice(index, 1);
        this.authManager.saveUserData(this.userData);
        this.renderDailyGoals();
    }

    // Resource Functions
    addResource() {
        const title = document.getElementById('resourceTitle').value.trim();
        const url = document.getElementById('resourceUrl').value.trim();
        const type = document.getElementById('resourceType').value;
        const topic = document.getElementById('resourceTopic').value;

        if (title && url) {
            if (!this.userData.resources) this.userData.resources = [];
            this.userData.resources.push({ title, url, type, topic, read: false });
            this.authManager.saveUserData(this.userData);
            
            document.getElementById('resourceTitle').value = '';
            document.getElementById('resourceUrl').value = '';
            this.renderResources();
        }
    }

    renderResources() {
        const container = document.getElementById('resourcesContainer');
        if (!container) return;

        container.innerHTML = '';
        this.userData.resources?.forEach((resource, index) => {
            const resourceDiv = document.createElement('div');
            resourceDiv.className = 'resource-item';
            resourceDiv.innerHTML = `
                <h4>${resource.title}</h4>
                <p>Type: ${resource.type} | Topic: ${resource.topic}</p>
                <a href="${resource.url}" target="_blank">${resource.url}</a>
                <div>
                    <label>
                        <input type="checkbox" ${resource.read ? 'checked' : ''} 
                               onchange="tracker.toggleResource(${index})">
                        Mark as read
                    </label>
                    <button onclick="tracker.removeResource(${index})">Remove</button>
                </div>
            `;
            container.appendChild(resourceDiv);
        });
    }

    toggleResource(index) {
        if (this.userData.resources?.[index]) {
            this.userData.resources[index].read = !this.userData.resources[index].read;
            this.authManager.saveUserData(this.userData);
            this.renderResources();
        }
    }

    removeResource(index) {
        this.userData.resources?.splice(index, 1);
        this.authManager.saveUserData(this.userData);
        this.renderResources();
    }

    // Interview Functions
    uploadResume() {
        const fileInput = document.getElementById('resumeFile');
        const statusDiv = document.getElementById('resumeStatus');
        
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            
            reader.onload = (e) => {
                if (!this.userData.resume) this.userData.resume = {};
                this.userData.resume.filename = file.name;
                this.userData.resume.data = e.target.result;
                this.authManager.saveUserData(this.userData);
                
                statusDiv.innerHTML = `Resume uploaded: ${file.name}`;
            };
            
            reader.readAsDataURL(file);
        }
    }

    scheduleInterview() {
        const date = document.getElementById('interviewDate').value;
        const time = document.getElementById('interviewTime').value;
        const type = document.getElementById('interviewType').value;

        if (date && time) {
            if (!this.userData.interviews) this.userData.interviews = [];
            this.userData.interviews.push({
                date: `${date} ${time}`,
                type,
                feedback: ''
            });
            this.authManager.saveUserData(this.userData);
            this.renderInterviews();
        }
    }

    renderInterviews() {
        const container = document.getElementById('interviewList');
        if (!container) return;

        container.innerHTML = '';
        this.userData.interviews?.forEach((interview, index) => {
            const interviewDiv = document.createElement('div');
            interviewDiv.className = 'interview-item';
            interviewDiv.innerHTML = `
                <p><strong>${interview.date}</strong> - ${interview.type}</p>
                <textarea placeholder="Add feedback..." 
                          onblur="tracker.saveInterviewFeedback(${index}, this.value)">${interview.feedback || ''}</textarea>
                <button onclick="tracker.removeInterview(${index})">Remove</button>
            `;
            container.appendChild(interviewDiv);
        });
    }

    saveInterviewFeedback(index, feedback) {
        if (this.userData.interviews?.[index]) {
            this.userData.interviews[index].feedback = feedback;
            this.authManager.saveUserData(this.userData);
        }
    }

    removeInterview(index) {
        this.userData.interviews?.splice(index, 1);
        this.authManager.saveUserData(this.userData);
        this.renderInterviews();
    }

    // Company Functions
    addCompany() {
        const name = document.getElementById('companyName').value.trim();
        const focus = document.getElementById('companyFocus').value.trim();

        if (name && focus) {
            if (!this.userData.companies) this.userData.companies = [];
            this.userData.companies.push({
                name,
                focus: focus.split(',').map(f => f.trim()),
                addedAt: new Date().toISOString()
            });
            this.authManager.saveUserData(this.userData);
            document.getElementById('companyName').value = '';
            document.getElementById('companyFocus').value = '';
            this.renderCompanies();
        }
    }

    renderCompanies() {
        const container = document.getElementById('companiesContainer');
        if (!container) return;

        container.innerHTML = '';
        this.userData.companies?.forEach((company, index) => {
            const companyDiv = document.createElement('div');
            companyDiv.className = 'company-item';
            companyDiv.innerHTML = `
                <h4>${company.name}</h4>
                <p>Focus Areas: ${company.focus.join(', ')}</p>
                <button onclick="tracker.removeCompany(${index})">Remove</button>
            `;
            container.appendChild(companyDiv);
        });
    }

    removeCompany(index) {
        this.userData.companies?.splice(index, 1);
        this.authManager.saveUserData(this.userData);
        this.renderCompanies();
    }

    // Analytics Functions
    updateAnalytics() {
        this.updateTopicsChart();
        this.updateStats();
    }

    updateTopicsChart() {
        const categories = ['dsa', 'aptitude', 'cs'];
        categories.forEach(category => {
            const topics = this.userData.topics?.[category] || {};
            const total = Object.keys(topics).length;
            const completed = Object.values(topics).filter(status => status === 'completed').length;
            const percentage = total > 0 ? (completed / total) * 100 : 0;
            
            const bar = document.querySelector(`[data-topic="${category}"]`);
            if (bar) {
                bar.style.height = `${percentage}%`;
            }
        });
    }

    updateStats() {
        let totalTopics = 0;
        let completedTopics = 0;

        Object.values(this.userData.topics || {}).forEach(category => {
            Object.values(category).forEach(status => {
                totalTopics++;
                if (status === 'completed') completedTopics++;
            });
        });

        const streakElement = document.getElementById('streakCount');
        const totalElement = document.getElementById('totalTopics');
        const completedElement = document.getElementById('completedTopics');

        if (streakElement) streakElement.textContent = `${this.userData.streak || 0} days`;
        if (totalElement) totalElement.textContent = totalTopics;
        if (completedElement) completedElement.textContent = completedTopics;
    }

    // Update all progress
    updateAllProgress() {
        this.updateOverallProgress();
        ['dsa', 'aptitude', 'cs'].forEach(category => {
            this.updateCategoryProgress(category);
        });
    }

    setupEventListeners() {
        // Global functions for onclick handlers
        window.tracker = this;
        
        // Setup all buttons
        const addGoalBtn = document.querySelector('button[onclick="addGoal()"]');
        const addResourceBtn = document.querySelector('button[onclick="addResource()"]');
        const addCompanyBtn = document.querySelector('button[onclick="addCompany()"]');
        
        if (addGoalBtn) addGoalBtn.addEventListener('click', () => this.addGoal());
        if (addResourceBtn) addResourceBtn.addEventListener('click', () => this.addResource());
        if (addCompanyBtn) addCompanyBtn.addEventListener('click', () => this.addCompany());
    }
}

// Initialize the tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const tracker = new PlacementTracker();
});
