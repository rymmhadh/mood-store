import { z } from 'zod';

export const modifierSectionSchema = z.object({
  visible: z.boolean().optional(),
});
export type ModifierSection = z.infer<typeof modifierSectionSchema>;

export const reordonnerSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(50),
});
export type Reordonner = z.infer<typeof reordonnerSchema>;

export const modifierMediaAccueilSchema = z.object({
  alt: z.string().trim().max(200).optional(),
  titre: z.string().trim().max(120).nullable().optional(),
  texte: z.string().trim().max(300).nullable().optional(),
  lien: z.string().trim().max(300).nullable().optional(),
});
export type ModifierMediaAccueil = z.infer<typeof modifierMediaAccueilSchema>;
