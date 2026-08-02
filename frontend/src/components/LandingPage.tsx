import React, { useState } from 'react';
import { SEO } from './SEO';
import { Link } from 'react-router-dom';

interface LandingPageProps {
  onEnterWorkspace: () => void;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
}

const FAQ_ITEMS = [
  {
    q: 'What types of files can I upload to SummaMind?',
    a: 'SummaMind Studio accepts PDF documents (including scanned PDFs via built-in OCR), standard images (PNG, JPG, WebP), audio recordings (MP3, WAV, M4A processed by OpenAI Whisper), plain text and Markdown files, and direct website URLs for automated web crawling. Each format is processed by a dedicated ingestion module.'
  },
  {
    q: 'How does page-level citation grounding work?',
    a: 'When you interact with the RAG Chat interface, every AI-generated answer is assembled from retrieved source chunks stored in our Supabase pgvector database. Each chunk carries a page number and source text reference. These are rendered as hoverable citation pills in the response, letting you verify every claim against the original document instantly.'
  },
  {
    q: 'Which AI models are available for summarization?',
    a: 'You can choose between four options: Smart AI Router (automatically selects the optimal model based on your document type), OpenAI GPT-4.1 Turbo (best for structured extraction and legal/technical documents), Anthropic Claude Sonnet 5 (excellent for nuanced narrative synthesis), and Google Gemini 2.5 Pro (superior for multimodal tasks involving images and charts).'
  },
  {
    q: 'Is my uploaded document data kept private?',
    a: 'Yes. All file transfers are encrypted with TLS 1.3. Your documents are indexed in an isolated Supabase pgvector schema tied exclusively to your user account ID. We enforce zero model retraining agreements with all LLM providers, meaning your confidential text is never used to train any public foundation model.'
  },
  {
    q: 'What summary formats can SummaMind generate?',
    a: 'SummaMind generates eleven distinct summary formats from a single document: Short Summary, Medium Summary, Detailed Summary, Bullet Points, Key Takeaways, Extracted Details, Action Items, Generated FAQ, Timeline & Chapters, MCQ Quiz, and Structured JSON. You can generate all eleven simultaneously or select specific formats based on your workflow.'
  }
];

const USE_CASES = [
  {
    icon: '🔬',
    audience: 'Researchers & Academics',
    description: 'Distill 200-page academic papers, literature reviews, and technical whitepapers into structured summaries, timelines of findings, and auto-generated quiz questions for knowledge retention. Annotate claims directly back to source page numbers.',
    examples: ['Research Paper Analysis', 'Literature Review Synthesis', 'Grant Proposal Review']
  },
  {
    icon: '⚖️',
    audience: 'Legal Professionals',
    description: 'Process contracts, court filings, compliance regulations, and case law into plain-language summaries with exact clause citations. Generate action item checklists from legal briefs and timelines from deposition transcripts.',
    examples: ['Contract Review', 'Regulatory Compliance', 'Deposition Analysis']
  },
  {
    icon: '🎓',
    audience: 'Students & Educators',
    description: 'Transform dense textbook chapters and lecture notes into concise study guides, flashcard-ready bullet points, and auto-generated MCQ tests. Use the RAG chat to ask questions about your syllabus materials and get cited answers.',
    examples: ['Study Guide Creation', 'MCQ Quiz Generation', 'Lecture Note Summaries']
  },
  {
    icon: '💼',
    audience: 'Business Executives',
    description: 'Condense annual reports, investor decks, market research PDFs, and board meeting transcripts into executive summaries and action item lists in under 60 seconds. Compare multiple documents side by side in the Reading Room.',
    examples: ['Board Report Summaries', 'Market Research Briefs', 'Meeting Transcript Analysis']
  }
];

