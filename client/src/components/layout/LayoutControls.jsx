import { Plus, Minus, RotateCcw, Maximize2, Navigation } from 'lucide-react';

export default function LayoutControls({
    onZoomIn,
    onZoomOut,
    onReset,
    onFullscreen,
    zoom = 1
}) {
    return (
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">

            {/* Zoom Group */}
            <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-1.5 flex flex-col gap-1 border border-white/50">
                <button
                    onClick={onZoomIn}
                    disabled={zoom >= 3}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 disabled:opacity-40 transition-colors"
                    title="Zoom In"
                >
                    <Plus className="w-5 h-5" />
                </button>
                <div className="h-px bg-gray-200 w-full mx-auto"></div>
                <button
                    onClick={onZoomOut}
                    disabled={zoom <= 0.5}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 disabled:opacity-40 transition-colors"
                    title="Zoom Out"
                >
                    <Minus className="w-5 h-5" />
                </button>
            </div>

            {/* Reset & Fullscreen */}
            <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-1.5 flex flex-col gap-1 border border-white/50">
                <button
                    onClick={onReset}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                    title="Reset View"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>

                <div className="h-px bg-gray-200 w-full mx-auto"></div>

                <button
                    onClick={onFullscreen}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                    title="Fullscreen"
                >
                    <Maximize2 className="w-4 h-4" />
                </button>
            </div>

            {/* Compass - Floating separate */}
            <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-full w-12 h-12 flex items-center justify-center border-2 border-white mt-2">
                <Navigation
                    className="w-5 h-5 text-red-500 drop-shadow-sm"
                    style={{ transform: 'rotate(-45deg)' }}
                />
            </div>

        </div>
    );
}
