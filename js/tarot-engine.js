const TarotEngine = {
  spread: null,
  allCards: [],
  selectedCards: [],
  targetCount: 0,

  init() {
    this.spread = null;
    this.selectedCards = [];
    this.targetCount = 0;
    var backBtn = document.getElementById('globalBackBtn');
    if (backBtn) {
      backBtn.onclick = function() { navigateTo('home'); };
      var tip = backBtn.querySelector('.back-tip');
      if (tip) tip.textContent = '返回首页';
    }
    this.renderSpreadSelect();
  },

  renderSpreadSelect() {
    var backBtn = document.getElementById('globalBackBtn');
    if (backBtn) {
      backBtn.onclick = function() { navigateTo('home'); };
      var tip = backBtn.querySelector('.back-tip');
      if (tip) tip.textContent = '返回首页';
    }
    const container = document.getElementById('tarotContainer');
    container.innerHTML = `
      <div class="tarot-header">
        <h2 class="tarot-title typewriter-text-cn">塔罗占卜</h2>
        <p class="tarot-subtitle">选择一个牌阵，聆听牌面的低语</p>
      </div>
      <div class="engraved-divider"></div>
      <div class="spread-list">
        <button class="spread-card engraved-border" onclick="TarotEngine.startDraw('single', 1)">
          <span class="spread-icon">◇</span>
          <span class="spread-name">单张牌</span>
          <span class="spread-desc">每日指引 · 简单问答</span>
          <span class="spread-hint">抽一张牌，让宇宙给你今天的关键词。</span>
        </button>
        <button class="spread-card engraved-border" onclick="TarotEngine.startDraw('three', 3)">
          <span class="spread-icon">◇◇◇</span>
          <span class="spread-name">三张牌</span>
          <span class="spread-desc">过去 · 现在 · 未来</span>
          <span class="spread-hint">梳理时间线，看见此刻你所站的位置。</span>
        </button>
        <button class="spread-card engraved-border" onclick="TarotEngine.startDraw('celtic', 10)">
          <span class="spread-icon">✦</span>
          <span class="spread-name">凯尔特十字</span>
          <span class="spread-desc">深度探索 · 10张牌</span>
          <span class="spread-hint">最经典的深度牌阵，给你一个完整的能量地图。</span>
        </button>
        <button class="spread-card engraved-border" onclick="TarotEngine.startDraw('relationship', 5)">
          <span class="spread-icon">♡</span>
          <span class="spread-name">关系牌阵</span>
          <span class="spread-desc">情感 · 人际关系 · 5张牌</span>
          <span class="spread-hint">你、对方、关系的本质、桥梁与走向。</span>
        </button>
      </div>
    `;
  },

  _pools: {},

  initPools() {
    this._pools = {};
  },

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  pick(key, variants) {
    if (!this._pools[key] || this._pools[key].length === 0) {
      this._pools[key] = this.shuffle(variants);
    }
    return this._pools[key].pop();
  },

  startDraw(spreadType, count) {
    this.spread = spreadType;
    this.selectedCards = [];
    this.targetCount = count;
    this.allCards = shuffleDeck(getAllTarotCards().map(c => ({ ...c })));
    this._firstRender = true;
    this.initPools();
    var backBtn = document.getElementById('globalBackBtn');
    if (backBtn) {
      backBtn.onclick = function() { TarotEngine.renderSpreadSelect(); };
      var tip = backBtn.querySelector('.back-tip');
      if (tip) tip.textContent = '重选牌阵';
    }
    this.renderShuffleCircle();
  },

  renderShuffleCircle() {
    const container = document.getElementById('tarotContainer');
    const spreadNames = { single: '单张牌', three: '三张牌', celtic: '凯尔特十字', relationship: '关系牌阵' };
    const total = this.allCards.length;
    const isMobile = window.innerWidth < 480;
    const radius = isMobile ? 110 : 160;
    const ringMargin = isMobile ? 120 : 180;

    container.innerHTML = `
      
      <div class="tarot-header">
        <h2 class="tarot-title typewriter-text-cn">${spreadNames[this.spread]}</h2>
        <p class="tarot-subtitle">牌组正在为你准备……</p>
      </div>
      <div class="shuffle-stage">
        <div class="shuffle-ring" id="shuffleRing" style="margin:${ringMargin}px 0">
          ${this.allCards.map((card, i) => {
            const angle = (360 / total) * i;
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            return `
              <div class="shuffle-card"
                   style="
                     --sx: ${x}px;
                     --sy: ${y}px;
                     --sa: ${angle + 90}deg;
                     animation-delay: ${i * 0.02}s;
                   ">
                <span class="shuffle-card-icon">✦</span>
              </div>
            `;
          }).join('')}
        </div>
        <p class="shuffle-hint">正在洗牌……</p>
      </div>
    `;

    var self = this;
    setTimeout(() => {
      self.renderDrawStage();
    }, 2800);

    var preloadDiv = document.createElement('div');
    preloadDiv.style.display = 'none';
    this.allCards.forEach(function(card) {
      var img = new Image();
      img.src = self.getCardImage(card);
      preloadDiv.appendChild(img);
    });
    container.appendChild(preloadDiv);
  },

  renderDrawStage() {
    const container = document.getElementById('tarotContainer');
    const spreadNames = { single: '单张牌', three: '三张牌', celtic: '凯尔特十字', relationship: '关系牌阵' };

    const oldTrack = document.getElementById('deckScrollTrack');
    const savedScroll = oldTrack ? oldTrack.scrollLeft : 0;

    container.innerHTML = `
      
      <div class="tarot-header">
        <h2 class="tarot-title typewriter-text-cn">${spreadNames[this.spread]}</h2>
        <p class="tarot-subtitle">
          ${this.selectedCards.length === 0
            ? `跟随直觉，选择 ${this.targetCount} 张属于你的牌`
            : `已选 ${this.selectedCards.length} / ${this.targetCount} 张`
          }
        </p>
      </div>
      <div class="engraved-divider"></div>

      <div class="deck-scroll-wrapper">
        <div class="deck-scroll-track" id="deckScrollTrack">
          ${this.allCards.map((card, i) => `
            <div class="deck-card ${card._selected ? 'deck-card-selected' : ''} ${this._firstRender ? 'deck-card-dealing' : ''}"
                 id="deckCard${i}"
                 style="${this._firstRender ? `animation-delay:${0.3 + i * 0.04}s` : ''}"
                 onclick="TarotEngine.selectCard(${i})">
              <div class="deck-card-inner">
                <span class="deck-card-back-icon">✦</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="selectedArea" class="selected-area">
        ${this.selectedCards.length > 0 ? `
          <div class="spread-layout spread-${this.spread}">
            ${this.selectedCards.map((card, i) => `
              <div class="spread-slot" style="--slot-index:${i}">
                <span class="spread-card-title">${card.name}</span>
                <div class="spread-card-face engraved-border"><img src="${this.getCardImage(card)}" class="spread-card-img" /></div>
                <span class="spread-card-pos-label">${this.getPositionLabel(i)}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>

      ${this.selectedCards.length === this.targetCount ? `
        <div class="draw-complete" id="drawComplete">
          <div class="engraved-divider"></div>
          <button class="btn btn-primary" onclick="TarotEngine.revealReading()">
            解读我的牌阵
          </button>
        </div>
      ` : ''}

      <div id="cardReading" class="card-reading"></div>
    `;

    requestAnimationFrame(() => {
      const newTrack = document.getElementById('deckScrollTrack');
      if (newTrack && savedScroll > 0) {
        newTrack.scrollLeft = savedScroll;
      }
    });
  },

  selectCard(index) {
    if (this.selectedCards.length >= this.targetCount && !this.allCards[index]._selected) return;

    if (this.allCards[index]._selected) {
      this.allCards[index]._selected = false;
      this.selectedCards = this.selectedCards.filter(c => c !== this.allCards[index]);

      const cardEl = document.getElementById(`deckCard${index}`);
      if (cardEl) {
        cardEl.classList.remove('deck-card-selected');
        const inner = cardEl.querySelector('.deck-card-inner');
        if (inner) {
          inner.innerHTML = `<span class="deck-card-back-icon">✦</span>`;
        }
      }

      this.refreshSelectedArea();

      const completeEl = document.getElementById('drawComplete');
      const completeDiv = document.getElementById('completeDivider');
      if (completeEl) completeEl.remove();
      if (completeDiv) completeDiv.remove();

      return;
    }

    this.allCards[index]._selected = true;
    this.selectedCards.push(this.allCards[index]);
    this._firstRender = false;

    const cardEl = document.getElementById(`deckCard${index}`);
    if (cardEl) {
      cardEl.classList.add('deck-card-selected');
    }

    this.refreshSelectedArea();

    if (this.selectedCards.length === this.targetCount) {
      const divider = document.createElement('div');
      divider.className = 'engraved-divider';
      divider.id = 'completeDivider';

      const btnWrap = document.createElement('div');
      btnWrap.className = 'draw-complete';
      btnWrap.id = 'drawComplete';
      btnWrap.innerHTML = `
        <button class="btn btn-primary" onclick="TarotEngine.revealReading()">
          解读我的牌阵
        </button>
      `;

      const readingDiv = document.getElementById('cardReading');
      if (readingDiv) {
        readingDiv.before(divider);
        readingDiv.before(btnWrap);
      }

      setTimeout(() => {
        btnWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  },

  refreshSelectedArea() {
    const counterEl = document.querySelector('.tarot-subtitle');
    if (counterEl) {
      if (this.selectedCards.length === 0) {
        counterEl.textContent = `跟随直觉，选择 ${this.targetCount} 张属于你的牌`;
      } else {
        counterEl.textContent = `已选 ${this.selectedCards.length} / ${this.targetCount} 张`;
      }
    }

    const selectedArea = document.getElementById('selectedArea');
    if (!selectedArea) return;

    if (this.selectedCards.length === 0) {
      selectedArea.innerHTML = '';
      return;
    }

    selectedArea.innerHTML = `
      <div class="spread-layout spread-${this.spread}">
        ${this.selectedCards.map((card, i) => `
          <div class="spread-slot" style="--slot-index:${i}">
            <span class="spread-card-title">${card.name}</span>
            <div class="spread-card-face engraved-border"><img src="${this.getCardImage(card)}" class="spread-card-img" /></div>
            <span class="spread-card-pos-label">${this.getPositionLabel(i)}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  revealReading() {
    var readingDiv = document.getElementById('cardReading');
    var summary = this.generateOverallReading();

    if (this.spread === 'single') {
      var card = this.selectedCards[0];
      readingDiv.innerHTML = '<div class="overall-reading fade-in">'
        + '<div class="engraved-divider"></div>'
        + '<h3 class="overall-title">牌阵整体解读</h3>'
        + '<div class="single-reading-layout">'
        + '<div class="single-card-left">'
        + '<span class="single-card-name">' + card.name + '</span>'
        + '<div class="single-card-face engraved-border"><img src="' + this.getCardImage(card) + '" class="spread-card-img" /></div>'
        + '</div>'
        + '<div class="single-card-right">'
        + '<div class="card engraved-border"><p class="overall-text">' + summary + '</p></div>'
        + '</div>'
        + '</div>'
        + '<p class="reading-closing">纸牌只是镜子，照见的始终是你自己。</p>'
        + '<div style="text-align:center;margin-top:var(--space-lg)"><button class="btn" onclick="TarotEngine.init()">重新占卜</button></div>'
        + '</div>';
    } else {
      var intro = summary.intro || '';
      var outro = summary.outro || '';
      var crossRefs = summary.crossRefs || [];

      var sectionsHTML = '';
      if (this.spread === 'celtic' && summary.groups) {
        for (var i = 0; i < summary.groups.length; i++) {
          sectionsHTML += this._buildCelticGroupHTML(summary.groups[i]);
        }
      } else {
        var sections = summary.sections || [];
        for (var i = 0; i < sections.length; i++) {
          sectionsHTML += this._buildCardSectionHTML(sections[i].card, sections[i].index);
        }
      }

      var crossHTML = '';
      if (crossRefs.length > 0) {
        crossHTML = '<div class="cross-refs"><p>' + crossRefs.join('</p><p>') + '</p></div>';
      }

      readingDiv.innerHTML = '<div class="overall-reading fade-in">'
        + '<div class="engraved-divider"></div>'
        + '<h3 class="overall-title">牌阵整体解读</h3>'
        + (intro ? '<div class="overall-intro"><p>' + intro + '</p></div>' : '')
        + crossHTML
        + '<div class="position-readings">' + sectionsHTML + '</div>'
        + (outro ? '<div class="overall-outro"><p>' + outro + '</p></div>' : '')
        + '<p class="reading-closing">纸牌只是镜子，照见的始终是你自己。</p>'
        + '<div style="text-align:center;margin-top:var(--space-lg)"><button class="btn" onclick="TarotEngine.init()">重新占卜</button></div>'
        + '</div>';
    }

    var el = readingDiv.firstElementChild;
    requestAnimationFrame(function() {
      el.classList.add('visible');
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  },

  getCardImage(card) {
    var folder = 'Rider-Waite-Smith tarot/';
    if (card.id !== undefined) {
      return folder + card.id + card.name + '.webp';
    }
    var suit = card.suit;
    var rank = card.rank;
    var rankMap = {
      'Ace': '1', '2': '2', '3': '3', '4': '4', '5': '5',
      '6': '6', '7': '7', '8': '8', '9': '9', '10': '10',
      'Page': '侍从', 'Knight': '骑士', 'Queen': '王后', 'King': '国王'
    };
    return folder + suit + (rankMap[rank] || '') + '.webp';
  },

  getCardImageUrl(card) {
    var path = this.getCardImage(card);
    return 'url(' + path + ')';
  },

  getPositionLabel(index) {
    const labels = {
      single: ['指引'],
      three: ['过去', '现在', '未来'],
      celtic: ['核心问题', '当下的阻碍', '潜意识的根基', '遥远的过去', '近期的过去', '即将到来的影响', '你当下的状态', '外部环境', '希望与恐惧', '最终走向'],
      relationship: ['你', '对方', '关系的本质', '你们之间的桥梁', '可能的走向']
    };
    const arr = labels[this.spread] || [];
    return arr[index] || '';
  },

  _splitMeaning(meaning) {
    var sentences = meaning.split('。').filter(function(s) { return s.trim().length > 0; });
    var visualCount = Math.min(2, Math.max(1, Math.floor(sentences.length * 0.35)));
    var visual = sentences.slice(0, visualCount).join('。') + '。';
    var interpretation = sentences.slice(visualCount).join('。');
    if (interpretation.trim()) interpretation += '。';
    return { visual: visual, interpretation: interpretation };
  },

  _getKeywordsString(card) {
    if (card.keywords && card.keywords.length > 0) {
      return card.keywords.join('、');
    }
    return '';
  },

  _messageTemplates: {
    past: [
      '{cardName}曾在你的{position}轻轻驻足。{keyword1}与{keyword2}——它们不是已经翻篇的旧页，而是织进你生命纹理里的金线。感谢那段路教会你的一切，然后带着它们温柔地向前走。',
      '回望{position}，{cardName}像一本安静合上的书。{keyword1}的温度还留在指尖，{keyword2}的气息仍萦绕不去。你不需要重读每一个字，只消知道那些章节已经变成你此刻站立的土地。',
      '{cardName}标记了你{position}的风景。{keyword1}不是遗憾，{keyword2}不是偶然——它们是你内心深处已经酿好的蜜，甜味会在你需要的时候悄悄释放。',
      '你的{position}被{cardName}轻轻托着。{keyword1}和{keyword2}曾经是你生活里的主调，现在它们已经化成了背景里柔和的弦乐，不喧哗，但一直都在。'
    ],
    present: [
      '此刻，「{cardName}」映出你{position}的样子。{keyword1}是你手心里正握着的温度，{keyword2}是你脚下正在呼吸的土地。不需要急着迈步，先深深感受这一刻的分量——你已经站在这里了。',
      '你的{position}是{cardName}。{keyword1}——也许你还没意识到自己拥有这样的质地。试着把掌心轻轻贴在胸口，{keyword2}的能量正在那里安静地跳动着，它不需要被证明，只需要被感知。',
      '「{cardName}」是你{position}的坐标。{keyword1}给你方向，{keyword2}给你站稳的底气。你不需要急着离开这个位置，你只需要承认：我在这里，这就已经是全部。',
      '{cardName}把{keyword1}的光投在你{position}的位置上。你能感觉到吗？{keyword2}不是一个需要完成的考题，而是一片正被你呼吸着的空气。给自己一点时间，这些感受会自己浮出水面。'
    ],
    future: [
      '眺望{position}，「{cardName}」像远处山间一盏刚刚亮起的灯。{keyword1}是灯光的颜色，{keyword2}是光到达你之前穿过的那段温柔距离。不需要现在就走到灯下，知道那个方向有暖光，就已经足够。',
      '「{cardName}」在你{position}的方向上，像一颗还没升起的星。{keyword1}和{keyword2}正在云层后面酝酿它们第一次闪烁。等待不是空白——是星空准备登场的幕间。你不需要催促星星。',
      '你{position}的道路上，「{cardName}」在远处轻轻招手。{keyword1}是路边会开的花，{keyword2}是拂过你脸颊的风。未来不是一个需要抵达的地点，而是一段你即将踏上的散步。',
      '{cardName}为你{position}的方向画了一道柔和的弧线。{keyword1}是弧线那端等着的礼物，{keyword2}是你走过去时脚下的路。你不需要提前知道每一块石阶的形状，只要相信那条路是属于你的。'
    ],
    inner: [
      '在你心灵深处，{cardName}静静守着你{position}的角落。{keyword1}是地下无声的泉水，默默滋养着你所有的根系。{keyword2}是你潜意识里最忠实的伙伴，从不喧哗，却一直支撑着你。',
      '{cardName}栖在你心里最温柔的地方。{keyword1}是你没有说出口的愿望，{keyword2}是你在深夜里偶尔想起的念头。它们并不可怕——它们是你还没有学会与之交谈的另一部分自己。',
      '你的{position}被{cardName}轻轻照亮。{keyword1}是你灵魂最古老的记忆，{keyword2}是你内心最诚实的低语。闭上眼，去听那些不需要语言就能传达的真相。',
      '{cardName}正像一盏小夜灯，照亮你{position}的暗处。{keyword1}不是恐惧，是指引；{keyword2}不是困惑，是正在成形的新认知。试着对它们点点头，你会发现它们一直站在你这边。'
    ],
    external: [
      '围绕在你身边的，是{cardName}的温度。{keyword1}是外部世界递来的一杯茶，{keyword2}是周围空气里飘浮的微尘。你可以选择接过杯子，也可以选择等茶凉一凉再喝。',
      '{cardName}描摹着你周围的环境。{keyword1}的能量正在空气里流动，{keyword2}是别人身上投射到你世界的影子。你不需要对所有这些负责——你只需要分辨哪些是属于你的，哪些只是路过。',
      '你身处的环境中弥漫着{cardName}的气息。{keyword1}和{keyword2}是外界给你的背景音。有些声音值得细听，有些只是白噪音。你有权利选择哪些声音进入你的内心房间。',
      '{cardName}是你此刻身处的风景。{keyword1}是风景里的光，{keyword2}是风景里的路。适应它，理解它，但不必被它定义——你始终是站在风景里的那个人，比风景更大。'
    ],
    self: [
      '「{cardName}」映出了你此刻的模样。{keyword1}是你身上正在发光的质感，{keyword2}是你内心正在生长的力量。也许你自己还没注意到，但这两样东西已经在你身上留下了一道温柔的轮廓。',
      '{cardName}就是你。{keyword1}是你面对世界时最自然的姿态，{keyword2}是你独自一人时最真实的底色。不需要改变什么，你本来就足够完整。',
      '在{position}的位置上，{cardName}像一面被细心擦拭过的镜子，映出你全部的光。{keyword1}不是你需要努力获得的东西——它已经在你体内了。{keyword2}是你与生俱来的能力，只是以前没有人告诉你它的名字。',
      '{cardName}替你轻声说了一句：我看见你。{keyword1}和{keyword2}——这两个词不是标签，是你灵魂的质地。不需要解释，不需要证明，只需要被你自己温柔地承认。'
    ],
    essence: [
      '「{cardName}」是你们之间那条看不见的线。{keyword1}是线的材质，{keyword2}是线的弹性。有些线是丝做的，柔软而坚韧；有些线是藤编的，粗粝却温暖。知道自己握着什么质地的线，才知道该用多大的力气去牵。',
      '你们关系的本质被{cardName}轻轻揭开。{keyword1}是这段关系的底色，{keyword2}是它散发出的温度。不需要急着定义对错，先看清它本来的样子。',
      '{cardName}替你们说出了那个没有明说的事实。{keyword1}是你们之间正在流动的东西，{keyword2}是这段关系独特的纹理。看见它，接纳它，然后再决定如何与它相处。',
      '「{cardName}」照出了你们关系的本质。{keyword1}和{keyword2}——它们不是好或坏的标尺，而是这段关系真实的两面。允许它们同时存在，是对彼此最大的尊重。'
    ],
    bridge: [
      '「{cardName}」是架在你们之间的桥。{keyword1}是桥面的宽度，{keyword2}是桥下的水流。桥不会催促你走过去，也不会拦着你的脚步——它只是安静地在那里，等你们各自的决定。',
      '{cardName}连接着你们之间的空间。{keyword1}是你们之间已经发生的对话，{keyword2}是还没说出口的那些话。桥不是用来评价的，是用来被看见的。',
      '「{cardName}」提醒你看向你们之间的那段距离。{keyword1}和{keyword2}是架在这段距离上的两块最重要的木板。也许还需要更多的木板，也许现在的桥已经足够坚固——答案在你心里。',
      '{cardName}站在你们中间，不是作为障碍，而是作为连接。{keyword1}告诉你什么是可以共享的，{keyword2}告诉你什么是需要各自保留的。真正的连接，不需要消除所有的距离。'
    ]
  },

  _getPositionContext(index) {
    var celticMap = { 0: 'present', 1: 'present', 2: 'inner', 3: 'past', 4: 'past', 5: 'future', 6: 'present', 7: 'external', 8: 'inner', 9: 'future' };
    var relMap = { 0: 'self', 1: 'self', 2: 'essence', 3: 'bridge', 4: 'future' };
    var threeMap = { 0: 'past', 1: 'present', 2: 'future' };
    if (this.spread === 'celtic') return celticMap[index] || 'present';
    if (this.spread === 'relationship') return relMap[index] || 'self';
    if (this.spread === 'three') return threeMap[index] || 'present';
    return 'present';
  },

  _buildMessage(card, positionLabel, positionIndex) {
    var context = this._getPositionContext(positionIndex);
    var templates = this._messageTemplates[context] || this._messageTemplates['present'];
    var template = this.pick('msg_' + context, templates);
    var keywords = card.keywords || [];
    var kw1 = keywords[0] || card.name;
    var kw2 = keywords[1] || (keywords[0] || card.name);
    return template
      .replace(/\{cardName\}/g, card.name)
      .replace(/\{keyword1\}/g, kw1)
      .replace(/\{keyword2\}/g, kw2)
      .replace(/\{position\}/g, positionLabel);
  },

  _getPositionLabelShort(index) {
    var long = this.getPositionLabel(index);
    var celticShort = ['核心', '阻碍', '根基', '遥远过去', '近期过去', '即将到来', '你的状态', '外部环境', '希望恐惧', '最终走向'];
    if (this.spread === 'celtic') return celticShort[index] || long;
    return long;
  },

  _buildCardSectionHTML(card, index, showVisual) {
    if (showVisual === undefined) showVisual = true;
    var positionLabel = this.getPositionLabel(index);
    var split = this._splitMeaning(card.meaning);
    var message = this._buildMessage(card, positionLabel, index);
    var html = '<div class="position-reading">'
      + '<div class="position-header">'
      + '<span class="position-label">' + positionLabel + '</span>'
      + '<span class="position-card-name">' + card.name + '</span>'
      + '</div>';
    if (showVisual) {
      html += '<div class="detail-section">'
        + '<span class="detail-label">牌面描述</span>'
        + '<p class="detail-text">' + split.visual + '</p>'
        + '</div>';
    }
    html += '<div class="detail-section">'
      + '<span class="detail-label">牌意解读</span>'
      + '<p class="detail-text">' + split.interpretation + '</p>'
      + '</div>'
      + '<div class="detail-section">'
      + '<span class="detail-label">给你的寄语</span>'
      + '<p class="detail-text">' + message + '</p>'
      + '</div>'
      + '</div>';
    return html;
  },

  _buildOverallIntro(spreadType) {
    var intros = {
      three: [
        '三张牌从左到右，为你展开一条温柔的时间弧线。每一张牌都有自己的故事，合在一起，就是你此刻站立的坐标。来，一张一张读它们想对你说的话。',
        '过去、现在、未来——三张牌像三颗在夜里先后亮起的星。不需要急着把它们连成星座，先一颗一颗地看，它们各自的光芒里，都藏着一个关于你的秘密。',
        '你把三张牌依次排开的瞬间，时间在牌面上打了一个弯。左边是已经落定的尘埃，中间是正在流动的水，右边是还在天空酝酿的云。来逐张聆听它们的低语。'
      ],
      celtic: [
        '十张牌为你展开了一幅完整的能量地图。每个位置都是一扇小窗，透过不同的角度，映出自己此刻所处的风景。来一扇一扇推开这些窗，看看每张牌想对你说什么。',
        '凯尔特十字是最古老的牌阵之一，它不急于给出一个简单的答案，而是像一位耐心的朋友，带你从十个不同的方向慢慢看清同一件事。来，一张一张地读。'
      ],
      relationship: [
        '五张牌在你们之间展开，每一张都从不同的角度照亮这段关系。先看清自己的位置，再看对方的方向——来，一张一张走近这些牌。',
        '关系的问题从来不是一个简单的答案能概括的。这五张牌也不打算给你一个词——它们更像五面被细心擦拭过的镜子，每一面都值得你停下来照一照。'
      ]
    };
    var pool = intros[spreadType] || ['来看看牌面想对你说些什么。'];
    return this.pick('intro_' + spreadType, pool);
  },

  _buildOverallOutro(spreadType) {
    var outros = {
      three: [
        '三张牌看完了。从过去走到现在再望向未来——这不是一条直线，是一段你在时间里留下的温柔弧线。牌的力量不只在翻开的那一刻，更在合上它们之后，一切仍在你体内继续流动。',
        '「过去」教会了你一件事，「现在」正陪着你体验一件事，「未来」邀请你走向一件事。三件事串在一起，是你此刻全部的存在。而站在这三者之间的你——是所有意义发生的地方。'
      ],
      celtic: [
        '十张牌，十个角度，最后都指向同一个中心——你自己。牌给了你一张地图，握桨的人始终在你手里。带着这些温柔的提醒回到生活里吧，不需要一次记住全部，那些你需要的，会在对的时间浮上心头。',
        '凯尔特十字的星图逐渐收拢。每一张牌都在你心里留下了一道细微的涟漪，这些涟漪会在接下来的日子里慢慢扩散、重叠、沉淀。你不需要急着把它们全部读懂——它们会在时间里慢慢完成自己的工作。'
      ],
      relationship: [
        '五张牌说完了，但关系的故事远远没有结束。牌给你的不是结论，是一瞬的清晰。这种清晰可能会在接下来的几天里慢慢模糊，也可能在某个不经意的对视中忽然又变得透明——你只需要记住看牌时心里微微一动的那种感觉。',
        '谢谢你和这些牌一起度过这段时间。现在把注意力从牌上移开，回到你自己的呼吸里，回到你和对方之间那些真实发生过的瞬间。牌已经完成了它的工作，接下来的，是生活本身。'
      ]
    };
    var pool = outros[spreadType] || ['牌已经完成了它们的工作，接下来的，是你自己的生活。'];
    return this.pick('outro_' + spreadType, pool);
  },


  _styles: ['poetic', 'conversational', 'narrative', 'intuitive', 'warm'],
  _currentStyle: null,
  _lastReadings: [],

  rotateStyle() {
    const used = this._lastReadings.map(r => r.style).filter(Boolean);
    const available = this._styles.filter(s => !used.includes(s));
    this._currentStyle = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : this._styles[Math.floor(Math.random() * this._styles.length)];
  },

  loadMemory() {
    try {
      const data = localStorage.getItem('lingxi_tarot_memory');
      this._lastReadings = data ? JSON.parse(data) : [];
    } catch (e) {
      this._lastReadings = [];
    }
  },

  saveReading(cards) {
    this.loadMemory();
    const key = cards.map(c => c.name).sort().join('|');
    this._lastReadings.unshift({ key, style: this._currentStyle, time: Date.now() });
    if (this._lastReadings.length > 15) this._lastReadings.length = 15;
    try {
      localStorage.setItem('lingxi_tarot_memory', JSON.stringify(this._lastReadings));
    } catch (e) {}
  },

  isRepeated(cards) {
    this.loadMemory();
    const key = cards.map(c => c.name).sort().join('|');
    return this._lastReadings.filter(r => r.key === key).length;
  },

  detectCrossRefs(cards) {
    const refs = [];
    const majors = cards.filter(c => c.id !== undefined);
    const minors = cards.filter(c => c.suit);
    const elements = {};
    minors.forEach(c => {
      elements[c.element] = (elements[c.element] || 0) + 1;
    });

    if (majors.length >= 3) refs.push('major_dominant');
    if (majors.length === 1) refs.push('single_major');
    for (const [el, count] of Object.entries(elements)) {
      if (count >= 2) refs.push(`element_pair_${el}`);
    }
    const suits = {};
    minors.forEach(c => { suits[c.suit] = (suits[c.suit] || 0) + 1; });
    for (const [s, count] of Object.entries(suits)) {
      if (count >= 2) refs.push(`suit_pair_${s}`);
    }
    return refs;
  },

  crossRefText(refs, cards) {
    const parts = [];
    const majors = cards.filter(c => c.id !== undefined);
    const minors = cards.filter(c => c.suit);
    const elementNames = { '火': '火焰', '水': '流水', '风': '清风', '土': '大地' };

    if (refs.includes('major_dominant')) {
      parts.push('三张大阿卡纳同时现身——这不是日常的微风，是一场灵魂级别的对话。');
    }
    if (refs.includes('single_major') && cards.length >= 3) {
      parts.push('「' + majors[0].name + '」是这组牌中唯一的大阿卡纳，它是圆心，其余牌绕着它转。');
    }
    return parts;
  },


  generateOverallReading() {
    var cards = this.selectedCards;
    this.loadMemory();
    this.rotateStyle();
    var repeatCount = this.isRepeated(cards);
    if (repeatCount >= 1) this.initPools();

    switch (this.spread) {
      case 'single': return this.readSingle(cards[0]);
      case 'three': return this.readThree(cards);
      case 'celtic': return this.readCeltic(cards);
      case 'relationship': return this.readRelationship(cards);
      default: return '';
    }
  },

  saveCurrentReading(cards) {
    var key = cards.map(function(c) { return c.name; }).sort().join('|');
    this._lastReadings.unshift({ key: key, style: this._currentStyle, time: Date.now() });
    if (this._lastReadings.length > 20) this._lastReadings.length = 20;
    try {
      localStorage.setItem('lingxi_tarot_memory', JSON.stringify(this._lastReadings));
    } catch (e) {}
  },

  readSingle(c) {
    this.saveCurrentReading([c]);
    return c.meaning;
  },

  readThree(cards) {
    this.saveCurrentReading(cards);
    var refs = this.detectCrossRefs(cards);
    var crossTexts = this.crossRefText(refs, cards);
    var sections = [];
    for (var i = 0; i < cards.length; i++) {
      sections.push({ card: cards[i], index: i });
    }
    return {
      intro: this._buildOverallIntro('three'),
      sections: sections,
      crossRefs: crossTexts,
      outro: this._buildOverallOutro('three')
    };
  },

  readCeltic(cards) {
    this.saveCurrentReading(cards);
    var refs = this.detectCrossRefs(cards);
    var crossTexts = this.crossRefText(refs, cards);

    var groups = [
      {
        title: '核心三角',
        subtitle: '核心问题 · 阻碍 · 根基',
        cards: [{ card: cards[0], index: 0 }, { card: cards[1], index: 1 }, { card: cards[2], index: 2 }]
      },
      {
        title: '时间脉络',
        subtitle: '遥远过去 · 近期过去 · 即将到来',
        cards: [{ card: cards[3], index: 3 }, { card: cards[4], index: 4 }, { card: cards[5], index: 5 }]
      },
      {
        title: '内外映照',
        subtitle: '你的状态 · 外部环境 · 希望与恐惧',
        cards: [{ card: cards[6], index: 6 }, { card: cards[7], index: 7 }, { card: cards[8], index: 8 }]
      },
      {
        title: '最终走向',
        subtitle: null,
        cards: [{ card: cards[9], index: 9 }]
      }
    ];

    return {
      intro: this._buildOverallIntro('celtic'),
      groups: groups,
      crossRefs: crossTexts,
      outro: this._buildOverallOutro('celtic')
    };
  },

  _buildCelticGroupHTML(group) {
    var cards = group.cards;
    var cardNames = cards.map(function(c) { return c.card.name; }).join('、');
    var interpretations = cards.map(function(c) {
      var split = this._splitMeaning(c.card.meaning);
      return split.interpretation;
    }, this).join('');
    var combinedCard = {
      name: cardNames,
      keywords: cards.reduce(function(acc, c) {
        return acc.concat(c.card.keywords || []);
      }, [])
    };
    var message = this._buildMessage(combinedCard, group.title, cards[0].index);

    var html = '<div class="position-reading">'
      + '<div class="position-header">'
      + '<span class="position-label">' + group.title + '</span>'
      + '<span class="position-card-name">' + cardNames + '</span>'
      + '</div>';
    if (group.subtitle) {
      html += '<div class="celtic-group-subtitle">' + group.subtitle + '</div>';
    }
    html += '<div class="detail-section">'
      + '<span class="detail-label">牌意解读</span>'
      + '<p class="detail-text">' + interpretations + '</p>'
      + '</div>'
      + '<div class="detail-section">'
      + '<span class="detail-label">给你的寄语</span>'
      + '<p class="detail-text">' + message + '</p>'
      + '</div>'
      + '</div>';
    return html;
  },

  readRelationship(cards) {
    this.saveCurrentReading(cards);
    var refs = this.detectCrossRefs(cards);
    var crossTexts = this.crossRefText(refs, cards);
    var sections = [];
    for (var i = 0; i < cards.length; i++) {
      sections.push({ card: cards[i], index: i });
    }
    return {
      intro: this._buildOverallIntro('relationship'),
      sections: sections,
      crossRefs: crossTexts,
      outro: this._buildOverallOutro('relationship')
    };
  }
};

window.TarotEngine = TarotEngine;
