import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { versSlug } from '../commun/slug';
import { Categorie } from './entites/categorie.entite';
import { Collection } from './entites/collection.entite';
import { Produit } from './entites/produit.entite';
import type {
  CreerCategorie,
  CreerCollection,
  ModifierCategorie,
  ModifierCollection,
} from './dto/attributs.schemas';

/** Une typologie, telle que le front la consomme (`Famille`). */
export interface FamilleDto {
  slug: string;
  nom: string;
  /** Nom de l'univers parent : « Salon », « Chambre »… */
  parent: string;
  chapo: string;
  /** Utile au back-office, ignoré par le site. */
  id?: string;
  nombreProduits?: number;
}

export interface UniversDto {
  id: string;
  nom: string;
  slug: string;
  familles: FamilleDto[];
}

export interface CollectionDto {
  id: string;
  nom: string;
  slug: string;
  recit: string | null;
}

@Injectable()
export class TaxonomieService {
  constructor(
    @InjectRepository(Categorie) private readonly categories: Repository<Categorie>,
    @InjectRepository(Collection) private readonly collections: Repository<Collection>,
    @InjectRepository(Produit) private readonly produits: Repository<Produit>,
  ) {}

  /**
   * Typologies à plat, dans l'ordre d'affichage.
   *
   * C'est la forme dont le site a besoin : une liste de pages de catégorie,
   * chacune sachant à quel univers elle appartient. L'arbre complet est
   * disponible séparément pour le back-office.
   */
  async familles(): Promise<FamilleDto[]> {
    const feuilles = await this.categories.find({
      where: { parentId: Not(IsNull()) },
      relations: ['parent'],
      order: { ordre: 'ASC', nom: 'ASC' },
    });

    return feuilles.map((c) => ({
      id: c.id,
      slug: c.slug,
      nom: c.nom,
      parent: c.parent?.nom ?? '',
      chapo: c.chapo ?? '',
    }));
  }

  async arbre(): Promise<UniversDto[]> {
    const univers = await this.categories.find({
      where: { parentId: IsNull() },
      relations: ['enfants'],
      order: { ordre: 'ASC' },
    });

    return univers.map((u) => ({
      id: u.id,
      nom: u.nom,
      slug: u.slug,
      familles: [...(u.enfants ?? [])]
        .sort((a, b) => a.ordre - b.ordre)
        .map((c) => ({
          id: c.id,
          slug: c.slug,
          nom: c.nom,
          parent: u.nom,
          chapo: c.chapo ?? '',
        })),
    }));
  }

  async listerCollections(): Promise<CollectionDto[]> {
    const trouvees = await this.collections.find({ order: { nom: 'ASC' } });
    return trouvees.map((c) => ({ id: c.id, nom: c.nom, slug: c.slug, recit: c.recit }));
  }

  /* ── Écriture : catégories ───────────────────────────────────────────── */

  async creerCategorie(donnees: CreerCategorie): Promise<Categorie> {
    const slug = await this.slugUniqueCategorie(donnees.slug || donnees.nom);
    return this.categories.save(
      this.categories.create({
        nom: donnees.nom,
        slug,
        chapo: donnees.chapo || null,
        ordre: donnees.ordre ?? 0,
        parentId: donnees.parentId ?? null,
      }),
    );
  }

  async modifierCategorie(id: string, donnees: ModifierCategorie): Promise<Categorie> {
    const trouvee = await this.categories.findOneBy({ id });
    if (!trouvee) throw new NotFoundException('Cette catégorie n’existe plus.');

    if (donnees.parentId === id) {
      throw new ConflictException('Une catégorie ne peut pas être son propre univers parent.');
    }

    if (donnees.nom !== undefined) trouvee.nom = donnees.nom;
    if (donnees.chapo !== undefined) trouvee.chapo = donnees.chapo || null;
    if (donnees.ordre !== undefined) trouvee.ordre = donnees.ordre;
    if (donnees.parentId !== undefined) trouvee.parentId = donnees.parentId;
    if (donnees.slug) trouvee.slug = await this.slugUniqueCategorie(donnees.slug, id);

    return this.categories.save(trouvee);
  }

