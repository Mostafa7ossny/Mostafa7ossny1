// ==========================================
// MAIN JAVASCRIPT - Developer Portfolio
// ==========================================

/**
 * Project data for the mobile mockup viewer
 * Each project contains the image path and app info
 */
const projectsData = [
    {
        image: './assets/images/project1.jpg',
        image: './assets/images/project2.jpg',
        image: './assets/images/project3.jpg',
        name: 'Hyper Task',
        description: 'Task Management App',
        color: '#06b6d4'
    },
    {
        image: './assets/images/project2.jpg',
        name: 'ShopEase',
        description: 'E-Commerce Platform',
        color: '#8b5cf6'
    },
    

];

// ==========================================
// TYPING ANIMATION
// ==========================================

class TypeWriter {
    constructor(textElement, words, wait = 2000) {
        this.textElement = textElement;
        this.words = words;
        this.text = '';
        this.wordIndex = 0;
        this.wait = wait;
        this.isDeleting = false;
        this.type();
    }

    type() {
        // Current word index
        const current = this.wordIndex % this.words.length;
        const fullText = this.words[current];

        // Check if deleting
        if (this.isDeleting) {
            this.text = fullText.substring(0, this.text.length - 1);
        } else {
            this.text = fullText.substring(0, this.text.length + 1);
        }

        // Insert text into element
        this.textElement.innerHTML = this.text;

        // Type speed
        let typeSpeed = 100;

        if (this.isDeleting) {
            typeSpeed = 50;
        }

        // If word is complete
        if (!this.isDeleting && this.text === fullText) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if (this.isDeleting && this.text === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ==========================================
// MOBILE MOCKUP PROJECT SWITCHER
// ==========================================

class ProjectSwitcher {
    constructor() {
        this.projectCards = document.querySelectorAll('.project-card');
        this.mockupImage = document.getElementById('mockup-image');
        this.appName = document.getElementById('app-name');
        this.appDesc = document.getElementById('app-desc');
        this.phoneFrame = document.querySelector('.phone-frame');
        this.appInfo = document.querySelector('.app-info-card');
        
        this.init();
    }

    init() {
        this.projectCards.forEach(card => {
            // Click on card
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking the button
                if (e.target.closest('.run-btn')) return;
                this.switchProject(card);
            });

            // Click on run button
            const runBtn = card.querySelector('.run-btn');
            if (runBtn) {
                runBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.switchProject(card);
                });
            }
        });
    }

    switchProject(selectedCard) {
        const projectIndex = parseInt(selectedCard.dataset.project);
        const project = projectsData[projectIndex];

        if (!project) return;

        // Update active state on cards
        this.projectCards.forEach(card => {
            card.classList.remove('active');
            card.style.borderColor = '';
            card.style.background = '';
            
            const btn = card.querySelector('.run-btn');
            if (btn) {
                btn.style.background = '';
                btn.style.color = '';
            }
        });

        selectedCard.classList.add('active');

        // Animate the phone screen transition
        this.animateScreenChange(project);
    }

    animateScreenChange(project) {
        // Fade out current image
        this.mockupImage.style.opacity = '0';
        this.mockupImage.style.transform = 'scale(0.9)';
        this.appInfo.style.opacity = '0';
        this.appInfo.style.transform = 'translateY(10px)';

        // Slight phone shake effect
        this.phoneFrame.style.transform = 'scale(0.98)';

        setTimeout(() => {
            // Update content
            this.mockupImage.src = project.image;
            this.appName.textContent = project.name;
            this.appDesc.textContent = project.description;

            // Fade in new image
            this.mockupImage.onload = () => {
                this.mockupImage.style.opacity = '1';
                this.mockupImage.style.transform = 'scale(1)';
                this.appInfo.style.opacity = '1';
                this.appInfo.style.transform = 'translateY(0)';
                this.phoneFrame.style.transform = 'scale(1)';
            };

            // Handle cached images (instant load)
            if (this.mockupImage.complete) {
                this.mockupImage.style.opacity = '1';
                this.mockupImage.style.transform = 'scale(1)';
                this.appInfo.style.opacity = '1';
                this.appInfo.style.transform = 'translateY(0)';
                this.phoneFrame.style.transform = 'scale(1)';
            }
        }, 300);
    }
}

// ==========================================
// NAVIGATION & SMOOTH SCROLL
// ==========================================

