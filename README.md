# Next Mutual Fund Explorer

A comprehensive mutual fund exploration and investment analysis platform built with Next.js 15, TypeScript, and Material-UI. This application provides investors with tools to browse mutual funds, analyze historical performance, and calculate potential returns using various investment calculators.

## Features

- **Mutual Fund Browser**: Browse and search through thousands of mutual funds with real-time NAV data
- **Investment Calculators**:
  - SIP (Systematic Investment Plan) Calculator
  - Lump Sum Investment Calculator
  - SWP (Systematic Withdrawal Plan) Calculator
  - Step-up SIP Calculator
  - Step-up SWP Calculator
  - Rolling Return Calculator
- **Historical Data Visualization**: Interactive charts showing NAV trends over time
- **Performance Metrics**: View 1Y, 3Y, 5Y returns and CAGR for funds
- **Auto-refreshing Data**: Daily automated updates of mutual fund data
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 (with Turbopack)
- **Language**: TypeScript
- **Styling**: Material-UI (MUI) with custom components
- **Charts**: Recharts and MUI X Charts
- **API**: Next.js App Router with API routes
- **Scheduling**: node-cron for automated data refresh
- **Date Handling**: dayjs
- **HTTP Client**: Axios
- **Icons**: Lucide React and MUI Icons

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Next_Mutual_Fund_Explorer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add the following:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

### Starting the Production Server

```bash
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js 15 App Router pages
│   ├── api/                # API routes for data fetching
│   │   ├── _init/          # Initialization routes
│   │   ├── mf/             # Mutual fund data API
│   │   └── scheme/[code]/  # Scheme-specific APIs
│   ├── funds/              # Funds listing page
│   ├── scheme/[code]/      # Individual scheme detail page
│   └── globals.css         # Global styles
├── components/             # Reusable React components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and libraries
├── types/                  # TypeScript type definitions
```

## API Endpoints

- `GET /api/mf` - Fetches mutual fund data with caching
- `POST /api/scheme/[code]/sip` - Calculate SIP returns for a specific scheme
- `POST /api/scheme/[code]/lumpsum` - Calculate lump sum returns
- `POST /api/scheme/[code]/swp` - Calculate SWP returns
- `POST /api/scheme/[code]/step-up-sip` - Calculate step-up SIP returns
- `POST /api/scheme/[code]/step-up-swp` - Calculate step-up SWP returns
- `POST /api/scheme/[code]/rolling-return` - Calculate rolling returns
- `GET /api/scheme/[code]/returns` - Get historical returns data

## Key Components

- **FundCard.tsx**: Displays individual mutual fund information
- **FundListItem.tsx**: Shows fund data in table format
- **SIPCalculator.tsx**: Interactive SIP return calculator
- **LumpSumCalculator.tsx**: Lump sum investment calculator
- **SWPCalculator.tsx**: Systematic withdrawal plan calculator
- **NavChart.tsx**: NAV trend visualization
- **HistoricalReturnsGrid.tsx**: Grid view of historical returns
- **Navbar.tsx**: Navigation component

## Data Sources

The application fetches mutual fund data from the [Mutual Fund API](https://api.mfapi.in/mf) which provides:
- Current NAV values
- Historical NAV data
- Fund metadata and categorization
- Daily updates of mutual fund information

## Caching Strategy

The application implements an intelligent caching system:
- Data is cached for 12 hours to reduce API calls
- A cron job runs daily at 7:00 AM to refresh data
- Cache is automatically invalidated if NAV data is not from the current day

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to the Mutual Fund API for providing free access to mutual fund data
- Built with the amazing Next.js framework and Material-UI components
- Inspired by the need for transparent and accessible mutual fund analysis tools