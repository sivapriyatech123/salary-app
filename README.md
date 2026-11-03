# 💸 SalarySplit — Smart Salary, Savings & Household Management Platform

**SalarySplit** is a modern, playful, animation-rich personal finance, salary allocation, grocery management, savings, and shared household budgeting platform.

Designed to turn every paycheck into a clear plan, SalarySplit helps individuals and couples divide income into customizable categories, manage everyday kitchen spending, grow savings, track animated financial goals, and manage shared household expenses.

---

## 🌟 Key Features & Modules

### 1. 🚀 Landing Page & Interactive Preview
* **Hero Experience**: Bold headline *"Your salary. Your goals. Your balance."* featuring animated wallet character, floating coins, and live preview cards.
* **Interactive Live Sandbox**: Drag sliders on the landing page to preview instant category calculations.
* **Feature Grid & Workflow**: Showcases for SmartPantry, CoupleSpace, DreamGoals, and Monthly Insights.

### 2. 🧙‍♂️ Multi-Step Onboarding & Demo Mode
* **Onboarding Wizard**: 7-step guided setup (Monthly Income, Currency Selection, Individual vs Household, Allocation Method, Default Categories, Initial Goals).
* **Demo Mode**: Prefilled sample financial datasets (₹60,000 / $60,000 monthly income) with 1-click sample data reset.

### 3. 📊 Main Dashboard & Financial Overview
* **6 Key Metric Summary Cards**: Monthly Income, Total Allocated, Recorded Expenses, Remaining Planned Budget, Saved Contributions, Active Dream Goals.
* **Salary Day Countdown Widget**: Days until next payday timer with progress circle.
* **Interactive Recharts**: Salary Allocation Donut Chart and Planned vs Actual Spending Bar Chart.

### 4. ⚙️ SalarySplit — Core Budget Allocation System
* **3 Allocation Methods**:
  * **Percentage Allocation**: Set category percentages (e.g. 50% Needs, 30% Savings, 20% Wants).
  * **Fixed Amount Allocation**: Set exact monetary amounts per category.
  * **Hybrid Allocation**: Set fixed amounts for Rent/EMIs and percentage splits for remaining income.
* **Category Manager**: Add custom categories, select custom colors and icons, assign types (*Needs, Wants, Savings, Debt, Household*), toggle shared vs personal, rename, and reorder.
* **Safety Lock**: Prevents over-allocation > 100% of income, with 1-click *"Distribute Remaining %"* tool.

### 5. 🛒 SmartPantry — Intelligent Kitchen & Grocery Manager
* **Grocery Budget Tracking**: Planned limit, recorded spending, remaining fund, and % budget used gauge.
* **Grocery List Manager**: Item list with estimated vs actual prices, quantities, categories (*Produce, Dairy, Meat, Pantry, Bakery, Beverages*), and 1-click purchase confirmation that **automatically creates an expense in the Groceries category** without duplication!
* **Pantry Inventory**: Stock status (*In Stock, Low Stock, Out of Stock*), unit, purchase date, and expiry alert badges.
* **Weekly Meal Planner**: Calendar slots with recipe ingredient auto-matcher and *"Add missing items to grocery list"* button.

### 6. 💳 Expenses Module
* **Transaction Management**: Add, edit, delete expenses with payment methods (*UPI, Credit Card, Debit Card, Cash, Bank Transfer*), descriptions, and dates.
* **Budget Threshold Alerts**: Configurable warnings when spending reaches selected thresholds (50%, 75%, 90%, 100%).

### 7. 🏦 MySavings Management
* **Savings Vaults**: Emergency Shield, High-Yield Wealth Builder, and House Down Payment funds.
* **Internal Transfer Protection**: Deposit and withdrawal logs clearly separated from consumption expenses.

### 8. 🏡 DreamGoals — Animated Financial Goal Tracking
* **Multi-Stage Cartoon SVG Visualizers**:
  * **House Goal**: 5-stage progress (0-25% foundation, 25-50% brick walls rising, 50-75% roof framing, 75-99% finishing touches, 100% complete dream house with garden & rainbow!).
  * **Car Goal**: Moving sports car along winding road.
  * **Vacation Goal**: Airplane flying over clouds to tropical island.
  * **Emergency Shield**: Glowing liquid gold shield filling up with energy.
* **Milestone System**: Badges at 10%, 25%, 50%, 75%, 90%, 100%.
* **Full-Screen Celebration Modal**: Canvas confetti fireworks, duration summary, and victory badge.

