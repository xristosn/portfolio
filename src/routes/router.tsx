import { Layout } from '@/components/layout';
import { createBrowserRouter } from 'react-router';
import { ROUTES } from './routes';
import { About } from './about';

export const router = createBrowserRouter([
  {
    element: <Layout />,

    children: [
      {
        path: ROUTES.about,
        element: <About />,
      },
      {
        path: ROUTES.projects,
        lazy: async () => {
          const { Projects } = await import('./projects');
          return { Component: Projects };
        },
      },
    ],
  },
]);
