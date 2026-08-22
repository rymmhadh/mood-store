import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

/** Même grammaire que le jeu du site : trait de 1,25 px, extrémités rondes. */
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
};

export const IconeTableauBord = (p: Props) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" />
    <rect x="13.5" y="3.5" width="7" height="4" />
    <rect x="13.5" y="10.5" width="7" height="10" />
    <rect x="3.5" y="13.5" width="7" height="7" />
  </svg>
);

export const IconeCatalogue = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M4 5.5h6.5a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 0-1.5-1.5H4Z" />
    <path d="M20 5.5h-6.5A1.5 1.5 0 0 0 12 7v12a1.5 1.5 0 0 1 1.5-1.5H20Z" />
  </svg>
);

export const IconeContenu = (p: Props) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" />
    <path d="M3.5 9.5h17M9 9.5V19.5" />
  </svg>
);

export const IconeDemandes = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M4 6.5h16v11H9l-5 3.5v-3.5H4Z" />
    <path d="M8.5 10.5h7M8.5 13.5h4" />
  </svg>
);

export const IconeClients = (p: Props) => (
  <svg {...base} {...p}>
    <circle cx="9.5" cy="8.5" r="3" />
    <path d="M3.5 19c0-3.1 2.7-5.5 6-5.5s6 2.4 6 5.5" />
    <path d="M16 6.2a3 3 0 0 1 0 5.6M17.5 19c0-2.2-.8-3.9-2-5" />
  </svg>
);

export const IconeStatistiques = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M4 20V4M4 20h16" />
    <path d="M8 20v-6M12.7 20V9M17.3 20v-9.5" />
  </svg>
);

export const IconeReglages = (p: Props) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6" />
  </svg>
);

export const IconeAlerte = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M12 4.5 21 19.5H3Z" />
    <path d="M12 10v4M12 16.6v.4" />
  </svg>
);

export const IconeRafraichir = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M20 12a8 8 0 1 1-2.5-5.8" />
    <path d="M20 4v4h-4" />
  </svg>
);

export const IconeHausse = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M4 17 10 11l3.5 3.5L20 8" />
    <path d="M20 13V8h-5" />
  </svg>
);

export const IconeBaisse = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M4 8l6 6 3.5-3.5L20 17" />
    <path d="M20 12v5h-5" />
  </svg>
);

export const IconeCalendrier = (p: Props) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="5.5" width="17" height="15" />
    <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
  </svg>
);

export const IconeEchantillon = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M9.5 3.5v10.2a3.5 3.5 0 1 0 5 0V3.5Z" />
    <path d="M9.5 3.5h5M9 13.7h6" />
  </svg>
);

export const IconeCurseurs = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
    <circle cx="9" cy="7" r="2" />
    <circle cx="15" cy="12" r="2" />
    <circle cx="7.5" cy="17" r="2" />
  </svg>
);
