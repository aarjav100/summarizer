import re
from typing import List, Dict, Any, Optional
from collections import Counter

class NLPProcessorService:
    """
    Advanced NLP Preprocessing Pipeline for Document & PDF Summarization.
    Performs text cleaning, sentence segmentation, keyword extraction,
    named entity / key figure detection, structure-aware chunking,
    and hierarchical context selection before LLM summarization.
    """

    @staticmethod
    def clean_and_normalize_text(text: str) -> str:
        """Normalizes Unicode characters, removes control codes, header/footer noise, and excessive whitespace."""
        if not text:
            return ""

        # Strip HTML/XML tags if present
        text = re.sub(r'<script.*?>.*?</script>', '', text, flags=re.DOTALL | re.IGNORECASE)
        text = re.sub(r'<style.*?>.*?</style>', '', text, flags=re.DOTALL | re.IGNORECASE)
        text = re.sub(r'<[^>]+>', ' ', text)

        # Fix ligatures and common PDF OCR font artifacts
        ligatures = {
            'ﬁ': 'fi', 'ﬂ': 'fl', '¨': '', '™': '', '®': '',
            '©': '', '•': ' - ', '▪': ' - ', '■': ' - ', '►': ' - '
        }
        for lig, repl in ligatures.items():
            text = text.replace(lig, repl)

        # Remove repetitive header/footer page numbers like "Page 1 of 12"
        text = re.sub(r'(?i)page\s+\d+\s+of\s+\d+', '', text)
        text = re.sub(r'(?i)^\s*\d+\s*$', '', text, flags=re.MULTILINE)

        # Preserve double newlines for paragraph structure while collapsing horizontal whitespace
        lines = [re.sub(r'[ \t]+', ' ', line).strip() for line in text.splitlines()]
        cleaned_text = '\n'.join(lines)
        cleaned_text = re.sub(r'\n{3,}', '\n\n', cleaned_text)
        return cleaned_text.strip()

    @staticmethod
    def segment_sentences(text: str) -> List[str]:
        """Segments text into natural sentence units while protecting abbreviations, acronyms, and numbers."""
        if not text:
            return []

        try:
            import nltk
            try:
                sentences = nltk.tokenize.sent_tokenize(text)
                if sentences:
                    return [s.strip() for s in sentences if s.strip()]
            except Exception:
                pass
        except ImportError:
            pass

        # Robust regex-based fallback sentence segmentation
        # Protect common abbreviations like e.g., i.e., Dr., Vol., etc.
        protected = re.sub(r'\b(e\.g\.|i\.e\.|vs\.|Dr\.|Mr\.|Mrs\.|Prof\.|Inc\.|Ltd\.|Vol\.|pp\.)', r'\1<NOP>', text, flags=re.IGNORECASE)
        
        # Split on sentence terminals followed by space and uppercase or newline
        raw_sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9\n])', protected)
        
        sentences = []
        for s in raw_sentences:
            s_clean = s.replace('<NOP>', '').strip()
            if s_clean:
                sentences.append(s_clean)
                
        return sentences

    @staticmethod
    def extract_keywords_and_entities(text: str, top_k: int = 15) -> Dict[str, Any]:
        """Extracts key terms, proper noun entities, numbers, and dates using term frequency analysis."""
        stopwords = {
            'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
            'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'can\'t', 'cannot',
            'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has',
            'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into',
            'is', 'it', 'its', 'itself', 'just', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once',
            'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'should', 'so', 'some', 'such',
            'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those',
            'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while',
            'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves', 'this', 'also', 'using', 'used'
        }

        words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
        filtered_words = [w for w in words if w not in stopwords]
        word_freq = Counter(filtered_words)
        top_keywords = [w for w, _ in word_freq.most_common(top_k)]

        # Detect Proper Nouns & Capitalized Named Entities
        entities = set(re.findall(r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b', text))
        # Filter out common sentence starters
        entities = [e for e in entities if len(e.split()) > 1 or e.lower() not in stopwords]

        # Detect Dates & Key Numerical Figures
        dates_and_figures = re.findall(r'\b(?:\d{1,4}[-/]\d{1,2}[-/]\d{1,4}|\d{4}|\$\d+(?:\.\d+)?%?|\d+(?:\.\d+)?%)\b', text)

        return {
            "keywords": top_keywords,
            "entities": entities[:10],
            "figures": list(set(dates_and_figures))[:10]
        }

    @staticmethod
    def detect_important_sentences(text: str, max_sentences: int = 10) -> List[str]:
        """Scores and ranks sentences based on keyword density, position, and entity presence."""
        sentences = NLPProcessorService.segment_sentences(text)
        if not sentences:
            return []

        analysis = NLPProcessorService.extract_keywords_and_entities(text)
        keywords = set(analysis["keywords"])

        scored_sentences = []
        for idx, sentence in enumerate(sentences):
            words = set(re.findall(r'\b[a-zA-Z]{3,}\b', sentence.lower()))
            overlap = len(words.intersection(keywords))
            
            # Position boost: first 20% of text usually contains abstract / introduction
            position_score = 1.5 if idx < max(2, len(sentences) * 0.2) else 1.0
            
            # Numerical / entity boost
            has_numbers = 1.2 if re.search(r'\d+', sentence) else 1.0

            total_score = (overlap * position_score * has_numbers) / max(1, len(words) ** 0.5)
            scored_sentences.append((total_score, idx, sentence))

        # Sort descending by score
        scored_sentences.sort(key=lambda x: x[0], reverse=True)
        
        # Take top sentences and restore original reading order
        top_sentences = sorted(scored_sentences[:max_sentences], key=lambda x: x[1])
        return [s for _, _, s in top_sentences]

    @staticmethod
    def structure_aware_chunking(text: str, max_chunk_chars: int = 1800, overlap_sentences: int = 1) -> List[Dict[str, Any]]:
        """
        Splits text into chunks preserving sentence boundaries, headings, and paragraph structure.
        """
        cleaned = NLPProcessorService.clean_and_normalize_text(text)
        paragraphs = [p.strip() for p in cleaned.split('\n\n') if p.strip()]

        chunks = []
        current_chunk_sentences: List[str] = []
        current_chunk_length = 0
        chunk_idx = 0

        for para in paragraphs:
            para_sentences = NLPProcessorService.segment_sentences(para)
            for sentence in para_sentences:
                s_len = len(sentence)
                
                if current_chunk_length + s_len > max_chunk_chars and current_chunk_sentences:
                    chunk_text = ' '.join(current_chunk_sentences)
                    chunks.append({
                        "chunk_index": chunk_idx,
                        "content": chunk_text,
                        "page_number": (chunk_idx // 3) + 1
                    })
                    chunk_idx += 1

                    # Keep sentence overlap for context continuity
                    if overlap_sentences > 0 and len(current_chunk_sentences) >= overlap_sentences:
                        current_chunk_sentences = current_chunk_sentences[-overlap_sentences:]
                        current_chunk_length = sum(len(s) for s in current_chunk_sentences)
                    else:
                        current_chunk_sentences = []
                        current_chunk_length = 0

                current_chunk_sentences.append(sentence)
                current_chunk_length += s_len

        if current_chunk_sentences:
            chunk_text = ' '.join(current_chunk_sentences)
            chunks.append({
                "chunk_index": chunk_idx,
                "content": chunk_text,
                "page_number": (chunk_idx // 3) + 1
            })

        return chunks
