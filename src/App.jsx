import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Contact from './pages/Contact';
import GetStarted from './pages/GetStarted';
import './App.css';

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Home />
        },
        {
          path: "about",
          element: <About />
        },
        {
          path: "features",
          element: <Features />
        },
        {
          path: "contact",
          element: <Contact />
        },
        {
          path: "get-started",
          element: <GetStarted />
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}
