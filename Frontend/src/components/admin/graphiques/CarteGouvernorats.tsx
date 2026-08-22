'use client';

import { useMemo, useState } from 'react';
import type { MesureGouvernorat } from '@/types/admin';
import { nombreFr } from '@/lib/tableauBord';
import { pasRampe, pourcentFr, TableauDeSecours } from './primitives';

/**
 * Provenance géographique des visiteurs, par gouvernorat.
 *
 * ── Cercles proportionnels plutôt qu'aplats de couleur ──────────────────
 * L'aplat colorié (« choroplèthe ») trompe : le Tataouine couvrirait un
 * quart de l'écran pour trois cents visiteurs, et le Grand Tunis, minuscule,
 * en concentrerait la moitié. La surface du gouvernorat n'a rien à voir avec
 * son audience. Un disque dont l'**aire** est proportionnelle à l'audience
 * dit la vérité, et se pose au bon endroit.
 *
 * Le rayon suit la racine carrée de la valeur : c'est l'aire, et non le
 * rayon, que l'œil compare.
 *
 * La teinte reprend la même rampe, du clair au foncé — redondante avec la
 * taille, volontairement : c'est ce qui donne la lecture « carte de chaleur »
 * demandée au cahier des charges, et la redondance aide plutôt qu'elle ne
 * nuit.
 */

/** Cadre géographique de la Tunisie, avec un peu de marge. */
const CADRE = { lonMin: 7.35, lonMax: 11.75, latMin: 30.05, latMax: 37.55 };

/** Latitude de référence pour la correction des longitudes. */
const LAT_REF = 34.5;

/**
 * Contour du pays, simplifié.
 *
 * Une quarantaine de points suffisent à la silhouette : côte nord, cap Bon,
 * golfe de Gabès, frontière libyenne jusqu'à Borj El Khadra, puis remontée
 * de la frontière algérienne. Le tracé sert de repère, pas de cadastre — il
 * ne porte aucune donnée.
 */
const CONTOUR: [number, number][] = [
  // Côte nord, d'ouest en est, jusqu'au cap Blanc
  [8.2, 36.95], [8.75, 36.98], [9.05, 37.1], [9.35, 37.15], [9.72, 37.34],
  [9.9, 37.28], [10.1, 37.2], [10.3, 37.1], [10.28, 36.95], [10.2, 36.85],
  // Cap Bon
  [10.35, 36.83], [10.55, 36.95], [10.8, 37.05], [11.03, 37.08], [11.12, 36.9],
  [11.0, 36.7], [10.8, 36.5], [10.62, 36.4],
  // Sahel, du golfe de Hammamet à Sfax
  [10.5, 36.2], [10.55, 35.95], [10.64, 35.83], [10.87, 35.75], [11.0, 35.65],
  [11.07, 35.5], [11.15, 35.23], [11.0, 35.0], [10.85, 34.8], [10.76, 34.72],
  // Golfe de Gabès, Djerba, Zarzis
  [10.45, 34.55], [10.2, 34.35], [10.05, 34.1], [10.0, 33.95], [10.1, 33.8],
  [10.35, 33.7], [10.75, 33.62], [11.1, 33.52], [11.3, 33.35], [11.55, 33.18],
  // Frontière libyenne, jusqu'à la pointe de Borj El Khadra
  [11.2, 32.6], [10.85, 32.1], [10.45, 31.55], [10.05, 31.0], [9.7, 30.45],
  [9.52, 30.23],
  // Remontée de la frontière algérienne
  [9.15, 31.1], [9.05, 31.9], [8.85, 32.3], [8.35, 32.75], [8.0, 33.1],
  [7.75, 33.25], [7.5, 33.75], [7.55, 34.05], [7.85, 34.3], [8.15, 34.6],
  [8.28, 34.9], [8.25, 35.25], [8.28, 35.6], [8.4, 35.95], [8.48, 36.25],
  [8.28, 36.45], [8.22, 36.7],
];

const LARGEUR = 260;

