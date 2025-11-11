import clsx from "clsx";
import Link from "next/link";

import { Button } from "@/components/ui";

type AuthPageProps = {
  href: string;
};

type AuthModalProps = {
  callback: () => void;
};

type AuthLinkProps = { text: string; className?: string } & (
  | AuthPageProps
  | AuthModalProps
);

export const AuthLink = (props: AuthLinkProps) => {
  if ("href" in props) {
    return (
      <Link href={props.href} className={clsx("underline", props.className)}>
        {props.text}
      </Link>
    );
  }
  return (
    <Button
      onClick={props.callback}
      className={clsx(
        "h-auto p-0 font-normal text-inherit underline",
        props.className
      )}
      variant="link"
      type="button"
    >
      {props.text}
    </Button>
  );
};
