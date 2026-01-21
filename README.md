# MindForge

A gamified AI platform for critical thinking built with Next.js 14.

## Features

- **Dashboard**: Track your stats (Logic Prowess, Cognitive Flexibility, Ethical Nuance), view available scenarios, and maintain your daily streak
- **The Arena**: Engage with critical thinking scenarios, submit your analysis, and receive AI-powered feedback
- **Leaderboard**: Compete with other thinkers and see top performers
- **Gamification**: Earn XP, level up, unlock new scenarios, and collect badges

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS + Shadcn UI
- **Components**: Button, Card, Progress, Badge, Tabs, Alert, ScrollArea, Avatar
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Styling**: Deep Space theme (slate-950 background)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── actions.ts              # Server actions (mock AI evaluation)
│   ├── dashboard/              # Dashboard page
│   ├── arena/[id]/            # Arena scenario pages
│   ├── leaderboard/            # Leaderboard page
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home page (redirects to dashboard)
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # Shadcn UI components
│   └── Navbar.tsx              # Navigation bar
├── contexts/
│   └── GameStateContext.tsx    # Global game state management
└── lib/
    └── utils.ts                # Utility functions
```

## Key Features

### Game State Management
- XP tracking and level progression
- Daily streak counter
- Scenario unlocking system

### AI Evaluation (Mock)
The `evaluateReasoning` server action simulates AI analysis with:
- Score calculation (0-100)
- Feedback generation
- Logical fallacy detection
- XP rewards (50-100 based on score)

### Styling Theme
- **Background**: Deep Space (slate-950)
- **Primary**: Indigo-500
- **Success**: Emerald-400
- **Warning**: Amber-400

## Development

The project uses TypeScript for type safety and follows Next.js 14 best practices with the App Router.

