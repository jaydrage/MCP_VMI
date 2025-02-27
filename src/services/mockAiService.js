// Mock data for development
export async function analyzeRetailData(data) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock analysis based on data type
  if (data.type === 'combined') {
    return getMockCombinedAnalysis(data);
  } else if (data.type === 'purchase_orders') {
    return getMockPurchaseOrderAnalysis(data);
  } else if (data.type === 'sales_data') {
    return getMockSalesAnalysis(data);
  } else if (data.type === 'inventory') {
    return getMockInventoryAnalysis(data);
  } else {
    return getMockGeneralAnalysis(data);
  }
}

function getMockPurchaseOrderAnalysis(data) {
  return {
    keyInsights: `<p>Based on the purchase order data for ${data.location || 'your stores'}, I've identified several key insights:</p>
      <ul>
        <li>Your average order fulfillment rate is 92.5%, which is good but has room for improvement</li>
        <li>Mobile accessories have the fastest order cycle time at 5.2 days</li>
        <li>Smartphones have the longest lead times, averaging 8.3 days</li>
        <li>Generic Vendor 1 has the best on-time delivery performance</li>
        <li>There are several outstanding orders that require follow-up</li>
      </ul>`,
    inventoryAnalysis: `<p>The purchase order data reveals important inventory patterns:</p>
      <ul>
        <li>iPhone and Samsung products represent 65% of your inventory investment</li>
        <li>Accessories like cables and chargers have higher turnover rates</li>
        <li>Several high-value items have extended outstanding order times</li>
        <li>Current inventory mix is weighted heavily toward premium smartphones</li>
      </ul>`,
    inventoryRecommendations: `<p>Based on the analysis, I recommend:</p>
      <ul>
        <li>Implement a vendor scorecard system to track and improve delivery performance</li>
        <li>Establish automated reorder points for fast-moving accessories</li>
        <li>Review and potentially consolidate your vendor base for better terms</li>
        <li>Set up weekly order status reviews for items with extended lead times</li>
        <li>Consider safety stock adjustments for high-demand smartphone models</li>
      </ul>`,
    vendorAnalysis: `<p>Vendor performance analysis shows:</p>
      <ul>
        <li>Generic Vendor 1 has the best overall performance with 95% on-time delivery</li>
        <li>Carrier Name has the most delayed orders, particularly for iPhone models</li>
        <li>Generic Vendor 2 provides the best cost value for accessories</li>
        <li>Order fulfillment rates vary significantly between vendors</li>
      </ul>`,
    vendorRecommendations: `<p>To optimize vendor relationships:</p>
      <ul>
        <li>Consolidate accessory purchases with Generic Vendor 1 for better terms</li>
        <li>Establish performance improvement plans with underperforming vendors</li>
        <li>Negotiate better terms with high-volume vendors</li>
        <li>Implement a vendor rating system to track improvements over time</li>
      </ul>`,
    salesTrends: `<p>While this is purchase order data, we can infer some sales patterns:</p>
      <ul>
        <li>Premium smartphones represent the highest value orders</li>
        <li>Accessories show consistent ordering patterns suggesting steady sales</li>
        <li>Seasonal variations are evident in ordering patterns</li>
      </ul>`,
    salesForecasts: `<p>Based on ordering patterns, we can forecast:</p>
      <ul>
        <li>Continued strong demand for iPhone and Samsung flagship models</li>
        <li>Growing demand for USB-C accessories as more devices adopt this standard</li>
        <li>Potential supply constraints for new model releases</li>
        <li>Steady accessory sales with potential for growth through bundling strategies</li>
      </ul>`,
    metrics: {
      inventoryTurnover: "4.2",
      fulfillmentRate: "92.5",
      avgDaysOnOrder: "6.3"
    },
    charts: {
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
        { vendor: 'Generic Vendor 1', onTimeDelivery: 95, orderFulfillment: 98 },
        { vendor: 'Generic Vendor 2', onTimeDelivery: 87, orderFulfillment: 92 },
        { vendor: 'Generic Vendor 3', onTimeDelivery: 92, orderFulfillment: 95 },
        { vendor: 'Carrier Name', onTimeDelivery: 89, orderFulfillment: 90 }
      ],
      salesVsPurchases: [
        { month: 'Jul 2023', sales: 42000, purchases: 38000 },
        { month: 'Aug 2023', sales: 45000, purchases: 40000 },
        { month: 'Sep 2023', sales: 48000, purchases: 42000 },
        { month: 'Oct 2023', sales: 51000, purchases: 45000 },
        { month: 'Nov 2023', sales: 55000, purchases: 48000 },
        { month: 'Dec 2023', sales: 60000, purchases: 52000 },
        { month: 'Jan 2024', sales: 48000, purchases: 45000 },
        { month: 'Feb 2024', sales: 50000, purchases: 46000 }
      ]
    }
  };
}

