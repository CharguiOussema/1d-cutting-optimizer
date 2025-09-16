import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Part, CuttingParams } from '../types';

interface InputFormProps {
  onOptimize: (params: CuttingParams) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onOptimize }) => {
  const [stockLength, setStockLength] = useState<number>(6000);
  const [kerfThickness, setKerfThickness] = useState<number>(3);
  const [parts, setParts] = useState<Part[]>([
    { id: '1', length: 2400, quantity: 5 },
    { id: '2', length: 1800, quantity: 3 },
    { id: '3', length: 1200, quantity: 8 }
  ]);

  const addPart = () => {
    const newId = Date.now().toString();
    setParts([...parts, { id: newId, length: 0, quantity: 1 }]);
  };

  const removePart = (id: string) => {
    setParts(parts.filter(part => part.id !== id));
  };

  const updatePart = (id: string, field: 'length' | 'quantity', value: number) => {
    setParts(parts.map(part =>
      part.id === id ? { ...part, [field]: Math.max(0, value) } : part
    ));
  };

  const handleOptimize = () => {
    const validParts = parts.filter(part => part.length > 0 && part.quantity > 0);

    if (stockLength <= 0 || kerfThickness < 0 || validParts.length === 0) {
      alert('Please ensure all values are valid (stock length > 0, kerf ≥ 0, at least one valid part)');
      return;
    }

    onOptimize({
      stockLength,
      kerfThickness,
      parts: validParts
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Cutting Parameters</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock Bar Length (mm)
          </label>
          <input
            type="number"
            value={stockLength}
            onChange={(e) => setStockLength(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kerf Thickness (mm)
          </label>
          <input
            type="number"
            value={kerfThickness}
            onChange={(e) => setKerfThickness(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.1"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Parts Required</h3>
          <button
            onClick={addPart}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Add Part
          </button>
        </div>

        <div className="space-y-3">
          {parts.map((part, index) => (
            <motion.div
              key={part.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 items-center p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Length (mm)
                </label>
                <input
                  type="number"
                  value={part.length || ''}
                  onChange={(e) => updatePart(part.id, 'length', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={part.quantity || ''}
                  onChange={(e) => updatePart(part.id, 'quantity', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>

              {parts.length > 1 && (
                <button
                  onClick={() => removePart(part.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md transition-colors"
                >
                  Remove
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <button
        onClick={handleOptimize}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition-colors"
      >
        Optimize Cutting Plan
      </button>
    </motion.div>
  );
};