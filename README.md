# APAC Solution Challenge 2025 Submission - "Langtern" by Ava & Dan
![langtern logo](https://github.com/user-attachments/assets/d52ba091-fd08-453b-98d8-c80feac1dd52)

**Langtern** is a web and mobile app/platform connecting students and businesses for internship opportunities with an additional focus on language exchange. 
By combining AI-powered matchmaking with real-time translation capabilities, Langtern breaks down language barriers and facilitates meaningful cross-cultural professional experiences.

Latest Deployment: [https://langtern.vercel.app/](https://langtern.vercel.app/)


## 🌟 Features

### AI-Powered Matchmaking
- Smart matching based on language skills, professional experience, and learning goals
- Personalized recommendations with detailed match reasoning
- Filters for work arrangement, compensation, and match percentage

### Real-Time Translation
- Seamless conversation with automatic message translation
- Support for multiple languages including English, Japanese, Spanish, French, and more
- Language detection and customizable translation settings

### Internship Arrangement Templates
- Customizable templates for different types of internships:
  - Standard Internship
  - Language Exchange Focus
  - Project-Based
- Digital confirmation process
- Exportable arrangement documents

### User-Friendly Interface
- Intuitive onboarding and profile creation
- Interactive chat with translation indicators
- Comprehensive dashboard for managing arrangements

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

```bash
git clone https://github.com/yourusername/langtern.git
cd langtern
```

```bash
npm install
# or
yarn install
```

### Environment Variables

Create a `.env.local` file in the root directory with the following:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key
```

### Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

### Creating a Profile
1. Select your user type (Student or Business)
2. Fill in your personal information
3. Add your language skills and proficiency levels
4. Specify your professional skills and experience
5. Set your availability and preferences

### Finding Matches
1. Browse AI-recommended matches
2. Filter by criteria like location, language, or work arrangement
3. View detailed compatibility information

### Communication
1. Use the built-in messaging system
2. Enable real-time translation
3. Customize translation settings

### Creating Arrangements
1. Choose a template
2. Customize with specific details
3. Preview and confirm
4. Manage arrangements from the dashboard

## 🛠️ Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **State Management**: React Hooks
- **Animation**: Framer Motion
- **AI & Translation**: OpenAI API, AI SDK
- **Styling**: Tailwind CSS with custom theming
- **Icons**: Lucide React

## 📂 Project Structure

```
langtern/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   ├── template-*.tsx
│   ├── match-*.tsx
│   └── ...
├── actions/
│   ├── matchmaking.ts
│   └── translation.ts
├── data/
│   └── agreement-templates.ts
├── hooks/
├── lib/
├── types/
└── public/
```

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a branch (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- OpenAI for AI capabilities
- Vercel for hosting
- shadcn/ui for components
- All contributors

---

Built with ❤️ by the Langtern Team (Ava & Dan)

