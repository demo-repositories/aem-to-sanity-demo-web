import {defineQuery} from 'groq';
import {CacheNone} from '@shopify/hydrogen';
import {Query} from 'hydrogen-sanity';
import type {Route} from './+types/_index';
import {Block} from '~/blocks';
import type {PageDoc} from '~/blocks/types';

/**
 * Home route - same shape as `$.tsx` but with the slug fixed to `home`.
 * React Router's route matcher picks `_index` for `/` before it tries
 * the splat route, so this wins the exact-match case and `$.tsx`
 * handles everything else.
 */
const HOME_QUERY = defineQuery(`*[_type == "page" && slug.current == "home"][0]{
  _id,
  _type,
  title,
  slug,
  pageBuilder
}`);

export const meta: Route.MetaFunction = ({data}) => {
  const initial = data?.initial;
  const doc = initial && 'data' in initial ? initial.data : initial;
  return [{title: doc?.title ?? 'Home'}];
};

export async function loader({context}: Route.LoaderArgs) {
  const initial = await context.sanity.query<PageDoc | null>(HOME_QUERY, undefined, {
    tag: 'page.home',
    // Always-fresh while iterating on the migration. Swap to CacheShort
    // once the dataset is stable to regain edge caching + lower load.
    hydrogen: {cache: CacheNone(), debug: {displayName: 'page:home'}},
  });

  const doc = initial && 'data' in initial ? initial.data : initial;
  if (!doc) {
    throw new Response('Home page not found in Sanity', {status: 404});
  }

  return {initial};
}

export default function Homepage({loaderData}: Route.ComponentProps) {
  const {initial} = loaderData;

  return (
    <Query query={HOME_QUERY} options={{initial}}>
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
