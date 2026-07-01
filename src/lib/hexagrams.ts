// 六十四卦完整数据
export interface HexagramInfo {
  name: string;        // 卦名
  upper: string;       // 上卦
  lower: string;       // 下卦
  judgment: string;    // 卦辞
  overall: string;     // 整体运势
  career: string;      // 事业
  wealth: string;      // 财运
  love: string;        // 感情
  health: string;      // 健康
  guidance: string;    // 建议
}

// 八卦基础含义
const TRIGRAM_MEANING: Record<string, { name: string; element: string; nature: string }> = {
  '乾': { name: '乾', element: '金', nature: '天' },
  '坤': { name: '坤', element: '土', nature: '地' },
  '震': { name: '震', element: '木', nature: '雷' },
  '巽': { name: '巽', element: '木', nature: '风' },
  '坎': { name: '坎', element: '水', nature: '水' },
  '离': { name: '离', element: '火', nature: '火' },
  '艮': { name: '艮', element: '土', nature: '山' },
  '兑': { name: '兑', element: '金', nature: '泽' },
};

// 上卦+下卦 → 卦名映射（先天八卦序）
const HEXAGRAM_TABLE: Record<string, HexagramInfo> = {
  '乾乾': {
    name: '乾为天', upper: '乾', lower: '乾',
    judgment: '元亨利贞。天行健，君子以自强不息。',
    overall: '纯阳之卦，万象更新。此时运势鼎盛，宜积极进取，大展宏图。',
    career: '事业蒸蒸日上，有贵人相助，可大胆推进计划。',
    wealth: '财运亨通，正财偏财皆有收获，但不可贪多。',
    love: '感情顺利，单身者有机会遇良缘，有伴者感情升温。',
    health: '身体状况良好，注意头部和呼吸系统保养。',
    guidance: '把握良机，积极进取，但切记谦逊自守。',
  },
  '坤乾': {
    name: '天地否', upper: '坤', lower: '乾',
    judgment: '否之匪人，不利君子贞。大往小来。',
    overall: '天地不交，万物不通。此时宜守不宜进，静待时机。',
    career: '事业受阻，小人当道，宜韬光养晦，不可轻举妄动。',
    wealth: '财运不佳，不宜投资，以守代为妙。',
    love: '感情出现隔阂，双方沟通不畅，需耐心化解。',
    health: '注意脾胃和消化系统，保持心情舒畅。',
    guidance: '暂时退守，积蓄力量，等待转机。',
  },
  '震乾': {
    name: '天雷无妄', upper: '乾', lower: '震',
    judgment: '元亨利贞。其匪正有眚，不利有攸往。',
    overall: '顺应天道，不可妄为。真心行事则吉，心存邪念则凶。',
    career: '事业需脚踏实地，不可投机取巧。按部就班必有收获。',
    wealth: '财运平稳，正财可得，偏财勿贪。',
    love: '感情真挚，不可虚情假意。真心相待方能长久。',
    health: '注意肝胆和筋骨保养，适度运动。',
    guidance: '顺其自然，不可强求，正道而行。',
  },
  '乾震': {
    name: '雷天大壮', upper: '震', lower: '乾',
    judgment: '利贞。阳气盛壮，不可恃强凌弱。',
    overall: '气势旺盛，力量强大。但需知进退，不可一味逞强。',
    career: '事业发展势头强劲，但要注意团队合作，不可独断专行。',
    wealth: '财运旺盛，但不可贪多冒进，量力而行。',
    love: '感情热烈，但需注意表达方式，避免给对方压力。',
    health: '注意心血管和肝脏保养，避免过度劳累。',
    guidance: '壮而不过，刚柔并济。',
  },
  '巽乾': {
    name: '天风姤', upper: '巽', lower: '乾',
    judgment: '女壮，勿用取女。相遇有时，不可强求。',
    overall: '不期而遇，机缘巧合。机遇来临时要善于把握，但也要警惕陷阱。',
    career: '可能有意外机遇出现，要敏锐察觉，但需仔细甄别。',
    wealth: '有意外之财的可能，但不可贪恋。',
    love: '桃花运旺，但需谨慎选择，不可见异思迁。',
    health: '注意呼吸系统和皮肤保养。',
    guidance: '机遇来临时要谨慎把握，不可盲目。',
  },
  '乾巽': {
    name: '风天小畜', upper: '巽', lower: '乾',
    judgment: '亨。密云不雨，自我西郊。蓄积力量，等待时机。',
    overall: '力量尚不足以大有作为，需先蓄积资源和能力。',
    career: '事业发展需要更多准备，暂时不要急于求成。',
    wealth: '财运一般，宜储蓄不宜投资。',
    love: '感情需要慢慢培养，不可操之过急。',
    health: '注意脾胃和消化系统调理。',
    guidance: '以小蓄大，循序渐进。',
  },
  '坎乾': {
    name: '天水讼', upper: '坎', lower: '乾',
    judgment: '有孚窒惕，中吉终凶。利见大人，不利涉大川。',
    overall: '争执之象，凡事以和为贵。即使有理也要适可而止。',
    career: '工作中可能出现纠纷，应以协商为主，避免诉讼。',
    wealth: '财运有波折，避免因利益产生争端。',
    love: '感情中有分歧，需要多沟通理解。',
    health: '注意肾脏和泌尿系统保养。',
    guidance: '退一步海阔天空，以和为贵。',
  },
  '乾坎': {
    name: '水天需', upper: '坎', lower: '乾',
    judgment: '有孚，光亨贞吉。需于郊，利用恒。',
    overall: '等待时机，不可急躁。耐心等待必有好的结果。',
    career: '事业时机未到，需要耐心等待，不可贸然行动。',
    wealth: '财运需等待，现在不是投资的好时机。',
    love: '感情需要时间培养，不可急于求成。',
    health: '注意饮食调理，保持身体健康。',
    guidance: '耐心等待，时机一到自然水到渠成。',
  },
};

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
  // lines: array of 6 values (6=yin, 7=yang-fixed, 8=yin-fixed, 9=yang-moving)
  const movingLines: number[] = [];
  const stableLines: number[] = [];

  lines.forEach((line, i) => {
    if (line === 9) {
      movingLines.push(i);
      stableLines.push(line === 9 ? 7 : 8); // moving yang becomes yin in 变卦
    } else if (line === 6) {
      movingLines.push(i);
      stableLines.push(9); // moving yin becomes yang in 变卦
    } else {
      stableLines.push(line);
    }
  });

  // 本卦: 原始线
  const benUpper = lines.slice(0, 3); // lines 4,5,6 (top 3)
  const benLower = lines.slice(3, 6); // lines 1,2,3 (bottom 3)

  // Convert lines to trigram
  function linesToTrigram(l: number[]): string {
    // 3 lines → trigram: 7=阳, 8=阴
    const binary = l.map(x => x === 7 || x === 9 ? 1 : 0).reverse().join('');
    const map: Record<string, string> = {
      '111': '乾', '110': '兑', '101': '离', '100': '震',
      '011': '巽', '010': '坎', '001': '艮', '000': '坤',
    };
    return map[binary] ?? '乾';
  }

  const benUpperName = linesToTrigram(benUpper);
  const benLowerName = linesToTrigram(benLower);
  const benKey = `${benUpperName}${benLowerName}`;

  // 变卦: 变动后的线
  const bianLines = lines.map((l, i) => {
    if (l === 9) return 8; // yang moving → yin
    if (l === 6) return 7; // yin moving → yang
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

export { HEXAGRAM_TABLE, TRIGRAM_MEANING };
