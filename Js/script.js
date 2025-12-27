// Portfolio Projects Data
let projects = [];

// Load projects from JSON file and localStorage
async function loadProjects() {
    let jsonProjects = [];
    let localProjects = [];

    try {
        // Load from JSON file
        const response = await fetch('projects_data.json');
        if (response.ok) {
            jsonProjects = await response.json();
        }
    } catch (error) {
        console.log('Error loading from JSON file:', error);
    }

    // Load from localStorage
    const stored = localStorage.getItem('portfolio_projects');
    if (stored) {
        try {
            localProjects = JSON.parse(stored);
        } catch (error) {
            console.log('Error parsing localStorage data:', error);
        }
    }

    // Merge projects: prioritize localStorage for user-added projects, use JSON for defaults
    const jsonIds = new Set(jsonProjects.map(p => p.id));
    const mergedProjects = [...jsonProjects, ...localProjects.filter(p => !jsonIds.has(p.id))];

    projects = mergedProjects;
    displayProjects();
}

// Display projects on the page
function displayProjects() {
    const container = document.getElementById('projects-container') || document.querySelector('.projects-grid');
    if (!container) {
        console.error('Projects container not found');
        return;
    }

    container.innerHTML = '';

    if (projects.length === 0) {
        container.innerHTML = '<p>No projects to display. Add your first project!</p>';
        return;
    }

    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image || 'https://via.placeholder.com/400x200/2D5F5D/white?text=Project'}" alt="${project.title}" onerror="this.src='https://via.placeholder.com/400x200/2D5F5D/white?text=Project'">
            </div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tools">
                    ${project.tools ? project.tools.map(tool => `<span class="tool-tag">${tool}</span>`).join('') : ''}
                </div>
                <button class="btn" onclick="viewProjectDetail(${project.id})">View Details</button>
            </div>
        `;
        container.appendChild(projectCard);
    });
}

// View project details
function viewProjectDetail(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (!project) {
        console.error('Project not found:', projectId);
        return;
    }

    const modal = document.getElementById('projectDetailModal');
    const content = document.getElementById('projectDetailContent');

    if (!modal || !content) {
        console.error('Modal elements not found');
        return;
    }

    content.innerHTML = project.fullDescription || `
        <div class="project-detail-header">
            <span class="project-detail-category">${project.category}</span>
            <h2 class="project-detail-title">${project.title}</h2>
        </div>
        <div class="project-detail-section">
            <h3>Description</h3>
            <p>${project.description}</p>
        </div>
        ${project.achievements ? `
        <div class="project-detail-section">
            <h3>Key Achievements</h3>
            <ul class="project-achievements">
                ${project.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
        </div>
        ` : ''}
        ${project.tools ? `
        <div class="project-detail-section">
            <h3>Tools Used</h3>
            <p>${project.tools.join(', ')}</p>
        </div>
        ` : ''}
    `;

    modal.style.display = 'block';
}

// Modal functions
function openAddProjectModal() {
    const modal = document.getElementById('addProjectModal');
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error('Add project modal not found');
    }
}

function closeAddProjectModal() {
    const modal = document.getElementById('addProjectModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeProjectDetailModal() {
    const modal = document.getElementById('projectDetailModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Add new project
function addProject(event) {
    event.preventDefault();

    try {
        const title = document.getElementById('projectTitle')?.value || '';
        const category = document.getElementById('projectCategory')?.value || '';
        const description = document.getElementById('projectDescription')?.value || '';

        if (!title.trim() || !description.trim()) {
            showNotification('Please fill in at least title and description');
            return;
        }

        const newProject = {
            id: Date.now(),
            title: title,
            category: category,
            description: description,
            achievements: [
                document.getElementById('achievement1')?.value || '',
                document.getElementById('achievement2')?.value || '',
                document.getElementById('achievement3')?.value || ''
            ].filter(a => a.trim() !== ''),
            tools: document.getElementById('projectTools')?.value.split(',').map(t => t.trim()).filter(t => t) || [],
            projectLink: document.getElementById('projectLink')?.value || '',
            githubLink: document.getElementById('githubLink')?.value || '',
            emoji: '🚀',
            image: 'https://via.placeholder.com/400x200/2D5F5D/white?text=New+Project',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        projects.push(newProject);
        saveProjects();
        displayProjects();
        closeAddProjectModal();
        event.target.reset();
        showNotification('Project added successfully!');
    } catch (error) {
        console.error('Error adding project:', error);
        showNotification('Error adding project. Please try again.');
    }
}

// Save projects to localStorage
function saveProjects() {
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
}

// Handle contact form
function handleContactSubmit(event) {
    event.preventDefault();
    showNotification('Message sent successfully! We will get back to you soon.');
    event.target.reset();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✓</span>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load projects on page load
    loadProjects();

    // Initialize scroll indicator
    initScrollIndicator();

    // Smooth scroll for anchor links
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
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        }
    });

    // Form submissions
    const addProjectForm = document.getElementById('addProjectForm');
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', addProject);
    }

    const contactForm = document.getElementById('contact-form') || document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

// Scroll indicator functionality
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const addModal = document.getElementById('addProjectModal');
    const detailModal = document.getElementById('projectDetailModal');

    if (addModal && event.target === addModal) {
        closeAddProjectModal();
    }
    if (detailModal && event.target === detailModal) {
        closeProjectDetailModal();
    }
}
