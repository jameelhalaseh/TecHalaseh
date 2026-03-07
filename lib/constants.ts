export const COLORS = {
  background: "#0A0A0F",
  surface: "#1A1A2E",
  surfaceLight: "#2A2A3E",
  accentBlue: "#0A84FF",
  accentCyan: "#00D4AA",
  accentPurple: "#8B5CF6",
  textPrimary: "#F5F5F7",
  textSecondary: "#86868B",
  textMuted: "#48484A",
} as const;

export const PROJECTS = [
  {
    id: "gaibe",
    accent: "#8B5CF6",
    accentGradient: "from-purple-500 to-violet-600",
    tech: ["React", "Firebase", "Azure Functions", "Claude API", "RAG", "Weaviate", "Arabic NLP"],
    mockupType: "phone" as const,
  },
  {
    id: "rmnetwork",
    accent: "#0A84FF",
    accentGradient: "from-blue-500 to-blue-600",
    tech: ["Next.js", "TypeScript", "Microsoft 365", "QR Systems", "Azure AD"],
    mockupType: "desktop" as const,
  },
  {
    id: "ragcollector",
    accent: "#00D4AA",
    accentGradient: "from-cyan-400 to-emerald-500",
    tech: ["Chrome Extension API", "Node.js", "SQLite", "React"],
    mockupType: "browser" as const,
  },
  {
    id: "freelance",
    accent: "#F59E0B",
    accentGradient: "from-amber-400 via-pink-500 to-purple-500",
    tech: [],
    mockupType: "cards" as const,
  },
] as const;

export const TECH_SKILLS = {
  frontend: {
    color: "#0A84FF",
    items: [
      { name: "React", level: 5 },
      { name: "Next.js", level: 5 },
      { name: "TypeScript", level: 5 },
      { name: "Tailwind CSS", level: 4 },
      { name: "Three.js", level: 3 },
      { name: "Framer Motion", level: 4 },
    ],
  },
  backend: {
    color: "#34D399",
    items: [
      { name: "Node.js", level: 5 },
      { name: "Express", level: 4 },
      { name: "Python", level: 4 },
      { name: "Firebase", level: 5 },
      { name: "Azure Functions", level: 4 },
    ],
  },
  security: {
    color: "#00D4AA",
    items: [
      { name: "Azure AD/IAM", level: 4 },
      { name: "Penetration Testing", level: 3 },
      { name: "SIEM", level: 3 },
      { name: "Security Architecture", level: 4 },
    ],
  },
  aiml: {
    color: "#8B5CF6",
    items: [
      { name: "LLM APIs", level: 5 },
      { name: "RAG", level: 4 },
      { name: "Prompt Engineering", level: 5 },
      { name: "Vector DBs", level: 3 },
    ],
  },
  devops: {
    color: "#F59E0B",
    items: [
      { name: "Git/GitHub", level: 5 },
      { name: "Docker", level: 3 },
      { name: "Azure DevOps", level: 4 },
      { name: "Vercel", level: 5 },
    ],
  },
} as const;

export const CREDENTIALS = [
  { id: "degree", abbr: "BSc", color: "#0A84FF" },
  { id: "sc900", abbr: "SC", color: "#00D4AA" },
  { id: "ai900", abbr: "AI", color: "#8B5CF6" },
  { id: "sc200", abbr: "SC", color: "#F59E0B" },
] as const;

export const NAV_SECTIONS = [
  { id: "about", icon: "user" },
  { id: "work", icon: "briefcase" },
  { id: "skills", icon: "zap" },
  { id: "cv", icon: "file" },
  { id: "contact", icon: "mail" },
] as const;
