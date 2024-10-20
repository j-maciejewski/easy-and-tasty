"use client";

import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";
import { AuthData, useAuthData } from "../_context/AuthDataProvider";

export const AuthInput = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		const { authData, handleChangeAuthData } = useAuthData();
		return (
			<Input
				type={type}
				className={cn(
					"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={ref}
				value={authData[props.name as keyof AuthData]}
				onChange={handleChangeAuthData}
				{...props}
			/>
		);
	},
);
