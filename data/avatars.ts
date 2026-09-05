import { OtakuAvatar } from '../lib/types';

export const OTAKU_AVATARS: OtakuAvatar[] = [
  {
    id: 'saiyan_warrior',
    name: 'Son Goku SSJ',
    anime: 'Dragon Ball Z',
    badge: '⚡ Super Saiyan',
    title: 'Guerrier Saiyan Légendaire',
    accentColor: '#eab308',
    gradientBg: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <defs>
          <radialGradient id="gokuAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.2"/>
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#gokuAura)" stroke="#fbbf24" stroke-width="2"/>
        <!-- Hair Spikes -->
        <path d="M 50 12 L 40 28 L 30 18 L 32 36 L 18 32 L 28 46 L 14 52 L 28 58 L 22 72 L 36 64 L 42 78 L 50 68 L 58 78 L 64 64 L 78 72 L 72 58 L 86 52 L 72 46 L 82 32 L 68 36 L 70 18 L 60 28 Z" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
        <!-- Face -->
        <polygon points="35,42 65,42 58,74 42,74" fill="#fed7aa"/>
        <!-- Eyes -->
        <polygon points="38,50 47,52 45,56 38,54" fill="#0284c7"/>
        <polygon points="62,50 53,52 55,56 62,54" fill="#0284c7"/>
        <!-- Eyebrows -->
        <polygon points="36,47 48,50 46,45 36,45" fill="#facc15"/>
        <polygon points="64,47 52,50 54,45 64,45" fill="#facc15"/>
        <!-- Mouth -->
        <path d="M 44 65 Q 50 68 56 65" stroke="#7c2d12" stroke-width="2" fill="none"/>
      </svg>
    `
  },
  {
    id: 'ninja_hokage',
    name: 'Naruto Uzumaki',
    anime: 'Naruto Shippuden',
    badge: '🍥 Hokage',
    title: '7ème Hokage de Konoha',
    accentColor: '#f97316',
    gradientBg: 'from-orange-500/20 via-amber-500/10 to-transparent',
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="#7c2d12" opacity="0.3" stroke="#f97316" stroke-width="2"/>
        <!-- Spiky Blond Hair -->
        <path d="M 20 40 L 25 20 L 35 25 L 45 10 L 52 22 L 62 10 L 70 25 L 80 20 L 80 40 Z" fill="#fde047"/>
        <!-- Headband -->
        <rect x="22" y="36" width="56" height="16" rx="3" fill="#1e293b" stroke="#64748b" stroke-width="1.5"/>
        <rect x="36" y="39" width="28" height="10" rx="2" fill="#94a3b8"/>
        <!-- Konoha Spiral -->
        <path d="M 50 44 C 47 42, 45 44, 47 46 C 49 48, 52 46, 50 42" stroke="#0f172a" stroke-width="1.5" fill="none"/>
        <!-- Face -->
        <path d="M 28 50 L 72 50 L 66 80 L 50 86 L 34 80 Z" fill="#ffedd5"/>
        <!-- Whisker marks -->
        <line x1="30" y1="60" x2="40" y2="62" stroke="#ea580c" stroke-width="1.5"/>
        <line x1="30" y1="65" x2="39" y2="66" stroke="#ea580c" stroke-width="1.5"/>
        <line x1="70" y1="60" x2="60" y2="62" stroke="#ea580c" stroke-width="1.5"/>
        <line x1="70" y1="65" x2="61" y2="66" stroke="#ea580c" stroke-width="1.5"/>
        <!-- Eyes -->
        <ellipse cx="40" cy="56" rx="4" ry="3" fill="#0284c7"/>
        <ellipse cx="60" cy="56" rx="4" ry="3" fill="#0284c7"/>
      </svg>
    `
  },
  {
    id: 'pirate_king',
    name: 'Luffy (Gear 5)',
    anime: 'One Piece',
    badge: '👒 Pirate King',
    title: 'Capitaine au Chapeau de Paille',
    accentColor: '#ef4444',
    gradientBg: 'from-red-500/20 via-rose-500/10 to-transparent',
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="#450a0a" opacity="0.3" stroke="#ef4444" stroke-width="2"/>
        <!-- Straw Hat -->
        <path d="M 10 40 Q 50 15 90 40 L 80 48 Q 50 32 20 48 Z" fill="#fde047" stroke="#ca8a04" stroke-width="1.5"/>
        <path d="M 24 40 Q 50 26 76 40 L 78 44 Q 50 30 22 44 Z" fill="#dc2626"/>
        <!-- Cloud-like White Hair Gear 5 -->
        <path d="M 25 44 C 20 35, 35 30, 40 38 C 45 28, 60 28, 62 38 C 70 30, 80 38, 75 46 Z" fill="#f8fafc"/>
        <!-- Face -->
        <path d="M 30 46 L 70 46 L 65 76 L 50 82 L 35 76 Z" fill="#ffedd5"/>
        <!-- Scar under left eye -->
        <path d="M 36 62 L 42 62 M 39 59 L 39 65" stroke="#b91c1c" stroke-width="1.5"/>
        <!-- Huge Smile -->
        <path d="M 34 68 Q 50 82 66 68 Z" fill="#dc2626" stroke="#991b1b" stroke-width="1.5"/>
        <path d="M 36 68 Q 50 74 64 68" fill="#ffffff"/>
      </svg>
    `
  },
  {
    id: 'solo_hunter',
    name: 'Sung Jin-Woo',
    anime: 'Solo Leveling',
    badge: '👑 Monarch',
    title: 'Monarque des Ombres Rang-S',
    accentColor: '#8b5cf6',
    gradientBg: 'from-purple-600/25 via-indigo-600/15 to-transparent',
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="#1e1b4b" stroke="#a855f7" stroke-width="2"/>
        <!-- Dark Shadow Aura -->
        <path d="M 15 50 C 10 20, 35 15, 50 10 C 65 15, 90 20, 85 50 C 90 75, 65 85, 50 90 C 35 85, 10 75, 15 50 Z" fill="#581c87" opacity="0.4"/>
        <!-- Dark Spiky Hair -->
        <path d="M 26 46 L 32 20 L 45 28 L 52 14 L 62 26 L 74 22 L 74 48 L 68 36 Z" fill="#0f172a"/>
        <!-- Sharp Face -->
        <polygon points="32,44 68,44 60,78 50,84 40,78" fill="#f1f5f9"/>
        <!-- Glowing Purple Eyes -->
        <polygon points="37,54 46,55 44,59 38,58" fill="#c084fc"/>
        <polygon points="63,54 54,55 56,59 62,58" fill="#c084fc"/>
        <circle cx="41.5" cy="56.5" r="1.5" fill="#ffffff"/>
        <circle cx="58.5" cy="56.5" r="1.5" fill="#ffffff"/>
        <!-- Smirk -->
        <path d="M 44 68 Q 52 70 58 66" stroke="#475569" stroke-width="2" fill="none"/>
      </svg>
    `
  },
  {
    id: 'sorcerer_supreme',
    name: 'Satoru Gojo',
    anime: 'Jujutsu Kaisen',
    badge: '👁️ Six Eyes',
    title: 'L\'Invincible Exorciste',
    accentColor: '#06b6d4',
    gradientBg: 'from-cyan-500/20 via-blue-500/10 to-transparent',
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="#083344" stroke="#06b6d4" stroke-width="2"/>
        <!-- Spiky White Hair -->
        <path d="M 22 45 L 26 16 L 38 24 L 50 12 L 62 24 L 74 16 L 78 45 Z" fill="#f8fafc"/>
        <!-- Blindfold -->
        <rect x="24" y="42" width="52" height="18" rx="4" fill="#09090b" stroke="#334155" stroke-width="1.5"/>
        <!-- Slight peek of glowing Six Eyes -->
        <ellipse cx="38" cy="51" rx="4" ry="2" fill="#38bdf8"/>
        <ellipse cx="62" cy="51" rx="4" ry="2" fill="#38bdf8"/>
        <!-- Face -->
        <polygon points="30,58 70,58 62,80 50,86 38,80" fill="#fef2f2"/>
        <!-- Confidence Smile -->
        <path d="M 42 70 Q 50 75 58 70" stroke="#0f172a" stroke-width="2" fill="none"/>
      </svg>
    `
  },
  {
    id: 'demon_slayer',
    name: 'Tanjiro Kamado',
    anime: 'Demon Slayer',
    badge: '⚔️ Hashira',
    title: 'Mître du Souffle du Soleil',
    accentColor: '#10b981',
    gradientBg: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
        <!-- Burgundy Hair -->
        <path d="M 25 45 L 30 22 L 42 26 L 50 16 L 58 26 L 70 22 L 75 45 Z" fill="#881337"/>
        <!-- Face -->
        <polygon points="30,42 70,42 63,78 50,84 37,78" fill="#ffedd5"/>
        <!-- Scar on forehead -->
        <path d="M 36 46 L 42 44 L 40 52 L 35 50 Z" fill="#9f1239"/>
        <!-- Hanafuda Earrings -->
        <rect x="22" y="54" width="6" height="12" fill="#ffffff" stroke="#000000" stroke-width="1"/>
        <circle cx="25" cy="57" r="1.5" fill="#dc2626"/>
        <rect x="72" y="54" width="6" height="12" fill="#ffffff" stroke="#000000" stroke-width="1"/>
        <circle cx="75" cy="57" r="1.5" fill="#dc2626"/>
        <!-- Red Eyes -->
        <ellipse cx="40" cy="58" rx="4" ry="4" fill="#9f1239"/>
        <ellipse cx="60" cy="58" rx="4" ry="4" fill="#9f1239"/>
        <!-- Mouth -->
        <path d="M 44 70 L 56 70" stroke="#7c2d12" stroke-width="2"/>
      </svg>
    `
  },
  {
    id: 'titan_shifter',
    name: 'Eren Yeager',
    anime: 'Attack on Titan',
    badge: '🧱 Survey Corps',
    title: 'Major du Bataillon d\'Exploration',
    accentColor: '#64748b',
    gradientBg: 'from-slate-600/20 via-zinc-600/10 to-transparent',
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
        <!-- Long Dark Brown Hair -->
        <path d="M 22 35 C 20 20, 35 15, 50 15 C 65 15, 80 20, 78 35 L 82 70 L 72 65 L 68 40 L 32 40 L 28 65 L 18 70 Z" fill="#451a03"/>
        <!-- Face -->
        <polygon points="32,38 68,38 62,76 50,82 38,76" fill="#fed7aa"/>
        <!-- Intense Green Eyes -->
        <polygon points="36,48 46,50 44,54 36,53" fill="#15803d"/>
        <polygon points="64,48 54,50 56,54 64,53" fill="#15803d"/>
        <!-- Serious eyebrows -->
        <line x1="34" y1="46" x2="47" y2="49" stroke="#271c19" stroke-width="2.5"/>
        <line x1="66" y1="46" x2="53" y2="49" stroke="#271c19" stroke-width="2.5"/>
        <!-- Mouth -->
        <line x1="43" y1="67" x2="57" y2="67" stroke="#78350f" stroke-width="2"/>
      </svg>
    `
  },
  {
    id: 'cyber_mecha',
    name: 'EVA Pilot 01',
    anime: 'Neon Genesis Evangelion',
    badge: '🤖 Mecha Pilot',
    title: 'Pilote Synchronisé à 400%',
    accentColor: '#a855f7',
    gradientBg: 'from-purple-500/20 via-emerald-500/10 to-transparent',
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="#3b0764" stroke="#a855f7" stroke-width="2"/>
        <!-- Mecha Helmet / Horn -->
        <polygon points="50,10 43,30 57,30" fill="#22c55e"/>
        <polygon points="30,30 70,30 65,65 50,75 35,65" fill="#7e22ce" stroke="#22c55e" stroke-width="1.5"/>
        <!-- Visor / Eyes -->
        <polygon points="36,42 48,44 44,50 36,48" fill="#facc15"/>
        <polygon points="64,42 52,44 56,50 64,48" fill="#facc15"/>
        <!-- Chin Plate -->
        <polygon points="42,65 58,65 50,73" fill="#dc2626"/>
      </svg>
    `
  },
  {
    id: 'magical_otaku',
    name: 'Sailor Otaku',
    anime: 'Sailor Moon',
    badge: '✨ Magical Girl',
    title: 'Gardienne de la Justice Otaku',
    accentColor: '#ec4899',
    gradientBg: 'from-pink-500/20 via-rose-500/10 to-transparent',
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="#831843" stroke="#ec4899" stroke-width="2"/>
        <!-- Odango Buns & Blonde Hair -->
        <circle cx="24" cy="24" r="10" fill="#fde047" stroke="#ca8a04" stroke-width="1.5"/>
        <circle cx="76" cy="24" r="10" fill="#fde047" stroke="#ca8a04" stroke-width="1.5"/>
        <path d="M 20 40 Q 50 18 80 40 L 75 48 Q 50 28 25 48 Z" fill="#fde047"/>
        <!-- Tiara -->
        <polygon points="32,36 50,30 68,36 50,34" fill="#fbbf24"/>
        <circle cx="50" cy="33" r="2.5" fill="#dc2626"/>
        <!-- Face -->
        <path d="M 30 42 L 70 42 L 64 76 L 50 82 L 36 76 Z" fill="#fff1f2"/>
        <!-- Big Sparkly Eyes -->
        <ellipse cx="40" cy="54" rx="5" ry="6" fill="#2563eb"/>
        <ellipse cx="60" cy="54" rx="5" ry="6" fill="#2563eb"/>
        <circle cx="41.5" cy="52" r="2" fill="#ffffff"/>
        <circle cx="61.5" cy="52" r="2" fill="#ffffff"/>
        <!-- Smile -->
        <path d="M 44 68 Q 50 73 56 68" stroke="#be123c" stroke-width="2" fill="none"/>
      </svg>
    `
  },
  {
    id: 'fullmetal_alchemist',
    name: 'Edward Elric',
    anime: 'Fullmetal Alchemist',
    badge: '⚙️ Alchemist',
    title: 'L\'Alchimiste d\'État d\'Acier',
    accentColor: '#f59e0b',
    gradientBg: 'from-amber-600/20 via-orange-600/10 to-transparent',
    avatarSvg: `
      <svg viewBox="0 0 100 100" class="w-full h-full">
        <circle cx="50" cy="50" r="46" fill="#451a03" stroke="#f59e0b" stroke-width="2"/>
        <!-- Golden Braid Hair Antenna -->
        <path d="M 50 12 Q 46 22 50 28" stroke="#facc15" stroke-width="3" fill="none"/>
        <path d="M 22 42 L 30 25 L 42 28 L 50 20 L 58 28 L 70 25 L 78 42 Z" fill="#fde047"/>
        <!-- Face -->
        <polygon points="32,40 68,40 62,76 50,82 38,76" fill="#ffedd5"/>
        <!-- Golden Eyes -->
        <ellipse cx="40" cy="54" rx="4" ry="4" fill="#d97706"/>
        <ellipse cx="60" cy="54" rx="4" ry="4" fill="#d97706"/>
        <!-- Determined Eyebrows -->
        <line x1="34" y1="47" x2="46" y2="50" stroke="#78350f" stroke-width="2"/>
        <line x1="66" y1="47" x2="54" y2="50" stroke="#78350f" stroke-width="2"/>
        <!-- Mouth -->
        <path d="M 44 68 Q 50 64 56 68" stroke="#78350f" stroke-width="2" fill="none"/>
      </svg>
    `
  }
];

export function getAvatarById(id: string): OtakuAvatar {
  return OTAKU_AVATARS.find((a) => a.id === id) || OTAKU_AVATARS[0];
}
