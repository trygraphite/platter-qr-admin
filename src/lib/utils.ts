import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFileUrl(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * Formats a number as Nigerian Naira currency
 * @param amount - The amount to format
 * @returns Formatted string with ₦ symbol and comma separators
 * @example
 * formatNaira(1234567.89) // "₦1,234,568"
 * formatNaira(1000) // "₦1,000"
 * formatNaira(0) // "₦0"
 */
export function formatNaira(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numAmount)) {
    return '₦0'
  }
  
  // Round to nearest whole number and convert to string
  const wholeNumber = Math.round(numAmount).toString()
  
  // Add comma separators every 3 digits from the right
  const formatted = wholeNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  
  return `₦${formatted}`
}