'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Champs de formulaire du back-office.
 *
 * Un principe du §19.1 gouverne l'ensemble : « aucun champ obligatoire non
 * évident ; aide contextuelle à côté de chaque champ ». L'aide est donc un
 * paramètre du composant, pas une note en bas de page.
 *
 * Les erreurs ne sont jamais rouges — la charte l'interdit (§2.1). Elles se
 * signalent par une bordure bronze et une phrase, ce qui reste lisible pour
 * tout le monde, y compris sans perception des couleurs.
 */

interface BaseProps {
  libelle: string;
  aide?: string;
  erreur?: string;
  obligatoire?: boolean;
  className?: string;
  children: ReactNode;
  /** Identifiant du contrôle, pour relier le libellé et le message d'erreur. */
  pour?: string;
}

export function Cadre({ libelle, aide, erreur, obligatoire, className, children, pour }: BaseProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={pour} className="text-[13px] text-fumee">
        {libelle}
        {obligatoire && <span className="ml-1 text-bronze">*</span>}
      </label>

      {children}

      {erreur ? (
        <p id={pour ? `${pour}-erreur` : undefined} className="text-[12px] text-encre">
          <span aria-hidden>↳ </span>
          {erreur}
        </p>
      ) : (
        aide && <p className="text-[12px] leading-relaxed text-pierre">{aide}</p>
      )}
    </div>
  );
}

const saisie =
  'h-12 w-full border bg-blanc px-4 text-[15px] text-encre transition-colors duration-300 ' +
  'placeholder:text-pierre focus:outline-none focus-visible:border-encre';

export function Texte({
  erreur,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { erreur?: boolean }) {
  return (
    <input
      {...props}
      aria-invalid={erreur || undefined}
      className={cn(saisie, erreur ? 'border-bronze' : 'border-trait', className)}
    />
  );
}

export function Zone({
  erreur,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { erreur?: boolean }) {
  return (
    <textarea
      {...props}
      aria-invalid={erreur || undefined}
      className={cn(
        saisie,
        'h-auto resize-y py-3 leading-relaxed',
        erreur ? 'border-bronze' : 'border-trait',
        className,
      )}
    />
  );
}

export function Liste({
  erreur,
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { erreur?: boolean }) {
  return (
    <select
      {...props}
      aria-invalid={erreur || undefined}
      className={cn(saisie, 'appearance-none pr-10', erreur ? 'border-bronze' : 'border-trait', className)}
    >
      {children}
    </select>
  );
}

/** Étiquette sélectionnable. Sert aux matières, styles, coloris, collections. */
export function Puce({
  actif,
  children,
  couleur,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { actif: boolean; couleur?: string }) {
  return (
    <button
      type="button"
      aria-pressed={actif}
      {...props}
      className={cn(
        'inline-flex items-center gap-2 border px-4 py-2.5 text-[14px]',
        'transition-colors duration-300 ease-[var(--ease-doux)]',
        actif ? 'border-encre bg-encre text-craie' : 'border-trait bg-blanc text-fumee hover:border-encre',
      )}
    >
      {couleur && (
        <span
          aria-hidden
          className="size-3.5 shrink-0 border border-encre/15"
          style={{ background: couleur }}
        />
      )}
      {children}
    </button>
  );
}

/** Interrupteur oui/non, avec son libellé cliquable. */
export function Bascule({
  actif,
  libelle,
  aide,
  onChange,
}: {
  actif: boolean;
  libelle: string;
  aide?: string;
  onChange: (valeur: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={actif}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 size-5 shrink-0 accent-[var(--color-encre)]"
      />
      <span className="min-w-0">
        <span className="block text-[14px]">{libelle}</span>
        {aide && <span className="mt-0.5 block text-[12px] leading-relaxed text-pierre">{aide}</span>}
      </span>
    </label>
  );
}

/** Regroupement de champs, avec un titre et un filet. */
export function Section({
  titre,
  aide,
  children,
}: {
  titre: string;
  aide?: string;
  children: ReactNode;
}) {
  return (
    <section className="border border-sable/50 bg-blanc">
      <header className="border-b border-sable/40 px-6 py-5">
        <h2 className="text-[17px]">{titre}</h2>
        {aide && <p className="mt-1 max-w-prose text-[13px] leading-relaxed text-pierre">{aide}</p>}
      </header>
      <div className="flex flex-col gap-6 px-6 py-6">{children}</div>
    </section>
  );
}
