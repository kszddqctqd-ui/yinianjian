'use client';

interface Master {
  icon: string;
  title: string;
  subtitle: string;
  desc: string;
  descBreak: string;
}

const MASTERS: Master[] = [
  {
    icon: '🧘',
    title: '慧明长老',
    subtitle: '古寺住持',
    desc: '庄重持重，引经据典',
    descBreak: '通读《渊海子平》《滴天髓》，言语稳重克制。适合希望深度解读、看古籍出处的施主。',
  },
  {
    icon: '🙏',
    title: '明心师父',
    subtitle: '尼众法师',
    desc: '慈悲温柔，劝人向善',
    descBreak: '语调温和，慈悲为怀。适合家庭、感情、亲人祈福场景。',
  },
  {
    icon: '☯️',
    title: '玄真道长',
    subtitle: '山中道人',
    desc: '直爽通透，说大白话',
    descBreak: '山中道人，不爱绕弯子。把命理讲成大白话，适合急性子。',
  },
];

export function MasterSelector({ selected, onSelect }: { selected: number | null; onSelect: (i: number) => void }) {
  return (
    <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm hover:border-gold/30 hover:shadow-card">
      <div className="space-y-3">
        <p className="text-base text-paper-dark/80">请选一位师父为您开示</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {MASTERS.map((m, i) => {
            const isSelected = selected === i;
            return (
              <button
                type="button"
                key={i}
                onClick={() => onSelect(i)}
                className={`group rounded-xl border p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-gold/60 bg-gold/10 shadow-gold'
                    : 'border-gold/20 bg-xuan-surface/40 hover:border-gold/40 hover:bg-xuan-surface/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{m.icon}</span>
                  <div>
                    <p className={`font-display text-lg transition-colors ${isSelected ? 'text-gold' : 'text-paper-dark'}`}>
                      {m.title}
                    </p>
                    <p className="text-xs text-paper-dark/65">{m.subtitle}</p>
                  </div>
                </div>
                <p className={`mt-2 text-sm transition-colors ${isSelected ? 'text-gold/85' : 'text-gold/85'}`}>
                  {m.desc}
                </p>
                <p className="mt-1 text-xs text-paper-dark/65">{m.descBreak}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
