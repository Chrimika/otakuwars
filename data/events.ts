export type EventType = 'rencontre' | 'gaming' | 'lecture' | 'concours';

export interface OtakuEvent {
  id: string;
  title: string;
  type: EventType;
  city: string;
  date: string;
  description: string;
}

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  rencontre: 'Rencontre',
  gaming: 'Gaming',
  lecture: 'Lecture',
  concours: 'Concours',
};

export const OTAKU_EVENTS: OtakuEvent[] = [
  {
    id: 'ev1',
    title: 'Otaku Meetup Yaoundé',
    type: 'rencontre',
    city: 'Yaoundé',
    date: '2026-10-04',
    description: 'Rencontre mensuelle des fans d\'anime et manga de la capitale : cosplay libre, quiz surprise et échanges.',
  },
  {
    id: 'ev2',
    title: 'Tournoi Fighting Games',
    type: 'gaming',
    city: 'Douala',
    date: '2026-10-11',
    description: 'Tournoi ouvert sur jeux de combat façon shonen, inscriptions sur place, lots pour le podium.',
  },
  {
    id: 'ev3',
    title: 'Club de lecture Manga Africa',
    type: 'lecture',
    city: 'Bafoussam',
    date: '2026-10-18',
    description: 'Session de lecture collective autour des œuvres de la bibliothèque Otaku Wars.',
  },
  {
    id: 'ev4',
    title: 'Concours Cosplay Régional',
    type: 'concours',
    city: 'Douala',
    date: '2026-11-02',
    description: 'Concours de cosplay ouvert à tous les niveaux, jury communautaire et prix du public.',
  },
  {
    id: 'ev5',
    title: 'Nuit du Quiz Otaku',
    type: 'gaming',
    city: 'Yaoundé',
    date: '2026-11-08',
    description: 'Soirée spéciale quiz multijoueur sur grand écran, en partenariat avec Otaku Wars.',
  },
  {
    id: 'ev6',
    title: 'Rencontre Otaku Bamenda',
    type: 'rencontre',
    city: 'Bamenda',
    date: '2026-11-15',
    description: 'Première rencontre communautaire à Bamenda : présentation de la plateforme et jeux en direct.',
  },
  {
    id: 'ev7',
    title: 'Atelier Dessin Manga',
    type: 'lecture',
    city: 'Kribi',
    date: '2026-11-22',
    description: 'Initiation au dessin façon manga avec des illustrateurs locaux, tous niveaux bienvenus.',
  },
  {
    id: 'ev8',
    title: 'Grand Concours Otaku Wars',
    type: 'concours',
    city: 'Douala',
    date: '2026-12-06',
    description: 'Finale nationale du classement Otaku Wars : les meilleurs joueurs s\'affrontent en direct.',
  },
];
