import { QuizQuestion } from '../lib/types';

export const OTAKU_QUESTIONS: QuizQuestion[] = [
  // SHONEN CLASSICS
  {
    id: 'q_shonen_1',
    question: 'Dans Dragon Ball Z, quelle est la planète d\'origine de Piccolo ?',
    options: ['Planète Vegeta', 'Namek', 'Planète Kaioshin', 'Yardrat'],
    correctAnswerIndex: 1,
    explanation: 'Piccolo est un Namek originel de la planète Namek (bien qu\'issu du Tout-Puissant tombé sur Terre).',
    animeSource: 'Dragon Ball Z',
    category: 'shonen',
    difficulty: 'easy',
    badgeEmoji: '🐉'
  },
  {
    id: 'q_shonen_2',
    question: 'Quel est le vrai nom du fruit du démon mangé par Luffy dans One Piece ?',
    options: ['Gomu Gomu no Mi', 'Hito Hito no Mi, Modèle Nika', 'Mera Mera no Mi', 'Yami Yami no Mi'],
    correctAnswerIndex: 1,
    explanation: 'Le Gouvernement Mondial a rebaptisé le Fruit du Démon Mythique "Hito Hito no Mi, Modèle Nika" sous le nom de Gomu Gomu no Mi pour cacher sa vraie nature !',
    animeSource: 'One Piece',
    category: 'shonen',
    difficulty: 'medium',
    badgeEmoji: '👒'
  },
  {
    id: 'q_shonen_3',
    question: 'Comment s\'appelle l\'épée de Ichigo Kurosaki dans Bleach sous sa forme Shikai ?',
    options: ['Senbonzakura', 'Zangetsu', 'Hyorinmaru', 'Kyoka Suigetsu'],
    correctAnswerIndex: 1,
    explanation: 'L\'épée de Ichigo s\'appelle Zangetsu ("Lune Tranchante").',
    animeSource: 'Bleach',
    category: 'shonen',
    difficulty: 'easy',
    badgeEmoji: '⚔️'
  },
  {
    id: 'q_shonen_4',
    question: 'Quelle est la première technique d\'extension du territoire de Satoru Gojo ?',
    options: ['Sphère de l\'Espace Infini', 'Machoire des Ombres', 'Autel de la Poisse', 'Sphère de Feu'],
    correctAnswerIndex: 0,
    explanation: 'L\'Extension du Territoire de Gojo Satoru est Muryōkūsho (L\'Espace Infini / Incommensurable).',
    animeSource: 'Jujutsu Kaisen',
    category: 'shonen',
    difficulty: 'easy',
    badgeEmoji: '👁️'
  },
  {
    id: 'q_shonen_5',
    question: 'Dans Hunter x Hunter, quel est le type de Nen de Gon Freecss ?',
    options: ['Manipulation', 'Materialisation', 'Renforcement', 'Transformation'],
    correctAnswerIndex: 2,
    explanation: 'Gon utilise le Renforcement pour exécuter sa célèbre attaque Jajanken (Pierre-Feuille-Ciseaux).',
    animeSource: 'Hunter x Hunter',
    category: 'shonen',
    difficulty: 'easy',
    badgeEmoji: '🎣'
  },

  // SEINEN & DARK FANTASY
  {
    id: 'q_seinen_1',
    question: 'Dans Attack on Titan, quel est le nom du Titan originel de Eren Yeager ?',
    options: ['Titan Cuirassé', 'Titan Assaillant', 'Titan Marteau d\'Armes', 'Titan Colossal'],
    correctAnswerIndex: 1,
    explanation: 'Eren possède le Titan Assaillant (Shingeki no Kyojin) transmis par son père Grisha Yeager.',
    animeSource: 'Attack on Titan',
    category: 'seinen',
    difficulty: 'easy',
    badgeEmoji: '🧱'
  },
  {
    id: 'q_seinen_2',
    question: 'Dans Death Note, quel aliment favori adore grignoter Ryuk le Dieu de la Mort ?',
    options: ['Les Bananes', 'Les Pommes', 'Les Chocolats', 'Les Ramen'],
    correctAnswerIndex: 1,
    explanation: 'Ryuk est totalement accro aux pommes de la Terre, les comparant à une drogue !',
    animeSource: 'Death Note',
    category: 'seinen',
    difficulty: 'easy',
    badgeEmoji: '🍎'
  },
  {
    id: 'q_seinen_3',
    question: 'Dans Berserk, quel est le nom de la gigantesque épée de Guts ?',
    options: ['Excalibur', 'Dragonslayer (Fend-Dragon)', 'Muramasa', 'Soul Reaver'],
    correctAnswerIndex: 1,
    explanation: 'La Dragonslayer (Fend-Dragon) forgee par Godot est une énorme masse de fer trop lourde pour être appelée une épée normale.',
    animeSource: 'Berserk',
    category: 'seinen',
    difficulty: 'medium',
    badgeEmoji: '🛡️'
  },
  {
    id: 'q_seinen_4',
    question: 'Dans Tokyo Ghoul, quel est le masque emblématique de Ken Kaneki ?',
    options: ['Un masque d\'ours', 'Un masque de démon avec fermeture éclair', 'Un masque de kitsune', 'Un casque de samouraï'],
    correctAnswerIndex: 1,
    explanation: 'Son masque en cuir noir avec une fermeture éclair au niveau de la bouche et un cache-œil masque son œil humain.',
    animeSource: 'Tokyo Ghoul',
    category: 'seinen',
    difficulty: 'easy',
    badgeEmoji: '☕'
  },

  // ISEKAI & POWER FANTASY
  {
    id: 'q_isekai_1',
    question: 'Dans Solo Leveling, quelle est la classe d\'Éveil initiale de Sung Jin-Woo avant d\'obtenir le système ?',
    options: ['Rang-S', 'Rang-A', 'Rang-E (Le plus faible)', 'Rang-C'],
    correctAnswerIndex: 2,
    explanation: 'Sung Jin-Woo était surnommé "Le plus faible de toute l\'humanité" en étant un simple Chasseur de Rang-E.',
    animeSource: 'Solo Leveling',
    category: 'isekai',
    difficulty: 'easy',
    badgeEmoji: '🗡️'
  },
  {
    id: 'q_isekai_2',
    question: 'Dans That Time I Got Reincarnated as a Slime, quel est le nom du dragon scellé que rencontre Rimuru ?',
    options: ['Veldora Tempest', 'Bahamut', 'Ignis', 'Smaug'],
    correctAnswerIndex: 0,
    explanation: 'Rimuru se lie d\'amitié avec le Dragon des Tempêtes Veldora Tempest et le stocke dans son estomac pour lever son sceau.',
    animeSource: 'Slime Isekai',
    category: 'isekai',
    difficulty: 'easy',
    badgeEmoji: '💧'
  },
  {
    id: 'q_isekai_3',
    question: 'Dans Re:Zero, quel pouvoir terrifiant possède Subaru Natsuki ?',
    options: ['Téléportation ultime', 'Retour par la Mort', 'Vol de magie', 'Invisibilité complète'],
    correctAnswerIndex: 1,
    explanation: 'Subaru revient dans le temps à un "point de sauvegarde" à chaque fois qu\'il meurt.',
    animeSource: 'Re:Zero',
    category: 'isekai',
    difficulty: 'easy',
    badgeEmoji: '⏳'
  },

  // QUOTES & CULTURE
  {
    id: 'q_quote_1',
    question: 'À quel anime appartient la citation : "Plus ultra !!" ?',
    options: ['My Hero Academia', 'Black Clover', 'One Punch Man', 'Demon Slayer'],
    correctAnswerIndex: 0,
    explanation: '"Plus Ultra !" est la devise officielle de l\'Académie U.A. dans My Hero Academia.',
    animeSource: 'My Hero Academia',
    category: 'quotes',
    difficulty: 'easy',
    badgeEmoji: '💥'
  },
  {
    id: 'q_quote_2',
    question: 'Quel personnage déclare : "Je vais devenir le Roi des Pirates !" ?',
    options: ['Naruto Uzumaki', 'Monkey D. Luffy', 'Natsu Dragnir', 'Asta'],
    correctAnswerIndex: 1,
    explanation: 'C\'est le cri de ralliement emblématique de Monkey D. Luffy dans One Piece !',
    animeSource: 'One Piece',
    category: 'quotes',
    difficulty: 'easy',
    badgeEmoji: '🏴‍☠️'
  },

  // HARDCORE TRIVIA
  {
    id: 'q_hardcore_1',
    question: 'Dans Fullmetal Alchemist Brotherhood, quel est la règle numéro 1 de l\'Échange Équivalent ?',
    options: [
      'Pour obtenir quelque chose, il faut offrir quelque chose de valeur égale',
      'L\'alchimie humaine est autorisée 1 fois par an',
      'Seule la pierre philosophale ne coûte rien',
      'Le feu bat la terre'
    ],
    correctAnswerIndex: 0,
    explanation: 'L\'Échange Équivalent stipule que l\'homme ne peut rien obtenir sans donner quelque chose en retour.',
    animeSource: 'Fullmetal Alchemist',
    category: 'hardcore',
    difficulty: 'medium',
    badgeEmoji: '⚙️'
  },
  {
    id: 'q_hardcore_2',
    question: 'Dans Demon Slayer, de quelle couleur devient la lame du sabre de Tanjiro quand il la dégaine ?',
    options: ['Rouge feu', 'Noire intense', 'Bleu eau', 'Blanche argentée'],
    correctAnswerIndex: 1,
    explanation: 'La lame de Tanjiro devient noire, une couleur rare associée aux utilisateurs du Souffle du Soleil !',
    animeSource: 'Demon Slayer',
    category: 'hardcore',
    difficulty: 'medium',
    badgeEmoji: '🔥'
  }
];

export function getRandomQuestions(count: number = 5, category?: string): QuizQuestion[] {
  let pool = [...OTAKU_QUESTIONS];
  if (category && category !== 'all') {
    pool = pool.filter((q) => q.category === category);
    if (pool.length < count) {
      // fill remaining with any questions
      const remaining = OTAKU_QUESTIONS.filter((q) => q.category !== category);
      pool = [...pool, ...remaining];
    }
  }
  // Shuffle array
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
