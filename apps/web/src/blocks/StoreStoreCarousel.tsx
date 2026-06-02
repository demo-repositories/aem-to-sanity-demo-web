import { imageUrl } from "../sanity.ts";
import type { StoreCarouselItem, StoreStoreCarouselBlock } from "../types.ts";
import { PortableText } from "./PortableText.tsx";

/**
 * storeStoreCarousel — the "what you'll find here" category cards on a
 * store page. Each item is a portrait image + headline + short blurb +
 * CTA. Production renders these as a swipeable carousel; we lay them out
 * as a responsive grid that scrolls horizontally on small screens, which
 * reads cleanly without pulling in a carousel dependency.
 */
export function StoreStoreCarousel({ block }: { block: StoreStoreCarouselBlock }) {
  const items = (block.carouselItems ?? []).filter((i) => i.fileReference || i.headline);
  const heading = block.headline2?.trim() || block.headline1?.trim();
  if (items.length === 0 && !heading) return null;

  return (
    <section
      className={`bg-[color:var(--color-surface-cream)] ${block.removeTopPadding ? "pt-4" : "pt-16 md:pt-20"} ${block.removeBottomPadding ? "pb-4" : "pb-16 md:pb-20"}`}
    >
      <div className="mx-auto max-w-[88rem] px-6 md:px-10">
        {heading ? (
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-[2.5rem] font-light leading-[1.1] tracking-[-0.01em] text-[color:var(--color-on-surface)] lowercase">
              {heading}
            </h2>
          </div>
        ) : null}
        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 md:gap-6">
          {items.map((item) => (
            <Card key={item._key} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function Card({ item }: { item: StoreCarouselItem }) {
  const src = item.fileReference ? imageUrl(item.fileReference, { width: 600 }) : undefined;
  const href = item.ctaLink;

  const media = src ? (
    <div className="aspect-[2/3] overflow-hidden rounded-lg bg-[color:var(--color-surface-muted)]">
      <img
        src={src}
        alt={item.headline ?? ""}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
      />
    </div>
  ) : (
    <div className="aspect-[2/3] rounded-lg bg-[color:var(--color-surface-muted)]" />
  );

  return (
    <li className="flex flex-col">
      {href ? (
        <a href={href} aria-label={item.headline} className="block">
          {media}
        </a>
      ) : (
        media
      )}
      {item.headline ? (
        <h3 className="mt-4 text-lg font-normal capitalize text-[color:var(--color-on-surface)]">
          {item.headline}
        </h3>
      ) : null}
      {item.columnText?.length ? (
        <div className="mt-1 text-sm text-[color:var(--color-on-surface-muted)] [&_p]:text-sm [&_p]:leading-[1.5] [&_p]:mb-0">
          <PortableText value={item.columnText} />
        </div>
      ) : null}
      {item.ctaText && href ? (
        <a
          href={href}
          className="mt-3 inline-flex items-center self-start text-sm font-medium uppercase tracking-[0.06em] text-[color:var(--color-primary)] underline underline-offset-4 decoration-transparent hover:decoration-[color:var(--color-primary)] transition-colors duration-200"
        >
          {item.ctaText}
        </a>
      ) : null}
    </li>
  );
}
