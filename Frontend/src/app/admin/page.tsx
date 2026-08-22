import type { Metadata } from 'next';
import { TableauDeBord } from '@/components/admin/TableauDeBord';
import { chargerStatsCatalogue, essayer } from '@/lib/catalogue-admin';
import { construireTableauDeBord } from '@/lib/tableauBord';

export const metadata: Metadata = { title: 'Tableau de bord' };

/**
 * Le premier jeu de données est construit sur le serveur, pas récupéré par
 * `fetch` : un composant serveur qui appellerait sa propre route HTTP ferait
 * un aller-retour réseau pour rien. Les rechargements suivants, eux, passent
 * bien par l'API — c'est le contrat qu'il faut éprouver.
 */
export const dynamic = 'force-dynamic';

export default async function PageTableauDeBord() {
  // `essayer` : le tableau de bord doit s'afficher même API éteinte. Les
  // alertes du catalogue disparaissent alors, le reste de l'écran reste lisible.
  const statsCatalogue = await essayer(chargerStatsCatalogue());

  return <TableauDeBord initial={construireTableauDeBord('30j')} statsCatalogue={statsCatalogue} />;
}
