import type { Metadata } from 'next';
import { PageLegale } from '@/components/legal/PageLegale';

export const metadata: Metadata = {
  title: 'Mentions légales et CGV — Mood Store',
  description: 'Mentions légales et conditions générales de vente de Mood Store.',
  robots: { index: false },
  alternates: { canonical: '/mentions-legales' },
};

export default function PageMentionsLegales() {
  return (
    <PageLegale
      titre="Mentions légales et CGV"
      intro="Cette page réunira l'identité complète de l'entreprise (raison sociale, immatriculation au Registre National des Entreprises, capital), l'hébergeur du site, ainsi que les conditions générales de vente : modalités de commande, acompte, délais de fabrication et de livraison, droit de rétractation le cas échéant, et garanties."
    />
  );
}
