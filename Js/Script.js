// Portfolio Projects Data
let projects = [
    {
        id: 1,
        title: "Coffee Shop Sales Analytics Dashboard",
        category: "Data Analysis & Business Intelligence",
        description: "Comprehensive analysis of 65,000+ transactions to uncover actionable business insights for coffee shop optimization.",
        achievements: [
            "Identified $50,000+ revenue opportunity through evening hour analysis",
            "Discovered 45% revenue concentration in 3-hour morning window",
            "Mapped product portfolio showing 65% sales from Coffee+Tea categories"
        ],
        tools: ["Tableau", "Excel", "Statistical Analysis", "Business Intelligence"],
        projectLink: "#",
        githubLink: "#",
        emoji: "☕",
        fullDescription: `
            <div class="project-detail-header">
                <span class="project-detail-category">Data Analysis & Business Intelligence</span>
                <h2 class="project-detail-title">Coffee Shop Sales Analytics Dashboard</h2>
            </div>
            
            <div class="project-detail-section">
                <h3>Project Overview</h3>
                <p>A comprehensive data analytics project examining 65,000+ transactions from a coffee shop operation to identify sales patterns, optimize operations, and develop data-driven growth strategies.</p>
            </div>
            
            <div class="project-detail-section">
                <h3>The Challenge</h3>
                <p>Coffee shops operate in a highly competitive market where small margins require precise operational efficiency. Without proper data analysis, businesses miss critical opportunities for optimization, resulting in unnecessary costs and lost revenue potential.</p>
            </div>
            
            <div class="project-detail-section">
                <h3>Key Findings</h3>
                <ul class="project-achievements">
                    <li><strong>Peak Hours Analysis:</strong> Identified morning rush (7-10 AM) generating 45% of daily revenue</li>
                    <li><strong>Product Performance:</strong> Ethiopia coffee leads with 13,271 transactions</li>
                    <li><strong>Customer Behavior:</strong> Consistent weekly traffic with only 5.8% variance</li>
                    <li><strong>Product Mix:</strong> Coffee + Tea dominate at 65% of total sales</li>
                </ul>
            </div>
            
            <div class="project-detail-section">
                <h3>Business Impact</h3>
                <ul class="project-achievements">
                    <li><strong>$50,000+ Revenue Opportunity:</strong> Evening hour optimization strategy</li>
                    <li><strong>30% Cost Reduction Potential:</strong> Through data-driven staffing schedules</li>
                    <li><strong>25-35% ROI Increase:</strong> Implementation of recommended strategies</li>
                    <li><strong>Inventory Efficiency:</strong> Focus on top-performing 65% core products</li>
                </ul>
            </div>
            
            <div class="project-detail-section">
                <h3>Methodology</h3>
                <p><strong>Data Source:</strong> Coffee Shop Sales Dataset (65,000+ transactions)</p>
                <p><strong>Tools Used:</strong> Tableau, Excel, Statistical Analysis</p>
                <p><strong>Techniques:</strong> Time-series analysis, outlier detection, comparative analysis</p>
                <p><strong>Visualization:</strong> 4-sheet interactive Tableau dashboard</p>
            </div>
            
            <div class="project-detail-section">
                <h3>Deliverables</h3>
                <ul class="project-achievements">
                    <li>Interactive Tableau Dashboard with 4 analytical views</li>
                    <li>Comprehensive Research Paper (3,500+ words, 14 academic references)</li>
                    <li>Strategic Recommendations Report</li>
                    <li>Social Media Education Series (8 posts)</li>
                </ul>
            </div>
        `
    }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    
    // Add scroll animation observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all project cards
    setTimeout(() => {
        document.querySelectorAll('.project-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }, 100);
});

// Load and display projects
function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
}

// Create project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.onclick = () => openProjectDetail(project.id);
    
    const achievementsHTML = project.achievements
        .map(achievement => `<li>${achievement}</li>`)
        .join('');
    
    const toolsHTML = project.tools
        .map(tool => `<span class="tool-tag">${tool}</span>`)
        .join('');
    
    card.innerHTML = `
        <div class="project-image" style="background: ${getGradientForProject(project.id)}">
            ${project.emoji}
        </div>
        <div class="project-content">
            <span class="project-category">${project.category}</span>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            
            <ul class="project-achievements">
                ${achievementsHTML}
            </ul>
            
            <div class="project-tools">
                ${toolsHTML}
            </div>
            
            <div class="project-links">
                <a href="${project.projectLink}" class="project-link" onclick="event.stopPropagation()">View Project →</a>
                ${project.githubLink ? `<a href="${project.githubLink}" class="project-link" onclick="event.stopPropagation()">GitHub →</a>` : ''}
            </div>
            
            <button class="delete-project-btn" onclick="event.stopPropagation(); deleteProject(${project.id})">
                Delete Project
            </button>
        </div>
    `;
    
    return card;
}

