import type { PortableTextBlock } from "@portabletext/react";

export interface SanityImageRef {
  _type: "image" | "file";
  asset: { _type: "reference"; _ref: string };
}

export interface BaseBlock {
  _type: string;
  _key: string;
}

export interface PromoBgImage {
  _key: string;
  fileReference?: SanityImageRef;
  fileReferenceAemPath?: string;
  imageLink?: string;
  /** AEM authoring hint: which breakpoint this image is intended for. */
  visible?: "desktop" | "mobile" | string;
  alignment?: string;
}

export interface PromoButton {
  _key: string;
  text?: string;
  link?: string;
  /**
   * AEM button style hint. Real data uses `ghost` (outlined) and `link`
   * (inline text link); `button` is the filled-primary variant.
   */
  type?: "button" | "ghost" | "link" | string;
  ariaLabel?: string;
  buttonHexColor?: string;
  ctaTextHexColor?: string;
}

export interface PromoBlock extends BaseBlock {
  _type: "promo";
  headline1?: string;
  headline2?: string;
  description?: PortableTextBlock[];
  /** Legacy single-image shape, still rendered when bgImages isn't present. */
  fileReference?: SanityImageRef;
  fileReferenceAemPath?: string;
  imageLink?: string;
  link?: string;
  /** Responsive banner variants (desktop + mobile), authored as a multifield. */
  bgImages?: PromoBgImage[];
  /** CTA row. Multiple buttons, each with its own style hint. */
  buttons?: PromoButton[];
  tagLevel?: string;
  align?: "left" | "center" | "right";
  size?: string;
  theme?: string;
  backgroundColor?: string;
  copySize?: string;
}

export interface HrBlock extends BaseBlock {
  _type: "hr";
  mt?: number;
  mb?: number;
  ml?: number;
  mr?: number;
  pt?: number;
  pb?: number;
  pl?: number;
  pr?: number;
  color?: string;
}

export interface ColorCarouselItem {
  _key: string;
  name?: string;
  link?: string;
  fileReference?: SanityImageRef;
  fileReferenceAemPath?: string;
  hexValue?: string;
  description?: string;
}

export interface ColorCarouselBlock extends BaseBlock {
  _type: "colorCarousel";
  headline1?: string;
  headline2?: string;
  description?: PortableTextBlock[];
  colors?: ColorCarouselItem[];
  theme?: string;
  removeTopPadding?: boolean;
  removeBottomPadding?: boolean;
}

export interface VariableColumnItem {
  _key: string;
  headline?: string;
  imageLink?: string;
  fileReference?: SanityImageRef;
  fileReferenceAemPath?: string;
  columnText?: PortableTextBlock[];
  cta?: Array<{
    _key: string;
    type?: "button" | "link";
    text?: string;
    link?: string;
    ariaLabel?: string;
  }>;
}

export interface VariableColumnBlock extends BaseBlock {
  _type: "variableColumn";
  headline1?: string;
  headline2?: string;
  description?: PortableTextBlock[];
  columnContents?: VariableColumnItem[];
  columns?: string;
  removeTopPadding?: boolean;
  removeBottomPadding?: boolean;
}

/**
 * Sanity file ref (video, etc). Same shape as image but `_type: "file"`.
 */
export interface SanityFileRef {
  _type: "file";
  asset: { _type: "reference"; _ref: string };
}

export interface SanityVideoPlayback {
  _id: string;
  _key: string;
  policy?: "public" | "signed";
}

/**
 * Themed video hero with up to three overlay text lines and an optional
 * still-image poster. AEM authors choose which line acts as the
 * headline via `tagLevel`; we render line two as the prominent headline
 * by convention (matches what production renders).
 */
export interface HeroVideoBannerBlock extends BaseBlock {
  _type: "heroVideoBanner";
  fileReference?: SanityFileRef;
  fileReferenceAemPath?: string;
  thumbnail?: SanityImageRef;
  lineOneText?: string;
  lineTwoText?: string;
  lineThreeText?: string;
  lineOneTextColorHex?: string;
  lineTwoTextColorHex?: string;
  lineThreeTextColorHex?: string;
  textAlign?: "left" | "center" | "right";
  contentPosition?: "left" | "center" | "right";
  textBackgroundColor?: string;
  textColor?: string;
  fullWidth?: boolean;
  autoPlay?: boolean;
  loopVideo?: boolean;
  playWithSound?: boolean;
  showSoundIcon?: boolean;
  buttonHeightDesktop?: number;
  tagLevel?: string;
}

