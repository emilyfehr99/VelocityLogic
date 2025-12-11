import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { trackEvent } from '../lib/analytics';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Loader2, User, Building2, Check, Zap } from 'lucide-react';

const WaitlistPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [plan, setPlan] = useState('standard');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        email: ''
    });
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const selectedPlan = params.get('plan');
        if (selectedPlan) {
            setPlan(selectedPlan);
        }
    }, [location]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase
                .from('waitlist')
                .insert([
                    {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        company_name: formData.companyName,
                        email: formData.email,
                        plan_interest: plan,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) throw error;

            trackEvent('waitlist_signup', { plan });
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting waitlist:', error);
            // Optionally show error to user
            alert('Failed to join waitlist. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 selection:bg-primary/30 font-sans transition-colors duration-500 pt-32 pb-12">
                <div className="w-full max-w-md bg-surface border border-border rounded-3xl p-8 shadow-2xl text-center">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-textMain mb-4">You're on the list!</h1>
                    <p className="text-textMuted mb-8 leading-relaxed">
                        Thanks for joining the Velocity Logic waitlist. We've reserved your spot for the <strong>{plan} Plan</strong>.
                        We'll be in touch shortly.
                    </p>
                    <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                        <ArrowLeft className="w-4 h-4" /> Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 selection:bg-primary/30 font-sans transition-colors duration-500 pt-32 pb-12">
            <div className="w-full max-w-md">
                <Link to="/" className="inline-flex items-center gap-2 text-textMuted hover:text-textMain mb-8 transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="bg-surface border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500"></div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-textMain mb-2 tracking-tight">Join Waitlist</h1>
                        <p className="text-textMuted">Secure your spot for early access</p>
                    </div>

                    {/* Plan Selection */}
                    {new URLSearchParams(location.search).has('plan') ? (
                        <div className="mb-8 p-4 bg-surfaceHighlight/30 border border-primary/20 rounded-2xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Zap className="w-5 h-5 text-primary fill-primary/20" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">Selected Plan</p>
                                <h2 className="text-lg font-bold text-textMain capitalize">{plan} Plan</h2>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 mb-8 p-1 bg-background rounded-xl border border-border">
                            <button
                                type="button"
                                onClick={() => setPlan('standard')}
                                className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${plan === 'standard'
                                    ? 'bg-surfaceHighlight text-textMain shadow-sm border border-border'
                                    : 'text-textMuted hover:text-textMain'
                                    }`}
                            >
                                Standard
                            </button>
                            <button
                                type="button"
                                onClick={() => setPlan('pro')}
                                className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${plan === 'pro'
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'text-textMuted hover:text-textMain'
                                    }`}
                            >
                                Pro Plan
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-1.5">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted" />
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-textMain placeholder:text-textMuted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        placeholder="John"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-1.5">Last Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-background border border-border rounded-xl py-3 px-4 text-textMain placeholder:text-textMuted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-1.5">Company Name</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted" />
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-textMain placeholder:text-textMuted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="Acme Inc."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-1.5">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-textMain placeholder:text-textMuted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="you@company.com"
                                />
                            </div>
                        </div>

                        {/* Password Field Removed for Waitlist */}

                        <div className="bg-surfaceHighlight/50 rounded-xl p-4 border border-border/50">
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="w-3 h-3 text-primary" />
                                </div>
                                <p className="text-xs text-textMuted leading-relaxed">
                                    You are interested in the <span className="text-textMain font-bold capitalize">{plan} Plan</span>.
                                    {plan === 'pro' ? ' Includes full CRM integration.' : ' Perfect for starting out.'}
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Join Waitlist'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WaitlistPage;
