import Image from "next/image";
import { JourneyStop } from "@/components/ui/JourneyStop";
import type { STOPS } from "@/lib/journey";

export type Product = {
  category: string;
  title: string;
  description: string;
  formats: string;
  img: string;
  alt: string;
  stop?: keyof typeof STOPS;
};

/** Figma: Product / Editorial card (2:109) */
export function ProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  return (
    <article className="group flex flex-col gap-[18px]">
      <div data-reveal-img={delay} className="relative aspect-[410/370] overflow-hidden">
        <div data-reveal-scale className="absolute inset-0">
          <Image
            src={product.img}
            alt={product.alt}
            fill
            sizes="(min-width: 1024px) 29vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover"
          />
          {product.stop && <JourneyStop id={product.stop} />}
        </div>
      </div>
      <p data-fade={delay} className="text-[10px] leading-[17px] tracking-[1.5px] text-muted uppercase">
        {product.category}
      </p>
      <h3 data-fade={delay} className="font-serif text-[40px] leading-[42px]">
        {product.title}
      </h3>
      <p data-fade={delay} className="max-w-[360px] text-[14px] leading-[23.8px] text-muted">
        {product.description}
      </p>
      <p data-fade={delay} className="text-[11px] leading-[18.7px]">
        {product.formats}
      </p>
    </article>
  );
}
