import { Footer, Header } from "@/components/app";
import { AuthDataProvider } from "@/context";
import { getNavigation } from "@/lib/data";

export default async function ({ children }: React.PropsWithChildren) {
  const navigation = (await getNavigation()) as HeaderNavigation;

  return (
    <div
      data-view="app"
      className="flex flex-col items-center justify-center bg-slate-50"
    >
      <AuthDataProvider>
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50">
          <Header navigation={navigation} />

          <main className="flex w-full grow flex-col max-md:mt-16">
            <div className="width-content mx-auto flex w-full grow flex-col p-4">
              {children}
            </div>
          </main>
        </div>

        <Footer />
      </AuthDataProvider>
    </div>
  );
}
