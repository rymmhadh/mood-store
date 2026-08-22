import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { referenceProduit, versSlug } from '../commun/slug';
import { Categorie } from '../catalogue/entites/categorie.entite';
import { Coloris } from '../catalogue/entites/coloris.entite';
import { Collection } from '../catalogue/entites/collection.entite';
import { Dimension } from '../catalogue/entites/dimension.entite';
import { Matiere } from '../catalogue/entites/matiere.entite';
import { Media } from '../catalogue/entites/media.entite';
import { Produit } from '../catalogue/entites/produit.entite';
import { Revetement } from '../catalogue/entites/revetement.entite';
import { Style } from '../catalogue/entites/style.entite';
import {
  COLORIS_INITIAUX,
  MATIERES_INITIALES,
  REVETEMENTS_INITIAUX,
  STYLES_INITIAUX,
} from './attributs-initial';
import catalogueInitial from './catalogue-initial.json';

interface FamilleSource {
  slug: string;
  nom: string;
  parent: string;
  chapo: string;
}

interface ProduitSource {
  slug: string;
  type: string;
  nom: string;
  collection: string;
  designer: string;
  chapo: string;
  description: string[];
  familles: string[];
  images: string[];
  prix?: number;
  prixSurDemande?: boolean;
  nouveaute?: boolean;
  dimensions: { nom: string; largeur: number; hauteur: number; profondeur: number; surcout?: number }[];
  colorisIds: string[];
  revetementIds: string[];
  matieres: string[];
  styles: string[];
  structure: string;
  garnissage?: string;
  pietement: string;
  delaiJours: number;
  demontable: boolean;
}

/**
 * Amorçage de la base.
 *
 * Le catalogue vivait jusqu'ici dans un fichier TypeScript du front. Ce
 * fichier JSON en est l'export fidèle : au premier démarrage sur une base
 * vide, les dix-sept catégories, les collections et les quatorze pièces sont
 * recréées à l'identique, images comprises.
 *
 * Deux garde-fous :
 *   · l'amorçage ne s'exécute **que** si la table des produits est vide, donc
 *     jamais sur une base de travail ;
 *   · les photographies existantes pointent vers `/images/...`, servi par le
 *     front. Elles ne sont pas recopiées dans les médias de l'API : ce sont
 *     des fichiers versionnés avec le site, pas des téléversements.
 */
@Injectable()
export class AmorceService implements OnApplicationBootstrap {
  private readonly journal = new Logger('Amorce');

  constructor(
    @InjectRepository(Produit) private readonly produits: Repository<Produit>,
    @InjectRepository(Categorie) private readonly categories: Repository<Categorie>,
    @InjectRepository(Collection) private readonly collections: Repository<Collection>,
    @InjectRepository(Media) private readonly medias: Repository<Media>,
    @InjectRepository(Dimension) private readonly dimensions: Repository<Dimension>,
    @InjectRepository(Matiere) private readonly matieres: Repository<Matiere>,
    @InjectRepository(Style) private readonly styles: Repository<Style>,
    @InjectRepository(Coloris) private readonly coloris: Repository<Coloris>,
    @InjectRepository(Revetement) private readonly revetements: Repository<Revetement>,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.config.get<string>('AMORCER_SI_VIDE') === 'false') return;

    // Indépendant du reste : une base qui a déjà des pièces mais pas encore
    // ces quatre tables (mise à jour du projet) les reçoit quand même.
    await this.amorcerAttributs();

    if ((await this.produits.count()) > 0) {
      this.journal.log('Base déjà peuplée — amorçage du catalogue ignoré.');
      return;
    }

