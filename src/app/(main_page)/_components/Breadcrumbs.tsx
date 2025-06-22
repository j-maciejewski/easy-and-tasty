import clsx from "clsx";
import Link from "next/link";

import { ShareDialog } from "./ShareDialog";

export namespace Breadcrumbs {
  export interface Props {
    paths: Array<{
      label: string;
      href?: string;
      active?: boolean;
    }>;
    shareConfig?: {
      path: string;
      text: string;
      type: "recipe" | "article";
    };
  }
}

export const Breadcrumbs = ({ paths, shareConfig }: Breadcrumbs.Props) => {
  if (paths.length === 0) return null;

  return (
    <div className="~mb-4/6 flex items-center justify-between">
      <ul className="~:~text-sm/base flex text-gray-600">
        <li className="items-center font-semibold">
          <Link href="/" className="hover:text-gray-800">
            Home
          </Link>
        </li>
        {paths.map((path) => (
          <li
            key={path.label}
            className="items-end pl-1 font-semibold before:mr-1 before:content-['\00BB']"
          >
            {path.href ? (
              <Link href={path.href} className="hover:text-black">
                {path.label}
              </Link>
            ) : (
              <span className={clsx({ "text-black": path.active })}>
                {path.label}
              </span>
            )}
          </li>
        ))}
      </ul>
      {shareConfig && <ShareDialog shareConfig={shareConfig} />}
    </div>
  );
};
