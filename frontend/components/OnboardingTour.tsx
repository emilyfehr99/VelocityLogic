import { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchWithAuth } from '../utils/api';

const TOUR_STEPS = [
    {
        id: 'welcome',
        title: 'Welcome to Velocity Logic! 🎉',
        content: 'Let\'s take a quick tour of your dashboard. This will only take a minute.',
        position: 'center',
        action: null // No navigation needed
    },
    {
        id: 'dashboard',
        title: 'Your Dashboard',
        content: 'This is your main dashboard where you\'ll see all pending quotes that need your approval. New customer requests appear here automatically.',
        target: '[data-tour="dashboard"]',
        position: 'bottom',
        action: { type: 'tab', value: 'dashboard' }
    },
    {
        id: 'quotes',
        title: 'Quote Generator',
        content: 'Create quotes manually by entering customer details and selecting services. Perfect for phone calls or walk-ins.',
        target: '[data-tour="quotes"]',
        position: 'right',
        action: { type: 'tab', value: 'quotes' }
    },
    {
        id: 'history',
        title: 'Quote History',
        content: 'View all your past quotes, see what was sent, and track your revenue over time.',
        target: '[data-tour="history"]',
        position: 'right',
        action: { type: 'tab', value: 'history' }
    },
    {
        id: 'analytics',
        title: 'Analytics',
        content: 'Track your business metrics - revenue, conversion rates, and customer trends.',
        target: '[data-tour="analytics"]',
        position: 'right',
        action: { type: 'tab', value: 'analytics' }
    },
    {
        id: 'customers',
        title: 'Customers',
        content: 'Manage your customer database and see their quote history.',
        target: '[data-tour="customers"]',
        position: 'right',
        action: { type: 'tab', value: 'customers' }
    },
    {
        id: 'settings',
        title: 'Settings',
        content: 'Configure your company profile, connect Gmail, sync your inventory from Google Sheets, and customize your branding.',
        target: '[data-tour="settings"]',
        position: 'right',
        action: { type: 'tab', value: 'settings' }
    },
    {
        id: 'complete',
        title: 'You\'re All Set! 🚀',
        content: 'You\'re ready to start using Velocity Logic. New customer emails will automatically create quotes for your approval.',
        position: 'center',
        action: null
    }
];

