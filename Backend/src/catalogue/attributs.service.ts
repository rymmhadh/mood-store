import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { versSlug } from '../commun/slug';
import { Coloris } from './entites/coloris.entite';
import { Matiere } from './entites/matiere.entite';
import { Produit } from './entites/produit.entite';
import { Revetement } from './entites/revetement.entite';
import { Style } from './entites/style.entite';
import type {
  CreerColoris,
  CreerMatiere,
  CreerRevetement,
  CreerStyle,
  ModifierColoris,
  ModifierMatiere,
  ModifierRevetement,
  ModifierStyle,
} from './dto/attributs.schemas';

/**
 * Matières, styles, coloris et revêtements.
 *
 * Quatre nuanciers de la même forme : un nom, un ordre d'affichage, et pour
 * les deux derniers une couleur. Ils vivaient jusqu'ici en dur dans le front ;
 * ce service les rend gérables depuis le back-office sans toucher au code.
 *
 * Les pièces les référencent par une valeur libre dans un tableau
 * PostgreSQL (voir `Produit`) plutôt que par une clé étrangère : supprimer un
 * coloris est donc bloqué tant qu'une pièce le porte encore, faute de quoi la
 * fiche garderait une étiquette fantôme sans que rien ne le signale.
 */
@Injectable()
export class AttributsService {
  constructor(
    @InjectRepository(Matiere) private readonly matieres: Repository<Matiere>,
    @InjectRepository(Style) private readonly styles: Repository<Style>,
    @InjectRepository(Coloris) private readonly coloris: Repository<Coloris>,
    @InjectRepository(Revetement) private readonly revetements: Repository<Revetement>,
    @InjectRepository(Produit) private readonly produits: Repository<Produit>,
  ) {}

  /* ── Matières ────────────────────────────────────────────────────────── */

  listerMatieres() {
    return this.matieres.find({ order: { ordre: 'ASC', nom: 'ASC' } });
  }

  async creerMatiere(donnees: CreerMatiere) {
    return this.matieres.save(this.matieres.create(donnees));
  }

  async modifierMatiere(id: string, donnees: ModifierMatiere) {
    const trouvee = await this.matieres.findOneBy({ id });
    if (!trouvee) throw new NotFoundException('Cette matière n’existe plus.');
    const avant = trouvee.nom;
    Object.assign(trouvee, donnees);
    const enregistree = await this.matieres.save(trouvee);
    if (donnees.nom && donnees.nom !== avant) await this.renommerDansProduits('matieres', avant, donnees.nom);
    return enregistree;
  }

  async supprimerMatiere(id: string) {
    const trouvee = await this.matieres.findOneBy({ id });
    if (!trouvee) throw new NotFoundException('Cette matière n’existe plus.');
    await this.garantirInutilisee('matieres', trouvee.nom, 'Cette matière');
    await this.matieres.remove(trouvee);
  }

  /* ── Styles ──────────────────────────────────────────────────────────── */

  listerStyles() {
    return this.styles.find({ order: { ordre: 'ASC', nom: 'ASC' } });
  }

  async creerStyle(donnees: CreerStyle) {
    return this.styles.save(this.styles.create(donnees));
  }

  async modifierStyle(id: string, donnees: ModifierStyle) {
    const trouve = await this.styles.findOneBy({ id });
    if (!trouve) throw new NotFoundException('Ce style n’existe plus.');
    const avant = trouve.nom;
    Object.assign(trouve, donnees);
    const enregistre = await this.styles.save(trouve);
    if (donnees.nom && donnees.nom !== avant) await this.renommerDansProduits('styles', avant, donnees.nom);
    return enregistre;
  }

  async supprimerStyle(id: string) {
    const trouve = await this.styles.findOneBy({ id });
    if (!trouve) throw new NotFoundException('Ce style n’existe plus.');
    await this.garantirInutilisee('styles', trouve.nom, 'Ce style');
    await this.styles.remove(trouve);
  }

  /* ── Coloris ─────────────────────────────────────────────────────────── */

