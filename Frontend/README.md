# Mood Store — Front

Page d'accueil haut de gamme, inspirée de la structure et de la typographie
Roche Bobois, avec les fonctionnalités propres à Mood Store (sur-mesure,
configurateur, showrooms, WhatsApp).

---

## Stack

| Couche | Choix | Pourquoi |
|---|---|---|
| Framework | **Next.js 15** (App Router, Turbopack) | Rendu serveur pour le SEO, streaming, optimisation d'images native |
| Langage | **TypeScript** strict | Aucun `any` toléré |
| Styles | **Tailwind CSS 4** | Configuration par tokens CSS (`@theme`), pas de fichier JS de config |
| Animation | **Motion** (ex Framer Motion) | Apparitions, parallaxe, transitions |
| Défilement | **Lenis** | Défilement inertiel |
| Scroll avancé | **GSAP** (installé, à activer) | Séquences canvas, ancrage horizontal |
| Back | **NestJS + Fastify + TypeORM + PostgreSQL 16** | Dans `../Backend`, base en Docker. TypeORM comme demandé ; Fastify pour le débit |

## Démarrer

Le site lit son catalogue dans l'API. Démarrez-la en premier :

```bash
cd ../Backend
cp .env.example .env
docker compose up -d           # PostgreSQL
npm install && npm run dev     # http://localhost:4000
```

Puis le front, dans un autre terminal :

```bash
cp .env.example .env.local     # NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev      # http://localhost:3000
```

| Adresse | |
|---|---|
| <http://localhost:3000> | Le site |
| <http://localhost:3000/admin> | Tableau de bord |
| <http://localhost:3000/admin/catalogue> | Gestion des pièces |

Le site public fonctionne **aussi sans l'API** : il retombe alors sur le
catalogue figé de `src/data/catalogue.ts`. Le back-office, lui, a besoin
d'elle — il le dit clairement quand elle manque.

> Si un dossier `node_modules` incomplet existe déjà, le supprimer avant
> le premier `npm install`.

Autres commandes :

```bash
npm run build      # build de production
npm run typecheck  # vérification des types
npm run lint
```

## Structure

```
src/
├── app/
│   ├── layout.tsx        Racine : <html>, police, tokens. Aucun habillage.
│   ├── globals.css       Tokens de design (couleurs, typo, mouvement, données)
│   ├── (site)/           SITE PUBLIC — en-tête, pied de page, JSON-LD
│   │   ├── layout.tsx
│   │   ├── page.tsx      Composition de la page d'accueil
│   │   ├── collections/ · contact/ · produit/ · showroom/ · sur-mesure/
│   ├── admin/            BACK-OFFICE — rail des modules, aucun chrome public
│   │   ├── layout.tsx
│   │   ├── page.tsx      Module 1 — Tableau de bord (§19.3)
│   │   └── catalogue/    Module 2 — Catalogue (liste, ajout, modification)
│   └── api/              Tableau de bord simulé · invalidation du cache
├── components/
│   ├── layout/           EnTete · MegaMenu · MenuLateral · Recherche · PiedDePage
│   │                     BarreMobile · DefilementDoux
│   ├── home/             Une section = un fichier (11 sections)
│   ├── admin/            Tableau de bord, graphiques SVG, module Catalogue
│   ├── ui/               Conteneur · Bouton · LienFleche · CarteProduit
│   │                     Comparateur · Revelation · LogoMood · Eyebrow
│   └── icons/            Jeu d'icônes au trait, 1,25 px (+ icons/admin)
├── data/                 Contenu et navigation — à remplacer par l'API
├── hooks/                useEnTeteAncre · useVerrouScroll · useTouche · useLargeur
├── lib/                  cn · fonts · motion · api · catalogue · tableauBord
└── types/                Miroir allégé des entités TypeORM (+ types/admin)
```

Le groupe `(site)` n'ajoute rien aux URL : `/`, `/collections/canapes` sont
inchangés. Il existe pour que le site public et le back-office cessent de
partager un habillage — le back-office n'a ni en-tête, ni pied de page, ni
défilement inertiel.

## Points d'implémentation

