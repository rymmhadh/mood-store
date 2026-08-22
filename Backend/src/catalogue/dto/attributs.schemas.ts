import { z } from 'zod';

const nomObligatoire = (libelle: string, max = 80) =>
  z
    .string({ required_error: `${libelle} est obligatoire.` })
    .trim()
    .min(1, `${libelle} est obligatoire.`)
    .max(max, `${libelle} ne doit pas dépasser ${max} caractères.`);

const hex = z
  .string({ required_error: 'La couleur est obligatoire.' })
  .trim()
  .regex(/^#[0-9a-fA-F]{6}$/, 'La couleur doit être un code hexadécimal, par exemple #B7AA98.');

/* ── Catégories ──────────────────────────────────────────────────────── */

export const creerCategorieSchema = z.object({
  nom: nomObligatoire('Le nom de la catégorie', 80),
  slug: z.string().trim().max(90).optional(),
  chapo: z.string().trim().max(280).default(''),
  ordre: z.number().int().min(0).max(999).default(0),
  /** Vide = univers de tête (« Salon », « Chambre »…). */
  parentId: z.string().uuid().nullable().optional(),
});
export type CreerCategorie = z.infer<typeof creerCategorieSchema>;
export const modifierCategorieSchema = creerCategorieSchema.partial();
export type ModifierCategorie = z.infer<typeof modifierCategorieSchema>;

/* ── Collections ─────────────────────────────────────────────────────── */

export const creerCollectionSchema = z.object({
  nom: nomObligatoire('Le nom de la collection', 80),
  slug: z.string().trim().max(90).optional(),
  recit: z.string().trim().max(600).nullable().optional(),
});
export type CreerCollection = z.infer<typeof creerCollectionSchema>;
export const modifierCollectionSchema = creerCollectionSchema.partial();
export type ModifierCollection = z.infer<typeof modifierCollectionSchema>;

/* ── Matières et styles ──────────────────────────────────────────────── */

export const creerMatiereSchema = z.object({
  nom: nomObligatoire('Le nom de la matière', 60),
  ordre: z.number().int().min(0).max(999).default(0),
});
export type CreerMatiere = z.infer<typeof creerMatiereSchema>;
export const modifierMatiereSchema = creerMatiereSchema.partial();
export type ModifierMatiere = z.infer<typeof modifierMatiereSchema>;

export const creerStyleSchema = creerMatiereSchema.extend({});
export type CreerStyle = z.infer<typeof creerStyleSchema>;
export const modifierStyleSchema = creerStyleSchema.partial();
export type ModifierStyle = z.infer<typeof modifierStyleSchema>;

/* ── Coloris et revêtements ──────────────────────────────────────────── */

export const creerColorisSchema = z.object({
  nom: nomObligatoire('Le nom du coloris', 60),
  slug: z.string().trim().max(60).optional(),
  hex,
  ordre: z.number().int().min(0).max(999).default(0),
});
export type CreerColoris = z.infer<typeof creerColorisSchema>;
export const modifierColorisSchema = creerColorisSchema.partial();
export type ModifierColoris = z.infer<typeof modifierColorisSchema>;

export const creerRevetementSchema = z.object({
  nom: nomObligatoire('Le nom du revêtement', 80),
  slug: z.string().trim().max(60).optional(),
  famille: nomObligatoire('La famille de revêtement', 40),
  hex,
  entretien: z.string().trim().max(200).default(''),
  ordre: z.number().int().min(0).max(999).default(0),
});
export type CreerRevetement = z.infer<typeof creerRevetementSchema>;
export const modifierRevetementSchema = creerRevetementSchema.partial();
export type ModifierRevetement = z.infer<typeof modifierRevetementSchema>;
