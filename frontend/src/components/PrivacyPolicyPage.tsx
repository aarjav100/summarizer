import React from 'react';
import { SEO } from './SEO';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '40px 24px', color: '#EDE6D6', fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <SEO
        title="Privacy Policy — SummaMind Studio"
        description="Read the official Privacy Policy for SummaMind Studio. Learn how we collect, store, encrypt, and handle user documents and data."
        canonicalUrl="https://www.summamind.shop/privacy-policy"
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
        <p style={{ fontSize: '14px', color: '#A8C3B8', lineHeight: '1.7', margin: '16px 0 0 0' }}>
          This Privacy Policy describes how SummaMind Studio ("we," "us," or "our") collects, uses, stores, and protects information about you when you use our document intelligence platform at <a href="https://summamind.shop" style={{ color: 'var(--gold)' }}>summamind.shop</a> (the "Service"). We are committed to protecting your privacy and complying with applicable data protection laws including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
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
            At SummaMind Studio, we respect your privacy and are committed to protecting the personal data and documents you share with us. We collect:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><strong style={{ color: '#EDE6D6' }}>Account Data:</strong> Email address, user name, and authentication tokens provided via Clerk or custom session profiles. This includes first name, last name, and any optional profile information you choose to provide.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Document Content:</strong> Text, PDFs, images, and audio files uploaded into the Reading Room workspace for summarization and vector indexing. This content is processed exclusively to provide the Service to you.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Usage Telemetry:</strong> Anonymized interaction logs, browser user agents, operating system type, page navigation paths, feature usage patterns, and IP addresses to prevent service abuse and optimize system performance.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Technical Data:</strong> Browser type and version, time zone setting, plug-in types, screen resolution, and other technology data on the devices you use to access our Service.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Communication Data:</strong> Information you provide when you contact our support team, including the content of your messages and any attachments.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            2. How We Process & Store Document Data
          </h2>
          <p>
            When you upload a document:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Document content is parsed into semantically coherent text chunks and encrypted in transit via TLS 1.3.</li>
            <li>Vector embeddings are generated and stored in isolated Supabase pgvector database schemas tied strictly to your user account ID. No cross-account data sharing occurs.</li>
            <li>We enforce strict zero model retraining agreements with AI provider APIs (OpenAI, Anthropic, Google Gemini). Your confidential text is never utilized to train third-party public foundation models.</li>
            <li>Raw document files are temporarily held in secure server memory for processing and are not persistently stored in a raw format beyond what is necessary to generate embeddings and summaries.</li>
            <li>All data at rest is encrypted using AES-256 encryption standards.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            3. Cookies and Local Storage
          </h2>
          <p>
            We use essential local storage keys (<code>custom_user</code>, <code>username_*</code>, <code>cookie_preferences</code>) to retain your workspace session across browser reloads. We also utilize standard necessary cookies for Clerk authentication. Specifically:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><strong style={{ color: '#EDE6D6' }}>Essential Cookies:</strong> Required for authentication sessions, security tokens, and workspace state persistence. These cannot be disabled without impairing Service functionality.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Analytics Cookies:</strong> Used to measure application load speeds, API latency, and document processing efficiency. These can be disabled in our Cookie Preferences panel.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Functional Cookies:</strong> Remember your preferred AI model router selection and custom display preferences. These can be disabled in our Cookie Preferences panel.</li>
          </ul>
          <p style={{ marginTop: '12px' }}>
            You can manage or disable non-essential cookies via our <a href="/cookies" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Cookie Policy & Preferences</a> page at any time.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            4. Data Retention & Deletion Rights
          </h2>
          <p>
            You retain 100% ownership of your uploaded documents and generated summaries. Regarding data retention:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Account data is retained for the duration of your account's active status plus 90 days following account closure.</li>
            <li>Document embeddings and associated metadata are retained until you explicitly delete them from the Reading Room workspace or close your account.</li>
            <li>Anonymized usage telemetry may be retained for up to 24 months for system performance analysis.</li>
          </ul>
          <p style={{ marginTop: '12px' }}>
            You can permanently delete any document, project, or account data directly from the Reading Room workspace or by submitting a data removal request to <a href="mailto:support@summamind.shop" style={{ color: 'var(--gold)', textDecoration: 'none' }}>support@summamind.shop</a>. We will process verified deletion requests within 30 days.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            5. How We Use Your Information
          </h2>
          <p>
            We use the information we collect for the following lawful purposes:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><strong style={{ color: '#EDE6D6' }}>Service Delivery:</strong> To provide, operate, and maintain the SummaMind Studio document intelligence platform, including all summarization, RAG chat, and vector search features.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Account Management:</strong> To create and manage your user account, authenticate your sessions, and enforce account security.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Service Improvement:</strong> To analyze anonymized usage patterns, identify system performance bottlenecks, and improve the accuracy and speed of our AI summarization models.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Customer Support:</strong> To respond to your support requests, technical inquiries, and feedback submissions.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Legal Compliance:</strong> To comply with applicable legal obligations, enforce our Terms & Conditions, and protect the rights, property, and safety of SummaMind Studio and its users.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            6. Third-Party Service Providers
          </h2>
          <p>
            To operate the Service, we share limited data with trusted third-party service providers who act as data processors under contractual data protection agreements:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><strong style={{ color: '#EDE6D6' }}>Clerk (Authentication):</strong> Manages secure user authentication, session tokens, and OAuth integrations. Clerk processes your email address and authentication credentials. See <a href="https://clerk.com/privacy" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>Clerk's Privacy Policy</a>.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Supabase (Database):</strong> Hosts our pgvector database for document embedding storage. Data is stored in isolated schemas with row-level security enforced per user account. See <a href="https://supabase.com/privacy" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>Supabase's Privacy Policy</a>.</li>
            <li><strong style={{ color: '#EDE6D6' }}>OpenAI / Anthropic / Google (AI APIs):</strong> Process document text chunks to generate vector embeddings and AI-synthesized summaries. All three providers are contractually bound under zero data retention / zero retraining API agreements.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Vercel (Hosting):</strong> Hosts and serves the SummaMind Studio frontend application. Vercel may collect standard web server logs including IP addresses and page request metadata.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Render (Backend Hosting):</strong> Hosts the SummaMind Studio FastAPI backend application. Render may collect infrastructure-level logs for security monitoring.</li>
          </ul>
          <p style={{ marginTop: '12px' }}>
            We do not sell your personal data to any third party for advertising or marketing purposes under any circumstances.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            7. International Data Transfers
          </h2>
          <p>
            SummaMind Studio is headquartered in the United States. If you are accessing our Service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States or other countries where our service providers operate.
          </p>
          <p style={{ marginTop: '12px' }}>
            For users in the European Economic Area (EEA) or United Kingdom, we ensure that any transfer of personal data to countries outside the EEA/UK is conducted with appropriate safeguards, including:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>Standard Contractual Clauses (SCCs) approved by the European Commission for transfers to third-country processors.</li>
            <li>Adequacy decisions where applicable (e.g., transfers to countries recognized by the EU Commission as providing adequate data protection).</li>
            <li>Data Processing Agreements (DPAs) with all third-party service providers who may handle EEA personal data.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            8. Children's Privacy (COPPA)
          </h2>
          <p>
            SummaMind Studio is not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If you are under 13 years of age, you must not use or register for the Service.
          </p>
          <p style={{ marginTop: '12px' }}>
            If we learn that we have inadvertently collected personal information from a child under age 13 without verifiable parental consent, we will delete that information as quickly as possible. If you believe we might have any information from or about a child under 13, please contact us immediately at <a href="mailto:support@summamind.shop" style={{ color: 'var(--gold)' }}>support@summamind.shop</a>.
          </p>
          <p style={{ marginTop: '12px' }}>
            Users between the ages of 13 and 18 may use the Service only with the supervision and consent of a parent or legal guardian who agrees to be bound by these Terms on their behalf.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            9. Your Rights Under GDPR & CCPA
          </h2>
          <p>
            Depending on your jurisdiction, you may have the following rights with respect to your personal data:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><strong style={{ color: '#EDE6D6' }}>Right of Access (GDPR Art. 15 / CCPA):</strong> You have the right to request a copy of the personal data we hold about you, including the categories of data collected and the purposes for which it is processed.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Right to Rectification (GDPR Art. 16):</strong> You have the right to request correction of any inaccurate or incomplete personal data we hold about you.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Right to Erasure (GDPR Art. 17 / CCPA "Right to Delete"):</strong> You have the right to request deletion of your personal data subject to certain legal exceptions.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Right to Restrict Processing (GDPR Art. 18):</strong> You have the right to request that we restrict the processing of your personal data under certain circumstances.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Right to Data Portability (GDPR Art. 20):</strong> You have the right to receive your personal data in a structured, commonly used, machine-readable format and to transmit it to another controller.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Right to Object (GDPR Art. 21):</strong> You have the right to object to our processing of your personal data where we rely on legitimate interests as the legal basis.</li>
            <li><strong style={{ color: '#EDE6D6' }}>Right to Non-Discrimination (CCPA):</strong> California residents have the right not to receive discriminatory treatment for exercising their CCPA rights.</li>
          </ul>
          <p style={{ marginTop: '12px' }}>
            To exercise any of these rights, please submit a verified request to <a href="mailto:support@summamind.shop" style={{ color: 'var(--gold)' }}>support@summamind.shop</a>. We will respond within 30 days for GDPR requests and 45 days for CCPA requests. You also have the right to lodge a complaint with your local supervisory authority if you believe we have processed your data unlawfully.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            10. Contact Information
          </h2>
          <p>
            For privacy inquiries, data subject access requests, or GDPR/CCPA compliance matters, please contact our Privacy Officer:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li><strong style={{ color: '#EDE6D6' }}>Email:</strong> <a href="mailto:support@summamind.shop" style={{ color: 'var(--gold)', textDecoration: 'none' }}>support@summamind.shop</a></li>
            <li><strong style={{ color: '#EDE6D6' }}>Mailing Address:</strong> SummaMind Studio Labs, 100 Tech Plaza Suite 400, San Francisco, CA 94107, United States</li>
            <li><strong style={{ color: '#EDE6D6' }}>Response SLA:</strong> Privacy inquiries acknowledged within 72 hours; substantive responses within 30 days.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
