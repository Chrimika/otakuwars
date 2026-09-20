import { NextRequest, NextResponse } from 'next/server';

const AI_API_KEY = process.env.AI_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { count = 20 } = await request.json();

    if (!AI_API_KEY) {
      return NextResponse.json(
        { error: 'AI API key not configured' },
        { status: 500 }
      );
    }

    // Générer plus de thèmes pour avoir de la variété
    const generateCount = Math.max(count * 2, 40);
    
    // Randomisation
    const randomSeed = Math.floor(Math.random() * 999999);
    const timestamp = Date.now();

    const prompt = `Tu es un expert en animes et mangas. Génère ${generateCount} thèmes variés pour un jeu où les joueurs citent des personnages d'anime correspondant au thème.

SEED: ${randomSeed} - TIMESTAMP: ${timestamp}

IMPORTANT: Génère des thèmes TOTALEMENT DIFFÉRENTS à chaque fois! Explore toutes les catégories:
- Apparence: cheveux, yeux, vêtements, cicatrices, accessoires
- Pouvoirs: feu, glace, foudre, vent, terre, eau, transformations
- Armes: épées, arcs, magie, arts martiaux
- Personnalité: calmes, énergiques, stratèges, impulsifs
- Rôle: capitaines, médecins, cuisiniers, détectives
- Caractéristiques: immortels, cyborgs, démons, vampires, mi-humains
- Métiers: pirates, ninjas, samouraïs, étudiants, chasseurs

Exemples créatifs:
- Personnages aux cheveux rouges
- Utilisateurs de magie de glace
- Sabreurs légendaires
- Personnages qui portent un masque
- Ceux qui peuvent voler
- Immortels ou très âgés
- Personnages avec un animal de compagnie
- Ceux qui mangent énormément
- Génies ou stratèges brillants

Réponds en JSON:
{"themes": [{"theme": "Description française", "themeEn": "English description"}, ...]}`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'groq/compound', // Modèle gratuit et puissant
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en animes et mangas. Réponds toujours en JSON valide.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 4000,
        response_format: { type: 'json_object' }, // Force JSON
      }),
    });

    console.log('🌐 Groq response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Groq error:', response.status, errorData);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.choices?.[0]?.message?.content || '';

    console.log('✅ Groq response received, parsing JSON...');

    // Nettoyer les balises markdown ```json ... ``` si présentes
    let cleanedContent = textContent.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(cleanedContent);
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
