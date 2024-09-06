import { AuthDataProvider } from "./_context/AuthEmailContext";

export default function ({ children }: React.PropsWithChildren) {
	return (
		<AuthDataProvider>
			<div className="flex flex-col items-center justify-center h-screen bg-background">
				{children}
			</div>
		</AuthDataProvider>
	);
}
