'use client';

import { motion } from 'motion/react';
import type { Configuration } from '@/data/configurateur';
import { modeleParId } from '@/data/configurateur';

interface Props {
  config: Configuration;
  /** Couleurs issues du nuancier, appliquées aux volumes correspondants. */
  couleurStructure: string;
  couleurRevetement: string;
  couleurPietement: string;
}

/** Hauteur de la silhouette humaine, en centimètres. */
const TAILLE_HUMAINE = 170;
const MARGE = 40;
const SOL = 30;

/**
 * Élévation de face, dessinée à l'échelle réelle.
 *
 * Le repère du SVG est en centimètres : une largeur de 260 cm occupe
 * littéralement 260 unités. Les cotes, la silhouette humaine et le meuble
 * partagent donc le même système, et déplacer un curseur de dimension
 * déforme le dessin exactement dans la proportion annoncée.
 *
 * C'est un schéma, pas un rendu : il dit vrai sur les proportions, ce qu'un
 * visuel photographique retouché ne saurait pas faire.
 */
export function Silhouette({
  config,
  couleurStructure,
  couleurRevetement,
  couleurPietement,
}: Props) {
  const { largeur: L, hauteur: H } = config;
  const modele = modeleParId(config.type);

  const hauteurScene = Math.max(H, TAILLE_HUMAINE) + MARGE;
  const largeurScene = L + 130 + MARGE * 2;
  const sol = hauteurScene - SOL;
  const x0 = MARGE;
  const haut = sol - H;

  const tissu = modele.revetements ? couleurRevetement : couleurStructure;
  // Le SVG étant mis à l'échelle de la scène, une taille de police fixe
  // paraîtrait énorme sur une chaise et minuscule sur un dressing.
  const corps = Math.min(14, Math.max(7, largeurScene * 0.026));

  return (
    <svg
      viewBox={`0 0 ${largeurScene} ${hauteurScene}`}
      className="h-full w-full"
      role="img"
      aria-label={`Élévation de face — ${modele.nom} de ${L} cm de large sur ${H} cm de haut`}
    >
      {/* Sol */}
      <line
        x1={0}
        y1={sol}
        x2={largeurScene}
        y2={sol}
        stroke="var(--color-sable)"
        strokeWidth={1}
      />

      {/* Silhouette humaine, repère d'échelle */}
      <Humain x={x0 + L + 70} sol={sol} corps={corps} />

      <motion.g
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Meuble
          config={config}
          x0={x0}
          sol={sol}
          haut={haut}
          tissu={tissu}
          structure={couleurStructure}
          pietement={couleurPietement}
        />
      </motion.g>

      {/* Cotes — la ligne est interrompue là où s'inscrit la mesure, plutôt
          que masquée par un halo : le rendu est identique dans un navigateur,
          dans un export PDF ou dans une capture serveur. */}
      <Cote
        orientation="horizontale"
        de={x0}
        a={x0 + L}
        axe={sol + 9}
        libelle={`${L} cm`}
        corps={corps}
      />
      <Cote
        orientation="verticale"
        de={haut}
        a={sol}
        axe={x0 - 13}
        libelle={`${H} cm`}
        corps={corps}
      />
    </svg>
  );
}

