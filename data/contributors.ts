export interface Contributor {
  name: string;
  role: string;
  bio: string;
  avatarId: string;
  socials: { whatsapp?: string; linkedin?: string; tiktok?: string };
}

export const CONTRIBUTORS: Contributor[] = [
  {
    name: 'Mika MBA',
    role: 'Développeur',
    bio: 'Construit la plateforme et le moteur de quiz en direct.',
    avatarId: 'sorcerer_supreme',
    socials: { linkedin: '#' },
  },
  {
    name: 'Dirane M.',
    role: 'Développeur',
    bio: 'Construit la plateforme et le moteur de quiz en direct.',
    avatarId: 'saiyan_warrior',
    socials: { whatsapp: '#', linkedin: '#' },
  },
];
