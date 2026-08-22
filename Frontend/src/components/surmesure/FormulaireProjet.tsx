'use client';

import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { IconeChevron, IconeFermer } from '@/components/icons';
import { Conteneur } from '@/components/ui/Conteneur';
import { Champ, Puce, Zone } from './Champ';
import { STYLES } from '@/data/catalogue';
import { DUREE, EASE_DOUX } from '@/lib/motion';
import { cn } from '@/lib/cn';

const TYPES_PROJET = [
  'Une pièce',
  'Une chambre',
  'Un appartement complet',
  'Une villa',
  'Un local professionnel',
];
const BUDGETS = [
  'Moins de 5 000 DT',
  '5 000 – 15 000 DT',
  '15 000 – 40 000 DT',
  'Plus de 40 000 DT',
  'À définir ensemble',
];
const ECHEANCES = ['Dès que possible', 'Dans 1 à 3 mois', 'Dans 3 à 6 mois', 'Plus tard'];
const CONTACTS = ['Téléphone', 'WhatsApp', 'E-mail'];

const TAILLE_MAX = 20 * 1024 * 1024;
const NOMBRE_MAX = 10;
const TYPES_ACCEPTES = ['image/', 'application/pdf'];

interface Fichier {
  nom: string;
  taille: number;
  apercu?: string;
}

const poids = (o: number) =>
  o > 1024 * 1024 ? `${(o / 1024 / 1024).toFixed(1)} Mo` : `${Math.round(o / 1024)} ko`;

/**
 * Dépôt de projet sur mesure — quatre écrans, une question à la fois.
 *
 * Un formulaire long décourage : on le découpe, on affiche la progression,
 * et on ne demande les coordonnées qu'en dernier, une fois que la personne a
 * investi du temps dans sa description.
 */
