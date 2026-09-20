import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent';

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
    const generateCount = Math.max(count * 2, 40); // Au moins 40 thèmes
    
    // Randomisation pour varier les thèmes
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

Réponds en JSON sans markdown:
{"themes": [{"theme": "Description française", "themeEn": "English description"}, ...]}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.95, // Haute créativité mais stable
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 3072, // Suffisant pour 40 thèmes
        },
      }),
    });

    console.log('🌐 Gemini response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Gemini error:', response.status, errorData);
      
      // Si 503 (surchargé), on réessaye après 2 secondes
      if (response.status === 503) {
        console.log('⏳ Modèle surchargé, on réessaye dans 2s...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Deuxième tentative
        const retryResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.95,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 3072,
            },
          }),
        });
        
        if (!retryResponse.ok) {
          throw new Error(`Gemini API error after retry: ${retryResponse.status}`);
        }
        
        const retryData = await retryResponse.json();
        const retryContent = retryData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        let cleanedRetry = retryContent.trim();
        if (cleanedRetry.startsWith('```json')) {
          cleanedRetry = cleanedRetry.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanedRetry.startsWith('```')) {
          cleanedRetry = cleanedRetry.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        const parsedRetry = JSON.parse(cleanedRetry);
        const allThemesRetry = parsedRetry.themes || [];
        const shuffledRetry = allThemesRetry.sort(() => Math.random() - 0.5);
        return NextResponse.json({ themes: shuffledRetry.slice(0, count) });
      }
      
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
