import { useState, useEffect } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import { useTheme } from 'next-themes';
import { X, Sun, Moon, Github, Building, TrendingUp, BarChart3, ExternalLink } from 'lucide-react';

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
    <div className="bg-background min-h-screen flex flex-col">
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
        <div className={`fixed top-0 right-0 h-full w-72 bg-card border-l border-border shadow-2xl z-50 transform transition-all duration-300 ease-out md:hidden ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Menu</h2>
              <button
                onClick={() => setVisible(false)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menu items */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              <a
                href="/companies"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary hover:text-primary transition-colors"
                onClick={() => setVisible(false)}
              >
                <Building className="h-5 w-5" />
                <span className="font-medium">Companies</span>
              </a>

              <a
                href="/investors"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary hover:text-primary transition-colors"
                onClick={() => setVisible(false)}
              >
                <TrendingUp className="h-5 w-5" />
                <span className="font-medium">Investors</span>
              </a>

              <a
                href="/market"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary hover:text-primary transition-colors"
                onClick={() => setVisible(false)}
              >
                <BarChart3 className="h-5 w-5" />
                <span className="font-medium">Market Overview</span>
              </a>

              <button
                onClick={() => {
                  toggleTheme();
                  setVisible(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary hover:text-primary transition-colors"
              >
                {mounted && resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="font-medium">{mounted && resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>

              <a
                href="https://github.com/renedeanda/Tech.Viet"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary hover:text-primary transition-colors"
                onClick={() => setVisible(false)}
              >
                <Github className="h-5 w-5" />
                <span className="font-medium">GitHub</span>
              </a>

              <a
                href="https://www.renedeanda.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary hover:text-primary transition-colors"
                onClick={() => setVisible(false)}
              >
                <ExternalLink className="h-5 w-5" />
                <span className="font-medium">Project by René</span>
              </a>
            </nav>
          </div>
        </div>
      <Footer inverted={inverted} hidden={footerHidden} />
    </div>
  )
}