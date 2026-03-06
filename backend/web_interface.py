"""
Velocity Logic - Web Interface
Simple Flask web interface for the Velocity Logic agent.
"""

from flask import Flask, render_template_string, request, jsonify, send_file, Response
import os
import json
from datetime import datetime
from main import VelocityLogicAgent
import threading
import time
from services.voice_service import VoiceService, MockVoiceService

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'output'

# Initialize agent
agent = None
agent_status = {
    "running": False,
    "last_check": None,
    "processed_count": 0,
    "errors": []
}

def init_agent():
    """Initialize the agent in a separate thread."""
    global agent
    try:
        agent = VelocityLogicAgent()
        print("✓ Agent initialized for web interface")
    except Exception as e:
        print(f"✗ Error initializing agent: {e}")
        agent = None

# Initialize agent on startup
init_agent()

# Initialize Voice Service
try:
    voice_service = VoiceService()
except:
    print("⚠ Using Mock Voice Service (Whisper not initialized)")
    voice_service = MockVoiceService()

QUOTES_DB = 'data/quotes.json'
CALENDAR_DB = 'data/calendar.json'
CLIENTS_DB = 'data/clients.json'
PRICE_HISTORY_DB = 'data/price_history.json'
PRICING_CSV = 'data/pricing.csv'
USERS_DB = 'data/users.json'
CONTRACTORS_DB = 'data/contractors.json'

def load_users():
    if not os.path.exists(USERS_DB): return []
    try:
        with open(USERS_DB, 'r') as f: return json.load(f)
    except: return []

def load_contractors():
    if not os.path.exists(CONTRACTORS_DB): return []
    try:
        with open(CONTRACTORS_DB, 'r') as f: return json.load(f)
    except: return []

def get_current_contractor_id():
    """Extract contractor ID from header for multi-tenancy scoping."""
    return request.headers.get('X-Impersonate-Client-ID')

def load_quotes():
    if not os.path.exists('data'):
        os.makedirs('data')
    if not os.path.exists(QUOTES_DB):
        with open(QUOTES_DB, 'w') as f:
            json.dump([], f)
        return []
    try:
        with open(QUOTES_DB, 'r') as f:
            quotes = json.load(f)
            # Scope by contractor if ID provided
            contractor_id = get_current_contractor_id()
            if contractor_id:
                return [q for q in quotes if q.get('contractor_id') == contractor_id]
            return quotes
    except:
        return []

def save_quote(quote_data):
    quotes = load_quotes()
    # Add unique ID if not present
    if 'id' not in quote_data:
        quote_data['id'] = quote_data['quote_number']
    
    # Update existing or append new
    for i, q in enumerate(quotes):
        if q['id'] == quote_data['id']:
            quotes[i] = quote_data
            break
    else:
        quotes.append(quote_data)
    
    # Multi-tenancy: attach contractor ID
    contractor_id = get_current_contractor_id()
    if contractor_id and 'contractor_id' not in quote_data:
        quote_data['contractor_id'] = contractor_id
        
    with open(QUOTES_DB, 'w') as f:
        json.dump(quotes, f, indent=4)

HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Velocity Logic - Agent Control Panel</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #e2e8f0;
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(45, 212, 191, 0.3);
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 4px 20px rgba(45, 212, 191, 0.1);
        }
        .header h1 {
            color: #2dd4bf;
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        .header p {
            color: #94a3b8;
            font-size: 1.1rem;
        }
        .card {
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid rgba(45, 212, 191, 0.3);
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 4px 20px rgba(45, 212, 191, 0.1);
        }
        .card h2 {
            color: #2dd4bf;
            margin-bottom: 20px;
            font-size: 1.5rem;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            color: #cbd5e1;
            margin-bottom: 8px;
            font-weight: 500;
        }
        input[type="text"],
        input[type="email"],
        textarea {
            width: 100%;
            padding: 12px;
            background: rgba(30, 41, 59, 0.8);
            border: 1px solid rgba(45, 212, 191, 0.3);
            border-radius: 8px;
            color: #e2e8f0;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        input:focus,
        textarea:focus {
            outline: none;
            border-color: #2dd4bf;
        }
        textarea {
            min-height: 150px;
            resize: vertical;
        }
        button {
            background: linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%);
            color: #0f172a;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(45, 212, 191, 0.4);
        }
        button:active {
            transform: translateY(0);
        }
        .status {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
        }
        .status.active {
            background: rgba(34, 197, 94, 0.2);
            color: #22c55e;
            border: 1px solid rgba(34, 197, 94, 0.3);
        }
        .status.inactive {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
        .result {
            margin-top: 20px;
            padding: 20px;
            background: rgba(30, 41, 59, 0.8);
            border-radius: 8px;
            border-left: 4px solid #2dd4bf;
        }
        .result.success {
            border-left-color: #22c55e;
        }
        .result.error {
            border-left-color: #ef4444;
        }
        .result h3 {
            color: #2dd4bf;
            margin-bottom: 10px;
        }
        .result pre {
            background: rgba(15, 23, 42, 0.8);
            padding: 15px;
            border-radius: 6px;
            overflow-x: auto;
            color: #cbd5e1;
            font-size: 13px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        .stat-box {
            background: rgba(30, 41, 59, 0.8);
            padding: 20px;
            border-radius: 8px;
            border: 1px solid rgba(45, 212, 191, 0.2);
        }
        .stat-box .label {
            color: #94a3b8;
            font-size: 14px;
            margin-bottom: 8px;
        }
        .stat-box .value {
            color: #2dd4bf;
            font-size: 24px;
            font-weight: 600;
        }
        .loading {
            display: none;
            text-align: center;
            padding: 20px;
            color: #2dd4bf;
        }
        .loading.active {
            display: block;
        }
        .spinner {
            border: 3px solid rgba(45, 212, 191, 0.3);
            border-top: 3px solid #2dd4bf;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 10px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Velocity Logic</h1>
            <p>Automated Quoting Agent Control Panel</p>
        </div>

        <div class="grid">
            <div class="card">
                <h2>Agent Status</h2>
                <div id="status-display">
                    <div class="stat-box">
                        <div class="label">Status</div>
                        <div class="value" id="agent-status">Checking...</div>
                    </div>
                    <div class="stat-box">
                        <div class="label">Processed Emails</div>
                        <div class="value" id="processed-count">0</div>
                    </div>
                    <div class="stat-box">
                        <div class="label">Last Check</div>
                        <div class="value" id="last-check">Never</div>
                    </div>
                </div>
            </div>

            <div class="card">
                <h2>Test Quote Generation</h2>
                <form id="quote-form">
                    <div class="form-group">
                        <label for="customer-name">Customer Name</label>
                        <input type="text" id="customer-name" name="customer_name" value="John Smith" required>
                    </div>
                    <div class="form-group">
                        <label for="customer-email">Customer Email</label>
                        <input type="email" id="customer-email" name="customer_email" value="john.smith@example.com" required>
                    </div>
                    <div class="form-group">
                        <label for="email-body">Email Body (Service Request)</label>
                        <textarea id="email-body" name="email_body" required>Hi, I need a new furnace installed at my home. The old one broke down and it's getting cold. Please send me a quote.

Thanks,
John Smith</textarea>
                    </div>
                    <button type="submit">Generate Quote</button>
                </form>
                <div class="loading" id="loading">
                    <div class="spinner"></div>
                    <p>Processing email and generating quote...</p>
                </div>
                <div id="result"></div>
            </div>
        </div>

        <div class="card">
            <h2>Recent Quotes</h2>
            <div id="quotes-list">
                <p style="color: #94a3b8;">No quotes generated yet. Test the quote generator above!</p>
            </div>
        </div>
    </div>

    <script>
        // Update status on load and periodically
        function updateStatus() {
            fetch('/api/status')
                .then(res => res.json())
                .then(data => {
                    document.getElementById('agent-status').textContent = data.agent_ready ? 'Ready' : 'Not Ready';
                    document.getElementById('processed-count').textContent = data.processed_count || 0;
                    document.getElementById('last-check').textContent = data.last_check || 'Never';
                })
                .catch(err => console.error('Error fetching status:', err));
        }

        // Handle quote form submission
        document.getElementById('quote-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = {
                customer_name: formData.get('customer_name'),
                customer_email: formData.get('customer_email'),
                email_body: formData.get('email_body')
            };

            const loading = document.getElementById('loading');
            const result = document.getElementById('result');
            
            loading.classList.add('active');
            result.innerHTML = '';

            try {
                const response = await fetch('/api/process-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const responseData = await response.json();
                loading.classList.remove('active');

                if (responseData.success) {
                    result.innerHTML = `
                        <div class="result success">
                            <h3>✅ Quote Generated Successfully!</h3>
                            <p><strong>Quote Number:</strong> ${responseData.quote_number}</p>
                            <p><strong>Customer:</strong> ${responseData.customer_name}</p>
                            <p><strong>Total:</strong> $${responseData.total.toFixed(2)}</p>
                            <p><strong>PDF:</strong> <a href="${responseData.pdf_url}" target="_blank" style="color: #2dd4bf;">Download PDF</a></p>
                            <h4>Line Items:</h4>
                            <pre>${JSON.stringify(responseData.line_items, null, 2)}</pre>
                        </div>
                    `;
                    updateQuotesList();
                } else {
                    result.innerHTML = `
                        <div class="result error">
                            <h3>❌ Error</h3>
                            <p>${responseData.error || 'Unknown error occurred'}</p>
                        </div>
                    `;
                }
            } catch (error) {
                loading.classList.remove('active');
                result.innerHTML = `
                    <div class="result error">
                        <h3>❌ Error</h3>
                        <p>${error.message}</p>
                    </div>
                `;
            }
        });

        // Update quotes list
        function updateQuotesList() {
            fetch('/api/quotes')
                .then(res => res.json())
                .then(data => {
                    const listEl = document.getElementById('quotes-list');
                    if (data.quotes && data.quotes.length > 0) {
                        listEl.innerHTML = data.quotes.map(quote => `
                            <div style="padding: 15px; margin-bottom: 10px; background: rgba(30, 41, 59, 0.8); border-radius: 8px; border-left: 4px solid #2dd4bf;">
                                <strong style="color: #2dd4bf;">${quote.quote_number}</strong> - 
                                ${quote.customer_name} - 
                                $${quote.total.toFixed(2)} - 
                                <a href="${quote.pdf_url}" target="_blank" style="color: #2dd4bf;">View PDF</a>
                            </div>
                        `).join('');
                    } else {
                        listEl.innerHTML = '<p style="color: #94a3b8;">No quotes generated yet.</p>';
                    }
                })
                .catch(err => console.error('Error fetching quotes:', err));
        }

        // Initial load
        updateStatus();
        updateQuotesList();
        setInterval(updateStatus, 5000); // Update every 5 seconds
    </script>
</body>
</html>
"""

@app.route('/')
def index():
    """Main dashboard page."""
    return render_template_string(HTML_TEMPLATE)

@app.route('/api/status')
def get_status():
    """Get agent status."""
    return jsonify({
        "agent_ready": agent is not None,
        "processed_count": agent_status["processed_count"],
        "last_check": agent_status["last_check"],
        "contractor_id": get_current_contractor_id()
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    users = load_users()
    user = next((u for u in users if u['email'] == email), None)
    
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
    
    # Mocking JWT token generation (simple base64 of payload for demo)
    import base64
    payload = base64.b64encode(json.dumps({
        "sub": user['id'],
        "exp": int(time.time()) + 3600,
        "name": user['full_name']
    }).encode()).decode()
    token = f"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.{payload}.signature_placeholder"
    
    contractors = load_contractors()
    user_contractors = [c for c in contractors if c['id'] in user.get('managed_contractor_ids', [])]
    
    return jsonify({
        "token": token,
        "user": {
            "id": user['id'],
            "email": user['email'],
            "full_name": user['full_name'],
            "role": user['role']
        },
        "client": user_contractors[0] if user_contractors else None
    })

@app.route('/api/auth/impersonate', methods=['POST'])
def impersonate():
    data = request.json
    target_id = data.get('target_client_id')
    
    contractors = load_contractors()
    target = next((c for c in contractors if c['id'] == target_id), None)
    
    if not target:
        return jsonify({"error": "Contractor not found"}), 404
    
    # In real app, verify permissions here
    import base64
    payload = base64.b64encode(json.dumps({
        "sub": target_id,
        "exp": int(time.time()) + 1800,
        "is_impersonation": True
    }).encode()).decode()
    token = f"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.{payload}.signature_placeholder"
    
    return jsonify({
        "token": token,
        "client": target,
        "user": {
            "role": "super_admin", # Keep admin role
            "impersonating": True
        }
    })

@app.route('/api/admin/clients')
def admin_get_clients():
    """Returns list of contractors for the switcher."""
    return jsonify(load_contractors())

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    # Basic signup placeholder
    return jsonify({"success": True, "message": "Signup recorded in waitlist (mock)"})

@app.route('/api/drafts')
def get_drafts():
    """Alias for /api/quotes for frontend compatibility."""
    return get_quotes()

from services.rebate_service import RebateService
import csv
import io

# Initialize services
rebate_service = RebateService()
TEMPLATES_DB = 'data/templates.json'

def load_templates():
    if not os.path.exists(TEMPLATES_DB):
        return []
    try:
        with open(TEMPLATES_DB, 'r') as f:
            return json.load(f)
    except: return []

def save_template(template):
    templates = load_templates()
    templates.append(template)
    with open(TEMPLATES_DB, 'w') as f:
        json.dump(templates, f, indent=4)

def calculate_priority_score(quote):
    """
    Priority score based on: Value, Age (hours), and weather urgency.
    Score = (total / 100) + (hours_old * 2) + (winter_multiplier ? 50 : 0)
    """
    total = quote.get('total', 0)
    created_at = datetime.fromisoformat(quote.get('created_at', datetime.now().isoformat()))
    hours_old = (datetime.now() - created_at).total_seconds() / 3600
    
    score = (total / 100) + (hours_old * 2)
    if quote.get('winter_multiplier_active'):
        score += 50
    if quote.get('status') == 'NEEDS_REVIEW':
        score += 30
        
    return round(score, 1)

@app.route('/api/process-email', methods=['POST'])
def process_email():
    """Process an email and generate a quote."""
    if agent is None:
        return jsonify({"success": False, "error": "Agent not initialized"}), 500
    
    try:
        data = request.json
        customer_name = data.get('customer_name', 'Customer')
        customer_email = data.get('customer_email', 'customer@example.com')
        email_body = data.get('email_body', '')
        markup_percent = data.get('markup_percent', 0.0)
        winter_multiplier_active = data.get('winter_multiplier_active', False)
        province = data.get('province', 'Manitoba') # Default or extracted
        city = data.get('city')
        
        # Process the email
        result = agent.process_email(
            email_body, 
            customer_email, 
            markup_percent=markup_percent,
            winter_multiplier_active=winter_multiplier_active,
            city=city,
            province=province
        )
        
        # Phase 10: AI-Template Pre-population
        template_matched = False
        template_hint = result.get("template_hint")
        if template_hint:
            templates = load_templates()
            match = next((t for t in templates if template_hint.lower() in t.get('name', '').lower()), None)
            if match:
                print(f"✨ AI Template Match: {match['name']}")
                result["quote_data"]["line_items"] = match["line_items"]
                # Recalculate totals for the new items
                subtotal = sum(item["line_total"] for item in match["line_items"])
                tax = subtotal * 0.10
                result["quote_data"]["subtotal"] = subtotal
                result["quote_data"]["tax"] = tax
                result["quote_data"]["total"] = subtotal + tax
                template_matched = True

        if result.get("success"):
            # Check for rebates
            service_names = [item['service_requested'] for item in result.get('extracted_items', [])]
            eligible_rebates = rebate_service.find_eligible_rebates(province, service_names)
            rebate_calc = rebate_service.calculate_net_cost(result["quote_data"]["total"], eligible_rebates)
            
            quote_data = {
                "id": result["quote_number"],
                "quote_number": result["quote_number"],
                "customer_name": result["customer_name"],
                "customer_email": customer_email,
                "province": province,
                "total": result["quote_data"]["total"],
                "line_items": result["quote_data"]["line_items"],
                "subtotal": result["quote_data"]["subtotal"],
                "tax": result["quote_data"]["tax"],
                "markup_percent": markup_percent,
                "winter_multiplier_active": winter_multiplier_active,
                "winter_surcharge_total": result["quote_data"].get("winter_surcharge_total", 0),
                "pdf_url": f"/api/pdf/{os.path.basename(result['pdf_path'])}",
                "confidence_score": result["confidence_score"],
                "ai_reasoning": result["ai_reasoning"],
                "status": result["status"] if result["confidence_score"] >= 70 else "NEEDS_REVIEW",
                "status_history": result["status_history"],
                "eligible_rebates": eligible_rebates,
                "net_cost_estimate": rebate_calc,
                "created_at": datetime.now().isoformat()
            }
            
            # Apply priority score
            quote_data["priority_score"] = calculate_priority_score(quote_data)
            
            save_quote(quote_data)
            return jsonify(quote_data)
        
        return jsonify({"success": False, "error": result.get("error")}), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/quotes/export')
def export_quotes():
    """Export all quotes to CSV."""
    quotes = load_quotes()
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(['Quote #', 'Customer', 'Value', 'Status', 'Province', 'Priority', 'Created At'])
    for q in quotes:
        writer.writerow([
            q.get('quote_number'),
            q.get('customer_name'),
            q.get('total'),
            q.get('status'),
            q.get('province'),
            q.get('priority_score'),
            q.get('created_at')
        ])
    
    output.seek(0)
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-disposition": "attachment; filename=quotes_export.csv"}
    )

@app.route('/api/templates', methods=['GET', 'POST'])
def manage_templates():
    if request.method == 'POST':
        save_template(request.json)
        return jsonify({"success": True})
    return jsonify(load_templates())

@app.route('/api/admin/import-csv', methods=['POST'])
def import_csv():
    """Import quotes from a legacy CSV (Jobber/QuickBooks)."""
    if 'file' not in request.files:
        return jsonify({"success": False, "error": "No file"}), 400
    
    file = request.files['file']
    import csv
    import io
    
    stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
    csv_input = csv.DictReader(stream)
    
    quotes = load_quotes()
    imported_count = 0
    
    contractor_id = get_current_contractor_id()
    
    for row in csv_input:
        # Expected columns: customer_name, customer_email, service, total, date
        quote_id = f"IMP-{int(time.time())}-{imported_count}"
        new_quote = {
            "id": quote_id,
            "quote_number": quote_id,
            "contractor_id": contractor_id,
            "customer_name": row.get('customer_name', 'Unknown'),
            "email": row.get('customer_email', 'unknown@example.com'),
            "total": float(row.get('total', 0)),
            "status": "APPROVED", # Legacy data usually imported as closed/approved
            "created_at": row.get('date', datetime.now().isoformat()),
            "line_items": [{"service_name": row.get('service', 'Imported Service'), "line_total": float(row.get('total', 0))}],
            "status_history": [{"status": "IMPORTED", "timestamp": datetime.now().isoformat(), "message": "Legacy data imported from CSV"}]
        }
        quotes.append(new_quote)
        imported_count += 1
        
    with open(QUOTES_DB, 'w') as f:
        json.dump(quotes, f, indent=4)
        
    return jsonify({"success": True, "count": imported_count})

@app.route('/api/process-voice', methods=['POST'])
def process_voice():
    """Handle audio transcription and quote generation."""
    if 'audio' not in request.files:
        return jsonify({"success": False, "error": "No audio file"}), 400
    
    audio_file = request.files['audio']
    temp_path = f"/tmp/voice_{int(time.time())}.webm"
    audio_file.save(temp_path)
    
    try:
        transcript = voice_service.transcribe(temp_path)
        if not transcript:
            return jsonify({"success": False, "error": "Transcription failed"}), 500
        
        # Now process as if it were an email
        data = request.form.to_dict()
        result = agent.process_email(
            transcript,
            data.get('customer_email', 'voice-intake@velocitylogic.ai'),
            markup_percent=float(data.get('markup_percent', 0.0)),
            winter_multiplier_active=data.get('winter_multiplier_active', 'false').lower() == 'true',
            city=data.get('city'),
            province=data.get('province', 'Manitoba')
        )
        
        if result.get("success"):
            # Attach transcript and mark source as VOICE
            result["transcript"] = transcript
            result["source"] = "VOICE"
            save_quote(result)
            return jsonify(result)
        else:
            return jsonify(result), 500
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.route('/api/quotes')
def get_quotes():
    """Get list of generated quotes and perform auto-follow-up check."""
    quotes = load_quotes()
    now = datetime.now()
    
    updated = False
    for q in quotes:
        # Check for 48h follow-up trigger
        # Criteria: Status is OPENED, and it's been > 48 hours since that opening
        opened_event = next((h for h in q.get('status_history', []) if h['status'] == 'OPENED'), None)
        if opened_event and q.get('status') != 'FOLLOW_UP_SENT' and q.get('status') not in ['APPROVED', 'REJECTED']:
            opened_at = datetime.fromisoformat(opened_event['timestamp'])
            hours_since_open = (now - opened_at).total_seconds() / 3600
            
            if hours_since_open >= 48:
                q['status'] = 'FOLLOW_UP_SENT'
                q['status_history'].append({
                    "status": "FOLLOW_UP_SENT",
                    "timestamp": now.isoformat(),
                    "message": "Auto-follow-up sent: 48h without response after opening."
                })
                updated = True

        # Check for 30-day Expiry
        if q['status'] in ['DRAFT_SENT', 'NEEDS_REVIEW']:
            created_at = datetime.fromisoformat(q.get('created_at', now.isoformat()))
            if (now - created_at).days >= 30:
                q['status'] = 'EXPIRED'
                q['status_history'].append({
                    "status": "EXPIRED",
                    "timestamp": now.isoformat(),
                    "message": "Quote automatically expired after 30 days"
                })
                updated = True
                
    if updated:
        with open(QUOTES_DB, 'w') as f:
            json.dump(quotes, f, indent=4)
            
    # Return ALL quotes if no contractor_id (Agency view)
    contractor_id = get_current_contractor_id()
    if contractor_id:
        quotes = [q for q in quotes if q.get('contractor_id') == contractor_id]
        
    return jsonify({"quotes": quotes})

@app.route('/api/webhook/sms', methods=['POST'])
def sms_webhook():
    """Handle SMS replies for quote approval."""
    data = request.json
    phone = data.get('from')
    message = data.get('text', '').upper().strip()
    
    # Initialize services for notification and payment
    from services.sms_service import SMSService
    from services.stripe_service import StripeService
    sms_service = SMSService()
    stripe_service = StripeService()
    
    if message == 'YES':
        # Find the most recent quote for this "phone" (mock: find by customer name similarity or just last one)
        quotes = load_quotes()
        if not quotes:
            return jsonify({"success": False, "error": "No quotes found"}), 404
            
        # Mock: approve the latest pending quote
        target_quote = None
        for q in reversed(quotes):
            if q['status'] == 'DRAFT_SENT':
                target_quote = q
                break
        
        if target_quote:
            target_quote['status'] = 'APPROVED'
            target_quote['status_history'].append({
                "status": "APPROVED",
                "timestamp": datetime.now().isoformat(),
                "message": "Client approved via SMS reply 'YES'"
            })
            target_quote['status_history'].append({
                "status": "INVOICED",
                "timestamp": datetime.now().isoformat(),
                "message": "Final invoice automatically generated and sent"
            })
            # Generate Stripe payment link
            payment_link = stripe_service.create_payment_link(
                target_quote['total'], 
                target_quote['customer_name'], 
                target_quote['id']
            )
            target_quote['payment_link'] = payment_link
            target_quote['payment_status'] = 'UNPAID'
            
            save_quote(target_quote)
            
            # Send confirmation SMS with payment link
            sms_service.send_invoice_notification(phone, target_quote['total'], payment_link=payment_link)
            
            return jsonify({"success": True, "message": f"Quote {target_quote['id']} approved. Payment link: {payment_link}"})
            
    return jsonify({"success": False, "error": "Invalid command or no matching quote"}), 400

@app.route('/api/pixel/<quote_id>')
def track_pixel(quote_id):
    """Track when an email is opened."""
    quotes = load_quotes()
    for q in quotes:
        if q['id'] == quote_id:
            # Only add opened event once
            if not any(h['status'] == 'OPENED' for h in q['status_history']):
                q['status_history'].append({
                    "status": "OPENED",
                    "timestamp": datetime.now().isoformat(),
                    "message": "Client opened the quote email"
                })
                save_quote(q)
            break
    
    # Return 1x1 transparent pixel
    import base64
    pixel_data = base64.b64decode("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")
    from flask import Response
    return Response(pixel_data, mimetype='image/gif')

@app.route('/api/pdf/<filename>')
def get_pdf(filename):
    """Serve PDF files."""
    file_path = os.path.join('output', filename)
    if os.path.exists(file_path):
        return send_file(file_path, mimetype='application/pdf')
    return jsonify({"error": "PDF not found"}), 404

def load_calendar():
    if not os.path.exists(CALENDAR_DB): return []
    try:
        with open(CALENDAR_DB, 'r') as f:
            jobs = json.load(f)
            contractor_id = get_current_contractor_id()
            if contractor_id:
                return [j for j in jobs if j.get('contractor_id') == contractor_id]
            return jobs
    except: return []

def save_calendar(jobs):
    with open(CALENDAR_DB, 'w') as f: json.dump(jobs, f, indent=4)

@app.route('/api/calendar')
def get_calendar():
    return jsonify(load_calendar())

@app.route('/api/calendar', methods=['POST'])
def schedule_job():
    data = request.json
    jobs = load_calendar()
    jobs.append({
        "id": f"JOB-{len(jobs)+1}",
        "quote_id": data.get('quote_id'),
        "customer_name": data.get('customer_name'),
        "start": data.get('start'), # ISO string
        "end": data.get('end'),
        "is_winter_urgent": data.get('is_winter_urgent', False),
        "status": "SCHEDULED",
        "contractor_id": get_current_contractor_id()
    })
    save_calendar(jobs)
    return jsonify({"success": True})

def load_clients():
    if not os.path.exists(CLIENTS_DB): return []
    try:
        with open(CLIENTS_DB, 'r') as f:
            clients = json.load(f)
            contractor_id = get_current_contractor_id()
            if contractor_id:
                return [c for c in clients if c.get('contractor_id') == contractor_id]
            return clients
    except: return []

@app.route('/api/clients')
def get_clients():
    return jsonify(load_clients())

@app.route('/api/cron/seasonal-reminders')
def check_seasonal_reminders():
    """Nightly check for emergency maintenance reminders based on weather."""
    # Mock current weather - in prod this comes from WeatherService
    current_temp = -35.0 
    
    if current_temp > -30:
        return jsonify({"triggered": 0, "status": "Temp safe"})
        
    clients = load_clients()
    triggered_count = 0
    
    from services.sms_service import SMSService
    sms = SMSService()
    
    now_year = datetime.now().year
    
    for c in clients:
        equip = c.get('equipment', {})
        age = now_year - equip.get('installed_year', now_year)
        
        # Trigger: Temp < -30 and Equipment Age > 10 years
        if age > 10:
            msg = (
                f"VelocityLogic Alert for {c['name']}: It's -35°C in Moose Jaw. "
                f"Your {equip['type']} is {age} years old. Stay safe! "
                "Reply 'TECH' if you need a priority inspection today."
            )
            sms._send_sms(c['phone'], msg)
            triggered_count += 1
            
    return jsonify({"triggered": triggered_count, "temp": current_temp})

@app.route('/api/supplier/alerts')
def get_supplier_alerts():
    from services.supplier_service import SupplierService
    supplier = SupplierService(PRICING_CSV, PRICE_HISTORY_DB)
    alerts = supplier.check_for_drift()
    return jsonify(alerts)

if __name__ == '__main__':
    print("=" * 60)
    print("🌐 Starting Velocity Logic Web Interface")
    print("=" * 60)
    print("📱 Open your browser to: http://localhost:5001")
    print("=" * 60)
    app.run(debug=False, host='0.0.0.0', port=5001)

