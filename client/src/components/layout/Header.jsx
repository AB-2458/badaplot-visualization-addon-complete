import { Share2, MapPin, Calendar } from 'lucide-react';

import { Link } from 'react-router-dom';

export default function Header({ projectName, location, onScheduleVisit, onShare }) {
    return (
        <header className="absolute top-0 left-0 right-0 z-40 bg-white mx-4 mt-4 px-6 py-3 flex items-center justify-between rounded-xl shadow-md border border-gray-100">
            {/* Left: Branding */}
            <div className="flex items-center gap-4">
                <img
                    src="/logo-placeholder.png"
                    alt="Logo"
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                    }}
                />
                <div>
                    <h1 className="text-xl font-bold text-gray-900 leading-tight flex items-center gap-2">
                        {projectName || 'Padmalaxmi Realty'}
                        <button onClick={onShare} className="focus:outline-none flex items-center justify-center">
                            <Share2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-primary transition-colors" />
                        </button>
                    </h1>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {location || 'Daund, Maharashtra'}
                    </p>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-6">
                <Link to="/admin" className="text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium">
                    Admin
                </Link>
                <a href="#" className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                    <span className="opacity-70 text-gray-400 font-normal">Powered by</span> Badaplot
                </a>

                <button
                    onClick={onScheduleVisit}
                    className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md shadow-primary/30 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                >
                    <Calendar className="w-4 h-4" />
                    Schedule Site Visit
                </button>
            </div>
        </header>
    );
}

