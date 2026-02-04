import { Image, FileText, Download, MapPin, Phone, Mail, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/statusColors';

export default function DetailsPanel({ project }) {
    // Mock gallery images - will be replaced with actual images
    const images = [
        '/layouts/3d_render.png',
        '/layouts/3d_render.png',
        '/layouts/3d_render.png',
        '/layouts/3d_render.png',
    ];

    const pricings = [
        { type: 'Residential', price: 1200, description: 'Standard residential plots' },
        { type: 'Commercial', price: 1500, description: 'Commercial/shop plots' },
        { type: 'Corner Plots', price: 1400, description: '10% premium for corners' },
    ];

    const amenities = [
        '40ft Wide Roads',
        '24/7 Security',
        'Underground Drainage',
        'Street Lights',
        'Water Supply',
        'Electricity Connection',
        'Children Play Area',
        'Green Belt',
        'Community Hall',
        'Temple/Prayer Hall',
    ];

    return (
        <div className="h-full bg-gray-50 overflow-y-auto">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">{project?.name || 'Archer Homes 3d'}</h2>
                <p className="text-white/80 flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4" />
                    {project?.location || 'Kurnool, Andhra Pradesh'}
                </p>
                <div className="flex gap-4 mt-4 text-sm">
                    <div className="bg-white/20 px-3 py-2 rounded-lg">
                        <span className="block text-white/70 text-xs">Total Area</span>
                        <span className="font-semibold">5.2 Acres</span>
                    </div>
                    <div className="bg-white/20 px-3 py-2 rounded-lg">
                        <span className="block text-white/70 text-xs">Total Plots</span>
                        <span className="font-semibold">62 Units</span>
                    </div>
                    <div className="bg-white/20 px-3 py-2 rounded-lg">
                        <span className="block text-white/70 text-xs">Starting From</span>
                        <span className="font-semibold">₹ 12 Lakhs</span>
                    </div>
                </div>
            </div>

            {/* Gallery Section */}
            <div className="p-6 bg-white border-b">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Image className="w-5 h-5 text-primary" /> Gallery
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className="aspect-video bg-gray-100 rounded-xl overflow-hidden hover:ring-2 hover:ring-primary transition-all cursor-pointer"
                        >
                            <img
                                src={img}
                                alt={`Gallery ${i + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Amenities Section */}
            <div className="p-6 bg-white border-b">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" /> Amenities
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {amenities.map((amenity, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-green-600" />
                            </div>
                            {amenity}
                        </div>
                    ))}
                </div>
            </div>

            {/* Pricing Section */}
            <div className="p-6 bg-white border-b">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" /> Pricing
                </h3>
                <div className="space-y-3">
                    {pricings.map((p, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-900">{p.type}</p>
                                <p className="text-xs text-gray-500">{p.description}</p>
                            </div>
                            <p className="text-lg font-bold text-primary">{formatCurrency(p.price)}/sq.ft</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Section */}
            <div className="p-6 bg-white border-b">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Us</h3>
                <div className="space-y-3">
                    <a href={`tel:${project?.phone}`} className="flex items-center gap-3 text-gray-700 hover:text-primary">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Phone className="w-5 h-5 text-primary" />
                        </div>
                        <span>{project?.phone || '+91 9876543210'}</span>
                    </a>
                    <a href={`mailto:${project?.email}`} className="flex items-center gap-3 text-gray-700 hover:text-primary">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <span>{project?.email || 'sales@archerhomes.com'}</span>
                    </a>
                </div>
            </div>

            {/* Downloads Section */}
            <div className="p-6 bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-primary" /> Downloads
                </h3>
                <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-indigo-100 transition-colors group">
                        <span className="text-sm font-medium text-gray-700 group-hover:text-primary">Project Brochure</span>
                        <Download className="w-4 h-4 text-primary" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-indigo-100 transition-colors group">
                        <span className="text-sm font-medium text-gray-700 group-hover:text-primary">Layout PDF</span>
                        <Download className="w-4 h-4 text-primary" />
                    </button>
                </div>
            </div>
        </div>
    );
}
