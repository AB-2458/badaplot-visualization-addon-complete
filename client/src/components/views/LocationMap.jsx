export default function LocationMap({ coordinates, address }) {
    // Google Maps embed URL
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${coordinates.lat},${coordinates.lng}&zoom=15`;

    return (
        <div className="h-full flex flex-col bg-gray-100 p-4">
            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
                {/* Address Card */}
                <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">Project Location</h3>
                            <p className="text-gray-600 text-sm">{address}</p>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm font-medium inline-flex items-center gap-1 mt-2"
                            >
                                Get Directions
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Map Container */}
                <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden min-h-[400px]">
                    <iframe
                        src={mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0, minHeight: '400px' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Project Location"
                    />
                </div>

                {/* Coordinates Info */}
                <div className="bg-white rounded-xl shadow-lg p-4 mt-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Coordinates:</span>
                        <span className="font-mono text-gray-700">{coordinates.lat}, {coordinates.lng}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
