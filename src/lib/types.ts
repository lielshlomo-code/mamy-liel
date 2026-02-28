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
  mediaUrl?: string;
  tags?: string[];
  readingTime?: string;
  content?: string;
}

export interface ShortLink {
  id: string;
  code: string;
  targetUrl: string;
  title?: string;
  clicks: number;
  createdAt: string;
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

// Analytics types

export interface DailyCount {
  date: string;
  count: number;
}

export interface TopShortLink {
  code: string;
  title?: string;
  clicks: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  clickCount: number;
}

export interface ContactSummary {
  id: string;
  brandName: string;
  contactName: string;
  email: string;
  type: string;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: "short_link" | "product";
  targetId: string;
  createdAt: string;
}

export interface AnalyticsData {
  shortLinks: {
    daily: DailyCount[];
    top: TopShortLink[];
    total: number;
  };
  products: {
    daily: DailyCount[];
    top: TopProduct[];
    total: number;
  };
  contacts: {
    daily: DailyCount[];
    recent: ContactSummary[];
    total: number;
  };
  activity: ActivityItem[];
}
