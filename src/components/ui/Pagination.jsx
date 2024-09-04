import React from 'react';
import { Button } from './button.jsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ transactionsPerPage, totalTransactions, paginate, currentPage }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center items-center mt-4 space-x-2">
      <Button
        onClick={() => paginate(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-2 py-1"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <ul className="flex space-x-2">
        {pageNumbers.map(number => (
          <li key={number}>
            <Button
              onClick={() => paginate(number)}
              className={`px-3 py-1 ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {number}
            </Button>
          </li>
        ))}
      </ul>
      <Button
        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-2 py-1"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};

export default Pagination;