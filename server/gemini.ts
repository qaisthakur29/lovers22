import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

let genAIClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAIClient;
}

export interface AIGenerationInput {
  partner_name: string;
  sender_name?: string;
  nickname?: string;
  relationship_start_date?: string;
  how_we_met?: string;
  favorite_memory?: string;
  love_most?: string;
  never_told?: string;
  favorite_thing?: string;
  wish_for_year?: string;
  special_note?: string;
}

export interface AIGenerationOutput {
  messages: string[]; // Exactly 12 messages
  letter: string;
}

const CANDIDATE_MODELS = ['gemini-3.7-flash', 'gemini-3.1-flash-lite'];

export async function generatePersonalizedContent(
  input: AIGenerationInput
): Promise<AIGenerationOutput> {
  const client = getGeminiClient();

  if (client) {
    const prompt = `You are the gentle, intimate, emotionally mature writing assistant for FIRST WISH — a private digital birthday gift experience.
Generate two things strictly tailored to the user's partner:
1. "12 Things I Want You To Know": Exactly 12 intimate, natural, authentic statements/notes for the partner's birthday.
2. A personal, warm birthday letter (3-4 short, heartfelt paragraphs).

CRITICAL RULES:
- Ground everything strictly in the facts and memories supplied below.
- DO NOT invent fake locations, fictional events, or untrue backstories.
- Keep the tone emotionally warm, natural, conversational, calm, and mature.
- Avoid cheesy clichés, forced rhyming, or over-the-top melodrama.
- It should feel like a genuine, loving partner speaking softly at midnight.

INPUT DETAILS:
- Partner's Name: ${input.partner_name || 'My Love'}
- Pet name / Nickname: ${input.nickname || 'Love'}
- Sender's Name: ${input.sender_name || 'Me'}
- How We Met: ${input.how_we_met || 'Not specified'}
- Start Date: ${input.relationship_start_date || 'Not specified'}
- Favorite Memory: ${input.favorite_memory || 'Not specified'}
- What I Love Most: ${input.love_most || 'Not specified'}
- Something I've Never Told: ${input.never_told || 'Not specified'}
- Favorite Thing About Being Together: ${input.favorite_thing || 'Not specified'}
- Wish For This Year: ${input.wish_for_year || 'Not specified'}
- Special Note: ${input.special_note || 'Not specified'}`;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await client.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: 'You write serene, deeply personal, authentic birthday notes and letters for couples. Never sound like a generic greeting card.',
            responseMimeType: 'application/json',
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.LOW
            },
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                messages: {
                  type: Type.ARRAY,
                  description: 'Exactly 12 distinct, warm, and intimate personalized short messages (1-2 sentences each).',
                  items: {
                    type: Type.STRING
                  }
                },
                letter: {
                  type: Type.STRING,
                  description: 'A personal, heartfelt birthday letter with gentle paragraph breaks.'
                }
              },
              required: ['messages', 'letter']
            }
          }
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed.messages) && parsed.messages.length >= 8 && parsed.letter) {
            let messages: string[] = parsed.messages;
            if (messages.length < 12) {
              const extra = generateFallbackMessages(input).slice(messages.length, 12);
              messages = [...messages, ...extra];
            } else if (messages.length > 12) {
              messages = messages.slice(0, 12);
            }
            return {
              messages,
              letter: parsed.letter
            };
          }
        }
      } catch (error: any) {
        // If 503 or demand spike, gracefully try the next candidate model
        const isDemandSpike = error?.status === 503 || error?.message?.includes('503') || error?.message?.includes('high demand');
        if (isDemandSpike) {
          console.warn(`Model ${modelName} experiencing high demand, falling back to next available model...`);
          continue;
        } else {
          console.warn(`Gemini generation with ${modelName} encountered an issue, trying next option:`, error?.message || error);
        }
      }
    }
  }

  // Graceful high-quality fallback generator built directly from user inputs
  return {
    messages: generateFallbackMessages(input),
    letter: generateFallbackLetter(input)
  };
}

