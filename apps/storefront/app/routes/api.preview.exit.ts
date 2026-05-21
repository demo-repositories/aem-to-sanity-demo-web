import {redirect, type LoaderFunctionArgs} from 'react-router';

// GET-accessible companion to /api/preview. Destroys the Sanity preview
// session cookie and redirects home, so operators can exit preview by
// visiting /api/preview/exit (or clicking a link) instead of issuing a
// POST/DELETE to the upstream hydrogen-sanity route.
export const loader = async ({context, request}: LoaderFunctionArgs) => {
  const previewSession = context.sanity?.preview?.session;
  const headers = new Headers();
  if (previewSession?.destroy) {
    headers.set('Set-Cookie', await previewSession.destroy());
  }
  const redirectTo = new URL(request.url).searchParams.get('redirect') ?? '/';
  return redirect(redirectTo, {headers});
};
