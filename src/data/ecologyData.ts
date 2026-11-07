/**
 * Comprehensive Yundang Lake (筼筜湖) Ecology & Food Web Data
 * Tailored for Grade 3 primary school science curriculum.
 */

export interface FoodItem {
  id: string;
  name: string;
  category: 'algae' | 'plant' | 'zooplankton' | 'crustacean' | 'fish' | 'bird' | 'trash';
  icon: string;
  badge: string;
  description: string;
  isTrash?: boolean;
}

export interface AnimalProfile {
  id: string;
  name: string;
  species: string;
  title: string;
  trophicLevel: '生产者' | '初级消费者' | '次级消费者' | '顶级掠食者';
  habitat: '滩涂泥潭' | '碧波湖水' | '红树树冠与空中';
  accentColor: string;
  avatarBg: string;
  voiceLine: string; // e.g. "好饿呀！谁能给我好吃的？"
  eatingHappyLine: string;
  wrongFoodLine: string;
  dietTypes: string[]; // what this animal can eat (IDs of FoodItem)
  predatorIds: string[]; // who preys on this animal
  funFact: string; // Grade 3 friendly fun fact
  ecoTip: string; // Ecological importance of this animal in Yundang Lake
}

// All food items and distractors that can appear on cards
export const FOOD_ITEMS: Record<string, FoodItem> = {
  // 1. Algae & Microorganisms
  green_algae: {
    id: 'green_algae',
    name: '浮游绿藻',
    category: 'algae',
    icon: '🌱',
    badge: '绿色营养',
    description: '湖水中的微小浮游植物，靠吸收阳光和水体养分生长，是整个食物链的根本起点。',
  },
  diatoms: {
    id: 'diatoms',
    name: '滩涂硅藻',
    category: 'algae',
    icon: '🌾',
    badge: '泥沙微点心',
    description: '贴附在滩涂泥沙表层的微小藻类，是招潮蟹最爱过滤舔食的美味。',
  },
  mangrove_leaves: {
    id: 'mangrove_leaves',
    name: '红树林落叶碎屑',
    category: 'plant',
    icon: '🍂',
    badge: '湿地黄金',
    description: '秋茄等红树植物掉落的叶子腐烂分解成腐殖质，为滩涂底栖生物提供丰富养分。',
  },

  // 2. Zooplankton & Invertebrates
  daphnia: {
    id: 'daphnia',
    name: '微型水蚤',
    category: 'zooplankton',
    icon: '🫧',
    badge: '小跳蚤',
    description: '肉眼勉强可见的水中浮游动物，大口吞食绿藻，是小鱼小虾最棒的天然蛋白质。',
  },
  shrimp: {
    id: 'shrimp',
    name: '淡水小虾',
    category: 'crustacean',
    icon: '🦐',
    badge: '游水小鲜',
    description: '在红树林根系间穿梭的小虾，肉质鲜嫩，是白鹭和罗非鱼的最爱。',
  },
  small_worm: {
    id: 'small_worm',
    name: '滩涂沙蚕红虫',
    category: 'crustacean',
    icon: '🪱',
    badge: '泥中美味',
    description: '藏在湿润泥巴里的小虫，弹涂鱼用圆溜溜的大眼睛盯上它就一击必中！',
  },

  // 3. Fish & Mudskipper
  tilapia_fry: {
    id: 'tilapia_fry',
    name: '小鱼苗/鲻鱼苗',
    category: 'fish',
    icon: '🐟',
    badge: '敏捷游鱼',
    description: '在筼筜湖里游动的小鱼，成群结队，是白鹭最主要的捕食对象。',
  },
  mudskipper_card: {
    id: 'mudskipper_card',
    name: '幼年弹涂鱼',
    category: 'fish',
    icon: '🐟',
    badge: '跳跳鱼',
    description: '能在泥滩上跳跃的奇特鱼类，常被飞掠而过的小白鹭一口叼起。',
  },
  crab_fry: {
    id: 'crab_fry',
    name: '小招潮蟹',
    category: 'crustacean',
    icon: '🦀',
    badge: '红螯小蟹',
    description: '滩涂上挥舞大螯的小家伙，落单时很容易成为涉禽水鸟的美餐。',
  },

  // 4. Predators as distractors (Reversals)
  big_egret_card: {
    id: 'big_egret_card',
    name: '小白鹭本尊',
    category: 'bird',
    icon: '🕊️',
    badge: '空中天敌',
    description: '这是水鸟霸主！小鱼小蟹看到它得赶紧逃跑，根本吃不下它！',
  },
  large_tilapia: {
    id: 'large_tilapia',
    name: '成年大罗非鱼',
    category: 'fish',
    icon: '🐠',
    badge: '体型巨大',
    description: '足足有一两斤重的大鱼，招潮蟹和水蚤根本惹不起它！',
  },

  // 5. Environmental Traps (Trash)
  plastic_bag: {
    id: 'plastic_bag',
    name: '白色塑料袋',
    category: 'trash',
    icon: '🛍️',
    badge: '致命垃圾',
    description: '不可降解的塑料袋在水中漂浮，水鸟和鱼类误食会阻塞消化道导致窒息！',
    isTrash: true,
  },
  cigarette_butt: {
    id: 'cigarette_butt',
    name: '废弃烟头',
    category: 'trash',
    icon: '🚬',
    badge: '有毒废物',
    description: '烟头含有尼古丁和焦油有毒化学物质，会严重毒害水质，让小鱼小虾中毒。',
    isTrash: true,
  },
  battery: {
    id: 'battery',
    name: '废旧重金属电池',
    category: 'trash',
    icon: '🔋',
    badge: '剧毒污染',
    description: '一粒纽扣电池就能污染60万升水！绝对不能丢进筼筜湖！',
    isTrash: true,
  },
  plastic_straw: {
    id: 'plastic_straw',
    name: '废弃塑料吸管',
    category: 'trash',
    icon: '🥤',
    badge: '锋利垃圾',
    description: '塑料吸管容易卡在水鸟的喉咙或鼻腔中，造成终身伤残。',
    isTrash: true,
  },
};

