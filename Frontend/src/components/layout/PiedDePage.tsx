'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import {
  IconeFacebook,
  IconeFleche,
  IconeFlecheHaut,
  IconeInstagram,
  IconeLieu,
  IconePinterest,
  IconeWhatsApp,
} from '@/components/icons';
import { Conteneur } from '@/components/ui/Conteneur';
import { FOOTER_COLONNES, FOOTER_LEGAL } from '@/data/navigation';
import { SHOWROOMS } from '@/data/home';
import { SITE, lienWhatsApp } from '@/data/site';

/**
 * Pied de page — structure Roche Bobois : bandeau newsletter, colonnes de
 * liens, texte de marque, encart « Trouver un showroom », barre légale noire.
 */
export function PiedDePage() {
  const [email, setEmail] = useState('');
  const [envoye, setEnvoye] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO : POST /api/newsletter (back TypeORM)
    setEnvoye(true);
  };

  return (
    <footer className="border-t border-sable/50 bg-craie">
      {/* Newsletter */}
      <Conteneur className="grid gap-8 py-14 lg:grid-cols-12 lg:items-center">
        <p className="text-sm text-fumee lg:col-span-3">
          Recevez nos nouveautés, nos inspirations et nos invitations privées.
        </p>

        <form onSubmit={onSubmit} className="lg:col-span-6">
          <div className="flex items-center border border-sable bg-blanc">
            <label htmlFor="newsletter" className="sr-only">
              Votre adresse e-mail
            </label>
            <input
              id="newsletter"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse e-mail (nom@domaine.com)"
              className="h-14 w-full bg-transparent px-5 text-sm outline-none placeholder:text-pierre"
            />
            <button
              type="submit"
              className="flex h-14 shrink-0 items-center gap-2 px-6 text-nav uppercase transition-colors hover:bg-encre hover:text-craie"
            >
              {envoye ? 'Merci' : "S'inscrire"}
              <IconeFleche className="size-4" />
            </button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-pierre">
            En vous inscrivant, vous acceptez que vos données soient traitées conformément à
            notre{' '}
            <Link href="/politique-confidentialite" className="lien-souligne">
              politique de confidentialité
            </Link>
            .
          </p>
        </form>

        <div className="flex items-center gap-3 lg:col-span-3 lg:justify-end">
          <span className="mr-2 text-sm text-fumee">Suivez-nous</span>
          {[
            { href: SITE.instagram, label: 'Instagram', Icone: IconeInstagram },
            { href: '#', label: 'Facebook', Icone: IconeFacebook },
            { href: '#', label: 'Pinterest', Icone: IconePinterest },
            {
              href: lienWhatsApp('Bonjour, je souhaite des informations.'),
              label: 'WhatsApp',
              Icone: IconeWhatsApp,
            },
          ].map(({ href, label, Icone }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex size-10 items-center justify-center border border-sable transition-colors hover:border-encre hover:bg-encre hover:text-craie"
            >
              <Icone className="size-[18px]" />
            </a>
          ))}
        </div>
      </Conteneur>

      {/* Colonnes */}
      <Conteneur className="grid gap-10 border-t border-sable/50 py-14 lg:grid-cols-12">
        <nav className="grid gap-10 sm:grid-cols-2 lg:col-span-6 lg:grid-cols-4">
          {FOOTER_COLONNES.map((colonne) => (
            <div key={colonne.titre}>
              <p className="eyebrow mb-4 text-encre">{colonne.titre}</p>
              <ul className="space-y-2.5">
                {colonne.liens.map((lien) => (
                  <li key={lien.href + lien.libelle}>
                    <Link
                      href={lien.href}
                      className="lien-souligne text-sm text-fumee transition-colors hover:text-encre"
                    >
                      {lien.libelle}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="lg:col-span-4">
          <p className="mb-4 text-sm tracking-[0.06em] uppercase">
            Mood Store : l’art du sur-mesure, à Tunis depuis {SITE.depuis}.
          </p>
          <p className="text-sm leading-relaxed text-fumee">
            Dans ses deux showrooms de La Soukra et de Sousse, Mood Store conçoit et fabrique
            un mobilier entièrement personnalisable : canapés, fauteuils, tables de repas,
            dressings, bibliothèques, têtes de lit, luminaires et objets de décoration. Notre
            atelier réalise également des projets complets d’architecture d’intérieur, de
            l’esquisse à la remise des clés.
          </p>
        </div>

        <div className="lg:col-span-2">
          <Link
            href="/showroom"
            className="group flex flex-col items-center justify-center gap-3 border border-sable p-8 text-center transition-colors hover:border-encre"
          >
            <IconeLieu className="size-7 text-encre transition-transform duration-500 ease-[var(--ease-doux)] group-hover:-translate-y-1" />
            <span className="text-nav uppercase">Trouver un showroom</span>
            <span className="eyebrow text-pierre">Tunis · Sousse</span>
          </Link>

          <div className="mt-6 space-y-2 text-sm text-fumee">
            {SHOWROOMS.map((s) => (
              <p key={s.slug}>
                <span className="text-encre">{s.ville}</span> — {s.horaires}
              </p>
            ))}
            <a href={`tel:${SITE.telephoneBrut}`} className="lien-souligne block text-encre">
              {SITE.telephone}
            </a>
          </div>
        </div>
      </Conteneur>

      {/* Barre légale */}
      <div className="bg-encre text-craie">
        <Conteneur className="flex flex-wrap items-center justify-between gap-4 py-5">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {FOOTER_LEGAL.map((lien) => (
              <li key={lien.href + lien.libelle}>
                <Link
                  href={lien.href}
                  className="lien-souligne text-[0.6875rem] tracking-[0.1em] text-craie/70 uppercase transition-colors hover:text-craie"
                >
                  {lien.libelle}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6">
            <span className="text-[0.6875rem] tracking-[0.1em] text-craie/60 uppercase">
              © {new Date().getFullYear()} Mood Store — Tunisie
            </span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Revenir en haut"
              className="flex size-10 items-center justify-center border border-craie/25 transition-colors hover:bg-craie hover:text-encre"
            >
              <IconeFlecheHaut className="size-4" />
            </button>
          </div>
        </Conteneur>
      </div>
    </footer>
  );
}
