"use client";
import { ReactNode, createContext, useMemo } from "react";

interface IUserContext {
  settings: {
    formsInModals: boolean;
  };
}

const UserContext = createContext<IUserContext | null>(null);

const UserProvider = ({
  ...rest
}: {
  children: ReactNode;
}) => {
  const value = useMemo(
    () => ({
      settings: {
        formsInModals: true,
      },
    }),
    [],
  );

  return <UserContext value={value} {...rest} />;
};

export { UserProvider, UserContext };
