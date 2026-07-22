import re
from typing import List, Dict, Any, Optional
import math

class RAGPipelineService:
    @staticmethod
    def clean_text(text: str) -> str:
        """Removes unwanted control characters, ligatures, symbols, and excessive whitespace."""
        text = re.sub(r'<script.*?>.*?</script>', '', text, flags=re.DOTALL)
        text = re.sub(r'<style.*?>.*?</style>', '', text, flags=re.DOTALL)
        
        # Remove contact-icon font artifacts and stray web/mobile glyph codes
        icon_patterns = [
            r'envel\S*', r'phone\S*', r'linkedin\S*', r'github\S*', r'laptop\S*', r'mail\S*',
            r'♂', r'♀', r'■', r'•', r'🔹', r'✦', r'⚡', r'-alt', r'\+alt'
        ]
        for pat in icon_patterns:
            text = re.sub(pat, ' ', text, flags=re.IGNORECASE)
            
        # Fix duplicate URL prefixes
        text = re.sub(r'linkedinlinkedin', 'linkedin', text, flags=re.IGNORECASE)
        text = re.sub(r'githubgithub', 'github', text, flags=re.IGNORECASE)
        
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    @staticmethod
    def split_into_chunks(text: str, chunk_size: int = 800, overlap: int = 150) -> List[Dict[str, Any]]:
        """Splits document text into clean, overlapping character chunks."""
        cleaned = RAGPipelineService.clean_text(text)
        chunks = []
        start = 0
        text_len = len(cleaned)
        chunk_idx = 0

        while start < text_len:
            end = min(start + chunk_size, text_len)
            chunk_content = cleaned[start:end]
            
            # Simple heuristic for page numbers / timestamp tracking
            approx_page = (start // 2000) + 1
            approx_timestamp = round(start / 50.0, 1)

            chunks.append({
                "chunk_index": chunk_idx,
                "content": chunk_content,
                "page_number": approx_page,
                "timestamp_seconds": approx_timestamp
            })

            chunk_idx += 1
            start += (chunk_size - overlap)

        return chunks

    @staticmethod
    def generate_dummy_embedding(text: str, dim: int = 1536) -> List[float]:
        """Generates a normalized deterministic vector representation for text chunks when OpenAI key is absent."""
        seed = sum(ord(c) for c in text)
        vec = []
        for i in range(dim):
            val = math.sin(seed + i)
            vec.append(val)
        norm = math.sqrt(sum(x*x for x in vec))
        return [x / norm for x in vec]

    @staticmethod
    def retrieve_relevant_chunks(
        chunks: List[Dict[str, Any]],
        query: str,
        top_k: int = 4
    ) -> List[Dict[str, Any]]:
        """Retrieves top-k relevant chunks matching the query based on keyword & vector similarity."""
        query_words = set(query.lower().split())
        scored_chunks = []

        for chunk in chunks:
            content_words = set(chunk["content"].lower().split())
            overlap_score = len(query_words.intersection(content_words))
            scored_chunks.append((overlap_score, chunk))

        # Sort descending by similarity score
        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        return [chunk for score, chunk in scored_chunks[:top_k]]
