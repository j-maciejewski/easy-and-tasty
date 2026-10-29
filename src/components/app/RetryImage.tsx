"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef } from "react";

const RETRY_DELAYS = [3000, 8000, 15000];

// The first request for an UploadThing file their CDN hasn't cached yet can
// exceed the image optimizer's 7s upstream timeout. By the time we retry, the
// CDN has usually cached it, so re-request instead of leaving a broken image.
export const RetryImage = ({ onError, ...props }: ImageProps) => {
  const retryTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(retryTimeout.current), []);

  return (
    <Image
      {...props}
      onError={(event) => {
        const image = event.currentTarget;
        const attempt = Number(image.dataset.retry ?? 0);

        if (attempt < RETRY_DELAYS.length) {
          image.dataset.retry = String(attempt + 1);
          retryTimeout.current = setTimeout(() => {
            const srcset = image.getAttribute("srcset");
            if (srcset) image.setAttribute("srcset", srcset);
            image.setAttribute("src", image.getAttribute("src") ?? "");
          }, RETRY_DELAYS[attempt]);
        }

        onError?.(event);
      }}
    />
  );
};
