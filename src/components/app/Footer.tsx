import clsx from "clsx";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className={clsx("w-full bg-white px-4 py-8 shadow-lg")}>
      <div className="width-content mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-semibold text-primary">About us</h3>
            <p className="text-gray-600 text-sm">
              We're passionate home cooks sharing our favorite tried-and-true
              recipes, from quick weeknight dinners to impressive weekend
              feasts. Our goal is to inspire you to get creative in the kitchen
              and discover the joy of cooking delicious meals for yourself and
              your loved ones.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-primary">Quick links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/categories"
                  className="relative text-gray-600 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:text-primary/95 hover:after:w-full"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/cuisines"
                  className="relative text-gray-600 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:text-primary/95 hover:after:w-full"
                >
                  Cuisines
                </Link>
              </li>
              <li>
                <Link
                  href="/all-recipes"
                  className="relative text-gray-600 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:text-primary/95 hover:after:w-full"
                >
                  All recipes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-primary">Help & Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="relative text-gray-600 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:text-primary/95 hover:after:w-full"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="relative text-gray-600 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:text-primary/95 hover:after:w-full"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="relative text-gray-600 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-primary">Follow us</h3>
            <div className="flex gap-4">
              <Link
                href="#"
                className="text-gray-600 transition-all duration-300 hover:text-primary/95"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-gray-600 transition-all duration-300 hover:text-primary/95"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="text-gray-600 transition-all duration-300 hover:text-primary/95"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-gray-600 border-t pt-8 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-primary">easy and tasty</span>. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};
