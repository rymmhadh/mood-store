import { PRODUITS } from '@/data/catalogue';
import type {
  Alerte,
  DonneesTableauDeBord,
  EtapeEntonnoir,
  Evenement,
  Indicateur,
  MesureGouvernorat,
  MesureProduit,
  PartSource,
  Periode,
  PointTrafic,
  RechercheVide,
} from '@/types/admin';
import { joursDe } from '@/types/admin';

/**
 * Générateur du tableau de bord (§19.3).
 *
 * ── Pourquoi des chiffres simulés ────────────────────────────────────────
 * Le back NestJS n'existe pas encore. Plutôt qu'un écran vide ou un jeu de
 * données figé, on produit ici des séries **plausibles** — saisonnalité de
 * semaine, pics après publication Instagram, entonnoir qui se resserre — pour
 * que la maquette se juge sur ce qu'elle donnera en production.
 *
 * ── Pourquoi déterministe ───────────────────────────────────────────────
 * Aucun `Math.random()`. Le serveur et le navigateur doivent produire la même
 * valeur au même instant, sinon React signale une divergence d'hydratation.
 * Toute la variabilité vient d'un générateur pseudo-aléatoire ensemencé par
 * le numéro du jour : les chiffres sont stables toute la journée et changent
 * à minuit, comme de vraies statistiques quotidiennes.
 *
 * ── Bascule vers l'API ──────────────────────────────────────────────────
 * Les deux fonctions exportées ont la signature des futurs services :
 *   construireTableauDeBord(periode) → GET /api/admin/tableau-de-bord
 *   construireFluxActivite(n)        → GET /api/admin/activite
 * Il suffira de remplacer leur corps par une requête SQL.
 */

/* ── Aléatoire reproductible ──────────────────────────────────────────── */

