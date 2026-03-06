"""
Pricing Engine Service
Handles loading pricing data and calculating quotes with fuzzy matching.
"""

import pandas as pd
import os
from typing import Dict, List, Any
import json
from typing import Dict, List, Any
from thefuzz import fuzz, process


class PricingEngine:
    """Manages pricing data and calculates quotes."""
    
    def __init__(self, pricing_csv_path: str = "data/pricing.csv", labour_rates_path: str = "data/labour_rates.json"):
        """
        Initialize the pricing engine.
        
        Args:
            pricing_csv_path: Path to the pricing CSV file
            labour_rates_path: Path to the city-level labour rates JSON
        """
        self.pricing_csv_path = pricing_csv_path
        self.labour_rates_path = labour_rates_path
        self.df = None
        self.labour_rates = {}
        self.load_pricing_data()
        self.load_labour_rates()

    def load_labour_rates(self) -> None:
        """Load regional labour premiums."""
        try:
            if os.path.exists(self.labour_rates_path):
                with open(self.labour_rates_path, 'r') as f:
                    self.labour_rates = json.load(f)
                print(f"✓ Loaded regional labour rates from {self.labour_rates_path}")
        except Exception as e:
            print(f"✗ Warning: Failed to load labour rates: {e}")
            self.labour_rates = {}

    def get_labour_premium(self, province: str, city: str) -> float:
        """Get the labour premium for a specific city."""
        try:
            return self.labour_rates.get(province, {}).get(city, 0.0)
        except: return 0.0
    
    def load_pricing_data(self) -> None:
        """Load pricing data from CSV into DataFrame."""
        try:
            if not os.path.exists(self.pricing_csv_path):
                raise FileNotFoundError(
                    f"Pricing file not found: {self.pricing_csv_path}"
                )
            
            self.df = pd.read_csv(self.pricing_csv_path)
            
            # Validate required columns
            required_columns = ["Service Name", "Unit Price"]
            missing_columns = [col for col in required_columns if col not in self.df.columns]
            if missing_columns:
                raise ValueError(f"Missing required columns: {missing_columns}")
            
            # Convert Unit Price to float
            self.df["Unit Price"] = pd.to_numeric(self.df["Unit Price"], errors="coerce")
            
            print(f"✓ Loaded {len(self.df)} pricing items from {self.pricing_csv_path}")
            
        except Exception as e:
            print(f"✗ Error loading pricing data: {e}")
            raise
    
    def _fuzzy_match_service(self, service_request: str, threshold: int = 60) -> Dict[str, Any]:
        """
        Find the best matching service using fuzzy string matching.
        
        Args:
            service_request: The service name requested by the customer
            threshold: Minimum similarity score (0-100)
        
        Returns:
            Dictionary with matched service row or None
        """
        if self.df is None or len(self.df) == 0:
            return None
        
        # Combine Service Name and Keywords for matching
        search_texts = []
        for idx, row in self.df.iterrows():
            # Combine service name and keywords
            searchable_text = str(row.get("Service Name", ""))
            if pd.notna(row.get("Keywords")):
                searchable_text += " " + str(row.get("Keywords", ""))
            search_texts.append((idx, searchable_text))
        
        # Find best match
        best_match = None
        best_score = 0
        
        for idx, text in search_texts:
            # Use partial ratio for better matching of substrings
            score = max(
                fuzz.partial_ratio(service_request.lower(), text.lower()),
                fuzz.ratio(service_request.lower(), text.lower())
            )
            
            if score > best_score and score >= threshold:
                best_score = score
                best_match = idx
        
        if best_match is not None:
            matched_row = self.df.iloc[best_match].to_dict()
            matched_row["match_score"] = best_score
            return matched_row
        
        return None
    
    def calculate_quote(self, extracted_items: List[Dict[str, Any]], tax_rate: float = 0.10, markup_percent: float = 0.0, winter_multiplier_active: bool = False, city: str = None, province: str = None) -> Dict[str, Any]:
        """
        Calculate quote from extracted items.
        
        Args:
            extracted_items: List of dicts with 'service_requested' and 'quantity' keys
            tax_rate: Tax rate as decimal (default 10%)
            markup_percent: Optional markup percentage (e.g., 0.20 for 20%)
            winter_multiplier_active: Whether to apply the +30% frozen ground surcharge
            city: Customer city for regional labour premium
            province: Customer province
        
        Returns:
            Dictionary with line_items, subtotal, tax, and total
        """
        if self.df is None:
            raise ValueError("Pricing data not loaded")
        
        line_items = []
        subtotal = 0.0
        winter_surcharge_total = 0.0
        regional_premium_total = 0.0
        
        # Regional Labour Premium
        regional_multiplier = 1.0
        premium_rate = 0.0
        if city and province:
            premium_rate = self.get_labour_premium(province, city)
            regional_multiplier = 1.0 + premium_rate
            
        winter_multiplier = 1.30 if winter_multiplier_active else 1.0
        markup_multiplier = 1.0 + markup_percent
        
        for item in extracted_items:
            service_requested = item.get("service_requested", "").strip()
            quantity = item.get("quantity", 1)
            
            if not service_requested:
                continue
            
            # Try to match the service
            matched_service = self._fuzzy_match_service(service_requested)
            
            if matched_service:
                base_unit_price = float(matched_service.get("Unit Price", 0))
                
                # Apply multipliers: Base * Markup * Regional * Winter
                final_unit_price = base_unit_price * markup_multiplier * regional_multiplier * winter_multiplier
                line_total = final_unit_price * quantity
                
                # Surcharge breakdowns for visibility
                winter_surcharge = (base_unit_price * markup_multiplier * regional_multiplier * 0.30) * quantity if winter_multiplier_active else 0
                regional_premium_amt = (base_unit_price * markup_multiplier * premium_rate) * quantity if premium_rate > 0 else 0
                
                winter_surcharge_total += winter_surcharge
                regional_premium_total += regional_premium_amt
                
                # Build AI Reasoning hint
                ai_reasoning = f"Market rate for {matched_service.get('Service Name')}"
                if markup_percent > 0:
                    ai_reasoning += f" + {int(markup_percent*100)}% standard markup"
                if premium_rate > 0:
                    ai_reasoning += f" + {int(premium_rate*100)}% {city} labour premium"
                if winter_multiplier_active:
                    ai_reasoning += " + 30% winter condition surcharge"

                line_item = {
                    "service_name": matched_service.get("Service Name", service_requested),
                    "description": matched_service.get("Description", ""),
                    "quantity": quantity,
                    "unit_price": round(final_unit_price, 2),
                    "base_price": base_unit_price,
                    "unit": matched_service.get("Unit", "Each"),
                    "line_total": round(line_total, 2),
                    "match_score": matched_service.get("match_score", 0),
                    "winter_multiplier_active": winter_multiplier_active,
                    "winter_surcharge": round(winter_surcharge, 2),
                    "regional_premium_active": premium_rate > 0,
                    "regional_premium_amount": round(regional_premium_amt, 2),
                    "city": city,
                    "ai_reasoning": ai_reasoning
                }
                
                line_items.append(line_item)
                subtotal += line_total
            else:
                # If no match found, add as unknown item with zero price
                print(f"⚠ Warning: Could not match service '{service_requested}'")
                line_item = {
                    "service_name": service_requested,
                    "description": "Service not found in pricing database",
                    "quantity": quantity,
                    "unit_price": 0.0,
                    "unit": "Each",
                    "line_total": 0.0,
                    "match_score": 0,
                    "needs_price": True
                }
                line_items.append(line_item)
        
        tax = subtotal * tax_rate
        total = subtotal + tax
        
        return {
            "line_items": line_items,
            "subtotal": round(subtotal, 2),
            "tax": round(tax, 2),
            "tax_rate": tax_rate,
            "total": round(total, 2),
            "markup_percent": markup_percent,
            "winter_multiplier_active": winter_multiplier_active,
            "winter_surcharge_total": round(winter_surcharge_total, 2),
            "regional_premium_total": round(regional_premium_total, 2),
            "city": city
        }

