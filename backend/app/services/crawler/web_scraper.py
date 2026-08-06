import requests
from bs4 import BeautifulSoup
import re
from typing import Optional

class WebScraperService:
    @staticmethod
    def scrape_url(url: str) -> str:
        """Dynamically scrapes YouTube transcripts/metadata or article content from web URLs."""
        if "youtube.com" in url or "youtu.be" in url:
            return WebScraperService._extract_youtube_content(url)
        return WebScraperService.extract_url_content(url)

    @staticmethod
    def _extract_youtube_content(url: str) -> str:
        """Extracts real transcript captions or video metadata from YouTube URLs."""
        video_id_match = re.search(r"(?:v=|\/|embed\/|watch\?v=)([0-9A-Za-z_-]{11})", url)
        video_id = video_id_match.group(1) if video_id_match else None

        # 1. Try fetching real YouTube transcript using youtube_transcript_api
        if video_id:
            try:
                from youtube_transcript_api import YouTubeTranscriptApi
                transcript_data = None
                yt = YouTubeTranscriptApi()
                try:
                    transcript_data = yt.fetch(video_id, languages=['en', 'hi', 'es', 'fr', 'de'])
                except Exception:
                    try:
                        transcript_list = yt.list(video_id)
                        first_transcript = next(iter(transcript_list))
                        transcript_data = first_transcript.fetch()
                    except Exception:
                        pass

                if transcript_data:
                    formatted_lines = []
                    for entry in transcript_data[:60]: # Limit to first 60 caption entries
                        start = int(getattr(entry, 'start', 0) if not isinstance(entry, dict) else entry.get('start', 0))
                        minutes = start // 60
                        seconds = start % 60
                        time_str = f"[{minutes:02d}:{seconds:02d}]"
                        raw_text = getattr(entry, 'text', '') if not isinstance(entry, dict) else entry.get('text', '')
                        text = str(raw_text).replace('\n', ' ').strip()
                        if text:
                            formatted_lines.append(f"{time_str} {text}")

                    if formatted_lines:
                        return f"Source: YouTube Video (ID: {video_id})\nURL: {url}\n\nTranscript:\n" + "\n".join(formatted_lines)
            except Exception as e:
                print(f"youtube_transcript_api info for {video_id}: {e}")

        # 2. Fallback: Fetch real video title, author, and description dynamically via YouTube oEmbed & page metadata
        title = "YouTube Video"
        author = "Channel"
        description = ""
        try:
            oembed_url = f"https://www.youtube.com/oembed?url={url}&format=json"
            res = requests.get(oembed_url, timeout=5)
            if res.status_code == 200:
                data = res.json()
                title = data.get("title", title)
                author = data.get("author_name", author)
        except Exception:
            pass

        try:
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
            resp = requests.get(url, headers=headers, timeout=5)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, 'html.parser')
                meta_desc = soup.find("meta", attrs={"name": "description"}) or soup.find("meta", attrs={"property": "og:description"})
                if meta_desc and meta_desc.get("content"):
                    description = meta_desc["content"].strip()
                if title == "YouTube Video":
                    meta_title = soup.find("meta", attrs={"property": "og:title"}) or soup.find("title")
                    if meta_title:
                        title = meta_title.get("content") or meta_title.get_text()
        except Exception:
            pass

        content_parts = [f"Title: {title}", f"Channel/Creator: {author}"]
        if description:
            content_parts.append(f"Description:\n{description}")
        else:
            content_parts.append(f"Video URL: {url}")

        return f"Source: YouTube Video\n" + "\n\n".join(content_parts)

    @staticmethod
    def extract_url_content(url: str) -> str:
        """Crawls web URLs, removes ads/scripts, and extracts main readable article body."""
        try:
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
            resp = requests.get(url, headers=headers, timeout=10)
            if resp.status_code == 200:
                soup = BeautifulSoup(resp.text, 'html.parser')
                
                # Remove non-content tags
                for elem in soup(["script", "style", "nav", "footer", "header", "aside", "form"]):
                    elem.decompose()

                page_title = soup.title.string.strip() if soup.title and soup.title.string else ""
                paragraphs = [p.get_text().strip() for p in soup.find_all(['p', 'h1', 'h2', 'h3', 'article']) if len(p.get_text().strip()) > 20]
                
                if paragraphs:
                    body = "\n\n".join(paragraphs)
                    if page_title:
                        return f"Page Title: {page_title}\nURL: {url}\n\n{body}"
                    return body
        except Exception as err:
            print(f"Web scraping exception for {url}: {err}")

        return f"Source URL: {url}\nContent: Web reference content for {url}."
