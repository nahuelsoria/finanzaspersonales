import React from 'react';
import { Card, CardContent } from "./card";
import { DollarSign } from "lucide-react";
import { formatNumber } from "../../lib/utils";

const BalanceCard = ({ balance }) => {
  const isPositive = balance >= 0;
  const backgroundColor = isPositive ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900";
  const textColor = isPositive ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300";
  
  return (
    <Card className={`${backgroundColor} shadow-lg mb-6 transition-all duration-300 hover:shadow-xl`}>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Balance Actual</p>
          <p className={`text-4xl font-bold ${textColor}`}>
            {isPositive ? "+" : "-"}${formatNumber(Math.abs(balance))}
          </p>
        </div>
        <div className={`${textColor} bg-white dark:bg-gray-800 p-3 rounded-full`}>
          <DollarSign className="h-12 w-12" />
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;