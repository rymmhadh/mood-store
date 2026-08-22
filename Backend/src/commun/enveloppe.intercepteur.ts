import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

/** Métadonnées de pagination, quand la réponse est une liste. */
export interface MetaReponse {
  total?: number;
  page?: number;
  parPage?: number;
  [cle: string]: unknown;
}

/** Réponse enveloppée, telle que décrite au §22.3 du cahier des charges. */
export interface Enveloppe<T> {
  data: T;
  meta: MetaReponse | null;
  error: null;
}

/** Marqueur : un service qui renvoie ceci fait passer ses métadonnées. */
export class ReponseAvecMeta<T> {
  constructor(
    readonly data: T,
    readonly meta: MetaReponse,
  ) {}
}

/**
 * Enveloppe toutes les réponses en `{ data, meta, error }`.
 *
 * Un format unique évite au front d'avoir à deviner, pour chaque endpoint, si
 * la liste est à la racine ou dans un champ. Les erreurs suivent la même forme,
 * remplie par le filtre d'exceptions.
 */
@Injectable()
export class EnveloppeIntercepteur<T> implements NestInterceptor<T, Enveloppe<T>> {
  intercept(_contexte: ExecutionContext, suivant: CallHandler): Observable<Enveloppe<T>> {
    return suivant.handle().pipe(
      map((valeur) =>
        valeur instanceof ReponseAvecMeta
          ? { data: valeur.data as T, meta: valeur.meta, error: null }
          : { data: valeur, meta: null, error: null },
      ),
    );
  }
}
