# Badaplot - Interactive Plot Visualization Addon

A powerful real estate plot visualization and management system that allows developers to digitize plot layouts from PDFs and provide interactive, customer-facing plot availability views.

## 🌟 Features

### Admin Digitization Tool (`/admin`)
- **PDF/Image Upload**: Upload plot layout PDFs or images as base layer
- **Interactive Drawing**: Click-to-draw polygon plots on the canvas
- **Pan & Zoom**: Navigate large plot layouts with smooth pan and zoom controls
- **Plot Configuration**: Assign plot numbers, sizes, status, facing direction, and pricing
- **Real-time Preview**: See plots rendered as you create them
- **Export/Save**: Save digitized data for use in public view

### Public Visualization (`/`)
- **Interactive Plot Map**: Clickable plots with real-time availability status
- **Color-Coded Status**: Visual distinction between Available, Sold, and Reserved plots
- **Plot Details Modal**: View complete plot information with a single click
- **Status Bar**: Live summary of total plots and availability
- **Inventory Report**: Comprehensive table view of all plots
- **Filter System**: Filter plots by status, facing, and type
- **Schedule Visit**: Built-in scheduling modal for site visits
- **Location Map**: Integrated map view for project location
- **Responsive Design**: Works seamlessly on mobile and desktop

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Routing | React Router DOM |
| Backend | Node.js + Express |
| Storage | LocalStorage (Supabase-ready) |

## 📁 Project Structure

```
Badaplot/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── layout/     # Header, StatusBar, BottomNav
│   │   │   ├── map/        # PlotLayout, PlotCanvas
│   │   │   ├── modals/     # PlotModal, FilterModal, ScheduleVisitModal
│   │   │   └── views/      # InventoryReport, DetailsPanel, LocationMap
│   │   ├── pages/
│   │   │   ├── PublicView.jsx      # Customer-facing plot view
│   │   │   └── AdminDigitize.jsx   # Admin plot digitization tool
│   │   └── App.jsx         # Main app with routing
│   └── package.json
├── server/                 # Express backend
│   ├── data/
│   │   └── samplePlots.json
│   └── index.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aryamanlabs/badaplot-plotting-visualization-addon.git
   cd badaplot-plotting-visualization-addon
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   node index.js
   # Server runs on http://localhost:3001
   ```

2. **Start the frontend dev server**
   ```bash
   cd client
   npm run dev
   # App runs on http://localhost:5173
   ```

3. **Open in browser**
   - Public View: `http://localhost:5173/`
   - Admin Digitizer: `http://localhost:5173/admin`

## 📖 Usage

### Digitizing a Plot Layout (Admin)

1. Navigate to `/admin`
2. Upload a plot layout image (PDF support coming soon)
3. Select "Draw Plot" mode
4. Click points to create polygon vertices
5. Close the polygon by clicking near the starting point
6. Configure plot details (number, size, status, facing)
7. Save the plot and repeat for all plots
8. Export/save the complete layout

### Viewing Plots (Public)

1. Navigate to `/`
2. Browse the interactive plot map
3. Click any plot to view details
4. Use the status bar to see availability summary
5. Use filters to narrow down options
6. Schedule a site visit through the modal

## 🎨 Plot Status Colors

| Status | Color |
|--------|-------|
| Available | Green |
| Sold | Red |
| Reserved | Orange |
| On Hold | Yellow |

## 📄 License

MIT License - feel free to use this for your real estate projects.

## 👤 Author

**AryamanLabs**  
📧 aryamanlabs@gmail.com

---

Built with ❤️ for real estate developers
