# 📊 Real-Time Dashboard

A modern, interactive business intelligence dashboard built with React, featuring real-time data updates, interactive charts, and comprehensive export capabilities.

![Dashboard Preview](./screenshots/dashboard-preview.png)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd realtime-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ VS Code Setup

### Recommended Extensions
1. **ES7+ React/Redux/React-Native snippets** - Extension ID: `dsznajder.es7-react-js-snippets`
2. **Auto Rename Tag** - Extension ID: `formulahendry.auto-rename-tag`
3. **Bracket Pair Colorizer** - Extension ID: `coenraads.bracket-pair-colorizer`
4. **ESLint** - Extension ID: `dbaeumer.vscode-eslint`
5. **Prettier** - Extension ID: `esbenp.prettier-vscode`
6. **Tailwind CSS IntelliSense** - Extension ID: `bradlc.vscode-tailwindcss`

### VS Code Settings
Create `.vscode/settings.json` in your project root:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.includeLanguages": {
    "javascript": "javascript",
    "html": "html"
  }
}
```

## 📁 Project Structure

```
realtime-dashboard/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Main dashboard component
│   │   ├── KPICard.jsx           # KPI display cards
│   │   └── ChartContainer.jsx    # Reusable chart wrapper
│   ├── utils/
│   │   ├── dataGenerator.js      # Mock data generation
│   │   └── exportHelpers.js      # Data export utilities
│   ├── hooks/
│   │   └── useRealTimeData.js    # Real-time data management
│   ├── App.jsx                   # Root application component
│   ├── main.jsx                  # Application entry point
│   └── index.css                 # Global styles
├── public/
├── screenshots/                  # App screenshots
├── package.json
├── vite.config.js
├── tailwind.config.js
├── .eslintrc.js
├── .gitignore
└── README.md
```

## ✨ Features

### Core Dashboard Features
- **Real-time data updates** with configurable intervals
- **Interactive KPI cards** with trend indicators
- **Multiple chart types** (Line, Area, Bar, Pie)
- **Data filtering and search** capabilities
- **Export functionality** (JSON/CSV formats)
- **Responsive design** for all device sizes

### Chart Features
- **Fullscreen mode** for detailed analysis
- **Custom tooltips** with formatted data
- **Color-coded visualizations** with consistent theming
- **Loading states** and error handling
- **Individual chart export** capabilities

### Technical Features
- **Local storage persistence** for dashboard state
- **Error boundaries** for graceful error handling
- **Performance optimized** with React hooks
- **Accessibility compliant** with ARIA labels
- **Modern build system** with Vite

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors automatically
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_APP_NAME=Real-Time Dashboard
VITE_UPDATE_INTERVAL=5000
VITE_ENABLE_PERSISTENCE=true
```

### Customization Options
- **Update Interval**: Modify `updateInterval` in `useRealTimeData` hook
- **Chart Colors**: Update color schemes in `ChartContainer` component
- **Data Sources**: Replace mock data generators with real API calls
- **Export Formats**: Add new export formats in `exportHelpers.js`

## 📊 Data Structure

### KPI Data Format
```javascript
{
  title: "Total Revenue",
  value: "$245K",
  change: "+12.5%",
  trend: "up",
  icon: "DollarSign",
  color: "text-green-600",
  bgColor: "bg-green-100"
}
```

### Chart Data Format
```javascript
// Sales Data
{
  month: "Jan",
  revenue: 45000,
  orders: 320,
  customers: 180,
  conversion: "3.2"
}

// Traffic Data
{
  time: "10:00",
  visitors: 1250,
  pageViews: 3200,
  bounceRate: "32.1"
}
```

## 🚀 Deployment

### Netlify
1. Push your code to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### GitHub Pages
```bash
npm run build
# Deploy dist folder to gh-pages branch
```

## 🔍 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 3000
npx kill-port 3000
```

**Module not found errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```
