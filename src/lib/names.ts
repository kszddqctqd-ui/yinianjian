// 起名用字库（按五行分类）
interface NameChar {
  char: string;
  pinyin: string;
  element: string;
  meaning: string;
  source?: string;
}

export const CHAR_POOLS: Record<string, NameChar[]> = {
  '金': [
    { char: '铭', pinyin: 'míng', element: '金', meaning: '铭记于心，才华出众', source: '《论语》"铭诸肺腑"' },
    { char: '锐', pinyin: 'ruì', element: '金', meaning: '锐不可当，勇往直前', source: '《孙子兵法》"鋭兵无战"' },
    { char: '锦', pinyin: 'jǐn', element: '金', meaning: '锦绣前程，美好富贵', source: '李白"锦瑟无端五十弦"' },
    { char: '铄', pinyin: 'shuò', element: '金', meaning: '铁石铄金，光辉灿烂', source: '《尚书》"金曰铄"' },
    { char: '铮', pinyin: 'zhēng', element: '金', meaning: '铁骨铮铮，刚正不阿', source: '成语"铁骨铮铮"' },
    { char: '钧', pinyin: 'jūn', element: '金', meaning: '千钧之力，稳重有担当', source: '《史记》"雷霆万钧"' },
    { char: '锋', pinyin: 'fēng', element: '金', meaning: '锐不可当，锋芒毕露', source: '杜甫"锋棱瘦骨成"' },
    { char: '铱', pinyin: 'yī', element: '金', meaning: '稀有珍贵，卓尔不凡', source: '化学元素' },
    { char: '铎', pinyin: 'duó', element: '金', meaning: '金铎声声，教化四方', source: '《尚书》"金铎鸣于天下"' },
    { char: '鑫', pinyin: 'xīn', element: '金', meaning: '多金多福，财源广进', source: '传统吉祥字' },
  ],
  '木': [
    { char: '林', pinyin: 'lín', element: '木', meaning: '双木成林，生机勃勃', source: '《论语》"木欣欣以向荣"' },
    { char: '森', pinyin: 'sēn', element: '木', meaning: '森林茂密，福泽深厚', source: '《道德经》"森然满目"' },
    { char: '桐', pinyin: 'tóng', element: '木', meaning: '梧桐栖凤，高贵典雅', source: '《诗经》"凤凰鸣矣，于彼高岗。梧桐生矣，于彼朝阳"' },
    { char: '楠', pinyin: 'nán', element: '木', meaning: '楠木珍贵，品质高洁', source: '杜甫"楠木生其材"' },
    { char: '柏', pinyin: 'bǎi', element: '木', meaning: '松柏长青，坚韧不拔', source: '《论语》"岁寒然后知松柏之后凋也"' },
    { char: '梓', pinyin: 'zǐ', element: '木', meaning: '梓里桑园，感恩思源', source: '《诗经》"维桑与梓，必恭敬止"' },
    { char: '楷', pinyin: 'kǎi', element: '木', meaning: '楷模典范，为人师表', source: '成语"楷模之范"' },
    { char: '榕', pinyin: 'róng', element: '木', meaning: '榕树参天，庇荫一方', source: '传统吉祥意象' },
    { char: '桓', pinyin: 'huán', element: '木', meaning: '桓桓威武，英姿勃发', source: '《诗经》"桓桓武王"' },
    { char: '枫', pinyin: 'fēng', element: '木', meaning: '枫林晚照，诗意盎然', source: '杜牧"停车坐爱枫林晚"' },
  ],
  '水': [
    { char: '涵', pinyin: 'hán', element: '水', meaning: '涵养深厚，包容万象', source: '《周易》"含章可贞"' },
    { char: '泽', pinyin: 'zé', element: '水', meaning: '恩泽广被，福慧双修', source: '《周易》"润之以风雨"' },
    { char: '清', pinyin: 'qīng', element: '水', meaning: '清正廉洁，清澈明朗', source: '《诗经》"河水清且涟猗"' },
    { char: '浩', pinyin: 'hào', element: '水', meaning: '浩然正气，气势磅礴', source: '《孟子》"我善养吾浩然之气"' },
    { char: '澜', pinyin: 'lán', element: '水', meaning: '波澜壮阔，气势非凡', source: '范仲淹"波澜不惊"' },
    { char: '淳', pinyin: 'chún', element: '水', meaning: '淳朴善良，质朴无华', source: '《老子》"其政闷闷，其民淳淳"' },
    { char: '溪', pinyin: 'xī', element: '水', meaning: '溪流涓涓，绵延不绝', source: '王维"清泉石上流"' },
    { char: '沐', pinyin: 'mù', element: '水', meaning: '如沐春风，温润如玉', source: '成语"如沐春风"' },
    { char: '瀚', pinyin: 'hàn', element: '水', meaning: '浩瀚星空，胸怀广阔', source: '古诗"瀚海阑干百丈冰"' },
    { char: '涛', pinyin: 'tāo', element: '水', meaning: '波涛汹涌，气势如虹', source: '苏轼"大江东去，浪淘尽"' },
  ],
  '火': [
    { char: '煜', pinyin: 'yù', element: '火', meaning: '光耀灿烂，前程似锦', source: '《太玄·元告》"煜煜乎有光矣"' },
    { char: '炎', pinyin: 'yán', element: '火', meaning: '热情如火，活力四射', source: '《说文》"炎，火光上也"' },
    { char: '炜', pinyin: 'wěi', element: '火', meaning: '光彩焕发，声名远扬', source: '《诗经》"彤管有炜"' },
    { char: '灿', pinyin: 'càn', element: '火', meaning: '灿烂辉煌，光彩夺目', source: '成语"光彩灿烂"' },
    { char: '焕', pinyin: 'huàn', element: '火', meaning: '焕然一新，神采奕奕', source: '韩愈"焕乎其有文章"' },
    { char: '熙', pinyin: 'xī', element: '火', meaning: '光明兴盛，和乐融融', source: '《诗经》"于熙于京"' },
    { char: '烽', pinyin: 'fēng', element: '火', meaning: '烽火连天，英勇无畏', source: '古代军事意象' },
    { char: '烨', pinyin: 'yè', element: '火', meaning: '日光闪耀，光明正大', source: '《尔雅》"烨烨震电"' },
    { char: '昕', pinyin: 'xīn', element: '火', meaning: '黎明曙光，充满希望', source: '《说文》"旦明也"' },
    { char: '昭', pinyin: 'zhāo', element: '火', meaning: '昭昭日月，光明磊落', source: '《诗经》"明昭上帝"' },
  ],
  '土': [
    { char: '坤', pinyin: 'kūn', element: '土', meaning: '厚德载物，包容万象', source: '《周易》"地势坤，君子以厚德载物"' },
    { char: '垚', pinyin: 'yáo', element: '土', meaning: '山高貌，志向高远', source: '《说文》"垚，高也"' },
    { char: '培', pinyin: 'péi', element: '土', meaning: '栽培培育，成就人才', source: '成语"培元固本"' },
    { char: '基', pinyin: 'jī', element: '土', meaning: '基业长青，根基稳固', source: '《道德经》"千里之行始于足下"' },
    { char: '堂', pinyin: 'táng', element: '土', meaning: '堂堂正正，光明磊落', source: '成语"堂堂正正"' },
    { char: '墨', pinyin: 'mò', element: '土', meaning: '翰墨飘香，文采斐然', source: '传统文人意象' },
    { char: '垣', pinyin: 'yuán', element: '土', meaning: '城垣坚固，安居乐业', source: '《诗经》"塞向墐户"' },
    { char: '圣', pinyin: 'shèng', element: '土', meaning: '圣贤智慧，品德高尚', source: '《孟子》"圣人，百世之师也"' },
    { char: '城', pinyin: 'chéng', element: '土', meaning: '金城汤池，坚不可摧', source: '成语"金城汤池"' },
    { char: '均', pinyin: 'jūn', element: '土', meaning: '平均公正，不偏不倚', source: '《论语》"均无贫"' },
  ],
};

