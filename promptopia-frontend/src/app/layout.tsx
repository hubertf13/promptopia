import type { Metadata } from "next";
import "@/styles/globals.css"
import Nav from "@/components/Nav";
import { AuthProvider } from "@/components/AuthProvider";
import { Suspense } from "react";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Promptopia",
  description: "Discover & Share AI Prompts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="main">
            <div className="gradient" />
          </div>

          <main className="app">
            <Nav />
            <Suspense fallback={<Loading />}>
              {children}
            </Suspense>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
