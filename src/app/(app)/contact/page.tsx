import { Mail, MessageSquare, Utensils } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeading } from "@/components/app";
import { Path } from "@/config";
import { CONTACT_EMAIL } from "@/consts";
import { parseMetadata } from "@/lib/utils";

export const metadata: Metadata = parseMetadata(
  "Contact",
  "Get in touch with the Easy and Tasty team.",
  Path.CONTACT,
);

const reasons = [
  {
    Icon: Utensils,
    title: "Recipe questions",
    text: "Stuck on a step or wondering about a substitution? Leave a comment on the recipe so other cooks can help too, or write to us.",
  },
  {
    Icon: MessageSquare,
    title: "Feedback and corrections",
    text: "Spotted a typo, a wrong measurement or a broken page? Tell us and we'll fix it.",
  },
  {
    Icon: Mail,
    title: "Account and privacy",
    text: "Need help signing in, or want your data exported or deleted? Email us from the address on your account.",
  },
];

export default function ContactPage() {
  return (
    <div className="w-full">
      <Breadcrumbs paths={[{ label: "Contact", active: true }]} />
      <PageHeading
        title="Contact"
        description="We read every message and usually reply within a few working days."
      />

      <div className="bg-muted rounded-3xl p-8 md:p-10">
        <p className="text-muted-foreground text-sm font-medium">Email us at</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-display hover:text-primary mt-2 block text-2xl font-semibold tracking-tight break-all underline-offset-4 hover:underline md:text-4xl"
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {reasons.map(({ Icon, title, text }) => (
          <div key={title} className="rounded-2xl border p-6">
            <Icon className="text-primary size-6" aria-hidden />
            <h2 className="font-display mt-4 text-xl font-semibold tracking-tight">
              {title}
            </h2>
            <p className="text-muted-foreground mt-2 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      <p className="text-muted-foreground mt-10">
        Got a quick question? It might already be answered in the{" "}
        <Link
          href={Path.FAQ}
          className="text-primary underline-offset-4 hover:underline"
        >
          FAQ
        </Link>
        .
      </p>
    </div>
  );
}
