interface Props {
  latitude: number;
  longitude: number;
  titre: string;
  /** Amplitude de la fenêtre affichée, en degrés. */
  zoom?: number;
  className?: string;
}

/**
 * Carte de localisation.
 *
 * OpenStreetMap plutôt que Google Maps : aucune clé d'API à gérer, aucun
 * traceur tiers, et surtout un rendu qu'on peut désaturer. Une carte Google
 * par défaut, avec ses aplats de couleur, casse instantanément l'ambiance
 * d'un site haut de gamme (§14.2).
 */
export function Carte({ latitude, longitude, titre, zoom = 0.006, className }: Props) {
  const cadre = [
    longitude - zoom,
    latitude - zoom * 0.6,
    longitude + zoom,
    latitude + zoom * 0.6,
  ].join('%2C');

  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${cadre}&layer=mapnik&marker=${latitude}%2C${longitude}`;

  return (
    <div className={className}>
      <iframe
        src={src}
        title={`Plan d’accès — ${titre}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="size-full border-0 grayscale-[0.85] contrast-[1.05] brightness-[1.03]"
      />
    </div>
  );
}
