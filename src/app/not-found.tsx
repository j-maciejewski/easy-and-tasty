import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui";
import Image404 from "@/public/404-image.png";

export default function () {
  return (
    <div className="width-content mx-auto flex w-full grow flex-col items-center justify-center max-xl:max-w-250 max-sm:p-4 md:p-6">
      <Image
        src={Image404}
        alt="Illustration for page not found"
        className="mb-6 max-md:size-40 md:size-60"
      />

      <h1 className="font-display text-primary mb-4 text-center text-5xl font-bold tracking-tight md:text-6xl">
        Page not found
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md text-center text-lg">
        This page may have moved, or the link may be wrong. Head back home to
        find something to cook.
      </p>
      <Button asChild size="lg" className="rounded-full px-6 font-semibold">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
