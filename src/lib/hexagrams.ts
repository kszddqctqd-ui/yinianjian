// 六十四卦完整数据
export interface HexagramInfo {
  name: string;
  upper: string;
  lower: string;
  judgment: string;
  overall: string;
  career: string;
  wealth: string;
  love: string;
  health: string;
  guidance: string;
}

const TRIGRAM_NAMES = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤'];
const TRIGRAM_ELEMENTS = ['金', '金', '火', '木', '木', '水', '土', '土'];
const TRIGRAM_NATURES = ['天', '泽', '火', '雷', '风', '水', '山', '地'];

// 八卦两两组合的64卦名和卦辞（按先天八卦序）
const HEXAGRAM_DATA: Record<string, Partial<HexagramInfo>> = {
  '乾乾': { name: '乾为天', judgment: '元亨利贞。天行健，君子以自强不息。' },
  '兑乾': { name: '泽天夬', judgment: '扬于王庭，孚号有厉。告自邑，不利即戎。' },
  '离乾': { name: '天火同人', judgment: '同人于野，亨。利涉大川，利君子贞。' },
  '震乾': { name: '天雷无妄', judgment: '元亨利贞。其匪正有眚，不利有攸往。' },
  '巽乾': { name: '天风姤', judgment: '女壮，勿用取女。' },
  '坎乾': { name: '天水讼', judgment: '有孚窒惕，中吉终凶。利见大人，不利涉大川。' },
  '艮乾': { name: '天山遁', judgment: '亨，小利贞。' },
  '坤乾': { name: '天地否', judgment: '否之匪人，不利君子贞。大往小来。' },

  '乾兑': { name: '泽地萃', judgment: '萃，亨。王假有庙，利见大人，贞吉。' },
  '兑兑': { name: '兑为泽', judgment: '亨，利贞。丽泽兑，君子以朋友讲习。' },
  '离兑': { name: '泽火革', judgment: '己日乃孚，元亨利贞，悔亡。' },
  '震兑': { name: '泽雷随', judgment: '元亨利贞，无咎。' },
  '巽兑': { name: '泽风大过', judgment: '栋桡，利有攸往，亨。' },
  '坎兑': { name: '泽水困', judgment: '亨，贞大人吉，以有言不利。' },
  '艮兑': { name: '泽山咸', judgment: '亨，利贞，取女吉。' },
  '坤兑': { name: '泽地萃', judgment: '萃，亨。王假有庙，利见大人。' },

  '乾离': { name: '天火同人', judgment: '同人于野，亨。利涉大川，利君子贞。' },
  '兑离': { name: '火泽睽', judgment: '小事吉。上火下泽，君子以同而异。' },
  '离离': { name: '离为火', judgment: '利贞，亨。畜牝牛吉。' },
  '震离': { name: '火雷噬嗑', judgment: '亨，利用狱。' },
  '巽离': { name: '火风鼎', judgment: '元吉，亨。' },
  '坎离': { name: '火水未济', judgment: '亨，小狐汔济，濡其尾。无攸利。' },
  '艮离': { name: '火山旅', judgment: '小亨，旅贞吉。' },
  '坤离': { name: '地火明夷', judgment: '利艰贞。' },

  '乾震': { name: '雷天大壮', judgment: '利贞。阳气盛壮，不可恃强凌弱。' },
  '兑震': { name: '雷泽归妹', judgment: '征凶，无攸利。' },
  '离震': { name: '雷火丰', judgment: '亨，王假之。勿忧，宜日中。' },
  '震震': { name: '震为雷', judgment: '亨。震来虩虩，笑言哑哑。' },
  '巽震': { name: '雷风恒', judgment: '亨，无咎，利贞，利有攸往。' },
  '坎震': { name: '雷水解', judgment: '西南吉。利有攸往，夙吉。' },
  '艮震': { name: '雷山小过', judgment: '亨，利贞。可小事，不可大事。' },
  '坤震': { name: '地雷复', judgment: '亨。出入无疾，朋来无咎。' },

  '乾巽': { name: '风天小畜', judgment: '亨。密云不雨，自我西郊。' },
  '兑巽': { name: '风水涣', judgment: '亨。王假有庙，利涉大川，利贞。' },
  '离巽': { name: '风火家人', judgment: '利女贞。' },
  '震巽': { name: '风雷益', judgment: '利有攸往，利涉大川。' },
  '巽巽': { name: '巽为风', judgment: '小亨。利有攸往，利见大人。' },
  '坎巽': { name: '风水涣', judgment: '亨。王假有庙，利涉大川。' },
  '艮巽': { name: '风山渐', judgment: '女归吉，利贞。' },
  '坤巽': { name: '风地观', judgment: '盥而不荐，有孚颙若。' },

  '乾坎': { name: '水天需', judgment: '有孚，光亨贞吉。位乎天位，以正中也。' },
  '兑坎': { name: '水泽节', judgment: '亨。刚柔分而刚得中。苦不可贞。' },
  '离坎': { name: '水火既济', judgment: '亨小，利贞。初吉终乱。' },
  '震坎': { name: '雷水解', judgment: '西南吉。利有攸往。' },
  '巽坎': { name: '坎为水', judgment: '习坎，有孚，维心亨，行有尚。' },
  '坎坎': { name: '坎为水', judgment: '习坎，有孚，维心亨。' },
  '艮坎': { name: '水山蹇', judgment: '利西南，不利东北。利见大人，贞吉。' },
  '坤坎': { name: '地水师', judgment: '贞，丈人吉，无咎。' },

  '乾艮': { name: '山天大畜', judgment: '利贞，不家食吉，利涉大川。' },
  '兑艮': { name: '山泽损', judgment: '有孚，元吉，无咎，可贞。' },
  '离艮': { name: '山火贲', judgment: '亨。小利有攸往。' },
  '震艮': { name: '山雷颐', judgment: '贞吉。观颐，自求口实。' },
  '巽艮': { name: '山风蛊', judgment: '元亨，利涉大川。先甲三日，后甲三日。' },
  '坎艮': { name: '山水蒙', judgment: '亨。匪我求童蒙，童蒙求我。' },
  '艮艮': { name: '艮为山', judgment: '艮其背，不获其身。行其庭，不见其人。无咎。' },
  '坤艮': { name: '山地剥', judgment: '不利有攸往。' },

  '乾坤': { name: '地天泰', judgment: '小往大来，吉亨。' },
  '兑坤': { name: '地泽临', judgment: '元亨利贞。至于八月有凶。' },
  '离坤': { name: '地火明夷', judgment: '利艰贞。' },
  '震坤': { name: '地雷复', judgment: '亨。出入无疾，朋来无咎。' },
  '巽坤': { name: '地风升', judgment: '元亨。用见大人，勿恤。南征吉。' },
  '坎坤': { name: '地水师', judgment: '贞，丈人吉，无咎。' },
  '艮坤': { name: '地山谦', judgment: '亨，君子有终。' },
  '坤坤': { name: '坤为地', judgment: '元亨，利牝马之贞。君子有攸往，先迷后得主。' },
};

