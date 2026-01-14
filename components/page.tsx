import { useState, useEffect } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import { useTheme } from 'next-themes';
import { X, Sun, Moon, Github, Building, TrendingUp, ExternalLink } from 'lucide-react';

export default function Page({ children, inverted, footerHidden }: { children: React.ReactNode, inverted?: boolean, footerHidden?: boolean }) {
  const [visible, setVisible] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    // Use resolvedTheme to handle system preference correctly
    const currentTheme = resolvedTheme || theme;
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={inverted ? 'bg-transparent min-h-screen flex flex-col' : 'bg-gray-50 dark:bg-[#0D1117] min-h-screen flex flex-col'}>
      <Navbar
        openDrawer={() => setVisible(!visible)} />
      <main className="flex-1">
        {children}
      </main>

        {/* Mobile Sidebar Overlay */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setVisible(false)}
        />

        {/* Mobile Sidebar */}
        <div className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-[#161B22] shadow-2xl z-50 transform transition-all duration-300 ease-out md:hidden ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
              <button
                onClick={() => setVisible(false)}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menu items */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              <button
                onClick={() => {
                  toggleTheme();
                  setVisible(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 group"
              >
                {mounted && resolvedTheme === 'dark' ? <Sun className="h-5 w-5 group-hover:scale-110 transition-transform" /> : <Moon className="h-5 w-5 group-hover:scale-110 transition-transform" />}
                <span className="font-medium">{mounted && resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <a
                href="https://github.com/renedeanda/Tech.Viet"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 group"
                onClick={() => setVisible(false)}
              >
                <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">GitHub</span>
              </a>

              <a
                href="/companies"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 group"
                onClick={() => setVisible(false)}
              >
                <Building className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Companies</span>
              </a>

              <a
                href="/investors"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 group"
                onClick={() => setVisible(false)}
              >
                <TrendingUp className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Investors</span>
              </a>

              <a
                href="https://www.renedeanda.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 group"
                onClick={() => setVisible(false)}
              >
                <ExternalLink className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Project by René</span>
              </a>
            </nav>
          </div>
        </div>
      <Footer inverted={inverted} hidden={footerHidden} />
    </div>
  )
}