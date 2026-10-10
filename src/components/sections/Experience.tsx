"use client";

import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { useLocale, workNumber } from "@/lib/i18n";

export default function Experience() {
  const { t } = useLocale();

  return (
    <section id="experience" className="bg-bg">
      <div className="mx-auto max-w-[1600px] px-5 py-28 md:px-8 md:py-40">
        <AnimatedSection>
          <AnimatedItem className="flex items-end justify-between border-b border-line pb-6">
            <h2 className="display text-4xl md:text-6xl">{t.experience.heading}</h2>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              {t.experience.subtitle}
            </span>
          </AnimatedItem>
        </AnimatedSection>

        <AnimatedSection className="mt-8">
          {t.experience.items.map((e) => (
            <AnimatedItem
              key={e.org}
              className="grid gap-2 border-b border-line py-7 md:grid-cols-[220px_1fr] md:gap-8"
            >
              <span className="font-mono text-xs tabular-nums tracking-wider text-accent">
                {e.period}
              </span>
              <div className="max-w-[64ch]">
                <h3 className="text-xl font-medium tracking-tight md:text-2xl">{e.org}</h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  {e.role}
                </p>
                <p className="mt-4 text-base leading-relaxed text-fg/85">{e.summary}</p>
                {e.work && (
                  <a
                    href={`#work-${workNumber(e.work)}`}
                    className="mt-4 inline-block border-b border-line pb-0.5 font-mono text-[11px] uppercase tracking-[0.2em] text-fg/80 transition-colors hover:text-accent"
                  >
                    {t.experience.related} {workNumber(e.work)} — {t.works.items[e.work].title}
                  </a>
                )}
              </div>
            </AnimatedItem>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}
