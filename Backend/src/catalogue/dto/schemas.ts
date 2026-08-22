import { z } from 'zod';
import { STATUTS } from '../entites/produit.entite';

/**
 * Schémas d'entrée du catalogue.
 *
 * Ce fichier est volontairement sans dépendance à NestJS ni à TypeORM : il
 * peut être recopié tel quel dans le front, ou extrait dans un paquet partagé,
 * pour que le formulaire du back-office valide exactement ce que l'API
 * validera (§22.3).
 *
 * Les messages sont écrits pour être affichés sans reformulation sous le champ
 * concerné — pas de « expected string, received undefined ».
 */

const texteObligatoire = (libelle: string, max = 200) =>
  z
    .string({ required_error: `${libelle} est obligatoire.` })
    .trim()
    .min(1, `${libelle} est obligatoire.`)
    .max(max, `${libelle} ne doit pas dépasser ${max} caractères.`);

export const dimensionSchema = z.object({
  nom: texteObligatoire('Le nom de la taille', 80),
  largeur: z.number().int().min(1).max(2000),
  profondeur: z.number().int().min(1).max(2000),
  hauteur: z.number().int().min(1).max(2000),
  hauteurAssise: z.number().int().min(1).max(2000).nullable().optional(),
  surcout: z.number().int().min(0).max(1_000_000).default(0),
});

export const creerProduitSchema = z
  .object({
    nom: texteObligatoire('Le nom de la pièce', 120),
    type: texteObligatoire('La typologie', 80),
    categorieId: z
      .string({ required_error: 'Choisissez une catégorie.' })
      .uuid('Choisissez une catégorie.'),

    /** Slug laissé vide = déduit du nom. */
    slug: z.string().trim().max(90).optional(),
    reference: z.string().trim().max(40).optional(),
    designer: z.string().trim().max(120).optional(),

    chapo: z
      .string()
      .trim()
      .max(280, 'L’accroche ne doit pas dépasser 280 caractères.')
      .default(''),
    description: z.array(z.string().trim()).max(20).default([]),
    motAtelier: z.string().trim().max(2000).nullable().optional(),

    prix: z
      .number({ invalid_type_error: 'Le prix doit être un nombre.' })
      .min(0, 'Le prix ne peut pas être négatif.')
      .max(10_000_000)
      .nullable()
      .optional(),
    prixPro: z.number().min(0).max(10_000_000).nullable().optional(),
    prixSurDemande: z.boolean().default(false),

    statut: z.enum(STATUTS).default('brouillon'),
    miseEnAvant: z.boolean().default(false),
    nouveaute: z.boolean().default(false),

    delaiJours: z
      .number()
      .int('Le délai s’exprime en jours entiers.')
      .min(0)
      .max(365)
      .default(21),
    demontable: z.boolean().default(false),
    structure: z.string().trim().max(200).default(''),
    garnissage: z.string().trim().max(200).nullable().optional(),
    pietement: z.string().trim().max(200).default(''),

    matieres: z.array(z.string().trim().max(60)).max(12).default([]),
    styles: z.array(z.string().trim().max(60)).max(8).default([]),
    colorisIds: z.array(z.string().trim().max(60)).max(24).default([]),
    revetementIds: z.array(z.string().trim().max(60)).max(24).default([]),

    /** Autres catégories où la pièce doit apparaître. */
    categorieIdsSecondaires: z.array(z.string().uuid()).max(6).default([]),
    collectionIds: z.array(z.string().uuid()).max(8).default([]),
    /** Médias déjà téléversés, dans l'ordre d'affichage voulu. */
    mediaIds: z.array(z.string().uuid()).max(24).default([]),
    dimensions: z.array(dimensionSchema).max(12).default([]),

    seoTitre: z.string().trim().max(70).nullable().optional(),
    seoDescription: z.string().trim().max(180).nullable().optional(),
  })
  .superRefine((valeur, contexte) => {
    // Une pièce publiée sans photo n'a rien à faire sur le site : la grille
    // afficherait un rectangle vide. On bloque à la publication, pas au
    // brouillon — on doit pouvoir commencer une fiche sans ses images.
    if (valeur.statut === 'publie' && valeur.mediaIds.length === 0) {
      contexte.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['mediaIds'],
        message: 'Ajoutez au moins une photographie avant de publier cette pièce.',
      });
    }

    if (valeur.statut === 'publie' && valeur.chapo.length === 0) {
      contexte.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['chapo'],
        message: 'L’accroche est nécessaire pour publier : elle sert aussi à Google.',
      });
    }

    if (!valeur.prixSurDemande && (valeur.prix === null || valeur.prix === undefined)) {
      contexte.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['prix'],
        message: 'Indiquez un prix, ou cochez « prix sur demande ».',
      });
    }
  });

export type CreerProduit = z.infer<typeof creerProduitSchema>;

/**
 * Modification : tous les champs deviennent facultatifs.
 *
 * On repart de la forme interne du schéma (avant `superRefine`) parce qu'on ne
 * peut pas rendre partiel un schéma déjà affiné. Les règles croisées sont
 * revérifiées dans le service, sur l'objet fusionné — c'est le seul endroit où
 * l'on connaît la valeur finale de chaque champ.
 */
export const modifierProduitSchema = creerProduitSchema.innerType().partial();
export type ModifierProduit = z.infer<typeof modifierProduitSchema>;

export const filtrerProduitsSchema = z.object({
  recherche: z.string().trim().max(120).optional(),
  categorie: z.string().trim().max(90).optional(),
  collection: z.string().trim().max(90).optional(),
  statut: z.enum(STATUTS).optional(),
  /** `sansPhoto=true` alimente l'alerte du tableau de bord. */
  sansPhoto: z.coerce.boolean().optional(),
  tri: z
    .enum(['recent', 'nom', 'prix-croissant', 'prix-decroissant', 'vues'])
    .default('recent'),
  page: z.coerce.number().int().min(1).default(1),
  parPage: z.coerce.number().int().min(1).max(100).default(24),
});
export type FiltrerProduits = z.infer<typeof filtrerProduitsSchema>;

export const modifierMediaSchema = z.object({
  alt: z.string().trim().max(200).optional(),
  legende: z.string().trim().max(300).nullable().optional(),
  role: z.enum(['principale', 'situation', 'macro', 'detail', 'schema']).optional(),
});
