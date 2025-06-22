"use client";

import { usePathname } from "next/navigation";
import {
  ChangeEvent,
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface AuthData {
  name: string;
  email: string;
  password: string;
}

const initialAuthData: AuthData = {
  name: "",
  email: "",
  password: "",
};

interface IAuthDataContext {
  authData: AuthData;
  handleChangeAuthData: (evt: ChangeEvent<HTMLInputElement>) => void;
}

const AuthDataProvider = (props: { children: ReactNode }) => {
  const pathname = usePathname();
  const [authData, setAuthData] = useState<AuthData>(initialAuthData);

  const handleChangeAuthData = (evt: ChangeEvent<HTMLInputElement>) =>
    setAuthData((prev) => ({ ...prev, [evt.target.name]: evt.target.value }));

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    setAuthData((prev) => ({ ...prev, password: "" }));
  }, [pathname]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  const value = useMemo(() => ({ authData, handleChangeAuthData }), [authData]);

  return <AuthDataContext.Provider value={value} {...props} />;
};

const AuthDataContext = createContext<IAuthDataContext | undefined>(undefined);

export { AuthDataProvider, AuthDataContext };
