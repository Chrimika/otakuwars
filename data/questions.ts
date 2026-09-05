import { QuizQuestion } from '../lib/types';

export const OTAKU_QUESTIONS: QuizQuestion[] = [
  // ============================================================
  // SHONEN CLASSICS (20 questions)
  // ============================================================
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
    options: ['Sphère de l\'Espace Infini', 'Mâchoire des Ombres', 'Autel de la Poisse', 'Sphère de Feu'],
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
    options: ['Manipulation', 'Matérialisation', 'Renforcement', 'Transformation'],
    correctAnswerIndex: 2,
    explanation: 'Gon utilise le Renforcement pour exécuter sa célèbre attaque Jajanken (Pierre-Feuille-Ciseaux).',
    animeSource: 'Hunter x Hunter',
    category: 'shonen',
    difficulty: 'easy',
    badgeEmoji: '🎣'
  },
  {
    id: 'q_shonen_6',
    question: 'Dans Naruto, quel est le nom du démon à neuf queues scellé en Naruto ?',
    options: ['Shukaku', 'Matatabi', 'Kurama', 'Gyuki'],
    correctAnswerIndex: 2,
    explanation: 'Kurama est le Kyūbi (démon à neuf queues) scellé en Naruto depuis sa naissance.',
    animeSource: 'Naruto',
    category: 'shonen',
    difficulty: 'easy',
    badgeEmoji: '🦊'
  },
  {
    id: 'q_shonen_7',
    question: 'Dans Fairy Tail, quelle est la guilde de Natsu Dragneel ?',
    options: ['Guildes des Ombres', 'Fairy Tail', 'Sabertooth', 'Phantom Lord'],
    correctAnswerIndex: 1,
    explanation: 'Natsu est le fier membre de la guilde Fairy Tail, connue pour ses mages excentriques.',
    animeSource: 'Fairy Tail',
    category: 'shonen',
    difficulty: 'easy',
    badgeEmoji: '🔥'
  },
  {
    id: 'q_shonen_8',
    question: 'Dans Black Clover, quel est le grimoire d\'Asta ?',
    options: ['Grimoire à 4 feuilles', 'Grimoire à 5 feuilles', 'Grimoire démoniaque', 'Grimoire de l\'aube'],
    correctAnswerIndex: 2,
    explanation: 'Asta possède un grimoire démoniaque à 5 feuilles qui lui permet d\'annuler toute magie.',
    animeSource: 'Black Clover',
    category: 'shonen',
    difficulty: 'medium',
    badgeEmoji: '📖'
  },
  {
    id: 'q_shonen_9',
    question: 'Dans My Hero Academia, quel est le "Quirk" de All Might ?',
    options: ['Explosion', 'One For All', 'All For One', 'Demi-glace'],
    correctAnswerIndex: 1,
    explanation: 'All Might possède le One For All, un Quirk transmis de génération en génération.',
    animeSource: 'My Hero Academia',
    category: 'shonen',
    difficulty: 'easy',
    badgeEmoji: '💪'
  },
  {
    id: 'q_shonen_10',
    question: 'Dans Demon Slayer, quelle est la respiration de Tanjiro ?',
    options: ['Respiration du Feu', 'Respiration de l\'Eau', 'Respiration du Vent', 'Respiration du Tonnerre'],
    correctAnswerIndex: 1,
    explanation: 'Tanjiro maîtrise la Respiration de l\'Eau, héritée de son maître Urokodaki.',
    animeSource: 'Demon Slayer',
    category: 'shonen',
    difficulty: 'easy',
    badgeEmoji: '🌊'
  },
  {
    id: 'q_shonen_11',
    question: 'Dans One Punch Man, quel est le nom de l\'attaque ultime de Saitama ?',
    options: ['Ultra Punch', 'Serious Punch', 'Normal Punch', 'Omega Punch'],
    correctAnswerIndex: 1,
    explanation: 'Le Serious Punch est l\'attaque la plus puissante de Saitama, capable de diviser les nuages sur toute la planète.',
    animeSource: 'One Punch Man',
    category: 'shonen',
    difficulty: 'medium',
    badgeEmoji: '👊'
  },
  {
    id: 'q_shonen_12',
    question: 'Dans Gintama, quelle est l\'arme préférée de Gintoki Sakata ?',
    options: ['Un katana', 'Un sabre en bois (bokuto)', 'Une lance', 'Des shurikens'],
    correctAnswerIndex: 1,
    explanation: 'Gintoki utilise un bokuto en bois, le "Sabre du Démon du Bois" selon lui.',
    animeSource: 'Gintama',
    category: 'shonen',
    difficulty: 'easy',
    badgeEmoji: '🍡'
  },
  {
    id: 'q_shonen_13',
    question: 'Dans Saint Seiya, quelle constellation protège Seiya ?',
    options: ['Dragon', 'Cygne', 'Pégase', 'Andromède'],
    correctAnswerIndex: 2,
    explanation: 'Seiya est le Chevalier du Pégase, l\'un des 12 chevaliers d\'or d\'Athéna.',
    animeSource: 'Saint Seiya',
    category: 'shonen',
    difficulty: 'easy',
    badgeEmoji: '⭐'
  },
  {
    id: 'q_shonen_14',
    question: 'Dans Yu Yu Hakusho, quel est le nom de la technique signature de Yusuke Urameshi ?',
    options: ['Vague d\'énergie', 'Reigun (Pistolet Spirituel)', 'Explosion démoniaque', 'Frappe du dragon'],
    correctAnswerIndex: 1,
    explanation: 'Yusuke utilise le Reigun, un concentré d\'énergie spirituelle tiré de son doigt.',
    animeSource: 'Yu Yu Hakusho',
    category: 'shonen',
    difficulty: 'medium',
    badgeEmoji: '🔫'
  },
  {
    id: 'q_shonen_15',
    question: 'Dans Rurouni Kenshin, quel est le nom de l\'épée inversée de Kenshin ?',
    options: ['Sakabato', 'Kusanagi', 'Masamune', 'Tsurugi'],
    correctAnswerIndex: 0,
    explanation: 'Le Sakabato est une épée dont le tranchant est à l\'opposé, pour ne pas tuer.',
    animeSource: 'Rurouni Kenshin',
    category: 'shonen',
    difficulty: 'easy',
    badgeEmoji: '🗡️'
  },
  {
    id: 'q_shonen_16',
    question: 'Dans D.Gray-man, quel est le nom de l\'arme d\'Allen Walker ?',
    options: ['Crown Clown', 'Mugen', 'Tsubame Gaeshi', 'Soul Eater'],
    correctAnswerIndex: 0,
    explanation: 'Crown Clown est son Innocence sous forme d\'arme, capable de se transformer.',
    animeSource: 'D.Gray-man',
    category: 'shonen',
    difficulty: 'medium',
    badgeEmoji: '🎩'
  },
  {
    id: 'q_shonen_17',
    question: 'Dans Toriko, quel est le rêve de Toriko ?',
    options: ['Devenir chef étoilé', 'Créer le menu ultime du monde', 'Trouver le One Piece', 'Devenir Hokage'],
    correctAnswerIndex: 1,
    explanation: 'Toriko veut composer le "Menu Complet" le plus délicieux du monde.',
    animeSource: 'Toriko',
    category: 'shonen',
    difficulty: 'easy',
    badgeEmoji: '🍖'
  },
  {
    id: 'q_shonen_18',
    question: 'Dans Hitman Reborn, quel est le nom du nuage de Vongola de Gokudera ?',
    options: ['Guren', 'Sistema C.A.I.', 'Abaddon', 'Fiamma'],
    correctAnswerIndex: 1,
    explanation: 'Le Sistema C.A.I. est le système d\'armes de Gokudera, basé sur la météo du nuage.',
    animeSource: 'Hitman Reborn',
    category: 'shonen',
    difficulty: 'hard',
    badgeEmoji: '☁️'
  },
  {
    id: 'q_shonen_19',
    question: 'Dans Beelzebub, qui est le roi des enfers confié à Oga ?',
    options: ['Beelzebub', 'Lucifer', 'Mephisto', 'Asmodeus'],
    correctAnswerIndex: 0,
    explanation: 'Beelzebub IV, le bébé démon, est confié à Oga Tatsumi.',
    animeSource: 'Beelzebub',
    category: 'shonen',
    difficulty: 'easy',
    badgeEmoji: '👶'
  },
  {
    id: 'q_shonen_20',
    question: 'Dans Katekyo Hitman Reborn, quel est le nom du tueur le plus fort de Vongola ?',
    options: ['Lambo', 'Hibari Kyouya', 'Reborn', 'Xanxus'],
    correctAnswerIndex: 3,
    explanation: 'Xanxus est le chef de la Varia et l\'un des tueurs les plus redoutables.',
    animeSource: 'Katekyo Hitman Reborn',
    category: 'shonen',
    difficulty: 'medium',
    badgeEmoji: '🔫'
  },

  // ============================================================
  // SEINEN & DARK FANTASY (20 questions)
  // ============================================================
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
    explanation: 'La Dragonslayer (Fend-Dragon) forgée par Godot est une énorme masse de fer trop lourde pour être appelée une épée normale.',
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
  {
    id: 'q_seinen_5',
    question: 'Dans Vagabond, quel est le vrai nom de Musashi Miyamoto ?',
    options: ['Shinmen Takezo', 'Sasaki Kojiro', 'Yagyu Jubei', 'Hattori Hanzo'],
    correctAnswerIndex: 0,
    explanation: 'Musashi Miyamoto est né sous le nom de Shinmen Takezo avant de devenir le plus grand épéiste du Japon.',
    animeSource: 'Vagabond',
    category: 'seinen',
    difficulty: 'medium',
    badgeEmoji: '⚔️'
  },
  {
    id: 'q_seinen_6',
    question: 'Dans Vinland Saga, quel est le rêve de Thorfinn ?',
    options: ['Devenir roi', 'Fonder Vinland (le paradis)', 'Venger son père', 'Devenir le plus fort'],
    correctAnswerIndex: 2,
    explanation: 'Thorfinn cherche à venger son père Thors avant de trouver un chemin de paix.',
    animeSource: 'Vinland Saga',
    category: 'seinen',
    difficulty: 'easy',
    badgeEmoji: '🌾'
  },
  {
    id: 'q_seinen_7',
    question: 'Dans Monster, quel est le nom du tueur en série poursuivi par le Dr Tenma ?',
    options: ['Johan Liebert', 'Roberto', 'Lunge', 'Grimmer'],
    correctAnswerIndex: 0,
    explanation: 'Johan Liebert est le manipulateur et tueur en série que Tenma doit arrêter.',
    animeSource: 'Monster',
    category: 'seinen',
    difficulty: 'medium',
    badgeEmoji: '🕵️'
  },
  {
    id: 'q_seinen_8',
    question: 'Dans Paranoia Agent, quel est le nom du jeune agresseur mystérieux ?',
    options: ['Shonen Bat', 'Lil\' Slugger', 'Le Fantôme', 'Le Masque'],
    correctAnswerIndex: 1,
    explanation: 'Lil\' Slugger est l\'agresseur mystérieux qui frappe les gens avec une batte de baseball.',
    animeSource: 'Paranoia Agent',
    category: 'seinen',
    difficulty: 'hard',
    badgeEmoji: '⚾'
  },
  {
    id: 'q_seinen_9',
    question: 'Dans Elfen Lied, quel est le nom de la jeune fille à la puissance télékinétique ?',
    options: ['Lucy', 'Nana', 'Mayu', 'Kouta'],
    correctAnswerIndex: 0,
    explanation: 'Lucy est la Diclonius à la puissance destructrice et à la personnalité multiple.',
    animeSource: 'Elfen Lied',
    category: 'seinen',
    difficulty: 'easy',
    badgeEmoji: '🧬'
  },
  {
    id: 'q_seinen_10',
    question: 'Dans Hellsing, quel est le nom du vampire au service du Hellsing ?',
    options: ['Alucard', 'Seras Victoria', 'Integra', 'Anderson'],
    correctAnswerIndex: 0,
    explanation: 'Alucard (Dracula à l\'envers) est le puissant vampire du Hellsing.',
    animeSource: 'Hellsing',
    category: 'seinen',
    difficulty: 'easy',
    badgeEmoji: '🦇'
  },
  {
    id: 'q_seinen_11',
    question: 'Dans Ghost in the Shell, quel est le nom du cyborg protagoniste ?',
    options: ['Motoko Kusanagi', 'Batou', 'Togusa', 'Aramaki'],
    correctAnswerIndex: 0,
    explanation: 'Motoko Kusanagi est le cyborg de la Section 9, expert en guerre cybernétique.',
    animeSource: 'Ghost in the Shell',
    category: 'seinen',
    difficulty: 'medium',
    badgeEmoji: '💻'
  },
  {
    id: 'q_seinen_12',
    question: 'Dans Cowboy Bebop, quel est le passé de Spike Spiegel ?',
    options: ['Ancien flic', 'Ancien membre du Syndicat', 'Ancien soldat', 'Ancien pirate'],
    correctAnswerIndex: 1,
    explanation: 'Spike était un membre du Syndicat de la pègre avant de devenir chasseur de primes.',
    animeSource: 'Cowboy Bebop',
    category: 'seinen',
    difficulty: 'easy',
    badgeEmoji: '🚀'
  },
  {
    id: 'q_seinen_13',
    question: 'Dans Black Lagoon, quel est le nom du navire de Rock ?',
    options: ['Black Lagoon', 'Black Pearl', 'Flying Dutchman', 'Millennium Falcon'],
    correctAnswerIndex: 0,
    explanation: 'Le Black Lagoon est le bateau torpilleur du groupe de mercenaires de Rock.',
    animeSource: 'Black Lagoon',
    category: 'seinen',
    difficulty: 'easy',
    badgeEmoji: '🚢'
  },
  {
    id: 'q_seinen_14',
    question: 'Dans Gungrave, quel est le nom du meilleur ami de Brandon Heat ?',
    options: ['Harry MacDowell', 'Big Daddy', 'Bunji Kugashira', 'Blood War'],
    correctAnswerIndex: 0,
    explanation: 'Harry MacDowell est le meilleur ami de Brandon Heat, qui devient son ennemi.',
    animeSource: 'Gungrave',
    category: 'seinen',
    difficulty: 'hard',
    badgeEmoji: '🔫'
  },
  {
    id: 'q_seinen_15',
    question: 'Dans Texhnolyze, quel est le nom du cyborg sans jambes ?',
    options: ['Ichise', 'Onishi', 'Yoshii', 'Ran'],
    correctAnswerIndex: 0,
    explanation: 'Ichise est le boxeur devenu cyborg après avoir perdu ses jambes dans un combat.',
    animeSource: 'Texhnolyze',
    category: 'seinen',
    difficulty: 'hard',
    badgeEmoji: '🤖'
  },
  {
    id: 'q_seinen_16',
    question: 'Dans Ergo Proxy, quel est le nom de la ville-dôme protégée ?',
    options: ['Romdo', 'Moscow', 'Paris', 'Tokyo'],
    correctAnswerIndex: 0,
    explanation: 'Romdo est la cité-dôme utopique où vivent les humains dans Ergo Proxy.',
    animeSource: 'Ergo Proxy',
    category: 'seinen',
    difficulty: 'medium',
    badgeEmoji: '🌆'
  },
  {
    id: 'q_seinen_17',
    question: 'Dans Serial Experiments Lain, quel est le monde parallèle exploré par Lain ?',
    options: ['Le Wired', 'La Matrice', 'Le Netsphere', 'Le Cyberspace'],
    correctAnswerIndex: 0,
    explanation: 'Le Wired est le réseau virtuel dans lequel Lain explore et perd peu à peu la frontière avec la réalité.',
    animeSource: 'Serial Experiments Lain',
    category: 'seinen',
    difficulty: 'hard',
    badgeEmoji: '💾'
  },
  {
    id: 'q_seinen_18',
    question: 'Dans Perfect Blue, quel est le métier de Mima Kirigoe ?',
    options: ['Actrice', 'Chanteuse idol', 'Mannequin', 'Danseuse'],
    correctAnswerIndex: 0,
    explanation: 'Mima est une chanteuse idol qui se tourne vers le cinéma et plonge dans la folie.',
    animeSource: 'Perfect Blue',
    category: 'seinen',
    difficulty: 'medium',
    badgeEmoji: '🎤'
  },
  {
    id: 'q_seinen_19',
    question: 'Dans Paprika, quel est le nom du chercheur capable de pénétrer les rêves ?',
    options: ['Paprika', 'Atsuko Chiba', 'Detective Konakawa', 'Dr. Shima'],
    correctAnswerIndex: 1,
    explanation: 'Atsuko Chiba utilise son alter ego "Paprika" pour explorer les rêves des gens.',
    animeSource: 'Paprika',
    category: 'seinen',
    difficulty: 'medium',
    badgeEmoji: '🌌'
  },
  {
    id: 'q_seinen_20',
    question: 'Dans Millennium Actress, quel est le nom de l\'actrice qui cherche un homme mystérieux ?',
    options: ['Chiyoko Fujiwara', 'Tachibana', 'Genya', 'Haruko'],
    correctAnswerIndex: 0,
    explanation: 'Chiyoko Fujiwara est l\'actrice légendaire qui a cherché toute sa vie un homme qu\'elle avait aidé.',
    animeSource: 'Millennium Actress',
    category: 'seinen',
    difficulty: 'medium',
    badgeEmoji: '🎬'
  },

  // ============================================================
  // ISEKAI & POWER FANTASY (20 questions)
  // ============================================================
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
  {
    id: 'q_isekai_4',
    question: 'Dans Overlord, quel est le nom du tombeau d\'Ainz Ooal Gown ?',
    options: ['Nazarick', 'E-Rantel', 'Yggdrasil', 'Ainzheim'],
    correctAnswerIndex: 0,
    explanation: 'Le Grand Tombeau de Nazarick est la forteresse souterraine d\'Ainz Ooal Gown.',
    animeSource: 'Overlord',
    category: 'isekai',
    difficulty: 'easy',
    badgeEmoji: '💀'
  },
  {
    id: 'q_isekai_5',
    question: 'Dans Konosuba, quel est le nom de la déesse paresseuse qui accompagne Kazuma ?',
    options: ['Aqua', 'Megumin', 'Darkness', 'Eris'],
    correctAnswerIndex: 0,
    explanation: 'Aqua est la déesse de l\'eau, mais elle est aussi paresseuse et inutile selon Kazuma.',
    animeSource: 'Konosuba',
    category: 'isekai',
    difficulty: 'easy',
    badgeEmoji: '💧'
  },
  {
    id: 'q_isekai_6',
    question: 'Dans The Rising of the Shield Hero, quel est le nom du bouclier de Naofumi ?',
    options: ['Bouclier de la Rage', 'Bouclier Légendaire', 'Bouclier d\'Acier', 'Bouclier du Phénix'],
    correctAnswerIndex: 1,
    explanation: 'Naofumi manie le Bouclier Légendaire, l\'une des quatre armes cardinales.',
    animeSource: 'Shield Hero',
    category: 'isekai',
    difficulty: 'easy',
    badgeEmoji: '🛡️'
  },
  {
    id: 'q_isekai_7',
    question: 'Dans Mushoku Tensei, quel est le nom de naissance de Rudeus Greyrat ?',
    options: ['Rudeus', 'Roxy', 'Paul', 'Sylphy'],
    correctAnswerIndex: 0,
    explanation: 'Rudeus Greyrat est le nom du protagoniste réincarné dans ce monde de fantasy.',
    animeSource: 'Mushoku Tensei',
    category: 'isekai',
    difficulty: 'easy',
    badgeEmoji: '📚'
  },
  {
    id: 'q_isekai_8',
    question: 'Dans No Game No Life, quel est le nom de la paire de frère et sœur ?',
    options: ['Sora & Shiro', 'Naruto & Hinata', 'Kirito & Asuna', 'Rimuru & Veldora'],
    correctAnswerIndex: 0,
    explanation: 'Sora et Shiro sont les frère et sœur invincibles aux jeux, transportés à Disboard.',
    animeSource: 'No Game No Life',
    category: 'isekai',
    difficulty: 'easy',
    badgeEmoji: '🎮'
  },
  {
    id: 'q_isekai_9',
    question: 'Dans The Saga of Tanya the Evil, quel est le nom de la jeune magicienne soldat ?',
    options: ['Tanya von Degurechaff', 'Visha', 'Rerugen', 'Loria'],
    correctAnswerIndex: 0,
    explanation: 'Tanya Degurechaff est une magicienne de l\'empire, réincarnation d\'un salarié japonais.',
    animeSource: 'Saga of Tanya the Evil',
    category: 'isekai',
    difficulty: 'medium',
    badgeEmoji: '✈️'
  },
  {
    id: 'q_isekai_10',
    question: 'Dans Gate, quel est le nom du portail reliant le monde moderne au monde magique ?',
    options: ['The Gate', 'Portal', 'Dim Bridge', 'Alnus'],
    correctAnswerIndex: 0,
    explanation: 'Le "Gate" est le portail apparu à Tokyo vers un monde de fantasy.',
    animeSource: 'Gate',
    category: 'isekai',
    difficulty: 'easy',
    badgeEmoji: '🚪'
  },
  {
    id: 'q_isekai_11',
    question: 'Dans Log Horizon, quel est le nom de la guilde de Shiroe ?',
    options: ['Log Horizon', 'Crescent Moon', 'D.D.D.', 'Soul Eater'],
    correctAnswerIndex: 0,
    explanation: 'Shiroe crée la guilde Log Horizon pour conquérir ce nouveau monde de jeu.',
    animeSource: 'Log Horizon',
    category: 'isekai',
    difficulty: 'medium',
    badgeEmoji: '🧙'
  },
  {
    id: 'q_isekai_12',
    question: 'Dans .hack//Sign, quel est le nom du personnage bloqué dans le jeu ?',
    options: ['Tsukasa', 'Kite', 'BlackRose', 'Haseo'],
    correctAnswerIndex: 0,
    explanation: 'Tsukasa est un joueur piégé dans le MMORPG The World, sans pouvoir se déconnecter.',
    animeSource: '.hack//Sign',
    category: 'isekai',
    difficulty: 'medium',
    badgeEmoji: '💻'
  },
  {
    id: 'q_isekai_13',
    question: 'Dans Sword Art Online, quel est le nom du jeu où Kirito est bloqué ?',
    options: ['Sword Art Online', 'ALO', 'GGO', 'Underworld'],
    correctAnswerIndex: 0,
    explanation: 'Kirito est l\'un des 10 000 joueurs bloqués dans SAO, le jeu de réalité virtuelle mortel.',
    animeSource: 'Sword Art Online',
    category: 'isekai',
    difficulty: 'easy',
    badgeEmoji: '⚔️'
  },
  {
    id: 'q_isekai_14',
    question: 'Dans Accel World, quel est le nom du programme d\'accélération du cerveau ?',
    options: ['Brain Burst', 'Accel Link', 'Neuro Linker', 'Accel World'],
    correctAnswerIndex: 0,
    explanation: 'Brain Burst est le jeu qui permet d\'accélérer le temps pour les combats virtuels.',
    animeSource: 'Accel World',
    category: 'isekai',
    difficulty: 'medium',
    badgeEmoji: '⚡'
  },
  {
    id: 'q_isekai_15',
    question: 'Dans The Devil is a Part-Timer!, quel est le vrai nom du roi démon ?',
    options: ['Sadao Maou', 'Yusa Emi', 'Lucifer', 'Beelzebub'],
    correctAnswerIndex: 0,
    explanation: 'Sadao Maou est le roi démon qui s\'enfuit dans le monde moderne et travaille au McRonald.',
    animeSource: 'Devil is a Part-Timer',
    category: 'isekai',
    difficulty: 'easy',
    badgeEmoji: '🍔'
  },
  {
    id: 'q_isekai_16',
    question: 'Dans Re:Creators, quel est le nom de la fille qui vient de son anime dans la réalité ?',
    options: ['Selesia Upitiria', 'Meteora', 'Altair', 'Alicetaria'],
    correctAnswerIndex: 0,
    explanation: 'Selesia Upitiria est un personnage d\'anime transporté dans le monde réel.',
    animeSource: 'Re:Creators',
    category: 'isekai',
    difficulty: 'medium',
    badgeEmoji: '🎨'
  },
  {
    id: 'q_isekai_17',
    question: 'Dans Grimgar of Fantasy and Ash, quel est le nom du groupe de Haruhiro ?',
    options: ['L\'Escouade de l\'Aube', 'Les Parias', 'Les Guerriers de Grimgar', 'La Légion des Ombres'],
    correctAnswerIndex: 0,
    explanation: 'Haruhiro et ses amis forment l\'Escouade de l\'Aube, un groupe de mercenaires débutants.',
    animeSource: 'Grimgar',
    category: 'isekai',
    difficulty: 'medium',
    badgeEmoji: '🏹'
  },
  {
    id: 'q_isekai_18',
    question: 'Dans Cautious Hero, quelle est la particularité de Seiya Ryuuguuin ?',
    options: ['Il est extrêmement prudent', 'Il est le plus fort', 'Il est immortel', 'Il est diabolique'],
    correctAnswerIndex: 0,
    explanation: 'Seiya est un héros tellement prudent qu\'il s\'entraîne à mort avant chaque combat.',
    animeSource: 'Cautious Hero',
    category: 'isekai',
    difficulty: 'easy',
    badgeEmoji: '🛡️'
  },
  {
    id: 'q_isekai_19',
    question: 'Dans Isekai Quartet, quel est le crossover qui réunit plusieurs héros ?',
    options: ['Konosuba, Overlord, Re:Zero, Shield Hero', 'SAO, Log Horizon, Gate', 'Naruto, One Piece, Bleach', 'Dragon Ball, One Punch Man'],
    correctAnswerIndex: 0,
    explanation: 'Isekai Quartet réunit les héros de Konosuba, Overlord, Re:Zero et Shield Hero dans un chibi school.',
    animeSource: 'Isekai Quartet',
    category: 'isekai',
    difficulty: 'easy',
    badgeEmoji: '🏫'
  },
  {
    id: 'q_isekai_20',
    question: 'Dans How Not to Summon a Demon Lord, quel est le nom du joueur réincarné ?',
    options: ['Takuma Sakamoto', 'Diablo', 'Krebskulm', 'Remia'],
    correctAnswerIndex: 1,
    explanation: 'Diablo est le nom de jeu de Takuma Sakamoto, un joueur invoqué comme Seigneur Démon.',
    animeSource: 'How Not to Summon a Demon Lord',
    category: 'isekai',
    difficulty: 'easy',
    badgeEmoji: '😈'
  },

  // ============================================================
  // QUOTES & CULTURE (20 questions)
  // ============================================================
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
  {
    id: 'q_quote_3',
    question: 'À quel anime appartient la citation : "Je crois en le dieu de la mort." ?',
    options: ['Death Note', 'Berserk', 'Hellsing', 'Tokyo Ghoul'],
    correctAnswerIndex: 0,
    explanation: 'Light Yagami déclare cette phrase en devenant Kira, le justicier du Death Note.',
    animeSource: 'Death Note',
    category: 'quotes',
    difficulty: 'easy',
    badgeEmoji: '📝'
  },
  {
    id: 'q_quote_4',
    question: 'Qui a dit : "Le monde n\'est pas parfait, mais il est merveilleux." ?',
    options: ['Eren Yeager', 'Monkey D. Luffy', 'Naruto Uzumaki', 'Gon Freecss'],
    correctAnswerIndex: 2,
    explanation: 'Naruto Uzumaki prononce cette phrase avec sa philosophie d\'espoir.',
    animeSource: 'Naruto',
    category: 'quotes',
    difficulty: 'easy',
    badgeEmoji: '🍥'
  },
  {
    id: 'q_quote_5',
    question: 'À quel anime appartient la citation : "Je n\'ai aucun regret, c\'est le seul chemin que j\'ai choisi." ?',
    options: ['Code Geass', 'Attack on Titan', 'Death Note', 'Berserk'],
    correctAnswerIndex: 0,
    explanation: 'Lelouch Lamperouge assume ses choix avec cette phrase dans Code Geass.',
    animeSource: 'Code Geass',
    category: 'quotes',
    difficulty: 'easy',
    badgeEmoji: '♠️'
  },
  {
    id: 'q_quote_6',
    question: 'Qui dit : "La seule chose que je sais, c\'est que je ne sais rien." ?',
    options: ['Saitama', 'Gintoki', 'Kenshin', 'Gojo'],
    correctAnswerIndex: 2,
    explanation: 'Kenshin Himura, le samouraï errant, a une philosophie empreinte d\'humilité.',
    animeSource: 'Rurouni Kenshin',
    category: 'quotes',
    difficulty: 'medium',
    badgeEmoji: '🌅'
  },
  {
    id: 'q_quote_7',
    question: 'Qui a dit : "Les larmes qu\'on verse ne sont pas celles qu\'on voit." ?',
    options: ['Kurama (Naruto)', 'Jiraiya', 'Itachi', 'Kakashi'],
    correctAnswerIndex: 2,
    explanation: 'Itachi Uchiwa, dans Naruto, révèle la profondeur de sa souffrance avec cette citation.',
    animeSource: 'Naruto Shippuden',
    category: 'quotes',
    difficulty: 'medium',
    badgeEmoji: '🍥'
  },
  {
    id: 'q_quote_8',
    question: 'À quel anime appartient : "Le pouvoir de la volonté est plus fort que le pouvoir du corps." ?',
    options: ['Mob Psycho 100', 'One Punch Man', 'Dragon Ball', 'Hunter x Hunter'],
    correctAnswerIndex: 0,
    explanation: 'Mob, dans Mob Psycho 100, montre que l\'esprit dépasse le corps.',
    animeSource: 'Mob Psycho 100',
    category: 'quotes',
    difficulty: 'medium',
    badgeEmoji: '🧠'
  },
  {
    id: 'q_quote_9',
    question: 'Qui a dit : "La paix est un mensonge, il n\'y a que la passion." ?',
    options: ['Maka (Soul Eater)', 'Kira (Death Note)', 'L (Death Note)', 'Suzaku (Code Geass)'],
    correctAnswerIndex: 0,
    explanation: 'Cette phrase est prononcée par Maka dans Soul Eater.',
    animeSource: 'Soul Eater',
    category: 'quotes',
    difficulty: 'hard',
    badgeEmoji: '💀'
  },
  {
    id: 'q_quote_10',
    question: 'À quel anime appartient la citation : "Je ne me battrai jamais pour les autres, je me bats pour moi." ?',
    options: ['Fairy Tail', 'Soul Eater', 'Jujutsu Kaisen', 'One Punch Man'],
    correctAnswerIndex: 2,
    explanation: 'Sukuna (et parfois Gojo) dans Jujutsu Kaisen incarnent cette philosophie égoïste.',
    animeSource: 'Jujutsu Kaisen',
    category: 'quotes',
    difficulty: 'medium',
    badgeEmoji: '👹'
  },
  {
    id: 'q_quote_11',
    question: 'Quel personnage dit : "Si tu n\'as pas le courage de changer les choses, subis-les." ?',
    options: ['Eren Yeager', 'Light Yagami', 'Lelouch', 'Guts'],
    correctAnswerIndex: 0,
    explanation: 'Eren Yeager pousse ses camarades à agir dans l\'univers impitoyable d\'AOT.',
    animeSource: 'Attack on Titan',
    category: 'quotes',
    difficulty: 'easy',
    badgeEmoji: '🔪'
  },
  {
    id: 'q_quote_12',
    question: 'À quel anime appartient la citation : "Le temps ne fait pas disparaître les douleurs." ?',
    options: ['Naruto', 'Fullmetal Alchemist', 'Death Note', 'Blue Exorcist'],
    correctAnswerIndex: 1,
    explanation: 'Edward Elric, dans Fullmetal Alchemist, livre cette réflexion sur la perte.',
    animeSource: 'Fullmetal Alchemist',
    category: 'quotes',
    difficulty: 'medium',
    badgeEmoji: '⚙️'
  },
  {
    id: 'q_quote_13',
    question: 'Qui dit : "Tout le monde a un prix à payer." ?',
    options: ['Lelouch', 'Eren', 'Naruto', 'Luffy'],
    correctAnswerIndex: 0,
    explanation: 'Lelouch Lamperouge dans Code Geass, évoquant le sacrifice pour le changement.',
    animeSource: 'Code Geass',
    category: 'quotes',
    difficulty: 'easy',
    badgeEmoji: '♠️'
  },
  {
    id: 'q_quote_14',
    question: 'Quelle phrase de Ryuk est iconique ?',
    options: ['Je suis un dieu de la mort.', 'Le monde est une pomme.', 'La vie est un jeu.', 'Je m\'ennuie.'],
    correctAnswerIndex: 0,
    explanation: 'Ryuk se présente souvent avec cette phrase, rappelant sa nature de Shinigami.',
    animeSource: 'Death Note',
    category: 'quotes',
    difficulty: 'easy',
    badgeEmoji: '🍎'
  },
  {
    id: 'q_quote_15',
    question: 'À quel anime appartient : "Les humains sont faibles, mais ils sont beaux." ?',
    options: ['Kuroshitsuji', 'Tokyo Ghoul', 'Attack on Titan', 'Berserk'],
    correctAnswerIndex: 1,
    explanation: 'Cette réflexion vient de l\'univers poétique et tragique de Tokyo Ghoul.',
    animeSource: 'Tokyo Ghoul',
    category: 'quotes',
    difficulty: 'medium',
    badgeEmoji: '☕'
  },
  {
    id: 'q_quote_16',
    question: 'Qui a dit : "Le plus grand ennemi de l\'homme, c\'est sa propre peur." ?',
    options: ['Kenshin', 'Guts', 'Naruto', 'Luffy'],
    correctAnswerIndex: 0,
    explanation: 'Kenshin Himura partage cette sagesse avec ses alliés.',
    animeSource: 'Rurouni Kenshin',
    category: 'quotes',
    difficulty: 'easy',
    badgeEmoji: '🌸'
  },
  {
    id: 'q_quote_17',
    question: 'À quel anime appartient : "La vie n\'a pas de sens, c\'est à toi de lui en donner un." ?',
    options: ['Naruto', 'Mob Psycho 100', 'One Piece', 'Shingeki no Kyojin'],
    correctAnswerIndex: 1,
    explanation: 'Mob Psycho 100 pousse ses personnages à trouver leur propre chemin.',
    animeSource: 'Mob Psycho 100',
    category: 'quotes',
    difficulty: 'easy',
    badgeEmoji: '🧠'
  },
  {
    id: 'q_quote_18',
    question: 'Qui dit : "Je n\'ai pas besoin d\'amis, j\'ai besoin de pouvoir." ?',
    options: ['Sasuke Uchiwa', 'Killua', 'Kurapika', 'Yagami Light'],
    correctAnswerIndex: 0,
    explanation: 'Sasuke, dans sa quête de vengeance, rejette les liens amicaux.',
    animeSource: 'Naruto',
    category: 'quotes',
    difficulty: 'easy',
    badgeEmoji: '🍅'
  },
  {
    id: 'q_quote_19',
    question: 'À quel anime appartient la citation : "Le courage est la seule arme contre la peur." ?',
    options: ['Fairy Tail', 'Black Clover', 'My Hero Academia', 'One Piece'],
    correctAnswerIndex: 0,
    explanation: 'Fairy Tail célèbre le courage de ses membres contre toutes les menaces.',
    animeSource: 'Fairy Tail',
    category: 'quotes',
    difficulty: 'easy',
    badgeEmoji: '🔥'
  },
  {
    id: 'q_quote_20',
    question: 'Qui a dit : "Ce qui est important, c\'est la façon dont on vit, pas combien de temps." ?',
    options: ['Ace (One Piece)', 'Whitebeard', 'Shanks', 'Roger'],
    correctAnswerIndex: 0,
    explanation: 'Ace, juste avant de mourir, transmet ce message à Luffy dans One Piece.',
    animeSource: 'One Piece',
    category: 'quotes',
    difficulty: 'easy',
    badgeEmoji: '🔥'
  },

  // ============================================================
  // HARDCORE TRIVIA (20 questions)
  // ============================================================
  {
    id: 'q_hardcore_1',
    question: 'Dans Fullmetal Alchemist Brotherhood, quelle est la règle numéro 1 de l\'Échange Équivalent ?',
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
  },
  {
    id: 'q_hardcore_3',
    question: 'Quel est le nom du premier dieu de la mort vu dans Death Note ?',
    options: ['Ryuk', 'Rem', 'Gelus', 'L'],
    correctAnswerIndex: 0,
    explanation: 'Ryuk est le premier Shinigami à apparaître, attiré par l\'ennui.',
    animeSource: 'Death Note',
    category: 'hardcore',
    difficulty: 'easy',
    badgeEmoji: '🍎'
  },
  {
    id: 'q_hardcore_4',
    question: 'Dans Bleach, quel est le nom de la banque de Ichigo Kurosaki ?',
    options: ['Tensa Zangetsu', 'Senbonsakura Kageyoshi', 'Daiguren Hyorinmaru', 'Kyouka Suigetsu'],
    correctAnswerIndex: 0,
    explanation: 'La banque de Ichigo est Tensa Zangetsu, la lune céleste tranchante.',
    animeSource: 'Bleach',
    category: 'hardcore',
    difficulty: 'medium',
    badgeEmoji: '⚔️'
  },
  {
    id: 'q_hardcore_5',
    question: 'Dans One Piece, quel est le nom du câble utilisé par les Marines pour traverser la Calm Belt ?',
    options: ['Seastone', 'Poneglyph', 'Kairoseki', 'Seastone Coating'],
    correctAnswerIndex: 0,
    explanation: 'Le Seastone est un matériau qui neutralise les pouvoirs des fruits du démon.',
    animeSource: 'One Piece',
    category: 'hardcore',
    difficulty: 'hard',
    badgeEmoji: '🏴‍☠️'
  },
  {
    id: 'q_hardcore_6',
    question: 'Dans Hunter x Hunter, quel est le vrai nom de Hisoka ?',
    options: ['Hisoka Morow', 'Razor', 'Chrollo', 'Illumi'],
    correctAnswerIndex: 0,
    explanation: 'Hisoka Morow est le nom complet du magicien sadique.',
    animeSource: 'Hunter x Hunter',
    category: 'hardcore',
    difficulty: 'medium',
    badgeEmoji: '🃏'
  },
  {
    id: 'q_hardcore_7',
    question: 'Dans Jujutsu Kaisen, quel est le nom du domaine imbriqué de Megumi ?',
    options: ['Jardin de l\'Ombre', 'Chimera Shadow Garden', 'Prison Realm', 'Void of Shadows'],
    correctAnswerIndex: 1,
    explanation: 'Le Chimera Shadow Garden est l\'extension de territoire de Megumi Fushiguro.',
    animeSource: 'Jujutsu Kaisen',
    category: 'hardcore',
    difficulty: 'hard',
    badgeEmoji: '🌑'
  },
  {
    id: 'q_hardcore_8',
    question: 'Dans Attack on Titan, quel est le nom du père adoptif de Mikasa ?',
    options: ['Eren Yeager', 'Grisha Yeager', 'Shiganshina', 'Zeke'],
    correctAnswerIndex: 1,
    explanation: 'Grisha Yeager est le père adoptif de Mikasa après avoir sauvé sa famille.',
    animeSource: 'Attack on Titan',
    category: 'hardcore',
    difficulty: 'easy',
    badgeEmoji: '🧣'
  },
  {
    id: 'q_hardcore_9',
    question: 'Dans Berserk, quel est le nom du groupe de mercenaires de Guts ?',
    options: ['La Troupe du Faucon', 'La Bande du Hibou', 'Les Vautours', 'Les Fils de la Guerre'],
    correctAnswerIndex: 0,
    explanation: 'Guts a rejoint la Troupe du Faucon de Griffith avant de la quitter.',
    animeSource: 'Berserk',
    category: 'hardcore',
    difficulty: 'medium',
    badgeEmoji: '🦅'
  },
  {
    id: 'q_hardcore_10',
    question: 'Dans Naruto, quel est le nom du père de Sasuke ?',
    options: ['Fugaku Uchiwa', 'Itachi Uchiwa', 'Madara Uchiwa', 'Obito Uchiwa'],
    correctAnswerIndex: 0,
    explanation: 'Fugaku Uchiwa est le père de Sasuke et l\'ancien chef du clan Uchiwa.',
    animeSource: 'Naruto',
    category: 'hardcore',
    difficulty: 'easy',
    badgeEmoji: '🍅'
  },
  {
    id: 'q_hardcore_11',
    question: 'Dans Dragon Ball, quel est le nom du père de Goku ?',
    options: ['Bardock', 'King Vegeta', 'Nappa', 'Raditz'],
    correctAnswerIndex: 0,
    explanation: 'Bardock est le père de Goku, un Saiyan de classe inférieure.',
    animeSource: 'Dragon Ball',
    category: 'hardcore',
    difficulty: 'easy',
    badgeEmoji: '🐉'
  },
  {
    id: 'q_hardcore_12',
    question: 'Dans Fairy Tail, quel est le nom du père de Natsu ?',
    options: ['Igneel', 'Atlas Flame', 'Zirconis', 'Grandeeney'],
    correctAnswerIndex: 0,
    explanation: 'Igneel est le dragon qui a élevé et appris le Fire Dragon Slayer Magic à Natsu.',
    animeSource: 'Fairy Tail',
    category: 'hardcore',
    difficulty: 'easy',
    badgeEmoji: '🐉'
  },
  {
    id: 'q_hardcore_13',
    question: 'Dans My Hero Academia, quel est le nom du professeur de classe 1-B ?',
    options: ['Vlad King', 'Aizawa', 'All Might', 'Present Mic'],
    correctAnswerIndex: 0,
    explanation: 'Vlad King est le professeur de la classe 1-B, rival de Shota Aizawa.',
    animeSource: 'My Hero Academia',
    category: 'hardcore',
    difficulty: 'medium',
    badgeEmoji: '🩸'
  },
  {
    id: 'q_hardcore_14',
    question: 'Dans Demon Slayer, quel est le nom de la sœur de Tanjiro ?',
    options: ['Nezuko Kamado', 'Mitsuri', 'Kanao', 'Shinobu'],
    correctAnswerIndex: 0,
    explanation: 'Nezuko Kamado est la petite sœur de Tanjiro, transformée en démon.',
    animeSource: 'Demon Slayer',
    category: 'hardcore',
    difficulty: 'easy',
    badgeEmoji: '🌸'
  },
  {
    id: 'q_hardcore_15',
    question: 'Dans Black Clover, quel est le nom du premier Magicien Empereur ?',
    options: ['Lumiere Silvamillion', 'Julius Novachrono', 'Asta', 'Yuno'],
    correctAnswerIndex: 0,
    explanation: 'Lumiere Silvamillion est le premier Magicien Empereur du royaume de Clover.',
    animeSource: 'Black Clover',
    category: 'hardcore',
    difficulty: 'hard',
    badgeEmoji: '👑'
  },
  {
    id: 'q_hardcore_16',
    question: 'Dans Code Geass, quel est le nom du père de Lelouch ?',
    options: ['Charles zi Britannia', 'Clovis', 'Schneizel', 'Suzaku'],
    correctAnswerIndex: 0,
    explanation: 'Charles zi Britannia est l\'empereur de Britannia et le père de Lelouch et Nunnally.',
    animeSource: 'Code Geass',
    category: 'hardcore',
    difficulty: 'easy',
    badgeEmoji: '♠️'
  },
  {
    id: 'q_hardcore_17',
    question: 'Dans Gintama, quel est le nom de l\'épéiste rival de Gintoki ?',
    options: ['Katsura Kotarou', 'Takasugi Shinsuke', 'Sakamoto Tatsuma', 'Madao'],
    correctAnswerIndex: 0,
    explanation: 'Katsura Kotarou est un ancien camarade de Gintoki et un chef rebelle.',
    animeSource: 'Gintama',
    category: 'hardcore',
    difficulty: 'medium',
    badgeEmoji: '🍡'
  },
  {
    id: 'q_hardcore_18',
    question: 'Dans Soul Eater, quel est le nom du dieu de la folie ?',
    options: ['Asura', 'Lord Death', 'Black Star', 'Kid'],
    correctAnswerIndex: 0,
    explanation: 'Asura est le dieu de la folie, enfermé dans le Death City.',
    animeSource: 'Soul Eater',
    category: 'hardcore',
    difficulty: 'hard',
    badgeEmoji: '💀'
  },
  {
    id: 'q_hardcore_19',
    question: 'Dans Hellsing, quel est le nom du prêtre vampire ennemi d\'Alucard ?',
    options: ['Alexander Anderson', 'Enrico Maxwell', 'Rip Van Winkle', 'Captain'],
    correctAnswerIndex: 0,
    explanation: 'Anderson est un prêtre de l\'Iscariote, un ennemi redoutable d\'Alucard.',
    animeSource: 'Hellsing',
    category: 'hardcore',
    difficulty: 'medium',
    badgeEmoji: '✝️'
  },
  {
    id: 'q_hardcore_20',
    question: 'Dans Cowboy Bebop, quel est le nom du vaisseau de Spike ?',
    options: ['Swordfish II', 'Bebop', 'Red Tail', 'Hammerhead'],
    correctAnswerIndex: 0,
    explanation: 'Le Swordfish II est le chasseur spatial de Spike Spiegel.',
    animeSource: 'Cowboy Bebop',
    category: 'hardcore',
    difficulty: 'easy',
    badgeEmoji: '🚀'
  },

  // ============================================================
  // MECHA (10 questions)
  // ============================================================
  {
    id: 'q_mecha_1',
    question: 'Dans Evangelion, quel est le nom de l\'organisation qui combat les Anges ?',
    options: ['NERV', 'SEELE', 'WILLE', 'UNIT'],
    correctAnswerIndex: 0,
    explanation: 'NERV est l\'organisation paramilitaire chargée de combattre les Anges avec les Evangelion.',
    animeSource: 'Evangelion',
    category: 'mecha',
    difficulty: 'easy',
    badgeEmoji: '⚡'
  },
  {
    id: 'q_mecha_2',
    question: 'Dans Gundam, quel est le nom du premier Mobile Suit de Amuro Ray ?',
    options: ['RX-78-2 Gundam', 'Zaku', 'Gouf', 'Guntank'],
    correctAnswerIndex: 0,
    explanation: 'Le RX-78-2 Gundam est le prototype de la Fédération piloté par Amuro Ray.',
    animeSource: 'Mobile Suit Gundam',
    category: 'mecha',
    difficulty: 'medium',
    badgeEmoji: '🤖'
  },
  {
    id: 'q_mecha_3',
    question: 'Dans Code Geass, quel est le nom du Knightmare de Lelouch ?',
    options: ['Gawain', 'Shinkiro', 'Lancelot', 'Guren Mk-II'],
    correctAnswerIndex: 1,
    explanation: 'Le Shinkiro est le Knightmare personnel de Lelouch, après le Gawain.',
    animeSource: 'Code Geass',
    category: 'mecha',
    difficulty: 'medium',
    badgeEmoji: '♠️'
  },
  {
    id: 'q_mecha_4',
    question: 'Dans Gurren Lagann, quel est le nom du robot de Simon ?',
    options: ['Gurren Lagann', 'Lagann', 'Gurren', 'Arc Gurren'],
    correctAnswerIndex: 0,
    explanation: 'Gurren Lagann est la fusion de Lagann et de Gurren, le robot iconique de Simon.',
    animeSource: 'Gurren Lagann',
    category: 'mecha',
    difficulty: 'easy',
    badgeEmoji: '🔥'
  },
  {
    id: 'q_mecha_5',
    question: 'Dans Eureka Seven, quel est le nom du LFO de Renton ?',
    options: ['Nirvash typeZERO', 'Gekko', 'Rafale', 'Terminus'],
    correctAnswerIndex: 0,
    explanation: 'Le Nirvash typeZERO est le LFO surpuissant piloté par Renton.',
    animeSource: 'Eureka Seven',
    category: 'mecha',
    difficulty: 'medium',
    badgeEmoji: '🌊'
  },
  {
    id: 'q_mecha_6',
    question: 'Dans The Big O, quel est le nom du robot de Roger Smith ?',
    options: ['Big O', 'Big Duo', 'Big Fau', 'Big Venus'],
    correctAnswerIndex: 0,
    explanation: 'Big O est le mécha géant de Roger Smith, un négociateur dans une ville dystopique.',
    animeSource: 'The Big O',
    category: 'mecha',
    difficulty: 'hard',
    badgeEmoji: '🏙️'
  },
  {
    id: 'q_mecha_7',
    question: 'Dans Full Metal Panic!, quel est le nom du robot de Sousuke Sagara ?',
    options: ['AS-1 Blaze Raven', 'M9 Gernsback', 'ARX-7 Arbalest', 'Laevatein'],
    correctAnswerIndex: 2,
    explanation: 'L\'ARX-7 Arbalest est le robot de Sousuke, avec un système lambda driver.',
    animeSource: 'Full Metal Panic!',
    category: 'mecha',
    difficulty: 'medium',
    badgeEmoji: '🔫'
  },
  {
    id: 'q_mecha_8',
    question: 'Dans Patlabor, quel est le nom de l\'unité de police mécanisée ?',
    options: ['SV2', 'Zero Division', 'Gundam Unit', 'Lancelot Division'],
    correctAnswerIndex: 0,
    explanation: 'La SV2 est l\'unité spéciale de police qui utilise les Patlabor.',
    animeSource: 'Patlabor',
    category: 'mecha',
    difficulty: 'hard',
    badgeEmoji: '👮'
  },
  {
    id: 'q_mecha_9',
    question: 'Dans Brave Series, quel est le nom du robot principal de Gaogaigar ?',
    options: ['Gaogaigar', 'Star Gaogaigar', 'Galeon', 'Genesic'],
    correctAnswerIndex: 0,
    explanation: 'Gaogaigar est le robot combiné de la série Brave, piloté par Guy.',
    animeSource: 'Gaogaigar',
    category: 'mecha',
    difficulty: 'hard',
    badgeEmoji: '⭐'
  },
  {
    id: 'q_mecha_10',
    question: 'Dans Zone of the Enders, quel est le nom du robot de Jehuty ?',
    options: ['Jehuty', 'Anubis', 'Dolores', 'Idolo'],
    correctAnswerIndex: 0,
    explanation: 'Jehuty est l\'Orbital Frame piloté par Leo Stenbuck.',
    animeSource: 'Zone of the Enders',
    category: 'mecha',
    difficulty: 'hard',
    badgeEmoji: '🪐'
  },

  // ============================================================
  // MAGICAL GIRL (10 questions)
  // ============================================================
  {
    id: 'q_magical_1',
    question: 'Dans Sailor Moon, quel est le nom de la transformation de Usagi ?',
    options: ['Moon Prism Power', 'Moon Crystal Power', 'Moon Gorgeous Meditation', 'Starlight Honeymoon'],
    correctAnswerIndex: 0,
    explanation: 'La transformation classique de Sailor Moon est Moon Prism Power, Make Up.',
    animeSource: 'Sailor Moon',
    category: 'magical_girl',
    difficulty: 'easy',
    badgeEmoji: '🌙'
  },
  {
    id: 'q_magical_2',
    question: 'Dans Cardcaptor Sakura, quel est le nom du booker de Sakura ?',
    options: ['Kero-chan', 'Yue', 'Ruby Moon', 'Clow Reed'],
    correctAnswerIndex: 0,
    explanation: 'Kero-chan est le gardien du livre de Clow qui accompagne Sakura.',
    animeSource: 'Cardcaptor Sakura',
    category: 'magical_girl',
    difficulty: 'easy',
    badgeEmoji: '🃏'
  },
  {
    id: 'q_magical_3',
    question: 'Dans Madoka Magica, quel est le nom de la créature qui offre des vœux ?',
    options: ['Kyubey', 'QB', 'Incubator', 'All of the above'],
    correctAnswerIndex: 3,
    explanation: 'Kyubey est aussi appelé QB ou Incubator, une créature extraterrestre.',
    animeSource: 'Madoka Magica',
    category: 'magical_girl',
    difficulty: 'easy',
    badgeEmoji: '🐱'
  },
  {
    id: 'q_magical_4',
    question: 'Dans Little Witch Academia, quel est le nom de la sorcière maladroite ?',
    options: ['Akko Kagari', 'Diana Cavendish', 'Sucy Manbavaran', 'Lotte Jansson'],
    correctAnswerIndex: 0,
    explanation: 'Akko Kagari est l\'apprentie sorcière maladroite mais passionnée de la Luna Nova.',
    animeSource: 'Little Witch Academia',
    category: 'magical_girl',
    difficulty: 'easy',
    badgeEmoji: '🧙'
  },
  {
    id: 'q_magical_5',
    question: 'Dans Magic Knight Rayearth, quel est le nom du chevalier d\'Hikaru ?',
    options: ['Rayearth', 'Windam', 'Ceres', 'Sword of Light'],
    correctAnswerIndex: 0,
    explanation: 'Rayearth est le robot/massue de Hikaru, le chevalier du feu.',
    animeSource: 'Magic Knight Rayearth',
    category: 'magical_girl',
    difficulty: 'medium',
    badgeEmoji: '⚔️'
  },
  {
    id: 'q_magical_6',
    question: 'Dans Princess Tutu, quel est le nom du canard qui devient la princesse ?',
    options: ['Ahiru', 'Drosselmeyer', 'Mytho', 'Rue'],
    correctAnswerIndex: 0,
    explanation: 'Ahiru est une cane qui se transforme en Princesse Tutu pour sauver le prince.',
    animeSource: 'Princess Tutu',
    category: 'magical_girl',
    difficulty: 'hard',
    badgeEmoji: '🦆'
  },
  {
    id: 'q_magical_7',
    question: 'Dans Utena, quel est le nom du duel pour la Rose ?',
    options: ['Rose Duel', 'Duel de la Rose Noire', 'Duel des Roses', 'Duel de la Rose Écarlate'],
    correctAnswerIndex: 0,
    explanation: 'Les duels de la Rose Écarlate déterminent le propriétaire de la Rose et la fiancée du prince.',
    animeSource: 'Utena',
    category: 'magical_girl',
    difficulty: 'medium',
    badgeEmoji: '🌹'
  },
  {
    id: 'q_magical_8',
    question: 'Dans Kill la Kill, quel est le nom du uniforme de Ryuko ?',
    options: ['Senketsu', 'Junketsu', 'Satsuki', 'Scissor Blade'],
    correctAnswerIndex: 0,
    explanation: 'Senketsu est le uniforme de combat de Ryuko, qui lui donne des pouvoirs.',
    animeSource: 'Kill la Kill',
    category: 'magical_girl',
    difficulty: 'easy',
    badgeEmoji: '✂️'
  },
  {
    id: 'q_magical_9',
    question: 'Dans Symphogear, quel est le nom de l\'arme de Hibiki ?',
    options: ['Gungnir', 'Ame no Habakiri', 'Ichaival', 'Brisingamen'],
    correctAnswerIndex: 0,
    explanation: 'Gungnir est l\'arme de Hibiki, qui se transforme en gantelet.',
    animeSource: 'Symphogear',
    category: 'magical_girl',
    difficulty: 'hard',
    badgeEmoji: '🎤'
  },
  {
    id: 'q_magical_10',
    question: 'Dans Nanoha, quel est le nom de la jeune mage de la 3e division ?',
    options: ['Nanoha Takamachi', 'Fate Testarossa', 'Hayate Yagami', 'Subaru Nakajima'],
    correctAnswerIndex: 0,
    explanation: 'Nanoha Takamachi est la protagoniste de la série Magical Girl Lyrical Nanoha.',
    animeSource: 'Nanoha',
    category: 'magical_girl',
    difficulty: 'easy',
    badgeEmoji: '💫'
  },

  // ============================================================
  // SLICE OF LIFE / COMEDY (10 questions)
  // ============================================================
  {
    id: 'q_slice_1',
    question: 'Dans K-On!, quel est le nom de la guilde du club de musique ?',
    options: ['After School Tea Time', 'Pop Tea', 'Rythm', 'Fugue'],
    correctAnswerIndex: 0,
    explanation: 'Le groupe de musique de K-On! s\'appelle After School Tea Time.',
    animeSource: 'K-On!',
    category: 'slice_of_life',
    difficulty: 'easy',
    badgeEmoji: '🎸'
  },
  {
    id: 'q_slice_2',
    question: 'Dans Lucky Star, quel est le nom de la famille de Konata ?',
    options: ['Hiiragi', 'Izumi', 'Narita', 'Takano'],
    correctAnswerIndex: 0,
    explanation: 'Konata Izumi est une otaku qui vit avec son père.',
    animeSource: 'Lucky Star',
    category: 'slice_of_life',
    difficulty: 'easy',
    badgeEmoji: '⭐'
  },
  {
    id: 'q_slice_3',
    question: 'Dans Nichijou, quel est le nom du professeur robot ?',
    options: ['Nano', 'Professor', 'Hakase', 'Mai'],
    correctAnswerIndex: 0,
    explanation: 'Nano est la robot créée par Hakase, la petite scientifique.',
    animeSource: 'Nichijou',
    category: 'slice_of_life',
    difficulty: 'hard',
    badgeEmoji: '🤖'
  },
  {
    id: 'q_slice_4',
    question: 'Dans Azumanga Daioh, quel est le nom de la professeure de sport ?',
    options: ['Miss Yukari', 'Miss Kurosawa', 'Miss Sakaki', 'Miss Chiyo'],
    correctAnswerIndex: 0,
    explanation: 'Yukari Tanizaki est la professeure de sport excentrique.',
    animeSource: 'Azumanga Daioh',
    category: 'slice_of_life',
    difficulty: 'medium',
    badgeEmoji: '🏃'
  },
  {
    id: 'q_slice_5',
    question: 'Dans Ouran High School Host Club, quel est le nom du club d\'hôtes ?',
    options: ['Ouran Host Club', 'Music Club', 'Literature Club', 'Tea Club'],
    correctAnswerIndex: 0,
    explanation: 'Le club d\'hôtes de Ouran accueille les clientes avec élégance.',
    animeSource: 'Ouran High School Host Club',
    category: 'slice_of_life',
    difficulty: 'easy',
    badgeEmoji: '🌸'
  },
  {
    id: 'q_slice_6',
    question: 'Dans Barakamon, quel est le nom du calligraphe exilé ?',
    options: ['Seishu Handa', 'Naru', 'Kawafuji', 'Yasushi'],
    correctAnswerIndex: 0,
    explanation: 'Seishu Handa est le calligraphe envoyé sur une île pour se recentrer.',
    animeSource: 'Barakamon',
    category: 'slice_of_life',
    difficulty: 'easy',
    badgeEmoji: '🖌️'
  },
  {
    id: 'q_slice_7',
    question: 'Dans Hyouka, quel est le nom du club de recherche ?',
    options: ['Classics Club', 'Science Club', 'Literature Club', 'Art Club'],
    correctAnswerIndex: 0,
    explanation: 'Le Classics Club résout des mystères dans leur lycée.',
    animeSource: 'Hyouka',
    category: 'slice_of_life',
    difficulty: 'medium',
    badgeEmoji: '📚'
  },
  {
    id: 'q_slice_8',
    question: 'Dans Non Non Biyori, quel est le nom du village rural ?',
    options: ['Asahigaoka', 'Honoka', 'Miyako', 'Yamabe'],
    correctAnswerIndex: 0,
    explanation: 'Asahigaoka est le village paisible de la campagne japonaise.',
    animeSource: 'Non Non Biyori',
    category: 'slice_of_life',
    difficulty: 'medium',
    badgeEmoji: '🌾'
  },
  {
    id: 'q_slice_9',
    question: 'Dans Sakurasou, quel est le nom de la résidence pour élèves ?',
    options: ['Sakurasou', 'Sakura Dorm', 'Cherry Blossom House', 'Sakura House'],
    correctAnswerIndex: 0,
    explanation: 'Sakurasou est le dortoir des artistes excentriques.',
    animeSource: 'Sakurasou',
    category: 'slice_of_life',
    difficulty: 'easy',
    badgeEmoji: '🌸'
  },
  {
    id: 'q_slice_10',
    question: 'Dans Toradora!, quel est le nom de la petite tyran ?',
    options: ['Taiga Aisaka', 'Minori Kushieda', 'Ami Kawashima', 'Yasuko Takasu'],
    correctAnswerIndex: 0,
    explanation: 'Taiga Aisaka est la "petite tigre" du lycée.',
    animeSource: 'Toradora!',
    category: 'slice_of_life',
    difficulty: 'easy',
    badgeEmoji: '🐯'
  },

  // ============================================================
  // SPORTS (10 questions)
  // ============================================================
  {
    id: 'q_sports_1',
    question: 'Dans Haikyuu!!, quel est le nom du lycée de Hinata et Kageyama ?',
    options: ['Karasuno', 'Nekoma', 'Seijoh', 'Fukurodani'],
    correctAnswerIndex: 0,
    explanation: 'Karasuno est le lycée des corbeaux, où évoluent les protagonistes de Haikyuu!!.',
    animeSource: 'Haikyuu!!',
    category: 'sports',
    difficulty: 'easy',
    badgeEmoji: '🏐'
  },
  {
    id: 'q_sports_2',
    question: 'Dans Kuroko no Basket, quel est le nom du générateur de passes de Kuroko ?',
    options: ['Misdirection', 'Passing', 'Phantom Shot', 'None'],
    correctAnswerIndex: 0,
    explanation: 'Kuroko utilise la Misdirection pour rendre ses passes invisibles.',
    animeSource: 'Kuroko no Basket',
    category: 'sports',
    difficulty: 'easy',
    badgeEmoji: '🏀'
  },
  {
    id: 'q_sports_3',
    question: 'Dans Hajime no Ippo, quel est le nom du boxeur pro d\'Ippo ?',
    options: ['Ippo Makunouchi', 'Miyata Ichiro', 'Takamura Mamoru', 'Aoki Masaru'],
    correctAnswerIndex: 0,
    explanation: 'Ippo Makunouchi est le protagoniste boxeur au dempsey roll.',
    animeSource: 'Hajime no Ippo',
    category: 'sports',
    difficulty: 'easy',
    badgeEmoji: '🥊'
  },
  {
    id: 'q_sports_4',
    question: 'Dans Captain Tsubasa, quel est le nom du génie du football japonais ?',
    options: ['Tsubasa Ozora', 'Kojiro Hyuga', 'Genzo Wakabayashi', 'Misaki Taro'],
    correctAnswerIndex: 0,
    explanation: 'Tsubasa Ozora est le héros du football japonais, avec son "Drive Shot".',
    animeSource: 'Captain Tsubasa',
    category: 'sports',
    difficulty: 'easy',
    badgeEmoji: '⚽'
  },
  {
    id: 'q_sports_5',
    question: 'Dans Inazuma Eleven, quel est le nom du club de football de Raimon ?',
    options: ['Raimon', 'Inazuma', 'Endou', 'Goalkeeper'],
    correctAnswerIndex: 0,
    explanation: 'Raimon est le club de football du collège de Mark Evans.',
    animeSource: 'Inazuma Eleven',
    category: 'sports',
    difficulty: 'easy',
    badgeEmoji: '⚽'
  },
  {
    id: 'q_sports_6',
    question: 'Dans Free!, quel est le nom du lycée d\'Haruka Nanase ?',
    options: ['Iwatobi', 'Samezuka', 'Hidaka', 'Fukuoka'],
    correctAnswerIndex: 0,
    explanation: 'Iwatobi est le lycée où Haruka et ses amis nagent en compétition.',
    animeSource: 'Free!',
    category: 'sports',
    difficulty: 'easy',
    badgeEmoji: '🏊'
  },
  {
    id: 'q_sports_7',
    question: 'Dans Ping Pong: The Animation, quel est le nom du génie du ping-pong ?',
    options: ['Peco', 'Smile', 'Dragon', 'China'],
    correctAnswerIndex: 0,
    explanation: 'Peco est le joueur de ping-pong surdoué, mais arrogant.',
    animeSource: 'Ping Pong',
    category: 'sports',
    difficulty: 'medium',
    badgeEmoji: '🏓'
  },
  {
    id: 'q_sports_8',
    question: 'Dans Eyeshield 21, quel est le nom du running back de Deimon ?',
    options: ['Sena Kobayakawa', 'Monta', 'Rui', 'Kurita'],
    correctAnswerIndex: 0,
    explanation: 'Sena Kobayakawa est le running back rapide sous le nom d\'Eyeshield 21.',
    animeSource: 'Eyeshield 21',
    category: 'sports',
    difficulty: 'medium',
    badgeEmoji: '🏈'
  },
  {
    id: 'q_sports_9',
    question: 'Dans Yowamushi Pedal, quel est le nom du lycée de Onoda ?',
    options: ['Sohoku', 'Hakone', 'Kyoto', 'Fukutomi'],
    correctAnswerIndex: 0,
    explanation: 'Sohoku est le lycée de cyclisme où Onoda révèle son talent.',
    animeSource: 'Yowamushi Pedal',
    category: 'sports',
    difficulty: 'easy',
    badgeEmoji: '🚴'
  },
  {
    id: 'q_sports_10',
    question: 'Dans Baby Steps, quel est le nom du joueur de tennis perfectionniste ?',
    options: ['Eiichiro Maruo', 'Natsu', 'Takuma', 'Araya'],
    correctAnswerIndex: 0,
    explanation: 'Eiichiro Maruo est un lycéen qui se lance dans le tennis avec une approche analytique.',
    animeSource: 'Baby Steps',
    category: 'sports',
    difficulty: 'medium',
    badgeEmoji: '🎾'
  },

  // ============================================================
  // THRILLER / MYSTERY (10 questions)
  // ============================================================
  {
    id: 'q_thriller_1',
    question: 'Dans Detective Conan, quel est le nom du détective lycéen ?',
    options: ['Shinichi Kudo', 'Conan Edogawa', 'Heiji Hattori', 'Kaito Kid'],
    correctAnswerIndex: 0,
    explanation: 'Shinichi Kudo est le détective lycéen, transformé en Conan Edogawa.',
    animeSource: 'Detective Conan',
    category: 'thriller',
    difficulty: 'easy',
    badgeEmoji: '🕵️'
  },
  {
    id: 'q_thriller_2',
    question: 'Dans Monster, quel est le nom de l\'organisation que poursuit le Dr Tenma ?',
    options: ['Baby', 'Kinderheim 511', 'The Organization', 'The Institute'],
    correctAnswerIndex: 1,
    explanation: 'Kinderheim 511 est l\'orphelinat expérimental où Johan a été formé.',
    animeSource: 'Monster',
    category: 'thriller',
    difficulty: 'hard',
    badgeEmoji: '🕵️'
  },
  {
    id: 'q_thriller_3',
    question: 'Dans Erased, quel est le nom du protagoniste qui voyage dans le temps ?',
    options: ['Satoru Fujinuma', 'Kayoko', 'Kazuki', 'Mashiro'],
    correctAnswerIndex: 0,
    explanation: 'Satoru Fujinuma est le mangaka qui revit son enfance pour sauver sa classe.',
    animeSource: 'Erased',
    category: 'thriller',
    difficulty: 'easy',
    badgeEmoji: '🕰️'
  },
  {
    id: 'q_thriller_4',
    question: 'Dans Steins;Gate, quel est le nom du laboratoire d\'Okabe ?',
    options: ['Future Gadget Lab', 'SERN', 'Labo 1', 'Divergence Lab'],
    correctAnswerIndex: 0,
    explanation: 'Le Future Gadget Lab est le repaire d\'Okabe Rintaro et de ses amis.',
    animeSource: 'Steins;Gate',
    category: 'thriller',
    difficulty: 'easy',
    badgeEmoji: '🔬'
  },
  {
    id: 'q_thriller_5',
    question: 'Dans Death Note, quel est le vrai nom de L ?',
    options: ['L Lawliet', 'Light Yagami', 'Mello', 'Near'],
    correctAnswerIndex: 0,
    explanation: 'L Lawliet est le détective mondialement reconnu qui traque Kira.',
    animeSource: 'Death Note',
    category: 'thriller',
    difficulty: 'medium',
    badgeEmoji: '🔍'
  },
  {
    id: 'q_thriller_6',
    question: 'Dans Paranoia Agent, quel est le nom du chien de la série ?',
    options: ['Maromi', 'Lil\' Slugger', 'Pochi', 'Chibi'],
    correctAnswerIndex: 0,
    explanation: 'Maromi est un chien en peluche qui devient une icône dans Paranoia Agent.',
    animeSource: 'Paranoia Agent',
    category: 'thriller',
    difficulty: 'hard',
    badgeEmoji: '🐕'
  },
  {
    id: 'q_thriller_7',
    question: 'Dans Boogiepop Phantom, quel est le nom du phénomène qui tue les gens ?',
    options: ['Boogiepop', 'Manticore', 'Reaper', 'Shinigami'],
    correctAnswerIndex: 0,
    explanation: 'Boogiepop est un phénomène surnaturel qui élimine les menaces dans la ville.',
    animeSource: 'Boogiepop Phantom',
    category: 'thriller',
    difficulty: 'hard',
    badgeEmoji: '👻'
  },
  {
    id: 'q_thriller_8',
    question: 'Dans Another, quel est le nom du collège maudit de la classe 3-3 ?',
    options: ['Yomiyama North', 'Yomiyama South', 'Aogiri', 'Sakura'],
    correctAnswerIndex: 0,
    explanation: 'La classe 3-3 de Yomiyama North est hantée par une malédiction depuis 1972.',
    animeSource: 'Another',
    category: 'thriller',
    difficulty: 'medium',
    badgeEmoji: '🏫'
  },
  {
    id: 'q_thriller_9',
    question: 'Dans Higurashi, quel est le nom du village où se déroule la tragédie ?',
    options: ['Hinamizawa', 'Kazamino', 'Tochigi', 'Mishima'],
    correctAnswerIndex: 0,
    explanation: 'Hinamizawa est le petit village où se répète une tragédie en juin.',
    animeSource: 'Higurashi',
    category: 'thriller',
    difficulty: 'easy',
    badgeEmoji: '🌲'
  },
  {
    id: 'q_thriller_10',
    question: 'Dans Corpse Party, quel est le nom de l\'école hantée ?',
    options: ['Tenjin Elementary', 'Kisaragi Academy', 'Hakurei Shrine', 'Yomogi High'],
    correctAnswerIndex: 0,
    explanation: 'L\'école Tenjin Elementary est le théâtre des événements horrifiques de Corpse Party.',
    animeSource: 'Corpse Party',
    category: 'thriller',
    difficulty: 'hard',
    badgeEmoji: '🏚️'
  },

  // ============================================================
  // ROMANCE (10 questions)
  // ============================================================
  {
    id: 'q_romance_1',
    question: 'Dans Nisekoi, quel est le nom de la clé du médaillon de Raku ?',
    options: ['Clé de la promesse', 'Clé de l\'amour', 'Clé d\'or', 'Clé du destin'],
    correctAnswerIndex: 0,
    explanation: 'La clé de la promesse est l\'objet central du mystère de Nisekoi.',
    animeSource: 'Nisekoi',
    category: 'romance',
    difficulty: 'easy',
    badgeEmoji: '🔑'
  },
  {
    id: 'q_romance_2',
    question: 'Dans Golden Time, quel est le nom de la jeune amnésique ?',
    options: ['Kouko Kaga', 'Linda', 'Mitsuo', 'Banri'],
    correctAnswerIndex: 0,
    explanation: 'Kouko Kaga est l\'héroïne amnésique de Golden Time.',
    animeSource: 'Golden Time',
    category: 'romance',
    difficulty: 'medium',
    badgeEmoji: '⏳'
  },
  {
    id: 'q_romance_3',
    question: 'Dans My Teen Romantic Comedy SNAFU, quel est le nom du club des services ?',
    options: ['Service Club', 'Literature Club', 'Student Council', 'Tea Club'],
    correctAnswerIndex: 0,
    explanation: 'Le Service Club aide les élèves à résoudre leurs problèmes relationnels.',
    animeSource: 'Oregairu',
    category: 'romance',
    difficulty: 'easy',
    badgeEmoji: '📝'
  },
  {
    id: 'q_romance_4',
    question: 'Dans Clannad, quel est le nom de la fille qui aime le pain ?',
    options: ['Fuuko', 'Nagisa', 'Tomoyo', 'Kyou'],
    correctAnswerIndex: 0,
    explanation: 'Fuuko est la fille qui essaie de cuisiner du pain pour sa sœur.',
    animeSource: 'Clannad',
    category: 'romance',
    difficulty: 'easy',
    badgeEmoji: '🍞'
  },
  {
    id: 'q_romance_5',
    question: 'Dans Toradora!, quel est le nom du président du conseil étudiant ?',
    options: ['Taiga Aisaka', 'Ryuuji Takasu', 'Minori Kushieda', 'Ami Kawashima'],
    correctAnswerIndex: 0,
    explanation: 'Taiga Aisaka est la petite tyran, mais pas présidente.',
    animeSource: 'Toradora!',
    category: 'romance',
    difficulty: 'easy',
    badgeEmoji: '🐯'
  },
  {
    id: 'q_romance_6',
    question: 'Dans Kimi ni Todoke, quel est le nom de la fille timide ?',
    options: ['Sawako Kuronuma', 'Ayane Yano', 'Chizuru Yoshida', 'Kazehaya'],
    correctAnswerIndex: 0,
    explanation: 'Sawako Kuronuma est la fille timide surnommée "Sadako".',
    animeSource: 'Kimi ni Todoke',
    category: 'romance',
    difficulty: 'easy',
    badgeEmoji: '🌸'
  },
  {
    id: 'q_romance_7',
    question: 'Dans Kaguya-sama: Love is War, quel est le nom du président de Shuchiin ?',
    options: ['Miyuki Shirogane', 'Kaguya Shinomiya', 'Chika Fujiwara', 'Yu Ishigami'],
    correctAnswerIndex: 0,
    explanation: 'Miyuki Shirogane est le président du conseil étudiant de Shuchiin.',
    animeSource: 'Kaguya-sama',
    category: 'romance',
    difficulty: 'easy',
    badgeEmoji: '❤️'
  },
  {
    id: 'q_romance_8',
    question: 'Dans Fruits Basket, quel est le nom du clan maudit par la bête ?',
    options: ['Sohma', 'Honda', 'Yuki', 'Kyo'],
    correctAnswerIndex: 0,
    explanation: 'Le clan Sohma est maudit par les esprits du zodiaque chinois.',
    animeSource: 'Fruits Basket',
    category: 'romance',
    difficulty: 'easy',
    badgeEmoji: '🐱'
  },
  {
    id: 'q_romance_9',
    question: 'Dans Love, Chunibyo & Other Delusions, quel est le nom du personnage chunibyo ?',
    options: ['Yuta Togashi', 'Rikka Takanashi', 'Sanae Dekomori', 'Shinka Nibutani'],
    correctAnswerIndex: 0,
    explanation: 'Yuta Togashi a une chunibyo, mais Rikka en a une plus forte.',
    animeSource: 'Chunibyo',
    category: 'romance',
    difficulty: 'easy',
    badgeEmoji: '👁️'
  },
  {
    id: 'q_romance_10',
    question: 'Dans Horimiya, quel est le nom du couple principal ?',
    options: ['Hori & Miyamura', 'Ishikawa & Yoshikawa', 'Remi & Sengoku', 'Sakura & Kakeru'],
    correctAnswerIndex: 0,
    explanation: 'Hori et Miyamura forment le couple central de cette romance lycéenne.',
    animeSource: 'Horimiya',
    category: 'romance',
    difficulty: 'easy',
    badgeEmoji: '❤️'
  },

  // ============================================================
  // HISTORICAL / SAMURAI (10 questions)
  // ============================================================
  {
    id: 'q_historical_1',
    question: 'Dans Rurouni Kenshin, à quelle époque se déroule l\'histoire ?',
    options: ['Ère Edo', 'Ère Meiji', 'Ère Taisho', 'Ère Showa'],
    correctAnswerIndex: 1,
    explanation: 'L\'histoire se déroule à l\'ère Meiji, une période de modernisation du Japon.',
    animeSource: 'Rurouni Kenshin',
    category: 'historical',
    difficulty: 'easy',
    badgeEmoji: '🌸'
  },
  {
    id: 'q_historical_2',
    question: 'Dans Samurai Champloo, quel est le nom du samouraï vagabond ?',
    options: ['Mugen', 'Jin', 'Fuu', 'Kariya'],
    correctAnswerIndex: 0,
    explanation: 'Mugen est un samouraï errant au style de combat sauvage.',
    animeSource: 'Samurai Champloo',
    category: 'historical',
    difficulty: 'easy',
    badgeEmoji: '⚔️'
  },
  {
    id: 'q_historical_3',
    question: 'Dans Shigurui, quel est le nom du dojo des épéistes ?',
    options: ['Dojo Kogan', 'Dojo Yagyu', 'Dojo Itto', 'Dojo Shinkage'],
    correctAnswerIndex: 0,
    explanation: 'Le dojo Kogan est un dojo impitoyable où les duels sont sanglants.',
    animeSource: 'Shigurui',
    category: 'historical',
    difficulty: 'hard',
    badgeEmoji: '🗡️'
  },
  {
    id: 'q_historical_4',
    question: 'Dans Peacemaker Kurogane, quel est le nom du jeune samouraï ?',
    options: ['Tetsunosuke Ichimura', 'Okita Souji', 'Hijikata Toshizo', 'Saito Hajime'],
    correctAnswerIndex: 0,
    explanation: 'Tetsunosuke est un jeune samouraï qui rejoint le Shinsengumi.',
    animeSource: 'Peacemaker Kurogane',
    category: 'historical',
    difficulty: 'medium',
    badgeEmoji: '⚔️'
  },
  {
    id: 'q_historical_5',
    question: 'Dans Onihei, quel est le nom du chef de la police criminelle ?',
    options: ['Heizou Hasegawa', 'Katsuragi', 'Matsudaira', 'Nishikiori'],
    correctAnswerIndex: 0,
    explanation: 'Heizou Hasegawa est le chef de la police criminelle à l\'ère Edo.',
    animeSource: 'Onihei',
    category: 'historical',
    difficulty: 'hard',
    badgeEmoji: '👮'
  },
  {
    id: 'q_historical_6',
    question: 'Dans House of Five Leaves, quel est le nom de la bande de kidnappeurs ?',
    options: ['Five Leaves', 'Shinsengumi', 'Oniwabanshu', 'Kuroko'],
    correctAnswerIndex: 0,
    explanation: 'Les "Cinq Feuilles" sont une bande de kidnappeurs à l\'ère Edo.',
    animeSource: 'House of Five Leaves',
    category: 'historical',
    difficulty: 'medium',
    badgeEmoji: '🍃'
  },
  {
    id: 'q_historical_7',
    question: 'Dans Saraiya Goyou, quel est le nom du chef de la bande ?',
    options: ['Yaichi', 'Masa', 'Rin', 'Saki'],
    correctAnswerIndex: 0,
    explanation: 'Yaichi est le chef du groupe de kidnappeurs "Saraiya Goyou".',
    animeSource: 'Saraiya Goyou',
    category: 'historical',
    difficulty: 'hard',
    badgeEmoji: '🌙'
  },
  {
    id: 'q_historical_8',
    question: 'Dans Shouwa Genroku Rakugo Shinjuu, quel est le nom de l\'artiste de rakugo ?',
    options: ['Yotaro', 'Kikuhiko', 'Konatsu', 'Sukeroku'],
    correctAnswerIndex: 1,
    explanation: 'Kikuhiko est un artiste de rakugo maître de la tradition.',
    animeSource: 'Rakugo',
    category: 'historical',
    difficulty: 'medium',
    badgeEmoji: '🎭'
  },
  {
    id: 'q_historical_9',
    question: 'Dans Blade of the Immortal, quel est le nom du samouraï immortel ?',
    options: ['Manji', 'Rin', 'Kagimura', 'Shira'],
    correctAnswerIndex: 0,
    explanation: 'Manji est un samouraï immortel qui cherche à briser sa malédiction.',
    animeSource: 'Blade of the Immortal',
    category: 'historical',
    difficulty: 'medium',
    badgeEmoji: '🩸'
  },
  {
    id: 'q_historical_10',
    question: 'Dans Hyakunin Isshu, quel est le nom du poème médiéval ?',
    options: ['Hyakunin Isshu', 'Tanka', 'Haiku', 'Waka'],
    correctAnswerIndex: 0,
    explanation: 'Le Hyakunin Isshu est un recueil de 100 poèmes classiques japonais.',
    animeSource: 'Chihayafuru',
    category: 'historical',
    difficulty: 'easy',
    badgeEmoji: '📜'
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