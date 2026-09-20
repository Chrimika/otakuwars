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

    // Nettoyer la réponse
    let cleanedText = textContent.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(cleanedText);
    const themes = parsed.themes || [];

    return NextResponse.json({ themes: themes.slice(0, count) });
  } catch (error) {
    console.error('Error generating themes:', error);
    return NextResponse.json(
      { error: 'Failed to generate themes' },
      { status: 500 }
    );
  }
}
