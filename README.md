# Retail Supply Chain Analysis Tool

An AI-powered tool for analyzing retail supply chain data, providing actionable insights for inventory optimization, vendor management, and sales forecasting.

## Features

- Upload and analyze multiple Excel/CSV files
- Support for Purchase Orders, Sales Data, and Inventory files
- Automatic file type detection
- Combined cross-analysis of multiple data sources
- Detailed visualizations and metrics
- Actionable recommendations for supply chain optimization

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Upload one or more Excel/CSV files containing retail data
2. Select the appropriate data type for each file if not automatically detected
3. Click "Analyze Files" to process the data
4. View insights across different categories (Overview, Inventory, Vendors, Sales)
5. Switch between combined analysis and individual file type analysis

## Technologies

- Next.js for the frontend and API routes
- Claude AI for intelligent data analysis
- Chart.js for data visualization
- XLSX for Excel file processing

## Environment Variables

Create a `.env.local` file with the following variables:

```
ANTHROPIC_API_KEY=your_api_key_here
```

## License

[MIT](LICENSE)

I'd like to create an MCP where I can upload excel spreadsheets with retail store data including inventory reports, sales reports, etc and then have ai analyze the data for trends, forecasts, and other insights as if the AI is a Sr. Supply Chain expert for the retailer. Is that something you can help me with?

I have examples of the data if it is helpful.

###

Retail Supply Chain Analysis MCP
Yes, I can definitely help you create a Multi-modal Conversational Persona (MCP) that analyzes retail store data like a senior Supply Chain expert. This is an excellent use case for AI analysis.
High-Level Approach
Here's how we could structure this project:
Data Upload & Processing: Create an interface to upload Excel files containing inventory, sales, and other retail data
Data Analysis: Process the data to extract meaningful insights
Expert Persona: Design the AI to communicate insights like a senior Supply Chain expert
Visualization: Provide visual representations of trends and forecasts

Implementation Steps

1. Data Upload Component
First, we'll need a way to upload and process Excel files:

import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function RetailDataProcessor({ onDataProcessed }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dataType, setDataType] = useState('purchase_orders');
  const [location, setLocation] = useState('');
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Process the first sheet by default
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Detect data type based on column headers
        const detectedType = detectDataType(jsonData);
        
        // Process and normalize the data based on type
        const processedData = {
          type: detectedType || dataType,
          location: location,
          data: normalizeData(jsonData, detectedType || dataType)
        };
        
        onDataProcessed(processedData);
      } catch (error) {
        console.error("Error processing Excel file:", error);
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.readAsArrayBuffer(file);
  };
  
  // Detect data type based on column headers
  const detectDataType = (data) => {
    if (!data || data.length === 0) return null;
    
    const headers = Object.keys(data[0]);
    
    if (headers.includes('PO #') && headers.includes('# Ordered')) {
      return 'purchase_orders';
    } else if (headers.includes('Invoice #') || headers.includes('Sale By')) {
      return 'sales_data';
    } else if (headers.includes('On Hand') || headers.includes('In Stock')) {
      return 'inventory';
    }
    
    return null;
  };
  
  // Normalize data based on type
  const normalizeData = (data, type) => {
    switch(type) {
      case 'purchase_orders':
        return data.map(item => ({
          poNumber: item['PO #'],
          status: item['Status'],
          vendor: item['Vendor'],
          productSku: item['Product SKU'],
          productName: item['Product Name'],
          category: item['Category'],
          quantityOrdered: item['# Ordered'],
          quantityReceived: item['# Received'],
          quantityOutstanding: item['# Outstanding'],
          costPerItem: item['Cost Per Item'],
          costReceived: item['Cost Received'],
          costOutstanding: item['Cost Outstanding'],
          orderedAt: item['Ordered At'],
          daysOnOrder: item['Days on Order'],
          eta: item['ETA']
        }));
        
      case 'sales_data':
        // Normalize sales data based on your fourth screenshot
        return data.map(item => ({
          invoiceNumber: item['Invoice #'],
          saleDate: item['Date'],
          saleBy: item['Sale By'],
          product: item['Product Name'],
          category: item['Category'],
          quantity: item['Qty'],
          price: item['Price'],
          cost: item['Cost'],
          profit: item['Profit'],
          location: item['Location'] || location
        }));
        
      default:
        return data;
    }
  };
  
  return (
    <div className="data-processor">
      <div className="form-controls">
        <div className="form-group">
          <label>Data Type:</label>
          <select 
            value={dataType} 
            onChange={(e) => setDataType(e.target.value)}
          >
            <option value="purchase_orders">Purchase Orders</option>
            <option value="sales_data">Sales Data</option>
            <option value="inventory">Inventory</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Store Location:</label>
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Aberdeen, Huron, Luverne, etc."
          />
        </div>
      </div>
      
      <div className="file-upload">
        <input 
          type="file" 
          accept=".xlsx,.xls,.csv" 
          onChange={handleFileUpload} 
          disabled={isProcessing}
        />
        {isProcessing && <p>Processing data...</p>}
      </div>
    </div>
  );
}

