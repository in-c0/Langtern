import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
//import authRoutes from "./routes/authRoutes.js"
import { loginUser, registerUser } from "./controllers/userController.js"
import { GoogleGenAI } from '@google/genai';

// Load environment variables
dotenv.config()
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// Connect to database



const app = express()

// Middleware
app.use(express.json())
app.use(
  cors({
    origin: "*", // Allow all origins
    credentials: true,
  }),
)

// Direct routes at root level
app.post("/login", loginUser)
app.post("/register", registerUser)

app.post('/translate', async (req, res) => {

  const { text, targetLang } = req.body;
  const prompt = `Please translate the following text into ${targetLang}, only return the translated text and nothing else: ${text}`
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    // Adjust response based on the actual shape of the returned data
    res.json({ response: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI request failed' });
  }
});

app.get('/test', async (req, res) => {
  return res.status(200).json({ test: 'TEST' });
});


app.post('/searchJob', async (req, res) => {

  const supabase = await connectDB()
  const { searchValue, skills, languages } = req.body;
  if (!searchValue) {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }

  const { data, error } = await supabase
      .from('jobs')  // Replace 'jobs' with your table name
      .select('*')
      .or(`country.eq.${searchValue},city.eq.${searchValue}`)  // Matching country or city

    //res.json({ response: data });
    const dataString = JSON.stringify(data);
    const prompt = `I need your help finding the best possible job options from the options below. Please find jobs that match some if not all the info set by the user. Only return the jobs as a JSON Object, do not return anything else. The user information is as follows:

    Skills: ${skills}

    Languages: ${languages}


    Here are all the jobs, they are in JSON format:
    ${dataString}
      `
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt,
      });
      var cleanData = response.text;
      cleanData = cleanData.replace("json","").replaceAll("\n"," ").replaceAll("```"," ")
      res.json({ response: JSON.parse(cleanData), prompt:prompt, data:data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'AI request failed' });
    }
});




// API routes under /api prefix
//app.use("/api/auth", authRoutes)

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...")
})

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
