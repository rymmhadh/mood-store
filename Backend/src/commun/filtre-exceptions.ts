import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { FastifyReply } from 'fastify';

/**
 * Toute erreur sort dans la même enveloppe que les succès.
 *
 * Le détail technique d'une erreur inattendue n'est jamais renvoyé au client :
 * il part dans les journaux du serveur. Le client reçoit une phrase en
 * français, affichable telle quelle dans le back-office.
 */
@Catch()
export class FiltreExceptions implements ExceptionFilter {
  private readonly journal = new Logger('Erreur');

  catch(exception: unknown, hote: ArgumentsHost) {
    const reponse = hote.switchToHttp().getResponse<FastifyReply>();

    if (exception instanceof HttpException) {
      const corps = exception.getResponse();
      const objet = typeof corps === 'string' ? {} : (corps as Record<string, unknown>);
      const message = typeof corps === 'string' ? corps : (objet.message ?? exception.message);

      return reponse.status(exception.getStatus()).send({
        data: null,
        meta: null,
        error: {
          code: exception.getStatus(),
          message,
          // Erreurs champ par champ : le formulaire du back-office les affiche
          // sous la bonne case plutôt qu'en bandeau au-dessus de tout.
          ...(objet.champs ? { champs: objet.champs } : {}),
        },
      });
    }

    this.journal.error(exception instanceof Error ? exception.stack : String(exception));

    return reponse.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      data: null,
      meta: null,
      error: {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Une erreur interne est survenue. L’équipe technique a été prévenue.',
      },
    });
  }
}
