# Badaplot - Interactive Plot Visualization Addon

A powerful real estate plot visualization and management system that allows developers to digitize plot layouts from PDFs and provide interactive, customer-facing plot availability views.

## 🌟 Features

### Admin Digitization Tool (`/admin`)
- **PDF/Image Upload**: Upload plot layout PDFs or images as base layer
- **Interactive Drawing**: Click-to-draw polygon plots on the canvas
- **Pan & Zoom**: Navigate large plot layouts with smooth pan and zoom controls
- **Plot Configuration**: Assign plot numbers, sizes, status, facing direction, and pricing
- **Real-time Preview**: See plots rendered as you create them
- **Export/Save**: Save digitized data to Supabase database

### Public Visualization (`/`)
- **Interactive Plot Map**: Clickable plots with real-time availability status
- **Color-Coded Status**: Visual distinction between Available, Sold, and Reserved plots
- **Plot Details Modal**: View complete plot information with a single click
- **Status Bar**: Live summary of total plots and availability
- **Inventory Report**: Comprehensive table view of all plots
- **Filter System**: Filter plots by status, facing, and type
- **Schedule Visit & Enquiry Forms**: Capture buyer interest directly into the CRM
- **Gallery & Media Link**: Full project gallery including site pictures
- **Share Function**: Share direct deep-links or send details to WhatsApp
- **Location Map**: Integrated map view for project location
- **Responsive Design**: Works seamlessly on mobile and desktop

### Dealflow CRM Dashboard (`dealflow-dashboard/`)
- **Interactive Analytics**: Overview of total plots, revenue metrics, available plots, and deals
- **Real-time Sync**: Synced to Supabase to instantly reflect new digitized plots
- **24 Views & Pages**: Comprehensive management interface including:
  - Inventory reports and lists
  - Pipeline deals tracker
  - Lead management and forms
  - Broker CRM and analytics

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TypeScript (Dashboard) |
| Styling | Tailwind CSS + Shadcn UI |
| Routing | React Router DOM |
| Backend | Node.js + Express (Optional) |
| Storage | Supabase (PostgreSQL) + Realtime |
| Charts | Recharts (Dashboard) |

## 📁 Project Structure

```
Badaplot/
├── client/                 # React frontend (Public View & Admin Digitizer)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── layout/     # Header, StatusBar, BottomNav
│   │   │   ├── map/        # PlotLayout, PlotElement
│   │   │   ├── modals/     # PlotModal, EnquiryModal, ShareModal
│   │   │   └── views/      # InventoryReport, DetailsPanel, LocationMap
│   │   ├── lib/            # Supabase client & Types
│   │   ├── pages/          # PublicView.jsx, AdminDigitize.jsx
│   │   └── App.jsx
│   └── package.json
├── dealflow-dashboard/     # React + TS CRM Dashboard
│   ├── src/
│   │   ├── components/     # UI components (Shadcn + Plot layout viewer)
│   │   ├── pages/          # 24 different dashboard pages
│   │   └── lib/            # Types, utilities, and Supabase client
│   └── package.json
├── server/                 # Express backend / Seeding Scripts
│   ├── data/
│   │   └── samplePlots.json
│   ├── supabase_migration.sql # Database schema with RLS
│   ├── seed.js             # Supabase seeder
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

3. **Set up Supabase Configuration**
   - Create a `.env` file in both `client/` and `dealflow-dashboard/`
   - Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to both
   - In `server/.env`, add your `VITE_SUPABASE_SERVICE_ROLE_KEY` to seed the database

4. **Seed Database**
   - Head to Supabase SQL editor and execute `server/supabase_migration.sql`
   - Run `node server/seed.js` to insert sample data

### Running the Application

1. **Start the frontend dev server (Public/Admin View)**
   ```bash
   cd client
   npm run dev
   # App runs on http://localhost:5173
   ```

2. **Start the Dealflow CRM Dashboard**
   ```bash
   cd dealflow-dashboard
   npm run dev
   # App runs on http://localhost:5174
   ```

3. **Open in browser**
   - Public View: `http://localhost:5173/`
   - Admin Digitizer: `http://localhost:5173/admin`
   - Dealflow Dashboard: `http://localhost:5174/`

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
| Available | Green (`#16a34a`) |
| Sold | Red (`#dc2626`) |
| Tentatively Booked | Blue (`#2563eb`) |
| Hold | Amber (`#d97706`) |
| Registered | Purple (`#7e22ce`) |
| Mortgaged | Slate (`#475569`) |

## 📄 License

MIT License - feel free to use this for your real estate projects.

## 👤 Author

**AryamanLabs**  
📧 aryamanlabs@gmail.com

---

Built with ❤️ for real estate developers
