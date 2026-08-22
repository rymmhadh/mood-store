import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Categorie } from './categorie.entite';
import { Collection } from './collection.entite';
import { Dimension } from './dimension.entite';
import { Media } from './media.entite';

export const STATUTS = ['brouillon', 'publie', 'archive'] as const;
export type StatutProduit = (typeof STATUTS)[number];

/**
 * Une pièce du catalogue.
 *
 * Les listes courtes et sans vie propre — matières, styles, identifiants de
 * coloris — sont stockées en tableaux PostgreSQL plutôt qu'en tables de
 * liaison. Elles ne portent aucun attribut, ne sont jamais interrogées seules,
 * et trois jointures de plus par fiche produit se paient à chaque affichage.
 */
@Entity('produits')
@Index(['categorieId', 'statut'])
export class Produit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Index({ unique: true })
  @Column()
  slug: string;

  @Index({ unique: true })
  @Column()
  reference: string;

  /** Typologie affichée au-dessus du nom : « Canapé d'angle », « Table de repas ronde ». */
  @Column({ default: '' })
  type: string;

  @Column({ default: 'Atelier Mood Store' })
  designer: string;

  /** Accroche courte, reprise en méta-description. */
  @Column({ type: 'text', default: '' })
  chapo: string;

  /** Description éditoriale, un élément par paragraphe. */
  @Column({ type: 'text', array: true, default: () => "'{}'" })
  description: string[];

  @Column({ type: 'text', nullable: true })
  motAtelier: string | null;

  /**
   * `numeric` et non `float` : un prix ne se stocke jamais en virgule
   * flottante. TypeORM le rend en chaîne, la conversion est faite au moment
   * de composer la réponse.
   */
  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  prix: string | null;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  prixPro: string | null;

  /** §1.2, principe 5 : sur le sur-mesure, le prix se demande. */
  @Column({ default: false })
  prixSurDemande: boolean;

  @Column({ type: 'varchar', default: 'brouillon' })
  statut: StatutProduit;

  @Column({ default: false })
  miseEnAvant: boolean;

  @Column({ default: false })
  nouveaute: boolean;

  @Column({ type: 'int', default: 0 })
  vues: number;

  @Column({ type: 'int', default: 21 })
  delaiJours: number;

  @Column({ default: false })
  demontable: boolean;

  @Column({ default: '' })
  structure: string;

  @Column({ type: 'text', nullable: true })
  garnissage: string | null;

  @Column({ default: '' })
  pietement: string;

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  matieres: string[];

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  styles: string[];

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  colorisIds: string[];

  @Column({ type: 'text', array: true, default: () => "'{}'" })
  revetementIds: string[];

  /** Catégorie principale : celle du fil d'Ariane, de la référence et du SEO. */
  @ManyToOne(() => Categorie, (c) => c.produits, { nullable: true, onDelete: 'SET NULL' })
  categorie: Categorie | null;

  @Column({ type: 'uuid', nullable: true })
  categorieId: string | null;

  /**
   * Catégories secondaires.
   *
   * Une pièce apparaît souvent à deux endroits du catalogue sans ambiguïté :
   * le Mouton est un objet de décoration *et* un pouf, un miroir rétroéclairé
   * est un miroir *et* un luminaire. Forcer un choix unique obligerait à
   * dupliquer la fiche — deux URL, deux compteurs de vues, deux fois le
   * travail à chaque correction.
   */
  @ManyToMany(() => Categorie)
  @JoinTable({
    name: 'produits_categories_secondaires',
    joinColumn: { name: 'produitId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categorieId', referencedColumnName: 'id' },
  })
  categoriesSecondaires: Categorie[];

  @ManyToMany(() => Collection, (c) => c.produits)
  @JoinTable({
    // Noms de colonnes explicites : ils sont écrits en dur dans les
    // sous-requêtes de filtrage du service, et la convention de TypeORM
    // (`produitsId`, `collectionsId`) n'est pas un contrat stable.
    name: 'produits_collections',
    joinColumn: { name: 'produitId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'collectionId', referencedColumnName: 'id' },
  })
  collections: Collection[];

  @OneToMany(() => Media, (m) => m.produit)
  medias: Media[];

  @OneToMany(() => Dimension, (d) => d.produit, { cascade: true })
  dimensions: Dimension[];

  /** Vides = déduits du nom et du chapô. */
  @Column({ type: 'text', nullable: true })
  seoTitre: string | null;

  @Column({ type: 'text', nullable: true })
  seoDescription: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  creeLe: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  modifieLe: Date;

  /** Corbeille du §19.1 : trente jours avant effacement réel. */
  @Column({ type: 'timestamptz', nullable: true })
  supprimeLe: Date | null;
}
