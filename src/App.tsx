import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { InputForm } from './components/InputForm';
import { ResultsTable } from './components/ResultsTable';
import { BarDiagram } from './components/BarDiagram';
import { Legend } from './components/Legend';
import { PDFExportButton } from './components/PDFExportButton';
import { optimizeCutting } from './utils/optimizer';
import { CuttingParams, OptimizationResult } from './types';

function App() {
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [params, setParams] = useState<CuttingParams | null>(null);

  const handleOptimize = (cuttingParams: CuttingParams) => {
    const optimizationResult = optimizeCutting(cuttingParams);
    setResult(optimizationResult);
    setParams(cuttingParams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            1D Cutting Stock Optimizer
          </h1>
          <p className="text-gray-600 text-lg">
            Minimize waste with the Best-Fit Decreasing algorithm
          </p>
        </motion.header>

        <InputForm onOptimize={handleOptimize} />

        {result && params && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Optimization Results</h2>
              <PDFExportButton result={result} params={params} />
            </div>

            <ResultsTable
              result={result}
              stockLength={params.stockLength}
              kerfThickness={params.kerfThickness}
            />

            <BarDiagram bars={result.bars} stockLength={params.stockLength} />

            <Legend parts={params.parts} />
          </motion.div>
        )}

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-gray-500"
        >
          <p>Built with React, TypeScript, and Tailwind CSS</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;