// Get gradient color based on project ID
function getGradientForProject(id) {
    const gradients = [
        'linear-gradient(135deg, #2D5F5D 0%, #1A3E3C 100%)',
        'linear-gradient(135deg, #C07F48 0%, #8B5A3C 100%)',
        'linear-gradient(135deg, #E8B86D 0%, #C07F48 100%)',
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    ];
    return gradients[id % gradients.length];
}

// Open project detail modal
function openProjectDetail(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const modal = document.getElementById('projectDetailModal');
    const content = document.getElementById('projectDetailContent');
    
    content.innerHTML = project.fullDescription || `
        <div class="project-detail-header">
            <span class="project-detail-category">${project.category}</span>
            <h2 class="project-detail-title">${project.title}</h2>
        </div>
        
        <div class="project-detail-section">
            <h3>Project Overview</h3>
            <p>${project.description}</p>
        </div>
        
        <div class="project-detail-section">
            <h3>Key Achievements</h3>
            <ul class="project-achievements">
                ${project.achievements.map(a => `<li>${a}</li>`).join('')}
            </ul>
        </div>
        
        <div class="project-detail-section">
            <h3>Tools & Technologies</h3>
            <div class="project-tools">
                ${project.tools.map(t => `<span class="tool-tag">${t}</span>`).join('')}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close project detail modal
function closeProjectDetailModal() {
    document.getElementById('projectDetailModal').style.display = 'none';
}

// Open add project modal
function openAddProjectModal() {
    document.getElementById('addProjectModal').style.display = 'block';
}

// Close add project modal
function closeAddProjectModal() {
    document.getElementById('addProjectModal').style.display = 'none';
    document.getElementById('addProjectForm').reset();
}

// Handle add project form submission
function handleAddProject(event) {
    event.preventDefault();
    
    const formData = {
        id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
        title: document.getElementById('projectTitle').value,
        category: document.getElementById('projectCategory').value || 'Uncategorized',
        description: document.getElementById('projectDescription').value,
        achievements: [
            document.getElementById('achievement1').value,
            document.getElementById('achievement2').value,
            document.getElementById('achievement3').value
        ].filter(a => a.trim() !== ''),
        tools: document.getElementById('projectTools').value
            .split(',')
            .map(t => t.trim())
            .filter(t => t !== ''),
        projectLink: document.getElementById('projectLink').value || '#',
        githubLink: document.getElementById('githubLink').value || '',
        emoji: getRandomEmoji(),
        fullDescription: generateFullDescription(formData)
    };
    
    projects.push(formData);
    loadProjects();
    closeAddProjectModal();
    
    // Save to localStorage
    saveProjectsToStorage();
    
    // Show success message
    showNotification('Project added successfully!');
    
    // Scroll to projects section
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
}

// Generate full description for new project
function generateFullDescription(data) {
    return `
        <div class="project-detail-header">
            <span class="project-detail-category">${data.category}</span>
            <h2 class="project-detail-title">${data.title}</h2>
        </div>
        
        <div class="project-detail-section">
            <h3>Project Overview</h3>
            <p>${data.description}</p>
        </div>
        
        <div class="project-detail-section">
            <h3>Key Achievements</h3>
            <ul class="project-achievements">
                ${data.achievements.map(a => `<li>${a}</li>`).join('')}
            </ul>
        </div>
        
        <div class="project-detail-section">
            <h3>Tools & Technologies</h3>
            <div class="project-tools">
                ${data.tools.map(t => `<span class="tool-tag">${t}</span>`).join('')}
            </div>
        </div>
    `;
}

// Delete project
function deleteProject(projectId) {
    if (confirm('Are you sure you want to delete this project?')) {
        projects = projects.filter(p => p.id !== projectId);
        loadProjects();
        saveProjectsToStorage();
        showNotification('Project deleted successfully!');
    }
}

// Get random emoji for new projects
function getRandomEmoji() {
    const emojis = ['📊', '📈', '💡', '🔬', '🎯', '💼', '🚀', '⚡', '🔍', '📱', '💻', '🎨'];
    return emojis[Math.floor(Math.random() * emojis.length)];
}

// Save projects to localStorage
function saveProjectsToStorage() {
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
}

// Load projects from localStorage
function loadProjectsFromStorage() {
    const stored = localStorage.getItem('portfolioProjects');
    if (stored) {
        projects = JSON.parse(stored);
        loadProjects();
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #2D5F5D 0%, #1A3E3C 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Handle contact form submission
function handleContactSubmit(event) {
    event.preventDefault();
    showNotification('Message sent successfully! We will get back to you soon.');
    event.target.reset();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const addModal = document.getElementById('addProjectModal');
    const detailModal = document.getElementById('projectDetailModal');
    
    if (event.target === addModal) {
        closeAddProjectModal();
    }
    if (event.target === detailModal) {
        closeProjectDetailModal();
    }
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Load projects from storage on initialization
loadProjectsFromStorage();

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
