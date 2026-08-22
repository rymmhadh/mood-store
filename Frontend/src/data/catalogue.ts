/**
 * Catalogue produit.
 *
 * Ce fichier a exactement la forme des réponses de l'API :
 *   GET /api/familles           → FAMILLES
 *   GET /api/produits?famille=  → PRODUITS filtrés
 *   GET /api/produits/[slug]    → un ProduitCatalogue
 * La bascule vers le back TypeORM se fera sans toucher aux composants.
 */

export interface Coloris {
  id: string;
  nom: string;
  hex: string;
}

export interface Revetement {
  id: string;
  nom: string;
  /** Libre : le nuancier est géré depuis le back-office, une nouvelle famille ne doit rien casser. */
  famille: string;
  hex: string;
  entretien: string;
}

export interface DimensionProduit {
  nom: string;
  largeur: number;
  hauteur: number;
  profondeur: number;
  /** Surcoût en dinars par rapport à la taille de référence. */
  surcout?: number;
}

export interface ProduitCatalogue {
  slug: string;
  /** Typologie affichée au-dessus du nom, à la manière d'un catalogue. */
  type: string;
  nom: string;
  collection: string;
  designer: string;
  chapo: string;
  description: string[];
  familles: string[];
  images: string[];
  prix?: number;
  prixSurDemande?: boolean;
  nouveaute?: boolean;
  dimensions: DimensionProduit[];
  colorisIds: string[];
  revetementIds: string[];
  matieres: string[];
  styles: string[];
  structure: string;
  garnissage?: string;
  pietement: string;
  delaiJours: number;
  demontable: boolean;
}

export interface Famille {
  slug: string;
  nom: string;
  parent: string;
  chapo: string;
}

/* ── Nuanciers ───────────────────────────────────────────────────────── */

export const COLORIS: Coloris[] = [
  { id: 'ecru', nom: 'Écru', hex: '#EFE9DF' },
  { id: 'ivoire', nom: 'Ivoire', hex: '#F3EEE6' },
  { id: 'sable', nom: 'Sable', hex: '#D9CBB6' },
  { id: 'taupe', nom: 'Taupe', hex: '#B7AA98' },
  { id: 'terracotta', nom: 'Terracotta', hex: '#B05C3B' },
  { id: 'olive', nom: 'Olive', hex: '#5A6350' },
  { id: 'cognac', nom: 'Cognac', hex: '#8A5A34' },
  { id: 'brun', nom: 'Brun profond', hex: '#6E5847' },
  { id: 'gris', nom: 'Gris pierre', hex: '#9A9A96' },
  { id: 'encre', nom: 'Noir encre', hex: '#1A1A1A' },
];

export const REVETEMENTS: Revetement[] = [
  { id: 'boucle-ecru', nom: 'Bouclé Écru', famille: 'Bouclé', hex: '#EFE9DF', entretien: 'Aspiration douce, nettoyage à sec' },
  { id: 'boucle-sable', nom: 'Bouclé Sable', famille: 'Bouclé', hex: '#D9CBB6', entretien: 'Aspiration douce, nettoyage à sec' },
  { id: 'boucle-taupe', nom: 'Bouclé Taupe', famille: 'Bouclé', hex: '#B7AA98', entretien: 'Aspiration douce, nettoyage à sec' },
  { id: 'velours-terracotta', nom: 'Velours Terracotta', famille: 'Velours', hex: '#B05C3B', entretien: 'Brossage dans le sens du poil' },
  { id: 'velours-olive', nom: 'Velours Olive', famille: 'Velours', hex: '#5A6350', entretien: 'Brossage dans le sens du poil' },
  { id: 'lin-naturel', nom: 'Lin Naturel', famille: 'Lin', hex: '#E2DACB', entretien: 'Housse déhoussable, lavage à 30°' },
  { id: 'cuir-cognac', nom: 'Cuir pleine fleur Cognac', famille: 'Cuir', hex: '#8A5A34', entretien: 'Lait nourrissant deux fois par an' },
  { id: 'cuir-encre', nom: 'Cuir pleine fleur Noir', famille: 'Cuir', hex: '#1A1A1A', entretien: 'Lait nourrissant deux fois par an' },
  { id: 'technique-gris', nom: 'Tissu technique Gris', famille: 'Tissu technique', hex: '#9A9A96', entretien: 'Éponge humide, séchage à l’air' },
];

