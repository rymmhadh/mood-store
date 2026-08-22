import type { Metadata } from 'next';
import { PageLegale } from '@/components/legal/PageLegale';

export const metadata: Metadata = {
  title: 'Accessibilité',
  description: "Démarche d'accessibilité numérique du site Mood Store.",
  robots: { index: false },
  alternates: { canonical: '/accessibilite' },
};

export default function PageAccessibilite() {
  return (
    <PageLegale
      titre="Accessibilité"
      intro="Cette page présentera à terme une déclaration d'accessibilité complète, avec un état de conformité et le détail des points encore à corriger."
    >
      <div className="mt-8 space-y-4 text-[15px] text-fumee">
        <p>
          En attendant cette déclaration : le site est construit avec des contrastes de
          texte contrôlés, un focus clavier toujours visible, et respecte la préférence
          « mouvement réduit » du système pour les animations. Un manque d'accessibilité
          repéré peut être signalé directement par téléphone ou WhatsApp — voir plus bas.
        </p>
      </div>
    </PageLegale>
  );
}
