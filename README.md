# Easy and Tasty

A modern recipe sharing platform built with Next.js 15, React 19, and TypeScript. This application allows users to discover, share, and manage recipes with a clean and intuitive interface.

## Features

- 🔐 Secure authentication with NextAuth.js
- 📱 Responsive design for all devices
- 🎨 Dark/Light theme support
- 🖼️ Image upload capabilities
- 📝 Rich text editing for recipes
- 🔍 Advanced search functionality
- 🗂️ Category and cuisine organization
- 🎯 SEO optimization
- 🔄 Drag-and-drop navigation management

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **State Management:** TanStack Query (React Query)
- **API:** tRPC
- **UI Components:** Custom components with Tailwind
- **Form Handling:** React Hook Form
- **Linting:** Biome

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- Bun package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/easy-and-tasty.git
cd easy-and-tasty
```

2. Install dependencies:
```bash
bun install
```

3. Copy the example environment file:
```bash
cp .env.example .env
```

4. Update the environment variables in .env with your configuration

5. Set up the database:
```bash
bun run db:generate
bun run db:push
```

The application will be available at `http://localhost:3000`

### Build

Create a production build:
```bash
bun run build
```

Start the production server:
```bash
bun run start
```

### Scripts
- bun run dev - Start development server with Turbopack
- bun run build - Create production build
- bun run start - Start production server
- bun run lint - Run Biome linter
- bun run check - Run Biome checks
- bun run tsc - Run TypeScript compiler
- bun run db:generate - Generate database migrations
- bun run db:push - Push database changes
- bun run db:studio - Open Drizzle Studio