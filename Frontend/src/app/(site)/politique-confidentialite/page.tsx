import type { Metadata } from 'next';
import { PageLegale } from '@/components/legal/PageLegale';

export const metadata: Metadata = {
  title: 'Politique de confidentialité — Mood Store',
  description: 'Comment Mood Store collecte, utilise et protège vos données personnelles.',
  robots: { index: false },
  alternates: { canonical: '/politique-confidentialite' },
};

export default function PagePolitiqueConfidentialite() {
  return (
    <PageLegale
      titre="Politique de confidentialité"
      intro="Cette page détaillera les données collectées via le site (formulaires de contact et de devis, configurateur, prise de rendez-vous), leur finalité, leur durée de conservation, les tiers éventuellement destinataires, ainsi que vos droits d'accès, de rectification et de suppression. Une note sur les cookies utilisés (mesure d'audience, préférences) y sera également détaillée."
    >
      <div className="mt-8 space-y-4 text-[15px] text-fumee">
        <p>
          En attendant ce texte complet : les données saisies dans les formulaires du site
          (contact, devis, rendez-vous, configurateur) ne servent qu'à traiter votre
          demande et ne sont jamais vendues à des tiers. Les favoris enregistrés depuis les
          fiches produit restent sur votre appareil et ne sont jamais transmis à nos
          serveurs.
        </p>
      </div>
    </PageLegale>
  );
}
