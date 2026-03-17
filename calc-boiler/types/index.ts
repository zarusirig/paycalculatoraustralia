export interface NavItem {
  label: string;
  href: string;
}

export interface NavColumn {
  heading: string;
  items: NavItem[];
}

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface SeoMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}
