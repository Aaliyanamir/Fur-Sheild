const { GoogleGenerativeAI } = require('@google/generative-ai');

const ALLOWED_PATHS = new Set([
  '/',
  '/signup',
  '/login',
  '/adopt',
  '/shop',
  '/checkout',
  '/book-vet',
  '/book-appointment',
  '/care-hub',
  '/dashboard',
  '/my-pets',
  '/orders',
  '/profile',
  '/settings',
  '/about',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
  '/status',
]);

const SYSTEM_PROMPT = `You are FurBot, the in-app assistant for FurShield, a pet-care platform that connects pet owners, veterinarians, and rescue shelters.

Answer using ONLY this site knowledge. Never invent pages, prices, live inventory, clinic names, or appointment slots.

FurShield pages:
- / — Home
- /signup, /login — Create account or sign in
- /adopt — Browse adoptable dogs, cats, and birds
- /shop — Pet food, toys, and supplies; /checkout to pay
- /book-vet — Book a veterinarian (also /book-appointment after login)
- /care-hub — Training, nutrition, and grooming guides
- /dashboard, /my-pets, /orders — Owner health records, pets, and orders (login required)
- /profile, /settings — Account
- /about, /contact, /faq, /privacy, /terms, /status
- Bottom-left SOS button — nearby 24/7 clinics for emergencies
- Vet staff use /vet and /appointments. Shelter admins use /shelter and /pipeline.

Rules:
- Reply in the same language as the user (English, Urdu, or mixed).
- You are informational only, not a veterinarian. For urgent symptoms (blood, trouble breathing, collapse, poisoning, severe pain, seizures), tell them to use SOS and book a vet. Never diagnose.
- If you do not know, say so and suggest /contact or /faq.
- Keep answers short (2–5 sentences) and practical.
- Always respond with JSON only, no markdown:
{"text":"your reply","link":{"text":"button label","url":"/adopt"} or null}
- link.url must be one of the paths listed above, or null if no navigation is needed.`;

const parseModelJson = (raw) => {
  if (!raw || typeof raw !== 'string') return null;
  let text = raw.trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) text = fenced[1].trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
};

const sanitizeLink = (link) => {
  if (!link || typeof link !== 'object') return null;
  const url = typeof link.url === 'string' ? link.url.trim() : '';
  const label = typeof link.text === 'string' ? link.text.trim() : '';
  if (!url || !ALLOWED_PATHS.has(url)) return null;
  return { text: label || 'Open page', url };
};

const toGeminiHistory = (history) => {
  if (!Array.isArray(history)) return [];
  return history
    .slice(-10)
    .filter((m) => m && (m.role === 'user' || m.role === 'model') && typeof m.text === 'string' && m.text.trim())
    .map((m) => ({
      role: m.role,
      parts: [{ text: m.text.trim().slice(0, 2000) }],
    }));
};

const sendChat = async (req, res) => {
  try {
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        success: false,
        message: 'FurBot is not configured yet. Add GEMINI_API_KEY to the server .env file.',
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 512,
        responseMimeType: 'application/json',
      },
    });

    const history = toGeminiHistory(req.body.history);
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message.slice(0, 2000));
    const raw = result.response.text();
    const parsed = parseModelJson(raw);

    const text =
      parsed && typeof parsed.text === 'string' && parsed.text.trim()
        ? parsed.text.trim()
        : raw.trim() || 'I could not generate a reply. Please try again.';

    return res.status(200).json({
      success: true,
      text,
      link: sanitizeLink(parsed?.link),
    });
  } catch (error) {
    console.error('FurBot chat error:', error?.message || error);
    return res.status(503).json({
      success: false,
      message: 'FurBot is temporarily unavailable. Please try again in a moment.',
    });
  }
};

module.exports = { sendChat };
