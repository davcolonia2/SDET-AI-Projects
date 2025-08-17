// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, initializing...');
    
    // DEBUG: Check if dependencies.js loaded immediately
    console.log('🔍 Immediate check - PORTFOLIO_CONFIG exists:', !!window.PORTFOLIO_CONFIG);
    if (window.PORTFOLIO_CONFIG) {
        console.log('✅ Dependencies.js loaded successfully:', window.PORTFOLIO_CONFIG);
    } else {
        console.log('❌ Dependencies.js not loaded yet, will check again...');
        
        // Check again after a delay
        setTimeout(() => {
            console.log('🔍 Delayed check - PORTFOLIO_CONFIG exists:', !!window.PORTFOLIO_CONFIG);
            if (window.PORTFOLIO_CONFIG) {
                console.log('✅ Dependencies.js loaded after delay:', window.PORTFOLIO_CONFIG);
            } else {
                console.error('❌ Dependencies.js still not loaded after 3 seconds');
                console.log('🔍 Checking all script tags:');
                document.querySelectorAll('script').forEach((script, index) => {
                    console.log(`Script ${index}:`, script.src || script.innerHTML.substring(0, 50));
                });
            }
        }, 3000);
    }
    
    // DOM elements - moved inside DOMContentLoaded to ensure elements exist
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const themeToggle = document.getElementById('theme-toggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    console.log('Theme toggle element:', themeToggle);

    // Theme toggle functionality
    const initTheme = () => {
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeToggleIcon(currentTheme);
        console.log('Theme initialized:', currentTheme);
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
            e.preventDefault();
            e.stopPropagation();
            
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            console.log('Switching theme from', currentTheme, 'to', newTheme);
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeToggleIcon(newTheme);
        });
    } else {
        console.error('Theme toggle button not found!');
    }

    // Mobile menu toggle functionality
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

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
            if (navbar) navbar.style.transform = 'translateY(-100%)';
        } else {
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
                const offsetTop = target.offsetTop - 70;
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
        const scrollPos = window.pageYOffset + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
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

    const animateElements = document.querySelectorAll('.project-card, .contact-item, .skill-category');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Keyboard navigation accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
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

    createScrollToTop();

    // Initialize YouTube player
    console.log('🎵 Starting YouTube player initialization...');
    initYouTubePlayer();
    
    // Add debug button after a delay
    setTimeout(addDebugButton, 2000);
    
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

    // Console message for developers
    console.log('👋 Hello! This portfolio was built with vanilla HTML, CSS, and JavaScript.');
    console.log('🚀 Ready for GitHub Pages deployment!');
    console.log('💼 David Colonia - Software QA Engineer');
});

// ==================== YOUTUBE MUSIC PLAYER ====================

// API Configuration with enhanced debugging
const getApiKey = () => {
    console.log('🔍 getApiKey() called');
    console.log('📄 Checking window.PORTFOLIO_CONFIG...');
    console.log('🌐 window.PORTFOLIO_CONFIG exists:', !!window.PORTFOLIO_CONFIG);
    
    if (window.PORTFOLIO_CONFIG) {
        console.log('📋 Config object:', window.PORTFOLIO_CONFIG);
        console.log('🔑 Token value:', window.PORTFOLIO_CONFIG.token ? 'Present' : 'Missing');
        return window.PORTFOLIO_CONFIG.token;
    } else {
        console.log('❌ No PORTFOLIO_CONFIG found');
        console.log('🔍 All window properties containing "CONFIG":');
        Object.keys(window).filter(key => key.includes('CONFIG')).forEach(key => {
            console.log(`  - ${key}:`, window[key]);
        });
        return null;
    }
};

// Player variables
let youtubePlayer;
let currentPlaylist = [];
let currentTrackIndex = 0;
let isPlaying = false;

// Initialize YouTube Player with better fallback
const initYouTubePlayer = () => {
    console.log('🎵 Initializing YouTube player...');
    
    // Set initial state for UI
    updateCurrentTrackInfo('Setting up music player...', 'Please wait...');
    
    if (window.YT && window.YT.Player) {
        console.log('✅ YouTube API already loaded');
        createPlayer();
        return;
    }
    
    console.log('📡 Loading YouTube IFrame API...');
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.onerror = () => {
        console.error('❌ Failed to load YouTube API, using search-only mode');
        enableSearchOnlyMode();
    };
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    window.onYouTubeIframeAPIReady = createPlayer;
    
    // Backup timeout in case API never loads
    setTimeout(() => {
        if (!youtubePlayer || typeof youtubePlayer.getPlayerState === 'undefined') {
            console.log('⏰ YouTube API timeout, enabling search-only mode');
            enableSearchOnlyMode();
        }
    }, 10000);
};

