import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui";
import Image404 from "@/public/404-image.png";

export default function () {
  return (
    <div className="md:~max-w-[60rem]/[80rem] mx-auto flex min-h-screen w-full grow flex-col items-center justify-center max-sm:p-4 max-xl:max-w-[1000px] md:p-6">
      <Image
        src={Image404}
        alt="404 image"
        className="~mb-4/6 max-md:size-32 md:size-40"
      />

      <h2 className="~text-4xl/6xl ~mb-4/6 text-center font-bold text-primary">
        Page not found
      </h2>
      <p className="~text-base/xl ~mb-6/9 text-center text-gray-600">
        The page you are looking for may have been moved or deleted
      </p>
      <Link href="/">
        <Button
          variant="default"
          className="~text-base/lg rounded-full font-semibold"
        >
          Back to home
        </Button>
      </Link>
    </div>
  );
}
