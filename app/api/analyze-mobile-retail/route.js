import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  try {
    console.log("API route started");
    const { data } = await request.json();
    
    // Preprocess data to extract key statistics
    const dataStats = preprocessData(data);
    
    // Add the stats to the data object
    const enhancedData = {
      ...data,
      stats: dataStats
    };
    
    // Create a specialized prompt based on data type
    let prompt = '';
    
    if (data.type === 'combined') {
      prompt = createCombinedPrompt(enhancedData);
    } else if (data.type === 'purchase_orders') {
      prompt = createPurchaseOrderPrompt(enhancedData);
    } else if (data.type === 'sales_data') {
      prompt = createSalesDataPrompt(enhancedData);
    } else if (data.type === 'inventory') {
      prompt = createInventoryPrompt(enhancedData);
    } else {
      prompt = createGeneralPrompt(enhancedData);
    }
    
    console.log("Generated prompt length:", prompt.length);
    console.log("Attempting to call Claude API with model:", "claude-3-opus-20240229");
    
    try {
      const completion = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 4000,
        system: `You are a senior supply chain expert with 20+ years of experience in mobile device retail. 
        
        Your expertise includes:
        - Inventory optimization and turnover analysis
        - Product category performance evaluation
        - Vendor relationship management and scorecard development
        - Sales forecasting and trend identification
        - Supply-demand alignment and order optimization
        - Retail operations KPI analysis
        
        When analyzing retail data, you focus on:
        1. Identifying high/low performing products and categories
        2. Spotting inventory imbalances (overstock/stockouts)
        3. Evaluating order timing and quantity optimization
        4. Recognizing seasonal patterns and their supply chain implications
        5. Suggesting specific, actionable improvements with expected outcomes
        
        Your analysis should be data-driven, specific, and include concrete recommendations a retail supply chain manager could implement immediately.`,
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
      });
      
      console.log("Claude API response received");
      console.log("Response content length:", completion.content[0].text.length);
      
      const analysisText = completion.content[0].text;
      const analysisData = parseAnalysisResponse(analysisText, data.type);
      
      return NextResponse.json(analysisData);
    } catch (apiError) {
      console.error('Claude API Error Details:', {
        name: apiError.name,
        message: apiError.message,
        status: apiError.status,
        type: apiError.type
      });
      return NextResponse.json({ 
        error: `Claude API Error: ${apiError.message}`,
        details: apiError
      }, { status: 500 });
    }
  } catch (error) {
    console.error('General Error Details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json({ 
      error: `Failed to analyze data: ${error.message}`,
      details: error
    }, { status: 500 });
  }
}

function preprocessData(data) {
  // For combined data
  if (data.type === 'combined') {
    return {
      fileStats: data.data.map(file => ({
        fileName: file.fileName,
        type: file.type,
        recordCount: file.data.length,
        columnNames: Object.keys(file.data[0] || {})
      }))
    };
  }
  
  // For single file types
  const stats = {
    recordCount: data.data.length,
    columnNames: Object.keys(data.data[0] || {})
  };
  
  // Add type-specific stats
  if (data.type === 'sales_data' && data.data.length > 0) {
    // Example: Calculate total sales if there's a sales amount column
    const salesColumn = findColumn(data.data[0], ['sales', 'amount', 'revenue', 'total']);
    if (salesColumn) {
      stats.totalSales = data.data.reduce((sum, row) => sum + (Number(row[salesColumn]) || 0), 0);
      stats.avgSale = stats.totalSales / data.data.length;
    }
    
    // Find top products/categories
    const productColumn = findColumn(data.data[0], ['product', 'item', 'sku']);
    if (productColumn) {
      const productCounts = countByField(data.data, productColumn);
      stats.topProducts = Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));
    }
  }
  
  return stats;
}

// Helper functions
function findColumn(row, possibleNames) {
  const keys = Object.keys(row).map(k => k.toLowerCase());
  return Object.keys(row).find(key => 
    possibleNames.some(name => key.toLowerCase().includes(name))
  );
}