// The core animal profiles featured in the game
export const ANIMAL_PROFILES: AnimalProfile[] = [
  {
    id: 'fiddler_crab',
    name: '弧边招潮蟹',
    species: '节肢动物门 / 甲壳纲',
    title: '滩涂小鼓手 · 招潮蟹',
    trophicLevel: '初级消费者',
    habitat: '滩涂泥潭',
    accentColor: '#f97316',
    avatarBg: '#ffedd5',
    voiceLine: '我正挥舞大钳子招潮呢，肚子咕咕叫了，沙泥里有什么好吃的？',
    eatingHappyLine: '哇塞！沙泥里的硅藻和红树林腐殖质太香了，滤食真美味！',
    wrongFoodLine: '哎呀！我只是一只小螃蟹，吞不下大鱼，也绝不吃垃圾哦！',
    dietTypes: ['diatoms', 'mangrove_leaves'],
    predatorIds: ['little_egret', 'grey_heron'],
    funFact: '雄性招潮蟹有一只巨大的红色螯肢，不仅能求偶示威，还像在招引潮水！它们吃东西时把泥土送进嘴里，只舔走微小的硅藻，再把泥团吐出来成小泥球！',
    ecoTip: '招潮蟹在滩涂上打洞翻土，促进红树林根系通气呼吸，是湿地里的“小小翻土机”。',
  },
  {
    id: 'mudskipper',
    name: '大弹涂鱼',
    species: '脊索动物门 / 辐鳍鱼纲',
    title: '特技爬树鱼 · 弹涂鱼',
    trophicLevel: '次级消费者',
    habitat: '滩涂泥潭',
    accentColor: '#10b981',
    avatarBg: '#d1fae5',
    voiceLine: '我在滩涂上跳累啦！两只眼睛骨碌碌转，谁有美味小点心？',
    eatingHappyLine: '吸溜！泥里的小水蚤和沙蚕红虫太鲜脆了，补充体力跳更高！',
    wrongFoodLine: '呜呜！大白鹭会把我吃掉的，别给我喂天敌或塑料垃圾呀！',
    dietTypes: ['daphnia', 'small_worm', 'diatoms'],
    predatorIds: ['little_egret', 'grey_heron'],
    funFact: '弹涂鱼虽然是鱼，但胸鳍像强壮的手臂，不仅能在泥上跑跑跳跳，甚至能爬到红树林的树根上！它们含着一口水就能在陆地上呼吸好久！',
    ecoTip: '弹涂鱼是湿地食物链中承上启下的关键物种，把底栖小生物的能量传递给大水鸟。',
  },
  {
    id: 'tilapia_fish',
    name: '筼筜罗非鱼',
    species: '脊椎动物门 / 辐鳍鱼纲',
    title: '水下游骑兵 · 罗非鱼',
    trophicLevel: '次级消费者',
    habitat: '碧波湖水',
    accentColor: '#0284c7',
    avatarBg: '#e0f2fe',
    voiceLine: '摆摆尾巴游在清澈水波里，水下有哪些营养丰富的浮游大餐？',
    eatingHappyLine: '噗噜噜！游动的水蚤和嫩绿的水藻一口吞下，鳞片都在闪闪发光！',
    wrongFoodLine: '咳咳！那是漂浮的白色塑料垃圾或天敌大鸟，吃了会肠胃堵塞的！',
    dietTypes: ['daphnia', 'green_algae', 'shrimp'],
    predatorIds: ['little_egret', 'grey_heron'],
    funFact: '罗非鱼有着极强的生命力，它们吃浮游植物和残渣，像湖水中的“水质净化过滤器”，也是白鹭最丰盛的餐点。',
    ecoTip: '控制水体藻类过度滋生，维系筼筜湖开阔水面的水质清澈透亮。',
  },
  {
    id: 'daphnia_group',
    name: '微型水蚤群',
    species: '节肢动物门 / 枝角目',
    title: '水滴小精灵 · 浮游水蚤',
    trophicLevel: '初级消费者',
    habitat: '碧波湖水',
    accentColor: '#8b5cf6',
    avatarBg: '#ede9fe',
    voiceLine: '我们在水滴里蹦蹦跳跳，我们个子特别小，请给我们微观美食！',
    eatingHappyLine: '太棒啦！吸收光合作用的浮游绿藻是我们的最爱，肚子吃得圆滚滚！',
    wrongFoodLine: '救命呀！小虾会把我们吃掉的，快把天敌拿开，还有有毒烟头！',
    dietTypes: ['green_algae'],
    predatorIds: ['tilapia_fish', 'shrimp', 'mudskipper'],
    funFact: '水蚤身体晶莹剔透，在显微镜下甚至能看见它们小小的心脏在快速跳动！它们是水质好坏的“生物传感器”。',
    ecoTip: '以浮游藻类为食，本身又是鱼虾幼苗的口粮，是食物链中不可或缺的微观基石。',
  },
  {
    id: 'little_egret',
    name: '小白鹭',
    species: '鸟纲 / 鹈形目 / 鹭科',
    title: '厦门市鸟 · 筼筜小白鹭',
    trophicLevel: '顶级掠食者',
    habitat: '红树树冠与空中',
    accentColor: '#0d9488',
    avatarBg: '#ccfbf1',
    voiceLine: '我披着洁白羽毛在红树林上方巡视，尖尖的长嘴已经准备好捕鱼啦！',
    eatingHappyLine: '啊呜！鲜活的小鱼、小虾和弹涂鱼一口入肚，羽毛更加洁白光亮了！',
    wrongFoodLine: '咕咕！我可吃不下大塑料袋和干硬石头，塑料袋会卡住我的喉咙！',
    dietTypes: ['tilapia_fry', 'shrimp', 'mudskipper_card', 'crab_fry'],
    predatorIds: [], // Top predator in the lake ecosystem
    funFact: '小白鹭是厦门的市鸟！它们觅食时会轻轻晃动黄色的小脚丫惊扰泥里的小鱼小虾，等小鱼受惊跳出水面，长嘴如闪电般精准啄食！',
    ecoTip: '小白鹭是湿地生态环境的“晴雨表”。水清岸绿、鱼虾丰富，才会有成群的白鹭常驻筼筜湖繁衍。',
  },
];

// Level configuration with educational food-chain progression
export interface GameLevel {
  id: number;
  title: string;
  subtitle: string;
  theme: string;
  habitat: '滩涂泥潭' | '碧波湖水' | '红树树冠与空中';
  chainType: string;
  chainDiagram: string;
  chainConcept: string;
  difficulty: 1 | 2 | 3;
  difficultyLabel: string;
  speedMultiplier: number;
  trashRatio: number;
  targetAnimalIds: string[];
  roundsCount: number;
  description: string;
}

export const GAME_LEVELS: GameLevel[] = [
  {
    id: 1,
    title: '第一关：滩涂泥坑篇',
    subtitle: '简单二元食物链',
    theme: '红树林泥滩与底栖生物',
    habitat: '滩涂泥潭',
    chainType: '二元单向链 (生产者 ➔ 初级消费者)',
    chainDiagram: '滩涂硅藻 / 绿藻 ➔ 弧边招潮蟹 / 微型水蚤',
    chainConcept: '食物链的最基础起点：绿色植物与藻类利用阳光进行光合作用，草食或滤食性微小生物直接食用。',
    difficulty: 1,
    difficultyLabel: '★☆☆ 简单二元链',
    speedMultiplier: 0.9,
    trashRatio: 0.12,
    targetAnimalIds: ['fiddler_crab', 'daphnia_group'],
    roundsCount: 5,
    description: '深入筼筜湖潮间带滩涂，掌握最简单的二元单向食物链，帮助招潮蟹和水蚤滤食可口的微藻与落叶碎屑！',
  },
  {
    id: 2,
    title: '第二关：碧波湖水篇',
    subtitle: '多步阶梯食物链',
    theme: '清澈水域与中游捕食',
    habitat: '碧波湖水',
    chainType: '多步阶梯链 (藻类 ➔ 水蚤/沙蚕 ➔ 鱼类消费者)',
    chainDiagram: '浮游绿藻 ➔ 水蚤/红虫 ➔ 大弹涂鱼 / 筼筜罗非鱼',
    chainConcept: '食物链延伸至三级！次级肉食/杂食鱼类以初级消费者为食，能量逐级向上传递，同时必须提防空中的顶级天敌！',
    difficulty: 2,
    difficultyLabel: '★★☆ 进阶阶梯链',
    speedMultiplier: 1.18,
    trashRatio: 0.22,
    targetAnimalIds: ['mudskipper', 'tilapia_fish'],
    roundsCount: 5,
    description: '潜入筼筜湖波光粼粼的水下，水流加速！捕捉水蚤、沙蚕与敏捷小虾，提防天敌掠食者与水体电池烟头！',
  },
  {
    id: 3,
    title: '第三关：红树树冠与空中篇',
    subtitle: '复合湿地食物网',
    theme: '湿地霸主与空中巡视',
    habitat: '红树树冠与空中',
    chainType: '复合食物网 (跨营养级交错与顶层生态调控)',
    chainDiagram: '多条食物链分支交错互联 ➔ 厦门市鸟小白鹭 (顶级掠食)',
    chainConcept: '多条食物链纵横交错编织成复杂的“食物网”！小白鹭作为湿地顶级掠食者，跨营养级吃鱼、虾、蟹、弹涂鱼，维持全湖平衡。',
    difficulty: 3,
    difficultyLabel: '★★★ 终极食物网',
    speedMultiplier: 1.45,
    trashRatio: 0.30,
    targetAnimalIds: ['little_egret'],
    roundsCount: 5,
    description: '跟随厦门市鸟小白鹭展翅翱翔！水流湍急，辨识多种游速极快的小鱼小虾，警惕各类致命白色垃圾，守护食物网！',
  },
];

