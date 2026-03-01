import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Image as ImageIcon, Video, X } from 'lucide-react';

export default function MediaGallery({ projectId }) {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchMedia = async () => {
            if (!projectId) return;

            setLoading(true);
            const { data, error } = await supabase
                .from('project_gallery')
                .select('*')
                .eq('project_id', projectId)
                .order('display_order', { ascending: true });

            if (!error && data) {
                setMedia(data);
            }
            setLoading(false);
        };
        fetchMedia();
    }, [projectId]);

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (media.length === 0) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium text-gray-500">No media available yet</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full overflow-y-auto bg-gray-50 p-4 md:p-8 pb-32">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Project Gallery</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {media.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative aspect-square"
                            onClick={() => setSelectedItem(item)}
                        >
                            {item.media_type === 'video' ? (
                                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                    <Video className="w-12 h-12 text-gray-400" />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                </div>
                            ) : (
                                <>
                                    <img
                                        src={item.url}
                                        alt={item.caption || 'Gallery image'}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                </>
                            )}

                            {/* Type Indicator */}
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-full p-1.5 text-white">
                                {item.media_type === 'video' ? <Video className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                            </div>

                            {/* Caption overlay */}
                            {item.caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                    <p className="text-white text-sm font-medium line-clamp-2">{item.caption}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {selectedItem && (
                <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
                    <button
                        onClick={() => setSelectedItem(null)}
                        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-[70]"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center relative">
                        {selectedItem.media_type === 'video' ? (
                            <video
                                src={selectedItem.url}
                                controls
                                autoPlay
                                className="max-w-full max-h-[80vh] rounded-lg shadow-2xl"
                            />
                        ) : (
                            <img
                                src={selectedItem.url}
                                alt={selectedItem.caption || 'Gallery image'}
                                className="max-w-full max-h-[80vh] object-contain shadow-2xl"
                            />
                        )}

                        {selectedItem.caption && (
                            <div className="mt-6 text-center">
                                <p className="text-white/90 text-lg font-medium max-w-2xl mx-auto">{selectedItem.caption}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
