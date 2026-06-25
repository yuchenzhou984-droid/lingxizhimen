let homeInitialized = false;
let fadeOutDone = false;

document.addEventListener('DOMContentLoaded', () => {
  setupSound();
  setupVideo();
  setupCardTilt();
});

function setupSound() {
  const video = document.getElementById('bgVideo');
  const audio = document.getElementById('bgAudio');
  const btn = document.getElementById('soundToggle');
  if (!video || !audio || !btn) return;

  video.muted = true;
  audio.muted = true;
  audio.loop = false;
  btn.classList.add('muted');

  var tip = document.createElement('span');
  tip.className = 'sound-tip';
  tip.textContent = '点击开启声音';
  btn.appendChild(tip);

  video.addEventListener('play', () => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  });

  video.addEventListener('pause', () => {
    audio.pause();
  });

  btn.addEventListener('click', () => {
    if (audio.muted) {
      audio.muted = false;
      btn.classList.remove('muted');
      btn.title = '关闭声音';
      tip.textContent = '点击关闭声音';
    } else {
      audio.muted = true;
      btn.classList.add('muted');
      btn.title = '开启声音';
      tip.textContent = '点击开启声音';
    }
  });
}

function setupVideo() {
  const video = document.getElementById('bgVideo');
  if (!video) return;

  if (homeInitialized) {
    showHomeUI();
    return;
  }

  var fadeDone = false;
  video.addEventListener('timeupdate', function() {
    if (!video.duration) return;
    var remaining = video.duration - video.currentTime;
    var audio = document.getElementById('bgAudio');
    if (remaining < 2.5 && !fadeDone && audio) {
      audio.volume = Math.max(0, (remaining - 0.3) / 2.2);
    }
    if (remaining < 0.2) {
      fadeDone = true;
      if (audio) audio.volume = 0;
    }
    if (video.currentTime < 0.1) {
      fadeDone = false;
      if (audio) audio.volume = 1;
    }
  });

  video.addEventListener('ended', () => {
    homeInitialized = true;
    showHomeUI();
  });
}

function showHomeUI() {
  var title = document.querySelector('.ritual-title');
  var subtitle = document.querySelector('.ritual-subtitle');
  var entries = document.querySelectorAll('.ritual-entries .home-entry');
  var video = document.getElementById('bgVideo');
  var bgImage = document.getElementById('bgImage');
  var flash = document.getElementById('goldenFlash');

  if (video) video.style.opacity = '0';
  if (bgImage) { bgImage.style.display = 'block'; bgImage.style.opacity = '1'; }
  if (flash) { flash.classList.remove('active'); void flash.offsetWidth; flash.classList.add('active'); }
  if (title) title.classList.add('visible');
  if (subtitle) subtitle.classList.add('visible');
  entries.forEach(function(e) { e.classList.add('visible'); });
}

function hideHomeUI() {
  var title = document.querySelector('.ritual-title');
  var subtitle = document.querySelector('.ritual-subtitle');
  var entries = document.querySelectorAll('.ritual-entries .home-entry');
  var video = document.getElementById('bgVideo');
  var bgImage = document.getElementById('bgImage');

  if (video) video.style.opacity = '1';
  if (bgImage) { bgImage.style.display = 'none'; bgImage.style.opacity = '0'; }
  if (title) title.classList.remove('visible');
  if (subtitle) subtitle.classList.remove('visible');
  entries.forEach(function(e) { e.classList.remove('visible'); });
}

function setupCardTilt() {
  if (window.matchMedia('(max-width: 767px)').matches) return;

  var cards = document.querySelectorAll('.ritual-entries .home-entry');
  var title = document.querySelector('.ritual-title');
  var subtitle = document.querySelector('.ritual-subtitle');
  var appPanel = document.getElementById('app');
  var allEls = [title, subtitle, appPanel].filter(Boolean).concat(Array.from(cards));
  var cardSet = new Set(cards);

  document.addEventListener('mousemove', function(e) {
    allEls.forEach(function(el) {
      var rect = el.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = (e.clientX - cx) / (window.innerWidth / 2);
      var dy = (e.clientY - cy) / (window.innerHeight / 2);
      var dist = Math.sqrt(dx * dx + dy * dy);
      var isCard = cardSet.has(el);

      if (dist < 1.5) {
        var tiltX = dy * (isCard ? -12 : -4);
        var tiltY = dx * (isCard ? 12 : 4);
        var tz = (1.5 - dist) * (isCard ? 40 : 12);
        var s = 1 + (1.5 - dist) * (isCard ? 0.04 : 0.015);
        el.style.transform = 'rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateZ(' + tz + 'px) scale(' + s + ')';
        el.style.transition = 'transform 0.15s ease-out';
        if (isCard) {
          var shadowY = dy * 8;
          var shadowX = dx * 8;
          var shadowBlur = 20 + (1.5 - dist) * 24;
          el.style.boxShadow = shadowX + 'px ' + shadowY + 'px ' + shadowBlur + 'px rgba(40, 20, 60, 0.5)';
        }
      } else {
        el.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)';
        el.style.transition = 'transform 0.5s ease-out';
        if (isCard) {
          el.style.boxShadow = '0 4px 24px rgba(40, 20, 60, 0.3), inset 0 1px 0 rgba(200, 170, 230, 0.06)';
        }
      }
    });
  });

  document.addEventListener('mouseleave', function() {
    allEls.forEach(function(el) {
      el.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)';
      el.style.transition = 'transform 0.5s ease-out';
      if (cardSet.has(el)) {
        el.style.boxShadow = '0 4px 24px rgba(40, 20, 60, 0.3), inset 0 1px 0 rgba(200, 170, 230, 0.06)';
      }
    });
  });
}