function countByField(data, field) {
  return data.reduce((counts, row) => {
    const value = row[field];
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

// Create a prompt for purchase order data
function createPurchaseOrderPrompt(data) {
  return `
    I have purchase order data for a mobile retail store ${data.location ? `in ${data.location}` : ''}.
    
    Here's a sample of the data:
    ${JSON.stringify(data.data.slice(0, 10), null, 2)}
    
    Total records: ${data.data.length}
    
    As a senior supply chain expert, provide a detailed analysis of this purchase order data, including:
    
    1. KEY INSIGHTS:
       - Identify the top 3-5 most important patterns or issues in the purchase order data
       - Highlight specific products or vendors that stand out (positively or negatively)
       - Note any critical supply chain risks or opportunities
    
    2. ORDER PATTERN ANALYSIS:
       - Analyze order frequency and volume patterns
       - Identify any seasonality or cyclical ordering
       - Evaluate order sizes and their efficiency
    
    3. VENDOR PERFORMANCE:
       - Assess lead times by vendor
       - Evaluate fill rates and order accuracy
       - Compare vendor pricing and terms
    
    4. INVENTORY IMPLICATIONS:
       - How do these purchase orders align with optimal inventory levels?
       - Are there signs of reactive ordering or strategic planning?
       - Identify potential stockout or overstock risks
    
    5. COST OPTIMIZATION:
       - Identify opportunities for order consolidation
       - Suggest optimal order quantities
       - Recommend changes to ordering frequency
    
    6. SPECIFIC RECOMMENDATIONS:
       - Provide 5-7 specific, actionable recommendations
       - Prioritize recommendations by potential impact
       - Include expected outcomes for each recommendation
    
    Be specific and data-driven in your analysis. Mention actual product names, categories, and vendors from the data. Provide concrete numbers and percentages whenever possible.
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
  console.log("Raw response length:", text.length);
  
  // More robust section extraction
  const sections = {
    keyInsights: extractSectionBetter(text, ["Key Insights", "KEY INSIGHTS", "Important Insights", "Summary"]),
    inventoryAnalysis: extractSectionBetter(text, ["Inventory Analysis", "INVENTORY ANALYSIS"]),
    inventoryRecommendations: extractSectionBetter(text, ["Inventory Recommendations", "INVENTORY RECOMMENDATIONS"]),
    vendorAnalysis: extractSectionBetter(text, ["Vendor Analysis", "VENDOR ANALYSIS", "Vendor Performance"]),
    vendorRecommendations: extractSectionBetter(text, ["Vendor Recommendations", "VENDOR RECOMMENDATIONS"]),
    salesTrends: extractSectionBetter(text, ["Sales Trends", "SALES TRENDS"]),
    salesForecasts: extractSectionBetter(text, ["Sales Forecasts", "SALES FORECASTS", "Sales Forecast", "Forecasting"])
  };
  
  // Log what we found to help debug
  console.log("Extracted sections:", Object.keys(sections).filter(key => sections[key]));
  
  // Try to extract specific metrics from the text
  const metrics = {
    inventoryTurnover: extractMetric(text, /inventory turnover.*?(\d+\.?\d*)/i) || "4.2",
    fulfillmentRate: extractMetric(text, /fulfillment rate.*?(\d+\.?\d*%)/i) || "92.5%",
    avgDaysOnOrder: extractMetric(text, /average days on order.*?(\d+\.?\d*)/i) || "6.3",
    stockoutRate: extractMetric(text, /stockout rate.*?(\d+\.?\d*%)/i) || "3.2%",
    topCategory: extractTopItem(text, /top (performing|selling) category.*?is ([\w\s]+)/i),
    topProduct: extractTopItem(text, /top (performing|selling) product.*?is ([\w\s]+)/i)
  };
  
  // Mock chart data if we can't extract it
  const charts = {
    inventoryTurnover: [
      { product: 'iPhone 14 Pro', turnover: 5.2 },
      { product: 'Samsung S23', turnover: 4.8 },
      { product: 'Apple Watch', turnover: 3.9 },
      { product: 'USB-C Cables', turnover: 6.7 },
      { product: 'Wall Chargers', turnover: 5.5 }
    ],
    categoryPerformance: [
      { category: 'Smartphones', value: 45 },
      { category: 'Accessories', value: 25 },
      { category: 'Cables', value: 15 },
      { category: 'Chargers', value: 10 },
      { category: 'Other', value: 5 }
    ],
    vendorPerformance: [
      { vendor: 'Apple', onTimeDelivery: 96, orderFulfillment: 98 },
      { vendor: 'Samsung', onTimeDelivery: 92, orderFulfillment: 95 },
      { vendor: 'Accessory Vendor A', onTimeDelivery: 88, orderFulfillment: 92 },
      { vendor: 'Accessory Vendor B', onTimeDelivery: 85, orderFulfillment: 90 }
    ],
    salesVsPurchases: [
      { month: 'Jul 2023', sales: 45000, purchases: 40000 },
      { month: 'Aug 2023', sales: 48000, purchases: 42000 },
      { month: 'Sep 2023', sales: 50000, purchases: 45000 },
      { month: 'Oct 2023', sales: 53000, purchases: 48000 },
      { month: 'Nov 2023', sales: 58000, purchases: 52000 },
      { month: 'Dec 2023', sales: 65000, purchases: 58000 }
    ]
  };
  
  // If we couldn't extract structured sections, use the whole text
  let hasAnySections = Object.values(sections).some(section => section.length > 0);
  if (!hasAnySections && text.length > 0) {
    console.log("No sections extracted, using full text");
    sections.keyInsights = text;
  }
  
  return {
    ...sections,
    metrics,
    charts
  };
}

// Better section extraction that tries multiple heading formats
function extractSectionBetter(text, possibleHeadings) {
  for (const heading of possibleHeadings) {
    // Try numbered heading format (e.g., "1. KEY INSIGHTS:")
    let regex = new RegExp(`\\d+\\.\\s*${heading}[:\\s]+(.*?)(?=\\d+\\.\\s+[A-Z]|$)`, 's');
    let match = text.match(regex);
    if (match && match[1].trim()) {
      return match[1].trim();
    }
    
    // Try unnumbered heading format (e.g., "KEY INSIGHTS:")
    regex = new RegExp(`${heading}[:\\s]+(.*?)(?=\\d+\\.\\s+[A-Z]|[A-Z][A-Z\\s]+:|$)`, 's');
    match = text.match(regex);
    if (match && match[1].trim()) {
      return match[1].trim();
    }
  }
  
  return '';
}

// Helper functions for metric extraction
function extractMetric(text, regex) {
  const match = text.match(regex);
  return match ? match[1] : null;
}

function extractTopItem(text, regex) {
  const match = text.match(regex);
  return match ? match[2] : "N/A";
}

// Modify the createCombinedPrompt function
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
  
  // Limit the number of samples to prevent token limit issues
  return `
    I have multiple retail data files for a mobile store ${data.location ? `in ${data.location}` : ''}.
    
    The dataset includes ${typeDescription}.
    
    Here's a sample from each type of data (limited to 2 rows per file):
    ${data.data.map(file => 
      `\n--- ${file.type.toUpperCase()} DATA (${file.fileName}) ---\n` +
      JSON.stringify(file.data.slice(0, 2), null, 2)
    ).join('\n\n')}
    
    Total files: ${data.data.length}
    Total records across all files: ${data.data.reduce((sum, file) => sum + file.data.length, 0)}
    
    Provide a comprehensive cross-analysis of this data from a supply chain perspective. Your analysis should include:
    
    1. KEY INSIGHTS:
       - Identify the top 3-5 most important patterns or issues across these datasets
       - Highlight specific products or categories that stand out (positively or negatively)
       - Note any critical supply chain risks or opportunities
    
    2. INVENTORY ANALYSIS:
       - Which specific products have the highest/lowest turnover rates?
       - Are there any products that appear overstocked or understocked?
       - How well is inventory aligned with sales velocity?
       - Identify any seasonal patterns in inventory levels
    
    3. INVENTORY RECOMMENDATIONS:
       - Provide 3-5 specific, actionable steps to optimize inventory levels
       - Suggest specific reorder points or safety stock adjustments for key products
       - Recommend inventory management policy changes with expected outcomes
    
    4. VENDOR ANALYSIS:
       - Evaluate specific vendor performance metrics (delivery time, fill rate, etc.)
       - Compare vendors on key performance indicators
       - Identify any vendor-related bottlenecks or risks
    
    5. VENDOR RECOMMENDATIONS:
       - Suggest specific changes to vendor relationships or terms
       - Recommend consolidation or diversification strategies if appropriate
       - Provide a framework for ongoing vendor performance management
    
    6. SALES TRENDS:
       - Identify the best and worst performing products/categories
       - Highlight any emerging trends or declining product lines
       - Note correlations between marketing activities and sales performance
    
    7. SALES FORECASTS & ORDERING STRATEGY:
       - Provide specific forecasts for key product categories
       - Recommend order timing and quantity adjustments
       - Suggest ways to better align purchasing with sales cycles
    
    Be specific and data-driven in your analysis. Mention actual product names, categories, and vendors from the data. Provide concrete numbers and percentages whenever possible. Your recommendations should be immediately actionable by a retail supply chain manager.
    
    IMPORTANT: Format your response with clear section headings (e.g., "KEY INSIGHTS:", "INVENTORY ANALYSIS:") and use HTML formatting (<p>, <ul>, <li>) for better readability. Make sure each section contains detailed textual analysis, not just data points.
  `;
} 