// Preview-mode auth route consumed by Sanity Studio's Presentation tool.
// Writes the signed preview cookie when the shared secret matches; the
// storefront then fetches drafts and enables Visual Editing overlays.
export {action, loader} from 'hydrogen-sanity/preview/route';
