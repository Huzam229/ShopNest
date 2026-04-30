import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const sizeData = [
  { label: 'S', value: 'S', },
  { label: 'M', value: 'M' },
  { label: 'L', value: 'L' },
  { label: 'XL', value: 'Xl' },
  { label: '2XL', value: '2XL' },
  { label: '3XL', value: '3XL' }
]