function getMockSalesAnalysis(data) {
  return {
    keyInsights: `<p>Based on the sales data for ${data.location || 'your stores'}, I've identified several key insights:</p>
      <ul>
        <li>Your overall gross profit margin is approximately 38%, which is strong for mobile retail</li>
        <li>Smartphone sales account for 62% of revenue but only 48% of profit</li>
        <li>Accessories have a higher profit margin at 52% compared to 28% for smartphones</li>
        <li>Sales show a clear seasonal pattern with peaks in December and dips in January</li>
        <li>The ${data.location || 'store'} is performing at 108% of target for the analyzed period</li>
      </ul>`,
    inventoryAnalysis: `<p>The sales data reveals important inventory implications:</p>
      <ul>
        <li>Fast-moving items include iPhone chargers, USB-C cables, and screen protectors</li>
        <li>Several high-margin accessories show consistent sales patterns</li>
        <li>Premium smartphones (iPhone Pro models, Samsung S-series) drive significant revenue</li>
        <li>Some mid-range models show lower than expected turnover</li>
      </ul>`,
    inventoryRecommendations: `<p>Based on sales patterns, I recommend:</p>
      <ul>
        <li>Increase stock levels of high-margin accessories by 15-20%</li>
        <li>Implement bundling strategies for smartphones with compatible accessories</li>
        <li>Review inventory levels of mid-range models to prevent overstocking</li>
        <li>Set up automated reorder points based on 30-day sales velocity</li>
        <li>Consider seasonal adjustments to inventory levels, especially for gift-oriented items</li>
      </ul>`,
    vendorAnalysis: `<p>Sales data indicates the following about your product mix:</p>
      <ul>
        <li>Apple products represent 45% of sales and 42% of profit</li>
        <li>Samsung products account for 30% of sales and 28% of profit</li>
        <li>Generic accessories provide 18% of sales but 25% of profit</li>
        <li>Other brands make up the remaining 7% of sales and 5% of profit</li>
      </ul>`,
    vendorRecommendations: `<p>To optimize your product mix:</p>
      <ul>
        <li>Expand your high-margin accessory selection from Generic Vendor 1</li>
        <li>Negotiate better terms with Apple and Samsung based on sales volume</li>
        <li>Consider reducing orders for lower-performing brands</li>
        <li>Explore exclusive partnerships with accessory manufacturers</li>
      </ul>`,
    salesTrends: `<p>Key sales trends identified:</p>
      <ul>
        <li>Month-over-month growth of 3.2% on average</li>
        <li>Accessory attachment rate of 2.3 items per smartphone sale</li>
        <li>Weekend sales are 35% higher than weekday sales</li>
        <li>Premium models (>$800) show stronger growth than mid-range models</li>
        <li>USB-C accessories show accelerating growth as more devices adopt this standard</li>
      </ul>`,
    salesForecasts: `<p>Based on current trends, we forecast:</p>
      <ul>
        <li>Continued strong performance in premium smartphone segment</li>
        <li>5-7% growth in accessory sales over the next quarter</li>
        <li>Seasonal spike of approximately 40% for the holiday season</li>
        <li>Increasing demand for wireless charging solutions</li>
        <li>Potential for 10-15% growth in service-related revenue (repairs, installations)</li>
      </ul>`,
    metrics: {
      inventoryTurnover: "5.8",
      profitMargin: "38%",
      attachmentRate: "2.3"
    },
    charts: {
      inventoryTurnover: [
        { product: 'iPhone 14 Pro', turnover: 5.2 },
        { product: 'Samsung S23', turnover: 4.8 },
        { product: 'Apple Watch', turnover: 3.9 },
        { product: 'USB-C Cables', turnover: 6.7 },
        { product: 'Wall Chargers', turnover: 5.5 }
      ],
      categoryPerformance: [
        { category: 'Smartphones', value: 62 },
        { category: 'Accessories', value: 18 },
        { category: 'Cables', value: 8 },
        { category: 'Chargers', value: 7 },
        { category: 'Other', value: 5 }
      ],
      vendorPerformance: [
        { vendor: 'Apple', onTimeDelivery: 95, orderFulfillment: 98 },
        { vendor: 'Samsung', onTimeDelivery: 87, orderFulfillment: 92 },
        { vendor: 'Generic Vendor 1', onTimeDelivery: 92, orderFulfillment: 95 },
        { vendor: 'Other Brands', onTimeDelivery: 89, orderFulfillment: 90 }
      ],
      salesVsPurchases: [
        { month: 'Jul 2023', sales: 42000, purchases: 38000 },
        { month: 'Aug 2023', sales: 45000, purchases: 40000 },
        { month: 'Sep 2023', sales: 48000, purchases: 42000 },
        { month: 'Oct 2023', sales: 51000, purchases: 45000 },
        { month: 'Nov 2023', sales: 55000, purchases: 48000 },
        { month: 'Dec 2023', sales: 60000, purchases: 52000 },
        { month: 'Jan 2024', sales: 48000, purchases: 45000 },
        { month: 'Feb 2024', sales: 50000, purchases: 46000 }
      ]
    }
  };
}

