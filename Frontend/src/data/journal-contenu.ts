/**
 * Corps des articles du Journal.
 *
 * Séparé de `home.ts` : les métadonnées (titre, date, image) servent aux
 * vignettes partout sur le site, le corps ne sert qu'à la page article.
 * Indexé par le même `slug` que `ARTICLES`.
 */

export interface SectionArticle {
  titre?: string;
  paragraphes: string[];
}

export interface ContenuArticle {
  chapo: string;
  corps: SectionArticle[];
}

export const CONTENU_ARTICLES: Record<string, ContenuArticle> = {
  'choisir-son-canape': {
    chapo:
      'Un canapé trop grand écrase une petite pièce, un canapé trop petit s’y perd. Quelques repères avant de choisir.',
    corps: [
      {
        titre: 'Mesurer avant de rêver',
        paragraphes: [
          'Avant toute chose, matérialisez l’encombrement au sol avec du ruban adhésif ou de vieux journaux : la plupart des erreurs d’achat viennent d’un canapé jugé trop imposant une fois livré, alors que son plan au sol n’avait jamais été confronté à la pièce réelle.',
          'Gardez au moins 70 cm de dégagement pour circuler devant, et pensez à l’accès : porte, cage d’escalier, ascenseur. Un canapé modulable qui se sépare en plusieurs blocs franchit des passages qu’un canapé fixe ne franchira jamais.',
        ],
      },
      {
        titre: 'Une profondeur plus décisive que la longueur',
        paragraphes: [
          'Dans une pièce étroite, la profondeur du canapé compte souvent plus que sa longueur : un modèle profond de 100 cm mange visuellement l’espace même s’il ne fait que 2 mètres de large. Une assise plus fine, autour de 90 cm, libère un couloir de circulation sans sacrifier le confort.',
          'Les accoudoirs fins ou absents (accoudoirs « slim ») regagnent facilement 10 à 15 cm de largeur utile par rapport à un modèle capitonné classique — un choix simple qui change beaucoup dans un salon compact.',
        ],
      },
      {
        titre: 'Jouer avec la lumière et la couleur',
        paragraphes: [
          'Un coloris clair (écru, ivoire, sable) renvoie la lumière et recule visuellement les murs, là où un ton sombre referme la pièce — sauf s’il est volontairement utilisé en contraste avec des murs clairs, ce qui peut au contraire ancrer le canapé et agrandir le reste de la pièce par effet de profondeur.',
          'Un pied dégagé du sol, plutôt qu’une jupe qui touche terre, laisse voir le sol sous le canapé : l’œil perçoit la surface réelle de la pièce plutôt qu’un bloc plein.',
        ],
      },
      {
        titre: 'Fixe, modulable, ou convertible ?',
        paragraphes: [
          'Un canapé d’angle bien orienté peut libérer plus d’espace de circulation qu’un canapé droit de même longueur, en repoussant l’assise dans un angle mort de la pièce. À l’inverse, dans un studio, un modèle modulable permet de reconfigurer l’espace selon les usages de la journée.',
          'Le configurateur permet d’essayer plusieurs largeurs et profondeurs sur une même structure avant de commander — utile pour arbitrer entre confort et gabarit sans multiplier les visites en showroom.',
        ],
      },
    ],
  },

  'boucle-matiere': {
    chapo:
      'Texturé, chaleureux, résistant : le bouclé s’est imposé dans l’ameublement en quelques saisons. Ce qui explique sa place durable, au-delà de l’effet de mode.',
    corps: [
      {
        paragraphes: [
          'Le bouclé tire son nom de sa fibre bouclée sur elle-même, comme la laine mérinos dont il s’inspire souvent. Ce relief change tout : la lumière accroche la matière différemment selon l’angle, ce qui donne à un canapé bouclé une présence qu’un tissu plat n’a pas, même dans un coloris neutre.',
        ],
      },
      {
        titre: 'Une matière qui vieillit bien',
        paragraphes: [
          'Contrairement à un velours qui marque au fil des assises, le relief du bouclé masque naturellement les traces d’usage : les fibres bouclées reprennent leur forme et diffusent la lumière de façon irrégulière, ce qui rend les frottements et les plis beaucoup moins visibles au quotidien.',
          'C’est aussi une matière tolérante avec les enfants et les animaux : sa texture dense résiste bien aux griffures légères, à condition de choisir un bouclé à armature serrée plutôt qu’un tissage lâche.',
        ],
      },
      {
        titre: 'Comment le mixer',
        paragraphes: [
          'Le bouclé se marie particulièrement bien avec des matières franches — bois brut, laiton brossé, marbre — qui contrastent avec sa douceur visuelle. Réservé à un seul point fort (un canapé ou deux fauteuils), il évite l’effet « trop cocon » d’une pièce entièrement texturée.',
          'Côté couleur, les tons crème, sable et taupe restent les plus polyvalents ; un bouclé plus soutenu (terracotta, olive) fonctionne mieux en petite touche — un pouf, une tête de lit — qu’en grande surface.',
        ],
      },
      {
        titre: 'Entretien',
        paragraphes: [
          'Un dépoussiérage régulier à l’aspirateur avec un embout brosse suffit à l’entretien courant. Pour une tache, éponger sans frotter et traiter au plus vite : le bouclé absorbe rapidement les liquides du fait de sa structure aérée. Le détail complet des gestes par matière est réuni dans notre guide d’entretien.',
        ],
      },
    ],
  },

  'hauteur-table-repas': {
    chapo:
      'Une table trop haute ou trop basse se remarque à chaque repas. Les proportions qui fonctionnent, et comment les adapter à votre pièce.',
    corps: [
      {
        titre: 'La hauteur standard, et ses exceptions',
        paragraphes: [
          'La hauteur de référence d’une table de repas se situe entre 74 et 76 cm, pensée pour des chaises dont l’assise est à 45-46 cm — un écart d’environ 30 cm entre assise et plateau, suffisant pour poser les jambes sans que les accoudoirs ne butent contre la table.',
          'Avec des chaises très capitonnées ou un fauteuil de bout de table, vérifiez la hauteur d’accoudoir avant de valider : c’est souvent lui, plus que l’assise, qui détermine si la chaise passera sous la table.',
        ],
      },
      {
        titre: 'La longueur, en fonction du nombre de convives',
        paragraphes: [
          'Comptez 60 cm de largeur par personne assise côte à côte, et 90 cm en bout de table pour ne pas se sentir à l’étroit. Une table de 180 cm accueille ainsi confortablement 6 personnes (2 en bout, 4 sur les longueurs) ; à 220 cm, elle passe à 8.',
          'Pour un usage quotidien à moins de convives que la capacité maximale, une table à rallonge évite de vivre en permanence avec une table surdimensionnée pour l’espace.',
        ],
      },
      {
        titre: 'Le dégagement autour',
        paragraphes: [
          'Prévoyez au moins 90 cm entre le bord de la table et le mur ou le meuble le plus proche, pour permettre à une chaise de reculer et à une personne de circuler derrière quelqu’un déjà assis — 120 cm si la table est aussi un lieu de passage.',
          'Dans une salle à manger ouverte sur le salon, une table ronde ou ovale libère souvent plus de circulation qu’une table rectangulaire de même surface, en supprimant les angles saillants.',
        ],
      },
    ],
  },

  entretien: {
    chapo:
      'Quatre matières, quatre logiques d’entretien. De quoi garder chaque pièce impeccable sans l’abîmer.',
    corps: [
      {
        titre: 'Bouclé et tissus texturés',
        paragraphes: [
          'Aspirateur hebdomadaire avec un embout brosse souple, dans le sens du tissage. Pour une tache fraîche, éponger sans frotter avec un linge propre et de l’eau tiède ; frotter enfonce la tache dans la fibre bouclée plutôt que de l’en sortir.',
          'Éviter l’exposition prolongée au soleil direct, qui délave les fibres naturelles avec le temps — un simple voilage suffit à protéger un canapé placé devant une baie vitrée.',
        ],
      },
      {
        titre: 'Cuir',
        paragraphes: [
          'Dépoussiérer avec un chiffon doux et sec, puis nourrir avec un lait spécial cuir deux à trois fois par an pour éviter qu’il ne se dessèche et ne craquelle. Tester tout produit sur une zone peu visible avant application.',
          'Le cuir craint la chaleur directe (radiateur, plein soleil) autant que l’humidité stagnante : un intérieur tempéré lui convient mieux qu’un extérieur ou une véranda non ventilée.',
        ],
      },
      {
        titre: 'Bois massif',
        paragraphes: [
          'Un dépoussiérage au chiffon microfibre légèrement humide suffit au quotidien. Une à deux fois par an, une cire ou une huile adaptée à l’essence (chêne, noyer, teck) ravive le veinage et protège la surface.',
          'Toujours utiliser des dessous de plat et de verre : la chaleur directe et l’humidité marquent durablement un bois massif, contrairement à un stratifié.',
        ],
      },
      {
        titre: 'Laiton et métaux de finition',
        paragraphes: [
          'Un chiffon doux et sec suffit pour l’entretien courant ; les traces de doigts s’effacent avec un chiffon légèrement humide, séché aussitôt. Éviter les produits abrasifs ou acides, qui attaquent la patine.',
          'Une patine qui se creuse avec le temps fait partie du charme du laiton massif — c’est un signe de matière vraie, pas un défaut à corriger systématiquement.',
        ],
      },
    ],
  },
};
