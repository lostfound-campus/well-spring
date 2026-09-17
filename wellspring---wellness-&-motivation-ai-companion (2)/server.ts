import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily or when key is available
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Helper to call Gemini with model fallback if a model experiences high demand or temporary 503
async function generateWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    config?: any;
  }
) {
  const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      return response;
    } catch (err: any) {
      console.warn(`Model ${model} encountered issue: ${err?.message || err}. Trying fallback...`);
      lastError = err;
    }
  }

  throw lastError;
}

// Curated intelligent fallbacks so the app is always functional even without an API key
function getCuratedMeditationScript(topic: string, userName?: string): string {
  const name = userName ? userName : 'my friend';
  const cleanTopic = (topic || '').toLowerCase();

  if (cleanTopic.includes('sleep') || cleanTopic.includes('wind-down') || cleanTopic.includes('night') || cleanTopic.includes('bed')) {
    return `Welcome to your evening wind-down, ${name}... Gently let your shoulders drop... and close your eyes softly... Let go of every task, conversation, and hurry from today... With each slow breath out, release any tightness in your forehead, jaw, and chest... You have done enough today... You are safe, comfortable, and at peace... Sleep will come naturally and softly... Rest deeply now...`;
  } else if (cleanTopic.includes('gratitude') || cleanTopic.includes('morning') || cleanTopic.includes('energy')) {
    return `Good morning and welcome, ${name}... Place a gentle hand on your heart... Inhale slowly and fill your lungs with fresh, quiet vitality... Exhale and smile gently... Today is an unwritten page filled with small gifts and quiet moments... You carry kindness, resilience, and strength within you... Step into this day with trust and calm...`;
  } else if (cleanTopic.includes('study') || cleanTopic.includes('exam') || cleanTopic.includes('focus') || cleanTopic.includes('exam')) {
    return `Take a grounding, steady breath in, ${name}... and let it out with a quiet sigh... Your mind is capable, clear, and focused... You do not have to conquer everything all at once... Just this one task, this one step, with steady patience... Trust the preparation you put in... Clear away the noise... You are ready, calm, and composed...`;
  } else if (cleanTopic.includes('heart') || cleanTopic.includes('miss') || cleanTopic.includes('sad') || cleanTopic.includes('grief')) {
    return `Place both hands gently over your chest, ${name}... Breathe into the tender spaces of your heart... It is completely okay to feel deeply, to miss someone, or to carry a quiet sorrow... Honor what you are feeling without judgment... Love and memory remain rooted in warmth... Give yourself compassion today... You are held, you are worthy, and you are not alone...`;
  } else {
    return `Take a slow, deep breath in, ${name}... and let the air flow gently all the way out... Allow your body to settle completely into this present moment... Notice the quiet rhythm of your natural breath... Inhale tranquility and stillness... Exhale tension, uncertainty, and hurry... You are grounded, centered, and right where you need to be... Carry this calm lightness with you...`;
  }
}