export function CarteGouvernorats({ gouvernorats }: { gouvernorats: MesureGouvernorat[] }) {
  const [survol, setSurvol] = useState<string | null>(null);

  const { projeter, hauteur, contour, maximum, total } = useMemo(() => {
    const k = Math.cos((LAT_REF * Math.PI) / 180);
    const largeurDegres = (CADRE.lonMax - CADRE.lonMin) * k;
    const hauteurDegres = CADRE.latMax - CADRE.latMin;
    const echelle = LARGEUR / largeurDegres;
    const h = Math.round(hauteurDegres * echelle);

    const p = (lon: number, lat: number): [number, number] => [
      (lon - CADRE.lonMin) * k * echelle,
      (CADRE.latMax - lat) * echelle,
    ];

    return {
      projeter: p,
      hauteur: h,
      contour: CONTOUR.map(([lon, lat]) => p(lon, lat).join(' ')).join(' L') ,
      maximum: Math.max(1, ...gouvernorats.map((g) => g.visiteurs)),
      total: Math.max(1, gouvernorats.reduce((s, g) => s + g.visiteurs, 0)),
    };
  }, [gouvernorats]);

  /** Aire proportionnelle : le rayon suit la racine carrée. */
  const rayon = (v: number) => 2.5 + Math.sqrt(v / maximum) * 16;

  const classement = [...gouvernorats].sort((a, b) => b.visiteurs - a.visiteurs);
  const actif = classement.find((g) => g.code === survol) ?? null;

  return (
    <div>
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        <figure className="relative shrink-0 self-center sm:self-start">
          <svg
            width={LARGEUR}
            height={hauteur}
            viewBox={`0 0 ${LARGEUR} ${hauteur}`}
            role="img"
            aria-label="Carte de la Tunisie. L'audience de chaque gouvernorat est figurée par un disque proportionnel. Le classement chiffré est affiché à côté de la carte."
            className="block overflow-visible"
          >
            <path
              d={`M${contour}Z`}
              fill="var(--color-galerie)"
              stroke="var(--color-sable)"
              strokeWidth={1}
              strokeLinejoin="round"
            />

            {/* Les plus petits d'abord : les gros disques ne masquent rien. */}
            {[...gouvernorats]
              .sort((a, b) => a.visiteurs - b.visiteurs)
              .map((g) => {
                const [cx, cy] = projeter(g.longitude, g.latitude);
                const enAvant = survol === g.code;
                return (
                  <circle
                    key={g.code}
                    cx={cx}
                    cy={cy}
                    r={rayon(g.visiteurs)}
                    fill={pasRampe(Math.sqrt(g.visiteurs / maximum))}
                    fillOpacity={survol === null || enAvant ? 0.85 : 0.35}
                    stroke="var(--color-blanc)"
                    strokeWidth={2}
                    className="cursor-pointer transition-opacity duration-300"
                    onMouseEnter={() => setSurvol(g.code)}
                    onMouseLeave={() => setSurvol(null)}
                  >
                    <title>{`${g.nom} — ${nombreFr(g.visiteurs)} visiteurs`}</title>
                  </circle>
                );
              })}
          </svg>

          <figcaption className="mt-3 text-center text-[12px] text-pierre">
            {actif ? (
              <span className="text-encre">
                {actif.nom} — <span className="chiffres">{nombreFr(actif.visiteurs)}</span> visiteurs
                ({pourcentFr((actif.visiteurs / total) * 100)})
              </span>
            ) : (
              'Aire du disque proportionnelle à l’audience'
            )}
          </figcaption>
        </figure>

        <ol className="flex min-w-0 flex-1 flex-col gap-2.5">
          {classement.slice(0, 8).map((g, i) => (
            <li
              key={g.code}
              onMouseEnter={() => setSurvol(g.code)}
              onMouseLeave={() => setSurvol(null)}
              className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-center gap-x-3 py-1"
            >
              <span className="chiffres text-[12px] text-pierre">{i + 1}</span>
              <div className="min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-[14px]">{g.nom}</span>
                  <span className="chiffres shrink-0 text-[13px] text-fumee">
                    {pourcentFr((g.visiteurs / total) * 100)}
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full bg-galerie">
                  <div
                    className="h-full rounded-r-[4px] bg-donnee-300 transition-[width] duration-700 ease-[var(--ease-doux)]"
                    style={{ width: `${Math.max(1.5, (g.visiteurs / maximum) * 100)}%` }}
                  />
                </div>
              </div>
            </li>
          ))}

          <li className="pt-2 text-[12px] text-pierre">
            {classement.length - 8} autres gouvernorats —{' '}
            <span className="chiffres">
              {nombreFr(classement.slice(8).reduce((s, g) => s + g.visiteurs, 0))}
            </span>{' '}
            visiteurs
          </li>
        </ol>
      </div>

      <TableauDeSecours
        legende="Voir les 24 gouvernorats"
        colonnes={['Gouvernorat', 'Visiteurs', 'Part']}
        lignes={classement.map((g) => [
          g.nom,
          nombreFr(g.visiteurs),
          pourcentFr((g.visiteurs / total) * 100),
        ])}
      />
    </div>
  );
}
