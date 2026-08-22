'use client';

import { useMemo, useState } from 'react';
import type { PointTrafic } from '@/types/admin';
import { dateCourte, nombreFr } from '@/lib/tableauBord';
import { useLargeur } from '@/hooks/useLargeur';
import { Infobulle, TableauDeSecours } from './primitives';

/**
 * Trafic et demandes de devis, jour par jour.
 *
 * ── Deux cadres, pas deux axes ──────────────────────────────────────────
 * Le cahier des charges demande de « superposer » les demandes de devis à la
 * courbe de trafic. Superposer deux séries d'ordres de grandeur différents
 * (des centaines de visiteurs, une poignée de demandes) impose un second axe
 * vertical, et un graphique à deux axes se lit toujours mal : le point
 * d'intersection des deux courbes n'a aucun sens, et l'échelle du second axe
 * peut être choisie pour raconter à peu près n'importe quoi.
 *
 * On empile donc deux cadres alignés sur le même axe des dates. La lecture
 * visée par le cahier des charges — « on voit immédiatement l'effet d'une
 * publication Instagram » — est même plus nette ainsi : le pic du haut et le
 * pic du bas tombent sur la même verticale.
 *
 * Les jours de publication sont marqués d'un repère : sans eux, les pointes
 * passent pour du bruit.
 */

const MARGE = { haut: 14, droite: 14, bas: 26, gauche: 48 };
const H_TRAFIC = 172;
const ECART = 26;
const H_DEMANDES = 84;

/** Borne haute « ronde » : 1 240 → 1 500, 38 → 40. */
function borneHaute(valeur: number): number {
  if (valeur <= 0) return 1;
  const puissance = Math.pow(10, Math.floor(Math.log10(valeur)));
  return Math.ceil(valeur / (puissance / 2)) * (puissance / 2);
}

/** Barre à extrémité haute arrondie, ancrée sur la ligne de base. */
function barre(x: number, y: number, l: number, h: number, r = 4): string {
  const rayon = Math.min(r, l / 2, Math.max(0, h));
  return `M${x} ${y + h}V${y + rayon}a${rayon} ${rayon} 0 0 1 ${rayon} -${rayon}h${
    l - rayon * 2
  }a${rayon} ${rayon} 0 0 1 ${rayon} ${rayon}V${y + h}Z`;
}

