const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API client if key is present
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/**
 * Generate a complete book summary using Gemini AI
 * @param {Object} bookDetails - Book details from Google Books
 * @returns {Promise<Object>} Summarized content
 */
const generateBookSummary = async (bookDetails) => {
  if (!genAI) {
    console.warn('GEMINI_API_KEY is not configured. Falling back to simulated AI response.');
    return getMockSummary(bookDetails);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `
      You are an elite literary analyst and educational expert.
      Generate an original, educational, and insight-driven summary for the book:
      Title: "${bookDetails.title}"
      Author(s): "${bookDetails.author}"
      Genre/Categories: "${bookDetails.genre.join(', ')}"
      Google Books Description: "${bookDetails.description}"

      CRITICAL LEGAL REQUIREMENT:
      - Do NOT copy or reproduce copyrighted book texts verbatim.
      - Express summaries in your own highly professional words.
      - Focus on educational insights, key takeaways, and lessons.

      Respond ONLY with a valid JSON object matching the following TypeScript schema:
      {
        "quickSummary": "A concise 100-word overview summarizing the core message and target of the book.",
        "detailedSummary": "A comprehensive 500 to 1000 word detailed breakdown of the book's contents, structural parts, or chapters using clean markdown formatting (like ### Headings and bullet points). Do not mention chapters if they are not standard, but write at least 4 detailed sections.",
        "keyTakeaways": string[] // 4-6 primary intellectual or philosophical lessons from the book
        "lessons": string[] // 4-6 practical, core life/business lessons taught by the author
        "actionItems": string[] // 4-6 immediate, actionable checklist tasks a reader can apply in daily life
        "mainThemes": string[] // 3-5 themes as short tags (e.g. "Focus", "Self-discipline", "Productivity")
        "difficultyLevel": "Beginner" | "Intermediate" | "Advanced",
        "whoShouldRead": "A detailed 1-2 paragraph description of the target audience profile for this book.",
        "characters": { name: string, description: string }[] // If this is a fiction book or biography, list main characters/historical figures. If non-fiction, leave empty array or list key historical people mentioned.
        "readingTimeSaved": "A string describing estimated hours saved. For example, if average reading is 8 hours, return '7 hours 55 minutes' (calculated as: 8 hours minus 5 minutes read time)."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();

    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error generating summary from Gemini API:', error);
    throw new Error(`AI Summary Generation failed: ${error.message}`);
  }
};

/**
 * Handle a chat question relative to the book summary context
 * @param {Object} book - Complete book object from DB
 * @param {Array} chatHistory - List of past messages [{ sender: 'user'|'ai', message: string }]
 * @param {string} userMessage - The new user question
 * @returns {Promise<string>} AI response
 */
const chatWithBook = async (book, chatHistory, userMessage) => {
  if (!genAI) {
    console.warn('GEMINI_API_KEY is not configured. Falling back to simulated Chat.');
    return `[SIMULATED AI] This is a local mock response for: "${userMessage}". Because GEMINI_API_KEY is not set in backend .env, I cannot run real-time chat with "${book.title}". To fix this, provide a valid API key.`;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const formattedHistory = chatHistory.map(msg =>
      `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.message}`
    ).join('\n');

    const prompt = `
      You are an expert reading companion, discussant, and AI tutor for the book:
      Title: "${book.title}"
      Author: "${book.author}"

      Here is the book's core context, takeaways, and summaries to base your answers on:
      Quick Summary: ${book.quickSummary}
      Detailed Summary: ${book.detailedSummary}
      Key Takeaways: ${book.keyTakeaways.join(' | ')}
      Lessons: ${book.lessons.join(' | ')}
      Action Items: ${book.actionItems.join(' | ')}

      Respond to the user's question about the book. Keep your answer engaging, original, educational, and concise. Ensure you do not invent information outside the logical facts of the book. Do not copy copyrighted text.

      Chat History:
      ${formattedHistory}

      User: ${userMessage}
      Assistant:
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in chatWithBook service:', error);
    throw new Error('AI book chat failed.');
  }
};

/**
 * Compare two books based on summaries
 * @param {Object} bookA - Book A from database
 * @param {Object} bookB - Book B from database
 * @returns {Promise<Object>} Comparison data
 */
