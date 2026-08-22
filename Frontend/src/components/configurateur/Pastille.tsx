'use client';

import Image from 'next/image';
import { matiereParId } from '@/data/matieres';
import type { Option } from '@/data/configurateur';
import { cn } from '@/lib/cn';

interface Props {
  option: Option;
  actif: boolean;
  onClick: () => void;
}

/**
 * Pastille de matière : plan rapproché réel quand la photo existe, aplat de
 * couleur sinon. Aucune photo approximative — c'est ce qui distingue un
 * nuancier crédible d'un nuancier décoratif.
 */
export function Pastille({ option, actif, onClick }: Props) {
  const matiere = matiereParId(option.id);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={cn(
        'group flex w-full items-center gap-4 border p-3 text-left transition-all duration-300',
        actif ? 'border-encre bg-galerie' : 'border-sable/60 hover:border-encre/50',
      )}
    >
      <span
        className={cn(
          'relative size-14 shrink-0 overflow-hidden transition-all duration-300',
          actif && 'ring-1 ring-encre ring-offset-2 ring-offset-craie',
        )}
        style={matiere?.image ? undefined : { backgroundColor: matiere?.hex ?? '#DDD' }}
      >
        {matiere?.image && (
          <Image
            src={matiere.image}
            alt=""
            aria-hidden
            fill
            sizes="56px"
            className="object-cover transition-transform duration-500 ease-[var(--ease-doux)] group-hover:scale-110"
          />
        )}
      </span>

      <span className="min-w-0">
        <span className="block text-[15px]">{option.nom}</span>
        {option.detail && (
          <span className="mt-0.5 block text-[13px] text-pierre">{option.detail}</span>
        )}
      </span>
    </button>
  );
}
