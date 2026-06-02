import type {
  ColorCarouselBlock,
  ContainerBlock,
  ExpanderBlock,
  FaqHubBlock,
  FeatureCardBlock,
  GalleryBlock,
  HeroVideoBannerBlock,
  HrBlock,
  IconGridBlock,
  PhotoLayoutBlock,
  ProductCarouselBlock,
  PromoBlock,
  QuoteBlock,
  ResourcesColumnListBlock,
  SectionHeadlineBlock,
  StoreBannerBlock,
  StoreDetailsBlock,
  StoreReviewsBlock,
  StoreStoreCarouselBlock,
  UnknownBlock as UnknownBlockType,
  VariableColumnBlock,
} from "../types.ts";
import { ColorCarousel } from "./ColorCarousel.tsx";
import { Container } from "./Container.tsx";
import { Expander } from "./Expander.tsx";
import { FaqHub } from "./FaqHub.tsx";
import { FeatureCard } from "./FeatureCard.tsx";
import { Gallery } from "./Gallery.tsx";
import { HeroVideoBanner } from "./HeroVideoBanner.tsx";
import { Hr } from "./Hr.tsx";
import { IconGrid } from "./IconGrid.tsx";
import { PhotoLayout } from "./PhotoLayout.tsx";
import { ProductCarousel } from "./ProductCarousel.tsx";
import { Promo } from "./Promo.tsx";
import { Quote } from "./Quote.tsx";
import { ResourcesColumnList } from "./ResourcesColumnList.tsx";
import { SectionHeadline } from "./SectionHeadline.tsx";
import { StoreBanner } from "./StoreBanner.tsx";
import { StoreDetails } from "./StoreDetails.tsx";
import { StoreReviews } from "./StoreReviews.tsx";
import { StoreStoreCarousel } from "./StoreStoreCarousel.tsx";
import { UnknownBlock } from "./UnknownBlock.tsx";
import { VariableColumn } from "./VariableColumn.tsx";

/**
 * Dispatcher — maps a pageBuilder block's `_type` to its renderer.
 * The input is a loose record (a Sanity pageBuilder item is genuinely
 * opaque at the type system level); each case casts to the known shape
 * so the dispatcher stays concise without dropping safety at the block
 * boundary.
 */
type AnyBlock = { _type: string; _key: string; [key: string]: unknown };

/**
 * Page context threaded to blocks that need document-level data the
 * block itself doesn't carry. `storeDetails` is the case today: the
 * migrated block holds only the CTA link, so the store name / locality
 * are derived from the page title + slug.
 */
export interface PageContext {
  title?: string;
  slug?: string;
}

export function Block({ block, page }: { block: AnyBlock; page?: PageContext }) {
  switch (block._type) {
    case "promo":
      return <Promo block={block as unknown as PromoBlock} />;
    case "hr":
      return <Hr block={block as unknown as HrBlock} />;
    case "colorCarousel":
      return <ColorCarousel block={block as unknown as ColorCarouselBlock} />;
    case "variableColumn":
      return <VariableColumn block={block as unknown as VariableColumnBlock} />;
    case "heroVideoBanner":
      return <HeroVideoBanner block={block as unknown as HeroVideoBannerBlock} />;
    case "gallery":
      return <Gallery block={block as unknown as GalleryBlock} />;
    case "productCarousel":
      return <ProductCarousel block={block as unknown as ProductCarouselBlock} />;
    case "iconGrid":
      return <IconGrid block={block as unknown as IconGridBlock} />;
    case "faqHub":
      return <FaqHub block={block as unknown as FaqHubBlock} />;
    case "expander":
      return <Expander block={block as unknown as ExpanderBlock} />;
    case "quote":
      return <Quote block={block as unknown as QuoteBlock} />;
    case "resourcesColumnList":
      return (
        <ResourcesColumnList block={block as unknown as ResourcesColumnListBlock} />
      );
    case "sectionHeadline":
      return <SectionHeadline block={block as unknown as SectionHeadlineBlock} />;
    case "featureCard":
      return <FeatureCard block={block as unknown as FeatureCardBlock} />;
    case "photoLayout":
      return <PhotoLayout block={block as unknown as PhotoLayoutBlock} />;
    case "storeDetails":
      return <StoreDetails block={block as unknown as StoreDetailsBlock} page={page} />;
    case "container":
      return <Container block={block as unknown as ContainerBlock} />;
    case "storeReviews":
      return <StoreReviews block={block as unknown as StoreReviewsBlock} />;
    case "storeStoreCarousel":
      return <StoreStoreCarousel block={block as unknown as StoreStoreCarouselBlock} />;
    case "storeBanner":
      return <StoreBanner block={block as unknown as StoreBannerBlock} />;
    default:
      return <UnknownBlock block={block as UnknownBlockType} />;
  }
}
