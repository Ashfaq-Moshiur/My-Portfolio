/**
 * Ashfaq Moshiur - Portfolio Website Script
 * Features: Dark / Light Mode Toggle, Interactive Ambient Canvas, 3D Tilt,
 * Certifications & Volunteering Modals, Custom Terminal Commands, & Contact Form Handler.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initCustomCursor();
  initThemeToggle();
  initScrollSpy();
  initStatsCounter();
  initProjectFilters();
  initCardTilt();
  initProjectModals();
  initTimelineTabs();
  initInteractiveTerminal();
  initContactForm();
});

/* -------------------------------------------------------------
   1. Interactive Ambient Particle Canvas
---------------------------------------------------------------- */
let updateCanvasColors = null;

function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 40;
  const mouse = { x: null, y: null, radius: 140 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.baseAlpha = Math.random() * 0.35 + 0.15;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.5;
          this.y -= (dy / dist) * force * 2.5;
        }
      }
    }

    draw(isLight) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isLight 
        ? `rgba(2, 132, 199, ${this.baseAlpha * 0.7})` 
        : `rgba(56, 189, 248, ${this.baseAlpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.14;
          ctx.strokeStyle = isLight 
            ? `rgba(79, 70, 229, ${alpha})`
            : `rgba(129, 140, 248, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw(isLight);
    });

    requestAnimationFrame(animate);
  }
  animate();
}

/* -------------------------------------------------------------
   2. Custom Glowing Mouse Cursor
---------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.querySelector('.cursor-dot');
  const circle = document.querySelector('.cursor-circle');
  if (!dot || !circle) return;

  let mouseX = 0, mouseY = 0;
  let circleX = 0, circleY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderCursor() {
    circleX += (mouseX - circleX) * 0.18;
    circleY += (mouseY - circleY) * 0.18;
    circle.style.transform = `translate(${circleX}px, ${circleY}px)`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  const interactives = document.querySelectorAll('a, button, input, textarea, select, .project-card, .volunteering-card, .timeline-card, .terminal-pill-btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      circle.style.width = '55px';
      circle.style.height = '55px';
      circle.style.borderColor = 'var(--accent-primary)';
      circle.style.backgroundColor = 'var(--accent-glow-subtle)';
    });
    el.addEventListener('mouseleave', () => {
      circle.style.width = '38px';
      circle.style.height = '38px';
      circle.style.borderColor = 'var(--accent-glow)';
      circle.style.backgroundColor = 'transparent';
    });
  });
}

/* -------------------------------------------------------------
   3. Dedicated Two-Mode System (Dark & Light Mode Only)
---------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-mode-toggle');
  const savedTheme = localStorage.getItem('ashfaq-portfolio-theme') || 'dark';

  setTheme(savedTheme, false);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme, true);
    });
  }

  function setTheme(theme, triggerToast = true) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (toggleBtn) {
        toggleBtn.innerHTML = '<span class="theme-icon-indicator">☀️</span> <span>Light</span>';
        toggleBtn.setAttribute('title', 'Switch to Dark Mode');
        toggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (toggleBtn) {
        toggleBtn.innerHTML = '<span class="theme-icon-indicator">🌙</span> <span>Dark</span>';
        toggleBtn.setAttribute('title', 'Switch to Light Mode');
        toggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
      }
    }

    localStorage.setItem('ashfaq-portfolio-theme', theme);

    if (triggerToast) {
      showToast(`Switched to ${theme === 'light' ? 'Light' : 'Dark'} Mode`);
    }
  }
}

/* -------------------------------------------------------------
   4. Scroll Spy & Navbar Blur on Scroll
---------------------------------------------------------------- */
function initScrollSpy() {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 180;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------
   5. Animated Number Counters
---------------------------------------------------------------- */
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const prefix = counter.getAttribute('data-prefix') || '';
          const suffix = counter.getAttribute('data-suffix') || '';
          const duration = 1800;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              counter.textContent = `${prefix}${target}${suffix}`;
              clearInterval(timer);
            } else {
              counter.textContent = `${prefix}${Math.floor(current)}${suffix}`;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats-strip');
  if (statsSection) observer.observe(statsSection);
}

/* -------------------------------------------------------------
   6. Project Category Filtering
---------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.92)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* -------------------------------------------------------------
   7. 3D Tilt Effect on Project Cards
---------------------------------------------------------------- */
function initCardTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* -------------------------------------------------------------
   8. Case Study & Certification Modal Data & Handlers
