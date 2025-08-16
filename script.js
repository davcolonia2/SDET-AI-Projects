// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements - moved inside DOMContentLoaded to ensure elements exist
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const themeToggle = document.getElementById('theme-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    console.log('Theme toggle element:', themeToggle); // Debug line

    // Theme toggle functionality
    const initTheme = () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeToggleIcon(currentTheme);
        console.log('Theme initialized:', currentTheme); // Debug line
    };

    const updateThemeToggleIcon = (theme) => {
        if (themeToggle) {
            themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    };

    // Initialize theme on page load
    initTheme();

    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            console.log('Switching theme from', currentTheme, 'to', newTheme); // Debug line
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeToggleIcon(newTheme);
            
            // Update music player theme
            updateMusicPlayerTheme(newTheme);
        });
    } else {
        console.error('Theme toggle button not found!'); // Debug line
    }

    // Update music player theme colors
    const updateMusicPlayerTheme = (theme) => {
        const musicToggleBtn = document.getElementById('music-toggle');
        if (musicToggleBtn) {
            if (theme === 'dark') {
                musicToggleBtn.style.background = 'rgba(59, 130, 246, 0.9)';
            } else {
                musicToggleBtn.style.background = 'rgba(37, 99, 235, 0.9)';
            }
        }
    };

    // Mobile menu toggle functionality
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            if (navbar) navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            if (navbar) navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset + 150; // Offset for navbar height
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current section's nav link
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .contact-item, .skill-category');
    
    // Set initial state for animated elements
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Keyboard navigation accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu on escape key
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });

    // Focus trap for mobile menu accessibility
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    if (navMenu) {
        navMenu.addEventListener('keydown', (e) => {
            const focusableContent = navMenu.querySelectorAll(focusableElements);
            const firstFocusableElement = focusableContent[0];
            const lastFocusableElement = focusableContent[focusableContent.length - 1];

            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // Performance optimization - lazy loading for project images
    const lazyLoadImages = () => {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '1';
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('.project-image').forEach(img => {
            img.style.opacity = '0.8';
            img.style.transition = 'opacity 0.3s ease';
            imageObserver.observe(img);
        });
    };

    // Initialize lazy loading
    lazyLoadImages();

    // Add scroll-to-top functionality
    const createScrollToTop = () => {
        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.innerHTML = '↑';
        scrollToTopBtn.className = 'scroll-to-top';
        
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Show/hide scroll to top button
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.visibility = 'visible';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.visibility = 'hidden';
            }
        });
        
        document.body.appendChild(scrollToTopBtn);
    };

    // Initialize scroll to top button
    createScrollToTop();

    // Initialize music player
    initMusicPlayer();
    addPulseAnimation();

    // Console message for developers
    console.log('👋 Hello! This portfolio was built with vanilla HTML, CSS, and JavaScript.');
    console.log('🚀 Ready for GitHub Pages deployment!');
    console.log('💼 David Colonia - Software QA Engineer');
});

// Music Player Functionality (moved outside DOMContentLoaded since it has its own initialization)
const musicToggle = document.getElementById('music-toggle');
const audioPlayer = document.getElementById('audio-player');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const progressFill = document.getElementById('progress-fill');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');
const volumeSlider = document.getElementById('volume-slider');
const progressBar = document.querySelector('.progress-bar');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Sample playlist - you can expand this
const playlist = [
    {
        title: 'Lofi Hip Hop',
        artist: 'Chill Beats',
        src: 'music/lofi-hip-hop.mp3'
    },
    {
        title: 'Ambient Space',
        artist: 'Cosmic Sounds',
        src: 'music/ambient-space.mp3'
    },
    {
        title: 'Study Session',
        artist: 'Focus Music',
        src: 'music/study-session.mp3'
    }
];

let currentTrackIndex = 0;
let isPlaying = false;

// Initialize music player
const initMusicPlayer = () => {
    // Set initial volume
    audioPlayer.volume = volumeSlider.value / 100;
    
    // Load first track
    loadTrack(currentTrackIndex);
    
    // Update total time when metadata loads
    audioPlayer.addEventListener('loadedmetadata', () => {
        totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
    });
    
    // Update progress bar and current time
    audioPlayer.addEventListener('timeupdate', () => {
        if (audioPlayer.duration) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressFill.style.width = progress + '%';
            currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        }
    });
    
    // Handle track end
    audioPlayer.addEventListener('ended', () => {
        nextTrack();
    });
};

