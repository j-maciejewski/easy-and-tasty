import { Suspense } from "react";
import { AuthDataProvider } from "./_context/AuthDataProvider";

export default function ({ children }: React.PropsWithChildren) {
  return (
    <AuthDataProvider>
      <div className="flex h-screen flex-col items-center justify-center bg-primary/15">
        <Suspense>
          {children}
        </Suspense>
      </div>
    </AuthDataProvider>
  );
}
