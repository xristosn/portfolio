import { DotNavSection } from '@/components/dot-nav';
import { Reveal } from '@/components/reveal';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { capitalize } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { IoLogoGithub, IoMdHome } from 'react-icons/io';

interface Project {
  title: string;
  url: string;
  summary: string;
  github?: string;
}

interface GithubPartialProject {
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  updated_at: string;
}

const PRODUCTION_PROJECTS: Project[] = [
  {
    title: 'Sitecore Stream',
    url: 'https://www.sitecore.com/platform/sitecore-stream',
    summary:
      'Brand-aware AI integrated across Sitecore\'s DXP. It uses "Brand Kits" and agentic workflows to automate on-brand content creation, translation and personalization securely.',
  },
  {
    title: 'Sitecore Design Studio',
    url: 'https://doc.sitecore.com/sai/en/users/sitecoreai/explorer/design-studio.html',
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

export const Projects: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [personalProjects, setPersonalProjects] = useState<Project[]>([]);

  const fetchPersonalProjects = async () => {
    setLoading(true);

    try {
      const response = await fetch('https://api.github.com/users/xristosn/repos');
      const result = (await response.json()) as GithubPartialProject[];

      setPersonalProjects(
        result
          .sort((a, b) => {
            const stampA = new Date(a.updated_at).getTime();
            const stampB = new Date(b.updated_at).getTime();
            return stampA - stampB;
          })
          .map((r) => ({
            title: r.name
              .split('-')
              .map((word) => (word.length <= 2 ? word.toUpperCase() : capitalize(word)))
              .join(' '),
            summary: r.description,
            github: r.html_url,
            url: r.homepage,
          }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonalProjects();
  }, []);

  return (
    <div className='container max-w-5xl mx-auto p-4 flex flex-col gap-18 md:gap-36 xl:gap-64 md:pt-16 xl:pt-32'>
      <DotNavSection id='personal-projects' label='My personal projects'>
        <Reveal>
          <div className='flex flex-col gap-8 reveal-soft-rise text-center'>
            <div className='flex flex-col gap-2'>
              <h4 className='text-3xl text-gradient'>My personal projects</h4>
              <p className='text-muted-foreground'>
                A look into what I build when I'm following my curiosity. All repositories are
                public and open for contribution.
              </p>
            </div>

            {loading ? (
              <div className='glass rounded-lg h-116 w-full flex items-center justify-center'>
                <Spinner className='size-12' />
              </div>
            ) : personalProjects.length ? (
              <ProjectsGrid projects={personalProjects} />
            ) : (
              <div className='h-60 w-full flex flex-col items-center justify-center gap-4 text-2xl'>
                Explore my full portfolio of public projects
                <Button asChild variant='outline' size='icon-lg' className='size-12'>
                  <a href='https://github.com/xristosn?tab=repositories' target='_blank'>
                    <IoLogoGithub />
                  </a>
                </Button>
              </div>
            )}
          </div>
        </Reveal>
      </DotNavSection>

      <DotNavSection id="production" label='Production Work'>
        <Reveal>
          <div className='flex flex-col gap-8 reveal-soft-rise text-center'>
            <div className='flex flex-col gap-2'>
              <h4 className='text-3xl text-gradient'>Production Work</h4>
              <p className='text-muted-foreground'>
                A selection of production-grade systems I've led or collaborated on throughout my
                career. These key projects highlight my focus on scaling modern frontend (and
                fullstack) frameworks and architecting complex systems.
              </p>
            </div>

            <ProjectsGrid projects={PRODUCTION_PROJECTS} />
          </div>
        </Reveal>
      </DotNavSection>
    </div>
  );
};

function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 w-full gap-8 md:gap-12 justify-items-center'>
      {projects.map((project) => (
        <div
          key={project.title}
          className='glass p-4 rounded-lg w-full h-full flex flex-col gap-4 md:last:odd:col-span-2 md:last:odd:justify-self-center md:last:odd:max-w-md'
        >
          <p className='text-xl'>{project.title}</p>
          <p className='text-sm text-muted-foreground'>{project.summary}</p>

          <div className='flex gap-4 justify-center mt-auto'>
            <Button asChild variant='outline' size='icon-lg' className='btn-gradient'>
              <a href={project.url} target='_blank'>
                <IoMdHome />
              </a>
            </Button>

            {project.github && (
              <Button asChild variant='outline' size='icon-lg' className='border-gray-700'>
                <a href={project.github} target='_blank'>
                  <IoLogoGithub />
                </a>
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
