import { Share2, Copy, MessageCircle, X, Check } from 'lucide-react';
import { useState } from 'react';

export default function ShareModal({ project, url, title, onClose }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const handleWhatsApp = () => {
        const text = encodeURIComponent(`Check out ${title || project?.name}: ${url}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title || project?.name,
                    text: `Check out ${title || project?.name}`,
                    url: url
                });
                onClose();
            } catch (err) {
                console.error('Error sharing', err);
            }
        } else {
            handleCopy();
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:fade-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-blue-600" /> Share Project
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 space-y-3">
                    {/* Share Link Preview */}
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="flex-1 truncate text-sm text-gray-600 font-medium">
                            {url}
                        </div>
                        <button
                            onClick={handleCopy}
                            className={`p-2 rounded-md flex-shrink-0 transition-colors ${copied ? 'bg-green-100 text-green-600' : 'bg-white border hover:bg-gray-50 text-gray-600'}`}
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button
                            onClick={handleWhatsApp}
                            className="flex flex-col items-center justify-center gap-2 p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-colors border border-green-200/50"
                        >
                            <MessageCircle className="w-6 h-6" />
                            <span className="text-sm font-medium">WhatsApp</span>
                        </button>

                        {navigator.share ? (
                            <button
                                onClick={handleNativeShare}
                                className="flex flex-col items-center justify-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors border border-blue-200/50"
                            >
                                <Share2 className="w-6 h-6" />
                                <span className="text-sm font-medium">More Options</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleCopy}
                                className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors border border-gray-200/50"
                            >
                                {copied ? <Check className="w-6 h-6 text-green-600" /> : <Copy className="w-6 h-6" />}
                                <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy Link'}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
