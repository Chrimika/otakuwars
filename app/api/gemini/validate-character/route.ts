import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

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

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
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

    return NextResponse.json({
      valid: parsed.valid === true,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.5,
      reason: parsed.reason || '',
    });
  } catch (error) {
    console.error('Error validating character:', error);
    // En cas d'erreur, accepter par défaut (mode permissif)
    return NextResponse.json({
      valid: true,
      confidence: 0.5,
      reason: 'Validation automatique (erreur API)',
    });
  }
}