  async supprimerCategorie(id: string): Promise<void> {
    const trouvee = await this.categories.findOneBy({ id });
    if (!trouvee) throw new NotFoundException('Cette catégorie n’existe plus.');

    const enfants = await this.categories.count({ where: { parentId: id } });
    if (enfants > 0) {
      throw new ConflictException(
        `Cette catégorie contient encore ${enfants} sous-catégorie${enfants > 1 ? 's' : ''}. Déplacez-les ou supprimez-les d’abord.`,
      );
    }

    const enPrincipale = await this.produits.count({ where: { categorieId: id } });
    // Repli à 0 : `getRawOne` type ce retour comme possiblement `undefined`,
    // bien qu'un COUNT(...) renvoie toujours une ligne en pratique.
    const { compte: enSecondaire } = (await this.produits
      .createQueryBuilder('p')
      .innerJoin('p.categoriesSecondaires', 'cs', 'cs.id = :id', { id })
      .select('COUNT(DISTINCT p.id)', 'compte')
      .getRawOne<{ compte: string }>()) ?? { compte: '0' };

    const total = enPrincipale + Number(enSecondaire);
    if (total > 0) {
      throw new ConflictException(
        `Cette catégorie est encore utilisée par ${total} pièce${total > 1 ? 's' : ''} du catalogue. Changez leur catégorie avant de la supprimer.`,
      );
    }

    await this.categories.remove(trouvee);
  }

  /* ── Écriture : collections ──────────────────────────────────────────── */

  async creerCollection(donnees: CreerCollection): Promise<Collection> {
    const slug = await this.slugUniqueCollection(donnees.slug || donnees.nom);
    return this.collections.save(
      this.collections.create({ nom: donnees.nom, slug, recit: donnees.recit ?? null }),
    );
  }

  async modifierCollection(id: string, donnees: ModifierCollection): Promise<Collection> {
    const trouvee = await this.collections.findOneBy({ id });
    if (!trouvee) throw new NotFoundException('Cette collection n’existe plus.');

    if (donnees.nom !== undefined) trouvee.nom = donnees.nom;
    if (donnees.recit !== undefined) trouvee.recit = donnees.recit;
    if (donnees.slug) trouvee.slug = await this.slugUniqueCollection(donnees.slug, id);

    return this.collections.save(trouvee);
  }

  async supprimerCollection(id: string): Promise<void> {
    const trouvee = await this.collections.findOneBy({ id });
    if (!trouvee) throw new NotFoundException('Cette collection n’existe plus.');

    // Repli à 0 : `getRawOne` type ce retour comme possiblement `undefined`,
    // bien qu'un COUNT(...) renvoie toujours une ligne en pratique.
    const { compte } = (await this.produits
      .createQueryBuilder('p')
      .innerJoin('p.collections', 'c', 'c.id = :id', { id })
      .select('COUNT(DISTINCT p.id)', 'compte')
      .getRawOne<{ compte: string }>()) ?? { compte: '0' };

    if (Number(compte) > 0) {
      throw new ConflictException(
        `Cette collection est encore utilisée par ${compte} pièce${Number(compte) > 1 ? 's' : ''} du catalogue. Retirez-la de ces fiches avant de la supprimer.`,
      );
    }

    await this.collections.remove(trouvee);
  }

  private async slugUniqueCategorie(base: string, ignorerId?: string): Promise<string> {
    const racine = versSlug(base) || 'categorie';
    let candidat = racine;
    let compteur = 2;
    for (;;) {
      const existante = await this.categories.findOneBy({ slug: candidat });
      if (!existante || existante.id === ignorerId) return candidat;
      candidat = `${racine}-${compteur}`;
      compteur += 1;
    }
  }

  private async slugUniqueCollection(base: string, ignorerId?: string): Promise<string> {
    const racine = versSlug(base) || 'collection';
    let candidat = racine;
    let compteur = 2;
    for (;;) {
      const existante = await this.collections.findOneBy({ slug: candidat });
      if (!existante || existante.id === ignorerId) return candidat;
      candidat = `${racine}-${compteur}`;
      compteur += 1;
    }
  }
}
