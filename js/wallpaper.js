const Wallpaper = {
  witchType: null,

  init(witchType) {
    this.witchType = witchType || App.witchType;
    this.render();
  },

  render() {
    const container = document.getElementById('wallpaperContainer');

    if (!this.witchType) {
      container.innerHTML = `
        
        <div class="tarot-header">
          <h2 class="tarot-title typewriter-text-cn">能量疗愈壁纸</h2>
          <p class="tarot-subtitle">先完成女巫类型测试，再来定制你的专属壁纸</p>
        </div>
        <div class="engraved-divider"></div>
        <div style="text-align:center;margin-top:var(--space-xl)">
          <button class="btn btn-primary" onclick="navigateTo('test1')">去做能量测试</button>
        </div>
      `;
      return;
    }

    const witch = WITCH_TYPES[this.witchType];

    container.innerHTML = `
      
      <div class="tarot-header">
        <h2 class="tarot-title typewriter-text-cn">能量疗愈壁纸</h2>
        <p class="tarot-subtitle">基于你的${witch.name}能量定制</p>
      </div>
      <div class="engraved-divider"></div>
      <div class="wallpaper-preview-wrapper">
        <canvas id="wallpaperCanvas" width="1080" height="1920"></canvas>
        <div class="wallpaper-preview-frame engraved-border">
          <img id="wallpaperPreview" src="" alt="壁纸预览" />
        </div>
      </div>
      <div class="result-actions">
        <button class="btn btn-primary" onclick="Wallpaper.download()">保存到相册</button>
        <button class="btn" onclick="Wallpaper.share()">分享</button>
      </div>
      <p class="wallpaper-hint">长按预览图也可以保存</p>
    `;

    requestAnimationFrame(() => this.generate());
  },

  generate() {
    const canvas = document.getElementById('wallpaperCanvas');
    const ctx = canvas.getContext('2d');
    const witch = WITCH_TYPES[this.witchType];
    const w = canvas.width;
    const h = canvas.height;

    // 背景
    const bgGrad = ctx.createRadialGradient(w/2, h*0.35, 0, w/2, h*0.6, h*0.9);
    bgGrad.addColorStop(0, '#1A1A2E');
    bgGrad.addColorStop(0.5, '#0D0D1A');
    bgGrad.addColorStop(1, '#06060F');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 星星
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h * 0.8;
      const r = Math.random() * 1.5 + 0.3;
      const alpha = Math.random() * 0.5 + 0.1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,213,183,${alpha})`;
      ctx.fill();
    }

    // 月亮
    const moonX = w * 0.5;
    const moonY = h * 0.28;
    const moonR = 100;
    const moonGrad = ctx.createRadialGradient(moonX - 20, moonY - 20, moonR * 0.1, moonX, moonY, moonR);
    moonGrad.addColorStop(0, 'rgba(232,213,183,0.5)');
    moonGrad.addColorStop(0.4, 'rgba(232,213,183,0.15)');
    moonGrad.addColorStop(1, 'rgba(232,213,183,0)');
    ctx.fillStyle = moonGrad;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    ctx.fill();

    // 元素符号（中央大符号）
    ctx.fillStyle = witch.color;
    ctx.globalAlpha = 0.2;
    ctx.font = '200px serif';
    ctx.textAlign = 'center';
    ctx.fillText(witch.elementIcon, w/2, h*0.43);
    ctx.globalAlpha = 1;

    // 女巫类型名称
    ctx.fillStyle = witch.color;
    ctx.globalAlpha = 0.8;
    ctx.font = 'bold 64px "Songti SC", "Noto Serif SC", serif';
    ctx.textAlign = 'center';
    ctx.fillText(witch.name, w/2, h*0.56);

    // 代表词
    ctx.fillStyle = '#E8D5B7';
    ctx.globalAlpha = 0.7;
    ctx.font = '32px "Songti SC", "Noto Serif SC", serif';
    ctx.fillText(witch.keywords.slice(0, 2).join(' · '), w/2, h*0.6);

    // 能量哲学
    ctx.fillStyle = '#E0D8F0';
    ctx.globalAlpha = 0.5;
    ctx.font = '24px "PingFang SC", sans-serif';
    const words = witch.philosophy.replace(/[「」""]/g, '');
    ctx.fillText(words, w/2, h*0.72);

    // 装饰线
    ctx.strokeStyle = 'rgba(232,213,183,0.3)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(w*0.2, h*0.65);
    ctx.lineTo(w*0.8, h*0.65);
    ctx.stroke();

    // 底部符号
    ctx.fillStyle = witch.color;
    ctx.globalAlpha = 0.15;
    ctx.font = '60px serif';
    ctx.fillText('◆', w/2, h*0.85);
    ctx.globalAlpha = 1;

    // 底部文字
    ctx.fillStyle = 'rgba(232,213,183,0.4)';
    ctx.font = '20px "Special Elite", "Courier Prime", monospace';
    ctx.fillText('LING XI ZHI MEN', w/2, h*0.92);

    // 更新预览
    const preview = document.getElementById('wallpaperPreview');
    preview.src = canvas.toDataURL('image/png');
  },

  download() {
    const canvas = document.getElementById('wallpaperCanvas');
    const link = document.createElement('a');
    link.download = `灵汐之门_${WITCH_TYPES[this.witchType].name}_壁纸.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  },

  share() {
    const canvas = document.getElementById('wallpaperCanvas');
    canvas.toBlob(blob => {
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], 'wallpaper.png', { type: 'image/png' });
        const data = { files: [file], title: '灵汐之门 · 能量壁纸' };
        if (navigator.canShare(data)) {
          navigator.share(data).catch(() => {});
        } else {
          this.download();
        }
      } else {
        this.download();
      }
    }, 'image/png');
  }
};
window.Wallpaper = Wallpaper;
