"use client";

import { usePathname } from "next/navigation";
import {
	ChangeEvent,
	ReactNode,
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

export interface AuthData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

const initialAuthData: AuthData = {
	firstName: "",
	lastName: "",
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

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		setAuthData((prev) => ({ ...prev, password: "" }));
	}, [pathname]);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	const value = useMemo(() => ({ authData, handleChangeAuthData }), [authData]);

	return <AuthDataContext.Provider value={value} {...props} />;
};

const useAuthData = () => {
	const context = useContext(AuthDataContext);

	if (context === undefined) {
		throw new Error("useAuthData must be used within a AuthDataProvider");
	}

	return context;
};

const AuthDataContext = createContext<IAuthDataContext | undefined>(undefined);

export { AuthDataProvider, useAuthData };
