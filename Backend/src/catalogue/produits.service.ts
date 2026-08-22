import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Not, Repository } from 'typeorm';
import { referenceProduit, slugUnique } from '../commun/slug';
import { Categorie } from './entites/categorie.entite';
import { Collection } from './entites/collection.entite';
import { Dimension } from './entites/dimension.entite';
import { Media } from './entites/media.entite';
import { Produit } from './entites/produit.entite';
import {
  versProduitAdmin,
  versProduitPublic,
  type ProduitAdminDto,
  type ProduitPublicDto,
} from './dto/produit.dto';
import type { CreerProduit, FiltrerProduits, ModifierProduit } from './dto/schemas';

/**
 * Filtres par catégorie et par collection, écrits en sous-requête.
 *
 * La tentation serait de filtrer directement sur la jointure — `WHERE
 * collections.slug = 'boucle'`. Ce serait un piège : la même jointure sert
 * aussi à *charger* les collections de la pièce, et le filtre les amputerait.
 * Une pièce appartenant à deux collections n'en montrerait plus qu'une.
 * `EXISTS` sépare proprement les deux rôles.
 */
const CONDITION_FAMILLE = `(
  categorie.slug = :famille
  OR EXISTS (
    SELECT 1 FROM produits_categories_secondaires pcs
    JOIN categories c2 ON c2.id = pcs."categorieId"
    WHERE pcs."produitId" = p.id AND c2.slug = :famille
  )
)`;

const CONDITION_COLLECTION = `EXISTS (
  SELECT 1 FROM produits_collections pc
  JOIN collections c3 ON c3.id = pc."collectionId"
  WHERE pc."produitId" = p.id AND c3.slug = :col
)`;

/** Relations à charger pour composer une fiche complète. */
const RELATIONS = [
  'categorie',
  'categoriesSecondaires',
  'collections',
  'medias',
  'dimensions',
] as const;

@Injectable()
export class ProduitsService {
  constructor(
    @InjectRepository(Produit) private readonly produits: Repository<Produit>,
    @InjectRepository(Categorie) private readonly categories: Repository<Categorie>,
    @InjectRepository(Collection) private readonly collections: Repository<Collection>,
    @InjectRepository(Media) private readonly medias: Repository<Media>,
    @InjectRepository(Dimension) private readonly dimensions: Repository<Dimension>,
    private readonly config: ConfigService,
  ) {}

  private get urlPublique(): string {
    return this.config.get<string>('URL_PUBLIQUE') ?? 'http://localhost:4000';
  }

  /* ── Lecture publique ───────────────────────────────────────────────── */

  /**
   * Pièces publiées, éventuellement filtrées sur une catégorie.
   *
   * Le site public ne voit jamais un brouillon ni une pièce en corbeille :
   * c'est le seul endroit où cette règle est écrite, et elle n'est pas
   * paramétrable depuis l'extérieur.
   */
  async listerPubliques(familleSlug?: string): Promise<ProduitPublicDto[]> {
    const requete = this.produits
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.categorie', 'categorie')
      .leftJoinAndSelect('p.categoriesSecondaires', 'secondaires')
      .leftJoinAndSelect('p.collections', 'collections')
      .leftJoinAndSelect('p.medias', 'medias')
      .leftJoinAndSelect('p.dimensions', 'dimensions')
      .where('p.statut = :statut', { statut: 'publie' })
      .andWhere('p.supprimeLe IS NULL')
      .orderBy('p.miseEnAvant', 'DESC')
      .addOrderBy('p.creeLe', 'DESC');

    if (familleSlug) requete.andWhere(CONDITION_FAMILLE, { famille: familleSlug });

    const trouves = await requete.getMany();
    return trouves.map((p) => versProduitPublic(p, this.urlPublique));
  }

  async trouverPublic(slug: string): Promise<ProduitPublicDto | null> {
    const produit = await this.produits.findOne({
      where: { slug, statut: 'publie', supprimeLe: IsNull() },
      relations: [...RELATIONS],
    });
    return produit ? versProduitPublic(produit, this.urlPublique) : null;
  }

