import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

/**
 * Émet le jeton qui permet au navigateur de téléverser une photographie
 * directement dans Vercel Blob (§20.1), sans passer par le corps d'une
 * fonction Vercel — limité à 4,5 Mo, bien en dessous des 25 Mo qu'accepte
 * le back-office. Sert à la fois le dépôt de photos du catalogue et celui
 * de l'accueil : seul le dossier de destination (« catalogue/ » ou
 * « accueil/ ») change, décidé côté API une fois le fichier reçu.
 *
 * À FAIRE avant mise en ligne publique, comme le reste de `api/admin`
 * (voir contenu-admin.controleur.ts côté API) : vérifier ici une session
 * avant de délivrer le jeton. Tant que l'admin n'a pas de garde
 * d'authentification, ce point-ci non plus — n'importe qui connaissant
 * cette adresse peut aujourd'hui obtenir un jeton d'envoi.
 */
export async function POST(requete: Request): Promise<NextResponse> {
  const corps = (await requete.json()) as HandleUploadBody;

  try {
    const reponse = await handleUpload({
      body: corps,
      request: requete,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/tiff'],
        addRandomSuffix: true,
        maximumSizeInBytes: 25 * 1024 * 1024,
      }),
      onUploadCompleted: async () => {
        // Rien ici volontairement : le navigateur, qui attend déjà la fin
        // du téléversement, notifie lui-même l'API juste après (POST
        // /api/admin/medias/depuis-blob ou /api/admin/accueil/medias/
        // depuis-blob). Un deuxième chemin, asynchrone, ajouterait de la
        // complexité pour rien — et ne fonctionne pas en local sans
        // exposer localhost via un service comme ngrok.
      },
    });

    return NextResponse.json(reponse);
  } catch (erreur) {
    return NextResponse.json({ error: (erreur as Error).message }, { status: 400 });
  }
}
