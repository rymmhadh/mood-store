'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IconeLieu, IconeWhatsApp } from '@/components/icons';
import { lienWhatsApp } from '@/data/site';
import { cn } from '@/lib/cn';

/**
 * Barre d'action flottante mobile (§5.1) : WhatsApp · Devis · Showroom.
 * Principal levier de conversion sur téléphone. Apparaît après 30 % de scroll.
 */
export function BarreMobile() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(total > 0 && window.scrollY / total > 0.12);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-70 grid grid-cols-3 border-t border-craie/15 bg-encre lg:hidden',
        'transition-transform duration-500 ease-[var(--ease-doux)]',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <a
        href={lienWhatsApp('Bonjour, je souhaite des informations sur vos meubles.')}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 items-center justify-center gap-2 text-[0.6875rem] tracking-[0.12em] text-craie uppercase"
      >
        <IconeWhatsApp className="size-4" />
        WhatsApp
      </a>
      <Link
        href="/contact"
        className="flex h-14 items-center justify-center border-x border-craie/15 text-[0.6875rem] tracking-[0.12em] text-craie uppercase"
      >
        Devis
      </Link>
      <Link
        href="/showroom/rendez-vous"
        className="flex h-14 items-center justify-center gap-2 text-[0.6875rem] tracking-[0.12em] text-craie uppercase"
      >
        <IconeLieu className="size-4" />
        Showroom
      </Link>
    </div>
  );
}
