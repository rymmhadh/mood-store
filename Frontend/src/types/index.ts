/** Types partagés du front. Miroir allégé des entités TypeORM du back. */

export interface LienNav {
  libelle: string;
  href: string;
}

export interface GroupeNav {
  titre: string;
  liens: LienNav[];
}

export interface VignetteMenu {
  titre: string;
  sousTitre?: string;
  image: string;
  href: string;
}

export interface Realisation {
  slug: string;
  titre: string;
  typologie: string;
  ville: string;
  surface?: number;
  annee: number;
  image: string;
}

export interface Showroom {
  slug: string;
  nom: string;
  ville: string;
  adresse: string;
  telephone: string;
  horaires: string;
  image: string;
  maps: string;
}

export interface Temoignage {
  citation: string;
  auteur: string;
  ville: string;
  projet: string;
  image: string;
}

export interface Article {
  slug: string;
  titre: string;
  categorie: string;
  date: string;
  lecture: number;
  image: string;
}
