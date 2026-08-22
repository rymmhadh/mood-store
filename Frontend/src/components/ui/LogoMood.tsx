import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/cn';

interface Props {
  className?: string;
  /** Éclaircit le badge pour les fonds sombres. */
  clair?: boolean;
  /**
   * Taille du rendu en pixels. Par défaut, la taille suit la variable CSS
   * `--logo-taille`, qui se réduit automatiquement en mobile et à l'ancrage.
   */
  taille?: number;
  lien?: boolean;
  /** Désactive l'agrandissement au survol (menu plein écran, pied de page). */
  sansSurvol?: boolean;
}

/**
 * Logo Mood Store — point focal de la navigation.
 *
 * Le fichier source est un badge circulaire détouré (fond transparent),
 * recadré au carré parfait pour un centrage optique irréprochable.
 * Servi à 786 px pour un affichage à 88 px : la densité est de ~9×, le rendu
 * reste net sur tous les écrans, y compris Retina et 4K.
 *
 * Note : un fichier SVG serait préférable (poids et netteté absolue à toute
 * échelle). Le badge comportant une texture bruitée, une vectorisation
 * automatique le dénaturerait — à demander au graphiste qui a créé le logo.
 */
export function LogoMood({ className, clair, taille, lien = true, sansSurvol }: Props) {
  const style = taille
    ? { width: taille, height: taille }
    : { width: 'var(--logo-taille)', height: 'var(--logo-taille)' };

  const image = (
    <Image
      src="/images/logo-mood.png"
      alt="Mood Store — l’art du sur-mesure"
      width={786}
      height={786}
      priority
      quality={100}
      draggable={false}
      sizes="(max-width: 1024px) 56px, 88px"
      style={style}
      className={cn(
        'object-contain select-none',
        // Agrandissement au survol : 1 → 1.08 sur 300 ms, très fluide
        !sansSurvol &&
          'transition-transform duration-300 ease-[var(--ease-doux)] will-change-transform group-hover/logo:scale-[1.08]',
        clair && 'mix-blend-screen',
      )}
    />
  );

  if (!lien) {
    return (
      <span
        className={cn('group/logo inline-flex shrink-0 items-center justify-center', className)}
      >
        {image}
      </span>
    );
  }

  return (
    <Link
      href="/"
      aria-label="Mood Store — retour à l’accueil"
      className={cn(
        'group/logo inline-flex shrink-0 items-center justify-center',
        'focus-visible:outline-offset-8',
        className,
      )}
    >
      {image}
    </Link>
  );
}
