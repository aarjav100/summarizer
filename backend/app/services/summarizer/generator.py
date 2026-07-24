from typing import List, Dict, Any, Optional
from app.services.llm.provider import LLMProviderService
from app.schemas.schemas import SummaryItemResponse, SummaryResponse, LLMUsageMetrics

class SummaryGeneratorService:
    SUMMARY_PROMPTS = {
        "short": (
            "Summarize the following document in exactly 2-3 lines. Be extremely concise — capture only the single most important point or purpose of the document. No headers, no bullets, no bold — plain flowing sentences only.\n\n"
            "Document: {file_name}\n"
            "Content: {extracted_text}\n\n"
            "Output only the 2-3 line summary, nothing else."
        ),
        "medium": (
            "Summarize the following document in a single well-structured paragraph of 5-8 sentences. Cover the main sections and key points without going into granular detail. Use **bold** for key names, titles, or figures within the paragraph. No headers or bullet points.\n\n"
            "Document: {file_name}\n"
            "Content: {extracted_text}\n\n"
            "Output only the summary paragraph, nothing else."
        ),
        "detailed": (
            "Provide a detailed, well-organized summary of the following document. Use Markdown formatting: **bold headers** for each major section detected in the document, bullet points for individual entries within a section, nested sub-bullets for supporting details, and *italics* for dates. Cover all meaningful information — do not skip sections. Keep tone concise and professional.\n\n"
            "Document: {file_name}\n"
            "Content: {extracted_text}\n\n"
            "Output only the formatted summary, nothing else."
        ),
        "bullet": (
            "Convert the following document into a clean bullet-point list. Each bullet should capture one discrete fact, point, or entry. Use **bold** for key terms, names, or headers. Group related bullets under bold sub-headers if the document has multiple distinct sections. Do not write any paragraphs — bullets only.\n\n"
            "Document: {file_name}\n"
            "Content: {extracted_text}\n\n"
            "Output only the bullet list, nothing else."
        ),
        "takeaways": (
            "Extract the 4-6 most important takeaways from the following document. Each takeaway should be one bolded short title followed by a one-line explanation. Focus only on insights, outcomes, or high-value information — skip routine/filler details.\n\n"
            "Format each as:\n"
            "**Takeaway title** — explanation.\n\n"
            "Document: {file_name}\n"
            "Content: {extracted_text}\n\n"
            "Output only the list of takeaways, nothing else."
        ),
        "extracted_details": (
            "Extract and structure all factual details from the following document (names, dates, numbers, organizations, titles, contact info, etc.) into clearly labeled Markdown sections. Use **bold** for field labels and *italics* for dates. Use nested bullets for grouped/related details. Do not summarize or interpret — extract as-is, just organized.\n\n"
            "Document: {file_name}\n"
            "Content: {extracted_text}\n\n"
            "Output only the extracted details, nothing else."
        ),
        "action_items": (
            "Identify all action items, tasks, deadlines, or next steps mentioned or implied in the following document. Present each as a checkbox bullet with a bolded short action title, followed by any relevant deadline/date in italics.\n\n"
            "Format:\n"
            "- [ ] **Action title** — details (*deadline if any*)\n\n"
            "If no explicit action items exist, infer reasonable follow-up actions based on the document's context and label them \"(inferred)\".\n\n"
            "Document: {file_name}\n"
            "Content: {extracted_text}\n\n"
            "Output only the action item list, nothing else."
        ),
        "faq": (
            "Generate a set of 5-8 frequently asked questions (and answers) based on the following document. Questions should cover the most important or commonly-asked aspects of the content. Format each as:\n\n"
            "**Q: [question]**\n"
            "A: [answer]\n\n"
            "Keep answers concise (1-3 sentences) and grounded strictly in the document content.\n\n"
            "Document: {file_name}\n"
            "Content: {extracted_text}\n\n"
            "Output only the FAQ list, nothing else."
        ),
        "timeline": (
            "Extract a chronological timeline or chapter breakdown from the following document. If the document has explicit dates/events, list them in order. If it has sections/chapters instead of dates, list them in their logical sequence.\n\n"
            "Format each entry as:\n"
            "**[Date or Chapter #]** — Title/Event\n"
            "  - Brief description\n\n"
            "Order entries chronologically or sequentially as they appear in the source.\n\n"
            "Document: {file_name}\n"
            "Content: {extracted_text}\n\n"
            "Output only the timeline, nothing else."
        ),
        "mcq": (
            "You are a quiz generator. Based strictly on the following document content, generate 5 multiple-choice questions to test a reader's understanding and recall of the material.\n\n"
            "Rules:\n"
            "- Each question must be answerable using only information present in the document — do not invent facts.\n"
            "- Provide 4 options (A-D) per question, only one correct.\n"
            "- Vary question difficulty: 2 easy (direct recall), 2 medium (requires connecting two facts), 1 hard (requires inference from context).\n"
            "- Do not repeat the same fact across multiple questions.\n"
            "- If the document is short or lacks enough distinct facts for 5 questions, generate as many high-quality questions as the content supports (minimum 3) rather than padding with weak/duplicate questions.\n\n"
            "Format each question as:\n"
            "**Q1. [question]**\n"
            "A) [option]\n"
            "B) [option]\n"
            "C) [option]\n"
            "D) [option]\n"
            "**Answer:** [correct letter] — [1-line explanation citing the relevant part of the document]\n\n"
            "Document: {file_name}\n"
            "Content: {extracted_text}\n\n"
            "Output only the quiz questions, nothing else."
        ),
        "structured_json": (
            "Extract all relevant information from the following document and return it strictly as valid JSON. Do not include any explanation, commentary, or Markdown formatting — output raw JSON only.\n\n"
            "Use this general schema, adapting fields to fit the actual document type detected:\n"
            "{\n"
            "  \"document_type\": \"string\",\n"
            "  \"file_name\": \"string\",\n"
            "  \"summary\": \"string\",\n"
            "  \"sections\": [\n    {\n      \"title\": \"string\",\n      \"entries\": [\n        {\n          \"name\": \"string\",\n          \"subtitle\": \"string\",\n          \"date_range\": \"string\",\n          \"details\": [\"string\"]\n        }\n      ]\n    }\n  ]\n}\n\n"
            "Document: {file_name}\n"
            "Content: {extracted_text}\n\n"
            "Output only the JSON object, nothing else."
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
            prompt = instruction.format(
                file_name=filename or "source",
                extracted_text=content[:4000]
            )
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
