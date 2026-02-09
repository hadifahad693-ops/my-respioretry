
export type Operation = '+' | '-' | '*' | '/' | '^' | 'sqrt' | 'sin' | 'cos' | 'tan' | 'log' | 'ln' | null;

export interface CalculationHistory {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface AISolution {
  problem: string;
  solution: string;
  steps: string[];
  finalResult: string;
}
