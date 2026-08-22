export interface SectionAccueilAdmin {
  id: string;
  cle: string;
  nom: string;
  ordre: number;
  visible: boolean;
}

export interface MediaAccueilAdmin {
  id: string;
  section: string;
  emplacement: string;
  url: string;
  alt: string;
  titre: string | null;
  texte: string | null;
  lien: string | null;
  ordre: number;
}
