import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TecHalaseh — Full Stack Developer, Cybersecurity & AI Integration",
  description:
    "Portfolio of TecHalaseh — Full Stack Developer, Security Engineer, and AI Integrator based in Amman, Jordan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