class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        this.sections = document.querySelectorAll('section[id]');
        
        this.init();
    }

    init() {
        // Scroll event for navbar styling and active section
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Smooth scroll for nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.smoothScroll(e, link));
        });

        // Mobile menu toggle
        this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());

        // Mobile nav links
        this.mobileNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.smoothScroll(e, link);
                this.closeMobileMenu();
            });
        });

        // Close mobile menu on click outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;

        // Navbar background on scroll
        if (scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        // Active section highlighting
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    smoothScroll(e, link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('hidden');
        const icon = this.mobileMenuBtn.querySelector('i');
        
        if (this.mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    }

    closeMobileMenu() {
        this.mobileMenu.classList.add('hidden');
        const icon = this.mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// ==========================================
// CONTACT FORM HANDLING
// ==========================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toast-message');
        
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Simple validation
        if (!name || !email || !message) {
            this.showToast('Please fill in all fields.', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            this.showToast(`Thanks ${name}! Your message has been sent successfully.`, 'success');
            this.form.reset();
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        }, 1500);
    }

    showToast(message, type = 'success') {
        this.toastMessage.textContent = message;
        
        const icon = this.toast.querySelector('i');
        if (type === 'error') {
            icon.classList.remove('fa-check-circle', 'text-neon-blue');
            icon.classList.add('fa-exclamation-circle', 'text-red-500');
            this.toast.style.borderColor = 'rgba(239, 68, 68, 0.5)';
        } else {
            icon.classList.remove('fa-exclamation-circle', 'text-red-500');
            icon.classList.add('fa-check-circle', 'text-neon-blue');
            this.toast.style.borderColor = 'rgba(6, 182, 212, 0.5)';
        }

        this.toast.classList.add('show');

        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 4000);
    }
}

// ==========================================
// SKILLS PROGRESS ANIMATION
// ==========================================

class SkillsAnimation {
    constructor() {
        this.skillCards = document.querySelectorAll('.skill-card');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        this.skillCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }
}

// ==========================================
// PARALLAX EFFECT FOR HERO BACKGROUND
// ==========================================

class ParallaxEffect {
    constructor() {
        this.heroSection = document.getElementById('hero');
        this.init();
    }

    init() {
        if (!this.heroSection) return;

        const decorations = this.heroSection.querySelectorAll('.absolute');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const rate = scrolled * 0.3;
            
            decorations.forEach((decor, index) => {
                if (index < 3) {
                    decor.style.transform = `translateY(${rate * (index + 1) * 0.1}px)`;
                }
            });
        });
    }
}

// ==========================================
// SCROLL-TRIGGERED ANIMATIONS
// ==========================================

class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Animate trait cards on scroll
        const traitCards = document.querySelectorAll('.trait-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.2 });

        traitCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(card);
        });

        // Timeline items animation
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.2 });

        timelineItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = index % 2 === 0 ? 'translateX(-30px)' : 'translateX(30px)';
            item.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            timelineObserver.observe(item);
        });

        // Contact links stagger animation
        const contactLinks = document.querySelectorAll('.contact-link');
        
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.2 });

        contactLinks.forEach(link => {
            link.style.opacity = '0';
            link.style.transform = 'translateX(-20px)';
            link.style.transition = 'all 0.5s ease';
            contactObserver.observe(link);
        });
    }
}

// ==========================================
// CURSOR GLOW EFFECT (Optional Enhancement)
// ==========================================

class CursorGlow {
    constructor() {
        this.cursor = null;
        this.init();
    }

    init() {
        // Only on desktop (no touch devices)
        if (window.matchMedia('(pointer: coarse)').matches) return;

        this.cursor = document.createElement('div');
        this.cursor.className = 'cursor-glow';
        this.cursor.style.cssText = `
            position: fixed;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(this.cursor);

        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
        });

        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
        });
    }
}

// ==========================================
// PRELOADER
// ==========================================

class Preloader {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 100);
        });
    }
}

// ==========================================
// INITIALIZE EVERYTHING ON DOM READY
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            mirror: false,
        });
    }

    // Initialize TypeWriter
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const words = [
            'Junior Flutter Developer',
            'Mobile App Developer',
            'UI/UX Enthusiast',
            'Clean Code Advocate'
        ];
        new TypeWriter(typingElement, words, 2000);
    }

    // Initialize Project Switcher
    new ProjectSwitcher();

    // Initialize Navigation
    new Navigation();

    // Initialize Contact Form
    new ContactForm();

    // Initialize Scroll Animations
    new ScrollAnimations();

    // Initialize Parallax
    new ParallaxEffect();

    // Initialize Cursor Glow (desktop only)
    new CursorGlow();

    // Initialize Preloader
    new Preloader();

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const mobileMenu = document.getElementById('mobile-menu');
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TypeWriter, ProjectSwitcher, Navigation, ContactForm };
}
