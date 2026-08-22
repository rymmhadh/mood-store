'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { IconeChevron } from '@/components/icons';
import { Conteneur } from '@/components/ui/Conteneur';
import { Champ, Puce, Zone } from '@/components/surmesure/Champ';
import { heureFr, indexJour, SHOWROOMS_COMPLETS } from '@/data/showrooms';
import { DUREE, EASE_DOUX } from '@/lib/motion';
import { cn } from '@/lib/cn';

const MOTIFS = [
  { id: 'collections', nom: 'Découvrir les collections', duree: '45 min' },
  { id: 'sur-mesure', nom: 'Projet sur mesure', duree: '1 h' },
  { id: 'architecture', nom: 'Projet d’architecture d’intérieur', duree: '1 h 30' },
  { id: 'retrait', nom: 'Retirer une commande', duree: '15 min' },
];

const JOURS_COURTS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MOIS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

/**
 * Occupation simulée, déterministe.
 *
 * Le rendu serveur et le rendu client doivent produire exactement les mêmes
 * créneaux, sinon React signale une divergence d'hydratation. On dérive donc
 * la disponibilité d'un hachage de la date et de l'heure, jamais d'un tirage
 * aléatoire. À brancher sur `GET /api/showrooms/[slug]/creneaux`.
 */
function occupe(cle: string) {
  let somme = 0;
  for (let i = 0; i < cle.length; i++) somme = (somme * 31 + cle.charCodeAt(i)) % 997;
  return somme % 5 < 2;
}