export const STYLES = ['Minimaliste', 'Japandi', 'Moderne', 'Contemporain', 'Luxury'] as const;
export const MATIERES = ['Bouclé', 'Velours', 'Lin', 'Cuir', 'Bois massif', 'Laque', 'Marbre', 'Métal'] as const;

/* ── Familles (une page par typologie) ───────────────────────────────── */

export const FAMILLES: Famille[] = [
  { slug: 'canapes', nom: 'Canapés', parent: 'Salon', chapo: "Pièce maîtresse du salon, le canapé donne le ton de la maison. Nos assises sont fabriquées à l’atelier, dans vos dimensions exactes, et se déclinent dans l’ensemble de notre nuancier de tissus, velours et cuirs." },
  { slug: 'fauteuils', nom: 'Fauteuils', parent: 'Salon', chapo: "Le fauteuil est la ponctuation d’un salon : il se choisit pour sa silhouette autant que pour son confort. Chaque modèle existe en plusieurs revêtements et piètements." },
  { slug: 'poufs', nom: 'Poufs et tabourets', parent: 'Salon', chapo: "Assises d’appoint, repose-pieds ou tables basses selon l’usage. Des volumes doux, montés à la main sur des piètements en bois massif ou en métal." },
  { slug: 'tables-basses', nom: 'Tables basses', parent: 'Salon', chapo: "Marbre, laque, bois massif : la table basse structure l’espace autour du canapé. Toutes nos tables sont réalisables sur mesure." },
  { slug: 'bibliotheques', nom: 'Bibliothèques et compositions', parent: 'Salon', chapo: "Compositions murales dessinées au millimètre pour votre pièce, avec éclairage intégré et finitions au choix." },
  { slug: 'consoles', nom: 'Consoles et meubles d’appoint', parent: 'Salon', chapo: "Les pièces qui achèvent un aménagement : consoles d’entrée, dessertes, meubles d’appoint." },
  { slug: 'tables', nom: 'Tables de repas', parent: 'Salle à manger', chapo: "La table de repas est le meuble le plus utilisé de la maison. Nous la fabriquons dans la longueur exacte de votre pièce, en laque, en bois massif ou en marbre." },
  { slug: 'chaises', nom: 'Chaises et tabourets', parent: 'Salle à manger', chapo: "Assises de repas confortables et tenues dans le temps : structures en bois massif, garnissage haute densité, revêtements déhoussables." },
  { slug: 'buffets', nom: 'Buffets et vaisseliers', parent: 'Salle à manger', chapo: "Rangements de salle à manger, en applique ou toute hauteur, avec façades laquées, plaquées ou cannées." },
  { slug: 'lits', nom: 'Lits et têtes de lit', parent: 'Chambre', chapo: "Têtes de lit capitonnées, cannées ou pleine hauteur, montées sur cadres sur mesure adaptés à votre matelas." },
  { slug: 'dressings', nom: 'Dressings et armoires', parent: 'Chambre', chapo: "Dressings dessinés pour votre pièce, avec aménagement intérieur, éclairage et façades au choix." },
  { slug: 'commodes', nom: 'Commodes et chevets', parent: 'Chambre', chapo: "Rangements de chambre aux proportions justes, en bois massif ou laqué." },
  { slug: 'luminaires', nom: 'Luminaires', parent: 'Décoration', chapo: "Suspensions, appliques et lampes sélectionnées pour accompagner nos collections." },
  { slug: 'textile', nom: 'Coussins et textile', parent: 'Décoration', chapo: "Coussins, plaids et rideaux confectionnés dans les mêmes matières que nos assises." },
  { slug: 'tapis', nom: 'Tapis', parent: 'Décoration', chapo: "Tapis noués et tuftés, disponibles sur mesure dans les dimensions de votre pièce." },
  { slug: 'objets', nom: 'Objets de décoration', parent: 'Décoration', chapo: "Les pièces qui donnent une âme à une maison — dont notre Mouton, devenu la signature de l’atelier." },
  { slug: 'miroirs', nom: 'Miroirs', parent: 'Décoration', chapo: "Miroirs rétroéclairés, cannés ou à cadre métallique, réalisables dans toutes les dimensions." },
];

