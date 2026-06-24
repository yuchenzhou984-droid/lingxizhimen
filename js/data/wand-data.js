const WAND_ENERGY = {
  blaze: {
    id: 'blaze',
    name: '炽热',
    element: '火',
    core: '雷击木',
    coreDesc: '一段被闪电击中过的古木，劈开的纹理中封存着天空之火',
    decoration: '火焰藤',
    decorationDesc: '一缕细长的赤红色藤蔓，触感温暖，在指尖轻轻搏动',
    method: '日蚀时分，以七支烛火环绕淬炼',
    trait: '勇敢',
    traitDesc: '你不必没有恐惧。带着恐惧依然向前，那才是勇敢真正的样子',
    magicDomain: '行动与变革魔法——推动停滞、点燃勇气、打破困局',
    length: '约25cm，稍短有力',
    lengthDesc: '像一句短促的咒语，出手即达。不犹豫的能量，天生为破局而生'
  },
  flow: {
    id: 'flow',
    name: '流动',
    element: '水',
    core: '深海珍珠',
    coreDesc: '千年珍珠贝孕育的莹白珍珠，蕴含着潮汐的古老记忆',
    decoration: '月光银铃',
    decorationDesc: '三颗小巧的银铃，随魔杖挥动发出泉水般的声音',
    method: '满月之下，将魔杖浸入月光映照的泉水中',
    trait: '温柔',
    traitDesc: '真正的强大不是坚硬。是水一样，遇到什么形状都能容纳，但永远不会被折断',
    magicDomain: '情感与直觉魔法——洞悉人心、修复关系、感知能量',
    length: '约30cm，柔韧修长',
    lengthDesc: '如溪流绕过指尖，绵长不断。适合那些需要慢慢展开、细细浸润的魔法'
  },
  clarity: {
    id: 'clarity',
    name: '清透',
    element: '风',
    core: '琥珀',
    coreDesc: '数千万年前的古老树脂，内部隐约可见封存的远古空气与微光',
    decoration: '风刻符文环',
    decorationDesc: '一枚刻满古老文字的细环，上面的符号似曾相识',
    method: '山顶之巅，在风中高举魔杖，以七次深长呼吸完成祝圣',
    trait: '敏锐',
    traitDesc: '你能觉察别人忽略的细节、听见弦外之音。这份敏锐是你最珍贵的天赋',
    magicDomain: '智慧与沟通魔法——传递想法、获取知识、连接灵感',
    length: '约28cm，轻盈灵动',
    lengthDesc: '轻如风中的羽毛，准如蜂鸟的喙尖。在细微之处，见真章'
  },
  solid: {
    id: 'solid',
    name: '稳固',
    element: '土',
    core: '陨铁',
    coreDesc: '曾在宇宙中穿行亿万年的铁陨石碎片，来自星辰',
    decoration: '翡翠铜编',
    decorationDesc: '墨绿翡翠与古铜丝交织缠绕，握在手心沉实温润',
    method: '将魔杖埋入古老的橡树下，以七日大地能量滋养',
    trait: '坚韧',
    traitDesc: '你不必一直坚强。但你知道自己是那种倒下去也会慢慢站起来的人。每一道裂痕，最终都会长成年轮',
    magicDomain: '守护与滋养魔法——建立屏障、稳固能量、培育成长',
    length: '约33cm，沉实稳重',
    lengthDesc: '握在掌心沉如一段老树之根。不急不缓，所到之处万物归位'
  },
  depth: {
    id: 'depth',
    name: '深邃',
    element: '暗',
    core: '黑曜石',
    coreDesc: '火山熔岩瞬间冷却形成的天然玻璃，被誉为黑暗之镜',
    decoration: '黑曜石镶嵌',
    decorationDesc: '魔杖顶端镶嵌一颗水滴形黑曜石，深不见底',
    method: '子夜时分，在暗月之下以静默仪式注入能量',
    trait: '通透',
    traitDesc: '你穿透表象看到本质的能力，让别人有时觉得你有点怕人。但这也是最深的礼物：你无法被谎言包围',
    magicDomain: '转化与深层魔法——影子工作、揭开真相、能量转化',
    length: '约35cm，细长神秘',
    lengthDesc: '像暗夜中伸出的一根手指，无声触碰那些别人不敢凝望的角落'
  },
  radiance: {
    id: 'radiance',
    name: '光明',
    element: '光',
    core: '白水晶',
    coreDesc: '大地深处孕育的六棱晶柱，天然的净光导体',
    decoration: '水晶花簇',
    decorationDesc: '顶端绽放一簇透明的小水晶花，光线下折射出细碎彩虹',
    method: '黎明之际，让第一缕阳光穿透魔杖，灌注新生之光',
    trait: '治愈',
    traitDesc: '你不必完美才能帮到别人。你的存在本身就有一种让人平静下来的能量，像一杯刚好温度的水',
    magicDomain: '疗愈与净化魔法——能量修复、空间净化、祝福加持',
    length: '约30cm，匀称温暖',
    lengthDesc: '触手温润如晨光，不刺眼也不灼人。适合用来温柔地改变事物'
  }
};

const WAND_WOOD = {
  fire: {
    name: '赤焰檀木',
    desc: '纹理如火焰流动，触感温热。产自火山脚下的古老檀木，是唯一一种在岩浆附近依然生长的魔法木材'
  },
  water: {
    name: '月光柳',
    desc: '银白色树皮在月光下泛着珍珠般的光泽。生长于圣泉边的垂柳，枝条浸染了水流的智慧'
  },
  wind: {
    name: '凌云杉',
    desc: '木质轻盈却坚韧，细看木纹如风痕。生于峭壁之上的云杉，常年被山风吹拂'
  },
  earth: {
    name: '古橡',
    desc: '木质密实厚重，年轮深刻。从活了千年的橡树自然脱落的枝干，承载了大地的记忆'
  },
  darkmoon: {
    name: '暗影乌木',
    desc: '通体漆黑如夜，木纹中隐约有暗紫色脉络。只在无月之夜被闪电击中的乌木才能用于魔杖'
  },
  lightheal: {
    name: '光纹白蜡',
    desc: '木质温润如玉，在光线下能看到金色细纹。白蜡木本身就具有净化属性'
  }
};
