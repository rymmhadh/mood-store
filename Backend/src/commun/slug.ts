/**
 * Transforme un libellé en fragment d'URL.
 *
 * « Canapé d'angle Rivage » → « canape-d-angle-rivage ». Les accents sont
 * décomposés puis retirés : un slug accentué s'affiche en pourcentage-encodé
 * dans la barre d'adresse et casse le partage sur WhatsApp.
 */
export function versSlug(texte: string): string {
  return texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'`]/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

/**
 * Rend un slug unique en lui ajoutant un suffixe numéroté.
 * `existe` interroge la base ; on s'arrête au premier libre.
 */
export async function slugUnique(
  base: string,
  existe: (candidat: string) => Promise<boolean>,
): Promise<string> {
  const racine = versSlug(base) || 'piece';
  if (!(await existe(racine))) return racine;

  for (let i = 2; i < 200; i++) {
    const candidat = `${racine}-${i}`;
    if (!(await existe(candidat))) return candidat;
  }
  return `${racine}-${Date.now()}`;
}

/**
 * Référence interne d'une pièce : « MS-CAN-0007 ».
 * Trois lettres tirées de la catégorie, puis un compteur.
 */
export function referenceProduit(categorie: string, numero: number): string {
  const code = versSlug(categorie).replace(/-/g, '').slice(0, 3).toUpperCase().padEnd(3, 'X');
  return `MS-${code}-${numero.toString().padStart(4, '0')}`;
}