export function CourbeTrafic({ points }: { points: PointTrafic[] }) {
  const [conteneur, largeur] = useLargeur<HTMLDivElement>();
  const [survol, setSurvol] = useState<number | null>(null);

  const hauteur = MARGE.haut + H_TRAFIC + ECART + H_DEMANDES + MARGE.bas;
  const utile = Math.max(120, largeur - MARGE.gauche - MARGE.droite);

  const g = useMemo(() => {
    const maxVisiteurs = borneHaute(Math.max(...points.map((p) => p.visiteurs)));
    const maxDemandes = borneHaute(Math.max(...points.map((p) => p.demandes)));

    const pas = points.length > 1 ? utile / (points.length - 1) : 0;
    const x = (i: number) => MARGE.gauche + i * pas;
    const yTrafic = (v: number) => MARGE.haut + H_TRAFIC - (v / maxVisiteurs) * H_TRAFIC;
    const baseDemandes = MARGE.haut + H_TRAFIC + ECART + H_DEMANDES;
    const yDemandes = (v: number) => baseDemandes - (v / maxDemandes) * H_DEMANDES;

    const trace = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)} ${yTrafic(p.visiteurs)}`).join('');
    const aire = `${trace}L${x(points.length - 1)} ${MARGE.haut + H_TRAFIC}L${x(0)} ${
      MARGE.haut + H_TRAFIC
    }Z`;

    // La cadence dépend de la largeur disponible, pas du nombre de points :
    // six dates tiennent sur un écran large, deux sur un téléphone. Compter
    // les points seulement, c'était empiler « 13 juil.18 juil. » en mobile.
    const place = Math.min(6, Math.max(2, Math.floor(utile / 76)));
    const cadence = Math.max(1, Math.ceil(points.length / place));
    const dates = points
      .map((p, i) => ({ ...p, i }))
      .filter(({ i }) => i % cadence === 0 || i === points.length - 1);

    return { maxVisiteurs, maxDemandes, pas, x, yTrafic, yDemandes, baseDemandes, trace, aire, dates };
  }, [points, utile]);

  const actif = survol === null ? null : points[survol];

  return (
    <div ref={conteneur} className="relative">
      <svg
        width={largeur}
        height={hauteur}
        role="img"
        aria-label={`Trafic quotidien et demandes de devis sur ${points.length} jours. Le détail chiffré est disponible dans le tableau sous la figure.`}
        className="block w-full overflow-visible"
        onMouseLeave={() => setSurvol(null)}
      >
        {/* Graduations horizontales — volontairement effacées */}
        {[0, 0.5, 1].map((t) => {
          const y = MARGE.haut + H_TRAFIC * t;
          return (
            <g key={t}>
              <line
                x1={MARGE.gauche}
                x2={largeur - MARGE.droite}
                y1={y}
                y2={y}
                stroke="var(--color-sable)"
                strokeOpacity={t === 1 ? 0.8 : 0.35}
              />
              <text
                x={MARGE.gauche - 10}
                y={y + 4}
                textAnchor="end"
                className="chiffres fill-pierre text-[11px]"
              >
                {nombreFr(g.maxVisiteurs * (1 - t))}
              </text>
            </g>
          );
        })}

        {/* Aire + trait du trafic */}
        <path d={g.aire} fill="var(--color-donnee-voile)" fillOpacity={0.55} />
        <path
          d={g.trace}
          fill="none"
          stroke="var(--color-donnee-400)"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Jours de publication Instagram */}
        {points.map((p, i) =>
          p.publication ? (
            <g key={`pub-${i}`}>
              <line
                x1={g.x(i)}
                x2={g.x(i)}
                y1={MARGE.haut}
                y2={g.baseDemandes}
                stroke="var(--color-sable)"
                strokeDasharray="2 4"
              />
              <circle
                cx={g.x(i)}
                cy={g.yTrafic(p.visiteurs)}
                r={4}
                fill="var(--color-donnee-600)"
                stroke="var(--color-blanc)"
                strokeWidth={2}
              />
            </g>
          ) : null,
        )}

        {/* Demandes de devis — cadre du bas, même axe des dates */}
        <line
          x1={MARGE.gauche}
          x2={largeur - MARGE.droite}
          y1={g.baseDemandes}
          y2={g.baseDemandes}
          stroke="var(--color-sable)"
          strokeOpacity={0.8}
        />
        <text
          x={MARGE.gauche - 10}
          y={g.yDemandes(g.maxDemandes) + 4}
          textAnchor="end"
          className="chiffres fill-pierre text-[11px]"
        >
          {nombreFr(g.maxDemandes)}
        </text>
        {points.map((p, i) => {
          const l = Math.max(3, Math.min(14, g.pas * 0.6));
          const y = g.yDemandes(p.demandes);
          return (
            <path
              key={`d-${i}`}
              d={barre(g.x(i) - l / 2, y, l, g.baseDemandes - y)}
              fill="var(--color-donnee-300)"
              fillOpacity={survol === null || survol === i ? 1 : 0.4}
            />
          );
        })}

        {/* Dates */}
        {g.dates.map((p) => (
          <text
            key={`x-${p.i}`}
            x={g.x(p.i)}
            y={hauteur - 8}
            textAnchor={p.i === 0 ? 'start' : p.i === points.length - 1 ? 'end' : 'middle'}
            className="fill-pierre text-[11px]"
          >
            {dateCourte(p.date)}
          </text>
        ))}

        {/* Ligne de visée */}
        {survol !== null && (
          <g pointerEvents="none">
            <line
              x1={g.x(survol)}
              x2={g.x(survol)}
              y1={MARGE.haut}
              y2={g.baseDemandes}
              stroke="var(--color-encre)"
              strokeOpacity={0.5}
            />
            <circle
              cx={g.x(survol)}
              cy={g.yTrafic(points[survol].visiteurs)}
              r={4.5}
              fill="var(--color-donnee-600)"
              stroke="var(--color-blanc)"
              strokeWidth={2}
            />
          </g>
        )}

        {/* Zones de saisie : plus larges que les marques, comme il se doit */}
        {points.map((p, i) => (
          <rect
            key={`z-${i}`}
            x={g.x(i) - g.pas / 2}
            y={MARGE.haut}
            width={Math.max(6, g.pas)}
            height={g.baseDemandes - MARGE.haut}
            fill="transparent"
            onMouseEnter={() => setSurvol(i)}
            onFocus={() => setSurvol(i)}
            tabIndex={-1}
          />
        ))}
      </svg>

      <Infobulle
        position={
          actif && largeur > 0
            ? {
                x: (g.x(survol!) / largeur) * 100,
                y: (g.yTrafic(actif.visiteurs) / hauteur) * 100,
                contenu: (
                  <>
                    <span className="block text-craie/60">{dateCourte(actif.date)}</span>
                    <span className="chiffres block">{nombreFr(actif.visiteurs)} visiteurs</span>
                    <span className="chiffres block">
                      {nombreFr(actif.demandes)} demande{actif.demandes > 1 ? 's' : ''} de devis
                    </span>
                    {actif.publication && (
                      <span className="mt-1 block max-w-56 border-t border-craie/25 pt-1 whitespace-normal text-craie/70">
                        Publication : {actif.publication}
                      </span>
                    )}
                  </>
                ),
              }
            : null
        }
      />

      <p className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-pierre">
        <span className="flex items-center gap-2">
          <span className="h-[2px] w-6 bg-donnee-400" aria-hidden />
          Visiteurs (cadre du haut)
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-2.5 bg-donnee-300" aria-hidden />
          Demandes de devis (cadre du bas)
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-donnee-600" aria-hidden />
          Jour de publication Instagram
        </span>
      </p>

      <TableauDeSecours
        legende="Voir le détail jour par jour"
        colonnes={['Jour', 'Visiteurs', 'Demandes', 'Publication']}
        lignes={points.map((p) => [
          dateCourte(p.date),
          nombreFr(p.visiteurs),
          nombreFr(p.demandes),
          p.publication ?? '—',
        ])}
      />
    </div>
  );
}
