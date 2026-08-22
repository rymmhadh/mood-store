import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Produit } from './produit.entite';

export type RoleMedia = 'principale' | 'situation' | 'macro' | 'detail' | 'schema';

/**
 * Photographie d'une pièce.
 *
 * `url` est le dérivé WebP servi au visiteur, `urlMaster` le fichier tel qu'il
 * a été téléversé — jamais servi, conservé pour pouvoir régénérer les dérivés
 * si les formats changent un jour.
 *
 * `lqip` est une miniature en base64 de quelques centaines d'octets, affichée
 * floue le temps que la vraie image arrive. C'est ce qui évite le cadre gris
 * au chargement, et donc le ressenti de lenteur.
 */
@Entity('medias')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  urlMaster: string;

  @Column({ type: 'int' })
  largeur: number;

  @Column({ type: 'int' })
  hauteur: number;

  /** Une image sans texte alternatif est invisible pour une part des visiteurs. */
  @Column({ default: '' })
  alt: string;

  @Column({ type: 'text', nullable: true })
  legende: string | null;

  @Column({ type: 'varchar', default: 'situation' })
  role: RoleMedia;

  @Column({ type: 'text', default: '' })
  lqip: string;

  @Column({ type: 'int', default: 0 })
  ordre: number;

  @ManyToOne(() => Produit, (p) => p.medias, { nullable: true, onDelete: 'CASCADE' })
  produit: Produit | null;

  @Column({ type: 'uuid', nullable: true })
  produitId: string | null;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  creeLe: Date;
}
