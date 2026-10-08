# ApexTrader - Indian Stock Trading Platform (Frontend)

ApexTrader is a production-grade, institutional-inspired stock trading frontend built with **React 18, Vite, Tailwind CSS, Zustand, and TradingView Lightweight Charts**. It delivers an ultra-smooth, sub-millisecond trading experience for Indian markets (NSE & BSE) with real-time price streaming, tick flash animations, interactive candlestick charting, portfolio analytics, and complete order management.

Designed to work out-of-the-box with a high-fidelity **Mock Data & Real-Time Price Simulator**, it is architected with a unified API layer that switches to a Node.js/Express backend by toggling a single environment variable (`VITE_USE_MOCK=false`).

---

## 🚀 Key Features

1. **Authentication & Session Management**
   - Login, Signup, and Forgot Password pages with **React Hook Form + Zod** schema validation.
   - Indian PAN card format (`ABCDE1234F`) and 10-digit mobile number validation.
   - Demo credentials 1-click autofill banner for instant testing.
   - Centralized Axios instance with automatic JWT Bearer token attachment and 401 token expiry auto-logout.

2. **Market Overview & Indices Strip**
   - Live ticker strip featuring **NIFTY 50**, **SENSEX**, **BANK NIFTY**, and **NIFTY IT** with live points, percentage changes, and tick direction indicators.
   - Real-time tick simulation with micro-volatility and random walk model.

3. **Dashboard**
   - High-level Demat portfolio valuation: Total Portfolio Value, Day's P&L, Overall P&L (ROI %), and Available Cash.
   - Holdings summary table with real-time mark-to-market valuations.
   - Active intraday positions widget.
   - Top Gainers and Top Losers across NSE blue-chip stocks.

4. **Multi-Watchlist Terminal**
   - Multi-watchlist support (e.g. *NIFTY Giants*, *Tech & New-Age*, *Auto & Infra*) plus custom watchlist creation.
   - **Color-coded tick flashing**: Background lights up green on upward tick and red on downward tick.
   - Quick **Buy (B)** and **Sell (S)** execution buttons directly on watchlist items.
   - Global stock search modal with debounced query suggestions and keyboard navigation (`↑`, `↓`, `Enter`, `Esc`, `Ctrl+K`).

5. **Interactive Stock Detail & Advanced Charts (`/stock/:symbol`)**
   - Integrated **TradingView Lightweight Charts** with real-time candlestick rendering, volume histogram, and area line chart mode.
   - Multi-timeframe switching: **1D** (5m intraday), **1W** (1h), **1M** (daily), **1Y** (weekly).
   - Market depth and session statistics: Open, High, Low, Volume, 52-Week High/Low, Market Capitalization, P/E Ratio.
   - Direct Buy/Sell order panels.

6. **Order Placement & Management**
   - Buy/Sell modal with toggle for Market vs. Limit orders, Regular Delivery (**CNC**) vs. Intraday 5x Margin (**MIS**).
   - Dynamic margin requirement check against available trading cash.
   - Two-step execution: Form entry followed by order confirmation review.
   - Dedicated **Order Book** (`/orders`) with tabs for *Open*, *Executed*, and *Cancelled* orders.
   - Modify open order price/quantity or cancel open orders with confirmation.

7. **Holdings & Positions**
   - **Holdings (`/holdings`)**: Delivery equity assets with Invested amount, Current value, P&L, and Day change. Sortable columns and quick "Add" or "Exit" buttons.
   - **Positions (`/positions`)**: Intraday contracts with real-time unrealized P&L and 1-click **Square Off** (counter-order execution).

8. **Funds & Margin Management (`/funds`)**
   - Available trading collateral, used margin, and total ledger cash.
   - Add Funds modal supporting UPI and Net Banking with quick preset chips (`+₹10,000`, `+₹25,000`, etc.).
   - Withdraw Funds modal with bank account validation.
   - Complete transaction history ledger with reference IDs and timestamps.

9. **Settings & Themes (`/settings`)**
   - User profile details and Demat UCC code.
   - Dark mode (default) and Light mode toggle.
   - Order confirmation dialog preferences and default product choice.
   - Sandbox Reset button to restore default demo holdings and balance.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + Vite |
