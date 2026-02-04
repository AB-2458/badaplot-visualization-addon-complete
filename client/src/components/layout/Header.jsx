import { Share2, MapPin, Calendar } from 'lucide-react';

export default function Header({ projectName, location, onScheduleVisit }) {
    return (
        <header className="absolute top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm px-6 py-3 flex items-center justify-between">
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
                        {projectName || 'Archer Homes 3d'}
                        <Share2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-primary transition-colors" />
                    </h1>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {location || 'Kurnool, Andhra Pradesh'}
                    </p>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-6">
                <a href="/admin" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    Admin
                </a>
                <a href="#" className="flex items-center gap-1 text-xs font-semibold text-pink-500 hover:text-pink-600 transition-colors">
                    <span className="opacity-70 text-gray-400 font-normal">Powered by</span> Badaplot
                </a>

                <button
                    onClick={onScheduleVisit}
                    className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md shadow-primary/30 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
                >
                    <Calendar className="w-4 h-4" />
                    Schedule Site Visit
                </button>
            </div>
        </header>
    );
}

