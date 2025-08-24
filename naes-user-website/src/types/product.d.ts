export interface BenefitItem {
  title: string;
  description: string;
}

export interface Specification {
  percentage: string;
  state: string;
  packaging: string;
  source?: string;
}

export interface Product {
  id: string;
  // name: string;
  image: string;
  // description?: string;
  // highlights?: string[];
  // benefits: BenefitItem[];
  specifications: Specification[];
}