// 诗词典故用字
export const POETRY_CHARS: NameChar[] = [
  { char: '思', pinyin: 'sī', element: '金', meaning: '思如泉涌，才思敏捷', source: '《诗经》"思无邪"' },
  { char: '语', pinyin: 'yǔ', element: '木', meaning: '妙语连珠，谈吐不凡', source: '《论语》"学而时习之，不亦说乎"' },
  { char: '文', pinyin: 'wén', element: '水', meaning: '文采飞扬，博学多才', source: '《论语》"文质彬彬，然后君子"' },
  { char: '德', pinyin: 'dé', element: '火', meaning: '品德高尚，德才兼备', source: '《论语》"德不孤必有邻"' },
  { char: '道', pinyin: 'dào', element: '火', meaning: '大道至简，悟在天成', source: '《道德经》"道可道非常道"' },
  { char: '仁', pinyin: 'rén', element: '木', meaning: '仁爱之心，宽厚待人', source: '《论语》"仁者爱人"' },
  { char: '义', pinyin: 'yì', element: '木', meaning: '大义凛然，义薄云天', source: '《论语》"君子喻于义"' },
  { char: '礼', pinyin: 'lǐ', element: '火', meaning: '知书达礼，温文尔雅', source: '《论语》"不学礼无以立"' },
  { char: '智', pinyin: 'zhì', element: '水', meaning: '智慧超群，明辨是非', source: '《论语》"知者不惑"' },
  { char: '信', pinyin: 'xìn', element: '金', meaning: '诚实守信，一诺千金', source: '《论语》"人而无信不知其可也"' },
  { char: '雅', pinyin: 'yǎ', element: '木', meaning: '高雅脱俗，气质非凡', source: '《诗经》"大雅昭昭"' },
  { char: '和', pinyin: 'hé', element: '水', meaning: '和衷共济，和气生财', source: '《论语》"礼之用和为贵"' },
  { char: '静', pinyin: 'jìng', element: '金', meaning: '宁静致远，淡泊明志', source: '诸葛亮"非宁静无以致远"' },
  { char: '安', pinyin: 'ān', element: '土', meaning: '平安喜乐，安居乐业', source: '《论语》"安仁乐山"' },
  { char: '乐', pinyin: 'lè', element: '火', meaning: '快乐无忧，笑口常开', source: '《论语》"有朋自远方来不亦乐乎"' },
  { char: '明', pinyin: 'míng', element: '火', meaning: '光明磊落，明智通达', source: '《大学》"大学之道在明明德"' },
  { char: '天', pinyin: 'tiān', element: '火', meaning: '天道酬勤，胸怀天下', source: '《论语》"天生德于予"' },
  { char: '地', pinyin: 'dì', element: '土', meaning: '厚德载物，脚踏实地', source: '《周易》"地势坤君子以厚德载物"' },
  { char: '山', pinyin: 'shān', element: '土', meaning: '山高水长，坚定不移', source: '《论语》"仁者乐山"' },
  { char: '川', pinyin: 'chuān', element: '水', meaning: '海纳百川，气度非凡', source: '《论语》"子在川上曰"' },
];

