'use client';

import { useState, type FormEvent } from 'react';
import { Champ, Liste, TitreBloc, Zone } from '@/components/surmesure/Champ';
import { cn } from '@/lib/cn';

const OBJETS = [
  'Demande de devis',
  'Projet sur mesure',
  'Architecture d’intérieur',
  'Service après-vente',
  'Professionnel',
  'Autre',
];

/**
 * Formulaire de contact.
 *
 * Validation à la volée, sans message d'erreur agressif : le bouton reste
 * inactif tant que le minimum n'est pas renseigné, et l'on dit pourquoi
 * plutôt que d'afficher du rouge (§2.4).
 */
export function FormulaireContact() {
  const [envoye, setEnvoye] = useState(false);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    objet: OBJETS[0],
    message: '',
  });

  const maj = (p: Partial<typeof form>) => setForm((v) => ({ ...v, ...p }));
  const complet = Boolean(form.nom && form.prenom && form.email && form.message);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!complet) return;
    setEnvoiEnCours(true);
    // TODO : POST /api/demandes (canal CONTACT) — back TypeORM
    await new Promise((r) => setTimeout(r, 600));
    setEnvoiEnCours(false);
    setEnvoye(true);
  };

  if (envoye) {
    return (
      <div className="flex min-h-[26rem] flex-col justify-center border border-trait p-10 lg:p-12">
        <span aria-hidden className="mb-6 block h-px w-12 bg-encre" />
        <TitreBloc>Message reçu</TitreBloc>
        <p className="mt-4 max-w-md leading-relaxed text-fumee">
          Nous vous répondons sous 24 heures ouvrées. Si votre demande est urgente, appelez-nous
          directement — quelqu’un décroche pendant les horaires du showroom.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <TitreBloc>Nous contacter</TitreBloc>
      <p className="mt-4 leading-relaxed text-fumee">
        Nous sommes à votre disposition pour répondre à vos questions. Complétez ce formulaire,
        nous vous répondons rapidement.
        <br />
        <span className="text-pierre">
          Les champs marqués d’un <span className="text-encre">*</span> sont obligatoires.
        </span>
      </p>

      <div className="mt-10 grid gap-7 sm:grid-cols-2">
        <Champ
          libelle="Nom"
          required
          autoComplete="family-name"
          value={form.nom}
          onChange={(e) => maj({ nom: e.target.value })}
        />
        <Champ
          libelle="Prénom"
          required
          autoComplete="given-name"
          value={form.prenom}
          onChange={(e) => maj({ prenom: e.target.value })}
        />
        <Champ
          libelle="Adresse e-mail"
          type="email"
          required
          autoComplete="email"
          placeholder="nom@domaine.com"
          className="sm:col-span-2"
          value={form.email}
          onChange={(e) => maj({ email: e.target.value })}
        />
        <Champ
          libelle="Numéro de téléphone"
          type="tel"
          autoComplete="tel"
          aide="Facultatif — mais c’est le plus rapide pour vous rappeler."
          value={form.telephone}
          onChange={(e) => maj({ telephone: e.target.value })}
        />
        <Liste
          libelle="Objet de votre demande"
          options={OBJETS}
          value={form.objet}
          onChange={(e) => maj({ objet: e.target.value })}
        />
        <Zone
          libelle="Votre message"
          required
          className="sm:col-span-2"
          value={form.message}
          onChange={(e) => maj({ message: e.target.value })}
          placeholder="Décrivez votre projet, votre pièce, vos contraintes…"
        />
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={!complet || envoiEnCours}
          className={cn(
            'h-14 px-12 libelle-action transition-colors',
            complet ? 'bg-encre text-craie hover:bg-fumee' : 'cursor-not-allowed bg-sable text-craie',
          )}
        >
          {envoiEnCours ? 'Envoi en cours…' : 'Envoyer'}
        </button>
        <p className="mt-4 text-[13px] leading-relaxed text-pierre">
          {complet
            ? 'Nous répondons sous 24 heures ouvrées.'
            : 'Nom, prénom, e-mail et message sont nécessaires pour nous écrire.'}
        </p>
      </div>
    </form>
  );
}
