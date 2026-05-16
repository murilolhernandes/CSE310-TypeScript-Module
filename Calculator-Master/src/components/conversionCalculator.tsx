import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import ConversionCore from '../utils/ConversionCore';

// Extract the long list of options into a reusable sub-component
const UnitOptions = () => (
  <>
    <optgroup label="Weight">
      <option value="kg">Kilogram (kg)</option>
      <option value="g">Gram (g)</option>
      <option value="lb">Pound (lb)</option>
      <option value="oz">Ounce (oz)</option>
    </optgroup>
    <optgroup label="Length">
      <option value="km">Kilometer (km)</option>
      <option value="m">Meter (m)</option>
      <option value="mi">Mile (mi)</option>
      <option value="ft">Foot (ft)</option>
      <option value="in">Inch (in)</option>
      <option value="cm">Centimeter (cm)</option>
      <option value="yd">Yard (yd)</option>
      <option value="ly">Light Year (ly)</option>
    </optgroup>
    <optgroup label="Volume">
      <option value="l">Liter (l)</option>
      <option value="ml">Milliliter (ml)</option>
      <option value="gal">Gallon (gal)</option>
      <option value="tsp">Teaspoon (tsp)</option>
      <option value="tbsp">Tablespoon (tbsp)</option>
      <option value="cup">Cup (cup)</option>
      <option value="floz">Fluid Ounce (floz)</option>
      <option value="pint">Pint (pint)</option>
      <option value="quart">Quart (quart)</option>
    </optgroup>
    <optgroup label="Temperature">
      <option value="F">Fahrenheit (F)</option>
      <option value="C">Celsius (C)</option>
    </optgroup>
    <optgroup label="Energy">
      <option value="J">Joule (J)</option>
      <option value="cal">Calorie (cal)</option>
    </optgroup>
    <optgroup label="Speed">
      <option value="mph">Miles per Hour (mph)</option>
      <option value="kmh">Kilometers per Hour (kmh)</option>
      <option value="m/s">Meters per Second (m/s)</option>
      <option value="ft/s">Feet per Second (ft/s)</option>
    </optgroup>
    <optgroup label="Angle">
      <option value="deg">Degrees (deg)</option>
      <option value="rad">Radians (rad)</option>
    </optgroup>
    <optgroup label="Time">
      <option value="s">Second (s)</option>
      <option value="min">Minute (min)</option>
      <option value="h">Hour (h)</option>
      <option value="d">Day (d)</option>
      <option value="week">Week (week)</option>
      <option value="year">Year (year)</option>
    </optgroup>
  </>
);

// Main React component for the Unit Converter tab handling standard measurements.
export default function ConversionCalculator() {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Validates user input and calls the conversion API, formatting the final numeric result.
  const handleConvert = async () => {
    if (!value.trim() || isNaN(Number(value))) {
      setError("Please enter a valid number to convert.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    const formattedInput = parseFloat(value).toLocaleString("en-US");

    if (fromUnit === toUnit) {
      setResult(`${formattedInput} ${fromUnit} = ${formattedInput} ${toUnit}`);
      setIsLoading(false);
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_API_KEY;
      const core = new ConversionCore(apiKey);

      const convertedValue = await core.convertUnit(value, fromUnit, toUnit);

      const numericResult = Number(convertedValue);
      if (isNaN(numericResult)) {
        throw new Error("Received an invalid response from the API.");
      }

      const formattedResult = numericResult.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      setResult(`${formattedInput} ${fromUnit} = ${formattedResult} ${toUnit}`);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message || "An error occurred during conversion.");
      setIsLoading(false);
    }
  };

  // UX FEATURE: 
  // Instantly flips the "from" and "to" units using React State. 
  // We explicitly clear the 'result' state here so the user knows they need to 
  // click 'Convert' again to fetch the new reversed data.
  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult(null);
  }

  // Triggers the conversion calculation when the 'Enter' key is pressed inside the input field.
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConvert();
    }
  };

  return (
    <div id="conversion-container">
      <h2>Unit Converter</h2>

      <input type="number" 
        className='input-box'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder='Value to convert'
      />

      <div className="unit-options" style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <select 
          id="from-unit" 
          value={fromUnit} 
          onChange={(e) => setFromUnit(e.target.value)}
          style={{ flex: 1 }}
        >
          <UnitOptions />
        </select>
        
        {/* The Swap Button */}
        <button 
          onClick={handleSwap}
          title="Swap units"
          style={{
            backgroundColor: 'var(--secondary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '45px',
            height: '45px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            padding: 0,
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          &#8646;
        </button>
        
        <select 
          id="to-unit" 
          value={toUnit} 
          onChange={(e) => setToUnit(e.target.value)}
          style={{ flex: 1 }}
        >
          <UnitOptions />
        </select>
      </div>

      <button 
        id="convert-unit" 
        onClick={handleConvert}
        disabled={isLoading}
      >
        {isLoading ? 'Converting...' : 'Convert Unit'}
      </button>

      {error && <div id="error-message" style={{ display: 'block' }}>{error}</div>}
      {result && <div className="result-success" style={{ marginTop: '1.5rem' }}>{result}</div>}

      <div className="instructions-panel">
        <h3>How to Use Unit Converter:</h3>
        <div className="instruction-examples">
          <p className="instruction-format">
            1. <strong>Enter the value</strong> you want to convert in the "Enter
            value" box
          </p>
          <p className="instruction-format">
            2. <strong>Select the unit you are converting from</strong> in the first
            dropdown menu
          </p>
          <p className="instruction-format">
            3. <strong>Select the unit you want to convert to</strong> in the second
            dropdown menu
          </p>
          <p className="instruction-format">
            4. Click the <strong>"Convert Unit"</strong> button
          </p>
          <p className="instruction-format">
            5. The converted value will appear below the button
          </p>
          <div className="example-grid">
            <div className="example-item">
              <p>
                Example: Value: <strong>2,</strong> From Unit: <strong>Kilograms,
                  </strong> To Unit: <strong>Grams</strong>
              </p>
              <p>Result: <strong>2 kg = 2,000.00 g</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}