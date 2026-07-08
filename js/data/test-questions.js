const TEST1_QUESTIONS = [
  {
    id: 1,
    type: 'situational',
    text: '深夜，你走进一座被遗忘的古老森林。月光从枝叶间洒下银色的碎片，四周阴影渐浓，脚下的路在消失。你的第一反应是？',
    options: [
      { text: '点亮提灯，火光劈开黑暗——别停下，继续深入。', scores: { fire: 2, wind: 1 } },
      { text: '停在原地闭眼，让耳朵代替眼睛——风声会告诉你方向。', scores: { water: 2, darkmoon: 1 } },
      { text: '找一棵最粗壮的古树，手掌贴着树皮——让最年长的生命给你答案。', scores: { earth: 2, water: 1 } },
      { text: '从掌心送出一缕温润的光，不刺眼，刚好照亮脚下。', scores: { lightheal: 2, earth: 1 } }
    ]
  },
  {
    id: 2,
    type: 'personality',
    text: '当面临一个会让生活转向的重要决定时，你内心深处最信任什么？',
    options: [
      { text: '我的行动力——先迈出一步，错了再调整。', scores: { fire: 2, earth: 1 } },
      { text: '我的直觉——身体和情绪比大脑更早知道答案。', scores: { water: 2, lightheal: 1 } },
      { text: '我的逻辑——拆解问题、收集信息、推理出结论。', scores: { wind: 2, darkmoon: 1 } },
      { text: '我的洞察——我能看到事物之间隐藏的关联和真相。', scores: { darkmoon: 2, wind: 1 } }
    ]
  },
  {
    id: 3,
    type: 'situational',
    text: '魔法市集的黄昏，空气中飘着肉桂和旧羊皮纸的气味。一个七八岁的小女孩扯住你的袍角，眼眶红红的——她的黑猫丢了。你蹲下来和她平视……',
    options: [
      { text: '站起身环顾四周——然后牵起她的手说"走，我们一起找"。', scores: { fire: 2, lightheal: 1 } },
      { text: '先把她的手握在掌心，等呼吸平稳，再轻声问猫咪的特征。', scores: { water: 2, earth: 1 } },
      { text: '询问最后出现的位置和时间，快速规划路线逐一排查。', scores: { wind: 2, fire: 1 } },
      { text: '观察地面的脚印和细微痕迹——你的眼睛不放过任何线索。', scores: { darkmoon: 2, wind: 1 } }
    ]
  },
  {
    id: 4,
    type: 'personality',
    text: '想一想你最亲近的朋友。在他们眼中，你通常是那个……？',
    options: [
      { text: '把大家从"想"变成"做"的人——有你在，计划才不永远停在纸上。', scores: { fire: 2, wind: 1 } },
      { text: '安静听你说完的人——不打断、不评判。但听完后你自己就找到了答案。', scores: { water: 2, lightheal: 1 } },
      { text: '不拐弯抹角的人——别人绕十句不敢说的，你一句话就戳穿了。', scores: { darkmoon: 2, wind: 1 } },
      { text: '风暴中不会乱的人——你在旁边，大家就觉得有锚。', scores: { earth: 2, lightheal: 1 } }
    ]
  },
  {
    id: 5,
    type: 'situational',
    text: '你的魔法导师是一位话很少的老女巫。一个雨夜，她把空白的羊皮咒语书放在你面前。她说："第一道咒语不是学来的，是从骨头里长出来的。写下来。"你拿起羽毛笔。',
    options: [
      { text: '一道打破停滞的咒语——让凝固的事物重新流动。', scores: { fire: 2, darkmoon: 1 } },
      { text: '一道照见真实的咒语——让隐藏的情感浮出水面。', scores: { water: 2, lightheal: 1 } },
      { text: '一道守护的咒语——在在意的人周围织起无形的屏障。', scores: { earth: 2, fire: 1 } },
      { text: '一道抚平创伤的咒语——让愈合从最深的裂缝开始。', scores: { lightheal: 2, water: 1 } }
    ]
  },
  {
    id: 6,
    type: 'situational',
    text: '满月悬在塔楼尖顶上，你盘腿闭眼冥想——忽然一阵风贴着耳廓划过，像是有人在你耳边说了一句话。那句话是？',
    options: [
      { text: '"别再等了。你想去的那个地方，没有比此刻更近的路了。"', scores: { fire: 2, earth: 1 } },
      { text: '"你感受到的那些，都不是错觉。你比你以为的更清醒。"', scores: { water: 2, darkmoon: 1 } },
      { text: '"答案从来不止一个。继续问下去，问本身就是你的路。"', scores: { wind: 2, fire: 1 } },
      { text: '"你低估了自己那点光能照多远。它已经照到了你看不见的地方。"', scores: { lightheal: 2, wind: 1 } }
    ]
  },
  {
    id: 7,
    type: 'personality',
    text: '每个人都会迷路——那种突然不知道自己是谁、该往哪走的时刻。什么最能让你重新找到坐标？',
    options: [
      { text: '做事——任何具体的事都行。行动会把陷在泥里的我拉出来。', scores: { fire: 2, earth: 1 } },
      { text: '安静——一个人呆着，写字、冥想、看窗外。沉默里答案会浮上来。', scores: { water: 2, darkmoon: 1 } },
      { text: '对话——找人聊天、看新书、听不同的故事。新视角吹散迷雾。', scores: { wind: 2, lightheal: 1 } },
      { text: '秩序——回到日常里，按时起床、完成小事。节奏本身就是锚。', scores: { earth: 2, water: 1 } }
    ]
  },
  {
    id: 8,
    type: 'situational',
    text: '古老图书馆的深处，你发现了一本被锁链缠绕的暗红皮革厚书。锁链没有锁眼，却紧锁着整本书。它发出低沉的嗡鸣，像被关了很久的东西等到了来人。',
    options: [
      { text: '绕锁链一圈寻找弱点——真正的封印需要勇气去打破。', scores: { fire: 2, darkmoon: 1 } },
      { text: '双手悬在书面上方，闭眼感受它的能量——是警告还是求救？', scores: { water: 2, lightheal: 1 } },
      { text: '环顾房间——墙上有没有记载？书架上有没有线索？', scores: { wind: 2, earth: 1 } },
      { text: '在石台周围用光画出保护圈——不论打开与否，先确保安全。', scores: { lightheal: 2, wind: 1 } }
    ]
  },
  {
    id: 9,
    type: 'personality',
    text: '以下四句话，哪一句最接近你内心深处对人生的理解？',
    options: [
      { text: '与其等一束光照进来，不如自己成为那团火。', scores: { fire: 2, wind: 1 } },
      { text: '万物皆有其流向。顺势而行，反而能到最远的地方。', scores: { water: 2, earth: 1 } },
      { text: '慢就是稳，稳就是快。扎根足够深的人不怕任何风暴。', scores: { earth: 2, darkmoon: 1 } },
      { text: '最深的黑暗里藏着最亮的星，和最真实的自己。', scores: { darkmoon: 2, lightheal: 1 } }
    ]
  },
  {
    id: 10,
    type: 'situational',
    text: '女巫集会的邀请函出现在枕边——紫色火漆，字迹掺了金粉。抵达森林深处的集会，你发现自己最自然地走向了……',
    options: [
      { text: '篝火圈——木柴噼啪作响，火星飞向夜空。人们击鼓、跳舞、分享冒险。', scores: { fire: 2, darkmoon: 1 } },
      { text: '月光泉池——静水倒映满月。人们低声交谈、解读星盘、交换梦境。', scores: { water: 2, wind: 1 } },
      { text: '草药工坊——长桌上摆满叶片和水晶。人们辨识植物、编织草药束。', scores: { earth: 2, lightheal: 1 } },
      { text: '洒满月光的庭院——有人练疗愈、有人冥想。有人微笑招手邀你一起做祝福仪式。', scores: { lightheal: 2, water: 1 } }
    ]
  },
  {
    id: 11,
    type: 'situational',
    text: '雨夜。敲门声轻得差点以为是雨打门板。门口站着一个陌生旅人——斗篷湿透，帽檐压低。他抬手扶帽檐时，你注意到他手背上有暗色纹路，从皮肤下渗出，正在扩散。',
    options: [
      { text: '请他进屋，同时不动声色地在门框画保护咒——好客不等于没有界限。', scores: { fire: 2, earth: 1 } },
      { text: '先注视他的眼睛——嘴可以说谎，但眼睛里的东西骗不了人。', scores: { water: 2, darkmoon: 1 } },
      { text: '靠在门边自然地聊几句——闲聊中泄露的比他自己以为的更多。', scores: { wind: 2, water: 1 } },
      { text: '转身冲了一杯热茶——水里融了一点净化能量，先做一层保护。', scores: { lightheal: 2, fire: 1 } }
    ]
  },
  {
    id: 12,
    type: 'personality',
    text: '每个人心里都有自己的答案。你觉得魔法的本质是什么？',
    options: [
      { text: '魔法是意志——把不可能从心里抹掉，用行动把想象锻造成现实。', scores: { fire: 2, earth: 1 } },
      { text: '魔法是感受——感知万物间看不见的丝线，用轻柔的方式去拨动。', scores: { water: 2, lightheal: 1 } },
      { text: '魔法是连接——知道自己属于更大的整体，根连着根、土连着土。', scores: { earth: 2, darkmoon: 1 } },
      { text: '魔法是转化——把阴影变成燃料、伤口变成智慧、恐惧变成敬畏。', scores: { darkmoon: 2, wind: 1 } }
    ]
  }
];

