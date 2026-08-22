import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmorceModule } from './amorce/amorce.module';
import { CatalogueModule } from './catalogue/catalogue.module';
import { ContenuModule } from './contenu/contenu.module';
import { MediasModule } from './medias/medias.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        /**
         * Une base hébergée (Neon via le Marketplace Vercel, ou toute autre)
         * s'utilise avec une chaîne de connexion plutôt que des champs
         * séparés — et exige TLS. En local, ni l'une ni l'autre variable
         * n'existe : le comportement d'origine (host/port/utilisateur du
         * Docker Compose) reste inchangé.
         */
        const urlConnexion =
          config.get<string>('DATABASE_URL') ?? config.get<string>('POSTGRES_URL');

        const connexion = urlConnexion
          ? { url: urlConnexion, ssl: { rejectUnauthorized: false } }
          : {
              host: config.get<string>('DATABASE_HOST') ?? 'localhost',
              port: Number(config.get<string>('DATABASE_PORT') ?? 5433),
              username: config.get<string>('DATABASE_USER') ?? 'moodstore',
              password: config.get<string>('DATABASE_PASSWORD') ?? 'moodstore',
              database: config.get<string>('DATABASE_NAME') ?? 'moodstore',
            };

        return {
          type: 'postgres' as const,
          ...connexion,
          autoLoadEntities: true,

          /**
           * `synchronize` fabrique le schéma à partir des entités, sans
           * migration. C'est ce qu'on veut tant que la base n'a pas de données
           * à perdre. À passer à `false` — et à basculer sur des migrations —
           * dès qu'il y a des données à ne pas perdre : la synchronisation
           * automatique n'hésite pas à supprimer une colonne pour la faire
           * correspondre.
           */
          synchronize: config.get<string>('SYNCHRONISER_SCHEMA') !== 'false',
          logging: ['error', 'warn'] as const,

          /**
           * Une fonction Vercel démarre une instance à la fois et la
           * réutilise tant qu'elle reste chaude : un grand pool par instance
           * n'aide en rien et épuise vite les connexions d'une base
           * hébergée si plusieurs instances tournent en parallèle.
           */
          extra: urlConnexion ? { max: 3 } : undefined,
        };
      },
    }),

    CatalogueModule,
    MediasModule,
    ContenuModule,
    AmorceModule,
  ],
})
export class AppModule {}