/**
 * UGC / curated gallery widget. Production embeds a third-party feed
 * (Crowdriff) via `galleryTag` (raw HTML); we render the headline and
 * a placeholder grid since the script doesn't run inside this preview.
 */
export interface GalleryBlock extends BaseBlock {
  _type: "gallery";
  headline1?: string;
  headline2?: string;
  galleryTag?: string;
  theme?: string;
  removeTopPadding?: boolean;
  removeBottomPadding?: boolean;
}

/**
 * Server-rendered product strip on production (catalog feed). The
 * authored block carries layout metadata only — actual products come
 * from the product service. We render the headline + a styled slot
 * placeholder so the page rhythm is preserved.
 */
export interface ProductCarouselBlock extends BaseBlock {
  _type: "productCarousel";
  headline1?: string;
  headline2?: string;
  description?: PortableTextBlock[];
  columns?: string;
  layoutWidth?: string;
  mobileLayout?: string;
  theme?: string;
  removeTopPadding?: boolean;
  removeBottomPadding?: boolean;
}

/**
 * Multi-icon row (e.g. measurement tips, value props). On the
 * inspiration page the actual icons aren't on the top-level block
 * (they live nested in a way our flat schema doesn't surface yet).
 * We render headline + a placeholder column count so the section
 * still occupies its intended footprint.
 */
export interface IconGridBlock extends BaseBlock {
  _type: "iconGrid";
  headline1?: string;
  headline2?: string;
  columns?: string;
  textAlign?: "left" | "center" | "right";
  theme?: string;
  removeTopPadding?: string | boolean;
  removeBottomPadding?: string | boolean;
}

export interface FaqHubNestedLink {
  _key: string;
  text?: string;
  link?: string;
}

export interface FaqHubSection {
  _key: string;
  sectionTitle?: string;
  fileReference?: SanityImageRef;
  fileReferenceAemPath?: string;
  nestedLinks?: FaqHubNestedLink[];
}

export interface FaqHubBlock extends BaseBlock {
  _type: "faqHub";
  headline1?: string;
  headline2?: string;
  description?: PortableTextBlock[];
  sections?: FaqHubSection[];
  buttons?: PromoButton[];
  removeTopPadding?: boolean;
  removeBottomPadding?: boolean;
}

/**
 * AEM `box` / `content` widget — generic rich-text container. Carries
 * the rendered text on its `text` field (Portable Text after the
 * registry-driven coercion; legacy migrations may still have the raw
 * HTML string). Used inside `expander` items.
 *
 * `panelTitle` is the optional heading for accordion / expander panels
 * (lifted from AEM's `cq:panelTitle`). Present on the wrapping box only
 * when the component is used as a panel child.
 *
 * `items` is the container-children array discovered by the schema
 * walker — when the box wraps another `content` node, the actual text
 * lives one level deeper rather than directly on the box.
 */
export interface AemBoxLike {
  _key: string;
  text?: string | PortableTextBlock[];
  align?: string;
  fontFamily?: string;
  fontWeight?: string;
  panelTitle?: string;
  items?: AemBoxLike[];
}

export interface ExpanderItem {
  _key: string;
  content?: AemBoxLike;
  /** AEM stores the box content under variable keys like `content_1747537251_c`. */
  [contentKey: string]: unknown;
}

export interface ExpanderBlock extends BaseBlock {
  _type: "expander";
  /**
   * Modern shape: container-children walker emits panel boxes here.
   * Legacy shape (pre-slot-discovery): first item under `box`, the rest
   * under variable `item_*` keys.
   */
  items?: AemBoxLike[];
  box?: ExpanderItem;
  expandedItems?: string[];
  headline1?: string;
  headline2?: string;
  removeTopPadding?: boolean;
  removeBottomPadding?: boolean;
  [itemKey: string]: unknown;
}

export interface QuoteBlock extends BaseBlock {
  _type: "quote";
  quote?: PortableTextBlock[];
  align?: "left" | "center" | "right";
  size?: string;
  theme?: string;
  backgroundColor?: string;
  quotationMarksEnabled?: boolean;
}

