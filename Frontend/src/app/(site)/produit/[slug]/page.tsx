import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Accordeon } from '@/components/ui/Accordeon';
import { Conteneur } from '@/components/ui/Conteneur';
import { FilAriane } from '@/components/ui/FilAriane';
import { CompteurVue } from '@/components/produit/CompteurVue';
import { PanneauProduit } from '@/components/produit/PanneauProduit';
import { MemeCollection } from '@/components/produit/MemeCollection';
import { prixFr } from '@/data/catalogue';
import {
  chargerColoris,
  chargerFamille,
  chargerMemeCollection,
  chargerProduit,
  chargerProduits,
  chargerRevetements,
} from '@/lib/catalogue';

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Voir la note de la page catégorie : les fiches connues au build sont
 * pré-rendues, celles créées ensuite le sont à la première visite.
 */
export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams() {
  const produits = await chargerProduits();
  return produits.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await chargerProduit(slug);
  if (!p) return {};

  return {
    title: `${p.nom} — ${p.type} sur mesure`,
    description: p.chapo,
    alternates: { canonical: `/produit/${p.slug}` },
    openGraph: { images: [{ url: p.images[0] }] },
  };
}

const ETAPES = [
  'Devis sous 48 h',
  'Validation et acompte',
  'Fabrication à l’atelier',
  'Contrôle qualité',
  'Livraison et montage',
];

