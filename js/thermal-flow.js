/**
 * VINDSOL - Thermal Flow Heat Engine Canvas Visualizer
 * Color Palette Aligned with User Specification
 */

class ThermalFlowEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    // Telemetry State
    this.ambientTemp = 25; // °C
    this.waterTemp = 55;   // °C
    this.cop = 4.85;
    
    this.particles = [];
    this.animFrame = null;
    this.isRunning = true;
    
    this.init();
  }
  
  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    const ambientSlider = document.getElementById('ambientSlider');
    const waterSlider = document.getElementById('waterSlider');
    const ambientVal = document.getElementById('ambientVal');
    const waterVal = document.getElementById('waterVal');
    const copVal = document.getElementById('copScore');
    const savingsVal = document.getElementById('savingsPct');
    
    if (ambientSlider && waterSlider) {
      ambientSlider.addEventListener('input', (e) => {
        this.ambientTemp = parseFloat(e.target.value);
        if (ambientVal) ambientVal.textContent = `${this.ambientTemp}°C`;
        this.updateTelemetry(copVal, savingsVal);
      });
      
      waterSlider.addEventListener('input', (e) => {
        this.waterTemp = parseFloat(e.target.value);
        if (waterVal) waterVal.textContent = `${this.waterTemp}°C`;
        this.updateTelemetry(copVal, savingsVal);
      });
    }
    
    this.createParticles();
    this.animate();
  }
  
  updateTelemetry(copElement, savingsElement) {
    const deltaT = (this.waterTemp - this.ambientTemp);
    let calculatedCOP = (300 / (deltaT + 15)) * 0.75 + 1.2;
    calculatedCOP = Math.max(3.1, Math.min(6.8, calculatedCOP));
    
    this.cop = calculatedCOP.toFixed(2);
    const savings = (((this.cop - 1) / this.cop) * 100).toFixed(1);
    
    if (copElement) copElement.textContent = `${this.cop}x`;
    if (savingsElement) savingsElement.textContent = `${savings}%`;
  }
  
  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }
  
  createParticles() {
    this.particles = [];
    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        progress: Math.random(),
        speed: 0.0035 + Math.random() * 0.002,
        size: 3.5 + Math.random() * 3.5
      });
    }
  }
  
  animate() {
    if (!this.ctx) return;
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.drawStaticBlueprint();
      return;
    }
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawCircuitPipes();
    this.drawNodes();
    this.updateAndDrawParticles();
    
    this.animFrame = requestAnimationFrame(() => this.animate());
  }
  
  drawCircuitPipes() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    const padX = 60;
    const padY = 50;
    
    // Technical Grid overlay
    this.ctx.strokeStyle = 'rgba(61, 125, 255, 0.12)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, h);
      this.ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(w, y);
      this.ctx.stroke();
    }
    
    // Top Pipe (Evaporator to Compressor): Pale Cyan (#8FE3FF)
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#8FE3FF';
    this.ctx.lineWidth = 4.5;
    this.ctx.shadowColor = 'rgba(143, 227, 255, 0.7)';
    this.ctx.shadowBlur = 10;
    this.ctx.moveTo(padX, h / 2);
    this.ctx.lineTo(w / 2, padY);
    this.ctx.stroke();
    
    // Right Pipe (Compressor to Condenser): Electric Blue (#3D7DFF)
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#3D7DFF';
    this.ctx.shadowColor = 'rgba(61, 125, 255, 0.8)';
    this.ctx.shadowBlur = 12;
    this.ctx.moveTo(w / 2, padY);
    this.ctx.lineTo(w - padX, h / 2);
    this.ctx.stroke();
    
    // Bottom Pipe (Condenser to Expansion Valve): Steel Cyan (#60A5FA)
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#60A5FA';
    this.ctx.shadowColor = 'rgba(96, 165, 250, 0.6)';
    this.ctx.shadowBlur = 10;
    this.ctx.moveTo(w - padX, h / 2);
    this.ctx.lineTo(w / 2, h - padY);
    this.ctx.stroke();

    // Left Pipe (Expansion Valve back to Evaporator): Cool Steel (#9CA3AB)
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#9CA3AB';
    this.ctx.shadowColor = 'rgba(156, 163, 171, 0.6)';
    this.ctx.shadowBlur = 10;
    this.ctx.moveTo(w / 2, h - padY);
    this.ctx.lineTo(padX, h / 2);
    this.ctx.stroke();
    
    this.ctx.shadowBlur = 0;
  }
  
  drawNodes() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const padX = 60;
    const padY = 50;
    
    const nodes = [
      { x: padX, y: h / 2, label: 'EVAPORATOR', sub: 'Air Heat Absorber', color: '#8FE3FF' },
      { x: w / 2, y: padY, label: 'COMPRESSOR', sub: 'Rotary / Scroll Stage', color: '#3D7DFF' },
      { x: w - padX, y: h / 2, label: 'CONDENSER', sub: 'Hot Water Exchanger', color: '#60A5FA' },
      { x: w / 2, y: h - padY, label: 'EEV VALVE', sub: 'Saginomya Expansion', color: '#9CA3AB' }
    ];
    
    nodes.forEach(n => {
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, 18, 0, Math.PI * 2);
      this.ctx.fillStyle = '#15181C';
      this.ctx.strokeStyle = n.color;
      this.ctx.lineWidth = 2.5;
      this.ctx.shadowColor = n.color;
      this.ctx.shadowBlur = 10;
      this.ctx.fill();
      this.ctx.stroke();
      
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, 7, 0, Math.PI * 2);
      this.ctx.fillStyle = n.color;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
      
      this.ctx.font = 'bold 12px "JetBrains Mono", monospace';
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.textAlign = 'center';
      
      let offsetY = n.y < h / 2 ? -24 : (n.y > h / 2 ? 32 : -24);
      this.ctx.fillText(n.label, n.x, n.y + offsetY);
      
      this.ctx.font = '10px "JetBrains Mono", monospace';
      this.ctx.fillStyle = '#9CA3AB';
      this.ctx.fillText(n.sub, n.x, n.y + offsetY + 13);
    });
  }
  
  updateAndDrawParticles() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const padX = 60;
    const padY = 50;
    
    const getPos = (p) => {
      if (p <= 0.25) {
        const t = p / 0.25;
        return {
          x: padX + t * (w / 2 - padX),
          y: h / 2 + t * (padY - h / 2),
          color: '#8FE3FF'
        };
      } else if (p <= 0.5) {
        const t = (p - 0.25) / 0.25;
        return {
          x: w / 2 + t * (w - padX - w / 2),
          y: padY + t * (h / 2 - padY),
          color: '#3D7DFF'
        };
      } else if (p <= 0.75) {
        const t = (p - 0.5) / 0.25;
        return {
          x: w - padX + t * (w / 2 - (w - padX)),
          y: h / 2 + t * (h - padY - h / 2),
          color: '#60A5FA'
        };
      } else {
        const t = (p - 0.75) / 0.25;
        return {
          x: w / 2 + t * (padX - w / 2),
          y: h - padY + t * (h / 2 - (h - padY)),
          color: '#9CA3AB'
        };
      }
    };
    
    this.particles.forEach(pt => {
      pt.progress += pt.speed;
      if (pt.progress >= 1) pt.progress = 0;
      
      const pos = getPos(pt.progress);
      
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, pt.size, 0, Math.PI * 2);
      this.ctx.fillStyle = pos.color;
      this.ctx.shadowColor = pos.color;
      this.ctx.shadowBlur = 10;
      this.ctx.fill();
    });
    
    this.ctx.shadowBlur = 0;
  }
  
  drawStaticBlueprint() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawCircuitPipes();
    this.drawNodes();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ThermalFlowEngine('thermalCanvas');
});