function getCuratedJournalAnalysis(entry: string, userName?: string, mood?: string) {
  const name = userName || 'friend';
  const text = (entry || '').toLowerCase();
  const selectedMood = (mood || '').toLowerCase();

  let sentiment = 'Seeking Balance & Calm';
  let title = `A Gentle Note for You, ${name}`;
  let comfortText = `Thank you for taking a moment to write down what's inside your heart. Holding all these thoughts can feel heavy, but acknowledging them is a courageous first step towards finding peace.`;
  let microSteps = [
    'Take 3 slow, deep diaphragmatic breaths right now.',
    'Drink a warm glass of water or soothing herbal tea.',
    'Step away from screens for 5 minutes and stretch gently.',
  ];
  let affirmation = `I give myself permission to rest and take things one gentle step at a time.`;

  if (selectedMood === 'anxiety' || text.includes('anxi') || text.includes('panic') || text.includes('nervous') || text.includes('overwhelm')) {
    sentiment = 'Anxious & Seeking Grounding';
    title = `Breathe Through the Waves, ${name}`;
    comfortText = `Anxiety can make the world feel rushing and intense. Remember: your feelings are valid, but they are not permanent. You are safe in this present moment.`;
    microSteps = [
      'Try the 5-4-3-2-1 sensory grounding technique: name 5 things you can see around you.',
      'Place your feet flat on the ground and feel the solid earth supporting you.',
      'Inhale slowly for 4 seconds, hold for 4, and exhale softly for 6.'
    ];
    affirmation = `I am safe in this breath. I release what I cannot control.`;
  } else if (selectedMood === 'cry' || text.includes('cry') || text.includes('tear') || text.includes('weep') || text.includes('heartbreak')) {
    sentiment = 'Emotional Release & Tender Healing';
    title = `Tears Are Gentle Rain for the Soul, ${name}`;
    comfortText = `Letting yourself cry is a sign of strength and honest vulnerability, not weakness. Crying releases tension that words cannot always reach. Be extra tender with yourself today.`;
    microSteps = [
      'Gently wash your face with cool water or place a soft cloth over your eyes.',
      'Wrap yourself in your favorite blanket with a warm, comforting drink.',
      'Rest without judging your tears—your heart is healing.'
    ];
    affirmation = `It is safe to feel, safe to cry, and safe to heal at my own pace.`;
  } else if (selectedMood === 'sad' || text.includes('sad') || text.includes('depress') || text.includes('low') || text.includes('lonely') || text.includes('miss')) {
    sentiment = 'Tender Heart & Quiet Reflection';
    title = `Holding Space for Your Heart, ${name}`;
    comfortText = `Sadness can feel like a quiet weight, but you do not have to carry it all alone. Acknowledge your feelings with compassion, knowing that tomorrow brings a fresh sunrise.`;
    microSteps = [
      'Listen to a comforting ambient melody in Zen Mode.',
      'Send a small hello or message to a trusted friend or family member.',
      'Allow yourself to take the rest of today at a slow, peaceful pace.'
    ];
    affirmation = `I am gentle with myself. Joy will return like morning light.`;
  } else if (selectedMood === 'happy' || text.includes('happy') || text.includes('good') || text.includes('proud') || text.includes('grateful') || text.includes('win')) {
    sentiment = 'Radiant Joy & Gratitude';
    title = `Celebrating Your Light, ${name}`;
    comfortText = `What a beautiful day to celebrate! Anchoring these bright moments of joy and gratitude creates a lasting reservoir of strength and peace for your mind.`;
    microSteps = [
      'Write down 3 specific little moments that made you smile today.',
      'Share your positive energy with someone you care about.',
      'Take a deep breath and let this feeling of fulfillment soak in.'
    ];
    affirmation = `I embrace joy, abundance, and the warmth of this present moment.`;
  } else if (text.includes('tired') || text.includes('exhaust') || text.includes('stress') || text.includes('burnout') || text.includes('work')) {
    sentiment = 'Gently Recharging from Fatigue';
    title = `Honor Your Need for Rest, ${name}`;
    comfortText = `You have been carrying a lot lately, and feeling tired or overwhelmed is your mind and body asking for genuine kindness. Give yourself permission to pause without guilt.`;
    microSteps = [
      'Unclench your jaw, drop your shoulders, and relax your hands.',
      'Put your phone on Do Not Disturb for 15 quiet minutes.',
      'Jot down just ONE small thing you can comfortably let go of today.',
    ];
    affirmation = `My worth is not measured by non-stop productivity; rest is my right and remedy.`;
  }

  return { sentiment, title, comfortText, microSteps, affirmation };
}

