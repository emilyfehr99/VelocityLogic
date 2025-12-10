import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Loader2, User, Building2, Check } from 'lucide-react';

const SignupPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [plan, setPlan] = useState('standard');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const selectedPlan = params.get('plan');
        if (selectedPlan) {
            setPlan(selectedPlan);
        }
    }, [location]);

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate signup
        setTimeout(() => {
            setIsLoading(false);
            navigate('/');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 selection:bg-primary/30 font-sans transition-colors duration-500 pt-32 pb-12">
            <div className="w-full max-w-md">
                <Link to="/" className="inline-flex items-center gap-2 text-textMuted hover:text-textMain mb-8 transition-colors text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                <div className="bg-surface border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500"></div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-textMain mb-2 tracking-tight">Get Started</h1>
                        <p className="text-textMuted">Start automating your quotes today</p>
                    </div>

                    {/* Plan Selection */}
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

                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-1.5">First Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted" />
                                    <input
                                        type="text"
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
                                    required
                                    className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-textMain placeholder:text-textMuted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="you@company.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-textMuted uppercase tracking-wider mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textMuted" />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-background border border-border rounded-xl py-3 pl-10 pr-4 text-textMain placeholder:text-textMuted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="bg-surfaceHighlight/50 rounded-xl p-4 border border-border/50">
                            <div className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <Check className="w-3 h-3 text-primary" />
                                </div>
                                <p className="text-xs text-textMuted leading-relaxed">
                                    You are selecting the <span className="text-textMain font-bold capitalize">{plan} Plan</span>.
                                    {plan === 'pro' ? ' Includes full CRM integration.' : ' Perfect for starting out.'}
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-textMuted">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary hover:text-blue-400 font-medium transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
