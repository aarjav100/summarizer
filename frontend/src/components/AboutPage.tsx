import React from 'react';
import { SEO } from './SEO';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '40px 24px', color: '#EDE6D6', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <SEO 
        title="About Us — SummaMind Studio"
        description="Learn about SummaMind Studio, our mission, vision, and how our multimodal AI document intelligence platform transforms complex documents into grounded knowledge."
        canonicalUrl="https://summamind.shop/about"
      />

      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <div 
          style={{ 
            fontSize: '12px', 
            fontFamily: "'IBM Plex Mono', monospace", 
            color: 'var(--gold)', 
            letterSpacing: '0.15em', 
            textTransform: 'uppercase',
            marginBottom: '12px' 
          }}
        >
          OUR STORY & TECHNOLOGY
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '46px', color: 'var(--gold)', margin: '0 0 16px 0', fontWeight: 'normal', lineHeight: '1.2' }}>
          Unlocking Wisdom from Dense Information
        </h1>
        <p style={{ fontSize: '18px', color: '#A8C3B8', maxWidth: '720px', margin: '0 auto', lineHeight: '1.6' }}>
          SummaMind Studio is a next-generation document intelligence platform designed to eliminate information overload for researchers, legal scholars, engineers, and executive teams.
        </p>
      </div>

      {/* Mission & Vision Section */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '24px', 
          marginBottom: '64px' 
        }}
      >
        <div 
          style={{ 
            background: '#152622', 
            border: '1px solid var(--border)', 
            borderRadius: '12px', 
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ fontSize: '28px', marginBottom: '16px' }}>🎯</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--gold)', margin: '0 0 12px 0', fontWeight: 'normal' }}>
            Our Mission
          </h2>
          <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#A8C3B8', margin: 0 }}>
            To empower thinkers, researchers, and decision-makers by distilling thousands of pages of unstructured data into precise, actionable, and verifiably grounded synthesis within seconds.
          </p>
        </div>

        <div 
          style={{ 
            background: '#152622', 
            border: '1px solid var(--border)', 
            borderRadius: '12px', 
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ fontSize: '28px', marginBottom: '16px' }}>👁️</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--gold)', margin: '0 0 12px 0', fontWeight: 'normal' }}>
            Our Vision
          </h2>
          <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#A8C3B8', margin: 0 }}>
            A world where no crucial insight remains buried in a PDF, technical paper, or audio transcript. We build AI systems prioritizing zero hallucinations and 100% citation transparency.
          </p>
        </div>
      </div>

      {/* How the AI Summarizer Works */}
      <div 
        style={{ 
          background: '#111F1C', 
          border: '1px solid var(--border)', 
          borderRadius: '16px', 
          padding: '40px', 
          marginBottom: '64px' 
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: 'var(--gold)', margin: '0 0 12px 0', fontWeight: 'normal' }}>
            How SummaMind AI Works
          </h2>
          <p style={{ fontSize: '15px', color: '#A8C3B8', maxWidth: '640px', margin: '0 auto' }}>
            Our architecture combines multi-modal ingestion with high-dimensional vector search and specialized LLM synthesis.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
          <div style={{ background: '#152622', padding: '24px', borderRadius: '8px', border: '1px solid rgba(237,230,214,0.05)' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: 'var(--gold)', marginBottom: '8px' }}>STEP 01</div>
            <h3 style={{ fontSize: '17px', color: '#EDE6D6', margin: '0 0 8px 0' }}>Multimodal Ingestion</h3>
            <p style={{ fontSize: '13px', color: '#A8C3B8', lineHeight: '1.6', margin: 0 }}>
              Upload PDFs, images (with OCR engine), audio files (via Whisper speech-to-text), web links, or raw text blocks.
            </p>
          </div>

          <div style={{ background: '#152622', padding: '24px', borderRadius: '8px', border: '1px solid rgba(237,230,214,0.05)' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: 'var(--gold)', marginBottom: '8px' }}>STEP 02</div>
            <h3 style={{ fontSize: '17px', color: '#EDE6D6', margin: '0 0 8px 0' }}>pgvector Indexing</h3>
            <p style={{ fontSize: '13px', color: '#A8C3B8', lineHeight: '1.6', margin: 0 }}>
              Documents are converted into 1536-dimensional vector embeddings and indexed in Supabase pgvector for rapid retrieval.
            </p>
          </div>

          <div style={{ background: '#152622', padding: '24px', borderRadius: '8px', border: '1px solid rgba(237,230,214,0.05)' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: 'var(--gold)', marginBottom: '8px' }}>STEP 03</div>
            <h3 style={{ fontSize: '17px', color: '#EDE6D6', margin: '0 0 8px 0' }}>Tailored Synthesis</h3>
            <p style={{ fontSize: '13px', color: '#A8C3B8', lineHeight: '1.6', margin: 0 }}>
              Generate custom output formats: bulleted executive summaries, timelines, FAQs, action item guides, or quiz MCQs.
            </p>
          </div>

          <div style={{ background: '#152622', padding: '24px', borderRadius: '8px', border: '1px solid rgba(237,230,214,0.05)' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: 'var(--gold)', marginBottom: '8px' }}>STEP 04</div>
            <h3 style={{ fontSize: '17px', color: '#EDE6D6', margin: '0 0 8px 0' }}>Grounded RAG Chat</h3>
            <p style={{ fontSize: '13px', color: '#A8C3B8', lineHeight: '1.6', margin: 0 }}>
              Ask questions to your document corpus with interactive page-level citation pills verifying every single claim.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose SummaMind */}
      <div style={{ marginBottom: '64px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: 'var(--gold)', textAlign: 'center', margin: '0 0 36px 0', fontWeight: 'normal' }}>
          Why Choose SummaMind?
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#152622', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px' }}>
            <div style={{ fontSize: '20px', marginBottom: '10px' }}>🛡️</div>
            <h3 style={{ fontSize: '16px', color: 'var(--gold)', margin: '0 0 8px 0' }}>Zero Model Retraining</h3>
            <p style={{ fontSize: '13px', color: '#A8C3B8', lineHeight: '1.6', margin: 0 }}>
              Your confidential papers and intellectual property are never used to train public LLM models.
            </p>
          </div>

          <div style={{ background: '#152622', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px' }}>
            <div style={{ fontSize: '20px', marginBottom: '10px' }}>📌</div>
            <h3 style={{ fontSize: '16px', color: 'var(--gold)', margin: '0 0 8px 0' }}>Page-Level Traceability</h3>
            <p style={{ fontSize: '13px', color: '#A8C3B8', lineHeight: '1.6', margin: 0 }}>
              Every bullet point and answer is tied back to exact source text snippets and page numbers.
            </p>
          </div>

          <div style={{ background: '#152622', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px' }}>
            <div style={{ fontSize: '20px', marginBottom: '10px' }}>⚡</div>
            <h3 style={{ fontSize: '16px', color: 'var(--gold)', margin: '0 0 8px 0' }}>Multi-Model Router</h3>
            <p style={{ fontSize: '13px', color: '#A8C3B8', lineHeight: '1.6', margin: 0 }}>
              Select between Smart Auto Router, GPT-4.1 Turbo, Claude Sonnet 5, or Gemini 2.5 Pro based on your needs.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #1C2F2B 0%, #152622 100%)', 
          border: '1px solid var(--gold)', 
          borderRadius: '12px', 
          padding: '40px', 
          textAlign: 'center' 
        }}
      >
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#EDE6D6', margin: '0 0 12px 0', fontWeight: 'normal' }}>
          Ready to Experience Intelligent Document Analysis?
        </h3>
        <p style={{ fontSize: '15px', color: '#A8C3B8', marginBottom: '24px' }}>
          Open the Reading Room to start analyzing your documents in seconds.
        </p>
        <Link 
          to="/workspace" 
          style={{ 
            display: 'inline-block', 
            background: 'var(--gold)', 
            color: '#152622', 
            fontWeight: 'bold', 
            padding: '12px 32px', 
            borderRadius: '6px', 
            textDecoration: 'none',
            fontSize: '14px',
            boxShadow: '0 4px 14px rgba(184, 150, 110, 0.3)'
          }}
        >
          Enter Workspace →
        </Link>
      </div>
    </div>
  );
};
