#!/usr/bin/env python3
"""
Régénération des visuels du site.

    cd MoodStore
    python3 Frontend/scripts/images.py

À lancer après CHAQUE modification du dossier `assets/`.

Pourquoi c'est nécessaire : les fichiers de `Frontend/public/images/` ne sont
pas vos photos, ce sont des dérivés — recadrés, agrandis, étalonnés et
convertis en WebP. Remplacer un master dans `assets/` ne les met pas à jour
tout seul.

Ensuite, videz le cache de Next :

    cd Frontend
    Remove-Item -Recurse -Force .next     # PowerShell
    npm run dev

Dépendance : pip install pillow

Convention de nommage dans chaque dossier de `assets/` :
    uno.png   → visuel principal (grille, tête de fiche produit)
    duo.png   → visuel de survol
    trio.png, four.png, cinq.png → suite de la galerie
    tout autre nom → fin de galerie, par ordre alphabétique

Le nombre de visuels par pièce est resynchronisé automatiquement dans
`src/data/catalogue.ts` à la fin de l'exécution.
"""

from PIL import Image, ImageEnhance, ImageFilter
import os, glob

SRC = "assets"
OUT = "Frontend/public/images"
LARGEUR = 2400
QUALITE = 94

# Ordre de priorité des noms réservés
NOMMES = ("uno.png", "duo.png", "trio.png", "tri.png", "four.png", "cinq.png")


def grade(im):
    """Étalonnage commun : noirs relevés, léger virage chaud, contraste en S."""
    im = im.convert("RGB")
    lut = []
    for v in range(256):
        x = v / 255
        s = x + 0.13 * x * (1 - x) * (2 * x - 1)
        s = 0.035 + s * 0.965
        s = min(1.0, s * 1.035)
        lut.append(int(max(0, min(255, s * 255))))
    r, g, b = im.split()
    r = r.point([min(255, int(v * 1.022 + 2)) for v in lut])
    g = g.point([min(255, int(v * 1.004 + 1)) for v in lut])
    b = b.point([max(0, int(v * 0.980)) for v in lut])
    im = Image.merge("RGB", (r, g, b))
    im = ImageEnhance.Color(im).enhance(0.95)
    return ImageEnhance.Contrast(im).enhance(1.04)


# Visuels exclus de l'étalonnage : un portrait passé dans une courbe pensée
# pour du mobilier prend un teint jaune. On le laisse tel qu'il a été pris.
SANS_ETALONNAGE = ("insta-meriam",)


def produire(chemin, sortie, ratio=4 / 3, cx=0.5, cy=0.5, zoom=1.0,
             largeur=LARGEUR, q=QUALITE):
    im = Image.open(chemin).convert("RGB")
    W, H = im.size
    if W / H > ratio:
        h = int(H * zoom); w = int(h * ratio)
        if w > W:
            w = W; h = int(w / ratio)
    else:
        w = int(W * zoom); h = int(w / ratio)
        if h > H:
            h = H; w = int(h * ratio)
    x = int(max(0, min(W - w, cx * W - w / 2)))
    y = int(max(0, min(H - h, cy * H - h / 2)))
    im = im.crop((x, y, x + w, y + h))

    cible = (largeur, max(1, int(round(largeur / ratio))))
    facteur = cible[0] / im.width
    im = im.resize(cible, Image.LANCZOS)
    if facteur > 1.05:
        im = im.filter(ImageFilter.UnsharpMask(radius=1.3,
                                               percent=min(60, int(28 * facteur)),
                                               threshold=3))
    if not any(marqueur in sortie for marqueur in SANS_ETALONNAGE):
        im = grade(im)
    os.makedirs(os.path.dirname(sortie), exist_ok=True)
    im.save(sortie, "WEBP", quality=q, method=6)
    return im.size


def fichiers_du_dossier(dossier):
    """Noms réservés d'abord, puis le reste par ordre alphabétique."""
    tous = sorted(glob.glob(os.path.join(SRC, dossier, "*.png")))
    par_nom = {os.path.basename(f): f for f in tous}
    ordre = [par_nom.pop(n) for n in NOMMES if n in par_nom]
    ordre += [f for _, f in sorted(par_nom.items())]
    return ordre


def visuel(dossier, index):
    """Chemin du n-ième visuel d'un dossier, dans l'ordre défini ci-dessus."""
    fichiers = fichiers_du_dossier(dossier)
    if index >= len(fichiers):
        raise FileNotFoundError(f"{dossier} n'a que {len(fichiers)} visuel(s), index {index} demandé")
    return fichiers[index]


