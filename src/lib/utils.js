import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatNumber = (number) => {
  if (typeof number !== 'number' || isNaN(number)) {
    return '0.00';
  }
  return number.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};