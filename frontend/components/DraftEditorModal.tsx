import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Loader2, Zap, Snowflake, Gift, Copy } from 'lucide-react';

export default function DraftEditorModal({ draft, onClose, onSave }) {
    const [formData, setFormData] = useState({
        ...draft,
        markup_percent: draft.markup_percent || 0,
        winter_multiplier_active: draft.winter_multiplier_active || false
    });
    const [loading, setLoading] = useState(false);
    const [saveTemplate, setSaveTemplate] = useState(false);

    useEffect(() => {
        setFormData({
            ...draft,
            markup_percent: draft.markup_percent || 0,
            winter_multiplier_active: draft.winter_multiplier_active || false
        });
    }, [draft]);

    const handleLineItemChange = (index, field, value) => {
        const newLineItems = [...formData.line_items];
        newLineItems[index] = { ...newLineItems[index], [field]: value };

        // Recalculate line total if price or quantity changes
        if (field === 'unit_price' || field === 'quantity' || field === 'winter_multiplier_active') {
            const basePrice = newLineItems[index].base_price || newLineItems[index].unit_price;
            const markup = (1 + (formData.markup_percent / 100));
            const winter = newLineItems[index].winter_multiplier_active ? 1.3 : 1.0;

            const newUnitPrice = basePrice * markup * winter;
            const qty = parseFloat(newLineItems[index].quantity) || 0;

            newLineItems[index].unit_price = newUnitPrice;
            newLineItems[index].line_total = newUnitPrice * qty;
            newLineItems[index].winter_surcharge = newLineItems[index].winter_multiplier_active ? (basePrice * markup * 0.3 * qty) : 0;
        }

        const newFormData = { ...formData, line_items: newLineItems };
        setFormData(newFormData);
        recalculateHeaderTotals(newFormData);
    };

    const handleGlobalMarkupChange = (val) => {
        const markup = parseFloat(val) || 0;
        const newLineItems = formData.line_items.map(item => {
            const basePrice = item.base_price || item.unit_price;
            const markupMul = (1 + (markup / 100));
            const winter = item.winter_multiplier_active ? 1.3 : 1.0;
            const newUnitPrice = basePrice * markupMul * winter;
            return {
                ...item,
                unit_price: newUnitPrice,
                line_total: newUnitPrice * (item.quantity || 0),
                winter_surcharge: item.winter_multiplier_active ? (basePrice * markupMul * 0.3 * item.quantity) : 0
            };
        });
        const newFormData = { ...formData, markup_percent: markup, line_items: newLineItems };
        setFormData(newFormData);
        recalculateHeaderTotals(newFormData);
    };

    const handleDeleteLineItem = (index) => {
        const newLineItems = formData.line_items.filter((_, i) => i !== index);
        const newFormData = { ...formData, line_items: newLineItems };
        setFormData(newFormData);
        recalculateHeaderTotals(newFormData);
    };

    const handleAddLineItem = () => {
        const newItem = {
            service_name: 'New Service',
            description: '',
            quantity: 1,
            unit_price: 100,
            base_price: 100,
            unit: 'Each',
            line_total: 100,
            winter_multiplier_active: false
        };
        const newLineItems = [...formData.line_items, newItem];
        setFormData({ ...formData, line_items: newLineItems });
    };

    const recalculateHeaderTotals = (data) => {
        const subtotal = data.line_items.reduce((sum, item) => sum + (item.line_total || 0), 0);
        const taxRate = 0.10;
        const tax = subtotal * taxRate;
        const total = subtotal + tax;
        const winter_surcharge_total = data.line_items.reduce((sum, item) => sum + (item.winter_surcharge || 0), 0);

        setFormData(prev => ({
            ...prev,
            subtotal,
            tax,
            total,
            winter_surcharge_total
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (saveTemplate) {
                await fetch('/api/templates', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: `Template - ${formData.customer_name}`,
                        trade_type: formData.trade_type || 'General',
                        line_items: formData.line_items
                    })
                });
            }
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving draft:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden ring-1 ring-black/5">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pricing Screen</h2>
                            <span className="px-2.5 py-1 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-md uppercase tracking-wider">
                                #{formData.quote_number}
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium">Drafting for <span className="text-slate-900">{formData.customer_name}</span></p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="flex items-center gap-2 mb-1 justify-end">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">AI Confidence</span>
                                <div className={`w-2 h-2 rounded-full ${formData.confidence_score > 90 ? 'bg-emerald-500' : formData.confidence_score > 70 ? 'bg-amber-500' : 'bg-red-500'} animate-pulse`}></div>
                            </div>
                            <span className={`text-xl font-black ${formData.confidence_score > 90 ? 'text-emerald-600' : formData.confidence_score > 70 ? 'text-amber-600' : 'text-red-600'}`}>
                                {formData.confidence_score || 0}%
                            </span>
                        </div>
                        <button onClick={onClose} className="p-2.5 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-xl transition-all duration-200">
                            <X size={24} className="text-slate-400" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white">
                    {/* Urgency & Rebates Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.eligible_rebates && formData.eligible_rebates.length > 0 && (
                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-4">
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                    <Gift size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-emerald-900 text-sm">Provincial Rebate Match!</h4>
                                    <p className="text-xs text-emerald-700 mb-2">Qualifies for {formData.eligible_rebates[0].name}</p>
                                    <span className="inline-block px-2 py-1 bg-emerald-200/50 text-emerald-800 text-[10px] font-bold rounded">
                                        EST. SAVINGS: {formData.net_cost_estimate?.estimated_rebate ? `$${formData.net_cost_estimate.estimated_rebate}` : 'Calculating...'}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-4">
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                <Zap size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-indigo-900 text-sm">AI Priority Score</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-2xl font-black text-indigo-600">{formData.priority_score || 'N/A'}</span>
                                    <span className="text-[10px] font-bold text-indigo-400 uppercase leading-none">Ranked #1 in<br />Moose Jaw</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Global Controls */}
                    <div className="flex flex-wrap gap-6 items-center p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Global Markup (%)</label>
                            <input
                                type="number"
                                value={formData.markup_percent}
                                onChange={(e) => handleGlobalMarkupChange(e.target.value)}
                                className="w-24 px-3 py-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 focus:ring-4 focus:ring-blue-500/10 outline-none"
                            />
                        </div>

                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 h-fit self-end">
                            <input
                                type="checkbox"
                                id="save-temp"
                                checked={saveTemplate}
                                onChange={(e) => setSaveTemplate(e.target.checked)}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="save-temp" className="text-xs font-bold text-slate-600 flex items-center gap-1.5 cursor-pointer">
                                <Copy size={12} /> Save as Template
                            </label>
                        </div>

                        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 h-fit self-end">
                            <input
                                type="checkbox"
                                id="show-rebate-pdf"
                                checked={formData.show_rebate_on_pdf !== false}
                                onChange={(e) => setFormData({ ...formData, show_rebate_on_pdf: e.target.checked })}
                                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                            />
                            <label htmlFor="show-rebate-pdf" className="text-xs font-bold text-slate-600 flex items-center gap-1.5 cursor-pointer">
                                <Gift size={12} /> Show Rebate on Client PDF
                            </label>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end pb-2 border-b-2 border-slate-50">
                            <h3 className="text-lg font-black text-slate-900">Line Items</h3>
                            <button
                                onClick={handleAddLineItem}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg transition-colors border border-blue-100"
                            >
                                <Plus size={14} /> Add Manual Item
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.line_items.map((item, index) => (
                                <div key={index} className="relative p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all group">
                                    <div className="grid grid-cols-12 gap-6">
                                        <div className="col-span-12 lg:col-span-6 space-y-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Service Description</label>
                                                    <div className="flex gap-2">
                                                        {item.match_score && (
                                                            <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">AI Matched: {item.match_score}%</span>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                const reason = formData.ai_reasoning?.find(r => r.toLowerCase().includes(item.service_name.toLowerCase()))
                                                                    || formData.ai_reasoning?.[index]
                                                                    || "AI identified this service based on the email content.";
                                                                alert(`AI Reasoning: ${reason}`);
                                                            }}
                                                            className="text-[9px] font-bold text-blue-500 hover:text-blue-700 underline"
                                                        >
                                                            Why?
                                                        </button>
                                                    </div>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={item.service_name}
                                                    onChange={(e) => handleLineItemChange(index, 'service_name', e.target.value)}
                                                    className="w-full text-sm font-bold text-slate-800 bg-transparent border-b border-transparent focus:border-blue-500 outline-none pb-1"
                                                />
                                            </div>
                                            <textarea
                                                value={item.description}
                                                onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                                                placeholder="Add line item specifications..."
                                                className="w-full text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border-none focus:ring-2 focus:ring-slate-100 outline-none min-height-[60px]"
                                            />
                                        </div>

                                        <div className="col-span-12 lg:col-span-6 grid grid-cols-3 gap-4 h-fit">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Qty</label>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleLineItemChange(index, 'quantity', parseFloat(e.target.value))}
                                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 text-sm outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Unit Price</label>
                                                <input
                                                    type="number"
                                                    value={Math.round(item.unit_price)}
                                                    onChange={(e) => handleLineItemChange(index, 'unit_price', parseFloat(e.target.value))}
                                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 text-sm outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1 text-right">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase">Estimated Total</label>
                                                <div className="text-lg font-black text-slate-900 pt-1">
                                                    ${(item.line_total || 0).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Overlays */}
                                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-50">
                                        <button
                                            onClick={() => handleLineItemChange(index, 'winter_multiplier_active', !item.winter_multiplier_active)}
                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-all ${item.winter_multiplier_active
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                                }`}
                                        >
                                            <Snowflake size={12} />
                                            Winter Condition {item.winter_multiplier_active ? '(+30%)' : '+30%?'}
                                        </button>

                                        {item.match_score < 70 && (
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-wide border border-amber-100">
                                                Vague Input Warning
                                            </div>
                                        )}

                                        <button
                                            onClick={() => handleDeleteLineItem(index)}
                                            className="ml-auto p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals Summary */}
                    <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="space-y-1 border-r border-slate-800 pr-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Subtotal</p>
                                <p className="text-xl font-bold">${(formData.subtotal || 0).toLocaleString()}</p>
                            </div>
                            <div className="space-y-1 border-r border-slate-800 pr-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Markup ({formData.markup_percent}%)</p>
                                <p className="text-xl font-bold text-blue-400">+${((formData.subtotal || 0) * (formData.markup_percent / 100)).toLocaleString()}</p>
                            </div>
                            <div className="space-y-1 border-r border-slate-800 pr-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Winter Multiplier</p>
                                <p className="text-xl font-bold text-indigo-400">+${(formData.winter_surcharge_total || 0).toLocaleString()}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Final Quote Total</p>
                                <p className="text-4xl font-black text-emerald-400">${(formData.total || 0).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-200 rounded-2xl transition-all"
                    >
                        Discard Changes
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-10 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 shadow-2xl shadow-blue-500/40"
                    >
                        {loading ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
                        Confirm & Update Quote
                    </button>
                </div>
            </div>
        </div>
    );
}
