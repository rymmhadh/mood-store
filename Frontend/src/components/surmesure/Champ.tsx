'use client';

import { useId, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

type Commun = { libelle: string; className?: string; aide?: string };

/**
 * Champs de formulaire.
 *
 * Cadre complet sur fond blanc plutôt que filet inférieur sur fond beige :
 * la zone de saisie doit se distinguer nettement du fond de page. Sur un
 * fond crème, un champ transparent se lit comme du décor, pas comme un
 * endroit où écrire.
 *
 * Le libellé est placé au-dessus, en corps de lecture et en noir — jamais en
 * gris minuscule, et jamais remplacé par un simple texte d'invite, qui
 * disparaît dès la première frappe.
 */

const CADRE =
  'w-full border border-trait bg-blanc px-4 text-[15px] text-encre outline-none transition-colors ' +
  'placeholder:text-pierre/70 hover:border-pierre focus:border-encre';

function Libelle({ id, libelle, requis }: { id: string; libelle: string; requis?: boolean }) {
  return (
    <label htmlFor={id} className="block text-[16px] text-encre">
      {requis && (
        <span aria-hidden className="mr-1">
          *
        </span>
      )}
      {libelle}
    </label>
  );
}

export function Champ({
  libelle,
  className,
  aide,
  ...props
}: Commun & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={className}>
      <Libelle id={id} libelle={libelle} requis={props.required} />
      <input id={id} {...props} className={cn(CADRE, 'mt-2.5 h-12')} />
      {aide && <p className="mt-2 text-[13px] text-pierre">{aide}</p>}
    </div>
  );
}

export function Zone({
  libelle,
  className,
  aide,
  ...props
}: Commun & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <div className={className}>
      <Libelle id={id} libelle={libelle} requis={props.required} />
      <textarea id={id} rows={6} {...props} className={cn(CADRE, 'mt-2.5 resize-none py-3.5 leading-relaxed')} />
      {aide && <p className="mt-2 text-[13px] text-pierre">{aide}</p>}
    </div>
  );
}

export function Liste({
  libelle,
  className,
  options,
  ...props
}: Commun & SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }) {
  const id = useId();
  return (
    <div className={className}>
      <Libelle id={id} libelle={libelle} requis={props.required} />
      <div className="relative mt-2.5">
        <select id={id} {...props} className={cn(CADRE, 'h-12 appearance-none pr-11')}>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-fumee"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

/** Puce de choix, utilisée pour les styles, budgets et échéances. */
export function Puce({
  libelle,
  actif,
  onClick,
}: {
  libelle: string;
  actif: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={actif}
      className={cn(
        'border px-5 py-3 text-[14px] transition-colors duration-300',
        actif ? 'border-encre bg-encre text-blanc' : 'border-trait bg-blanc text-fumee hover:border-encre',
      )}
    >
      {libelle}
    </button>
  );
}

/** Intitulé de bloc de formulaire : gras, capitales, noir. */
export function TitreBloc({ children, className }: { children: string; className?: string }) {
  return (
    <h2 className={cn('text-[19px] font-bold uppercase', className)}>{children}</h2>
  );
}
