/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  // Oxygen runtime env. Shopify scaffold leaves other keys implicit; we add
  // the Sanity knobs `hydrogen-sanity` expects in createSanityContext.
  interface Env extends HydrogenEnv {
    SANITY_PROJECT_ID: string;
    SANITY_DATASET?: string;
    SANITY_API_VERSION?: string;
    SANITY_PREVIEW_TOKEN: string;
    SANITY_STUDIO_HOSTNAME?: string;
  }
}
