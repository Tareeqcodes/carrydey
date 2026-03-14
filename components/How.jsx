'use client';

const STEPS = [
  {
    n: '01',
    title: 'Enter your route',
    desc: 'Type pickup and dropoff. We calculate distance and suggest a fair base fare instantly.',
  },
  {
    n: '02',
    title: 'Name your price',
    desc: 'Offer what you\'re comfortable paying. Higher offers get picked up faster.',
  },
  {
    n: '03',
    title: 'Courier accepts',
    desc: 'Nearby couriers see your offer, accept it or send a counter-offer back.',
  },
  {
    n: '04',
    title: 'Track & receive',
    desc: 'Follow the delivery live. Get notified at pickup and on arrival.',
  },
];

export default function How() {
  return (
    <section className="py-20 px-4 md:px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <p className="text-[11px] font-bold text-[#FF6B35] uppercase tracking-[0.14em] mb-3">
            How it works
          </p>
          <h2
            className="text-[28px] md:text-[38px] font-black text-[#3A0A21] leading-[1.08] tracking-[-0.02em]"
            style={{ fontFamily: 'Fraunces, Georgia, serif' }}
          >
            Booking in four steps,<br />
            <span className="text-[#FF6B35] italic">start to door.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 rounded-2xl overflow-hidden">
          {STEPS.map(({ n, title, desc }, i) => (
            <div
              key={n}
              className="bg-white p-7 md:p-8 group hover:bg-[#fdf8f2] transition-colors duration-200"
            >
              {/* Number */}
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-6 font-black text-[13px] transition-all duration-200 ${
                  i === 0
                    ? 'bg-[#3A0A21] text-white'
                    : 'bg-gray-100 text-[#3A0A21] group-hover:bg-[#3A0A21] group-hover:text-white'
                }`}
                style={{ fontFamily: 'Fraunces, Georgia, serif' }}
              >
                {n}
              </div>

              {/* Text */}
              <h3
                className="text-[15px] font-bold text-[#3A0A21] mb-2 leading-snug"
                style={{ fontFamily: 'Fraunces, Georgia, serif' }}
              >
                {title}
              </h3>
              <p className="text-[13px] text-gray-500 leading-[1.65]">{desc}</p>
            </div>
          ))}
        </div>

        {/* Connector note */}
        <p className="text-center text-[12px] text-gray-400 font-medium mt-6">
          ⚡ Average time from booking to courier on the way —{' '}
          <strong className="text-[#3A0A21] font-semibold">under 3 minutes</strong>
        </p>
      </div>
    </section>
  );
}