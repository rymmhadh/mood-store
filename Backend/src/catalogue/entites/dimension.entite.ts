import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Produit } from './produit.entite';

/** Une taille proposée pour une pièce. Mesures en centimètres. */
@Entity('dimensions')
export class Dimension {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column({ type: 'int' })
  largeur: number;

  @Column({ type: 'int' })
  profondeur: number;

  @Column({ type: 'int' })
  hauteur: number;

  @Column({ type: 'int', nullable: true })
  hauteurAssise: number | null;

  /** Surcoût en dinars par rapport à la taille de référence. */
  @Column({ type: 'int', default: 0 })
  surcout: number;

  @Column({ type: 'int', default: 0 })
  ordre: number;

  @ManyToOne(() => Produit, (p) => p.dimensions, { onDelete: 'CASCADE' })
  produit: Produit;

  @Column({ type: 'uuid' })
  produitId: string;
}
