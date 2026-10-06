# Numevia

Numevia is a seasonal ticket draw interface built with Next.js. Users can search and select ticket numbers, connect a wallet, and view season and prize information.

## Getting started

Install dependencies:

```bash
npm install
```

Create a `.env` file with your WalletConnect project ID:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run start     # Start the production server
npm run lint      # Run ESLint
```

## Project structure

- `app/` - Next.js app routes and global styles
- `components/` - Reusable interface components
- `context/` - Wagmi and query providers
- `lib/` - Season data and wallet configuration
- `public/` - Images and local fonts

Ticket and prize values currently use placeholder data in `lib/season-data.ts`.
# wagmi