// Search-only mode when player fails
const enableSearchOnlyMode = () => {
    console.log('🔍 Enabling search-only mode');
    updateCurrentTrackInfo('Search for music', 'Player will work after first search');
    
    // Create a dummy player object for compatibility
    youtubePlayer = {
        searchMode: true,
        getPlayerState: () => -1,
        playVideo: () => console.log('Play requested in search mode'),
        pauseVideo: () => console.log('Pause requested in search mode'),
        loadVideoById: (id) => {
            console.log('Loading video in search mode:', id);
            // Open video in new tab as fallback
            window.open(`https://www.youtube.com/watch?v=${id}`, '_blank');
        }
    };
    
    isPlaying = false;
    console.log('✅ Search-only mode ready');
};

const createPlayer = () => {
    console.log('🎬 Creating YouTube player...');
    
    try {
        youtubePlayer = new YT.Player('youtube-player', {
            height: '0',
            width: '0',
            videoId: 'rDWIA-hEAZQ', // New default video ID
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                enablejsapi: 1,
                fs: 0,
                iv_load_policy: 3,
                modestbranding: 1,
                playsinline: 1,
                rel: 0,
                origin: window.location.origin
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
                onError: onPlayerError
            }
        });
        console.log('✅ YouTube player created successfully');
        
        // Fallback: Check if player is ready manually after a delay
        setTimeout(() => {
            if (youtubePlayer && typeof youtubePlayer.getPlayerState === 'undefined') {
                console.log('🔄 onPlayerReady never fired, checking manually...');
                checkPlayerReadiness();
            }
        }, 5000);
        
    } catch (error) {
        console.error('❌ Error creating YouTube player:', error);
    }
};

// Manual player readiness check
const checkPlayerReadiness = () => {
    console.log('🔍 Manually checking player readiness...');
    
    if (!youtubePlayer) {
        console.log('❌ No player object');
        return;
    }
    
    // Sometimes the player methods become available without the ready event
    if (typeof youtubePlayer.getPlayerState === 'function') {
        console.log('✅ Player methods available, calling onPlayerReady manually');
        onPlayerReady(null);
    } else {
        console.log('⏳ Player methods still not ready, trying to force initialization...');
        
        // Try to reinitialize
        setTimeout(() => {
            if (typeof youtubePlayer.getPlayerState === 'function') {
                console.log('✅ Player methods now ready after wait');
                onPlayerReady(null);
            } else {
                console.log('❌ Player initialization failed, using fallback');
                // Set up basic functionality without player methods
                updateCurrentTrackInfo('Manual Load Required', 'Search for music to start');
            }
        }, 3000);
    }
};

const onPlayerReady = (event) => {
    console.log('✅ YouTube player ready!');
    
    // Wait a moment for all methods to be available
    setTimeout(() => {
        try {
            // Test if methods are available
            if (typeof youtubePlayer.getPlayerState === 'function') {
                const playerState = youtubePlayer.getPlayerState();
                console.log('Player state:', playerState);
                
                const videoData = youtubePlayer.getVideoData();
                console.log('Video data:', videoData);
                
                if (videoData && videoData.title && videoData.title !== '') {
                    updateCurrentTrackInfo(videoData.title, 'Ready to play!');
                    currentPlaylist = [{
                        videoId: 'rDWIA-hEAZQ',
                        title: videoData.title,
                        channel: 'Ready to play!'
                    }];
                    currentTrackIndex = 0;
                    console.log('✅ Default song loaded from player data');
                } else {
                    console.log('No video data yet, loading manually...');
                    loadDefaultSong();
                }
            } else {
                console.log('Player methods not ready yet, trying manual load...');
                loadDefaultSong();
            }
            
            // Set up volume
            updateVolumeFromSlider();
            
        } catch (error) {
            console.error('Error in onPlayerReady:', error);
            console.log('Falling back to manual song loading...');
            loadDefaultSong();
        }
    }, 1000); // Wait 1 second for methods to be available
};

