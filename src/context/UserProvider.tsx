"use client";
import { createContext, ReactNode, useMemo } from "react";

interface IUserContext {
  settings: {};
}

const UserContext = createContext<IUserContext | null>(null);

const UserProvider = ({ ...rest }: { children: ReactNode }) => {
  const value = useMemo(
    () => ({
      settings: {},
    }),
    [],
  );

  return <UserContext value={value} {...rest} />;
};

export { UserProvider, UserContext };