  /** Compteur de vues — alimente le graphique « pièces les plus vues » (§19.3). */
  async incrementerVues(slug: string): Promise<void> {
    await this.produits.increment({ slug }, 'vues', 1);
  }

  /* ── Lecture administrateur ─────────────────────────────────────────── */

  async lister(filtres: FiltrerProduits): Promise<{ produits: ProduitAdminDto[]; total: number }> {
    const requete = this.produits
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.categorie', 'categorie')
      .leftJoinAndSelect('p.categoriesSecondaires', 'secondaires')
      .leftJoinAndSelect('p.collections', 'collections')
      .leftJoinAndSelect('p.medias', 'medias')
      .leftJoinAndSelect('p.dimensions', 'dimensions')
      .where('p.supprimeLe IS NULL');

    if (filtres.recherche) {
      // `unaccent` n'est pas garanti présent : on se contente d'insensible à
      // la casse, ce qui couvre l'usage réel (on cherche « rivage », pas « RIVAGÉ »).
      requete.andWhere(
        '(p.nom ILIKE :q OR p.reference ILIKE :q OR p.type ILIKE :q OR p.chapo ILIKE :q)',
        { q: `%${filtres.recherche}%` },
      );
    }
    if (filtres.categorie) requete.andWhere(CONDITION_FAMILLE, { famille: filtres.categorie });
    if (filtres.collection) requete.andWhere(CONDITION_COLLECTION, { col: filtres.collection });
    if (filtres.statut) requete.andWhere('p.statut = :statut', { statut: filtres.statut });
    if (filtres.sansPhoto) requete.andWhere('medias.id IS NULL');

    switch (filtres.tri) {
      case 'nom':
        requete.orderBy('p.nom', 'ASC');
        break;
      case 'prix-croissant':
        requete.orderBy('p.prix', 'ASC', 'NULLS LAST');
        break;
      case 'prix-decroissant':
        requete.orderBy('p.prix', 'DESC', 'NULLS LAST');
        break;
      case 'vues':
        requete.orderBy('p.vues', 'DESC');
        break;
      default:
        requete.orderBy('p.modifieLe', 'DESC');
    }

    // `getManyAndCount` compte mal dès qu'il y a une jointure « un vers
    // plusieurs » : trois photos donneraient trois lignes pour une pièce.
    // On compte donc séparément, sur les identifiants distincts — et sans
    // le tri, qu'un COUNT sans GROUP BY refuse.
    const total = await requete
      .clone()
      .orderBy()
      .select('COUNT(DISTINCT p.id)', 'n')
      .getRawOne<{ n: string }>();

    const trouves = await requete
      .skip((filtres.page - 1) * filtres.parPage)
      .take(filtres.parPage)
      .getMany();

    return {
      produits: trouves.map((p) => versProduitAdmin(p, this.urlPublique)),
      total: Number(total?.n ?? 0),
    };
  }

  async trouver(id: string): Promise<ProduitAdminDto> {
    const produit = await this.produits.findOne({ where: { id }, relations: [...RELATIONS] });
    if (!produit) throw new NotFoundException('Cette pièce n’existe pas ou a été supprimée.');
    return versProduitAdmin(produit, this.urlPublique);
  }

  /* ── Écriture ───────────────────────────────────────────────────────── */

  async creer(donnees: CreerProduit): Promise<ProduitAdminDto> {
    const categorie = await this.categorieOuErreur(donnees.categorieId);

    const produit = this.produits.create();
    await this.appliquer(produit, donnees, categorie);

    produit.slug = await slugUnique(donnees.slug || donnees.nom, async (candidat) => {
      return (await this.produits.countBy({ slug: candidat })) > 0;
    });
    produit.reference = donnees.reference || (await this.referenceLibre(categorie.nom));

    const enregistre = await this.produits.save(produit);
    await this.rattacherMedias(enregistre.id, donnees.mediaIds ?? []);

    return this.trouver(enregistre.id);
  }

