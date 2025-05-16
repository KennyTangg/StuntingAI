import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import FooterLinkColumn from './FooterLinkColumn';
import Logo from './icons/Logo';

export default function Layout() {
  const footerColumns = [
    {
      title: "Product",
      links: ["Features", "Pricing", "Case Studies", "Documentation"]
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Blog", "Contact"]
    },
    {
      title: "Connect",
      links: ["Twitter", "LinkedIn", "Facebook", "Instagram"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-[#0a1122] border-t border-slate-800 py-8 sm:py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="text-center sm:text-left">
              <div className="flex items-center mb-4 justify-center sm:justify-start">
                <Logo />
                <span className="ml-2 text-xl font-bold">StuntingAI</span>
              </div>
              <p className="text-slate-400">
                Advanced AI technology for monitoring and preventing child stunting.
              </p>
            </div>

            {footerColumns.map((column, index) => (
              <FooterLinkColumn key={index} {...column} />
            ))}
          </div>

          <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center md:items-start">
            <p className="text-sm text-slate-500 mb-4 md:mb-0 text-center md:text-left">
              © {new Date().getFullYear()} StuntingAI. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6">
              <a href="#" className="text-sm text-slate-500 hover:text-white transition">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-white transition">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-slate-500 hover:text-white transition">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}









