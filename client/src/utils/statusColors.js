// Status color mapping for plot visualization
export const statusColors = {
    'Available': '#22c55e',
    'Sold': '#ef4444',
    'Tentatively Booked': '#ec4899',
    'Booked': '#ec4899',
    'Hold': '#f97316',
    'Provisional': '#84cc16',
    'Registered': '#8b5cf6',
    'Mortgaged': '#a16207',
};

// Get color for a status
export const getStatusColor = (status) => {
    return statusColors[status] || '#94a3b8'; // default gray
};

// Status labels for display
export const statusLabels = [
    { key: 'Available', label: 'Available', color: '#22c55e' },
    { key: 'Sold', label: 'Sold', color: '#ef4444' },
    { key: 'Tentatively Booked', label: 'Tentatively Booked', color: '#ec4899' },
    { key: 'Hold', label: 'Hold', color: '#f97316' },
    { key: 'Provisional', label: 'Provisional', color: '#84cc16' },
    { key: 'Registered', label: 'Registered', color: '#8b5cf6' },
    { key: 'Mortgaged', label: 'Mortgaged', color: '#a16207' },
];

// Format currency in Indian Rupees
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

// Format area with units
export const formatArea = (sqft) => {
    const cents = (sqft * 0.0023).toFixed(2);
    return { sqft: sqft.toLocaleString(), cents };
};
