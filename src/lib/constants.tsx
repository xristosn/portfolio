import { IoMdCode } from 'react-icons/io';
import { IoFileTrayStacked } from 'react-icons/io5';
import type { IconType } from 'react-icons/lib';
import { MdArchitecture, MdOutlineMultipleStop, MdDataObject } from 'react-icons/md';
import { SiVite, SiXstate } from 'react-icons/si';
import { LuTestTube } from 'react-icons/lu';
import { RiTeamFill } from 'react-icons/ri';

export const DEFAULT_ROLES = [
  'building scalable UI',
  "shipping code that won't make future-me cry",
  'obsessing over performance',
  'turning complex systems into smooth interfaces',
];

export const SKILLS: Array<{ title: string; summary: string; icon: IconType }> = [
  {
    title: 'Frontend Engineering',
    summary: '8+ years of web development',
    icon: IoMdCode,
  },
  {
    title: 'Full Stack Development',
    summary: 'Node.js, Next.js & .NET',
    icon: IoFileTrayStacked,
  },
  {
    title: 'Multi-Framework Experience',
    summary: 'Experience with React, Vue, Angular & Solid',
    icon: MdOutlineMultipleStop,
  },
  {
    title: 'UI Architecture & Design',
    summary: 'Scalable WCAG design systems',
    icon: MdArchitecture,
  },
  {
    title: 'State Management',
    summary: 'Redux, Zustand, RxJS, NgRx',
    icon: SiXstate,
  },
  {
    title: 'Modern Frontend Tooling',
    summary: 'Vite, Webpack & Tailwind CSS',
    icon: SiVite,
  },
  {
    title: 'Database Management',
    summary: 'MongoDB, MySQL & SQL Server',
    icon: MdDataObject,
  },
  {
    title: 'DevOps & Testing',
    summary: 'CI/CD, Docker & Cypress/Jest/Playwright',
    icon: LuTestTube,
  },
  {
    title: 'Leadership & Collaboration',
    summary: 'Mentoring, Architecture, Agile',
    icon: RiTeamFill,
  },
];

export const MARQUEE_TECHNOLOGIES = [
  'React',
  'TypeScript',
  'Angular',
  'Vue',
  'Solid',
  'Next.js',
  'Node.js',
  '.NET',
  'Redux',
  'Zustand',
  'RxJS',
  'NgRx',
  'Vite',
  'Webpack',
  'Tailwind',
  'Docker',
  'Cypress',
  'Jest',
  'Playwright',
  'MongoDB',
  'MySQL',
  'SQL Server',
];

export type Project = {
  title: string;
  url: string;
  summary: string;
  github?: string;
  posterUrl?: string;

  metric?: string;
  metricLabel?: string;
  tags?: string[];
  primaryActionLabel?: string;
};

export const PERSONAL_PROJECT_POSTERS: Record<string, string> = {
  'dev-x-kit': '/projects/dev_x_kit.webp',
  'demo-react-ai-chat': '/projects/demo_react_ai_chat.webp',
  portfolio: '/projects/portfolio.webp',
  'demo-interactive-resume-builder': '/projects/demo_resume_builder.webp',
};

export const PRODUCTION_PROJECTS: Project[] = [
  {
    title: 'Publitas',
    url: 'https://www.publitas.com/',
    summary:
      'Digital publishing platform with a publication editor, CMS, and online viewer, enabling businesses to create, manage, and share digital publications.',
  },
  {
    title: 'Sitecore Stream',
    url: 'https://doc.sitecore.com/stream/en/users/sitecore-stream/sitecore-stream.html',
    summary:
      'Brand-aware AI integrated across Sitecore\'s DXP. It uses "Brand Kits" and agentic workflows to automate on-brand content creation, translation and personalization securely.',
  },
  {
    title: 'Sitecore Design Studio',
    url: 'https://doc.sitecore.com/sai/en/users/sitecoreai/design-components/design-studio/design-studio.html',
    summary:
      'Centralized sandbox for marketers and developers to visualize and test components side-by-side. It features AI-powered variant generation, responsive previews and code inspection all without affecting live pages.',
  },
  {
    title: 'Sitecore Forms',
    url: 'https://doc.sitecore.com/sai/en/users/sitecoreai/forms.html',
    summary:
      'No-code, drag-and-drop SaaS builder. It lets marketers create responsive forms, use templates and send data to CRMs via webhooks without storing PII in XM Cloud.',
  },
  {
    title: 'Skroutz eCommerce Platform',
    url: 'https://www.skroutz.gr/?lang=en',
    summary:
      'Skroutz is Greece’s leading e-commerce marketplace and price comparison engine. It offers millions of products, reliable shipping, and verified user reviews.',
  },
  {
    title: 'Skroutz Merchants Platform',
    url: 'https://merchants.skroutz.gr/merchants?lang=en&store_lang=true',
    summary:
      'B2B portal for sellers to list products and manage orders. It provides XML/API integration, automated pricing tools, and "Fulfilled by Skroutz" warehousing and logistics.',
  },
  {
    title: 'Oddschecker (Global Website)',
    url: 'https://www.oddschecker.com/',
    summary:
      'Betting odds comparison site. It aggregates real-time data from 25+ bookmakers, processing approximately 100 million data updates per week for its users.',
  },
  {
    title: 'Viva Wallet Smart Checkout',
    url: 'https://developer.viva.com/smart-checkout/',
    summary:
      'Payment page that dynamically displays local payment methods. It supports 30+ options, handles 3DS authentication, and requires no PII storage on the merchant side.',
  },
  {
    title: 'Alpha Bank’s Teller Platform',
    url: 'https://www.alpha.gr/en/',
    summary:
      'A mission-critical interface for real-time branch transactions, integrating core banking ledgers with secure, compliant front-line financial service workflows.',
  },
];

export const GITHUB_REPO_URL =
  'https://api.github.com/search/repositories?q=user:xristosn+topic:public';

export const GITHUB_URL = 'https://github.com/xristosn';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/xristos-niaskos';
export const RESUME_URL = 'https://xnresume.netlify.app/';
