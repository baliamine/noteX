const aiService = require("../services/ai.service");

const askAI = async (req, res) => {
  try {
    const { question } = req.body || {};

    const userId = req.user._id;

    if (!question) {
      return res.status(400).json({ message: "Question is required." });
    }

    const answer = await aiService.generateResponse(userId, question);

    res.status(200).json({
      answer,
    });
  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({
      message:
        error.message || "An error occurred while processing your request.",
    });
  }
};

module.exports = {
  askAI,
};
