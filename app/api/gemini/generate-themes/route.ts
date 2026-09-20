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

    // Ajouter de la randomisation pour varier les thèmes à chaque partie
    const randomSeed = Math.floor(Math.random() * 1000);
    const timestamp = Date.now();

    const prompt = `Tu es un expert en animes et mangas. Génère exactement ${count} thèmes créatifs et VARIÉS pour un jeu où les joueurs doivent citer des personnages d'anime correspondant au thème.

IMPORTANT: Seed aléatoire ${randomSeed} / Timestamp ${timestamp} - Génère des thèmes DIFFÉRENTS à chaque fois!

RÈGLES IMPORTANTES:
- Les thèmes doivent être clairs et non ambigus
- Varie les catégories: apparence physique, pouvoirs, personnalité, rôle, armes, occupations, traits de caractère
- Évite les thèmes trop larges (ex: "personnages forts") ou trop restrictifs
- Assure-toi que plusieurs personnages populaires correspondent à chaque thème
- Sois CRÉATIF et ORIGINAL - évite les clichés!
- Les thèmes doivent être en français

CATÉGORIES À VARIER:
- Apparence: cheveux (couleur, style), yeux, vêtements, cicatrices, tatouages
- Pouvoirs: éléments, transformations, capacités spéciales
- Armes: types d'armes, styles de combat
- Personnalité: calmes, énergiques, stratèges, idiots attachants
- Rôle: capitaines, médecins, cuisiniers, hackers, détectives
- Relations: frères/sœurs, rivaux, mentors
- Caractéristiques: immortels, cyborgs, démons, mi-humains
- Métiers: pirates, ninjas, samouraïs, étudiants, chasseurs

EXEMPLES VARIÉS:
- Personnages qui portent un bandeau
- Utilisateurs de magie de glace
- Personnages qui mangent énormément
- Assassins ou tueurs à gages
- Personnages avec un animal de compagnie
- Génies ou stratèges brillants
- Personnages qui se régénèrent
- Chefs cuisiniers ou amateurs de cuisine

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
