'use client';

import type { Bornes } from '@/data/configurateur';

interface Props {
  libelle: string;
  bornes: Bornes;
  valeur: number;
  onChange: (v: number) => void;
}

/** Curseur de dimension, avec saisie numérique directe pour les cotes exactes. */
export function Curseur({ libelle, bornes, valeur, onChange }: Props) {
  const pourcent = ((valeur - bornes.min) / (bornes.max - bornes.min)) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={`dim-${libelle}`} className="text-[15px] text-fumee">
          {libelle}
        </label>
        <div className="flex items-baseline gap-1.5">
          <input
            type="number"
            value={valeur}
            min={bornes.min}
            max={bornes.max}
            step={bornes.pas}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (!Number.isNaN(v)) onChange(Math.min(bornes.max, Math.max(bornes.min, v)));
            }}
            aria-label={`${libelle} en centimètres`}
            className="w-16 border-b border-sable bg-transparent pb-1 text-right text-[19px] tabular-nums outline-none focus:border-bronze"
          />
          <span className="text-[13px] text-pierre">cm</span>
        </div>
      </div>

      <input
        id={`dim-${libelle}`}
        type="range"
        min={bornes.min}
        max={bornes.max}
        step={bornes.pas}
        value={valeur}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-4 h-1 w-full cursor-ew-resize appearance-none rounded-full bg-sable/60 outline-none
          [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:cursor-ew-resize [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-encre
          [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:cursor-ew-resize [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-encre"
        style={{
          background: `linear-gradient(to right, var(--color-encre) ${pourcent}%, color-mix(in srgb, var(--color-sable) 60%, transparent) ${pourcent}%)`,
        }}
      />

      <div className="mt-1.5 flex justify-between text-[12px] text-pierre">
        <span>{bornes.min} cm</span>
        <span>{bornes.max} cm</span>
      </div>
    </div>
  );
}
