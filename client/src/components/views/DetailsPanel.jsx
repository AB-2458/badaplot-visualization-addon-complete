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
        <div className="h-full bg-white overflow-y-auto pb-24 pt-28">
            {/* Quick Stats Section */}
            <div className="flex justify-between items-center p-6 bg-white border-b border-gray-200">
                <div className="bg-gray-50 px-4 py-2 rounded-lg">
                    <span className="block text-gray-500 text-xs">Total Area</span>
                    <span className="font-semibold text-gray-900">5.2 Acres</span>
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-lg">
                    <span className="block text-gray-500 text-xs">Total Plots</span>
                    <span className="font-semibold text-gray-900">62 Units</span>
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-lg">
                    <span className="block text-gray-500 text-xs">Starting From</span>
                    <span className="font-semibold text-gray-900">₹ 12 Lakhs</span>
                </div>
            </div>

            {/* Gallery Section */}
            <div className="p-6 bg-white border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Image className="w-5 h-5 text-primary" /> Gallery
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className="aspect-video bg-gray-50 rounded-xl overflow-hidden hover:ring-2 hover:ring-primary transition-all cursor-pointer border border-gray-100 shadow-sm"
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
            <div className="p-6 bg-white border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald" /> Amenities
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {amenities.map((amenity, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-5 h-5 bg-emerald/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-emerald" />
                            </div>
                            {amenity}
                        </div>
                    ))}
                </div>
            </div>

            {/* Pricing Section */}
            <div className="p-6 bg-white border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" /> Pricing
                </h3>
                <div className="space-y-3">
                    {pricings.map((p, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-xl p-4 flex justify-between items-center border border-gray-200 shadow-sm">
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
            <div className="p-6 bg-white border-b border-gray-200">
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
                        <span>{project?.email || 'sales@padmalaxmirealty.com'}</span>
                    </a>
                </div>
            </div>

            {/* Downloads Section */}
            <div className="p-6 bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-primary" /> Downloads
                </h3>
                <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-colors group shadow-sm">
                        <span className="text-sm font-medium text-gray-900 group-hover:text-primary">Project Brochure</span>
                        <Download className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-colors group shadow-sm">
                        <span className="text-sm font-medium text-gray-900 group-hover:text-primary">Layout PDF</span>
                        <Download className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
