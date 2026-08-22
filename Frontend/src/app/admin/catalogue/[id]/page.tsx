import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FormulairePiece } from '@/components/admin/catalogue/FormulairePiece';
import {
  chargerCategoriesAdmin,
  chargerCollectionsAdmin,
  chargerColorisAdmin,
  chargerMatieresAdmin,
  chargerPiece,
  chargerRevetementsAdmin,
  chargerStylesAdmin,
  essayer,
} from '@/lib/catalogue-admin';

export const metadata: Metadata = { title: 'Modifier une pièce' };
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PageModifierPiece({ params }: Props) {
  const { id } = await params;

  const [piece, categories, collections, matieres, styles, coloris, revetements] = await Promise.all([
    essayer(chargerPiece(id)),
    essayer(chargerCategoriesAdmin()),
    essayer(chargerCollectionsAdmin()),
    essayer(chargerMatieresAdmin()),
    essayer(chargerStylesAdmin()),
    essayer(chargerColorisAdmin()),
    essayer(chargerRevetementsAdmin()),
  ]);

  if (!piece) notFound();

  return (
    <FormulairePiece
      piece={piece}
      categories={categories ?? []}
      collections={collections ?? []}
      matieres={matieres ?? []}
      styles={styles ?? []}
      coloris={coloris ?? []}
      revetements={revetements ?? []}
    />
  );
}