/** Cote avec extrémités, interrompue au centre pour laisser place à la mesure. */
function Cote({
  orientation,
  de,
  a,
  axe,
  libelle,
  corps,
}: {
  orientation: 'horizontale' | 'verticale';
  de: number;
  a: number;
  axe: number;
  libelle: string;
  corps: number;
}) {
  const milieu = (de + a) / 2;
  const demiGap = (libelle.length * corps * 0.32) / 2 + corps * 0.3;
  const trait = { stroke: 'var(--color-pierre)', strokeWidth: 0.8, fill: 'none' as const };
  const horizontal = orientation === 'horizontale';

  return (
    <g>
      {horizontal ? (
        <g {...trait}>
          <line x1={de} y1={axe} x2={milieu - demiGap} y2={axe} />
          <line x1={milieu + demiGap} y1={axe} x2={a} y2={axe} />
          <line x1={de} y1={axe - 4} x2={de} y2={axe + 4} />
          <line x1={a} y1={axe - 4} x2={a} y2={axe + 4} />
        </g>
      ) : (
        <g {...trait}>
          <line x1={axe} y1={de} x2={axe} y2={milieu - demiGap} />
          <line x1={axe} y1={milieu + demiGap} x2={axe} y2={a} />
          <line x1={axe - 4} y1={de} x2={axe + 4} y2={de} />
          <line x1={axe - 4} y1={a} x2={axe + 4} y2={a} />
        </g>
      )}

      <text
        x={horizontal ? milieu : axe}
        y={horizontal ? axe : milieu}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--color-fumee)"
        fontSize={corps}
        transform={horizontal ? undefined : `rotate(-90 ${axe} ${milieu})`}
      >
        {libelle}
      </text>
    </g>
  );
}

/* ── Volumes par typologie ───────────────────────────────────────────── */

interface MeubleProps {
  config: Configuration;
  x0: number;
  sol: number;
  haut: number;
  tissu: string;
  structure: string;
  pietement: string;
}

