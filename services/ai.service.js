const Groq = require("groq-sdk");
const Note = require("../models/note");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 
 * @param {string} userId 
 * @param {string} question 
 * @returns {Promise<string>} 
 */
const generateResponse = async (userId, question) => {
  try {
    console.log("🔍 Fetching notes for user...");

    const notes = await Note.find({ user: userId }).select(
      "title content tags createdAt",
    );

    if (!notes || notes.length === 0) {
      return "I couldn't find any notes associated with your account to answer this question.";
    }

    console.log(`📝 Found ${notes.length} notes`);

    const notesContext = notes
      .map((note, index) => {
        return `Note ${index + 1}:
Title: ${note.title}
Tags: ${note.tags.join(", ")}
Content: ${note.content}
Date: ${note.createdAt}
---`;
      })
      .join("\n");

    const systemMessage = `You are a helpful AI assistant integrated into "MindBook", a note-taking application.
Your goal is to answer the user's questions based ONLY on their notes provided below.

Rules:
- You have access to the user's notes in the "Context" section.
- Answer questions accurately using the provided notes.
- If the answer to the question cannot be found in the notes, respond with: "I couldn't find this information in your notes."
- Do not make up information that is not in the notes.
- You can summarize, compare, and connect ideas from different notes.
- Keep your answers concise and helpful.

Context:
${notesContext}`;

    console.log("🤖 Calling Groq AI...");

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0.5,
      max_tokens: 500,
      top_p: 1,
      stream: false,
    });

    const answer = completion.choices[0]?.message?.content;

    if (!answer || answer.trim() === "") {
      return "I received an empty response. Please try rephrasing your question.";
    }

    console.log("✅ Response generated successfully!");
    return answer.trim();
  } catch (error) {
    console.error("❌ Groq AI Service Error:", error);

    if (error.status === 401 || error.message?.includes("API key")) {
      throw new Error(
        "Invalid Groq API key. Please check your GROQ_API_KEY in .env file.",
      );
    }

    if (error.status === 429) {
      throw new Error(
        "Groq API rate limit exceeded. Please wait a moment and try again.",
      );
    }

    if (error.status === 400) {
      throw new Error("Invalid request to Groq API. Please check your input.");
    }

    throw new Error(
      `Failed to generate AI response: ${error.message || "Unknown error"}`,
    );
  }
};

module.exports = {
  generateResponse,
};