export default RetailDataProcessor;

### 2. Supply Chain Analysis Component

Next, we'll create a component to handle the AI analysis:

```javascript
import React, { useState, useEffect } from 'react';
import { analyzeRetailData } from '../services/aiService';

function SupplyChainAnalysis({ data }) {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  useEffect(() => {
    if (data) {
      performAnalysis();
    }
  }, [data]);
  
  const performAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      // This would call your AI service
      const result = await analyzeRetailData(data);
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing data:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="analysis-container">
      <h2>Supply Chain Analysis</h2>
      
      {isAnalyzing && <p>Analyzing your retail data...</p>}
      
      {analysis && (
        <div className="analysis-results">
          <h3>Key Insights</h3>
          <div dangerouslySetInnerHTML={{ __html: analysis.insights }} />
          
          <h3>Inventory Recommendations</h3>
          <div dangerouslySetInnerHTML={{ __html: analysis.inventoryRecommendations }} />
          
          <h3>Sales Trends</h3>
          <div dangerouslySetInnerHTML={{ __html: analysis.salesTrends }} />
          
          <h3>Forecasts</h3>
          <div dangerouslySetInnerHTML={{ __html: analysis.forecasts }} />
        </div>
      )}
    </div>
  );
}

export default SupplyChainAnalysis;
```

### 3. AI Service

Now, let's create a service to interact with the AI:

```javascript:README.md
// services/aiService.js

export async function analyzeRetailData(data) {
  try {
    const response = await fetch('/api/analyze-mobile-retail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in AI analysis service:', error);
    throw error;
  }
}
```

### 4. Backend API Endpoint

For the backend, we'll need an endpoint to process the data and interact with the AI:

