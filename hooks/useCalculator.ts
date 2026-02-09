
import { useState, useCallback } from 'react';
import { CalculationHistory, Operation } from '../types';

export const useCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<CalculationHistory[]>([]);

  const addToHistory = useCallback((expression: string, result: string) => {
    const newItem: CalculationHistory = {
      id: Math.random().toString(36).substr(2, 9),
      expression,
      result,
      timestamp: Date.now(),
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50));
  }, []);

  const clearAll = () => {
    setDisplay('0');
    setEquation('');
    setPrevValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const toggleSign = () => {
    setDisplay((parseFloat(display) * -1).toString());
  };

  const inputPercent = () => {
    const value = parseFloat(display);
    setDisplay((value / 100).toString());
  };

  const calculate = (a: number, b: number, op: Operation): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? NaN : a / b;
      case '^': return Math.pow(a, b);
      default: return b;
    }
  };

  const handleOperation = (nextOp: Operation) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
      setEquation(`${inputValue} ${nextOp}`);
    } else if (operation) {
      const result = calculate(prevValue, inputValue, operation);
      setPrevValue(result);
      setDisplay(String(result));
      setEquation(`${result} ${nextOp}`);
    }

    setWaitingForOperand(true);
    setOperation(nextOp);
  };

  const performEquals = () => {
    const inputValue = parseFloat(display);

    if (operation && prevValue !== null) {
      const result = calculate(prevValue, inputValue, operation);
      const fullEquation = `${prevValue} ${operation} ${inputValue} =`;
      
      addToHistory(fullEquation, String(result));
      setDisplay(String(result));
      setEquation('');
      setPrevValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const performScientific = (func: Operation) => {
    const val = parseFloat(display);
    let result = 0;
    let desc = '';

    switch(func) {
        case 'sqrt': result = Math.sqrt(val); desc = `sqrt(${val})`; break;
        case 'sin': result = Math.sin(val * Math.PI / 180); desc = `sin(${val}°)`; break;
        case 'cos': result = Math.cos(val * Math.PI / 180); desc = `cos(${val}°)`; break;
        case 'tan': result = Math.tan(val * Math.PI / 180); desc = `tan(${val}°)`; break;
        case 'log': result = Math.log10(val); desc = `log10(${val})`; break;
        case 'ln': result = Math.log(val); desc = `ln(${val})`; break;
        default: return;
    }

    addToHistory(desc, String(result));
    setDisplay(String(result));
    setWaitingForOperand(true);
  };

  return {
    display,
    equation,
    history,
    inputDigit,
    inputDot,
    clearAll,
    clearEntry,
    toggleSign,
    inputPercent,
    handleOperation,
    performEquals,
    performScientific,
  };
};
