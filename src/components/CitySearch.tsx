
import React, { useState, useEffect, useRef } from 'react';
import { City } from '@/types/weather';
import { searchCities } from '@/services/weatherService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CitySearchProps {
  onCitySelect: (city: City) => void;
}

const CitySearch: React.FC<CitySearchProps> = ({ onCitySelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = async () => {
    if (query.trim().length < 2) return;
    
    setIsSearching(true);
    try {
      const data = await searchCities(query);
      setResults(data || []);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching cities:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectCity = (city: City) => {
    onCitySelect(city);
    setQuery(city.name);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="搜索城市..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim().length >= 2 && setShowResults(true)}
            className="w-full pl-4 pr-10 py-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-sm focus:ring-2 focus:ring-primary"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={isSearching || query.trim().length < 2}
          className="rounded-lg bg-primary hover:bg-primary/90"
        >
          <Search className="w-5 h-5" />
          <span className="sr-only">搜索</span>
        </Button>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-30 mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg max-h-60 overflow-auto">
          <ul className="py-1 text-gray-900 dark:text-gray-100">
            {results.map((city, index) => (
              <li 
                key={index} 
                onClick={() => handleSelectCity(city)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                {city.name}, {city.country}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CitySearch;
