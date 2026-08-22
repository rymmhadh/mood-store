import localFont from 'next/font/local';

/**
 * Jost — géométrique proche du Futura utilisé par les maisons de mobilier
 * haut de gamme.
 *
 * La police est **auto-hébergée** : les fichiers woff2 sont versionnés dans
 * `src/fonts/`. C'est volontaire, et pas seulement pour la performance :
 *
 *  · aucun appel à fonts.googleapis.com — le site fonctionne derrière un
 *    réseau filtré, en local et hors ligne ;
 *  · aucune dépendance réseau au build (`next build` ne peut pas échouer
 *    parce que Google est injoignable) ;
 *  · aucune donnée visiteur transmise à un tiers (RGPD).
 *
 * Sous-ensemble latin uniquement, six graisses, 72 ko au total.
 */
export const jost = localFont({
  src: [
    { path: '../fonts/Jost-200.woff2', weight: '200', style: 'normal' },
    { path: '../fonts/Jost-300.woff2', weight: '300', style: 'normal' },
    { path: '../fonts/Jost-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Jost-500.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/Jost-600.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/Jost-700.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-jost',
  // Métriques de repli : évite tout décalage de mise en page au chargement
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
});