function getCuratedChatFallback(userMessage: string, userName?: string): string {
  const name = userName || 'my friend';
  const text = (userMessage || '').toLowerCase();

  if (text.includes('joke') || text.includes('funny') || text.includes('laugh')) {
    const jokes = [
      `Why did the scarecrow win an award? Because he was outstanding in his field! 😄 Hope that brought a little smile to your face, ${name}!`,
      `Why do we tell actors to "break a leg"? Because every play has a cast! 🎭 Don't worry, I've got plenty more where that came from!`,
      `What did one ocean say to the other ocean? Nothing, they just waved! 🌊 How are you feeling right now?`,
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  if (text.includes('miss') || text.includes('lonely') || text.includes('sad') || text.includes('cry')) {
    return `I can feel the tenderness in what you're saying, ${name}. Missing someone or feeling lonely can feel like a quiet ache inside. Please know that I'm right here with you. Would you like to talk more about what you miss about them, or would you prefer a comforting story or a relaxing breath together?`;
  }

  if (text.includes('stress') || text.includes('exhaust') || text.includes('tired') || text.includes('overwhelm') || text.includes('exam') || text.includes('study')) {
    return `Take a slow, deep breath, ${name}... You have been working so hard and carrying so much on your shoulders. It's completely natural to feel exhausted. Remember, you don't need to figure out everything right this second. What is one small thing that would give you comfort right now?`;
  }

  if (text.includes('enna panra') || text.includes('epdi iruka') || text.includes('vanakkam')) {
    return `Nallaa iruken ${name}! Ungaloda conversation pannuradhula romba sandhosham. Unga day epdi pogudhu? Tell me everything on your mind, na un kooda irukken! 🌸`;
  }

  return `I hear you, ${name}. Thank you for sharing that with me. Even in busy or turbulent moments, remember to give yourself grace and kindness. I'm right here whenever you want to talk or unwind. How does your heart feel right now?`;
}

// Real Gemini Chat Endpoint
app.post('/api/chat', async (req, res) => {
  const { messages, userName, enableSearch } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const lastUserMsg = messages[messages.length - 1]?.text || '';

  try {
    const ai = getGeminiClient();
    if (!ai) {
      const fallbackReply = getCuratedChatFallback(lastUserMsg, userName);
      return res.json({ text: fallbackReply });
    }

    const systemInstruction = `You are Wellspring, an empathetic, perceptive, and genuinely caring wellness companion and supportive friend.

Core Personality & Communication Rules:
1. Talk like a real human companion, NOT like an artificial canned chatbot or robotic search output.
2. Meet the user exactly where they are emotionally:
   - If they are heartbroken, lonely, or missing someone, listen with true warmth, validate their hurt, and give them a safe space without judging or rushing them to "fix" everything instantly.
   - If they are stressed by exams, studies, programming, or life responsibilities, offer calm, grounded encouragement and help break things down into simple, manageable steps.
   - If they need a joke, tell a clever, relatable, funny joke with playful banter.
   - If they are having a good day or celebrating a win, be authentically excited with them!
3. Language & Dialects:
   - You seamlessly understand and reply in the user's preferred language or style (English, Tamil, Tanglish, Hindi, etc.).
   - If they use slang or mixed language, reply naturally in that same rhythm.
   - Never criticize or point out typos or grammar mistakes; smoothly understand their intended meaning.
4. Voice & Tone:
   - Keep replies conversational and easy to read (typically 1 to 3 thoughtful paragraphs or natural dialogue).
   - Use warm punctuation and occasional emojis naturally.
   - If the user's name is provided (${userName || 'Friend'}), weave it in warmly when it feels natural.`;

    // Map conversation history to Gemini contents format
    // Keep last 15 messages for rich context
    const recentMessages = messages.slice(-15);
    const contents = recentMessages.map((m: { role: string; text: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    const config: any = {
      systemInstruction,
      temperature: 0.85,
    };

    if (enableSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await generateWithFallback(ai, {
      contents,
      config,
    });

    const replyText = response.text || getCuratedChatFallback(lastUserMsg, userName);
    return res.json({ text: replyText });
  } catch (error: any) {
    console.error('Gemini Chat Error, applying fallback:', error);
    const fallbackReply = getCuratedChatFallback(lastUserMsg, userName);
    return res.json({ text: fallbackReply });
  }
});

// Real Gemini Mood Journal Analysis
app.post('/api/journal', async (req, res) => {
  const { entry, userName, mood } = req.body;

  if (!entry || typeof entry !== 'string') {
    return res.status(400).json({ error: 'Journal entry text is required' });
  }

  try {
    const ai = getGeminiClient();
    if (!ai) {
      const fallbackResult = getCuratedJournalAnalysis(entry, userName, mood);
      return res.json(fallbackResult);
    }

    const moodContext = mood ? `Their current emotional state is marked as: "${mood}" (happy/anxiety/sad/cry).` : '';
    const prompt = `Analyze this personal diary / journal reflection from ${userName || 'a friend'}:
${moodContext}
"${entry}"

Provide a compassionate psychological and wellness breakdown in JSON with:
1. sentiment: a short 2-4 word mood descriptor (e.g., "Overwhelmed & Seeking Peace", "Quietly Hopeful", "Exhausted but Resilient", "Tender & Healing", "Radiant & Grateful").
2. title: a gentle, supportive heading for their reflection.
3. comfortText: 2-3 heartfelt sentences offering validation, empathy, and perspective on their entry.
4. microSteps: exactly 3 actionable, low-effort micro self-care steps they can take right now.
5. affirmation: a memorable, inspiring personal affirmation quote.`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING },
            title: { type: Type.STRING },
            comfortText: { type: Type.STRING },
            microSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            affirmation: { type: Type.STRING },
          },
          required: ['sentiment', 'title', 'comfortText', 'microSteps', 'affirmation'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini Journal Error, applying fallback:', error);
    const fallbackResult = getCuratedJournalAnalysis(entry, userName);
    return res.json(fallbackResult);
  }
});

// Real Gemini Voice Meditation Script Generator
app.post('/api/meditation', async (req, res) => {
  const { topic, userName } = req.body;
  const targetTopic = topic || 'Deep Calm and Relaxation';

  try {
    const ai = getGeminiClient();
    if (!ai) {
      const fallbackScript = getCuratedMeditationScript(targetTopic, userName);
      return res.json({ script: fallbackScript });
    }

    const prompt = `Write a soothing, 45-second spoken guided meditation for ${userName || 'a friend'} focusing on: "${targetTopic}".
Keep the pacing slow and gentle. Include natural pauses marked with "...". The voice should feel safe, grounding, and kind. Return only the spoken script.`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
    });

    const script = response.text || getCuratedMeditationScript(targetTopic, userName);
    return res.json({ script });
  } catch (error: any) {
    console.error('Gemini Meditation Error, applying fallback:', error);
    const fallbackScript = getCuratedMeditationScript(targetTopic, userName);
    return res.json({ script: fallbackScript });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wellspring server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
