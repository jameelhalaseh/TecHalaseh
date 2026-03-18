/* ─── Avatar ─── */
export const AVATAR_MODEL_URL = "/models/avatar.glb";
export const AVATAR_ANIMATIONS_PATH = "/models/animations/";

/* ─── Colors (mirrors CSS theme) ─── */
export const COLORS = {
  bgVoid: "#06060B",
  bgPrimary: "#0A0A12",
  bgElevated: "#111119",
  bgSurface: "#1A1A2E",
  accentBlue: "#0A84FF",
  accentBlueHover: "#3399FF",
  accentCyan: "#00D4AA",
  accentPurple: "#8B5CF6",
  accentWarm: "#FF6B35",
  textPrimary: "#F0F0F5",
  textSecondary: "#A0A0B0",
  textTertiary: "#6B6B80",
  textDisabled: "#3D3D50",
} as const;

/* ─── Brand ─── */
export const BRAND = {
  name: "TecHalaseh",
  owner: "Jameel Halaseh",
  tagline: "I build things that think.",
  subtitle: "Full Stack Developer · Security Engineer · AI Integrator",
  location: "Amman, Jordan",
  email: "jameel@techalaseh.com",
  github: "https://github.com/jameelhalaseh",
  linkedin: "https://linkedin.com/in/jameelhalaseh",
  domain: "techalaseh.com",
} as const;

/* ─── Projects ─── */
export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  stat: string;
  accent: string;
}

export const PROJECTS: Project[] = [
  {
    id: "gaibe",
    title: "GAIBE — AI-Powered Bible Engagement Platform",
    description:
      "An AI chatbot with a 13-layer processing pipeline serving Arabic-speaking users. Features a Scripture Memory Coach, theological safety verification, sentiment analysis, and RAG-powered contextual responses.",
    tech: ["React", "Node.js", "PostgreSQL", "OpenAI GPT", "RAG", "Heroku"],
    stat: "13-layer AI pipeline",
    accent: COLORS.accentPurple,
  },
  {
    id: "rmnetwork",
    title: "RM Network Internal Tools",
    description:
      "A suite of internal tools for a multi-department organization — asset management with QR codes, admin dashboards, Microsoft 365 automation, and Azure AD integration.",
    tech: ["Next.js", "TypeScript", "Microsoft 365 API", "Azure AD", "QR Systems"],
    stat: "15-member organization streamlined",
    accent: COLORS.accentBlue,
  },
  {
    id: "ragcollector",
    title: "RAG Data Collector",
    description:
      "A Chrome extension paired with a Node.js backend and React dashboard for collecting, structuring, and managing web data to build AI-ready knowledge bases. Includes a full website crawler.",
    tech: ["Chrome Extension API", "Node.js", "SQLite", "React", "Web Scraping"],
    stat: "Raw data to AI-ready knowledge base",
    accent: COLORS.accentCyan,
  },
  {
    id: "aimediapipeline",
    title: "AI Media Workflow Pipeline",
    description:
      "Designed and implemented an AI-powered content production pipeline for Arabic-language media — AI-generated video, voice synthesis, and automated workflows.",
    tech: ["HeyGen", "ElevenLabs", "n8n (self-hosted)", "Python"],
    stat: "End-to-end AI content pipeline",
    accent: COLORS.accentWarm,
  },
];

/* ─── Services ─── */
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
}

export const SERVICES: Service[] = [
  {
    id: "fullstack",
    title: "Full-Stack Web Development",
    description: "Custom websites and web applications with React, Next.js, Node.js, TypeScript",
    icon: "code",
    accent: COLORS.accentBlue,
  },
  {
    id: "ai",
    title: "AI Integration & Smart Products",
    description: "AI chatbots, RAG systems, LLM integration, AI content pipelines",
    icon: "brain",
    accent: COLORS.accentPurple,
  },
  {
    id: "security",
    title: "Cybersecurity Consulting",
    description: "Security audits, cloud security, policy development, vulnerability assessment",
    icon: "shield",
    accent: COLORS.accentCyan,
  },
  {
    id: "cloud",
    title: "Cloud & IT Infrastructure",
    description: "Azure setup, M365 admin, CI/CD, deployment automation",
    icon: "cloud",
    accent: COLORS.accentBlue,
  },
  {
    id: "consulting",
    title: "Technical Consulting",
    description: "Tech strategy, workflow automation, IT department structuring",
    icon: "lightbulb",
    accent: COLORS.accentWarm,
  },
];

/* ─── Tech Skills ─── */
export interface TechSkill {
  name: string;
  level: number;
}

export interface SkillCategory {
  label: string;
  color: string;
  items: TechSkill[];
}

