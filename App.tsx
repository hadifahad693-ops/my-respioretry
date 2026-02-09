
import React, { useState } from 'react';
import { useCalculator } from './hooks/useCalculator';
import { solveProblemWithAI } from './services/geminiService';
import { AISolution } from './types';

// Components inside App.tsx for simplicity and scope
const CalcButton: React.FC<{
  label: string | React.ReactNode;
  onClick: () => void;
  variant?: 'number' | 'op' | 'action' | 'sci';
  className?: string;
}> = ({ label, onClick, variant = 'number', className = '' }) => {
  const getStyles = () => {
    switch (variant) {
      case 'op': return 'bg-indigo-600 hover:bg-indigo-500 text-white';
      case 'action': return 'bg-slate-700 hover:bg-slate-600 text-indigo-300';
      case 'sci': return 'bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm';
      default: return 'bg-slate-800 hover:bg-slate-700 text-white';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`calc-button h-14 md:h-16 rounded-2xl font-semibold text-xl shadow-lg flex items-center justify-center ${getStyles()} ${className}`}
    >
      {label}
    </button>
  );
};

const App: React.FC = () => {
  const {
    display,
    equation,
    history,
    inputDigit,
    inputDot,
    clearAll,
    toggleSign,
    inputPercent,
    handleOperation,
    performEquals,
    performScientific,
  } = useCalculator();

  const [activeTab, setActiveTab] = useState<'calc' | 'ai' | 'history'>('calc');
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState<AISolution | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isScientific, setIsScientific] = useState(false);

  const handleAiSolve = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    setAiResult(null);
    const result = await solveProblemWithAI(aiInput);
    setAiResult(result);
    setIsAiLoading(false);
  };

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg glass rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col h-[90vh]">
        
        {/* Header Tabs */}
        <div className="flex bg-slate-900/50 p-2 gap-1 border-b border-white/5">
          <button 
            onClick={() => setActiveTab('calc')}
            className={`flex-1 py-3 rounded-xl transition-all ${activeTab === 'calc' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Calculator
          </button>
          <button 
            onClick={() => setActiveTab('ai')}
            className={`flex-1 py-3 rounded-xl transition-all ${activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            AI Solver
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            History
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-hidden relative">
          
          {/* CALCULATOR TAB */}
          <div className={`absolute inset-0 p-6 flex flex-col transition-opacity duration-300 ${activeTab === 'calc' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <div className="flex-1 flex flex-col justify-end text-right mb-6">
              <div className="text-slate-500 text-lg mono truncate h-7">{equation}</div>
              <div className="text-white text-5xl md:text-7xl font-light tracking-tighter truncate mono mt-2">
                {display}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {/* Scientific Toggle */}
              <button 
                onClick={() => setIsScientific(!isScientific)}
                className={`col-span-4 py-2 mb-2 rounded-lg text-xs font-bold uppercase tracking-widest ${isScientific ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                {isScientific ? 'Hide Scientific' : 'Show Scientific'}
              </button>

              {isScientific && (
                <>
                  <CalcButton variant="sci" label="sin" onClick={() => performScientific('sin')} />
                  <CalcButton variant="sci" label="cos" onClick={() => performScientific('cos')} />
                  <CalcButton variant="sci" label="tan" onClick={() => performScientific('tan')} />
                  <CalcButton variant="sci" label="√" onClick={() => performScientific('sqrt')} />
                  <CalcButton variant="sci" label="log" onClick={() => performScientific('log')} />
                  <CalcButton variant="sci" label="ln" onClick={() => performScientific('ln')} />
                  <CalcButton variant="sci" label="xʸ" onClick={() => handleOperation('^')} />
                  <CalcButton variant="sci" label="π" onClick={() => inputDigit(Math.PI.toFixed(8))} />
                </>
              )}

              <CalcButton variant="action" label="AC" onClick={clearAll} />
              <CalcButton variant="action" label="+/-" onClick={toggleSign} />
              <CalcButton variant="action" label="%" onClick={inputPercent} />
              <CalcButton variant="op" label="÷" onClick={() => handleOperation('/')} />

              <CalcButton label="7" onClick={() => inputDigit('7')} />
              <CalcButton label="8" onClick={() => inputDigit('8')} />
              <CalcButton label="9" onClick={() => inputDigit('9')} />
              <CalcButton variant="op" label="×" onClick={() => handleOperation('*')} />

              <CalcButton label="4" onClick={() => inputDigit('4')} />
              <CalcButton label="5" onClick={() => inputDigit('5')} />
              <CalcButton label="6" onClick={() => inputDigit('6')} />
              <CalcButton variant="op" label="-" onClick={() => handleOperation('-')} />

              <CalcButton label="1" onClick={() => inputDigit('1')} />
              <CalcButton label="2" onClick={() => inputDigit('2')} />
              <CalcButton label="3" onClick={() => inputDigit('3')} />
              <CalcButton variant="op" label="+" onClick={() => handleOperation('+')} />

              <CalcButton className="col-span-2" label="0" onClick={() => inputDigit('0')} />
              <CalcButton label="." onClick={inputDot} />
              <CalcButton variant="op" label="=" onClick={performEquals} />
            </div>
          </div>

          {/* AI SOLVER TAB */}
          <div className={`absolute inset-0 p-6 flex flex-col transition-opacity duration-300 ${activeTab === 'ai' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <h2 className="text-xl font-semibold mb-4 text-indigo-400">Word Problem Solver</h2>
            <textarea
              className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-32"
              placeholder="Example: If I have 5 apples and buy 3 more, then give half away, how many do I have left?"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
            />
            <button
              onClick={handleAiSolve}
              disabled={isAiLoading || !aiInput.trim()}
              className="mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20"
            >
              {isAiLoading ? 'Thinking with Gemini...' : 'Solve with AI'}
            </button>

            <div className="mt-6 flex-1 overflow-y-auto no-scrollbar pb-6">
              {aiResult && (
                <div className="space-y-4">
                  <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-4">
                    <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Final Result</div>
                    <div className="text-2xl font-semibold text-white">{aiResult.finalResult}</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Step-by-Step Solution</div>
                    {aiResult.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-3 text-slate-300">
                        <span className="text-indigo-400 font-bold shrink-0">{idx + 1}.</span>
                        <p>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!aiResult && !isAiLoading && (
                <div className="text-center text-slate-600 mt-10">
                  <div className="text-4xl mb-4">🤖</div>
                  <p>Ask me anything. I can solve equations, unit conversions, and word problems.</p>
                </div>
              )}
            </div>
          </div>

          {/* HISTORY TAB */}
          <div className={`absolute inset-0 p-6 flex flex-col transition-opacity duration-300 ${activeTab === 'history' ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
             <h2 className="text-xl font-semibold mb-4 text-indigo-400">Recent Calculations</h2>
             <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-6">
                {history.length > 0 ? (
                  history.map((item) => (
                    <div key={item.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 group hover:border-indigo-500/30 transition-all">
                      <div className="text-slate-500 text-sm mono truncate mb-1">{item.expression}</div>
                      <div className="text-white text-2xl mono">{item.result}</div>
                      <div className="text-[10px] text-slate-700 mt-2 text-right">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-600 mt-10">
                    <p>No history yet.</p>
                  </div>
                )}
             </div>
          </div>

        </div>
      </div>

      <div className="mt-8 text-slate-700 text-xs tracking-widest uppercase flex gap-4">
        <span>Precision Focused</span>
        <span>•</span>
        <span>AI Powered</span>
        <span>•</span>
        <span>Gemini 3 Flash</span>
      </div>
    </div>
  );
};

export default App;
