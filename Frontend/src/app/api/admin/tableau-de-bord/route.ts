import { NextResponse } from 'next/server';
import { construireTableauDeBord } from '@/lib/tableauBord';
import { PERIODES, type Periode } from '@/types/admin';

/**
 * GET /api/admin/tableau-de-bord?periode=7j|30j|90j
 *
 * Toute la charge utile du §19.3 en un appel : indicateurs, séries des sept
 * graphiques, alertes et flux d'activité. Le front n'a donc qu'une requête à
 * émettre quand l'utilisateur change de période.
 *
 * Aucune mise en cache : un tableau de bord qui affiche des chiffres d'hier
 * ne sert à rien. Le jour où le back NestJS prendra le relais, seul l'appel
 * à `construireTableauDeBord` change.
 *
 * À FAIRE avant mise en ligne : contrôler la session et le rôle
 * (§19.2 — « Lecture seule » suffit pour cette route).
 */
export const dynamic = 'force-dynamic';

function lirePeriode(valeur: string | null): Periode {
  return PERIODES.some((p) => p.id === valeur) ? (valeur as Periode) : '30j';
}

export async function GET(requete: Request) {
  const periode = lirePeriode(new URL(requete.url).searchParams.get('periode'));

  return NextResponse.json(construireTableauDeBord(periode), {
    headers: { 'Cache-Control': 'no-store' },
  });
}
