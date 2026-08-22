'use client';

import { useEffect, useRef, useState } from 'react';
import {
  IconeLecture,
  IconePause,
  IconeSon,
  IconeSonCoupe,
} from '@/components/icons';
import { cn } from '@/lib/cn';

interface Props {
  /** Nom du fichier sans extension, dans `/public/videos/`. */
  nom: string;
  titre: string;
  /**
   * `ambiance` : démarre seule, muette et en boucle dès qu'elle est visible.
   * `contenu`  : reste sur son affiche jusqu'au clic, et garde le son.
   */
  mode?: 'ambiance' | 'contenu';
  className?: string;
  /** Légende affichée sous la vidéo. */
  legende?: string;
}

/**
 * Lecteur vidéo du site.
 *
 * Rien ne se télécharge tant que la vidéo n'est pas demandée : seule
 * l'affiche est chargée. C'est ce qui permet d'avoir de la vidéo sur un site
 * tenu à moins de 2 secondes de LCP.
 *
 * Deux sources sont déclarées, une par définition. Le navigateur retient la
 * première qu'il peut lire ; la requête média envoie la version 420 px aux
 * téléphones, qui n'ont ni la surface d'affichage ni le débit pour davantage.
 *
 * En mode `ambiance`, la lecture se déclenche à l'entrée dans le champ et
 * s'arrête à la sortie : aucune vidéo ne tourne dans le vide en arrière-plan.
 * Le réglage système « réduire les animations » la neutralise entièrement.
 */
export function Video({ nom, titre, mode = 'contenu', className, legende }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const cadre = useRef<HTMLDivElement>(null);
  const [demarree, setDemarree] = useState(false);
  const [enLecture, setEnLecture] = useState(false);
  const [muet, setMuet] = useState(true);
  const [sobre, setSobre] = useState(false);

  const ambiance = mode === 'ambiance';

  useEffect(() => {
    setSobre(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  /* Lecture automatique en mode ambiance, uniquement quand la vidéo est visible. */
  useEffect(() => {
    if (!ambiance || sobre) return;
    const cible = cadre.current;
    const lecteur = video.current;
    if (!cible || !lecteur) return;

    const obs = new IntersectionObserver(
      ([entree]) => {
        if (entree.isIntersecting) {
          setDemarree(true);
          lecteur.play().then(
            () => setEnLecture(true),
            () => {
              /* lecture refusée par le navigateur : on reste sur l'affiche */
            },
          );
        } else {
          lecteur.pause();
          setEnLecture(false);
        }
      },
      { threshold: 0.35 },
    );

    obs.observe(cible);
    return () => obs.disconnect();
  }, [ambiance, sobre]);

  const basculerLecture = () => {
    const lecteur = video.current;
    if (!lecteur) return;

    setDemarree(true);
    if (lecteur.paused) {
      lecteur.play().then(() => setEnLecture(true), () => undefined);
    } else {
      lecteur.pause();
      setEnLecture(false);
    }
  };

  const basculerSon = () => {
    const lecteur = video.current;
    if (!lecteur) return;
    lecteur.muted = !lecteur.muted;
    setMuet(lecteur.muted);
  };

  return (
    <figure className={className}>
      <div
        ref={cadre}
        className="group relative aspect-[720/1208] w-full overflow-hidden bg-encre"
      >
        <video
          ref={video}
          poster={`/videos/${nom}.webp`}
          preload="none"
          playsInline
          loop={ambiance}
          muted={muet}
          onEnded={() => setEnLecture(false)}
          aria-label={titre}
          className={cn(
            'size-full object-cover transition-opacity duration-700',
            demarree ? 'opacity-100' : 'opacity-0',
          )}
        >
          <source src={`/videos/${nom}-mobile.mp4`} type="video/mp4" media="(max-width: 640px)" />
          <source src={`/videos/${nom}.mp4`} type="video/mp4" />
          Votre navigateur ne peut pas lire cette vidéo.
        </video>

        {/* Affiche — reste visible tant que rien n'est lancé */}
        {!demarree && (
          // Image d'affiche gérée par l'attribut `poster` de la vidéo ; ce
          // calque n'ajoute que l'assombrissement et le bouton.
          <div aria-hidden className="absolute inset-0 bg-encre/20" />
        )}

        {/* Commande principale */}
        <button
          type="button"
          onClick={basculerLecture}
          aria-label={enLecture ? `Mettre en pause : ${titre}` : `Lire : ${titre}`}
          className={cn(
            'absolute inset-0 flex items-center justify-center transition-opacity duration-500',
            enLecture ? 'opacity-0 focus-visible:opacity-100 group-hover:opacity-100' : 'opacity-100',
          )}
        >
          <span className="flex size-16 items-center justify-center rounded-full border border-craie/70 bg-encre/35 text-craie backdrop-blur-sm transition-transform duration-500 ease-[var(--ease-doux)] group-hover:scale-110 lg:size-20">
            {enLecture ? (
              <IconePause className="size-6" />
            ) : (
              <IconeLecture className="ml-1 size-7 lg:size-8" />
            )}
          </span>
        </button>

        {/* Son — inutile sur une vidéo d'ambiance, qui n'a pas de piste audio */}
        {!ambiance && (
          <button
            type="button"
            onClick={basculerSon}
            aria-label={muet ? 'Activer le son' : 'Couper le son'}
            aria-pressed={!muet}
            className="absolute right-4 bottom-4 flex size-11 items-center justify-center rounded-full border border-craie/50 bg-encre/40 text-craie backdrop-blur-sm transition-colors hover:bg-encre/70"
          >
            {muet ? <IconeSonCoupe className="size-5" /> : <IconeSon className="size-5" />}
          </button>
        )}
      </div>

      {legende && (
        <figcaption className="mt-4 text-[13px] leading-relaxed text-pierre">{legende}</figcaption>
      )}
    </figure>
  );
}
