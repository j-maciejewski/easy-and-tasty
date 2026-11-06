import { Metadata } from "next";

import { Breadcrumbs, MarkdownContent, PageHeading } from "@/components/app";
import { Path } from "@/config";
import { APP_NAME, CONTACT_EMAIL } from "@/consts";
import { parseMetadata } from "@/lib/utils";

export const metadata: Metadata = parseMetadata(
  "Privacy policy",
  `How ${APP_NAME} collects, uses and protects your data.`,
  Path.PRIVACY_POLICY,
);

const LAST_UPDATED = "6 November 2026";

const content = `
${APP_NAME} is a recipe site run by a small team of home cooks. This policy explains what data we collect, why, and what you can do about it.

## What we collect

**When you create an account**, we store your name, email address and a securely hashed password. If you sign in with Google, we receive your name, email address and profile picture from Google instead of a password.

**When you use your account**, we store the recipes you bookmark, the ratings you give, the comments you write and the comments you like, as well as the recipes you've recently viewed.

**When you browse the site**, we record anonymous page views to understand which recipes and articles are popular. To count unique visitors we use a salted hash of your IP address and browser details. The salt changes every day, so we never store your IP address and can't link your visits across days.

## Cookies and local storage

We use a session cookie to keep you signed in. Your browser's local storage remembers your colour theme and recent searches, and the offline cache stores recipes you've opened so they work without a connection. None of this is used for advertising or shared with third parties, and you can clear it at any time from your browser settings.

## How we use your data

We use your data only to run the site: to sign you in, show your bookmarks, ratings and comments, send account emails such as email confirmation and password resets, and improve our recipes based on what people read. We don't sell your data or use it for advertising.

## Who we share it with

We use a small number of service providers to host the site, store data and send email. They process data only on our behalf. Comments you post are public and shown with your name.

## How long we keep it

We keep your account data until you delete your account. Anonymous page view data is kept for as long as it's useful for statistics.

## Your rights

You can ask us to access, correct, export or delete your personal data at any time. Email [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}) from the address on your account and we'll respond within 30 days.

## Changes to this policy

If we make significant changes, we'll update the date at the top of this page.
`;

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full">
      <Breadcrumbs paths={[{ label: "Privacy policy", active: true }]} />
      <PageHeading
        title="Privacy policy"
        description={`Last updated ${LAST_UPDATED}`}
      />
      <div className="prose prose-lg prose-headings:font-display prose-a:text-primary prose-headings:tracking-tight prose-li:marker:text-primary max-w-[68ch]">
        <MarkdownContent>{content}</MarkdownContent>
      </div>
    </div>
  );
}
