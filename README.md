# Easy and Tasty

A modern recipe sharing platform built with Next.js 16, React 19, and TypeScript. This application allows users to discover, share, and manage recipes with a clean and intuitive interface.

## Features

- 🔐 Authentication with NextAuth.js (email/password and Google), with email confirmation and password reset
- 📱 Responsive design for all devices
- 🎨 Dark/Light theme support
- 🍲 Recipe pages with ratings, comments, bookmarks and a print view
- 🗂️ Category, cuisine and article browsing with infinite scroll
- 🔍 Recipe search by title
- 🎯 SEO optimization with a generated sitemap
- 🛠️ Editor dashboard:
  - Recipe and article management with Markdown editing and preview
  - Comment moderation and bulk actions
  - Media library with image uploads (UploadThing, compressed with sharp)
  - Category, cuisine and user management
  - Drag-and-drop navigation and homepage section editors
  - Recipe view statistics

## Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **Authentication:** NextAuth.js v4
- **Styling:** Tailwind CSS v4
- **State Management:** TanStack Query (React Query)
- **API:** tRPC
- **UI Components:** Custom components with Tailwind
- **Form Handling:** React Hook Form with Zod
- **File Uploads:** UploadThing
- **Email:** Nodemailer
- **Linting:** Biome

## Getting Started

### Prerequisites

- Node.js 20.9 or higher
- PostgreSQL database
- Bun package manager (recommended)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/j-maciejewski/easy-and-tasty.git
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

4. Update the environment variables in `.env`:

| Variable | Description |
| --- | --- |
| `APP_URL`, `NEXT_PUBLIC_APP_URL` | Public URL of the app, e.g. `http://localhost:3000` |
| `DATABASE_URL` | PostgreSQL connection string |
| `UPLOADTHING_TOKEN` | UploadThing API token for image uploads |
| `NEXTAUTH_URL`, `NEXTAUTH_SECRET` | NextAuth.js settings (the secret is required in production) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM` | SMTP settings for confirmation and password reset emails (required in production) |

In development you can leave `SMTP_HOST` empty and emails are printed to the console instead.

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

New accounts get the `viewer` role. The dashboard at `/dashboard` is only available to users with the `editor` role, which you can set in the `users` table (for example with `bun db:studio`).

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
- `bun lint` - Run Biome checks and apply fixes
- `bun check` - Run Biome checks without writing changes
- `bun tsc` - Run TypeScript compiler
- `bun db:generate` - Generate database migrations
- `bun db:push` - Push database changes
- `bun db:migrate` - Apply database migrations
- `bun db:studio` - Open Drizzle Studio
