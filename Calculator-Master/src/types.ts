export type Operator = '+' | '-' | '*' | '/' | '=';

export interface CalculatorState {
  currentValue: string;
  previousValue: string;
  operation: Operator | null;
  overwriteL: boolean;
}