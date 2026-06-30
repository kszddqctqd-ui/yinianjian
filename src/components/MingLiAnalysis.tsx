'use client';

import { type BaZiResult, TIAN_GAN_WUXING, DI_ZHI_WUXING } from '@/lib/bazi';

const RI_ZHU_DESC: Record<string, { nature: string; strength: string; advice: string }> = {
  '甲子': { nature: '参天大树，扎根沃土', strength: '木生水地，泄秀有方', advice: '为人正直仁慈，有领导才能。宜从事教育、文化、管理类工作。中年后运势渐旺，晚年福禄双全。' },
  '甲寅': { nature: '栋梁之材，独立不屈', strength: '比肩坐禄，身强有力', advice: '性格刚毅果断，独立自主。适合创业、技术、军警等职业。注意控制脾气，多听他人意见。' },
  '甲辰': { nature: '乔木逢春，生机盎然', strength: '木库藏财，才华内敛', advice: '聪明有才，善于谋划。适合文职、策划、学术研究。财运中等，宜稳扎稳打。' },
  '甲午': { nature: '木火通明，文采斐然', strength: '食伤泄秀，才艺出众', advice: '思维活跃，口才佳。适合艺术、传媒、设计行业。注意身体保养，避免过度劳累。' },
  '甲申': { nature: '木临绝地，坚韧不拔', strength: '七杀坐命，压力与动力并存', advice: '意志坚定，不畏艰难。适合管理、法律、军警。中年后事业有成，但需注意健康。' },
  '甲戌': { nature: '秋木凋零，内敛深沉', strength: '财星当令，务实能干', advice: '踏实稳重，理财能力强。适合金融、商业、房地产。婚姻运较好，家庭和睦。' },
  '乙子': { nature: '花草逢雨，柔韧灵活', strength: '水生木旺，才思敏捷', advice: '性情温和，善于交际。适合文艺、教育、服务业。注意把握机会，避免优柔寡断。' },
  '乙丑': { nature: '寒土培木，蓄势待发', strength: '偏财坐库，财运潜藏', advice: '精明能干，善于理财。适合金融、会计、贸易。中年后财运渐佳。' },
  '乙卯': { nature: '藤萝系甲，坚韧不屈', strength: '比肩帮身，自立自强', advice: '性格温和但有主见，善交朋友。适合合作经营、团队工作。贵人运佳。' },
  '乙辰': { nature: '春末花草，生机勃勃', strength: '正财透干，务实稳重', advice: '勤劳致富，步步为营。适合实业、农业、教育。财运稳定，中年后大发。' },
  '乙巳': { nature: '木火相生，才华横溢', strength: '伤官生财，聪明伶俐', advice: '创意十足，善于表达。适合设计、传媒、营销。注意言行，避免口舌是非。' },
  '乙未': { nature: '秋花傲霜，坚韧不拔', strength: '偏财当令，财运不错', advice: '精明能干，善于把握商机。适合商业、投资。婚姻需用心经营。' },
  '乙酉': { nature: '金克木旺，磨砺成才', strength: '七杀制身，压力中成长', advice: '性格坚韧，抗压能力强。适合技术、工程、军警。中年后事业有成。' },
  '乙亥': { nature: '水生木旺，智慧深远', strength: '正印生身，学识渊博', advice: '聪明好学，有文化底蕴。适合学术、教育、文化。晚年运势佳。' },
  '丙子': { nature: '冬日暖阳，温暖人心', strength: '官星护身，稳重有度', advice: '热情开朗，待人真诚。适合公关、销售、服务业。注意控制情绪波动。' },
  '丙寅': { nature: '朝阳初升，光芒万丈', strength: '长生之地，活力充沛', advice: '积极进取，事业心强。适合创业、管理、公职。中年后运势鼎盛。' },
  '丙辰': { nature: '龙口吐珠，才华内蕴', strength: '食神生财，智慧理财', advice: '聪明睿智，善于谋划。适合文化、教育、咨询。财运良好。' },
  '丙午': { nature: '烈日当空，热情奔放', strength: '羊刃帮身，精力旺盛', advice: '性格豪爽，敢作敢为。适合军警、体育、管理。注意心血管健康。' },
  '丙申': { nature: '日落西山，余晖灿烂', strength: '偏财坐杀，冒险精神', advice: '敢于拼搏，善于把握机会。适合商业、外贸、投资。中年后财运亨通。' },
  '丙戌': { nature: '暮火余温，内敛深沉', strength: '食神制杀，智勇双全', advice: '思维缜密，行动果断。适合技术、工程、管理。婚姻运佳。' },
  '丁子': { nature: '星火微光，暗夜明灯', strength: '官星照命，贵人扶持', advice: '性格温和，心思细腻。适合文化、艺术、教育。注意避免过度敏感。' },
  '丁丑': { nature: '寒灯夜明，温暖人间', strength: '食神坐库，才华内敛', advice: '聪明内敛，善于思考。适合研究、技术、写作。财运平稳。' },
  '丁卯': { nature: '木火相生，文曲星光', strength: '印星生身，学识渊博', advice: '性情温和，文采出众。适合文学、教育、文化事业。贵人运佳。' },
  '丁巳': { nature: '烈火熊熊，光明磊落', strength: '帝旺之地，气势如虹', advice: '热情奔放，领导力强。适合管理、创业、公职。注意控制急躁性格。' },
  '丁未': { nature: '夏末余火，温煦柔和', strength: '食神当令，福泽深厚', advice: '性格温和，善于交际。适合服务、餐饮、文化。晚年运势佳。' },
  '丁酉': { nature: '火炼秋金，精益求精', strength: '财星得地，善于理财', advice: '精明能干，审美出众。适合金融、设计、艺术。财运不错。' },
  '丁亥': { nature: '星火入天，志向高远', strength: '正官坐印，仕途可期', advice: '正直善良，有责任感。适合公职、管理、教育。中年后事业有成。' },
  '戊子': { nature: '厚土载水，包容万物', strength: '财星坐命，务实能干', advice: '性格稳重，善于理财。适合金融、房地产、建筑。财运良好。' },
  '戊寅': { nature: '春土培木，生机勃勃', strength: '杀印相生，文武兼备', advice: '有领导才能，做事果断。适合管理、公职、军警。中年后运势上升。' },
  '戊辰': { nature: '水库之土，深藏不露', strength: '比肩坐库，自立自强', advice: '性格坚毅，有耐力。适合工程、农业、实业。财运稳定。' },
  '戊午': { nature: '烈日烤土，热情似火', strength: '羊刃帮身，精力过人', advice: '性格豪爽，行动力强。适合销售、管理、创业。注意肠胃健康。' },
  '戊申': { nature: '土生金旺，财源广进', strength: '食神生财，智慧生财', advice: '聪明能干，善于把握商机。适合商业、贸易、投资。财运亨通。' },
  '戊戌': { nature: '燥土坚厚，沉稳如山', strength: '比肩坐库，意志坚定', advice: '性格刚毅，重信守诺。适合工程、军警、管理。注意人际关系。' },
  '己子': { nature: '田园湿土，滋润万物', strength: '财星照命，务实稳重', advice: '性格温和，善于理财。适合金融、农业、教育。财运平稳。' },
  '己丑': { nature: '冻土培根，蓄势待发', strength: '比肩帮身，坚韧不拔', advice: '性格内向，做事踏实。适合技术、研究、农业。中年后财运渐佳。' },
  '己卯': { nature: '田园花木，生机盎然', strength: '七杀坐命，压力中成长', advice: '性格坚韧，善于应变。适合管理、法律、军警。注意心理健康。' },
  '己辰': { nature: '湿土蓄水，包容宽广', strength: '比肩坐库，稳扎稳打', advice: '性格稳重，有耐心。适合教育、文化、咨询。财运稳定。' },
  '己巳': { nature: '火生厚土，温暖明亮', strength: '正印生身，学识渊博', advice: '聪明好学，有文化底蕴。适合学术、教育、文化。贵人运佳。' },
  '己未': { nature: '燥土培木，温润有度', strength: '比肩当令，自立自强', advice: '性格坚毅，做事踏实。适合实业、农业、建筑。中年后事业有成。' },
  '己酉': { nature: '土生金旺，才华外露', strength: '食神坐命，才艺出众', advice: '聪明优雅，善于表达。适合艺术、设计、传媒。财运不错。' },
  '己亥': { nature: '水土相涵，智慧深远', strength: '正财坐官，仕途可期', advice: '正直善良，有责任心。适合公职、管理、金融。中年后运势鼎盛。' },
  '庚子': { nature: '金生水旺，聪明伶俐', strength: '食神泄秀，才华横溢', advice: '聪明机智，善于表达。适合艺术、传媒、教育。注意避免骄傲自满。' },
  '庚寅': { nature: '金木相克，磨砺成才', strength: '偏财坐杀，冒险进取', advice: '性格刚毅，敢于拼搏。适合创业、军警、管理。中年后事业大成。' },
  '庚辰': { nature: '水库养金，深藏锋芒', strength: '偏印坐库，智慧深沉', advice: '思维独特，善于谋划。适合研究、技术、咨询。财运稳定。' },
  '庚午': { nature: '火炼金成，百炼成钢', strength: '正官照命，稳重有度', advice: '正直自律，有领导才能。适合公职、管理、军警。中年后运势上升。' },
  '庚申': { nature: '比肩帮身，刚毅果决', strength: '禄神坐命，自力更生', advice: '性格刚强，独立自主。适合军警、工程、创业。注意控制脾气。' },
  '庚戌': { nature: '秋金入库，内敛深沉', strength: '偏印当令，智慧过人', advice: '思维缜密，有远见。适合投资、金融、管理。晚年运势佳。' },
  '辛子': { nature: '金水相生，清秀聪慧', strength: '食神泄秀，才艺出众', advice: '聪明秀气，善于表达。适合艺术、设计、传媒。财运良好。' },
  '辛丑': { nature: '湿土生金，温润内敛', strength: '偏印坐库，深思熟虑', advice: '性格沉稳，有耐心。适合技术、研究、金融。中年后财运渐佳。' },
  '辛卯': { nature: '金克木旺，精益求精', strength: '七杀坐命，压力中成长', advice: '性格刚毅，善于应变。适合管理、法律、军警。注意身心健康。' },
  '辛辰': { nature: '水库养金，深藏不露', strength: '伤官坐库，才华外露', advice: '聪明机智，创意十足。适合设计、传媒、艺术。财运不错。' },
  '辛巳': { nature: '火炼金成，光彩夺目', strength: '正官照命，稳重有度', advice: '正直自律，有领导才能。适合公职、管理、金融。中年后事业有成。' },
  '辛未': { nature: '燥土脆金，内敛含蓄', strength: '偏印当令，智慧深沉', advice: '思维独特，善于分析。适合研究、咨询、技术。财运稳定。' },
  '辛酉': { nature: '比肩帮身，刚毅果断', strength: '禄神坐命，自力更生', advice: '性格刚强，独立自主。适合军警、工程、创业。注意人际关系。' },
  '辛戌': { nature: '秋金入库，收敛锋芒', strength: '正印当令，学识渊博', advice: '性格温和，有文化底蕴。适合教育、文化、艺术。晚年运势佳。' },
  '壬子': { nature: '水势浩荡，奔流不息', strength: '羊刃帮身，精力旺盛', advice: '聪明机智，行动力强。适合贸易、交通、旅游。注意控制冲动。' },
  '壬寅': { nature: '水生木旺，才华外露', strength: '食神泄秀，智慧深远', advice: '聪明有才，善于谋划。适合文化、教育、咨询。中年后事业有成。' },
  '壬辰': { nature: '水库归垣，深藏不露', strength: '偏印坐库，智慧深沉', advice: '思维独特，有远见。适合投资、金融、管理。财运亨通。' },
  '壬午': { nature: '水火既济，阴阳调和', strength: '财官双美，福泽深厚', advice: '性格稳重，事业心强。适合公职、管理、金融。中年后运势鼎盛。' },
  '壬申': { nature: '金生水旺，聪明伶俐', strength: '偏印生身，学识渊博', advice: '聪明机智，善于学习。适合学术、教育、技术。贵人运佳。' },
  '壬戌': { nature: '水库入库，内敛深沉', strength: '七杀当令，压力中成长', advice: '性格坚毅，有领导力。适合军警、管理、创业。中年后事业大成。' },
  '癸子': { nature: '雨露之水，润物无声', strength: '羊刃帮身，温柔中有刚', advice: '性格温和，心思细腻。适合教育、文化、医疗。注意避免过度敏感。' },
  '癸丑': { nature: '寒土培水，蓄势待发', strength: '偏印坐库，深思熟虑', advice: '性格沉稳，有耐心。适合研究、技术、金融。中年后财运渐佳。' },
  '癸卯': { nature: '水生木旺，文曲星光', strength: '食神泄秀，才华横溢', advice: '聪明秀气，文艺天赋高。适合艺术、文学、设计。贵人运佳。' },
  '癸辰': { nature: '水库养水，深藏不露', strength: '伤官坐库，创意无限', advice: '思维活跃，善于创新。适合设计、传媒、科技。财运稳定。' },
  '癸巳': { nature: '水火相交，智慧灵动', strength: '正财坐官，仕途可期', advice: '正直善良，有责任心。适合公职、管理、金融。中年后事业有成。' },
  '癸未': { nature: '燥土止水，内敛含蓄', strength: '七杀当令，压力中成长', advice: '性格坚毅，善于应变。适合管理、法律、军警。注意身心健康。' },
  '癸酉': { nature: '金水相生，清秀聪慧', strength: '偏印生身，学识渊博', advice: '聪明机智，善于分析。适合研究、技术、金融。财运不错。' },
  '癸亥': { nature: '水归大海，气势磅礴', strength: '帝旺之地，精力充沛', advice: '性格豪爽，行动力强。适合创业、贸易、管理。中年后运势鼎盛。' },
};

