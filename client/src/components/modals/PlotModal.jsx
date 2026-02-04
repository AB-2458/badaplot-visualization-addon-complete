import { X, Phone, MessageCircle, MapPin, ExternalLink, Compass } from 'lucide-react';
import { formatCurrency, getStatusColor } from '../../utils/statusColors';

export default function PlotModal({ plot, project, onClose, onStatusChange }) {
    if (!plot) return null;

    const cents = (plot.area ? plot.area * 0.0023 : plot.areaSqft ? plot.areaSqft * 0.0023 : 0).toFixed(2);
    const area = plot.area || plot.areaSqft || 0;
    const pricePerSqft = plot.pricePerSqft || 0;
    const totalPrice = plot.totalPrice || (area * pricePerSqft);
    const statuses = ['Available', 'Sold', 'Tentatively Booked', 'Hold', 'Registered', 'Mortgaged'];

    // WhatsApp message
    const whatsappMsg = encodeURIComponent(
        `Hi, I'm interested in Plot #${plot.number} (${area} Sq.ft, ${plot.facing} facing) at ${project?.name}. Please share more details.`
    );
    const whatsappUrl = `https://wa.me/${project?.whatsapp?.replace(/\D/g, '')}?text=${whatsappMsg}`;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{project?.name || 'Project'}</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <a href={`tel:${project?.phone}`} className="text-sm text-gray-500 flex items-center gap-1 hover:text-primary">
                                <Phone className="w-3 h-3" /> {project?.phone || '9014975206'}
                            </a>
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 flex items-center gap-1 hover:text-green-700">
                                <MessageCircle className="w-3 h-3" /> WhatsApp
                            </a>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Unit Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-primary">Unit {plot.number}</span>
                            {project?.tourUrl && (
                                <a
                                    href={project.tourUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline flex items-center gap-1 bg-primary/10 px-2 py-1 rounded"
                                >
                                    View 360 Tour <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                        <span
                            className="px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: getStatusColor(plot.status) }}
                        >
                            {plot.status}
                        </span>
                    </div>

                    {/* Type Badge */}
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                            {plot.type}
                        </span>
                        <span className="px-3 py-1 bg-blue-50 rounded-full text-sm font-medium text-blue-700 flex items-center gap-1">
                            <Compass className="w-3 h-3" /> {plot.facing}
                        </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
                        <div>
                            <p className="text-sm text-gray-500">Area</p>
                            <p className="font-semibold">{area.toLocaleString()} Sq.ft</p>
                            <p className="text-sm text-gray-600">{cents} Cents</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Facing</p>
                            <p className="font-semibold">{plot.facing}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Cost per Sq.ft</p>
                            <p className="font-semibold">{formatCurrency(pricePerSqft)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Price</p>
                            <p className="font-bold text-xl text-green-600">{formatCurrency(totalPrice)}</p>
                        </div>
                    </div>

                    {/* Measurements */}
                    {plot.measurements && (
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm text-gray-500 mb-2">Measurements</p>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                <div>
                                    <p className="text-xs text-gray-400">North</p>
                                    <p className="font-semibold">{plot.measurements.n || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">East</p>
                                    <p className="font-semibold">{plot.measurements.e || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">South</p>
                                    <p className="font-semibold">{plot.measurements.s || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">West</p>
                                    <p className="font-semibold">{plot.measurements.w || '-'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Status Update (Admin) */}
                    <div className="py-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                        <select
                            value={plot.status}
                            onChange={(e) => onStatusChange && onStatusChange(plot.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                            {statuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    {/* Location */}
                    <a
                        href={`https://maps.google.com/?q=${project?.coordinates?.lat},${project?.coordinates?.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 text-sm text-gray-600 hover:text-primary"
                    >
                        <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                        <span>{project?.address || project?.location || 'Kurnool, Andhra Pradesh'}</span>
                    </a>
                </div>

                {/* Footer - Conditional Booking CTA */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
                        Close
                    </button>
                    {plot.status !== 'Sold' && (
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-center flex items-center justify-center gap-2"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Booking Enquiry
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
