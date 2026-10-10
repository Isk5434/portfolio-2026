"use client";

import Marquee from "@/components/ui/Marquee";
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { useLocale, marqueeDomains, marqueeTools, workNumber } from "@/lib/i18n";

export default function Skills() {
  const { t } = useLocale();

  return (
    <section id="skills" className="overflow-hidden border-y border-line bg-bg py-24 md:py-32">
      {/* marquee band */}
      <div className="display select-none text-5xl text-fg md:text-7xl">
        <Marquee items={marqueeDomains} duration={32} />
        <div className="mt-3 text-accent">
          <Marquee items={marqueeTools} duration={26} reverse />
        </div>
      </div>

      <div className="mx-auto mt-24 max-w-[1600px] px-5 md:px-8">
        <AnimatedSection>
          <AnimatedItem className="flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
            <h2 className="display text-4xl md:text-6xl">{t.skills.heading}</h2>
            <p className="max-w-[52ch] text-sm leading-relaxed text-muted">{t.skills.note}</p>
          </AnimatedItem>
        </AnimatedSection>

        {/* skill groups */}
        <AnimatedSection className="mt-10 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {t.skills.groups.map((g, i) => (
            <AnimatedItem key={g.k} className="flex flex-col bg-bg p-8 md:p-10">
              <span className="font-mono text-xs tabular-nums text-muted">0{i + 1}</span>
              <h3 className="mt-6 text-2xl font-medium tracking-tight">{g.k}</h3>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="border border-line px-2 py-0.5 font-mono text-[11px] text-fg/75"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              {g.works.length > 0 && (
                <p className="mt-auto flex flex-wrap gap-x-3 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  <span>{t.skills.related}</span>
                  {g.works.map((id) => (
                    <a
                      key={id}
                      href={`#work-${workNumber(id)}`}
                      className="text-fg/80 transition-colors hover:text-accent"
                    >
                      {workNumber(id)}
                    </a>
                  ))}
                </p>
              )}
            </AnimatedItem>
          ))}
        </AnimatedSection>

        <AnimatedSection className="mt-8">
          <AnimatedItem className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <span>{t.skills.learning.k}</span>
            {t.skills.learning.items.map((item) => (
              <span key={item} className="border border-line px-2 py-0.5 normal-case tracking-normal text-fg/75">
                {item}
              </span>
            ))}
          </AnimatedItem>
        </AnimatedSection>
      </div>
    </section>
  );
}