// 根据八字喜用神推荐五行
export function getFavorableElements(wuXingCount: Record<string, number>): string[] {
  const elements = ['金', '木', '水', '火', '土'];
  const counts = elements.map(e => wuXingCount[e] ?? 0);
  const minIdx = counts.indexOf(Math.min(...counts));
  const minEl = elements[minIdx];

  // 喜用神通常是能补不足的五行
  // 根据五行相生：缺什么补什么，或者根据日主强弱
  const favorable: string[] = [];
  if (minEl === '金') favorable.push('土', '金'); // 土生金
  else if (minEl === '木') favorable.push('水', '木'); // 水生木
  else if (minEl === '水') favorable.push('金', '水'); // 金生水
  else if (minEl === '火') favorable.push('木', '火'); // 木生火
  else favorable.push('火', '土'); // 火生土
  return favorable;
}

// 从字符池中随机选取字符
function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export interface NameSuggestion {
  fullName: string;
  pinyin: string;
  element: string;
  meaning: string;
  source: string;
  style: string;
}

export function generateNames(
  surname: string,
  wuXingCount: Record<string, number>,
  style: string,
  count: number = 3,
): NameSuggestion[] {
  const favorable = getFavorableElements(wuXingCount);
  const suggestions: NameSuggestion[] = [];

  let charPool: NameChar[] = [];
  if (style === '诗词典故') {
    charPool = POETRY_CHARS;
  } else {
    // 按喜用神五行筛选字符
    for (const el of favorable) {
      const pool = CHAR_POOLS[el] || [];
      charPool = [...charPool, ...pool];
    }
    // 补充一些常用字
    charPool = [...charPool, ...POETRY_CHARS];
  }

  // 去除重复字符
  const seen = new Set<string>();
  charPool = charPool.filter(c => {
    if (seen.has(c.char)) return false;
    seen.add(c.char);
    return true;
  });

  const picked = pickRandom(charPool, Math.min(count * 4, charPool.length));

  // 生成名字组合（单字名和双字名）
  for (let i = 0; i < Math.min(count, picked.length); i++) {
    const char = picked[i];
    suggestions.push({
      fullName: surname + char.char,
      pinyin: surname + char.pinyin,
      element: char.element,
      meaning: char.meaning,
      source: char.source || '',
      style,
    });
  }

  // 尝试生成双字名
  if (suggestions.length < count && picked.length >= 2) {
    for (let i = 0; i < Math.min(count - suggestions.length, picked.length - 1); i++) {
      const c1 = picked[i];
      const c2 = picked[i + 1];
      suggestions.push({
        fullName: surname + c1.char + c2.char,
        pinyin: surname + c1.pinyin + c2.pinyin,
        element: c1.element,
        meaning: `${c1.meaning}，${c2.meaning}`,
        source: `${c1.source || ''} ${c2.source || ''}`.trim(),
        style,
      });
    }
  }

  return suggestions.slice(0, count);
}