import json, os

OUT = "Frontend/public/images"

# ── 1. Logo ────────────────────────────────────────────────────────────
logo = Image.open(f"{SRC}/LogoMoodStore.png").convert("RGBA")
masque = logo.split()[-1].point(lambda v: 255 if v > 40 else 0)
bbox = masque.getbbox()
crop = logo.crop(bbox)
cote = max(crop.size)
carre = Image.new("RGBA", (cote, cote), (0, 0, 0, 0))
carre.paste(crop, ((cote - crop.width) // 2, (cote - crop.height) // 2), crop)
carre.save(f"{OUT}/logo-mood.png", optimize=True)
print(f"logo {carre.size}")

# ── 2. Produits ────────────────────────────────────────────────────────
PIECES = [
    ("salonbubble",     "bulle",    0.50),
    ("salonblanc",      "horizon",  0.50),
    ("salon3",          "onde",     0.50),
    ("salonprestige",   "sillage",  0.50),
    ("salon2",          "grenat",   0.50),
    ("salon1",          "rivage",   0.50),
    ("chaise vert",     "trait",    0.48),
    ("mouton",          "mouton",   0.48),
    ("Table1",          "perle",    0.52),
    ("tablenoirronde",  "onyx",     0.52),
    ("tablelonguenoir", "ovale",    0.52),
    ("tablecareebeige", "albe",     0.50),
    ("lit1",            "rive",     0.50),
    ("lit2",            "nuage",    0.50),
]
import shutil

comptes = {}
for dossier, slug, cy in PIECES:
    fichiers = fichiers_du_dossier(dossier)
    # On vide le dossier de sortie : un fichier déposé à la main ici (une
    # photo copiée directement dans public/ au lieu de assets/) serait sinon
    # conservé et masquerait le visuel régénéré.
    cible = f"{OUT}/produits/{slug}"
    if os.path.isdir(cible):
        shutil.rmtree(cible)
    for i, f in enumerate(fichiers):
        produire(f, f"{cible}/{i + 1}.webp", cy=cy)
    comptes[slug] = len(fichiers)
    noms = [os.path.basename(f) for f in fichiers]
    print(f"{slug:9} {len(fichiers)}  {' '.join(n[:9] for n in noms)}")

# Elagage : un dossier de piece retiree du catalogue doit disparaitre, sinon
# le site continue de servir les visuels d'un produit qui n'existe plus.
# Ne s'execute qu'apres la boucle, une fois `comptes` renseigne.
racine = f"{OUT}/produits"
if os.path.isdir(racine) and comptes:
    for orphelin in sorted(set(os.listdir(racine)) - set(comptes)):
        shutil.rmtree(os.path.join(racine, orphelin))
        print("orphelin supprime :", orphelin)

json.dump(comptes, open("comptes.json", "w"), indent=1)

# ── 3. Accueil, menu, matières ─────────────────────────────────────────
# Référencé par (dossier, rang) et non par nom de fichier : renommer ou
# remplacer un master ne casse plus la génération.
JEU = [
    # Hero — plans larges
    (("salonprestige", 1), "hero/1.webp",  16/9, .50, .52, 1.0, 2560),
    (("salonblanc", 3),    "hero/2.webp",  16/9, .50, .55, 1.0, 2560),
    (("Table1", 2),        "hero/3.webp",  16/9, .50, .52, 1.0, 2560),
    (("salon3", 3),        "hero/4.webp",  16/9, .50, .52, 1.0, 2560),

    # Les trois métiers
    (("ptitpouffe", 0),    "home/metier-1.webp", 4/5, .50, .52, 1.0, 1600),
    (("salonblanc", 1),    "home/metier-2.webp", 4/5, .50, .55, 1.0, 1600),
    (("mouton", 0),        "home/metier-3.webp", 4/5, .48, .48, 1.0, 1600),

    # Cartes du méga-menu — plans rapprochés
    (("salonbubble", 0),   "menu/1.webp", .40, .40, .55, .80, 1200),
    (("salon3", 0),        "menu/2.webp", .40, .50, .50, .55, 1200),
    (("tablenoirronde", 0),"menu/3.webp", .40, .48, .52, .80, 1200),
    (("mouton", 2),        "menu/4.webp", .40, .46, .48, .85, 1200),

    # Réalisations
    (("salon1", 2),        "home/real-1.webp", 4/5, .50, .55, 1.0, 1800),
    (("lit2", 2),          "home/real-2.webp", 4/3, .50, .50, 1.0, 1800),
    (("salon2", 3),        "home/real-3.webp", 4/3, .50, .52, 1.0, 1800),

    # Atelier
    (("salon3", 2),        "home/atelier-1.webp", 3/4, .50, .50, .95, 1400),
    (("tablelonguenoir",3),"home/atelier-2.webp", 1.0, .50, .50, .90, 1400),
    (("ptitpouffe", 2),    "home/atelier-3.webp", 1.0, .50, .55, .85, 1400),
    (("salonblanc", 4),    "home/atelier-4.webp", 3/4, .50, .50, .95, 1400),

    # Showrooms
    (("salonblanc", 2),    "home/showroom-1.webp", 16/10, .50, .52, 1.0, 1800),
    (("Table1", 3),        "home/showroom-2.webp", 16/10, .50, .52, 1.0, 1800),

    # Avant / après
    (("lit1", 2),          "home/avant.webp", 16/10, .50, .50, 1.0, 2000),
    (("lit1", 3),          "home/apres.webp", 16/10, .50, .50, 1.0, 2000),

    # Bloc sur-mesure
    (("chaise vert", 2),   "home/surmesure.webp", 16/9, .50, .55, 1.0, 2200),

    # Instagram — portrait de la fondatrice et visuel du compte de la maison
    (("instagram demariem", 0), "home/insta-meriam.webp",   4/5, .50, .42, 1.0, 1400),
    (("chaise vert", 2),        "home/insta-moodstore.webp", 4/5, .50, .50, 1.0, 1400),

    # Journal
    (("salon2", 4),        "home/journal-1.webp", 3/2, .50, .52, 1.0, 1400),
    (("salonprestige", 2), "home/journal-2.webp", 3/2, .50, .52, 1.0, 1400),
    (("tablecareebeige",0),"home/journal-3.webp", 3/2, .50, .52, 1.0, 1400),

    # Matières — plans très rapprochés
    (("salon3", 0),        "matieres/boucle-ecru.webp",        1.0, .30, .34, .18, 1200),
    (("ptitpouffe", 0),    "matieres/boucle-sable.webp",       1.0, .50, .48, .22, 1200),
    (("salon1", 2),        "matieres/lin-naturel.webp",        1.0, .38, .58, .16, 1200),
    (("chaise vert", 0),   "matieres/velours-olive.webp",      1.0, .52, .55, .18, 1200),
    (("salon2", 1),        "matieres/velours-terracotta.webp", 1.0, .30, .55, .14, 1200),
    (("chaise vert", 1),   "matieres/cuir-encre.webp",         1.0, .22, .35, .14, 1200),
    (("ptitpouffe", 1),    "matieres/chene.webp",              1.0, .52, .82, .16, 1200),
    (("salonbubble", 0),   "matieres/noyer.webp",              1.0, .56, .68, .15, 1200),
    (("tablelonguenoir",0),"matieres/laque-noire.webp",        1.0, .50, .42, .14, 1200),
    (("tablecareebeige",0),"matieres/marbre-clair.webp",       1.0, .50, .55, .16, 1200),
    (("tablelonguenoir",1),"matieres/marbre-noir.webp",        1.0, .50, .50, .15, 1200),
    (("chaise vert", 1),   "matieres/metal-noir.webp",         1.0, .20, .52, .12, 1200),
]

for (dossier, rang), sortie, ratio, cx, cy, zoom, larg in JEU:
    src = visuel(dossier, rang)
    produire(src, f"{OUT}/{sortie}", ratio=ratio, cx=cx, cy=cy, zoom=zoom, largeur=larg)
print(f"\n{len(JEU)} visuels d'habillage régénérés")


# ── 4. Resynchronisation du catalogue ──────────────────────────────────
import re, pathlib
cat = pathlib.Path("Frontend/src/data/catalogue.ts")
s = cat.read_text(encoding="utf-8")
modifs = []

def _remplacer(m):
    slug, ancien = m.group(1), int(m.group(2))
    nouveau = comptes.get(slug, ancien)
    if nouveau != ancien:
        modifs.append(f"  {slug} : {ancien} -> {nouveau} visuels")
    return f"images: img('{slug}', {nouveau})"

s = re.sub(r"images: img\('([^']+)', (\d+)\)", _remplacer, s)
cat.write_text(s, encoding="utf-8")
print("\ncatalogue.ts :", "\n".join(modifs) if modifs else "aucun ecart")
print("\nTermine. Videz .next puis relancez npm run dev.")
