import React, { useState } from 'react';
import { SEO } from './SEO';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  // Getting Started
  {
    id: 'gs-1',
    category: 'Getting Started',
    question: 'What is SummaMind Studio?',
    answer: 'SummaMind Studio is a multimodal AI document intelligence sanctuary. It processes dense PDFs, scanned images, audio files, web links, and raw text into concise executive summaries, key takeaways, timelines, quizzes, and RAG-grounded conversational answers.'
  },
  {
    id: 'gs-2',
    category: 'Getting Started',
    question: 'Do I need to create an account to test SummaMind?',
    answer: 'You can explore public features immediately. Creating a free account (via Clerk or quick pass registration) grants you personal project isolation, document history, and custom AI model router selection.'
  },

  // Uploading Documents
  {
    id: 'ud-1',
    category: 'Uploading Documents',
    question: 'What file formats are supported?',
    answer: 'SummaMind supports PDF documents, scanned images (PNG, JPG, WebP with built-in OCR), audio transcripts (MP3, WAV, M4A powered by Whisper), raw TXT / Markdown, and direct website URL crawling.'
  },
  {
    id: 'ud-2',
    category: 'Uploading Documents',
    question: 'What is the maximum file size allowed?',
    answer: 'Standard uploaded files can be up to 50 MB per file. For higher limits or enterprise bulk ingestion, contact our support team.'
  },

  // AI Summarization
  {
    id: 'ais-1',
    category: 'AI Summarization',
    question: 'How do page-level citations work in RAG mode?',
    answer: 'When you ask questions in RAG chat mode, every answer is synthesized alongside exact source chunks. Hoverable pills specify the exact document name, page number, and original text snippet, guaranteeing transparency.'
  },
  {
    id: 'ais-2',
    category: 'AI Summarization',
    question: 'Can I choose which LLM model processes my documents?',
    answer: 'Yes! In the Reading Room workspace, you can switch between Smart AI Router, OpenAI GPT-4.1 Turbo, Anthropic Claude Sonnet 5, and Google Gemini 2.5 Pro.'
  },

  // Account & Billing
  {
    id: 'ab-1',
    category: 'Account & Billing',
    question: 'Is SummaMind free to use?',
    answer: 'Yes, SummaMind provides a generous free tier for researchers, students, and professionals to ingest and query documents.'
  },
  {
    id: 'ab-2',
    category: 'Account & Billing',
    question: 'How can I upgrade or request custom team features?',
    answer: 'Contact our sales and support desk at support@summamind.shop to discuss enterprise team workspace sharing and dedicated vector indexing.'
  },

  // Privacy & Security
  {
    id: 'ps-1',
    category: 'Privacy & Security',
    question: 'Are my uploaded documents private and secure?',
    answer: 'Yes. All file transfers are encrypted with TLS 1.3. Your documents land in isolated pgvector database schemas and are never sold or shared.'
  },
  {
    id: 'ps-2',
    category: 'Privacy & Security',
    question: 'Are my files used to retrain public AI models?',
    answer: 'No. We strictly enforce zero model retraining policies with our LLM API providers. Your data remains strictly yours.'
  }
];

const CATEGORIES = [
  'All',
  'Getting Started',
  'Uploading Documents',
  'AI Summarization',
  'Account & Billing',
  'Privacy & Security'
];

export const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>('gs-1');

  const filteredFaqs = FAQ_DATA.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesQuery = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '40px 24px', color: '#EDE6D6', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <SEO 
        title="Help Center & FAQs — SummaMind Studio"
        description="Find answers to frequently asked questions about SummaMind Studio, document uploading, AI summarization, citation grounding, and privacy."
        canonicalUrl="https://www.summamind.shop/help"
      />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
          SUPPORT & KNOWLEDGE BASE
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '42px', color: 'var(--gold)', margin: '0 0 16px 0', fontWeight: 'normal' }}>
          Help Center & FAQs
        </h1>
        <p style={{ fontSize: '16px', color: '#A8C3B8', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          How can we help you today? Search our knowledge base or browse questions by category below.
        </p>

        {/* Search Bar */}
        <div style={{ maxWidth: '560px', margin: '28px auto 0 auto', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="🔍 Search questions (e.g. citations, upload limit, models...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: '#152622',
              border: '1px solid var(--gold)',
              borderRadius: '30px',
              padding: '14px 24px',
              color: '#EDE6D6',
              fontSize: '15px',
              outline: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              background: selectedCategory === cat ? 'var(--gold)' : '#152622',
              color: selectedCategory === cat ? '#152622' : '#A8C3B8',
              border: '1px solid ' + (selectedCategory === cat ? 'var(--gold)' : 'var(--border)'),
              borderRadius: '20px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: selectedCategory === cat ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredFaqs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', background: '#152622', borderRadius: '12px', color: '#7A8E8A' }}>
            No matching questions found for "{searchQuery}". Try a different keyword or contact support.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div 
                key={faq.id}
                style={{
                  background: '#152622',
                  border: '1px solid ' + (isOpen ? 'var(--gold)' : 'var(--border)'),
                  borderRadius: '10px',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    color: '#EDE6D6',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11px', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--gold)', background: '#0D1614', padding: '2px 8px', borderRadius: '4px' }}>
                      {faq.category}
                    </span>
                    {faq.question}
                  </span>
                  <span style={{ fontSize: '18px', color: 'var(--gold)' }}>
                    {isOpen ? '−' : '+'}
                  </span>
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
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