function getMockGeneralAnalysis(data) {
  return {
    keyInsights: `<p>Based on the data for ${data.location || 'your stores'}, I've identified several key insights:</p>
      <ul>
        <li>The data shows patterns typical of mobile retail operations</li>
        <li>Several opportunities for optimization are evident</li>
        <li>Performance metrics are within industry standards</li>
        <li>There are specific areas where improvements could yield significant results</li>
      </ul>`,
    inventoryAnalysis: `<p>The data reveals important inventory patterns:</p>
      <ul>
        <li>Inventory mix appears to be weighted toward high-value items</li>
        <li>Turnover rates vary significantly across product categories</li>
        <li>Some potential for optimization in inventory management</li>
      </ul>`,
    inventoryRecommendations: `<p>Based on the analysis, I recommend:</p>
      <ul>
        <li>Review inventory levels across all product categories</li>
        <li>Implement data-driven reorder points</li>
        <li>Consider adjustments to product mix based on performance</li>
        <li>Evaluate vendor relationships for potential improvements</li>
      </ul>`,
    vendorAnalysis: `<p>Vendor analysis shows:</p>
      <ul>
        <li>Multiple vendors supplying similar product categories</li>
        <li>Varying performance metrics across vendor relationships</li>
        <li>Opportunities for consolidation and optimization</li>
      </ul>`,
    vendorRecommendations: `<p>To optimize vendor relationships:</p>
      <ul>
        <li>Evaluate vendor performance systematically</li>
        <li>Consider consolidating purchases where appropriate</li>
        <li>Negotiate improved terms based on volume</li>
        <li>Implement vendor scorecards to track performance</li>
      </ul>`,
    salesTrends: `<p>General sales patterns indicate:</p>
      <ul>
        <li>Typical seasonal variations in the mobile retail sector</li>
        <li>Product category performance aligns with industry trends</li>
        <li>Potential for growth in specific segments</li>
      </ul>`,
    salesForecasts: `<p>Based on the data, we can forecast:</p>
      <ul>
        <li>Continued alignment with industry growth patterns</li>
        <li>Opportunities for targeted expansion in high-performing categories</li>
        <li>Potential challenges in maintaining growth in competitive segments</li>
        <li>Need for strategic adjustments to maximize performance</li>
      </ul>`,
    metrics: {
      inventoryTurnover: "4.5",
      fulfillmentRate: "90%",
      avgDaysOnOrder: "7.2"
    },
    charts: {
      inventoryTurnover: [
        { product: 'Category A', turnover: 5.0 },
        { product: 'Category B', turnover: 4.5 },
        { product: 'Category C', turnover: 4.0 },
        { product: 'Category D', turnover: 5.5 },
        { product: 'Category E', turnover: 3.5 }
      ],
      categoryPerformance: [
        { category: 'Category A', value: 40 },
        { category: 'Category B', value: 25 },
        { category: 'Category C', value: 15 },
        { category: 'Category D', value: 12 },
        { category: 'Category E', value: 8 }
      ],
      vendorPerformance: [
        { vendor: 'Vendor A', onTimeDelivery: 92, orderFulfillment: 95 },
        { vendor: 'Vendor B', onTimeDelivery: 88, orderFulfillment: 90 },
        { vendor: 'Vendor C', onTimeDelivery: 90, orderFulfillment: 93 },
        { vendor: 'Vendor D', onTimeDelivery: 85, orderFulfillment: 88 }
      ],
      salesVsPurchases: [
        { month: 'Jul 2023', sales: 40000, purchases: 36000 },
        { month: 'Aug 2023', sales: 42000, purchases: 38000 },
        { month: 'Sep 2023', sales: 45000, purchases: 40000 },
        { month: 'Oct 2023', sales: 48000, purchases: 43000 },
        { month: 'Nov 2023', sales: 52000, purchases: 46000 },
        { month: 'Dec 2023', sales: 58000, purchases: 50000 },
        { month: 'Jan 2024', sales: 46000, purchases: 42000 },
        { month: 'Feb 2024', sales: 48000, purchases: 44000 }
      ]
    }
  };
}

