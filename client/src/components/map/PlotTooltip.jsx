import { formatCurrency, getStatusColor } from '../../utils/statusColors';

export default function PlotTooltip({ plot, position }) {
    if (!plot) return null;

    const area = plot.area || plot.areaSqft || 0;
    const cents = (area * 0.0023).toFixed(2);
    const pricePerSqft = plot.pricePerSqft || 0;
    const totalPrice = plot.totalPrice || (area * pricePerSqft);
    const isLeft = position.x > window.innerWidth - 320;

    return (
        <div
            className="fixed z-50 pointer-events-none filter drop-shadow-xl animate-slide-up"
            style={{
                left: position.x + (isLeft ? -20 : 20),
                top: position.y + 20,
                transform: isLeft ? 'translateX(-100%)' : 'none'
            }}
        >
            {/* Tooltip Arrow */}
            <div className={`absolute -top-2 ${isLeft ? 'right-4' : 'left-4'} w-4 h-4 bg-white rotate-45 transform border-t border-l border-gray-100`}></div>

            {/* Main Container */}
            <div className="bg-white rounded-lg overflow-hidden min-w-[280px] border border-gray-100 shadow-xl">

                {/* Header Bar */}
                <div className="bg-gradient-to-r from-gray-50 to-white px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <span className="text-primary font-bold text-lg">Unit {plot.number}</span>
                        <span
                            className="px-2 py-0.5 rounded text-xs font-medium text-white"
                            style={{ backgroundColor: getStatusColor(plot.status) }}
                        >
                            {plot.status}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500 font-medium mt-1">
                        {plot.type} • {plot.facing} Facing
                    </div>
                </div>

                {/* Content Body */}
                <div className="bg-gray-50/50">
                    {/* Row 1: Area */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Area</span>
                        <span className="text-sm font-semibold text-gray-800">
                            {area.toLocaleString()} Sq.ft ({cents} Cents)
                        </span>
                    </div>

                    {/* Row 2: Cost per sq ft */}
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Cost/Sq.ft</span>
                        <span className="text-sm font-semibold text-gray-800">{formatCurrency(pricePerSqft)}</span>
                    </div>

                    {/* Row 3: Total Price */}
                    <div className="flex items-center justify-between px-4 py-3 bg-white">
                        <span className="text-sm text-gray-500">Total Price</span>
                        <span className="text-base font-bold text-green-600">{formatCurrency(totalPrice)}</span>
                    </div>
                </div>

                {/* Status Stripe */}
                <div className="h-1 w-full" style={{ backgroundColor: getStatusColor(plot.status) }}></div>
            </div>
        </div>
    );
}
