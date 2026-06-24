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
    const radius = 160;

    container.innerHTML = `
      
      <div class="tarot-header">
        <h2 class="tarot-title typewriter-text-cn">${spreadNames[this.spread]}</h2>
        <p class="tarot-subtitle">牌组正在为你准备……</p>
      </div>
      <div class="shuffle-stage">
        <div class="shuffle-ring" id="shuffleRing">
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

    setTimeout(() => {
      this.renderDrawStage();
    }, 2800);
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
    const readingDiv = document.getElementById('cardReading');
    const summary = this.generateOverallReading();

    if (this.spread === 'single') {
      const card = this.selectedCards[0];
      readingDiv.innerHTML = `
        <div class="overall-reading fade-in">
          <div class="engraved-divider"></div>
          <h3 class="overall-title">牌阵整体解读</h3>
          <div class="single-reading-layout">
            <div class="single-card-left">
              <span class="single-card-name">${card.name}</span>
              <div class="single-card-face engraved-border">
                <img src="${this.getCardImage(card)}" class="spread-card-img" />
              </div>
            </div>
            <div class="single-card-right">
              <div class="card engraved-border">
                <p class="overall-text">${summary}</p>
              </div>
            </div>
          </div>
          <p class="reading-closing">纸牌只是一面剔透的镜子，拂去镜面尘埃，那些关于爱、勇气与智慧的答案，其实早已静静写在你一呼一吸的温热里。</p>
          <div style="text-align:center;margin-top:var(--space-lg)">
            <button class="btn" onclick="TarotEngine.init()">重新占卜</button>
          </div>
        </div>
      `;
    } else {
      readingDiv.innerHTML = `
        <div class="overall-reading fade-in">
          <div class="engraved-divider"></div>
          <h3 class="overall-title">牌阵整体解读</h3>
          <div class="card engraved-border">
            <p class="overall-text">${summary}</p>
          </div>
          <p class="reading-closing">纸牌只是一面剔透的镜子，拂去镜面尘埃，那些关于爱、勇气与智慧的答案，其实早已静静写在你一呼一吸的温热里。</p>
          <div style="text-align:center;margin-top:var(--space-lg)">
            <button class="btn" onclick="TarotEngine.init()">重新占卜</button>
          </div>
        </div>
      `;
    }

    const el = readingDiv.firstElementChild;
    requestAnimationFrame(() => {
      el.classList.add('visible');
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  },

  getCardImage(card) {
    var folder = 'Rider-Waite-Smith tarot/';
    if (card.id !== undefined) {
      return folder + card.id + card.name + '.png';
    }
    var suit = card.suit;
    var rank = card.rank;
    var rankMap = {
      'Ace': '1', '2': '2', '3': '3', '4': '4', '5': '5',
      '6': '6', '7': '7', '8': '8', '9': '9', '10': '10',
      'Page': '侍从', 'Knight': '骑士', 'Queen': '王后', 'King': '国王'
    };
    return folder + suit + (rankMap[rank] || '') + '.png';
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
      parts.push(`三张大阿卡纳同时现身——这不是日常的微风，是一场灵魂级别的对话。`);
    }
    if (refs.includes('single_major') && cards.length >= 3) {
      parts.push(`「${majors[0].name}」是这组牌中唯一的大阿卡纳，它是圆心，其余牌绕着它转。`);
    }
    for (const ref of refs) {
      if (ref.startsWith('element_pair_')) {
        const el = ref.replace('element_pair_', '');
        const name = elementNames[el] || el;
        parts.push(`你抽出的牌中，${name}的能量反复出现——这不是巧合，是某个面向在用力敲门。`);
      }
    }
    return parts;
  },


  generateOverallReading() {
    const cards = this.selectedCards;
    this.loadMemory();
    const repeatCount = this.isRepeated(cards);
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
    const key = cards.map(c => c.name).sort().join('|');
    this._lastReadings.unshift({ key, time: Date.now() });
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
    const past = cards[0], present = cards[1], future = cards[2];
    this.saveCurrentReading(cards);
    const refs = this.detectCrossRefs(cards);
    const crossTexts = this.crossRefText(refs, cards);

    const intros = [
      `你把三张牌从左到右依次排开，像在暗室的墙上挂了三幅小小的画。左边这幅是已经干透的颜料，中间这幅还在画布上微微湿润着，右边那幅只勾了轮廓，等着颜色一层一层地填进去。这三幅画同属于一个展览，而你——是那个站在画廊中央、被自己的一生静静环绕的人。`,
      `「${past.name}」「${present.name}」「${future.name}」。三个名字像三颗在夜里先后亮起的星，连成了一条只属于你的弧线。左边那颗星的光已经走了很久才抵达你，中间这颗正悬在你的头顶，右边那颗还在云层后面酝酿着它第一次闪烁。你不是在观看星空，你正在成为星空的一部分。`,
      `时间在牌面上打了一个弯，露出了三个切面。第一个切面是「${past.name}」，像一块被河水冲刷了很久的卵石，它身上的纹路记录着你曾经在哪里停留过。第二个切面是「${present.name}」，是你此刻握在手心里还带着体温的石头。第三个切面是「${future.name}」，是一块还嵌在山体深处、等待被光和水发现的矿石。三块石头来自同一条河流，那条河流的名字，叫你自己的人生。`
    ];

    const pastParagraphs = [
      `最左边那张「${past.name}」像一封从旧地址寄来的信，信封已经泛黄，但你拆开的时候依然能闻到墨水最初的味道。${past.meaning.split('。')[0]}。这封信不再需要回信，它只是来提醒你：你从那里走到了这里，途中经历过的每一个路口、每一次犹豫、每一段独自走完的夜路，都真实地发生过，并且已经化成了你骨血里的纹理。`,
      `「${past.name}」是你身后已经退潮的那片海。${past.meaning.split('。')[0]}。退潮之后沙滩上会留下一些你之前没注意过的东西——贝壳、石子、被海水磨圆的玻璃碎片。它们不是垃圾，是你曾经以为弄丢了但其实一直在这里的、关于你自己的证据。`,
      `回望「${past.name}」，像隔着一段薄雾看曾经住过的房子。${past.meaning.split('。')[0]}。窗子里还有灯光，但你已经不在里面了。你可以站在雾的这一边，安静地看一会儿，对那盏曾经为你亮过的灯轻轻点头，然后转身继续走向雾正在散开的方向。`
    ];

    const presentParagraphs = [
      `中间这张「${present.name}」是你此刻正踏着的那一级台阶。${past.meaning.split('。')[0]}。你站在这里，不上也不下，只是站着。有时候站在原地比迈出一步更需要勇气，因为站着意味着你愿意承认：这就是我现在的位置，我不急着离开，也不假装自己已经在别处。`,
      `「${present.name}」像一面湖水，表面倒映着天空的颜色，而深处有你看不清的水草和游鱼。${past.meaning.split('。')[0]}。湖面不会自动变成镜面，它需要时间让自己平静下来。也许你现在能做的最重要的事，不是搅动湖水去寻找底下的答案，而是给它一点时间，让它自己澄清。`,
      `你的当下是「${present.name}」。${past.meaning.split('。')[0]}。试着把手掌轻轻放在这张牌上，感受它的温度。它是凉的还是暖的？粗糙的还是光滑的？这些细微的感受比任何标签都更能告诉你：此刻，我在这里，我正在经历这个。`
    ];

    const futureParagraphs = [
      `右边这张「${future.name}」是远方山脊上隐约能看到的一抹轮廓，还不是山，只是轮廓。${past.meaning.split('。')[0]}。这条通往山脊的路你还没走过，但你不需要现在就看清山顶的每一棵树。只要知道那个方向有光，而且光是暖的，就已经足够让你在今天晚上睡个好觉了。`,
      `「${future.name}」不是一扇已经打开的门，而是门缝下面透进来的一线光。你知道光的那边有东西，但你不确定是什么。${past.meaning.split('。')[0]}。不确定其实是一个礼物，它让可能性保持柔软。你还有时间去感受、去试探、去选择自己靠近那道光的步伐。`,
      `抬眼看向「${future.name}」，像在秋天望向窗外那棵还没变红的枫树。${past.meaning.split('。')[0]}。你不需要催促叶子变色，季节会替你做这件事。你能做的只是在窗边多看它几眼，让它知道有人在等它慢慢变成它自己。`
    ];

    const outros = [
      `从「${past.name}」走到「${present.name}」再望向「${future.name}」，这不是一条直线，是一段你在时间里留下的弧。弧线的起点已经凝固成了你的一部分，弧线的中点是此刻正在呼吸的你，弧线的另一端还是柔软的、可以被风吹成不同方向的形状。三条时间线不是用来解的题，是用来感受的质地。你把它们收进口袋，继续过好今天。`,
      `三张牌看完了，但它们在你心里的回声才刚刚开始。也许今天晚上入睡前，你会忽然想起「${past.name}」曾经教会你的一件事。也许明天早上刷牙的时候，「${present.name}」的温度会忽然清晰起来。也许后天走在路上，「${future.name}」的方向会让你在某个路口不自觉地放慢了脚步。牌的力量不只在翻开的那一刻，更在你合上它们之后，一切仍在你体内继续流动。`,
      `「${past.name}」教会了你一件事，「${present.name}」正陪着你体验一件事，「${future.name}」邀请你走向一件事。三件事串在一起，是你此刻全部的存在。过去没有浪费，此刻不是意外，未来不是幻觉。而你——站在这三者之间的那个你——是所有意义发生的地方。`
    ];

    const sections = [
      this.pick('3I', intros),
      ...(crossTexts.length > 0 ? [this.pick('3X', crossTexts)] : []),
      this.pick('3P', pastParagraphs),
      this.pick('3N', presentParagraphs),
      this.pick('3F', futureParagraphs),
      this.pick('3O', outros)
    ];
    return sections.join('\n\n');
  },

  readCeltic(cards) {
    this.saveCurrentReading(cards);
    const core = cards[0], block = cards[1], root = cards[2];
    const pastFar = cards[3], pastNear = cards[4], near = cards[5];
    const self = cards[6], env = cards[7], hope = cards[8], outcome = cards[9];
    const refs = this.detectCrossRefs(cards);
    const crossTexts = this.crossRefText(refs, cards);

    const intros = [
      `凯尔特十字在你面前铺开了。十张牌像十盏被逐一点亮的小灯，它们围成一个圆，而你站在圆的中央。你不必同时看清每一盏灯的光，有些灯照亮的是你熟悉的角落，有些照向你很久没有回头看过的地方，还有些光太远太淡，需要你多站一会儿才能分辨出它的颜色。`,
      `这是一个古老的牌阵，它不急。它有十张牌的时间来慢慢展开你此刻处境的每一个切面，像一朵花在延时镜头里缓缓打开它的花瓣。你不需要分析每一瓣的形状，只需要坐在花的面前，让它用自己的节奏向你展示一个完整的姿态。`
    ];

    const body = [
      `圆心的「${core.name}」是这一切涟漪的起点。${core.meaning.split('。')[0]}。它像一块石头被投入了静止的水面，你此刻感受到的每一次波动，都从这里出发，一圈一圈地向外扩散。`,
      `而「${block.name}」横在涟漪扩散的路径上。${block.meaning.split('。')[0]}。有时候阻碍不是一堵墙，更像是一道让你放慢脚步的门槛。跨过去之前，你不得不低头看一眼脚下的石头——也许就是这低头的一眼，让你发现了之前匆匆走过时忽略的东西。`,
      `在所有可见的波澜之下，「${root.name}」安静地躺在水底。${root.meaning.split('。')[0]}。它是你的地基，是那些你已经很久没有主动想起、却依然在暗处支撑着今天一切的力量。根基不说话，但它一直在。`,
      `过去在两张牌中分成了两个声部。远处的「${pastFar.name}」像一段正在退远的旋律，${pastFar.meaning.split('。')[0]}，它的音量越来越轻，但余音还在空气中飘着。近处的「${pastNear.name}」则还在你的耳边，${pastNear.meaning.split('。')[0]}。它们一远一近、一轻一重，共同构成了你走到今天的所有脚步声。`,
      `不久之后「${near.name}」会靠近你。${near.meaning.split('。')[0]}。它像一封还在路上的信，你还没收到，但已经能感觉到寄信人的笔迹在纸上留下的凹痕。`,
      `你此刻的姿态被「${self.name}」诚实地映照出来。${self.meaning.split('。')[0]}。它不一定是你理想的自己，但它是真实的自己。而周遭的世界在「${env.name}」的笼罩下，${env.meaning.split('。')[0]}。内外之间或许有张力，但张力也是一种能量，它可以被感知、被调整，而不是被对抗。`,
      `你心底深处，「${hope.name}」同时装着期待和不安。${hope.meaning.split('。')[0]}。人的心本来就可以同时容下两种截然不同的感受，就像一片天空可以同时有阳光和乌云。它们不需要彼此否定。`,
      `最后，「${outcome.name}」出现在十字的终点。${core.meaning.split('。')[0]}。它不是一个写好的结局，而是所有能量在此刻自然汇聚之后，指出的一个大致的方向。方向不是命运，方向是你看着地图时心里浮现的那条路线。你可以沿着它走，也可以在下一个路口改道。你是看地图的人，地图不替你走路。`
    ];

    const outros = [
      `十张牌说完了它们的话。它们不会吵，不会催你做选择，只是在你周围安静地亮着。也许其中有一两盏灯的光芒，在接下来的几天里还会不时地在你脑海中闪一下。不是催促，是陪伴。你可以在任何时候闭上眼睛，再次回到这个被十盏小灯照亮的圆形房间里。`,
      `凯尔特十字给你的，从来不是一个可以被一句话总结的答案。它更像是一张全景照片，让你从高处俯瞰自己此刻的处境。看清了全景之后，有些路会变得更清晰，有些路会自然消失。而那些清晰的路，会在你心里慢慢亮起来。`
    ];

    return [
      this.pick('cI', intros),
      ...(crossTexts.length > 0 ? [this.pick('cX', crossTexts)] : []),
      ...body,
      this.pick('cO', outros)
    ].join('\n\n');
  },

  readRelationship(cards) {
    this.saveCurrentReading(cards);
    const self = cards[0], other = cards[1], essence = cards[2];
    const bridge = cards[3], direction = cards[4];
    const refs = this.detectCrossRefs(cards);
    const crossTexts = this.crossRefText(refs, cards);

    const intros = [
      `五张牌在你们之间展开，像五根被风轻轻拨动的弦。每一根弦都连着你们各自的一端，中间隔着一段看不见的空间。这五张牌不是来评判弹得好不好，只是帮你听清楚此刻弦上正在响着的是什么音。`,
      `关系的问题很少能用一个简单的词来回答。这五张牌也不打算给你一个词。它们更像是五面被细心擦拭过的镜子，从不同的角度让你看见这段关系的轮廓。镜子不会告诉你该怎么做，但它会让你看清自己站的位置、对方的位置，以及你们之间那条看不见的线的质地。`
    ];

    const body = [
      `第一面镜子映出的是你。「${self.name}」像一面平静的水面，倒映着你此刻在这段关系里的样子。${self.meaning.split('。')[0]}。这是你带进来的全部——你的期待像浮在水面上的花瓣，你的防线像水底沉默的石头，你的温柔像水面上一圈一圈扩散的波纹。先看见自己，是看清一切关系的第一步。`,

      `第二面镜子转向了对方。「${other.name}」给了你一个窗口，去眺望那片你无法完全踏入的领土。${other.meaning.split('。')[0]}。你站在他的世界的边界上，透过牌面的光，你能看到一些轮廓，但永远无法看清全部。理解不等于进入，看见不等于掌控。有时候，承认自己无法完全理解另一个人，反而是一种更深的尊重。`,

      `「${essence.name}」是你们之间那道看不见的线。${self.meaning.split('。')[0]}。有些关系的线是丝做的，柔软而有弹性，拉远了还会轻轻弹回来。有些关系的线是藤编的，粗粝但结实。有些关系的线是一根细细的蛛丝，美得让人屏息，但经不起一阵大风。知道自己握着的是什么质地的线，才知道该用多大的力气去牵。`,

      `「${bridge.name}」是架在你们之间的桥。${bridge.meaning.split('。')[0]}。桥本身不会催促你走过去，也不会拦住你不让你走。它只是在那里，安静地承载着你们之间所有已经发生的对话、未说出口的话、已经迈出的半步和还在犹豫的另外半步。桥不是用来评价的，是用来被看见的。`,

      `「${direction.name}」是此刻风吹的方向。${direction.meaning.split('。')[0]}。风不等于路，方向不等于结局。它只是告诉你，以现在这样站着、这样呼吸、这样看对方的姿态，你们之间正在自然地往哪个方向流动。知道了风向，你便可以问自己：我想顺着风走，还是逆着风站，还是等风变。`
    ];

    const outros = [
      `五张牌说完了，但关系的故事远远没有结束。牌给你的不是结论，是一瞬的清晰。这种清晰可能会在接下来的几天里慢慢模糊，也可能在你和对方某一次不经意的对视中忽然又变得透明。你不需要记住每一张牌说了什么，只需要记住你在看到某一张牌时心里微微一动的那种感觉。那个感觉，是最真实的指引。`,
      `谢谢你和这些牌一起度过这段时间。现在把注意力从牌上移开，回到你自己的呼吸里，回到你和对方之间那些真实发生过的瞬间。牌已经完成了它的工作，接下来的，是生活本身。`
    ];

    return [
      this.pick('rI', intros),
      ...(crossTexts.length > 0 ? [this.pick('rX', crossTexts)] : []),
      ...body,
      this.pick('rO', outros)
    ].join('\n\n');
  }
};

window.TarotEngine = TarotEngine;
