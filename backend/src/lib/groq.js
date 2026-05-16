const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateNoteInsights = async (content, title) => {
  try {
    const response = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that analyzes notes and extracts key information.
Always respond with valid JSON only, no markdown, no explanation.`,
        },
        {
          role: "user",
          content: `Analyze this note and return JSON with exactly these fields:
{
  "summary": "2-3 sentence summary of the note",
  "action_items": ["action 1", "action 2"],
  "suggested_title": "a better title if needed"
}

Note Title: ${title}
Note Content: ${content}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const text = response.choices[0].message.content.trim();
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("Groq error:", err.message);
    // Graceful fallback
    return {
      summary: "AI summary unavailable. Please try again.",
      action_items: [],
      suggested_title: title,
    };
  }
};

module.exports = { generateNoteInsights };