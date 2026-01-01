class SoundEffects {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private spinTimeoutId: any = null;

  private init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted() {
    return this.isMuted;
  }

  /**
   * Toca um som de clique.
   * @param freqStart Frequência inicial (Hz)
   * @param freqEnd Frequência final (Hz)
   * @param gainVal Volume máximo (0-1)
   */
  public playClick(freqStart: number = 150, freqEnd: number = 40, gainVal: number = 0.8) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle'; 
    osc.frequency.setValueAtTime(freqStart, t);
    osc.frequency.exponentialRampToValueAtTime(freqEnd, t + 0.08);

    gain.gain.setValueAtTime(gainVal, t); 
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playWin() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const t = this.ctx.currentTime;
    
    // Arpejo de acorde maior (C Major)
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = t + i * 0.08;
      const duration = 0.8;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  public playSpinSound(duration: number) {
    if (this.isMuted) return;
    this.stopSpinSound(); // limpa anterior se houver
    this.init();
    
    let elapsed = 0;
    
    // Simula a desaceleração física dos cliques
    const nextTick = () => {
      if (elapsed >= duration) return;
      
      // Varia levemente o tom para dar naturalidade
      const randomFreqOffset = Math.random() * 20 - 10;
      this.playClick(150 + randomFreqOffset, 40, 0.8);
      
      // Calcula o próximo intervalo (delay)
      // p vai de 0 a 1 (progresso)
      const p = elapsed / duration;
      
      // Função quadrática para aumentar o intervalo entre os cliques
      const currentInterval = 50 + (p * p * 500);
      
      elapsed += currentInterval;
      this.spinTimeoutId = setTimeout(nextTick, currentInterval);
    };
    
    nextTick();
  }

  public stopSpinSound() {
    if (this.spinTimeoutId) {
      clearTimeout(this.spinTimeoutId);
      this.spinTimeoutId = null;
    }
  }
}

export const soundManager = new SoundEffects();