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
        themeToggle.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent any default button behavior
            e.stopPropagation(); // Stop event bubbling
            
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            console.log('Switching theme from', currentTheme, 'to', newTheme); // Debug line
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeToggleIcon(newTheme);
        });
    } else {
        console.error('Theme toggle button not found!'); // Debug line
    }

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

// YouTube Music Player Functionality
// 🔑 STEP 1: Replace 'YOUR_API_KEY_HERE' with your actual YouTube API key
const YOUTUBE_API_KEY = 'AIzaSyDCD-Pi2hOjBnO8nCMVHaVOhBT6ypBwksc'; // ← PUT YOUR ACTUAL API KEY HERE
let youtubePlayer;
let currentPlaylist = [];
let currentTrackIndex = 0;
let isPlaying = false;

// Initialize YouTube Player
const initYouTubePlayer = () => {
    // Load YouTube IFrame API
    if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    
    // YouTube API ready callback
    window.onYouTubeIframeAPIReady = () => {
        youtubePlayer = new YT.Player('youtube-player', {
            height: '0',
            width: '0',
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                enablejsapi: 1,
                fs: 0,
                iv_load_policy: 3,
                modestbranding: 1,
                playsinline: 1,
                rel: 0
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange
            }
        });
    };
};

const onPlayerReady = (event) => {
    console.log('YouTube player ready');
    updateVolumeFromSlider();
};

const onPlayerStateChange = (event) => {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        updatePlayPauseButton();
        startProgressUpdate();
    } else if (event.data === YT.PlayerState.PAUSED) {
        isPlaying = false;
        updatePlayPauseButton();
    } else if (event.data === YT.PlayerState.ENDED) {
        nextTrack();
    }
};

