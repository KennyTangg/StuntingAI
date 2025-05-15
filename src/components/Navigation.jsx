import { Link } from 'react-router-dom';
import Logo from './icons/Logo';

export default function Navigation() {
  return (
    <nav className="bg-[#0f172a] border-b border-slate-800 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <Logo />
                <span className="ml-2 text-xl font-bold">StuntingAI</span>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-300 hover:text-white transition">Home</Link>
            <Link to="/features" className="text-slate-300 hover:text-white transition">Features</Link>
            <Link to="/about" className="text-slate-300 hover:text-white transition">About</Link>
            <Link to="/contact" className="text-slate-300 hover:text-white transition">Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}




