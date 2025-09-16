import React from 'react';
import jsPDF from 'jspdf';
import { OptimizationResult, Part, CuttingParams } from '../types';
import { generateColorMapping } from '../utils/optimizer';

interface PDFExportButtonProps {
  result: OptimizationResult;
  params: CuttingParams;
}

export const PDFExportButton: React.FC<PDFExportButtonProps> = ({ result, params }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const colorMapping = generateColorMapping(params.parts);
    let yPosition = 20;

    doc.setFontSize(20);
    doc.text('1D Cutting Stock Optimization Report', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 20;

    doc.setFontSize(14);
    doc.text('Parameters:', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.text(`Stock Bar Length: ${params.stockLength}mm`, 25, yPosition);
    yPosition += 6;
    doc.text(`Kerf Thickness: ${params.kerfThickness}mm`, 25, yPosition);
    yPosition += 15;

    doc.setFontSize(14);
    doc.text('Summary:', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.text(`Total Bars Required: ${result.totalBars}`, 25, yPosition);
    yPosition += 6;
    doc.text(`Total Waste: ${result.totalWaste.toFixed(0)}mm`, 25, yPosition);
    yPosition += 6;
    doc.text(`Waste Percentage: ${result.wastePercentage.toFixed(1)}%`, 25, yPosition);
    yPosition += 15;

    doc.setFontSize(14);
    doc.text('Cutting Plan:', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(8);
    const headers = ['Bar #', 'Cuts (mm)', 'Used Length (mm)', 'Waste (mm)'];
    const headerY = yPosition;

    headers.forEach((header, index) => {
      doc.text(header, 20 + (index * 45), headerY);
    });

    yPosition += 8;
    doc.line(20, yPosition, 200, yPosition);
    yPosition += 5;

    result.bars.forEach((bar) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      const cutsText = bar.cuts.map(cut => cut.length).join(', ');

      doc.text(bar.id.toString(), 20, yPosition);
      doc.text(cutsText, 65, yPosition);
      doc.text(bar.usedLength.toFixed(0), 110, yPosition);
      doc.text(bar.wasteLength.toFixed(0), 155, yPosition);

      yPosition += 6;
    });

    yPosition += 10;

    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.text('Visual Diagrams:', 20, yPosition);
    yPosition += 15;

    result.bars.forEach((bar, barIndex) => {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(10);
      doc.text(`Bar ${bar.id}:`, 20, yPosition);
      yPosition += 8;

      const barWidth = 150;
      const barHeight = 8;
      let currentX = 20;

      bar.cuts.forEach((cut) => {
        const segmentWidth = (cut.length / params.stockLength) * barWidth;
        const color = colorMapping[cut.length];

        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        doc.setFillColor(r, g, b);
        doc.rect(currentX, yPosition, segmentWidth, barHeight, 'F');
        doc.setDrawColor(0);
        doc.rect(currentX, yPosition, segmentWidth, barHeight);

        if (segmentWidth > 15) {
          doc.setFontSize(6);
          doc.text(cut.length.toString(), currentX + 2, yPosition + 5);
        }

        currentX += segmentWidth;
      });

      if (bar.wasteLength > 0) {
        const wasteWidth = (bar.wasteLength / params.stockLength) * barWidth;
        doc.setFillColor(255, 0, 0);
        doc.rect(currentX, yPosition, wasteWidth, barHeight, 'F');
        doc.setDrawColor(0);
        doc.rect(currentX, yPosition, wasteWidth, barHeight);

        if (wasteWidth > 15) {
          doc.setFontSize(6);
          doc.text('WASTE', currentX + 2, yPosition + 5);
        }
      }

      yPosition += 15;
    });

    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.text('Color Legend:', 20, yPosition);
    yPosition += 10;

    const uniqueLengths = Array.from(new Set(params.parts.map(p => p.length))).sort((a, b) => b - a);

    uniqueLengths.forEach((length, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      const color = colorMapping[length];
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      doc.setFillColor(r, g, b);
      doc.rect(20, yPosition - 3, 8, 5, 'F');
      doc.setDrawColor(0);
      doc.rect(20, yPosition - 3, 8, 5);

      doc.setFontSize(10);
      doc.text(`${length}mm`, 35, yPosition);

      yPosition += 8;
    });

    doc.setFillColor(255, 0, 0);
    doc.rect(20, yPosition - 3, 8, 5, 'F');
    doc.setDrawColor(0);
    doc.rect(20, yPosition - 3, 8, 5);
    doc.text('Waste', 35, yPosition);

    doc.save('cutting-plan.pdf');
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center space-x-2"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <span>Export PDF</span>
    </button>
  );
};