/**
 * Centered text-only section break — `headline2` is the prominent
 * display headline (David's Bridal pattern), `description` is a
 * supporting paragraph.
 */
export interface SectionHeadlineBlock extends BaseBlock {
  _type: "sectionHeadline";
  headline1?: string;
  headline2?: string;
  description?: PortableTextBlock[];
  theme?: string;
  removeTopPadding?: boolean;
  removeBottomPadding?: boolean;
}

export interface FeatureCardMediaItem {
  _key: string;
  fileReference?: SanityImageRef;
  fileReferenceAemPath?: string;
  visible?: "desktop" | "mobile" | string;
  title?: string;
  videoAssetPreviewImage?: SanityImageRef;
}

/**
 * Editorial photo block — three numbered image slots with optional
 * per-image links and labels, paired with a headline block (title +
 * sansSerifHeadline + description) at the top and a free-text copy
 * block (`imageText2`) that pairs with the middle image. AEM serializes
 * the slots as flat `fileReferenceN` / `imageLinkN` / `linkN` /
 * `linkTitleN` properties; we render whatever the author populated and
 * skip the rest.
 */
export interface PhotoLayoutBlock extends BaseBlock {
  _type: "photoLayout";
  headline1?: string;
  headline2?: string;
  sansSerifHeadline?: string;
  description?: PortableTextBlock[];
  imageText2?: PortableTextBlock[];
  fileReference1?: SanityImageRef;
  fileReference2?: SanityImageRef;
  fileReference3?: SanityImageRef;
  fileReference1AemPath?: string;
  fileReference2AemPath?: string;
  fileReference3AemPath?: string;
  imageLink1?: string;
  imageLink2?: string;
  imageLink3?: string;
  link1?: string;
  link2?: string;
  link3?: string;
  linkTitle1?: string;
  linkTitle2?: string;
  linkTitle3?: string;
  theme?: string;
  mobileLayout?: string;
  removeTopPadding?: boolean;
  removeBottomPadding?: boolean;
}

/**
 * Two-column feature row (image one side, copy + CTA on the other).
 * `layoutArrangement` decides which side the image lands on.
 */
export interface FeatureCardBlock extends BaseBlock {
  _type: "featureCard";
  headline?: string;
  overline?: string;
  bodyText?: PortableTextBlock[];
  mediaItems?: FeatureCardMediaItem[];
  buttons?: PromoButton[];
  layoutArrangement?: "img_left" | "img_right" | string;
  layoutType?: string;
  textAlign?: "left" | "center" | "right";
  cardBackground?: string;
  theme?: string;
  removeTopPadding?: boolean;
  removeBottomPadding?: boolean;
}

export interface ResourcesColumnListBlock extends BaseBlock {
  _type: "resourcesColumnList";
  removeTopPadding?: boolean;
  removeBottomPadding?: boolean;
  /** AEM nests one item under the static key `resources-column-item`. */
  "resources-column-item"?: { _key: string; content?: AemBoxLike; [k: string]: unknown };
  [columnKey: string]: unknown;
}

/**
 * Fallback shape for any block this demo doesn't have a dedicated
 * renderer for. Kept separate from the discriminated union so TypeScript
 * can narrow the known `_type`s cleanly in the dispatcher switch.
 */
export interface UnknownBlock extends BaseBlock {
  [key: string]: unknown;
}

/**
 * `storeDetails` — the store-locator panel at the top of a store
 * details page. On production this component is hydrated at runtime
 * from the store-locator service keyed on the store number in the URL,
 * so the migrated block carries only the authored `bookAppointmentsButtonLink`.
 * The renderer derives the display name / locality / store number from
 * the page title + slug (the slug encodes `<city>-<state>-<zip>-<storeNo>`).
 */
export interface StoreDetailsBlock extends BaseBlock {
  _type: "storeDetails";
  bookAppointmentsButtonLink?: string;
}

/**
 * AEM `content` widget as it appears inside a `container` — a styled
 * rich-text run. `text` holds the Portable Text; the rest are AEM
 * presentation hints (font sizing, color token, alignment) we honor
 * loosely.
 */
