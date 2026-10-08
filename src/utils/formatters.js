/**
 * Indian Rupee (INR) and Financial Number Formatting Utilities
 */

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const inrCompactFormatter = new Intl.NumberFormat('en-IN', {
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 2,
});

/**
 * Format a number as Indian Currency (e.g., ₹1,45,230.50)
 * @param {number|string} amount 
 * @param {boolean} showSign Whether to explicitly show '+' for positive numbers
 * @returns {string}
 */
export function formatINR(amount, showSign = false) {
  const num = Number(amount) || 0;
  const formatted = inrFormatter.format(num);
  if (showSign && num > 0) {
    return `+${formatted}`;
  }
  return formatted;
}

/**
 * Format a number according to the Indian numbering system without currency symbol
 * @param {number|string} amount 
 * @param {number} decimals 
 * @returns {string}
 */
export function formatNumber(amount, decimals = 2) {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format percentage with explicit +/- sign
 * @param {number|string} percent 
 * @returns {string}
 */
export function formatPercent(percent) {
  const num = Number(percent) || 0;
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

/**
 * Format large values compactly (e.g., ₹4.5 Cr, ₹12.3 L)
 * @param {number|string} amount 
 * @returns {string}
 */
export function formatCompactINR(amount) {
  const num = Math.abs(Number(amount) || 0);
  const sign = Number(amount) < 0 ? '-' : '';

  if (num >= 1e7) {
    return `${sign}₹${(num / 1e7).toFixed(2)} Cr`;
  }
  if (num >= 1e5) {
    return `${sign}₹${(num / 1e5).toFixed(2)} L`;
  }
  if (num >= 1e3) {
    return `${sign}₹${(num / 1e3).toFixed(2)} K`;
  }
  return `${sign}₹${num.toFixed(2)}`;
}

/**
 * Format timestamp or ISO string to standard date/time
 * @param {string|number|Date} date 
 * @returns {string}
 */
export function formatDateTime(date) {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

/**
 * Format date only
 * @param {string|number|Date} date 
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format time only (e.g. 09:15:23 AM)
 * @param {string|number|Date} date 
 * @returns {string}
 */
export function formatTime(date) {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

/**
 * Get Tailwind CSS color class based on profit/loss value
 * @param {number|string} val 
 * @returns {string}
 */
export function getPnLColorClass(val) {
  const num = Number(val) || 0;
  if (num > 0) return 'text-emerald-500 dark:text-emerald-400';
  if (num < 0) return 'text-rose-500 dark:text-rose-400';
  return 'text-slate-500 dark:text-slate-400';
}

/**
 * Get Tailwind CSS background color class for badges
 * @param {number|string} val 
 * @returns {string}
 */
export function getPnLBadgeClass(val) {
  const num = Number(val) || 0;
  if (num > 0) return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
  if (num < 0) return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
  return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
}
