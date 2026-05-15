import { useState } from 'react';
import type { CalculatorState, Operator } from '../types';

export default function RegularCalculator() {
  // Utilizing the types defined in src/types.ts
  const [state, setState] = useState<CalculatorState>({
    currentValue: '0',
    previousValue: '',
    operation: null,
    overwriteL: true // Flag to determine if typing should replace the current value
  });

  const clear = () => {
    setState({ currentValue: '0', previousValue: '', operation: null, overwriteL: true });
  };

  const appendNumber = (number: string) => {
    if (number === '.' && state.currentValue.includes('.')) return;

    setState((prev) => ({
      ...prev,
      currentValue: prev.overwriteL || prev.currentValue === '0' && number !== '.'
        ? number
        : prev.currentValue + number,
      overwriteL: false
    }));
  };

  const chooseOperation = (op: Operator) => {
    if (state.currentValue === '') return;

    // If we already have a previous value, compute first (like chaining operations)
    if (state.previousValue !== '') {
      compute();
    }

    setState((prev) => ({
      ...prev,
      operation: op,
      previousValue: prev.currentValue,
      overwriteL: true
    }));
  };

  const compute = () => {
    const prev = parseFloat(state.previousValue);
    const current = parseFloat(state.currentValue);

    if (isNaN(prev) || isNaN(current)) return;

    let result: number;

    switch (state.operation) {
      case '+': result = prev + current; break;
      case '-': result = prev - current; break;
      case '*': result = prev * current; break;
      case '/':
        if (current === 0) {
          setState({ ...state, currentValue: "Error", overwriteL: true });
          return;
        }
        result = prev / current;
        break;
      default: return;
    }

    setState({
      currentValue: result.toString(),
      previousValue: '',
      operation: null,
      overwriteL: true
    });
  };

  const toggleSign = () => {
    setState(prev => ({
      ...prev,
      currentValue: (parseFloat(prev.currentValue) * -1).toString()
    }));
  };

  const percent = () => {
    setState(prev => ({
      ...prev,
      currentValue: (parseFloat(prev.currentValue) / 100).toString()
    }));
  };

  return (
    <div id='calculator-container'>
      <h2>Calculator</h2>
      {/* <div className='display-container'> */}
        {/* Show previous operation context */}
        {/* <div className='previous-operand'>
          {state.previousValue} {state.operation}
        </div> */}
        {/* Main input display */}
        <input 
          className='input-box'
          value={state.currentValue}
          // placeholder='Enter a number'
          readOnly 
        />
      {/* </div> */}

      <div className='keypad-container'>
        <div id='keypad'>
          <div className='first-line'>
            <button className='rounded-borders clear' onClick={clear}>AC</button>
            <button className='rounded-borders positive-negative' onClick={toggleSign}>&#177;</button>
            <button className='rounded-borders percentage' onClick={percent}>&#37;</button>
            <button className='operator divide' onClick={() => chooseOperation('/')}>&#247;</button>
          </div>

          <div className='second-line'>
            <button className='digits rounded-borders seven' onClick={() => appendNumber('7')}>&#55;</button>
            <button className='digits rounded-borders eight' onClick={() => appendNumber('8')}>&#56;</button>
            <button className='digits rounded-borders nine' onClick={() => appendNumber('9')}>&#57;</button>
            <button className='operator times' onClick={() => chooseOperation('*')}>&#215;</button>
          </div>

          <div className='third-line'>
            <button className='digits rounded-borders four' onClick={() => appendNumber('4')}>&#52;</button>
            <button className='digits rounded-borders five' onClick={() => appendNumber('5')}>&#53;</button>
            <button className='digits rounded-borders six' onClick={() => appendNumber('6')}>&#54;</button>
            <button className='operator minus' onClick={() => chooseOperation('-')}>&#8722;</button>
          </div>

          <div className='fourth-line'>
            <button className='digits rounded-borders one' onClick={() => appendNumber('1')}>&#49;</button>
            <button className='digits rounded-borders two' onClick={() => appendNumber('2')}>&#50;</button>
            <button className='digits rounded-borders three' onClick={() => appendNumber('3')}>&#51;</button>
            <button className='operator plus' onClick={() => chooseOperation('+')}>&#43;</button>
          </div>

          <div className='fifth-line'>
            <button className='digits rounded-borders zero' onClick={() => appendNumber('0')}>&#48;</button>
            <button className='digits rounded-borders dot' onClick={() => appendNumber('.')}>&#8901;</button>
            <button className='rounded-borders equals' onClick={compute}>&#61;</button>
          </div>
        </div>
      </div>
    </div>
  );
}