import type { StoreReviewsBlock } from "../types.ts";

/**
 * storeReviews — third-party reviews widget. Production hydrates this
 * client-side from the reviews service; the migrated block carries no
 * data. We render a labeled placeholder consistent with the other
 * runtime-fed widgets (gallery, product carousel) so the page rhythm
 * stays intact and the intent is obvious.
 */
export function StoreReviews(_props: { block: StoreReviewsBlock }) {
  return (
    <section className="bg-[color:var(--color-surface)] py-12 md:py-16">
      <div className="mx-auto max-w-[88rem] px-6 md:px-10">
        <div className="mb-8 text-center">
          <p className="label-eyebrow mb-2">From our customers</p>
          <h2 className="text-2xl md:text-[2rem] font-normal leading-[1.1] text-[color:var(--color-on-surface)]">
            Store reviews
          </h2>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <li
              key={i}
              className="rounded-lg border border-[color:var(--color-outline)] bg-[color:var(--color-surface-cream)] p-6"
            >
              <div className="mb-4 flex gap-1" aria-hidden>
                {Array.from({ length: 5 }).map((_, s) => (
                  <span key={s} className="text-[color:var(--color-accent-gold)]">
                    ★
                  </span>
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-[color:var(--color-surface-muted)]" />
                <div className="h-3 w-5/6 rounded bg-[color:var(--color-surface-muted)]" />
                <div className="h-3 w-2/3 rounded bg-[color:var(--color-surface-muted)]" />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-xs text-[color:var(--color-on-surface-muted)]">
          (Live reviews render via the reviews widget on production.)
        </p>
      </div>
    </section>
  );
}