const TEST2_QUESTIONS = [
  {
    id: 1,
    type: 'link',
    text: '在打造魔杖之前，请先确认你的身份。你的女巫类型是？',
    options: [
      { text: '火焰女巫', scores: { witchType: 'fire' } },
      { text: '水镜女巫', scores: { witchType: 'water' } },
      { text: '风语女巫', scores: { witchType: 'wind' } },
      { text: '大地女巫', scores: { witchType: 'earth' } },
      { text: '暗月女巫', scores: { witchType: 'darkmoon' } },
      { text: '光愈女巫', scores: { witchType: 'lightheal' } }
    ]
  },
  {
    id: 2,
    type: 'situational',
    text: '修炼室里，你第一次尝试"感知之触"——用掌心探查物体本质。面前四件物品盖着布，其中一件让你掌心产生了最强烈的反应。你感受到什么？',
    options: [
      { text: '掌心像被火舌舔了一下——灼热从手腕窜到指尖，手在发颤。', scores: { blaze: 2, clarity: 1 } },
      { text: '手心湿润微凉，像浸入看不见的水——你不是在碰它，是在流入它。', scores: { flow: 2, depth: 1 } },
      { text: '掌根传来沉稳的钝重感，像按住埋在土里很久的石头——让人安心。', scores: { solid: 2, radiance: 1 } },
      { text: '手心变暖了，像冬日靠近壁炉——你的能量和那件东西轻轻共振。', scores: { radiance: 2, flow: 1 } }
    ]
  },
  {
    id: 3,
    type: 'situational',
    text: '在堆满魔杖原料的储藏室，你蒙上眼睛，只凭双手寻找那件"属于你"的装饰物。手指掠过木架和丝绒托盘，最后在一件东西上停住了。让你停下的，是哪种触感？',
    options: [
      { text: '一根带着温度的细藤蔓——不像植物，像微烫的血管在轻轻搏动。', scores: { blaze: 2, solid: 1 } },
      { text: '三颗小而圆润的银铃——指尖一碰发出轻响，像远处泉水滴落石板。', scores: { flow: 2, radiance: 1 } },
      { text: '一枚刻满符号的细环——指腹摸过去，不认识却觉得似曾相识。', scores: { clarity: 2, blaze: 1 } },
      { text: '一颗冰凉光滑的水滴形石头——不反光，却觉得里面有能量在流动。', scores: { depth: 2, clarity: 1 } }
    ]
  },
  {
    id: 4,
    type: 'situational',
    text: '制作魔杖的最后一步：注入生命力。祝圣方式不是学来的，是身体自己知道的。双手握住半成品的魔杖、闭上眼，身体最自然地想做什么？',
    options: [
      { text: '低声吟唱——声音从胸腔涌出，带着热度的节奏，像鼓点，像火焰。', scores: { blaze: 2, depth: 1 } },
      { text: '把魔杖贴在心口，让它贴着心跳——不念咒也不动作，只是等。', scores: { flow: 2, solid: 1 } },
      { text: '推开窗，把魔杖举到夜风中——不是你在注入什么，是风在替你写。', scores: { clarity: 2, flow: 1 } },
      { text: '熄掉所有灯，在黑暗中手掌贴着魔杖慢慢滑过——有了东西在流动。', scores: { depth: 2, radiance: 1 } }
    ]
  },
  {
    id: 5,
    type: 'situational',
    text: '导师递给你一根素木魔杖，让你对着烛火试一个最基础的法术——让它微微晃动。你接过魔杖，最自然的握持和挥动方式是？',
    options: [
      { text: '短促有力的一挑——手腕向内，快速上挑。烛火猛地蹿高了一截。', scores: { blaze: 2, clarity: 1 } },
      { text: '缓慢连续的一个弧——从下往上，像在水里划桨。烛火轻轻左右摇曳。', scores: { flow: 2, radiance: 1 } },
      { text: '双手握住，稳稳水平一挥——像用剑但更慢。蜡烛往下沉了一截。', scores: { solid: 2, depth: 1 } },
      { text: '几乎没动——只把魔杖尖端对准烛火。烛火收缩成一团蓝幽幽的火核。', scores: { depth: 2, blaze: 1 } }
    ]
  },
  {
    id: 6,
    type: 'situational',
    text: '魔杖制作完成，躺在天鹅绒垫子上等待苏醒。导师说，把手放上去，接收它的第一个"性格信号"——是它向你介绍自己。掌心覆上木头的瞬间，你脑子里浮现的第一个词是什么？',
    options: [
      { text: '"勇敢"——不必没有恐惧。带着恐惧依然向前，才是勇敢。', scores: { blaze: 2, solid: 1 } },
      { text: '"温柔"——真正的强大不是坚硬，是能容纳万物的柔软。', scores: { flow: 2, radiance: 1 } },
      { text: '"敏锐"——你能觉察别人忽略的细节，那是你最珍贵的天赋。', scores: { clarity: 2, depth: 1 } },
      { text: '"坚韧"——倒下去也会慢慢站起来。每一道裂痕都会长成年轮。', scores: { solid: 2, flow: 1 } }
    ]
  },
  {
    id: 7,
    type: 'situational',
    text: '深夜，魔杖放在床头。半梦半醒之间，你看到一个画面——你的魔杖自己在发光。在那个画面里，你正在用魔杖做什么？',
    options: [
      { text: '站在沉默的人群中举起魔杖——冲击波散开，人们脸上的迟疑碎裂了。', scores: { blaze: 2, radiance: 1 } },
      { text: '坐在两人侧面，魔杖轻点空气——透明涟漪荡开，一堵看不见的墙消失了。', scores: { flow: 2, clarity: 1 } },
      { text: '在荒芜土地上把魔杖插入土壤——绿色涟漪扩散，草长虫鸣，土地被重新记得。', scores: { solid: 2, flow: 1 } },
      { text: '把魔杖轻轻放在一个人心口——过去的自己。金白光从心口扩散。这是疗愈。', scores: { radiance: 2, depth: 1 } }
    ]
  }
];
