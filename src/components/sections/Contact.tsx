"use client";

import { useRef, useState, type FormEvent } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { revealOnEnter } from "@/lib/reveal";
import { SplitLines } from "@/components/ui/SplitLines";
import { SITE } from "@/lib/site";
import type { Dictionary } from "@/i18n/config";

const field =
  "w-full border-0 border-b border-cream/25 bg-transparent px-0 pt-2 pb-3 text-[15px] text-cream placeholder:text-cream/35 focus:border-gold focus:ring-0 focus:outline-none transition-colors";
const label = "caption text-parchment";

/** 08 — Contact: a B2B inquiry form for importers, distributors and partners. */
export function Contact({ t }: { t: Dictionary["contact"] }) {
  const f = t.fields;
  const root = useRef<HTMLElement>(null);
  const [opened, setOpened] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => revealOnEnter(root.current!));
    },
    { scope: root },
  );

  // No mail server is configured: compose a structured email in the visitor's own mail app.
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const products = data.getAll("products").map(String);
    const subject = `${get("inquiry") || t.subjectFallback} — ${get("company")}`;
    const details: [string, string][] = [
      [f.name, get("name")],
      [f.company, get("company")],
      [f.country, get("country")],
      [f.email, get("email")],
      [f.phone, get("phone")],
      [f.business, get("business")],
      [f.inquiry, get("inquiry")],
      [f.products, products.join(", ")],
      [f.volume, get("volume")],
    ];
    const body = details
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}: ${v}`)
      .concat("", get("message"))
      .join("\n");
    window.location.href = `mailto:${SITE.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  };

  return (
    <section
      ref={root}
      id="contact"
      data-nav="dark"
      className="relative bg-brown py-24 text-cream lg:py-[110px]"
      aria-labelledby="contact-title"
    >
      <div className="shell grid gap-16 lg:grid-cols-[minmax(0,500fr)_minmax(0,90fr)_minmax(0,690fr)] lg:gap-0">
        <div>
          <p data-fade className="eyebrow">{t.eyebrow}</p>
          <SplitLines
            id="contact-title"
            className="t-h2 mt-8 -ms-[4px] lg:mt-[40px]"
            lines={t.title}
          />
          <p data-fade className="mt-8 max-w-[440px] text-[15px] leading-[27.2px] text-parchment md:text-[16px]">
            {t.intro}
          </p>

          <dl data-fade className="mt-12 space-y-6 border-t border-cream/15 pt-8 text-[14px] leading-[22px]">
            <div>
              <dt className={label}>{t.email}</dt>
              <dd className="mt-2">
                <a href={`mailto:${SITE.contact.email}`} dir="ltr" className="transition-colors hover:text-gold">
                  {SITE.contact.email}
                </a>
              </dd>
            </div>
            {SITE.contact.phone && (
              <div>
                <dt className={label}>{t.phone}</dt>
                <dd className="mt-2" dir="ltr">{SITE.contact.phone}</dd>
              </div>
            )}
            <div>
              <dt className={label}>{t.location}</dt>
              <dd className="mt-2">{SITE.contact.address ?? t.country}</dd>
            </div>
          </dl>
        </div>

        <form data-fade onSubmit={onSubmit} className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:col-start-3" aria-describedby="contact-note">
          <label className="block">
            <span className={label}>{f.name} *</span>
            <input name="name" required autoComplete="name" className={field} />
          </label>
          <label className="block">
            <span className={label}>{f.company} *</span>
            <input name="company" required autoComplete="organization" className={field} />
          </label>
          <label className="block">
            <span className={label}>{f.email} *</span>
            <input name="email" type="email" dir="ltr" required autoComplete="email" className={field} />
          </label>
          <label className="block">
            <span className={label}>{f.phone}</span>
            <input name="phone" type="tel" dir="ltr" autoComplete="tel" className={field} />
          </label>
          <label className="block">
            <span className={label}>{f.country} *</span>
            <input name="country" required autoComplete="country-name" className={field} />
          </label>
          <label className="block">
            <span className={label}>{f.business} *</span>
            <select name="business" required defaultValue="" className={`${field} [&>option]:text-brown`}>
              <option value="" disabled>{t.select}</option>
              {t.businessTypes.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>

          <fieldset className="sm:col-span-2">
            <legend className={label}>{f.inquiry} *</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {t.inquiries.map((q, i) => (
                <label key={q} className="cursor-pointer">
                  <input type="radio" name="inquiry" value={q} required defaultChecked={i === 0} className="peer sr-only" />
                  <span className="block border border-cream/25 px-4 py-2 text-[12px] transition-colors peer-checked:border-gold peer-checked:bg-gold peer-checked:text-brown peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-gold">
                    {q}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="sm:col-span-2">
            <legend className={label}>{f.products}</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {t.productOptions.map((p) => (
                <label key={p} className="cursor-pointer">
                  <input type="checkbox" name="products" value={p} className="peer sr-only" />
                  <span className="block border border-cream/25 px-4 py-2 text-[12px] transition-colors peer-checked:border-gold peer-checked:text-gold peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-gold">
                    {p}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block sm:col-span-2">
            <span className={label}>{f.volume}</span>
            <input name="volume" placeholder={t.volumePlaceholder} className={field} />
          </label>
          <label className="block sm:col-span-2">
            <span className={label}>{f.message} *</span>
            <textarea name="message" required rows={4} className={`${field} resize-y`} placeholder={t.messagePlaceholder} />
          </label>

          <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <p id="contact-note" className="max-w-[360px] text-[11px] leading-[18px] text-parchment/80" aria-live="polite">
              {opened
                ? t.noteAfter
                : t.noteBefore}
            </p>
            <button
              type="submit"
              className="group inline-flex items-center gap-[34px] border border-cream px-[25px] py-[18px] text-cream transition-colors duration-500 hover:bg-cream hover:text-brown"
            >
              <span className="text-[12px] leading-[20.4px]">{t.submit}</span>
              <span aria-hidden className="text-[18px] leading-[30.6px] transition-transform duration-500 group-hover:translate-x-1.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-1.5">→</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
