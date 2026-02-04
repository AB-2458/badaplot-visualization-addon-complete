import { useState } from 'react';
import { LayoutGrid, Filter, X } from 'lucide-react';
import { formatCurrency, getStatusColor, statusLabels } from '../../utils/statusColors';

export default function InventoryReport({ plots, onPlotClick, onBackToLayout }) {
    const [filter, setFilter] = useState('All');

    const filteredPlots = filter === 'All'
        ? plots
        : plots.filter(p => p.status === filter);

    return (
        <div className="h-full bg-gray-900 overflow-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur border-b border-gray-700 p-4 z-10">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-white">Inventory Report</h2>
                    <button
                        onClick={onBackToLayout}
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark rounded-lg text-sm text-white font-medium transition-colors"
                    >
                        <LayoutGrid className="w-4 h-4" />
                        Back to Layout
                    </button>
                </div>

                {/* Filter Chips */}
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setFilter('All')}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === 'All'
                                ? 'bg-white text-gray-900'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        All ({plots.length})
                    </button>
                    {statusLabels.map(status => {
                        const count = plots.filter(p => p.status === status.key).length;
                        if (count === 0) return null;
                        return (
                            <button
                                key={status.key}
                                onClick={() => setFilter(status.key)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${filter === status.key
                                        ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900'
                                        : 'hover:opacity-80'
                                    }`}
                                style={{ backgroundColor: status.color, color: 'white' }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                {status.label}: {count}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Grid */}
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredPlots.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        No plots found with status "{filter}"
                    </div>
                ) : (
                    filteredPlots.map((plot) => {
                        const area = plot.area || plot.areaSqft || 0;
                        const totalPrice = plot.totalPrice || (area * (plot.pricePerSqft || 0));

                        return (
                            <div
                                key={plot.id}
                                onClick={() => onPlotClick(plot)}
                                className="bg-gray-800 rounded-xl p-4 cursor-pointer hover:ring-2 hover:ring-primary transition-all hover:scale-[1.02] group"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <span className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                                        {plot.number}
                                    </span>
                                    <span
                                        className="px-2 py-0.5 rounded text-xs font-medium text-white"
                                        style={{ backgroundColor: getStatusColor(plot.status) }}
                                    >
                                        {plot.status}
                                    </span>
                                </div>

                                {/* Price */}
                                <p className="text-lg font-bold text-green-400 mb-3">
                                    {formatCurrency(totalPrice)}
                                </p>

                                {/* Details */}
                                <div className="space-y-1 text-xs text-gray-400">
                                    <p className="flex justify-between">
                                        <span>Type:</span>
                                        <span className="text-gray-300">{plot.type}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Area:</span>
                                        <span className="text-gray-300">{area.toLocaleString()} Sq.ft</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Facing:</span>
                                        <span className="text-gray-300">{plot.facing}</span>
                                    </p>
                                </div>

                                {/* Bottom Stripe */}
                                <div
                                    className="h-1 w-full mt-3 rounded-full"
                                    style={{ backgroundColor: getStatusColor(plot.status) }}
                                ></div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
