import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/** Revêtement proposé — un tissu ou un cuir, avec sa famille et son entretien. */
@Entity('revetements')
export class Revetement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  slug: string;

  @Column()
  nom: string;

  /** Libre plutôt qu'énuméré : une nouvelle famille de matière ne doit pas exiger de migration. */
  @Column()
  famille: string;

  @Column()
  hex: string;

  @Column({ type: 'text', default: '' })
  entretien: string;

  @Column({ type: 'int', default: 0 })
  ordre: number;
}
