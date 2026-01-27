export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: string;
  image?: string;
}

export interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  content: string;
  image: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  badge?: string;
  description: string;
  story: string;
  material: string;
  fitGuide: string;
}