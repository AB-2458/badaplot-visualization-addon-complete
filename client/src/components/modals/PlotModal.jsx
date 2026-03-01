import { useState } from 'react';
import { X, Phone, MessageCircle, MapPin, ExternalLink, Compass, Share2 } from 'lucide-react';
import { formatCurrency, getStatusColor } from '../../utils/statusColors';
import EnquiryModal from './EnquiryModal';
import ShareModal from './ShareModal';

export default function PlotModal({ plot, project, onClose, onStatusChange }) {
    const [showEnquiry, setShowEnquiry] = useState(false);
    const [showShare, setShowShare] = useState(false);

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
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-card text-card-foreground rounded-xl border border-border shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <div>
                        <h2 className="text-lg font-bold text-foreground">{project?.name || 'Project'}</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <a href={`tel:${project?.phone}`} className="text-sm text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors">
                                <Phone className="w-3 h-3" /> {project?.phone || '9014975206'}
                            </a>
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald flex items-center gap-1 hover:text-emerald/80 transition-colors">
                                <MessageCircle className="w-3 h-3" /> WhatsApp
                            </a>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Unit Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                                Unit {plot.number}
                                <button onClick={() => setShowShare(true)} className="focus:outline-none">
                                    <Share2 className="w-5 h-5 text-gray-400 hover:text-primary transition-colors cursor-pointer" />
                                </button>
                            </h2>
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
                        <span className="px-3 py-1 bg-muted rounded-full text-sm font-medium text-muted-foreground">
                            {plot.type}
                        </span>
                        <span className="px-3 py-1 bg-primary/10 rounded-full text-sm font-medium text-primary flex items-center gap-1">
                            <Compass className="w-3 h-3" /> {plot.facing}
                        </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                        <div>
                            <p className="text-sm text-muted-foreground">Area</p>
                            <p className="font-semibold text-foreground">{area.toLocaleString()} Sq.ft</p>
                            <p className="text-sm text-muted-foreground/80">{cents} Cents</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Facing</p>
                            <p className="font-semibold text-foreground">{plot.facing}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Cost per Sq.ft</p>
                            <p className="font-semibold text-foreground">{formatCurrency(pricePerSqft)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Price</p>
                            <p className="font-bold text-xl text-emerald">{formatCurrency(totalPrice)}</p>
                        </div>
                    </div>

                    {/* Measurements */}
                    {plot.measurements && (
                        <div className="bg-background rounded-lg p-3 border border-border">
                            <p className="text-sm text-muted-foreground mb-2">Measurements</p>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                <div>
                                    <p className="text-xs text-muted-foreground/70">North</p>
                                    <p className="font-semibold">{plot.measurements.n || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground/70">East</p>
                                    <p className="font-semibold">{plot.measurements.e || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground/70">South</p>
                                    <p className="font-semibold">{plot.measurements.s || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground/70">West</p>
                                    <p className="font-semibold">{plot.measurements.w || '-'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Status Update (Admin) */}
                    <div className="py-2">
                        <label className="block text-sm font-medium text-muted-foreground mb-2">Update Status</label>
                        <select
                            value={plot.status}
                            onChange={(e) => onStatusChange && onStatusChange(plot.id, e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
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
                        className="flex items-start gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground/70" />
                        <span>{project?.address || project?.location || 'Daund, Maharashtra'}</span>
                    </a>
                </div>

                {/* Footer - Conditional Booking CTA */}
                <div className="p-4 border-t border-border flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-2 border border-border bg-background hover:bg-muted text-foreground rounded-lg transition-colors font-medium">
                        Close
                    </button>
                    {plot.status !== 'Sold' && (
                        <button
                            onClick={() => setShowEnquiry(true)}
                            className="flex-1 bg-emerald hover:bg-emerald/90 text-white px-4 py-2 rounded-lg font-semibold text-center flex items-center justify-center gap-2 transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Enquire Now
                        </button>
                    )}
                </div>

                {showEnquiry && (
                    <EnquiryModal
                        plot={plot}
                        project={project}
                        onClose={() => setShowEnquiry(false)}
                    />
                )}

                {showShare && (
                    <ShareModal
                        project={project}
                        url={`${window.location.origin}${window.location.pathname}?plot=${plot.number}`}
                        title={`${project?.name} - Plot ${plot.number}`}
                        onClose={() => setShowShare(false)}
                    />
                )}
            </div>
        </div>
    );
}
