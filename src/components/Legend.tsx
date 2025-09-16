import React from 'react';
import { motion } from 'framer-motion';
import { Part } from '../types';
import { generateColorMapping } from '../utils/optimizer';

interface LegendProps {
  parts: Part[];
}

export const Legend: React.FC<LegendProps> = ({ parts }) => {
  const colorMapping = generateColorMapping(parts);
  const uniqueLengths = Array.from(new Set(parts.map(p => p.length))).sort((a, b) => b - a);

  if (uniqueLengths.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-6"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4">Color Legend</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {uniqueLengths.map((length, index) => {
          const totalQuantity = parts
            .filter(part => part.length === length)
            .reduce((sum, part) => sum + part.quantity, 0);

          return (
            <motion.div
              key={length}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <div
                className="w-6 h-6 rounded border-2 border-white shadow-sm"
                style={{ backgroundColor: colorMapping[length] }}
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-800">{length}mm</div>
                <div className="text-sm text-gray-600">Qty: {totalQuantity}</div>
              </div>
            </motion.div>
          );
        })}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: uniqueLengths.length * 0.1 }}
          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
        >
          <div className="w-6 h-6 rounded border-2 border-white shadow-sm bg-red-500" />
          <div className="flex-1">
            <div className="font-semibold text-gray-800">Waste</div>
            <div className="text-sm text-gray-600">Unused material</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};