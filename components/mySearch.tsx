import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';

interface SearchItem {
  data: {
    name: string;
    slug: string;
    tagline?: string;
    description?: string;
  };
}

export default function MySearch({
  items,
  value,
  onValueChange,
  hrefForItem,
  placeholder,
  noResultsText,
}: {
  items: SearchItem[];
  value: string;
  onValueChange: (value: string) => void;
  hrefForItem: (item: SearchItem['data']) => string;
  placeholder: string;
  noResultsText: (query: string) => string;
}) {
  const router = useRouter();
  const listboxId = useId();
  const inputId = useId();
  const searchRef = useRef<HTMLDivElement>(null);
  const [showResults, setShowResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const results = useMemo(() => {
    const query = value.trim().toLocaleLowerCase();
    if (!query) return [];
    return items.filter((item) => item.data.name.toLocaleLowerCase().includes(query));
  }, [items, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeIndex >= results.length) setActiveIndex(results.length - 1);
  }, [activeIndex, results.length]);

  const chooseResult = (item: SearchItem) => {
    setShowResults(false);
    setActiveIndex(-1);
    void router.push(hrefForItem(item.data));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setShowResults(false);
      setActiveIndex(-1);
      return;
    }

    if (!showResults || results.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      chooseResult(results[activeIndex]);
    }
  };

  const expanded = showResults && value.trim().length > 0;

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <label htmlFor={inputId} className="sr-only">{placeholder}</label>
      <input
        id={inputId}
        type="search"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={listboxId}
        aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
        placeholder={placeholder}
        value={value}
        onFocus={() => value.trim() && setShowResults(true)}
        onChange={(event) => {
          onValueChange(event.target.value);
          setShowResults(true);
          setActiveIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-3 text-base rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
      />

      {expanded && results.length > 0 && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-50 w-full mt-2 bg-popover border border-border rounded-xl shadow-lg max-h-96 overflow-y-auto"
        >
          {results.map((item, index) => (
            <button
              id={`${listboxId}-${index}`}
              key={item.data.slug}
              type="button"
              role="option"
              aria-selected={activeIndex === index}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => chooseResult(item)}
              className={`block w-full px-4 py-3 text-left border-b border-border last:border-b-0 transition-colors ${
                activeIndex === index ? 'bg-secondary' : 'hover:bg-secondary'
              }`}
            >
              <span className="block font-semibold text-foreground">{item.data.name}</span>
              {(item.data.tagline || item.data.description) && (
                <span className="block text-sm text-muted-foreground mt-1 line-clamp-1">
                  {item.data.tagline || item.data.description}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {expanded && results.length === 0 && (
        <div role="status" className="absolute z-50 w-full mt-2 bg-popover border border-border rounded-xl shadow-lg p-4">
          <div className="text-center text-muted-foreground">{noResultsText(value)}</div>
        </div>
      )}
    </div>
  );
}
