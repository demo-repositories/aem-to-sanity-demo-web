import type { StoreDetailsBlock } from "../types.ts";

/**
 * storeDetails — the store-locator panel at the top of a store details
 * page. On production this hydrates at runtime from the store-locator
 * service (address, hours, phone, map) keyed on the store number in the
 * URL, so the migrated block carries only `bookAppointmentsButtonLink`.
 *
 * Everything else we can show honestly comes from the page title + slug:
 * the slug encodes `<city>-<state>-<zip>-<storeNumber>` (e.g.
 * `hoover-al-352441215-0044`). We surface the store name, locality, ZIP,
 * and store number, the authored "Book an appointment" CTA, and a
 * directions link — and we're explicit that live hours / address come
 * from the locator service rather than fabricating them.
 */
export function StoreDetails({
  block,
  page,
}: {
  block: StoreDetailsBlock;
  page?: { title?: string; slug?: string };
}) {
  const parsed = parseStoreSlug(page?.slug);
  const name = page?.title?.trim() || "David's Bridal";
  const bookLink = block.bookAppointmentsButtonLink || "/store-appointments/";
  const directionsQuery = encodeURIComponent(
    [name, parsed?.state, parsed?.zip, "David's Bridal"].filter(Boolean).join(" "),
  );

  return (
    <section className="bg-[color:var(--color-surface-cream)] py-12 md:py-16">
      <div className="mx-auto max-w-[88rem] px-6 md:px-10">
        <nav className="label-eyebrow mb-6 flex flex-wrap items-center gap-2">
          <a href="/stores" className="hover:text-[color:var(--color-primary)] transition-colors">
            Stores
          </a>
          {parsed?.stateName ? (
            <>
              <span aria-hidden>/</span>
              <span>{parsed.stateName}</span>
            </>
          ) : null}
          <span aria-hidden>/</span>
          <span className="text-[color:var(--color-on-surface)]">{name}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div>
            <p className="label-eyebrow mb-3">David's Bridal Store</p>
            <h1 className="text-[2.25rem] md:text-[3rem] font-light leading-[1.05] tracking-[-0.01em] text-[color:var(--color-on-surface)]">
              {name}
            </h1>

            <dl className="mt-7 grid max-w-md grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {parsed?.zip ? (
                <Fact label="ZIP" value={parsed.zip} />
              ) : null}
              {parsed?.storeNumber ? (
                <Fact label="Store number" value={`#${parsed.storeNumber}`} />
              ) : null}
              {parsed?.state ? (
                <Fact label="State" value={parsed.stateName ?? parsed.state} />
              ) : null}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={bookLink} className="cta-primary inline-flex items-center">
                Book an appointment
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${directionsQuery}`}
                target="_blank"
                rel="noreferrer"
                className="cta-outline inline-flex items-center"
              >
                Get directions
              </a>
            </div>
          </div>

          {/* Hours / address / phone are served by the locator service at
              runtime — render the labelled slot rather than inventing data. */}
          <aside className="rounded-lg border border-[color:var(--color-outline)] bg-[color:var(--color-surface)] p-6 shadow-[var(--shadow-soft)]">
            <p className="label-eyebrow mb-4">Store information</p>
            <ul className="space-y-4 text-sm text-[color:var(--color-on-surface-muted)]">
              <SlotRow label="Address" />
              <SlotRow label="Phone" />
              <SlotRow label="Today's hours" />
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-[color:var(--color-on-surface-muted)]">
              Live address, phone, and store hours are served by the
              store-locator service on production.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label-eyebrow mb-1">{label}</dt>
      <dd className="text-base text-[color:var(--color-on-surface)]">{value}</dd>
    </div>
  );
}

function SlotRow({ label }: { label: string }) {
  return (
    <li className="flex items-center justify-between gap-4">
      <span className="font-medium text-[color:var(--color-on-surface)]">{label}</span>
      <span className="h-3 w-28 rounded bg-[color:var(--color-surface-muted)]" aria-hidden />
    </li>
  );
}

interface ParsedStore {
  state?: string;
  stateName?: string;
  zip?: string;
  storeNumber?: string;
}

/**
 * Store slugs encode `<city>-<state>-<zip>-<storeNumber>`, e.g.
 * `hoover-al-352441215-0044` or `aurora-co-80014-0196`. The city slug is
 * a single token (multi-word cities are concatenated). We read from the
 * right so a multi-token city never throws the parse off: last segment
 * is the store number, then ZIP, then the two-letter state.
 */
function parseStoreSlug(slug?: string): ParsedStore | null {
  if (!slug) return null;
  const parts = slug.split("-").filter(Boolean);
  if (parts.length < 4) return null;
  const storeNumber = parts[parts.length - 1];
  const rawZip = parts[parts.length - 2];
  const state = parts[parts.length - 3]?.toUpperCase();
  return {
    state,
    stateName: state ? US_STATES[state] : undefined,
    zip: formatZip(rawZip),
    storeNumber,
  };
}

function formatZip(zip?: string): string | undefined {
  if (!zip || !/^\d+$/.test(zip)) return zip;
  // 9-digit ZIP+4 (no dash) → split into 5-4.
  if (zip.length === 9) return `${zip.slice(0, 5)}-${zip.slice(5)}`;
  return zip;
}

/** Two-letter → full name for the breadcrumb. Includes the Canadian
 * provinces present in the dataset (store list spans US + CA). */
const US_STATES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina",
  ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee",
  TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington",
  WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming", DC: "Washington, D.C.",
  AB: "Alberta", BC: "British Columbia", ON: "Ontario", NS: "Nova Scotia",
};
