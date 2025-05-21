/**
 * Format a number as Vietnamese currency (VND)
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calculate percentage capped at 100%
 * @param current - The current value
 * @param target - The target value
 * @returns Percentage as a number (0-100)
 */
export const calculatePercentage = (current: number, target: number): number => {
  return Math.min(Math.round((current / target) * 100), 100);
}; 