const FILE_FORMATS = [
  { format: 'PDF Documents', extensions: '.pdf', engine: 'PyMuPDF + OCR Fallback', notes: 'Supports scanned PDFs via Tesseract OCR engine' },
  { format: 'Images (Scanned Docs)', extensions: '.png, .jpg, .webp', engine: 'Tesseract OCR Engine', notes: 'Full text extraction from photos of printed documents' },
  { format: 'Audio Files', extensions: '.mp3, .wav, .m4a', engine: 'OpenAI Whisper STT', notes: 'Speech-to-text transcription before summarization' },
  { format: 'Plain Text / Markdown', extensions: '.txt, .md', engine: 'Direct Ingestion', notes: 'Supports raw notes, code documentation, and reports' },
  { format: 'Website URLs', extensions: 'https://...', engine: 'Web Crawler', notes: 'Crawls article content, blog posts, and documentation pages' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Upload or Link Your Source',
    detail: 'Drop a PDF, image, audio file, text document, or paste a website URL into the Reading Room upload panel. SummaMind automatically detects the file type and routes it to the correct ingestion module — whether that\'s PyMuPDF for PDFs, Tesseract OCR for scanned images, or OpenAI Whisper for audio transcripts.'
  },
  {
    step: '02',
    title: 'Intelligent Chunking & Indexing',
    detail: 'Your document is parsed into semantically coherent text chunks, each tagged with page number and positional metadata. These chunks are converted into 1536-dimensional vector embeddings and stored in an isolated Supabase pgvector schema tied to your account for sub-second retrieval.'
  },
  {
    step: '03',
    title: 'Select Your Output Format',
    detail: 'Choose from eleven tailored output modes: concise short summaries, medium executive overviews, deep-dive detailed analyses, bullet-point key lists, chronological timelines, auto-generated FAQs, MCQ quizzes, action item guides, structured JSON data, key takeaways, or full extracted details. Generate all formats simultaneously with a single click.'
  },
  {
    step: '04',
    title: 'Chat & Verify With Citations',
    detail: 'Open the RAG Chat interface to ask any natural language question about your documents. Every answer is assembled from retrieved source chunks and annotated with hoverable citation pills — each showing the exact document name, page number, and original source text — so you can independently verify every claim.'
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterWorkspace,
  onOpenLogin,
  isLoggedIn
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const cardStyle: React.CSSProperties = {
    background: '#132420',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '24px',
    transition: 'border-color 0.2s ease'
  };

  return (
    <div
      className="landing-container"
      style={{
        color: '#EDE6D6',
        fontFamily: "'IBM Plex Sans', sans-serif",
        padding: '60px 24px 80px 24px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}
    >
      <SEO
        title="SummaMind Studio — Multimodal AI Document Intelligence"
        description="Transform raw reports, dense PDFs, images, web links, and audio transcripts into clean, tailored summaries and query them dynamically with page-level citations."
        canonicalUrl="https://www.summamind.shop/"
      />

      {/* ─── Hero Section ─── */}
      <div style={{ marginBottom: '72px', textAlign: 'center' }}>
        <div style={{ fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '14px' }}>
          MULTIMODAL AI DOCUMENT INTELLIGENCE
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '52px',
            fontWeight: 'normal',
            lineHeight: '1.15',
            color: 'var(--gold)',
            margin: '0 0 20px 0'
          }}
        >
          Enter the Sanctuary of <br />
          Silent Thought
        </h1>
        <p
          style={{
            fontSize: '17px',
            lineHeight: '1.7',
            color: '#A8C3B8',
            maxWidth: '680px',
            margin: '0 auto 36px auto'
          }}
        >
          SummaMind Studio transforms raw reports, dense PDFs, scanned images, crawled websites, and audio transcripts into clean, tailored summaries — then lets you interrogate them with grounded RAG citations that verify every claim back to the source page.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/workspace"
            className="btn-primary"
            style={{
              padding: '14px 32px',
              fontSize: '15px',
              fontWeight: 'bold',
              borderRadius: '6px',
              background: 'var(--gold)',
              color: '#152622',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(212, 175, 55, 0.25)',
              transition: 'opacity 0.2s ease'
            }}
          >
            Open Reading Room
          </Link>

          {!isLoggedIn && (
            <button
              onClick={onOpenLogin}
              style={{
                padding: '14px 32px',
                fontSize: '15px',
                fontWeight: 'bold',
                borderRadius: '6px',
                background: 'transparent',
                color: '#EDE6D6',
                border: '1px solid rgba(237, 230, 214, 0.25)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--gold)';
                e.currentTarget.style.color = 'var(--gold)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(237, 230, 214, 0.25)';
                e.currentTarget.style.color = '#EDE6D6';
              }}
            >
              Sign Up / Join Free
            </button>
          )}
        </div>
      </div>

      {/* ─── Core Feature Cards ─── */}
      <div
        id="features"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
          marginBottom: '80px'
        }}
      >
        <div
          style={cardStyle}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <div style={{ fontSize: '24px', marginBottom: '14px' }}>📥</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: 'var(--gold)', margin: '0 0 10px 0', fontWeight: 'normal' }}>
            Multimodal Ingestion
          </h3>
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#A8C3B8', margin: 0 }}>
            Upload PDFs, parse scanned images with OCR, crawl websites, paste raw text notes, or generate speech-to-text transcripts with Whisper audio processing. Every file type is handled natively.
          </p>
        </div>

        <div
          style={cardStyle}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <div style={{ fontSize: '24px', marginBottom: '14px' }}>⚙️</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: 'var(--gold)', margin: '0 0 10px 0', fontWeight: 'normal' }}>
            Tailored Synthesis Core
          </h3>
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#A8C3B8', margin: 0 }}>
            Select your reading format. Generate bulleted key lists, chronological timelines, structured FAQs, action item guides, interactive quizzes, or structured JSON — all dynamically from a single source document.
          </p>
        </div>

        <div
          style={cardStyle}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <div style={{ fontSize: '24px', marginBottom: '14px' }}>💬</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: 'var(--gold)', margin: '0 0 10px 0', fontWeight: 'normal' }}>
            Ask the Archivist
          </h3>
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#A8C3B8', margin: 0 }}>
            Chat with your documents in RAG Mode. Every answer is annotated with hoverable page-specific citation pills displaying the exact source text, guaranteeing full transparency and verifiability.
          </p>
        </div>
      </div>

      {/* ─── How It Works ─── */}
      <div style={{ marginBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
            STEP-BY-STEP WORKFLOW
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', color: 'var(--gold)', margin: '0 0 12px 0', fontWeight: 'normal' }}>
            How SummaMind Studio Works
          </h2>
          <p style={{ fontSize: '15px', color: '#A8C3B8', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            From raw document to grounded, citable knowledge in four precise stages.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {HOW_IT_WORKS.map((step) => (
            <div
              key={step.step}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: '24px',
                background: '#111F1C',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '28px',
                alignItems: 'flex-start'
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '42px',
                  color: 'var(--gold)',
                  fontWeight: 'bold',
                  lineHeight: '1',
                  opacity: 0.4,
                  textAlign: 'center'
                }}
              >
                {step.step}
              </div>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#EDE6D6', margin: '0 0 10px 0', fontWeight: 'normal' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#A8C3B8', lineHeight: '1.7', margin: 0 }}>
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Use Cases by Audience ─── */}
      <div style={{ marginBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
            WHO USES SUMMAMIND
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', color: 'var(--gold)', margin: '0 0 12px 0', fontWeight: 'normal' }}>
            Built for Knowledge Workers
          </h2>
          <p style={{ fontSize: '15px', color: '#A8C3B8', maxWidth: '580px', margin: '0 auto', lineHeight: '1.6' }}>
            SummaMind adapts to professional workflows across academia, law, business, and education.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {USE_CASES.map((uc) => (
            <div
              key={uc.audience}
              style={{
                background: '#152622',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '28px',
                transition: 'border-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{uc.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: 'var(--gold)', margin: '0 0 10px 0', fontWeight: 'normal' }}>
                {uc.audience}
              </h3>
              <p style={{ fontSize: '13px', color: '#A8C3B8', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                {uc.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {uc.examples.map(ex => (
                  <span key={ex} style={{ fontSize: '11px', fontFamily: "'IBM Plex Mono', monospace", background: '#0D1614', color: 'var(--gold)', padding: '3px 8px', borderRadius: '4px' }}>
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Supported File Formats Table ─── */}
      <div style={{ marginBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
            COMPATIBLE INPUT TYPES
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', color: 'var(--gold)', margin: '0 0 12px 0', fontWeight: 'normal' }}>
            Supported File Formats
          </h2>
          <p style={{ fontSize: '15px', color: '#A8C3B8', maxWidth: '580px', margin: '0 auto', lineHeight: '1.6' }}>
            Every input format is handled by a dedicated processing engine for maximum extraction accuracy.
          </p>
        </div>

        <div
          style={{
            background: '#111F1C',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
        >
          {/* Table Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1.2fr 1.5fr 2fr',
              background: '#0D1614',
              padding: '14px 24px',
              borderBottom: '1px solid var(--border)',
              fontSize: '11px',
              fontFamily: "'IBM Plex Mono', monospace",
              color: 'var(--gold)',
              letterSpacing: '0.1em',
              gap: '16px'
            }}
          >
            <span>FORMAT TYPE</span>
            <span>EXTENSIONS</span>
            <span>PROCESSING ENGINE</span>
            <span>NOTES</span>
          </div>

          {FILE_FORMATS.map((row, idx) => (
            <div
              key={row.format}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1.2fr 1.5fr 2fr',
                padding: '16px 24px',
                borderBottom: idx < FILE_FORMATS.length - 1 ? '1px solid rgba(237, 230, 214, 0.05)' : 'none',
                fontSize: '13px',
                gap: '16px',
                alignItems: 'center'
              }}
            >
              <span style={{ color: '#EDE6D6', fontWeight: 600 }}>{row.format}</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: 'var(--gold)', fontSize: '12px' }}>{row.extensions}</span>
              <span style={{ color: '#A8C3B8' }}>{row.engine}</span>
              <span style={{ color: '#7A8E8A', fontSize: '12px' }}>{row.notes}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Inline FAQ Section ─── */}
      <div style={{ marginBottom: '80px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
            COMMON QUESTIONS
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', color: 'var(--gold)', margin: '0 0 12px 0', fontWeight: 'normal' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '15px', color: '#A8C3B8', maxWidth: '580px', margin: '0 auto', lineHeight: '1.6' }}>
            Quick answers to the most common questions about SummaMind Studio's capabilities and policies.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '840px', margin: '0 auto' }}>
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  background: '#152622',
                  border: `1px solid ${isOpen ? 'var(--gold)' : 'var(--border)'}`,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    color: '#EDE6D6',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    fontFamily: "'IBM Plex Sans', sans-serif"
                  }}
                >
                  <span>{item.q}</span>
                  <span style={{ fontSize: '18px', color: 'var(--gold)', flexShrink: 0 }}>{isOpen ? '−' : '+'}</span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: '0 24px 20px 24px',
                      color: '#A8C3B8',
                      fontSize: '14px',
                      lineHeight: '1.7',
                      borderTop: '1px solid rgba(237, 230, 214, 0.05)',
                      paddingTop: '16px'
                    }}
                  >
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link to="/help" style={{ fontSize: '13px', color: 'var(--gold)', textDecoration: 'underline' }}>
            View full Help Center & FAQs →
          </Link>
        </div>
      </div>

      {/* ─── Why SummaMind CTA ─── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1C2F2B 0%, #152622 100%)',
          border: '1px solid var(--gold)',
          borderRadius: '16px',
          padding: '48px 40px',
          textAlign: 'center'
        }}
      >
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#EDE6D6', margin: '0 0 16px 0', fontWeight: 'normal' }}>
          Ready to Unlock Your Documents?
        </h2>
        <p style={{ fontSize: '15px', color: '#A8C3B8', maxWidth: '560px', margin: '0 auto 28px auto', lineHeight: '1.7' }}>
          Join researchers, legal professionals, students, and executives who use SummaMind Studio to extract grounded, cited knowledge from their most complex documents — in seconds, not hours.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/workspace"
            style={{
              display: 'inline-block',
              background: 'var(--gold)',
              color: '#152622',
              fontWeight: 'bold',
              padding: '14px 36px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '15px',
              boxShadow: '0 4px 14px rgba(184, 150, 110, 0.3)',
              transition: 'opacity 0.2s ease'
            }}
          >
            Enter the Reading Room →
          </Link>
          <Link
            to="/about"
            style={{
              display: 'inline-block',
              background: 'transparent',
              color: '#EDE6D6',
              fontWeight: 'normal',
              padding: '14px 36px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '15px',
              border: '1px solid rgba(237, 230, 214, 0.2)',
              transition: 'all 0.2s ease'
            }}
          >
            Learn About Our Technology
          </Link>
        </div>
      </div>
    </div>
  );
};