    await this.amorcer();
  }

  private async amorcerAttributs(): Promise<void> {
    if ((await this.matieres.count()) === 0) {
      await this.matieres.save(
        MATIERES_INITIALES.map((nom, ordre) => this.matieres.create({ nom, ordre })),
      );
    }
    if ((await this.styles.count()) === 0) {
      await this.styles.save(STYLES_INITIAUX.map((nom, ordre) => this.styles.create({ nom, ordre })));
    }
    if ((await this.coloris.count()) === 0) {
      await this.coloris.save(
        COLORIS_INITIAUX.map((c, ordre) => this.coloris.create({ ...c, ordre })),
      );
    }
    if ((await this.revetements.count()) === 0) {
      await this.revetements.save(
        REVETEMENTS_INITIAUX.map((r, ordre) => this.revetements.create({ ...r, ordre })),
      );
    }
  }

  async amorcer(): Promise<void> {
    const familles = catalogueInitial.familles as FamilleSource[];
    const produits = catalogueInitial.produits as ProduitSource[];

    this.journal.log('Base vide — création du catalogue initial.');

    /* ── Univers, puis typologies ─────────────────────────────────────── */

    const universParNom = new Map<string, Categorie>();
    const nomsUnivers = [...new Set(familles.map((f) => f.parent))];

    for (const [index, nom] of nomsUnivers.entries()) {
      const univers = await this.categories.save(
        this.categories.create({ nom, slug: versSlug(nom), ordre: index, parentId: null }),
      );
      universParNom.set(nom, univers);
    }

    const famillesParSlug = new Map<string, Categorie>();
    for (const [index, famille] of familles.entries()) {
      const enregistree = await this.categories.save(
        this.categories.create({
          nom: famille.nom,
          slug: famille.slug,
          chapo: famille.chapo,
          ordre: index,
          parentId: universParNom.get(famille.parent)?.id ?? null,
        }),
      );
      famillesParSlug.set(famille.slug, enregistree);
    }

    /* ── Collections ──────────────────────────────────────────────────── */

    const collectionsParNom = new Map<string, Collection>();
    for (const nom of [...new Set(produits.map((p) => p.collection).filter(Boolean))]) {
      const collection = await this.collections.save(
        this.collections.create({ nom, slug: versSlug(nom) }),
      );
      collectionsParNom.set(nom, collection);
    }

    /* ── Pièces ───────────────────────────────────────────────────────── */

    for (const [index, source] of produits.entries()) {
      const categorie = famillesParSlug.get(source.familles[0]) ?? null;
      const secondaires = source.familles
        .slice(1)
        .map((slug) => famillesParSlug.get(slug))
        .filter((c): c is Categorie => Boolean(c));
      const collection = collectionsParNom.get(source.collection);

      const produit = await this.produits.save(
        this.produits.create({
          nom: source.nom,
          slug: source.slug,
          reference: referenceProduit(categorie?.nom ?? 'MOOD', index + 1),
          type: source.type,
          designer: source.designer,
          chapo: source.chapo,
          description: source.description,
          prix: source.prix !== undefined ? source.prix.toFixed(2) : null,
          prixSurDemande: source.prixSurDemande ?? false,
          statut: 'publie',
          nouveaute: source.nouveaute ?? false,
          miseEnAvant: index < 3,
          delaiJours: source.delaiJours,
          demontable: source.demontable,
          structure: source.structure,
          garnissage: source.garnissage ?? null,
          pietement: source.pietement,
          matieres: source.matieres,
          styles: source.styles,
          colorisIds: source.colorisIds,
          revetementIds: source.revetementIds,
          categorieId: categorie?.id ?? null,
          categoriesSecondaires: secondaires,
          collections: collection ? [collection] : [],
        }),
      );

      await this.dimensions.save(
        source.dimensions.map((d, ordre) =>
          this.dimensions.create({
            produitId: produit.id,
            nom: d.nom,
            largeur: d.largeur,
            hauteur: d.hauteur,
            profondeur: d.profondeur,
            surcout: d.surcout ?? 0,
            ordre,
          }),
        ),
      );

      await this.medias.save(
        source.images.map((chemin, ordre) =>
          this.medias.create({
            url: chemin,
            urlMaster: chemin,
            // Dimensions réelles des visuels du site, déclarées dans le front.
            largeur: 2000,
            hauteur: 2500,
            alt: `${source.type} ${source.nom} — Mood Store`,
            role: ordre === 0 ? 'principale' : 'situation',
            lqip: '',
            ordre,
            produitId: produit.id,
          }),
        ),
      );
    }

    this.journal.log(
      `Catalogue initial créé : ${nomsUnivers.length} univers, ${familles.length} catégories, ` +
        `${collectionsParNom.size} collections, ${produits.length} pièces.`,
    );
  }
}
