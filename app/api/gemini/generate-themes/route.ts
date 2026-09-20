import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export async function POST(request: NextRequest) {
  try {
    const { count = 20 } = await request.json();

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Générer BEAUCOUP plus de thèmes que demandé pour avoir de la variété
    const generateCount = Math.max(count * 3, 50); // Au moins 50 thèmes
    
    // Ajouter de la randomisation FORTE pour varier les thèmes à chaque partie
    const randomSeed = Math.floor(Math.random() * 999999);
    const timestamp = Date.now();
    const randomWords = ['original', 'unique', 'créatif', 'inattendu', 'surprenant', 'innovant'];
    const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];

    const prompt = `Tu es un expert en animes et mangas. Génère exactement ${generateCount} thèmes TRÈS DIFFÉRENTS et ${randomWord} pour un jeu où les joueurs doivent citer des personnages d'anime correspondant au thème.

🎲 SEED: ${randomSeed} | TIME: ${timestamp} | MODE: ${randomWord.toUpperCase()}

⚠️ IMPÉRATIF: Chaque génération DOIT être TOTALEMENT DIFFÉRENTE! Ne répète JAMAIS les mêmes thèmes!

RÈGLES STRICTES:
- Thèmes clairs et non ambigus
- MAXIMUM de variété entre les catégories
- Explore des idées ORIGINALES et SURPRENANTES
- Évite les clichés vus 1000 fois
- Thèmes en français

CATÉGORIES À EXPLORER (utilise-les toutes!):
- 👤 Apparence: cheveux (couleur, longueur, style), yeux, vêtements, accessoires, cicatrices, tatouages, piercings
- ⚡ Pouvoirs: éléments (feu, eau, glace, foudre, vent, terre), transformations, capacités mentales, illusions
- ⚔️ Armes: épées, arcs, fusils, magie, arts martiaux, armes exotiques
- 🎭 Personnalité: calmes, énergiques, timides, arrogants, stratèges, impulsifs, loyaux, traîtres
- 💼 Rôle: capitaines, médecins, cuisiniers, scientifiques, hackers, détectives, artistes
- 💕 Relations: frères/sœurs, rivaux, amis d'enfance, mentors, amoureux
- 🎪 Caractéristiques: immortels, cyborgs, démons, anges, mi-humains, vampires, aliens
- 🏢 Métiers: pirates, ninjas, samouraïs, étudiants, chasseurs, mercenaires, espions
- 🎨 Physique: grands, petits, musclés, minces, jeunes, vieux
- 🌟 Spécial: mangent beaucoup, dorment tout le temps, sont riches, sont pauvres, voyagent dans le temps

EXEMPLES CRÉATIFS (invente d'autres!):
- Personnages qui cachent un œil
- Maîtres du déguisement
- Personnages qui ne sourient jamais
- Ceux qui parlent aux animaux
- Porteurs de masques
- Utilisateurs d'armes non-conventionnelles
- Personnages avec des pouvoirs de copie
- Ceux qui contrôlent le temps ou l'espace
- Personnages mi-humains mi-animaux
- Immortels ou très âgés (100+ ans)

Réponds UNIQUEMENT avec un JSON valide (sans markdown, sans \`\`\`json):
{
  "themes": [
    {"theme": "Description en français", "themeEn": "Description in English"},
    ...
  ]
}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 1.0, // Maximum de créativité!
          topK: 50,
          topP: 0.98,
          maxOutputTokens: 4096, // Plus de tokens pour plus de thèmes
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
    const allThemes = parsed.themes || [];

    // MÉLANGER ALÉATOIREMENT et prendre seulement le nombre demandé
    const shuffled = allThemes.sort(() => Math.random() - 0.5);
    const selectedThemes = shuffled.slice(0, count);

    return NextResponse.json({ themes: selectedThemes });
  } catch (error) {
    console.error('Error generating themes:', error);
    return NextResponse.json(
      { error: 'Failed to generate themes' },
      { status: 500 }
    );
  }
}
