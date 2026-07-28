import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Menu, Sun, Moon, Github, Languages } from 'lucide-react';
import { useLocale, localePath, alternatePath, strings } from '../util/i18n';

export default function Navbar({ openDrawer }: { openDrawer: () => void; }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const s = strings[locale];

  const navLinks = [
    { href: localePath(locale, '/companies'), label: s.nav.companies },
    { href: localePath(locale, '/investors'), label: s.nav.investors },
    { href: localePath(locale, '/market'), label: s.nav.market },
    { href: localePath(locale, '/about'), label: s.nav.about },
  ];

  const switchTarget = locale === 'vi' ? 'en' : 'vi';
  const switchHref = alternatePath(router.asPath, switchTarget);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    // Use resolvedTheme to handle system preference correctly
    const currentTheme = resolvedTheme || theme;
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="w-full bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={localePath(locale, '/')} className="text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors">
            Viet<span className="text-primary">.io</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = router.asPath.split('?')[0] === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary bg-secondary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <a
              href="https://github.com/renedeanda/viet.io"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>

            <Link
              href={switchHref}
              className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-1.5"
              aria-label={`Switch language to ${s.nav.language}`}
            >
              <Languages className="h-4 w-4" />
              {s.nav.language}
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Toggle theme"
            >
              {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={openDrawer}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>
  )
}
