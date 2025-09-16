import React from 'react';
import { motion } from 'framer-motion';
import { OptimizationResult } from '../types';

interface ResultsTableProps {
  result: OptimizationResult;
  stockLength: number;
  kerfThickness: number;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ result, stockLength, kerfThickness }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 mb-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Cutting Plan Results</h3>
        <div className="text-sm text-gray-600">
          <span className="mr-4">Stock Length: {stockLength}mm</span>
          <span>Kerf: {kerfThickness}mm</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{result.totalBars}</div>
          <div className="text-sm text-gray-600">Total Bars Required</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{result.totalWaste.toFixed(0)}mm</div>
          <div className="text-sm text-gray-600">Total Waste</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{result.wastePercentage.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Waste Percentage</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left">Bar #</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Cuts</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Used Length (mm)</th>
              <th className="border border-gray-300 px-4 py-2 text-right">Waste (mm)</th>
            </tr>
          </thead>
          <tbody>
            {result.bars.map((bar, index) => (
              <motion.tr
                key={bar.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-gray-50"
              >
                <td className="border border-gray-300 px-4 py-2 font-semibold">
                  {bar.id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    {bar.cuts.map((cut, cutIndex) => (
                      <span
                        key={cutIndex}
                        className="inline-block px-2 py-1 text-xs font-medium text-white rounded"
                        style={{ backgroundColor: cut.color }}
                      >
                        {cut.length}mm
                      </span>
                    ))}
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                  {bar.usedLength.toFixed(0)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right font-medium text-red-600">
                  {bar.wasteLength.toFixed(0)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};