### 9. 👩‍❤️‍👨 CoupleSpace — Shared Household Budgeting
* **Combined Income Calculation**: Partner A (₹60,000) + Partner B (₹40,000) = Combined ₹1,00,000 pool.
* **4 Contribution Rules**:
  1. **Proportional Split** (income-based ratio e.g., 60% / 40%).
  2. **Equal 50/50 Split**.
  3. **Custom Ratio Split**.
  4. **Fully Combined Pool**.
* **Shared vs Personal Balance Separation**: Keeps personal spending private while coordinating shared rent, groceries, and house goals.
* **Invite System**: Partner invite code generation (`SPLIT-8842`).

### 10. 📈 Monthly Insights ("My Month in Money")
* **Interactive Financial Report**: Adherence % calculation, Budget Variance breakdown, Savings Completion %.
* **Natural Language Summaries**: Automated insights generated from actual recorded data.
* **Export CSV**: 1-click monthly financial report export.

### 11. 🔮 Smart Extras & Utilities
* **What-If Scenario Simulator**: Sandbox to test salary raises, rent hikes, and extra savings goals without altering live data unless confirmed.
* **Bill Calendar & Subscription Tracker**: Upcoming bills, auto-pay status, and subscription renewal alerts.
* **Life Event Planner**: Moving, wedding, and vacation event templates with expense checklists.
* **No-Spend Challenge**: Gamified streak tracker for 7, 14, or 30 days of no impulse spending.

---

## 🛠️ Technology Stack

* **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Recharts, Lucide React, Canvas Confetti.
* **Backend**: Node.js, Express.js, TypeScript.
* **Database & Auth**: PostgreSQL, Supabase (`@supabase/supabase-js`) with Row Level Security (RLS) policies.

---

## 📁 Project Structure

```
salary/
├── src/
│   ├── components/
│   │   ├── couple/          # CoupleSpace shared budgeting
│   │   ├── dashboard/       # Sidebar, Header, SummaryCards, DashboardCharts
│   │   ├── expenses/        # Expenses tracker & threshold alerts
│   │   ├── extras/          # WhatIfSimulator, BillCalendar, LifeEventPlanner, NoSpend
│   │   ├── goals/           # DreamGoals animated goal cards
│   │   ├── illustrations/   # Multi-stage HouseConstruction, WalletCharacter, Confetti
│   │   ├── insights/        # Monthly Insights report & CSV exporter
│   │   ├── landing/         # Navbar, HeroSection, InteractiveSplitPreview, Footer
│   │   ├── onboarding/      # OnboardingWizard multi-step setup
│   │   ├── salary-split/    # SalarySplitEngine sliders & category manager
│   │   ├── savings/         # MySavings vaults & deposit history
│   │   └── smart-pantry/    # SmartPantry grocery list, pantry stock & meal planner
│   ├── context/
│   │   └── AppContext.tsx   # Centralized React state context & storage syncer
│   ├── services/
│   │   ├── storageService.ts  # LocalStorage persistence & default demo datasets
│   │   └── supabaseClient.ts  # Supabase client with safe demo fallback
│   ├── types/
│   │   └── index.ts         # TypeScript definitions
│   ├── utils/
│   │   └── financials.ts    # Centralized financial math & currency formatters
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── server/
│   ├── package.json
│   └── src/index.ts         # Express Node.js TypeScript API server
├── database/
│   └── schema.sql           # Complete PostgreSQL + Supabase schema & RLS policies
├── index.html
├── package.json
├── tsconfig.app.json
├── vite.config.ts
└── .env.example
```

---

## 💻 Local Development Setup

### 1. Frontend Setup
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
The frontend will run at `http://localhost:5173/`.

### 2. Backend Server Setup (Optional)
```bash
cd server
npm install
npm run dev
```
The backend server will run at `http://localhost:5000/`.

---

## 🗄️ Database Setup (Supabase / PostgreSQL)

1. Open your Supabase Project SQL Editor.
2. Run the SQL script from `database/schema.sql`.
3. Copy your project URL and Anon Key into `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🚀 Deployment Guide

### Frontend Deployment (Vercel)
1. Push project to GitHub.
2. Connect repository to [Vercel](https://vercel.com).
3. Set Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
4. Build command: `npm run build`, Output directory: `dist`.

### Backend Deployment (Render / Railway)
1. Create a Web Service on [Render](https://render.com).
2. Set root directory to `server`.
3. Build command: `npm install && npm run build`, Start command: `npm start`.
