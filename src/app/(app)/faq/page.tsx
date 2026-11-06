import { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeading } from "@/components/app";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui";
import { Path } from "@/config";
import { CONTACT_EMAIL } from "@/consts";
import { parseMetadata } from "@/lib/utils";

export const metadata: Metadata = parseMetadata(
  "FAQ",
  "Answers to common questions about Easy and Tasty.",
  Path.FAQ,
);

const linkClassName = "text-primary underline-offset-4 hover:underline";

const faqs = [
  {
    question: "Do I need an account to use the site?",
    answer: (
      <>
        No. Every recipe and article is free to read without signing in. An
        account lets you bookmark recipes, rate them, leave comments and see
        your recently viewed recipes on any device.
      </>
    ),
  },
  {
    question: "How do I create an account?",
    answer: (
      <>
        Go to{" "}
        <Link href={Path.SIGN_UP} className={linkClassName}>
          sign up
        </Link>{" "}
        and register with your email address, or continue with Google. If you
        use email, we'll send you a link to confirm your address.
      </>
    ),
  },
  {
    question: "I forgot my password. What now?",
    answer: (
      <>
        Use{" "}
        <Link href={Path.RESET_PASSWORD} className={linkClassName}>
          reset password
        </Link>{" "}
        and we'll email you a link to choose a new one.
      </>
    ),
  },
  {
    question: "How do I save a recipe for later?",
    answer: (
      <>
        Sign in and tap the bookmark icon on any recipe. Your saved recipes live
        under{" "}
        <Link href="/bookmarks" className={linkClassName}>
          bookmarks
        </Link>
        .
      </>
    ),
  },
  {
    question: "Can I use recipes without an internet connection?",
    answer: (
      <>
        Yes. Recipes you open or bookmark are stored on your device, so they
        still open when you're offline. You can find them on the{" "}
        <Link href="/offline" className={linkClassName}>
          available offline
        </Link>{" "}
        page. You can also install the site to your home screen from your
        browser's menu.
      </>
    ),
  },
  {
    question: "Can I print a recipe?",
    answer: (
      <>
        Yes. Use the print button on a recipe page for a clean version without
        menus, comments or ads.
      </>
    ),
  },
  {
    question: "Can I submit my own recipe?",
    answer: (
      <>
        Not yet, but we'd love to hear your ideas. Send them to{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className={linkClassName}>
          {CONTACT_EMAIL}
        </a>
        .
      </>
    ),
  },
  {
    question: "How do I delete my account?",
    answer: (
      <>
        Email us from the address on your account and we'll delete it along with
        your bookmarks, ratings and comments. See the{" "}
        <Link href={Path.PRIVACY_POLICY} className={linkClassName}>
          privacy policy
        </Link>{" "}
        for details.
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <div className="w-full">
      <Breadcrumbs paths={[{ label: "FAQ", active: true }]} />
      <PageHeading
        title="Frequently asked questions"
        description="Quick answers about accounts, saving recipes and using the site."
      />

      <Accordion type="single" collapsible className="max-w-3xl">
        {faqs.map(({ question, answer }) => (
          <AccordionItem key={question} value={question}>
            <AccordionTrigger className="text-lg">{question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base leading-relaxed">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <p className="text-muted-foreground mt-10">
        Didn't find your answer?{" "}
        <Link href={Path.CONTACT} className={linkClassName}>
          Get in touch
        </Link>
        .
      </p>
    </div>
  );
}
