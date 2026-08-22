/**
 * Client de l'API Mood Store.
 *
 * Toutes les réponses arrivent enveloppées en `{ data, meta, error }` (§22.3).
 * Ce module déballe l'enveloppe et transforme une erreur en exception typée,
 * de sorte que le reste du code manipule directement la donnée.
 */

export const URL_API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export interface MetaApi {
  total?: number;
  page?: number;
  parPage?: number;
  pages?: number;
  [cle: string]: unknown;
}

interface Enveloppe<T> {
  data: T | null;
  meta: MetaApi | null;
  error: { code: number; message: string; champs?: Record<string, string> } | null;
}

/**
 * Erreur d'API.
 *
 * `champs` porte les messages champ par champ produits par la validation Zod
 * du back : le formulaire les affiche sous la bonne case plutôt qu'en bandeau.
 */
export class ErreurApi extends Error {
  constructor(
    message: string,
    readonly code: number,
    readonly champs?: Record<string, string>,
  ) {
    super(message);
    this.name = 'ErreurApi';
  }
}

interface Options extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Revalidation ISR, en secondes. Sans effet côté navigateur. */
  revalidate?: number | false;
  /** Étiquette de cache, pour une invalidation ciblée à la publication. */
  tags?: string[];
}

export async function api<T>(
  chemin: string,
  options: Options = {},
): Promise<{ data: T; meta: MetaApi | null }> {
  const { body, revalidate, tags, headers, ...reste } = options;

  // Un `FormData` porte sa propre frontière multipart : lui imposer un
  // Content-Type casse le découpage des fichiers.
  const estFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const reponse = await fetch(`${URL_API}${chemin}`, {
    ...reste,
    headers: {
      ...(estFormData || body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    body: body === undefined ? undefined : estFormData ? (body as FormData) : JSON.stringify(body),
    ...(revalidate === undefined && !tags
      ? {}
      : { next: { ...(revalidate !== undefined ? { revalidate } : {}), ...(tags ? { tags } : {}) } }),
  });

  let enveloppe: Enveloppe<T>;
  try {
    enveloppe = (await reponse.json()) as Enveloppe<T>;
  } catch {
    throw new ErreurApi(`L’API a répondu ${reponse.status} sans contenu lisible.`, reponse.status);
  }

  if (!reponse.ok || enveloppe.error) {
    throw new ErreurApi(
      enveloppe.error?.message ?? `L’API a répondu ${reponse.status}.`,
      enveloppe.error?.code ?? reponse.status,
      enveloppe.error?.champs,
    );
  }

  return { data: enveloppe.data as T, meta: enveloppe.meta };
}

/** Raccourci quand seules les données comptent. */
export const donnees = async <T>(chemin: string, options?: Options): Promise<T> =>
  (await api<T>(chemin, options)).data;
