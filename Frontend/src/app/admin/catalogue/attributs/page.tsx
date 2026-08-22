import type { Metadata } from 'next';
import { GestionAttributs } from '@/components/admin/catalogue/GestionAttributs';
import {
  chargerArbreAdmin,
  chargerColorisAdmin,
  chargerCollectionsAdmin,
  chargerMatieresAdmin,
  chargerRevetementsAdmin,
  chargerStylesAdmin,
  essayer,
} from '@/lib/catalogue-admin';

export const metadata: Metadata = { title: 'Catégories et nuanciers' };
export const dynamic = 'force-dynamic';

export default async function PageAttributs() {
  const [univers, collections, matieres, styles, coloris, revetements] = await Promise.all([
    essayer(chargerArbreAdmin()),
    essayer(chargerCollectionsAdmin()),
    essayer(chargerMatieresAdmin()),
    essayer(chargerStylesAdmin()),
    essayer(chargerColorisAdmin()),
    essayer(chargerRevetementsAdmin()),
  ]);

  return (
    <GestionAttributs
      univers={univers ?? []}
      collections={collections ?? []}
      matieres={matieres ?? []}
      styles={styles ?? []}
      coloris={coloris ?? []}
      revetements={revetements ?? []}
    />
  );
}
