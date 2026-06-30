export function FloatingParticles() {
  const particles = Array.from({ length: 6 }, (_, i) => ({
    left: `${12 + i * 13}%`,
    top: `${20 + (i % 3) * 25}%`,
    delay: `${(i * 1.2) % 5}s`,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute size-1.5 rounded-full bg-gold/40 animate-glow-rise"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: '5s',
            animationIterationCount: 'infinite',
            animationFillMode: 'both',
          }}
        />
      ))}
    </div>
  );
}
