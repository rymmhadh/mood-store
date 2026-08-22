# Mood Store — API

NestJS · Fastify · TypeORM · PostgreSQL 16.
Sert le catalogue au site public et au back-office.

---

## Démarrer

```bash
cp .env.example .env
docker compose up -d      # PostgreSQL sur le port 5433, Adminer sur le 8081
npm install
npm run dev               # http://localhost:4000
```

Au premier démarrage sur une base vide, le catalogue de référence est recréé :
4 univers, 17 catégories, 7 collections, 14 pièces — à l'identique du fichier
qui servait jusqu'ici de source au front.

> Le port **5433** côté hôte est délibéré : il évite le conflit avec un
> PostgreSQL déjà installé sur la machine.

Autres commandes :

```bash
npm run build       # compilation
npm run start       # exécution du build
npm run typecheck   # vérification des types
npm run amorcer     # amorçage manuel (refuse si la base contient des pièces)
docker compose down     # arrêt, données conservées
docker compose down -v  # arrêt ET effacement du volume
```

Pour regarder la base sans installer de client : <http://localhost:8081>,
serveur `base`, utilisateur et mot de passe `moodstore`.

---

## Structure

```
src/
├── main.ts                  Fastify, CORS, multipart, /media statique
├── app.module.ts            Configuration TypeORM
├── commun/
│   ├── enveloppe.intercepteur.ts   { data, meta, error }
│   ├── filtre-exceptions.ts        erreurs dans la même enveloppe
│   ├── validation.pipe.ts          validation par schéma Zod
│   └── slug.ts                     slugs et références produit
├── catalogue/
│   ├── entites/             Categorie · Collection · Produit · Media · Dimension
│   ├── dto/                 schemas.ts (Zod) · produit.dto.ts (sortie)
│   ├── produits.service.ts
│   ├── taxonomie.service.ts
│   ├── produits.controleur.ts        endpoints publics
│   └── produits-admin.controleur.ts  endpoints back-office
├── medias/                  téléversement, dérivés WebP, LQIP
└── amorce/                  catalogue initial
```

---

## Endpoints

### Publics

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/categories` | Typologies à plat, avec leur univers |
| GET | `/api/categories/arbre` | Arborescence complète |
| GET | `/api/collections` | Lignes de la maison |
| GET | `/api/produits?famille=` | Pièces **publiées**, filtrées |
| GET | `/api/produits/:slug` | Détail d'une pièce publiée |
| POST | `/api/produits/:slug/vue` | Enregistre une consultation |

### Back-office

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/admin/produits` | Liste paginée — `recherche`, `categorie`, `collection`, `statut`, `sansPhoto`, `tri`, `page` |
| GET | `/api/admin/produits/:id` | Fiche complète |
| POST | `/api/admin/produits` | Création |
| PATCH | `/api/admin/produits/:id` | Modification partielle |
| DELETE | `/api/admin/produits/:id` | Mise à la corbeille (réversible 30 jours) |
| POST | `/api/admin/produits/:id/restaurer` | Sortie de corbeille |
| GET | `/api/admin/stats/catalogue` | Compteurs du tableau de bord |
| POST | `/api/admin/medias/upload` | Téléversement multipart, 10 fichiers, 25 Mo |
| PATCH | `/api/admin/medias/:id` | Texte alternatif, légende, rôle |
| DELETE | `/api/admin/medias/:id` | Détache la photo de sa pièce |

Toutes les réponses suivent `{ data, meta, error }`. En cas d'échec de
validation, `error.champs` porte un message par champ, affiché tel quel sous
la bonne case du formulaire.

> **À faire avant toute mise en ligne.** Les routes `/api/admin/*` ne
> contrôlent ni session ni rôle. Tant que la garde du §19.2 n'est pas posée,
> l'API ne doit pas être exposée hors du réseau local.

---

## Décisions

**TypeORM et non Prisma.** Le cahier des charges §21 esquisse le schéma en
Prisma ; le choix de TypeORM était déjà acté côté projet. Le modèle de données
est le même, la syntaxe change.

**Tableaux PostgreSQL pour les listes courtes.** Matières, styles, coloris,
revêtements : ils ne portent aucun attribut, ne sont jamais interrogés seuls,
et trois tables de liaison de plus se paieraient à chaque affichage de fiche.
Les vraies relations — catégorie, collections, médias, dimensions — sont
normalisées.

**Deux catégories pour une pièce.** Une catégorie principale, qui fixe le fil
d'Ariane et la référence, plus des catégories secondaires. Le Mouton est un
objet de décoration *et* un pouf ; forcer un choix unique obligerait à
dupliquer la fiche — deux URL, deux compteurs, deux fois le travail à chaque
correction.

**Filtres en sous-requête `EXISTS`.** Filtrer directement sur une jointure qui
sert aussi à charger les données les ampute : une pièce de deux collections
n'en montrerait plus qu'une. `EXISTS` sépare les deux rôles.

**Les prix en `numeric`.** Jamais en virgule flottante. TypeORM les rend en
chaîne ; la conversion se fait au moment de composer la réponse.

**Trois fichiers par photographie.** Le master tel qu'il a été téléversé —
jamais servi, mais il permettra de régénérer les dérivés si les formats du web
changent, sans redemander les fichiers à l'atelier. Le dérivé WebP à 2560 px,
c'est lui que reçoit `next/image`. Et un LQIP de quelques centaines d'octets,
affiché flou pendant le chargement.

**Le format est vérifié sur le contenu**, pas sur l'extension ni sur le type
déclaré par le navigateur : les deux se falsifient en trois secondes.

**`synchronize: true` en développement.** Le schéma se fabrique depuis les
entités, sans migration. À passer à `false` dès la première mise en ligne : la
synchronisation automatique n'hésite pas à supprimer une colonne pour la faire
correspondre.

---

## Reste à faire

- Authentification et rôles (§19.2)
- Entités Demande, Devis, RendezVous, Client (§21)
- Statistiques réelles de trafic et de conversion, aujourd'hui simulées côté front
- Migrations TypeORM, en remplacement de `synchronize`
- Meilisearch pour la recherche (§20.1)
