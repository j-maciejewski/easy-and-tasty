import clsx from "clsx";
import { HTMLAttributes, ReactNode, Ref } from "react";

export const FullWidthWrapper = (
  {
    className,
    children,
    ...props
  }: HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
  },
  ref?: Ref<HTMLDivElement>,
) => {
  return (
    <div
      className={clsx(
        "relative right-[50%] left-[50%] mx-[-50vw] w-[100vw]",
        className,
      )}
      {...props}
      ref={ref}
    >
      {children}
    </div>
  );
};
