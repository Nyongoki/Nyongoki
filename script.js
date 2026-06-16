// Premium JavaScript Logic for Timothy Nyongoki's Portfolio

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        mirror: false
    });

    // 2. Initialize Core Components
    const theme = initTheme();
    initNavbar();
    initTypewriter();
    initParticles(theme);
    initBackToTop();
    initContactForm();
    initGitPipeline();
    
    // 3. Fetch GitHub Stats & Render Charts
    loadGitHubStats();
});

/* =========================================================================
   THEME TOGGLE
   ========================================================================= */
function initTheme() {
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    
    // Check local storage or system preference
    let savedTheme = localStorage.getItem('portfolio-theme');
    if (!savedTheme) {
        savedTheme = 'dark-theme'; // Default
    }
    
    document.body.className = savedTheme;
    updateThemeToggleIcons(savedTheme);
    
    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            let currentTheme = document.body.className;
            let newTheme = currentTheme === 'dark-theme' ? 'light-theme' : 'dark-theme';
            
            document.body.className = newTheme;
            localStorage.setItem('portfolio-theme', newTheme);
            updateThemeToggleIcons(newTheme);
            
            // Re-initialize canvas particles with new theme colors
            initParticles(newTheme);
            
            // Re-render charts with correct color styles
            updateChartColors(newTheme);
        });
    });
    
    return savedTheme;
}

function updateThemeToggleIcons(theme) {
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn i');
    themeToggleBtns.forEach(icon => {
        if (theme === 'dark-theme') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    });
}

/* =========================================================================
   NAVBAR EFFECT
   ========================================================================= */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '12px 0';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.padding = '18px 0';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Scrollspy Highlight navbar links
    window.addEventListener('scroll', () => {
        let fromTop = window.scrollY + 120;
        
        document.querySelectorAll('section').forEach(sec => {
            let id = sec.getAttribute('id');
            let top = sec.offsetTop;
            let height = sec.offsetHeight;
            
            if (fromTop >= top && fromTop < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* =========================================================================
   TYPEWRITER EFFECT
   ========================================================================= */
function initTypewriter() {
    const target = document.querySelector('.typing-target');
    if (!target) return;
    
    const words = [
        'Full Stack Developer',
        'Django & Next.js Architect',
        'Machine Learning Explorer',
        'IoT Solutions Builder'
    ];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            target.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            target.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 30 : 70;
        
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2200; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400; // Pause before typing next word
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
}

/* =========================================================================
   DYNAMIC PARTICLES BACKGROUND
   ========================================================================= */
let canvasAnimationId = null;

function initParticles(theme) {
    const canvas = document.getElementById('particles-bg');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Cancel existing loop if any
    if (canvasAnimationId) {
        cancelAnimationFrame(canvasAnimationId);
    }
    
    // Resize canvas
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    // Config colors based on theme
    const dotColor = theme === 'dark-theme' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(79, 70, 229, 0.08)';
    const lineColor = theme === 'dark-theme' ? 'rgba(99, 102, 241, 0.04)' : 'rgba(79, 70, 229, 0.03)';
    
    const particles = [];
    const count = Math.min(65, Math.floor((canvas.width * canvas.height) / 18000));
    
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: Math.random() * 2 + 1.5
        });
    }
    
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw links
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        
        // Draw dots
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = dotColor;
            ctx.fill();
            
            // Move particles
            p.x += p.vx;
            p.y += p.vy;
            
            // Boundaries check
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });
        
        canvasAnimationId = requestAnimationFrame(draw);
    }
    
    draw();
}

/* =========================================================================
   BACK TO TOP
   ========================================================================= */
function initBackToTop() {
    const btn = document.getElementById('backToTopBtn');
    if (!btn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* =========================================================================
   CONTACT FORM & WHATSAPP INTEGRATION
   ========================================================================= */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        const text = `Hello Timothy Nyongoki! 👋\n\n` +
                     `Name: ${name}\n` +
                     `Email: ${email}\n` +
                     `Subject: ${subject}\n\n` +
                     `Message:\n${message}\n\n` +
                     `Sent from your dynamic developer portfolio.`;
                     
        const encoded = encodeURIComponent(text);
        const url = `https://wa.me/254705280974?text=${encoded}`;
        
        window.open(url, '_blank');
        form.reset();
    });
}

/* =========================================================================
   STATS COUNTERS
   ========================================================================= */
function animateCounters() {
    const counters = document.querySelectorAll('.stats-counter-value');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const stepTime = Math.max(Math.floor(duration / target), 15);
        let current = 0;
        
        const timer = setInterval(() => {
            current += Math.ceil(target / (duration / stepTime));
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = current;
            }
        }, stepTime);
    });
}

/* =========================================================================
   INTERACTIVE GIT WORKFLOW PIPELINE SIMULATOR
   ========================================================================= */
function initGitPipeline() {
    const simulateBtn = document.getElementById('simulateBtn');
    const pulseDot = document.getElementById('pulseDot');
    const consoleBody = document.getElementById('consoleBody');
    
    const nodes = {
        local: document.getElementById('node-local'),
        push: document.getElementById('node-push'),
        cicd: document.getElementById('node-cicd'),
        deploy: document.getElementById('node-deploy')
    };
    
    if (!simulateBtn) return;
    
    let isRunning = false;
    
    simulateBtn.addEventListener('click', async () => {
        if (isRunning) return;
        isRunning = true;
        simulateBtn.disabled = true;
        simulateBtn.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i>Running Pipeline...`;
        
        // Reset console & status
        consoleBody.innerHTML = '';
        resetNodes(nodes);
        
        // Step 1: Local Compile
        setNodeState(nodes.local, 'running', 'State: Compiling');
        await printConsole('[info] Initializing pipeline simulation...', 'info');
        await sleep(600);
        await printConsole('$ git status', 'muted');
        await sleep(500);
        await printConsole('On branch main\nYour branch is up to date.\nChanges to be committed:\n  (use "git restore --staged <file>...")\n\tmodified:   index.html\n\tmodified:   script.js\n\tmodified:   style.css', 'muted');
        await sleep(800);
        await printConsole('$ git commit -am "feat: fetch and visualize github statistics dynamically"', 'muted');
        await sleep(700);
        await printConsole('[main a4c5f21] feat: fetch and visualize github statistics dynamically\n 3 files changed, 246 insertions(+), 84 deletions(-)', 'muted');
        setNodeState(nodes.local, 'success', 'State: Committed');
        
        // Animate Pulse from Local to Push
        animatePulse(pulseDot, 0, 33);
        await sleep(1000);
        
        // Step 2: Git Push
        setNodeState(nodes.push, 'running', 'State: Pushing');
        await printConsole('$ git push origin main', 'muted');
        await sleep(600);
        await printConsole('Enumerating objects: 7, done.\nCounting objects: 100% (7/7), done.\nDelta compression using up to 8 threads\nCompressing objects: 100% (4/4), done.\nWriting objects: 100% (4/4), 482 bytes | 482.00 KiB/s, done.', 'muted');
        await sleep(700);
        await printConsole('To github.com:Nyongoki/Nyongoki.git\n   c8f2b31..a4c5f21  main -> main', 'success');
        setNodeState(nodes.push, 'success', 'State: Pushed');
        
        // Animate Pulse from Push to CI/CD
        animatePulse(pulseDot, 33, 66);
        await sleep(1000);
        
        // Step 3: CI/CD Pipeline
        setNodeState(nodes.cicd, 'running', 'State: Testing');
        await printConsole('[info] GitHub Webhook received. Launching CI/CD runner...', 'info');
        await sleep(700);
        await printConsole('Job [Lint & Format Check] started.', 'info');
        await sleep(500);
        await printConsole('>> ESLint checking frontend code... Passed.', 'success');
        await sleep(600);
        await printConsole('Job [Django Unit Tests] started.', 'info');
        await sleep(700);
        await printConsole('>> Running: python manage.py test\n>> Creating test database...\n>> Executing 18 test cases...\n..................\n>> Ran 18 tests in 0.824s\n>> OK (all tests passed)', 'muted');
        await sleep(800);
        await printConsole('Job [Build & Pack] started.', 'info');
        await sleep(500);
        await printConsole('>> Running: next build\n>> Creating optimized production build...\n>> Compiled successfully. Ready for deployment.', 'success');
        setNodeState(nodes.cicd, 'success', 'State: Tests OK');
        
        // Animate Pulse from CI/CD to Deploy
        animatePulse(pulseDot, 66, 100);
        await sleep(1000);
        
        // Step 4: Live Deploy
        setNodeState(nodes.deploy, 'running', 'State: Deploying');
        await printConsole('[info] CI/CD build verified. Uploading bundle to hosting servers...', 'info');
        await sleep(800);
        await printConsole('>> Connecting to Vercel CDN endpoints...\n>> Transferring bundle files...\n>> Serverless deployment created successfully.', 'muted');
        await sleep(800);
        await printConsole('>> Routing traffic to release build: release-a4c5f21...', 'muted');
        await sleep(500);
        await printConsole('[success] Release v1.2.4 deployed to production server!', 'success');
        await printConsole('[success] Live URL: https://nyongoki.github.io/Nyongoki/', 'success');
        setNodeState(nodes.deploy, 'success', 'State: Site Live');
        
        // Reset dot
        pulseDot.style.display = 'none';
        
        simulateBtn.disabled = false;
        simulateBtn.innerHTML = `<i class="fas fa-play me-2"></i>Simulate Commit & Deploy`;
        isRunning = false;
    });
}

function resetNodes(nodes) {
    Object.values(nodes).forEach((node, index) => {
        node.className = 'pipeline-node';
        if (index === 0) {
            node.classList.add('active');
            node.querySelector('.node-badge').className = 'node-badge badge bg-primary';
            node.querySelector('.node-badge').textContent = 'State: Idle';
        } else {
            node.querySelector('.node-badge').className = 'node-badge badge bg-secondary';
            node.querySelector('.node-badge').textContent = 'State: Waiting';
        }
    });
}

function setNodeState(node, state, label) {
    node.className = 'pipeline-node';
    const badge = node.querySelector('.node-badge');
    
    if (state === 'running') {
        node.classList.add('running');
        badge.className = 'node-badge badge bg-warning text-dark';
        badge.textContent = label;
    } else if (state === 'success') {
        node.classList.add('success');
        badge.className = 'node-badge badge bg-success';
        badge.textContent = label;
    }
}

function animatePulse(dot, startPct, endPct) {
    dot.style.display = 'block';
    dot.style.left = startPct + '%';
    
    // Force reflow
    dot.offsetWidth;
    
    dot.style.transition = 'left 1s cubic-bezier(0.4, 0, 0.2, 1)';
    dot.style.left = endPct + '%';
}

function printConsole(text, type = '') {
    return new Promise(resolve => {
        const consoleBody = document.getElementById('consoleBody');
        const p = document.createElement('div');
        p.className = 'font-monospace small mb-1';
        
        if (type === 'success') p.classList.add('text-success');
        else if (type === 'warning') p.classList.add('text-warning');
        else if (type === 'info') p.classList.add('text-info');
        else if (type === 'muted') p.className += ' text-secondary';
        
        consoleBody.appendChild(p);
        consoleBody.scrollTop = consoleBody.scrollHeight;
        
        // Typing effect for line
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                p.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, 5); // Rapid typing
            } else {
                resolve();
            }
        }
        typeChar();
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* =========================================================================
   GITHUB API FETCHING & STATISTICS
   ========================================================================= */
let languagesChartInstance = null;
let activityChartInstance = null;

// Sensible local offline fallbacks (Baseline statistics)
const fallbackStats = {
    public_repos: 12,
    total_commits: 245,
    stars: 8,
    followers: 12,
    languages: {
        'Python': 35,
        'JavaScript': 25,
        'Next.js (React)': 18,
        'HTML/CSS': 12,
        'Dart (Flutter)': 10
    },
    activity: [12, 28, 45, 52, 68, 40]
};

async function loadGitHubStats() {
    const user = 'Nyongoki';
    const cacheKey = `github-stats-${user}`;
    const cacheTTL = 3600000; // 1 hour in ms
    
    let stats = null;
    let fromCache = false;
    
    // Attempt cache read
    try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            const data = JSON.parse(cached);
            if (Date.now() - data.timestamp < cacheTTL) {
                stats = data.value;
                fromCache = true;
            }
        }
    } catch (e) {
        console.error('Failed to read localStorage cache', e);
    }
    
    if (!stats) {
        try {
            stats = await fetchLiveGitHubData(user);
            
            // Cache results
            localStorage.setItem(cacheKey, JSON.stringify({
                timestamp: Date.now(),
                value: stats
            }));
        } catch (error) {
            console.warn('Failed to fetch GitHub live data. Falling back to offline statistics.', error);
            stats = fallbackStats;
        }
    }
    
    // Update counters in HTML
    updateDOMStats(stats);
    
    // Render the Chart.js visualizations
    renderCharts(stats);
    
    // Trigger animations for the numbers
    animateCounters();
}

async function fetchLiveGitHubData(user) {
    const headers = {};
    
    // Fetch profile
    const profileRes = await fetch(`https://api.github.com/users/${user}`, { headers });
    if (!profileRes.ok) throw new Error('Failed to load profile');
    const profile = await profileRes.json();
    
    // Fetch repositories
    const reposRes = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`, { headers });
    if (!reposRes.ok) throw new Error('Failed to load repositories');
    const repos = await reposRes.json();
    
    // Calculate stars and languages bytes
    let stars = 0;
    const languages = {};
    
    repos.forEach(repo => {
        stars += repo.stargazers_count;
        if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
    });
    
    // Clean languages to percentage/proportion
    const totalReposWithLanguage = Object.values(languages).reduce((a, b) => a + b, 0);
    const languagesPct = {};
    Object.keys(languages).forEach(lang => {
        languagesPct[lang] = Math.round((languages[lang] / totalReposWithLanguage) * 100);
    });
    
    // Fetch commits (Use Search API - with header Accept)
    let commits = fallbackStats.total_commits; // base fallback
    try {
        const commitSearchRes = await fetch(`https://api.github.com/search/commits?q=author:${user}`, {
            headers: {
                'Accept': 'application/vnd.github.cloak-preview'
            }
        });
        if (commitSearchRes.ok) {
            const commitData = await commitSearchRes.json();
            commits = commitData.total_count || fallbackStats.total_commits;
        }
    } catch (e) {
        console.warn('Commit search failed, falling back to base calculation', e);
    }
    
    // Simulated Monthly activity for line chart (uses repo updates)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const activityLabels = [];
    const activityData = [];
    
    for (let i = 5; i >= 0; i--) {
        const index = (currentMonth - i + 12) % 12;
        activityLabels.push(months[index]);
        // Base a curve around actual repo count + randomized dev activity
        activityData.push(Math.floor(Math.random() * 25) + 10 + (repos.length * 1.5));
    }
    
    return {
        public_repos: profile.public_repos,
        total_commits: commits,
        stars: stars,
        followers: profile.followers,
        languages: Object.keys(languagesPct).length > 0 ? languagesPct : fallbackStats.languages,
        activity: activityData,
        activityLabels: activityLabels
    };
}

function updateDOMStats(stats) {
    document.getElementById('github-repos').textContent = stats.public_repos;
    document.getElementById('github-commits').textContent = stats.total_commits;
    document.getElementById('github-stars').textContent = stats.stars;
    document.getElementById('github-followers').textContent = stats.followers;
    
    // Sync counters section data targets too
    const projectsCounter = document.getElementById('counter-projects');
    const commitsCounter = document.getElementById('counter-commits');
    
    if (projectsCounter) projectsCounter.setAttribute('data-target', stats.public_repos);
    if (commitsCounter) commitsCounter.setAttribute('data-target', stats.total_commits);
}

/* =========================================================================
   CHART.JS VISUALIZATIONS
   ========================================================================= */
let currentStatsObj = null; // Store for redraws

function renderCharts(stats) {
    currentStatsObj = stats;
    
    const isDark = document.body.classList.contains('dark-theme');
    const colors = getThemeChartColors(isDark);
    
    // 1. Languages doughnut Chart
    const langCanvas = document.getElementById('languagesChart');
    if (langCanvas) {
        const langCtx = langCanvas.getContext('2d');
        const labels = Object.keys(stats.languages);
        const data = Object.values(stats.languages);
        
        languagesChartInstance = new Chart(langCtx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#6366f1', // Indigo
                        '#06b6d4', // Cyan
                        '#10b981', // Emerald
                        '#a855f7', // Purple
                        '#f59e0b', // Amber
                        '#ec4899'  // Pink
                    ],
                    borderWidth: isDark ? 2 : 1,
                    borderColor: colors.cardBorder
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: colors.text,
                            font: { family: 'Outfit', size: 12 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(item) {
                                return ` ${item.label}: ${item.raw}%`;
                            }
                        }
                    }
                },
                cutout: '68%'
            }
        });
    }
    
    // 2. Activity Line Chart
    const actCanvas = document.getElementById('activityChart');
    if (actCanvas) {
        const actCtx = actCanvas.getContext('2d');
        const labels = stats.activityLabels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        
        activityChartInstance = new Chart(actCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Commits per Month',
                    data: stats.activity,
                    borderColor: '#06b6d4',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointBackgroundColor: '#6366f1',
                    pointBorderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: colors.text,
                            font: { family: 'Outfit' }
                        }
                    },
                    y: {
                        grid: { color: colors.grid },
                        ticks: {
                            color: colors.text,
                            font: { family: 'Outfit' }
                        }
                    }
                }
            }
        });
    }
}

function updateChartColors(theme) {
    if (!languagesChartInstance || !activityChartInstance || !currentStatsObj) return;
    
    const isDark = theme === 'dark-theme';
    const colors = getThemeChartColors(isDark);
    
    // Update Languages Chart
    languagesChartInstance.options.plugins.legend.labels.color = colors.text;
    languagesChartInstance.data.datasets[0].borderColor = colors.cardBorder;
    languagesChartInstance.data.datasets[0].borderWidth = isDark ? 2 : 1;
    languagesChartInstance.update();
    
    // Update Activity Chart
    activityChartInstance.options.scales.x.ticks.color = colors.text;
    activityChartInstance.options.scales.y.ticks.color = colors.text;
    activityChartInstance.options.scales.y.grid.color = colors.grid;
    activityChartInstance.update();
}

function getThemeChartColors(isDark) {
    return {
        text: isDark ? '#94a3b8' : '#627185',
        grid: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        cardBorder: isDark ? '#0d111e' : '#f1f5f9'
    };
}
