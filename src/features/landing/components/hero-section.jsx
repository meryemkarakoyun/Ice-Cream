import {
  CalendarDays,
  CheckCircle2,
  IceCream,
  MessageSquareQuote,
  SendHorizontal,
  Sparkles,
  Star,
} from "lucide-react";

const trustHighlights = [
  "Doğal karadut",
  "Günlük taze üretim",
  "4.9 müşteri puanı",
];

const HeroSection = ({ hero, testimonial }) => {
  if (!hero) {
    return null;
  }

  const handlePrimary = () => {};
  const handleSecondary = () => {};

  return (
    <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.07] px-6 py-10 shadow-2xl shadow-black/10 ring-1 ring-white/10 backdrop-blur-xl md:px-10 md:py-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(128,13,29,0.35),transparent_55%)]" />

      <div className="relative grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-12 lg:gap-16">
        <div className="flex flex-col gap-7">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white/90 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-amber-200" aria-hidden="true" />
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            {hero.highlight}
          </span>

          <div className="space-y-4">
            <p className="text-4xl font-black leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
              <span className="block">{hero.titlePrimary}</span>
              <span className="mt-1 block bg-linear-to-r from-white via-orange-100 to-[#FFD4C2] bg-clip-text text-transparent">
                {hero.titleSecondary}
              </span>
            </p>
            <p className="max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
              {hero.description}
            </p>
            <p className="max-w-lg text-base leading-relaxed text-white/65">
              {hero.supportingText}
            </p>
          </div>

          <ul className="flex flex-wrap gap-3">
            {trustHighlights.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80"
              >
                <CheckCircle2
                  className="h-4 w-4 text-amber-200"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4 pt-1">
            <button
              type="button"
              tabIndex="0"
              aria-label={`${hero.primaryCta} butonu`}
              onClick={handlePrimary}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-base font-semibold text-[#800D1D] shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
            >
              <SendHorizontal className="h-5 w-5" aria-hidden="true" />
              {hero.primaryCta}
            </button>
            <button
              type="button"
              tabIndex="0"
              aria-label={`${hero.secondaryCta} butonu`}
              onClick={handleSecondary}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:border-white/50 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
              {hero.secondaryCta}
            </button>
          </div>
        </div>

        {testimonial && (
          <article className="relative flex flex-col gap-6 overflow-hidden rounded-[28px] border border-white/15 bg-linear-to-br from-white/15 via-white/10 to-white/5 p-6 text-white shadow-xl backdrop-blur-2xl md:p-7">
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#DC5236]/30 blur-3xl" />

            <div className="relative flex items-start gap-4">
              <div className="relative shrink-0">
                <img
                  src={testimonial.avatarUrl}
                  alt={`${testimonial.name} avatarı`}
                  className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/50"
                />
                <span className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#DC5236] ring-2 ring-white/20">
                  <IceCream className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xl font-semibold">{testimonial.name}</p>
                <p className="text-sm text-white/75">{testimonial.role}</p>
                {testimonial.location && (
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/50">
                    {testimonial.location}
                  </p>
                )}
              </div>

              <MessageSquareQuote
                className="h-7 w-7 shrink-0 text-white/35"
                aria-hidden="true"
              />
            </div>

            <blockquote className="relative border-l-2 border-white/20 pl-4 text-base leading-relaxed text-white/90">
              “{testimonial.quote}”
            </blockquote>

            <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Star
                    key={`star-${index + 1}`}
                    className="h-5 w-5 fill-amber-300 text-amber-300"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
                Doğrulanmış yorum
              </span>
            </div>
          </article>
        )}
      </div>

      <div className="pointer-events-none absolute -left-20 top-10 h-52 w-52 rounded-full bg-[#800D1D]/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-10 -bottom-20 h-64 w-64 rounded-full bg-[#DC5236]/30 blur-3xl" />
    </section>
  );
};

export default HeroSection;
