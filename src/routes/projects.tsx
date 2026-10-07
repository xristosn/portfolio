import { DotNavSection } from '@/components/dot-nav';
import { ProjectCard } from '@/components/project-card';
import { Reveal } from '@/components/reveal';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  GITHUB_REPO_URL,
  PERSONAL_PROJECT_POSTERS,
  PRODUCTION_PROJECTS,
  type Project,
} from '@/lib/constants';
import { capitalize } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { IoLogoGithub } from 'react-icons/io';

type GithubPartialProject = {
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  updated_at: string;
  topics: string[];
};

export const Projects: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [personalProjects, setPersonalProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchPersonalProjects = async () => {
      try {
        const response = await fetch(GITHUB_REPO_URL);
        const result = (await response.json()) as { items: GithubPartialProject[] };

        setPersonalProjects(
          result.items
            .sort((a, b) => {
              const stampA = new Date(a.updated_at).getTime();
              const stampB = new Date(b.updated_at).getTime();
              return stampB - stampA;
            })
            .map((r) => ({
              title: r.name
                .split('-')
                .map((word) => (word.length <= 2 ? word.toUpperCase() : capitalize(word)))
                .join(' '),
              summary: r.description,
              github: r.html_url,
              url: r.homepage,
              posterUrl: PERSONAL_PROJECT_POSTERS[r.name],
            })),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalProjects();
  }, []);

  return (
    <div className='container max-w-5xl mx-auto p-4 flex flex-col gap-18 md:gap-36 xl:gap-64 md:pt-16 xl:pt-32'>
      <h1 className='sr-only'>Projects</h1>

      <DotNavSection id='production' label='Production Work'>
        <Reveal variant='soft-rise' className='flex flex-col gap-8 text-center'>
          <div className='flex flex-col gap-2'>
            <h2 className='text-6xl text-gradient'>Production Work</h2>
            <p className='text-muted-foreground'>
              A selection of production-grade systems I've led or collaborated on throughout my
              career. These key projects highlight my focus on scaling modern frontend (and
              fullstack) frameworks and architecting complex systems.
            </p>
          </div>

          <ProjectsGrid projects={PRODUCTION_PROJECTS} />
        </Reveal>
      </DotNavSection>

      <DotNavSection id='personal-projects' label='My personal projects'>
        <Reveal variant='soft-rise' className='flex flex-col gap-8 text-center'>
          <div className='flex flex-col gap-2'>
            <h2 className='text-6xl text-gradient'>My personal projects</h2>
            <p className='text-muted-foreground'>
              A look into what I build when I'm following my curiosity. All repositories are
              public and open for contribution.
            </p>
          </div>

          {loading ? (
            <div
              role='status'
              className='glass rounded-lg h-116 w-full flex items-center justify-center'
            >
              <span className='sr-only'>Loading personal projects</span>
              <span aria-hidden='true'>
                <Spinner className='size-12' />
              </span>
            </div>
          ) : personalProjects.length ? (
            <ProjectsGrid projects={personalProjects} />
          ) : (
            <div
              role='status'
              className='h-60 w-full flex flex-col items-center justify-center gap-4 text-2xl'
            >
              Explore my full portfolio of public projects
              <Button
                nativeButton={false}
                role='link'
                render={
                  <a
                    href='https://github.com/xristosn?tab=repositories'
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='View public GitHub repositories'
                  >
                    <IoLogoGithub aria-hidden='true' />
                  </a>
                }
                variant='outline'
                size='icon-lg'
                className='size-12'
              />
            </div>
          )}
        </Reveal>
      </DotNavSection>
    </div>
  );
};

const ProjectsGrid: React.FC<{ projects: Project[] }> = ({ projects }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 w-full gap-8 md:gap-12 justify-items-center'>
      {projects.map((project) => (
        <ProjectCard
          key={project.title}
          href={project.url}
          title={project.title}
          description={project.summary}
          githubHref={project.github}
          posterUrl={project.posterUrl}
          metric={project.metric}
          metricLabel={project.metricLabel}
          primaryActionLabel={project.primaryActionLabel}
          tags={project.tags}
        />
      ))}
    </div>
  );
};
