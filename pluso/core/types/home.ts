export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface HomePageData {
  features: Feature[];
}

export interface HomePageProps {
  data: HomePageData;
}
