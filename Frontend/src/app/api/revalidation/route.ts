import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

/**
 * Invalidation du cache du catalogue (§22.3).
 *
 * Les pages du site sont mises en cache cinq minutes. Sans ce point d'entrée,
 * une pièce publiée depuis le back-office mettrait jusqu'à cinq minutes à
 * apparaître — et l'atelier, ne la voyant pas, la publierait une deuxième fois.
 *
 * Appelé par le formulaire du back-office après chaque enregistrement. Il
 * peut aussi l'être par l'API NestJS : c'est à cela que sert le secret, qui
 * devient obligatoire dès qu'il est défini dans l'environnement.
 */
export async function POST(requete: Request) {
  const attendu = process.env.REVALIDATION_SECRET;

  if (attendu) {
    const fourni =
      requete.headers.get('x-revalidation-secret') ??
      new URL(requete.url).searchParams.get('secret');

    if (fourni !== attendu) {
      return NextResponse.json({ revalide: false, message: 'Secret invalide.' }, { status: 401 });
    }
  }

  // L'étiquette couvre tous les appels catalogue (`lib/catalogue.ts`).
  revalidateTag('catalogue');

  // Les pages de liste n'ont pas d'appel étiqueté propre quand le repli a
  // servi : on les invalide explicitement.
  revalidatePath('/collections/[famille]', 'page');
  revalidatePath('/produit/[slug]', 'page');
  revalidatePath('/');

  return NextResponse.json({ revalide: true });
}
