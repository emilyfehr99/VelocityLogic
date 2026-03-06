"""
Rebate Service
Handles logic for Canadian provincial HVAC and home incentive rebates.
"""

from typing import Dict, List, Any, Optional

class RebateService:
    """Manages identification of provincial rebates for Manitoba and Saskatchewan."""
    
    REBATES = {
        "Manitoba": [
            {
                "id": "MB_GREEN_HOMES",
                "name": "Manitoba Greener Homes Grant",
                "description": "Grant for energy-efficient retrofits including heat pumps and insulation.",
                "keywords": ["heat pump", "insulation", "sealing", "windows"],
                "amount_text": "Up to $5,000",
                "link": "https://www.efficiency-manitoba.ca/my-home/greener-homes/",
                "portal_url": "https://efficiencyMB.ca/apply"
            }
        ],
        "Saskatchewan": [
            {
                "id": "SK_HVAC_REBATE",
                "name": "SaskEnergy Residential Equipment Program",
                "description": "Rebate for high-efficiency furnaces and water heaters.",
                "keywords": ["furnace", "water heater", "boiler"],
                "amount_text": "Up to $1,000",
                "link": "https://www.saskenergy.com/ways-save/residential-equipment-program",
                "portal_url": "https://www.saskenergy.com/apply"
            }
        ]
    }

    def find_eligible_rebates(self, province: str, services: List[str]) -> List[Dict[str, Any]]:
        """
        Identify rebates based on province and services requested.
        
        Args:
            province: Target province (e.g., 'Manitoba')
            services: List of service names or descriptions
            
        Returns:
            List of eligible rebate dictionaries
        """
        eligible = []
        provincial_rebates = self.REBATES.get(province, [])
        
        for rebate in provincial_rebates:
            for service in services:
                if any(kw.lower() in service.lower() for kw in rebate["keywords"]):
                    eligible.append(rebate)
                    break # Don't add same rebate twice for multiple items
                    
        return eligible

    def calculate_net_cost(self, total: float, eligible_rebates: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculate simplified net cost for the client view.
        Note: This is an estimate as exact rebate values depend on specific model numbers.
        """
        estimated_rebate = 0
        # Logic to estimate rebate value based on type
        for r in eligible_rebates:
            if "5,000" in r["amount_text"]:
                estimated_rebate += 1200 # Conservative estimate for marketing
            elif "1,000" in r["amount_text"]:
                estimated_rebate += 400
                
        return {
            "gross_total": total,
            "estimated_rebate": estimated_rebate,
            "net_total": total - estimated_rebate
        }
