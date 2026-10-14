/*
 * Life on the bay, shown only at night once every word has faded: a small boat with a lit lantern drifts by.
 * RadyoHarmoni.Life(canvas).draw(now, { show, horizon }) — horizon is in CSS pixels from the top.
 */
(function () {
  'use strict';
  const R = window.RadyoHarmoni;

  class Life {
    constructor(canvas) {
      this.cv = canvas;
      this.cx = canvas.getContext('2d');
      this.alpha = 0;
      this.boat = null;
      this.resize();
      addEventListener('resize', () => this.resize());
    }

    resize() {
      this.dpr = Math.min(2, devicePixelRatio || 1);
      this.w = this.cv.clientWidth; this.h = this.cv.clientHeight;
      this.cv.width = this.w * this.dpr; this.cv.height = this.h * this.dpr;
    }

    drawBoat(now, horizon) {
      if (!this.boat) this.boat = { start: now, dur: 140000 };
      const k = ((now - this.boat.start) / this.boat.dur) % 1;
      const scale = Math.max(.75, Math.min(1.4, this.w / 1300));
      const x = -60 + k * (this.w + 120);
      const y = horizon + Math.max(14, (this.h - horizon) * .1) + Math.sin(now / 900) * 1.2;
      const c = this.cx;
      // the lantern's glow on the water
      const ly = y - 15 * scale;
      const refl = c.createLinearGradient(0, y, 0, y + 70 * scale);
      refl.addColorStop(0, 'rgba(255,200,120,.45)'); refl.addColorStop(1, 'rgba(255,200,120,0)');
      c.fillStyle = refl;
      for (let i = 0; i < 9; i++) {
        const yy = y + 3 + i * 7 * scale, wob = Math.sin(now / 400 + i * 1.7) * 2.5 * scale;
        c.fillRect(x + 6 * scale + wob - (1.5 + i * .25) * scale, yy, (3 + i * .5) * scale, 3 * scale);
      }
      const glow = c.createRadialGradient(x + 7 * scale, ly, 0, x + 7 * scale, ly, 26 * scale);
      glow.addColorStop(0, 'rgba(255,214,140,.65)'); glow.addColorStop(1, 'rgba(255,190,110,0)');
      c.fillStyle = glow; c.beginPath(); c.arc(x + 7 * scale, ly, 26 * scale, 0, 6.283); c.fill();
      // hull, cabin, mast
      c.save(); c.translate(x, y); c.scale(scale, scale); c.rotate(Math.sin(now / 1300) * .025);
      c.fillStyle = '#070b26';
      c.beginPath(); c.moveTo(-17, -4); c.lineTo(19, -4); c.lineTo(13, 2); c.lineTo(-13, 2); c.closePath(); c.fill();
      c.fillRect(-6, -10, 9, 6);
      c.fillRect(-1, -24, 1.2, 14);
      c.fillStyle = '#ffd690'; c.beginPath(); c.arc(7, -15, 1.9, 0, 6.283); c.fill();
      c.restore();
    }

    draw(now, st) {
      const target = st.show ? 1 : 0;
      this.alpha += (target - this.alpha) * .02;
      const c = this.cx;
      c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      c.clearRect(0, 0, this.w, this.h);
      if (this.alpha < .01) { this.boat = null; return; }
      c.globalAlpha = this.alpha;
      this.drawBoat(now, st.horizon);
      c.globalAlpha = 1;
    }
  }

  R.Life = Life;
})();
