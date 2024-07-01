import { AuthDataProvider } from "./_context/AuthEmailContext";

export default function ({ children }: { children: React.ReactNode }) {
	return (
		<AuthDataProvider>
			<div className="flex flex-col items-center justify-center h-screen bg-primary/5">
				{children}
			</div>
		</AuthDataProvider>
	);
}