| **Language** | JavaScript (ESNext, JSX) |
| **Routing** | React Router DOM v6 (Lazy loading & code splitting) |
| **Styling** | Tailwind CSS with custom trading color palette & animations |
| **State Management** | Zustand |
| **HTTP Client** | Centralized Axios instance with request/response interceptors |
| **Charts** | TradingView Lightweight Charts |
| **Real-Time Data** | Socket.IO Client + Built-in Mock Price Simulator |
| **Forms & Validation** | React Hook Form + Zod + `@hookform/resolvers` |
| **Notifications** | React Hot Toast |
| **Icons** | Lucide React |

---

## 📂 Folder Tree

```
Stock Trading Platform/
├── public/
│   ├── favicon.svg
│   └── logo.svg
├── src/
│   ├── api/
│   │   ├── axiosInstance.js     # Centralized Axios with JWT & 401 interceptor
│   │   ├── auth.api.js          # Login, signup, logout, me, forgot password
│   │   ├── stocks.api.js        # Search, details, and candlestick history
│   │   ├── watchlist.api.js     # Get, add, remove, and create watchlists
│   │   ├── orders.api.js        # Get, place, modify, and cancel orders
│   │   ├── portfolio.api.js     # Holdings and positions
│   │   └── funds.api.js         # Balance, deposit, and withdraw
│   ├── components/
│   │   ├── Badge.jsx            # Status tags & P&L badges
│   │   ├── Button.jsx           # Multi-variant buttons with loading state
│   │   ├── Card.jsx             # Glassmorphic financial metric cards
│   │   ├── EmptyState.jsx       # Illustrated fallback states
│   │   ├── ErrorBoundary.jsx    # React error boundary with reload
│   │   ├── GlobalSearch.jsx     # Debounced global search modal (Ctrl+K)
│   │   ├── Input.jsx            # Form input with icons, prefixes & errors
│   │   ├── Loader.jsx           # Loaders & Skeleton shimmer components
│   │   ├── MarketIndicesStrip.jsx # NIFTY/SENSEX live ticker bar
│   │   ├── MobileNav.jsx        # Mobile bottom navigation bar
│   │   ├── Modal.jsx            # Accessible dialog portal
│   │   ├── ModifyOrderModal.jsx # Order edit modal
│   │   ├── Navbar.jsx           # Header bar with user profile & search
│   │   ├── OrderModal.jsx       # Buy/Sell placement with confirmation
│   │   ├── Sidebar.jsx          # Collapsible desktop sidebar navigation
│   │   ├── StockChart.jsx       # TradingView Lightweight Charts wrapper
│   │   ├── Table.jsx            # Sortable, responsive table
│   │   └── Tabs.jsx             # Underline and pill style tabs
│   ├── constants/
│   │   ├── indices.js           # Market indices metadata
│   │   ├── orderTypes.js        # Buy/Sell, Market/Limit, CNC/MIS constants
│   │   └── stocks.js            # Top 20+ NSE stocks dataset
│   ├── hooks/
│   │   ├── useAuth.js           # Auth convenience hook
│   │   ├── useDebounce.js       # Search input debouncer
│   │   ├── useLivePrice.js      # Symbol price subscription + tick flash
│   │   └── useWatchlist.js      # Watchlist state with live valuations
│   ├── layouts/
│   │   ├── AppLayout.jsx        # Authenticated workspace layout
│   │   └── AuthLayout.jsx       # Login/Signup layout
│   ├── mocks/
│   │   ├── mockData.js          # Seed user, holdings, orders, funds
│   │   ├── mockDb.js            # Persistent localStorage-backed sandbox DB
│   │   └── mockSocket.js        # WebSocket simulator emitting "price:update"
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── FundsPage.jsx
│   │   ├── HoldingsPage.jsx
│   │   ├── NotFound.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── PositionsPage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── StockDetail.jsx
│   │   └── WatchlistPage.jsx
│   ├── routes/
│   │   ├── AppRoutes.jsx        # Lazy routes definition
│   │   ├── ProtectedRoute.jsx   # Route guard
│   │   └── PublicRoute.jsx      # Guest guard
│   ├── store/
│   │   ├── useAuthStore.js      # User credentials & session
│   │   ├── useMarketStore.js    # Live prices dictionary & tick directions
│   │   ├── usePortfolioStore.js # Orders, holdings, positions, funds
│   │   ├── useThemeStore.js     # Dark/Light theme state
│   │   └── useWatchlistStore.js # Active watchlist state
│   ├── utils/
│   │   ├── cn.js                # Tailwind merge helper
│   │   ├── formatters.js        # Indian Rupee (INR) and date formatters
│   │   └── storage.js           # LocalStorage wrapper
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🚦 Getting Started

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed:
```bash
node -v
npm -v
```

### 2. Installation
Install dependencies:
```bash
npm install
```

### 3. Running Locally
Start the Vite development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
To build and validate the optimized production bundle:
```bash
npm run build
npm run preview
```

---

## 🔄 Switching from Mock to Real Backend

By default, `VITE_USE_MOCK=true` enables the built-in mock database and price simulator. When your Node.js/Express backend is ready:

1. Open `.env` (or create one from `.env.example`):
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_WS_URL=http://localhost:5000
   VITE_USE_MOCK=false
   ```
