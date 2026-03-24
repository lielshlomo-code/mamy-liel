export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  url: string;
  image?: string;
  featured?: boolean;
  published: boolean;
  dateAdded: string;
}

export interface Subcategory {
  id: string;
  label: string;
  categoryId: string;
}

export interface ProductCategory {
  id: string;
  label: string;
  subcategories?: Subcategory[];
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
  published: boolean;
  showInPopup: boolean;
  paintCookies: boolean;
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
  affiliateCookieUrl?: string;
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
  published: boolean;
}

export interface ShortLink {
  id: string;
  code: string;
  targetUrl: string;
  paintCookies: boolean;
  title?: string;
  clicks: number;
  createdAt: string;
  published: boolean;
  showInPopup: boolean;
  showOnHomepage: boolean;
  couponCode?: string;
  couponNote?: string;
  color?: string;
}

export interface CourseCategory {
  id: string;
  label: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  image?: string;
  isFree: boolean;
  price?: string;
  paymentUrl?: string;
  featured?: boolean;
  published: boolean;
  dateAdded: string;
  orderIndex: number;
  lessonCount?: number;
}

export interface CourseLesson {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration?: string;
  isPreview: boolean;
  orderIndex: number;
  published: boolean;
}

export interface AcademyData {
  categories: CourseCategory[];
  courses: Course[];
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
