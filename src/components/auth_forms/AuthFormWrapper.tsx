"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import logo from "@/public/logo.png";

import { AuthFormType } from "./types";

interface AuthFormWrapperProps {
  type: AuthFormType;
  title: string;
  description: string;
  titleClassName?: string;
  children: ReactNode;
}

export const AuthFormWrapper = ({
  type,
  title,
  description,
  titleClassName,
  children,
}: AuthFormWrapperProps) => {
  return (
    <Card
      className="mx-auto min-w-100 max-w-sm bg-linear-to-b from-primary/20"
      data-view="auth"
    >
      <CardHeader>
        {type === "page" ? (
          <Link href="/">
            <Image
              src={logo}
              alt="Easy and Tasty logo"
              className="mx-auto mb-2"
              height={40}
            />
          </Link>
        ) : (
          <Image
            src={logo}
            alt="Easy and Tasty logo"
            className="mx-auto mb-2"
            height={40}
          />
        )}
        <CardTitle className={titleClassName}>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
