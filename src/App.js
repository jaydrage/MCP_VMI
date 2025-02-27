import React, { useState } from 'react';
import DataUploader from './components/DataUploader';
import SupplyChainAnalysis from './components/SupplyChainAnalysis';
// Remove this line if you're importing CSS in globals.css
// import './styles.css';

function App() {
  const [retailData, setRetailData] = useState(null);
  
  const handleDataProcessed = (data) => {
    setRetailData(data);
  };
  
  return (
    <div className="retail-analysis-app">
      <header>
        <h1>Retail Supply Chain Analysis</h1>
        <p>Upload your retail data for expert supply chain analysis</p>
      </header>
      
      <main>
        <DataUploader onDataProcessed={handleDataProcessed} />
        
        {retailData && <SupplyChainAnalysis data={retailData} />}
      </main>
    </div>
  );
}

export default App; 