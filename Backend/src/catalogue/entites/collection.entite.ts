import { Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Produit } from './produit.entite';

/**
 * Ligne de la maison — « Bouclé », « Courbe », « Onyx », « Signature ».
 *
 * Transversale aux catégories : une même collection réunit un canapé, une
 * table et un miroir. C'est le fil narratif du site (§7).
 */
@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Index({ unique: true })
  @Column()
  slug: string;

  @Column({ type: 'text', nullable: true })
  recit: string | null;

  @Column({ type: 'text', nullable: true })
  couverture: string | null;

  @ManyToMany(() => Produit, (p) => p.collections)
  produits: Produit[];
}
