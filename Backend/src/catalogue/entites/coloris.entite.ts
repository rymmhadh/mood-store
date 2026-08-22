import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Couleur du nuancier.
 *
 * Référencée par son `slug` dans `produits.colorisIds` — jamais par son
 * `id` technique, pour que les identifiants restent stables et lisibles
 * (« ecru », « terracotta »…) comme dans le catalogue d'origine.
 */
@Entity('coloris')
export class Coloris {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  slug: string;

  @Column()
  nom: string;

  /** Couleur hexadécimale, affichée en pastille dans le back-office et sur la fiche. */
  @Column()
  hex: string;

  @Column({ type: 'int', default: 0 })
  ordre: number;
}
