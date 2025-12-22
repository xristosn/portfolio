import { Layout } from '@/components/layout';
import { createBrowserRouter } from 'react-router';
import { ROUTES } from './routes';
import { About } from './about';
import { Projects } from './projects';

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
        element: <Projects />,
      },
    ],
  },
]);
