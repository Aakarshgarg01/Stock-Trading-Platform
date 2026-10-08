export const INITIAL_USER = {
  id: 'usr_99182',
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  phone: '+91 98765 43210',
  pan: 'ABCDE1234F',
  role: 'Trader (Pro)',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  createdAt: '2024-01-15T09:30:00Z',
  preferences: {
    orderConfirmations: true,
    riskAlerts: true,
    defaultProduct: 'CNC',
    theme: 'dark',
  }
};

export const INITIAL_WATCHLISTS = [
  {
    id: 'wl_nifty',
    name: 'NIFTY Giants',
    symbols: ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'TATAMOTORS', 'ITC', 'SBIN'],
  },
  {
    id: 'wl_tech',
    name: 'Tech & New-Age',
    symbols: ['INFY', 'TCS', 'WIPRO', 'ZOMATO', 'BHARTIARTL'],
  },
  {
    id: 'wl_auto_infra',
    name: 'Auto & Infra',
    symbols: ['TATAMOTORS', 'MARUTI', 'LT', 'ADANIENT', 'TATASTEEL'],
  }
];

export const INITIAL_HOLDINGS = [
  {
    symbol: 'RELIANCE',
    quantity: 15,
    avgPrice: 2820.00,
    ltp: 2954.80,
    prevClose: 2910.40,
  },
  {
    symbol: 'TCS',
    quantity: 10,
    avgPrice: 3950.00,
    ltp: 4210.50,
    prevClose: 4185.00,
  },
  {
    symbol: 'INFY',
    quantity: 40,
    avgPrice: 1720.00,
    ltp: 1895.40,
    prevClose: 1862.10,
  },
  {
    symbol: 'TATAMOTORS',
    quantity: 50,
    avgPrice: 890.00,
    ltp: 965.30,
    prevClose: 948.70,
  },
  {
    symbol: 'ZOMATO',
    quantity: 200,
    avgPrice: 190.00,
    ltp: 274.50,
    prevClose: 268.00,
  },
  {
    symbol: 'ITC',
    quantity: 80,
    avgPrice: 512.00,
    ltp: 504.60,
    prevClose: 509.20,
  }
];

export const INITIAL_POSITIONS = [
  {
    id: 'pos_01',
    symbol: 'HDFCBANK',
    product: 'MIS',
    side: 'BUY',
    quantity: 25,
    avgPrice: 1675.00,
    ltp: 1682.20,
    prevClose: 1695.50,
  },
  {
    id: 'pos_02',
    symbol: 'ICICIBANK',
    product: 'MIS',
    side: 'BUY',
    quantity: 30,
    avgPrice: 1240.00,
    ltp: 1248.90,
    prevClose: 1235.00,
  },
  {
    id: 'pos_03',
    symbol: 'SBIN',
    product: 'MIS',
    side: 'SELL',
    quantity: 40,
    avgPrice: 798.00,
    ltp: 792.10,
    prevClose: 785.40,
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ord_101',
    symbol: 'RELIANCE',
    side: 'BUY',
    orderType: 'LIMIT',
    product: 'CNC',
    quantity: 5,
    price: 2920.00,
    status: 'OPEN',
    placedAt: new Date(Date.now() - 3600000).toISOString(),
    executedPrice: null,
  },
  {
    id: 'ord_102',
    symbol: 'BAJFINANCE',
    side: 'BUY',
    orderType: 'LIMIT',
    product: 'CNC',
    quantity: 2,
    price: 7050.00,
    status: 'OPEN',
    placedAt: new Date(Date.now() - 7200000).toISOString(),
    executedPrice: null,
  },
  {
    id: 'ord_103',
    symbol: 'INFY',
    side: 'BUY',
    orderType: 'MARKET',
    product: 'CNC',
    quantity: 10,
    price: 1880.00,
    status: 'EXECUTED',
    placedAt: new Date(Date.now() - 14400000).toISOString(),
    executedPrice: 1880.00,
  },
  {
    id: 'ord_104',
    symbol: 'TATAMOTORS',
    side: 'BUY',
    orderType: 'MARKET',
    product: 'CNC',
    quantity: 20,
    price: 955.00,
    status: 'EXECUTED',
    placedAt: new Date(Date.now() - 28800000).toISOString(),
    executedPrice: 955.00,
  },
  {
    id: 'ord_105',
    symbol: 'TCS',
    side: 'BUY',
    orderType: 'LIMIT',
    product: 'CNC',
    quantity: 4,
    price: 4100.00,
    status: 'CANCELLED',
    placedAt: new Date(Date.now() - 43200000).toISOString(),
    executedPrice: null,
  }
];

export const INITIAL_FUNDS = {
  availableBalance: 125480.50,
  usedMargin: 38250.00,
  totalBalance: 163730.50,
  transactions: [
    {
      id: 'tx_301',
      type: 'DEPOSIT',
      amount: 50000,
      mode: 'UPI (GPay)',
      status: 'SUCCESS',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      referenceId: 'UPI-9821038472',
    },
    {
      id: 'tx_302',
      type: 'WITHDRAWAL',
      amount: 15000,
      mode: 'IMPS (HDFC Bank)',
      status: 'SUCCESS',
      timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
      referenceId: 'WTH-48201948',
    },
    {
      id: 'tx_303',
      type: 'DEPOSIT',
      amount: 100000,
      mode: 'Net Banking (SBI)',
      status: 'SUCCESS',
      timestamp: new Date(Date.now() - 86400000 * 12).toISOString(),
      referenceId: 'NET-10928374',
    }
  ]
};
