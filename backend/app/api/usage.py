from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/usage", tags=["Usage"])

@router.get("")
def get_usage_metrics() -> Dict[str, Any]:
    return {
        "monthly_summaries_generated": 142,
        "total_tokens_consumed": 489200,
        "total_estimated_cost_usd": 1.45,
        "storage_used_mb": 84.5,
        "plan_limit_summaries": 1000,
        "plan": "Pro"
    }