const compareBooks = async (bookA, bookB) => {
  if (!genAI) {
    console.warn('GEMINI_API_KEY is not configured. Falling back to simulated Comparison.');
    return getMockComparison(bookA, bookB);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const prompt = `
      Compare the following two books:
      Book A: "${bookA.title}" by ${bookA.author}
      - Quick Summary: ${bookA.quickSummary}
      - Difficulty: ${bookA.difficultyLevel}

      Book B: "${bookB.title}" by ${bookB.author}
      - Quick Summary: ${bookB.quickSummary}
      - Difficulty: ${bookB.difficultyLevel}

      Provide a clear comparison analyzing their main thesis, intended audience, core strengths, weaknesses, and a recommendation on when to read which book. Do not reproduce copyrighted texts.

      Return ONLY a valid JSON object matching the following structure:
      {
        "comparisonTable": {
          "mainIdea": {
            "bookA": "Core thesis of Book A in 2 sentences",
            "bookB": "Core thesis of Book B in 2 sentences"
          },
          "targetAudience": {
            "bookA": "Who should read Book A",
            "bookB": "Who should read Book B"
          },
          "strengths": {
            "bookA": "Key advantages of Book A's arguments/style",
            "bookB": "Key advantages of Book B's arguments/style"
          },
          "weaknesses": {
            "bookA": "Critiques or gaps in Book A",
            "bookB": "Critiques or gaps in Book B"
          },
          "readingDifficulty": {
            "bookA": "Reading level required for Book A (Beginner/Intermediate/Advanced)",
            "bookB": "Reading level required for Book B (Beginner/Intermediate/Advanced)"
          }
        },
        "overallTakeaway": "A 2-3 paragraph summary comparing the two works, explaining how they complement or contrast with each other, and who would benefit from reading which."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error comparing books with Gemini API:', error);
    throw new Error('AI comparison failed.');
  }
};

// --- Mock Data Fallbacks ---

const getMockSummary = (bookDetails) => {
  return {
    quickSummary: `This is a simulated AI summary for "${bookDetails.title}" because the backend does not have GEMINI_API_KEY configured. In a production environment, this text represents a highly detailed, 100-word overview highlighting the core principles of ${bookDetails.author}'s book, demonstrating how its ideas impact readers in various fields.`,
    detailedSummary: `### Section 1: Overview and Core Concepts\n\nThis is the detailed summary simulation. The book is structured around teaching individuals how to manage their habits, thoughts, or work methods to optimize outcome potentials. It suggests that consistency, rather than intensity, serves as the main driver for long-term improvement and peak performance.\n\n### Section 2: Core Frameworks\n\n- **Incremental Growth**: Highlighting that 1% positive changes yield compounding benefits over several months.\n- **Environmental Prominence**: Modifying one's physical surroundings to make desirable habits obvious and undesirable habits invisible.\n- **Feedback Loops**: Shortening the distance between performing an action and seeing a tangible feedback marker.\n\n### Section 3: Key Paradigms\n\nUnderstanding identity-based habits is essential. The author asserts that trying to modify behavior without shifting one's internal self-image creates cognitive friction, which typically leads to relapse. Instead of focusing on what you want to achieve, focus on the identity of the person who would easily accomplish that task.\n\n### Section 4: Implementation and Integration\n\nTo successfully incorporate these frameworks, readers must outline clear implementation intentions: determining exactly when, where, and how a new habit will be performed. By stacking new habits onto pre-existing, established routines, the mental load required to begin a habit is significantly lowered.`,
    keyTakeaways: [
      "Incremental growth compounds exponentially over time, similar to financial interest.",
      "Systems are more vital than goals; goals define direction, but systems drive actual progress.",
      "Habits are driven by a cognitive feedback loop: Cue, Craving, Response, and Reward.",
      "Shifting habits requires shifting internal identity beliefs, not just outcomes."
    ],
    lessons: [
      "Design your environment so that positive actions require the least frictional effort.",
      "Never miss twice: a single lapse is an accident, but a second consecutive lapse is the start of a bad habit.",
      "Reduce friction for good habits, and escalate friction for negative habits to make them difficult.",
      "Focus on continuous, marginal gains in everyday schedules to achieve long-term breakthroughs."
    ],
    actionItems: [
      "Write down a habit scorecard cataloging every action in your daily routine.",
      "Set an implementation intention: 'I will [BEHAVIOR] at [TIME] in [LOCATION]'.",
      "Redesign your workspace to remove cues that trigger distractions (e.g. place phone in drawer).",
      "Reward yourself immediately after finishing a targeted difficult habit."
    ],
    mainThemes: ["Productivity", "Habits", "Growth Mindset", "Self-Improvement"],
    difficultyLevel: "Beginner",
    whoShouldRead: `This book is perfect for professionals, students, creators, or anyone searching for a pragmatic framework to overhaul their habits. If you feel stuck in recursive loops of starting and stopping goals, this guide provides the behavioral tools needed to construct consistent, long-term change.`,
    characters: [
      { name: "The Author", description: "Acts as the guide, compiling scientific research and personal anecdotes to detail behavioral psychology." }
    ],
    readingTimeSaved: "7 hours 50 minutes"
  };
};

const getMockComparison = (bookA, bookB) => {
  return {
    comparisonTable: {
      mainIdea: {
        bookA: `Focuses on how minor, systemic, and environmental adjustments can build compounding habits and behavior change.`,
        bookB: `Focuses on how deep work, focus, and intentional isolation can create hyper-productivity and high-quality outputs.`
      },
      targetAudience: {
        bookA: `Anyone wanting to build better daily routines or break bad habits.`,
        bookB: `Knowledge workers, writers, software developers, and students aiming to do deep cognitive work.`
      },
      strengths: {
        bookA: `Extremely actionable, clear blueprints, and supported by modern behavioral psychology examples.`,
        bookB: `Strong critique of modern digital distractions, highlighting intense focus as a rare and valuable commodity.`
      },
      weaknesses: {
        bookA: `Can feel overly repetitive in reinforcing the cue-craving loop.`,
        bookB: `Some strategies (like taking weeks off in a cabin) are impractical for standard corporate employees.`
      },
      readingDifficulty: {
        bookA: bookA.difficultyLevel || "Beginner",
        bookB: bookB.difficultyLevel || "Intermediate"
      }
    },
    overallTakeaway: `Both "${bookA.title}" and "${bookB.title}" offer excellent frameworks for productivity, but they attack the problem from different sides. "${bookA.title}" focuses on micro-actions—the systems and cues that govern your automatic daily routines. Meanwhile, "${bookB.title}" targets macro-focus—how to shield your mind from distraction to accomplish cognitively demanding projects. Integrating both concepts allows you to build highly optimized environments while dedicating intense, undisturbed blocks of time to your highest-leverage work.`
  };
};

module.exports = {
  generateBookSummary,
  chatWithBook,
  compareBooks
};
