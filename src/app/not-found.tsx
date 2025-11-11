import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui";
import Image404 from "@/public/404-image.png";

export default function () {
  return (
    <div className="width-content mx-auto flex w-full grow flex-col items-center justify-center max-sm:p-4 max-xl:max-w-[1000px] md:p-6">
      <Image
        src={Image404}
        alt="404 image"
        className="mb-4 max-md:size-32 md:size-40"
      />

      <h2 className="mb-4 text-center font-bold text-4xl text-primary">
        Page not found
      </h2>
      <p className="mb-6 text-center text-base text-gray-600">
        The page you are looking for may have been moved or deleted
      </p>
      <Link href="/">
        <Button
          variant="default"
          className="rounded-full font-semibold text-base"
        >
          Back to home
        </Button>
      </Link>
    </div>
  );
}