const DEFAULT_RI_ZHU = {
  nature: '日主天干，代表自己',
  strength: '需结合全局分析',
  advice: '命局平衡为上，五行流通为吉。宜修身养性，积德行善。',
};

function getWuXingAdvice(wuXingCount: Record<string, number>): string {
  const values = Object.values(wuXingCount);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const maxElement = Object.keys(wuXingCount).find(k => wuXingCount[k] === maxVal)!;
  const minElement = Object.keys(wuXingCount).find(k => wuXingCount[k] === minVal)!;

  const lacking: Record<string, string> = {
    '金': '义', '木': '仁', '水': '智', '火': '礼', '土': '信',
  };
  const excess: Record<string, string> = {
    '金': '刚毅过度则伤', '木': '仁慈过度则弱', '水': '智慧过度则诈',
    '火': '礼貌过度则虚', '土': '诚信过度则执',
  };

  let advice = '';
  if (minVal === 0) {
    advice += `五行缺${minElement}，主${lacking[minElement]}道不足。`;
    advice += '建议多接触属' + minElement + '的事物，佩戴相关饰品，选择' + minElement + '旺的方位发展。';
  } else if (minVal === 1) {
    advice += `${minElement}稍弱，${lacking[minElement]}道需加强。`;
  }
  if (maxVal >= 3) {
    advice += `${maxElement}过旺，${excess[maxElement]}。宜适当克制。`;
  }
  return advice;
}

