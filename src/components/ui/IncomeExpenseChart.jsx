import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const IncomeExpenseChart = ({ transactions }) => {
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { income: 0, expense: 0 };
    }
    
    if (transaction.amount > 0) {
      acc[monthYear].income += transaction.amount;
    } else {
      acc[monthYear].expense += Math.abs(transaction.amount);
    }
    
    return acc;
  }, {});

  const labels = Object.keys(monthlyData).sort((a, b) => {
    const [monthA, yearA] = a.split('/');
    const [monthB, yearB] = b.split('/');
    return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Ingresos',
        data: labels.map(label => monthlyData[label].income),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Gastos',
        data: labels.map(label => monthlyData[label].expense),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
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
        text: 'Ingresos y Gastos Mensuales',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar options={options} data={data} />;
};

export default IncomeExpenseChart;