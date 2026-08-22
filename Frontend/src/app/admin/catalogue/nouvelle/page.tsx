import type { Metadata } from 'next';
import Link from 'next/link';
import { FormulairePiece } from '@/components/admin/catalogue/FormulairePiece';
import { EnTetePage } from '@/components/admin/EnTetePage';
import {
  chargerCategoriesAdmin,
  chargerCollectionsAdmin,
  chargerColorisAdmin,
  chargerMatieresAdmin,
  chargerRevetementsAdmin,
  chargerStylesAdmin,
  essayer,
} from '@/lib/catalogue-admin';

export const metadata: Metadata = { title: 'Ajouter une pièce' };
export const dynamic = 'force-dynamic';

export default async function PageNouvellePiece() {
  const [categories, collections, matieres, styles, coloris, revetements] = await Promise.all([
    essayer(chargerCategoriesAdmin()),
    essayer(chargerCollectionsAdmin()),
    essayer(chargerMatieresAdmin()),
    essayer(chargerStylesAdmin()),
    essayer(chargerColorisAdmin()),
    essayer(chargerRevetementsAdmin()),
  ]);

  // Sans catégories, le formulaire ne peut rien produire de valide : mieux
  // vaut expliquer pourquoi que d'afficher une liste déroulante vide.
  if (!categories || categories.length === 0) {
    return (
      <>
        <EnTetePage
          titre="Ajouter une pièce"
          retour={{ libelle: 'Catalogue', href: '/admin/catalogue' }}
        />
        <div className="px-6 py-8 lg:px-10">
          <div className="max-w-2xl border border-bronze bg-blanc px-6 py-7">
            <p className="text-[17px]">L’API ne répond pas.</p>
            <p className="mt-3 text-[14px] leading-relaxed text-fumee">
              Le catalogue est stocké dans PostgreSQL. Démarrez la base puis l’API :
            </p>
            <pre className="mt-4 overflow-x-auto bg-galerie px-4 py-3 text-[13px] text-encre">
              {'cd Backend\ndocker compose up -d\nnpm run dev'}
            </pre>
            <Link href="/admin/catalogue" className="lien-souligne mt-5 inline-block text-[14px]">
              Revenir au catalogue
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <FormulairePiece
      categories={categories}
      collections={collections ?? []}
      matieres={matieres ?? []}
      styles={styles ?? []}
      coloris={coloris ?? []}
      revetements={revetements ?? []}
    />
  );
}