// Load track
const loadTrack = (index) => {
    if (playlist[index]) {
        const track = playlist[index];
        audioPlayer.src = track.src;
        document.querySelector('.song-title').textContent = track.title;
        document.querySelector('.song-artist').textContent = track.artist;
    }
};

// Play/pause functionality
musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
});

const playMusic = () => {
    audioPlayer.play().then(() => {
        isPlaying = true;
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        musicToggle.style.animation = 'pulse 2s infinite';
    }).catch(error => {
        console.log('Audio play failed:', error);
        // Fallback for autoplay restrictions
        showPlayMessage();
    });
};

const pauseMusic = () => {
    audioPlayer.pause();
    isPlaying = false;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    musicToggle.style.animation = 'none';
};

// Show message for autoplay restrictions
const showPlayMessage = () => {
    const message = document.createElement('div');
    message.textContent = 'Click to play music';
    message.style.cssText = `
        position: fixed;
        top: 80px;
        left: 20px;
        background: var(--primary-color);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        z-index: 1002;
        opacity: 0;
        animation: fadeInOut 3s ease-in-out;
    `;
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 3000);
};

// Volume control
volumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value / 100;
});

// Progress bar click
progressBar.addEventListener('click', (e) => {
    if (audioPlayer.duration) {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const newTime = (clickX / width) * audioPlayer.duration;
        audioPlayer.currentTime = newTime;
    }
});

// Previous track
prevBtn.addEventListener('click', () => {
    currentTrackIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : playlist.length - 1;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        playMusic();
    }
});

// Next track
nextBtn.addEventListener('click', nextTrack);

const nextTrack = () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if (isPlaying) {
        playMusic();
    }
};

// Format time helper
const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Add pulse animation for play button
const addPulseAnimation = () => {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
            100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
        }
        
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translateY(-5px); }
            20%, 80% { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
};

// Initialize everything when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    initMusicPlayer();
    addPulseAnimation();
});

// DOM elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile menu toggle functionality
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Theme toggle functionality
const initTheme = () => {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeToggleIcon(currentTheme);
};

const updateThemeToggleIcon = (theme) => {
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
};

// Initialize theme on page load
initTheme();

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleIcon(newTheme);
    
    // Update music player theme
    updateMusicPlayerTheme(newTheme);
});

// Update music player theme colors
const updateMusicPlayerTheme = (theme) => {
    const musicToggleBtn = document.getElementById('music-toggle');
    if (musicToggleBtn) {
        if (theme === 'dark') {
            musicToggleBtn.style.background = 'rgba(59, 130, 246, 0.9)';
        } else {
            musicToggleBtn.style.background = 'rgba(37, 99, 235, 0.9)';
        }
    }
};

// Navbar scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 150; // Offset for navbar height
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            // Remove active class from all nav links
            navLinks.forEach(link => link.classList.remove('active'));
            // Add active class to current section's nav link
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.project-card, .contact-item, .skill-category');
    
    // Set initial state for animated elements
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Set initial body opacity
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.3s ease-in-out';

// Keyboard navigation accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu on escape key
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Focus trap for mobile menu accessibility
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const modal = navMenu;

navMenu.addEventListener('keydown', (e) => {
    const focusableContent = modal.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0];
    const lastFocusableElement = focusableContent[focusableContent.length - 1];

    if (e.key === 'Tab') {
        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    }
});

// Performance optimization - lazy loading for project images
const lazyLoadImages = () => {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('.project-image').forEach(img => {
        img.style.opacity = '0.8';
        img.style.transition = 'opacity 0.3s ease';
        imageObserver.observe(img);
    });
};

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add scroll-to-top functionality
const createScrollToTop = () => {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    document.body.appendChild(scrollToTopBtn);
};

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', createScrollToTop);

// Console message for developers
console.log('👋 Hello! This portfolio was built with vanilla HTML, CSS, and JavaScript.');
console.log('🚀 Ready for GitHub Pages deployment!');
console.log('💼 David Colonia - Software QA Engineer');