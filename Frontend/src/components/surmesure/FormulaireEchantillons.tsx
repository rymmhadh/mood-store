'use client';

import { useState, type FormEvent } from 'react';
import { Conteneur } from '@/components/ui/Conteneur';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Champ } from './Champ';

/**
 * Demande d'échantillons.
 *
 * Cinq échantillons envoyés gratuitement : le coût est dérisoire et le geste
 * marquant (§18.13). C'est aussi le meilleur moyen d'obtenir une adresse
 * postale, donc un prospect qualifié.
 */
export function FormulaireEchantillons() {
  const [envoye, setEnvoye] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO : POST /api/echantillons (back TypeORM)
    setEnvoye(true);
  };

  return (
    <section id="echantillons" className="scroll-mt-40 border-t border-trait bg-blanc py-24 lg:py-32">
      <Conteneur className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Eyebrow className="mb-4 text-encre">Échantillons</Eyebrow>
          <h2 className="text-h2">Recevez la matière chez vous</h2>
          <p className="mt-6 max-w-md leading-relaxed text-fumee">
            Jusqu’à cinq échantillons, envoyés gratuitement partout en Tunisie sous cinq jours
            ouvrés. Regardez-les chez vous, à la lumière de votre pièce, à différents moments de
            la journée — c’est là que se décide un revêtement.
          </p>
          <p className="mt-6 text-[13px] text-pierre">
            Les pierres ne sont pas envoyées : elles se choisissent en showroom, et le veinage de
            votre plateau est validé sur photo avant découpe.
          </p>
        </div>

        <div className="lg:col-span-7">
          {envoye ? (
            <div className="flex h-full flex-col justify-center border border-trait p-10">
              <p className="text-h3 font-light">Votre envoi est enregistré.</p>
              <p className="mt-4 leading-relaxed text-fumee">
                Vous recevez vos échantillons sous cinq jours ouvrés. Un conseiller vous appelle
                d’ici là pour vérifier l’adresse et répondre à vos questions.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-7 border border-trait p-8 sm:grid-cols-2 lg:p-10">
              <Champ libelle="Nom et prénom" name="nom" required autoComplete="name" />
              <Champ libelle="Téléphone" name="telephone" type="tel" required autoComplete="tel" />
              <Champ
                libelle="Adresse e-mail"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="sm:col-span-2"
              />
              <Champ
                libelle="Adresse postale complète"
                name="adresse"
                required
                autoComplete="street-address"
                className="sm:col-span-2"
              />
              <Champ libelle="Ville" name="ville" required autoComplete="address-level2" />
              <Champ libelle="Code postal" name="cp" required autoComplete="postal-code" />

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="h-14 w-full bg-encre px-8 libelle-action text-craie transition-colors hover:bg-fumee"
                >
                  Recevoir mes échantillons
                </button>
                <p className="mt-4 text-[13px] leading-relaxed text-pierre">
                  Vos coordonnées servent uniquement à l’envoi et au suivi de votre demande.
                </p>
              </div>
            </form>
          )}
        </div>
      </Conteneur>
    </section>
  );
}
