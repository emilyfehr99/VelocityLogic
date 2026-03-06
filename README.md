# Velocity Logic - Autonomous Sales Engine

Velocity Logic is a production-grade AI platform designed for Canadian tradespeople. It replaces manual quoting, scheduling, and client follow-ups with autonomous AI agents.

## Core Features

- 🇨🇦 **Canadian Data Residency**: All data is strictly maintained in `ca-central-1` (AWS Montreal).
- 🛡️ **PIPEDA Compliant**: Full compliance with Canadian privacy laws.
- ❄️ **Prairie Winter Intelligence**: Integrated Environment Canada logic for -40°C forecasts and blizzard auto-rescheduling.
- 🤖 **GPT-4o Agent**: Autonomous email monitoring and professional quote generation (Gmail API).
- 💰 **Canadian Pricing Logic**: GST/PST calculation rules with real-time-ish mock supplier data.

## Project Structure

- `/frontend`: React + Vite web application with premium "Hard-Tech" design.
- `/backend`: Python + Flask service orchestrating the AI Agent and Gmail integration.

## Setup Instructions

### 1. Backend (Python)
The backend manages the autonomous agent and Gmail integration.

```bash
cd backend
pip install -r requirements.txt
cp .env.template .env # Add your OPENAI_API_KEY
python main.py
```

### 2. Frontend (React)
The frontend serves the landing page and the Agent Dashboard.

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000/#/dashboard` to access the AI Agent tools.

## Development Constraints

- **Residency**: No US data processing (AWS ca-central-1 only).
- **Compliance**: Follow the PIPEDA privacy policy located in `/privacy`.
- **Weather**: Weather logic is configured for Moose Jaw, SK defaults.

---
© 2026 Velocity Logic - Proprietary
