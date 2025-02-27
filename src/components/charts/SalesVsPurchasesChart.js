import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function SalesVsPurchasesChart({ data }) {
  // If no data is provided, show placeholder data
  const chartData = data && data.length > 0 ? data : [
    { month: 'Jul 2023', sales: 42000, purchases: 38000 },
    { month: 'Aug 2023', sales: 45000, purchases: 40000 },
    { month: 'Sep 2023', sales: 48000, purchases: 42000 },
    { month: 'Oct 2023', sales: 51000, purchases: 45000 },
    { month: 'Nov 2023', sales: 55000, purchases: 48000 },
    { month: 'Dec 2023', sales: 60000, purchases: 52000 },
    { month: 'Jan 2024', sales: 48000, purchases: 45000 },
    { month: 'Feb 2024', sales: 50000, purchases: 46000 }
  ];
  
  const chartConfig = {
    labels: chartData.map(item => item.month),
    datasets: [
      {
        label: 'Sales ($)',
        data: chartData.map(item => item.sales),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Purchases ($)',
        data: chartData.map(item => item.purchases),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3,
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
        text: 'Sales vs Purchases Trend',
      },
    },
  };
  
  return <Line options={options} data={chartConfig} />;
}

export default SalesVsPurchasesChart; 