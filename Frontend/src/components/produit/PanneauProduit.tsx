'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  IconeChevron,
  IconeCoeur,
  IconePartage,
  IconeTelecharger,
  IconeWhatsApp,
} from '@/components/icons';
import { TiroirOptions, type OptionTiroir } from './TiroirOptions';
import { prixFr, type Coloris, type ProduitCatalogue, type Revetement } from '@/data/catalogue';
import { lienWhatsApp } from '@/data/site';
import { cn } from '@/lib/cn';

type Tiroir = 'dimensions' | 'coloris' | 'revetements' | null;

/**
 * Panneau d'information du produit.
 *
 * Reste ancré à droite pendant que la galerie défile. Il concentre tout ce
 * qui engage : configuration, prix, et les trois sorties commerciales
 * (rendez-vous, devis, WhatsApp).
 */
export function PanneauProduit({
  produit,
  coloris: nuancierColoris,
  revetements: nuancierRevetements,
}: {
  produit: ProduitCatalogue;
  coloris: Coloris[];
  revetements: Revetement[];
}) {
  const colorisParId = (id: string) => nuancierColoris.find((c) => c.id === id);
  const revetementParId = (id: string) => nuancierRevetements.find((r) => r.id === id);

  const [tiroir, setTiroir] = useState<Tiroir>(null);
  /**
   * Une pièce peut n'avoir aucune taille renseignée : c'est le cas d'une fiche
   * tout juste créée depuis le back-office. Le panneau doit s'afficher quand
   * même — masquer le sélecteur de dimensions, et non faire tomber la page.
   */
  const [dimension, setDimension] = useState(produit.dimensions[0]?.nom ?? '');
  const [coloris, setColoris] = useState(produit.colorisIds[0]);
  const [revetement, setRevetement] = useState(produit.revetementIds[0] ?? '');
  const [detaille, setDetaille] = useState(false);
  const [favori, setFavori] = useState(false);
  const [copie, setCopie] = useState(false);

  const dim = produit.dimensions.find((d) => d.nom === dimension) ?? produit.dimensions[0] ?? null;
  const col = colorisParId(coloris);
  const rev = revetementParId(revetement);

  const prixCourant = produit.prix ? produit.prix + (dim?.surcout ?? 0) : undefined;

  useEffect(() => {
    if (!copie) return;
    const t = setTimeout(() => setCopie(false), 2000);
    return () => clearTimeout(t);
  }, [copie]);

  const optionsDimensions: OptionTiroir[] = useMemo(
    () =>
      produit.dimensions.map((d) => ({
        id: d.nom,
        libelle: d.nom,
        detail: `L. ${d.largeur} × H. ${d.hauteur} × P. ${d.profondeur} cm${
          d.surcout ? ` — + ${prixFr.format(d.surcout)} DT` : ''
        }`,
      })),
    [produit.dimensions],
  );

  const optionsColoris: OptionTiroir[] = useMemo(
    () =>
      produit.colorisIds
        .map(colorisParId)
        .filter((c): c is NonNullable<typeof c> => Boolean(c))
        .map((c) => ({ id: c.id, libelle: c.nom, hex: c.hex })),
    [produit.colorisIds],
  );

  const optionsRevetements: OptionTiroir[] = useMemo(
    () =>
      produit.revetementIds
        .map(revetementParId)
        .filter((r): r is NonNullable<typeof r> => Boolean(r))
        .map((r) => ({ id: r.id, libelle: r.nom, detail: r.famille, hex: r.hex })),
    [produit.revetementIds],
  );

  const recapitulatif = [
    produit.nom,
    dim?.nom,
    col?.nom,
    rev?.nom,
  ]
    .filter(Boolean)
    .join(' · ');

  const partager = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({ title: `${produit.type} ${produit.nom}`, url });
        return;
      } catch {
        /* partage annulé */
      }
    }
    await navigator.clipboard?.writeText(url);
    setCopie(true);
  };

  return (
    <>
      <div className="px-[var(--marge-laterale)] py-10 lg:px-14 lg:py-16 xl:px-20">
        {/* En-tête */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-[34px] leading-none font-light xl:text-[40px]">{produit.nom}</h1>
            <p className="mt-3 text-[15px] text-fumee">
              Design{' '}
              <Link href="/a-propos#atelier" className="lien-souligne text-encre">
                {produit.designer}
              </Link>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={partager}
              aria-label="Partager cette pièce"
              className="bouton-icone"
            >
              <IconePartage className="size-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => setFavori((v) => !v)}
              aria-label={favori ? 'Retirer du moodboard' : 'Ajouter à mon moodboard'}
              aria-pressed={favori}
              className="bouton-icone -mr-3"
            >
              <IconeCoeur
                className={cn('size-5', favori && 'fill-encre text-encre')}
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>
        {copie && <p className="mt-2 text-[13px] text-bronze">Lien copié.</p>}

        {/* Chapô */}
        <p className="mt-7 text-[15px] leading-relaxed text-fumee">{produit.chapo}</p>

        {detaille && (
          <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-fumee">
            {produit.description.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px]">
          <button
            type="button"
            onClick={() => setDetaille((v) => !v)}
            className="lien-souligne"
            aria-expanded={detaille}
          >
            {detaille ? 'Voir moins' : 'Voir plus'}
          </button>
          <span aria-hidden className="text-sable">
            •
          </span>
          <a href="#fiche-technique" className="lien-souligne inline-flex items-center gap-2">
            <IconeTelecharger className="size-4" strokeWidth={1.5} />
            Télécharger la fiche technique
          </a>
        </div>

        {/* Configuration */}
        <div className="mt-10 border-t border-sable/60 pt-8">
          <p className="text-[15px] text-fumee">{produit.type}</p>
          {dim ? (
            <>
              <p className="mt-1.5 text-[15px]">
                L. {dim.largeur} × H. {dim.hauteur} × P. {dim.profondeur} cm
              </p>
              {produit.dimensions.length > 1 && (
                <BoutonTiroir libelle="Autres dimensions" onClick={() => setTiroir('dimensions')} />
              )}
            </>
          ) : (
            <p className="mt-1.5 text-[15px] text-pierre">
              Dimensions établies avec vous, à la mesure de votre pièce.
            </p>
          )}
        </div>

        <div className="mt-8 grid gap-8 border-t border-sable/60 pt-8 sm:grid-cols-2">
          <div>
            <p className="text-[15px] text-fumee">
              Coloris : <span className="text-encre">{col?.nom}</span>
            </p>
            <span
              aria-hidden
              className="mt-3 inline-block size-8 rounded-full ring-1 ring-encre/12"
              style={{ backgroundColor: col?.hex }}
            />
            <BoutonTiroir libelle="Autres coloris" onClick={() => setTiroir('coloris')} />
          </div>

          {optionsRevetements.length > 0 && (
            <div className="sm:border-l sm:border-sable/60 sm:pl-8">
              <p className="text-[15px] text-fumee">
                Revêtement : <span className="text-encre">{rev?.nom}</span>
              </p>
              <span
                aria-hidden
                className="mt-3 inline-block size-8 rounded-full ring-1 ring-encre/12"
                style={{ backgroundColor: rev?.hex }}
              />
              <BoutonTiroir libelle="Autres revêtements" onClick={() => setTiroir('revetements')} />
            </div>
          )}
        </div>

        {/* Prix et délai */}
        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-4 border-t border-sable/60 pt-8">
          <p className="text-[22px] font-light">
            {prixCourant ? `À partir de ${prixFr.format(prixCourant)} DT` : 'Prix sur demande'}
          </p>
          <p className="text-[13px] text-pierre">
            Fabrication {produit.delaiJours} jours · Livraison et montage inclus
          </p>
        </div>

        {/* Engagement */}
        <div className="mt-8 space-y-3">
          <Link
            href="/showroom/rendez-vous"
            className="flex h-16 w-full items-center justify-center bg-encre text-[15px] text-craie transition-colors hover:bg-fumee"
          >
            Prendre rendez-vous en showroom
          </Link>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/contact"
              className="flex h-14 items-center justify-center border border-encre libelle-action transition-colors hover:bg-encre hover:text-craie"
            >
              Demander un devis
            </Link>
            <a
              href={lienWhatsApp(
                `Bonjour, je suis intéressé(e) par : ${recapitulatif}. Pouvez-vous me faire une proposition ?`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 items-center justify-center gap-2.5 border border-sable libelle-action transition-colors hover:border-encre"
            >
              <IconeWhatsApp className="size-4" strokeWidth={1.5} />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Réassurance */}
        <ul className="mt-8 space-y-2 border-t border-sable/60 pt-8 text-[13px] text-pierre">
          <li>Fabrication artisanale à Tunis</li>
          <li>Livraison et montage inclus dans le Grand Tunis et le Sahel</li>
          <li>Garantie 2 ans · réfection possible à vie</li>
          <li>Devis gratuit sous 48 heures ouvrées</li>
        </ul>
      </div>

      {/* Tiroirs */}
      <TiroirOptions
        ouvert={tiroir === 'dimensions'}
        titre="Dimensions"
        options={optionsDimensions}
        selection={dimension}
        onSelection={setDimension}
        onFermer={() => setTiroir(null)}
      />
      <TiroirOptions
        ouvert={tiroir === 'coloris'}
        titre="Coloris"
        options={optionsColoris}
        selection={coloris}
        onSelection={setColoris}
        onFermer={() => setTiroir(null)}
      />
      <TiroirOptions
        ouvert={tiroir === 'revetements'}
        titre="Revêtements"
        options={optionsRevetements}
        selection={revetement}
        onSelection={setRevetement}
        onFermer={() => setTiroir(null)}
      />

      {/* Barre d'engagement permanente */}
      <BarreProduit produit={produit} recapitulatif={recapitulatif} />
    </>
  );
}

function BoutonTiroir({ libelle, onClick }: { libelle: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group mt-4 flex items-center gap-2 text-[15px] transition-opacity hover:opacity-65"
    >
      <span className="lien-souligne">{libelle}</span>
      <IconeChevron
        className="size-4 transition-transform duration-300 ease-[var(--ease-doux)] group-hover:translate-x-1"
        strokeWidth={1.5}
      />
    </button>
  );
}

/** Barre basse : rappelle la pièce configurée et garde le CTA à portée. */
function BarreProduit({
  produit,
  recapitulatif,
}: {
  produit: ProduitCatalogue;
  recapitulatif: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-70 hidden border-t border-sable/60 bg-craie/97 backdrop-blur-md lg:block',
        'transition-transform duration-500 ease-[var(--ease-doux)]',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <div className="conteneur flex items-center gap-6 py-3">
        <div className="relative size-14 shrink-0 overflow-hidden bg-galerie">
          <Image
            src={produit.images[0]}
            alt=""
            aria-hidden
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <p className="min-w-0 flex-1 truncate text-[13px] text-pierre">{recapitulatif}</p>
        <Link
          href="/showroom/rendez-vous"
          className="flex h-12 shrink-0 items-center bg-encre px-8 text-[14px] text-craie transition-colors hover:bg-fumee"
        >
          Prendre rendez-vous en showroom
        </Link>
      </div>
    </div>
  );
}
