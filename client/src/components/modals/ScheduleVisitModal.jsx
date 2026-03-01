import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ScheduleVisitModal({ project, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { error } = await supabase.from('site_visits').insert([{
            project_id: project.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            scheduled_date: formData.date,
            time_slot: formData.time,
            notes: formData.message
        }]);

        setIsSubmitting(false);
        if (!error) {
            setSubmitted(true);
        } else {
            console.error("Error scheduling visit:", error);
            alert("Failed to schedule visit. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/80 to-primary px-6 py-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-primary-foreground">Schedule Site Visit</h2>
                        <button onClick={onClose} className="text-primary-foreground/80 hover:text-primary-foreground text-2xl transition-colors">×</button>
                    </div>
                    <p className="text-primary-foreground/80 text-sm mt-1">{project.name}</p>
                </div>

                {/* Content */}
                <div className="p-6">
                    {submitted ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-emerald/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">Visit Scheduled!</h3>
                            <p className="text-muted-foreground mb-4">We'll contact you shortly to confirm your visit.</p>
                            <button
                                onClick={onClose}
                                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Full Name *"
                                required
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-3 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                            />
                            <input
                                type="email"
                                placeholder="Email Address *"
                                required
                                value={formData.email}
                                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full px-4 py-3 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number *"
                                required
                                value={formData.phone}
                                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                className="w-full px-4 py-3 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                    className="w-full px-4 py-3 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                                />
                                <select
                                    value={formData.time}
                                    onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                                    className="w-full px-4 py-3 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
                                >
                                    <option value="">Select Time</option>
                                    <option value="10:00 AM">10:00 AM</option>
                                    <option value="11:00 AM">11:00 AM</option>
                                    <option value="12:00 PM">12:00 PM</option>
                                    <option value="02:00 PM">02:00 PM</option>
                                    <option value="03:00 PM">03:00 PM</option>
                                    <option value="04:00 PM">04:00 PM</option>
                                    <option value="05:00 PM">05:00 PM</option>
                                </select>
                            </div>
                            <textarea
                                placeholder="Any specific requirements? (Optional)"
                                rows="3"
                                value={formData.message}
                                onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                className="w-full px-4 py-3 border border-input bg-background text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3 rounded-lg font-semibold hover:from-primary/90 hover:to-primary disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Scheduling...
                                    </>
                                ) : (
                                    <>📅 Schedule Visit</>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
