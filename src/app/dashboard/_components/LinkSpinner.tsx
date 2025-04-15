"use client";

import clsx from "clsx";
import { LoaderCircle } from "lucide-react";
import { useLinkStatus } from "next/link";

export const LinkSpinner = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const { pending } = useLinkStatus();

  return pending ? (
    <div
      role="status"
      aria-label="Loading"
      className={clsx("size-5", className)}
      {...props}
    >
      <LoaderCircle className="size-4 animate-spin" />
    </div>
  ) : null;
};
