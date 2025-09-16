export interface Part {
  id: string;
  length: number;
  quantity: number;
}

export interface Cut {
  partId: string;
  length: number;
  color: string;
}

export interface StockBar {
  id: number;
  cuts: Cut[];
  usedLength: number;
  wasteLength: number;
}

export interface CuttingParams {
  stockLength: number;
  kerfThickness: number;
  parts: Part[];
}

export interface OptimizationResult {
  bars: StockBar[];
  totalBars: number;
  totalWaste: number;
  wastePercentage: number;
}

export interface ColorMapping {
  [partLength: number]: string;
}