function generateFallbackMessages(input: AIGenerationInput): string[] {
  const name = input.partner_name || 'Sarah';
  const nick = input.nickname ? `my ${input.nickname}` : 'love';
  
  const list: string[] = [];
  
  if (input.how_we_met && input.how_we_met.length > 5) {
    list.push(`I still remember the day we met: ${input.how_we_met.replace(/\.$/, '')}. It was the start of my favorite chapter.`);
  } else {
    list.push(`Meeting you was the quiet turning point of my entire life.`);
  }

  if (input.love_most && input.love_most.length > 5) {
    list.push(`What I love most about you is ${input.love_most.replace(/\.$/, '')}.`);
  } else {
    list.push(`The gentle kindness you bring into every room is something I cherish every day.`);
  }

  if (input.favorite_memory && input.favorite_memory.length > 5) {
    list.push(`One moment I will never forget: ${input.favorite_memory.replace(/\.$/, '')}.`);
  } else {
    list.push(`Every quiet memory we share has made my world feel warmer and safer.`);
  }

  if (input.favorite_thing && input.favorite_thing.length > 5) {
    list.push(`My favorite thing about being with you is ${input.favorite_thing.replace(/\.$/, '')}.`);
  } else {
    list.push(`Being with you turns ordinary days into something quietly extraordinary.`);
  }

  if (input.never_told && input.never_told.length > 5) {
    list.push(`Something I don't say enough: ${input.never_told.replace(/\.$/, '')}.`);
  } else {
    list.push(`Even when we are just sitting in silence, you are my favorite company.`);
  }

  if (input.wish_for_year && input.wish_for_year.length > 5) {
    list.push(`My wish for you this year: ${input.wish_for_year.replace(/\.$/, '')}.`);
  } else {
    list.push(`I wish for you a year filled with gentle mornings, quiet triumphs, and boundless joy.`);
  }

  if (input.special_note && input.special_note.length > 5) {
    list.push(`${input.special_note.replace(/\.$/, '')}`);
  } else {
    list.push(`You have this rare way of making everyone around you feel valued and understood.`);
  }

  // Add remaining foundational intimate notes
  list.push(`Thank you for being the person who knows all my quirks and loves me through them.`);
  list.push(`The sound of your laughter remains my absolute favorite sound in the world.`);
  list.push(`No matter how busy the world gets, coming back to you is always coming home.`);
  list.push(`I am so endlessly proud of the person you are and everything you create.`);
  list.push(`Happy Birthday, ${name}. Loving you is the easiest, truest thing I do.`);

  return list.slice(0, 12);
}

function generateFallbackLetter(input: AIGenerationInput): string {
  const name = input.partner_name || 'My Love';
  const sender = input.sender_name || 'Me';
  const nick = input.nickname ? `my ${input.nickname}` : '';

  let letter = `Dear ${name},\n\n`;
  letter += `Before anyone else reaches out today, I wanted to create a quiet moment just for you. Birthdays are usually busy and loud, but I hope this little space gives you a breath of peace and reminds you how deeply cherished you are.\n\n`;

  if (input.how_we_met || input.relationship_start_date) {
    letter += `Looking back to where our story started, every day since has felt a little brighter. `;
  }
  if (input.favorite_memory) {
    letter += `Thinking about our memories—like ${input.favorite_memory.toLowerCase().replace(/\.$/, '')}—reminds me of how lucky I am to share this journey with you.\n\n`;
  } else {
    letter += `From the simplest quiet mornings to our biggest adventures, having you in my life has been my greatest gift.\n\n`;
  }

  if (input.love_most) {
    letter += `I love ${input.love_most.toLowerCase().replace(/\.$/, '')}. You bring a softness into my life that nothing else can match. `;
  }

  if (input.wish_for_year) {
    letter += `This year, I wish for you: ${input.wish_for_year.toLowerCase().replace(/\.$/, '')}.\n\n`;
  } else {
    letter += `May this new year bring you all the peace, gentle victories, and joy you so effortlessly give to everyone around you.\n\n`;
  }

  letter += `Happy Birthday, ${name}${nick ? ' (' + nick + ')' : ''}.\n\nWith all my love,\n${sender}`;

  return letter;
}
