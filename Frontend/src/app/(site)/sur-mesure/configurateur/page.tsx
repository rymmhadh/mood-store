import type { Metadata } from 'next';
import { Configurateur } from '@/components/configurateur/Configurateur';

export const metadata: Metadata = {
  title: 'Configurateur, dessinez votre pièce sur mesure',
  description:
    'Choisissez la typologie, les dimensions au centimètre, la structure, le revêtement et les finitions. Estimation de prix et de délai immédiate.',
  alternates: { canonical: '/sur-mesure/configurateur' },
};

export default function PageConfigurateur() {
  return <Configurateur />;
}