const onPlayerStateChange = (event) => {
    console.log('Player state changed:', event.data);
    
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        updatePlayPauseButton();
        startProgressUpdate();
    } else if (event.data === YT.PlayerState.PAUSED) {
        isPlaying = false;
        updatePlayPauseButton();
    } else if (event.data === YT.PlayerState.ENDED) {
        nextTrack();
    } else if (event.data === YT.PlayerState.BUFFERING) {
        console.log('Video buffering...');
    } else if (event.data === YT.PlayerState.CUED) {
        console.log('Video cued and ready to play');
    }
};

const onPlayerError = (event) => {
    console.error('❌ YouTube Player Error:', event.data);
    let errorMessage = 'Unknown error';
    
    switch (event.data) {
        case 2: errorMessage = 'Invalid video ID'; break;
        case 5: errorMessage = 'HTML5 player error'; break;
        case 100: errorMessage = 'Video not found or private'; break;
        case 101:
        case 150: errorMessage = 'Video cannot be embedded'; break;
    }
    
    updateCurrentTrackInfo('Video Error', errorMessage);
};

const loadDefaultSong = async () => {
    const defaultVideoId = 'rDWIA-hEAZQ'; // New default video ID
    const apiKey = getApiKey();
    
    console.log('Loading new default song:', defaultVideoId);
    updateCurrentTrackInfo('Loading song...', 'Please wait...');
    
    try {
        if (!youtubePlayer || typeof youtubePlayer.cueVideoById !== 'function') {
            console.error('YouTube player not ready yet');
            updateCurrentTrackInfo('Player not ready', 'Try refreshing page');
            return;
        }
        
        youtubePlayer.cueVideoById(defaultVideoId);
        console.log('Video cued successfully');
        
        if (apiKey) {
            try {
                const response = await fetch(
                    `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${defaultVideoId}&key=${apiKey}`
                );
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.items && data.items.length > 0) {
                        const video = data.items[0].snippet;
                        updateCurrentTrackInfo(video.title, video.channelTitle);
                        console.log('Video details loaded:', video.title);
                        
                        currentPlaylist = [{
                            videoId: defaultVideoId,
                            title: video.title,
                            channel: video.channelTitle
                        }];
                    } else {
                        console.log('No video data found, using fallback');
                        updateCurrentTrackInfo('New Default Song', 'Click play to start');
                    }
                } else {
                    console.log('API request failed, using fallback');
                    updateCurrentTrackInfo('New Default Song', 'Click play to start');
                }
            } catch (apiError) {
                console.log('API call failed, using fallback:', apiError);
                updateCurrentTrackInfo('New Default Song', 'Click play to start');
            }
        } else {
            console.log('No API key, using fallback');
            updateCurrentTrackInfo('New Default Song', 'Click play to start');
        }
        
        // Always add to playlist regardless of API status
        if (currentPlaylist.length === 0) {
            currentPlaylist = [{
                videoId: defaultVideoId,
                title: 'New Default Song',
                channel: 'Click play to start'
            }];
        }
        currentTrackIndex = 0;
        
    } catch (error) {
        console.error('Error loading default song:', error);
        updateCurrentTrackInfo('Failed to load', 'Search for music instead');
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

// Event listeners - safely added
setTimeout(() => {
    if (musicToggle) musicToggle.addEventListener('click', togglePlayPause);
    if (searchBtn) searchBtn.addEventListener('click', () => {
        const query = searchInput?.value?.trim();
        if (query) searchYouTube(query);
    });
    if (searchInput) searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) searchYouTube(query);
        }
    });
    if (prevBtn) prevBtn.addEventListener('click', previousTrack);
    if (nextBtn) nextBtn.addEventListener('click', nextTrack);
    if (shuffleBtn) shuffleBtn.addEventListener('click', toggleShuffle);
    if (volumeSlider) volumeSlider.addEventListener('input', updateVolumeFromSlider);
    if (progressBar) progressBar.addEventListener('click', (e) => {
        if (youtubePlayer && youtubePlayer.getDuration) {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const duration = youtubePlayer.getDuration();
            const newTime = (clickX / width) * duration;
            youtubePlayer.seekTo(newTime);
        }
    });
}, 1000);

