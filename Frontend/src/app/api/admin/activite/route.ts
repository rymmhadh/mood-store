import { NextResponse } from 'next/server';
import { construireFluxActivite } from '@/lib/tableauBord';

/**
 * GET /api/admin/activite?nombre=12
 *
 * Flux temps réel de la colonne latérale. Route séparée du tableau de bord
 * parce qu'elle est interrogée bien plus souvent : le reste de l'écran se
 * rafraîchit sur action, ce flux se rafraîchit tout seul.
 */
export const dynamic = 'force-dynamic';

export async function GET(requete: Request) {
  const brut = Number(new URL(requete.url).searchParams.get('nombre'));
  const nombre = Number.isFinite(brut) ? Math.min(50, Math.max(1, Math.round(brut))) : 12;

  return NextResponse.json(
    { evenements: construireFluxActivite(nombre) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
