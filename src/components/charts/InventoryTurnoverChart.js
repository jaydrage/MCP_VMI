import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function InventoryTurnoverChart({ data }) {
  // If no data is provided, show placeholder data
  const chartData = data && data.length > 0 ? data : [
    { product: 'iPhone 14 Pro', turnover: 5.2 },
    { product: 'Samsung S23', turnover: 4.8 },
    { product: 'Apple Watch', turnover: 3.9 },
    { product: 'USB-C Cables', turnover: 6.7 },
    { product: 'Wall Chargers', turnover: 5.5 }
  ];
  
  const chartConfig = {
    labels: chartData.map(item => item.product),
    datasets: [
      {
        label: 'Inventory Turnover',
        data: chartData.map(item => item.turnover),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Inventory Turnover by Product',
      },
    },
  };
  
  return <Bar options={options} data={chartConfig} />;
}

export default InventoryTurnoverChart; 