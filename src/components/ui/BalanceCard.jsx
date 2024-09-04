import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./card.jsx";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

const BalanceCard = ({ balance }) => {
  const isPositive = balance >= 0;
  return (
    <Card className="shadow-lg bg-white dark:bg-gray-800 mb-6 overflow-hidden">
      <CardHeader className={`${isPositive ? 'bg-green-500' : 'bg-red-500'} text-white`}>
      <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
  <DollarSign className="mr-2 h-6 w-6 text-blue-500" aria-hidden="true" />
  <span>Balance Actual</span>
</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center">
          <span className={`text-4xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            ${Math.abs(balance).toFixed(2)}
          </span>
          {isPositive ? (
            <TrendingUp className="ml-2 h-6 w-6 text-green-500" />
          ) : (
            <TrendingDown className="ml-2 h-6 w-6 text-red-500" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;