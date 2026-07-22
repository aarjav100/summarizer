from typing import List, Dict, Any, Optional
from app.services.llm.provider import LLMProviderService
from app.schemas.schemas import SummaryItemResponse, SummaryResponse, LLMUsageMetrics

class SummaryGeneratorService:
    SUMMARY_PROMPTS = {
        "short": "Provide a concise 2-3 line high-level summary of the provided content.",
        "medium": "Provide a balanced 2-paragraph medium summary highlighting core principles and findings.",
        "detailed": "Provide an in-depth comprehensive summary breaking down background, methodology, results, and conclusions.",
        "bullet": "Summarize the key information into structured, easy-to-read bullet points.",
        "takeaways": "Extract the top 5 strategic key takeaways from the content.",
        "facts": "Extract essential empirical facts, figures, dates, and statistics.",
        "action_items": "Extract actionable next steps, recommendations, and tasks.",
        "faq": "Generate a list of Frequently Asked Questions (FAQs) with detailed answers based on the content.",
        "timeline": "Create a chronological timeline of key events, timestamps, or logical progression.",
        "chapters": "Divide the content into logical chapters or sections with sub-summaries for each.",
        "mcq": "Generate 5 Multiple Choice Questions (MCQs) with correct answer keys and explanations.",
        "definitions": "List important terms and their exact definitions mentioned in the content.",
        "formulae": "Extract all mathematical, financial, or logical formulas and equations.",
        "structured_json": "Output a clean, valid JSON representation of key entities, dates, and main conclusions."
    }

    @staticmethod
    def generate_multimodal_summary(
        content: str,
        requested_types: List[str],
        model_id: str = "gpt-4.1",
        filename: Optional[str] = None,
        file_id: str = "file-demo-id"
    ) -> SummaryResponse:
        from typing import Optional
        summaries: List[SummaryItemResponse] = []
        total_prompt_tokens = 0
        total_completion_tokens = 0
        total_cost = 0.0
        max_latency = 0.0

        for stype in requested_types:
            instruction = SummaryGeneratorService.SUMMARY_PROMPTS.get(stype, "Summarize the following text effectively.")
            prompt = f"{instruction}\n\nContent:\n{content[:4000]}"
            
            res = LLMProviderService.generate_completion(prompt=prompt, model_id=model_id, filename=filename)
            metrics: LLMUsageMetrics = res["metrics"]
            
            total_prompt_tokens += metrics.prompt_tokens
            total_completion_tokens += metrics.completion_tokens
            total_cost += metrics.estimated_cost_usd
            max_latency += metrics.response_time_ms

            title = stype.replace("_", " ").title() + " Summary"
            summaries.append(SummaryItemResponse(
                summary_type=stype,
                title=title,
                content=res["content"]
            ))

        combined_metrics = LLMUsageMetrics(
            model_name=model_id,
            provider="AI Router",
            prompt_tokens=total_prompt_tokens,
            completion_tokens=total_completion_tokens,
            total_tokens=total_prompt_tokens + total_completion_tokens,
            response_time_ms=round(max_latency, 2),
            estimated_cost_usd=round(total_cost, 6)
        )

        return SummaryResponse(
            file_id=file_id,
            summaries=summaries,
            metrics=combined_metrics
        )
