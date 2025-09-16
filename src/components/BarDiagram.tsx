import React from 'react';
import { motion } from 'framer-motion';
import { StockBar } from '../types';

interface BarDiagramProps {
  bars: StockBar[];
  stockLength: number;
}

export const BarDiagram: React.FC<BarDiagramProps> = ({ bars, stockLength }) => {
  const maxWidth = 800; // Maximum width for the diagram

  const getSegmentWidth = (length: number) => {
    return (length / stockLength) * maxWidth;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-6"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6">Visual Cutting Plan</h3>

      <div className="space-y-6">
        {bars.map((bar, index) => (
          <motion.div
            key={bar.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-700">Bar {bar.id}</h4>
              <span className="text-sm text-gray-500">
                Used: {bar.usedLength.toFixed(0)}mm |
                Waste: <span className="text-red-600">{bar.wasteLength.toFixed(0)}mm</span>
              </span>
            </div>

            <div className="relative">
              <div
                className="flex h-12 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100"
                style={{ width: maxWidth }}
              >
                {bar.cuts.map((cut, cutIndex) => {
                  const cutWidth = getSegmentWidth(cut.length);
                  return (
                    <motion.div
                      key={cutIndex}
                      initial={{ width: 0 }}
                      animate={{ width: cutWidth }}
                      transition={{ delay: (index * 0.2) + (cutIndex * 0.1), duration: 0.5 }}
                      className="flex items-center justify-center text-white text-xs font-medium border-r border-white"
                      style={{
                        backgroundColor: cut.color,
                        minWidth: Math.max(cutWidth, 1)
                      }}
                    >
                      {cutWidth > 40 && `${cut.length}mm`}
                    </motion.div>
                  );
                })}

                {bar.wasteLength > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: getSegmentWidth(bar.wasteLength) }}
                    transition={{ delay: (index * 0.2) + (bar.cuts.length * 0.1), duration: 0.5 }}
                    className="flex items-center justify-center bg-red-500 text-white text-xs font-medium"
                    style={{ width: getSegmentWidth(bar.wasteLength) }}
                  >
                    {getSegmentWidth(bar.wasteLength) > 40 && 'WASTE'}
                  </motion.div>
                )}
              </div>

              <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>{(stockLength / 4).toFixed(0)}mm</span>
                <span>{(stockLength / 2).toFixed(0)}mm</span>
                <span>{((3 * stockLength) / 4).toFixed(0)}mm</span>
                <span>{stockLength}mm</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {bars.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No cutting plan generated yet. Please optimize your cutting parameters.
        </div>
      )}
    </motion.div>
  );
};