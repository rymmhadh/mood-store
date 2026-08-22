# MOOD STORE
# Cahier des charges — Plateforme digitale haut de gamme

**Version 1.0 · Août 2026**
*Mobilier sur mesure · Architecture d'intérieur · Showrooms La Soukra (Tunis) & Sousse*

**Référence de niveau :** Roche Bobois · Minotti · Poliform · Baxter · B&B Italia

---

# SOMMAIRE

**PARTIE I — FONDATIONS**
1. Vision et principes directeurs
2. Direction artistique et design system
3. Système de mouvement (animations)
4. Stratégie image — qualité maximale sans production vidéo

**PARTIE II — ARCHITECTURE ET PAGES**
5. Arborescence complète
6. Home
7. Collections et sous-catégories
8. Page Produit premium
9. Configurateur sur mesure
10. Sur mesure / Projet sur mesure
11. Inspirations
12. Nos réalisations
13. Espace professionnel
14. Showroom
15. À propos
16. Contact
17. Recherche intelligente

**PARTIE III — DIFFÉRENCIATION**
18. Fonctionnalités « effet WOW »

**PARTIE IV — BACK-OFFICE**
19. Espace d'administration complet

**PARTIE V — TECHNIQUE**
20. Stack et architecture applicative
21. Modèle de données
22. API
23. Performance, SEO, accessibilité, sécurité
24. Lotissement et planning

---
---

# PARTIE I — FONDATIONS

## 1. Vision et principes directeurs

### 1.1 L'intention

Le site n'est pas un catalogue. C'est une **salle d'exposition qui ne ferme jamais**.

Un catalogue répond à la question « qu'est-ce que vous vendez ? ». Une salle d'exposition répond à « qui êtes-vous ? ». Un client qui s'apprête à engager 15 000 à 80 000 dinars dans l'aménagement de sa maison n'achète pas un canapé : il achète la certitude d'avoir affaire à des gens sérieux. Chaque pixel du site doit produire cette certitude.

### 1.2 Les sept principes non négociables

**1 — Le vide est un matériau.**
Les marques de luxe se distinguent par ce qu'elles ne montrent pas. Une section = une idée. Jamais deux messages concurrents dans un même écran. Si un bloc semble « vide », c'est probablement qu'il est correct.

**2 — L'image domine, le texte accompagne.**
Ratio cible : 70 % surface visuelle / 30 % surface texte. Les titres sont courts (moins de 8 mots). Les paragraphes ne dépassent jamais 3 lignes sur desktop.

**3 — Le mouvement est lent.**
Rien ne rebondit. Rien ne clignote. Les transitions durent 600 à 900 ms avec des courbes d'accélération douces. La lenteur signale la maîtrise ; la vitesse signale le discount.

**4 — Une seule action par écran.**
Chaque section a un CTA principal, éventuellement un CTA secondaire en lien souligné. Jamais trois boutons de même poids.

**5 — Le prix ne s'affiche pas, il se demande.**
« Prix sur demande » sur les pièces sur mesure. Cela n'est pas de l'opacité : c'est la codification du sur-mesure. Sur les pièces catalogue et la décoration, le prix s'affiche normalement.

**6 — Le mobile est le vrai site.**
80 % du trafic viendra d'Instagram, donc du téléphone, souvent en 4G. Le site doit être conçu mobile d'abord et rester spectaculaire dans un écran de 390 px.

**7 — La performance fait partie du luxe.**
Un site lent est un site bon marché, quelle que soit sa beauté. Objectif : LCP < 2,0 s en 4G tunisienne.

### 1.3 Les émotions à provoquer, dans l'ordre

| Moment | Émotion visée | Levier |
|---|---|---|
| 0–3 s | Saisissement | Hero plein écran, silence visuel, une seule phrase |
| 3–15 s | Curiosité | Les trois métiers, mouvement au scroll |
| 15–60 s | Désir | Collections en situation, matières en gros plan |
| 1–3 min | Confiance | Atelier, réalisations, témoignages nommés |
| 3 min + | Projection | Configurateur, moodboard, AR |
| Sortie | Engagement | Devis, WhatsApp, ou RDV showroom |

---

## 2. Direction artistique et design system

### 2.1 Palette chromatique

La palette est dérivée de l'identité existante (logo noir circulaire, univers bouclé beige, bois naturel).

| Token | Valeur | Usage |
|---|---|---|
| `--noir-encre` | `#0A0A0A` | Fond des sections immersives, texte principal sur clair |
| `--noir-doux` | `#1C1B19` | Cartes sur fond noir, séparateurs |
| `--blanc-casse` | `#F7F4EF` | Fond dominant du site |
| `--blanc-pur` | `#FFFFFF` | Fiches produit, zones de saisie |
| `--beige-boucle` | `#E3D9CB` | Blocs d'accent, fonds de section alternés |
| `--sable` | `#C9BCA9` | Bordures, états survolés |
| `--bois-naturel` | `#A87F52` | Accents chauds, icônes matière |
| `--bronze` | `#9C7B4D` | Filets, soulignés, éléments actifs |
| `--gris-pierre` | `#8B8880` | Texte secondaire, légendes |
| `--gris-fume` | `#4A4845` | Texte courant sur fond clair |

**Règles d'usage**
- Aucune couleur vive nulle part. Pas de rouge d'alerte : les erreurs de formulaire s'affichent en `--gris-fume` avec une bordure `--bronze`.
- Le noir et le blanc cassé alternent par section pour créer un rythme respiratoire.
- Le bronze est rare : il ne doit apparaître que 2 à 3 fois par écran maximum.
- Contraste minimum AA respecté partout (voir §23.3).

### 2.2 Typographie

**Titres — serif à contraste élevé**
Police recommandée : **Canela** (payante, idéale) ou **Cormorant Garamond** / **Playfair Display** (gratuites Google Fonts).

**Textes — sans-serif neutre**
Police recommandée : **Inter** ou **Neue Haas Grotesk Display**. Inter est gratuite, variable, et excellente en performance.

**Échelle typographique (desktop / mobile)**

| Rôle | Taille | Graisse | Interlignage | Interlettrage |
|---|---|---|---|---|
| Display (hero) | 96 / 44 px | 300 | 1.05 | −0.02em |
| H1 | 64 / 34 px | 300 | 1.1 | −0.015em |
| H2 | 44 / 28 px | 300 | 1.15 | −0.01em |
| H3 | 28 / 22 px | 400 | 1.25 | 0 |
| Corps large | 20 / 17 px | 400 | 1.7 | 0 |
| Corps | 16 / 15 px | 400 | 1.75 | 0 |
| Légende | 13 / 12 px | 400 | 1.5 | 0.08em |
| Suréclat (labels) | 11 / 11 px | 500 | 1.4 | 0.18em, MAJUSCULES |

**Règles**
- Les titres sont toujours en graisse légère (300). La finesse est un marqueur de luxe ; le gras est un marqueur de promotion.
- Les labels de section sont en petites majuscules très espacées (`0.18em`) — signature Minotti / Poliform.
- Largeur de ligne maximale : 65 caractères. Jamais de paragraphe pleine largeur.

### 2.3 Grille et espacement

- Grille desktop : **12 colonnes**, gouttière 32 px, marge latérale 80 px (120 px au-delà de 1600 px).
- Grille tablette : 8 colonnes, gouttière 24 px, marge 48 px.
- Grille mobile : 4 colonnes, gouttière 16 px, marge 24 px.
- Largeur maximale du contenu texte : 1280 px. Les images peuvent aller en pleine largeur (`bleed`).

**Échelle d'espacement (base 8)**
`4 · 8 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160 · 200`

Espacement vertical entre sections : **160 px desktop / 96 px mobile**. C'est généreux, et c'est volontaire.

### 2.4 Composants de base

**Boutons**

| Variante | Aspect | Usage |
|---|---|---|
| Primaire | Fond `--noir-encre`, texte `--blanc-casse`, 56 px de haut, rayon 0 (angles droits), padding 32 px | CTA principal |
| Primaire inversé | Fond `--blanc-casse`, texte noir | Sur fond sombre |
| Secondaire | Contour 1 px `--noir-encre`, fond transparent | Action alternative |
| Texte | Souligné animé (le trait se dessine de gauche à droite au survol) | Liens de navigation contextuelle |

Aucun bouton n'a d'angles arrondis. Aucun n'a d'ombre portée. Au survol : inversion des couleurs sur 400 ms, pas de translation.

**Cartes produit**
Image 4:5, aucun cadre, aucune ombre. Le nom et le prix apparaissent sous l'image, alignés à gauche, en corps 16 px. Au survol : l'image passe au second visuel en fondu croisé (600 ms) et se met à l'échelle 1.03 très lentement.

**Formulaires**
Champs sans bordure, uniquement un filet de 1 px en bas (`--sable`), qui devient `--bronze` au focus. Le label monte au-dessus du champ en 250 ms lors de la saisie. Aucune couleur d'erreur agressive.

**Curseur personnalisé (desktop uniquement)**
Point de 8 px suivant la souris avec une inertie de 0,08. Au survol d'une image cliquable, il se dilate en cercle de 64 px contenant le mot « VOIR ». Sur les galeries, il affiche « ← GLISSER → ». Désactivé sur tactile et si `prefers-reduced-motion`.

---

## 3. Système de mouvement

### 3.1 Tokens de motion

| Token | Durée | Courbe | Usage |
|---|---|---|---|
| `--motion-instant` | 150 ms | `ease-out` | Retours d'état (focus, coche) |
| `--motion-rapide` | 300 ms | `cubic-bezier(0.25,0.1,0.25,1)` | Micro-interactions |
| `--motion-base` | 600 ms | `cubic-bezier(0.16,1,0.3,1)` | Apparitions au scroll |
| `--motion-ample` | 900 ms | `cubic-bezier(0.16,1,0.3,1)` | Transitions de page, hero |
| `--motion-cine` | 1400 ms | `cubic-bezier(0.83,0,0.17,1)` | Révélations majeures |

### 3.2 Répertoire d'animations

**A. Révélation par masque (signature du site)**
Le texte et les images apparaissent depuis un masque qui se lève verticalement, comme un rideau. Jamais un simple fondu. Durée 900 ms, décalage de 80 ms entre les lignes.

**B. Parallaxe contenu**
Les images de fond se déplacent à 0,85× la vitesse du scroll — assez pour créer de la profondeur, pas assez pour donner le vertige.

**C. Titre lettre par lettre**
Sur les titres de section uniquement (H2), les caractères montent depuis un masque avec 25 ms de décalage. Effet Apple. À n'utiliser que 3 à 4 fois sur tout le site, sinon il devient gadget.

**D. Zoom lent d'image au scroll (Ken Burns)**
L'image démarre à `scale(1.12)` et revient à `scale(1)` sur la durée de sa traversée du viewport. **C'est le remplaçant principal de la vidéo** (voir §4).

**E. Défilement horizontal ancré**
Sur la section Collections de la home, le scroll vertical se traduit en défilement horizontal pendant 3 écrans, puis se libère. GSAP ScrollTrigger avec `pin`.

**F. Transition de page à volet**
Au changement de page, un voile `--noir-encre` monte du bas (500 ms), la nouvelle page se charge, le voile continue vers le haut (500 ms). Le logo Mood reste visible pendant la transition.

**G. Compteurs**
Sur la page À propos : « depuis 2018 », « 340 projets livrés », « 2 showrooms ». Incrémentation sur 1,8 s à l'entrée en viewport.

**H. Curseur magnétique**
Les boutons attirent légèrement le curseur dans un rayon de 60 px (déplacement max 8 px). Détail subtil, très remarqué.

### 3.3 Règles de discipline

- Jamais plus de **deux animations simultanées** dans le viewport.
- Toute animation d'entrée se déclenche à **20 % de visibilité** de l'élément, une seule fois.
- `prefers-reduced-motion: reduce` → toutes les animations deviennent des fondus de 200 ms, les parallaxes et le pinning sont désactivés, le curseur personnalisé disparaît.
- Aucune animation ne bloque l'interaction. Le contenu est lisible même si le JS échoue.

---

## 4. Stratégie image — qualité maximale sans production vidéo

**C'est le chapitre le plus important du projet, compte tenu de la contrainte de moyens.**

Le budget ne permet ni tournage vidéo, ni vidéo générée par IA. Les visuels disponibles sont : les photos réelles du showroom et des réalisations (déjà présentes sur Instagram) et des visuels générés/retouchés par IA. Il faut donc obtenir un rendu cinématique **avec des images fixes uniquement**. C'est parfaitement faisable — Minotti et Baxter le font sur une grande partie de leurs pages.

### 4.1 Remplacer la vidéo : les cinq techniques

**1 — Hero en Ken Burns (recommandé pour la home)**
Une image fixe très haute définition, animée par un zoom lent de `scale(1.0)` à `scale(1.08)` sur 18 secondes, en boucle avec inversion. Ajouter un très léger déplacement horizontal (2 %). Le cerveau lit cela comme un plan cinéma. Coût : zéro.

**2 — Séquence de plans fixes en fondu croisé**
Trois à cinq images du showroom qui se succèdent en fondu de 1200 ms toutes les 6 secondes, chacune avec son propre Ken Burns. Effet de film sans fichier vidéo. Poids total : ~1,2 Mo contre 15 Mo pour une vidéo.

**3 — Parallaxe multi-couches**
Découper une photo en 2 ou 3 plans (avant-plan / meuble / fond) avec détourage, puis les faire défiler à des vitesses différentes. Donne une véritable sensation de profondeur 3D à partir d'une photo plate. À réserver à 1 ou 2 sections clés (coût de production : découpe manuelle).

**4 — Révélation par masque au scroll**
L'image se dévoile progressivement à mesure qu'on descend, via un `clip-path` animé. Très spectaculaire, coût nul.

**5 — Comparateur avant/après**
Un curseur glissant entre deux photos (pièce vide / pièce aménagée). C'est la fonctionnalité la plus impressionnante possible avec deux simples images fixes, et elle vend directement le service d'architecture d'intérieur.

> **À proscrire :** les GIF (poids énorme, qualité désastreuse) et les vidéos compressées à bas débit (le grain trahit immédiatement le manque de moyens). Mieux vaut une image fixe parfaite qu'une vidéo médiocre.

### 4.2 Pipeline de production des images — zéro perte de qualité

**Étape 1 — Source**
Toujours conserver un master en **PNG ou TIFF non compressé**, minimum **3000 px** sur le grand côté. Ne jamais travailler à partir d'une image récupérée depuis Instagram (Instagram recompresse à 1080 px et détruit les détails).
→ Pour les visuels générés par IA : demander la résolution maximale, puis passer par un agrandissement dédié (Topaz Gigapixel, Upscayl gratuit, ou un upscaler en ligne) jusqu'à 4000–6000 px avant toute retouche.

