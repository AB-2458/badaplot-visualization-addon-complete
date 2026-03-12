import { LayoutGrid, Filter } from 'lucide-react';
import { statusLabels } from '../../utils/statusColors';

export default function StatusBar({ plots, onInventoryClick, onFilterClick }) {
    // Calculate counts
    const statusCounts = statusLabels.reduce((acc, status) => {
        acc[status.key] = plots.filter(p => p.status === status.key).length;
        return acc;
    }, {});

    const totalPlots = plots.length;

    return (
        <div className="absolute top-[88px] left-0 right-0 z-30 px-6 py-2 flex items-center justify-between pointer-events-none">

            {/* Status Pills Container */}
            <div className="flex items-center gap-3 overflow-x-auto bg-white px-4 py-2 pointer-events-auto max-w-[80%] scrollbar-hide rounded-xl shadow-md border border-gray-100">

                {/* Total Badge */}
                <div className="status-pill-modern bg-green-700">
                    <span className="font-bold">Total: {totalPlots}</span>
                </div>

                {/* Dynamic Status Pills */}
                {statusLabels.map((status) => (
                    statusCounts[status.key] > 0 && (
                        <div
                            key={status.key}
                            className="status-pill-modern"
                            style={{ backgroundColor: status.color }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                            <span>{status.label}: {statusCounts[status.key]}</span>
                        </div>
                    )
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pointer-events-auto">
                <button
                    onClick={onFilterClick}
                    className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium shadow-md flex items-center gap-2 transition-transform hover:scale-105"
                >
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
                <button
                    onClick={onInventoryClick}
                    className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium shadow-md flex items-center gap-2 transition-transform hover:scale-105"
                >
                    <LayoutGrid className="w-4 h-4" />
                    Inventory Report
                </button>
            </div>

        </div>
    );
}
