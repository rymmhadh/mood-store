#!/usr/bin/env python3
"""
Preparation des videos pour le web.

    cd MoodStore
    python3 Frontend/scripts/videos.py

Source : assets/videos/*.mp4 — les masters, jamais modifies.
Sortie : Frontend/public/videos/ — deux definitions et une affiche par video.

Trois traitements sont appliques :

1. RECADRAGE. Les masters portent un filigrane « InShOt » en bas a droite,
   laisse par l'application de montage. On retire les 5,5 % inferieurs de
   l'image : le filigrane disparait sans toucher au sujet.

2. COMPRESSION. Les masters font 10 a 28 Mo. Servis tels quels, ils annulent
   tout le travail de performance du site. Re-encodes en H.264 a debit
   maitrise, ils tombent a 3-12 Mo sans perte visible a la taille reelle
   d'affichage.

3. AFFICHE. Une image fixe est extraite a un instant choisi. C'est elle que
   le visiteur voit ; la video ne se telecharge qu'a la demande.

Dependances : pip install imageio-ffmpeg pillow
"""
import os, subprocess, shutil
import imageio_ffmpeg
from PIL import Image

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
SRC = "assets/videos"
OUT = "Frontend/public/videos"

# Part de l'image retiree en bas, pour supprimer le filigrane de montage
ROGNAGE = 0.055

# fichier source, nom de sortie, seconde de l'affiche, garder le son
VIDEOS = [
    ("before after.mp4",       "avant-apres", 13, False),
    ("atelier mood store.mp4", "atelier-1",   17, True),
    ("video atelier.mp4",      "atelier-2",   11, True),
]

# suffixe, largeur, qualite video (CRF : plus bas = meilleur), debit audio
DEFINITIONS = [("", 640, 30, "96k"), ("-mobile", 420, 31, "64k")]

FILTRE = f"crop=iw:floor(ih*{1 - ROGNAGE}/2)*2:0:0,scale={{largeur}}:-2:flags=lanczos"


def encoder(source, sortie, largeur, crf, audio):
    son = ["-an"] if audio is None else ["-c:a", "aac", "-b:a", audio]
    subprocess.run(
        [FFMPEG, "-y", "-i", source,
         "-vf", FILTRE.format(largeur=largeur),
         "-c:v", "libx264", "-preset", "veryfast", "-crf", str(crf),
         "-profile:v", "high", "-pix_fmt", "yuv420p",
         # Index en tete de fichier : la lecture demarre avant la fin du
         # telechargement.
         "-movflags", "+faststart",
         *son, sortie],
        check=True, capture_output=True,
    )


def affiche(source, sortie, seconde):
    tmp = sortie + ".png"
    subprocess.run(
        [FFMPEG, "-y", "-ss", str(seconde), "-i", source, "-frames:v", "1",
         "-vf", FILTRE.format(largeur=720), tmp],
        check=True, capture_output=True,
    )
    Image.open(tmp).convert("RGB").save(sortie, "WEBP", quality=88, method=6)
    os.remove(tmp)


if __name__ == "__main__":
    # On encode en local puis on copie : ecrire directement sur un dossier
    # monte est beaucoup plus lent.
    tmp = "/tmp/moodstore-videos"
    shutil.rmtree(tmp, ignore_errors=True)
    os.makedirs(tmp)

    for fichier, nom, seconde, avec_son in VIDEOS:
        chemin = os.path.join(SRC, fichier)
        depart = os.path.getsize(chemin) / 1024 / 1024
        for suffixe, largeur, crf, debit in DEFINITIONS:
            encoder(chemin, f"{tmp}/{nom}{suffixe}.mp4", largeur, crf,
                    debit if avec_son else None)
        affiche(chemin, f"{tmp}/{nom}.webp", seconde)
        print(f"{nom:12} {depart:5.1f} Mo -> "
              f"{os.path.getsize(f'{tmp}/{nom}.mp4')/1024/1024:5.1f} Mo  "
              f"(mobile {os.path.getsize(f'{tmp}/{nom}-mobile.mp4')/1024/1024:.1f} Mo)")

    shutil.rmtree(OUT, ignore_errors=True)
    shutil.copytree(tmp, OUT)
    print(f"\n{len(os.listdir(OUT))} fichiers copies dans {OUT}")