**Étape 2 — Archivage**
Le master reste dans un dossier `/masters/` **hors du site**. On ne le remplace jamais, on ne l'écrase jamais. Toutes les versions publiées sont regénérées à partir de lui.

**Étape 3 — Génération automatisée des dérivés**
Sur le serveur, le composant `next/image` (ou un CDN type Cloudinary / imgix) génère automatiquement pour chaque image :

| Largeur | Format | Usage |
|---|---|---|
| 400 px | AVIF + WebP | Mobile, vignettes |
| 800 px | AVIF + WebP | Mobile 2×, cartes |
| 1200 px | AVIF + WebP | Tablette, colonnes |
| 1920 px | AVIF + WebP | Desktop plein écran |
| 2560 px | AVIF + WebP | Écrans 2K |
| 3840 px | AVIF | Zoom produit 4K, écrans Retina |

**Réglages de compression**
- AVIF : qualité 62 à 68 (imperceptible, ~50 % plus léger que le WebP)
- WebP : qualité 82 à 86 (jamais en dessous de 80 sur les gros plans de matière)
- Chroma subsampling **4:4:4** sur les images produit — le 4:2:0 fait baver les textiles beiges et les bois. C'est le réglage que 90 % des sites ratent.
- Jamais de double compression : toujours repartir du master.

**Étape 4 — Diffusion**
- `srcset` + `sizes` corrects sur chaque image, sinon le navigateur télécharge une image trop lourde.
- Format AVIF servi en priorité, WebP en repli, JPEG en dernier recours.
- Lazy loading sur tout sauf le hero (le hero est en `priority` + `preload`).
- LQIP : un placeholder flouté de 20 px encodé en base64 s'affiche instantanément, puis l'image nette se substitue en fondu de 400 ms. Aucun écran blanc, jamais.
- CDN obligatoire avec cache long (1 an) et noms de fichiers versionnés.

### 4.3 Le zoom « 8K » de la page produit

Le zoom haute définition ne charge **jamais** une image de 8000 px d'un coup. Technique correcte :

1. Affichage normal : image 1200 px.
2. Au clic sur « Zoom », ouverture d'une lightbox plein écran chargeant la version 2560 px.
3. Le zoom profond utilise un système de **tuiles pyramidales** (IIIF / OpenSeadragon / Cloudinary zoom) : l'image de 6000–8000 px est découpée en carrés de 256 px, et seules les tuiles visibles à ce niveau de zoom sont téléchargées.

Résultat : détail de la couture, du grain du bois et de la trame du tissu visible à 100 %, sans jamais dépasser 300 ko de transfert. C'est exactement ce que font les sites de haute joaillerie.

### 4.4 Direction photographique — cohérence obligatoire

Pour que des images d'origines différentes (photos réelles + visuels IA) forment un ensemble crédible, il faut imposer une charte :

- **Température** : chaude, 5200–5600 K. Aucune image froide/bleutée.
- **Lumière** : latérale, douce, une seule source dominante. Jamais de flash frontal.
- **Étalonnage** : appliquer le même profil à toutes les images (noirs légèrement remontés, hautes lumières contenues, saturation −8 %, léger virage bronze dans les tons moyens). Un preset Lightroom unique appliqué à l'ensemble suffit à unifier des sources hétérogènes.
- **Cadrage** : ratios stricts — 3:2 (paysage éditorial), 4:5 (produit vertical), 16:9 (bandeaux), 1:1 (grille Inspirations).
- **Composition** : un seul sujet net, le reste en profondeur de champ courte.
- **Interdits** : personnes reconnaissables non autorisées, logos de tiers, désordre en arrière-plan, sur-décoration.

**Contrôle qualité IA — checklist avant publication de tout visuel généré**
- [ ] Aucune main, aucun visage déformé (préférer les intérieurs sans personnages)
- [ ] Perspectives cohérentes (les lignes de fuite convergent réellement)
- [ ] Pieds de meubles au nombre correct et symétriques
- [ ] Textures sans motif répété visible
- [ ] Ombres cohérentes avec la source lumineuse
- [ ] Réflexions correctes dans miroirs et surfaces vitrées
- [ ] Aucun texte parasite généré
- [ ] Résolution ≥ 3000 px après upscaling
- [ ] Le meuble représenté correspond réellement à un produit fabricable par l'atelier

> **Point d'honnêteté commerciale :** les visuels générés par IA doivent illustrer des **ambiances** et des **inspirations**, jamais être présentés comme des photos de réalisations réelles. Sur la page Réalisations, uniquement des photos authentiques. Cette rigueur protège la marque.

### 4.5 Budget image par page

| Page | Poids maximum (première vue) | Nombre d'images chargées d'emblée |
|---|---|---|
| Home | 900 ko | 1 (le hero) |
| Collection | 700 ko | 6 vignettes |
| Produit | 800 ko | 1 principale + 4 miniatures |
| Inspirations | 600 ko puis chargement infini | 12 vignettes |

---
---

# PARTIE II — ARCHITECTURE ET PAGES

## 5. Arborescence complète

```
/                                   HOME
│
├── /collections                    COLLECTIONS (vue d'ensemble)
│   ├── /collections/salon
│   ├── /collections/salle-a-manger
│   ├── /collections/chambres
│   ├── /collections/decoration
│   └── /collections/[categorie]/[produit]      PAGE PRODUIT
│
├── /sur-mesure                     SUR MESURE (manifeste + savoir-faire)
│   ├── /sur-mesure/configurateur   CONFIGURATEUR
│   ├── /sur-mesure/matieres        NUANCIER (bois, tissus, cuirs, métaux)
│   └── /sur-mesure/projet          PROJET SUR MESURE (dépôt de plans)
│
├── /inspirations                   INSPIRATIONS (grille type Pinterest)
│   └── /inspirations/[slug]        Moodboard détaillé
│
├── /realisations                   NOS RÉALISATIONS
│   └── /realisations/[slug]        Étude de cas
│
├── /professionnels                 ESPACE PRO
│   └── /professionnels/inscription
│
├── /showroom                       SHOWROOMS
│   ├── /showroom/tunis
│   ├── /showroom/sousse
│   └── /showroom/rendez-vous
│
├── /a-propos                       À PROPOS
├── /contact                        CONTACT
├── /recherche                      RÉSULTATS DE RECHERCHE
│
├── /compte                         ESPACE CLIENT
│   ├── /compte/devis
│   ├── /compte/projets
│   ├── /compte/moodboards
│   └── /compte/favoris
│
├── /journal                        JOURNAL (SEO)
│   └── /journal/[slug]
│
├── /mentions-legales · /cgv · /politique-confidentialite
│
└── /admin                          BACK-OFFICE (voir Partie IV)
```

### 5.1 Navigation

**En-tête — état initial (sur le hero)**
Transparent, texte blanc. Logo Mood centré. À gauche : `COLLECTIONS · SUR MESURE · INSPIRATIONS · RÉALISATIONS`. À droite : `SHOWROOM · CONTACT`, icône recherche, icône compte, icône moodboard (avec pastille compteur).

**En-tête — état ancré (après 80 px de scroll)**
Le fond devient `--blanc-casse` à 96 % avec flou d'arrière-plan (`backdrop-filter: blur(20px)`), hauteur réduite de 96 px à 68 px, texte passe en noir. Transition 400 ms. À la remontée du scroll, l'en-tête réapparaît ; à la descente, il se rétracte.

**Méga-menu Collections**
Au survol, un panneau pleine largeur descend en 500 ms : 4 colonnes de sous-catégories à gauche, et à droite un visuel de la pièce mise en avant du mois qui change au survol de chaque lien. Fond `--blanc-casse`, filet bronze en bas.

**Menu mobile**
Plein écran, fond `--noir-encre`. Les entrées apparaissent une par une avec 60 ms de décalage. Typographie display 32 px. En bas : téléphone, WhatsApp, Instagram, adresses des deux showrooms.

**Barre d'action flottante mobile (bas d'écran)**
Trois actions permanentes : `WhatsApp` · `Devis` · `Showroom`. Apparaît après 30 % de scroll, disparaît au scroll vers le bas. C'est le principal levier de conversion mobile.

---

## 6. HOME

### 6.1 Pourquoi cette page existe

C'est la page qui reçoit tout le trafic Instagram. Elle a **3 secondes** pour prouver que Mood Store n'est pas un atelier local mais une maison de création. Son unique mission : transformer l'admiration en intention de contact.

**Émotion visée :** saisissement, puis désir, puis confiance.

### 6.2 Structure section par section

---

#### SECTION 1 — HERO

**Contenu**
- Image plein écran (100vh) : le showroom La Soukra en lumière naturelle rasante, ou la pièce signature (le mouton bouclé sur le fauteuil brun) — un visuel immédiatement identifiable et déjà associé à la marque sur Instagram.
- Voile dégradé du bas vers le haut : `linear-gradient(to top, rgba(10,10,10,.55), transparent 60%)` pour garantir la lisibilité.
- Logo Mood en filigrane discret en haut au centre.
- Titre display : **« Une maison avec âme. »**
- Sous-titre corps large : *L'art du sur-mesure, depuis 2018.*
- CTA primaire inversé : **Découvrir les collections**
- CTA texte souligné : *Prendre rendez-vous au showroom*
- Indicateur de scroll : trait vertical de 40 px, animé en descente continue, avec la mention `DÉFILER`.

**Images**
1 master 3840×2160, servi en AVIF, `priority`, LQIP flouté immédiat.

**Animations**
- Au chargement : le voile noir se lève (`--motion-cine`, 1400 ms), l'image apparaît en Ken Burns démarré à `scale(1.06)`.
- Le titre se révèle ligne par ligne par masque montant, décalage 120 ms, démarrage à +400 ms.
- Le sous-titre et les CTA apparaissent en fondu + translation de 20 px, à +900 ms et +1100 ms.
- Ken Burns permanent : `scale(1.0)` → `scale(1.08)` sur 20 s, aller-retour infini.
- Au scroll : le hero se fige et le contenu suivant glisse par-dessus (effet rideau), tandis que le titre s'estompe et monte légèrement.

**Variante « séquence »** (recommandée si 4 bons visuels sont disponibles)
4 images en fondu croisé de 1200 ms toutes les 7 s, chacune avec son propre Ken Burns. Points indicateurs discrets en bas à droite. Poids total : 1,2 Mo, contre 15 Mo pour une vidéo.

**Micro-interactions**
- Le curseur personnalisé se dilate au survol des CTA.
- Le CTA primaire attire le curseur (magnétisme, 8 px max).
- Clic sur l'indicateur de scroll → défilement doux vers la section 2 (1000 ms, ease-in-out).

---

#### SECTION 2 — LES TROIS MÉTIERS

**Pourquoi :** en 3 secondes, le visiteur doit savoir exactement ce que fait Mood Store. C'est la section qui empêche le rebond.

**Contenu**
Trois colonnes égales pleine hauteur (70vh), fond `--blanc-casse`.

| | Visuel | Titre | Ligne | CTA |
|---|---|---|---|---|
| 1 | Gros plan atelier / assemblage | **Meuble sur mesure** | Chaque pièce dessinée pour votre espace. | Configurer une pièce |
| 2 | Salon complet aménagé | **Architecture d'intérieur** | De l'esquisse à la remise des clés. | Voir nos réalisations |
| 3 | Détail décoration, mouton bouclé | **Décoration & objets** | Les détails qui font une maison. | Découvrir |

