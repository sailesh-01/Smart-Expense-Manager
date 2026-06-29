# SpendSmart – Student Expense Manager 💸

SpendSmart is a modern, lightweight, full-stack web application designed specifically for students to easily log daily expenses, set category-based budget limits, and gain clear insights into their spending habits.

## 🚀 Key Features

- **Interactive Dashboard:** A quick, visual breakdown of your budget progress, category distributions, and daily spending trends.
- **Smart Budget Alerts:** Receive instant warnings when spending hits 80% or exceeds 100% of your category limits.
- **Dynamic Visualizations:** Clean charts (pie charts, line graphs, and 6-month comparisons) built with Recharts.
- **Data Portability:** Export your logged expense reports directly to a CSV file.
- **Modern UX/UI:** Seamless Dark Mode toggle, responsive design with Tailwind CSS, and toast notifications.
- **PWA-Ready:** Includes a service worker for basic offline capabilities and app validation.

## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS, Recharts, Lucide Icons, Date-fns, React Hot Toast
- **Backend:** Node.js, Express, CORS, Express-Validator
- **Database:** Local JSON file (`db.json`)

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Backend Setup

Open a terminal and navigate to the `server` directory:

```bash
cd server
npm install
npm run dev
```

The server will start on `http://localhost:5000`.

### 2. Frontend Setup

Open a new terminal and navigate to the `client` directory:

```bash
cd client
npm install
npm run dev
```

The React app will be accessible at `http://localhost:5173` (or the port Vite outputs in the console).

## Sample Data
The `server/db.json` file comes pre-populated with sample expenses across multiple months and preset budget limits to demonstrate the charts and reports out of the box.
