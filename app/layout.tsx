import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "TecHalaseh | Full Stack Developer, Cybersecurity & AI Integration",
  description:
    "Jameel Halaseh — Building intelligent, secure digital experiences. Full-stack development, cybersecurity consulting, and AI integration.",
  openGraph: {
    title: "TecHalaseh | Full Stack Developer, Cybersecurity & AI Integration",
    description:
      "Jameel Halaseh — Building intelligent, secure digital experiences.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "TecHalaseh",
    description:
      "Full Stack Developer, Cybersecurity & AI Integration",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-[#06060B] text-[#F0F0F5] antialiased">
        {children}
      </body>
    </html>
  );
}
