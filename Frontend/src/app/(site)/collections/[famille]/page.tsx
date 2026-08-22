import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Conteneur } from '@/components/ui/Conteneur';
import { FilAriane } from '@/components/ui/FilAriane';
import { GrilleCollection } from '@/components/collections/GrilleCollection';
import {
  chargerColoris,
  chargerFamille,
  chargerFamilles,
  chargerMatieres,
  chargerProduits,
  chargerStyles,
} from '@/lib/catalogue';

interface Props {
  params: Promise<{ famille: string }>;
}

/**
 * Les catégories connues au moment du build sont pré-rendues : TTFB minimal
 * pour l'essentiel du trafic.
 *
 * `dynamicParams` reste actif : une catégorie créée après le déploiement est
 * rendue à la première visite, puis mise en cache. Sans lui, elle renverrait
 * une 404 jusqu'au prochain build — inacceptable pour un back-office qui
 * promet une publication immédiate.
 */
export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams() {
  const familles = await chargerFamilles();
  return familles.map((f) => ({ famille: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { famille } = await params;
  const f = await chargerFamille(famille);
  if (!f) return {};

  return {
    title: `${f.nom} sur mesure — ${f.parent}`,
    description: f.chapo,
    alternates: { canonical: `/collections/${f.slug}` },
  };
}

export default async function PageFamille({ params }: Props) {
  const { famille } = await params;
  const [f, produits, matieres, styles, coloris] = await Promise.all([
    chargerFamille(famille),
    chargerProduits(famille),
    chargerMatieres(),
    chargerStyles(),
    chargerColoris(),
  ]);
  if (!f) notFound();

  return (
    <>
      <Conteneur className="pt-8 pb-10 lg:pt-10 lg:pb-14">
        <FilAriane
          miettes={[
            { libelle: 'Accueil', href: '/' },
            { libelle: f.parent, href: '/collections' },
            { libelle: f.nom },
          ]}
        />

        <h1 className="mt-8 text-h1">{f.nom}</h1>
        <p className="mt-5 max-w-4xl text-lead leading-relaxed text-fumee">{f.chapo}</p>
      </Conteneur>

      {produits.length > 0 ? (
        <GrilleCollection produits={produits} matieres={matieres} styles={styles} coloris={coloris} />
      ) : (
        /* Une famille sans pièce publiée ne renvoie pas une page vide :
           elle bascule sur le sur-mesure, qui est de toute façon la réponse. */
        <Conteneur className="pb-24">
          <div className="flex flex-col items-center bg-galerie px-8 py-24 text-center">
            <p className="eyebrow text-pierre">Bientôt en ligne</p>
            <p className="mt-5 max-w-xl text-h3 font-light">
              Cette collection est en cours de photographie. En attendant, nous fabriquons
              ces pièces entièrement sur mesure.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-6">
              <Link
                href="/sur-mesure/projet"
                className="inline-flex h-14 items-center bg-encre px-8 libelle-action text-craie transition-colors hover:bg-fumee"
              >
                Décrire mon projet
              </Link>
              <Link href="/showroom/rendez-vous" className="lien-souligne libelle-action">
                Voir en showroom
              </Link>
            </div>
          </div>
        </Conteneur>
      )}
    </>
  );
}
