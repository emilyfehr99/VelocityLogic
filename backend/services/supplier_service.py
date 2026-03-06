import os
import csv
import json
from typing import List, Dict, Any

class SupplierService:
    """Monitors material cost shifts and alerts on price drift."""
    
    def __init__(self, pricing_csv: str, history_json: str):
        self.pricing_csv = pricing_csv
        self.history_json = history_json

    def _load_current_prices(self) -> Dict[str, float]:
        prices = {}
        if not os.path.exists(self.pricing_csv):
            return prices
        with open(self.pricing_csv, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                name = row['Service Name']
                price = float(row['Unit Price'])
                prices[name] = price
        return prices

    def _load_history(self) -> Dict[str, float]:
        if not os.path.exists(self.history_json):
            return {}
        try:
            with open(self.history_json, 'r') as f:
                return json.load(f)
        except:
            return {}

    def _save_history(self, prices: Dict[str, float]):
        with open(self.history_json, 'w') as f:
            json.dump(prices, f, indent=4)

    def check_for_drift(self) -> List[Dict[str, Any]]:
        """Compares current prices with history and alerts on >10% shift."""
        current = self._load_current_prices()
        history = self._load_history()
        alerts = []

        if not history:
            # First run, establish baseline
            self._save_history(current)
            return []

        for name, current_price in current.items():
            if name in history:
                old_price = history[name]
                if old_price == 0: continue
                
                drift = (current_price - old_price) / old_price
                if abs(drift) >= 0.10: # 10% threshold
                    alerts.append({
                        "service": name,
                        "old_price": old_price,
                        "new_price": current_price,
                        "drift_percent": round(drift * 100, 1),
                        "type": "INCREASE" if drift > 0 else "DECREASE"
                    })

        # Update history to current for next check (or keep it as baseline?)
        # For this demo, let's treat any change we alerted on as the new baseline
        self._save_history(current)
        return alerts