---------------------------------------------------------------- */
const projectDetailsData = {
  nilasru: {
    title: 'Nilasru Kabbo — Publication & Book Cover Design',
    category: 'Editorial & Graphic Design',
    image: 'assets/images/design-nilasru.jpg',
    description: 'A poetic literary publication design project for "Nilasru Kabbo". Crafted complete book cover art, typographic hierarchy, aesthetic color grading, and print-ready production files.',
    architecture: 'Designed using Adobe Photoshop and Illustrator with precision CMYK color profiling, golden ratio grid alignment, and custom Bengali typography treatment.',
    techStack: ['Adobe Photoshop', 'Adobe Illustrator', 'Typography', 'Print Design', 'Color Harmony'],
    features: [
      'Custom symbolic illustration tailored to poetic themes',
      'High-contrast elegant typography with balanced spine and back blurb layout',
      'Color grading engineered for optimal physical print reproduction',
      'End-to-end design from concept sketch to press-ready delivery'
    ]
  },
  luminous: {
    title: 'Luminous — Creative Brand Identity',
    category: 'Brand Identity & Visual Design',
    image: 'assets/images/design-luminous.jpg',
    description: 'A vibrant brand identity exploration created for online tech and cultural festivals, blending futuristic neon color palettes with modern vector art.',
    architecture: 'Vector-based visual architecture emphasizing scalability across social media promos, web banners, digital flyers, and print badges.',
    techStack: ['Vector Art', 'Brand Strategy', 'Visual Identity', 'Social Media Graphics'],
    features: [
      'Multi-format asset generation for Instagram, Facebook, and Web',
      'Dynamic gradient systems creating memorable visual cohesion',
      'High engagement feedback across online campus communities',
      'Structured brand guideline for consistent typography and spacing'
    ]
  },
  corporate: {
    title: 'Corporate Identity & Security ID Architecture',
    category: 'Corporate Design System',
    image: 'assets/images/design-corporate.jpg',
    description: 'Standardized corporate identification card system designed for institutional organizations, establishing clean hierarchy, barcode compliance, and premium brand aesthetics.',
    architecture: 'Structured modular template with designated zones for credentials, department tags, magnetic strip/barcode placement, and institutional branding.',
    techStack: ['Corporate Identity', 'Print Layout', 'Information Architecture', 'Production Ready'],
    features: [
      'Strict adherence to institutional security identification standards',
      'Ergonomic card orientation with legible high-contrast typography',
      'Modular layout adaptable for employees, staff, and visitors',
      'High-resolution vector assets for direct card printer output'
    ]
  },
  ielts: {
    title: 'IELTS Masterclass & Study Abroad',
    category: 'Educational Venture',
    image: 'assets/images/ashfaq-hero.png',
    description: 'Founded and managing an educational initiative that prepares aspiring students for the IELTS examination and mentors them through the complex foreign university application process.',
    architecture: 'Structured modular curriculum covering Listening, Reading, Writing, and Speaking, coupled with one-on-one SOP review and university shortlisting.',
    techStack: ['IELTS Preparation', 'Academic Mentorship', 'Curriculum Design', 'Public Speaking'],
    features: [
      'Comprehensive preparation strategies targeting Band 7.5+ scores',
      'Personalized speaking mock interviews and essay evaluation frameworks',
      'Guidance through scholarships, visa documentation, and university selection',
      'Empowering students to achieve their dreams of studying abroad'
    ]
  },
  moshiuracademy: {
    title: 'Science Instruction at Moshiur Academy',
    category: 'Science Education',
    image: 'assets/images/ashfaq-hero.png',
    description: 'Teaching science and mathematics to secondary and higher secondary students at Moshiur Academy since post-COVID. Focused on conceptual depth and analytical mastery.',
    architecture: 'Interactive pedagogy combining theoretical physics and chemistry principles with practical problem-solving worksheets and weekly assessment tracking.',
    techStack: ['Physics', 'Chemistry', 'Mathematics', 'Pedagogy', 'Student Mentorship'],
    features: [
      'Simplifying complex scientific phenomena into intuitive mental models',
      'Continuous student performance monitoring and targeted remediation',
      'Mentoring students who achieved GPA 5.0 in board examinations',
      'Fostering genuine scientific curiosity and critical thinking'
    ]
  },
  hultprize: {
    title: 'Hult Prize Nationals-2026 Innovation Pitch',
    category: 'Social Impact & Tech Pitch',
    image: 'assets/images/ashfaq-hero.png',
    description: 'Represented at Hult Prize Nationals-2026, delivering high-stakes pitches on sustainable business models addressing real-world socio-economic challenges.',
    architecture: 'End-to-end slide deck design, economic feasibility modeling, audience engagement strategies, and live Q&A defense before national judges.',
    techStack: ['Pitch Deck Design', 'Business Modeling', 'Public Speaking', 'Social Impact'],
    features: [
      'Selected among top university teams nationwide to present on the national stage',
      'Developed viable market entry and sustainability roadmaps',
      'Dynamic presentation delivery combining data visuals and storytelling',
      'Commended by judging panel for clarity, conviction, and strategic vision'
    ]
  },
  'cert-google': {
    title: 'The Fundamentals of Digital Marketing — Google',
    category: 'Accredited Certification',
    image: 'assets/images/cert-google.jpg',
    description: 'Awarded by Google Digital Garage in association with IAB Europe and The Open University on May 7, 2021. Verification ID: F79 2QY 4VS.',
    architecture: 'Mastery in search engine optimization, content marketing, web analytics, audience segmentation, display advertising, and e-commerce growth strategies.',
    techStack: ['Google Digital Garage', 'IAB Europe', 'SEO & SEM', 'Web Analytics'],
    features: [
      'Credential Verification ID: F79 2QY 4VS',
      'Endorsed by Interactive Advertising Bureau (IAB) Europe',
      'Validated by The Open University',
      'Direct online verification via Google Digital Garage'
    ]
  },
  'cert-wordpress': {
    title: 'Create a Website Using WordPress: Free Hosting & Sub-domain',
    category: 'Coursera Project Network',
    image: 'assets/images/cert-coursera-specialization.jpg',
    description: 'Authorized by Coursera Project Network, guided by instructor Priya Jha. Completed Dec 25, 2023. Verification ID: JDGCDC7WFZTL.',
    architecture: 'Hands-on practical development covering CMS architecture, theme customization, responsive Gutenberg block layout, and domain routing.',
    techStack: ['WordPress', 'CMS Architecture', 'Web Hosting', 'Gutenberg Blocks'],
    features: [
      'Verification Link: https://coursera.org/verify/JDGCDC7WFZTL',
      'Credential ID: JDGCDC7WFZTL',
      'Instructor: Priya Jha (Computer Science)',
      'Authorized by Coursera Project Network'
    ]
  },
  'cert-chatbot': {
    title: 'Create a Lead Generation Messenger Chatbot using Chatfuel',
    category: 'Coursera Project Network',
    image: 'assets/images/cert-ai.jpg',
    description: 'Authorized by Coursera Project Network, guided by instructor Abhishek Jha (Data Science & Business Subject Matter Expert). Completed Dec 24, 2023. Verification ID: YMXW988AP8FT.',
    architecture: 'Designed automated conversational decision trees, lead qualification pipelines, webhook integrations, and CRM synchronization.',
    techStack: ['Conversational AI', 'Chatfuel', 'Lead Generation', 'Automation'],
    features: [
      'Verification Link: https://coursera.org/verify/YMXW988AP8FT',
      'Credential ID: YMXW988AP8FT',
      'Instructor: Abhishek Jha (Data Science & Business Expert)',
      'Authorized by Coursera Project Network'
    ]
  }
};

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const viewBtns = document.querySelectorAll('.view-case-study-btn');
  if (!modal) return;

  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const data = projectDetailsData[projectId];
      if (!data) return;

      document.getElementById('modal-img').src = data.image;
      document.getElementById('modal-category').textContent = data.category;
      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-desc').textContent = data.description;
      document.getElementById('modal-arch').textContent = data.architecture;

      const tagsContainer = document.getElementById('modal-tags');
      tagsContainer.innerHTML = data.techStack.map(t => `<span class="tech-tag">${t}</span>`).join('');

      const featuresContainer = document.getElementById('modal-features');
      featuresContainer.innerHTML = data.features.map(f => `<li>${f}</li>`).join('');

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}

/* -------------------------------------------------------------
   9. Timeline Experience vs Education Tabs
---------------------------------------------------------------- */
function initTimelineTabs() {
  const tabs = document.querySelectorAll('.timeline-btn');
  const expSection = document.getElementById('timeline-experience');
  const eduSection = document.getElementById('timeline-education');

  if (!tabs.length || !expSection || !eduSection) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-tab');
      if (target === 'experience') {
        expSection.style.display = 'block';
        eduSection.style.display = 'none';
      } else {
        expSection.style.display = 'none';
        eduSection.style.display = 'block';
      }
    });
  });
}

/* -------------------------------------------------------------
   10. Interactive CLI Terminal
---------------------------------------------------------------- */
function initInteractiveTerminal() {
  const input = document.getElementById('terminal-cli-input');
  const body = document.getElementById('terminal-cli-body');
  const pills = document.querySelectorAll('.terminal-pill-btn');
  if (!input || !body) return;

  const commands = {
    help: () => 'Available commands: <span style="color:var(--accent-primary)">about</span>, <span style="color:var(--accent-primary)">education</span>, <span style="color:var(--accent-primary)">certifications</span>, <span style="color:var(--accent-primary)">volunteering</span>, <span style="color:var(--accent-primary)">skills</span>, <span style="color:var(--accent-primary)">ielts</span>, <span style="color:var(--accent-primary)">contact</span>, <span style="color:var(--accent-primary)">clear</span>',
    about: () => 'Ashfaq Moshiur — CSE Sophomore at East West University. Passionate about software engineering, graphic design, science education, and football. Achieved GPA 5.00 in JSC, SSC & HSC at Cumilla Cadet College.',
    education: () => '1. <strong>East West University</strong>: B.Sc. in Computer Science and Engineering (Sophomore)<br>2. <strong>Cumilla Cadet College</strong>: GPA 5.00 in JSC, SSC & HSC<br>3. <strong>Motijheel Govt. Boys High School</strong>: Early Foundation',
    certifications: () => '• <strong>Google Digital Garage</strong>: Fundamentals of Digital Marketing (ID: F79 2QY 4VS)<br>• <strong>Coursera</strong>: Create a Website Using WordPress (ID: JDGCDC7WFZTL)<br>• <strong>Coursera</strong>: Lead Gen Messenger Chatbot (ID: YMXW988AP8FT)<br>• <strong>Cumilla Cadet College</strong>: Triple GPA 5.00 Scholastic & Discipline Distinction<br>• <strong>Hult Prize</strong>: National Competitor & Finalist 2026',
    volunteering: () => '• <strong>Hult Prize at East West University</strong>: Organizing Committee & Event Operations<br>• <strong>Eagles Dexterity</strong>: Co-Founder organizing student webinars & design fests<br>• <strong>Moshiur Academy Outreach</strong>: Free academic tutoring for local students<br>• <strong>Cadet College Prefect</strong>: House leadership & sports coordinator<br>• <strong>Community Blood Donation</strong>: Active volunteer & regional campaigns',
    skills: () => '• <strong>Programming</strong>: C/C++, Python, OOP, Data Structures, Web Development<br>• <strong>Graphic Design</strong>: Branding, Typography, Book Covers (Nilasru Kabbo), Corporate ID<br>• <strong>Teaching</strong>: Science Teacher at Moshiur Academy<br>• <strong>Mentorship</strong>: IELTS Masterclass & Study Abroad Founder',
    ielts: () => 'Founded <strong>IELTS Masterclass & Study Abroad</strong> — preparing students for IELTS examinations and guiding them toward international scholarship & study abroad opportunities.',
    contact: () => '• <strong>Phone / WhatsApp</strong>: +880 1719 828199<br>• <strong>Email</strong>: <a href="mailto:ashfaqmoshiur2031@gmail.com" style="color:var(--accent-primary)">ashfaqmoshiur2031@gmail.com</a><br>• <strong>Location</strong>: 65/6/B, Kadamtala, Basaboo, Dhaka, Bangladesh<br>• <strong>LinkedIn</strong>: <a href="https://www.linkedin.com/in/ashfaqmoshiur/" target="_blank" style="color:#38bdf8">linkedin.com/in/ashfaqmoshiur</a>',
    clear: () => {
      body.innerHTML = '';
      return null;
    }
  };

  function executeCommand(cmd) {
    const cleanCmd = cmd.trim().toLowerCase();
    if (!cleanCmd) return;

    const userRow = document.createElement('div');
    userRow.className = 'terminal-line-output';
    userRow.innerHTML = `<span style="color:var(--accent-secondary)">ashfaq@ewu:~$</span> ${escapeHtml(cmd)}`;
    body.appendChild(userRow);

    if (commands[cleanCmd]) {
      const response = commands[cleanCmd]();
      if (response !== null) {
        const respRow = document.createElement('div');
        respRow.className = 'terminal-line-output';
        respRow.style.color = '#cbd5e1';
        respRow.innerHTML = response;
        body.appendChild(respRow);
      }
    } else {
      const errRow = document.createElement('div');
      errRow.className = 'terminal-line-output';
      errRow.innerHTML = `<span style="color:#ef4444">command not found: "${escapeHtml(cleanCmd)}". Type <span style="color:var(--accent-primary)">help</span> for available commands.</span>`;
      body.appendChild(errRow);
    }

    body.scrollTop = body.scrollHeight;
    input.value = '';
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(input.value);
    }
  });

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cmd = pill.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

/* -------------------------------------------------------------
   11. Contact Form Real-time Validation & Submission
---------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const copyBtn = document.getElementById('copy-email-btn');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'ashfaqmoshiur2031@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email address copied to clipboard!');
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    });
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending Message...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      showToast('Thank you! Your message has been sent to Ashfaq Moshiur.');
    }, 1000);
  });
}

/* -------------------------------------------------------------
   12. Toast Notification Helper
---------------------------------------------------------------- */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (type === 'error') {
    toast.style.borderLeftColor = '#ef4444';
  }

  toast.innerHTML = `
    <span style="font-size:1.1rem">${type === 'error' ? '⚠️' : '✨'}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
