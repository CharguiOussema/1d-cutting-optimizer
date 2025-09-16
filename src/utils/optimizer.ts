import { Part, StockBar, Cut, CuttingParams, OptimizationResult, ColorMapping } from '../types';

const COLORS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6366F1',
  '#14B8A6', '#F472B6', '#A855F7', '#22D3EE', '#FDE047',
  '#FB7185', '#34D399', '#FBBF24', '#C084FC', '#60A5FA'
];

export function generateColorMapping(parts: Part[]): ColorMapping {
  const uniqueLengths = Array.from(new Set(parts.map(p => p.length))).sort((a, b) => b - a);
  const mapping: ColorMapping = {};

  uniqueLengths.forEach((length, index) => {
    mapping[length] = COLORS[index % COLORS.length];
  });

  return mapping;
}

export function optimizeCutting(params: CuttingParams): OptimizationResult {
  const { stockLength, kerfThickness, parts } = params;
  const colorMapping = generateColorMapping(parts);

  const allParts: Array<{ length: number; partId: string; color: string }> = [];
  parts.forEach(part => {
    for (let i = 0; i < part.quantity; i++) {
      allParts.push({
        length: part.length,
        partId: `${part.id}-${i + 1}`,
        color: colorMapping[part.length]
      });
    }
  });

  allParts.sort((a, b) => b.length - a.length);

  const bars: StockBar[] = [];

  for (const part of allParts) {
    let placed = false;
    const partWithKerf = part.length + kerfThickness;

    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i];
      const remainingLength = stockLength - bar.usedLength;

      if (remainingLength >= partWithKerf) {
        bar.cuts.push({
          partId: part.partId,
          length: part.length,
          color: part.color
        });
        bar.usedLength += partWithKerf;
        bar.wasteLength = stockLength - bar.usedLength;
        placed = true;
        break;
      }
    }

    if (!placed) {
      const newBar: StockBar = {
        id: bars.length + 1,
        cuts: [{
          partId: part.partId,
          length: part.length,
          color: part.color
        }],
        usedLength: partWithKerf,
        wasteLength: stockLength - partWithKerf
      };
      bars.push(newBar);
    }
  }

  const totalWaste = bars.reduce((sum, bar) => sum + bar.wasteLength, 0);
  const totalMaterial = bars.length * stockLength;
  const wastePercentage = totalMaterial > 0 ? (totalWaste / totalMaterial) * 100 : 0;

  return {
    bars,
    totalBars: bars.length,
    totalWaste,
    wastePercentage
  };
}