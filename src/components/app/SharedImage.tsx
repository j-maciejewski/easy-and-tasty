"use client";

import {
  createContext,
  type MouseEvent,
  use,
  useState,
  ViewTransition,
} from "react";

const SharedImageActiveContext = createContext(false);

// The same item can be rendered more than once on a page, and duplicate
// view-transition names cancel the whole transition. Only the card that was
// clicked gets a name, so its image morphs into the destination hero.
export const SharedImageScope = ({ children }: React.PropsWithChildren) => {
  const [active, setActive] = useState(false);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const isPlainClick =
      event.button === 0 &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey;

    if (isPlainClick && (event.target as HTMLElement).closest("a"))
      setActive(true);
  };

  return (
    <div className="contents" onClickCapture={handleClick}>
      <SharedImageActiveContext value={active}>
        {children}
      </SharedImageActiveContext>
    </div>
  );
};

export const SharedImage = ({
  name,
  children,
}: React.PropsWithChildren<{ name: string }>) => {
  const active = use(SharedImageActiveContext);

  return (
    <ViewTransition
      name={active ? name : undefined}
      share="morph"
      default="none"
    >
      {children}
    </ViewTransition>
  );
};
