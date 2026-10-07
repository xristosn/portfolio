import { Link } from 'react-router';
import { cn } from '@/lib/utils';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

type NavSection = {
  id: string;
  label: string;
  element: HTMLElement;
};

type NavRegistrationContextType = {
  registerSection: (section: NavSection) => void;
  unregisterSection: (id: string) => void;
};

type DotNavProps = {
  children: ReactNode;
};

type SectionProps = {
  id: string;
  label: string;
  children: ReactNode;
};

const NavRegistrationContext = createContext<NavRegistrationContextType | null>(null);

function useNavRegistration(): NavRegistrationContextType {
  const context = useContext(NavRegistrationContext);

  if (!context) throw new Error('DotNavSection must be used within DotNav');

  return context;
}

function compareDocumentOrder(a: NavSection, b: NavSection): number {
  if (a.element === b.element) return 0;

  return a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

function getClosestIntersectingSection(
  sections: NavSection[],
  intersectingIds: Set<string>,
): string | null {
  const viewportCenter = window.innerHeight / 2;
  let closestId: string | null = null;
  let closestDistance = Number.POSITIVE_INFINITY;

  for (const section of sections) {
    if (!intersectingIds.has(section.id)) continue;

    const { top, bottom } = section.element.getBoundingClientRect();
    const distance =
      viewportCenter < top ? top - viewportCenter : viewportCenter > bottom ? viewportCenter - bottom : 0;

    if (distance < closestDistance) {
      closestId = section.id;
      closestDistance = distance;
    }
  }

  return closestId;
}

export const DotNav: React.FC<DotNavProps> = ({ children }) => {
  const [sections, setSections] = useState<NavSection[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sectionRegistry = useRef(new Map<string, NavSection>());
  const orderedSections = useRef<NavSection[]>([]);
  const intersectingIds = useRef(new Set<string>());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const activeIdRef = useRef<string | null>(null);

  const registerSection = useCallback((section: NavSection) => {
    sectionRegistry.current.set(section.id, section);
    observerRef.current?.observe(section.element);
    orderedSections.current = [...sectionRegistry.current.values()].sort(compareDocumentOrder);
    setSections(orderedSections.current);
  }, []);

  const unregisterSection = useCallback((id: string) => {
    const section = sectionRegistry.current.get(id);
    if (!section) return;

    observerRef.current?.unobserve(section.element);
    sectionRegistry.current.delete(id);
    intersectingIds.current.delete(id);
    orderedSections.current = [...sectionRegistry.current.values()].sort(compareDocumentOrder);
    setSections(orderedSections.current);

    if (activeIdRef.current === id) {
      const nextActiveId = getClosestIntersectingSection(
        orderedSections.current,
        intersectingIds.current,
      );
      activeIdRef.current = nextActiveId;
      setActiveId(nextActiveId);
    }
  }, []);

  const registrationContext = useMemo(
    () => ({ registerSection, unregisterSection }),
    [registerSection, unregisterSection],
  );

  useEffect(() => {
    intersectingIds.current.clear();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id;
          if (!sectionRegistry.current.has(id)) continue;

          if (entry.isIntersecting) intersectingIds.current.add(id);
          else intersectingIds.current.delete(id);
        }

        const nextActiveId = getClosestIntersectingSection(
          orderedSections.current,
          intersectingIds.current,
        );

        if (nextActiveId !== null && nextActiveId !== activeIdRef.current) {
          activeIdRef.current = nextActiveId;
          setActiveId(nextActiveId);
        }
      },
      { threshold: 0, rootMargin: '-45% 0px -45% 0px' },
    );

    observerRef.current = observer;
    for (const section of sectionRegistry.current.values()) observer.observe(section.element);

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, []);

  return (
    <NavRegistrationContext.Provider value={registrationContext}>
      {children}
      {sections.length > 0 && (
        <nav
          aria-label='Page sections'
          className='animate-blur-in fixed right-4 lg:right-8 2xl:right-10 top-1/2 z-50 hidden w-7 -translate-y-1/2 flex-col items-center rounded-full glass py-3 md:flex'
        >
          <ul className='flex flex-col items-center gap-4 xl:gap-6 2xl:gap-8'>
            {sections.map((section) => {
              const isActive = activeId === section.id;

              return (
                <li key={section.id}>
                  <Link
                    to={{ hash: `#${section.id}` }}
                    aria-label={section.label}
                    aria-current={isActive ? 'location' : undefined}
                    className='group relative flex items-center justify-end outline-none focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4'
                  >
                    <span className='pointer-events-none absolute top-1/2 right-full mr-4 -translate-x-2 -translate-y-1/2 whitespace-nowrap text-muted-foreground opacity-0 transition-all duration-250 group-hover:-translate-x-1 group-hover:opacity-100 2xl:pointer-events-auto 2xl:opacity-50'>
                      {section.label}
                    </span>

                    <span
                      aria-hidden='true'
                      className={cn(
                        'relative flex size-2 items-center justify-center rounded-full transition-all duration-500',
                        isActive
                          ? 'scale-110 bg-primary'
                          : 'scale-100 bg-muted-foreground/40 group-hover:bg-muted-foreground',
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </NavRegistrationContext.Provider>
  );
};

export const DotNavSection: React.FC<SectionProps> = ({
  id,
  label,
  children,
}): React.JSX.Element => {
  const { registerSection, unregisterSection } = useNavRegistration();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    registerSection({ id, label, element });
    return () => unregisterSection(id);
  }, [id, label, registerSection, unregisterSection]);

  return (
    <section ref={sectionRef} id={id} aria-label={label} className='relative scroll-mt-18'>
      {children}
    </section>
  );
};
