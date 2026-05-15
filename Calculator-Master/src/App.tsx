import { useState } from 'react'
import RegularCalculator from './components/regularCalculator'
import './App.css'

function App() {
  // Act as the "Manager" by tracking the active calculator mode
  const [activeMode, setActiveMode] = useState<'regular' | 'cooking' | 'conversion' | null>(null);

  return (
    <>
      <div className="welcome">
        <h2>Welcome to Calculator Master</h2>
        <h3>Please select a calculator mode below</h3>

        {/* Navigation / Mode Selection */}
        <div id='calculator'>
          <div id="calculator-display">
            <div className='options'>
              {/* <div className='reg-calc'> */}
                <button className={`reg-calc ${activeMode !== 'regular' ? 'deactivated' : ''}`} onClick={() => setActiveMode('regular')}>Calculator</button>
              {/* </div> */}
              {/* <div className='cooking'> */}
                <button className={`cooking ${activeMode !== 'cooking' ? 'deactivated': ''}`} onClick={() => setActiveMode('cooking')}>Cooking</button>
              {/* </div> */}
              {/* <div className='conversion'> */}
                <button className={`conversion ${activeMode !== 'conversion' ? 'deactivated' : ''}`} onClick={() => setActiveMode('conversion')}>Conversion</button>
              {/* </div> */}
            </div>

            {/* Conditionally render the selected calculator */}
            {activeMode === 'regular' && <RegularCalculator />}
            {activeMode === 'cooking' && <div>Cooking Calculator Component (Coming Soon)</div>}
            {activeMode === 'conversion' && <div>Conversion Calculator Component (Coming Soon)</div>}
          </div>
        </div>
      </div>

      {/* Conditionally render the selected calculator */}
      {/* <div id="calculator">
        {activeMode === 'regular' && <RegularCalculator />}
        {activeMode === 'cooking' && <div>Cooking Calculator Component (Coming Soon)</div>}
        {activeMode === 'conversion' && <div>Conversion Calculator Component (Coming Soon)</div>}
      </div> */}
    </>
  )
}

export default App