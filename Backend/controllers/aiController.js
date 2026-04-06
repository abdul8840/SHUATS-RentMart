import OpenAI from "openai";

// OpenRouter client
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// ===============================
// GENERATE FORUM CONTENT
// ===============================
export const generateForumContent = async (req, res) => {
  try {
    const { prompt, type } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    let systemPrompt = "";

    switch (type) {
      case "title":
        systemPrompt = `Generate 5 engaging titles for students.\n\nTopic: ${prompt}`;
        break;

      case "caption":
        systemPrompt = `Write a short caption (2-3 lines):\n\n${prompt}`;
        break;

      case "article":
        systemPrompt = `Write a 300-500 word article:\n\n${prompt}`;
        break;

      case "description":
        systemPrompt = `Write a product description (100-150 words):\n\n${prompt}`;
        break;

      case "improve":
        systemPrompt = `Improve this text:\n\n${prompt}`;
        break;

      default:
        systemPrompt = prompt;
    }

    const completion = await openai.chat.completions.create({
      model: "openrouter/auto", // automatically picks free model
      messages: [
        {
          role: "system",
          content: "You are a helpful campus marketplace assistant.",
        },
        {
          role: "user",
          content: systemPrompt,
        },
      ],
    });

    res.json({
      success: true,
      generatedContent: completion.choices[0].message.content,
      type,
    });

  } catch (error) {
    console.error("AI error:", error);

    res.status(500).json({
      success: false,
      message: "AI failed",
      error: error.message,
    });
  }
};

// ===============================
// GENERATE ITEM DESCRIPTION
// ===============================
export const generateItemDescription = async (req, res) => {
  try {
    const { itemName, category, condition, listingType } = req.body;

    if (!itemName) {
      return res.status(400).json({
        success: false,
        message: "Item name required",
      });
    }

    const prompt = `Write a compelling student-friendly product description:

Item: ${itemName}
Category: ${category || "General"}
Condition: ${condition || "Good"}
Type: ${listingType || "sell"}`;

    const completion = await openai.chat.completions.create({
      model: "openrouter/auto",
      messages: [
        { role: "system", content: "Marketplace assistant" },
        { role: "user", content: prompt },
      ],
    });

    res.json({
      success: true,
      generatedDescription: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("AI description error:", error);

    res.status(500).json({
      success: false,
      message: "AI description failed",
      error: error.message,
    });
  }
};

// ===============================
// CHAT WITH AI
// ===============================
export const chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message required",
      });
    }

    const prompt = `${context ? `Context: ${context}\n` : ""}User: ${message}`;

    const completion = await openai.chat.completions.create({
      model: "openrouter/auto",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful student marketplace assistant. Keep answers short and useful.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    res.json({
      success: true,
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("AI chat error:", error);

    res.status(500).json({
      success: false,
      message: "AI unavailable",
      error: error.message,
    });
  }
};