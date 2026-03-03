import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui";
import Image404 from "@/public/404-image.png";

export default function () {
  return (
    <div className="width-content mx-auto flex w-full grow flex-col items-center justify-center max-sm:p-4 max-xl:max-w-250 md:p-6">
      <Image
        src={Image404}
        alt="404 image"
        className="mb-6 max-md:size-40 md:size-60"
      />

      <h2 className="mb-8 text-center font-bold text-6xl text-primary">
        Page not found
      </h2>
      <p className="mb-8 text-center text-gray-600 text-lg">
        The page you are looking for may have been moved or deleted
      </p>
      <Link href="/">
        <Button
          variant="default"
          size="lg"
          className="rounded-full font-semibold text-xl"
        >
          Back to home
        </Button>
      </Link>
    </div>
  );
}
