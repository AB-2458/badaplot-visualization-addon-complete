import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AdminDigitize() {
    const [plots, setPlots] = useState([]);
    const [currentPolygon, setCurrentPolygon] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [editingPlotId, setEditingPlotId] = useState(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 1344, height: 768 });



    const [formData, setFormData] = useState({
        number: '',
        area: '',
        facing: 'East',
        type: 'Residential',
        pricePerSqft: '',
        measurements: { n: '', e: '', s: '', w: '' }
    });

    const svgRef = useRef(null);
    const containerRef = useRef(null);

    const [projectId, setProjectId] = useState(null);

    // Load project and plots from Supabase on mount
    useEffect(() => {
        const loadData = async () => {
            if (!supabase) {
                console.error('[Badaplot] Supabase not configured in AdminDigitize.');
                return;
            }
            const { data: project } = await supabase
                .from('projects')
                .select('id')
                .limit(1)
                .single();

            if (project) {
                setProjectId(project.id);
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
                        area: p.area_sqft,
                        pricePerSqft: p.price_per_sqft,
                        totalPrice: p.total_price,
                        measurements: p.features?.measurements,
                        points: p.features?.points
                    }));
                    setPlots(mappedPlots);
                }
            }
        };
        loadData();
    }, []);



    // Convert screen coordinates to SVG coordinates (accounting for zoom/pan)
    const screenToSVG = (clientX, clientY) => {
        const svg = svgRef.current;
        if (!svg) return { x: 0, y: 0 };

        const pt = svg.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
        return { x: Math.round(svgP.x), y: Math.round(svgP.y) };
    };

    // Handle canvas click for drawing
    const handleCanvasClick = (e) => {
        if (!isDrawing) return;

        const { x, y } = screenToSVG(e.clientX, e.clientY);
        setCurrentPolygon(prev => [...prev, { x, y }]);
    };

    // Handle double-click to complete polygon
    const handleDoubleClick = (e) => {
        if (!isDrawing || currentPolygon.length < 3) return;

        setIsDrawing(false);
        setSelectedPlot({
            id: `temp-${Date.now()}`,
            points: currentPolygon,
            svgPath: pointsToPath(currentPolygon),
            ...formData
        });
    };

    // Convert points array to SVG path
    const pointsToPath = (points) => {
        if (points.length < 3) return '';
        return `M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`;
    };

    // Calculate centroid
    const calculateCentroid = (points) => {
        const x = points.reduce((sum, p) => sum + p.x, 0) / points.length;
        const y = points.reduce((sum, p) => sum + p.y, 0) / points.length;
        return { x: Math.round(x), y: Math.round(y) };
    };

    // Undo last vertex
    const handleUndo = () => {
        if (currentPolygon.length > 0) {
            setCurrentPolygon(prev => prev.slice(0, -1));
        }
    };

    // Clear current drawing
    const handleClear = () => {
        setCurrentPolygon([]);
    };

    // Save plot
    const handleSavePlot = () => {
        if (!selectedPlot || currentPolygon.length < 3) return;

        const centroid = calculateCentroid(currentPolygon);
        const newPlot = {
            id: editingPlotId || crypto.randomUUID(),
            number: formData.number,
            area: parseFloat(formData.area) || 0,
            facing: formData.facing,
            type: formData.type,
            pricePerSqft: parseFloat(formData.pricePerSqft) || 0,
            totalPrice: (parseFloat(formData.area) || 0) * (parseFloat(formData.pricePerSqft) || 0),
            measurements: formData.measurements,
            svgPath: pointsToPath(currentPolygon),
            centroidX: centroid.x,
            centroidY: centroid.y,
            status: 'Available',
            points: currentPolygon
        };

        const dbPlot = {
            project_id: projectId,
            number: newPlot.number,
            svg_path: newPlot.svgPath,
            centroid_x: newPlot.centroidX,
            centroid_y: newPlot.centroidY,
            status: newPlot.status,
            type: newPlot.type,
            area_sqft: newPlot.area,
            price_per_sqft: newPlot.pricePerSqft,
            total_price: newPlot.totalPrice,
            facing: newPlot.facing,
            features: {
                measurements: newPlot.measurements,
                points: newPlot.points
            }
        };

        if (editingPlotId) {
            // Update existing plot
            setPlots(prev => prev.map(p => p.id === editingPlotId ? newPlot : p));
            setEditingPlotId(null);

            supabase.from('plots').update(dbPlot).eq('id', editingPlotId).then(({ error }) => {
                if (error) console.error("Error updating plot:", error);
            });
        } else {
            // Add new plot
            setPlots(prev => [...prev, newPlot]);
            dbPlot.id = newPlot.id;

            supabase.from('plots').insert([dbPlot]).then(({ error }) => {
                if (error) console.error("Error inserting plot:", error);
            });
        }

        setCurrentPolygon([]);
        setSelectedPlot(null);
        setFormData({
            number: '',
            area: '',
            facing: 'East',
            type: 'Residential',
            pricePerSqft: '',
            measurements: { n: '', e: '', s: '', w: '' }
        });
    };

    // Edit existing plot
    const handleEditPlot = (plot) => {
        setEditingPlotId(plot.id);
        setCurrentPolygon(plot.points || []);
        setFormData({
            number: plot.number,
            area: plot.area?.toString() || '',
            facing: plot.facing,
            type: plot.type,
            pricePerSqft: plot.pricePerSqft?.toString() || '',
            measurements: plot.measurements || { n: '', e: '', s: '', w: '' }
        });
        setIsDrawing(true);
        setSelectedPlot(plot);
    };

    // Delete plot
    const handleDeletePlot = (plotId) => {
        setPlots(prev => prev.filter(p => p.id !== plotId));
        supabase.from('plots').delete().eq('id', plotId).then(({ error }) => {
            if (error) console.error("Error deleting plot", error);
        });
    };

    // Export plots as JSON
    const handleExport = () => {
        const data = JSON.stringify({ plots }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plots.json';
        a.click();
    };

    // Import plots from JSON
    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.plots && Array.isArray(data.plots)) {
                    setPlots(data.plots);
                    alert(`Imported ${data.plots.length} plots successfully!`);
                }
            } catch (err) {
                alert('Invalid JSON file');
            }
        };
        reader.readAsText(file);
    };

    // Start new polygon
    const startDrawing = () => {
        setIsDrawing(true);
        setCurrentPolygon([]);
        setSelectedPlot(null);
        setEditingPlotId(null);
    };

    // Cancel drawing
    const cancelDrawing = () => {
        setIsDrawing(false);
        setCurrentPolygon([]);
        setSelectedPlot(null);
        setEditingPlotId(null);
    };



    return (
        <div className="h-screen w-full flex bg-background text-foreground overflow-hidden font-sans">
            {/* Left Sidebar */}
            <div className="w-80 bg-card border-r border-border p-4 flex flex-col gap-4 overflow-y-auto z-10 shrink-0 shadow-lg">
                <h1 className="text-2xl font-bold text-white mb-2">Admin Digitizer</h1>



                {/* Drawing Controls */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-3">Drawing Tools</h3>
                    {!isDrawing ? (
                        <button
                            onClick={startDrawing}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg font-medium"
                        >
                            + Draw New Plot
                        </button>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-green-400 text-sm">
                                {editingPlotId ? '✏️ Editing plot - click to add/modify vertices' : 'Click to add vertices. Double-click to complete.'}
                            </p>
                            <p className="text-gray-400 text-sm">Points: {currentPolygon.length}</p>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleUndo}
                                    disabled={currentPolygon.length === 0}
                                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:opacity-50 text-white py-2 px-3 rounded-lg text-sm"
                                >
                                    ↩ Undo
                                </button>
                                <button
                                    onClick={handleClear}
                                    disabled={currentPolygon.length === 0}
                                    className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:opacity-50 text-white py-2 px-3 rounded-lg text-sm"
                                >
                                    Clear
                                </button>
                            </div>

                            {currentPolygon.length >= 3 && (
                                <button
                                    onClick={handleDoubleClick}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
                                >
                                    ✓ Complete Polygon
                                </button>
                            )}

                            <button
                                onClick={cancelDrawing}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* Plot Form */}
                {selectedPlot && (
                    <div className="bg-gray-700 rounded-lg p-4">
                        <h3 className="text-white font-semibold mb-3">
                            {editingPlotId ? 'Edit Plot Details' : 'New Plot Details'}
                        </h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Plot Number (e.g., 01)"
                                value={formData.number}
                                onChange={e => setFormData(prev => ({ ...prev, number: e.target.value }))}
                                className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500"
                            />
                            <input
                                type="number"
                                placeholder="Area (Sq.ft)"
                                value={formData.area}
                                onChange={e => setFormData(prev => ({ ...prev, area: e.target.value }))}
                                className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500"
                            />
                            <select
                                value={formData.facing}
                                onChange={e => setFormData(prev => ({ ...prev, facing: e.target.value }))}
                                className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500"
                            >
                                <option>East</option>
                                <option>West</option>
                                <option>North</option>
                                <option>South</option>
                            </select>
                            <select
                                value={formData.type}
                                onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500"
                            >
                                <option>Residential</option>
                                <option>Commercial</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Price per Sq.ft"
                                value={formData.pricePerSqft}
                                onChange={e => setFormData(prev => ({ ...prev, pricePerSqft: e.target.value }))}
                                className="w-full bg-gray-600 text-white px-3 py-2 rounded border border-gray-500"
                            />

                            <div className="grid grid-cols-2 gap-2">
                                <input placeholder="North (ft)" value={formData.measurements.n} onChange={e => setFormData(prev => ({ ...prev, measurements: { ...prev.measurements, n: e.target.value } }))} className="bg-gray-600 text-white px-2 py-1 rounded text-sm" />
                                <input placeholder="East (ft)" value={formData.measurements.e} onChange={e => setFormData(prev => ({ ...prev, measurements: { ...prev.measurements, e: e.target.value } }))} className="bg-gray-600 text-white px-2 py-1 rounded text-sm" />
                                <input placeholder="South (ft)" value={formData.measurements.s} onChange={e => setFormData(prev => ({ ...prev, measurements: { ...prev.measurements, s: e.target.value } }))} className="bg-gray-600 text-white px-2 py-1 rounded text-sm" />
                                <input placeholder="West (ft)" value={formData.measurements.w} onChange={e => setFormData(prev => ({ ...prev, measurements: { ...prev.measurements, w: e.target.value } }))} className="bg-gray-600 text-white px-2 py-1 rounded text-sm" />
                            </div>

                            <button
                                onClick={handleSavePlot}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
                            >
                                {editingPlotId ? '💾 Update Plot' : '💾 Save Plot'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Plots List */}
                <div className="bg-gray-700 rounded-lg p-4 flex-1">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-white font-semibold">Saved Plots ({plots.length})</h3>
                    </div>

                    {/* Import/Export */}
                    <div className="flex gap-2 mb-3">
                        <label className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-1 px-2 rounded text-xs text-center cursor-pointer">
                            Import
                            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                        </label>
                        {plots.length > 0 && (
                            <button onClick={handleExport} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-1 px-2 rounded text-xs">
                                Export
                            </button>
                        )}
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {plots.map(plot => (
                            <div key={plot.id} className="flex justify-between items-center bg-gray-600 px-3 py-2 rounded group">
                                <span className="text-white">Plot #{plot.number}</span>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleEditPlot(plot)}
                                        className="text-blue-400 hover:text-blue-300 text-sm px-2"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDeletePlot(plot.id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center text-xs text-gray-500">
                    Plots auto-save to browser. Visit public view to see them.
                </div>

                <Link to="/" className="text-gray-400 hover:text-white text-center py-2 bg-gray-700 rounded-lg transition-colors">
                    ← Back to Public View
                </Link>
            </div>

            {/* Right Panel - Canvas */}
            <div
                ref={containerRef}
                className="flex-1 overflow-hidden bg-white flex items-center justify-center"
            >
                <div className="relative w-full h-full flex items-center justify-center p-4">
                    <div className="relative inline-block shadow-2xl rounded-lg overflow-hidden" style={{ maxWidth: '90%', maxHeight: '90%' }}>
                        <img
                            src="/layouts/3d_render.png"
                            alt="Site Layout"
                            className="block w-full h-auto pointer-events-none select-none object-contain"
                            onLoad={(e) => setImageDimensions({ width: e.target.naturalWidth, height: e.target.naturalHeight })}
                        />
                        <svg
                            ref={svgRef}
                            viewBox={`0 0 ${imageDimensions.width} ${imageDimensions.height}`}
                            className="absolute inset-0 w-full h-full"
                            style={{ cursor: isDrawing ? 'crosshair' : 'default' }}
                            onClick={handleCanvasClick}
                            onDoubleClick={handleDoubleClick}
                        >
                            {/* Saved Plots */}
                            {plots.filter(p => p.id !== editingPlotId).map(plot => (
                                <g key={plot.id}>
                                    <path
                                        d={plot.svgPath}
                                        fill="rgba(34, 197, 94, 0.5)"
                                        stroke="#22c55e"
                                        strokeWidth="2"
                                        className="cursor-pointer hover:fill-green-400/60"
                                        onClick={(e) => { e.stopPropagation(); handleEditPlot(plot); }}
                                    />
                                    <text
                                        x={plot.centroidX}
                                        y={plot.centroidY}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="white"
                                        fontSize="14"
                                        fontWeight="bold"
                                        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)', pointerEvents: 'none' }}
                                    >
                                        {plot.number}
                                    </text>
                                </g>
                            ))}

                            {/* Current Drawing */}
                            {currentPolygon.length > 0 && (
                                <g>
                                    {/* Filled preview when 3+ points */}
                                    {currentPolygon.length >= 3 && (
                                        <polygon
                                            points={currentPolygon.map(p => `${p.x},${p.y}`).join(' ')}
                                            fill="rgba(59, 130, 246, 0.3)"
                                            stroke="#3b82f6"
                                            strokeWidth="2"
                                        />
                                    )}
                                    {/* Lines */}
                                    <polyline
                                        points={currentPolygon.map(p => `${p.x},${p.y}`).join(' ')}
                                        fill="none"
                                        stroke="#3b82f6"
                                        strokeWidth="2"
                                        strokeDasharray={currentPolygon.length < 3 ? "5,5" : "none"}
                                    />
                                    {/* Vertices */}
                                    {currentPolygon.map((point, i) => (
                                        <g key={i}>
                                            <circle
                                                cx={point.x}
                                                cy={point.y}
                                                r="8"
                                                fill={i === 0 ? '#22c55e' : '#3b82f6'}
                                                stroke="white"
                                                strokeWidth="2"
                                                className="cursor-move"
                                            />
                                            <text
                                                x={point.x}
                                                y={point.y - 15}
                                                textAnchor="middle"
                                                fill="white"
                                                fontSize="10"
                                                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                                            >
                                                {i + 1}
                                            </text>
                                        </g>
                                    ))}
                                </g>
                            )}
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