export function PriseRendezVous({ showroomInitial }: { showroomInitial?: string }) {
  const [etape, setEtape] = useState(0);
  const [confirme, setConfirme] = useState(false);
  const [motif, setMotif] = useState('');
  const [showroom, setShowroom] = useState(showroomInitial ?? '');
  const [jour, setJour] = useState<string>('');
  const [creneau, setCreneau] = useState<number | null>(null);
  const [form, setForm] = useState({ nom: '', telephone: '', email: '', personnes: '2', note: '' });

  const lieu = SHOWROOMS_COMPLETS.find((s) => s.slug === showroom);

  /** Les 21 prochains jours d'ouverture du showroom choisi. */
  const jours = useMemo(() => {
    if (!lieu) return [];
    const liste: Date[] = [];
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 1);

    while (liste.length < 18) {
      if (lieu.horaires[indexJour(d)]) liste.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return liste;
  }, [lieu]);

  /** Créneaux d'une heure sur la plage d'ouverture du jour choisi. */
  const creneaux = useMemo(() => {
    if (!lieu || !jour) return [];
    const d = new Date(jour);
    const plage = lieu.horaires[indexJour(d)];
    if (!plage) return [];

    const liste: { minutes: number; libre: boolean }[] = [];
    for (let m = plage.ouverture; m + 60 <= plage.fermeture; m += 60) {
      liste.push({ minutes: m, libre: !occupe(`${lieu.slug}-${jour}-${m}`) });
    }
    return liste;
  }, [lieu, jour]);

  const valide = [
    Boolean(motif),
    Boolean(showroom),
    Boolean(jour && creneau !== null),
    Boolean(form.nom && form.telephone),
  ];

  const dateFr = (d: Date) => `${JOURS_COURTS[indexJour(d)]} ${d.getDate()} ${MOIS[d.getMonth()]}`;

  if (confirme && lieu && creneau !== null) {
    const conseiller = lieu.conseillers[0];
    return (
      <Conteneur className="py-24 lg:py-32">
        <div className="mx-auto max-w-2xl bg-galerie p-12 text-center lg:p-16">
          <span aria-hidden className="mx-auto mb-7 block h-px w-12 bg-bronze" />
          <h2 className="text-h2">Votre rendez-vous est réservé.</h2>

          <dl className="mx-auto mt-10 max-w-sm space-y-3 text-left">
            {[
              ['Motif', MOTIFS.find((m) => m.id === motif)?.nom],
              ['Showroom', `${lieu.nom} — ${lieu.ville}`],
              ['Date', dateFr(new Date(jour))],
              ['Heure', heureFr(creneau)],
              ['Votre conseiller', `${conseiller.prenom} — ${conseiller.role}`],
            ].map(([cle, valeur]) => (
              <div key={String(cle)} className="flex justify-between gap-6 border-b border-sable/50 pb-3">
                <dt className="text-[13px] text-pierre">{cle}</dt>
                <dd className="text-right text-[15px]">{valeur}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-[14px] leading-relaxed text-fumee">
            Une confirmation part par e-mail et sur WhatsApp, avec un rappel 24 heures avant.
            Pour décaler, répondez simplement au message.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <Link
              href={`/showroom/${lieu.slug}`}
              className="flex h-14 items-center bg-encre px-8 libelle-action text-craie transition-colors hover:bg-fumee"
            >
              Préparer ma visite
            </Link>
            <Link href="/collections/canapes" className="lien-souligne libelle-action">
              Parcourir les collections
            </Link>
          </div>
        </div>
      </Conteneur>
    );
  }

  return (
    <Conteneur className="py-14 lg:py-20">
      <div className="mx-auto max-w-3xl">
        {/* Progression */}
        <ol className="mb-12 flex items-center gap-3">
          {['Le motif', 'Le showroom', 'La date', 'Vos coordonnées'].map((nom, i) => (
            <li key={nom} className="flex flex-1 items-center gap-3">
              <button
                type="button"
                onClick={() => i < etape && setEtape(i)}
                disabled={i > etape}
                className={cn(
                  'text-[13px] whitespace-nowrap transition-colors disabled:cursor-not-allowed',
                  i === etape ? 'text-encre' : i < etape ? 'text-fumee' : 'text-sable',
                )}
              >
                <span className="tabular-nums">0{i + 1}</span>
                <span className="ml-2 hidden sm:inline">{nom}</span>
              </button>
              {i < 3 && (
                <span
                  aria-hidden
                  className={cn('h-px flex-1 transition-colors', i < etape ? 'bg-bronze' : 'bg-sable/60')}
                />
              )}
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait">
          <motion.div
            key={etape}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: DUREE.rapide, ease: EASE_DOUX }}
          >
            {etape === 0 && (
              <>
                <h2 className="text-h2">Que souhaitez-vous faire ?</h2>
                <div className="mt-8 grid gap-2 sm:grid-cols-2">
                  {MOTIFS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setMotif(m.id);
                        setEtape(1);
                      }}
                      aria-pressed={motif === m.id}
                      className={cn(
                        'border p-5 text-left transition-colors duration-300',
                        motif === m.id ? 'border-encre bg-galerie' : 'border-sable/60 hover:border-encre/50',
                      )}
                    >
                      <span className="block text-[17px]">{m.nom}</span>
                      <span className="mt-1.5 block text-[13px] text-pierre">Comptez {m.duree}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {etape === 1 && (
              <>
                <h2 className="text-h2">Dans quel showroom ?</h2>
                <div className="mt-8 grid gap-2 sm:grid-cols-2">
                  {SHOWROOMS_COMPLETS.map((s) => (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() => {
                        setShowroom(s.slug);
                        setJour('');
                        setCreneau(null);
                        setEtape(2);
                      }}
                      aria-pressed={showroom === s.slug}
                      className={cn(
                        'border p-5 text-left transition-colors duration-300',
                        showroom === s.slug ? 'border-encre bg-galerie' : 'border-sable/60 hover:border-encre/50',
                      )}
                    >
                      <span className="block text-[17px]">{s.ville}</span>
                      <span className="mt-1.5 block text-[13px] text-pierre">{s.adresse}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {etape === 2 && (
              <>
                <h2 className="text-h2">Quel jour vous arrange ?</h2>

                <div className="mt-8 flex snap-x gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {jours.map((d) => {
                    const cle = d.toISOString();
                    const actif = jour === cle;
                    return (
                      <button
                        key={cle}
                        type="button"
                        onClick={() => {
                          setJour(cle);
                          setCreneau(null);
                        }}
                        aria-pressed={actif}
                        className={cn(
                          'w-20 shrink-0 snap-start border py-4 text-center transition-colors duration-300',
                          actif ? 'border-encre bg-encre text-craie' : 'border-sable/60 hover:border-encre/50',
                        )}
                      >
                        <span className="block text-[12px] opacity-70">{JOURS_COURTS[indexJour(d)]}</span>
                        <span className="mt-1 block text-[20px] tabular-nums">{d.getDate()}</span>
                        <span className="block text-[12px] opacity-70">{MOIS[d.getMonth()].slice(0, 4)}</span>
                      </button>
                    );
                  })}
                </div>

                {jour && (
                  <div className="mt-10">
                    <p className="text-[13px] text-pierre">Créneaux disponibles</p>
                    <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {creneaux.map((c) => (
                        <button
                          key={c.minutes}
                          type="button"
                          disabled={!c.libre}
                          onClick={() => setCreneau(c.minutes)}
                          aria-pressed={creneau === c.minutes}
                          className={cn(
                            'border py-3.5 text-[15px] tabular-nums transition-colors duration-300',
                            !c.libre
                              ? 'cursor-not-allowed border-sable/30 text-sable line-through'
                              : creneau === c.minutes
                                ? 'border-encre bg-encre text-craie'
                                : 'border-sable/60 hover:border-encre/50',
                          )}
                        >
                          {heureFr(c.minutes)}
                        </button>
                      ))}
                    </div>
                    <p className="mt-4 text-[13px] text-pierre">
                      Les créneaux barrés sont déjà réservés.
                    </p>
                  </div>
                )}
              </>
            )}

            {etape === 3 && (
              <>
                <h2 className="text-h2">Comment vous joindre ?</h2>
                <div className="mt-8 grid gap-7 sm:grid-cols-2">
                  <Champ
                    libelle="Nom et prénom"
                    required
                    autoComplete="name"
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  />
                  <Champ
                    libelle="Téléphone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={form.telephone}
                    onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                  />
                  <Champ
                    libelle="Adresse e-mail"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <div>
                    <p className="text-[13px] text-pierre">Nombre de personnes</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['1', '2', '3', '4 et plus'].map((n) => (
                        <Puce
                          key={n}
                          libelle={n}
                          actif={form.personnes === n}
                          onClick={() => setForm({ ...form, personnes: n })}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <Zone
                  libelle="Un mot sur votre projet (facultatif)"
                  className="mt-8"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Pièces concernées, surface, contraintes particulières…"
                />

                {lieu && jour && creneau !== null && (
                  <p className="mt-8 border-t border-sable/60 pt-6 text-[14px] text-fumee">
                    Récapitulatif — {MOTIFS.find((m) => m.id === motif)?.nom}, {lieu.ville},{' '}
                    {dateFr(new Date(jour))} à {heureFr(creneau)}.
                  </p>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between gap-4 border-t border-sable/60 pt-7">
          <button
            type="button"
            onClick={() => setEtape((e) => Math.max(0, e - 1))}
            disabled={etape === 0}
            className="flex items-center gap-2 text-[15px] text-fumee transition-opacity hover:opacity-60 disabled:invisible"
          >
            <IconeChevron className="size-4 rotate-180" strokeWidth={1.5} />
            Retour
          </button>

          <button
            type="button"
            disabled={!valide[etape]}
            onClick={() => (etape === 3 ? setConfirme(true) : setEtape((e) => e + 1))}
            className="flex items-center gap-3 bg-encre px-8 py-4 libelle-action text-craie transition-colors hover:bg-fumee disabled:cursor-not-allowed disabled:bg-sable"
          >
            {etape === 3 ? 'Confirmer le rendez-vous' : 'Continuer'}
            <IconeChevron className="size-4" strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </Conteneur>
  );
}
