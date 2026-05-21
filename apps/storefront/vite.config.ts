import {defineConfig, loadEnv} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import {sanity} from 'hydrogen-sanity/vite';

export default defineConfig(({mode}) => {
  // Derive public Sanity values for the client bundle from the single
  // `.env` source. projectId and dataset appear in every CDN URL we
  // emit, so it's safe to inline them. Tokens stay server-only.
  const env = loadEnv(mode, process.cwd(), '');
  const clientEnv = {
    'import.meta.env.VITE_SANITY_PROJECT_ID': JSON.stringify(env.SANITY_PROJECT_ID ?? ''),
    'import.meta.env.VITE_SANITY_DATASET': JSON.stringify(env.SANITY_DATASET ?? 'production'),
  };

  return {
    plugins: [
      tailwindcss(),
      hydrogen(),
      oxygen(),
      reactRouter(),
      tsconfigPaths(),
      sanity(),
    ],
    define: clientEnv,
    build: {
      // Allow a strict Content-Security-Policy
      // without inlining assets as base64:
      assetsInlineLimit: 0,
    },
    ssr: {
      optimizeDeps: {
        include: [
          'react-router > set-cookie-parser',
          'react-router > cookie',
          'react-router',
        ],
      },
    },
    server: {
      allowedHosts: ['.tryhydrogen.dev'],
    },
  };
});
