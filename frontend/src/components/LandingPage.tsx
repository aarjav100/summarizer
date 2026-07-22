import React from 'react';

interface LandingPageProps {
  onEnterWorkspace: () => void;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterWorkspace,
  onOpenLogin,
  isLoggedIn
}) => {
  return (
    <div 
      className="landing-container" 
      style={{ 
        color: '#EDE6D6', 
        fontFamily: "'IBM Plex Sans', sans-serif",
        padding: '60px 24px',
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center'
      }}
    >
      {/* Hero Header Section */}
      <div style={{ marginBottom: '56px' }}>
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
            maxWidth: '640px', 
            margin: '0 auto 36px auto' 
          }}
        >
          Transform raw reports, dense PDFs, images, crawled URLs, and audio transcripts into clean, Tailored Summaries and query them dynamically with our grounded citation engine.
        </p>

        {/* Primary and Secondary CTA buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button 
            onClick={onEnterWorkspace}
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
              boxShadow: '0 4px 14px rgba(212, 175, 55, 0.25)',
              transition: 'opacity 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Open Reading Room
          </button>
          
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
              Sign Up / Join
            </button>
          )}
        </div>
      </div>

      {/* Feature Grid Panel */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: '24px', 
          marginTop: '64px',
          textAlign: 'left'
        }}
      >
        {/* Card 1 */}
        <div 
          style={{
            background: '#132420',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '24px',
            transition: 'border-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <div style={{ fontSize: '24px', marginBottom: '14px' }}>📥</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: 'var(--gold)', margin: '0 0 10px 0', fontWeight: 'normal' }}>
            Multimodal Ingestion
          </h3>
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#A8C3B8', margin: 0 }}>
            Upload PDFs, parse scanned images with OCR, crawl websites, paste raw text notes, or generate speech-to-text transcripts with Whisper audio processing.
          </p>
        </div>

        {/* Card 2 */}
        <div 
          style={{
            background: '#132420',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '24px',
            transition: 'border-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <div style={{ fontSize: '24px', marginBottom: '14px' }}>⚙️</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: 'var(--gold)', margin: '0 0 10px 0', fontWeight: 'normal' }}>
            Tailored Synthesis Core
          </h3>
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#A8C3B8', margin: 0 }}>
            Select your reading format. Generate bulleted key lists, chronological timelines, structured FAQs, action item guides, or interactive quizzes dynamically.
          </p>
        </div>

        {/* Card 3 */}
        <div 
          style={{
            background: '#132420',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '24px',
            transition: 'border-color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <div style={{ fontSize: '24px', marginBottom: '14px' }}>💬</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: 'var(--gold)', margin: '0 0 10px 0', fontWeight: 'normal' }}>
            Ask the Archivist
          </h3>
          <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#A8C3B8', margin: 0 }}>
            Chat with your documents in RAG Mode. Your answers are annotated with hoverable page-specific pills displaying the exact source text, guaranteeing transparency.
          </p>
        </div>
      </div>

      {/* Footer Branding */}
      <div style={{ marginTop: '72px', borderTop: '1px solid rgba(237, 230, 214, 0.05)', paddingTop: '24px', fontSize: '11px', color: '#7A8E8A', fontFamily: "'Courier New', Courier, monospace" }}>
        SUMMAMIND STUDIO © 2026 · SECURED WITH TLS 1.3 · POWERED BY PGVECTOR
      </div>
    </div>
  );
};
