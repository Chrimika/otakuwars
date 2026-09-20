export interface OtakuTestQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export const OTAKU_TEST_QUESTIONS: OtakuTestQuestion[] = [
  {
    id: 'ot1',
    question: 'Que signifie "Nakama" ?',
    options: ['Ennemi juré', 'Ami / compagnon proche', 'Maître d’arts martiaux', 'Un type de ramen'],
    correctIndex: 1,
  },
  {
    id: 'ot2',
    question: 'Dans quel anime crie-t-on "Plus Ultra" ?',
    options: ['Naruto', 'My Hero Academia', 'Demon Slayer', 'Bleach'],
    correctIndex: 1,
  },
  {
    id: 'ot3',
    question: 'Un "Shonen" cible en priorité quel public ?',
    options: ['Jeunes adultes matures', 'Jeunes garçons', 'Jeunes filles', 'Adultes seinen'],
    correctIndex: 1,
  },
  {
    id: 'ot4',
    question: 'Que signifie "Senpai" ?',
    options: ['Un aîné / une personne plus expérimentée', 'Un ennemi', 'Un plat traditionnel', 'Un professeur d\'arts martiaux'],
    correctIndex: 0,
  },
  {
    id: 'ot5',
    question: 'Dans One Piece, comment s\'appelle le protagoniste principal ?',
    options: ['Zoro', 'Sanji', 'Luffy', 'Ussop'],
    correctIndex: 2,
  },
  {
    id: 'ot6',
    question: 'Que veut dire "Isekai" ?',
    options: ['Un monde parallèle / autre monde', 'Un combat final', 'Un pouvoir spécial', 'Une école de ninja'],
    correctIndex: 0,
  },
  {
    id: 'ot7',
    question: 'Dans Naruto, quel est le rêve du héros ?',
    options: ['Devenir pirate', 'Devenir Hokage', 'Devenir chasseur de titans', 'Devenir alchimiste'],
    correctIndex: 1,
  },
  {
    id: 'ot8',
    question: 'Que signifie "Kawaii" ?',
    options: ['Effrayant', 'Mignon', 'Puissant', 'Rapide'],
    correctIndex: 1,
  },
  {
    id: 'ot9',
    question: 'Dans Dragon Ball, quel est le nom de la transformation emblématique de Goku ?',
    options: ['Sharingan', 'Super Saiyan', 'Bankai', 'Titan'],
    correctIndex: 1,
  },
  {
    id: 'ot10',
    question: 'Que signifie "Sensei" ?',
    options: ['Élève', 'Ennemi', 'Professeur / maître', 'Ami d\'enfance'],
    correctIndex: 2,
  },
  {
    id: 'ot11',
    question: 'Dans Death Note, comment s\'appelle le carnet ?',
    options: ['Death Note', 'Life Book', 'Shinigami Note', 'Kill List'],
    correctIndex: 0,
  },
  {
    id: 'ot12',
    question: 'Que signifie "Baka" ?',
    options: ['Génie', 'Idiot', 'Héros', 'Guerrier'],
    correctIndex: 1,
  },
  {
    id: 'ot13',
    question: 'Dans Demon Slayer, quel est le métier des héros ?',
    options: ['Ninjas', 'Pourfendeurs de démons', 'Pirates', 'Chasseurs de titans'],
    correctIndex: 1,
  },
  {
    id: 'ot14',
    question: 'Que signifie "Otaku" à l\'origine au Japon ?',
    options: ['Un passionné (parfois excessif) d\'un sujet, souvent manga/anime', 'Un guerrier légendaire', 'Un plat japonais', 'Un type de kimono'],
    correctIndex: 0,
  },
  {
    id: 'ot15',
    question: 'Dans My Hero Academia, comment appelle-t-on les pouvoirs spéciaux ?',
    options: ['Nen', 'Alter / Quirk', 'Chakra', 'Stand'],
    correctIndex: 1,
  },
];

export function pickRandomQuestions(n: number): OtakuTestQuestion[] {
  const shuffled = [...OTAKU_TEST_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
