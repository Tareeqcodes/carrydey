'use client';

const AUDIENCE = [
  {
    emoji: '👤',
    title: 'Everyday senders',
    desc: 'Send to family, return purchases, deliver documents. One booking done in 60 seconds.',
    tags: ['Personal items', 'Documents', 'Gifts'],
  },
  {
    emoji: '🛍️',
    title: 'Online sellers',
    desc: 'Run your Instagram or WhatsApp store without logistics headaches. Bulk orders, proof of delivery, COD support.',
    tags: ['Bulk deliveries', 'Proof of delivery', 'COD'],
  },
  {
    emoji: '🏢',
    title: 'Logistics agencies',
    desc: 'Full agency dashboard. Assign jobs to your riders, track all deliveries at once, and replace WhatsApp chaos for good.',
    tags: ['Fleet management', 'Drivers dashboard', 'Analytics'],
  },
];

export default function BuiltForEveryone() {
  return (
    <section className="py-20 px-4 md:px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          
          <h2 className="text-[28px] md:text-[38px] font-black text-white leading-[1.08] tracking-[-0.02em]">
            Whether you ship{' '}
            <span className="text-[#22c55e] italic">once</span>
            <br className="hidden sm:block" />
            {' '}or a thousand times.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AUDIENCE.map(({ emoji, title, desc, tags }) => (
            <div
              key={title}
              className="rounded-2xl p-7 border border-white/10 bg-white/5 transition-transform duration-200 hover:-translate-y-1"
            >
              <span className="text-[26px] mb-5 block">{emoji}</span>
              <h3
                className="text-[18px] font-black mb-3 leading-snug tracking-[-0.01em] text-white"
                style={{ fontFamily: 'Fraunces, Georgia, serif' }}
              >
                {title}
              </h3>
              <p
                className="text-[13px] leading-[1.65] mb-5 text-white/40"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/8 text-white/40"
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