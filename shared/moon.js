/*
 * The moon over the sea, from Moonwater, as a component any section can hold.
 *
 * const m = new RadyoHarmoni.MoonSea(canvas, { phase: .5 });  m.to(.5, 2600) eases the phase (0 new, .5 full).
 * Draws only while on screen. Colours can be set per page: { sky: [r,g,b], horizon: [...], sea: [...] } in 0..1.
 */
(function () {
  'use strict';
  const R = window.RadyoHarmoni;

  const FS = `
precision highp float;
uniform vec2 r;
uniform float t, ph, lv, mx, my, mr, hz;
uniform vec3 skyTop, skyHz, sea;
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), u.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), u.x), u.y); }
void main(){
  vec2 uv = gl_FragCoord.xy / r;
  float asp = r.x / r.y;
  vec2 p = vec2((uv.x - .5) * asp, uv.y);
  vec2 m = vec2(mx, my);
  float illum = (1. - cos(ph * 6.2831853)) * .5;
  float glow = .15 + .85 * illum;
  vec3 col;
  if (uv.y > hz) {
    float k = (uv.y - hz) / (1. - hz);
    col = mix(skyHz, skyTop, pow(k, .55));
    float d = length(p - m);
    col += vec3(.55, .64, .68) * glow * .32 * exp(-d * 7.);
    col += vec3(.35, .45, .5) * glow * .10 * exp(-d * 1.8);
    vec2 g = floor(p * 220.);
    float s = h21(g);
    if (s > .9965) {
      vec2 c = (g + .5) / 220.;
      float star = smoothstep(.0045, 0., length(p - c));
      col += vec3(.8, .86, .95) * star * (.45 + .35 * sin(t * 1.5 + s * 90.)) * smoothstep(.05, .35, k) * (1. - glow * .55);
    }
    if (d < mr * 1.05) {
      vec2 q = (p - m) / mr;
      float z = sqrt(max(0., 1. - dot(q, q)));
      float th = ph * 6.2831853;
      vec3 L = vec3(sin(th), 0., -cos(th));
      float lit = smoothstep(-.05, .08, dot(vec3(q, z), L));
      float n2 = noise(q * 2.3 + 3.) * .65 + noise(q * 5.1 + 11.) * .35;
      float tex = .95 + .05 * noise(q * 9. + 7.) - .10 * smoothstep(.48, .78, n2);
      vec3 mc = mix(skyTop * .9 + vec3(.03, .04, .05) * tex, vec3(.95, .96, .93) * tex, lit);
      col = mix(col, mc, smoothstep(1.02, .97, length(q)));
    }
    float isl = max(0., noise(vec2(p.x * 2.6 + 4., 1.)) - .5) * .11 + max(0., noise(vec2(p.x * 7. + 2., 3.)) - .6) * .04;
    if (uv.y < hz + isl) col = mix(sea * .5, skyHz, .25);
  } else {
    float depth = hz - uv.y;
    float z = .05 / (depth + .003);
    vec2 w = vec2(p.x * z, z);
    vec3 water = mix(sea, sea * .2, smoothstep(0., .38, depth));
    water += skyHz * .35 * (1. - smoothstep(0., .08, depth));
    float sp = noise(w * vec2(3.2, 9.) + vec2(0., t * .55)) * noise(w * vec2(7.5, 16.) - vec2(t * .25, t * .8));
    float glit = smoothstep(.18, .5, sp);
    float dx = p.x - m.x + (noise(w * vec2(.8, 2.) + t * .2) - .5) * .05;
    float spread = .012 + depth * .32;
    float path = exp(-dx * dx / (spread * spread));
    water += vec3(.88, .92, .92) * glow * path * (.05 + glit * .95) * (1. - smoothstep(0., .34, depth));
    water += vec3(.3, .45, .5) * glow * .05 * exp(-abs(dx) * 3.) * (1. - depth * 2.);
    vec2 rc = vec2(m.x, hz - .16);
    float rr = length((p - rc) * vec2(1., 3.2));
    float ring = sin(rr * 70. - t * 1.6) * exp(-rr * 3.5) * (.25 + lv * 1.6);
    water += vec3(.5, .72, .74) * max(0., ring) * .05;
    col = water;
  }
  gl_FragColor = vec4(col, 1.);
}`;

  // Moonwater's own colours; pages may pass their own night.
  const DEFAULTS = { sky: [.012, .035, .065], horizon: [.07, .15, .21], sea: [.05, .11, .15], moonX: 0, moonY: .72, moonR: .085, horizonY: .4 };

  class MoonSea {
    constructor(canvas, opts = {}) {
      this.cv = canvas;
      this.o = { ...DEFAULTS, ...opts };
      this.phase = opts.phase ?? R.moon().phase;
      this.level = opts.level || (() => 0);
      this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const gl = this.gl = canvas.getContext('webgl', { antialias: false, powerPreference: 'low-power' });
      if (!gl) { canvas.classList.add('no-gl'); return; }
      const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
      const prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { this.gl = null; canvas.classList.add('no-gl'); return; }
      gl.useProgram(prog);
      const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      this.U = {};
      ['r', 't', 'ph', 'lv', 'mx', 'my', 'mr', 'hz', 'skyTop', 'skyHz', 'sea'].forEach(n => this.U[n] = gl.getUniformLocation(prog, n));
      this.size = () => {
        const s = Math.min(1.5, devicePixelRatio || 1);
        canvas.width = canvas.clientWidth * s; canvas.height = canvas.clientHeight * s;
        gl.viewport(0, 0, canvas.width, canvas.height);
      };
      addEventListener('resize', this.size); this.size();
      // One still frame up front, so the window is never blank before it scrolls into view.
      this.draw(0);
      this.visible = false;
      this.onShow = opts.onShow;
      new IntersectionObserver(e => {
        const was = this.visible;
        this.visible = e[0].isIntersecting;
        if (this.visible && !was) { if (this.onShow) { this.onShow(this); this.onShow = null; } requestAnimationFrame(this.loop); }
      }, { threshold: .25 }).observe(canvas);
      this.loop = now => {
        if (!this.visible) return;
        this.step(now);
        this.draw(now);
        requestAnimationFrame(this.loop);
      };
    }

    // Eases the shown phase to `target` over `ms`, always moving forward through the month.
    to(target, ms = 2400) {
      let from = this.phase;
      if (target < from) target += 1;
      this.anim = { from, target, t0: performance.now(), ms: this.reduce ? 1 : ms };
    }

    step(now) {
      const a = this.anim;
      if (!a) return;
      const k = Math.min(1, (now - a.t0) / a.ms);
      const e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      this.phase = (a.from + (a.target - a.from) * e) % 1;
      if (k === 1) this.anim = null;
    }

    draw(now) {
      const gl = this.gl, U = this.U, o = this.o, cv = this.cv;
      if (!gl) return;
      gl.uniform2f(U.r, cv.width, cv.height);
      gl.uniform1f(U.t, this.reduce ? 0 : now / 1000);
      gl.uniform1f(U.ph, this.phase);
      gl.uniform1f(U.lv, this.level());
      gl.uniform1f(U.mx, o.moonX);
      gl.uniform1f(U.my, o.moonY);
      gl.uniform1f(U.mr, o.moonR);
      gl.uniform1f(U.hz, o.horizonY);
      gl.uniform3fv(U.skyTop, o.sky); gl.uniform3fv(U.skyHz, o.horizon); gl.uniform3fv(U.sea, o.sea);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  }

  // A flat moon for small places (a dial, a list): lit half disc plus an elliptical terminator.
  function moonGlyph(phase, { r = 26, lit = '#fbfcfa', dark = '#cbd4cd', rim = 'none' } = {}) {
    const c = r + 1, k = Math.cos(phase * 2 * Math.PI), waxing = phase < .5;
    const rx = Math.abs(k) * r;
    const viaRight = (waxing && k > 0) || (!waxing && k < 0);
    return `<circle cx="${c}" cy="${c}" r="${r}" fill="${dark}"/>
      <path d="M${c} ${c - r} A${r} ${r} 0 0 ${waxing ? 1 : 0} ${c} ${c + r} A${rx} ${r} 0 0 ${viaRight ? 0 : 1} ${c} ${c - r}Z" fill="${lit}"/>
      <circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${rim}" stroke-width="1"/>`;
  }

  R.MoonSea = MoonSea;
  R.moonGlyph = moonGlyph;
})();