export default function OnboardingTour({ activeTab, onTabChange }) {
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const [showTour, setShowTour] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [highlightStyle, setHighlightStyle] = useState(null);
    const [tooltipStyle, setTooltipStyle] = useState(null);
    const tooltipRef = useRef(null);
    const observerRef = useRef(null);

    useEffect(() => {
        const checkOnboarding = async () => {
            if (!user) return;
            
            // Check for manual tour trigger in URL or localStorage
            const urlParams = new URLSearchParams(window.location.search);
            const showTourParam = urlParams.get('tour');
            const forceTour = localStorage.getItem('force_tour') === 'true';
            
            if (showTourParam === 'true' || forceTour) {
                localStorage.removeItem('force_tour');
                setTimeout(() => setShowTour(true), 500);
                return;
            }
            
            try {
                const response = await fetchWithAuth('/api/user/onboarding-status');
                if (response.ok) {
                    const data = await response.json();
                    if (!data.onboarding_completed) {
                        // Small delay to ensure DOM is ready
                        setTimeout(() => setShowTour(true), 500);
                    }
                }
            } catch (error) {
                const hasCompleted = localStorage.getItem(`onboarding_completed_${user.id}`);
                if (!hasCompleted) {
                    setTimeout(() => setShowTour(true), 500);
                }
            }
        };

        checkOnboarding();
    }, [user]);

    // Update highlight and tooltip positions when step changes
    useEffect(() => {
        if (!showTour || completed) return;

        const step = TOUR_STEPS[currentStep];
        
        // Handle navigation if needed
        if (step.action && step.action.type === 'tab' && onTabChange) {
            onTabChange(step.action.value);
        }

        // Wait for DOM to update after navigation
        setTimeout(() => {
            updatePositions(step);
        }, 300);
    }, [currentStep, showTour, completed, onTabChange]);

    // Update positions on scroll/resize
    useEffect(() => {
        if (!showTour || completed) return;

        const handleUpdate = () => {
            const step = TOUR_STEPS[currentStep];
            updatePositions(step);
        };

        window.addEventListener('scroll', handleUpdate, true);
        window.addEventListener('resize', handleUpdate);

        return () => {
            window.removeEventListener('scroll', handleUpdate, true);
            window.removeEventListener('resize', handleUpdate);
        };
    }, [currentStep, showTour, completed]);

    const updatePositions = (step) => {
        if (step.position === 'center') {
            setHighlightStyle(null);
            setTooltipStyle({
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10000
            });
            return;
        }

        const targetElement = step.target ? document.querySelector(step.target) : null;
        
        if (!targetElement) {
            // Fallback to center if element not found
            setHighlightStyle(null);
            setTooltipStyle({
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10000
            });
            return;
        }

        // Scroll element into view smoothly
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

        // Wait for scroll to complete
        setTimeout(() => {
            const rect = targetElement.getBoundingClientRect();
            const scrollX = window.scrollX || window.pageXOffset;
            const scrollY = window.scrollY || window.pageYOffset;

            // Create highlight box around element
            setHighlightStyle({
                position: 'fixed',
                top: `${rect.top + scrollY - 8}px`,
                left: `${rect.left + scrollX - 8}px`,
                width: `${rect.width + 16}px`,
                height: `${rect.height + 16}px`,
                zIndex: 9998,
                pointerEvents: 'none'
            });

            // Position tooltip based on step position with viewport boundary checks
            let tooltipPosition = {};
            const tooltipWidth = 380;
            const tooltipHeight = tooltipRef.current ? tooltipRef.current.offsetHeight : 250;
            const spacing = 20;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const padding = 20; // Minimum padding from viewport edges

            // Calculate positions with boundary checks
            let finalPosition = step.position;
            let top = 0;
            let left = 0;
            let transform = '';

            switch (step.position) {
                case 'bottom':
                    top = rect.bottom + scrollY + spacing;
                    left = rect.left + scrollX + rect.width / 2;
                    transform = 'translateX(-50%)';
                    
                    // Check if tooltip goes off bottom of screen
                    if (top + tooltipHeight + padding > viewportHeight + scrollY) {
                        // Flip to top
                        top = rect.top + scrollY - spacing;
                        transform = 'translate(-50%, -100%)';
                    }
                    
                    // Check if tooltip goes off right edge
                    if (left + tooltipWidth / 2 > viewportWidth - padding) {
                        left = viewportWidth - tooltipWidth / 2 - padding;
                    }
                    
                    // Check if tooltip goes off left edge
                    if (left - tooltipWidth / 2 < padding) {
                        left = tooltipWidth / 2 + padding;
                    }
                    break;
                    
                case 'right':
                    top = rect.top + scrollY + rect.height / 2;
                    left = rect.right + scrollX + spacing;
                    transform = 'translateY(-50%)';
                    
                    // Check if tooltip goes off right edge
                    if (left + tooltipWidth + padding > viewportWidth) {
                        // Flip to left
                        left = rect.left + scrollX - spacing;
                        transform = 'translate(-100%, -50%)';
                    }
                    
                    // Check if tooltip goes off bottom
                    if (top + tooltipHeight / 2 > viewportHeight + scrollY - padding) {
                        top = viewportHeight + scrollY - tooltipHeight / 2 - padding;
                    }
                    
                    // Check if tooltip goes off top
                    if (top - tooltipHeight / 2 < scrollY + padding) {
                        top = scrollY + tooltipHeight / 2 + padding;
                    }
                    break;
                    
                case 'left':
                    top = rect.top + scrollY + rect.height / 2;
                    left = rect.left + scrollX - spacing;
                    transform = 'translate(-100%, -50%)';
                    
                    // Check if tooltip goes off left edge
                    if (left - tooltipWidth - padding < 0) {
                        // Flip to right
                        left = rect.right + scrollX + spacing;
                        transform = 'translateY(-50%)';
                    }
                    
                    // Check if tooltip goes off bottom
                    if (top + tooltipHeight / 2 > viewportHeight + scrollY - padding) {
                        top = viewportHeight + scrollY - tooltipHeight / 2 - padding;
                    }
                    
                    // Check if tooltip goes off top
                    if (top - tooltipHeight / 2 < scrollY + padding) {
                        top = scrollY + tooltipHeight / 2 + padding;
                    }
                    break;
                    
                case 'top':
                    top = rect.top + scrollY - spacing;
                    left = rect.left + scrollX + rect.width / 2;
                    transform = 'translate(-50%, -100%)';
                    
                    // Check if tooltip goes off top of screen
                    if (top - tooltipHeight - padding < scrollY) {
                        // Flip to bottom
                        top = rect.bottom + scrollY + spacing;
                        transform = 'translateX(-50%)';
                    }
                    
                    // Check if tooltip goes off right edge
                    if (left + tooltipWidth / 2 > viewportWidth - padding) {
                        left = viewportWidth - tooltipWidth / 2 - padding;
                    }
                    
                    // Check if tooltip goes off left edge
                    if (left - tooltipWidth / 2 < padding) {
                        left = tooltipWidth / 2 + padding;
                    }
                    break;
            }

            tooltipPosition = {
                top: `${top}px`,
                left: `${left}px`,
                transform: transform
            };

            setTooltipStyle({
                position: 'fixed',
                ...tooltipPosition,
                zIndex: 9999,
                maxWidth: `${Math.min(tooltipWidth, viewportWidth - padding * 2)}px`
            });
        }, 500);
    };

    const handleNext = () => {
        if (currentStep < TOUR_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = async () => {
        setCompleted(true);
        setShowTour(false);
        setHighlightStyle(null);
        setTooltipStyle(null);
        
        try {
            await fetchWithAuth('/api/user/complete-onboarding', {
                method: 'POST'
            });
            localStorage.setItem(`onboarding_completed_${user?.id}`, 'true');
        } catch (error) {
            console.error('Error completing onboarding:', error);
            localStorage.setItem(`onboarding_completed_${user?.id}`, 'true');
        }
    };

    if (!showTour || completed) return null;

    const step = TOUR_STEPS[currentStep];
    const isLastStep = currentStep === TOUR_STEPS.length - 1;
    const isFirstStep = currentStep === 0;
    const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;

    return (
        <>
            {/* Subtle overlay - no blur, just darkening */}
            {step.position !== 'center' && (
                <div 
                    className="fixed inset-0 bg-black/30 z-[9997] transition-opacity duration-300"
                    style={{ pointerEvents: 'none' }}
                />
            )}

            {/* Spotlight highlight around target element */}
            {highlightStyle && step.target && (
                <div
                    className="absolute rounded-xl border-4 border-blue-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.3)] pointer-events-none"
                    style={highlightStyle}
                >
                    <div className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-xl bg-blue-500/20 animate-pulse" />
                </div>
            )}

            {/* Tooltip Card */}
            <div 
                ref={tooltipRef}
                className="fixed bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-[90%] transition-all duration-300 z-[9999]"
                style={tooltipStyle || { display: 'none' }}
            >
                {/* Progress indicator */}
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-blue-600" />
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Step {currentStep + 1} of {TOUR_STEPS.length}
                            </span>
                        </div>
                        <button
                            onClick={handleSkip}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                            aria-label="Skip tour"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                        {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        {step.content}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    {!isFirstStep && (
                        <button
                            onClick={handleBack}
                            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={isLastStep ? handleComplete : handleNext}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
                    >
                        {isLastStep ? (
                            <>
                                <Check size={18} />
                                Get Started
                            </>
                        ) : (
                            <>
                                Next
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
