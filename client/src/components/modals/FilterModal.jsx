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
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">Filter Plots</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Unit Numbers */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Unit numbers
                        </label>
                        <input
                            type="text"
                            placeholder="Plot numbers (Eg : 1,24)"
                            value={filters.unitNumbers}
                            onChange={(e) => setFilters(prev => ({ ...prev, unitNumbers: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    {/* Facing */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Facing
                        </label>
                        <select
                            value={filters.facing}
                            onChange={(e) => setFilters(prev => ({ ...prev, facing: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                            {facingOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                            <option value="All">All</option>
                            {statusLabels.map(status => (
                                <option key={status.key} value={status.key}>{status.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Type / Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type / Category
                        </label>
                        <select
                            value={filters.type}
                            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                            {typeOptions.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-3">
                    <button
                        onClick={handleReset}
                        className="flex-1 btn-success"
                    >
                        RESET
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 btn-primary"
                    >
                        FILTER
                    </button>
                </div>
            </div>
        </div>
    );
}
