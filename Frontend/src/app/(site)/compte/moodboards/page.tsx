'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bouton } from '@/components/ui/Bouton';
import { Conteneur } from '@/components/ui/Conteneur';
import { FilAriane } from '@/components/ui/FilAriane';
import { IconeCoeur, IconeFermer } from '@/components/icons';
import { useFavoris, type FavoriProduit } from '@/hooks/useFavoris';

/**
 * Liste des pièces enregistrées ("moodboard") — lues depuis `localStorage`
 * via `useFavoris`. Page client pure : rien à charger depuis l'API, donc pas
 * de rendu serveur possible pour son contenu (§ voir le hook pour le pourquoi
 * du stockage local plutôt qu'un compte).
 */
export default function PageMoodboards() {
  const { favoris, retirer, pret } = useFavoris();

  return (
    <div className="bg-blanc">
      <Conteneur className="pt-8 pb-4 lg:pt-10">
        <FilAriane
          miettes={[
            { libelle: 'Accueil', href: '/' },
            { libelle: 'Mon compte', href: '/compte' },
            { libelle: 'Mes favoris' },
          ]}
        />
      </Conteneur>

      <Conteneur className="py-10 text-center lg:py-14">
        <h1 className="text-[2rem] font-light tracking-[0.02em] uppercase lg:text-[2.5rem]">
          Mes pièces enregistrées
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lead text-fumee">
          Enregistrées sur cet appareil grâce au cœur des fiches produit — pas besoin de
          compte. Elles restent ici tant que vous ne videz pas les données du navigateur.
        </p>
      </Conteneur>

      <Conteneur className="pb-24 lg:pb-32">
        {!pret ? null : favoris.length === 0 ? (
          <div className="flex min-h-[22rem] flex-col items-center justify-center bg-galerie px-8 py-20 text-center">
            <IconeCoeur className="size-8 text-pierre" strokeWidth={1.3} />
            <p className="mt-6 max-w-md text-h3 font-light">
              Rien d'enregistré pour l'instant.
            </p>
            <p className="mt-2 max-w-md text-[15px] text-pierre">
              Le cœur en haut à droite de chaque pièce l'ajoute ici.
            </p>
            <Bouton href="/collections" className="mt-8">
              Parcourir les collections
            </Bouton>
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {favoris.map((f) => (
              <CarteFavori key={f.slug} produit={f} onRetirer={() => retirer(f.slug)} />
            ))}
          </div>
        )}
      </Conteneur>
    </div>
  );
}

function CarteFavori({
  produit,
  onRetirer,
}: {
  produit: FavoriProduit;
  onRetirer: () => void;
}) {
  return (
    <article className="group flex flex-col bg-galerie">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link href={`/produit/${produit.slug}`} className="block size-full">
          {produit.image && (
            <Image
              src={produit.image}
              alt={`${produit.type} ${produit.nom}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover"
            />
          )}
        </Link>

        <button
          type="button"
          onClick={onRetirer}
          aria-label="Retirer de mes favoris"
          className="absolute top-3 right-3 flex size-11 cursor-pointer items-center justify-center rounded-full bg-craie/85 text-fumee backdrop-blur-sm transition-all duration-300 hover:bg-craie hover:text-encre"
        >
          <IconeFermer className="size-4" strokeWidth={1.6} />
        </button>
      </div>

      <div className="p-5 lg:p-6">
        <p className="text-[13px] text-pierre">{produit.type}</p>
        <h3 className="mt-0.5 truncate text-[24px] leading-tight font-light">
          <Link href={`/produit/${produit.slug}`} className="lien-souligne">
            {produit.nom}
          </Link>
        </h3>
      </div>
    </article>
  );
}
