"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/ui/Navbar";
import ScrollProgress from "@/components/ui/ScrollProgress";
import SmoothScroll from "@/components/animations/SmoothScroll";
import Identity from "@/components/sections/Identity";
import Trifecta from "@/components/sections/Trifecta";
import Projects from "@/components/sections/Projects";
import TechArsenal from "@/components/sections/TechArsenal";
import Credentials from "@/components/sections/Credentials";
import Process from "@/components/sections/Process";
import CVDownload from "@/components/sections/CVDownload";
import Contact from "@/components/sections/Contact";

const Hero = dynamic(() => import("@/components/sections/Hero"), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="text-4xl font-bold animate-pulse text-text-primary">TecHalaseh</div>
    </div>
  ),
});

export default function HomePage() {
  useEffect(() => {
    const styles = [
      "color: #0A84FF; font-size: 14px; font-weight: bold;",
      "color: #8B5CF6; font-size: 12px;",
      "color: #00D4AA; font-size: 12px;",
    ];
    console.log(
      `%c
  ████████╗███████╗ ██████╗██╗  ██╗ █████╗ ██╗      █████╗ ███████╗███████╗██╗  ██╗
  ╚══██╔══╝██╔════╝██╔════╝██║  ██║██╔══██╗██║     ██╔══██╗██╔════╝██╔════╝██║  ██║
     ██║   █████╗  ██║     ███████║███████║██║     ███████║███████╗█████╗  ███████║
     ██║   ██╔══╝  ██║     ██╔══██║██╔══██║██║     ██╔══██║╚════██║██╔══╝  ██╔══██║
     ██║   ███████╗╚██████╗██║  ██║██║  ██║███████╗██║  ██║███████║███████╗██║  ██║
     ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝
`,
      styles[0]
    );
    console.log(
      "%cHey there, fellow developer! Curious about the code?",
      styles[1]
    );
    console.log(
      "%chttps://github.com/jameelhalaseh/techalaseh-portfolio",
      styles[2]
    );
  }, []);

  return (
    <SmoothScroll>
      <Navbar />
      <ScrollProgress />
      <main>
        <Hero />
        <Identity />
        <Trifecta />
        <Projects />
        <TechArsenal />
        <Credentials />
        <Process />
        <CVDownload />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