**Aucune vidéo.** Le hero est une séquence de quatre images fixes en fondu
croisé, chacune animée en Ken Burns (`animate-kenburns`). Poids total
~1,2 Mo contre ~15 Mo pour une vidéo équivalente.

**Images.** Masters conservés dans `../assets/` (jamais servis). Les fichiers
de `public/images/` sont des WebP qualité 88 ; `next/image` génère ensuite
AVIF et WebP aux six largeurs déclarées dans `next.config.ts`.

**Tokens.** Aucune couleur, durée ou espacement en dur dans les composants :
tout passe par `globals.css`. Changer la palette du site se fait à un seul
endroit.

**Accessibilité.** Lien d'évitement, focus visible non supprimé, comparateur
avant/après piloté par un `input[type=range]` (donc utilisable au clavier),
`prefers-reduced-motion` neutralise toutes les animations.

**Performance.** First Load JS ≈ 174 ko — sous le budget de 180 ko fixé au
cahier des charges (§23.1).

## Back-office — `/admin`

Module 1 du cahier des charges (§19.3), complet. Les six autres modules
apparaissent dans le rail, désactivés, pour que le périmètre reste visible.

| Bloc | Forme retenue |
|---|---|
| 6 indicateurs du jour | Tuiles, variation signée vs 7 jours précédents |
| Courbe de trafic + demandes | Deux cadres empilés sur le même axe des dates |
| Entonnoir de conversion | Barres centrées, rampe ordinale, déperdition entre étapes |
| Produits les plus vus / demandés | Deux classements horizontaux |
| **L'écart entre les deux** | Taux de transformation par pièce, rapporté à la moyenne |
| Sources de trafic | Barre de parts triée (et non un camembert — voir plus bas) |
| Provenance géographique | Cercles proportionnels sur fond de carte de Tunisie |
| Recherches sans résultat | Classement horizontal |
| Activité en direct | Flux rechargé toutes les 45 s |
| Alertes | Gravité portée par une forme **et** un mot, jamais par la couleur |

**Aucune bibliothèque de graphiques.** Tout est dessiné en SVG et en CSS. La
plus légère des bibliothèques consommerait à elle seule la moitié du budget de
180 ko fixé au §23.1 ; les formes utilisées ici tiennent en quelques dizaines
de lignes. Résultat : `/admin` pèse **136 ko** au premier chargement.

**Trois écarts assumés au cahier des charges**, chacun commenté dans le code :

1. *« Superposer les demandes de devis à la courbe de trafic »* → deux cadres
   empilés plutôt qu'un second axe vertical. Un graphique à deux échelles se
   lit toujours mal, et la lecture visée (« l'effet d'une publication
   Instagram ») est plus nette quand les deux pics tombent sur la même
   verticale.
2. *« Camembert des sources de trafic »* → barre de parts triée par poids. Un
   camembert à cinq parts exige cinq teintes bien séparées, ce que la charte
   interdit (§2.1 : aucune couleur vive) ; et l'œil compare des longueurs
   mieux que des angles.
3. *« Carte de chaleur par gouvernorat »* → cercles proportionnels et non
   aplats coloriés. Tataouine couvrirait le quart de l'écran pour trois cents
   visiteurs ; la surface d'un gouvernorat n'a rien à voir avec son audience.

**Couleurs des graphiques.** Une seule rampe de bois en six pas, du clair au
foncé (`--color-donnee-100` → `600`), plus le gris de pierre en contrepoint.
Luminosité monotone, écart suffisant entre pas voisins, contraste du pas le
plus clair ≥ 2:1 sur fond craie. Chaque figure porte une seule série : aucune
palette catégorielle n'est nécessaire, donc aucune couleur vive.

**Données.** `src/lib/tableauBord.ts` produit des séries plausibles —
saisonnalité de semaine, pics après publication, entonnoir qui se resserre —
sans aucun `Math.random()` : tout dérive d'un générateur ensemencé par le
numéro du jour, sinon le serveur et le navigateur ne rendraient pas la même
chose. Les chiffres sont stables toute la journée et changent à minuit.

| Route | Rôle |
|---|---|
| `GET /api/admin/tableau-de-bord?periode=7j\|30j\|90j` | Toute la charge utile du §19.3 |
| `GET /api/admin/activite?nombre=12` | Flux de la colonne latérale |

