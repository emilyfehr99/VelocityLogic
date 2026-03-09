import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  ShieldCheck,
  X,
  Check,
  Database,
  Calculator,
  MessageSquareWarning,
  ArrowRight,
  Zap,
  ChevronRight,
  Bot
} from 'lucide-react';
import dashboardImg from '../assets/dashboard.png';
import { trackEvent } from '../lib/analytics';

const LandingPage: React.FC = () => {
  const handleWaitlistFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem('email') as HTMLInputElement | null;
    const email = input?.value.trim();
    const url = email
      ? `/#/signup?email=${encodeURIComponent(email)}`
      : '/#/signup';
    window.location.href = url;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-textMain font-sans transition-colors duration-500">

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center">
        {/* Hero Background: Deep Navy + Motion */}
        <div className="absolute inset-0 bg-grid z-0 opacity-60 mask-image-gradient"></div>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-radial from-primary/40 via-transparent to-transparent blur-3xl opacity-60 animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-gradient-radial from-accent/40 via-transparent to-transparent blur-3xl opacity-60 animate-spotlight pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-textMuted text-xs font-medium mb-8 hover:bg-surfaceHighlight transition-colors cursor-default backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="tracking-wide uppercase">The Automatic Sales Engine</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1] text-textMain">
            Be The First To Quote. <br />
            <span className="text-gradient-primary drop-shadow-sm">
              Every Single Time.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-textMuted mb-10 leading-relaxed font-light">
            Your competitors take 24 hours to reply. Velocity Logic replies in <span className="text-textMain font-medium">30 seconds</span>.
            The automated estimator that reads your emails, checks your inventory, and closes deals while you sleep.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => {
                trackEvent('cta_click', { button: 'hero_trial' });
                window.location.href = '/#/signup';
              }}
              className="group relative px-8 py-4 bg-textMain text-background font-bold tracking-tight rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative flex items-center gap-2">Join the Waitlist <ArrowRight className="w-4 h-4" /></span>
            </button>
            <button
              onClick={() => {
                trackEvent('cta_click', { button: 'hero_demo' });
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 text-textMain bg-surface border border-border hover:bg-surfaceHighlight font-medium rounded-full transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm hover:shadow-md active:scale-[0.98]"
            >
              <Clock className="w-4 h-4" />
              See 30-Second Demo
            </button>
          </div>

          {/* Simple hero waitlist form */}
          <form
            onSubmit={handleWaitlistFormSubmit}
            className="mt-6 w-full max-w-md mx-auto flex flex-col sm:flex-row gap-3 items-stretch"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="you@company.com"
              className="flex-1 rounded-full bg-surface border border-border px-5 py-3 text-sm text-textMain placeholder:text-textMuted/60 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/60"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-primary text-background text-sm font-semibold tracking-tight hover:bg-primary/glow transition-colors shadow-lg hover:shadow-primary/30"
            >
              Join the waitlist
            </button>
          </form>

          {/* Dashboard Preview */}
          <div className="mt-16 relative w-full max-w-5xl mx-auto perspective-[2000px] group">
            {/* Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-2xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>

            {/* Image Container */}
            <div className="relative rounded-2xl bg-surface border border-border/50 shadow-2xl overflow-hidden transform transition-all duration-700 ease-out hover:scale-[1.01] hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent z-10 pointer-events-none"></div>
              <img
                src={dashboardImg}
                alt="Velocity Logic Dashboard"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Social Proof / Trust */}
          <div className="mt-20 w-full max-w-3xl">
            <p className="text-xs text-textMuted mb-6 font-semibold tracking-[0.2em] uppercase text-center">Powering High-Volume Shops</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-700">
              {/* Logos tied to real-style names */}
              <span className="font-extrabold text-xl tracking-tighter text-textMain">
                CedarLine<span className="font-light"> Fencing</span>
              </span>
              <span className="font-bold text-xl tracking-tight italic text-textMain">
                Skyline<span className="font-normal"> Outdoor</span>
              </span>
              <span className="font-black text-xl tracking-widest text-textMain">
                Northside<span className="font-normal tracking-tight"> Materials</span>
              </span>
              <span className="font-bold text-xl tracking-tighter text-textMain border-2 border-textMain px-2">
                Bright<span className="font-light">Deck</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENTO GRID COMPARISON */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-textMain mb-4 tracking-tight">The Old Way vs. The Velocity Way</h2>
            <p className="text-textMuted max-w-2xl mx-auto">Stop acting like an office manager. Start acting like a market leader.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* The Old Way */}
            <div className="p-8 rounded-3xl bg-surface border border-border relative overflow-hidden group hover:border-red-500/20 transition-all shadow-sm hover:shadow-md">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck className="w-24 h-24 text-red-500" />
              </div>
              <div className="relative z-10 opacity-70 group-hover:opacity-100 transition-opacity">
                <h3 className="text-lg font-semibold text-red-500 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> Traditional CRM
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <X className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" />
                    <span className="text-textMuted">Manual forms that customers hate</span>
                  </li>
                  <li className="flex gap-4">
                    <X className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" />
                    <span className="text-textMuted">Distracting notifications on the job</span>
                  </li>
                  <li className="flex gap-4">
                    <X className="w-5 h-5 text-red-500/50 shrink-0 mt-0.5" />
                    <span className="text-textMuted">Late night manual quoting</span>
                  </li>
                </ul>
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="text-xs text-red-600 font-mono font-bold tracking-widest uppercase">RESULT: LOST REVENUE</div>
                </div>
              </div>
            </div>

            {/* Velocity Logic */}
            <div className="p-8 rounded-3xl bg-surface border border-primary/30 relative overflow-hidden group shadow-lg shadow-primary/5 hover:border-primary/50 transition-all transform hover:-translate-y-1">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap className="w-24 h-24 text-primary" />
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2 tracking-tight">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Velocity Logic
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-textMain font-medium">Instantly reads customer emails</span>
                  </li>
                  <li className="flex gap-4">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-textMain font-medium">Checks your stock automatically</span>
                  </li>
                  <li className="flex gap-4">
                    <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-textMain font-medium">Drafts sent in 30 seconds</span>
                  </li>
                </ul>
                <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
                  <div className="text-xs text-primary font-mono font-bold tracking-widest uppercase">RESULT: DEAL CLOSED</div>
                  <div className="h-6 px-2 bg-primary/10 text-primary text-[10px] rounded flex items-center font-bold tracking-wide border border-primary/20">WINNER</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES - BENTO GRID */}
      <section id="features" className="py-24 bg-surfaceHighlight/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-bold text-textMain mb-6 tracking-tight">The First Quoting Tool <br />That <span className="text-gradient-primary">Doesn't Need You</span>.</h2>
            <p className="text-textMuted text-lg font-light">Traditional CRMs are just fancy filing cabinets. We are an active engine that sits on top of your business.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 - Large Span */}
            <div className="md:col-span-2 p-10 rounded-3xl bg-surface border border-border hover:border-border/80 transition-all shadow-sm hover:shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-700 pointer-events-none"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-surfaceHighlight rounded-xl border border-border flex items-center justify-center mb-6 shadow-sm">
                  <Database className="w-6 h-6 text-textMain" />
                </div>
                <h3 className="text-2xl font-bold text-textMain mb-3 tracking-tight">Know Your Stock</h3>
                <p className="text-textMuted leading-relaxed max-w-lg">
                  Stop guessing if you have the part. Our system scans your inventory sheets in real-time to quote based on actual stock levels. It never promises what you can't deliver.
                </p>
              </div>
              {/* Visual Element Mockup */}
              <div className="mt-8 p-5 bg-background rounded-xl border border-border font-mono text-xs text-textMuted shadow-inner">
                <div className="flex justify-between mb-3 border-b border-border pb-2">
                  <span>{'>'} Checking stock levels...</span>
                  <span className="text-green-500 font-bold">READY</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{'>'} Item "2x4 Cedar"</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 bg-surfaceHighlight rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-primary"></div>
                    </div>
                    <span className="text-primary font-bold">342 Units</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 - Tall */}
            <div className="md:col-span-1 md:row-span-2 p-10 rounded-3xl bg-surface border border-border hover:border-border/80 transition-all shadow-sm hover:shadow-md flex flex-col relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-background/50 to-transparent pointer-events-none"></div>
              <div className="w-12 h-12 bg-surfaceHighlight rounded-xl border border-border flex items-center justify-center mb-6 shadow-sm">
                <MessageSquareWarning className="w-6 h-6 text-textMain" />
              </div>
              <h3 className="text-2xl font-bold text-textMain mb-3 tracking-tight">Reads Messy Emails</h3>
              <p className="text-textMuted leading-relaxed mb-8">
                Customers don't fill out web forms perfectly. Velocity Logic reads raw emails, texts, and voice notes—and turns them into professional estimates.
              </p>
              <div className="mt-auto bg-surfaceHighlight rounded-xl p-4 border border-border relative z-10 shadow-sm">
                <div className="flex gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-400 flex items-center justify-center text-[10px] font-bold text-white">JD</div>
                  <div className="bg-surface p-3 rounded-2xl rounded-tl-none text-xs text-textMain leading-relaxed border border-border shadow-sm">
                    "I need a fence, about 40ft, wood..."
                  </div>
                </div>
                <div className="flex gap-2 justify-center mb-1">
                  <div className="w-0.5 h-3 bg-border"></div>
                </div>
                <div className="bg-primary/10 border border-primary/20 p-2.5 rounded-lg text-center text-xs text-primary font-bold mt-1 shadow-sm">
                  Quote Generated: $1,200
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="md:col-span-2 p-10 rounded-3xl bg-surface border border-border hover:border-border/80 transition-all shadow-sm hover:shadow-md relative overflow-hidden">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-surfaceHighlight rounded-xl border border-border flex items-center justify-center mb-6 shadow-sm">
                    <Calculator className="w-6 h-6 text-textMain" />
                  </div>
                  <h3 className="text-2xl font-bold text-textMain mb-3 tracking-tight">It Does The Math</h3>
                  <p className="text-textMuted leading-relaxed">
                    Square footage? Linear feet? Waste factor? Our system reads the email—'I need a 20x20 deck'—and calculates the materials for you.
                  </p>
                </div>
                <div className="bg-surfaceHighlight rounded-xl p-5 border border-border w-full md:w-64 font-mono text-xs shadow-inner">
                  <div className="flex justify-between border-b border-border pb-2 mb-2">
                    <span className="text-textMuted">Input</span>
                    <span className="text-textMain">"20x20 deck"</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-textMuted">Area</span>
                      <span className="text-primary font-bold">400 sqft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-textMuted">Waste (10%)</span>
                      <span className="text-textMain font-bold">+40 sqft</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-border font-bold">
                      <span className="text-textMuted">Total</span>
                      <span className="text-textMain">440 sqft</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3B. PRODUCT MOCKUPS – EMAIL → AI QUOTE FLOW */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary mb-3">See It In Action</p>
            <h2 className="text-2xl md:text-3xl font-bold text-textMain tracking-tight">
              From messy inbox to clean quote in under a minute.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="p-4 rounded-2xl bg-surface border border-border/70 shadow-sm flex flex-col">
              <p className="text-[10px] font-mono text-textMuted uppercase tracking-[0.24em] mb-2">1 · Inbox</p>
              <div className="flex-1 rounded-xl bg-surfaceHighlight border border-border/70 p-3 text-[11px] text-textMuted leading-snug">
                <div className="font-semibold text-textMain mb-1">Subject: Fence quote?</div>
                “Hey, we need about 40ft of wood fence along the back alley. Can you send a ballpark?”
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-border/70 shadow-sm flex flex-col">
              <p className="text-[10px] font-mono text-textMuted uppercase tracking-[0.24em] mb-2">2 · AI Parsing</p>
              <div className="flex-1 rounded-xl bg-surfaceHighlight border border-border/70 p-3 text-[11px] text-textMuted leading-snug font-mono">
                {'>'} Length: <span className="text-textMain font-semibold">40 ft</span><br />
                {'>'} Material: <span className="text-textMain font-semibold">Cedar privacy</span><br />
                {'>'} Gate: <span className="text-textMain font-semibold">1 × 4ft</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-border/70 shadow-sm flex flex-col">
              <p className="text-[10px] font-mono text-textMuted uppercase tracking-[0.24em] mb-2">3 · Quote Draft</p>
              <div className="flex-1 rounded-xl bg-surfaceHighlight border border-border/70 p-3 text-[11px] text-textMuted leading-snug">
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-textMain">Total</span>
                  <span className="font-bold text-primary">$4,280</span>
                </div>
                <ul className="list-disc list-inside">
                  <li>Materials, labor, disposal</li>
                  <li>Includes 1 cedar gate</li>
                </ul>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-border/70 shadow-sm flex flex-col">
              <p className="text-[10px] font-mono text-textMuted uppercase tracking-[0.24em] mb-2">4 · Send & Sync</p>
              <div className="flex-1 rounded-xl bg-surfaceHighlight border border-border/70 p-3 text-[11px] text-textMuted leading-snug">
                <p className="mb-2">You approve with a click, Velocity Logic emails the customer, and pushes the job into your CRM.</p>
                <div className="inline-flex items-center gap-2 text-[10px] font-mono text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> LIVE QUOTE SENT
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3B. HOW IT WORKS */}
      <section className="py-16 bg-background border-b border-border/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary mb-3">How Velocity Logic Fits Into Your Day</p>
            <h2 className="text-2xl md:text-3xl font-bold text-textMain tracking-tight">From inbox to priced quote in three steps.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 rounded-2xl bg-surface border border-border/70">
              <p className="text-xs font-mono text-textMuted uppercase tracking-[0.24em] mb-2">Step 1</p>
              <h3 className="text-sm font-semibold text-textMain mb-2">Connect your email and price sheets</h3>
              <p className="text-xs text-textMuted leading-relaxed">
                We plug into the inbox where leads already land and sync your inventory or price list so the system never guesses.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-surface border border-border/70">
              <p className="text-xs font-mono text-textMuted uppercase tracking-[0.24em] mb-2">Step 2</p>
              <h3 className="text-sm font-semibold text-textMain mb-2">Let it read new requests</h3>
              <p className="text-xs text-textMuted leading-relaxed">
                Velocity Logic reads messy emails, photos, and notes, calculates quantities, and drafts a professional quote in about 30 seconds.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-surface border border-border/70">
              <p className="text-xs font-mono text-textMuted uppercase tracking-[0.24em] mb-2">Step 3</p>
              <h3 className="text-sm font-semibold text-textMain mb-2">You approve, it sends</h3>
              <p className="text-xs text-textMuted leading-relaxed">
                During the trial you approve drafts with a click. Once you trust it, let Velocity Logic auto-send quotes for certain jobs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTEGRATION */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-20">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-textMain mb-8 tracking-tight">We Feed Your <span className="text-gradient-primary">Ecosystem</span>.</h2>
              <p className="text-xl text-textMain mb-8 leading-relaxed font-light">
                Already use Jobber, ServiceTitan, or QuickBooks? <span className="font-medium border-b border-primary/50">Perfect.</span>
              </p>
              <p className="text-textMuted mb-10 text-lg leading-relaxed">
                Velocity Logic handles the <strong className="text-textMain">Sales</strong>. We capture the lead instantly, then push the data into your CRM for <strong className="text-textMain">Management</strong>.
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="px-5 py-2.5 bg-surface rounded-full border border-border text-textMuted text-sm font-medium flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div> Jobber API
                </div>
                <div className="px-5 py-2.5 bg-surface rounded-full border border-border text-textMuted text-sm font-medium flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div> ServiceTitan
                </div>
                <div className="px-5 py-2.5 bg-surface rounded-full border border-border text-textMuted text-sm font-medium flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-green-600 shadow-[0_0_8px_rgba(22,163,74,0.5)]"></div> QBO
                </div>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-center">
              {/* Abstract Connection Visual */}
              <div className="relative w-full max-w-sm aspect-square bg-surface/50 rounded-full border border-border flex items-center justify-center p-8 backdrop-blur-sm shadow-2xl">
                <div className="absolute inset-0 border border-border rounded-full scale-125 opacity-30 animate-pulse-slow"></div>
                <div className="absolute inset-0 border border-border rounded-full scale-150 opacity-10"></div>

                {/* Center Hub */}
                <div className="relative z-10 w-36 h-36 bg-background rounded-2xl border border-primary/30 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.15)] ring-1 ring-border">
                  <Bot className="w-10 h-10 text-primary mb-3" />
                  <span className="text-[10px] font-bold text-textMain tracking-[0.2em]">ENGINE</span>
                </div>

                {/* Satellites */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface p-3 rounded-lg border border-border shadow-md hover:scale-105 transition-transform cursor-default">
                  <span className="text-xs font-mono text-textMuted font-bold">CRM</span>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-surface p-3 rounded-lg border border-border shadow-md hover:scale-105 transition-transform cursor-default">
                  <span className="text-xs font-mono text-textMuted font-bold">INVENTORY</span>
                </div>
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface p-3 rounded-lg border border-border shadow-md hover:scale-105 transition-transform cursor-default">
                  <span className="text-xs font-mono text-textMuted font-bold">EMAIL</span>
                </div>
                <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 bg-surface p-3 rounded-lg border border-border shadow-md hover:scale-105 transition-transform cursor-default">
                  <span className="text-xs font-mono text-textMuted font-bold">SMS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-28 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs text-primary font-semibold tracking-[0.25em] uppercase mb-4">Customer Stories</p>
            <h2 className="text-3xl md:text-4xl font-bold text-textMain mb-4 tracking-tight">
              Real Shops. Real Inboxes. Real Revenue.
            </h2>
            <p className="text-textMuted max-w-2xl mx-auto text-base md:text-lg">
              Velocity Logic sits quietly in the background—reading emails, checking stock, and sending quotes before
              your competitors even see the lead.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="text-xs font-mono text-primary mb-3 tracking-[0.2em] uppercase">Fencing Contractor</div>
              <blockquote className="text-sm md:text-base text-textMain leading-relaxed mb-6">
                “Before Velocity Logic, I’d sit down at 9 PM and crank out quotes. Now the system answers within a
                minute, and customers think we have a full-time office staff.”
              </blockquote>
              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-textMain">Jared L.</div>
                  <div className="text-xs text-textMuted">Owner, CedarLine Fencing</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-textMuted uppercase tracking-[0.18em]">First Response Time</div>
                  <div className="text-sm font-bold text-primary">32 seconds</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden">
              <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-primary text-background text-[10px] font-bold tracking-[0.18em] uppercase shadow-lg">
                Inbox Chaos → Order
              </div>
              <div className="text-xs font-mono text-primary mb-3 tracking-[0.2em] uppercase">Deck &amp; Patio Builder</div>
              <blockquote className="text-sm md:text-base text-textMain leading-relaxed mb-6">
                “People send us novels over email—photos, measurements, random notes. Velocity Logic turns that mess
                into a clean estimate without my crew touching a keyboard.”
              </blockquote>
              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-textMain">Maria R.</div>
                  <div className="text-xs text-textMuted">GM, Skyline Outdoor</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-textMuted uppercase tracking-[0.18em]">Quoted Per Week</div>
                  <div className="text-sm font-bold text-primary">4× increase</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="text-xs font-mono text-primary mb-3 tracking-[0.2em] uppercase">Supply Yard</div>
              <blockquote className="text-sm md:text-base text-textMain leading-relaxed mb-6">
                “We used to overpromise because no one checked stock until the morning. Now every quote is based on
                live inventory, and we stopped having those uncomfortable ‘sorry, we&rsquo;re out’ calls.”
              </blockquote>
              <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-textMain">Devon K.</div>
                  <div className="text-xs text-textMuted">Ops Lead, Northside Materials</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-textMuted uppercase tracking-[0.18em]">Lost Deals To Stock</div>
                  <div className="text-sm font-bold text-primary">-63%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRICING */}
      <section id="pricing" className="py-32 bg-surfaceHighlight/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-textMain mb-4 tracking-tight">Cheaper Than Your Worst Employee.</h2>
            <p className="text-textMuted text-lg max-w-2xl mx-auto mb-3">Hire a system that works 24/7/365 without complaints, sick days, or mistakes.</p>
            <p className="text-sm text-primary font-medium tracking-tight">Every plan starts with a <span className="font-semibold">14‑day free trial</span>.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
            {/* Standard Plan */}
            <div className="p-8 rounded-3xl bg-surface border border-border flex flex-col hover:bg-surfaceHighlight/50 transition-colors group shadow-sm hover:shadow-md">
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-textMain tracking-tight">Standard Plan</h3>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-5xl font-bold tracking-tighter text-textMain">$299</span>
                  <span className="text-textMuted font-medium">/mo</span>
                </div>
                <p className="mt-4 text-sm text-textMuted leading-relaxed h-10">Perfect for the solo operator looking to reclaim their evenings.</p>
              </div>
              <ul className="space-y-5 mb-10 flex-1">
                <li className="flex items-center gap-3 text-textMuted">
                  <div className="w-5 h-5 rounded-full bg-surfaceHighlight border border-border flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-textMain" /></div> Instant Email Drafting
                </li>
                <li className="flex items-center gap-3 text-textMuted">
                  <div className="w-5 h-5 rounded-full bg-surfaceHighlight border border-border flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-textMain" /></div> Basic Price List Logic
                </li>
                <li className="flex items-center gap-3 text-textMuted">
                  <div className="w-5 h-5 rounded-full bg-surfaceHighlight border border-border flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-textMain" /></div> Replaces: Your Sunday evenings
                </li>
              </ul>
              <button
                onClick={() => {
                  trackEvent('pricing_select', { plan: 'standard' });
                  window.location.href = '/#/signup?plan=standard';
                }}
                className="w-full py-4 rounded-xl bg-surfaceHighlight border border-border hover:bg-border text-textMain font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Start 14‑Day Free Trial
              </button>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-3xl bg-background border border-primary/30 relative flex flex-col shadow-2xl scale-100 lg:scale-105 transition-transform z-10 ring-1 ring-border">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-textMain text-background text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                Most Popular
              </div>
              <div className="mb-8">
                <h3 className="text-xl font-bold text-textMain tracking-tight flex items-center gap-2">
                  Pro Plan <Zap className="w-4 h-4 text-primary fill-primary" />
                </h3>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-5xl font-bold tracking-tighter text-textMain">$599</span>
                  <span className="text-textMuted font-medium">/mo</span>
                </div>
                <p className="mt-4 text-sm text-textMuted leading-relaxed h-10">For the scaling shop that needs full integration and automation.</p>
              </div>
              <ul className="space-y-5 mb-10 flex-1">
                <li className="flex items-center gap-3 text-textMain font-medium">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20"><Check className="w-3 h-3 text-white" /></div> Smart Inventory Lookup
                </li>
                <li className="flex items-center gap-3 text-textMain font-medium">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20"><Check className="w-3 h-3 text-white" /></div> CRM Integration (Push to Jobber)
                </li>
                <li className="flex items-center gap-3 text-textMain font-medium">
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20"><Check className="w-3 h-3 text-white" /></div> Priority Support
                </li>
                <li className="flex items-center gap-3 text-textMuted mt-6 pt-6 border-t border-border">
                  <span className="text-sm text-textMuted">Replaces:</span> <span className="text-textMain font-bold bg-surfaceHighlight px-2 py-0.5 rounded border border-border tracking-tight">A $4,000/mo Admin</span>
                </li>
              </ul>
              <button
                onClick={() => {
                  trackEvent('pricing_select', { plan: 'pro' });
                  window.location.href = '/#/signup?plan=pro';
                }}
                className="w-full py-4 rounded-xl bg-textMain text-background font-bold hover:opacity-90 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
              >
                Start 14‑Day Free Trial
              </button>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-textMuted max-w-xl mx-auto">
            No credit card required to start. If you don’t see faster responses and cleaner quotes by the end of your 14‑day trial,
            you walk away with zero obligation.
          </p>
        </div>
      </section>

      {/* 7. FAQ – Reduce Uncertainty */}
      <section className="py-24 bg-background border-t border-border/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary mb-3">Questions, Answered</p>
            <h2 className="text-2xl md:text-3xl font-bold text-textMain tracking-tight">What most shops ask before turning it on.</h2>
          </div>
          <div className="space-y-4">
            <details className="group border border-border/70 rounded-2xl bg-surface">
              <summary className="flex items-center justify-between gap-4 px-4 sm:px-5 py-3 cursor-pointer">
                <span className="text-sm font-semibold text-textMain">How long does setup actually take?</span>
                <span className="text-xs text-textMuted group-open:hidden">+</span>
                <span className="text-xs text-textMuted hidden group-open:inline">−</span>
              </summary>
              <div className="px-4 sm:px-5 pb-4 text-xs text-textMuted leading-relaxed border-t border-border/70">
                Most shops are live in under a week. We help you connect the inbox where leads land and upload your price sheets or
                inventory exports so quotes stay grounded in reality.
              </div>
            </details>
            <details className="group border border-border/70 rounded-2xl bg-surface">
              <summary className="flex items-center justify-between gap-4 px-4 sm:px-5 py-3 cursor-pointer">
                <span className="text-sm font-semibold text-textMain">Will Velocity Logic send anything without my approval?</span>
                <span className="text-xs text-textMuted group-open:hidden">+</span>
                <span className="text-xs text-textMuted hidden group-open:inline">−</span>
              </summary>
              <div className="px-4 sm:px-5 pb-4 text-xs text-textMuted leading-relaxed border-t border-border/70">
                During the 14‑day trial, nothing is sent without a human review. You approve drafts with a click.
                After the trial, you can choose rules for which jobs can be auto-sent.
              </div>
            </details>
            <details className="group border border-border/70 rounded-2xl bg-surface">
              <summary className="flex items-center justify-between gap-4 px-4 sm:px-5 py-3 cursor-pointer">
                <span className="text-sm font-semibold text-textMain">What happens after the trial?</span>
                <span className="text-xs text-textMuted group-open:hidden">+</span>
                <span className="text-xs text-textMuted hidden group-open:inline">−</span>
              </summary>
              <div className="px-4 sm:px-5 pb-4 text-xs text-textMuted leading-relaxed border-t border-border/70">
                We review results together, look at how many quotes Velocity Logic handled, and decide whether Standard or Pro is a fit.
                If it’s not, you simply turn it off—no lock‑in, no surprises.
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section className="py-32 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-textMain mb-10 tracking-tighter leading-tight">While your competitors are typing,<br /> you are closing.</h2>
          <div className="flex flex-col items-center gap-6">
            <button
              onClick={() => {
                trackEvent('cta_click', { button: 'footer_waitlist' });
                window.location.href = '/#/signup';
              }}
              className="px-10 py-4 rounded-full bg-primary text-background font-bold tracking-tight text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Join the waitlist
            </button>
            <Link to="/vs-jobber" className="group inline-flex items-center gap-2 text-primary hover:text-textMain transition-colors font-semibold text-sm tracking-tight">
              Compare vs. Traditional CRMs <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;