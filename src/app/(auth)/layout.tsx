import { redirect } from "next/navigation";
import { AuthDataProvider } from "./_context/AuthDataProvider";

export default function ({ children }: React.PropsWithChildren) {
  redirect("/");

  return (
    <AuthDataProvider>
      <div className="flex h-screen flex-col items-center justify-center bg-background">
        {children}
      </div>
    </AuthDataProvider>
  );
}
