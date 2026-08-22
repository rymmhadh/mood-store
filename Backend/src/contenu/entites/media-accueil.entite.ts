import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Une photographie (ou une diapositive) d'une section de l'accueil.
 *
 * `emplacement` distingue les rôles à l'intérieur d'une même section — les
 * deux photos de l'atelier, le fond du bloc sur-mesure, une diapositive du
 * Hero. `titre`, `texte` et `lien` ne servent qu'au Hero, qui affiche un
 * texte par diapositive ; les autres sections les laissent vides.
 */
@Entity('medias_accueil')
export class MediaAccueil {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  section: string;

  @Column({ default: '' })
  emplacement: string;

  @Column()
  url: string;

  @Column({ default: '' })
  alt: string;

  @Column({ type: 'text', nullable: true })
  titre: string | null;

  @Column({ type: 'text', nullable: true })
  texte: string | null;

  @Column({ type: 'text', nullable: true })
  lien: string | null;

  @Column({ type: 'int', default: 0 })
  ordre: number;
}
