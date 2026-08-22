import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement>;

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
};

export const IconeMenu = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M3 7h18M3 12h18M3 17h18" />
  </svg>
);

export const IconeRecherche = (p: Props) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const IconeCoeur = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M12 20s-7-4.35-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 4.65-7 9-7 9Z" />
  </svg>
);

export const IconeCompte = (p: Props) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c0-3.5 3.13-6 7-6s7 2.5 7 6" />
  </svg>
);

export const IconeFermer = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconeChevron = (p: Props) => (
  <svg {...base} {...p}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const IconeFleche = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M4 12h15m0 0-6-6m6 6-6 6" />
  </svg>
);

export const IconeFlecheHaut = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M12 19V5m0 0-6 6m6-6 6 6" />
  </svg>
);

export const IconeLieu = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const IconeInstagram = (p: Props) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="3.75" />
    <circle cx="17" cy="7" r="0.75" fill="currentColor" />
  </svg>
);

export const IconeFacebook = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M14.5 8.5h2.5M14.5 21V12m0 0V9.5A2.5 2.5 0 0 1 17 7h1M14.5 12h-2.5" />
  </svg>
);

export const IconePinterest = (p: Props) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10 19c-.5-1.5 0-3 .5-5 .5-2 .8-3.5 2.5-3.5 1.4 0 2 1.1 2 2.4 0 1.7-1 3.1-2.3 3.1-.8 0-1.4-.6-1.2-1.4" />
  </svg>
);

export const IconeWhatsApp = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M20 12a8 8 0 0 1-11.9 7L4 20l1.1-3.9A8 8 0 1 1 20 12Z" />
    <path d="M9.4 9.2c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.6 1.4c.1.2 0 .4-.1.6l-.4.4c-.1.2-.2.3 0 .6.3.5 1.1 1.4 2 1.8.3.1.5.1.6 0l.5-.5c.2-.2.4-.2.6-.1l1.3.7c.3.1.4.3.4.5v.4c0 .3-.3.9-1.1 1-.6.1-1.4.1-3-.6-2.2-1-3.6-3.2-3.7-3.4-.1-.2-.9-1.2-.9-2.3 0-1 .5-1.5.7-1.7Z" />
  </svg>
);

export const IconeGlisser = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M8 8 4 12l4 4M16 8l4 4-4 4M12 4v16" />
  </svg>
);

export const IconePartage = (p: Props) => (
  <svg {...base} {...p}>
    <circle cx="17" cy="6" r="2.5" />
    <circle cx="6" cy="12" r="2.5" />
    <circle cx="17" cy="18" r="2.5" />
    <path d="m8.3 10.8 6.4-3.6M8.3 13.2l6.4 3.6" />
  </svg>
);

export const IconeTelecharger = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14" />
  </svg>
);

export const IconeLecture = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconePause = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M9 5v14M15 5v14" strokeWidth={2} />
  </svg>
);

export const IconeSon = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
    <path d="M15 9.5a3.5 3.5 0 0 1 0 5M17.5 7a7 7 0 0 1 0 10" />
  </svg>
);

export const IconeSonCoupe = (p: Props) => (
  <svg {...base} {...p}>
    <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
    <path d="m16 10 4 4m0-4-4 4" />
  </svg>
);
