export type Category = "cleaning" | "garden" | "tech" | "pets" | "vehicles" | "all";

export interface Task {
  id: string;
  title: string;
  category: Category;
  price: string;
  location: string;
  date: string;
}
