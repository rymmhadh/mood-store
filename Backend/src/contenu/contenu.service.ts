import { Injectable, Logger, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaAccueil } from './entites/media-accueil.entite';
import { SectionAccueil } from './entites/section-accueil.entite';
import { SECTIONS_INITIALES, MEDIAS_INITIAUX } from './contenu-initial';
import type { ModifierMediaAccueil, ModifierSection } from './dto/contenu.schemas';

/**
 * Contenu de la page d'accueil (§19.5.1).
 *
 * Deux nuanciers : les sections elles-mêmes (visibles ou non, dans quel
 * ordre) et les photographies qui les illustrent. Amorcés une seule fois, à
 * l'identique de ce qui vivait en dur dans le front — rien ne change à l'œil
 * tant que personne n'a touché à l'écran de gestion.
 */
@Injectable()
export class ContenuService implements OnApplicationBootstrap {
  private readonly journal = new Logger('Contenu');

  constructor(
    @InjectRepository(SectionAccueil) private readonly sections: Repository<SectionAccueil>,
    @InjectRepository(MediaAccueil) private readonly medias: Repository<MediaAccueil>,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if ((await this.sections.count()) === 0) {
      await this.sections.save(
        SECTIONS_INITIALES.map((s, ordre) => this.sections.create({ ...s, ordre })),
      );
      this.journal.log(`${SECTIONS_INITIALES.length} sections d’accueil amorcées.`);
    }

    if ((await this.medias.count()) === 0) {
      await this.medias.save(
        MEDIAS_INITIAUX.map((m, i) =>
          this.medias.create({ alt: '', titre: null, texte: null, lien: null, ...m }),
        ),
      );
      this.journal.log(`${MEDIAS_INITIAUX.length} photographies d’accueil amorcées.`);
    }
  }

  /* ── Sections ────────────────────────────────────────────────────────── */

  listerSections() {
    return this.sections.find({ order: { ordre: 'ASC' } });
  }

  listerSectionsVisibles() {
    return this.sections.find({ where: { visible: true }, order: { ordre: 'ASC' } });
  }

  async modifierSection(id: string, donnees: ModifierSection): Promise<SectionAccueil> {
    const trouvee = await this.sections.findOneBy({ id });
    if (!trouvee) throw new NotFoundException('Cette section n’existe plus.');
    if (donnees.visible !== undefined) trouvee.visible = donnees.visible;
    return this.sections.save(trouvee);
  }

  async reordonnerSections(ids: string[]): Promise<SectionAccueil[]> {
    await Promise.all(ids.map((id, ordre) => this.sections.update({ id }, { ordre })));
    return this.listerSections();
  }

  /* ── Photographies ───────────────────────────────────────────────────── */

  async listerMedias(section: string): Promise<MediaAccueil[]> {
    const trouves = await this.medias.find({ where: { section }, order: { ordre: 'ASC' } });
    return trouves.map((m) => ({ ...m, url: this.absolu(m.url) }));
  }

  async listerTousLesMedias(): Promise<MediaAccueil[]> {
    const trouves = await this.medias.find({ order: { section: 'ASC', ordre: 'ASC' } });
    return trouves.map((m) => ({ ...m, url: this.absolu(m.url) }));
  }

  /**
   * Une image d'origine (`/images/...`) est servie par le front, telle
   * quelle ; une photo téléversée (`/media/...`) est servie par l'API et a
   * besoin de son adresse complète pour que `next/image` la résolve.
   */
  private absolu(chemin: string): string {
    if (/^https?:/i.test(chemin)) return chemin;
    if (!chemin.startsWith('/media/')) return chemin;
    return this.urlPublique(chemin);
  }

  async ajouterMedia(section: string, champs: Partial<MediaAccueil> & { url: string }) {
    const compte = await this.medias.count({ where: { section } });
    return this.medias.save(
      this.medias.create({ section, ordre: compte, alt: '', titre: null, texte: null, lien: null, ...champs }),
    );
  }

  async modifierMedia(id: string, donnees: ModifierMediaAccueil): Promise<MediaAccueil> {
    const trouve = await this.medias.findOneBy({ id });
    if (!trouve) throw new NotFoundException('Cette photographie n’existe plus.');
    Object.assign(trouve, donnees);
    return this.medias.save(trouve);
  }

  async supprimerMedia(id: string): Promise<void> {
    const resultat = await this.medias.delete({ id });
    if (!resultat.affected) throw new NotFoundException('Cette photographie n’existe plus.');
  }

  async reordonnerMedias(section: string, ids: string[]): Promise<MediaAccueil[]> {
    await Promise.all(ids.map((id, ordre) => this.medias.update({ id, section }, { ordre })));
    return this.listerMedias(section);
  }

  urlPublique(chemin: string): string {
    const racine = (this.config.get<string>('URL_PUBLIQUE') ?? 'http://localhost:4000').replace(
      /\/+$/,
      '',
    );
    return `${racine}${chemin}`;
  }
}
