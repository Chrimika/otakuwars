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

    const prompt = `Tu es un expert STRICT en animes et mangas. Un joueur a proposé le personnage "${characterName}" pour le thème: "${theme}" (${themeEn}).

⚠️ RÈGLES DE VALIDATION STRICTES:

1. **Le personnage DOIT exister** dans un anime/manga connu
   - Rejette les noms inventés, fantaisistes ou inexistants
   - Rejette les noms de personnes réelles (sauf si ce sont des personnages d'anime biographiques)
   - Rejette les noms génériques ("ninja", "samourai", "un personnage")

2. **Le personnage DOIT correspondre EXACTEMENT au thème**
   - Vérifie que la caractéristique demandée est VRAIMENT présente
   - Sois STRICT: "cheveux rouges" ≠ "cheveux oranges" ou "cheveux roses"
   - Ne devine pas: si tu n'es pas SÛR à 80%+, rejette

3. **Tolérance sur les noms:**
   - ✅ Accepte les variantes: "Naruto", "Naruto Uzumaki", "Uzumaki Naruto"
   - ✅ Accepte les surnoms très connus: "Mugiwara" pour Luffy, "Pirate Hunter" pour Zoro
   - ✅ Accepte les fautes mineures: "Sangoku" pour "Goku", "Natsu" pour "Natsu"
   - ❌ Rejette les noms trop vagues ou incomplets

4. **Confidence (0-1):**
   - 0.9-1.0 = Tu es absolument certain
   - 0.7-0.89 = Très probable mais pas 100% sûr
   - 0.5-0.69 = Pas assez sûr → REJETTE (valid: false)
   - 0-0.49 = Clairement faux → REJETTE

⚠️ EN CAS DE DOUTE, REJETTE! Il vaut mieux rejeter une bonne réponse que d'accepter une mauvaise.

Réponds UNIQUEMENT avec un JSON valide (sans markdown, sans \`\`\`json):
{
  "valid": true ou false,
  "confidence": nombre entre 0 et 1,
  "reason": "Explication courte et précise en français"
}

Exemples:
✅ Thème "cheveux rouges" + "Shanks" → {"valid": true, "confidence": 0.95, "reason": "Shanks (One Piece) a les cheveux rouges"}
❌ Thème "cheveux rouges" + "Goku" → {"valid": false, "confidence": 0.95, "reason": "Goku a les cheveux noirs, pas rouges"}
❌ Thème "sabreurs" + "ninja" → {"valid": false, "confidence": 0.9, "reason": "Nom trop générique, pas un personnage spécifique"}
✅ Thème "utilisateurs de feu" + "Natsu" → {"valid": true, "confidence": 0.98, "reason": "Natsu Dragneel (Fairy Tail) maîtrise la magie de feu"}
❌ Thème "personnages blonds" + "Luffy" → {"valid": false, "confidence": 0.95, "reason": "Luffy a les cheveux noirs, pas blonds"}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1, // Très bas pour des réponses cohérentes et strictes
          topK: 10,
          topP: 0.7,
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

    // Appliquer un seuil de confidence strict
    const confidence = typeof parsed.confidence === 'number' ? parsed.confidence : 0.5;
    const isValid = parsed.valid === true && confidence >= 0.7; // Minimum 70% de confiance

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
