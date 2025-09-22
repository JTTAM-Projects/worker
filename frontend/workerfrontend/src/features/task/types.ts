export type Kategoria = "cleaning" | "garden" | "tech" | "pets" | "vehicles" | "all";

export interface Task {
  id: string;
  otsikko: string;
  kategoria: Kategoria;
  hinta: string;
  sijainti: string;
  pvm: string;
}
