import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./card.jsx";
import { DollarSign } from "lucide-react";

const BalanceCard = ({ balance }) => {
  return (
    <Card className="shadow-lg bg-white dark:bg-gray-800 mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
          <DollarSign className="mr-2 h-6 w-6" />
          Balance Actual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <span className={`text-3xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${balance.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;