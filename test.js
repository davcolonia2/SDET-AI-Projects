// Standalone Music Visualizer
// Add this file to your project and include it in your HTML

class MusicVisualizer {
    constructor() {
        this.isActive = false;
        this.animationId = null;
        this.init();
    }
    
    init() {
        console.log('Initializing Music Visualizer...');
        this.createVisualizer();
        this.addStyles();
        this.startMonitoring();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.id = 'visualizer-styles';
        style.textContent = `
            @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                25% { background-position: 100% 50%; }
                50% { background-position: 100% 100%; }
                75% { background-position: 50% 100%; }
                100% { background-position: 0% 50%; }
            }
            
            @keyframes pulse {
                0% { 
                    transform: translate(-50%, -50%) scale(0.5);
                    opacity: 0.8;
                }
                50% { 
                    transform: translate(-50%, -50%) scale(1.5);
                    opacity: 0.4;
                }
                100% { 
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }
            
            @keyframes float {
                0%, 100% { 
                    transform: translateY(0px) rotate(0deg);
                    opacity: 0.3;
                }
                25% { 
                    transform: translateY(-20px) rotate(90deg);
                    opacity: 0.8;
                }
                50% { 
                    transform: translateY(-10px) rotate(180deg);
                    opacity: 1;
                }
                75% { 
                    transform: translateY(-30px) rotate(270deg);
                    opacity: 0.6;
                }
            }
            
            @keyframes frequencyPulse {
                0%, 100% { 
                    transform: scaleY(0.2);
                    opacity: 0.5;
                }
                25% { 
                    transform: scaleY(1.2);
                    opacity: 0.9;
                }
                50% { 
                    transform: scaleY(0.6);
                    opacity: 0.7;
                }
                75% { 
                    transform: scaleY(1.8);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    createVisualizer() {
        // Remove existing visualizer if present
        const existing = document.getElementById('music-visualizer');
        if (existing) existing.remove();
        
        // Create main container
        const visualizer = document.createElement('div');
        visualizer.id = 'music-visualizer';
        visualizer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -1;
            pointer-events: none;
            opacity: 0.1;
            transition: opacity 0.5s ease;
            background: linear-gradient(45deg, 
                rgba(37, 99, 235, 0.1), 
                rgba(59, 130, 246, 0.1), 
                rgba(147, 197, 253, 0.1),
                rgba(37, 99, 235, 0.1));
            background-size: 400% 400%;
            animation: gradientShift 8s ease-in-out infinite;
        `;
        
        // Add central pulse effects
        this.addPulseEffects(visualizer);
        
        // Add floating particles
        this.addParticles(visualizer);
        
        // Add frequency bars
        this.addFrequencyBars(visualizer);
        
        // Insert at beginning of body
        document.body.insertBefore(visualizer, document.body.firstChild);
        
        console.log('Music visualizer created');
    }
    
    addPulseEffects(container) {
        // Primary pulse
        const pulse1 = document.createElement('div');
        pulse1.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 200px;
            height: 200px;
            border: 2px solid rgba(147, 197, 253, 0.3);
            border-radius: 50%;
            animation: pulse 4s ease-in-out infinite;
        `;
        container.appendChild(pulse1);
        
        // Secondary pulse
        const pulse2 = document.createElement('div');
        pulse2.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 300px;
            height: 300px;
            border: 2px solid rgba(59, 130, 246, 0.2);
            border-radius: 50%;
            animation: pulse 4s ease-in-out infinite;
            animation-delay: 2s;
        `;
        container.appendChild(pulse2);
        
        // Tertiary pulse
        const pulse3 = document.createElement('div');
        pulse3.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 150px;
            height: 150px;
            border: 2px solid rgba(37, 99, 235, 0.4);
            border-radius: 50%;
            animation: pulse 4s ease-in-out infinite;
            animation-delay: 1s;
        `;
        container.appendChild(pulse3);
    }
    
    addParticles(container) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(147, 197, 253, ${Math.random() * 0.5 + 0.3});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 6 + 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 6}s;
            `;
            container.appendChild(particle);
        }
    }
    
    addFrequencyBars(container) {
        const barsContainer = document.createElement('div');
        barsContainer.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 120px;
            display: flex;
            align-items: end;
            justify-content: space-around;
            opacity: 0.4;
        `;
        
        for (let i = 0; i < 50; i++) {
            const bar = document.createElement('div');
            bar.style.cssText = `
                width: 2px;
                height: ${Math.random() * 60 + 10}px;
                background: linear-gradient(to top, 
                    rgba(37, 99, 235, 0.8), 
                    rgba(59, 130, 246, 0.6), 
                    rgba(147, 197, 253, 0.9));
                border-radius: 1px 1px 0 0;
                animation: frequencyPulse ${Math.random() * 2 + 1}s ease-in-out infinite;
                animation-delay: ${i * 0.02}s;
                transform-origin: bottom;
            `;
            barsContainer.appendChild(bar);
        }
        
        container.appendChild(barsContainer);
    }
    
    startMonitoring() {
        // Check for audio playing every second
        setInterval(() => {
            this.checkAudioState();
        }, 1000);
    }
    
    checkAudioState() {
        // Check if any audio elements are playing
        const audioElements = document.querySelectorAll('audio');
        let isPlaying = false;
        
        audioElements.forEach(audio => {
            if (!audio.paused && !audio.ended) {
                isPlaying = true;
            }
        });
        
        // Check Web Audio API if available
        if (window.webAudioPlayer && window.webAudioPlayer.isPlaying) {
            isPlaying = true;
        }
        
        this.setVisualizerState(isPlaying);
    }
    
    setVisualizerState(isActive) {
        const visualizer = document.getElementById('music-visualizer');
        if (!visualizer) return;
        
        if (isActive && !this.isActive) {
            // Music started playing
            this.isActive = true;
            visualizer.style.opacity = '0.7';
            visualizer.style.animationDuration = '2s';
            console.log('Visualizer activated - should be highly visible now');
        } else if (!isActive && this.isActive) {
            // Music stopped
            this.isActive = false;
            visualizer.style.opacity = '0.5';
            visualizer.style.animationDuration = '4s';
            console.log('Visualizer deactivated');
        }
    }
    
    destroy() {
        const visualizer = document.getElementById('music-visualizer');
        const styles = document.getElementById('visualizer-styles');
        
        if (visualizer) visualizer.remove();
        if (styles) styles.remove();
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        console.log('Visualizer destroyed');
    }
}

// Auto-initialize when the script loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a moment for other scripts to load
    setTimeout(() => {
        if (!window.musicVisualizer) {
            window.musicVisualizer = new MusicVisualizer();
        }
    }, 2000);
});

// Make it available globally
window.MusicVisualizer = MusicVisualizer;