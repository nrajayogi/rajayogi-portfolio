import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ContentProvider } from "@/lib/content-context";
import { LayoutClientWrapper } from "@/components/layout/layout-client-wrapper";

export const metadata: Metadata = {
  title: "Rajayogi Nandina | Product Designer & XR Researcher",
  description: "Portfolio of Rajayogi Nandina — Product Designer, Interaction Designer & XR Researcher (M.Sc. Interaction Technology at University of Twente). Specializing in spatial computing, industrial HRI, and multimodal interaction.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ContentProvider>
            <LayoutClientWrapper>{children}</LayoutClientWrapper>
          </ContentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
