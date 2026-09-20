/**
 * Service Gemini AI pour le jeu "Rafale Otaku"
 * Génère des questions thématiques et valide les réponses des joueurs
 */

const GEMINI_API_KEY = 'AIzaSyAb8RN6JvSuPY_PNPqL1DvLqmoN54k_KE_yd11ub_qBNSpTUBcg';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface CharacterRushTheme {
  id: string;
  theme: string; // Ex: "Personnages aux cheveux rouges", "Sabreurs légendaires"
  themeEn: string; // Version anglaise pour faciliter la validation
}

/**
 * Génère N questions thématiques créatives pour le jeu
 */
export async function generateCharacterRushThemes(count: number = 20): Promise<CharacterRushTheme[]> {
  const prompt = `Tu es un expert en animes et mangas. Génère exactement ${count} thèmes créatifs et variés pour un jeu où les joueurs doivent citer des personnages d'anime correspondant au thème.

RÈGLES IMPORTANTES:
- Les thèmes doivent être clairs et non ambigus
- Varie les catégories: apparence physique, pouvoirs, personnalité, rôle, armes, etc.
- Évite les thèmes trop larges (ex: "personnages forts") ou trop restrictifs (ex: "personnages dans un épisode spécifique")
- Assure-toi que plusieurs personnages populaires correspondent à chaque thème
- Les thèmes doivent être en français

EXEMPLES DE BONS THÈMES:
- Personnages aux cheveux rouges
- Sabreurs légendaires
- Personnages capables de voler
- Personnages avec des lunettes
- Utilisateurs de magie de feu
- Personnages immortels ou très âgés
- Ninjas célèbres
- Personnages cyborgs ou robots
- Personnages avec des cicatrices visibles
- Capitaines ou leaders d'équipe

Réponds UNIQUEMENT avec un JSON valide (sans markdown, sans \`\`\`json):
{
  "themes": [
    {"theme": "Description en français", "themeEn": "Description in English"},
    ...
  ]
}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Nettoyer la réponse (enlever markdown si présent)
    let cleanedText = textContent.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(cleanedText);
    const themes = parsed.themes || [];

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
  const prompt = `Tu es un expert en animes et mangas. Un joueur a proposé le personnage "${characterName}" pour le thème: "${theme}" (${themeEn}).

RÈGLES DE VALIDATION:
- Le personnage doit être un personnage d'anime/manga connu
- Le personnage doit correspondre clairement au thème
- Sois tolérant avec les variantes de noms (ex: "Naruto", "Naruto Uzumaki", "Uzumaki Naruto")
- Accepte les surnoms courants (ex: "Mugiwara" pour Luffy, "Pirate Hunter" pour Zoro)
- Rejette les personnages qui ne correspondent PAS au thème
- Rejette les noms inventés ou les noms de personnes réelles

Réponds UNIQUEMENT avec un JSON valide (sans markdown, sans \`\`\`json):
{
  "valid": true ou false,
  "confidence": nombre entre 0 et 1,
  "reason": "Courte explication en français"
}

Exemples:
- Si le thème est "cheveux rouges" et le personnage est "Shanks": {"valid": true, "confidence": 0.95, "reason": "Shanks a les cheveux rouges"}
- Si le thème est "cheveux rouges" et le personnage est "Goku": {"valid": false, "confidence": 0.9, "reason": "Goku a les cheveux noirs"}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3, // Plus bas pour des réponses cohérentes
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 256,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Nettoyer la réponse
    let cleanedText = textContent.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(cleanedText);
    
    return {
      valid: parsed.valid === true,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
      reason: parsed.reason || '',
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
