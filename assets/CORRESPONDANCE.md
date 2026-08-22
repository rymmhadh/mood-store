# Où va chaque photo

Table de correspondance entre les dossiers de `assets/` et le site.
Après toute modification ici, relancer :

```
python3 Frontend/scripts/images.py
```

puis vider `.next` et redémarrer le serveur.

---

## 1. Un dossier = une pièce du catalogue

| Dossier `assets/` | Page produit | Nom affiché |
|---|---|---|
| `salonbubble/` | `/produit/bulle` | Bulle — canapé modulable |
| `salonblanc/` | `/produit/horizon` | Horizon — canapé d'angle |
| `salon3/` | `/produit/onde` | Onde — canapé courbe |
| `salonprestige/` | `/produit/sillage` | Sillage — canapé courbe |
| `salon2/` | `/produit/grenat` | Grenat — canapé d'angle |
| `salon1/` | `/produit/rivage` | Rivage — canapé d'angle |
| `chaise vert/` | `/produit/trait` | Trait — fauteuil |
| `mouton/` | `/produit/mouton` | Le Mouton |
| `Table1/` | `/produit/perle` | Perle — table ronde |
| `tablenoirronde/` | `/produit/onyx` | Onyx — table ronde |
| `tablelonguenoir/` | `/produit/ovale` | Ovale — table ovale |
| `tablecareebeige/` | `/produit/albe` | Albe — table rectangulaire |
| `lit1/` | `/produit/rive` | Rive — lits jumeaux |
| `lit2/` | `/produit/nuage` | Nuage — lit double |

> Le dossier `ptitpouffe/` n'a plus de fiche produit : la pièce Galet a été
> retirée du catalogue. Ses photos restent utilisées pour l'habillage du site
> (métier « Meuble sur mesure », mosaïque de l'atelier, nuancier).

## 2. Rôle de chaque fichier dans un dossier

| Nom du fichier | Où il apparaît |
|---|---|
| `uno.png` | Visuel principal : vignette de la grille, premier plan de la fiche produit |
| `duo.png` | Visuel de survol de la vignette, deuxième plan de la fiche |
| `trio.png` | Troisième plan de la fiche |
| `four.png` | Quatrième plan |
| `cinq.png` | Cinquième plan |
| tout autre nom | Suite de la galerie, par ordre alphabétique |

> `tablecareebeige/` n'a ni `uno` ni `duo` : ce sont donc les deux fichiers
> présents, par ordre alphabétique, qui font office de visuel principal et de
> visuel de survol. Renommez-les en `uno.png` et `duo.png` pour choisir.

## 3. Photos réutilisées ailleurs sur le site

Certains fichiers servent aussi à l'habillage. Les remplacer change donc
**deux endroits** à la fois.

| Fichier | Autre emplacement |
|---|---|
| `salonprestige/duo.png` | Accueil — hero, diapositive 1 |
| `salonblanc/4ba963a1….png` | Accueil — hero, diapositive 2 |
| `Table1/154de7f3….png` | Accueil — hero, diapositive 3 |
| `salon3/e945203b….png` | Accueil — hero, diapositive 4 |
| `ptitpouffe/uno.png` | Métier « Meuble sur mesure » · nuancier Bouclé Sable |
| `ptitpouffe/duo.png` | Nuancier Chêne |
| `salonblanc/duo.png` | Métier « Architecture d'intérieur » |
| `mouton/uno.png` | Métier « Décoration » |
| `salonbubble/uno.png` | Méga-menu carte BOUCLÉ · nuancier Noyer |
| `tablenoirronde/uno.png` | Méga-menu carte ONYX |
| `mouton/tri.png` | Méga-menu carte MOUTON |
| `salon1/74908274….png` | Réalisation Villa La Marsa · nuancier Lin Naturel |
| `lit2/64b69178….png` | Réalisation Appartement Lac 2 |
| `salon2/46e9e2ed….png` | Réalisation Duplex Sousse |
| `salon3/64087082….png` | Atelier, mosaïque 1 |
| `tablelonguenoir/f8b45d6f….png` | Atelier, mosaïque 2 |
| `ptitpouffe/a935cb97….png` | Atelier, mosaïque 3 |
| `salonblanc/efa94a85….png` | Atelier, mosaïque 4 |
| `salonblanc/2d167122….png` | Photo du showroom de Tunis |
| `Table1/8eff2191….png` | Photo du showroom de Sousse |
| `lit1/43cd8f44….png` | Comparateur avant / après — AVANT |
| `lit1/f9f498ba….png` | Comparateur avant / après — APRÈS |
| `chaise vert/2e68f788….png` | Fond sombre du bloc sur-mesure |
| `salon2/afd7388a….png` | Journal, article 1 |
| `salonprestige/a7930be2….png` | Journal, article 2 |
| `tablecareebeige/2cf3adb8….png` | Journal article 3 · nuancier Marbre Crema |
| `salon3/uno.png` | Nuancier — Bouclé Écru |
| `chaise vert/uno.png` | Nuancier — Velours Olive |
| `chaise vert/duo.png` | Nuancier — Cuir Noir et Acier laqué |
| `salon2/duo.png` | Nuancier — Velours Terracotta |
| `tablelonguenoir/uno.png` | Nuancier — Laque noire |
| `tablelonguenoir/duo.png` | Nuancier — Marbre Marquina |

## 4. Vidéos

Rangées dans `assets/videos/`, retraitées par un script distinct :

```
python3 Frontend/scripts/videos.py
```

| Fichier source | Où il apparaît | Comportement |
|---|---|---|
| `before after.mp4` | Accueil — section « La même pièce. Deux vies. » | Démarre seule, muette, en boucle |
| `atelier mood store.mp4` | Accueil — section Atelier, colonne gauche | Au clic, avec le son |
| `video atelier.mp4` | Accueil — section Atelier, colonne droite | Au clic, avec le son |

Le script effectue trois opérations :

1. **Recadrage** des 5,5 % inférieurs, pour supprimer le filigrane « InShOt »
   laissé par l'application de montage.
2. **Compression** en H.264, avec une version 640 px et une version 420 px
   pour les téléphones.
3. **Extraction d'une affiche** fixe. C'est elle qui s'affiche ; la vidéo ne
   se télécharge qu'à la demande.

Pour changer la seconde de l'affiche ou le nom de sortie, voir le tableau
`VIDEOS` dans `Frontend/scripts/videos.py`.

## 5. Matières sans photo

`cuir-cognac` et `laiton` ne figurent sur aucune image : ils s'affichent en
aplat de couleur. Une prise de vue des échantillons à plat suffirait à les
compléter.

## 6. Attention aux cadrages

Les visuels du hero, du méga-menu et du nuancier sont des **recadrages
serrés** sur une zone précise de la photo. Si vous remplacez un master par
une image dont la composition diffère, le cadrage peut tomber à côté du
sujet. Les coordonnées se règlent dans `Frontend/scripts/images.py`,
tableau `JEU` : chaque ligne donne `(dossier, rang), sortie, ratio, cx, cy,
zoom, largeur` — `cx` et `cy` étant le centre du cadre, de 0 à 1.
