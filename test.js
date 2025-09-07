// test.visualizer.final.js — audio-reactive rainbow with light/dark tuning
(() => {
  class MusicVisualizer {
    constructor() {
      this.el = null;
      this.animationId = null;
      this.isActive = false;
      this.hue = 0;
      this.energySmoothed = 0;
      this.buf = null;
      this.mode = 'auto'; // 'auto' | 'audio'
      this.theme = 'light'; // 'light' | 'dark'
      this.baseOpacity = 0.3;
      this.maxBoost = 0.45;

      this._injectStyles();
      this._ensureOverlay();
      this._applyTheme();    // set blend/opacity based on theme
      this._watchTheme();    // respond to theme changes
      this._monitor();       // observe player state
      window.musicVisualizer = this; // expose for console debugging
      console.log('🎨 Visualizer ready');
    }

    _injectStyles() {
      if (document.getElementById('visualizer-styles')) return;
      const style = document.createElement('style');
      style.id = 'visualizer-styles';
      style.textContent = `
        #music-visualizer{
          position: fixed;
          inset: 0;
          z-index: 900; /* below navbar/player, above page */
          pointer-events: none;
          opacity: .22;
          transition: opacity .3s ease, filter .3s ease, background-position 1s ease;
          background: linear-gradient(
            120deg,
            hsl(var(--h,0) 90% 60% / .26),
            hsl(calc(var(--h,0) + 90) 90% 60% / .26),
            hsl(calc(var(--h,0) + 180) 90% 60% / .26),
            hsl(calc(var(--h,0) + 270) 90% 60% / .26)
          );
          background-size: 220% 220%;
          /* mix-blend-mode set dynamically per theme */
        }
      `;
      document.head.appendChild(style);
    }

    _ensureOverlay() {
      this.el = document.getElementById('music-visualizer');
      if (!this.el) {
        this.el = document.createElement('div');
        this.el.id = 'music-visualizer';
        document.body.insertBefore(this.el, document.body.firstChild);
      }
    }

    _detectTheme() {
      // Consider app classes or prefers-color-scheme
      const root = document.documentElement;
      const explicitDark = root.classList.contains('dark') || document.body.classList.contains('dark') ||
                           root.getAttribute('data-theme') === 'dark' || document.body.getAttribute('data-theme') === 'dark';
      if (explicitDark) return 'dark';
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
      return 'light';
    }

    _applyTheme() {
      this.theme = this._detectTheme();
      if (this.theme === 'dark') {
        this.el.style.mixBlendMode = 'color'; // hue-shift dark UIs nicely
        this.baseOpacity = 0.28;
        this.maxBoost = 0.40;
      } else {
        this.el.style.mixBlendMode = 'overlay'; // punchier on light backgrounds
        this.baseOpacity = 0.42;
        this.maxBoost = 0.48;
      }
    }

    _watchTheme() {
      if (window.matchMedia) {
        const mm = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = () => this._applyTheme();
        if (mm.addEventListener) mm.addEventListener('change', handler);
        else if (mm.addListener) mm.addListener(handler);
      }
      const observer = new MutationObserver(() => this._applyTheme());
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
      observer.observe(document.body,           { attributes: true, attributeFilter: ['class', 'data-theme'] });
    }

    _monitor() {
      const tick = () => {
        const p = window.webAudioPlayer;
        const playing = !!p?.isPlaying;
        const analyser = p?.analyser || null;
        if (playing && analyser) {
          if (!this.isActive) this.start();
        } else {
          if (this.isActive) this.stop();
          // If not playing OR no analyser, keep gentle fallback sweep visible
          if (!this.animationId) this._startFallbackLoop();
        }
      };
      // Run now and every 350ms
      tick();
      this._mon = setInterval(tick, 350);
    }

    _ensureBuffer(analyser) {
      if (!this.buf || this.buf.length !== analyser.frequencyBinCount) {
        this.buf = new Uint8Array(analyser.frequencyBinCount);
      }
    }

    // --- Audio-reactive loop
    start() {
      if (this.isActive) return;
      const p = window.webAudioPlayer;
      const analyser = p?.analyser;
      if (!analyser || !this.el) return;
      p.audioContext?.resume?.();
      this.mode = 'audio';
      this.isActive = true;
      cancelAnimationFrame(this.animationId);
      this.animationId = null;

      const loop = () => {
        if (!this.isActive) return;
        this._ensureBuffer(analyser);
        analyser.getByteFrequencyData(this.buf);
        let sum = 0;
        for (let i = 0; i < this.buf.length; i++) sum += this.buf[i];
        const energy = sum / (this.buf.length * 255); // 0..1

        // Smooth & update hue
        this.energySmoothed = this.energySmoothed * 0.85 + energy * 0.15;
        this.hue = (this.hue + 0.5 + this.energySmoothed * 0.8) % 360;

        // Apply CSS
        this.el.style.setProperty('--h', this.hue.toFixed(1));
        const op = this.baseOpacity + this.energySmoothed * this.maxBoost;
        this.el.style.opacity = op.toFixed(3);
        this.el.style.filter  = `saturate(${1 + this.energySmoothed * 1.4}) brightness(${0.95 + this.energySmoothed * 0.2})`;
        const pos = (Date.now() / 45) % 220;
        this.el.style.backgroundPosition = `${pos}% ${220 - pos}%`;

        this.animationId = requestAnimationFrame(loop);
      };
      this.animationId = requestAnimationFrame(loop);
    }

    stop() {
      this.isActive = false;
      if (this.animationId) cancelAnimationFrame(this.animationId);
      this.animationId = null;
      this.el.style.opacity = String(this.baseOpacity);
      this.el.style.filter = 'none';
      // Keep fallback sweep going so the page still has motion in idle
      if (!this.__fallbackRAF) this._startFallbackLoop();
    }

    // --- Fallback rainbow sweep (no analyser needed)
    _startFallbackLoop() {
      cancelAnimationFrame(this.__fallbackRAF || 0);
      let h = Number(this.el.style.getPropertyValue('--h')) || 0;
      const tick = () => {
        // Slow steady sweep; more visible on light UIs thanks to overlay blend
        h = (h + 0.6) % 360;
        this.el.style.setProperty('--h', h.toFixed(1));
        // idle opacity based on theme
        this.el.style.opacity = String(this.baseOpacity);
        const pos = (Date.now() / 55) % 220;
        this.el.style.backgroundPosition = `${pos}% ${220 - pos}%`;
        this.__fallbackRAF = requestAnimationFrame(tick);
      };
      this.__fallbackRAF = requestAnimationFrame(tick);
    }
  }

  // Initialize immediately
  new MusicVisualizer();
})();