/** Mulberry32 : petit, rapide, suffisant pour de la donnée d'affichage. */
function generateur(graine: number) {
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Numéro du jour depuis l'époque : change à minuit UTC, jamais entre deux rendus. */
const jourCourant = () => Math.floor(Date.now() / 86_400_000);

/** Mélange une chaîne dans la graine du jour. */
function graine(cle: string, decalage = 0): number {
  let h = 2166136261 ^ (jourCourant() + decalage);
  for (let i = 0; i < cle.length; i++) {
    h ^= cle.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* ── Mise en forme (identique serveur et client) ──────────────────────── */

/**
 * Espace fine insécable en séparateur de milliers.
 *
 * `Intl.NumberFormat` n'est pas utilisé volontairement : la version d'ICU de
 * Node et celle du navigateur ne choisissent pas toujours le même caractère
 * d'espacement, ce qui suffit à déclencher un avertissement d'hydratation.
 */
export const nombreFr = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export const MOIS_COURTS = [
  'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
];

/** « 14 mars ». Aucune dépendance à la locale du moteur. */
export function dateCourte(iso: string): string {
  const [, m, j] = iso.split('-');
  return `${Number(j)} ${MOIS_COURTS[Number(m) - 1]}`;
}

/** « 8 min », « 2 h », « 3 j » — calculé côté client uniquement. */
export function ilYa(iso: string, maintenant: number): string {
  const minutes = Math.max(0, Math.round((maintenant - Date.parse(iso)) / 60_000));
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const heures = Math.round(minutes / 60);
  if (heures < 24) return `il y a ${heures} h`;
  return `il y a ${Math.round(heures / 24)} j`;
}

/** Heure absolue « 14:32 » — sert de repli avant hydratation. */
export function heureCourte(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCHours().toString().padStart(2, '0')}:${d
    .getUTCMinutes()
    .toString()
    .padStart(2, '0')}`;
}

/* ── Hypothèses métier ────────────────────────────────────────────────── */

/** Fréquentation moyenne un mardi ordinaire, hors publication. */
const VISITEURS_BASE = 340;

/** Lun→Dim. Le week-end tunisien pèse : on regarde des meubles le samedi. */
const SAISON_SEMAINE = [0.94, 1.0, 1.02, 1.06, 1.14, 1.28, 0.82];

/** Panier moyen d'un devis signé, en dinars. */
const VALEUR_DEVIS = 8_400;

const VILLES = [
  'Tunis', 'Ariana', 'La Marsa', 'Sousse', 'Sfax', 'Nabeul',
  'Hammamet', 'Ben Arous', 'Monastir', 'Bizerte', 'La Soukra', 'Gammarth',
];

/**
 * Coefficient de transformation propre à chaque pièce.
 *
 * C'est le cœur du §19.3 : l'écart entre « très vu » et « très demandé ».
 * Une valeur basse signale une fiche qui attire mais ne convertit pas —
 * photo, prix ou description à revoir.
 */
const TRANSFORMATION: Record<string, number> = {
  mouton: 0.24,   // pièce signature : elle fait venir, elle ne fait pas vendre
  grenat: 0.38,   // très vue, peu demandée — fiche à retravailler
  bulle: 1.32,
  horizon: 1.18,
  onde: 1.24,
  sillage: 0.92,
  rivage: 1.05,
  trait: 0.86,
  perle: 1.41,
  onyx: 1.22,
  ovale: 0.79,
  albe: 1.12,
  nuage: 1.35,
  rive: 0.68,
};

const GOUVERNORATS: Omit<MesureGouvernorat, 'visiteurs'>[] = [
  { code: 'tunis', nom: 'Tunis', latitude: 36.8, longitude: 10.18 },
  { code: 'ariana', nom: 'Ariana', latitude: 36.9, longitude: 10.19 },
  { code: 'ben-arous', nom: 'Ben Arous', latitude: 36.68, longitude: 10.23 },
  { code: 'manouba', nom: 'Manouba', latitude: 36.81, longitude: 10.1 },
  { code: 'nabeul', nom: 'Nabeul', latitude: 36.45, longitude: 10.74 },
  { code: 'bizerte', nom: 'Bizerte', latitude: 37.27, longitude: 9.87 },
  { code: 'zaghouan', nom: 'Zaghouan', latitude: 36.4, longitude: 10.14 },
  { code: 'beja', nom: 'Béja', latitude: 36.73, longitude: 9.18 },
  { code: 'jendouba', nom: 'Jendouba', latitude: 36.5, longitude: 8.78 },
  { code: 'kef', nom: 'Le Kef', latitude: 36.17, longitude: 8.71 },
  { code: 'siliana', nom: 'Siliana', latitude: 36.08, longitude: 9.37 },
  { code: 'sousse', nom: 'Sousse', latitude: 35.83, longitude: 10.64 },
  { code: 'monastir', nom: 'Monastir', latitude: 35.78, longitude: 10.83 },
  { code: 'mahdia', nom: 'Mahdia', latitude: 35.5, longitude: 11.06 },
  { code: 'kairouan', nom: 'Kairouan', latitude: 35.68, longitude: 10.1 },
  { code: 'kasserine', nom: 'Kasserine', latitude: 35.17, longitude: 8.83 },
  { code: 'sidi-bouzid', nom: 'Sidi Bouzid', latitude: 35.04, longitude: 9.48 },
  { code: 'sfax', nom: 'Sfax', latitude: 34.74, longitude: 10.76 },
  { code: 'gafsa', nom: 'Gafsa', latitude: 34.42, longitude: 8.78 },
  { code: 'tozeur', nom: 'Tozeur', latitude: 33.92, longitude: 8.14 },
  { code: 'kebili', nom: 'Kébili', latitude: 33.7, longitude: 8.97 },
  { code: 'gabes', nom: 'Gabès', latitude: 33.88, longitude: 10.1 },
  { code: 'medenine', nom: 'Médenine', latitude: 33.35, longitude: 10.5 },
  { code: 'tataouine', nom: 'Tataouine', latitude: 32.93, longitude: 10.45 },
];

/** Poids de population/pouvoir d'achat : sert d'ossature à la carte. */
const POIDS_GOUVERNORAT: Record<string, number> = {
  tunis: 100, ariana: 74, 'ben-arous': 52, manouba: 21, nabeul: 46, bizerte: 19,
  zaghouan: 7, beja: 6, jendouba: 5, kef: 4, siliana: 3, sousse: 58,
  monastir: 31, mahdia: 12, kairouan: 11, kasserine: 4, 'sidi-bouzid': 4,
  sfax: 49, gafsa: 6, tozeur: 3, kebili: 3, gabes: 9, medenine: 8, tataouine: 3,
};

const TERMES_SANS_RESULTAT = [
  'cuisine équipée', 'meuble tv', 'canapé convertible', 'matelas',
  'papier peint', 'verrière atelier', 'bureau direction', 'porte intérieure',
  'salon de jardin', 'escalier bois', 'store enrouleur', 'parquet',
];

/* ── Séries ───────────────────────────────────────────────────────────── */

/**
 * Courbe de trafic sur la période, avec les demandes de devis du même jour.
 *
 * Les pics d'audience ne sont pas du bruit : ils correspondent aux jours de
 * publication Instagram, avec une traîne de deux jours. C'est précisément ce
 * que le cahier des charges demande de rendre lisible.
 */
function construireTrafic(periode: Periode): PointTrafic[] {
  const jours = joursDe(periode);
  const alea = generateur(graine('trafic'));
  const points: PointTrafic[] = [];

  // Jours de publication : environ deux par semaine, tirés une fois pour toutes.
  const publications = new Map<number, string>();
  const sujets = [
    'Canapé Onde en bouclé écru',
    'Chantier livré — villa Gammarth',
    'Coulisses de l’atelier',
    'Table Onyx, plateau marbre',
    'Le Mouton, série limitée',
    'Dressing sur mesure — La Marsa',
    'Nouveau nuancier de velours',
  ];
  for (let d = 0; d < jours; d++) {
    if (alea() < 0.28) publications.set(d, sujets[Math.floor(alea() * sujets.length)]);
  }

  const aujourdHui = new Date();
  aujourdHui.setUTCHours(0, 0, 0, 0);

  for (let d = 0; d < jours; d++) {
    const date = new Date(aujourdHui);
    date.setUTCDate(date.getUTCDate() - (jours - 1 - d));
    const iso = date.toISOString().slice(0, 10);
    const jourSemaine = (date.getUTCDay() + 6) % 7;

    // Tendance de fond : légère croissance sur la fenêtre observée.
    const tendance = 1 + (d / jours) * 0.18;

    // Effet d'une publication, amorti sur deux jours.
    let poussee = 1;
    for (let r = 0; r <= 2; r++) {
      if (publications.has(d - r)) poussee = Math.max(poussee, 1 + [0.95, 0.42, 0.16][r]);
    }

    const bruit = 0.88 + alea() * 0.24;
    const visiteurs = Math.round(
      VISITEURS_BASE * SAISON_SEMAINE[jourSemaine] * tendance * poussee * bruit,
    );

    // Le taux de demande monte les jours de forte affluence : un visiteur venu
    // d'une publication est déjà intéressé par une pièce précise.
    const taux = (0.026 + (poussee - 1) * 0.012) * (0.85 + alea() * 0.3);

    points.push({
      date: iso,
      visiteurs,
      demandes: Math.max(0, Math.round(visiteurs * taux)),
      ...(publications.has(d) ? { publication: publications.get(d) } : {}),
    });
  }

  return points;
}

/** Entonnoir de conversion, calé sur le volume réel de la période. */
function construireEntonnoir(trafic: PointTrafic[]): EtapeEntonnoir[] {
  const visites = trafic.reduce((s, p) => s + p.visiteurs, 0);
  const demandes = trafic.reduce((s, p) => s + p.demandes, 0);
  const alea = generateur(graine('entonnoir'));

  const fiches = Math.round(visites * (0.44 + alea() * 0.05));
  const engages = Math.round(fiches * (0.29 + alea() * 0.04));

  // Toutes les demandes ne donnent pas lieu à un chiffrage : beaucoup sont des
  // questions de délai, de livraison ou de disponibilité. Et un devis de
  // mobilier sur mesure se signe rarement du premier coup — d'où un taux
  // d'acceptation volontairement bas. Une vingtaine de projets signés par
  // mois, c'est l'ordre de grandeur d'un atelier de deux showrooms.
  const envoyes = Math.round(demandes * (0.5 + alea() * 0.1));
  const acceptes = Math.round(envoyes * (0.09 + alea() * 0.04));

  return [
    { id: 'visite', libelle: 'Visite du site', valeur: visites, aide: 'Sessions uniques sur la période.' },
    { id: 'fiche', libelle: 'Pièce consultée', valeur: fiches, aide: 'Au moins une fiche produit ouverte en détail.' },
    { id: 'engagement', libelle: 'Projet commencé', valeur: engages, aide: 'Configurateur ouvert ou formulaire de devis entamé.' },
    { id: 'demande', libelle: 'Demande envoyée', valeur: demandes, aide: 'Formulaire complété, coordonnées laissées.' },
    { id: 'devis', libelle: 'Devis transmis', valeur: envoyes, aide: 'Chiffrage envoyé par l’atelier.' },
    { id: 'signe', libelle: 'Devis accepté', valeur: acceptes, aide: 'Bon pour accord reçu.' },
  ];
}

/** Vues et demandes par pièce du catalogue. */
function construireProduits(trafic: PointTrafic[]): MesureProduit[] {
  const alea = generateur(graine('produits'));
  const fiches = trafic.reduce((s, p) => s + p.visiteurs, 0) * 0.46;

  // Répartition en loi de puissance : quelques pièces concentrent l'attention.
  const bruts = PRODUITS.map((p, i) => ({
    produit: p,
    poids: (1 / Math.pow(i + 1.6, 0.72)) * (0.78 + alea() * 0.44),
  }));
  const total = bruts.reduce((s, b) => s + b.poids, 0);

  return bruts
    .map(({ produit, poids }) => {
      const vues = Math.round((poids / total) * fiches);
      const coefficient = TRANSFORMATION[produit.slug] ?? 1;
      return {
        slug: produit.slug,
        nom: produit.nom,
        type: produit.type,
        collection: produit.collection,
        vues,
        demandes: Math.max(1, Math.round(vues * 0.052 * coefficient)),
      };
    })
    .sort((a, b) => b.vues - a.vues);
}

/**
 * Sources d'acquisition.
 *
 * Instagram domine, c'est le constat de départ du projet : l'audience est
 * chez Meta et le site sert à la rapatrier.
 */
function construireSources(trafic: PointTrafic[]): PartSource[] {
  const visites = trafic.reduce((s, p) => s + p.visiteurs, 0);
  const alea = generateur(graine('sources'));
  const parts = [
    { id: 'instagram', libelle: 'Instagram', base: 0.54 },
    { id: 'google', libelle: 'Recherche Google', base: 0.22 },
    { id: 'direct', libelle: 'Accès direct', base: 0.13 },
    { id: 'whatsapp', libelle: 'WhatsApp', base: 0.07 },
    { id: 'autres', libelle: 'Autres sites', base: 0.04 },
  ];
  const bruites = parts.map((p) => ({ ...p, base: p.base * (0.92 + alea() * 0.16) }));
  const somme = bruites.reduce((s, p) => s + p.base, 0);

  return bruites
    .map((p) => ({ id: p.id, libelle: p.libelle, visiteurs: Math.round((p.base / somme) * visites) }))
    .sort((a, b) => b.visiteurs - a.visiteurs);
}

/** Provenance géographique, par gouvernorat. */
function construireGouvernorats(trafic: PointTrafic[]): MesureGouvernorat[] {
  const visites = trafic.reduce((s, p) => s + p.visiteurs, 0);
  const alea = generateur(graine('geo'));
  const bruits = GOUVERNORATS.map((g) => ({
    ...g,
    poids: POIDS_GOUVERNORAT[g.code] * (0.85 + alea() * 0.3),
  }));
  const total = bruits.reduce((s, g) => s + g.poids, 0);

  return bruits
    .map(({ poids, ...g }) => ({ ...g, visiteurs: Math.round((poids / total) * visites) }))
    .sort((a, b) => b.visiteurs - a.visiteurs);
}

/** Requêtes internes restées sans résultat : la demande non satisfaite. */
function construireRecherchesVides(periode: Periode): RechercheVide[] {
  const alea = generateur(graine('recherche'));
  const echelle = joursDe(periode) / 30;
  return TERMES_SANS_RESULTAT.map((terme, i) => ({
    terme,
    occurrences: Math.max(1, Math.round((34 - i * 2.4) * echelle * (0.75 + alea() * 0.5))),
  }))
    .sort((a, b) => b.occurrences - a.occurrences)
    .slice(0, 8);
}

/* ── Bandeau, alertes, activité ───────────────────────────────────────── */

function construireIndicateurs(
  periode: Periode,
  trafic: PointTrafic[],
  entonnoir: EtapeEntonnoir[],
  produits: MesureProduit[],
): Indicateur[] {
  const alea = generateur(graine('indicateurs'));
  const jours = joursDe(periode);

  const aujourdHui = trafic[trafic.length - 1];
  const sept = trafic.slice(-7);
  const septPrecedents = trafic.slice(-14, -7);

  const somme = (l: PointTrafic[], c: 'visiteurs' | 'demandes') =>
    l.reduce((s, p) => s + p[c], 0);

  const ecart = (a: number, b: number) => (b === 0 ? null : Math.round(((a - b) / b) * 1000) / 10);

  const demandesEnAttente = Math.round(4 + alea() * 6);
  const rdvAujourdHui = Math.round(1 + alea() * 3);
  const rdvSemaine = rdvAujourdHui + Math.round(3 + alea() * 5);

  const visitesTotal = somme(trafic, 'visiteurs');
  const demandesTotal = somme(trafic, 'demandes');
  const tauxConversion = Math.round((demandesTotal / visitesTotal) * 1000) / 10;

  const configurations = Math.round(demandesTotal * (2.1 + alea() * 0.5));
  const aboutissement = Math.round((demandesTotal / configurations) * 1000) / 10;

  const signes = entonnoir[entonnoir.length - 1].valeur;
  const chiffreAffaires = Math.round(signes * VALEUR_DEVIS * (0.9 + alea() * 0.25));

  const meilleur = [...produits].sort((a, b) => b.demandes - a.demandes)[0];

  return [
    {
      id: 'devis',
      libelle: 'Demandes de devis',
      valeur: nombreFr(aujourdHui.demandes),
      details: [
        { libelle: 'En attente de réponse', valeur: nombreFr(demandesEnAttente) },
        { libelle: `Sur ${jours} jours`, valeur: nombreFr(demandesTotal) },
      ],
      variation: ecart(somme(sept, 'demandes'), somme(septPrecedents, 'demandes')),
      hausseSouhaitee: true,
      href: '/admin/demandes',
    },
    {
      id: 'rendez-vous',
      libelle: 'Rendez-vous showroom',
      valeur: nombreFr(rdvAujourdHui),
      details: [
        { libelle: 'Cette semaine', valeur: nombreFr(rdvSemaine) },
        { libelle: 'À confirmer', valeur: nombreFr(Math.round(1 + alea() * 2)) },
      ],
      variation: Math.round((alea() * 40 - 12) * 10) / 10,
      hausseSouhaitee: true,
      href: '/admin/demandes/rendez-vous',
    },
    {
      id: 'visiteurs',
      libelle: 'Visiteurs',
      valeur: nombreFr(aujourdHui.visiteurs),
      details: [
        { libelle: '7 jours', valeur: nombreFr(somme(sept, 'visiteurs')) },
        { libelle: `${jours} jours`, valeur: nombreFr(visitesTotal) },
      ],
      variation: ecart(somme(sept, 'visiteurs'), somme(septPrecedents, 'visiteurs')),
      hausseSouhaitee: true,
      href: '/admin/statistiques',
    },
    {
      id: 'conversion',
      libelle: 'Taux de conversion',
      valeur: `${tauxConversion.toString().replace('.', ',')} %`,
      details: [
        { libelle: 'Demandes / visiteurs', valeur: `${nombreFr(demandesTotal)} / ${nombreFr(visitesTotal)}` },
        { libelle: 'Pièce la plus demandée', valeur: meilleur.nom },
      ],
      variation: Math.round((alea() * 24 - 8) * 10) / 10,
      hausseSouhaitee: true,
      href: '/admin/statistiques/conversion',
    },
    {
      id: 'configurations',
      libelle: 'Configurations créées',
      valeur: nombreFr(configurations),
      details: [
        { libelle: 'Abouties en devis', valeur: `${aboutissement.toString().replace('.', ',')} %` },
        { libelle: 'Abandons récupérables', valeur: nombreFr(Math.round(configurations * 0.34)) },
      ],
      variation: Math.round((alea() * 36 - 10) * 10) / 10,
      hausseSouhaitee: true,
      href: '/admin/statistiques/configurateur',
    },
    {
      id: 'chiffre-affaires',
      libelle: 'Chiffre d’affaires signé',
      valeur: `${nombreFr(chiffreAffaires)} DT`,
      details: [
        { libelle: 'Devis acceptés', valeur: nombreFr(signes) },
        { libelle: 'Panier moyen', valeur: `${nombreFr(chiffreAffaires / Math.max(1, signes))} DT` },
      ],
      variation: Math.round((alea() * 46 - 12) * 10) / 10,
      hausseSouhaitee: true,
      href: '/admin/statistiques/commercial',
    },
  ];
}

function construireAlertes(produits: MesureProduit[]): Alerte[] {
  const alea = generateur(graine('alertes'));
  const sansReponse = Math.round(1 + alea() * 4);
  const rdvNonConfirmes = Math.round(alea() * 3);
  const sansPhoto = Math.round(alea() * 3);
  const echantillons = Math.round(alea() * 4);
  const erreurs = Math.round(alea() * 12);
  const faible = produits.find((p) => p.vues > 200 && p.demandes / p.vues < 0.025);

  const liste: Alerte[] = [
    {
      id: 'devis-sans-reponse',
      gravite: sansReponse > 2 ? 'critique' : 'attention',
      libelle: 'Demandes sans réponse depuis plus de 48 h',
      nombre: sansReponse,
      href: '/admin/demandes?filtre=sans-reponse',
    },
    {
      id: 'rdv-non-confirmes',
      gravite: 'attention',
      libelle: 'Rendez-vous en attente de confirmation',
      nombre: rdvNonConfirmes,
      href: '/admin/demandes/rendez-vous?statut=demande',
    },
    {
      id: 'produits-sans-photo',
      gravite: 'attention',
      libelle: 'Pièces publiées sans photographie',
      nombre: sansPhoto,
      href: '/admin/catalogue?filtre=sans-photo',
    },
    {
      id: 'echantillons',
      gravite: 'information',
      libelle: 'Matières dont le stock d’échantillons est bas',
      nombre: echantillons,
      href: '/admin/catalogue/matieres?filtre=stock-bas',
    },
    {
      id: 'erreurs-404',
      gravite: 'information',
      libelle: 'Pages introuvables rencontrées cette semaine',
      nombre: erreurs,
      href: '/admin/reglages/redirections',
    },
  ];

  if (faible) {
    liste.splice(1, 0, {
      id: 'fiche-faible',
      gravite: 'attention',
      // Le nombre affiché est un décompte d'éléments à traiter, jamais un
      // volume : une colonne où « 1 » côtoierait « 537 » ne se lit plus.
      libelle: `« ${faible.nom} » : très consultée, rarement demandée`,
      nombre: 1,
      href: `/admin/catalogue/${faible.slug}`,
    });
  }

  return liste.filter((a) => a.nombre > 0);
}

/**
 * Flux d'activité en direct.
 *
 * Les horodatages sont absolus : c'est le composant qui les convertit en
 * « il y a 4 min », après montage, pour ne pas figer une durée dans le HTML
 * rendu côté serveur.
 */
export function construireFluxActivite(nombre = 12): Evenement[] {
  const alea = generateur(graine('activite', Math.floor(Date.now() / 3_600_000)));
  const maintenant = Date.now();

  const modeles: { canal: Evenement['canal']; objets: string[] }[] = [
    {
      canal: 'devis',
      objets: PRODUITS.slice(0, 8).map((p) => `Demande de devis — ${p.type} ${p.nom}`),
    },
    {
      canal: 'rendez-vous',
      objets: [
        'Rendez-vous demandé — Showroom La Soukra',
        'Rendez-vous demandé — Showroom Slim Centre',
        'Rendez-vous confirmé — projet d’architecture',
      ],
    },
    {
      canal: 'configuration',
      objets: [
        'Configuration enregistrée — canapé d’angle 3,20 m',
        'Configuration enregistrée — dressing 4 portes',
        'Configuration abandonnée à l’étape « revêtement »',
      ],
    },
    {
      canal: 'message',
      objets: [
        'Message de contact — délai de fabrication',
        'Demande professionnelle — architecte d’intérieur',
        'Message de contact — livraison à Sfax',
      ],
    },
    {
      canal: 'echantillon',
      objets: [
        'Échantillons demandés — Bouclé Écru, Lin Naturel',
        'Échantillons demandés — Cuir Cognac',
      ],
    },
  ];

  const evenements: Evenement[] = [];
  let recul = 0;

  for (let i = 0; i < nombre; i++) {
    const modele = modeles[Math.floor(alea() * modeles.length)];
    recul += 3 + Math.floor(alea() * 46);
    evenements.push({
      id: `ev-${i}`,
      canal: modele.canal,
      objet: modele.objets[Math.floor(alea() * modele.objets.length)],
      ville: VILLES[Math.floor(alea() * VILLES.length)],
      horodatage: new Date(maintenant - recul * 60_000).toISOString(),
      href: '/admin/demandes',
    });
  }

  return evenements;
}

/* ── Assemblage ───────────────────────────────────────────────────────── */

export function construireTableauDeBord(periode: Periode = '30j'): DonneesTableauDeBord {
  const trafic = construireTrafic(periode);
  const entonnoir = construireEntonnoir(trafic);
  const produits = construireProduits(trafic);

  return {
    periode,
    genereLe: new Date().toISOString(),
    indicateurs: construireIndicateurs(periode, trafic, entonnoir, produits),
    trafic,
    entonnoir,
    produits,
    sources: construireSources(trafic),
    gouvernorats: construireGouvernorats(trafic),
    recherchesVides: construireRecherchesVides(periode),
    alertes: construireAlertes(produits),
    evenements: construireFluxActivite(),
  };
}
