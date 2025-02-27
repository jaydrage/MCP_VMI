import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    const { data } = await request.json();
    
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
    
    // Call Claude API
    const completion = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 4000,
      system: "You are a senior supply chain expert with 20+ years of experience in mobile device retail. You analyze data and provide actionable insights with a focus on inventory optimization, vendor management, and sales forecasting for smartphone and mobile accessory retailers.",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
    });
    
    // Process the Claude response
    const analysisText = completion.content[0].text;
    
    // Parse the response into structured data
    const analysisData = parseAnalysisResponse(analysisText, data.type);
    
    return NextResponse.json(analysisData);
  } catch (error) {
    console.error('Error analyzing mobile retail data:', error);
    return NextResponse.json({ error: 'Failed to analyze data' }, { status: 500 });
  }
}

// Create a prompt for purchase order data
function createPurchaseOrderPrompt(data) {
  return `
    I have purchase order data for a mobile retail store ${data.location ? `in ${data.location}` : ''}.
    
    Here's a sample of the data:
    ${JSON.stringify(data.data.slice(0, 10), null, 2)}
    
    Total records: ${data.data.length}
    
    Provide a comprehensive analysis of this data from a supply chain perspective, including:
    
    1. Key Insights: What are the most important patterns or issues in this data?
    2. Inventory Analysis: What does this tell us about our inventory management?
    3. Inventory Recommendations: What specific actions should we take to improve?
    4. Vendor Analysis: How are our vendors performing?
    5. Vendor Recommendations: How can we optimize our vendor relationships?
    6. Sales Trends: What can we infer about sales patterns?
    7. Sales Forecasts: What should we expect in the coming months?
    
    Please be specific and actionable in your recommendations.
  `;
}

// Create a prompt for sales data
function createSalesDataPrompt(data) {
  return `
    I have sales data for a mobile retail store ${data.location ? `in ${data.location}` : ''}.
    
    Here's a sample of the data:
    ${JSON.stringify(data.data.slice(0, 10), null, 2)}
    
    Total records: ${data.data.length}
    
    Provide a comprehensive analysis of this sales data from a supply chain perspective, including:
    
    1. Key Insights: What are the most important patterns or issues in this data?
    2. Inventory Analysis: What does this tell us about our inventory management?
    3. Inventory Recommendations: What specific actions should we take to improve?
    4. Vendor Analysis: What does this tell us about our product mix?
    5. Vendor Recommendations: How can we optimize our product mix?
    6. Sales Trends: What patterns do you see in the sales data?
    7. Sales Forecasts: What should we expect in the coming months?
    
    Please be specific and actionable in your recommendations.
  `;
}

// Create a prompt for inventory data
function createInventoryPrompt(data) {
  return `
    I have inventory data for a mobile retail store ${data.location ? `in ${data.location}` : ''}.
    
    Here's a sample of the data:
    ${JSON.stringify(data.data.slice(0, 10), null, 2)}
    
    Total records: ${data.data.length}
    
    Provide a comprehensive analysis of this inventory data from a supply chain perspective, including:
    
    1. Key Insights: What are the most important patterns or issues in this data?
    2. Inventory Analysis: What does this tell us about our inventory management?
    3. Inventory Recommendations: What specific actions should we take to improve?
    4. Vendor Analysis: What does this tell us about our product mix?
    5. Vendor Recommendations: How can we optimize our product mix?
    6. Sales Implications: What can we infer about sales patterns?
    7. Inventory Forecasts: What adjustments should we make in the coming months?
    
    Please be specific and actionable in your recommendations.
  `;
}

// Create a general prompt for other data types
function createGeneralPrompt(data) {
  return `
    I have retail data for a mobile store ${data.location ? `in ${data.location}` : ''}.
    
    Here's a sample of the data:
    ${JSON.stringify(data.data.slice(0, 10), null, 2)}
    
    Total records: ${data.data.length}
    
    Provide a comprehensive analysis of this data from a supply chain perspective, including any actionable insights and recommendations.
  `;
}

// Parse the AI response into structured data
function parseAnalysisResponse(text, dataType) {
  // Basic parsing logic - this could be enhanced with more sophisticated parsing
  const sections = {
    keyInsights: extractSection(text, "Key Insights") || extractSection(text, "Summary"),
    inventoryAnalysis: extractSection(text, "Inventory Analysis"),
    inventoryRecommendations: extractSection(text, "Inventory Recommendations"),
    vendorAnalysis: extractSection(text, "Vendor Analysis") || extractSection(text, "Vendor Performance"),
    vendorRecommendations: extractSection(text, "Vendor Recommendations"),
    salesTrends: extractSection(text, "Sales Trends"),
    salesForecasts: extractSection(text, "Sales Forecasts") || extractSection(text, "Forecasting")
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

// Add this function to your existing route.js file
function createCombinedPrompt(data) {
  // Count files by type
  const fileTypes = data.data.map(file => file.type);
  const typeCounts = fileTypes.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  
  const typeDescription = Object.entries(typeCounts)
    .map(([type, count]) => {
      const typeName = 
        type === 'purchase_orders' ? 'purchase order' : 
        type === 'sales_data' ? 'sales' : 
        type === 'inventory' ? 'inventory' : type;
      return `${count} ${typeName} ${count === 1 ? 'file' : 'files'}`;
    })
    .join(', ');
  
  return `
    I have multiple retail data files for a mobile store ${data.location ? `in ${data.location}` : ''}.
    
    The dataset includes ${typeDescription}.
    
    Here's a sample from each type of data:
    ${data.data.map(file => 
      `\n--- ${file.type.toUpperCase()} DATA (${file.fileName}) ---\n` +
      JSON.stringify(file.data.slice(0, 3), null, 2)
    ).join('\n\n')}
    
    Total files: ${data.data.length}
    
    Provide a comprehensive cross-analysis of this data from a supply chain perspective, including:
    
    1. Key Insights: What are the most important patterns or issues across these datasets?
    2. Inventory Analysis: What does this combined data tell us about our inventory management?
    3. Inventory Recommendations: What specific actions should we take to improve?
    4. Vendor Analysis: How are our vendors performing based on all available data?
    5. Vendor Recommendations: How can we optimize our vendor relationships?
    6. Sales Trends: What can we infer about sales patterns?
    7. Sales Forecasts: What adjustments should we make in the coming months?
    
    Please be specific and actionable in your recommendations, and consider how the different datasets relate to each other.
  `;
} 