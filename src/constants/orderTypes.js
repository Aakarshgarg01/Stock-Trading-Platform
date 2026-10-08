export const ORDER_TYPES = {
  MARKET: 'MARKET',
  LIMIT: 'LIMIT',
};

export const ORDER_SIDES = {
  BUY: 'BUY',
  SELL: 'SELL',
};

export const PRODUCT_TYPES = {
  CNC: 'CNC', // Cash & Carry (Delivery for Equity)
  MIS: 'MIS', // Margin Intraday Square-off
};

export const ORDER_STATUS = {
  OPEN: 'OPEN',
  EXECUTED: 'EXECUTED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
};

export const TIMEFRAMES = [
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
  { label: '1M', value: '1M' },
  { label: '1Y', value: '1Y' },
];
