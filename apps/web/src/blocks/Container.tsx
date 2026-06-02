import type { ContainerBlock, ContainerContentItem } from "../types.ts";
import { PortableText } from "./PortableText.tsx";

/**
 * AEM `container` — generic layout wrapper. On store details pages it
 * carries the long-form SEO copy: an optional `headerOne[]` heading
 * (usually empty — the heading lives inside the body copy) and a
 * `content[]` stack of styled rich-text runs.
 *
 * We render the content in a comfortable reading measure and honor the
 * authored per-run `align` / `uppercase` hints. Empty runs (AEM ships a
 * placeholder empty `h1` on these blocks) drop out because PortableText
 * filters blank blocks.
 */
export function Container({ block }: { block: ContainerBlock }) {
  const heading = block.headerOne?.find((h) => h.text?.trim())?.text?.trim();
  const items = (block.content ?? []).filter(
    (c): c is ContainerContentItem => Boolean(c?.text?.length),
  );

  if (!heading && items.length === 0) return null;

  return (
    <section className="bg-[color:var(--color-surface)] py-12 md:py-16">
      <div className="mx-auto max-w-[52rem] px-6 md:px-10">
        {heading ? (
          <h2 className="mb-6 text-3xl md:text-4xl font-light leading-[1.1] tracking-[-0.01em] text-[color:var(--color-on-surface)]">
            {heading}
          </h2>
        ) : null}
        {items.map((item) => (
          <div
            key={item._key}
            className={alignClass(item.align) + (item.uppercase ? " uppercase" : "")}
          >
            <PortableText value={item.text} />
          </div>
        ))}
      </div>
    </section>
  );
}

function alignClass(align?: string): string {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "";
}