const searchYouTube = async (query) => {
    const apiKey = getApiKey();
    console.log('🔍 Searching for:', query);
    
    if (!apiKey) {
        showApiKeyNotice();
        return;
    }
    
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    searchResults.style.display = 'block';
    searchResults.innerHTML = '<div class="loading">🔍 Searching YouTube...</div>';
    
    try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=8&q=${encodeURIComponent(query)}&key=${apiKey}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Search results:', data.items?.length, 'videos found');
        
        if (data.items && data.items.length > 0) {
            displaySearchResults(data.items);
        } else {
            searchResults.innerHTML = '<div class="no-results">No music found. Try a different search term.</div>';
        }
        
    } catch (error) {
        console.error('❌ Search error:', error);
        searchResults.innerHTML = `
            <div class="no-results">
                <p>❌ Search failed</p>
                <small>${error.message}</small>
            </div>
        `;
    }
};

const displaySearchResults = (results) => {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    console.log('📋 Displaying', results.length, 'search results');
    
    searchResults.innerHTML = results.map((item, index) => {
        const title = item.snippet.title.length > 60 
            ? item.snippet.title.substring(0, 60) + '...' 
            : item.snippet.title;
        
        return `
            <div class="search-result-item" data-video-id="${item.id.videoId}" data-index="${index}">
                <img class="result-thumbnail" 
                     src="${item.snippet.thumbnails.default.url}" 
                     alt="thumbnail"
                     onerror="this.style.display='none'">
                <div class="result-info">
                    <div class="result-title">${title}</div>
                    <div class="result-channel">${item.snippet.channelTitle}</div>
                </div>
                <div class="result-play-btn">▶️</div>
            </div>
        `;
    }).join('');
    
    searchResults.querySelectorAll('.search-result-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            const videoId = item.dataset.videoId;
            const videoData = results[index];
            const title = videoData.snippet.title;
            const channel = videoData.snippet.channelTitle;
            
            console.log('🎵 Playing:', title);
            playTrack(videoId, title, channel);
            
            searchResults.style.display = 'none';
            if (searchInput) searchInput.value = '';
        });
    });
};

const playTrack = (videoId, title, channel) => {
    console.log('🎵 Loading track:', title, 'by', channel);
    
    if (!youtubePlayer) {
        console.error('❌ YouTube player not ready');
        updateCurrentTrackInfo('Player not ready', 'Try refreshing page');
        return;
    }
    
    // Check if we're in search-only mode
    if (youtubePlayer.searchMode) {
        console.log('🔍 Search-only mode: Opening video in new tab');
        updateCurrentTrackInfo(title, `${channel} - Opening in new tab`);
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
        
        // Update playlist for UI consistency
        const trackExists = currentPlaylist.find(track => track.videoId === videoId);
        if (!trackExists) {
            currentPlaylist.push({ videoId, title, channel });
            currentTrackIndex = currentPlaylist.length - 1;
        }
        return;
    }
    
    try {
        youtubePlayer.loadVideoById(videoId);
        console.log('✅ Video loaded successfully');
        
        updateCurrentTrackInfo(title, channel);
        
        const trackExists = currentPlaylist.find(track => track.videoId === videoId);
        if (!trackExists) {
            currentPlaylist.push({ videoId, title, channel });
            currentTrackIndex = currentPlaylist.length - 1;
        } else {
            currentTrackIndex = currentPlaylist.findIndex(track => track.videoId === videoId);
        }
        
        console.log('📝 Track added to playlist. Position:', currentTrackIndex);
        
    } catch (error) {
        console.error('❌ Error playing track:', error);
        // Fallback to opening in new tab
        console.log('🔗 Falling back to new tab');
        updateCurrentTrackInfo(title, `${channel} - Opening in new tab`);
        window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }
};

