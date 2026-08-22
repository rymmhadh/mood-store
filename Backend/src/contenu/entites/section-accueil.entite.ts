import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Une section de la page d'accueil — « Hero », « Sur-mesure », « Instagram »…
 *
 * La page ne les code plus en dur dans un ordre fixe : chacune peut être
 * masquée ou déplacée depuis le back-office (§19.5.1). `cle` est l'identifiant
 * stable que le composant React connaît ; `nom` est ce qu'affiche l'écran de
 * gestion.
 */
@Entity('sections_accueil')
export class SectionAccueil {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  cle: string;

  @Column()
  nom: string;

  @Column({ type: 'int', default: 0 })
  ordre: number;

  @Column({ default: true })
  visible: boolean;
}
