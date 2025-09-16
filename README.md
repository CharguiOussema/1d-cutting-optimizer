# 1D Cutting Stock Optimizer

A React-based web application for optimizing 1D cutting stock using the Best-Fit Decreasing (BFD) algorithm.

## Features

- **Input Management**: Dynamic form for entering stock length, kerf thickness, and multiple parts with quantities
- **BFD Algorithm**: Implements Best-Fit Decreasing algorithm with kerf consideration
- **Visual Results**: Color-coded bar diagrams showing cutting plans
- **Results Table**: Detailed table showing cuts, used length, and waste for each bar
- **PDF Export**: Generate comprehensive cutting plan reports
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Framer Motion for enhanced user experience

## Technologies Used

- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- jsPDF for PDF generation

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter your stock bar length (in mm)
2. Set the kerf thickness (blade width in mm)
3. Add parts by specifying length and quantity
4. Click "Optimize Cutting Plan" to generate results
5. View the results in the table and visual diagrams
6. Export to PDF for printing or sharing

## Algorithm Details

The application uses the Best-Fit Decreasing (BFD) algorithm:

1. **Sort**: Parts are sorted by length in descending order
2. **Fit**: Each part is placed in the bar with the least remaining space that can accommodate it
3. **Kerf Consideration**: Each cut reduces available space by part length + kerf thickness
4. **New Bar**: If no existing bar can fit a part, a new bar is created

## Project Structure

```
src/
├── components/
│   ├── InputForm.tsx       # Input form with validation
│   ├── ResultsTable.tsx    # Results table component
│   ├── BarDiagram.tsx      # Visual bar diagrams
│   ├── Legend.tsx          # Color legend
│   └── PDFExportButton.tsx # PDF export functionality
├── types/
│   └── index.ts           # TypeScript interfaces
├── utils/
│   └── optimizer.ts       # BFD algorithm implementation
├── App.tsx                # Main application component
└── index.tsx              # Entry point
```

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## License

MIT License