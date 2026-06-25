const App = {
  currentPage: 'home',
  witchType: null,
  wandResult: null
};

window.navigateTo = function(page, data) {
  App.currentPage = page;

  var video = document.getElementById('bgVideo');
  var homePage = document.getElementById('page-home');
  var app = document.getElementById('app');
  var btn = document.getElementById('soundToggle');
  var backBtn = document.getElementById('globalBackBtn');

  if (backBtn) {
    backBtn.onclick = function() { navigateTo('home'); };
    var backTip = backBtn.querySelector('.back-tip');
    if (backTip) backTip.textContent = '返回首页';
  }

  if (page === 'home') {
    var video = document.getElementById('bgVideo');
    var bgImage = document.getElementById('bgImage');

    if (video && typeof homeInitialized !== 'undefined' && homeInitialized) {
      video.style.display = 'none';
      var audioHome = document.getElementById('bgAudio');
      if (audioHome) { audioHome.pause(); audioHome.currentTime = 0; }
      if (bgImage) { bgImage.style.display = 'block'; bgImage.style.opacity = '1'; }
      if (homePage) homePage.style.display = 'flex';
      if (app) app.style.display = 'none';
      if (btn) btn.style.display = 'flex';
      if (backBtn) backBtn.style.display = 'none';
      if (typeof showHomeUI === 'function') showHomeUI();
      window.scrollTo({ top: 0 });
      return;
    }

    if (video) { video.style.display = 'block'; video.style.opacity = '1'; }
    if (homePage) homePage.style.display = 'flex';
    if (app) app.style.display = 'none';
    if (btn) btn.style.display = 'flex';
    if (backBtn) backBtn.style.display = 'none';
    if (bgImage) bgImage.style.opacity = '0';

    if (video) {
      video.currentTime = 0;
      var audio = document.getElementById('bgAudio');
      if (audio) { audio.currentTime = 0; audio.play().catch(function() {}); }
      if (typeof hideHomeUI === 'function') hideHomeUI();
    }

    window.scrollTo({ top: 0 });
    return;
  }

  if (video) video.style.display = 'none';
  var bgImage = document.getElementById('bgImage');
  if (bgImage) bgImage.style.display = 'none';
  if (homePage) homePage.style.display = 'none';
  if (app) app.style.display = 'block';
  if (btn) btn.style.display = 'none';
  if (backBtn) backBtn.style.display = 'flex';
  if (backBtn) {
    backBtn.onclick = function() { navigateTo('home'); };
    var backTip = backBtn.querySelector('.back-tip');
    if (backTip) backTip.textContent = '返回首页';
  }

  var video2 = document.getElementById('bgVideo');
  var audio2 = document.getElementById('bgAudio');
  if (video2) video2.pause();
  if (audio2) audio2.pause();

  document.querySelectorAll('#app .page').forEach(function(p) { p.classList.remove('active'); });
  var target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  try {
    switch (page) {
      case 'test1': TestEngine.init(data); break;
      case 'test2': TestEngine.initTest2(data); break;
      case 'tarot': TarotEngine.init(); break;
      
    }
  } catch (e) {
    console.error('Navigation error:', e);
  }
};
