"use client";

import { useEffect, useState } from "react";

import { LoginForm } from "./LoginForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { SignUpForm } from "./SignUpForm";
import { VIEWS } from "./types";

export const AuthModal = () => {
  const [view, setView] = useState<VIEWS>(VIEWS.LOGIN);

  useEffect(() => {
    document.querySelector("html")?.classList.add("ignore-theme");

    return () => {
      document.querySelector("html")?.classList.remove("ignore-theme");
    };
  }, []);

  const View =
    view === VIEWS.REGISTER
      ? SignUpForm
      : view === VIEWS.FORGOT_PASSWORD
        ? ResetPasswordForm
        : LoginForm;

  return <View type="modal" setView={setView} />;
};
