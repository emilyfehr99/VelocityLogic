import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';

const VsJobberPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center selection:bg-primary/30 font-sans transition-colors duration-500">
      <div className="max-w-6xl w-full">
        <Link to="/" className="inline-flex items-center gap-2 text-textMuted hover:text-textMain mb-12 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-textMain mb-6">
            Velocity Logic <span className="text-textMuted mx-2">vs.</span> Traditional CRMs
          </h1>
          <p className="text-xl text-textMuted max-w-2xl mx-auto leading-relaxed font-light">
            Traditional CRMs are designed to organize paperwork. Velocity Logic is designed to generate revenue. Choose your weapon.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-surface/50 backdrop-blur-md border border-border rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border">
          <div className="grid grid-cols-3 p-8 border-b border-border bg-surfaceHighlight/30">
            <div className="text-textMuted font-mono text-xs uppercase tracking-widest pt-2">Feature</div>
            <div className="text-center font-bold text-xl text-textMuted tracking-tight">Traditional CRM</div>
            <div className="text-center font-bold text-xl text-primary tracking-tight">Velocity Logic</div>
          </div>

          <ComparisonRow
            feature="Primary Goal"
            competitor="Organize Paperwork"
            us="Generate Revenue"
            highlightUs
          />
          <ComparisonRow
            feature="Input Method"
            competitor="Manual Typing / Web Forms"
            us="Auto-Reads Emails"
          />
          <ComparisonRow
            feature="Inventory Check"
            competitor="Manual Lookups"
            us="Auto-Scan Spreadsheets"
            competitorBad
            usGood
          />
          <ComparisonRow
            feature="Response Time"
            competitor="Hours (Human Dependent)"
            us="Seconds (Automated)"
            highlightUs
          />
          <ComparisonRow
            feature="Weekend Mode"
            competitor="You lose the lead"
            us="You win the lead"
            competitorBad
            usGood
            last
          />
        </div>

        <div className="mt-20 text-center relative overflow-hidden rounded-3xl p-16 bg-surface border border-border shadow-2xl">
          <div className="absolute inset-0 bg-primary/5"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[80px] rounded-full"></div>
          <h3 className="text-3xl font-bold text-textMain mb-8 relative z-10 tracking-tight">Ready to stop managing and start earning?</h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <button
              onClick={() => {
                window.location.href = '/#/';
                setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }}
              className="px-8 py-4 bg-textMain text-background font-bold tracking-tight rounded-full hover:opacity-90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Switch to Velocity Logic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComparisonRow: React.FC<{
  feature: string,
  competitor: string,
  us: string,
  highlightUs?: boolean,
  competitorBad?: boolean,
  usGood?: boolean,
  last?: boolean
}> = ({
  feature, competitor, us, highlightUs, competitorBad, usGood, last
}) => (
    <div className={`grid grid-cols-3 p-6 items-center ${!last ? 'border-b border-border' : ''} hover:bg-surfaceHighlight/30 transition-colors group`}>
      <div className="text-textMuted font-medium text-sm group-hover:text-textMain transition-colors pl-4">{feature}</div>

      {/* Competitor Col */}
      <div className="flex justify-center">
        <div className={`text-center py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${competitorBad ? 'bg-red-500/5 text-red-500/80 border-red-500/10' : 'text-textMuted border-transparent'}`}>
          {competitorBad && <X className="w-4 h-4 inline mr-2 -mt-0.5 opacity-70" />}
          {competitor}
        </div>
      </div>

      {/* Us Col */}
      <div className="flex justify-center">
        <div className={`text-center py-2 px-4 rounded-lg text-sm font-medium border transition-all ${highlightUs || usGood ? 'bg-primary/10 text-primary border-primary/20 shadow-sm' : 'text-textMain border-transparent'}`}>
          {usGood && <Check className="w-4 h-4 inline mr-2 -mt-0.5" />}
          {us}
        </div>
      </div>
    </div>
  );

export default VsJobberPage;