import {defineQuery} from 'groq';
import {CacheNone} from '@shopify/hydrogen';
import {Query} from 'hydrogen-sanity';
import type {Route} from './+types/$';
import {Block} from '~/blocks';
import type {PageDoc} from '~/blocks/types';

/**
 * Catch-all Sanity page route. Renders any `page` document whose
 * `slug.current` matches the splat segment; `/` is handled by
 * `_index.tsx` with a hard-coded "home" slug.
 *
 * Data flow mirrors hydrogen-sanity's recommended pattern:
 *  1. Loader calls `context.sanity.query` server-side — preview-aware,
 *     cached through Hydrogen's subrequest cache.
 *  2. `<Query>` hydrates with that `initial` result and, when preview
 *     is active, subscribes via `@sanity/react-loader` for live
 *     Studio updates. In public mode it's a pure pass-through.
 */
const PAGE_QUERY = defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  slug,
  pageBuilder
}`);

export async function loader({context, params}: Route.LoaderArgs) {
  const slug = params['*'] || 'home';
  const initial = await context.sanity.query<PageDoc | null>(
    PAGE_QUERY,
    {slug},
    {
      tag: `page.${slug}`.replace(/[^a-zA-Z0-9_.-]/g, '-').slice(0, 75),
      // Always-fresh while iterating on the migration. Swap to CacheShort
      // once the dataset is stable to regain edge caching + lower load.
      hydrogen: {cache: CacheNone(), debug: {displayName: `page:${slug}`}},
    },
  );

  // `query` returns a bare doc in public mode and a
  // QueryResponseInitial wrapper (with `.data`) in preview mode.
  // Narrow to a doc for the existence check.
  const doc = initial && 'data' in initial ? initial.data : initial;
  if (!doc) {
    throw new Response(`Page "${slug}" not found`, {status: 404});
  }

  return {slug, initial};
}

export default function SanityPage({loaderData}: Route.ComponentProps) {
  const {slug, initial} = loaderData;

  return (
    <Query query={PAGE_QUERY} params={{slug}} options={{initial}}>
      {(page) => {
        if (!page) return null;
        return (
          <main>
            {(page.pageBuilder ?? []).map((block) => {
              const b = block as {_key: string; _type: string} & Record<string, unknown>;
              return <Block key={b._key} block={b} />;
            })}
          </main>
        );
      }}
    </Query>
  );
}
