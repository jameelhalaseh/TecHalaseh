"use client";

import { useState, useEffect, useCallback } from "react";

interface Section {
  id: string;
  label?: string;
  top: number;
  bottom: number;
}

interface ScrollProgressState {
  progress: number;
  activeSection: string | null;
  sections: Section[];
}

export function useScrollProgress(sectionSelector = "section[id]") {
  const [state, setState] = useState<ScrollProgressState>({
    progress: 0,
    activeSection: null,
    sections: [],
  });

  const buildSectionMap = useCallback(() => {
    const elements = document.querySelectorAll(sectionSelector);
    const mapped: Section[] = [];

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY;
      mapped.push({
        id: el.id,
        label: el.getAttribute("data-label") ?? el.id,
        top: rect.top + scrollY,
        bottom: rect.bottom + scrollY,
      });
    });

    return mapped;
  }, [sectionSelector]);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;

      const sections = buildSectionMap();
      const viewportMiddle = scrollY + window.innerHeight / 2;

      let activeSection: string | null = null;
      for (const section of sections) {
        if (viewportMiddle >= section.top && viewportMiddle <= section.bottom) {
          activeSection = section.id;
          break;
        }
      }

      setState({ progress, activeSection, sections });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [buildSectionMap]);

  return state;
}
