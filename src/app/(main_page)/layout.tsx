import { api } from "@/trpc/server";
import { DesktopHeader, Footer, MobileHeader } from "./_components";

export default async function ({ children }: React.PropsWithChildren) {
  const navigation = await api.public.navigation.getNavigation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <DesktopHeader navigation={navigation} className="max-md:hidden" />
      <MobileHeader navigation={navigation} className="md:hidden" />

      <main className="flex w-full grow flex-col max-md:mt-16">
        <div className="md:~max-w-[60rem]/[80rem] ~p-4/6 mx-auto flex w-full grow flex-col">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
