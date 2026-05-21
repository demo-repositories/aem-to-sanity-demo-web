import {createHydrogenContext} from '@shopify/hydrogen';
import {createSanityContext, type SanityContext} from 'hydrogen-sanity';
import {PreviewSession} from 'hydrogen-sanity/preview/session';
import {isPreviewEnabled} from 'hydrogen-sanity/preview';
import {AppSession} from '~/lib/session';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';

// Define the additional context object
const additionalContext = {
  // Additional context for custom properties, CMS clients, 3P SDKs, etc.
  // These will be available as both context.propertyName and context.get(propertyContext)
  // Example of complex objects that could be added:
  // cms: await createCMSClient(env),
  // reviews: await createReviewsClient(env),
} as const;

// Automatically augment HydrogenAdditionalContext with the additional context type
type AdditionalContextType = typeof additionalContext;

declare global {
  interface HydrogenAdditionalContext extends AdditionalContextType {
    sanity: SanityContext;
  }
}

/**
 * Creates Hydrogen context for React Router 7.9.x
 * Returns HydrogenRouterContextProvider with hybrid access patterns
 * */
export async function createHydrogenRouterContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  /**
   * Open a cache instance in the worker and a custom session instance.
   */
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session, previewSession] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
    PreviewSession.init(request, [env.SESSION_SECRET]),
  ]);

  const sanity = await createSanityContext({
    request,
    cache,
    waitUntil,
    client: {
      projectId: env.SANITY_PROJECT_ID,
      dataset: env.SANITY_DATASET || 'production',
      apiVersion: env.SANITY_API_VERSION || 'v2024-08-08',
      useCdn: process.env.NODE_ENV === 'production',
      // The migration pipeline writes to a private dataset, so even
      // published reads need a viewer-scoped token. For a fully public
      // storefront we'd rely on dataset ACL and drop this.
      token: env.SANITY_PREVIEW_TOKEN,
      // Stega injects content-source markers into strings so Presentation's
      // overlay can map rendered text back to the field that produced it.
      // Only enable when preview is active - stega strings must never leak
      // into the public build. `studioUrl` is required once enabled; it's
      // the target Presentation redirects clicks to.
      stega: {
        enabled: isPreviewEnabled(env.SANITY_PROJECT_ID, previewSession),
        studioUrl: env.SANITY_STUDIO_HOSTNAME || 'http://localhost:3333',
      },
    },
    preview: {
      token: env.SANITY_PREVIEW_TOKEN,
      session: previewSession,
    },
  });

  const hydrogenContext = createHydrogenContext(
    {
      env,
      request,
      cache,
      waitUntil,
      session,
      // Or detect from URL path based on locale subpath, cookies, or any other strategy
      i18n: {language: 'EN', country: 'US'},
      cart: {
        queryFragment: CART_QUERY_FRAGMENT,
      },
    },
    {
      ...additionalContext,
      sanity,
    } as const,
  );

  return hydrogenContext;
}
