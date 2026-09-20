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

    const prompt = `Tu es un expert en animes et mangas qui valide les réponses des joueurs. Un joueur a proposé "${characterName}" pour le thème: "${theme}" (${themeEn}).

🎯 TA MISSION: Être JUSTE et ÉQUITABLE, pas trop strict!

✅ ACCEPTE SI:
1. Le personnage existe vraiment dans un anime/manga
2. Il correspond bien au thème demandé
3. Même avec des fautes de frappe ou majuscules manquantes
4. Même si c'est un surnom connu du personnage

❌ REJETTE SEULEMENT SI:
1. Le nom est complètement inventé ou n'existe pas
2. Le personnage ne correspond PAS DU TOUT au thème
3. C'est un nom trop générique ("ninja", "un samourai")

💡 TOLÉRANCES:
- ✅ Majuscules/minuscules: "naruto" = "Naruto" = "NARUTO"
- ✅ Fautes mineures: "Sangoku" = "Goku", "Natsu" = "Natsu"
- ✅ Accents oubliés: "Eren" = "Eren"
- ✅ Surnoms: "Mugiwara" pour Luffy, "Roi des Pirates" pour Roger
- ✅ Noms incomplets mais clairs: "Zoro" pour "Roronoa Zoro"
- ✅ Ordre prénom/nom: "Naruto Uzumaki" = "Uzumaki Naruto"

🎲 CONFIDENCE (0-1):
- 0.9-1.0 = Tu es sûr à 90%+
- 0.7-0.89 = Probable à 70-89%
- 0.5-0.69 = Pas sûr (50-69%)
- 0-0.49 = Probablement faux

⚠️ IMPORTANT: Sois GÉNÉREUX! Si tu penses que c'est probablement bon, ACCEPTE avec confidence > 0.7

Réponds en JSON (sans markdown):
{
  "valid": true ou false,
  "confidence": nombre entre 0 et 1,
  "reason": "Courte explication"
}

Exemples:
✅ "cheveux rouges" + "shanks" → {"valid": true, "confidence": 0.95, "reason": "Shanks (One Piece) a les cheveux rouges"}
✅ "cheveux rouges" + "SHANKS" → {"valid": true, "confidence": 0.95, "reason": "Shanks (One Piece) a les cheveux rouges"}
✅ "sabreurs" + "zoro" → {"valid": true, "confidence": 0.98, "reason": "Zoro est un sabreur légendaire"}
❌ "cheveux rouges" + "goku" → {"valid": false, "confidence": 0.95, "reason": "Goku a les cheveux noirs"}
❌ "sabreurs" + "ninja" → {"valid": false, "confidence": 0.9, "reason": "Trop générique"}
✅ "utilisateurs de feu" + "ace" → {"valid": true, "confidence": 0.95, "reason": "Ace utilise le Mera Mera no Mi (feu)"}`;


    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2, // Équilibré entre cohérence et tolérance
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

    // Appliquer un seuil de confidence équilibré
    const confidence = typeof parsed.confidence === 'number' ? parsed.confidence : 0.5;
    const isValid = parsed.valid === true && confidence >= 0.6; // Minimum 60% de confiance (équilibré)

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
