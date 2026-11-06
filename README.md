# Easy and Tasty

A modern recipe sharing platform built with Next.js 16, React 19, and TypeScript. This application allows users to discover, share, and manage recipes with a clean and intuitive interface.

## Screenshots

### Site

![Home page](.github/screenshots/home.png)

| Recipe page | All recipes |
| --- | --- |
| ![Recipe page](.github/screenshots/recipe.png) | ![All recipes](.github/screenshots/all-recipes.png) |

<details>
<summary>Full recipe page</summary>

![Full Banana Bread recipe page](.github/screenshots/recipe-full.png)

</details>

| Categories | Cuisine |
| --- | --- |
| ![Categories](.github/screenshots/categories.png) | ![Italian cuisine page](.github/screenshots/cuisine.png) |

| Articles | Article |
| --- | --- |
| ![Articles](.github/screenshots/articles.png) | ![Article page](.github/screenshots/article.png) |

| Recently viewed | Mobile |
| --- | --- |
| ![Recently viewed recipes](.github/screenshots/recently-viewed.png) | <img src=".github/screenshots/mobile-home.png" alt="Home page on mobile" width="260"> <img src=".github/screenshots/mobile-recipe.png" alt="Recipe page on mobile" width="260"> <img src=".github/screenshots/mobile-search.png" alt="Recipe search on mobile" width="260"> |

### Dashboard

| Summary | Reader tracking |
| --- | --- |
| ![Dashboard summary](.github/screenshots/dashboard.png) | ![Reader tracking](.github/screenshots/dashboard-tracking.png) |

| Recipe editor | Recipe stats |
| --- | --- |
| ![Recipe editor](.github/screenshots/dashboard-recipe-editor.png) | ![Recipe stats](.github/screenshots/dashboard-recipe-stats.png) |

Markdown editor, side by side with the rendered preview:

![Markdown recipe editor in side-by-side mode](.github/screenshots/dashboard-markdown-editor.png)

<details>
<summary>Full recipe editor</summary>

![Full Banana Bread recipe editor](.github/screenshots/dashboard-recipe-editor-full.png)

</details>

| Recipes (dark theme) | Media library |
| --- | --- |
| ![Recipe management in dark theme](.github/screenshots/dashboard-recipes.png) | ![Media library](.github/screenshots/dashboard-media.png) |

| Categories | Navigation editor |
| --- | --- |
| ![Category management](.github/screenshots/dashboard-categories.png) | ![Navigation editor](.github/screenshots/dashboard-navigation.png) |

## Features

- 🔐 Authentication with NextAuth.js (email/password and Google), with email confirmation and password reset
- 📱 Responsive design for all devices
- 🎨 Dark/Light theme support
- 🍲 Recipe pages with ratings, comments, bookmarks and a print view
- 🕒 Recently viewed recipes and "People also viewed" suggestions
- 🗂️ Category, cuisine and article browsing with infinite scroll
- 🔍 Recipe search by title
- 🎯 SEO optimization with a generated sitemap
- 🛠️ Editor dashboard:
  - Recipe and article management with Markdown editing and preview
  - Comment moderation and bulk actions
  - Media library with image uploads (UploadThing, compressed with sharp)
  - Category, cuisine and user management
  - Drag-and-drop navigation and homepage section editors
  - Reader analytics: views, engaged reads, prints, shares and copies; traffic sources; trending content; views by category and cuisine; top and zero-result searches
  - Per-recipe and per-article stats pages, and CSV export
  - Privacy-friendly tracking: no raw IPs stored, bots filtered, events anonymized after 90 days via `/api/cron/anonymize-events` (call daily with `Authorization: Bearer $CRON_SECRET`)

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
