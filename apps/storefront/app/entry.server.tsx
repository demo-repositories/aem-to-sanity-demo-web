import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const {env, sanity} = context;
  const {SanityProvider} = sanity;
  const studioHostname = env.SANITY_STUDIO_HOSTNAME || 'http://localhost:3333';
  const sanityPreviewEnabled = Boolean(sanity.preview?.enabled);

  // CSP directives here are *appended* to Hydrogen's defaults (which already
  // include `'self'` + nonce for scripts/styles/images). Only add what the
  // Sanity integration needs on top.
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: env.PUBLIC_STORE_DOMAIN,
    },
    // Sanity image CDN for every image our blocks render.
    defaultSrc: ['https://cdn.sanity.io'],
    // Presentation iframes the storefront in preview mode only.
    frameAncestors: sanityPreviewEnabled ? [studioHostname] : [],
    // Browser-side connections for live preview + @sanity/react-loader's
    // WebSocket (`wss://<project>.api.sanity.io`).
    connectSrc: [
      'https://*.sanity.io',
      'wss://*.api.sanity.io',
      ...(sanityPreviewEnabled ? [studioHostname] : []),
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <SanityProvider>
        <ServerRouter
          context={reactRouterContext}
          url={request.url}
          nonce={nonce}
        />
      </SanityProvider>
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
