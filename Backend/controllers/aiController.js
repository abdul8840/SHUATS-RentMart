import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate forum post content
export const generateForumContent = async (req, res) => {
  try {
    const { prompt, type } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let systemPrompt = '';

    switch (type) {
      case 'title':
        systemPrompt = `You are a helpful assistant for SHUATS (Sam Higginbottom University of Agriculture, Technology and Sciences) campus forum. Generate 5 creative and engaging post titles based on the following topic. Return only the titles, numbered 1-5. Keep them concise and relevant to a university campus setting.\n\nTopic: ${prompt}`;
        break;
      case 'caption':
        systemPrompt = `You are a helpful assistant for SHUATS campus forum. Generate a short, engaging caption (2-3 sentences) for a forum post about the following topic. Make it suitable for a university campus audience.\n\nTopic: ${prompt}`;
        break;
      case 'article':
        systemPrompt = `You are a helpful assistant for SHUATS (Sam Higginbottom University of Agriculture, Technology and Sciences) campus forum. Write a well-structured forum article/post (300-500 words) about the following topic. Include an introduction, main content with key points, and a conclusion. Make it informative and engaging for university students.\n\nTopic: ${prompt}`;
        break;
      case 'description':
        systemPrompt = `You are a helpful assistant for SHUATS RentMart, a campus rental and resale platform. Generate an attractive and detailed item description (100-200 words) for selling/renting the following item on a campus marketplace. Include key details students would want to know.\n\nItem: ${prompt}`;
        break;
      case 'improve':
        systemPrompt = `You are a helpful assistant for SHUATS campus forum. Improve the following text by making it more engaging, clear, and well-structured while keeping the original meaning. Return only the improved text.\n\nOriginal text: ${prompt}`;
        break;
      default:
        systemPrompt = `You are a helpful assistant for SHUATS campus forum and marketplace. Help with the following request:\n\n${prompt}`;
    }

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      generatedContent: text,
      type
    });
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({
      success: false,
      message: 'AI content generation failed. Please try again.',
      error: error.message
    });
  }
};

// Generate item listing description
export const generateItemDescription = async (req, res) => {
  try {
    const { itemName, category, condition, listingType } = req.body;

    if (!itemName) {
      return res.status(400).json({ success: false, message: 'Item name is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a helpful assistant for SHUATS RentMart, a student campus marketplace. Generate an attractive item listing description (100-150 words) for the following:

Item: ${itemName}
Category: ${category || 'General'}
Condition: ${condition || 'Good'}
Listing Type: ${listingType || 'sell'}

Make it appealing to fellow university students. Include practical details and why they should consider this item. Keep it friendly and concise. Return only the description text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      generatedDescription: text
    });
  } catch (error) {
    console.error('AI description error:', error);
    res.status(500).json({
      success: false,
      message: 'AI description generation failed. Please try again.'
    });
  }
};

// Chat with AI assistant
export const chatWithAI = async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are SHUATS RentMart AI Assistant, helping students at Sam Higginbottom University of Agriculture, Technology and Sciences (SHUATS). You help with:
- Writing item descriptions for the campus marketplace
- Creating forum posts and articles
- Suggesting meeting locations on campus
- General campus-related queries
- Tips for buying/selling/renting items safely on campus

Keep responses concise, helpful, and student-friendly.

${context ? `Context: ${context}\n` : ''}
Student's question: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      reply: text
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      message: 'AI assistant is temporarily unavailable.'
    });
  }
};