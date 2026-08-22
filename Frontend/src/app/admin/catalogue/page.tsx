import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ListeProduits } from '@/components/admin/catalogue/ListeProduits';
import {
  chargerCategoriesAdmin,
  chargerPieces,
  chargerStatsCatalogue,
  essayer,
} from '@/lib/catalogue-admin';

export const metadata: Metadata = { title: 'Catalogue' };
export const dynamic = 'force-dynamic';

export default async function PageCatalogue() {
  // Les trois lectures sont indépendantes : les lancer en parallèle évite
  // d'additionner trois allers-retours réseau avant le premier pixel.
  const [liste, categories, stats] = await Promise.all([
    essayer(chargerPieces()),
    essayer(chargerCategoriesAdmin()),
    essayer(chargerStatsCatalogue()),
  ]);

  return (
    <Suspense>
      <ListeProduits
        initial={liste?.pieces ?? []}
        meta={liste?.meta ?? null}
        categories={categories ?? []}
        stats={stats}
        horsLigne={liste === null}
      />
    </Suspense>
  );
}
