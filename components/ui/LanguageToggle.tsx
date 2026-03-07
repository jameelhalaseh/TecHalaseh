"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/lib/i18n/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className }: LanguageToggleProps) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <motion.button
      onClick={toggleLocale}
      className={cn(
        "relative flex items-center gap-2 rounded-full px-3 py-1.5",
        "border border-white/10 bg-white/5 text-sm font-medium text-text-primary",
        "transition-colors hover:border-accent-blue/40 hover:bg-white/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/50",
        className,
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={locale === "en" ? "Switch to Arabic" : "Switch to English"}
    >
      {/* Globe icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-text-secondary"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>

      <motion.span
        key={locale}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 8, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="inline-block min-w-[1.5rem] text-center"
      >
        {locale === "en" ? "EN" : "AR"}
      </motion.span>
    </motion.button>
  );
}