/* ── Produits ────────────────────────────────────────────────────────── */

/**
 * Chemins des visuels d'une pièce.
 *
 * Les masters sont rangés dans `assets/<dossier>/` :
 *   uno.png → visuel 1, affiché par défaut dans la grille et en tête de fiche
 *   duo.png → visuel 2, révélé au survol de la carte
 *   suite   → visuels 3, 4, 5 de la galerie produit
 *
 * `nb` est le nombre de visuels réellement présents dans le dossier.
 */
const img = (slug: string, nb: number) =>
  Array.from({ length: nb }, (_, i) => `/images/produits/${slug}/${i + 1}.webp`);

export const PRODUITS: ProduitCatalogue[] = [
  /* ── Salon ─────────────────────────────────────────────────────────── */
  {
    slug: 'bulle',
    type: 'Canapé modulable',
    nom: 'Bulle',
    collection: 'Bouclé',
    designer: 'Atelier Mood Store',
    chapo: 'Des modules capitonnés assemblés librement, autour d’une table basse en bois massif.',
    description: [
      'Bulle est né d’une contrainte : meubler des salons rarement rectangulaires. Chaque module se commande séparément et s’assemble sans vis apparente, ce qui permet de suivre un angle, une baie ou une circulation.',
      'Le capitonnage est réalisé à la main, module par module. L’assise repose sur une suspension à ressorts ensachés et une mousse haute résilience de 35 kg/m³, garnie d’une nappe de plume pour le moelleux de surface.',
    ],
    familles: ['canapes'],
    images: img('bulle', 2),
    prixSurDemande: true,
    nouveaute: true,
    dimensions: [
      { nom: '3 places', largeur: 240, hauteur: 72, profondeur: 105 },
      { nom: '4 places', largeur: 300, hauteur: 72, profondeur: 105, surcout: 1450 },
      { nom: 'Composition d’angle', largeur: 300, hauteur: 72, profondeur: 190, surcout: 2600 },
    ],
    colorisIds: ['ecru', 'ivoire', 'sable', 'taupe', 'gris'],
    revetementIds: ['boucle-ecru', 'boucle-sable', 'boucle-taupe', 'lin-naturel', 'technique-gris'],
    matieres: ['Bouclé', 'Lin', 'Bois massif'],
    styles: ['Minimaliste', 'Contemporain'],
    structure: 'Hêtre massif étuvé, assemblage tenon-mortaise',
    garnissage: 'Mousse HR 35 kg/m³ et nappe de plume',
    pietement: 'Socle plein tapissé',
    delaiJours: 42,
    demontable: true,
  },
  {
    slug: 'horizon',
    type: 'Canapé d’angle',
    nom: 'Horizon',
    collection: 'Lin',
    designer: 'Atelier Mood Store',
    chapo: 'Une ligne basse et continue, pensée pour les grands séjours ouverts.',
    description: [
      'Horizon privilégie la longueur à la hauteur : dossier bas, accoudoirs affleurants, assise profonde. Il dégage la vue dans les pièces traversantes et se marie aux plafonds bas.',
      'La méridienne est réversible et se commande à gauche comme à droite ; le passage de l’une à l’autre se décide à la commande, sans surcoût.',
    ],
    familles: ['canapes'],
    images: img('horizon', 5),
    prixSurDemande: true,
    dimensions: [
      { nom: 'Angle 4 places', largeur: 320, hauteur: 68, profondeur: 190 },
      { nom: 'Angle 5 places', largeur: 380, hauteur: 68, profondeur: 190, surcout: 1900 },
      { nom: 'Angle 6 places', largeur: 430, hauteur: 68, profondeur: 190, surcout: 3400 },
    ],
    colorisIds: ['ecru', 'sable', 'taupe', 'gris', 'brun'],
    revetementIds: ['lin-naturel', 'boucle-ecru', 'boucle-sable', 'technique-gris', 'cuir-cognac'],
    matieres: ['Lin', 'Bouclé', 'Cuir'],
    styles: ['Contemporain', 'Moderne'],
    structure: 'Hêtre massif et contreplaqué multiplis',
    garnissage: 'Mousse HR 35 kg/m³',
    pietement: 'Socle plein tapissé',
    delaiJours: 45,
    demontable: true,
  },
  {
    slug: 'onde',
    type: 'Canapé courbe',
    nom: 'Onde',
    collection: 'Courbe',
    designer: 'Atelier Mood Store',
    chapo: 'Un dossier galbé d’un seul tenant, sans angle ni rupture.',
    description: [
      'Onde abandonne la ligne droite. Le dossier suit une courbe continue, cintrée à la vapeur puis garnie à la main — le point technique du modèle, et ce qui interdit toute production en série.',
      'Posé au centre d’une pièce, il structure l’espace sans le cloisonner. Contre un mur, il en adoucit l’angle.',
    ],
    familles: ['canapes'],
    images: img('onde', 4),
    prixSurDemande: true,
    nouveaute: true,
    dimensions: [
      { nom: 'Courbe 3 places', largeur: 260, hauteur: 74, profondeur: 100 },
      { nom: 'Courbe 4 places', largeur: 320, hauteur: 74, profondeur: 100, surcout: 1700 },
    ],
    colorisIds: ['ecru', 'ivoire', 'sable', 'taupe'],
    revetementIds: ['boucle-ecru', 'boucle-sable', 'lin-naturel', 'velours-terracotta'],
    matieres: ['Bouclé', 'Lin', 'Velours'],
    styles: ['Contemporain', 'Luxury'],
    structure: 'Contreplaqué cintré et hêtre massif',
    garnissage: 'Mousse HR 35 kg/m³ et fibre siliconée',
    pietement: 'Socle plein tapissé',
    delaiJours: 50,
    demontable: true,
  },
  {
    slug: 'sillage',
    type: 'Canapé courbe',
    nom: 'Sillage',
    collection: 'Courbe',
    designer: 'Atelier Mood Store',
    chapo: 'La grande composition courbe de l’atelier, accompagnée de ses assises satellites.',
    description: [
      'Sillage est notre pièce la plus ambitieuse : une courbe de plus de quatre mètres, montée en trois éléments raccordés sur site pour passer les portes et les ascenseurs.',
      'Les poufs qui l’accompagnent reprennent le même rayon : posés contre le canapé, ils prolongent la ligne ; écartés, ils deviennent des assises indépendantes.',
    ],
    familles: ['canapes'],
    images: img('sillage', 3),
    prixSurDemande: true,
    dimensions: [
      { nom: 'Composition 5 places', largeur: 420, hauteur: 72, profondeur: 110 },
      { nom: 'Composition 7 places', largeur: 500, hauteur: 72, profondeur: 110, surcout: 3200 },
    ],
    colorisIds: ['ecru', 'ivoire', 'sable'],
    revetementIds: ['boucle-ecru', 'boucle-sable', 'lin-naturel'],
    matieres: ['Bouclé', 'Lin'],
    styles: ['Luxury', 'Contemporain'],
    structure: 'Contreplaqué cintré, raccords métalliques invisibles',
    garnissage: 'Mousse HR 35 kg/m³',
    pietement: 'Socle plein tapissé',
    delaiJours: 60,
    demontable: true,
  },
  {
    slug: 'grenat',
    type: 'Canapé d’angle',
    nom: 'Grenat',
    collection: 'Velours',
    designer: 'Atelier Mood Store',
    chapo: 'Un velours profond, un capitonnage large, une présence assumée.',
    description: [
      'Grenat est l’exact opposé du salon neutre. Le velours y est employé sans retenue, sur un capitonnage large qui accroche la lumière et change de ton selon l’heure.',
      'Le modèle se commande aussi dans nos teintes sourdes — olive, brun profond, encre — pour ceux qui veulent la matière sans la couleur.',
    ],
    familles: ['canapes'],
    images: img('grenat', 5),
    prixSurDemande: true,
    dimensions: [
      { nom: 'Angle 5 places', largeur: 360, hauteur: 74, profondeur: 200 },
      { nom: 'Angle 6 places', largeur: 420, hauteur: 74, profondeur: 200, surcout: 2100 },
    ],
    colorisIds: ['terracotta', 'brun', 'olive', 'encre', 'taupe'],
    revetementIds: ['velours-terracotta', 'velours-olive', 'cuir-cognac', 'cuir-encre', 'technique-gris'],
    matieres: ['Velours', 'Cuir'],
    styles: ['Luxury', 'Moderne'],
    structure: 'Hêtre massif et contreplaqué multiplis',
    garnissage: 'Mousse HR 35 kg/m³ et plume',
    pietement: 'Socle plein tapissé',
    delaiJours: 48,
    demontable: true,
  },
  {
    slug: 'rivage',
    type: 'Canapé d’angle',
    nom: 'Rivage',
    collection: 'Lin',
    designer: 'Atelier Mood Store',
    chapo: 'Un angle généreux en lin lavé, dessiné pour les séjours familiaux.',
    description: [
      'Rivage est notre modèle le plus vendu auprès des familles : housses entièrement déhoussables, lavables à 30°, et un lin lavé qui se patine au lieu de s’user.',
      'La profondeur d’assise de 105 cm autorise la position allongée sans transformer le canapé en lit de repos.',
    ],
    familles: ['canapes'],
    images: img('rivage', 4),
    prixSurDemande: true,
    dimensions: [
      { nom: 'Angle 4 places', largeur: 310, hauteur: 70, profondeur: 185 },
      { nom: 'Angle 5 places', largeur: 370, hauteur: 70, profondeur: 185, surcout: 1750 },
    ],
    colorisIds: ['ecru', 'sable', 'taupe', 'gris'],
    revetementIds: ['lin-naturel', 'boucle-ecru', 'technique-gris'],
    matieres: ['Lin', 'Bouclé'],
    styles: ['Minimaliste', 'Contemporain'],
    structure: 'Hêtre massif',
    garnissage: 'Mousse HR 30 kg/m³ et fibre siliconée',
    pietement: 'Socle plein tapissé',
    delaiJours: 42,
    demontable: true,
  },
  {
    slug: 'trait',
    type: 'Fauteuil',
    nom: 'Trait',
    collection: 'Velours',
    designer: 'Atelier Mood Store',
    chapo: 'Une structure en métal noir laissée apparente, une assise pleine : le dessin reste lisible.',
    description: [
      'Trait assume sa construction. Le cadre en acier laqué noir n’est ni masqué ni tapissé : il tient l’assise et dessine l’accoudoir d’un seul geste.',
      'Le velours olive a été retenu pour le showroom, mais le modèle existe en cuir pleine fleur, qui accentue encore le caractère graphique de la pièce.',
    ],
    familles: ['fauteuils'],
    images: img('trait', 3),
    prix: 1980,
    dimensions: [{ nom: 'Standard', largeur: 78, hauteur: 76, profondeur: 82 }],
    colorisIds: ['olive', 'brun', 'cognac', 'encre', 'gris'],
    revetementIds: ['velours-olive', 'velours-terracotta', 'cuir-cognac', 'cuir-encre', 'technique-gris'],
    matieres: ['Velours', 'Cuir', 'Métal'],
    styles: ['Moderne', 'Contemporain'],
    structure: 'Acier laqué époxy noir mat',
    garnissage: 'Mousse HR 35 kg/m³',
    pietement: 'Métal noir',
    delaiJours: 30,
    demontable: false,
  },
  {
    slug: 'mouton',
    type: 'Assise décorative',
    nom: 'Le Mouton',
    collection: 'Signature',
    designer: 'Atelier Mood Store',
    chapo: 'La pièce signature de l’atelier. Assise d’appoint, repose-pieds, ou simplement présence.',
    description: [
      'Le Mouton est né d’un exercice de style à l’atelier, et n’était pas destiné à la vente. Il est devenu la pièce la plus photographiée du showroom.',
      'La toison est un bouclé monté à la main sur une coque en contreplaqué moulé. Pattes et tête sont tournées puis laquées en noir mat. Chaque pièce étant montée à la main, aucune toison n’est identique.',
    ],
    familles: ['objets', 'poufs'],
    images: img('mouton', 4),
    prix: 1290,
    dimensions: [
      { nom: 'Grand modèle', largeur: 100, hauteur: 72, profondeur: 42 },
      { nom: 'Petit modèle', largeur: 62, hauteur: 48, profondeur: 28, surcout: -500 },
    ],
    colorisIds: ['ecru', 'ivoire', 'sable'],
    revetementIds: ['boucle-ecru', 'boucle-sable'],
    matieres: ['Bouclé', 'Bois massif'],
    styles: ['Contemporain', 'Luxury'],
    structure: 'Contreplaqué moulé, hêtre massif tourné',
    garnissage: 'Ouate haute densité',
    pietement: 'Hêtre laqué noir mat',
    delaiJours: 25,
    demontable: false,
  },

  /* ── Salle à manger ────────────────────────────────────────────────── */
  {
    slug: 'perle',
    type: 'Table de repas ronde',
    nom: 'Perle',
    collection: 'Bouclé',
    designer: 'Atelier Mood Store',
    chapo: 'Un plateau rond sur fût central, entouré de chaises bouclées de la même ligne.',
    description: [
      'Perle est vendue seule ou en composition avec ses chaises. Le fût central libère entièrement le pourtour : on ajoute deux convives sans déplacer personne.',
      'Le plateau existe en laque satinée, en placage de chêne ou en marbre. Le diamètre se commande au centimètre, de 120 à 180 cm.',
    ],
    familles: ['tables'],
    images: img('perle', 4),
    prixSurDemande: true,
    dimensions: [
      { nom: 'Ø 130 cm — 6 personnes', largeur: 130, hauteur: 75, profondeur: 130 },
      { nom: 'Ø 150 cm — 8 personnes', largeur: 150, hauteur: 75, profondeur: 150, surcout: 700 },
      { nom: 'Ø 180 cm — 10 personnes', largeur: 180, hauteur: 75, profondeur: 180, surcout: 1500 },
    ],
    colorisIds: ['ivoire', 'sable', 'taupe', 'brun'],
    revetementIds: [],
    matieres: ['Bois massif', 'Laque', 'Marbre'],
    styles: ['Contemporain', 'Luxury'],
    structure: 'Plateau MDF haute densité plaqué ou laqué',
    pietement: 'Fût central tourné',
    delaiJours: 40,
    demontable: true,
  },
  {
    slug: 'onyx',
    type: 'Table de repas ronde',
    nom: 'Onyx',
    collection: 'Onyx',
    designer: 'Atelier Mood Store',
    chapo: 'Un plateau circulaire en laque noire mate sur un fût conique. Aucun pied dans les jambes.',
    description: [
      'Onyx tire son nom de sa finition : une laque noire mate appliquée en huit couches, poncée entre chaque passage. Le résultat absorbe la lumière au lieu de la renvoyer.',
      'C’est une table qui demande peu autour d’elle. Posée dans une pièce claire, elle en devient le point de gravité.',
    ],
    familles: ['tables'],
    images: img('onyx', 4),
    prixSurDemande: true,
    dimensions: [
      { nom: 'Ø 130 cm — 6 personnes', largeur: 130, hauteur: 75, profondeur: 130 },
      { nom: 'Ø 150 cm — 8 personnes', largeur: 150, hauteur: 75, profondeur: 150, surcout: 700 },
      { nom: 'Ø 180 cm — 10 personnes', largeur: 180, hauteur: 75, profondeur: 180, surcout: 1500 },
    ],
    colorisIds: ['encre', 'brun', 'taupe', 'ivoire'],
    revetementIds: [],
    matieres: ['Laque', 'Bois massif', 'Marbre'],
    styles: ['Moderne', 'Luxury'],
    structure: 'MDF haute densité, laque polyuréthane mate',
    pietement: 'Fût conique laqué',
    delaiJours: 40,
    demontable: true,
  },
  {
    slug: 'ovale',
    type: 'Table de repas ovale',
    nom: 'Ovale',
    collection: 'Onyx',
    designer: 'Atelier Mood Store',
    chapo: 'Un plateau ovale en marbre noir sur deux fûts. Jusqu’à dix convives.',
    description: [
      'L’ovale résout ce que le rectangle impose : plus de place aux angles, une circulation adoucie, et une conversation qui reste possible d’un bout à l’autre.',
      'Le plateau est un marbre Marquina noir veiné de blanc, épaisseur 20 mm, chants adoucis à la main. Les chaises Perle sont montées en 47 cm d’assise pour s’y accorder.',
    ],
    familles: ['tables'],
    images: img('ovale', 4),
    prixSurDemande: true,
    dimensions: [
      { nom: '240 × 110 cm — 8 personnes', largeur: 240, hauteur: 75, profondeur: 110 },
      { nom: '280 × 120 cm — 10 personnes', largeur: 280, hauteur: 75, profondeur: 120, surcout: 1800 },
    ],
    colorisIds: ['encre', 'ivoire', 'taupe'],
    revetementIds: [],
    matieres: ['Marbre', 'Laque', 'Métal'],
    styles: ['Luxury', 'Contemporain'],
    structure: 'Marbre Marquina 20 mm sur bâti métallique',
    pietement: 'Deux fûts laqués',
    delaiJours: 50,
    demontable: true,
  },
  {
    slug: 'albe',
    type: 'Table de repas rectangulaire',
    nom: 'Albe',
    collection: 'Onyx',
    designer: 'Atelier Mood Store',
    chapo: 'Un plateau de marbre clair sur piètement central, dans une salle à manger de réception.',
    description: [
      'Albe reprend la construction d’Ovale avec un plateau rectangulaire et un marbre clair — Calacatta ou Crema, selon disponibilité des blocs.',
      'Chaque plateau est unique : le veinage est validé avec vous sur photo de la tranche avant découpe.',
    ],
    familles: ['tables'],
    images: img('albe', 2),
    prixSurDemande: true,
    dimensions: [
      { nom: '200 × 100 cm — 8 personnes', largeur: 200, hauteur: 75, profondeur: 100 },
      { nom: '240 × 110 cm — 10 personnes', largeur: 240, hauteur: 75, profondeur: 110, surcout: 1600 },
    ],
    colorisIds: ['ivoire', 'sable', 'taupe', 'encre'],
    revetementIds: [],
    matieres: ['Marbre', 'Métal', 'Laque'],
    styles: ['Luxury', 'Moderne'],
    structure: 'Marbre 20 mm sur bâti métallique',
    pietement: 'Piètement central laqué',
    delaiJours: 55,
    demontable: true,
  },

  /* ── Chambre ───────────────────────────────────────────────────────── */
  {
    slug: 'nuage',
    type: 'Lit double',
    nom: 'Nuage',
    collection: 'Nuit',
    designer: 'Atelier Mood Store',
    chapo: 'Une tête de lit pleine hauteur, capitonnée à la verticale, sur un cadre affleurant.',
    description: [
      'Nuage a été dessiné pour les chambres où la tête de lit fait office de mur : elle monte à 130 cm et se prolonge de part et d’autre du matelas pour accueillir les chevets.',
      'Le cadre est réalisé aux dimensions exactes de votre matelas — y compris les formats importés, qui ne correspondent jamais aux standards du marché local.',
    ],
    familles: ['lits'],
    images: img('nuage', 3),
    prixSurDemande: true,
    dimensions: [
      { nom: '160 × 200 cm', largeur: 200, hauteur: 130, profondeur: 215 },
      { nom: '180 × 200 cm', largeur: 220, hauteur: 130, profondeur: 215, surcout: 450 },
      { nom: '200 × 200 cm', largeur: 240, hauteur: 130, profondeur: 215, surcout: 900 },
    ],
    colorisIds: ['ecru', 'ivoire', 'sable', 'taupe', 'brun'],
    revetementIds: ['boucle-ecru', 'lin-naturel', 'velours-olive', 'cuir-cognac'],
    matieres: ['Bouclé', 'Lin', 'Velours', 'Cuir'],
    styles: ['Contemporain', 'Luxury'],
    structure: 'Hêtre massif et panneau MDF garni',
    garnissage: 'Mousse HR 30 kg/m³',
    pietement: 'Socle affleurant',
    delaiJours: 45,
    demontable: true,
  },
  {
    slug: 'rive',
    type: 'Lits jumeaux',
    nom: 'Rive',
    collection: 'Nuit',
    designer: 'Atelier Mood Store',
    chapo: 'Deux lits identiques, à rapprocher ou à écarter, avec tête de lit continue.',
    description: [
      'Rive répond à une demande fréquente en chambre d’amis et en chambre d’enfant : deux couchages qui peuvent n’en former qu’un.',
      'La tête de lit est réalisée d’une seule pièce, en continu derrière les deux cadres, ce qui évite l’effet « chambre d’hôtel » des lits jumeaux séparés.',
    ],
    familles: ['lits'],
    images: img('rive', 4),
    prixSurDemande: true,
    dimensions: [
      { nom: '2 × 90 × 200 cm', largeur: 200, hauteur: 110, profondeur: 215 },
      { nom: '2 × 100 × 200 cm', largeur: 220, hauteur: 110, profondeur: 215, surcout: 400 },
    ],
    colorisIds: ['ecru', 'ivoire', 'sable', 'gris'],
    revetementIds: ['boucle-ecru', 'lin-naturel', 'technique-gris'],
    matieres: ['Bouclé', 'Lin'],
    styles: ['Minimaliste', 'Contemporain'],
    structure: 'Hêtre massif et panneau MDF garni',
    garnissage: 'Mousse HR 30 kg/m³',
    pietement: 'Socle affleurant',
    delaiJours: 45,
    demontable: true,
  },
];

/* ── Accès ───────────────────────────────────────────────────────────── */

export const familleParSlug = (slug: string) => FAMILLES.find((f) => f.slug === slug);
export const produitParSlug = (slug: string) => PRODUITS.find((p) => p.slug === slug);
export const produitsDeFamille = (slug: string) => PRODUITS.filter((p) => p.familles.includes(slug));
export const colorisParId = (id: string) => COLORIS.find((c) => c.id === id);
export const revetementParId = (id: string) => REVETEMENTS.find((r) => r.id === id);

/** Pièces de la même collection, hors produit courant. */
export const memeCollection = (p: ProduitCatalogue) =>
  PRODUITS.filter((x) => x.collection === p.collection && x.slug !== p.slug);

export const prixFr = new Intl.NumberFormat('fr-TN', { maximumFractionDigits: 0 });
