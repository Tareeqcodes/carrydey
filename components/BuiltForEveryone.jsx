'use client';

const AUDIENCE = [
  {
    emoji: '👤',
    title: 'Everyday senders',
    desc: 'Send to family, return purchases, deliver documents. One booking done in 60 seconds.',
    tags: ['Personal items', 'Documents', 'Gifts'],
    dark: true,
  },
  {
    emoji: '🛍️',
    title: 'Online sellers',
    desc: 'Run your Instagram or WhatsApp store without logistics headaches. Bulk orders, proof of delivery, COD support.',
    tags: ['Bulk deliveries', 'Proof of delivery', 'COD'],
    dark: true,
  },
  {
    emoji: '🏢',
    title: 'Logistics agencies',
    desc: 'List your fleet, manage drivers, accept inbound bookings. Full dashboard with revenue analytics.',
    tags: ['Fleet management', 'Driver dashboard', 'Analytics'],
    dark: false,
  },
];

export default function BuiltForEveryone() {
  return (
    <section className="py-20 px-4 md:px-6 bg-[#fdf8f2]">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <p className="text-[11px] font-bold text-[#FF6B35] uppercase tracking-[0.14em] mb-3">
            Built for everyone
          </p>
          <h2
            className="text-[28px] md:text-[38px] font-black text-[#3A0A21] leading-[1.08] tracking-[-0.02em]"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
          >
            Whether you ship{' '}
            <span className="text-[#FF6B35] italic">once</span>
            <br className="hidden sm:block" />
            {' '}or a thousand times.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AUDIENCE.map(({ emoji, title, desc, tags, dark }) => (
            <div
              key={title}
              className={`rounded-2xl p-7 transition-transform duration-200 hover:-translate-y-1 ${
                dark
                  ? 'bg-[#3A0A21]'
                  : 'bg-white border border-gray-100'
              }`}
            >
              <span className="text-[26px] mb-5 block">{emoji}</span>

              <h3
                className={`text-[18px] font-black mb-3 leading-snug tracking-[-0.01em] ${
                  dark ? 'text-white' : 'text-[#3A0A21]'
                }`}
                style={{ fontFamily: 'Fraunces, Georgia, serif' }}
              >
                {title}
              </h3>

              <p className={`text-[13px] leading-[1.65] mb-5 ${dark ? 'text-white/50' : 'text-gray-500'}`}>
                {desc}
              </p>

              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      dark
                        ? 'bg-white/10 text-white/55'
                        : 'bg-[#3A0A21]/06 text-[#5a1535]'
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}