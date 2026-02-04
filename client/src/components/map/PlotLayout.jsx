import { useState, useRef, useEffect } from 'react';
import { getStatusColor } from '../../utils/statusColors';
import { clientToSVG } from '../../utils/coordinateTransform';
import PlotTooltip from './PlotTooltip';
import LayoutControls from '../layout/LayoutControls';

export default function PlotLayout({
    plots,
    svgViewbox, // Now optional - will be calculated from image
    imageUrl = "/layouts/3d_render.png", // AI-generated 3D render
    onPlotClick,
    selectedPlotId
}) {
    // Image dimensions state (single source of truth for coordinates)
    const [imageDimensions, setImageDimensions] = useState(null);
    const [hoveredPlot, setHoveredPlot] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(0.85);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const imageRef = useRef(null);

    // Handle image load to capture dimensions
    const handleImageLoad = (e) => {
        const width = e.target.naturalWidth;
        const height = e.target.naturalHeight;

        setImageDimensions({ width, height });

        console.log(`[Badaplot] Image loaded: ${width}x${height}px`);
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;
            setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            setDragStart({ x: e.clientX, y: e.clientY });
        } else {
            setTooltipPosition({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseDown = (e) => {
        if (e.target.tagName !== 'path') {
            setIsDragging(true);
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(prev => Math.max(0.4, Math.min(4, prev + delta)));
    };

    const handleZoomIn = () => setZoom(prev => Math.min(4, prev + 0.2));
    const handleZoomOut = () => setZoom(prev => Math.max(0.4, prev - 0.2));
    const handleReset = () => { setZoom(0.85); setPan({ x: 0, y: 0 }); };
    const handleFullscreen = () => containerRef.current?.requestFullscreen();

    // Calculate dynamic viewBox from image dimensions or use provided
    const dynamicViewBox = imageDimensions
        ? `0 0 ${imageDimensions.width} ${imageDimensions.height}`
        : (svgViewbox || "0 0 1600 900"); // Fallback to prop or default

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-[#f8fafc] overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { setHoveredPlot(null); setIsDragging(false); }}
            onWheel={handleWheel}
        >
            <div
                className="relative w-full h-full transform-gpu origin-center will-change-transform"
                style={{
                    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                    transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <div className="relative inline-block shadow-2xl rounded-lg overflow-hidden">

                    {/* Site Plan Background - Dynamic Dimensions */}
                    <img
                        ref={imageRef}
                        src={imageUrl}
                        alt="Site Plan Render"
                        className="block max-w-none pointer-events-none select-none"
                        style={{
                            width: imageDimensions ? `${imageDimensions.width}px` : 'auto',
                            height: 'auto'
                        }}
                        onLoad={handleImageLoad}
                    />

                    {/* SVG Overlay - Matches Image Dimensions Exactly */}
                    <svg
                        ref={svgRef}
                        viewBox={dynamicViewBox}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{
                            width: imageDimensions ? `${imageDimensions.width}px` : '100%',
                            height: '100%'
                        }}
                    >
                        {plots.map((plot) => {
                            const isSelected = selectedPlotId === plot.id;
                            const isHovered = hoveredPlot?.id === plot.id;

                            return (
                                <g key={plot.id} className="group pointer-events-auto transition-opacity duration-300">

                                    {/* The Plot Shape */}
                                    <path
                                        d={plot.svgPath}
                                        fill={getStatusColor(plot.status)}
                                        style={{
                                            mixBlendMode: 'normal', // Solid color to cover text
                                            fillOpacity: isSelected ? 0.9 : isHovered ? 0.8 : 0.7,
                                            filter: isSelected ? 'drop-shadow(0 0 8px rgba(255,255,255,0.6))' : 'none',
                                            stroke: isSelected ? '#fff' : 'rgba(255,255,255,0.9)',
                                            strokeWidth: isSelected ? 3 : 1.5,
                                            transition: 'all 0.2s ease-out'
                                        }}
                                        className="cursor-pointer"
                                        onMouseEnter={() => setHoveredPlot(plot)}
                                        onMouseLeave={() => setHoveredPlot(null)}
                                        onClick={() => onPlotClick && onPlotClick(plot)}
                                    />

                                    {/* Plot Number */}
                                    <text
                                        x={plot.centroidX}
                                        y={plot.centroidY}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="white"
                                        fontSize={isSelected ? "14" : "11"}
                                        fontWeight="700"
                                        className="pointer-events-none select-none font-poppins"
                                        style={{
                                            textShadow: '0 1px 3px rgba(0,0,0,0.6)',
                                            opacity: 0.9,
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {plot.number}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>

            <LayoutControls
                zoom={zoom}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onReset={handleReset}
                onFullscreen={handleFullscreen}
            />

            {hoveredPlot && (
                <PlotTooltip
                    plot={hoveredPlot}
                    position={tooltipPosition}
                />
            )}
        </div>
    );
}
