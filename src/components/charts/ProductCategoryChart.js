import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

function ProductCategoryChart({ data }) {
  // If no data is provided, show placeholder data
  const chartData = data && data.length > 0 ? data : [
    { category: 'Smartphones', value: 45 },
    { category: 'Accessories', value: 25 },
    { category: 'Cables', value: 15 },
    { category: 'Chargers', value: 10 },
    { category: 'Other', value: 5 }
  ];
  
  const chartConfig = {
    labels: chartData.map(item => item.category),
    datasets: [
      {
        label: 'Category Distribution',
        data: chartData.map(item => item.value),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Product Category Distribution',
      },
    },
  };
  
  return <Pie options={options} data={chartConfig} />;
}

export default ProductCategoryChart; 