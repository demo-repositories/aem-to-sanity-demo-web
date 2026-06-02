import { imageUrl } from "../sanity.ts";
import type { PromoBgImage, StoreBannerBlock } from "../types.ts";

/**
 * storeBanner — thin full-width promotional banner (partner / marketing
 * art baked into the image, ~1440x106). Same responsive `bgImages[]`
 * shape as `promo`: a desktop and a mobile variant tagged via `visible`.
 * `description` is usually a placeholder dot, so we don't render it.
 */
export function StoreBanner({ block }: { block: StoreBannerBlock }) {
  const desktop = pickImage(block.bgImages, "desktop");
  const mobile = pickImage(block.bgImages, "mobile");
  const desktopUrl = desktop?.fileReference
    ? imageUrl(desktop.fileReference, { width: 2160 })
    : undefined;
  const mobileUrl = mobile?.fileReference
    ? imageUrl(mobile.fileReference, { width: 900 })
    : undefined;
  if (!desktopUrl) return null;

  const href = block.link ?? block.bgImages?.find((b) => b.imageLink)?.imageLink;
  const content = (
    <picture>
      {mobileUrl ? <source media="(max-width: 767px)" srcSet={mobileUrl} /> : null}
      <img src={desktopUrl} alt="" className="h-auto w-full object-cover" loading="lazy" />
    </picture>
  );

  return (
    <section className="bg-[color:var(--color-surface)]">
      {href ? (
        <a href={href} className="block">
          {content}
        </a>
      ) : (
        content
      )}
    </section>
  );
}

function pickImage(
  images: PromoBgImage[] | undefined,
  visible: string,
): PromoBgImage | undefined {
  if (!images?.length) return undefined;
  return (
    images.find((b) => b.fileReference && b.visible === visible) ??
    images.find((b) => b.fileReference)
  );
}
