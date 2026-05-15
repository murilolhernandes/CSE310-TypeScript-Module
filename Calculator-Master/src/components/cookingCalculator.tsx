import { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
// @ts-expect-error - Ignoring missing type declarations for migrated JS files
import CookingCore from '../utils/CookingCore';
// @ts-expect-error - Ignoring missing type declarations for migrated JS files
import { getIngredientSuggestions } from '../utils/Ingredients';

export default function CookingCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const activeItem = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeItem) {
        // This smoothly scrolls the container so the item is always visible
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Handle typing and trigger autocomplete
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setError(null);
    setResult(null);
    setSelectedIndex(-1); // Reset selection when user types

    if (value.toLowerCase().includes(' to ')) {
      setSuggestions([]);
      return;
    }

    const words = value.trimStart().split(/\s+/);
    if (words.length >= 3) {
      const potentialIngredient = words.slice(2).join(' ');
      const matches = getIngredientSuggestions(potentialIngredient);
      setSuggestions(matches.map((m: any) => m.display));
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    const words = input.trimStart().split(/\s+/);
    // Reconstruct the input string with the correct ingredient
    const prefix = `${words[0]} ${words[1]}`;
    setInput(`${prefix} ${suggestion} to `);

    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const handleConvert = async () => {
    if (!input.trim()) {
      setError('Please enter a measurement to convert.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setSuggestions([])

    try {
      const apiKey = import.meta.env.VITE_API_KEY;
      const core = new CookingCore(apiKey);

      const converted = await core.convertUnit(input);
      setResult(converted);

      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || 'An error occurred during conversion.');
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setSuggestions([]);
      setSelectedIndex(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault(); // Prevents cursor from moving in the input box
      if (suggestions.length > 0) {
        // Loop back to the top if we hit the bottom
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length > 0) {
        // Loop to the bottom if we hit the top
        setSelectedIndex(prev => (prev <= 0 ? suggestions.length - 1 : prev - 1));
      }
    } else if (e.key === 'Enter') {
      // If dropdown is open and an item is highlighted, select it
      if (suggestions.length > 0 && selectedIndex >= 0) {
        selectSuggestion(suggestions[selectedIndex]);
      } else {
        // Otherwise, submit the whole form
        handleConvert();
      }
    }
  };

  return (
    <div id='cooking-container'>
      {/* Search Area */}
      <div className='search-wrapper'>
        <input
          type='text'
          className='input-box'
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder='E.g., 2 cups flour to grams'
        />

        {/* Autocomplete Dropdown */}
        {suggestions.length > 0 && (
          <ul className='autocomplete-dropdown' ref={listRef}>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className={`autocomplete-item ${index === selectedIndex ? 'autocomplete-active' : ''}`}
                onClick={() => selectSuggestion(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button id='convert-unit' onClick={handleConvert} disabled={isLoading}>
        {isLoading ? 'Converting...' : 'Convert Unit'}
      </button>

      {/* Results & Errors */}
      {error && (
        <div id='error-message' style={{ display: 'block' }}>
          {error}
        </div>
      )}
      {result && <div className='result-success'>{result}</div>}

      {/* Instructions Panel */}
      <div className='instructions-panel'>
        <h3>How to Convert Cooking Measurements:</h3>
        <div className='instruction-examples'>
          <p className='instruction-format'>
            Type: <strong>[amount] [unit] [ingredient]</strong> or{' '}
            <strong>[amount] [unit] [ingredient] to [target unit]</strong>
          </p>
          <div className='example-grid'>
            <div className='example-item'>
              <p>Basic: 2 cups flour</p>
            </div>
            <div className='example-item'>
              <p>With target: 1.5 cups sugar to grams</p>
            </div>
            <div className='example-item'>
              <p>Liquids: 250 ml milk to cups</p>
            </div>
            <div className='example-item'>
              <p>Small amounts: 3 tbsp butter to grams</p>
            </div>
          </div>
          <p className='instruction-tip'>
            💡 <strong>Tip:</strong> Start typing an ingredient to see
            suggestions!
          </p>
        </div>
      </div>
    </div>
  );
}