**Animations**
- Apparition décalée des trois colonnes (150 ms d'écart), révélation par masque montant.
- Au survol d'une colonne : son image passe en `scale(1.05)` sur 800 ms, **les deux autres colonnes se désaturent à 40 % et s'assombrissent à 70 %** sur 500 ms. Effet de focus très fort, signature Poliform.
- Le titre de la colonne survolée monte de 8 px, son CTA se souligne de gauche à droite.

**Mobile :** empilement vertical, chaque bloc en 60vh, sans effet de désaturation.

---

#### SECTION 3 — COLLECTIONS EN VEDETTE (défilement horizontal ancré)

**Pourquoi :** montrer la profondeur du catalogue sans obliger à cliquer. C'est aussi le moment le plus « premium » du site.

**Contenu**
- Label suréclat : `NOS COLLECTIONS`
- H2 : **Des pièces qui traversent le temps**
- Rail horizontal de 6 à 8 cartes produit (image 4:5, nom, ligne, « Prix sur demande » ou prix).
- Dernière carte du rail : bloc noir « Voir tout le catalogue → ».

**Animations**
- La section s'ancre (`pin`) ; le scroll vertical se traduit en défilement horizontal sur environ 3 hauteurs d'écran, puis se libère naturellement.
- Le H2 se révèle lettre par lettre (25 ms de décalage).
- Chaque carte entre par la droite avec un léger `skewX(-2deg)` qui se redresse (effet inertie).
- Barre de progression fine en bas, couleur bronze, remplie proportionnellement.

**Micro-interactions**
- Curseur « ← GLISSER → » sur le rail.
- Au survol d'une carte : fondu croisé vers un second visuel (600 ms) + `scale(1.03)`.
- Glissement tactile natif sur mobile avec magnétisme sur chaque carte.
- Bouton cœur discret en haut à droite de chaque carte → ajoute au moodboard, avec animation de remplissage 300 ms.

**Mobile :** carrousel horizontal simple à magnétisme, sans ancrage (le pinning est trop fragile sur mobile).

---

#### SECTION 4 — LE SUR-MESURE (bloc immersif sombre)

**Pourquoi :** c'est le cœur de l'activité et la vraie différence face aux importateurs. Il doit occuper un écran entier, pas une bande.

**Contenu**
- Fond `--noir-encre` pleine largeur, 100vh.
- Image de fond : gros plan d'un nuancier de tissus / d'un échantillonnier bois, très faiblement éclairée, en parallaxe.
- H2 display centré : **« Votre pièce n'existe pas encore. »**
- Deuxième ligne, en bronze : *Dessinons-la ensemble.*
- Trois points en ligne, séparés par des filets : `Vos dimensions` · `Vos matières` · `Notre atelier`
- CTA primaire inversé : **Ouvrir le configurateur**
- CTA texte : *Découvrir nos matières*

**Animations**
- Parallaxe 0,8× sur l'image de fond.
- Les deux lignes du titre se révèlent par masque, la seconde avec 300 ms de retard.
- Les trois points apparaissent en cascade (100 ms), leurs filets de séparation se dessinent horizontalement.
- Au survol du CTA, le fond de la section s'éclaircit très légèrement (de `#0A0A0A` à `#141312`) sur 600 ms — effet quasi subliminal, très remarqué.

---

#### SECTION 5 — RÉALISATIONS RÉCENTES

**Pourquoi :** preuve. C'est la section qui convainc les gros budgets d'architecture d'intérieur.

**Contenu**
- Label : `NOS RÉALISATIONS`
- H2 : **Des espaces livrés, pas des rendus**
- Disposition éditoriale asymétrique : projet 1 en grand format à gauche (7 colonnes), projets 2 et 3 empilés à droite (5 colonnes), volontairement décalés verticalement.
- Chaque bloc : image, nom du projet, typologie + lieu (ex. *Villa contemporaine — La Marsa*), surface, année.
- CTA texte : *Voir les 40 réalisations →*

**Animations**
- Décalage vertical au scroll : la colonne de droite défile 12 % plus vite que celle de gauche. Effet éditorial magazine.
- Chaque image se révèle par `clip-path` montant sur 900 ms.
- Au survol : le nom du projet se souligne, un badge « Voir le projet » monte depuis le bas de l'image.

---

#### SECTION 6 — AVANT / APRÈS (le bloc qui vend l'architecture d'intérieur)

**Pourquoi :** c'est la démonstration la plus efficace possible avec deux images fixes, et elle rend tangible la valeur du service.

**Contenu**
- H2 : **La même pièce. Deux vies.**
- Comparateur plein écran : une poignée verticale glissante entre la photo « avant » (pièce brute) et « après » (pièce aménagée).
- Légende sous le comparateur : nom du projet, durée du chantier, lien vers l'étude de cas.

**Interactions**
- La poignée suit la souris en survol (mode « auto »), ou se saisit au clic (mode « verrouillé »).
- À l'entrée en viewport, la poignée effectue automatiquement un aller-retour de 30 % → 70 % → 50 % sur 2 s pour signaler qu'elle est manipulable.
- Sur mobile : glissement tactile, avec une infobulle « Glissez » qui disparaît au premier contact.

---

#### SECTION 7 — L'ATELIER

**Pourquoi :** c'est le savoir-faire qui justifie le prix. Toutes les grandes maisons consacrent une place majeure à leurs artisans.

**Contenu**
- Fond `--beige-boucle`.
- Colonne texte à gauche (5 colonnes) : label `LE SAVOIR-FAIRE`, H2 **« Fait à la main, à Tunis. »**, deux courts paragraphes, CTA texte *Visiter l'atelier →*
- Mosaïque de 4 images à droite (7 colonnes) : mains au travail, machine, matière brute, pièce finie. Tailles inégales, disposées en composition libre.

**Animations**
- Les 4 images entrent avec des amplitudes et délais différents (parallaxe individuelle de 0,9× à 1,1×), donnant une impression de composition vivante.
- Le texte reste ancré pendant que les images défilent (sticky sur desktop).

---

#### SECTION 8 — NOS SHOWROOMS

**Contenu**
- Deux cartes pleine hauteur côte à côte : **La Soukra — Tunis** et **Sousse — Slim Centre**.
- Chacune : photo du showroom, adresse, horaires, distance calculée si la géolocalisation est autorisée, CTA **Prendre rendez-vous**, lien *Itinéraire*.

**Animations**
- Au survol : l'image se met à l'échelle 1.06 et le voile sombre s'éclaircit, révélant les informations pratiques qui montent depuis le bas.

---

#### SECTION 9 — TÉMOIGNAGES

**Contenu**
Trois témoignages, chacun avec : photo du projet réalisé, citation courte (2 lignes maximum), prénom + nom, ville, typologie de projet. **Jamais de témoignage anonyme** — cela détruit la crédibilité.

**Animations**
Rotation automatique toutes les 8 s en fondu, avec pause au survol. Guillemet ouvrant en très grand format, en `--sable`, en filigrane derrière le texte.

---

#### SECTION 10 — JOURNAL

Trois derniers articles, format éditorial : image 3:2, catégorie en suréclat, titre serif, date. CTA *Tout le journal →*.

---

#### SECTION 11 — INSTAGRAM + NEWSLETTER

**Contenu**
- Bandeau de 6 dernières publications Instagram en défilement horizontal continu et lent (marquee, 60 s par cycle, pause au survol).
- `@mood_store_tips_and_tricks — 12,5 k abonnés` + CTA *Nous suivre*.
- Bloc newsletter : *« Recevez nos nouveautés et inspirations. »* Un seul champ e-mail, bouton en flèche.

---

#### SECTION 12 — PIED DE PAGE

Fond `--noir-encre`. Quatre colonnes : Collections / Maison / Services / Contact. Logo Mood en grand en filigrane. Adresses des deux showrooms, téléphone **51 953 889**, Instagram, WhatsApp. Bas de page : mentions légales, CGV, confidentialité, crédits.

**Animation :** le logo en filigrane se révèle très lentement en `opacity 0 → 0.06` à l'entrée du footer.

---

## 7. COLLECTIONS

### 7.1 Page « Collections » (vue d'ensemble) — `/collections`

**Pourquoi :** orienter vers la bonne famille de produits sans imposer un filtre technique dès l'entrée.

**Hero**
Demi-hauteur (60vh), image de salon complet, titre **Collections**, une ligne : *Des pièces pensées pour durer.*

**Contenu**
Quatre grands blocs pleine largeur empilés — Salon, Salle à manger, Chambres, Décoration. Chaque bloc : 70vh, image de fond en parallaxe, titre display centré, nombre de références, CTA *Découvrir*.

**Animations**
Alternance du sens d'entrée (bloc 1 depuis la gauche, bloc 2 depuis la droite, etc.). Au survol, l'image passe en `scale(1.05)` et le voile s'éclaircit de 55 % à 35 %.

### 7.2 Pages de catégorie — `/collections/salon`, `/salle-a-manger`, `/chambres`, `/decoration`

**Hero**
40vh, image d'ambiance de la catégorie, fil d'Ariane, titre, compteur de produits.

**Barre de filtres (ancrée sous l'en-tête au scroll)**

| Filtre | Type | Valeurs |
|---|---|---|
| Sous-type | Puces | Canapés, Fauteuils, Tables basses, Consoles, Meubles TV… |
| Matière | Liste à cocher | Bois massif, Placage, Métal, Marbre, Verre |
| Revêtement | Liste à cocher | Bouclé, Velours, Lin, Cuir, Tissu technique |
| Couleur | Pastilles | Beige, Écru, Brun, Noir, Vert, Terracotta, Gris |
| Style | Puces | Minimaliste, Japandi, Moderne, Contemporain, Luxury |
| Dimensions | Curseur double | Largeur, profondeur |
| Disponibilité | Bascule | En showroom · Sur commande · Sur mesure |
| Tri | Menu | Nouveautés · Populaires · Prix ↑ · Prix ↓ |

Les filtres s'écrivent dans l'URL (`?matiere=bois&couleur=beige`) : les combinaisons deviennent indexables par Google — levier SEO majeur.

**Grille**
3 colonnes desktop / 2 tablette / 1 mobile (2 en mode compact). Cartes image 4:5.
**Rupture éditoriale :** toutes les 6 cartes, insérer un bloc pleine largeur — photo d'ambiance ou citation. Cela évite l'effet catalogue et rappelle qu'on est dans une maison de création.

**Animations**
- Les cartes apparaissent par vagues de 3, décalage 80 ms, révélation par masque.
- Au changement de filtre : les cartes sortantes disparaissent en fondu + `scale(0.96)` (250 ms), les entrantes apparaissent en cascade. Transition FLIP pour les cartes conservées.
- Chargement à la demande via bouton « Voir plus » (meilleur pour le SEO que le défilement infini) + préchargement anticipé de la page suivante.

**Micro-interactions**
- Aperçu rapide : au survol prolongé (600 ms) d'une carte, un bouton `APERÇU` apparaît → ouvre un panneau latéral avec galerie, variantes et CTA, sans quitter la grille.
- Bouton cœur → moodboard.
- Les filtres actifs s'affichent en puces supprimables au-dessus de la grille.

---

## 8. PAGE PRODUIT PREMIUM

C'est la page la plus importante du site en termes de conversion. Elle doit donner l'impression de tenir la pièce entre les mains.

### 8.1 Disposition générale

Deux colonnes sur desktop :
- **Gauche (7 colonnes)** — galerie qui défile normalement.
- **Droite (5 colonnes)** — panneau d'information **ancré** (`sticky`) qui reste visible pendant tout le défilement de la galerie.

Sur mobile : galerie en carrousel plein écran en haut, informations en dessous, barre d'action fixée en bas.

### 8.2 Colonne gauche — galerie immersive

**Composition**
1. Visuel principal 4:5, pleine largeur de la colonne
2. Vue en situation (le meuble dans un intérieur complet)
3. Gros plan matière — la couture, la trame, le grain du bois
4. Détail de piètement / finition
5. Vue de dos ou de trois-quarts
6. Schéma coté (dessin technique au trait, sur fond blanc cassé)
7. Ambiance complète

**Zoom haute définition**
- Au survol sur desktop : loupe de 240 px suivant le curseur, agrandissement ×2,5 depuis la version 2560 px.
- Au clic : lightbox plein écran, fond `--noir-encre` à 98 %, chargement pyramidal par tuiles (voir §4.3). Zoom molette / pincement jusqu'à 400 %, déplacement par glisser. Miniatures en bas. Fermeture par `Échap` ou clic hors zone.
- Sur mobile : double-tap pour zoomer, pincement pour ajuster.

**Animations**
- Chaque image se révèle par masque montant à son entrée en viewport (700 ms).
- Léger parallaxe interne : l'image se déplace de −4 % à +4 % dans son cadre pendant le défilement.
- Le curseur devient un cercle « ZOOM + » sur la galerie.

### 8.3 Colonne droite — panneau ancré

**En-tête**
- Fil d'Ariane : `Collections / Salon / Canapés`
- Nom du produit en H1 serif
- Ligne de collection (ex. *Ligne Boucle*)
- Description éditoriale : 2 à 3 phrases, ton narratif, jamais technique
- Prix : **« Prix sur demande »** pour le sur-mesure, ou prix affiché pour le catalogue et la décoration

**Sélecteurs de variantes**

| Sélecteur | Présentation | Comportement |
|---|---|---|
| **Revêtement** | Pastilles rondes de 40 px, texture réelle photographiée (pas une couleur unie) | Au survol : infobulle avec nom, composition, résistance Martindale. Au clic : le visuel principal change en fondu croisé de 500 ms |
| **Couleur** | Pastilles groupées par famille (neutres / terreux / profonds) | Idem |
| **Bois** | Vignettes rectangulaires 64×40 px, grain visible | Chêne, noyer, frêne, teck, placage laqué |
| **Dimensions** | Boutons de tailles prédéfinies + option « Sur mesure » | Le schéma coté se met à jour, le délai et le prix se recalculent |
| **Piètement** | Icônes au trait | Métal noir, laiton, bois tourné, socle plein |

**Règle de rendu :** chaque combinaison majeure doit disposer d'un visuel réel. Pour les combinaisons secondaires, superposition d'un calque de texture en `multiply` sur un masque du meuble — technique légère et efficace. Toute variante sans visuel affiche la vue neutre avec la mention discrète « rendu indicatif ».

**Blocs d'action (dans l'ordre)**
1. **Demander un devis** — bouton primaire pleine largeur
2. **WhatsApp** — bouton secondaire, ouvre une conversation pré-remplie : *« Bonjour, je suis intéressé(e) par [Nom du produit] — [lien] »*
3. **Voir en showroom** — texte souligné, ouvre le module de prise de RDV avec le produit pré-sélectionné
4. **Télécharger la fiche PDF** — génération à la volée, incluant la configuration exacte choisie, les visuels, le schéma coté et les coordonnées
5. **Ajouter au moodboard** — icône cœur
6. **Partager** — copier le lien / WhatsApp / Instagram

**Réassurance (petits pictogrammes au trait)**
Fabrication artisanale à Tunis · Livraison et montage inclus (Grand Tunis) · Garantie 2 ans · Devis gratuit sous 48 h

### 8.4 Sections sous la galerie (pleine largeur)

**A. Fiche technique** — accordéon ou tableau à deux colonnes
Dimensions (L×P×H, hauteur d'assise, hauteur d'accoudoir), poids, structure, suspension, garnissage, densité de mousse, revêtement, finition, démontabilité, référence.

**B. Matériaux** — bandeau de gros plans macro
Une image par matériau avec son nom, son origine, son entretien. C'est ici que le zoom haute définition prend tout son sens.

**C. Délai de fabrication**
Frise horizontale en 5 étapes : `Devis (48 h) → Validation & acompte → Fabrication (4 à 6 semaines) → Contrôle qualité → Livraison & montage`. Chaque étape s'illumine au scroll.

**D. Livraison**
Zones et délais (Grand Tunis, Sousse/Sahel, reste du pays), montage inclus ou non, conditions d'accès (escalier, ascenseur, monte-meuble), reprise de l'ancien mobilier.

**E. Entretien**
Instructions par matière, produits recommandés, service de réfection proposé par l'atelier. Cette section, rare chez les concurrents, signale un fabricant et non un revendeur.

**F. Le mot de l'atelier**
Un court paragraphe signé, expliquant un choix de conception précis (« pourquoi ce dossier fait 62 cm »). Deux phrases suffisent. C'est le détail qui fait dire « ces gens savent ce qu'ils font ».

**G. Pièces similaires**
Carrousel de 6 produits — même ligne, ou même matière, ou même usage.

**H. Inspirations associées**
4 moodboards contenant ce produit → renvoi vers la page Inspirations.

**I. Ce décor complet**
« Composez la pièce » : le produit + 4 pièces complémentaires, avec possibilité de demander un devis groupé. Levier majeur de panier moyen.

### 8.5 Micro-interactions de la page produit

- Le panneau ancré diminue légèrement d'opacité quand il atteint le bas de la galerie.
- Au changement de variante, une pastille de confirmation apparaît 1,2 s : *« Bouclé Écru sélectionné »*.
- Le bouton devis pulse très discrètement (échelle 1 → 1,015) une seule fois, 8 secondes après l'arrivée sur la page.
- Une barre de progression fine en haut indique l'avancement dans la page.
- Si l'utilisateur amorce une sortie de page (mouvement de souris vers le haut), affichage d'un panneau discret : *« Gardez cette configuration — recevez-la par e-mail. »*

---

## 9. CONFIGURATEUR SUR MESURE

### 9.1 Intention

Le configurateur est l'argument de vente décisif du site. Aucun concurrent tunisien n'en possède. Il transforme le visiteur passif en co-concepteur — et un client qui a passé 4 minutes à dessiner sa pièce ne repart plus.

### 9.2 Interface

Plein écran, sans en-tête de site. Deux zones :
- **Gauche (60 %)** — l'aperçu du meuble, fond `--blanc-casse`, éclairage doux, ombre portée réaliste.
- **Droite (40 %)** — panneau d'options, une étape à la fois.

Barre de progression en haut : 6 points reliés par un filet qui se remplit en bronze.

### 9.3 Parcours

| Étape | Question | Options | Retour visuel |
|---|---|---|---|
| **1** | Quelle pièce souhaitez-vous créer ? | Canapé · Fauteuil · Table · Dressing · Bibliothèque · Tête de lit · Meuble TV · Autre | Le meuble apparaît en fondu |
| **2** | Quelles dimensions ? | Curseurs L / P / H + saisie numérique | Le meuble se déforme **en temps réel**, cotes affichées, silhouette humaine à l'échelle en repère |
| **3** | Quelle structure ? | Chêne, noyer, frêne, teck, laqué, métal | Texture appliquée instantanément |
| **4** | Quel revêtement ? | Bouclé, velours, lin, coton, cuir pleine fleur, cuir nubuck, tissu technique | Pastilles texturées, aperçu macro au survol |
| **5** | Quelle couleur ? | Nuancier organisé par famille | Application en fondu de 400 ms |
| **6** | Quels piètements et finitions ? | Métal noir, laiton brossé, bois tourné, socle plein + coutures, capitonnage, éclairage LED intégré | Le détail se met en surbrillance et la vue zoome dessus 2 s |

**Écran final — récapitulatif**
- Grand rendu de la configuration
- Liste des choix, chacun modifiable en un clic
- **Estimation de prix en fourchette** (ex. *« Entre 4 200 et 5 100 DT »*) — jamais un prix ferme
- Délai estimé de fabrication
- Actions : **Demander mon devis** · *Enregistrer ma configuration* · *Télécharger le PDF* · *Envoyer sur WhatsApp* · *Partager*

### 9.4 Rendu visuel — approche par paliers de budget

**V1 — Superposition 2D (recommandé au lancement, coût faible)**
Un rendu de base par type de meuble et par angle, sous forme de calques PNG : structure / assise / dossier / coussins / piètement. Les textures s'appliquent en `mix-blend-mode: multiply` sur des masques alpha, avec un calque d'ombres en `overlay` par-dessus pour conserver le relief. Le résultat est étonnamment convaincant et pèse quelques centaines de kilo-octets.

**V2 — Séquence multi-angles**
36 vues pré-rendues par configuration de base, permettant une rotation à 360° au glisser. Charge progressive des angles.

**V3 — 3D temps réel (React Three Fiber)**
Modèle GLB par famille de meubles, matériaux PBR, dimensions pilotées par paramètres, éclairage HDRI, ombres douces. À réserver à la phase 2, une fois le site rentabilisé.

**Le cahier des charges doit prévoir l'architecture V3 dès le départ** (le configurateur est un composant isolé avec une interface de rendu abstraite) même si seule la V1 est livrée. Cela évite de tout reconstruire.

### 9.5 Animations et micro-interactions

- Transition entre étapes : glissement horizontal du panneau (500 ms) pendant que l'aperçu reste stable.
- Sélection d'une option : contour bronze qui se dessine autour de la pastille (300 ms) + micro-vibration sur mobile.
- Changement de dimension : interpolation fluide, jamais de saut.
- Changement de matière : fondu croisé de 400 ms, jamais de substitution brutale.
- Le prix estimé se met à jour avec un compteur animé de 600 ms.
- Reprise automatique : la configuration est sauvegardée en `localStorage`, avec proposition de reprise au retour sur le site.

### 9.6 Sortie commerciale

À la fin, l'utilisateur laisse : nom, téléphone, ville, budget indicatif (fourchettes), échéance du projet. Ces champs suffisent à qualifier le prospect. Le devis part automatiquement en notification vers le back-office **et** sur WhatsApp de l'atelier.

---

## 10. SUR MESURE / PROJET SUR MESURE

### 10.1 `/sur-mesure` — le manifeste

**Pourquoi :** convaincre que le sur-mesure est accessible et non intimidant.

**Hero**
100vh, fond `--noir-encre`, gros plan sur des mains travaillant une matière. Titre display : **« Le sur-mesure n'est pas un luxe. C'est une méthode. »**

**Sections**
1. **Pourquoi le sur-mesure** — 3 arguments : l'espace exact, la matière choisie, la pièce unique.
2. **Les 5 étapes** — frise verticale ancrée : *Rencontre → Conception & plans → Choix des matières → Fabrication à l'atelier → Livraison & installation*. Chaque étape s'active au scroll avec son visuel, sa durée et ce qui est attendu du client.
3. **Le nuancier** — accès à `/sur-mesure/matieres`.
4. **Ce que nous fabriquons** — grille de 8 typologies (dressings, cuisines, bibliothèques, têtes de lit, banquettes, meubles TV, bureaux, agencements commerciaux).
5. **Réalisations sur mesure** — 6 exemples.
6. **Questions fréquentes** — accordéon : délais, budget minimum, zones desservies, modification en cours de projet, garantie.
7. **CTA final** — double : *Configurer une pièce* / *Déposer mon projet*.

### 10.2 `/sur-mesure/matieres` — le nuancier

Grille plein écran de gros plans macro. Filtres : Bois · Tissus · Cuirs · Métaux · Pierres. Au clic sur un échantillon : panneau latéral avec nom, origine, propriétés, entretien, produits utilisant cette matière, et bouton **Recevoir un échantillon** (formulaire d'envoi postal — geste très haut de gamme, coût dérisoire, effet mémorable).

**Animation :** au survol d'un échantillon, zoom lent ×1,15 sur 1,2 s. La grille entière donne une impression de matière vivante.

### 10.3 `/sur-mesure/projet` — dépôt de projet

**Formulaire en 4 étapes, une question par écran** (jamais un formulaire long et décourageant) :

**Étape 1 — Votre projet**
Type : Une pièce · Une chambre · Un appartement complet · Une villa · Un local professionnel
Surface approximative · Ville

**Étape 2 — Vos documents**
Zone de dépôt par glisser-déposer : plans (PDF, DWG, JPG), photos de l'existant, images d'inspiration. Jusqu'à 10 fichiers, 20 Mo chacun. Aperçu miniature immédiat, suppression possible, barre de progression par fichier.

**Étape 3 — Votre vision**
Champ libre + sélection rapide de styles (puces visuelles : Minimaliste, Japandi, Moderne, Contemporain, Luxury) + fourchette de budget + échéance souhaitée.

**Étape 4 — Vos coordonnées**
Nom, téléphone, e-mail, mode de contact préféré (téléphone / WhatsApp / e-mail), créneau de disponibilité.

**Écran de confirmation**
*« Votre projet est entre nos mains. »* Numéro de dossier, délai de réponse annoncé (48 h ouvrées), nom du conseiller assigné, bouton *Prendre rendez-vous dès maintenant*.

**Animations**
Progression en 4 points en haut. Transition par glissement latéral. La zone de dépôt s'illumine en bronze au survol d'un fichier. Coche animée à la validation.

---

## 11. INSPIRATIONS

### 11.1 Intention

C'est la page qui fait revenir les gens et qui génère le trafic SEO le plus large. Elle fonctionne comme un Pinterest de marque : le visiteur vient chercher des idées, et repart avec des produits.

### 11.2 Hero

40vh seulement — la grille doit apparaître vite. Titre **Inspirations**, ligne : *« Des intérieurs pensés dans le moindre détail. »*

### 11.3 Filtres

Barre ancrée, deux familles de puces :
- **Styles** : Minimaliste · Japandi · Moderne · Contemporain · Luxury
- **Matières & tons** : Bois · Marbre · Noir · Beige
- Filtre additionnel par pièce : Salon · Salle à manger · Chambre · Cuisine · Bureau · Entrée

Filtres cumulables, inscrits dans l'URL, avec compteur de résultats.

### 11.4 Grille

**Disposition en maçonnerie (masonry)** à hauteurs variables — 4 colonnes desktop, 3 tablette, 2 mobile. Images en très grand format, sans cadre ni ombre, gouttière de 8 px seulement (grille dense volontairement, à l'inverse du reste du site : ici c'est l'abondance qui séduit).

**Chargement infini** avec préchargement 400 px avant l'entrée en viewport.

### 11.5 Interactions

- **Survol** : un voile sombre monte depuis le bas avec le titre du moodboard, son style, et le nombre de produits identifiés dedans. Un bouton cœur apparaît en haut à droite.
- **Clic** : ouverture d'une lightbox plein écran — image en grand à gauche, à droite la liste des produits Mood Store visibles sur l'image, chacun cliquable. Navigation clavier ←/→ entre les inspirations.
- **Points chauds (hotspots)** : sur les images de réalisations, des points pulsants discrets marquent les meubles. Au clic, une carte produit apparaît avec nom, prix et lien. **C'est la fonctionnalité la plus rentable de la page** : elle transforme une image d'ambiance en catalogue cliquable.
- **Bouton « Créer mon moodboard »** flottant : l'utilisateur compose sa propre planche à partir des inspirations et des produits, puis l'exporte en PDF ou l'envoie à l'atelier comme base de discussion.

### 11.6 Animations

- Apparition des tuiles en cascade par colonne (décalage 60 ms), révélation par masque.
- Léger décalage vertical entre colonnes au scroll (colonnes 1 et 3 à 1,0× ; colonnes 2 et 4 à 0,94×) — donne un rythme organique.
- Au changement de filtre : réorganisation FLIP fluide, les tuiles conservées se déplacent sans disparaître.

---

## 12. NOS RÉALISATIONS

### 12.1 Intention

Preuve, crédibilité, et argument principal pour les projets d'architecture d'intérieur à fort budget. **Uniquement des photos réelles** — aucun visuel IA dans cette section.

### 12.2 Page index

**Hero** 50vh, photo du projet le plus impressionnant, titre **Réalisations**, compteur : *« 340 projets livrés depuis 2018. »*

**Filtres** : Appartement · Villa · Bureau · Hôtel · Restaurant · Commerce — et par ville.

**Grille éditoriale asymétrique** : alternance de blocs pleine largeur et de doubles colonnes. Chaque carte : image, nom du projet, typologie, ville, surface, année.

**Animations** : chaque carte se révèle par `clip-path`, avec une parallaxe interne. Au survol, l'image s'agrandit lentement pendant que la légende reste fixe.

### 12.3 Étude de cas — `/realisations/[slug]`

Format narratif, pensé comme un article de magazine d'architecture :

1. **Hero** — photo signature en 100vh, titre du projet, lieu, année, surface, superposés en bas à gauche.
2. **Le contexte** — 3 lignes : le client, la demande, la contrainte principale.
3. **Avant / après** — comparateur glissant (voir §6 section 6).
4. **Les plans** — plan 2D et vues 3D si disponibles, zoomables.
5. **Le parcours pièce par pièce** — alternance texte / grandes photos, une pièce après l'autre.
6. **Les matières employées** — bandeau de gros plans macro avec noms.
7. **Le mobilier créé** — les pièces sur mesure fabriquées pour ce projet, cliquables vers leurs fiches.
8. **Chiffres clés** — surface, durée du chantier, nombre de pièces sur mesure, délai.
9. **Le mot du client** — témoignage avec nom et photo.
10. **CTA** — *« Un projet similaire ? Parlons-en. »*
11. **Projet suivant** — grande image cliquable pleine largeur en bas de page, qui invite à enchaîner.

**Animations** : parallaxe sur toutes les grandes images, texte ancré pendant le défilement des visuels, compteurs animés sur les chiffres clés, transition fluide vers le projet suivant.

---

## 13. ESPACE PROFESSIONNEL

### 13.1 Intention

Les architectes, décorateurs et promoteurs représentent des commandes récurrentes et volumineuses. Un espace dédié les signale comme partenaires et non comme simples clients — c'est ce que font toutes les grandes maisons (le « Trade Program » de B&B Italia).

### 13.2 Page publique — `/professionnels`

**Hero** — fond sombre, plan de bureau avec plans d'architecte et échantillons. Titre : **« Nous travaillons avec ceux qui dessinent. »**

**Contenu**
- **Pour qui** : 6 cartes — Architectes · Décorateurs · Hôtels · Restaurants · Bureaux · Promoteurs.
- **Les avantages** : tarification professionnelle, accès aux fichiers techniques (DWG, 3D, fiches matières), échantillons gratuits, chargé de compte dédié, délais prioritaires, showroom privatisable.
- **Nos références professionnelles** : logos ou noms de projets livrés (avec accord).
- **Comment ça marche** : 3 étapes — inscription, validation sous 48 h, accès à l'espace.
- **CTA** : *Demander un accès professionnel*.

### 13.3 Formulaire d'inscription

Raison sociale, matricule fiscal, secteur d'activité, site web / Instagram, nombre de projets annuels, personne de contact, téléphone, e-mail, justificatif (patente / carte professionnelle). Validation manuelle depuis le back-office.

### 13.4 Espace connecté

Une fois validé, le professionnel accède à :
- **Tarifs professionnels** affichés directement sur toutes les fiches produit (remplace « Prix sur demande »)
- **Bibliothèque technique** : fichiers DWG, blocs 3D, fiches matières, images HD sous licence
- **Commande d'échantillons** : jusqu'à 10 échantillons gratuits par trimestre, envoi postal
- **Espace projets** : suivi de ses chantiers en cours, avec devis, plannings et documents
- **Devis multi-lignes** : constitution d'un panier de plusieurs références pour une demande groupée
- **Contact direct** avec le chargé de compte (nom, photo, téléphone, WhatsApp)

---

## 14. SHOWROOM

### 14.1 `/showroom` — index

Deux blocs pleine hauteur : **La Soukra — Tunis** et **Sousse — Slim Centre**. Photo, adresse, horaires, téléphone, CTA.

### 14.2 Page d'un showroom

**Hero** — photo panoramique du showroom en 80vh, nom, adresse.

**Contenu**
- **Informations pratiques** : adresse complète, horaires par jour (avec indicateur « Ouvert maintenant » calculé en direct), téléphone **51 953 889**, WhatsApp, stationnement, accessibilité.
- **Carte interactive** — Mapbox ou Google Maps avec un style personnalisé monochrome (une carte Google par défaut, colorée, casse instantanément l'ambiance premium). Marqueur au logo Mood. Bouton *Itinéraire*.
- **Galerie du showroom** — 10 à 14 photos, en grille éditoriale, ouvrables en lightbox.
- **Visite virtuelle** — panorama 360° navigable. Réalisable **sans budget vidéo** : quelques photos panoramiques assemblées depuis un téléphone récent, affichées avec Pannellum (bibliothèque gratuite). Effet spectaculaire pour un coût quasi nul.
- **Ce que vous y trouverez** — les collections exposées sur place.
- **Prendre rendez-vous** — module intégré.
- **L'équipe du showroom** — photo et prénom des conseillers. Humaniser augmente fortement la prise de RDV.

### 14.3 Module de prise de rendez-vous

Parcours en 4 écrans :
1. **Motif** : Découvrir les collections · Projet sur mesure · Projet d'architecture · Retirer une commande
2. **Showroom** : Tunis ou Sousse
3. **Date et heure** : calendrier avec créneaux réellement disponibles (intégration Cal.com ou agenda interne)
4. **Coordonnées** : nom, téléphone, e-mail, nombre de personnes, commentaire libre

**Confirmation** : e-mail + SMS/WhatsApp, fichier `.ics` à ajouter au calendrier, nom du conseiller assigné, rappel automatique 24 h avant.

**Animations** : le calendrier apparaît en cascade jour par jour ; le créneau sélectionné se remplit en bronze ; coche animée à la confirmation.

---

## 15. À PROPOS

**Hero** — portrait de la fondatrice ou photo de l'atelier en 100vh. Titre : **« Depuis 2018, nous fabriquons des maisons avec âme. »**

**Sections**
1. **L'histoire** — récit chronologique en frise verticale : 2018 la création, l'ouverture du premier showroom, l'agrandissement de l'atelier, l'ouverture de Sousse, aujourd'hui. Chaque étape avec photo et une ligne de texte.
2. **La fondatrice** — portrait grand format, texte à la première personne. C'est un atout majeur : la fondatrice a 50 k abonnés, son visage est la marque. Lien vers son Instagram.
3. **Les chiffres** — compteurs animés : *2018* (depuis), *340* projets livrés, *2* showrooms, *12 500* abonnés, *4 à 6 semaines* de délai moyen.
4. **L'atelier** — grande galerie du lieu de fabrication, des machines, des matières.
5. **L'équipe** — portraits en noir et blanc, prénom et métier (ébéniste, tapissier, dessinateur, conseiller).
6. **Nos engagements** — matières sélectionnées, fabrication locale, service après-vente, réfection possible.
7. **CTA** — *Visiter un showroom* / *Démarrer un projet*.

**Animations** : frise chronologique qui se dessine au scroll (trait vertical bronze progressif), compteurs animés, portraits qui passent du noir et blanc à la couleur au survol.

---

## 16. CONTACT

**Disposition en deux colonnes, sans hero** — l'utilisateur qui arrive ici veut agir vite.

**Colonne gauche — le formulaire**
Champs : nom, téléphone, e-mail, objet (menu : Devis · Projet sur mesure · Architecture d'intérieur · SAV · Professionnel · Autre), message, pièce jointe facultative. Bouton **Envoyer**.

**Colonne droite — les accès directs**
- Téléphone **51 953 889** (cliquable)
- WhatsApp (bouton vert discret, conversation pré-remplie)
- E-mail
- Instagram `@mood_store_tips_and_tricks`
- Les deux showrooms avec adresses et horaires
- Délai de réponse annoncé : *« Nous répondons sous 24 h ouvrées. »*

**Sous les colonnes** : carte des deux showrooms, et accordéon de questions fréquentes (délais, livraison, budget minimum, garantie, modification de commande).

**Micro-interactions** : les labels montent au focus, la validation se fait à la volée sans message d'erreur agressif, le bouton d'envoi affiche un état de chargement puis une coche animée avec le message *« Message reçu. Nous vous répondons sous 24 h. »*

---

## 17. RECHERCHE INTELLIGENTE

### 17.1 Comportement attendu

L'utilisateur tape `canapé beige` → il obtient immédiatement, sans valider, les canapés en revêtement beige. La recherche doit comprendre la langue naturelle, pas seulement les mots-clés exacts.

### 17.2 Interface

Ouverture par l'icône loupe ou le raccourci `Ctrl/Cmd + K`. Superposition plein écran, fond flouté, champ de saisie unique en très grande typographie, curseur clignotant.

**État vide (avant saisie)**
- `RECHERCHES FRÉQUENTES` : canapé bouclé, dressing sur mesure, table à manger bois, tête de lit
- `VOS DERNIÈRES RECHERCHES` (stockées localement)
- `SUGGESTIONS` : 4 vignettes produit mises en avant

**Pendant la saisie (dès 2 caractères, débounce 180 ms)**
Résultats en trois colonnes :
1. **Produits** — 6 vignettes avec image, nom, catégorie, prix
2. **Collections & catégories** — liens directs
3. **Inspirations & réalisations** — 3 résultats

Les termes correspondants sont surlignés en bronze. Navigation au clavier ↑ ↓ et `Entrée`.

### 17.3 Intelligence

**Analyse d'intention** — la requête est décomposée en facettes avant recherche :

| Saisie | Interprétation |
|---|---|
| `canapé beige` | type = canapé · couleur = beige |
| `table bois 8 personnes` | type = table · matière = bois · places ≥ 8 |
| `dressing sur mesure chambre` | type = dressing · sur-mesure = oui · pièce = chambre |
| `meuble japandi` | style = japandi |

**Moyens techniques**
- Index principal : **Meilisearch** (open source, auto-hébergeable, tolérant aux fautes, très rapide) ou Algolia si le budget le permet.
- Tolérance aux fautes de frappe : `canpé`, `canapee`, `bouclé/boucle` → même résultat.
- Synonymes configurés : sofa/canapé, buffet/enfilade, dressing/penderie, table basse/table de salon, bouclé/teddy.
- Recherche insensible aux accents et à la casse.
- Recherche sémantique (embeddings) en option phase 2 : `meuble pour petit salon` renvoie les canapés compacts.
- Résultats pondérés : produits en stock et pièces populaires remontent.

**Aucun résultat**
Ne jamais afficher une page vide. Proposer : *« Nous ne trouvons pas cette pièce — mais nous pouvons la fabriquer. »* + CTA configurateur + CTA WhatsApp + 4 suggestions proches.

### 17.4 Exploitation

Toutes les requêtes sont enregistrées. Le back-office affiche les recherches sans résultat : c'est la meilleure source d'information sur ce que le marché demande et que l'atelier ne propose pas encore.

---
---

# PARTIE III — DIFFÉRENCIATION

## 18. Fonctionnalités « effet WOW »

Cette partie liste les fonctionnalités qui placent Mood Store **au-dessus** de ses références internationales. Chacune est notée selon son impact commercial et son coût de réalisation, pour permettre un arbitrage.

Légende : Impact ●●● fort / ●● moyen / ● faible — Coût ★★★ élevé / ★★ moyen / ★ faible

---

### 18.1 Visualisation en réalité augmentée (AR)

**Ce que c'est :** depuis la fiche produit sur mobile, le bouton *« Voir chez moi »* ouvre la caméra et pose le meuble à l'échelle réelle dans le salon de l'utilisateur. Il peut le déplacer, le tourner, changer sa couleur en direct.

**Comment :** WebXR sur Android (Scene Viewer) et Quick Look sur iOS. Aucune application à installer. Il suffit d'un fichier **GLB** (Android) et **USDZ** (iOS) par produit. Le composant `<model-viewer>` de Google gère les deux en quelques lignes.

**Pourquoi c'est décisif :** c'est l'objection numéro un du meuble — *« est-ce que ça rentre ? »*. Les études du secteur montrent une hausse de conversion de 20 à 40 % et une baisse notable des retours. **Roche Bobois ne le propose pas sur l'ensemble de son catalogue.**

**Coût maîtrisé :** commencer par les 10 pièces phares uniquement. Un modèle 3D simple par pièce suffit.

*Impact ●●● · Coût ★★*

---

### 18.2 Comparateur avant / après

Déjà décrit en §6. À décliner sur toutes les études de cas et dans un bloc dédié de la home. **Le meilleur rapport impact/coût du projet** : deux photos et 60 lignes de code.

*Impact ●●● · Coût ★*

---

### 18.3 Assistant IA décorateur — « Le Conseiller Mood »

**Ce que c'est :** un dialogue, pas un chatbot support. L'utilisateur décrit son espace (*« un salon de 25 m², beaucoup de lumière, je veux du chaleureux mais épuré »*) et l'assistant propose une sélection de 4 à 6 pièces Mood Store cohérentes, avec une explication en une phrase par pièce, et un moodboard généré.

**Comment :** API Claude ou GPT, avec le catalogue produit injecté en contexte (RAG sur une base vectorielle). L'assistant ne parle **que** du catalogue Mood Store — jamais de généralités décoration. Ton : celui d'un décorateur, sobre, jamais commercial.

**Garde-fous :** il ne donne jamais de prix ferme, ne promet aucun délai, et propose systématiquement de basculer vers un conseiller humain via WhatsApp après 3 échanges.

*Impact ●●● · Coût ★★*

---

### 18.4 Recherche par photo

**Ce que c'est :** l'utilisateur téléverse une photo trouvée sur Pinterest ou Instagram → le site lui montre les pièces Mood Store les plus proches visuellement.

**Comment :** encodage des images du catalogue via CLIP, stockage dans une base vectorielle (pgvector, gratuit avec PostgreSQL), recherche par similarité cosinus. La photo de l'utilisateur est encodée à la volée et comparée.

**Pourquoi c'est puissant :** c'est exactement le comportement réel des clients tunisiens — ils arrivent en showroom avec une capture d'écran Pinterest. Le site industrialise ce réflexe. **Aucun concurrent, même international, ne le fait bien.**

*Impact ●●● · Coût ★★★*

---

### 18.5 Générateur d'ambiance

**Ce que c'est :** l'utilisateur choisit un style (Japandi, Minimaliste, Luxury…), une pièce et une dominante colorée. Le site compose automatiquement une planche complète : mobilier Mood Store, palette de couleurs, matières, éclairage, avec le budget estimé de l'ensemble.

**Pourquoi :** il vend un **ensemble** et non une pièce. Le panier moyen change d'échelle.

*Impact ●●● · Coût ★★*

---

### 18.6 Créateur de moodboard

**Ce que c'est :** chaque visiteur peut composer sa propre planche d'ambiance en glissant produits et inspirations sur une toile libre, ajouter des notes, réorganiser, et l'exporter en PDF ou l'envoyer directement à l'atelier comme base de discussion.

**Pourquoi :** un client qui a construit son moodboard a investi du temps. Il ne va pas ailleurs. Et l'atelier reçoit un brief déjà mûr.

**Bonus :** moodboard partageable par lien — le client l'envoie à son conjoint. Deux personnes au lieu d'une reviennent sur le site.

*Impact ●●● · Coût ★★*

---

### 18.7 Prise de mesures assistée

**Ce que c'est :** l'utilisateur photographie son mur ou son espace avec son téléphone ; le site estime les dimensions et indique quelles pièces du catalogue s'y intègrent.

**Comment :** API ARCore Depth (Android) / RoomPlan (iOS) pour les appareils récents ; solution de repli par calibration sur un objet de référence (une feuille A4 posée au sol).

**Version simplifiée (recommandée en V1) :** un formulaire de 3 champs — largeur du mur, profondeur disponible, hauteur sous plafond — qui filtre instantanément le catalogue sur ce qui rentre. 90 % de la valeur pour 5 % du coût.

*Impact ●● · Coût ★★★ (V1 : ★)*

---

### 18.8 Simulateur de couleurs murales

L'utilisateur téléverse la photo de sa pièce, sélectionne les murs, et teste des teintes ; le mobilier Mood Store proposé s'adapte à la palette. Détourage assisté par segmentation.

*Impact ●● · Coût ★★★*

---

### 18.9 Visite virtuelle 360° du showroom

Déjà décrite en §14.2. **Faisable pour un coût quasi nul** : panoramas assemblés depuis un téléphone, affichés avec Pannellum, points de navigation entre les zones, et points chauds cliquables sur les meubles exposés renvoyant vers leurs fiches. Un visiteur qui « entre » dans le showroom en ligne a beaucoup plus de chances de s'y rendre physiquement.

*Impact ●●● · Coût ★*

---

### 18.10 Séquence cinématique au scroll (sans vidéo)

**Ce que c'est :** une section où le scroll fait défiler une séquence de 40 à 60 images fixes — l'équivalent d'un plan de caméra tournant autour d'un meuble, ou d'un fauteuil qui s'assemble pièce par pièce. C'est la technique exacte utilisée par Apple sur ses pages produit.

**Comment :** 40 images WebP de 800 px (poids total ~600 ko), préchargées, dessinées dans un `<canvas>` dont l'index est piloté par GSAP ScrollTrigger.

**Pourquoi c'est parfait ici :** cela produit un effet vidéo haut de gamme **sans aucune vidéo**, à partir de rendus fixes générés ou photographiés. C'est la réponse directe à la contrainte de budget.

*Impact ●●● · Coût ★★*

---

### 18.11 Devis instantané par WhatsApp

Chaque configuration, chaque produit, chaque moodboard génère un message WhatsApp pré-rempli contenant le récapitulatif et le lien. En Tunisie, WhatsApp est le canal de vente réel : il doit être partout, mais toujours discret visuellement (jamais de bulle verte clignotante).

*Impact ●●● · Coût ★*

---

### 18.12 Suivi de fabrication en direct

Le client dispose d'un lien de suivi montrant l'avancement de sa commande : *Devis validé → Matières commandées → En fabrication → Contrôle qualité → Prêt → Livré*, avec des photos réelles envoyées par l'atelier à chaque étape.

**Pourquoi :** un délai de 6 semaines est anxiogène. Une photo de son canapé en cours de fabrication transforme l'attente en attachement. Et le client partage ces photos — publicité gratuite.

*Impact ●●● · Coût ★★*

---

### 18.13 Envoi d'échantillons

Le visiteur commande jusqu'à 5 échantillons de tissus ou de bois, livrés chez lui gratuitement. Suivi de l'envoi dans son espace client.

**Pourquoi :** toucher la matière est décisif dans le meuble. Le coût est dérisoire et le geste est mémorable. C'est ce que fait Roche Bobois pour ses clients grands comptes uniquement.

*Impact ●●● · Coût ★*

---

### 18.14 Effets de finition (« Apple / Tesla »)

- **Transitions de page à volet** — le noir monte, la page change, le noir sort.
- **Titres révélés lettre par lettre** — à doser, 3 fois maximum sur le site.
- **Défilement ancré horizontal** sur les collections.
- **Curseur magnétique** sur les boutons.
- **Défilement inertiel** (Lenis) — le scroll a une masse, une décélération. Détail invisible consciemment mais qui change entièrement la sensation du site.
- **Effet de matière au survol** : au survol d'un échantillon, une très légère ondulation de la texture (shader WebGL simple). Facultatif, mais spectaculaire.
- **Compteur de visiteurs en showroom** : *« 3 personnes consultent cette pièce en ce moment »* — uniquement si c'est vrai.

*Impact ●● · Coût ★★*

---

### 18.15 Récapitulatif — ordre de priorité recommandé

| Priorité | Fonctionnalité | Impact | Coût |
|---|---|---|---|
| 1 | Comparateur avant/après | ●●● | ★ |
| 2 | Devis WhatsApp partout | ●●● | ★ |
| 3 | Visite virtuelle 360° | ●●● | ★ |
| 4 | Envoi d'échantillons | ●●● | ★ |
| 5 | Configurateur (V1 en 2D) | ●●● | ★★ |
| 6 | Points chauds sur les inspirations | ●●● | ★ |
| 7 | Moodboard client | ●●● | ★★ |
| 8 | Séquence cinématique au scroll | ●●● | ★★ |
| 9 | Suivi de fabrication | ●●● | ★★ |
| 10 | AR sur 10 produits phares | ●●● | ★★ |
| 11 | Assistant IA décorateur | ●●● | ★★ |
| 12 | Générateur d'ambiance | ●●● | ★★ |
| 13 | Recherche par photo | ●●● | ★★★ |
| 14 | Configurateur 3D temps réel | ●● | ★★★ |
| 15 | Simulateur de couleurs murales | ●● | ★★★ |

**Les 8 premières lignes suffisent à produire un site qui surclasse tout ce qui existe en Tunisie et soutient la comparaison avec les maisons européennes.** Les suivantes constituent la feuille de route de la phase 2 — et l'argument d'un contrat d'évolution récurrent.

---
---

# PARTIE IV — BACK-OFFICE

## 19. Espace d'administration

### 19.1 Principe directeur

L'atelier n'a jamais géré de site. Le back-office doit donc être **conçu pour quelqu'un qui n'a aucune compétence technique**. Règles :

- Vocabulaire métier, jamais de jargon (« Ajouter un meuble », pas « Créer une entité produit »).
- Toute action destructrice demande confirmation et reste réversible 30 jours (corbeille).
- Aucun champ obligatoire non évident ; aide contextuelle à côté de chaque champ.
- Interface en français uniquement.
- Utilisable depuis un téléphone pour les tâches courantes (consulter une demande, répondre, changer un statut).
- Enregistrement automatique des brouillons.

### 19.2 Rôles et permissions

| Rôle | Périmètre |
|---|---|
| **Administrateur** | Tout, y compris les utilisateurs et les réglages |
| **Gestionnaire catalogue** | Produits, catégories, collections, matières, médias |
| **Commercial** | Demandes, devis, rendez-vous, clients, messages |
| **Éditeur** | Journal, inspirations, réalisations, textes des pages |
| **Lecture seule** | Consultation et statistiques uniquement |

Journal d'audit : chaque modification enregistre qui, quoi et quand.

---

### 19.3 Module 1 — TABLEAU DE BORD

**Écran d'accueil du back-office.**

**Bandeau supérieur — 6 indicateurs du jour**
| Indicateur | Détail |
|---|---|
| Demandes de devis | Nombre du jour · en attente · variation vs semaine précédente |
| Rendez-vous showroom | À venir aujourd'hui et cette semaine |
| Visiteurs | Aujourd'hui · 7 jours · 30 jours |
| Taux de conversion | Visiteurs → demandes de devis |
| Configurations créées | Nombre et taux d'aboutissement en devis |
| Chiffre d'affaires signé | Somme des devis acceptés sur le mois |

**Graphiques**
1. **Courbe de trafic** — 30 jours, avec superposition des demandes de devis. On voit immédiatement l'effet d'une publication Instagram.
2. **Entonnoir de conversion** — Visite → Fiche produit → Configurateur ou Devis → Devis envoyé → Devis accepté. Chaque étape avec son taux de déperdition.
3. **Barres : produits les plus vus** — top 10 sur la période.
4. **Barres : produits les plus demandés en devis** — top 10. *L'écart entre ces deux graphiques est l'information la plus précieuse du back-office : un produit très vu mais jamais demandé a un problème de prix, de photo ou de description.*
5. **Camembert : sources de trafic** — Instagram, Google, direct, WhatsApp, autres.
6. **Carte de chaleur : provenance géographique** — par gouvernorat.
7. **Barres : recherches sans résultat** — la demande non satisfaite.

**Colonne latérale — activité en direct**
Flux temps réel : *« Nouvelle demande de devis — Canapé Boucle — Ariana — il y a 4 min »*. Cliquable.

**Alertes**
Devis sans réponse depuis plus de 48 h · Rendez-vous non confirmés · Produits sans photo · Stock d'échantillons bas · Erreurs 404 fréquentes.

---

### 19.4 Module 2 — CATALOGUE

#### 19.4.1 Liste des produits

Tableau avec : miniature, nom, référence, catégorie, collection, prix, statut (Publié / Brouillon / Archivé), vues 30 j, demandes 30 j, date de modification.

**Fonctions :** recherche instantanée, filtres (catégorie, collection, statut, matière, avec ou sans photo), tri sur toutes les colonnes, sélection multiple avec actions groupées (publier, dépublier, changer de catégorie, appliquer une promotion, supprimer), export CSV, duplication d'un produit.

#### 19.4.2 Formulaire produit

Organisé en 8 onglets pour ne jamais afficher un formulaire de 60 champs :

**Onglet 1 — Général**
Nom · Référence (générée automatiquement, modifiable) · Slug URL · Catégorie · Sous-catégorie · Collection · Description courte (150 caractères) · Description éditoriale (éditeur de texte enrichi) · Le mot de l'atelier · Statut · Mise en avant (oui/non) · Nouveauté (oui/non)

**Onglet 2 — Médias**
Zone de dépôt par glisser-déposer, multi-fichiers. Réorganisation par glissement. Pour chaque image : texte alternatif (obligatoire, avec alerte si vide), légende, rôle (principale / situation / macro / détail / schéma). Indicateur de qualité : **alerte automatique si l'image fait moins de 2000 px** de large. Recadrage intégré aux ratios 4:5, 3:2, 1:1, 16:9. Champ vidéo facultatif (lien YouTube/Vimeo). Champs pour les fichiers AR : GLB et USDZ.

**Onglet 3 — Variantes**
Tableau dynamique. Pour chaque variante : revêtement, couleur, bois, piètement, dimension, prix (ou surcoût), délai, disponibilité, image associée, référence. Ajout ligne par ligne ou génération automatique de toutes les combinaisons à partir des options cochées.

**Onglet 4 — Dimensions**
Tailles prédéfinies (nom, L, P, H, hauteur d'assise, poids, surcoût). Case « Sur mesure possible » avec bornes minimum et maximum par axe. Téléversement du schéma coté.

**Onglet 5 — Caractéristiques techniques**
Structure · Suspension · Garnissage · Densité · Revêtement · Finition · Démontable · Origine · Entretien · Garantie. Champs libres additionnels (clé/valeur).

**Onglet 6 — Tarification**
Prix public · Prix professionnel · Prix barré (promotion) · « Prix sur demande » (case à cocher qui masque le prix) · Devise · TVA · Acompte requis en %.

**Onglet 7 — Relations**
Produits similaires (recherche et sélection) · Complète ce décor · Inspirations associées · Réalisations où le produit apparaît.

**Onglet 8 — SEO**
Titre de page · Méta-description (avec compteur de caractères et aperçu Google en direct) · Mots-clés · Image de partage social · URL canonique.

**Barre latérale permanente**
Aperçu en direct du rendu de la fiche · Bouton *Voir sur le site* · Historique des versions avec restauration · Enregistrer en brouillon · Publier.

#### 19.4.3 Catégories et collections

Arborescence par glisser-déposer. Pour chaque entrée : nom, slug, description, image de hero, ordre d'affichage, produits rattachés, champs SEO. Les collections sont transversales (un produit peut appartenir à plusieurs collections) et disposent d'une page dédiée avec récit et image de couverture.

#### 19.4.4 Bibliothèque des matières

Quatre onglets : **Tissus · Cuirs · Bois · Métaux & pierres**.

Chaque matière : nom, référence fournisseur, famille, photo macro haute définition, échantillon en pastille, composition, résistance (Martindale pour les textiles), entretien, prix au mètre ou au m², disponibilité, produits compatibles, échantillon disponible à l'envoi (oui/non), stock d'échantillons.

#### 19.4.5 Couleurs

Nom commercial, valeur hexadécimale, famille (neutres / terreux / profonds / clairs), photo de rendu réel sur matière, matières disponibles dans cette couleur.

#### 19.4.6 Promotions

Type (pourcentage, montant fixe, offre matière), périmètre (produit, catégorie, collection, tout le site), dates de début et de fin, code promotionnel facultatif, cumul autorisé ou non, bandeau d'annonce associé. Aperçu du nombre de produits concernés avant activation.

---

### 19.5 Module 3 — CONTENU ÉDITORIAL

#### 19.5.1 Constructeur de page d'accueil

Liste des sections de la home, réorganisables par glisser-déposer, chacune activable ou désactivable. Pour chaque section : image de fond, titres, textes, libellés et destinations des CTA, produits ou projets mis en avant.

Une bibliothèque de blocs disponibles permet d'en ajouter : hero, hero en séquence, trois colonnes, rail produits, bloc immersif, avant/après, mosaïque, témoignages, journal, Instagram, newsletter.

**Aperçu en direct** dans un cadre à côté de l'éditeur, avec bascule desktop / tablette / mobile.

#### 19.5.2 Bannières

Bandeau supérieur du site, encarts de catégorie, fenêtre de bienvenue. Champs : image, titre, texte, CTA, dates d'affichage, pages ciblées, fréquence d'apparition.

#### 19.5.3 Textes du site

Tableau de toutes les chaînes modifiables du site (libellés de boutons, messages de confirmation, textes légaux, textes des formulaires), avec recherche. Évite d'avoir à appeler le développeur pour corriger une virgule.

#### 19.5.4 Inspirations

Création d'un moodboard : titre, image principale, images secondaires, styles (Minimaliste, Japandi, Moderne, Contemporain, Luxury), matières et tons (Bois, Marbre, Noir, Beige), pièce concernée, description, **placement des points chauds** (interface : on clique sur l'image à l'endroit du meuble, puis on associe un produit du catalogue), ordre d'affichage, mise en avant.

#### 19.5.5 Réalisations

Titre du projet, client (avec case « anonyme »), typologie, ville, surface, année, durée du chantier, texte de contexte, galerie ordonnée, images avant/après appairées, plans, matières employées, produits sur mesure créés, témoignage client (texte, nom, photo), chiffres clés, publication.

#### 19.5.6 Journal

Éditeur de texte enrichi avec blocs (paragraphe, titre, image, galerie, citation, produit intégré, séparateur). Catégorie, étiquettes, auteur, image de couverture, date de publication programmable, temps de lecture calculé, champs SEO, articles liés.

---

### 19.6 Module 4 — DEMANDES

#### 19.6.1 Boîte de réception unifiée

**Tous les canaux dans un seul écran** : demandes de devis, configurations, projets sur mesure, messages de contact, demandes professionnelles, demandes d'échantillons, conversations WhatsApp.

Colonnes : date, canal (icône), nom, téléphone, ville, objet, valeur estimée, statut, assigné à.

**Statuts :** Nouveau → Contacté → Devis envoyé → En négociation → Gagné → Perdu → Sans suite

**Filtres :** canal, statut, assignation, période, ville, fourchette de budget.

**Vue en colonnes (kanban)** en alternative au tableau : les demandes se déplacent d'un statut à l'autre par glisser-déposer.

#### 19.6.2 Fiche d'une demande

- **En-tête** : nom, téléphone (bouton d'appel direct), e-mail, WhatsApp (bouton d'ouverture de conversation), ville, source (Instagram / Google / direct).
- **Le contenu de la demande** : produit ou configuration concernée, avec le rendu visuel exact et le récapitulatif des options choisies.
- **Fichiers joints** : plans, photos, inspirations téléversés par le client.
- **Historique de navigation** du visiteur avant la demande (pages vues, produits consultés, temps passé) — information commerciale précieuse.
- **Journal des échanges** : notes internes horodatées, e-mails envoyés, appels enregistrés manuellement.
- **Actions** : générer un devis PDF, envoyer par e-mail ou WhatsApp, planifier un rappel, assigner à un commercial, changer de statut, marquer la valeur estimée.

#### 19.6.3 Générateur de devis

Depuis une demande : sélection des lignes (produits, options, livraison, montage), quantités, remises, conditions, validité, acompte. Génération d'un **PDF à l'identité Mood Store** (logo, typographies, mise en page premium). Envoi par e-mail avec accusé de lecture, ou par WhatsApp. Suivi du statut : envoyé / vu / accepté / refusé.

#### 19.6.4 Rendez-vous

Vue calendrier (jour / semaine / mois) par showroom et par conseiller. Chaque rendez-vous : client, motif, produits d'intérêt, conseiller, statut (Demandé / Confirmé / Honoré / Absent / Annulé). Confirmation, report et annulation avec notification automatique. Gestion des créneaux disponibles, des jours de fermeture et des congés. Rappel automatique 24 h avant par WhatsApp ou SMS.

#### 19.6.5 Échantillons

Liste des demandes d'échantillons, matières demandées, adresse de livraison, statut d'expédition, décompte du stock d'échantillons, alerte de réapprovisionnement.

---

### 19.7 Module 5 — CLIENTS

Fiche client unifiée : coordonnées, type (particulier / professionnel), historique complet des demandes, devis, rendez-vous, commandes, moodboards enregistrés, produits favoris, valeur totale générée, notes internes, consentement marketing.

**Segments automatiques** : prospects chauds (demande de moins de 7 jours sans réponse), clients actifs, clients dormants (plus de 6 mois), professionnels, gros budgets.

**Validation des comptes professionnels** : file d'attente des inscriptions avec pièces justificatives, boutons Approuver / Refuser / Demander un complément, attribution de la grille tarifaire professionnelle.

**Export** conforme RGPD, et suppression sur demande.

---

### 19.8 Module 6 — STATISTIQUES

**Onglet Trafic** — visiteurs, sessions, pages vues, durée moyenne, taux de rebond, appareils, navigateurs, provenance géographique, sources d'acquisition, pages d'entrée et de sortie. Intégration Google Analytics 4 affichée directement dans le back-office (pas besoin d'ouvrir GA).

**Onglet Produits** — les plus vus, les plus demandés, les plus ajoutés aux moodboards, ceux avec le meilleur ratio vues/demandes, ceux jamais vus (à retravailler ou dépublier).

**Onglet Conversion** — entonnoir complet, taux par étape, taux par source de trafic, valeur moyenne d'une demande, délai moyen entre première visite et demande.

**Onglet Configurateur** — nombre de configurations lancées, taux d'aboutissement, étape d'abandon la plus fréquente, options les plus choisies (précieux pour décider quelles matières commander en stock), configurations abandonnées récupérables.

**Onglet Recherche** — requêtes les plus fréquentes, requêtes sans résultat, taux de clic après recherche.

**Onglet Commercial** — devis envoyés, taux d'acceptation, délai moyen de réponse par commercial, chiffre d'affaires signé, valeur moyenne d'un devis, prévisionnel du mois.

**Rapports** — génération d'un rapport mensuel en PDF, envoi automatique par e-mail le 1er de chaque mois.

---

### 19.9 Module 7 — RÉGLAGES

- **Informations générales** : nom, logo, coordonnées, réseaux sociaux, numéro WhatsApp professionnel.
- **Showrooms** : adresses, coordonnées GPS, horaires par jour, jours de fermeture, photos, conseillers rattachés.
- **Livraison** : zones, tarifs, délais, seuil de gratuité, options de montage.
- **Paiement** : passerelle, acompte par défaut, conditions.
- **E-mails** : modèles modifiables (confirmation de demande, devis, rappel de RDV, newsletter), avec aperçu.
- **Notifications** : qui reçoit quoi, par e-mail et par WhatsApp.
- **SEO global** : titre par défaut, image de partage, `robots.txt`, plan de site, redirections 301.
- **Intégrations** : Google Analytics, Meta Pixel, WhatsApp Business, Instagram, Mapbox.
- **Utilisateurs** : comptes, rôles, dernière connexion, double authentification.
- **Sauvegardes** : historique, restauration.
- **Corbeille** : éléments supprimés depuis 30 jours, restaurables.

---
---

# PARTIE V — CAHIER DES CHARGES TECHNIQUE

*Destiné à une équipe React · Next.js · TypeScript · Tailwind · Framer Motion · GSAP · Node.js*

## 20. Stack et architecture applicative

### 20.1 Choix techniques

| Couche | Technologie | Justification |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Rendu serveur pour le SEO, streaming, optimisation d'images native, routes API intégrées |
| Langage | **TypeScript strict** | `strict: true`, aucun `any` toléré en revue de code |
| Styles | **Tailwind CSS 4** + variables CSS | Les tokens de design (§2) sont déclarés comme variables CSS et exposés dans la configuration Tailwind |
| Animation UI | **Framer Motion** | Transitions de page, apparitions, `layoutId` pour les transitions partagées |
| Animation scroll | **GSAP + ScrollTrigger** | Ancrage, défilement horizontal, séquences canvas, chronologies complexes |
| Défilement | **Lenis** | Défilement inertiel, synchronisé avec ScrollTrigger |
| 3D / AR | **React Three Fiber + Drei**, `<model-viewer>` | Configurateur V3 et réalité augmentée |
| API | **Node.js 22 + Fastify** (ou routes Next.js) | Une API séparée est préférable dès que le back-office devient conséquent |
| Base de données | **PostgreSQL 16 + Prisma** | Relationnel, extension pgvector pour la recherche par similarité |
| Recherche | **Meilisearch** | Auto-hébergeable, tolérant aux fautes, réponse < 30 ms |
| Médias | **Cloudinary** ou **S3 + imgix** | Transformation à la volée, AVIF/WebP, zoom pyramidal |
| Authentification | **Auth.js** (NextAuth) | Sessions client, rôles admin, double authentification |
| E-mails | **Resend** + React Email | Modèles en composants React |
| Paiement | **Clictopay / Paymee / Konnect** | Passerelles opérationnelles en Tunisie |
| Hébergement | **Vercel** (front) + **Railway / VPS** (API, BDD, Meilisearch) | Alternative full-VPS avec Coolify si l'on veut tout maîtriser |
| Analytique | **GA4** + **Plausible** + Meta Pixel | Plausible pour les données propres, GA4 pour la profondeur |
| Suivi d'erreurs | **Sentry** | Front et back |
| CI/CD | **GitHub Actions** | Lint, types, tests, build, prévisualisation par branche |

### 20.2 Organisation du dépôt

```
mood-store/
├── apps/
│   ├── web/                        # Next.js — site public
│   │   ├── app/
│   │   │   ├── (site)/
│   │   │   │   ├── page.tsx                    # Home
│   │   │   │   ├── collections/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [categorie]/
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── [produit]/page.tsx
│   │   │   │   ├── sur-mesure/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── configurateur/page.tsx
│   │   │   │   │   ├── matieres/page.tsx
│   │   │   │   │   └── projet/page.tsx
│   │   │   │   ├── inspirations/
│   │   │   │   ├── realisations/
│   │   │   │   ├── professionnels/
│   │   │   │   ├── showroom/
│   │   │   │   ├── a-propos/
│   │   │   │   ├── contact/
│   │   │   │   ├── journal/
│   │   │   │   └── compte/
│   │   │   ├── api/
│   │   │   ├── sitemap.ts
│   │   │   ├── robots.ts
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/                 # Bouton, Champ, Modale, Accordéon…
│   │   │   ├── layout/             # EnTete, PiedDePage, MegaMenu, BarreMobile
│   │   │   ├── sections/           # Hero, TroisMetiers, RailCollections…
│   │   │   ├── produit/            # Galerie, PanneauInfo, Variantes, ZoomHD
│   │   │   ├── configurateur/
│   │   │   ├── inspirations/
│   │   │   ├── motion/             # RevelationMasque, Parallaxe, SequenceCanvas
│   │   │   └── media/              # ImageIntelligente, Comparateur, Panorama360
│   │   ├── lib/
│   │   ├── hooks/
│   │   └── styles/
│   ├── admin/                      # Back-office (Next.js séparé ou route /admin protégée)
│   └── api/                        # Fastify (si API séparée)
├── packages/
│   ├── database/                   # Prisma : schéma, migrations, seed
│   ├── ui/                         # Design system partagé
│   ├── config/                     # ESLint, TS, Tailwind
│   └── types/                      # Types partagés
└── turbo.json
```

### 20.3 Conventions de développement

- Composants serveur par défaut ; `"use client"` uniquement pour l'interactivité.
- Un composant par fichier, nommé en PascalCase, avec ses types exportés.
- Aucune valeur de couleur, d'espacement ou de durée écrite en dur : uniquement des tokens.
- Toutes les chaînes de texte visibles passent par un fichier de contenu (facilite l'ajout futur de l'anglais).
- Les animations sont encapsulées dans des composants réutilisables (`<RevelationMasque>`, `<Parallaxe>`) — jamais de GSAP dispersé dans les pages.
- Tests : Vitest pour la logique, Playwright pour les parcours critiques (devis, configurateur, prise de RDV).
- Revue de code obligatoire, `main` protégée, prévisualisation Vercel par branche.

---

## 21. Modèle de données

Schéma Prisma simplifié — entités principales et relations.

```prisma
model Produit {
  id                String    @id @default(cuid())
  nom               String
  slug              String    @unique
  reference         String    @unique
  descriptionCourte String
  descriptionLongue String?   @db.Text
  motAtelier        String?   @db.Text
  prix              Decimal?
  prixPro           Decimal?
  prixSurDemande    Boolean   @default(false)
  surMesurePossible Boolean   @default(true)
  delaiFabrication  Int?      // en jours
  statut            Statut    @default(BROUILLON)
  miseEnAvant       Boolean   @default(false)
  nouveaute         Boolean   @default(false)
  vues              Int       @default(0)
  modeleGlb         String?
  modeleUsdz        String?
  categorieId       String
  categorie         Categorie @relation(fields: [categorieId], references: [id])
  collections       Collection[]
  medias            Media[]
  variantes         Variante[]
  dimensions        Dimension[]
  caracteristiques  Json?
  similaires        Produit[]  @relation("Similaires")
  seo               Seo?
  creeLe            DateTime  @default(now())
  modifieLe         DateTime  @updatedAt
  @@index([categorieId, statut])
}

model Variante {
  id           String   @id @default(cuid())
  produitId    String
  produit      Produit  @relation(fields: [produitId], references: [id], onDelete: Cascade)
  reference    String
  matiereId    String?
  couleurId    String?
  boisId       String?
  pietement    String?
  dimensionId  String?
  surcout      Decimal  @default(0)
  disponible   Boolean  @default(true)
  delai        Int?
  mediaId      String?
}

model Matiere {
  id           String      @id @default(cuid())
  nom          String
  type         TypeMatiere // TISSU | CUIR | BOIS | METAL | PIERRE
  famille      String?
  photoMacro   String
  pastille     String
  composition  String?
  martindale   Int?
  entretien    String?     @db.Text
  prixUnitaire Decimal?
  echantillonDispo Boolean @default(false)
  stockEchantillon Int     @default(0)
  variantes    Variante[]
}

model Couleur {
  id      String @id @default(cuid())
  nom     String
  hex     String
  famille String
  rendu   String?
}

model Dimension {
  id            String  @id @default(cuid())
  produitId     String
  nom           String
  largeur       Int
  profondeur    Int
  hauteur       Int
  hauteurAssise Int?
  poids         Decimal?
  surcout       Decimal @default(0)
  schema        String?
}

model Categorie {
  id          String      @id @default(cuid())
  nom         String
  slug        String      @unique
  description String?
  imageHero   String?
  parentId    String?
  parent      Categorie?  @relation("Arbre", fields: [parentId], references: [id])
  enfants     Categorie[] @relation("Arbre")
  ordre       Int         @default(0)
  produits    Produit[]
  seo         Seo?
}

model Collection {
  id          String    @id @default(cuid())
  nom         String
  slug        String    @unique
  recit       String?   @db.Text
  couverture  String?
  produits    Produit[]
}

model Media {
  id        String    @id @default(cuid())
  url       String
  urlMaster String            // chemin du master haute définition, jamais servi tel quel
  largeur   Int
  hauteur   Int
  alt       String
  legende   String?
  role      RoleMedia         // PRINCIPALE | SITUATION | MACRO | DETAIL | SCHEMA
  lqip      String            // placeholder base64
  ordre     Int       @default(0)
  produitId String?
}

model Inspiration {
  id          String   @id @default(cuid())
  titre       String
  slug        String   @unique
  imagePrincipale String
  images      String[]
  styles      String[] // MINIMALISTE | JAPANDI | MODERNE | CONTEMPORAIN | LUXURY
  tons        String[] // BOIS | MARBRE | NOIR | BEIGE
  piece       String?
  description String?  @db.Text
  hotspots    Json     // [{ x, y, produitId }]
  publiee     Boolean  @default(false)
}

model Realisation {
  id            String   @id @default(cuid())
  titre         String
  slug          String   @unique
  typologie     String   // APPARTEMENT | VILLA | BUREAU | HOTEL | RESTAURANT | COMMERCE
  ville         String
  surface       Int?
  annee         Int
  dureeChantier String?
  contexte      String?  @db.Text
  galerie       String[]
  avantApres    Json     // [{ avant, apres, legende }]
  plans         String[]
  matieres      Matiere[]
  produits      Produit[]
  temoignage    Json?    // { texte, nom, photo }
  chiffresCles  Json?
  publiee       Boolean  @default(false)
}

model Demande {
  id            String        @id @default(cuid())
  canal         CanalDemande  // DEVIS | CONFIGURATION | PROJET | CONTACT | PRO | ECHANTILLON
  statut        StatutDemande @default(NOUVEAU)
  nom           String
  telephone     String
  email         String?
  ville         String?
  message       String?       @db.Text
  budget        String?
  echeance      String?
  produitId     String?
  configuration Json?         // instantané complet de la configuration
  fichiers      String[]
  source        String?       // instagram | google | direct | whatsapp
  parcours      Json?         // pages vues avant la demande
  valeurEstimee Decimal?
  assigneA      String?
  notes         Note[]
  devis         Devis[]
  creeLe        DateTime      @default(now())
  @@index([statut, creeLe])
}

model Devis {
  id         String      @id @default(cuid())
  numero     String      @unique
  demandeId  String
  lignes     Json        // [{ designation, options, quantite, prixUnitaire, remise }]
  totalHT    Decimal
  tva        Decimal
  totalTTC   Decimal
  acompte    Decimal?
  validite   DateTime
  statut     StatutDevis @default(BROUILLON)
  pdfUrl     String?
  envoyeLe   DateTime?
  vuLe       DateTime?
  reponduLe  DateTime?
}

model RendezVous {
  id         String   @id @default(cuid())
  showroomId String
  clientId   String?
  nom        String
  telephone  String
  email      String?
  motif      String
  dateHeure  DateTime
  conseiller String?
  statut     StatutRdv @default(DEMANDE)
  produits   Produit[]
  commentaire String?
  @@index([showroomId, dateHeure])
}

model Showroom {
  id         String  @id @default(cuid())
  nom        String
  slug       String  @unique
  adresse    String
  latitude   Float
  longitude  Float
  telephone  String
  horaires   Json    // { lundi: { ouverture, fermeture }, ... }
  fermetures DateTime[]
  photos     String[]
  panorama360 String?
  rendezVous RendezVous[]
}

model Client {
  id            String   @id @default(cuid())
  nom           String
  email         String   @unique
  telephone     String?
  type          TypeClient @default(PARTICULIER)
  proValide     Boolean  @default(false)
  proDocuments  String[]
  ville         String?
  demandes      Demande[]
  moodboards    Moodboard[]
  favoris       Produit[]
  consentement  Boolean  @default(false)
  notes         String?  @db.Text
}

model Moodboard {
  id        String   @id @default(cuid())
  clientId  String?
  titre     String
  elements  Json     // [{ type, refId, x, y, largeur, rotation, note }]
  partageId String   @unique  // lien public
  creeLe    DateTime @default(now())
}

model Configuration {
  id          String   @id @default(cuid())
  typeProduit String
  options     Json
  rendu       String?
  prixEstime  Json     // { min, max }
  aboutie     Boolean  @default(false)
  sessionId   String
  creeLe      DateTime @default(now())
}

model RechercheLog {
  id        String   @id @default(cuid())
  requete   String
  resultats Int
  clic      Boolean  @default(false)
  creeLe    DateTime @default(now())
  @@index([requete])
}
```

**Extension vectorielle** — table `produit_embedding (produit_id, vecteur vector(512))` avec pgvector, alimentée par CLIP, pour la recherche par photo (§18.4).

---

## 22. API

### 22.1 Endpoints publics

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/produits` | Liste filtrée et paginée (`?categorie=&matiere=&couleur=&style=&tri=&page=`) |
| GET | `/api/produits/[slug]` | Détail complet avec variantes, médias, dimensions, similaires |
| GET | `/api/categories` | Arborescence |
| GET | `/api/collections` | Collections avec produits |
| GET | `/api/matieres` | Nuancier filtrable |
| GET | `/api/inspirations` | Grille filtrée, chargement par curseur |
| GET | `/api/realisations` | Liste et détail |
| GET | `/api/recherche?q=` | Proxy Meilisearch avec analyse d'intention |
| POST | `/api/recherche/photo` | Recherche par similarité visuelle (multipart) |
| POST | `/api/demandes` | Création d'une demande (tous canaux) |
| POST | `/api/configurations` | Enregistrement d'une configuration |
| POST | `/api/configurations/[id]/pdf` | Génération de la fiche PDF |
| GET | `/api/showrooms/[slug]/creneaux?date=` | Créneaux disponibles |
| POST | `/api/rendez-vous` | Prise de rendez-vous |
| POST | `/api/moodboards` | Création / mise à jour |
| GET | `/api/moodboards/[partageId]` | Consultation publique |
| POST | `/api/echantillons` | Demande d'échantillons |
| POST | `/api/newsletter` | Inscription |
| POST | `/api/assistant` | Conversation avec l'assistant IA (flux SSE) |

### 22.2 Endpoints administrateur (`/api/admin/*`, authentifiés)

CRUD complet sur toutes les entités, plus :

| Méthode | Route | Description |
|---|---|---|
| GET | `/api/admin/stats/dashboard` | Indicateurs et graphiques du tableau de bord |
| GET | `/api/admin/stats/produits` | Vues, demandes, ratios |
| GET | `/api/admin/stats/conversion` | Entonnoir |
| GET | `/api/admin/stats/configurateur` | Abandons, options choisies |
| GET | `/api/admin/stats/recherches` | Requêtes sans résultat |
| POST | `/api/admin/devis/[id]/envoyer` | Envoi e-mail + WhatsApp |
| POST | `/api/admin/medias/upload` | Téléversement avec génération des dérivés |
| POST | `/api/admin/pros/[id]/valider` | Validation d'un compte professionnel |
| GET | `/api/admin/export/[entite]` | Export CSV |

### 22.3 Règles transverses

- Toutes les réponses en JSON typé, avec un enveloppement `{ data, meta, error }`.
- Pagination par curseur sur les listes longues.
- Limitation de débit : 10 requêtes/minute sur les endpoints de création, 100/minute en lecture.
- Validation d'entrée systématique avec **Zod**, schémas partagés entre client et serveur.
- Cache : `revalidate` de 3600 s sur le catalogue, invalidation à la demande (`revalidateTag`) déclenchée par le back-office à chaque publication.
- Webhooks sortants vers WhatsApp Business à chaque nouvelle demande.

---

## 23. Performance, SEO, accessibilité, sécurité

### 23.1 Performance — objectifs contractuels

| Indicateur | Cible | Contexte de mesure |
|---|---|---|
| LCP | < 2,0 s | Mobile 4G, PageSpeed Insights |
| INP | < 200 ms | Terrain |
| CLS | < 0,05 | Terrain |
| TTFB | < 400 ms | Depuis la Tunisie |
| Score Lighthouse Performance | ≥ 90 mobile | Sur les 5 pages principales |
| Poids de la première vue | < 1 Mo | Home |
| JavaScript initial | < 180 ko compressé | Home |

**Moyens**
- Composants serveur par défaut ; le JavaScript client est réservé à l'interactif.
- GSAP et Three.js chargés en `dynamic import` uniquement sur les pages qui les utilisent.
- Polices en `woff2` variable, `font-display: swap`, préchargées, sous-ensemble latin uniquement.
- Images : voir §4.2. Le hero est en `priority`, tout le reste en `lazy`.
- Préchargement au survol des liens produit (`prefetch` Next.js).
- Toutes les dimensions d'images déclarées pour éviter tout décalage de mise en page.
- Budget de performance vérifié automatiquement en CI : le build échoue si le poids dépasse le seuil.

### 23.2 SEO

**Technique**
- Rendu serveur sur toutes les pages publiques.
- URLs propres, en français, sans paramètres inutiles.
- Balises `title` et `meta description` uniques et rédigées à la main sur toutes les pages importantes.
- Données structurées JSON-LD : `Product` (avec `offers`, `aggregateRating` si avis), `LocalBusiness` pour chaque showroom, `BreadcrumbList`, `Article` pour le journal, `FAQPage` pour les questions fréquentes, `ImageObject` sur les réalisations.
- Plan de site XML généré automatiquement, segmenté (produits / inspirations / réalisations / journal).
- `robots.txt` propre, balises canoniques sur les pages filtrées.
- Les combinaisons de filtres à fort volume de recherche reçoivent une page dédiée indexable ; les autres sont en `noindex, follow`.

**Contenu — pages ciblées à créer**

| Page | Requête visée |
|---|---|
| `/sur-mesure` | meuble sur mesure Tunis |
| `/collections/salon/canapes` | canapé sur mesure Tunisie |
| `/sur-mesure/projet` | architecte d'intérieur Tunis |
| `/realisations?typologie=villa` | décoration villa Tunisie |
| `/showroom/tunis` | showroom meuble La Soukra |
| `/showroom/sousse` | magasin meuble Sousse |
| Journal | requêtes longue traîne (« comment choisir son canapé », « quelle hauteur pour une table à manger ») |

**Local**
Fiches Google Business Profile pour les deux showrooms, photos, horaires, publications hebdomadaires, collecte d'avis. C'est le levier le plus rentable et le plus négligé en Tunisie.

### 23.3 Accessibilité — WCAG 2.1 AA

- Contraste minimum 4,5:1 pour le texte courant, 3:1 pour les grands titres. **Attention** : le beige clair sur blanc cassé échoue systématiquement — le texte doit toujours être en `--gris-fume` ou `--noir-encre`.
- Navigation complète au clavier, ordre de tabulation logique, focus toujours visible (contour bronze de 2 px, jamais supprimé).
- Cibles tactiles de 44×44 px minimum.
- Texte alternatif obligatoire sur toutes les images (champ bloquant dans le back-office).
- Hiérarchie de titres correcte, un seul `h1` par page.
- Formulaires : `label` associé à chaque champ, erreurs annoncées via `aria-live`, jamais signalées par la couleur seule.
- Carrousels : boutons précédent/suivant accessibles, pas uniquement le glissement tactile.
- Lecture vidéo/animation : respect de `prefers-reduced-motion`, aucun contenu clignotant.
- Lien d'évitement « Aller au contenu » en début de page.
- Audit avec axe-core intégré à la CI + test manuel au lecteur d'écran sur les parcours critiques.

### 23.4 Sécurité

- HTTPS strict, HSTS, en-têtes de sécurité (CSP, X-Frame-Options, Referrer-Policy).
- Validation Zod sur toutes les entrées, requêtes paramétrées via Prisma (aucune injection SQL possible).
- Protection CSRF sur les formulaires, hCaptcha invisible sur les envois publics.
- Téléversements : liste blanche d'extensions, taille maximale, analyse antivirus, stockage hors répertoire public, noms de fichiers régénérés.
- Back-office : authentification obligatoire, double facteur pour les administrateurs, sessions expirant après 8 h, limitation des tentatives de connexion.
- Secrets en variables d'environnement, jamais dans le dépôt.
- Sauvegardes quotidiennes de la base et des médias, conservées 30 jours, restauration testée trimestriellement.
- RGPD : bandeau de consentement, politique de confidentialité, export et suppression des données sur demande.

---

## 24. Lotissement et planning

### 24.1 Lots de livraison

**LOT 1 — Fondations** *(2 semaines)*
Mise en place du dépôt, design system complet en code (tokens, composants UI, typographie, grille), schéma de base de données, pipeline média, en-tête / pied de page / navigation, transitions de page, défilement inertiel.
*Livrable : une page de démonstration du design system.*

**LOT 2 — Site vitrine** *(3 semaines)*
Home complète avec toutes ses sections et animations, Collections, catégories, À propos, Contact, Showrooms avec carte et prise de RDV, Journal.
*Livrable : site vitrine navigable, contenu de démonstration.*

**LOT 3 — Catalogue et produit** *(2,5 semaines)*
Page produit premium complète, galerie et zoom pyramidal, sélecteurs de variantes, fiche PDF, filtres, recherche Meilisearch, moodboard et favoris.
*Livrable : parcours catalogue complet.*

**LOT 4 — Conversion** *(2 semaines)*
Configurateur V1 (superposition 2D), formulaire de projet sur mesure avec dépôt de fichiers, demandes de devis, intégration WhatsApp, espace professionnel, demandes d'échantillons.
*Livrable : tous les parcours de génération de demandes opérationnels.*

**LOT 5 — Éditorial** *(1,5 semaine)*
Inspirations avec grille en maçonnerie, points chauds, filtres ; Réalisations et études de cas ; comparateur avant/après ; visite virtuelle 360°.

**LOT 6 — Back-office** *(3 semaines)*
Tous les modules décrits en Partie IV : tableau de bord, catalogue, contenu, demandes, clients, statistiques, réglages.

**LOT 7 — Recette et lancement** *(1,5 semaine)*
Intégration des contenus réels, optimisation des performances, audit d'accessibilité, SEO technique, tests Playwright, formation de l'équipe Mood Store (2 sessions de 2 h + guide vidéo), mise en production.

**Total : environ 15,5 semaines** pour la version complète.

### 24.2 Version accélérée recommandée pour un premier lancement

Si l'objectif est de mettre le site en ligne rapidement pour commencer à générer des demandes :

**Lots 1 + 2 + 3 + une partie du 4 (configurateur reporté) + back-office simplifié = 8 semaines.**

Le configurateur, l'AR, l'assistant IA et la recherche par photo constituent alors la **phase 2**, vendue séparément une fois que le client a constaté le retour sur investissement du premier lancement. C'est aussi la meilleure façon de convaincre un atelier qui n'a jamais eu de site : commencer par un périmètre qu'il comprend, et laisser les fonctionnalités spectaculaires arriver ensuite.

### 24.3 Ce que le client doit fournir — à réclamer dès la première réunion

C'est ce qui retarde 90 % des projets. À contractualiser :

- [ ] Photos haute définition des produits — **minimum 3000 px**, jamais récupérées depuis Instagram
- [ ] Photos des réalisations livrées, avec autorisation des clients
- [ ] Photos avant/après d'au moins 3 chantiers
- [ ] Photos de l'atelier et de l'équipe
- [ ] Liste exhaustive des matières, tissus, cuirs, bois et finitions disponibles, avec photos macro
- [ ] Grille tarifaire ou fourchettes indicatives par famille de produits
- [ ] Textes de présentation : histoire de la marque, savoir-faire, engagements
- [ ] Logo en format vectoriel (SVG ou AI)
- [ ] Coordonnées complètes des deux showrooms, horaires exacts
- [ ] Accès au compte Instagram (pour le flux intégré)
- [ ] Numéro WhatsApp Business
- [ ] 3 à 5 témoignages clients avec nom et autorisation
- [ ] Mentions légales : raison sociale, matricule fiscal, adresse du siège

### 24.4 Maintenance et évolution

À proposer en contrat mensuel — c'est ce qui rend le projet rentable dans la durée :

- Hébergement, sauvegardes, mises à jour de sécurité
- 2 articles de journal par mois (SEO)
- Ajout des nouveaux produits et réalisations
- Rapport mensuel : trafic, demandes générées, produits les plus consultés, recommandations
- Corrections et petites évolutions (forfait d'heures)
- Suivi et optimisation des campagnes Meta pointant vers des pages produit précises

---

## Annexe A — Récapitulatif des tokens de design

```css
:root {
  /* Couleurs */
  --noir-encre: #0A0A0A;
  --noir-doux: #1C1B19;
  --blanc-casse: #F7F4EF;
  --blanc-pur: #FFFFFF;
  --beige-boucle: #E3D9CB;
  --sable: #C9BCA9;
  --bois-naturel: #A87F52;
  --bronze: #9C7B4D;
  --gris-pierre: #8B8880;
  --gris-fume: #4A4845;

  /* Typographie */
  --font-display: 'Canela', 'Cormorant Garamond', Georgia, serif;
  --font-corps: 'Inter', -apple-system, sans-serif;

  /* Espacement */
  --esp-1: 4px;   --esp-2: 8px;   --esp-3: 16px;  --esp-4: 24px;
  --esp-5: 32px;  --esp-6: 48px;  --esp-7: 64px;  --esp-8: 96px;
  --esp-9: 128px; --esp-10: 160px; --esp-11: 200px;

  /* Mouvement */
  --motion-instant: 150ms;
  --motion-rapide: 300ms;
  --motion-base: 600ms;
  --motion-ample: 900ms;
  --motion-cine: 1400ms;
  --ease-doux: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-cine: cubic-bezier(0.83, 0, 0.17, 1);

  /* Mise en page */
  --largeur-max: 1280px;
  --marge-laterale: 80px;
  --gouttiere: 32px;
}
```

## Annexe B — Checklist avant mise en ligne

**Contenu**
- [ ] Toutes les images ≥ 2000 px, en AVIF/WebP, avec texte alternatif
- [ ] Aucun texte de remplissage (« lorem ipsum ») nulle part
- [ ] Toutes les fiches produit ont au minimum 5 visuels
- [ ] Mentions légales, CGV et politique de confidentialité rédigées et validées

**Technique**
- [ ] Score Lighthouse ≥ 90 sur mobile, sur les 5 pages principales
- [ ] Aucune erreur console en production
- [ ] Plan de site soumis à Google Search Console
- [ ] Redirections 301 en place si d'anciennes URLs existent
- [ ] Formulaires testés de bout en bout, e-mails reçus
- [ ] WhatsApp testé depuis iOS et Android
- [ ] Sauvegarde automatique vérifiée
- [ ] Certificat SSL et en-têtes de sécurité actifs
- [ ] Sentry connecté, alertes configurées

**Accessibilité**
- [ ] Audit axe-core sans erreur bloquante
- [ ] Navigation clavier complète vérifiée
- [ ] Contrastes validés sur toutes les combinaisons de la palette

**Commercial**
- [ ] Google Analytics et Meta Pixel actifs et testés
- [ ] Objectifs de conversion configurés (devis, RDV, WhatsApp)
- [ ] Fiches Google Business Profile créées pour les deux showrooms
- [ ] Équipe Mood Store formée au back-office
- [ ] Procédure de réponse aux demandes définie (qui, sous quel délai)

---

*Fin du cahier des charges — Mood Store, version 1.0*
