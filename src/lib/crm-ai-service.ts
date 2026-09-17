type Message = { role: "system" | "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `Tu es l'assistant IA de Maison Fritz, agence immobilière de prestige au Congo-Brazzaville.

Ton rôle :
- Aider l'équipe Maison Fritz à gérer l'activité quotidienne de l'agence
- Répondre aux questions sur le marché immobilier congolais (Brazzaville, Pointe-Noire)
- Conseiller sur la rédaction d'annonces, la gestion de clients et le suivi des biens
- Aider à prioriser les relances et organiser le pipeline commercial
- Fournir des estimations de prix basées sur le marché local
- Aider avec les aspects légaux de base (baux, mandats) tout en recommandant un professionnel du droit

Contexte marché :
- Devise : Franc CFA (FCFA / XAF)
- Villes principales : Brazzaville, Pointe-Noire
- Types de biens : villas, appartements, terrains, locaux commerciaux, bureaux
- Spécialité Maison Fritz : immobilier de prestige et résidentiel haut de gamme
- Le marché est en développement avec peu de données publiques

Règles :
- Réponds toujours en français
- Sois concis et pratique — l'équipe est occupée
- Ne divulgue jamais d'informations confidentielles
- Si tu ne sais pas, dis-le honnêtement
- Propose des actions concrètes quand c'est pertinent`;

const LLM_URL = process.env.LLM_API_URL || "https://forge.manus.im/v1/chat/completions";
const LLM_KEY = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || "";

export async function getAiResponse(
  userMessage: string,
  history: { role: "user" | "assistant"; body: string }[]
): Promise<string> {
  if (!LLM_KEY) {
    return "L'assistant IA n'est pas configuré. Ajoutez LLM_API_KEY dans vos variables d'environnement.";
  }

  const messages: Message[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-20).map((m) => ({ role: m.role, content: m.body })),
    { role: "user", content: userMessage },
  ];

  const response = await fetch(LLM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LLM_KEY}`,
    },
    body: JSON.stringify({ messages, max_tokens: 1024 }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`LLM error: ${response.status} ${text}`);
    return "Désolé, une erreur est survenue avec l'assistant IA. Réessayez dans un moment.";
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return "Désolé, je n'ai pas pu générer de réponse.";
  return typeof content === "string" ? content : String(content);
}
