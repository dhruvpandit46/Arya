import express from "express";
import cors from "cors";
import { Groq } from "groq-sdk";

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ 
  apiKey: "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" 
});

app.post("/chat", async (req, res) => {
  try {
    const prompt = req.body.prompt;
    
    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    console.log("Received prompt:", prompt);

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile", // Valid Groq model
      temperature: 0.8,
      max_tokens: 512,
      top_p: 0.9,
      stream: false
    });

    const aiReply = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't generate a reply.";
    console.log("AI Reply:", aiReply);
    
    res.json({ text: aiReply });

  } catch (err) {
    console.error("Server error details:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ 
      error: "Server error", 
      details: err.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
