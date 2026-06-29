import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

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
  const debouncedQuery = useDebounce(query, 300);
  const abortControllerRef = useRef<AbortController | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      // Cancel previous request if user keeps typing
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      setIsLoading(true);

      try {
        // Call your backend search endpoint
        const response = await api.get(`/products/search?q=${encodeURIComponent(debouncedQuery)}`, {
          signal: controller.signal,
        });

        // Map backend MongoDB data to frontend format
        const mappedResults: SearchResult[] = response.data.map((p: BackendProduct) => ({
          id: p._id, // Map _id to id
          name: p.name,
          price: p.price,
          imageUrl: p.images?.[0] || '', // Take the first image from the array
        }));

        setResults(mappedResults);
        setIsOpen(true);
      } catch (error: any) {
        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
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

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search by product name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white shadow-lg max-h-96 rounded-xl py-2 ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
          {results.map((product) => (
            <div
              key={product.id}
              onClick={() => handleSelect(product.id)}
              className="cursor-pointer select-none relative px-4 py-3 hover:bg-gray-50 flex items-center space-x-3"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
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