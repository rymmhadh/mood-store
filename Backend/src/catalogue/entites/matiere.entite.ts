import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Matière du nuancier — « Bouclé », « Velours »…
 *
 * Simple liste nommée : elle ne porte aucun autre attribut et n'est jamais
 * interrogée seule. Les pièces la référencent par son nom, dans le tableau
 * `produits.matieres` (voir la note sur `Produit`).
 */
@Entity('matieres')
export class Matiere {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  nom: string;

  @Column({ type: 'int', default: 0 })
  ordre: number;
}
