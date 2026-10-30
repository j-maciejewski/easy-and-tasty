import Link from "next/link";

import { Facebook, Instagram, Twitter } from "@/components/icons";

const linkGroups = [
  {
    heading: "Find a recipe",
    links: [
      { label: "All recipes", href: "/all-recipes" },
      { label: "Categories", href: "/categories" },
      { label: "Cuisines", href: "/cuisines" },
      { label: "Articles", href: "/articles" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Contact", href: "#" },
      { label: "FAQ", href: "#" },
      { label: "Privacy policy", href: "#" },
    ],
  },
];

const socialLinks = [
  { label: "Facebook", href: "#", Icon: Facebook },
  { label: "Twitter", href: "#", Icon: Twitter },
  { label: "Instagram", href: "#", Icon: Instagram },
];

export const Footer = () => {
  return (
    <footer className="bg-ink w-full px-4 pt-14 pb-8 text-white/70 print:hidden">
      <div className="width-content mx-auto">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div className="max-w-md">
            <p className="font-display text-2xl font-semibold tracking-tight text-white">
              Home cooking, without the fuss.
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              We're home cooks sharing the recipes we make again and again, from
              quick weeknight dinners to slow weekend feasts.
            </p>
            <div className="mt-6 flex gap-2">
              {socialLinks.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="hover:bg-primary flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors"
                >
                  <Icon className="size-4" aria-hidden />
                  <span className="sr-only">{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {linkGroups.map((group) => (
            <div key={group.heading}>
              <h3 className="mb-4 text-sm font-semibold text-white">
                {group.heading}
              </h3>
              <ul className="space-y-2.5 text-sm">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="underline-offset-4 hover:text-white hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/15 pt-6 text-sm">
          &copy; {new Date().getFullYear()} easy and tasty. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
