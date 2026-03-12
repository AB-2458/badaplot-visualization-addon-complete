import { useState, useRef } from 'react';
import { getStatusColor } from '../../utils/statusColors';
import PlotTooltip from './PlotTooltip';
import LayoutControls from '../layout/LayoutControls';

export default function PlotLayout({
    plots,
    svgViewbox,
    imageUrl = "/layouts/3d_render.png",
    onPlotClick,
    selectedPlotId
}) {
    const [imageDimensions, setImageDimensions] = useState(null);
    const [hoveredPlot, setHoveredPlot] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);

    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const imageRef = useRef(null);

    const handleImageLoad = (e) => {
        setImageDimensions({ width: e.target.naturalWidth, height: e.target.naturalHeight });
    };

    const handleMouseMove = (e) => {
        setTooltipPosition({ x: e.clientX, y: e.clientY });
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
    };

    const handleZoomIn = () => setZoom(prev => Math.min(3, prev + 0.2));
    const handleZoomOut = () => setZoom(prev => Math.max(0.5, prev - 0.2));
    const handleReset = () => setZoom(1);
    const handleFullscreen = () => containerRef.current?.requestFullscreen();

    const dynamicViewBox = imageDimensions
        ? `0 0 ${imageDimensions.width} ${imageDimensions.height}`
        : (svgViewbox || "0 0 1600 900");

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full bg-white overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredPlot(null)}
            onWheel={handleWheel}
        >
            {/* Centered, locked container — only zoom scales it */}
            <div
                className="w-full h-full flex items-center justify-center p-4"
            >
                <div
                    className="relative shadow-2xl rounded-lg overflow-hidden transform-gpu origin-center will-change-transform inline-flex"
                    style={{
                        transform: `scale(${zoom})`,
                        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    {/* Site Plan Image — locked in place */}
                    <img
                        ref={imageRef}
                        src={imageUrl}
                        alt="Site Plan Render"
                        className="block w-auto h-auto pointer-events-none select-none object-contain"
                        style={{ maxWidth: '90vw', maxHeight: '80vh' }}
                        onLoad={handleImageLoad}
                    />

                    {/* SVG Overlay */}
                    <svg
                        ref={svgRef}
                        viewBox={dynamicViewBox}
                        className="absolute inset-0 w-full h-full pointer-events-none"
                    >
                        {plots.map((plot) => {
                            const isSelected = selectedPlotId === plot.id;
                            const isHovered = hoveredPlot?.id === plot.id;

                            return (
                                <g key={plot.id} className="group pointer-events-auto transition-opacity duration-300">
                                    <path
                                        d={plot.svgPath}
                                        fill={getStatusColor(plot.status)}
                                        style={{
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
                                    <text
                                        x={plot.centroidX}
                                        y={plot.centroidY}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="white"
                                        fontSize={isSelected ? "14" : "11"}
                                        fontWeight="700"
                                        className="pointer-events-none select-none font-sans"
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
