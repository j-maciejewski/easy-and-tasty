import { Suspense } from "react";

import { ToggleThemeButton } from "@/components/dashboard";
import { AuthDataProvider } from "@/context";

export default function ({ children }: React.PropsWithChildren) {
  return (
    <AuthDataProvider>
      <ToggleThemeButton className="absolute top-0.5 right-0.5" />
      <div className="flex h-screen flex-col items-center justify-center bg-sidebar">
        <Suspense>{children}</Suspense>
      </div>
    </AuthDataProvider>
  );
}
