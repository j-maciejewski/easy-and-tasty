import { Dispatch, SetStateAction } from "react";

export enum VIEWS {
  LOGIN = "login",
  REGISTER = "register",
  FORGOT_PASSWORD = "forgot_password",
}

export type AuthFormType = "modal" | "page";

export interface AuthFormProps {
  type: AuthFormType;
  setView?: Dispatch<SetStateAction<VIEWS>>;
}
