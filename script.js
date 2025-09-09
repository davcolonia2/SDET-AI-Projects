// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, initializing...');
    
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

    // Initialize Web Audio Player (REPLACED YouTube player completely)
    console.log('🎵 Starting Web Audio Player initialization...');
    initWebAudioPlayer();
    
    // Wait for player to initialize before adding playlist button
    setTimeout(() => {
        const musicInfo = document.getElementById('music-info');
        if (musicInfo && webAudioPlayer) {
            // Only add playlist button if files were loaded
            if (webAudioPlayer.playlist.length > 0) {
                const playlistBtn = document.createElement('button');
                playlistBtn.textContent = '📋 Show Playlist';
                playlistBtn.className = 'api-test-btn';
                playlistBtn.onclick = () => webAudioPlayer.showPlaylist();
                playlistBtn.style.marginTop = '0.5rem';
                playlistBtn.style.width = '100%';
                
                const uploadContainer = musicInfo.querySelector('.upload-container');
                if (uploadContainer) {
                    uploadContainer.appendChild(playlistBtn);
                }
            }
        }
    }, 3000); // Give more time for file detection
    // After: initWebAudioPlayer();

    
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
        
        /* Additional styles for Web Audio Player */
        .upload-container {
            margin: 1rem 0;
            padding: 1rem;
            border: 2px dashed var(--border-color);
            border-radius: 8px;
            text-align: center;
            background: var(--surface-color);
        }
        
        .upload-btn {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .upload-btn:hover {
            background: var(--primary-dark);
            transform: translateY(-2px);
        }
        
        .upload-info {
            margin-top: 0.5rem;
            color: var(--text-secondary);
        }
        
        .playlist-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
            background: var(--surface-color);
        }
        
        .playlist-header h4 {
            margin: 0;
            color: var(--text-primary);
        }
        
        .playlist-items {
            max-height: 300px;
            overflow-y: auto;
        }
        
        .playlist-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 1rem;
            border-bottom: 1px solid var(--border-color);
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        
        .playlist-item:hover {
            background: var(--surface-color);
        }
        
        .playlist-item.current {
            background: var(--primary-color);
            color: white;
        }
        
        .track-info {
            flex: 1;
        }
        
        .track-title {
            font-weight: 500;
            margin-bottom: 0.25rem;
        }
        
        .track-artist {
            font-size: 0.875rem;
            opacity: 0.8;
        }
        
        .track-controls {
            display: flex;
            gap: 0.5rem;
            align-items: center;
        }
        
        .local-file {
            font-size: 0.875rem;
        }
        
        .track-controls button {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            opacity: 0.7;
            transition: opacity 0.2s ease;
        }
        
        .track-controls button:hover {
            opacity: 1;
        }
        
        .api-test-btn {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.875rem;
            margin-top: 0.5rem;
        }
        
        .api-test-btn:hover {
            background: var(--primary-dark);
        }
    `;
    document.head.appendChild(style);

    // Console message for developers
    console.log('👋 Hello! This portfolio was built with vanilla HTML, CSS, and JavaScript.');
    console.log('🚀 Ready for GitHub Pages deployment!');
    console.log('💼 David Colonia - Software QA Engineer');
});

// ==================== WEB AUDIO MUSIC PLAYER ====================

class WebAudioPlayer {
    constructor() {
        this.audioContext = null;
        this.currentAudio = null;
        this.currentSource = null;
        this.gainNode = null;
        this.analyser = null;
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.playlist = [];
        this.currentTrackIndex = 0;
        this.volume = 0.5;
        this.progressUpdateInterval = null;
        
        this.init();
    }
    
    async init() {
        try {
            console.log('Initializing Web Audio Player...');
            
            // Initialize Web Audio API
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.analyser = this.audioContext.createAnalyser();
            
            // Configure analyser for visualizer
            this.analyser.fftSize = 256;
            this.analyser.smoothingTimeConstant = 0.8;
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            
            this.gainNode.connect(this.audioContext.destination);
            this.analyser.connect(this.gainNode);
            this.gainNode.gain.value = this.volume;
            
            // Set up UI first
            this.setupEventListeners();
            this.setupFileUpload();
            
            // Try to load default files from audio folder
            await this.loadDefaultFiles();
            
            console.log('Web Audio Player initialized successfully');
            
        } catch (error) {
            console.error('Error initializing Web Audio Player:', error);
            this.showError('Audio not supported in this browser');
        }
    }
    
    async loadDefaultFiles() {
        console.log('Looking for audio files in project folder...');
        this.updateCurrentTrackInfo('Looking for audio files...', 'Checking audio folder...');
        
        // Files to try loading automatically
        const filesToTry = [
            'audio/default.m4a',
            'audio/demo.m4a',
            'audio/background.m4a',
            'audio/music.m4a',
            'audio/default.mp3',
            'audio/demo.mp3',
            'audio/track.m4a',
            'audio/song.m4a'
        ];
        
        let fileLoaded = false;
        
        for (const filePath of filesToTry) {
            try {
                console.log(`Attempting to load: ${filePath}`);
                
                const audio = new Audio();
                const canLoad = await new Promise((resolve) => {
                    const timeout = setTimeout(() => {
                        console.log(`Timeout for ${filePath}`);
                        resolve(false);
                    }, 3000);
                    
                    audio.addEventListener('loadedmetadata', () => {
                        console.log(`Successfully detected: ${filePath}`);
                        clearTimeout(timeout);
                        resolve(true);
                    });
                    
                    audio.addEventListener('error', () => {
                        console.log(`File not found: ${filePath}`);
                        clearTimeout(timeout);
                        resolve(false);
                    });
                    
                    audio.src = filePath;
                });
                
                if (canLoad) {
                    // File found! Add to playlist
                    const track = {
                        title: this.extractTitleFromPath(filePath),
                        artist: 'Portfolio Music',
                        file: filePath,
                        duration: Math.floor(audio.duration) || 0,
                        isDefault: true
                    };
                    
                    this.playlist.push(track);
                    this.currentTrackIndex = 0;
                    fileLoaded = true;
                    
                    console.log(`Loaded default track: ${track.title} (${track.duration}s)`);
                    break; // Stop after first successful file
                }
                
            } catch (error) {
                console.log(`Error with ${filePath}:`, error.message);
            }
        }
        
        if (fileLoaded) {
            this.updateCurrentTrackInfo();
            console.log('Default audio file ready to play');
            
            // Attempt auto-play
            setTimeout(async () => {
                console.log('Attempting auto-play...');
                try {
                    await this.play();
                } catch (error) {
                    console.log('Auto-play blocked by browser - this is normal');
                    this.showReadyToPlay();
                }
            }, 2000);
            
        } else {
            console.log('No audio files found in audio folder');
            this.updateCurrentTrackInfo('No audio files found', 'Add files to audio folder or upload files');
        }
    }
    
    extractTitleFromPath(filePath) {
        const fileName = filePath.split('/').pop().replace(/\.[^/.]+$/, '');
        return fileName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    setupEventListeners() {
        const musicToggle = document.getElementById('music-toggle');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const shuffleBtn = document.getElementById('shuffle-btn');
        const volumeSlider = document.getElementById('volume-slider');
        const progressBar = document.querySelector('.progress-bar');
        
        if (musicToggle) {
            musicToggle.addEventListener('click', () => this.togglePlayPause());
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousTrack());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextTrack());
        }
        
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => this.shufflePlaylist());
        }
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value / 100));
            volumeSlider.value = this.volume * 100;
        }
        
        if (progressBar) {
            progressBar.addEventListener('click', (e) => this.seek(e));
        }
    }
    
    setupFileUpload() {
        const musicInfo = document.getElementById('music-info');
        if (!musicInfo) return;
        
        // Hide API-related elements since we don't need them
        const apiNotice = document.querySelector('.api-notice');
        if (apiNotice) {
            apiNotice.style.display = 'none';
        }
        
        // Replace search container with upload interface
        const searchContainer = musicInfo.querySelector('.search-container');
        if (searchContainer) {
            const uploadContainer = document.createElement('div');
            uploadContainer.className = 'upload-container';
            uploadContainer.innerHTML = `
                <input type="file" id="audio-file-input" accept="audio/*" multiple style="display: none;">
                <button class="upload-btn" onclick="document.getElementById('audio-file-input').click()">
                    📁 Add Music Files
                </button>
                <div class="upload-info">
                    <small>Supports MP3, M4A, WAV, OGG</small>
                </div>
            `;
            
            searchContainer.replaceWith(uploadContainer);
            
            const fileInput = document.getElementById('audio-file-input');
            if (fileInput) {
                fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
            }
        }
    }
    
    handleFileUpload(event) {
        const files = Array.from(event.target.files);
        
        files.forEach(file => {
            if (file.type.startsWith('audio/')) {
                const fileURL = URL.createObjectURL(file);
                const fileName = file.name.replace(/\.[^/.]+$/, '');
                
                let artist = 'Unknown Artist';
                let title = fileName;
                
                if (fileName.includes(' - ')) {
                    const parts = fileName.split(' - ');
                    artist = parts[0].trim();
                    title = parts[1].trim();
                }
                
                this.playlist.push({
                    title: title,
                    artist: artist,
                    file: fileURL,
                    isLocal: true
                });
                
                console.log(`Added to playlist: ${title} by ${artist}`);
            }
        });
        
        this.showPlaylist();
        event.target.value = '';
    }
    
    showPlaylist() {
        const searchResults = document.getElementById('search-results');
        if (!searchResults) return;
        
        searchResults.style.display = 'block';
        searchResults.innerHTML = `
            <div class="playlist-header">
                <h4>Your Playlist (${this.playlist.length} tracks)</h4>
                <button onclick="webAudioPlayer.hidePlaylist()">✕</button>
            </div>
            <div class="playlist-items">
                ${this.playlist.map((track, index) => `
                    <div class="playlist-item ${index === this.currentTrackIndex ? 'current' : ''}" 
                         onclick="webAudioPlayer.playTrackByIndex(${index})">
                        <div class="track-info">
                            <div class="track-title">${track.title}</div>
                            <div class="track-artist">${track.artist}</div>
                        </div>
                        <div class="track-controls">
                            ${track.isLocal ? '<span class="local-file">📁</span>' : ''}
                            ${track.isDefault ? '<span class="local-file">🏠</span>' : ''}
                            <button onclick="event.stopPropagation(); webAudioPlayer.removeTrack(${index})">🗑️</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    hidePlaylist() {
        const searchResults = document.getElementById('search-results');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }
    
    removeTrack(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        if (this.playlist[index].isLocal) {
            URL.revokeObjectURL(this.playlist[index].file);
        }
        
        this.playlist.splice(index, 1);
        
        if (index < this.currentTrackIndex) {
            this.currentTrackIndex--;
        } else if (index === this.currentTrackIndex && this.currentTrackIndex >= this.playlist.length) {
            this.currentTrackIndex = 0;
        }
        
        this.showPlaylist();
        this.updateCurrentTrackInfo();
    }
    
    async loadTrack(trackIndex) {
        if (trackIndex < 0 || trackIndex >= this.playlist.length) return false;
        
        try {
            this.stop();
            
            const track = this.playlist[trackIndex];
            console.log(`Loading track: ${track.title}`);
            
            this.currentAudio = new Audio(track.file);
            this.currentAudio.crossOrigin = 'anonymous';
            
            await new Promise((resolve, reject) => {
                this.currentAudio.addEventListener('loadedmetadata', resolve);
                this.currentAudio.addEventListener('error', reject);
            });
            
            this.duration = this.currentAudio.duration;
            this.currentTrackIndex = trackIndex;
            this.updateCurrentTrackInfo();
            
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            this.currentSource = this.audioContext.createMediaElementSource(this.currentAudio);
            this.currentSource.connect(this.analyser);
            
            // Connect analyser to gain node for visualizer data
            this.analyser.connect(this.gainNode);
            
            this.currentAudio.addEventListener('ended', () => this.nextTrack());
            this.currentAudio.addEventListener('timeupdate', () => this.updateProgress());
            
            return true;
            
        } catch (error) {
            console.error('Error loading track:', error);
            this.showError(`Failed to load: ${this.playlist[trackIndex]?.title || 'Unknown'}`);
            return false;
        }
    }
    
    async play() {
        if (!this.currentAudio) {
            if (this.playlist.length > 0) {
                const loaded = await this.loadTrack(this.currentTrackIndex);
                if (!loaded) return;
            } else {
                this.showError('No music files loaded');
                return;
            }
        }
        
        try {
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            await this.currentAudio.play();
            this.isPlaying = true;
            this.updatePlayPauseButton();
            this.startProgressUpdate();
            
           
            console.log(`Now playing: ${this.playlist[this.currentTrackIndex]?.title}`);
            
        } catch (error) {
            console.error('Error playing audio:', error);
            this.showError('Playback failed');
        }
    }
    
    pause() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.isPlaying = false;
            this.updatePlayPauseButton();
            this.stopProgressUpdate();
            
           
        }
    }
    
    stop() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentTime = 0;
        }
        
        if (this.currentSource) {
            this.currentSource.disconnect();
            this.currentSource = null;
        }
        
        this.isPlaying = false;
        this.updatePlayPauseButton();
        this.stopProgressUpdate();
    }
    
    async togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            await this.play();
        }
    }
    
    async playTrackByIndex(index) {
        if (index >= 0 && index < this.playlist.length) {
            this.stop();
            const loaded = await this.loadTrack(index);
            if (loaded) {
                await this.play();
            }
        }
    }
    
    async nextTrack() {
        if (this.playlist.length === 0) return;
        const nextIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        await this.playTrackByIndex(nextIndex);
    }
    
    async previousTrack() {
        if (this.playlist.length === 0) return;
        const prevIndex = this.currentTrackIndex > 0 
            ? this.currentTrackIndex - 1 
            : this.playlist.length - 1;
        await this.playTrackByIndex(prevIndex);
    }
    
    shufflePlaylist() {
        if (this.playlist.length <= 1) return;
        
        const currentTrack = this.playlist[this.currentTrackIndex];
        
        for (let i = this.playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.playlist[i], this.playlist[j]] = [this.playlist[j], this.playlist[i]];
        }
        
        this.currentTrackIndex = this.playlist.findIndex(track => track === currentTrack);
        this.updateCurrentTrackInfo();
        this.showPlaylist();
        
        const shuffleBtn = document.getElementById('shuffle-btn');
        if (shuffleBtn) {
            shuffleBtn.style.color = 'var(--primary-color)';
            setTimeout(() => {
                shuffleBtn.style.color = '';
            }, 1000);
        }
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.gainNode) {
            this.gainNode.gain.value = this.volume;
        }
        if (this.currentAudio) {
            this.currentAudio.volume = this.volume;
        }
    }
    
    seek(event) {
        if (!this.currentAudio || !this.duration) return;
        
        const rect = event.currentTarget.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const width = rect.width;
        const newTime = (clickX / width) * this.duration;
        
        this.currentAudio.currentTime = newTime;
        this.updateProgress();
    }
    
    updateCurrentTrackInfo(titleOverride, artistOverride) {
        const titleEl = document.getElementById('current-title');
        const artistEl = document.getElementById('current-artist');
        
        if (titleOverride && artistOverride) {
            if (titleEl) titleEl.textContent = titleOverride;
            if (artistEl) artistEl.textContent = artistOverride;
            return;
        }
        
        if (this.playlist.length === 0) {
            if (titleEl) titleEl.textContent = 'No music loaded';
            if (artistEl) artistEl.textContent = 'Add files to audio folder or upload files';
            return;
        }
        
        const currentTrack = this.playlist[this.currentTrackIndex] || this.playlist[0];
        
        if (titleEl) titleEl.textContent = currentTrack.title;
        if (artistEl) artistEl.textContent = currentTrack.artist;
    }
    
    showReadyToPlay() {
        const playIcon = document.querySelector('.play-icon');
        const musicToggle = document.getElementById('music-toggle');
        
        if (playIcon && musicToggle) {
            playIcon.style.animation = 'pulse 2s infinite';
            musicToggle.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.3)';
            
            if (this.playlist.length > 0) {
                this.updateCurrentTrackInfo(this.playlist[0].title + ' ♪', 'Click play to start music');
            }
        }
    }
    
    updatePlayPauseButton() {
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');
        
        if (playIcon && pauseIcon) {
            if (this.isPlaying) {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        }
    }
    
    startProgressUpdate() {
        this.stopProgressUpdate();
        this.progressUpdateInterval = setInterval(() => {
            this.updateProgress();
        }, 1000);
    }
    
    stopProgressUpdate() {
        if (this.progressUpdateInterval) {
            clearInterval(this.progressUpdateInterval);
            this.progressUpdateInterval = null;
        }
    }
    
    updateProgress() {
        if (!this.currentAudio) return;
        
        this.currentTime = this.currentAudio.currentTime;
        this.duration = this.currentAudio.duration;
        
        const progressFill = document.getElementById('progress-fill');
        const currentTimeDisplay = document.getElementById('current-time');
        const totalTimeDisplay = document.getElementById('total-time');
        
        if (this.duration > 0) {
            const progress = (this.currentTime / this.duration) * 100;
            if (progressFill) progressFill.style.width = `${progress}%`;
        }
        
        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = this.formatTime(this.currentTime);
        }
        
        if (totalTimeDisplay) {
            totalTimeDisplay.textContent = this.formatTime(this.duration || 0);
        }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    showError(message) {
        const titleEl = document.getElementById('current-title');
        const artistEl = document.getElementById('current-artist');
        
        if (titleEl) titleEl.textContent = 'Error';
        if (artistEl) artistEl.textContent = message;
        
        console.error('Web Audio Player Error:', message);
    }
    
    destroy() {
        this.stop();
        this.stopProgressUpdate();
        
        this.playlist.forEach(track => {
            if (track.isLocal) {
                URL.revokeObjectURL(track.file);
            }
        });
        
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Initialize the Web Audio Player
let webAudioPlayer;

const initWebAudioPlayer = () => {
    console.log('Creating Web Audio Player instance...');
    webAudioPlayer = new WebAudioPlayer();
};

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (webAudioPlayer) {
        webAudioPlayer.destroy();
    }
});