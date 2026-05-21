import {createClient, type SanityClient} from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type {SanityImageSource} from '@sanity/image-url/lib/types/types';

/**
 * Browser-side Sanity client used for ad-hoc lookups that haven't (yet)
 * been moved into route loaders — notably the Mux playback resolver
 * in `HeroVideoBanner`. Server-side data fetching should go through
 * `context.sanity.query` (preview-aware, cached by Hydrogen) instead.
 *
 * `projectId` / `dataset` are the only Sanity values we expose to the
 * client bundle. They're public (appear in every CDN URL we emit) so
 * this is safe. Sourced from `VITE_SANITY_*` - the Vite config derives
 * those from the `SANITY_*` worker env at build time so the `.env` has
 * a single source of truth.
 */
const projectId = (import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined) ?? '';
const dataset = (import.meta.env.VITE_SANITY_DATASET as string | undefined) ?? 'production';

export const sanity: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion: 'v2024-08-08',
  useCdn: true,
  perspective: 'published',
});

const builder = imageUrlBuilder({projectId, dataset});

/**
 * Thin wrapper over `@sanity/image-url`'s builder. Every block that
 * renders a Sanity image ref goes through here so width / quality /
 * format params stay uniform. Defaults: quality 82, `auto=format`.
 */
export function imageUrl(
  source: SanityImageSource,
  opts: {width?: number; quality?: number} = {},
): string {
  let u = builder.image(source);
  if (opts.width) u = u.width(opts.width);
  u = u.quality(opts.quality ?? 82).auto('format');
  return u.url();
}
