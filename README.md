# Easy and Tasty

A modern recipe sharing platform built with Next.js 16, React 19, and TypeScript. This application allows users to discover, share, and manage recipes with a clean and intuitive interface.

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

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** NextAuth.js v4
- **Styling:** Tailwind CSS v4
- **State Management:** TanStack Query (React Query)
- **API:** tRPC
- **UI Components:** Custom components with Tailwind
- **Form Handling:** React Hook Form
- **Linting:** Biome

## Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- Bun package manager (recommended)

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
bun db:generate
bun db:push
```

6. Start the development server:

```bash
bun dev
```

The application will be available at `http://localhost:3000`

### Build

Create a production build:

```bash
bun run build
```

Start the production server:

```bash
bun start
```

### Scripts

- `bun dev` - Start development server with Turbopack
- `bun build` - Create production build
- `bun start` - Start production server
- `bun lint` - Run Biome linter
- `bun check` - Run Biome checks
- `bun tsc` - Run TypeScript compiler
- `bun db:generate` - Generate database migrations
- `bun db:push` - Push database changes
- `bun db:migrate` - Apply database migrations
- `bun db:studio` - Open Drizzle Studio
