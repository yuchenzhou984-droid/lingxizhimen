const TestEngine = {
  currentTest: null,
  currentQuestion: 0,
  answers: [],
  scores: {},

  init(witchTypeFromTest1) {
    this.currentTest = 'test1';
    this.currentQuestion = 0;
    this.answers = [];
    this.scores = {};
    if (witchTypeFromTest1) App.witchType = witchTypeFromTest1;
    this.render();
  },

  initTest2() {
    this.currentTest = 'test2';
    this.currentQuestion = 0;
    this.answers = [];
    this.scores = {};
    document.querySelectorAll('#app .page').forEach(function(p) { p.classList.remove('active'); });
    var target = document.getElementById('page-test2');
    if (target) target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  },

  selectAnswer(optionIndex) {
    const questions = this.currentTest === 'test1' ? TEST1_QUESTIONS : TEST2_QUESTIONS;
    const question = questions[this.currentQuestion];
    const option = question.options[optionIndex];

    this.answers.push(optionIndex);

    if (this.currentTest === 'test1') {
      for (const [type, points] of Object.entries(option.scores)) {
        this.scores[type] = (this.scores[type] || 0) + points;
      }
    } else if (this.currentTest === 'test2') {
      if (question.id === 1) {
        App.witchType = option.scores.witchType;
      } else {
        for (const [energy, points] of Object.entries(option.scores)) {
          this.scores[energy] = (this.scores[energy] || 0) + points;
        }
      }
    }

    this.currentQuestion++;

    if (this.currentQuestion < questions.length) {
      this.renderQuestion();
      document.getElementById(this.currentTest === 'test1' ? 'test1Inner' : 'test2Inner').scrollTop = 0;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.showResult();
    }
  },

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  render() {
    const container = document.getElementById(
      this.currentTest === 'test1' ? 'test1Container' : 'test2Container'
    );
    container.innerHTML = `
      
      <div id="${this.currentTest === 'test1' ? 'test1Inner' : 'test2Inner'}"></div>
    `;
    this.renderQuestion();
  },

  renderQuestion() {
    const questions = this.currentTest === 'test1' ? TEST1_QUESTIONS : TEST2_QUESTIONS;
    const question = questions[this.currentQuestion];
    const shuffledOptions = this.shuffle(question.options.map((opt, i) => ({ ...opt, _origIndex: i })));
    const total = questions.length;
    const progress = ((this.currentQuestion) / total) * 100;


    const container = document.getElementById(this.currentTest === 'test1' ? 'test1Inner' : 'test2Inner');
    const testTitle = this.currentTest === 'test1' ? '能量类型测试' : '专属魔杖定制';

    container.innerHTML = `
      <div class="test-header">
        <h2 class="test-title typewriter-text-cn">${testTitle}</h2>
        <div class="test-counter">${this.currentQuestion + 1} / ${total}</div>
      </div>
      <div class="progress-bar">
        <div class="progress-bar-fill" style="width:${progress}%"></div>
      </div>
      <div class="test-question-card engraved-border">
        <p class="question-text">${question.text}</p>
        <div class="options-list">
          ${shuffledOptions.map((opt, i) => `
            <button class="option-btn" onclick="TestEngine.selectAnswer(${opt._origIndex})">
              <span class="option-letter">${String.fromCharCode(65 + i)}</span>
              <span class="option-text">${opt.text}</span>
            </button>
          `).join('')}
        </div>
      </div>
      <div class="engraved-divider"></div>
    `;
  },

  showResult() {
    const container = document.getElementById(
      this.currentTest === 'test1' ? 'test1Container' : 'test2Container'
    );

    if (this.currentTest === 'test1') {
      const topType = Object.entries(this.scores).sort((a, b) => b[1] - a[1])[0][0];
      App.witchType = topType;
      const witch = WITCH_TYPES[topType];

      container.innerHTML = `

        <div class="result-page">
          <div class="witch-result-top">
            <div class="witch-result-info">
              <div class="result-header" style="border-color:${witch.color}">
                <span class="result-element-icon" style="color:${witch.color}">${witch.elementIcon}</span>
                <h2 class="result-type-name" style="color:${witch.color}">${witch.name}</h2>
                <p class="result-element">代表元素：${witch.element}</p>
              </div>
              <div class="result-keywords">
                ${witch.keywords.map(k => `<span class="keyword-tag">${k}</span>`).join('')}
              </div>
            </div>
            <div class="witch-result-image">
              <img src="女巫画像/${witch.name}.webp" alt="${witch.name}" />
            </div>
          </div>

          <div class="card engraved-border result-section">
            <h3>能量解析</h3>
            <p>${witch.energy}</p>
          </div>

          <div class="card engraved-border result-section">
            <h3>魔法神灵 · ${witch.deity}</h3>
            <p>${witch.deityDesc}</p>
          </div>

          <div class="card engraved-border result-section">
            <h3>能量哲学</h3>
            <blockquote class="philosophy-quote">${witch.philosophy}</blockquote>
            <p>${witch.philosophyDetail}</p>
          </div>

          <div class="card engraved-border result-section">
            <h3>常用魔法</h3>
            <ul class="magic-list">
              ${witch.magic.map(m => `<li>${m}</li>`).join('')}
            </ul>
          </div>

          <div class="result-actions">
            <button class="btn btn-primary" onclick="TestEngine.initTest2()">
              继续 → 定制专属魔杖
            </button>
          </div>
        </div>
      `;
    } else {
      this.showWandResult(container);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  showWandResult(container) {
    const witch = WITCH_TYPES[App.witchType];
    const wood = WAND_WOOD[App.witchType];

    const topEnergy = Object.entries(this.scores)
      .filter(([k]) => k !== 'witchType')
      .sort((a, b) => b[1] - a[1])[0];

    const energyKey = topEnergy ? topEnergy[0] : 'blaze';
    const energy = WAND_ENERGY[energyKey];

    const sameSource = (App.witchType === 'fire' && energyKey === 'blaze') ||
      (App.witchType === 'water' && energyKey === 'flow') ||
      (App.witchType === 'wind' && energyKey === 'clarity') ||
      (App.witchType === 'earth' && energyKey === 'solid') ||
      (App.witchType === 'darkmoon' && energyKey === 'depth') ||
      (App.witchType === 'lightheal' && energyKey === 'radiance');

    const combinedTrait = sameSource
      ? `「${witch.keywords[0]}之心」——${energy.traitDesc.replace('你不必', '它不教你收敛，反而强化了你与生俱来的')}`
      : `「${witch.name.split('女巫')[0]}的${energy.trait}之光」——${witch.energy.split('。')[0]}。而你的魔杖又赋予了你${energy.trait}的纹理。`;

    const traitTitle = sameSource
      ? `烈焰之心`
      : `${witch.name.split('女巫')[0]}的${energy.trait}之光`;

    container.innerHTML = `
      
      <div class="result-page">
        <div class="wand-visual">
          <div class="wand-silhouette">✨</div>
        </div>

        <h2 class="wand-title typewriter-text-cn">你的专属魔杖</h2>

        <div class="card engraved-border">
          <div class="wand-material-row">
            <span class="material-label">材质</span>
            <span class="material-value">${wood.name}</span>
          </div>
          <p class="material-desc">${wood.desc}</p>

          <div class="engraved-divider"></div>

          <div class="wand-material-row">
            <span class="material-label">核心</span>
            <span class="material-value">${energy.core}</span>
          </div>
          <p class="material-desc">${energy.coreDesc}</p>

          <div class="engraved-divider"></div>

          <div class="wand-material-row">
            <span class="material-label">装饰</span>
            <span class="material-value">${energy.decoration}</span>
          </div>
          <p class="material-desc">${energy.decorationDesc}</p>
        </div>

        <div class="card engraved-border">
          <h3>制作方法</h3>
          <p>${energy.method}</p>
        </div>

        <div class="card engraved-border">
          <h3>魔杖形态</h3>
          <p><strong>${energy.length}</strong></p>
          <p>${energy.lengthDesc}</p>
        </div>

        <div class="card engraved-border result-section">
          <h3>魔杖特质 · ${traitTitle}</h3>
          <p>${energy.traitDesc}</p>
        </div>

        <div class="card engraved-border result-section">
          <h3>擅长魔法领域</h3>
          <p>${energy.magicDomain}</p>
        </div>

        <div class="result-actions">
          <button class="btn btn-primary" onclick="navigateTo('test1')">
            重新测试女巫类型
          </button>
          <button class="btn" onclick="navigateTo('tarot')">
            去塔罗占卜
          </button>
        </div>
      </div>
    `;
  }
};
window.TestEngine = TestEngine;
