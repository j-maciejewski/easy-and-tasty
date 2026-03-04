"use client";
import { createContext, ReactNode, useMemo } from "react";

// TODO: make use of it or remove

const UserContext = createContext<null>(null);

const UserProvider = ({ ...rest }: { children: ReactNode }) => {
  const value = useMemo(() => null, []);

  return <UserContext value={value} {...rest} />;
};

export { UserProvider, UserContext };
