import { useState, useEffect, useCallback } from 'react';
import type { CalculatorState, Operator } from '../types';

export default function RegularCalculator() {
  // Utilizing the types defined in src/types.ts
  const [state, setState] = useState<CalculatorState>({
    currentValue: '',
    previousValue: '',
    operation: null,
    overwriteL: true // Flag to determine if typing should replace the current value
  });

  const clear = useCallback(() => {
    setState({ currentValue: '', previousValue: '', operation: null, overwriteL: true });
  }, []);

  const appendNumber = useCallback((number: string) => {
    setState((prev) => {
      // Prevent multiple decimals
      if (number === '.' && prev.currentValue.includes('.')) return prev;

      const shouldOverwrite = prev.overwriteL || (prev.currentValue === '0' && number !== '.');
      return {
        ...prev,
        currentValue: shouldOverwrite ? number : prev.currentValue + number,
        overwriteL: false
      };
    });
  }, []);

  const chooseOperation = useCallback((op: Operator) => {
    setState((prev) => {
      // Don't allow an operator if there are no numbers at all
      if (prev.currentValue === '' && prev.previousValue === '') return prev;

      // If we already have a previous value AND a current value, compute first (chaining operations like 10 + 10 +)
      if (prev.previousValue !== '' && prev.currentValue !== '') {
        const prevNum = parseFloat(prev.previousValue);
        const currentNum = parseFloat(prev.currentValue);
        let result = 0;

        switch (prev.operation) {
          case '+': result = prevNum + currentNum; break;
          case '-': result = prevNum - currentNum; break;
          case '*': result = prevNum * currentNum; break;
          case '/': 
            if (currentNum === 0) return { ...prev, currentValue: "Error", overwriteL: true };
            result = prevNum / currentNum; 
            break;
        }

        return {
          currentValue: '',
          previousValue: result.toString(),
          operation: op,
          overwriteL: true
        };
      }

      // Default: move current value to previous value and set the operator
      return {
        ...prev,
        operation: op,
        previousValue: prev.currentValue !== '' ? prev.currentValue : prev.previousValue,
        currentValue: '',
        overwriteL: true
      };
    });
  }, []);

  const compute = useCallback(() => {
    setState((prev) => {
      const prevNum = parseFloat(prev.previousValue);
      const currentNum = parseFloat(prev.currentValue);

      if (isNaN(prevNum) || isNaN(currentNum)) return prev;

      let result: number;
      switch (prev.operation) {
        case '+': result = prevNum + currentNum; break;
        case '-': result = prevNum - currentNum; break;
        case '*': result = prevNum * currentNum; break;
        case '/': 
          if (currentNum === 0) return { ...prev, currentValue: "Error", overwriteL: true };
          result = prevNum / currentNum; 
          break;
        default: return prev;
      }

      return {
        currentValue: result.toString(), // The result displays on its own
        previousValue: '',               // Clear previous memory
        operation: null,                 // Clear operator
        overwriteL: true
      };
    });
  }, []);

  const toggleSign = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentValue: (parseFloat(prev.currentValue || '0') * -1).toString()
    }));
  }, []);

  const percent = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentValue: (parseFloat(prev.currentValue || '0') / 100).toString()
    }));
  }, []);

  // Keyboard Support ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        appendNumber(e.key);
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        chooseOperation(e.key as Operator);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault(); // Prevents 'Enter' from triggering focused buttons
        compute();
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        clear();
      } else if (e.key === 'Backspace') {
        setState(prev => ({
          ...prev,
          currentValue: prev.currentValue.length > 0 ? prev.currentValue.slice(0, -1) : ''
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown); // Cleanup on unmount
  }, [appendNumber, chooseOperation, compute, clear]);

  // If an operation exists, display "Previous Operato Current". Otherwise just "Current".
  const displayValue = state.operation 
    ? `${state.previousValue} ${state.operation} ${state.currentValue}`
    : state.currentValue;

  return (
    <div id='calculator-container'>
      <h2>Calculator</h2>
        {/* Main input display */}
        <input 
          className='input-box'
          value={displayValue}
          placeholder='Enter a number'
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