import type { Metadata } from 'next';
import { GestionAccueil } from '@/components/admin/contenu/GestionAccueil';
import { chargerMediasAccueilAdmin, chargerSectionsAccueilAdmin, essayer } from '@/lib/contenu-admin';
import type { MediaAccueilAdmin } from '@/types/admin-contenu';

export const metadata: Metadata = { title: 'Contenu de l’accueil' };
export const dynamic = 'force-dynamic';

/** Sections dont les photos se gèrent depuis cet écran. */
const SECTIONS_AVEC_PHOTOS = ['hero', 'atelier', 'sur-mesure', 'instagram'];

export default async function PageContenu() {
  const sections = (await essayer(chargerSectionsAccueilAdmin())) ?? [];

  const paires = await Promise.all(
    SECTIONS_AVEC_PHOTOS.map(
      async (cle) => [cle, (await essayer(chargerMediasAccueilAdmin(cle))) ?? []] as const,
    ),
  );
  const mediasParSection: Record<string, MediaAccueilAdmin[]> = Object.fromEntries(paires);

  if (sections.length === 0) {
    return (
      <div className="px-6 py-8 lg:px-10">
        <div className="max-w-2xl border border-bronze bg-blanc px-6 py-7">
          <p className="text-[17px]">L’API ne répond pas.</p>
          <p className="mt-3 text-[14px] leading-relaxed text-fumee">
            Le contenu de l’accueil est stocké dans PostgreSQL. Démarrez la base puis l’API :
          </p>
          <pre className="mt-4 overflow-x-auto bg-galerie px-4 py-3 text-[13px] text-encre">
            {'cd Backend\ndocker compose up -d\nnpm run dev'}
          </pre>
        </div>
      </div>
    );
  }

  return <GestionAccueil sections={sections} mediasParSection={mediasParSection} />;
}
