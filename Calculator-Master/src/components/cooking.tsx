import { useState, ChangeEvent, KeyboardEvent } from 'react';

export default function CookingCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle typing and trigger autocomplete
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setError(null);
    setResult(null);

    // Extract the ingredient part of the string (rough estimation for autocomplete)
    const words = value.split(' ');
    if (words.length >= 3) {
      const potentialIngredient = words.slice(2).join(' ').split(' to ')[0];

      // TODO: Connect this to your Ingredients.mjs getIngredientSuggestions function
      // const matches = getIngredientSuggestions(potentialIngredient);
      // setSuggestions(matches.map(m => m.display));
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    const words = input.split(' ');
    // Reconstruct the input string with the correct ingredient
    const newInput = `${words[0]} ${words[1]} ${suggestion}`;
    setInput(newInput);
    setSuggestions([]);
  };

  const handleConvert = async () => {
    if (!input.trim()) {
      setError("Please enter a measurement to convert.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // TODO: Connect this to your CookingCore.mjs logic
      // const core = new CookingCore('YOUR_API_KEY');
      // const converted = await core.convertUnit(input);
      // setResult(converted);

      // Placeholder simulation for testing the UI:
      setTimeout(() => {
        setResult(`Successfully converted: ${input} (API logic pending)`);
        setIsLoading(false);
      }, 1000);

    } catch (err: any) {
      setError(err.message || "An error occurred during conversion.");
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConvert();
    }
  };

  return (
    <div id="cooking-container">
      <h2>Cooking Measurement Converter</h2>
      {/* Search Area */}
      <div className="search-wrapper">
        <input 
          type="text" 
          className="input-box" 
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="E.g., 2 cups flour to grams" 
        />
        
        {/* Autocomplete Dropdown */}
        {suggestions.length > 0 && (
          <ul className="autocomplete-dropdown">
            {suggestions.map((suggestion, index) => (
              <li 
                key={index} 
                className="autocomplete-item"
                onClick={() => selectSuggestion(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button 
        id="convert-unit" 
        onClick={handleConvert}
        disabled={isLoading}
      >
        {isLoading ? 'Converting...' : 'Convert Unit'}
      </button>

      {/* Results & Errors */}
      {error && <div id="error-message" style={{ display: 'block' }}>{error}</div>}
      {result && <div className="result-success">{result}</div>}

      {/* Instructions Panel */}
      <div className="instructions-panel">
        <h3>How to Convert Cooking Measurements:</h3>
        <div className="instruction-examples">
          <p className="instruction-format">
            Type: <strong>[amount] [unit] [ingredient]</strong> or <strong>[amount] [unit] [ingredient] to [target unit]</strong>
          </p>
          <div className="example-grid">
            <div className="example-item"><p>Basic: 2 cups flour</p></div>
            <div className="example-item"><p>With target: 1.5 cups sugar to grams</p></div>
            <div className="example-item"><p>Liquids: 250 ml milk to cups</p></div>
            <div className="example-item"><p>Small amounts: 3 tbsp butter to grams</p></div>
          </div>
          <p className="instruction-tip">
            💡 <strong>Tip:</strong> Start typing an ingredient to see suggestions!
          </p>
        </div>
      </div>
    </div>
  ); 
};