  async modifier(id: string, donnees: ModifierProduit): Promise<ProduitAdminDto> {
    const produit = await this.produits.findOne({ where: { id }, relations: [...RELATIONS] });
    if (!produit) throw new NotFoundException('Cette pièce n’existe pas ou a été supprimée.');

    const categorie = donnees.categorieId
      ? await this.categorieOuErreur(donnees.categorieId)
      : produit.categorie;

    await this.appliquer(produit, donnees, categorie);

    if (donnees.slug && donnees.slug !== produit.slug) {
      produit.slug = await slugUnique(donnees.slug, async (candidat) => {
        return (await this.produits.count({ where: { slug: candidat, id: Not(id) } })) > 0;
      });
    }

    // Les règles croisées du schéma ne peuvent pas s'appliquer à une
    // modification partielle : on les rejoue ici, sur l'objet fusionné.
    const nombreMedias =
      donnees.mediaIds !== undefined ? donnees.mediaIds.length : (produit.medias?.length ?? 0);
    this.verifierCoherence(produit, nombreMedias);

    await this.produits.save(produit);
    if (donnees.mediaIds !== undefined) await this.rattacherMedias(id, donnees.mediaIds);

    return this.trouver(id);
  }

  /** Corbeille : réversible trente jours (§19.1). */
  async mettreALaCorbeille(id: string): Promise<void> {
    const resultat = await this.produits.update(
      { id, supprimeLe: IsNull() },
      { supprimeLe: new Date(), statut: 'archive' },
    );
    if (!resultat.affected) throw new NotFoundException('Cette pièce n’existe pas.');
  }

  async restaurer(id: string): Promise<ProduitAdminDto> {
    await this.produits.update({ id }, { supprimeLe: null, statut: 'brouillon' });
    return this.trouver(id);
  }

  /* ── Statistiques pour le tableau de bord ───────────────────────────── */

  async statistiques() {
    const [total, publies, brouillons, corbeille] = await Promise.all([
      this.produits.count({ where: { supprimeLe: IsNull() } }),
      this.produits.count({ where: { statut: 'publie', supprimeLe: IsNull() } }),
      this.produits.count({ where: { statut: 'brouillon', supprimeLe: IsNull() } }),
      this.produits.count({ where: { supprimeLe: Not(IsNull()) } }),
    ]);

    const sansPhoto = await this.produits
      .createQueryBuilder('p')
      .leftJoin('p.medias', 'm')
      .where('p.supprimeLe IS NULL')
      .andWhere('m.id IS NULL')
      .getCount();

    const sansAlt = await this.medias.count({ where: { alt: '' } });

    return { total, publies, brouillons, archives: corbeille, sansPhoto, sansTexteAlternatif: sansAlt };
  }

  /* ── Rouages internes ───────────────────────────────────────────────── */

  private async categorieOuErreur(id: string | null | undefined): Promise<Categorie> {
    const categorie = id ? await this.categories.findOneBy({ id }) : null;
    if (!categorie) {
      throw new BadRequestException({
        message: 'Cette catégorie n’existe pas.',
        champs: { categorieId: 'Choisissez une catégorie dans la liste.' },
      });
    }
    return categorie;
  }

  private async referenceLibre(nomCategorie: string): Promise<string> {
    const compte = await this.produits.count();
    for (let i = compte + 1; i < compte + 500; i++) {
      const candidat = referenceProduit(nomCategorie, i);
      if ((await this.produits.countBy({ reference: candidat })) === 0) return candidat;
    }
    return `MS-${Date.now()}`;
  }

