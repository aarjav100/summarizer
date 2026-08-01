import React from 'react';
import { SEO } from './SEO';

export const TermsPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '40px 24px', color: '#EDE6D6', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <SEO 
        title="Terms & Conditions — SummaMind Studio"
        description="Review the Terms & Conditions governing the use of SummaMind Studio multimodal document intelligence services."
        canonicalUrl="https://summamind.shop/terms"
      />

      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
          SERVICE AGREEMENT
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '40px', color: 'var(--gold)', margin: '0 0 12px 0', fontWeight: 'normal' }}>
          Terms & Conditions
        </h1>
        <p style={{ fontSize: '13px', color: '#7A8E8A', fontFamily: "'IBM Plex Mono', monospace" }}>
          LAST UPDATED: AUGUST 1, 2026
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
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using SummaMind Studio (`https://summamind.shop`), you agree to be bound by these Terms & Conditions. If you do not agree, please refrain from accessing the platform.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            2. Permitted Use & User Responsibilities
          </h2>
          <p>
            You agree to use SummaMind Studio only for lawful purposes. You are solely responsible for ensuring you have the necessary rights and permissions to upload any document, image, or audio file into the service. You may not upload material containing malware, illegal data, or infringement of third-party copyrights.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            3. Intellectual Property Rights
          </h2>
          <p>
            SummaMind Studio retains all rights, titles, and interests in and to its platform software, user interface design, logos, and vector search pipeline. All rights in uploaded documents and generated summaries remain the exclusive property of the user.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            4. AI Model Output & Limitation of Liability
          </h2>
          <p>
            While SummaMind utilizes grounded Retrieval-Augmented Generation (RAG) and page-level citations to maximize accuracy, AI outputs are generated programmatically. Users are encouraged to verify critical legal, medical, or financial claims against original source text. SummaMind Studio shall not be liable for decisions made based on AI-generated summaries.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            5. Governing Law & Jurisdiction
          </h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law principles.
          </p>
        </section>
      </div>
    </div>
  );
};