function Meuble({ config, x0, sol, haut, tissu, structure, pietement }: MeubleProps) {
  const { type, largeur: L, hauteur: H } = config;
  const trait = { stroke: 'var(--color-encre)', strokeOpacity: 0.18, strokeWidth: 0.8 };

  switch (type) {
    case 'canape':
    case 'fauteuil': {
      const socle = 6;
      const assise = H * 0.46;
      const bras = Math.min(24, L * 0.11);
      const coussins = Math.max(2, Math.round((L - bras * 2) / 90));
      return (
        <g {...trait}>
          {/* Dossier */}
          <rect x={x0} y={haut} width={L} height={H - assise} rx={6} fill={tissu} />
          {/* Assise */}
          <rect
            x={x0}
            y={sol - assise}
            width={L}
            height={assise - socle}
            rx={5}
            fill={tissu}
            fillOpacity={0.88}
          />
          {/* Séparations de coussins */}
          {Array.from({ length: coussins - 1 }, (_, i) => {
            const x = x0 + bras + ((L - bras * 2) / coussins) * (i + 1);
            return <line key={i} x1={x} y1={sol - assise + 3} x2={x} y2={sol - socle - 3} />;
          })}
          {/* Accoudoirs */}
          <rect x={x0} y={haut + (H - assise) * 0.3} width={bras} height={H - (H - assise) * 0.3 - socle} rx={5} fill={tissu} fillOpacity={0.95} />
          <rect x={x0 + L - bras} y={haut + (H - assise) * 0.3} width={bras} height={H - (H - assise) * 0.3 - socle} rx={5} fill={tissu} fillOpacity={0.95} />
          {/* Socle */}
          <rect x={x0 + 5} y={sol - socle} width={L - 10} height={socle} fill={pietement} />
        </g>
      );
    }

    case 'chaise': {
      const assise = H * 0.6;
      const pied = 3;
      return (
        <g {...trait}>
          <rect x={x0 + 3} y={haut} width={L - 6} height={H - assise - 4} rx={7} fill={tissu} />
          <rect x={x0} y={sol - assise} width={L} height={7} rx={3} fill={tissu} fillOpacity={0.9} />
          {[x0 + 2, x0 + L - 2 - pied].map((x) => (
            <rect key={x} x={x} y={sol - assise + 7} width={pied} height={assise - 7} fill={pietement} />
          ))}
        </g>
      );
    }

    case 'table': {
      const plateau = 4;
      const futL = Math.max(18, L * 0.14);
      return (
        <g {...trait}>
          <rect x={x0} y={haut} width={L} height={plateau} rx={2} fill={structure} />
          <path
            d={`M ${x0 + L / 2 - futL / 2} ${haut + plateau}
                L ${x0 + L / 2 + futL / 2} ${haut + plateau}
                L ${x0 + L / 2 + futL} ${sol - 2}
                L ${x0 + L / 2 - futL} ${sol - 2} Z`}
            fill={structure}
            fillOpacity={0.92}
          />
          <ellipse cx={x0 + L / 2} cy={sol - 2} rx={futL * 1.05} ry={2.5} fill={pietement} />
        </g>
      );
    }

    case 'dressing':
    case 'bibliotheque': {
      const portes = Math.max(2, Math.round(L / 90));
      const etageres = Math.max(3, Math.round(H / 45));
      const ouvert = type === 'bibliotheque';
      return (
        <g {...trait}>
          <rect x={x0} y={haut} width={L} height={H} rx={2} fill={structure} fillOpacity={ouvert ? 0.35 : 1} />
          <rect x={x0} y={haut} width={L} height={H} rx={2} fill="none" stroke="var(--color-encre)" strokeOpacity={0.25} />
          {Array.from({ length: portes - 1 }, (_, i) => {
            const x = x0 + (L / portes) * (i + 1);
            return <line key={`v${i}`} x1={x} y1={haut} x2={x} y2={sol} />;
          })}
          {ouvert &&
            Array.from({ length: etageres - 1 }, (_, i) => {
              const y = haut + (H / etageres) * (i + 1);
              return <line key={`h${i}`} x1={x0} y1={y} x2={x0 + L} y2={y} />;
            })}
          {!ouvert &&
            Array.from({ length: portes }, (_, i) => {
              const x = x0 + (L / portes) * (i + 0.5);
              return (
                <rect key={`p${i}`} x={x - 1} y={haut + H * 0.45} width={2} height={H * 0.1} fill={pietement} />
              );
            })}
        </g>
      );
    }

    case 'tete-de-lit': {
      const cannelures = Math.max(4, Math.round(L / 22));
      return (
        <g {...trait}>
          <rect x={x0} y={haut} width={L} height={H} rx={4} fill={tissu} />
          {Array.from({ length: cannelures - 1 }, (_, i) => {
            const x = x0 + (L / cannelures) * (i + 1);
            return <line key={i} x1={x} y1={haut + 4} x2={x} y2={sol - 4} />;
          })}
          <rect x={x0 + 8} y={sol - 26} width={L - 16} height={26} rx={3} fill="var(--color-craie)" />
        </g>
      );
    }

    case 'meuble-tv': {
      const portes = Math.max(2, Math.round(L / 110));
      return (
        <g {...trait}>
          <rect x={x0} y={haut} width={L} height={H - 4} rx={2} fill={structure} />
          {Array.from({ length: portes - 1 }, (_, i) => {
            const x = x0 + (L / portes) * (i + 1);
            return <line key={i} x1={x} y1={haut} x2={x} y2={sol - 4} />;
          })}
          <rect x={x0 + 6} y={sol - 4} width={L - 12} height={4} fill={pietement} />
        </g>
      );
    }
  }
}

/** Silhouette de 170 cm : donne instantanément l'échelle réelle. */
function Humain({ x, sol, corps }: { x: number; sol: number; corps: number }) {
  const h = TAILLE_HUMAINE;
  const c = 'var(--color-sable)';
  return (
    <g fill={c} opacity={0.75} aria-hidden>
      <circle cx={x} cy={sol - h + 11} r={11} />
      <rect x={x - 13} y={sol - h + 24} width={26} height={h * 0.42} rx={11} />
      <rect x={x - 11} y={sol - h + 24 + h * 0.42 - 4} width={9} height={h * 0.5} rx={4.5} />
      <rect x={x + 2} y={sol - h + 24 + h * 0.42 - 4} width={9} height={h * 0.5} rx={4.5} />
      <text x={x} y={sol + 20} textAnchor="middle" fontSize={corps * 0.85} fill="var(--color-pierre)">
        170 cm
      </text>
    </g>
  );
}