  /** Recopie les champs fournis. Les champs absents ne sont jamais écrasés. */
  private async appliquer(
    produit: Produit,
    donnees: CreerProduit | ModifierProduit,
    categorie: Categorie | null,
  ): Promise<void> {
    const poser = <C extends keyof Produit>(champ: C, valeur: Produit[C] | undefined) => {
      if (valeur !== undefined) produit[champ] = valeur;
    };

    poser('nom', donnees.nom);
    poser('type', donnees.type);
    poser('designer', donnees.designer);
    poser('chapo', donnees.chapo);
    poser('description', donnees.description?.filter((p) => p.length > 0));
    poser('motAtelier', donnees.motAtelier ?? undefined);
    poser('prixSurDemande', donnees.prixSurDemande);
    poser('statut', donnees.statut);
    poser('miseEnAvant', donnees.miseEnAvant);
    poser('nouveaute', donnees.nouveaute);
    poser('delaiJours', donnees.delaiJours);
    poser('demontable', donnees.demontable);
    poser('structure', donnees.structure);
    poser('garnissage', donnees.garnissage ?? undefined);
    poser('pietement', donnees.pietement);
    poser('matieres', donnees.matieres);
    poser('styles', donnees.styles);
    poser('colorisIds', donnees.colorisIds);
    poser('revetementIds', donnees.revetementIds);
    poser('seoTitre', donnees.seoTitre ?? undefined);
    poser('seoDescription', donnees.seoDescription ?? undefined);

    if (donnees.prix !== undefined) {
      produit.prix = donnees.prix === null ? null : donnees.prix.toFixed(2);
    }
    if (donnees.prixPro !== undefined) {
      produit.prixPro = donnees.prixPro === null ? null : donnees.prixPro.toFixed(2);
    }

    // Cocher « prix sur demande » efface le prix : laisser les deux en base,
    // c'est se garantir qu'un jour l'un des deux ressortira au mauvais endroit.
    if (produit.prixSurDemande) produit.prix = null;

    if (categorie) {
      produit.categorie = categorie;
      produit.categorieId = categorie.id;
    }

    if (donnees.categorieIdsSecondaires !== undefined) {
      const secondaires = donnees.categorieIdsSecondaires.filter((id) => id !== categorie?.id);
      produit.categoriesSecondaires = secondaires.length
        ? await this.categories.findBy({ id: In(secondaires) })
        : [];
    }

    if (donnees.collectionIds !== undefined) {
      produit.collections = donnees.collectionIds.length
        ? await this.collections.findBy({ id: In(donnees.collectionIds) })
        : [];
    }

    if (donnees.dimensions !== undefined) {
      if (produit.id) await this.dimensions.delete({ produitId: produit.id });
      produit.dimensions = donnees.dimensions.map((d, i) =>
        this.dimensions.create({
          nom: d.nom,
          largeur: d.largeur,
          profondeur: d.profondeur,
          hauteur: d.hauteur,
          hauteurAssise: d.hauteurAssise ?? null,
          surcout: d.surcout ?? 0,
          ordre: i,
        }),
      );
    }
  }

  /**
   * Rattache les médias à la pièce **dans l'ordre reçu**.
   *
   * L'ordre du tableau fait foi : c'est ce que l'utilisateur a composé en
   * faisant glisser les vignettes. Les médias retirés du tableau sont
   * détachés, pas effacés — ils restent disponibles dans la bibliothèque.
   */
  private async rattacherMedias(produitId: string, mediaIds: string[]): Promise<void> {
    await this.medias.update({ produitId }, { produitId: null });
    if (mediaIds.length === 0) return;

    await Promise.all(
      mediaIds.map((id, ordre) =>
        this.medias.update({ id }, { produitId, ordre, role: ordre === 0 ? 'principale' : 'situation' }),
      ),
    );
  }

  private verifierCoherence(produit: Produit, nombreMedias: number): void {
    const champs: Record<string, string> = {};

    if (produit.statut === 'publie' && nombreMedias === 0) {
      champs.mediaIds = 'Ajoutez au moins une photographie avant de publier cette pièce.';
    }
    if (produit.statut === 'publie' && !produit.chapo?.trim()) {
      champs.chapo = 'L’accroche est nécessaire pour publier : elle sert aussi à Google.';
    }
    if (!produit.prixSurDemande && produit.prix === null) {
      champs.prix = 'Indiquez un prix, ou cochez « prix sur demande ».';
    }

    if (Object.keys(champs).length > 0) {
      throw new BadRequestException({
        message: 'Certains champs sont incomplets ou invalides.',
        champs,
      });
    }
  }
}
