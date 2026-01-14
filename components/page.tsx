import { useState, useEffect } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import { useTheme } from 'next-themes';
import { X, Sun, Moon, Github, Building, TrendingUp, ExternalLink } from 'lucide-react';

export default function Page({ children, inverted, footerHidden }: { children: React.ReactNode, inverted?: boolean, footerHidden?: boolean }) {
  const [visible, setVisible] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <main className={inverted ? 'bg-transparent min-h-screen' : 'bg-gray-50 dark:bg-[#0D1117] min-h-screen'}>
        <Navbar
          openDrawer={() => setVisible(!visible)} />
        {children}

        {/* Mobile Sidebar Overlay */}
        {visible && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setVisible(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-[#161B22] shadow-xl z-50 transform transition-transform duration-300 md:hidden ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Close button */}
            <div className="flex justify-end p-4 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setVisible(false)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menu items */}
            <nav className="flex-1 overflow-y-auto p-4">
              <button
                onClick={() => {
                  toggleTheme();
                  setVisible(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {mounted && theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span>{mounted && theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <a
                href="https://github.com/renedeanda/Tech.Viet"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setVisible(false)}
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </a>

              <a
                href="/companies"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setVisible(false)}
              >
                <Building className="h-5 w-5" />
                <span>Companies</span>
              </a>

              <a
                href="/investors"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setVisible(false)}
              >
                <TrendingUp className="h-5 w-5" />
                <span>Investors</span>
              </a>

              <a
                href="https://www.renedeanda.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setVisible(false)}
              >
                <ExternalLink className="h-5 w-5" />
                <span>Project by René</span>
              </a>
            </nav>
          </div>
        </div>
      </main>
      <Footer inverted={inverted} hidden={footerHidden} />
    </>
  )
}