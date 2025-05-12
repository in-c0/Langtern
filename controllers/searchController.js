//const axios = require('axios');
const { supabase } = require("../config/db.js")

const API_KEY = process.env.GEMINI_API_KEY // Replace with your actual API key
// @desc    Search users
// @route   GET /search
// @access  Public
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query

    if (!query) {
      return res.status(400).json({ message: "Search query is required" })
    }

    const API_KEY = process.env.GEMINI_API_KEY
    const GEMINI_API_URL =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + API_KEY

    const prompt = "Whats the capital of Australia" // Replace with dynamic prompt if needed
    console.log(prompt)

    let geminiResponse = null

    try {
      const fetchResponse = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      })

      const data = await fetchResponse.json()
      console.log(fetchResponse)
      console.log("TEXT: ", data.candidates?.[0]?.content?.parts?.[0]?.text)
      console.log("SENT PROMPT")
      console.log("FINISHED", prompt)
      console.log("URL: ", GEMINI_API_URL)
      geminiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response."
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      geminiResponse = error.message
    }

    res.json({
      res: geminiResponse,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
