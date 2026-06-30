import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { AxiosError } from 'axios';

// Define the shape of the product returned by your backend
interface BackendProduct {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

// Define the shape we need for the frontend
interface SearchResult {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function SearchField() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const debouncedQuery = useDebounce(query, 300);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // 1. Generate dynamic ARIA announcements for screen readers
  const getAriaAnnouncement = () => {
    if (isLoading) return 'Searching products...';
    if (query && results.length === 0 && !isLoading) return 'No products found.';
    if (results.length > 0) return `${results.length} products found.`;
    return '';
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      // Cancel previous request if user keeps typing (Fast Typing Performance)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsLoading(true);
      setHighlightedIndex(-1); // Reset highlight on new search

      try {
        const response = await api.get(`/products/search?q=${encodeURIComponent(debouncedQuery)}`, {
          signal: controller.signal,
        });

        const mappedResults: SearchResult[] = response.data.map((p: BackendProduct) => ({
          id: p._id,
          name: p.name,
          price: p.price,
          imageUrl: p.images?.[0] || '',
        }));

        setResults(mappedResults);
        setIsOpen(true);
      } catch (error: unknown) {
        // 2. Safely handle errors 
        if (error instanceof AxiosError) {
          if (error.code !== 'ERR_CANCELED' && error.name !== 'CanceledError' && error.name !== 'AbortError') {
            console.error('Search failed', error);
          }
        } else if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Search failed', error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchSearchResults();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedQuery]);

  const handleSelect = (productId: string) => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    navigate(`/product/${productId}`);
  };

  // 3. Keyboard navigation for accessibility and power users
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          handleSelect(results[highlightedIndex].id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  return (
    <div className="relative w-full">
      {/* ARIA Live Region: Announces search status to screen readers */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {getAriaAnnouncement()}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-autocomplete="list"
          aria-activedescendant={highlightedIndex >= 0 ? `search-option-${highlightedIndex}` : undefined}
          className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search by product name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          ) : query ? (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Search Results Dropdown with ARIA Listbox */}
      {isOpen && results.length > 0 && (
        <div 
          id="search-results"
          role="listbox"
          className="absolute z-50 mt-2 w-full bg-white shadow-lg max-h-96 rounded-xl py-2 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
        >
          {results.map((product, index) => (
            <div
              key={product.id}
              id={`search-option-${index}`}
              role="option"
              aria-selected={index === highlightedIndex}
              onClick={() => handleSelect(product.id)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`cursor-pointer select-none relative px-4 py-3 flex items-center space-x-3 transition-colors ${
                index === highlightedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Search className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                <p className="text-xs text-gray-500">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* No Results Found */}
      {isOpen && query && !isLoading && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white shadow-lg rounded-xl p-4 text-center text-sm text-gray-500 ring-1 ring-black ring-opacity-5">
          No products found for "{query}"
        </div>
      )}
    </div>
  );
}