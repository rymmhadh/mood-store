/**
 * Nuanciers d'origine, à l'identique de ce qui vivait dans le front.
 *
 * Amorcés une seule fois, indépendamment des pièces : une base qui a déjà du
 * catalogue mais pas encore ces quatre tables (mise à jour du projet) les
 * reçoit quand même au prochain démarrage.
 */

export const MATIERES_INITIALES = [
  'Bouclé',
  'Velours',
  'Lin',
  'Cuir',
  'Bois massif',
  'Laque',
  'Marbre',
  'Métal',
];

export const STYLES_INITIAUX = ['Minimaliste', 'Japandi', 'Moderne', 'Contemporain', 'Luxury'];

export const COLORIS_INITIAUX = [
  { slug: 'ecru', nom: 'Écru', hex: '#EFE9DF' },
  { slug: 'ivoire', nom: 'Ivoire', hex: '#F3EEE6' },
  { slug: 'sable', nom: 'Sable', hex: '#D9CBB6' },
  { slug: 'taupe', nom: 'Taupe', hex: '#B7AA98' },
  { slug: 'terracotta', nom: 'Terracotta', hex: '#B05C3B' },
  { slug: 'olive', nom: 'Olive', hex: '#5A6350' },
  { slug: 'cognac', nom: 'Cognac', hex: '#8A5A34' },
  { slug: 'brun', nom: 'Brun profond', hex: '#6E5847' },
  { slug: 'gris', nom: 'Gris pierre', hex: '#9A9A96' },
  { slug: 'encre', nom: 'Noir encre', hex: '#1A1A1A' },
];

export const REVETEMENTS_INITIAUX = [
  { slug: 'boucle-ecru', nom: 'Bouclé Écru', famille: 'Bouclé', hex: '#EFE9DF', entretien: 'Aspiration douce, nettoyage à sec' },
  { slug: 'boucle-sable', nom: 'Bouclé Sable', famille: 'Bouclé', hex: '#D9CBB6', entretien: 'Aspiration douce, nettoyage à sec' },
  { slug: 'boucle-taupe', nom: 'Bouclé Taupe', famille: 'Bouclé', hex: '#B7AA98', entretien: 'Aspiration douce, nettoyage à sec' },
  { slug: 'velours-terracotta', nom: 'Velours Terracotta', famille: 'Velours', hex: '#B05C3B', entretien: 'Brossage dans le sens du poil' },
  { slug: 'velours-olive', nom: 'Velours Olive', famille: 'Velours', hex: '#5A6350', entretien: 'Brossage dans le sens du poil' },
  { slug: 'lin-naturel', nom: 'Lin Naturel', famille: 'Lin', hex: '#E2DACB', entretien: 'Housse déhoussable, lavage à 30°' },
  { slug: 'cuir-cognac', nom: 'Cuir pleine fleur Cognac', famille: 'Cuir', hex: '#8A5A34', entretien: 'Lait nourrissant deux fois par an' },
  { slug: 'cuir-encre', nom: 'Cuir pleine fleur Noir', famille: 'Cuir', hex: '#1A1A1A', entretien: 'Lait nourrissant deux fois par an' },
  { slug: 'technique-gris', nom: 'Tissu technique Gris', famille: 'Tissu technique', hex: '#9A9A96', entretien: 'Éponge humide, séchage à l’air' },
];
