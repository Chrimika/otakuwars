import { NextRequest, NextResponse } from 'next/server';

const AI_API_KEY = process.env.AI_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(request: NextRequest) {
  try {
    const { characterName, theme, themeEn } = await request.json();

    if (!AI_API_KEY) {
      return NextResponse.json(
        { error: 'AI API key not configured' },
        { status: 500 }
      );
    }

    if (!characterName || !theme) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = `Tu valides les réponses d'un jeu d'anime. Joueur: "${characterName}" | Thème: "${theme}"

RÈGLE D'OR: SI ÇA RESSEMBLE À UNE BONNE RÉPONSE, ACCEPTE-LA!

ACCEPTE (valid: true, confidence > 0.5):
- Tous les personnages d'anime/manga qui correspondent au thème
- Même avec fautes: "shanks", "SHANKS", "shank"
- Même incomplet: "hawks" pour "Hawks/Keigo Takami"
- Surnoms: "Ace" pour "Portgas D. Ace"

REJETTE SEULEMENT (valid: false):
- Noms complètement inventés
- Personnages qui ne correspondent VRAIMENT PAS au thème
- Mots génériques: "ninja", "un pirate"

EXEMPLES:
- "cheveux rouges" + "shanks" = valid true confidence 0.95
- "capable de voler" + "hawks" = valid true confidence 0.95
- "cheveux rouges" + "goku" = valid false confidence 0.9

Réponds UNIQUEMENT avec ce JSON exact:
{"valid":true,"confidence":0.95,"reason":"courte explication"}`;



    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'groq/compound',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en animes. Réponds toujours en JSON valide.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 256,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const textContent = data.choices?.[0]?.message?.content || '';

    console.log('🔍 Groq raw response:', textContent);

    let parsed;
    try {
      // Nettoyer les balises markdown ```json ... ``` si présentes
      let cleanedContent = textContent.trim();
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      parsed = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError, 'Text:', textContent);
      // Si parse échoue, accepter par défaut
      return NextResponse.json({
        valid: true,
        confidence: 0.6,
        reason: 'Validation automatique (erreur de parsing)',
      });
    }

    // Appliquer un seuil de confidence PERMISSIF
    const confidence = typeof parsed.confidence === 'number' ? parsed.confidence : 0.5;
    const isValid = parsed.valid === true && confidence >= 0.5; // Minimum 50% de confiance (permissif)

    console.log('🔍 Validation:', characterName, 'pour', theme, '→', isValid ? '✅ ACCEPTÉ' : '❌ REFUSÉ', `(${Math.round(confidence * 100)}%)`);

    return NextResponse.json({
      valid: isValid,
      confidence: confidence,
      reason: parsed.reason || '',
    });
  } catch (error) {
    console.error('Error validating character:', error);
    // En cas d'erreur, REJETER par défaut (mode strict)
    // Il vaut mieux perdre un point que d'en donner un injustement
    return NextResponse.json({
      valid: false,
      confidence: 0.3,
      reason: 'Erreur de validation - réponse rejetée par sécurité',
    });
  }
}