function getMockCombinedAnalysis(data) {
  const fileTypes = data.data.map(file => file.type);
  const hasPurchaseOrders = fileTypes.includes('purchase_orders');
  const hasSalesData = fileTypes.includes('sales_data');
  const hasInventory = fileTypes.includes('inventory');
  
  return {
    keyInsights: `<p>Based on the combined analysis of ${data.data.length} files for ${data.location || 'your stores'}, I've identified several key insights:</p>
      <ul>
        <li>Your data includes ${hasPurchaseOrders ? 'purchase orders, ' : ''}${hasSalesData ? 'sales data, ' : ''}${hasInventory ? 'inventory data' : ''}</li>
        <li>Cross-referencing these datasets reveals important supply chain patterns</li>
        <li>Your overall inventory management shows ${hasPurchaseOrders && hasSalesData ? 'good alignment between purchasing and sales' : 'some opportunities for optimization'}</li>
        <li>There are several actionable insights that can improve your operations</li>
        <li>The combined data provides a more comprehensive view of your retail operations</li>
      </ul>`,
    inventoryAnalysis: `<p>The combined data reveals important inventory patterns:</p>
      <ul>
        <li>Premium smartphones represent a significant portion of your inventory investment</li>
        <li>Accessories have higher turnover rates compared to devices</li>
        <li>${hasPurchaseOrders ? 'Purchase order data shows some delays in fulfillment for key products' : 'Inventory levels for some key products could be optimized'}</li>
        <li>${hasSalesData ? 'Sales data indicates strong demand for certain accessories that could be stocked more aggressively' : 'Product mix appears to be generally appropriate for your market'}</li>
      </ul>`,
    inventoryRecommendations: `<p>Based on the comprehensive analysis, I recommend:</p>
      <ul>
        <li>Implement a more dynamic reordering system for fast-moving accessories</li>
        <li>Review safety stock levels for premium smartphones to ensure availability</li>
        <li>Consider consolidating orders to improve vendor terms</li>
        <li>${hasPurchaseOrders && hasSalesData ? 'Align purchase order timing more closely with sales cycles' : 'Establish clearer inventory management protocols'}</li>
        <li>Set up regular cross-functional reviews of inventory performance</li>
      </ul>`,
    vendorAnalysis: `<p>Vendor analysis across your data shows:</p>
      <ul>
        <li>Major suppliers (Apple, Samsung) represent approximately 75% of your inventory value</li>
        <li>Accessory vendors show varying levels of performance</li>
        <li>${hasPurchaseOrders ? 'Some vendors consistently deliver late, affecting inventory availability' : 'Vendor mix appears appropriate but could be optimized'}</li>
        <li>There are opportunities to consolidate some purchases for better terms</li>
      </ul>`,
    vendorRecommendations: `<p>To optimize vendor relationships:</p>
      <ul>
        <li>Implement a formal vendor scorecard system</li>
        <li>Consolidate orders where possible to improve terms</li>
        <li>Establish clearer delivery expectations with key suppliers</li>
        <li>Consider alternative sources for consistently problematic vendors</li>
        <li>${hasPurchaseOrders && hasSalesData ? 'Negotiate terms based on combined purchase volume and sales performance' : 'Review vendor agreements for potential improvements'}</li>
      </ul>`,
    salesTrends: `<p>Sales patterns across your data indicate:</p>
      <ul>
        <li>${hasSalesData ? 'Clear seasonal patterns with peaks during holiday periods' : 'Typical retail patterns for mobile device sales'}</li>
        <li>Accessories show more consistent sales compared to devices</li>
        <li>Premium devices drive significant revenue but have longer sales cycles</li>
        <li>Attachment rates for accessories could be improved</li>
      </ul>`,
    salesForecasts: `<p>Based on the combined data analysis, we forecast:</p>
      <ul>
        <li>Continued strong performance in the premium smartphone segment</li>
        <li>Growth opportunities in high-margin accessories</li>
        <li>Potential for improved performance through better inventory management</li>
        <li>Seasonal variations will continue to impact cash flow and inventory needs</li>
        <li>${hasSalesData && hasPurchaseOrders ? 'More precise alignment of purchasing with sales cycles could improve overall performance' : 'Better data integration could improve forecasting accuracy'}</li>
      </ul>`,
    metrics: {
      inventoryTurnover: "4.8",
      fulfillmentRate: "94%",
      avgDaysOnOrder: "5.8"
    },
    charts: {
      inventoryTurnover: [
        { product: 'Premium Smartphones', turnover: 5.2 },
        { product: 'Mid-range Phones', turnover: 4.5 },
        { product: 'Chargers', turnover: 6.8 },
        { product: 'Cases', turnover: 5.9 },
        { product: 'Screen Protectors', turnover: 7.2 }
      ],
      categoryPerformance: [
        { category: 'Smartphones', value: 48 },
        { category: 'Tablets', value: 12 },
        { category: 'Accessories', value: 28 },
        { category: 'Wearables', value: 8 },
        { category: 'Other', value: 4 }
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
        { month: 'Dec 2023', sales: 65000, purchases: 58000 },
        { month: 'Jan 2024', sales: 50000, purchases: 46000 },
        { month: 'Feb 2024', sales: 52000, purchases: 48000 }
      ]
    }
  };
} 