export const TECH_SKILLS: Record<string, SkillCategory> = {
  frontend: {
    label: "Frontend",
    color: COLORS.accentBlue,
    items: [
      { name: "React", level: 5 },
      { name: "Next.js", level: 5 },
      { name: "TypeScript", level: 5 },
      { name: "Tailwind", level: 4 },
      { name: "Three.js", level: 3 },
      { name: "Framer Motion", level: 4 },
    ],
  },
  backend: {
    label: "Backend",
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
    label: "Security",
    color: COLORS.accentCyan,
    items: [
      { name: "Azure AD/IAM", level: 4 },
      { name: "Pen Testing", level: 3 },
      { name: "SIEM", level: 3 },
      { name: "Security Architecture", level: 4 },
    ],
  },
  aiml: {
    label: "AI/ML",
    color: COLORS.accentPurple,
    items: [
      { name: "LLM APIs", level: 5 },
      { name: "RAG", level: 4 },
      { name: "Prompt Engineering", level: 5 },
      { name: "Vector DBs", level: 3 },
    ],
  },
  devops: {
    label: "DevOps",
    color: COLORS.accentWarm,
    items: [
      { name: "Git/GitHub", level: 5 },
      { name: "Docker", level: 3 },
      { name: "Azure DevOps", level: 4 },
      { name: "Vercel", level: 5 },
    ],
  },
};

/* ─── Credentials ─── */
export interface Credential {
  id: string;
  title: string;
  abbr: string;
  status: "completed" | "in-progress";
  color: string;
}

export const CREDENTIALS: Credential[] = [
  { id: "degree", title: "Information Security Degree", abbr: "BSc", status: "completed", color: COLORS.accentBlue },
  { id: "ceh", title: "Ethical Hacking (40 Hours)", abbr: "CEH", status: "completed", color: COLORS.accentCyan },
  { id: "ai900", title: "AWS AI Practitioner", abbr: "AWS", status: "in-progress", color: COLORS.accentPurple },
  { id: "sc200", title: "SC-200 Security Operations", abbr: "SC", status: "in-progress", color: COLORS.accentWarm },
];

/* ─── Impact Metrics ─── */
export const METRICS = [
  { label: "Years Building for the Web", value: 2, prefix: "", suffix: "+" },
  { label: "Projects Delivered", value: 10, prefix: "", suffix: "+" },
  { label: "Layer AI Pipeline Built", value: 13, prefix: "", suffix: "-Layer" },
  { label: "Member Org Secured", value: 15, prefix: "", suffix: "-Member" },
] as const;

/* ─── Trifecta Pillars ─── */
export const TRIFECTA = [
  {
    id: "security",
    title: "Cybersecurity",
    tagline: "I don't just build things — I make sure they can't be broken.",
    color: COLORS.accentCyan,
    skills: ["Azure AD/IAM", "Penetration Testing", "Security Architecture", "SIEM", "Compliance"],
  },
  {
    id: "development",
    title: "Full-Stack Development",
    tagline: "From concept to deployment — I build the whole stack.",
    color: COLORS.accentBlue,
    skills: ["React/Next.js", "Node.js/Express", "TypeScript", "Firebase", "Vercel"],
  },
  {
    id: "ai",
    title: "AI Integration",
    tagline: "I make products think, learn, and respond intelligently.",
    color: COLORS.accentPurple,
    skills: ["LLM APIs", "RAG Systems", "Prompt Engineering", "Vector DBs", "AI Pipelines"],
  },
] as const;

export const TRIFECTA_CLOSING =
  "Most developers can't do security. Most security people can't build apps. Almost nobody integrates AI into both. I do all three.";

/* ─── Process Steps (Mind Scene) ─── */
export const PROCESS_STEPS = [
  { id: "discovery", label: "Discovery", nodes: ["Requirements", "Threat Modeling", "Architecture"] },
  { id: "design", label: "Design", nodes: ["System Design", "API Contracts", "Security-First"] },
  { id: "build", label: "Build", nodes: ["Iterative Development", "CI/CD", "AI-Assisted Coding"] },
  { id: "secure", label: "Secure", nodes: ["Security Audit", "Pen Testing", "Compliance"] },
  { id: "deploy", label: "Deploy", nodes: ["Cloud Deployment", "Monitoring", "Continuous Improvement"] },
] as const;

/* ─── Navigation Scenes ─── */
export const SCENES = [
  { id: "greeting", label: "Hello" },
  { id: "projects", label: "Work" },
  { id: "mind", label: "Process" },
  { id: "showcase", label: "Skills" },
  { id: "trifecta", label: "Identity" },
  { id: "farewell", label: "Contact" },
] as const;