2. Restart the Vite development server:
   ```bash
   npm run dev
   ```

All API calls from `auth.api.js`, `stocks.api.js`, `orders.api.js`, `portfolio.api.js`, `funds.api.js`, and `watchlist.api.js` will route directly to `http://localhost:5000/api` using Axios with JWT headers, and `socketService` will connect to `http://localhost:5000` via `socket.io-client`.

---

## 📡 API Contract (Backend Specifications)

The frontend expects the following REST endpoints and WebSocket events:

### Authentication
- `POST /api/auth/signup` - Body: `{ name, email, phone, pan, password }`
- `POST /api/auth/login` - Body: `{ email, password }` -> Returns: `{ user, token }`
- `POST /api/auth/logout`
- `GET /api/auth/me` -> Headers: `Authorization: Bearer <token>`

### Stocks & Market Data
- `GET /api/stocks/search?q=<query>` -> Returns array of matching stocks
- `GET /api/stocks/:symbol` -> Returns stock info & metrics
- `GET /api/stocks/:symbol/history?range=1D|1W|1M|1Y` -> Returns array of OHLCV candles: `[{ time, open, high, low, close, volume }]`

### Watchlist
- `GET /api/watchlist` -> Returns user watchlists
- `POST /api/watchlist/:symbol` -> Body: `{ watchlistId }`
- `DELETE /api/watchlist/:symbol` -> Body: `{ watchlistId }`

### Orders
- `GET /api/orders` -> Returns all user orders
- `POST /api/orders` -> Body: `{ symbol, side: "BUY"|"SELL", orderType: "MARKET"|"LIMIT", product: "CNC"|"MIS", quantity, price }`
- `PATCH /api/orders/:id` -> Body: `{ quantity, price }`
- `DELETE /api/orders/:id` -> Cancels open order

### Portfolio & Positions
- `GET /api/portfolio/holdings` -> Returns array of `{ symbol, quantity, avgPrice, ltp, prevClose }`
- `GET /api/portfolio/positions` -> Returns array of `{ id, symbol, product, side, quantity, avgPrice, ltp }`

### Funds
- `GET /api/funds` -> Returns `{ availableBalance, usedMargin, totalBalance, transactions }`
- `POST /api/funds/add` -> Body: `{ amount, mode }`
- `POST /api/funds/withdraw` -> Body: `{ amount, mode }`

### Real-Time WebSocket Event
- **Event Name**: `"price:update"`
- **Payload**:
  ```json
  {
    "symbol": "RELIANCE",
    "ltp": 2954.80,
    "change": 44.40,
    "changePercent": 1.53,
    "high": 2972.50,
    "low": 2915.10,
    "volume": 8421030,
    "timestamp": 1728389400000
  }
  ```
