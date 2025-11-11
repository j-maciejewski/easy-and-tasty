import { ThemeProvider } from "@/context";

export default function ({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div data-view="dashboard">{children}</div>
    </ThemeProvider>
  );
}
