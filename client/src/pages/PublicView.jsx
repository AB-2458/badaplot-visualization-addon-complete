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
import MediaGallery from '../components/views/MediaGallery';
import ShareModal from '../components/modals/ShareModal';
import { supabase } from '../lib/supabaseClient';

export default function PublicView() {
    const [plots, setPlots] = useState([]);
    const [activeTab, setActiveTab] = useState('layout');
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [showInventory, setShowInventory] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [showScheduleVisit, setShowScheduleVisit] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [filters, setFilters] = useState({});

    const [projectData, setProjectData] = useState(null);

    // Load project and plots from Supabase
    useEffect(() => {
        let channel;

        const loadData = async () => {
            if (!supabase) {
                console.error('[Badaplot] Supabase not configured. Cannot load data.');
                return;
            }
            const { data: project } = await supabase
                .from('projects')
                .select('*')
                .limit(1)
                .single();

            if (project) {
                setProjectData(project);
                const { data: plotData } = await supabase
                    .from('plots')
                    .select('*')
                    .eq('project_id', project.id);

                if (plotData) {
                    const mappedPlots = plotData.map(p => ({
                        ...p,
                        svgPath: p.svg_path,
                        centroidX: p.centroid_x,
                        centroidY: p.centroid_y,
                        areaSqft: p.area_sqft,
                        pricePerSqft: p.price_per_sqft,
                        totalPrice: p.total_price
                    }));
                    setPlots(mappedPlots);

                    // Subscribe to real-time changes
                    channel = supabase
                        .channel('public:plots')
                        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'plots', filter: `project_id=eq.${project.id}` }, (payload) => {
                            setPlots(prevPlots => prevPlots.map(p => {
                                if (p.id === payload.new.id) {
                                    return {
                                        ...p,
                                        status: payload.new.status,
                                        facing: payload.new.facing,
                                        type: payload.new.type,
                                        areaSqft: payload.new.area_sqft,
                                        pricePerSqft: payload.new.price_per_sqft,
                                        totalPrice: payload.new.total_price,
                                        number: payload.new.number
                                    };
                                }
                                return p;
                            }));
                        })
                        .subscribe();
                }
            }
        };
        loadData();

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
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

    const handleStatusChange = async (plotId, newStatus) => {
        // Optimistic UI update
        setPlots(prev => prev.map(p => p.id === plotId ? { ...p, status: newStatus } : p));
        setSelectedPlot(prev => prev ? { ...prev, status: newStatus } : null);

        // Update in Supabase
        await supabase
            .from('plots')
            .update({ status: newStatus })
            .eq('id', plotId);
    };

    if (!projectData) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center gap-4">
                {!supabase ? (
                    <div className="text-center space-y-2">
                        <p className="text-red-500 font-semibold text-xl">⚠️ Database Not Configured</p>
                        <p className="text-gray-500">Please set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`</p>
                    </div>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto"></div>
                        <p className="text-gray-600 font-medium">Loading Project...</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-white text-gray-900 flex flex-col relative overflow-hidden">
            {/* Top Bar Navigation */}
            <Header
                projectName={projectData.name}
                location={projectData.location}
                onScheduleVisit={() => setShowScheduleVisit(true)}
                onShare={() => setShowShare(true)}
            />

            {/* Status Bar - Only show on layout or inventory view */}
            {(activeTab === 'layout' || showInventory) && (
                <StatusBar
                    plots={plots}
                    onInventoryClick={handleInventoryToggle}
                    onFilterClick={() => setShowFilter(true)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 relative overflow-hidden bg-white">
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
                ) : activeTab === 'gallery' ? (
                    <MediaGallery projectId={projectData.id} />
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

            {/* Share Modal */}
            {showShare && (
                <ShareModal
                    project={projectData}
                    url={window.location.href}
                    title={projectData.name}
                    onClose={() => setShowShare(false)}
                />
            )}
        </div>
    );
}
