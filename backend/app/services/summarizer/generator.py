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
        "structured_json": "Output a clean, valid JSON representation of key entities, dates, and main conclusions.",
        "extracted_details": (
            "You are a document extraction and formatting assistant. You will receive raw extracted text from an uploaded file "
            "(this could be a resume, ID/certificate, invoice, contract, report, or any other document type). "
            "Follow these steps:\n"
            "STEP 1 — Identify Document Type\n"
            "Determine what kind of document this is (e.g., Resume, Invoice, ID/Certificate, Contract, Report, Letter, Form, or Other) based on the content.\n"
            "STEP 2 — Format Accordingly\n"
            "General rules for all document types:\n"
            "- Start with a bold title line: **Extracted details:**\n"
            "- Use Markdown formatting: **bold** for names, titles, key labels, and headers; *italics* for dates.\n"
            "- Break long unstructured paragraphs into clearly separated sections and bullet points — never output one long run-on paragraph.\n"
            "- Use nested sub-bullets for details belonging to a parent item (e.g., coursework under a degree, line items under an invoice).\n"
            "- Do not repeat information. Clean up merged/run-on text into properly separated fields.\n"
            "- Keep tone concise and professional. No extra commentary or explanations — output only the formatted result.\n"
            "Type-specific structure:\n"
            "- If Resume: sections = **Education**, **Experience**, **Skills**, **Projects**, **Certifications** (include only sections with data). Bold institution/company + role/degree; italicize dates.\n"
            "- If Invoice/Receipt: sections = **Vendor Details**, **Bill To**, **Items** (table or bullet list with quantity/price), **Total Amount**, **Date**, **Invoice #**.\n"
            "- If ID/Certificate: sections = **Name**, **Document Type**, **ID/Certificate Number**, **Issue Date**, **Expiry Date** (if applicable), **Issuing Authority**.\n"
            "- If Contract/Agreement: sections = **Parties Involved**, **Effective Date**, **Key Terms**, **Obligations**, **Duration/Termination Clause**.\n"
            "- If Report: sections = **Title**, **Summary**, **Key Findings**, **Data/Metrics**, **Conclusion/Recommendations**.\n"
            "- If none of the above fit clearly: create logical sections based on the natural structure of the content, using bold headers for each distinct topic."
        )
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
        import concurrent.futures
        summaries: List[SummaryItemResponse] = []
        total_prompt_tokens = 0
        total_completion_tokens = 0
        total_cost = 0.0
        max_latency = 0.0

        def get_single_summary(stype: str):
            instruction = SummaryGeneratorService.SUMMARY_PROMPTS.get(stype, "Summarize the following text effectively.")
            prompt = f"{instruction}\n\nContent:\n{content[:4000]}"
            return LLMProviderService.generate_completion(prompt=prompt, model_id=model_id, filename=filename)

        # Generate each summary type in parallel to prevent gateway timeout
        with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, len(requested_types))) as executor:
            future_to_stype = {executor.submit(get_single_summary, stype): stype for stype in requested_types}
            
            results = {}
            for future in concurrent.futures.as_completed(future_to_stype):
                stype = future_to_stype[future]
                try:
                    results[stype] = future.result()
                except Exception as exc:
                    print(f"Summary generation for {stype} failed: {exc}")
                    results[stype] = {
                        "content": f"Unable to generate {stype} summary at this time.",
                        "metrics": LLMUsageMetrics(
                            model_name=model_id,
                            provider="AI Router",
                            prompt_tokens=0,
                            completion_tokens=0,
                            total_tokens=0,
                            response_time_ms=0.0,
                            estimated_cost_usd=0.0
                        )
                    }

        for stype in requested_types:
            res = results.get(stype)
            if not res:
                continue
            metrics: LLMUsageMetrics = res["metrics"]
            total_prompt_tokens += metrics.prompt_tokens
            total_completion_tokens += metrics.completion_tokens
            total_cost += metrics.estimated_cost_usd
            max_latency = max(max_latency, metrics.response_time_ms)

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
