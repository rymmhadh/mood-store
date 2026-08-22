import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Produit } from './produit.entite';

/**
 * Catégorie du catalogue, en arbre (§21).
 *
 * Deux niveaux en pratique : les univers (« Salon », « Chambre »…) et les
 * typologies qui s'y rattachent (« Canapés », « Dressings »…). Le site public
 * n'affiche que les typologies — ce sont elles qui ont une page.
 */
@Entity('categories')
export class Categorie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Index({ unique: true })
  @Column()
  slug: string;

  /** Chapô de la page de catégorie. */
  @Column({ type: 'text', nullable: true })
  chapo: string | null;

  @Column({ type: 'text', nullable: true })
  imageHero: string | null;

  @Column({ type: 'int', default: 0 })
  ordre: number;

  @ManyToOne(() => Categorie, (c) => c.enfants, { nullable: true, onDelete: 'SET NULL' })
  parent: Categorie | null;

  @Column({ type: 'uuid', nullable: true })
  parentId: string | null;

  @OneToMany(() => Categorie, (c) => c.parent)
  enfants: Categorie[];

  @OneToMany(() => Produit, (p) => p.categorie)
  produits: Produit[];
}
