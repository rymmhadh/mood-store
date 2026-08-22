import { BadRequestException, PipeTransform } from '@nestjs/common';
import type { ZodTypeAny, z } from 'zod';

/**
 * Validation par schéma Zod (§22.3).
 *
 * Zod plutôt que `class-validator` pour une raison précise : le schéma est une
 * valeur ordinaire, donc le même fichier peut être importé par le front. Un
 * décorateur posé sur une classe, lui, ne se partage pas.
 *
 * Les messages sont renvoyés champ par champ, ce que le formulaire du
 * back-office affiche directement sous la bonne case.
 */
export class ZodPipe<T extends ZodTypeAny> implements PipeTransform {
  constructor(private readonly schema: T) {}

  transform(valeur: unknown): z.infer<T> {
    const resultat = this.schema.safeParse(valeur);
    if (resultat.success) return resultat.data;

    const champs: Record<string, string> = {};
    for (const probleme of resultat.error.issues) {
      const chemin = probleme.path.join('.') || '_';
      if (!champs[chemin]) champs[chemin] = probleme.message;
    }

    throw new BadRequestException({
      message: 'Certains champs sont incomplets ou invalides.',
      champs,
    });
  }
}