```javascript
// api/analyze-mobile-retail.js
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { data } = req.body;
    
    // Create a specialized prompt based on data type
    let prompt = '';
    
    if (data.type === 'purchase_orders') {
      prompt = createPurchaseOrderPrompt(data);
    } else if (data.type === 'sales_data') {
      prompt = createSalesDataPrompt(data);
    } else if (data.type === 'inventory') {
      prompt = createInventoryPrompt(data);
    } else {
      prompt = createGeneralPrompt(data);
    }
    
    // Call the AI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a senior supply chain expert with 20+ years of experience in mobile device retail. You analyze data and provide actionable insights with a focus on inventory optimization, vendor management, and sales forecasting for smartphone and mobile accessory retailers." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
    });
    
    // Process the AI response
    const analysisText = completion.choices[0].message.content;
    
    // Parse the response into structured data
    const analysisData = parseAnalysisResponse(analysisText, data.type);
    
    return res.status(200).json(analysisData);
  } catch (error) {
    console.error('Error analyzing mobile retail data:', error);
    return res.status(500).json({ error: 'Failed to analyze data' });
  }
}

// Create specialized prompts based on data type
function createPurchaseOrderPrompt(data) {
  return `
    As a senior supply chain expert for a mobile device retailer, analyze the following purchase order data for ${data.location || 'our stores'}:
    
    ${JSON.stringify(data.data, null, 2)}
    
    Focus your analysis on:
    1. Vendor performance (delivery times, order fulfillment)
    2. Product category insights (smartphones, accessories, etc.)
    3. Inventory management recommendations
    4. Cost optimization opportunities
    5. Order cycle time improvements
    
    Provide specific actionable recommendations for improving the supply chain.
  `;
}

function createSalesDataPrompt(data) {
  return `
    As a senior supply chain expert for a mobile device retailer, analyze the following sales data for ${data.location || 'our stores'}:
    
    ${JSON.stringify(data.data, null, 2)}
    
    Focus your analysis on:
    1. Sales trends by product category and specific models
    2. Profitability analysis by product type
    3. Seasonal patterns and forecasting
    4. Product mix optimization
    5. Inventory replenishment recommendations based on sales velocity
    
    Provide specific actionable recommendations for improving sales and inventory alignment.
  `;
}

function createInventoryPrompt(data) {
  // Similar structure for inventory data
}

function createGeneralPrompt(data) {
  // Fallback for other data types
}

// Parse the AI response into structured data
function parseAnalysisResponse(text, dataType) {
  // Basic parsing logic - this could be enhanced with more sophisticated parsing
  const sections = {
    keyInsights: extractSection(text, "Key Insights"),
    inventoryAnalysis: extractSection(text, "Inventory Analysis"),
    inventoryRecommendations: extractSection(text, "Inventory Recommendations"),
    vendorAnalysis: extractSection(text, "Vendor Analysis"),
    vendorRecommendations: extractSection(text, "Vendor Recommendations"),
    salesTrends: extractSection(text, "Sales Trends"),
    salesForecasts: extractSection(text, "Sales Forecasts")
  };
  
  // Add placeholder metrics and chart data
  // In a real implementation, you might extract these from the AI response
  // or calculate them directly from the data
  const metrics = {
    inventoryTurnover: "4.2",
    fulfillmentRate: "92.5",
    avgDaysOnOrder: "6.3"
  };
  
  const charts = {
    inventoryTurnover: [],
    categoryPerformance: [],
    vendorPerformance: [],
    salesVsPurchases: []
  };
  
  return {
    ...sections,
    metrics,
    charts
  };
}

function extractSection(text, sectionName) {
  const regex = new RegExp(`${sectionName}[:\\s]+(.*?)(?=\\d+\\.\\s+[A-Z]|#|$)`, 's');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}
```

### 5. Main App Component

Finally, let's put it all together:

```javascript
import React, { useState } from 'react';
import DataUploader from './components/DataUploader';
import SupplyChainAnalysis from './components/SupplyChainAnalysis';

function RetailAnalysisMCP() {
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

export default RetailAnalysisMCP;
```

## Next Steps

To make this MCP more powerful:

1. **Examples of Data**: Yes, seeing examples of your actual data would be extremely helpful to fine-tune the analysis and ensure the AI can properly interpret your specific retail data formats.

2. **Data Visualization**: Add charts and graphs using libraries like Chart.js or D3.js to visualize trends and forecasts.

3. **Conversational Interface**: Add a chat interface where users can ask follow-up questions about the analysis.

4. **Domain-Specific Prompting**: Refine the AI prompts with specific supply chain terminology and frameworks based on your industry.

5. **Data Preprocessing**: Add more sophisticated data cleaning and normalization before analysis.

Would you like to share examples of your data so I can help tailor this solution more specifically to your needs?

###

Yes, I'd love to share examples. Can I upload the files for you to see them?

Yes, you can upload your Excel files for me to review. This will help me tailor the solution specifically to your data structure and retail context.
When you upload the files, I'll be able to:
Analyze the structure and format of your data
Identify key fields and relationships
Suggest specific preprocessing steps needed
Refine the AI prompts to better interpret your particular retail data
Recommend appropriate visualizations for the insights
Please go ahead and upload your example inventory reports, sales data, or any other retail spreadsheets you'd like me to examine. Once I see the actual data, I can provide much more specific guidance on how to structure the MCP for maximum effectiveness.

###

I'll share 4 screen shots.

First - Aberdeen PO's:
Second - Huron PO's:
Third - Luverne PO's:
Fourth - Sales Data from July 2023 through February 2024:


Thank you for sharing these screenshots! I can now see the structure of your retail data, which will help me design a more tailored MCP solution. Let me analyze what I'm seeing:

Data Analysis
1. Purchase Order Reports
The first three screenshots show purchase order details for different locations (Aberdeen, Huron, and Luverne) with similar structures:
Key fields: PO #, Status, Receive At, Vendor information, Product SKU/ID, Product Name, Category
Quantity data: # Ordered, # Received, # Outstanding
Financial data: Cost Per Item, Cost Received, Cost Outstanding
Timing information: Committed On, Ordered At, Days on Order, ETA
Additional info: Ordering Comments, Receiving Comments, Order Entry #
These reports track mobile devices and accessories (smartphones, cables, chargers, etc.) with detailed procurement information.
2. Sales Data
The fourth screenshot shows sales data with:
Transaction details: Invoice #, Received dates, Sale By information
Product information: Various mobile devices and accessories
Pricing data: Multiple price-related columns
Location/store information
MCP Design Based on Your Data
Now that I understand your data structure, here's a more tailored approach for your retail supply chain MCP:

// components/MobileRetailAnalysis.js
import React, { useState, useEffect } from 'react';
import { analyzeRetailData } from '../services/aiService';
import { 
  InventoryTurnoverChart, 
  ProductCategoryChart,
  VendorPerformanceChart,
  SalesVsPurchasesChart
} from './charts';

function MobileRetailAnalysis({ data }) {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedView, setSelectedView] = useState('overview');
  
  useEffect(() => {
    if (data) {
      performAnalysis();
    }
  }, [data]);
  
  const performAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeRetailData(data);
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing data:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Render different views based on selection
  const renderAnalysisView = () => {
    if (!analysis) return null;
    
    switch(selectedView) {
      case 'overview':
        return (
          <div className="analysis-overview">
            <h3>Key Insights</h3>
            <div dangerouslySetInnerHTML={{ __html: analysis.keyInsights }} />
            
            <div className="metrics-summary">
              <div className="metric-card">
                <h4>Inventory Turnover</h4>
                <p className="metric-value">{analysis.metrics.inventoryTurnover}</p>
              </div>
              <div className="metric-card">
                <h4>Order Fulfillment Rate</h4>
                <p className="metric-value">{analysis.metrics.fulfillmentRate}%</p>
              </div>
              <div className="metric-card">
                <h4>Average Days on Order</h4>
                <p className="metric-value">{analysis.metrics.avgDaysOnOrder}</p>
              </div>
            </div>
          </div>
        );
        
      case 'inventory':
        return (
          <div className="inventory-analysis">
            <h3>Inventory Analysis</h3>
            <div dangerouslySetInnerHTML={{ __html: analysis.inventoryAnalysis }} />
            
            <h4>Top Products by Turnover</h4>
            <InventoryTurnoverChart data={analysis.charts.inventoryTurnover} />
            
            <h4>Category Performance</h4>
            <ProductCategoryChart data={analysis.charts.categoryPerformance} />
            
            <h3>Inventory Recommendations</h3>
            <div dangerouslySetInnerHTML={{ __html: analysis.inventoryRecommendations }} />
          </div>
        );
        
      case 'vendor':
        return (
          <div className="vendor-analysis">
            <h3>Vendor Performance</h3>
            <div dangerouslySetInnerHTML={{ __html: analysis.vendorAnalysis }} />
            
            <h4>Vendor Delivery Performance</h4>
            <VendorPerformanceChart data={analysis.charts.vendorPerformance} />
            
            <h3>Vendor Recommendations</h3>
            <div dangerouslySetInnerHTML={{ __html: analysis.vendorRecommendations }} />
          </div>
        );
        
      case 'sales':
        return (
          <div className="sales-analysis">
            <h3>Sales Trends</h3>
            <div dangerouslySetInnerHTML={{ __html: analysis.salesTrends }} />
            
            <h4>Sales vs Purchases</h4>
            <SalesVsPurchasesChart data={analysis.charts.salesVsPurchases} />
            
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
        <h2>Mobile Retail Supply Chain Analysis</h2>
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
            className={selectedView === 'vendor' ? 'active' : ''} 
            onClick={() => setSelectedView('vendor')}
          >
            Vendor
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
          <p>Analyzing your mobile retail data...</p>
        </div>
      ) : renderAnalysisView()}
    </div>
  );
}

export default MobileRetailAnalysis;

###

Now, let's update the AI service to be more specific to your mobile retail data:

// services/aiService.js
export async function analyzeRetailData(data) {
  try {
    const response = await fetch('/api/analyze-mobile-retail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze data');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in AI analysis service:', error);
    throw error;
  }
}