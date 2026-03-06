import React, { useState } from 'react';
import { fetchWithAuth } from '../utils/api';
import { Zap, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WebhookSettings({ settings, onUpdate }) {
    const [webhookUrl, setWebhookUrl] = useState(settings?.webhook_url || '');
    const [webhookEvents, setWebhookEvents] = useState(settings?.webhook_events || []);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState(null);

    const availableEvents = [
        { id: 'QUOTE_SENT', label: 'Quote Sent', description: 'Triggered when a quote is approved and sent to customer' },
        { id: 'QUOTE_REJECTED', label: 'Quote Rejected', description: 'Triggered when a quote is rejected' },
        { id: 'QUOTE_APPROVED', label: 'Quote Approved', description: 'Triggered when a quote is manually approved' },
    ];

    const handleToggleEvent = (eventId) => {
        setWebhookEvents(prev =>
            prev.includes(eventId)
                ? prev.filter(e => e !== eventId)
                : [...prev, eventId]
        );
    };

    const handleTestWebhook = async () => {
        if (!webhookUrl) {
            toast.error('Please enter a webhook URL first');
            return;
        }

        setTesting(true);
        setTestResult(null);

        try {
            const res = await fetchWithAuth('/api/webhooks/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ webhook_url: webhookUrl })
            });

            const data = await res.json();
            setTestResult(data);

            if (data.success) {
                toast.success('Webhook test successful!');
            } else {
                toast.error(data.message || 'Webhook test failed');
            }
        } catch (error) {
            setTestResult({ success: false, message: 'Network error' });
            toast.error('Failed to test webhook');
        } finally {
            setTesting(false);
        }
    };

    const handleSave = async () => {
        try {
            const res = await fetchWithAuth('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    webhook_url: webhookUrl,
                    webhook_events: webhookEvents
                })
            });

            if (res.ok) {
                toast.success('Webhook settings saved');
                onUpdate({ webhook_url: webhookUrl, webhook_events: webhookEvents });
            } else {
                toast.error('Failed to save webhook settings');
            }
        } catch (error) {
            toast.error('Error saving settings');
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center mb-4">
                    <Zap className="h-6 w-6 text-yellow-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Webhook Integration</h3>
                </div>
                <p className="text-sm text-gray-600">
                    Connect to Zapier, Make, or any custom webhook endpoint to sync quotes with your CRM or other tools.
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                    <div className="text-sm text-blue-800">
                        <p className="font-medium">How to use webhooks:</p>
                        <ol className="list-decimal list-inside mt-2 space-y-1">
                            <li>Create a webhook trigger in Zapier or Make</li>
                            <li>Copy the webhook URL and paste it below</li>
                            <li>Select which events should trigger the webhook</li>
                            <li>Test the connection</li>
                            <li>Save your settings</li>
                        </ol>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook URL
                </label>
                <div className="flex space-x-2">
                    <input
                        type="url"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://hooks.zapier.com/hooks/catch/..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        onClick={handleTestWebhook}
                        disabled={testing || !webhookUrl}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {testing ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Testing...
                            </>
                        ) : (
                            'Test'
                        )}
                    </button>
                </div>

                {testResult && (
                    <div className={`mt-2 p-3 rounded-lg flex items-center ${testResult.success
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                        {testResult.success ? (
                            <CheckCircle className="h-5 w-5 mr-2" />
                        ) : (
                            <XCircle className="h-5 w-5 mr-2" />
                        )}
                        <span className="text-sm">{testResult.message}</span>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Trigger Events
                </label>
                <div className="space-y-3">
                    {availableEvents.map(event => (
                        <label key={event.id} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={webhookEvents.includes(event.id)}
                                onChange={() => handleToggleEvent(event.id)}
                                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div className="ml-3">
                                <p className="font-medium text-gray-900">{event.label}</p>
                                <p className="text-sm text-gray-500">{event.description}</p>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Save Webhook Settings
                </button>
            </div>
        </div>
    );
}