// 为每个卦生成完整的解读
function generateReading(hexagramName: string, judgment: string): HexagramInfo {
  // 根据卦名关键词生成不同的解读
  const isJi = hexagramName.includes('既济');
  const WeiJi = hexagramName.includes('未济');
  const Tai = hexagramName.includes('泰') && !hexagramName.includes('大');
  const Pi = hexagramName.includes('否');
  const DaGuo = hexagramName.includes('大过');
  const Jian = hexagramName.includes('蹇') || hexagramName.includes('困');
  const Shi = hexagramName.includes('师');
  const Meng = hexagramName.includes('蒙');
  const Guan = hexagramName.includes('观');
  const Lin = hexagramName.includes('临');
  const Fu = hexagramName.includes('复') && !hexagramName.includes('归');
  const Dun = hexagramName.includes('遁');
  const DaZhuang = hexagramName.includes('大壮');
  const Kui = hexagramName.includes('睽');
  const Yi = hexagramName.includes('益');
  const Sun = hexagramName.includes('损');
  const Heng = hexagramName.includes('恒');
  const Ding = hexagramName.includes('鼎');
  const JiaRen = hexagramName.includes('家人');
  const Lv = hexagramName.includes('旅');
  const Feng = hexagramName.includes('丰');
  const ShiKe = hexagramName.includes('噬嗑');
  const GuiMei = hexagramName.includes('归妹');
  const Yan = hexagramName.includes('咸');
  const Ju = hexagramName.includes('夬');
  const Cun = hexagramName.includes('屯');
  const Bi = hexagramName.includes('比');
  const Xu = hexagramName.includes('需');
  const Song = hexagramName.includes('讼');
  const TongRen = hexagramName.includes('同人');
  const DaYou = hexagramName.includes('大有');
  const Qian = hexagramName.includes('乾');
  const Kun = hexagramName.includes('坤');
  const Gan = hexagramName.includes('贲');
  const Bo = hexagramName.includes('剥');
  const Kou = hexagramName.includes('蛊');
  const XiaGuo = hexagramName.includes('小过');
  const YiJi = hexagramName.includes('颐');
  const Zhun = hexagramName.includes('萃');
  const Huan = hexagramName.includes('涣');
  const XiaoXu = hexagramName.includes('小畜');
  const DaXu = hexagramName.includes('大畜');
  const Jin = hexagramName.includes('晋');
  const MingYi = hexagramName.includes('明夷');
  const Gou = hexagramName.includes('姤');
  const Dai = hexagramName.includes('待') || hexagramName.includes('待');
  const ZhongFu = hexagramName.includes('中孚');
  const XiaoGuo = hexagramName.includes('小过');
  const WuWang = hexagramName.includes('无妄');
  const Shen = hexagramName.includes('深');

  // 默认解读
  let overall = '运势平稳，宜守正待时。';
  let career = '事业平稳发展，不宜冒进。';
  let wealth = '财运一般，宜保守理财。';
  let love = '感情平淡，需用心经营。';
  let health = '身体无恙，注意日常保养。';
  let guidance = '保持平常心，顺势而为。';

  if (Pi) {
    overall = '天地不交，万物不通。此时宜守不宜进，静待时机。';
    career = '事业受阻，小人当道，宜韬光养晦。';
    wealth = '财运不佳，不宜投资，以守代为妙。';
    love = '感情出现隔阂，沟通不畅，需耐心化解。';
    guidance = '暂时退守，积蓄力量，等待转机。';
  } else if (Tai) {
    overall = '天地交泰，万物通达。此时运势极佳，宜积极作为。';
    career = '事业顺遂，贵人相助，可大胆推进。';
    wealth = '财运亨通，正财偏财皆有收获。';
    love = '感情融洽，单身者有机会遇良缘。';
    guidance = '把握良机，积极进取，同时保持谦逊。';
  } else if (Fu) {
    overall = '一阳来复，否极泰来。黑暗过去，光明即将到来。';
    career = '事业开始好转，虽有波折但终将向好。';
    wealth = '财运回升，之前的投资开始有回报。';
    love = '感情破冰回暖，误会逐渐消除。';
    guidance = '抓住转折点，重新出发。';
  } else if (Dun) {
    overall = '山高天远，宜退不宜进。暂时隐退以保全实力。';
    career = '事业不宜强求，退一步海阔天空。';
    wealth = '财运平平，不宜大额投资。';
    love = '感情需要空间，给彼此一些距离。';
    guidance = '知进退者常存，退守以待天时。';
  } else if (DaZhuang) {
    overall = '阳气盛壮，气势如虹。但需知进退，不可恃强。';
    career = '事业发展势头强劲，但要注意团队合作。';
    wealth = '财运旺盛，但不可贪多冒进。';
    love = '感情热烈，但需注意表达方式。';
    guidance = '壮而不过，刚柔并济。';
  } else if (WuWang) {
    overall = '顺应天道，不可妄为。真心行事则吉，心存邪念则凶。';
    career = '事业需脚踏实地，不可投机取巧。';
    wealth = '财运平稳，正财可得，偏财勿贪。';
    love = '感情真挚，不可虚情假意。';
    guidance = '顺其自然，正道而行。';
  } else if (Kui) {
    overall = '上下不和，事有违逆。需以柔克刚，化解矛盾。';
    career = '工作中有分歧，需多方协调。';
    wealth = '财运波动，不宜冒险投资。';
    love = '感情有隔阂，需要真诚沟通。';
    guidance = '求同存异，以和为贵。';
  } else if (Yi) {
    overall = '风雷相助，损益有度。得外力相助，事业可进。';
    career = '事业有贵人相助，可大胆推进计划。';
    wealth = '财运上升，有利投资和创业。';
    love = '感情甜蜜，双方互相扶持。';
    guidance = '抓住机遇，乘势而上。';
  } else if (Sun) {
    overall = '减损之道，先损后益。舍弃眼前小利，可得长远大利。';
    career = '事业需先投入后收获，不可急功近利。';
    wealth = '财运先抑后扬，初期投入较大。';
    love = '感情需要付出，先舍后得。';
    guidance = '懂得舍弃，方能获得更多。';
  } else if (Heng) {
    overall = '雷风相随，持之以恒。坚守正道，终有成就。';
    career = '事业稳定发展，坚持初心必有回报。';
    wealth = '财运稳定，长期投资优于短期操作。';
    love = '感情长久，需用心经营维持。';
    guidance = '持之以恒，不可半途而废。';
  } else if (Ding) {
    overall = '木上有火，烹饪之象。去故取新，建功立业之时。';
    career = '事业有新的发展机会，可大胆尝试。';
    wealth = '财运亨通，有新的收入来源。';
    love = '感情有新的进展，适合确定关系。';
    guidance = '除旧布新，把握变革机遇。';
  } else if (JiaRen) {
    overall = '风自火出，家庭和睦。家人各守其道，家业兴旺。';
    career = '事业稳定，家庭和睦是最大后盾。';
    wealth = '财运来自正道，勤俭持家。';
    love = '感情温馨，家庭美满。';
    guidance = '修身齐家，家和万事兴。';
  } else if (Lv) {
    overall = '山上火明，漂泊之象。旅居在外，需谨慎行事。';
    career = '事业有变动，可能需要出差或外派。';
    wealth = '财运不稳，不宜大额投资。';
    love = '感情漂泊不定，需安下心来。';
    guidance = '随遇而安，稳中求进。';
  } else if (Feng) {
    overall = '雷火丰盈，盛大之象。运势达到顶峰，把握时机建功立业。';
    career = '事业如日中天，可大展宏图。';
    wealth = '财运极旺，多有意外收获。';
    love = '感情热烈如火，正是好时机。';
    guidance = '盛极而衰，得意时不忘谨慎。';
  } else if (ShiKe) {
    overall = '雷火相济，咬合之象。去除障碍，事情可成。';
    career = '事业上有阻碍需要清除，果断处理。';
    wealth = '财运尚可，需排除干扰。';
    love = '感情中有需要解决的矛盾。';
    guidance = '果断行动，破除障碍。';
  } else if (GuiMei) {
    overall = '泽上于雷，少女从长。婚姻之象，但需谨慎行事。';
    career = '事业有归宿，但不可操之过急。';
    wealth = '财运平稳，不宜冒险。';
    love = '姻缘将至，但需明辨对方真心。';
    guidance = '循序渐进，不可急于求成。';
  } else if (Yan) {
    overall = '山泽通气，感应之象。万物感应，事有默契。';
    career = '事业上有贵人感应，机遇自来。';
    wealth = '财运不错，有意外之喜。';
    love = '感情融洽，心有灵犀。';
    guidance = '以诚相待，感应自然而来。';
  } else if (Ju) {
    overall = '泽决于天，果断决裂。当断则断，不可犹豫。';
    career = '事业需要做出重大决定，果断行事。';
    wealth = '财运波动，需果断取舍。';
    love = '感情需要做出选择，不可拖泥带水。';
    guidance = '当机立断，不可优柔寡断。';
  } else if (Xu) {
    overall = '云上于天，等待之象。时机未到，耐心等待。';
    career = '事业时机未到，需要等待。';
    wealth = '财运需等待，现在不是投资的好时机。';
    love = '感情需要时间培养，不可急于求成。';
    guidance = '耐心等待，时机一到自然水到渠成。';
  } else if (Song) {
    overall = '天与水违，争讼之象。凡事以和为贵，避免争端。';
    career = '工作中可能出现纠纷，应以协商为主。';
    wealth = '财运有波折，避免因利益产生争端。';
    love = '感情中有分歧，需要多沟通理解。';
    guidance = '退一步海阔天空，以和为贵。';
  } else if (TongRen) {
    overall = '天与火同，志同道合。与人合作，可成大事。';
    career = '事业适合团队合作，众人拾柴火焰高。';
    wealth = '财运来自合作，合伙生意有利。';
    love = '感情和谐，有情人终成眷属。';
    guidance = '广结善缘，与人方便自己方便。';
  } else if (Qian) {
    overall = '天行健，君子以自强不息。运势鼎盛，积极进取。';
    career = '事业蒸蒸日上，有贵人相助，可大胆推进。';
    wealth = '财运亨通，正财偏财皆有收获。';
    love = '感情顺利，单身者有机会遇良缘。';
    guidance = '把握良机，积极进取，但切记谦逊。';
  } else if (Kun) {
    overall = '地势坤，君子以厚德载物。宜柔顺守正，不可主动。';
    career = '事业宜守不宜攻，跟随他人步伐。';
    wealth = '财运平稳，以储蓄为主。';
    love = '感情温和，以柔克刚。';
    guidance = '厚德载物，包容万物。';
  } else if (Gan) {
    overall = '山下有火，文饰之象。注重外表修饰，但不可本末倒置。';
    career = '事业需要注意形象和包装。';
    wealth = '财运尚可，花钱买面子。';
    love = '感情浪漫，注重仪式感。';
    guidance = '内外兼修，不可只重外表。';
  } else if (Bo) {
    overall = '山附于地，剥落之象。运势低迷，宜守不宜进。';
    career = '事业处于低谷，不宜有所作为。';
    wealth = '财运不佳，小心破财。';
    love = '感情有破裂风险，需用心维系。';
    guidance = '顺势而止，等待时机。';
  } else if (Kou) {
    overall = '风雷激荡，整治之象。内有腐败，需整顿革新。';
    career = '事业需要整顿，清除弊端。';
    wealth = '财运有损耗，需修补漏洞。';
    love = '感情有问题需要面对解决。';
    guidance = '治乱需重典，革故才能鼎新。';
  } else if (XiaoGuo) {
    overall = '山上有雷，小有过越。可做一些小事，不可做大事。';
    career = '事业宜做小事，不宜大举。';
    wealth = '财运一般，小额投资可行。';
    love = '感情有小波折，无伤大雅。';
    guidance = '小事可过，大事需慎。';
  } else if (YiJi) {
    overall = '山雷相叠，颐养之象。注意饮食修养，修身养性。';
    career = '事业需要积累，不可急于求成。';
    wealth = '财运需节制，量入为出。';
    love = '感情需要滋养，用心经营。';
    guidance = '修身养性，谨言慎行。';
  } else if (Zhun) {
    overall = '泽上于地，聚集之象。众人聚集，可成大事。';
    career = '事业有团队支持，合力可为。';
    wealth = '财运聚集，多人合作有利。';
    love = '感情社交活跃，有机会结识新人。';
    guidance = '团结众人，汇聚力量。';
  } else if (Huan) {
    overall = '风行水上，涣散之象。人心离散，需重新凝聚。';
    career = '事业有变动，需重新规划。';
    wealth = '财运不稳，需防破散。';
    love = '感情有疏远趋势，需加强联系。';
    guidance = '凝聚人心，共渡难关。';
  } else if (XiaoXu) {
    overall = '风天相合，小有蓄积。力量尚不足以大有作为。';
    career = '事业发展需要更多准备。';
    wealth = '财运一般，宜储蓄不宜投资。';
    love = '感情需要慢慢培养。';
    guidance = '以小蓄大，循序渐进。';
  } else if (DaXu) {
    overall = '山天相合，大为蓄积。积累丰厚，可大有作为。';
    career = '事业蓄势待发，时机成熟可大展拳脚。';
    wealth = '财运丰厚，有大的投资机会。';
    love = '感情水到渠成，适合确定关系。';
    guidance = '厚积薄发，一鸣惊人。';
  } else if (Jin) {
    overall = '火地相生，前进之象。事业晋升，光明在前。';
    career = '事业有晋升机会，把握良机。';
    wealth = '财运上升，有额外收入。';
    love = '感情明朗，关系公开。';
    guidance = '积极进取，前途光明。';
  } else if (MingYi) {
    overall = '明入地中，光明受损。韬光养晦，待时而动。';
    career = '事业受挫，需隐藏锋芒。';
    wealth = '财运不佳，不宜投资。';
    love = '感情有隐情，需耐心了解。';
    guidance = '内明外柔，以屈求伸。';
  } else if (Gou) {
    overall = '天下有风，不期而遇。机缘巧合，需敏锐把握。';
    career = '可能有意外机遇出现，要敏锐察觉。';
    wealth = '有意外之财的可能，但不可贪恋。';
    love = '桃花运旺，但需谨慎选择。';
    guidance = '机遇来临时要谨慎把握。';
  } else if (WeiJi) {
    overall = '水火不相交，事未完成。虽处困境，但前景可期。';
    career = '事业尚未成功，需继续努力。';
    wealth = '财运未通，耐心等待。';
    love = '感情未定，还需磨合。';
    guidance = '慎终如始，不可功亏一篑。';
  } else if (isJi) {
    overall = '水火相交，事已成功。但盛极必衰，需防患于未然。';
    career = '事业已达巅峰，需居安思危。';
    wealth = '财运已达顶峰，宜见好就收。';
    love = '感情圆满，需用心维护。';
    guidance = '功成身退，方为明智。';
  } else {
    overall = '运势平稳，宜守正待时。';
    career = '事业平稳发展，不宜冒进。';
    wealth = '财运一般，宜保守理财。';
    love = '感情平淡，需用心经营。';
    health = '身体无恙，注意日常保养。';
    guidance = '保持平常心，顺势而为。';
  }

  const upperName = hexagramName.replace(/为|天|地|山|水|火|雷|风|泽|云|雷|火|泽|山|天|地/g, '');
  const upper = hexagramName.match(/[乾坤震巽坎离艮兑]/)?.[0] || '乾';
  const lower = hexagramName.match(/[乾坤震巽坎离艮兑]为|[乾坤震巽坎离艮兑][为天]$/)?.[0]?.replace('为', '') || '天';

  return {
    name: hexagramName,
    upper,
    lower,
    judgment,
    overall,
    career,
    wealth,
    love,
    health: health || '身体无恙，注意日常保养。',
    guidance,
  };
}

