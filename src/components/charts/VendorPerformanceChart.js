import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function VendorPerformanceChart({ data }) {
  // If no data is provided, show placeholder data
  const chartData = data && data.length > 0 ? data : [
    { vendor: 'Generic Vendor 1', onTimeDelivery: 95, orderFulfillment: 98 },
    { vendor: 'Generic Vendor 2', onTimeDelivery: 87, orderFulfillment: 92 },
    { vendor: 'Generic Vendor 3', onTimeDelivery: 92, orderFulfillment: 95 },
    { vendor: 'Carrier Name', onTimeDelivery: 89, orderFulfillment: 90 }
  ];
  
  const chartConfig = {
    labels: chartData.map(item => item.vendor),
    datasets: [
      {
        label: 'On-Time Delivery (%)',
        data: chartData.map(item => item.onTimeDelivery),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Order Fulfillment (%)',
        data: chartData.map(item => item.orderFulfillment),
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
        text: 'Vendor Performance Metrics',
      },
    },
    scales: {
      y: {
        min: 80,
        max: 100,
      },
    },
  };
  
  return <Bar options={options} data={chartConfig} />;
}

export default VendorPerformanceChart; 