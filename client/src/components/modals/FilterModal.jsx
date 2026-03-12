import { useState } from 'react';
import { X } from 'lucide-react';
import { statusLabels } from '../../utils/statusColors';

export default function FilterModal({ onClose, onApply, initialFilters = {} }) {
    const [filters, setFilters] = useState({
        unitNumbers: initialFilters.unitNumbers || '',
        facing: initialFilters.facing || 'All',
        status: initialFilters.status || 'All',
        type: initialFilters.type || 'All',
    });

    const facingOptions = ['All', 'North', 'South', 'East', 'West'];
    const typeOptions = ['All', 'Residential', 'Commercial', 'Duplex'];

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleReset = () => {
        const resetFilters = {
            unitNumbers: '',
            facing: 'All',
            status: 'All',
            type: 'All',
        };
        setFilters(resetFilters);
        onApply(resetFilters);
    };

    return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={onClose}>
            <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-lg duration-200 sm:rounded-xl" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border pb-4">
                    <h2 className="text-lg font-bold text-card-foreground">Filter Plots</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    {/* Unit Numbers */}
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Unit numbers
                        </label>
                        <input
                            type="text"
                            placeholder="Plot numbers (Eg : 1,24)"
                            value={filters.unitNumbers}
                            onChange={(e) => setFilters(prev => ({ ...prev, unitNumbers: e.target.value }))}
                            className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        />
                    </div>

                    {/* Facing */}
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Facing
                        </label>
                        <select
                            value={filters.facing}
                            onChange={(e) => setFilters(prev => ({ ...prev, facing: e.target.value }))}
                            className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                            {facingOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Status
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                            <option value="All">All</option>
                            {statusLabels.map(status => (
                                <option key={status.key} value={status.key}>{status.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Type / Category */}
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Type / Category
                        </label>
                        <select
                            value={filters.type}
                            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                            {typeOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-border flex gap-3">
                    <button
                        onClick={handleReset}
                        className="flex-1 px-4 py-2 border border-border bg-background hover:bg-muted text-foreground rounded-lg font-medium transition-colors"
                    >
                        RESET
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
                    >
                        FILTER
                    </button>
                </div>
            </div>
        </div>
    );
}
