# APAC Solution Challenge 2025 Submission - Langtern


Latest Deployement: [https://langtern.vercel.app/](https://langtern.vercel.app/)

![Langtern Logo](https://github.com/user-attachments/assets/aa02b1dc-91bc-43d7-bcd0-910839d27646)

Langtern is a web and mobile app/platform connecting students and businesses for internships opportunities with an additional focus on language exchange. 
By combining AI-powered matchmaking with real-time translation capabilities, Langtern breaks down language barriers and facilitates meaningful cross-cultural professional experiences.

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

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/langtern.git
cd langtern
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
\`\`\`
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📱 Usage

### Creating a Profile
1. Select your user type (Student or Business)
2. Fill in your personal information
3. Add your language skills and proficiency levels
4. Specify your professional skills and experience
5. Set your availability and preferences

### Finding Matches
1. Browse AI-recommended matches based on your profile
2. Filter matches by criteria like location, language, or work arrangement
3. View detailed match information and compatibility reasons

### Communication
1. Chat with potential matches using the built-in messaging system
2. Enable real-time translation for seamless cross-language communication
3. Customize translation settings based on your preferences

### Creating Arrangements
1. Select an arrangement template that fits your needs
2. Customize the template with specific details
3. Preview and confirm the arrangement
4. Access and manage your arrangements from the dashboard

## 🛠️ Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **State Management**: React Hooks
- **Animation**: Framer Motion
- **AI & Translation**: OpenAI API, AI SDK
- **Styling**: Tailwind CSS with custom theming
- **Icons**: Lucide React

## 📂 Project Structure

\`\`\`
langtern/
├── app/                  # Next.js app directory
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main application component
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── ui/               # UI components (shadcn)
│   ├── template-*.tsx    # Template-related components
│   ├── match-*.tsx       # Matching-related components
│   └── ...               # Other components
├── actions/              # Server actions
│   ├── matchmaking.ts    # AI matchmaking functionality
│   └── translation.ts    # Translation functionality
├── data/                 # Static data
│   └── agreement-templates.ts  # Template definitions
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── public/               # Static assets
\`\`\`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- OpenAI for providing the AI capabilities
- Vercel for hosting and deployment
- shadcn/ui for the beautiful component library
- All contributors who have helped shape this project

---

Built with ❤️ by the Langtern Team (Ava & Dan)
