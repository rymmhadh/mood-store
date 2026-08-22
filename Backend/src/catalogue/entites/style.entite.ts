import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/** Style de la pièce — « Minimaliste », « Japandi »… Même logique que Matiere. */
@Entity('styles')
export class Style {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  nom: string;

  @Column({ type: 'int', default: 0 })
  ordre: number;
}