export function FormulaireProjet() {
  const [etape, setEtape] = useState(0);
  const [envoye, setEnvoye] = useState(false);
  const [survolDepot, setSurvolDepot] = useState(false);
  const [fichiers, setFichiers] = useState<Fichier[]>([]);
  const [erreur, setErreur] = useState('');
  const champFichier = useRef<HTMLInputElement>(null);

  const [projet, setProjet] = useState({
    type: '',
    surface: '',
    ville: '',
    vision: '',
    styles: [] as string[],
    budget: '',
    echeance: '',
    nom: '',
    telephone: '',
    email: '',
    contact: 'WhatsApp',
  });

  const maj = (p: Partial<typeof projet>) => setProjet((v) => ({ ...v, ...p }));

  const ajouter = (liste: FileList | null) => {
    if (!liste) return;
    setErreur('');
    const nouveaux: Fichier[] = [];

    for (const f of Array.from(liste)) {
      if (fichiers.length + nouveaux.length >= NOMBRE_MAX) {
        setErreur(`${NOMBRE_MAX} fichiers au maximum.`);
        break;
      }
      if (!TYPES_ACCEPTES.some((t) => f.type.startsWith(t))) {
        setErreur('Formats acceptés : images et PDF.');
        continue;
      }
      if (f.size > TAILLE_MAX) {
        setErreur(`« ${f.name} » dépasse 20 Mo.`);
        continue;
      }
      nouveaux.push({
        nom: f.name,
        taille: f.size,
        apercu: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
      });
    }
    setFichiers((v) => [...v, ...nouveaux]);
  };

  const deposer = (e: DragEvent) => {
    e.preventDefault();
    setSurvolDepot(false);
    ajouter(e.dataTransfer.files);
  };

  const retirer = (i: number) =>
    setFichiers((v) => {
      const f = v[i];
      if (f.apercu) URL.revokeObjectURL(f.apercu);
      return v.filter((_, j) => j !== i);
    });

  const valide = [
    Boolean(projet.type && projet.ville),
    true,
    true,
    Boolean(projet.nom && projet.telephone),
  ];

  if (envoye) {
    return (
      <Conteneur className="py-24 lg:py-32">
        <div className="mx-auto max-w-2xl bg-galerie p-12 text-center lg:p-16">
          <p className="eyebrow text-encre">Dossier n° {Date.now().toString().slice(-6)}</p>
          <h2 className="mt-6 text-h2">Votre projet est entre nos mains.</h2>
          <p className="mt-6 leading-relaxed text-fumee">
            Un conseiller étudie votre demande et vous répond sous 48 heures ouvrées. Si votre
            projet est urgent, appelez-nous directement — nous décrochons.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/showroom/rendez-vous"
              className="flex h-14 items-center bg-encre px-8 libelle-action text-craie transition-colors hover:bg-fumee"
            >
              Prendre rendez-vous
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
          {['Votre projet', 'Vos documents', 'Votre vision', 'Vous joindre'].map((nom, i) => (
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
                <h2 className="text-h2">De quel projet s’agit-il ?</h2>
                <div className="mt-8 flex flex-wrap gap-2">
                  {TYPES_PROJET.map((t) => (
                    <Puce key={t} libelle={t} actif={projet.type === t} onClick={() => maj({ type: t })} />
                  ))}
                </div>
                <div className="mt-10 grid gap-7 sm:grid-cols-2">
                  <Champ
                    libelle="Surface approximative (m²)"
                    value={projet.surface}
                    onChange={(e) => maj({ surface: e.target.value })}
                    inputMode="numeric"
                    placeholder="Par exemple 120"
                  />
                  <Champ
                    libelle="Ville"
                    required
                    value={projet.ville}
                    onChange={(e) => maj({ ville: e.target.value })}
                    placeholder="Tunis, Sousse, La Marsa…"
                  />
                </div>
              </>
            )}

            {etape === 1 && (
              <>
                <h2 className="text-h2">Avez-vous des documents ?</h2>
                <p className="mt-4 leading-relaxed text-fumee">
                  Plans, photos de l’existant, images qui vous inspirent. Rien n’est obligatoire —
                  mais un plan fait gagner une semaine.
                </p>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setSurvolDepot(true);
                  }}
                  onDragLeave={() => setSurvolDepot(false)}
                  onDrop={deposer}
                  className={cn(
                    'mt-8 border border-dashed bg-blanc p-12 text-center transition-colors duration-300',
                    survolDepot ? 'border-encre bg-galerie' : 'border-trait',
                  )}
                >
                  <p className="text-[15px] text-fumee">
                    Glissez vos fichiers ici, ou{' '}
                    <button
                      type="button"
                      onClick={() => champFichier.current?.click()}
                      className="lien-souligne text-encre"
                    >
                      parcourez votre ordinateur
                    </button>
                  </p>
                  <p className="mt-3 text-[13px] text-pierre">
                    Images et PDF · 10 fichiers maximum · 20 Mo par fichier
                  </p>
                  <input
                    ref={champFichier}
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => ajouter(e.target.files)}
                    className="sr-only"
                  />
                </div>

                {erreur && <p className="mt-4 text-[13px] text-encre">{erreur}</p>}

                {fichiers.length > 0 && (
                  <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                    {fichiers.map((f, i) => (
                      <li key={f.nom + i} className="flex items-center gap-4 border border-trait bg-blanc p-3">
                        <span className="size-12 shrink-0 overflow-hidden bg-galerie">
                          {f.apercu && (
                            // Aperçu local d'un fichier choisi : pas d'optimisation possible
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={f.apercu} alt="" className="size-full object-cover" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14px]">{f.nom}</span>
                          <span className="text-[12px] text-pierre">{poids(f.taille)}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => retirer(i)}
                          aria-label={`Retirer ${f.nom}`}
                          className="text-pierre transition-colors hover:text-encre"
                        >
                          <IconeFermer className="size-4" strokeWidth={1.6} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {etape === 2 && (
              <>
                <h2 className="text-h2">Décrivez-nous votre vision</h2>
                <Zone
                  libelle="Votre projet en quelques lignes"
                  className="mt-8"
                  value={projet.vision}
                  onChange={(e) => maj({ vision: e.target.value })}
                  placeholder="La pièce, son usage, ce qui vous gêne aujourd’hui, ce que vous aimeriez…"
                />

                <p className="mt-10 text-[13px] text-pierre">Styles qui vous parlent</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {STYLES.map((s) => (
                    <Puce
                      key={s}
                      libelle={s}
                      actif={projet.styles.includes(s)}
                      onClick={() =>
                        maj({
                          styles: projet.styles.includes(s)
                            ? projet.styles.filter((x) => x !== s)
                            : [...projet.styles, s],
                        })
                      }
                    />
                  ))}
                </div>

                <p className="mt-10 text-[13px] text-pierre">Enveloppe budgétaire</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {BUDGETS.map((b) => (
                    <Puce key={b} libelle={b} actif={projet.budget === b} onClick={() => maj({ budget: b })} />
                  ))}
                </div>

                <p className="mt-10 text-[13px] text-pierre">Échéance souhaitée</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ECHEANCES.map((e) => (
                    <Puce key={e} libelle={e} actif={projet.echeance === e} onClick={() => maj({ echeance: e })} />
                  ))}
                </div>
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
                    value={projet.nom}
                    onChange={(e) => maj({ nom: e.target.value })}
                  />
                  <Champ
                    libelle="Téléphone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={projet.telephone}
                    onChange={(e) => maj({ telephone: e.target.value })}
                  />
                  <Champ
                    libelle="Adresse e-mail"
                    type="email"
                    autoComplete="email"
                    className="sm:col-span-2"
                    value={projet.email}
                    onChange={(e) => maj({ email: e.target.value })}
                  />
                </div>

                <p className="mt-10 text-[13px] text-pierre">Vous préférez qu’on vous contacte par</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {CONTACTS.map((c) => (
                    <Puce key={c} libelle={c} actif={projet.contact === c} onClick={() => maj({ contact: c })} />
                  ))}
                </div>

                <p className="mt-10 text-[13px] leading-relaxed text-pierre">
                  Vos documents et vos coordonnées servent uniquement à l’étude de votre projet.
                  Ils ne sont ni cédés ni utilisés à d’autres fins.
                </p>
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
            onClick={() => (etape === 3 ? setEnvoye(true) : setEtape((e) => e + 1))}
            className="flex items-center gap-3 bg-encre px-8 py-4 libelle-action text-craie transition-colors hover:bg-fumee disabled:cursor-not-allowed disabled:bg-sable"
          >
            {etape === 3 ? 'Envoyer mon projet' : 'Continuer'}
            <IconeChevron className="size-4" strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </Conteneur>
  );
}