const togglePlayPause = () => {
    console.log('🎵 Play/Pause clicked');
    
    if (!youtubePlayer) {
        console.error('❌ YouTube player not available');
        updateCurrentTrackInfo('Player not ready', 'Try refreshing page');
        return;
    }
    
    // Handle search-only mode
    if (youtubePlayer.searchMode) {
        console.log('🔍 Search-only mode: Encouraging user to search');
        updateCurrentTrackInfo('Search for music above', 'Then click a result to play');
        return;
    }
    
    // Check if player methods are available
    if (typeof youtubePlayer.getPlayerState !== 'function') {
        console.error('❌ Player methods not ready yet');
        updateCurrentTrackInfo('Player loading...', 'Please wait a moment');
        
        // Try again after a delay
        setTimeout(() => {
            if (typeof youtubePlayer.getPlayerState === 'function') {
                console.log('✅ Player methods now available, retrying...');
                togglePlayPause();
            } else {
                console.error('❌ Player methods still not available');
                // Enable search mode as fallback
                enableSearchOnlyMode();
            }
        }, 2000);
        return;
    }
    
    try {
        const playerState = youtubePlayer.getPlayerState();
        console.log('Current player state:', playerState);
        
        if (playerState === YT.PlayerState.PLAYING) {
            console.log('⏸️ Pausing video');
            youtubePlayer.pauseVideo();
        } else if (playerState === YT.PlayerState.PAUSED || playerState === YT.PlayerState.CUED) {
            console.log('▶️ Playing video');
            youtubePlayer.playVideo();
        } else {
            console.log('🔄 Player not ready, loading video first...');
            youtubePlayer.playVideo();
        }
    } catch (error) {
        console.error('❌ Error toggling play/pause:', error);
        updateCurrentTrackInfo('Search for music', 'Use search above to get started');
    }
};

const updatePlayPauseButton = () => {
    if (playIcon && pauseIcon) {
        if (isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
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
    if (currentPlaylist.length > 1) {
        currentPlaylist.sort(() => Math.random() - 0.5);
        currentTrackIndex = 0;
        if (shuffleBtn) {
            shuffleBtn.style.color = shuffleBtn.style.color === 'var(--primary-color)' ? '' : 'var(--primary-color)';
        }
    }
};

const updateVolumeFromSlider = () => {
    if (youtubePlayer && youtubePlayer.setVolume && volumeSlider) {
        youtubePlayer.setVolume(volumeSlider.value);
    }
};

const updateCurrentTrackInfo = (title, channel) => {
    const titleEl = document.getElementById('current-title');
    const artistEl = document.getElementById('current-artist');
    
    if (titleEl) titleEl.textContent = title;
    if (artistEl) artistEl.textContent = channel;
    
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) {
        if (title.includes('Failed') || title.includes('Error') || channel.includes('Try refreshing')) {
            retryBtn.style.display = 'inline-block';
        } else {
            retryBtn.style.display = 'none';
        }
    }
};

const showApiKeyNotice = () => {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.style.display = 'block';
        searchResults.innerHTML = `
            <div class="no-results">
                <p>⚠️ YouTube API key required</p>
                <small>Add your API key to dependencies.js</small>
            </div>
        `;
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
            if (progressFill) progressFill.style.width = progress + '%';
            if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(currentTime);
            if (totalTimeDisplay) totalTimeDisplay.textContent = formatTime(duration);
        }
    }
};

const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Global functions
window.retryDefaultSong = () => {
    console.log('🔄 Retrying default song load...');
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) retryBtn.style.display = 'none';
    loadDefaultSong();
};

// Manual player force initialization
window.forcePlayerInit = () => {
    console.log('🚀 Forcing player initialization...');
    if (youtubePlayer) {
        console.log('Player object exists, checking readiness...');
        checkPlayerReadiness();
    } else {
        console.log('No player object, recreating...');
        createPlayer();
    }
};

// Simple play test
window.testPlay = () => {
    console.log('🎵 Testing direct play...');
    if (youtubePlayer && typeof youtubePlayer.playVideo === 'function') {
        try {
            youtubePlayer.playVideo();
            console.log('✅ Direct play attempted');
        } catch (error) {
            console.log('❌ Direct play failed:', error);
        }
    } else {
        console.log('❌ Player or playVideo method not available');
        
        // Try to use the search function instead
        console.log('🔍 Trying search method as fallback...');
        searchYouTube('lofi hip hop');
    }
};

