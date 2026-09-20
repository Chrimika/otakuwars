import { NextRequest, NextResponse } from 'next/server';

const AI_API_KEY = process.env.AI_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface ValidationRequest {
  characterName: string;
  theme: string;
  themeEn: string;
}

interface ValidationResult {
  characterName: string;
  valid: boolean;
  confidence: number;
  reason: string;
  details: string;
}

export async function POST(request: NextRequest) {
  try {
    const { answers } = await request.json() as { answers: ValidationRequest[] };

    if (!AI_API_KEY) {
      return NextResponse.json(
        { error: 'AI API key not configured' },
        { status: 500 }
      );
    }

    if (!answers || answers.length === 0) {
      return NextResponse.json(
        { error: 'No answers to validate' },
        { status: 400 }
      );
    }

    console.log(`🔍 Validation batch de ${answers.length} réponses...`);

    // Construire le prompt pour toutes les réponses
    const answersList = answers.map((a, i) => 
      `${i + 1}. "${a.characterName}" pour le thème "${a.theme}"`
    ).join('\n');

    const prompt = `Tu es un expert en animes et mangas. Valide ces ${answers.length} réponses d'un jeu d'anime:

${answersList}

RÈGLES DE VALIDATION:
✅ ACCEPTE si:
- Le personnage existe dans un anime/manga
- Il correspond au thème demandé
- Même avec fautes d'orthographe
- Même avec majuscules/minuscules incorrectes
- Surnoms acceptés (ex: "Ace" pour "Portgas D. Ace")

❌ REJETTE si:
- Nom complètement inventé
- Personnage ne correspond PAS au thème
- Nom générique ("ninja", "pirate")

Pour CHAQUE réponse, donne:
- valid: true/false
- confidence: 0-1 (ta certitude)
- reason: explication courte (15 mots max)
- details: explication détaillée avec nom complet du personnage, son anime, et pourquoi ça correspond/pas (30 mots max)

Réponds en JSON:
{
  "results": [
    {
      "characterName": "nom original",
      "valid": true/false,
      "confidence": 0.95,
      "reason": "Courte explication",
      "details": "Explication détaillée avec anime et raison"
    }
  ]
}`;

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
        max_tokens: 2000 + (answers.length * 100), // Plus de tokens pour plus de réponses
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Groq batch error:', response.status, errorData);
      
      // Fallback: accepter toutes les réponses
      return NextResponse.json({
        results: answers.map(a => ({
          characterName: a.characterName,
          valid: true,
          confidence: 0.6,
          reason: 'Validation automatique (erreur API)',
          details: 'La validation automatique a accepté cette réponse car l\'API a rencontré une erreur.',
        }))
      });
    }

    const data = await response.json();
    const textContent = data.choices?.[0]?.message?.content || '';

    console.log('✅ Groq batch response received');

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
      console.error('❌ JSON parse error:', parseError);
      // Fallback: accepter toutes les réponses
      return NextResponse.json({
        results: answers.map(a => ({
          characterName: a.characterName,
          valid: true,
          confidence: 0.6,
          reason: 'Validation automatique (erreur parsing)',
          details: 'La validation automatique a accepté cette réponse car le parsing JSON a échoué.',
        }))
      });
    }

    const results: ValidationResult[] = parsed.results || [];

    // Appliquer seuil de confidence
    const finalResults = results.map(r => ({
      ...r,
      valid: r.valid && r.confidence >= 0.5, // Minimum 50% confiance
    }));

    console.log(`✅ ${finalResults.filter(r => r.valid).length}/${finalResults.length} réponses valides`);

    return NextResponse.json({ results: finalResults });
  } catch (error) {
    console.error('Error validating batch:', error);
    return NextResponse.json(
      { error: 'Failed to validate answers' },
      { status: 500 }
    );
  }
}
