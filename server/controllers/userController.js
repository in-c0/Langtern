//const pool = require('../db');
const bcrypt = require('bcrypt');
const axios = require('axios');

const registerUser = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password || password.length < 8) {
		return res.status(400).json({ error: 'Invalid email or password too short' });
	}

	try {
		const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
	if (userExists.rows.length > 0) {
		return res.status(409).json({ error: 'User already exists' });
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);

	res.status(201).json({ message: 'User registered successfully' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Server error' });
	}
};

const loginUser = async (req, res) => {

	const { email, password } = req.body;
	if(!email || !password || password.length < 8)
	{		
		return res.status(400).json({ error: 'Invalid email or password too short' });
	}
	try {
		const hashedPassword = await bcrypt.hash(password, 10);
		const userExists = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, hashedPassword]);
		if (userExists.rows.length > 0) {
			return res.status(200).json({login : true});
		}
		else
		{
			return res.status(409).json({ error: 'Incorrect username/password' });
		}
	}
	catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Server error' });
	}
};

const getUserInfo = () =>{
	const data = {
		"skills": ["Technology"],
		"languages": [{ "language": "English", "proficiency": 85, "wantToLearn": false }]
	}
	return data;
	const { email, password } = req.body;
	/*
	// Input validation
	if (!email || !password || password.length < 8) {
	return res.status(400).json({ message: 'Invalid email or password.' });
	}

	try {
	// Query the database to check if the user exists
	const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

	// If no user found, return null or an error message
	if (result.rows.length === 0) {
		return res.status(404).json({ message: 'User not found.' });
	}

	// User found, compare the hashed password
	const user = result.rows[0];
	const isPasswordValid = await bcrypt.compare(password, user.password);

	if (!isPasswordValid) {
		return res.status(401).json({ message: 'Invalid password.' });
	}

	// User is authenticated, return user info
	const userInfo = {
		firstName: user.firstName,
		lastName: user.lastName,
		profile: user.profile,
		skills: ["Technology"],
		languages: [{ language: "English", proficiency: 85, wantToLearn: false }]
	};

	return res.status(200).json(userInfo); // You can send back the user info here

	} catch (err) {
	console.error(err);
	return res.status(500).json({ message: 'Server error.' });
	}*/
}


const searchHandler = async (req, res) => {

	const userInfo = getUserInfo();
	if(userInfo != null)
	{		
		const { input } = req.body;
		const prompt = `
	I need your help to write an SQL query to find the most relevant jobs for a user based on their skills, languages, and location preferences. Only return the finished SQL statment, nothing else. The user has the following preferences:

	Skills: ${userInfo.skills}

	Languages: ${userInfo.languages}

	They search the phrase ${input}

	The database structure is as follows:

	Table: jobs

	Columns:

	name (Company name)

	location (City, Country)

	bio (Bio about the company)

	languages (JSON array, e.g., { "language": "English", "proficiency": 85, "wantToLearn": false })

	skills (Array, e.g., ["Business Development", "Technology"])

	field (Technology, Business, Sales)

	availability (Full-Time, Part-Time, Casual)

	workArrangement (Remote, In-Person, Hybrid)

	Your task is to:

	Find jobs that match the user's skill preference (Technology).

	Find jobs where the user's preferred language (English) is listed.

	Find jobs that are located in Japan (the country the user is interested in).

	Rank the jobs based on how well they match these preferences.

	The query should calculate a matching score for each job:
	`;
	//res.status(200).json({"prompt": prompt});
		if (!input) {
			return res.status(400).json({ error: 'Missing input in body' });
		}

		try {
			const response = await axios.post(
			'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
			{
				contents: [{ parts: [{ text: prompt }] }],
			},
			{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
			},
			}
		);

		res.json({ result: response.data });
		} catch (err) {
			console.error(err.response?.data || err);
			//res.status(500).json({ error: 'Error contacting Gemini API' });
			const responseTest = {
				id: "5",
				name: "Seoul Tech Startup",
				type: "business",
				location: "Seoul, South Korea",
				bio: "Innovative startup in the fintech space",
				languages: [
				{ language: "Korean", proficiency: 100, wantToLearn: false },
				{ language: "English", proficiency: 65, wantToLearn: true },
				],
				skills: ["Business Development", "Market Research", "Data Analysis"],
				field: "Technology",
				availability: "Full-time",
				duration: "6 months",
				workArrangement: "Remote",
				compensation: "Paid"
			}
			res.status(200).json(responseTest);
		}
	}	
};


module.exports = { registerUser, searchHandler, loginUser };