  listerColoris() {
    return this.coloris.find({ order: { ordre: 'ASC', nom: 'ASC' } });
  }

  async creerColoris(donnees: CreerColoris) {
    const slug = await this.slugUniqueParmi(this.coloris, donnees.slug || donnees.nom);
    return this.coloris.save(this.coloris.create({ ...donnees, slug }));
  }

  async modifierColoris(id: string, donnees: ModifierColoris) {
    const trouve = await this.coloris.findOneBy({ id });
    if (!trouve) throw new NotFoundException('Ce coloris n’existe plus.');
    Object.assign(trouve, donnees);
    return this.coloris.save(trouve);
  }

  async supprimerColoris(id: string) {
    const trouve = await this.coloris.findOneBy({ id });
    if (!trouve) throw new NotFoundException('Ce coloris n’existe plus.');
    await this.garantirInutilisee('colorisIds', trouve.slug, 'Ce coloris');
    await this.coloris.remove(trouve);
  }

  /* ── Revêtements ─────────────────────────────────────────────────────── */

  listerRevetements() {
    return this.revetements.find({ order: { ordre: 'ASC', nom: 'ASC' } });
  }

  async creerRevetement(donnees: CreerRevetement) {
    const slug = await this.slugUniqueParmi(this.revetements, donnees.slug || donnees.nom);
    return this.revetements.save(this.revetements.create({ ...donnees, slug }));
  }

  async modifierRevetement(id: string, donnees: ModifierRevetement) {
    const trouve = await this.revetements.findOneBy({ id });
    if (!trouve) throw new NotFoundException('Ce revêtement n’existe plus.');
    Object.assign(trouve, donnees);
    return this.revetements.save(trouve);
  }

  async supprimerRevetement(id: string) {
    const trouve = await this.revetements.findOneBy({ id });
    if (!trouve) throw new NotFoundException('Ce revêtement n’existe plus.');
    await this.garantirInutilisee('revetementIds', trouve.slug, 'Ce revêtement');
    await this.revetements.remove(trouve);
  }

  /* ── Utilitaires communs ─────────────────────────────────────────────── */

  private async slugUniqueParmi(
    depot: Repository<Coloris> | Repository<Revetement>,
    base: string,
  ): Promise<string> {
    const racine = versSlug(base) || 'nuance';
    let candidat = racine;
    let compteur = 2;
    while (await depot.findOneBy({ slug: candidat })) {
      candidat = `${racine}-${compteur}`;
      compteur += 1;
    }
    return candidat;
  }

  /** Bloque la suppression tant qu'au moins une pièce porte encore la valeur. */
  private async garantirInutilisee(colonne: string, valeur: string, sujet: string) {
    // `getRawOne` type ce retour comme possiblement `undefined` (une requête
    // sans résultat), même si `COUNT(*)` renvoie toujours exactement une
    // ligne en pratique — d'où le repli à 0, jamais réellement atteint.
    const { compte } = (await this.produits
      .createQueryBuilder('p')
      .select('COUNT(*)', 'compte')
      .where(`:valeur = ANY(p."${colonne}")`, { valeur })
      .andWhere('p."supprimeLe" IS NULL')
      .getRawOne<{ compte: string }>()) ?? { compte: '0' };

    if (Number(compte) > 0) {
      throw new ConflictException(
        `${sujet} est encore utilisé par ${compte} pièce${Number(compte) > 1 ? 's' : ''} du catalogue. Retirez-le de ces fiches avant de le supprimer.`,
      );
    }
  }

  /** Renommer une matière ou un style met à jour les fiches qui la portent, plutôt que de les laisser pointer vers un nom disparu. */
  private async renommerDansProduits(colonne: 'matieres' | 'styles', avant: string, apres: string) {
    await this.produits.query(
      `UPDATE produits SET "${colonne}" = array_replace("${colonne}", $1, $2) WHERE $1 = ANY("${colonne}")`,
      [avant, apres],
    );
  }
}
