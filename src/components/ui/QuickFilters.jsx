import React from 'react';
import { Button } from './button.jsx';

const QuickFilters = ({ setFilter }) => {
  return (
    <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
      <Button onClick={() => setFilter('all')} variant="outline">Todos</Button>
      <Button onClick={() => setFilter('income')} variant="outline">Ingresos</Button>
      <Button onClick={() => setFilter('expense')} variant="outline">Gastos</Button>
      <Button onClick={() => setFilter('thisMonth')} variant="outline">Este Mes</Button>
      <Button onClick={() => setFilter('lastMonth')} variant="outline">Mes Pasado</Button>
    </div>
  );
};

export default QuickFilters;