// 生成完整的64卦数据
const HEXAGRAM_TABLE: Record<string, HexagramInfo> = {};
for (const [key, data] of Object.entries(HEXAGRAM_DATA)) {
  const [upper, lower] = key.split('');
  const fullName = data.name || `${upper}${lower}`;
  const reading = generateReading(fullName, data.judgment || '吉。');
  HEXAGRAM_TABLE[key] = {
    judgment: data.judgment || '吉。',
    overall: reading.overall,
    career: reading.career,
    wealth: reading.wealth,
    love: reading.love,
    health: reading.health,
    guidance: reading.guidance,
    name: reading.name,
    upper,
    lower,
  };
}

// 用八卦组合生成卦名和解读
function generateHexagram(upperZhi: string, lowerZhi: string): HexagramInfo | null {
  const upperName = getTrigramName(upperZhi);
  const lowerName = getTrigramName(lowerZhi);
  if (!upperName || !lowerName) return null;
  const key = `${upperName}${lowerName}`;
  return HEXAGRAM_TABLE[key] || null;
}

// 将地支转换为八卦
function getTrigramName(zhi: string): string | null {
  const mapping: Record<string, string> = {
    '子': '坎', '丑': '艮', '寅': '震', '卯': '巽',
    '辰': '坎', '巳': '离', '午': '离', '未': '坤',
    '申': '兑', '酉': '兑', '戌': '艮', '亥': '乾',
  };
  return mapping[zhi] ?? null;
}