export function MingLiAnalysis({ result, gender }: { result: BaZiResult; gender: string }) {
  const riZhu = result.riZhu;
  const info = RI_ZHU_DESC[riZhu] || DEFAULT_RI_ZHU;
  const wuXingAdvice = getWuXingAdvice(result.wuXingCount);
  const wuxingOrder = ['金', '木', '水', '火', '土'];
  const maxWx = wuxingOrder.reduce((a, b) => result.wuXingCount[a]! >= result.wuXingCount[b]! ? a : b);
  const minWx = wuxingOrder.reduce((a, b) => result.wuXingCount[a]! <= result.wuXingCount[b]! ? a : b);

  return (
    <div className="space-y-4">
      {/* 日主分析 */}
      <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper">
        <div className="mb-3 text-center">
          <span className="text-xs text-gold/80 tracking-wider">日主分析</span>
        </div>
        <div className="space-y-3">
          <div>
            <div className="mb-1 text-sm text-gold">【日主】{riZhu}</div>
            <p className="text-sm leading-7 text-paper-dark/85">{info.nature}</p>
          </div>
          <div>
            <div className="mb-1 text-sm text-gold">【格局】{info.strength}</div>
            <p className="text-sm leading-7 text-paper-dark/85">{info.advice}</p>
          </div>
        </div>
      </div>

      {/* 五行分析 */}
      <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper">
        <div className="mb-3 text-center">
          <span className="text-xs text-gold/80 tracking-wider">五行分析</span>
        </div>
        <div className="space-y-3">
          <div>
            <div className="mb-1 text-sm text-gold">【五行分布】</div>
            <div className="flex gap-4 text-sm">
              {wuxingOrder.map(wx => (
                <div key={wx} className="flex items-center gap-1">
                  <span className="text-xs text-paper-dark/60">{wx}</span>
                  <span className="font-number text-gold">{result.wuXingCount[wx]}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1 text-sm text-gold">【喜忌建议】</div>
            <p className="text-sm leading-7 text-paper-dark/85">
              五行{maxWx}旺{minWx}{(() => {
                const count = result.wuXingCount[minWx];
                return count === 0 ? '缺' : count === 1 ? '稍弱' : '平和';
              })()}。
              {wuXingAdvice}
            </p>
          </div>
        </div>
      </div>

      {/* 性格特征 */}
      <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper">
        <div className="mb-3 text-center">
          <span className="text-xs text-gold/80 tracking-wider">性格特征</span>
        </div>
        <div className="space-y-2 text-sm leading-7 text-paper-dark/85">
          <p>
            <span className="text-gold">日主{riZhu[0]}属{TIAN_GAN_WUXING[riZhu[0]]}：</span>
            {riZhu[0] === '甲' && '为人正直仁慈，有领导才能，但有时过于固执。'}
            {riZhu[0] === '乙' && '性情温和，善于交际，但有时优柔寡断。'}
            {riZhu[0] === '丙' && '热情开朗，乐于助人，但有时急躁冲动。'}
            {riZhu[0] === '丁' && '心思细腻，彬彬有礼，但有时过于敏感。'}
            {riZhu[0] === '戊' && '稳重诚实，言出必行，但有时过于保守。'}
            {riZhu[0] === '己' && '温和踏实，善于理财，但有时过于计较。'}
            {riZhu[0] === '庚' && '刚毅果断，义薄云天，但有时过于强硬。'}
            {riZhu[0] === '辛' && '聪明秀气，精益求精，但有时过于挑剔。'}
            {riZhu[0] === '壬' && '聪明机智，善于变通，但有时过于圆滑。'}
            {riZhu[0] === '癸' && '温柔内敛，心思缜密，但有时过于多疑。'}
          </p>
          <p>
            <span className="text-gold">日支{riZhu[1]}属{DI_ZHI_WUXING[riZhu[1]]}：</span>
            {riZhu[1] === '子' && '内心智慧深邃，善于谋略。'}
            {riZhu[1] === '丑' && '性格内敛稳重，勤劳踏实。'}
            {riZhu[1] === '寅' && '积极进取，有冒险精神。'}
            {riZhu[1] === '卯' && '温和友善，善于交际。'}
            {riZhu[1] === '辰' && '胸怀宽广，有包容力。'}
            {riZhu[1] === '巳' && '聪明伶俐，思维敏捷。'}
            {riZhu[1] === '午' && '热情豪爽，精力充沛。'}
            {riZhu[1] === '未' && '温和内敛，善于持家。'}
            {riZhu[1] === '申' && '机智灵活，善于变通。'}
            {riZhu[1] === '酉' && '精明干练，注重细节。'}
            {riZhu[1] === '戌' && '忠诚正直，重信守诺。'}
            {riZhu[1] === '亥' && '豁达乐观，心胸开阔。'}
          </p>
        </div>
      </div>

      {/* 大运流年 */}
      <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper">
        <div className="mb-3 text-center">
          <span className="text-xs text-gold/80 tracking-wider">大运流年</span>
        </div>
        <div className="space-y-3 text-sm leading-7 text-paper-dark/85">
          <p>
            <span className="text-gold">【起运】</span>
            根据年柱天干阴阳及性别，大运顺行或逆行。每十年一大运，逐年流转，运势起伏有致。
          </p>
          <p>
            <span className="text-gold">【近三年运势提示】</span>
          </p>
          <ul className="ml-4 space-y-1 text-paper-dark/70">
            <li>• 2026 丙午年：火旺之年，{['木','火'].includes(TIAN_GAN_WUXING[riZhu[0]]) ? '火势过旺，注意调节情绪' : '火能生扶，运势上升'}。</li>
            <li>• 2027 丁未年：火土相生，{['土','金'].includes(TIAN_GAN_WUXING[riZhu[0]]) ? '土金得生，事业有利' : '火土耗身，宜守不宜进'}。</li>
            <li>• 2028 戊申年：土金相生，{['金','水'].includes(TIAN_GAN_WUXING[riZhu[0]]) ? '金水得源，财运不错' : '土金耗身，注意健康'}。</li>
          </ul>
        </div>
      </div>

      {/* 综合建议 */}
      <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper">
        <div className="mb-3 text-center">
          <span className="text-xs text-gold/80 tracking-wider">综合建议</span>
        </div>
        <div className="space-y-2 text-sm leading-7 text-paper-dark/85">
          <p>
            <span className="text-gold">【事业】</span>
            {['木'].includes(TIAN_GAN_WUXING[riZhu[0]]) && '五行属木，宜从事教育、文化、出版、园林等行业。'}
            {['火'].includes(TIAN_GAN_WUXING[riZhu[0]]) && '五行属火，宜从事能源、餐饮、传媒、娱乐等行业。'}
            {['土'].includes(TIAN_GAN_WUXING[riZhu[0]]) && '五行属土，宜从事房地产、建筑、农业、咨询等行业。'}
            {['金'].includes(TIAN_GAN_WUXING[riZhu[0]]) && '五行属金，宜从事金融、机械、法律、军警等行业。'}
            {['水'].includes(TIAN_GAN_WUXING[riZhu[0]]) && '五行属水，宜从事贸易、交通、旅游、水产等行业。'}
          </p>
          <p>
            <span className="text-gold">【财运】</span>
            {(() => {
              const caiWuXing: Record<string, string> = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };
              const caiWx = caiWuXing[TIAN_GAN_WUXING[riZhu[0]]];
              const caiCount = result.wuXingCount[caiWx] || 0;
              if (caiCount >= 2) return `${caiWx}为财星，命中财星较多，财运亨通，善用财富。`;
              if (caiCount === 1) return `${caiWx}为财星，财运平稳，宜稳中求财。`;
              return `${caiWx}为财星，命中财星较弱，宜靠技能致富，不宜投机。`;
            })()}
          </p>
          <p>
            <span className="text-gold">【健康】</span>
            {(() => {
              const healthMap: Record<string, string> = { '金': '呼吸系统', '木': '肝胆', '水': '肾脏', '火': '心血管', '土': '脾胃' };
              const values = wuxingOrder.map(w => result.wuXingCount[w] || 0);
              const minV = Math.min(...values);
              const minEl = wuxingOrder.find(w => (result.wuXingCount[w] || 0) === minV)!;
              if (minV === 0) return `五行缺${minEl}，注意${healthMap[minEl]}保养。`;
              if (minV === 1) return `${minEl}稍弱，注意${healthMap[minEl]}调理。`;
              return '五行相对均衡，注意日常养生即可。';
            })()}
          </p>
          <p>
            <span className="text-gold">【风水】</span>
            {(() => {
              const direction: Record<string, string> = { '木': '东方', '火': '南方', '土': '中部/本地', '金': '西方', '水': '北方' };
              const luckyColor: Record<string, string> = {
                '木': '绿色/青色/黑色', '火': '红色/紫色/绿色', '土': '黄色/棕色/红色',
                '金': '白色/金色/黄色', '水': '黑色/蓝色/白色',
              };
              return `利${direction[TIAN_GAN_WUXING[riZhu[0]]]}发展，幸运色${luckyColor[TIAN_GAN_WUXING[riZhu[0]]]}。`;
            })()}
          </p>
        </div>
      </div>
    </div>
  );
}
