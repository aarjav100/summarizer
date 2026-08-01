import React from 'react';
import { SEO } from './SEO';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '40px 24px', color: '#EDE6D6', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <SEO 
        title="Privacy Policy — SummaMind Studio"
        description="Read the official Privacy Policy for SummaMind Studio. Learn how we collect, store, encrypt, and handle user documents and data."
        canonicalUrl="https://summamind.shop/privacy-policy"
      />

      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
          LEGAL & DATA PROTECTION
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '40px', color: 'var(--gold)', margin: '0 0 12px 0', fontWeight: 'normal' }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: '13px', color: '#7A8E8A', fontFamily: "'IBM Plex Mono', monospace" }}>
          EFFECTIVE DATE: AUGUST 1, 2026 · LAST REVISED: AUGUST 2026
        </p>
      </div>

      <div 
        style={{ 
          background: '#152622', 
          border: '1px solid var(--border)', 
          borderRadius: '12px', 
          padding: '36px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          lineHeight: '1.7',
          fontSize: '14px',
          color: '#A8C3B8'
        }}
      >
        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            1. Information We Collect
          </h2>
          <p>
            At SummaMind Studio ("we," "us," or "our"), we respect your privacy and are committed to protecting the personal data and documents you share with us. We collect:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
            <li><strong style={{ color: '#EDE6D6' }}>Account Data:</strong> Email address, user name, and authentication tokens provided via Clerk or custom session profiles.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Document Content:</strong> Text, PDFs, images, and audio files uploaded into the Reading Room workspace for summarization and vector indexing.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Usage Telemetry:</strong> Anonymized interaction logs, browser user agents, and IP addresses to prevent service abuse and optimize system performance.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            2. How We Process & Store Document Data
          </h2>
          <p>
            When you upload a document:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
            <li>Document content is parsed into text chunks and encrypted in transit via TLS 1.3.</li>
            <li>Vector embeddings are stored in isolated Supabase pgvector database schemas tied strictly to your user account ID.</li>
            <li>We enforce strict zero model retraining agreements with AI provider APIs (OpenAI, Anthropic, Google Gemini). Your confidential text is never utilized to train third-party public foundation models.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            3. Cookies and Local Storage
          </h2>
          <p>
            We use essential local storage keys (`custom_user`, `username_*`) to retain your workspace session across browser reloads. We also utilize standard necessary cookies for Clerk authentication. You can manage or disable non-essential cookies via our <a href="/cookies" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Cookie Policy</a>.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            4. Data Retention & Deletion Rights
          </h2>
          <p>
            You retain 100% ownership of your uploaded documents and summaries. You can permanently delete any document, project, or account data directly from the Reading Room workspace or by submitting a data removal request to <a href="mailto:support@summamind.shop" style={{ color: 'var(--gold)', textDecoration: 'none' }}>support@summamind.shop</a>.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            5. Contact Information
          </h2>
          <p>
            For privacy inquiries or General Data Protection Regulation (GDPR) / California Consumer Privacy Act (CCPA) compliance requests, please email our Privacy Officer at <a href="mailto:support@summamind.shop" style={{ color: 'var(--gold)', textDecoration: 'none' }}>support@summamind.shop</a>.
          </p>
        </section>
      </div>
    </div>
  );
};
