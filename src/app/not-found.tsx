import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui";
import Image404 from "@/public/404-image.png";

export default function () {
  return (
    <div className="width-content mx-auto flex w-full grow flex-col items-center justify-center max-sm:p-4 max-xl:max-w-250 md:p-6">
      <Image
        src={Image404}
        alt="Illustration for page not found"
        className="mb-6 max-md:size-40 md:size-60"
      />

      <h1 className="mb-4 text-center font-bold font-display text-5xl text-primary tracking-tight md:text-6xl">
        Page not found
      </h1>
      <p className="mb-8 max-w-md text-center text-lg text-muted-foreground">
        This page may have moved, or the link may be wrong. Head back home to
        find something to cook.
      </p>
      <Button asChild size="lg" className="rounded-full px-6 font-semibold">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
