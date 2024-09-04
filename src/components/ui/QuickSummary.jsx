import React from 'react';
import { Card, CardContent } from "./card.jsx";
import { TrendingUp, TrendingDown } from "lucide-react";

const QuickSummary = ({ totalIncome, totalExpenses }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card className="bg-green-100 dark:bg-green-800">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-medium text-green-800 dark:text-green-100">Total Ingresos</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-50">${totalIncome.toFixed(2)}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-green-500" />
        </CardContent>
      </Card>
      <Card className="bg-red-100 dark:bg-red-800">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-100">Total Gastos</p>
            <p className="text-2xl font-bold text-red-900 dark:text-red-50">${totalExpenses.toFixed(2)}</p>
          </div>
          <TrendingDown className="h-8 w-8 text-red-500" />
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickSummary;