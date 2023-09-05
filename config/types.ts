export interface RenderedText {
  rendered: string;
}

export interface ImageSizes {
  thumbnail: string;
  "thumbnail-width": number;
  "thumbnail-height": number;
  medium: string;
  "medium-width": number;
  "medium-height": number;
  large: string;
  "large-width": number;
  "large-height": number;
  us_480_855_crop: string;
  "us_480_855_crop-width": number;
  "us_480_855_crop-height": number;
}

export interface Image {
  ID: number;
  id: number;
  title: string;
  filename: string;
  filesize: number;
  url: string;
  link: string;
  alt: string;
  author: string;
  description: string;
  caption: string;
  name: string;
  status: string;
  uploaded_to: number;
  date: string;
  modified: string;
  menu_order: number;
  mime_type: string;
  type: string;
  subtype: string;
  icon: string;
  width: number;
  height: number;
  sizes: ImageSizes;
}

export interface Metadata {
  _gallery: string;
  gallery: string[];
  location: {
    lat: string;
    lng: string;
    zoom: string;
    address: string;
  };
  _thumbnail_id: string;
}

export interface LinkItem {
  href: string;
  embeddable?: boolean;
  taxonomy?: string;
  templated?: boolean;
}

export interface Links {
  self: LinkItem[];
  collection: LinkItem[];
  about: LinkItem[];
  "wp:featuredmedia": LinkItem[];
  "wp:attachment": LinkItem[];
  "wp:term": LinkItem[];
  curies: LinkItem[];
}

export interface IPlace {
  id: number;
  date: string;
  date_gmt: string;
  guid: RenderedText;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: RenderedText;
  content: {
    rendered: string;
    protected: boolean;
  };
  featured_media: number;
  template: string;
  region: number[];
  type_places: number[];
  acf: {
    gallery: Image[];
  };
  x_featured_media: string;
  x_featured_media_medium: string;
  x_featured_media_large: string;
  x_featured_media_original: string;
  x_date: string;
  x_metadata: Metadata;
  _links: Links;
}
