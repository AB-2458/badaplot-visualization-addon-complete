import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import StatusBar from '../components/layout/StatusBar';
import BottomNav from '../components/layout/BottomNav';
import PlotLayout from '../components/map/PlotLayout';
import PlotModal from '../components/modals/PlotModal';
import FilterModal from '../components/modals/FilterModal';
import InventoryReport from '../components/views/InventoryReport';
import DetailsPanel from '../components/views/DetailsPanel';
import ScheduleVisitModal from '../components/modals/ScheduleVisitModal';
import LocationMap from '../components/views/LocationMap';

// Project data - will be fetched from Supabase later
const projectData = {
    name: "Archer Homes 3d",
    location: "Kurnool, Andhra Pradesh",
    phone: "+91 9876543210",
    whatsapp: "+91 9876543210",
    email: "sales@archerhomes.com",
    address: "Plot No. 123, Main Road, Kurnool",
    coordinates: { lat: 15.8281, lng: 78.0373 },
    tourUrl: "https://example.com/360-tour"
};

export default function PublicView() {
    const [plots, setPlots] = useState([]);
    const [activeTab, setActiveTab] = useState('layout');
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [showInventory, setShowInventory] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [showScheduleVisit, setShowScheduleVisit] = useState(false);
    const [filters, setFilters] = useState({});

    // Load plots from localStorage (will be replaced with Supabase)
    useEffect(() => {
        const saved = localStorage.getItem('badaplot_plots');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setPlots(data.plots || []);
            } catch (e) {
                console.error('Error loading plots:', e);
            }
        }
    }, []);

    // Filter plots
    const filteredPlots = plots.filter(plot => {
        if (filters.status && filters.status !== 'All' && plot.status !== filters.status) return false;
        if (filters.facing && filters.facing !== 'All' && plot.facing !== filters.facing) return false;
        if (filters.type && filters.type !== 'All' && plot.type !== filters.type) return false;
        return true;
    });

    const handlePlotClick = (plot) => setSelectedPlot(plot);
    const handleInventoryToggle = () => setShowInventory(!showInventory);

    const handleStatusChange = (plotId, newStatus) => {
        setPlots(prev => {
            const updated = prev.map(p => p.id === plotId ? { ...p, status: newStatus } : p);
            localStorage.setItem('badaplot_plots', JSON.stringify({ plots: updated }));
            return updated;
        });
        setSelectedPlot(prev => prev ? { ...prev, status: newStatus } : null);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <Header
                projectName={projectData.name}
                location={projectData.location}
                onScheduleVisit={() => setShowScheduleVisit(true)}
            />

            {/* Status Bar */}
            <StatusBar
                plots={plots}
                onInventoryClick={handleInventoryToggle}
            />

            {/* Main Content */}
            <main className="flex-1 relative overflow-hidden bg-gray-50">
                {showInventory ? (
                    <InventoryReport
                        plots={filteredPlots}
                        onPlotClick={handlePlotClick}
                        onBackToLayout={() => setShowInventory(false)}
                    />
                ) : activeTab === 'layout' ? (
                    <PlotLayout
                        plots={filteredPlots}
                        imageUrl="/layouts/3d_render.png"
                        onPlotClick={handlePlotClick}
                        selectedPlotId={selectedPlot?.id}
                    />
                ) : activeTab === 'details' ? (
                    <DetailsPanel project={projectData} />
                ) : (
                    <LocationMap
                        coordinates={projectData.coordinates}
                        address={projectData.address}
                    />
                )}
            </main>

            {/* Bottom Navigation */}
            <BottomNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Plot Detail Modal */}
            {selectedPlot && (
                <PlotModal
                    plot={selectedPlot}
                    project={projectData}
                    onClose={() => setSelectedPlot(null)}
                    onStatusChange={handleStatusChange}
                />
            )}

            {/* Filter Modal */}
            {showFilter && (
                <FilterModal
                    initialFilters={filters}
                    onClose={() => setShowFilter(false)}
                    onApply={setFilters}
                />
            )}

            {/* Schedule Visit Modal */}
            {showScheduleVisit && (
                <ScheduleVisitModal
                    project={projectData}
                    onClose={() => setShowScheduleVisit(false)}
                />
            )}
        </div>
    );
}
