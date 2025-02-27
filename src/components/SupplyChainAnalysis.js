import React, { useState, useEffect } from 'react';
import { analyzeRetailData } from '../services/aiService';
import InventoryTurnoverChart from './charts/InventoryTurnoverChart';
import ProductCategoryChart from './charts/ProductCategoryChart';
import VendorPerformanceChart from './charts/VendorPerformanceChart';
import SalesVsPurchasesChart from './charts/SalesVsPurchasesChart';

function SupplyChainAnalysis({ data }) {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedFile, setSelectedFile] = useState('all');
  const [fileAnalyses, setFileAnalyses] = useState({});
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (data) {
      performAnalysis();
    }
  }, [data]);
  
  const performAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // First, analyze all files together
      const combinedAnalysis = await analyzeRetailData({
        type: 'combined',
        location: data.location,
        data: data.allFiles
      });
      
      console.log("Combined analysis received:", combinedAnalysis);
      
      // Then analyze each file type separately
      const typeAnalyses = {};
      for (const [type, files] of Object.entries(data.filesByType)) {
        if (files.length > 0) {
          try {
            const typeAnalysis = await analyzeRetailData({
              type: type,
              location: data.location,
              data: files.flat() // Flatten the array of arrays
            });
            typeAnalyses[type] = typeAnalysis;
          } catch (error) {
            console.error(`Error analyzing ${type} data:`, error);
            setError(prev => prev ? `${prev}\n${error.message}` : error.message);
            // Continue with other file types even if one fails
          }
        }
      }
      
      // Store all analyses
      setAnalysis(combinedAnalysis);
      setFileAnalyses({
        all: combinedAnalysis,
        ...typeAnalyses
      });
      
    } catch (error) {
      console.error('Error analyzing data:', error);
      setError(error.message || 'Failed to analyze data');
      setAnalysis(null);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleFileSelect = (fileType) => {
    setSelectedFile(fileType);
    setAnalysis(fileAnalyses[fileType]);
  };
  
  const renderAnalysisView = () => {
    if (!analysis) return null;
    
    switch (selectedView) {
      case 'overview':
        return (
          <div className="analysis-overview">
            <div className="metrics-summary">
              <div className="metric-card">
                <h4>Inventory Turnover</h4>
                <div className="metric-value">{analysis.metrics.inventoryTurnover}</div>
              </div>
              <div className="metric-card">
                <h4>Fulfillment Rate</h4>
                <div className="metric-value">{analysis.metrics.fulfillmentRate}</div>
              </div>
              <div className="metric-card">
                <h4>Avg Days on Order</h4>
                <div className="metric-value">{analysis.metrics.avgDaysOnOrder}</div>
              </div>
            </div>
            
            <div className="key-insights">
              <h3>Key Insights</h3>
              <div dangerouslySetInnerHTML={{ __html: analysis.keyInsights }} />
            </div>
            
            <div className="recommendations">
              <h3>Recommendations</h3>
              <div dangerouslySetInnerHTML={{ __html: analysis.inventoryRecommendations }} />
            </div>
          </div>
        );
        
      case 'inventory':
        return (
          <div className="inventory-analysis">
            <h3>Inventory Analysis</h3>
            <div dangerouslySetInnerHTML={{ __html: analysis.inventoryAnalysis }} />
            
            <div className="charts-container">
              <div className="chart-wrapper">
                <h4>Inventory Turnover by Product</h4>
                <InventoryTurnoverChart data={analysis.charts.inventoryTurnover} />
              </div>
              
              <div className="chart-wrapper">
                <h4>Product Category Distribution</h4>
                <ProductCategoryChart data={analysis.charts.categoryPerformance} />
              </div>
            </div>
            
            <h3>Inventory Recommendations</h3>
            <div dangerouslySetInnerHTML={{ __html: analysis.inventoryRecommendations }} />
          </div>
        );
        
      case 'vendors':
        return (
          <div className="vendor-analysis">
            <h3>Vendor Analysis</h3>
            <div dangerouslySetInnerHTML={{ __html: analysis.vendorAnalysis }} />
            
            <div className="chart-wrapper">
              <h4>Vendor Performance</h4>
              <VendorPerformanceChart data={analysis.charts.vendorPerformance} />
            </div>
            
            <h3>Vendor Recommendations</h3>
            <div dangerouslySetInnerHTML={{ __html: analysis.vendorRecommendations }} />
          </div>
        );
        
      case 'sales':
        return (
          <div className="sales-analysis">
            <h3>Sales Trends</h3>
            <div dangerouslySetInnerHTML={{ __html: analysis.salesTrends }} />
            
            <div className="chart-wrapper">
              <h4>Sales vs Purchases</h4>
              <SalesVsPurchasesChart data={analysis.charts.salesVsPurchases} />
            </div>
            
            <h3>Sales Forecasts</h3>
            <div dangerouslySetInnerHTML={{ __html: analysis.salesForecasts }} />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="mobile-retail-analysis">
      <div className="analysis-header">
        <h2>Supply Chain Analysis</h2>
        
        {Object.keys(fileAnalyses).length > 1 && (
          <div className="file-selector">
            <label>Analyzing:</label>
            <select 
              value={selectedFile} 
              onChange={(e) => handleFileSelect(e.target.value)}
            >
              <option value="all">All Files Combined</option>
              {Object.keys(data.filesByType).map(type => (
                <option key={type} value={type}>
                  {type === 'purchase_orders' ? 'Purchase Orders' : 
                   type === 'sales_data' ? 'Sales Data' : 
                   type === 'inventory' ? 'Inventory' : type}
                  ({data.filesByType[type].length} files)
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="view-selector">
          <button 
            className={selectedView === 'overview' ? 'active' : ''} 
            onClick={() => setSelectedView('overview')}
          >
            Overview
          </button>
          <button 
            className={selectedView === 'inventory' ? 'active' : ''} 
            onClick={() => setSelectedView('inventory')}
          >
            Inventory
          </button>
          <button 
            className={selectedView === 'vendors' ? 'active' : ''} 
            onClick={() => setSelectedView('vendors')}
          >
            Vendors
          </button>
          <button 
            className={selectedView === 'sales' ? 'active' : ''} 
            onClick={() => setSelectedView('sales')}
          >
            Sales
          </button>
        </div>
      </div>
      
      {isAnalyzing ? (
        <div className="loading">
          <p>Analyzing {data.fileCount} files of retail data...</p>
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="api-error">
          <h3>Analysis Error</h3>
          <p>{error}</p>
          <p>This may be due to API rate limits or an issue with the data. Try again with fewer files or wait a moment.</p>
        </div>
      ) : renderAnalysisView()}
    </div>
  );
}

export default SupplyChainAnalysis; 