export interface ContainerContentItem {
  _key: string;
  _type: "content";
  text?: PortableTextBlock[];
  align?: "left" | "center" | "right" | string;
  uppercase?: boolean;
  fontSize?: number;
  color?: string;
}

/**
 * AEM `headerOne` heading config inside a container. Carries styling
 * (font size/weight/color) and, when authored, a `text` string. On the
 * store pages it's typically empty — the heading lives in the body copy
 * instead — so the renderer only emits a heading when `text` is present.
 */
export interface ContainerHeaderItem {
  _key: string;
  _type: "headerOne";
  text?: string;
  align?: "left" | "center" | "right" | string;
  uppercase?: string | boolean;
}

/**
 * AEM `container` — generic layout wrapper. On store pages it holds the
 * SEO body copy: an optional `headerOne[]` heading and a `content[]`
 * stack of styled rich-text runs.
 */
export interface ContainerBlock extends BaseBlock {
  _type: "container";
  headerOne?: ContainerHeaderItem[];
  content?: ContainerContentItem[];
}

/**
 * `storeReviews` — third-party reviews widget (hydrated client-side on
 * production from the reviews service). The migrated block carries no
 * data, so the renderer shows a labeled placeholder consistent with the
 * other runtime-fed widgets (gallery / product carousel).
 */
export interface StoreReviewsBlock extends BaseBlock {
  _type: "storeReviews";
}

export interface StoreCarouselItem {
  _key: string;
  headline?: string;
  columnText?: PortableTextBlock[];
  ctaText?: string;
  ctaLink?: string;
  ctaType?: "button" | "link" | string;
  fileReference?: SanityImageRef;
  fileReferenceAemPath?: string;
}

/**
 * `storeStoreCarousel` — the "what you'll find here" category cards on a
 * store page. Each item is an image + headline + blurb + CTA.
 */
export interface StoreStoreCarouselBlock extends BaseBlock {
  _type: "storeStoreCarousel";
  headline1?: string;
  headline2?: string;
  carouselItems?: StoreCarouselItem[];
  removeTopPadding?: boolean;
  removeBottomPadding?: boolean;
}

/**
 * `storeBanner` — thin full-width promotional banner (partner/marketing
 * art baked into the image). Same responsive `bgImages[]` shape as
 * `promo`; `description` is usually a placeholder dot.
 */
export interface StoreBannerBlock extends BaseBlock {
  _type: "storeBanner";
  bgImages?: PromoBgImage[];
  description?: PortableTextBlock[];
  link?: string;
  align?: "left" | "center" | "right" | string;
  theme?: string;
}

export type PageBlock =
  | PromoBlock
  | HrBlock
  | ColorCarouselBlock
  | VariableColumnBlock
  | HeroVideoBannerBlock
  | GalleryBlock
  | ProductCarouselBlock
  | IconGridBlock
  | FaqHubBlock
  | ExpanderBlock
  | QuoteBlock
  | ResourcesColumnListBlock
  | SectionHeadlineBlock
  | FeatureCardBlock
  | PhotoLayoutBlock
  | StoreDetailsBlock
  | ContainerBlock
  | StoreReviewsBlock
  | StoreStoreCarouselBlock
  | StoreBannerBlock;

export interface PageDoc {
  _id: string;
  /**
   * `"page"` for tenants using the generic fallback document, or one of
   * the per-template names (e.g. `"spaPageTemplatePage"`,
   * `"planDetailsPage"`) when the tenant declared page-shells in
   * `aem-page-components.json`. The preview renders the same way
   * regardless — the discriminant matters for Studio structure, not for
   * frontend rendering.
   */
  _type: string;
  title?: string;
  slug?: { current: string };
  pageBuilder?: Array<PageBlock | UnknownBlock>;
  /**
   * Page-shell dialog values lifted from AEM `jcr:content` (e.g.
   * `pageTitle`, `navTitle`, `pwaOrientation`, `disableCache`). Present
   * only on per-template documents. Not rendered by the preview today,
   * but available for `<title>` / nav / metadata wiring as the demo grows.
   */
  pageProperties?: Record<string, unknown>;
  /** Lifted from AEM `jcr:content/cq:featuredimage`. Per-template docs only. */
  featuredImage?: SanityImageRef;
  /** Original AEM `cq:template` path; useful for debugging. */
  cqTemplate?: string;
}
