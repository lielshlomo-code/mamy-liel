export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  image?: string;
  featured?: boolean;
  dateAdded: string;
}

export interface ProductCategory {
  id: string;
  label: string;
}

export interface ProductsData {
  categories: ProductCategory[];
  products: Product[];
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: string;
  internal?: boolean;
}

export interface SiteConfig {
  siteName: string;
  fullName: string;
  tagline: string;
  description: string;
  siteUrl: string;
  social: {
    instagram: string;
    whatsapp: string;
  };
  contact: {
    email: string;
  };
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image?: string;
  tags?: string[];
  readingTime?: string;
  content?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: "ILS";
  image: string;
  status: "coming_soon" | "available" | "sold_out";
  purchaseUrl?: string;
}
