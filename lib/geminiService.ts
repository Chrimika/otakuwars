/**
 * Service Gemini AI pour le jeu "Rafale Otaku"
 * Génère des questions thématiques et valide les réponses des joueurs
 * Utilise des API routes Next.js pour sécuriser la clé API
 */

export interface CharacterRushTheme {
  id: string;
  theme: string; // Ex: "Personnages aux cheveux rouges", "Sabreurs légendaires"
  themeEn: string; // Version anglaise pour faciliter la validation
}

/**
 * Génère N questions thématiques créatives pour le jeu
 */
export async function generateCharacterRushThemes(count: number = 20): Promise<CharacterRushTheme[]> {
  try {
    const response = await fetch('/api/gemini/generate-themes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const themes = data.themes || [];

    // Ajouter des IDs uniques
    return themes.slice(0, count).map((t: { theme: string; themeEn: string }, index: number) => ({
      id: `theme_${Date.now()}_${index}`,
      theme: t.theme,
      themeEn: t.themeEn,
    }));
  } catch (error) {
    console.error('Error generating themes:', error);
    // Fallback avec des thèmes par défaut
    return getFallbackThemes(count);
  }
}

/**
 * Valide si un personnage correspond au thème donné
 */
export async function validateCharacterForTheme(
  characterName: string,
  theme: string,
  themeEn: string
): Promise<{ valid: boolean; confidence: number; reason?: string }> {
  try {
    const response = await fetch('/api/gemini/validate-character', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ characterName, theme, themeEn }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      valid: data.valid === true,
      confidence: typeof data.confidence === 'number' ? data.confidence : 0.5,
      reason: data.reason || '',
    };
  } catch (error) {
    console.error('Error validating character:', error);
    // En cas d'erreur, on accepte par défaut (mode permissif)
    return { valid: true, confidence: 0.5, reason: 'Validation automatique (erreur API)' };
  }
}

/**
 * Valide plusieurs personnages en batch (optimisation)
 */
export async function validateMultipleCharacters(
  characters: Array<{ name: string; theme: string; themeEn: string }>
): Promise<Array<{ name: string; valid: boolean; confidence: number; reason?: string }>> {
  // Pour l'instant, on valide un par un
  // Peut être optimisé plus tard avec des appels en parallèle
  const results = [];
  
  for (const char of characters) {
    const result = await validateCharacterForTheme(char.name, char.theme, char.themeEn);
    results.push({ name: char.name, ...result });
  }
  
  return results;
}

/**
 * Thèmes de secours en cas d'échec de l'API
 */
function getFallbackThemes(count: number): CharacterRushTheme[] {
  const fallbackThemes = [
    { theme: 'Personnages aux cheveux rouges', themeEn: 'Red-haired characters' },
    { theme: 'Sabreurs légendaires', themeEn: 'Legendary swordsmen' },
    { theme: 'Personnages capables de voler', themeEn: 'Characters who can fly' },
    { theme: 'Utilisateurs de magie de feu', themeEn: 'Fire magic users' },
    { theme: 'Ninjas célèbres', themeEn: 'Famous ninjas' },
    { theme: 'Personnages avec des lunettes', themeEn: 'Characters with glasses' },
    { theme: 'Capitaines ou leaders d\'équipe', themeEn: 'Captains or team leaders' },
    { theme: 'Personnages immortels', themeEn: 'Immortal characters' },
    { theme: 'Utilisateurs de la foudre', themeEn: 'Lightning users' },
    { theme: 'Personnages avec une cicatrice', themeEn: 'Characters with scars' },
    { theme: 'Robots ou cyborgs', themeEn: 'Robots or cyborgs' },
    { theme: 'Personnages aux yeux rouges', themeEn: 'Red-eyed characters' },
    { theme: 'Maîtres d\'arts martiaux', themeEn: 'Martial arts masters' },
    { theme: 'Personnages avec des ailes', themeEn: 'Winged characters' },
    { theme: 'Utilisateurs de glace', themeEn: 'Ice users' },
    { theme: 'Personnages masqués', themeEn: 'Masked characters' },
    { theme: 'Génies ou surdoués', themeEn: 'Geniuses or prodigies' },
    { theme: 'Personnages aux cheveux blancs', themeEn: 'White-haired characters' },
    { theme: 'Utilisateurs d\'arcs ou arbalètes', themeEn: 'Bow or crossbow users' },
    { theme: 'Personnages avec un animal de compagnie', themeEn: 'Characters with pets' },
  ];

  return fallbackThemes.slice(0, count).map((t, index) => ({
    id: `fallback_${Date.now()}_${index}`,
    ...t,
  }));
}