export default async function PageProduit({ params }: Props) {
  const { slug } = await params;
  const produit = await chargerProduit(slug);
  if (!produit) notFound();

  const [famille, semblables, coloris, revetements] = await Promise.all([
    chargerFamille(produit.familles[0]),
    chargerMemeCollection(produit),
    chargerColoris(),
    chargerRevetements(),
  ]);
  const revetementParId = (id: string) => revetements.find((r) => r.id === id);

  /** Données structurées produit — éligibilité aux résultats enrichis Google. */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${produit.type} ${produit.nom}`,
    description: produit.chapo,
    image: produit.images,
    brand: { '@type': 'Brand', name: 'Mood Store' },
    material: produit.matieres.join(', '),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'TND',
      ...(produit.prix ? { price: produit.prix } : {}),
      availability: 'https://schema.org/MadeToOrder',
    },
  };

  return (
    <>
      <CompteurVue slug={produit.slug} />

      <Conteneur className="py-6">
        <FilAriane
          miettes={[
            { libelle: 'Accueil', href: '/' },
            ...(famille ? [{ libelle: famille.nom, href: `/collections/${famille.slug}` }] : []),
            { libelle: produit.nom },
          ]}
        />
      </Conteneur>

      {/* ── Galerie + panneau ancré ───────────────────────────────────── */}
      <div className="lg:grid lg:grid-cols-[1fr_40%] xl:grid-cols-[1fr_42%]">
        {/* Galerie : un visuel par bloc, séparés par un filet de fond beige.
            Les images conservent leur ratio natif 4:3 — aucun recadrage à
            l'affichage, donc aucun sujet coupé. */}
        <div className="flex flex-col gap-2 bg-craie">
          {produit.images.map((src, i) => (
            <div key={src} className="relative aspect-[4/3] w-full bg-galerie">
              <Image
                src={src}
                alt={
                  i === 0
                    ? `${produit.type} ${produit.nom}`
                    : i === 1
                      ? `${produit.nom} en situation`
                      : `Détail de finition — ${produit.nom}`
                }
                fill
                priority={i === 0}
                quality={90}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <aside className="lg:sticky lg:top-[var(--header-h)] lg:h-[calc(100svh-var(--header-h))] lg:overflow-y-auto">
          <PanneauProduit produit={produit} coloris={coloris} revetements={revetements} />
        </aside>
      </div>

      {/* ── Détail technique ──────────────────────────────────────────── */}
      <Conteneur id="fiche-technique" className="scroll-mt-40 py-16 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-h2">Le mot de l’atelier</h2>
            <div className="mt-7 space-y-5 text-[15px] leading-relaxed text-fumee">
              {produit.description.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <Accordeon
              panneaux={[
                {
                  titre: 'Fiche technique',
                  contenu: (
                    <dl className="grid grid-cols-[10rem_1fr] gap-x-6 gap-y-3">
                      {[
                        ['Typologie', produit.type],
                        ['Collection', produit.collection],
                        ['Structure', produit.structure],
                        ...(produit.garnissage ? [['Garnissage', produit.garnissage]] : []),
                        ['Piètement', produit.pietement],
                        ['Démontable', produit.demontable ? 'Oui' : 'Non'],
                        [
                          'Dimensions',
                          produit.dimensions
                            .map((d) => `${d.nom} — ${d.largeur}×${d.hauteur}×${d.profondeur} cm`)
                            .join(' · '),
                        ],
                        ['Délai', `${produit.delaiJours} jours ouvrés`],
                        [
                          'Prix',
                          produit.prix
                            ? `À partir de ${prixFr.format(produit.prix)} DT`
                            : 'Sur demande',
                        ],
                      ].map(([cle, valeur]) => (
                        <div key={cle} className="contents">
                          <dt className="text-pierre">{cle}</dt>
                          <dd className="text-fumee">{valeur}</dd>
                        </div>
                      ))}
                    </dl>
                  ),
                },
                {
                  titre: 'Matériaux et revêtements',
                  contenu: (
                    <div className="space-y-4">
                      <p>Matières employées : {produit.matieres.join(', ')}.</p>
                      {produit.revetementIds.length > 0 && (
                        <ul className="space-y-2">
                          {produit.revetementIds.map((id) => {
                            const r = revetementParId(id);
                            if (!r) return null;
                            return (
                              <li key={id} className="flex items-center gap-3">
                                <span
                                  className="size-5 shrink-0 rounded-full ring-1 ring-encre/12"
                                  style={{ backgroundColor: r.hex }}
                                />
                                <span className="text-encre">{r.nom}</span>
                                <span className="text-pierre">— {r.entretien}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      <p>
                        <Link href="/sur-mesure/matieres#echantillons" className="lien-souligne text-encre">
                          Recevoir des échantillons gratuitement
                        </Link>
                      </p>
                    </div>
                  ),
                },
                {
                  titre: 'Livraison et montage',
                  contenu: (
                    <ul className="space-y-2">
                      <li>Grand Tunis et Sahel : livraison et montage inclus.</li>
                      <li>Reste du pays : sur devis, selon volume et accès.</li>
                      <li>
                        Contraintes d’accès (escalier, ascenseur, monte-meuble) relevées au moment
                        du devis.
                      </li>
                      <li>Reprise de l’ancien mobilier possible sur demande.</li>
                    </ul>
                  ),
                },
                {
                  titre: 'Entretien et garantie',
                  contenu: (
                    <ul className="space-y-2">
                      <li>Garantie 2 ans sur la structure et les mécanismes.</li>
                      <li>Réfection possible à vie à l’atelier : regarnissage, retapissage.</li>
                      <li>
                        Housses déhoussables lavables à 30° sur les modèles concernés — indiqué au
                        devis.
                      </li>
                    </ul>
                  ),
                },
              ]}
            />
          </div>
        </div>

        {/* Frise de fabrication */}
        <div className="mt-20 border-t border-sable/60 pt-12">
          <p className="eyebrow mb-8 text-pierre">De la commande à la livraison</p>
          <ol className="grid gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {ETAPES.map((etape, i) => (
              <li key={etape}>
                <span className="text-[13px] text-bronze">0{i + 1}</span>
                <span aria-hidden className="mt-3 mb-4 block h-px w-full bg-sable/70" />
                <span className="block text-[15px] text-fumee">{etape}</span>
              </li>
            ))}
          </ol>
        </div>
      </Conteneur>

      <MemeCollection
        titre={`Dans la même collection ${produit.collection}`}
        produits={semblables}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