export function castHexagram(lines: number[]): {
  ben: HexagramInfo | null;
  hu: string;
  bian: HexagramInfo | null;
  movingLines: number[];
} {
  const movingLines: number[] = [];
  const stableLines: number[] = [];

  lines.forEach((line, i) => {
    if (line === 9) {
      movingLines.push(i);
      stableLines.push(line === 9 ? 7 : 8);
    } else if (line === 6) {
      movingLines.push(i);
      stableLines.push(9);
    } else {
      stableLines.push(line);
    }
  });

  function linesToTrigram(l: number[]): string {
    const binary = l.map(x => x === 7 || x === 9 ? 1 : 0).reverse().join('');
    const map: Record<string, string> = {
      '111': '乾', '110': '兑', '101': '离', '100': '震',
      '011': '巽', '010': '坎', '001': '艮', '000': '坤',
    };
    return map[binary] ?? '乾';
  }

  const benUpper = lines.slice(0, 3);
  const benLower = lines.slice(3, 6);
  const benUpperName = linesToTrigram(benUpper);
  const benLowerName = linesToTrigram(benLower);
  const benKey = `${benUpperName}${benLowerName}`;

  const bianLines = lines.map((l, i) => {
    if (l === 9) return 8;
    if (l === 6) return 7;
    return l;
  });
  const bianUpper = bianLines.slice(0, 3);
  const bianLower = bianLines.slice(3, 6);
  const bianUpperName = linesToTrigram(bianUpper);
  const bianLowerName = linesToTrigram(bianLower);
  const bianKey = `${bianUpperName}${bianLowerName}`;

  return {
    ben: HEXAGRAM_TABLE[benKey] ?? null,
    hu: `${linesToTrigram([lines[1], lines[2], lines[3]])}${linesToTrigram([lines[2], lines[3], lines[4]])}`,
    bian: HEXAGRAM_TABLE[bianKey] ?? null,
    movingLines,
  };
}

export { HEXAGRAM_TABLE, TRIGRAM_NAMES, TRIGRAM_ELEMENTS, TRIGRAM_NATURES };
