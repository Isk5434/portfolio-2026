"use client";

import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection";
import { useLocale } from "@/lib/i18n";

const PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicPath = (path: string) => `${PUBLIC_BASE_PATH}${path}`;

export default function Achievements() {
  const { t } = useLocale();

  return (
    <section id="achievements" className="bg-bg">
      <div className="mx-auto max-w-[1600px] px-5 pb-28 md:px-8 md:pb-40">
        <AnimatedSection>
          <AnimatedItem className="flex items-end justify-between border-b border-line pb-6">
            <h2 className="display text-4xl md:text-6xl">{t.achievements.heading}</h2>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
              {t.achievements.subtitle}
            </span>
          </AnimatedItem>
        </AnimatedSection>

        {t.achievements.groups.map((g) => (
          <AnimatedSection key={g.label} className="mt-12">
            <AnimatedItem>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
                {g.label}
              </p>
            </AnimatedItem>
            {g.items.map((item) => (
              <AnimatedItem
                key={item.title}
                className="grid gap-2 border-b border-line py-6 md:grid-cols-[220px_1fr] md:gap-8"
              >
                <span className="font-mono text-xs tabular-nums tracking-wider text-accent">
                  {item.when}
                </span>
                <div className="max-w-[64ch]">
                  <p className="text-base font-medium leading-relaxed text-fg md:text-lg">
                    {item.title}
                  </p>
                  {item.note && (
                    <p className="mt-2 text-sm leading-relaxed text-fg/70">{item.note}</p>
                  )}
                  {item.image && (
                    <a
                      href={publicPath(item.image.src)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 block w-full max-w-[280px] border border-line transition-opacity hover:opacity-80"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={publicPath(item.image.src)}
                        alt={item.image.alt}
                        loading="lazy"
                        className="block h-auto w-full"
                      />
                    </a>
                  )}
                </div>
              </AnimatedItem>
            ))}
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
