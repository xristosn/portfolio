/* eslint-disable react-refresh/only-export-components */
import { useIsMobile } from '@/hooks/use-is-mobile';
import { cn } from '@/lib/utils';
import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface NavSection {
  id: string;
  label: string;
  ref: React.RefObject<HTMLElement | null>;
}

interface NavContextType {
  sections: NavSection[];
  registerSection: (section: NavSection) => void;
  unregisterSection: (id: string) => void;
  activeId: string | null;
  setActiveId: (id: string) => void;
}

const NavContext = createContext<NavContextType | null>(null);

export const DotNavProvider = ({ children }: { children: React.ReactNode }) => {
  const [sections, setSections] = useState<NavSection[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const registerSection = useCallback((section: NavSection) => {
    setSections((prev) => {
      const filtered = prev.filter((s) => s.id !== section.id);
      const updated = [...filtered, section];

      return updated.sort((a, b) => {
        const topA = a.ref.current?.getBoundingClientRect().top ?? 0;
        const topB = b.ref.current?.getBoundingClientRect().top ?? 0;
        return topA - topB;
      });
    });
  }, []);

  const unregisterSection = useCallback((id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return (
    <NavContext.Provider
      value={{ sections, activeId, setActiveId, registerSection, unregisterSection }}
    >
      {children}
    </NavContext.Provider>
  );
};

export const useDotNav = () => {
  const context = useContext(NavContext);

  if (!context) throw new Error('useNav must be used within NavProvider');

  return context;
};

interface SectionChildProps {
  id?: string;
}

interface SectionProps {
  id: string;
  label: string;
  children: React.ReactElement<SectionChildProps>;
}

export const DotNavSection = ({ id, label, children }: SectionProps) => {
  const isMobile = useIsMobile();
  const { registerSection, unregisterSection, setActiveId } = useDotNav();
  const sectionRef = useRef<HTMLDivElement>(null);
  const { ref: setRef, inView } = useInView({ threshold: 0, rootMargin: '-45% 0px -45% 0px' });

  useEffect(() => {
    registerSection({
      id,
      label,
      ref: sectionRef,
    });
    return () => unregisterSection(id);
  }, [id, label, registerSection, sectionRef, unregisterSection]);

  useEffect(() => {
    if (inView) {
      setActiveId(id);
    }
  }, [inView, id, setActiveId]);

  if (isMobile) return children;

  return (
    <div id={id} className='relative'>
      <div
        ref={(el) => {
          setRef(el);
          sectionRef.current = el;
        }}
        className='absolute inset-0 pointer-events-none -z-10 scroll-mt-18'
      />
      {children}
    </div>
  );
};
export const DotNav = () => {
  const { sections, activeId, setActiveId } = useDotNav();
  const isMobile = useIsMobile();

  const onClick = (section: NavSection) => {
    if (!section.ref.current) return;

    setActiveId(section.id);

    section.ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const sortedSections = [...sections].sort((a, b) => {
    const rectA = a.ref.current?.getBoundingClientRect().top ?? 0;
    const rectB = b.ref.current?.getBoundingClientRect().top ?? 0;
    return rectA - rectB;
  });

  if (isMobile || sections.length <= 0) return null;

  return (
    <nav className='animate-blur-in fixed right-4 lg:right-8 2xl:right-10 top-1/2 w-7 -translate-y-1/2 z-50 flex flex-col items-center glass gap-4 xl:gap-6 2xl:gap-8 rounded-full py-3'>
      {sortedSections.map((section) => {
        const isActive = activeId === section.id;

        return (
          <button
            key={section.id}
            onClick={() => onClick(section)}
            className='group relative flex items-center justify-end outline-none'
          >
            <span className='opacity-0 2xl:opacity-50 -translate-x-2 transition-all duration-250 group-hover:opacity-100 group-hover:-translate-x-1 text-muted-foreground absolute top-1/2 right-full mr-4 -translate-y-1/2 whitespace-nowrap pointer-events-none 2xl:pointer-events-auto'>
              {section.label}
            </span>

            <div
              className={cn(
                'relative flex items-center justify-center transition-all duration-500 h-2 w-2 rounded-full',
                isActive
                  ? 'bg-primary scale-110'
                  : 'scale-100 bg-muted-foreground/40 group-hover:bg-muted-foreground'
              )}
            />
          </button>
        );
      })}
    </nav>
  );
};
