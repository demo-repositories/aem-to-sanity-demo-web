import type {
  ColorCarouselBlock,
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
  UnknownBlock as UnknownBlockType,
  VariableColumnBlock,
} from "./types";
import { ColorCarousel } from "./ColorCarousel";
import { Expander } from "./Expander";
import { FaqHub } from "./FaqHub";
import { FeatureCard } from "./FeatureCard";
import { Gallery } from "./Gallery";
import { HeroVideoBanner } from "./HeroVideoBanner";
import { Hr } from "./Hr";
import { IconGrid } from "./IconGrid";
import { PhotoLayout } from "./PhotoLayout";
import { ProductCarousel } from "./ProductCarousel";
import { Promo } from "./Promo";
import { Quote } from "./Quote";
import { ResourcesColumnList } from "./ResourcesColumnList";
import { SectionHeadline } from "./SectionHeadline";
import { UnknownBlock } from "./UnknownBlock";
import { VariableColumn } from "./VariableColumn";

/**
 * Dispatcher — maps a pageBuilder block's `_type` to its renderer.
 * The input is a loose record (a Sanity pageBuilder item is genuinely
 * opaque at the type system level); each case casts to the known shape
 * so the dispatcher stays concise without dropping safety at the block
 * boundary.
 */
type AnyBlock = { _type: string; _key: string; [key: string]: unknown };

export function Block({ block }: { block: AnyBlock }) {
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
    default:
      return <UnknownBlock block={block as UnknownBlockType} />;
  }
}