// Enhanced debugging function for dependencies
window.debugDependencies = () => {
    console.log('🔍 === DEPENDENCIES DEBUG ===');
    console.log('1. Checking script tags in HTML:');
    document.querySelectorAll('script').forEach((script, index) => {
        if (script.src) {
            console.log(`   Script ${index}: ${script.src} (${script.src.includes('dependencies') ? '✅ DEPENDENCIES' : ''})`);
        } else {
            console.log(`   Script ${index}: Inline script (${script.innerHTML.substring(0, 50)}...)`);
        }
    });
    
    console.log('2. Checking window.PORTFOLIO_CONFIG:', window.PORTFOLIO_CONFIG);
    console.log('3. Checking for any CONFIG variables:');
    Object.keys(window).filter(key => key.includes('CONFIG')).forEach(key => {
        console.log(`   - ${key}:`, window[key]);
    });
    
    console.log('4. File loading test:');
    fetch('./dependencies.js')
        .then(response => {
            console.log('   Dependencies.js fetch status:', response.status);
            return response.text();
        })
        .then(text => {
            console.log('   Dependencies.js content preview:', text.substring(0, 100));
        })
        .catch(error => {
            console.log('   Dependencies.js fetch error:', error.message);
        });
    
    console.log('=== END DEBUG ===');
};

window.testApiKey = async () => {
    console.log('🧪 Testing API key...');
    
    try {
        const apiKey = getApiKey();
        
        if (!window.PORTFOLIO_CONFIG) {
            alert('❌ No API connected - dependencies.js file not loaded');
            console.error('Dependencies.js not loaded');
            return;
        }
        
        if (!apiKey) {
            alert('❌ No API connected - Add your YouTube API key to dependencies.js');
            console.error('No API key configured');
            return;
        }
        
        console.log('🔑 API key found, testing connection...');
        
        const testUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=test&key=${apiKey}`;
        
        const response = await fetch(testUrl);
        const data = await response.json();
        
        if (response.ok && data.items) {
            console.log('✅ API test successful!', data);
            alert('✅ API key is working! You can now search for music.');
        } else {
            console.error('❌ API test failed:', data);
            const errorMsg = data.error?.message || 'Unknown API error';
            alert(`❌ API Error: ${errorMsg}`);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        alert(`❌ Connection failed: ${error.message}`);
    }
};

window.checkMusicPlayerStatus = () => {
    const apiKey = getApiKey();
    console.log('🔍 === MUSIC PLAYER STATUS CHECK ===');
    console.log('API Key present:', !!apiKey);
    console.log('YouTube API loaded:', typeof window.YT !== 'undefined');
    console.log('Player object exists:', !!youtubePlayer);
    
    if (youtubePlayer) {
        console.log('Player object type:', typeof youtubePlayer);
        console.log('Player methods available:');
        console.log('  - getPlayerState:', typeof youtubePlayer.getPlayerState);
        console.log('  - getVideoData:', typeof youtubePlayer.getVideoData);
        console.log('  - playVideo:', typeof youtubePlayer.playVideo);
        console.log('  - pauseVideo:', typeof youtubePlayer.pauseVideo);
        
        // Only try to call methods if they exist
        if (typeof youtubePlayer.getPlayerState === 'function') {
            try {
                console.log('Player state:', youtubePlayer.getPlayerState());
                console.log('Video data:', youtubePlayer.getVideoData());
                if (typeof youtubePlayer.getCurrentTime === 'function') {
                    console.log('Current time:', youtubePlayer.getCurrentTime());
                }
                if (typeof youtubePlayer.getDuration === 'function') {
                    console.log('Duration:', youtubePlayer.getDuration());
                }
            } catch (error) {
                console.log('Error calling player methods:', error);
            }
        } else {
            console.log('❌ Player methods not available yet');
        }
    }
    
    console.log('Current playlist:', currentPlaylist);
    console.log('Is playing:', isPlaying);
    console.log('=== END STATUS CHECK ===');
};

const addDebugButton = () => {
    const debugBtn = document.createElement('button');
    debugBtn.textContent = '🔍 Debug Status';
    debugBtn.className = 'api-test-btn';
    debugBtn.onclick = window.checkMusicPlayerStatus;
    debugBtn.style.marginTop = '0.5rem';
    debugBtn.style.width = '100%';
    
    const apiNotice = document.querySelector('.api-notice');
    if (apiNotice) {
        apiNotice.appendChild(debugBtn);
    }
};