// Search YouTube videos
const searchYouTube = async (query) => {
    console.log('API Key check:', YOUTUBE_API_KEY ? 'Present' : 'Missing');
    
    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_API_KEY_HERE') {
        showApiKeyNotice();
        return;
    }
    
    const searchResults = document.getElementById('search-results');
    searchResults.style.display = 'block';
    searchResults.innerHTML = '<div class="loading">🔍 Searching...</div>';
    
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=5&q=${encodeURIComponent(query + ' music')}&key=${YOUTUBE_API_KEY}`;
    console.log('API URL:', url.replace(YOUTUBE_API_KEY, 'API_KEY_HIDDEN'));
    
    try {
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        displaySearchResults(data.items);
    } catch (error) {
        console.error('YouTube search error:', error);
        searchResults.innerHTML = `
            <div class="no-results">
                <p>❌ API Error</p>
                <small>${error.message}</small>
                <br><small>Check console for details</small>
            </div>
        `;
    }
};

const displaySearchResults = (results) => {
    const searchResults = document.getElementById('search-results');
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No results found</div>';
        return;
    }
    
    searchResults.innerHTML = results.map(item => `
        <div class="search-result-item" data-video-id="${item.id.videoId}">
            <img class="result-thumbnail" src="${item.snippet.thumbnails.default.url}" alt="thumbnail">
            <div class="result-info">
                <div class="result-title">${item.snippet.title}</div>
                <div class="result-channel">${item.snippet.channelTitle}</div>
            </div>
        </div>
    `).join('');
    
    // Add click listeners to results
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const videoId = item.dataset.videoId;
            const title = item.querySelector('.result-title').textContent;
            const channel = item.querySelector('.result-channel').textContent;
            playTrack(videoId, title, channel);
            searchResults.style.display = 'none';
        });
    });
};

const playTrack = (videoId, title, channel) => {
    if (!youtubePlayer || !youtubePlayer.loadVideoById) {
        console.error('YouTube player not ready');
        return;
    }
    
    youtubePlayer.loadVideoById(videoId);
    updateCurrentTrackInfo(title, channel);
    
    // Add to playlist if not already there
    const trackExists = currentPlaylist.find(track => track.videoId === videoId);
    if (!trackExists) {
        currentPlaylist.push({ videoId, title, channel });
        currentTrackIndex = currentPlaylist.length - 1;
    }
};

const updateCurrentTrackInfo = (title, channel) => {
    document.getElementById('current-title').textContent = title;
    document.getElementById('current-artist').textContent = channel;
};

const showApiKeyNotice = () => {
    const searchResults = document.getElementById('search-results');
    searchResults.style.display = 'block';
    searchResults.innerHTML = `
        <div class="no-results">
            <p>⚠️ YouTube API Setup Required</p>
            <small>1. Get API key from Google Cloud Console</small><br>
            <small>2. Enable YouTube Data API v3</small><br>
            <small>3. Replace API key in script.js</small><br><br>
            <button onclick="testApiKey()" style="padding: 4px 8px; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Test API Key</button>
        </div>
    `;
};

// Test function to check API key
window.testApiKey = async () => {
    console.log('Testing API key...');
    const testUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=test&key=${YOUTUBE_API_KEY}`;
    
    try {
        const response = await fetch(testUrl);
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ API key works!', data);
            alert('✅ API key is working! Try searching for music now.');
        } else {
            console.error('❌ API key error:', data);
            alert(`❌ API Error: ${data.error?.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('❌ Network error:', error);
        alert(`❌ Network Error: ${error.message}`);
    }
};

// Music Player Controls
const musicToggle = document.getElementById('music-toggle');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const searchInput = document.getElementById('music-search');
const searchBtn = document.getElementById('search-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const volumeSlider = document.getElementById('volume-slider');
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.getElementById('progress-fill');
const currentTimeDisplay = document.getElementById('current-time');
const totalTimeDisplay = document.getElementById('total-time');

// Music player event listeners
musicToggle.addEventListener('click', togglePlayPause);
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchYouTube(query);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            searchYouTube(query);
        }
    }
});

prevBtn.addEventListener('click', previousTrack);
nextBtn.addEventListener('click', nextTrack);
shuffleBtn.addEventListener('click', toggleShuffle);
volumeSlider.addEventListener('input', updateVolumeFromSlider);

// Progress bar click
progressBar.addEventListener('click', (e) => {
    if (youtubePlayer && youtubePlayer.getDuration) {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const duration = youtubePlayer.getDuration();
        const newTime = (clickX / width) * duration;
        youtubePlayer.seekTo(newTime);
    }
});

const togglePlayPause = () => {
    if (!youtubePlayer) {
        console.error('YouTube player not ready');
        return;
    }
    
    if (isPlaying) {
        youtubePlayer.pauseVideo();
    } else {
        youtubePlayer.playVideo();
    }
};

const updatePlayPauseButton = () => {
    if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
};

const previousTrack = () => {
    if (currentPlaylist.length === 0) return;
    
    currentTrackIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : currentPlaylist.length - 1;
    const track = currentPlaylist[currentTrackIndex];
    playTrack(track.videoId, track.title, track.channel);
};

const nextTrack = () => {
    if (currentPlaylist.length === 0) return;
    
    currentTrackIndex = (currentTrackIndex + 1) % currentPlaylist.length;
    const track = currentPlaylist[currentTrackIndex];
    playTrack(track.videoId, track.title, track.channel);
};

const toggleShuffle = () => {
    // Simple shuffle implementation
    if (currentPlaylist.length > 1) {
        currentPlaylist.sort(() => Math.random() - 0.5);
        currentTrackIndex = 0;
        shuffleBtn.style.color = shuffleBtn.style.color === 'var(--primary-color)' ? '' : 'var(--primary-color)';
    }
};

const updateVolumeFromSlider = () => {
    if (youtubePlayer && youtubePlayer.setVolume) {
        youtubePlayer.setVolume(volumeSlider.value);
    }
};

// Progress tracking
let progressInterval;

const startProgressUpdate = () => {
    clearInterval(progressInterval);
    progressInterval = setInterval(updateProgress, 1000);
};

const updateProgress = () => {
    if (youtubePlayer && youtubePlayer.getCurrentTime && youtubePlayer.getDuration) {
        const currentTime = youtubePlayer.getCurrentTime();
        const duration = youtubePlayer.getDuration();
        
        if (duration > 0) {
            const progress = (currentTime / duration) * 100;
            progressFill.style.width = progress + '%';
            currentTimeDisplay.textContent = formatTime(currentTime);
            totalTimeDisplay.textContent = formatTime(duration);
        }
    }
};

// Format time helper
const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Initialize YouTube player when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize YouTube player
    initYouTubePlayer();
    
    // Add pulse animation
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