Le premier rendu est produit sur le serveur (pas d'aller-retour HTTP inutile) ;
les changements de période passent par l'API, ce qui éprouve dès maintenant le
contrat que le back NestJS devra respecter.

> **À faire avant mise en ligne :** ces deux routes ne contrôlent ni session ni
> rôle (§19.2). Le back-office est en `robots: noindex`, ce qui n'est pas une
> protection.

---

## Catalogue — `/admin/catalogue`

Ajouter une pièce, la photographier, la décrire, la tarifer, la publier.
Les données vivent dans PostgreSQL, servies par l'API NestJS de `../Backend`.

**Un écran, pas huit onglets.** Le §19.4.2 décrit un formulaire en huit
onglets, pensé pour une équipe qui saisit des fiches à la chaîne. L'atelier en
ajoute quelques-unes par mois : une seule page, ordonnée du plus important au
plus accessoire, se remplit plus vite et se relit d'un regard avant
publication. Variantes, Relations et SEO restent à construire le jour où le
catalogue le justifiera.

**Brouillon d'abord.** Les deux boutons n'ont pas le même poids. *Enregistrer
en brouillon* accepte une fiche incomplète ; *Publier* exige une photographie,
une accroche et un prix — les trois choses sans lesquelles une fiche ne vend
pas. Le refus vient de l'API : la règle est écrite une seule fois, du bon côté,
et revient champ par champ sous la bonne case.

**Les photographies.** Glisser-déposer, réordonnancement à la souris, la
première vignette étant la photo principale — celle de la grille, du partage,
de Google. Chaque image reçoit son texte alternatif, signalé tant qu'il manque.
L'API produit trois fichiers par photo : le master conservé, un dérivé WebP à
2560 px, et une vignette floue de quelques centaines d'octets affichée pendant
le chargement. Une image de moins de 2000 px déclenche un avertissement.

**Une pièce peut appartenir à deux rayons.** Une catégorie principale, qui fixe
le fil d'Ariane, plus des catégories secondaires. Le Mouton est un objet de
décoration *et* un pouf ; forcer un choix unique obligerait à dupliquer la
fiche.

**Publication immédiate.** Le catalogue est mis en cache cinq minutes côté
site. Après chaque enregistrement, le back-office appelle
`POST /api/revalidation`, qui purge l'étiquette `catalogue` — la pièce est
visible tout de suite. Sans cela, l'atelier ne la verrait pas et la publierait
une deuxième fois.

**Les vues sont comptées** depuis le navigateur, une fois par onglet, jamais au
rendu serveur : une page rendue pour un robot ou pour reconstruire un cache
n'est pas une visite. C'est ce qui alimentera « les pièces les plus vues » du
tableau de bord.

---

## À brancher sur l'API

Les fichiers de `src/data/` ont exactement la forme des réponses de l'API.
La bascule se fera sans toucher aux vues :

| Fichier | Endpoint cible | |
|---|---|---|
| `lib/catalogue.ts` | `GET /api/produits`, `/api/produits/[slug]`, `/api/categories` | **fait** |
| `data/home.ts` → `PRODUITS_VEDETTE` | `GET /api/produits?miseEnAvant=true` | |
| `data/home.ts` → `REALISATIONS` | `GET /api/realisations?limite=3` | |
| `data/home.ts` → `ARTICLES` | `GET /api/journal?limite=3` | |
| `data/home.ts` → `SHOWROOMS` | `GET /api/showrooms` | |
| `components/layout/Recherche.tsx` | `GET /api/recherche?q=` (Meilisearch) | |
| `components/layout/PiedDePage.tsx` | `POST /api/newsletter` | |
| `components/home/Instagram.tsx` | Instagram Basic Display API | |

## Reste à faire

- Modules 3 à 7 du back-office (contenu, demandes, clients, statistiques,
  réglages) — §19.5 à §19.9
- Onglets Variantes, Dimensions et SEO du formulaire produit (§19.4.2)
- Authentification et rôles du back-office (§19.2)
- Sections restantes du site (inspirations, réalisations, journal)
- Back NestJS + TypeORM et bascule des données
- Séquence cinématique au scroll (canvas GSAP, §18.10)
- Visite virtuelle 360° du showroom (Pannellum)
