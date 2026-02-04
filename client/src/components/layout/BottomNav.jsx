import { LayoutGrid, FileText, MapPin } from 'lucide-react';

const tabs = [
    { id: 'layout', label: 'Availability Layout', icon: LayoutGrid },
    { id: 'details', label: 'Details Media', icon: FileText },
    { id: 'location', label: 'Location Map', icon: MapPin },
];

export default function BottomNav({ activeTab, onTabChange }) {
    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
            <nav className="glass-panel px-2 py-2 rounded-2xl flex items-center gap-1 shadow-2xl">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300
                ${isActive
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                }
              `}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'animate-bounce' : ''}`} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
