export type Category =
  | "Сантехника"
  | "Отделка"
  | "Краски"
  | "Линолиум"
  | "Паркет"
  | "Керамогранит"
  | "Ламинат"
  | "Плитка"
  | "Обои"
  | "Потолки"
  | "Двери"
  | "Окна";

export interface Product {
  id: string;
  title: string;
  price: number;
  brand: string;
  available: boolean;
  category: Category;
  images: string[];
  shortDescription: string;
  description: string;
  specs: Record<string, string | number>;
}
