import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

export async function POST(request: NextRequest) {
  try {
    const { characterName, theme, themeEn } = await request.json();

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
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

🎯 RÈGLE D'OR: SI ÇA RESSEMBLE À UNE BONNE RÉPONSE, ACCEPTE-LA!

✅ ACCEPTE (valid: true, confidence > 0.5):
- Tous les personnages d'anime/manga qui correspondent au thème
- Même avec fautes: "shanks", "SHANKS", "shank", "Shanx"
- Même incomplet: "hawks" pour "Hawks/Keigo Takami"
- Surnoms: "Ace" pour "Portgas D. Ace"
- Si tu penses que c'est probablement bon → ACCEPTE

❌ REJETTE SEULEMENT (valid: false):
- Noms complètement inventés qui n'existent pas
- Personnages qui ne correspondent VRAIMENT PAS au thème
- Mots génériques: "ninja", "un pirate"

💡 EXEMPLES:
- "cheveux rouges" + "shanks" → ✅ {"valid": true, "confidence": 0.95}
- "cheveux rouges" + "SHANKS" → ✅ {"valid": true, "confidence": 0.95}
- "capable de voler" + "hawks" → ✅ {"valid": true, "confidence": 0.95}
- "capable de voler" + "deku" → ✅ {"valid": true, "confidence": 0.8} (peut voler avec OFA)
- "cheveux rouges" + "goku" → ❌ {"valid": false, "confidence": 0.9}

Réponds en JSON sans markdown:
{"valid": true/false, "confidence": 0-1, "reason": "courte explication"}`;



    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3, // Plus de tolérance
          topK: 30,
          topP: 0.9,
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
