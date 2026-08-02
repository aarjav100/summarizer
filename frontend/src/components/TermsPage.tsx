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
        <p style={{ fontSize: '14px', color: '#A8C3B8', lineHeight: '1.7', margin: '16px 0 0 0' }}>
          These Terms & Conditions ("Terms") constitute a legally binding agreement between you ("User") and SummaMind Studio ("Company," "we," "us," or "our") governing your access to and use of the SummaMind Studio platform, available at <a href="https://summamind.shop" style={{ color: 'var(--gold)' }}>summamind.shop</a>, including all associated features, tools, APIs, and content (collectively, the "Service"). Please read these Terms carefully before using the Service.
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
            By accessing or using SummaMind Studio (<code>https://summamind.shop</code>), you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree to all of these terms, you must not access or use the Service. These Terms apply to all visitors, registered users, and any other persons who access or use the Service. Your continued use of the Service following any modifications to these Terms constitutes your acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            2. Permitted Use & User Responsibilities
          </h2>
          <p>
            You agree to use SummaMind Studio only for lawful purposes and in accordance with these Terms. You are solely responsible for ensuring you have the necessary rights and permissions to upload any document, image, or audio file into the Service. You may not upload material containing malware, illegal data, or infringement of third-party copyrights.
          </p>
          <p style={{ marginTop: '12px' }}>
            Specifically, you agree not to:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>Upload documents containing personally identifiable information of third parties without their explicit consent.</li>
            <li>Attempt to reverse-engineer, circumvent, or exploit the SummaMind Studio AI pipeline or vector search infrastructure.</li>
            <li>Use the Service to generate content intended to deceive, defraud, or mislead others.</li>
            <li>Engage in any automated scraping, bulk ingestion, or denial-of-service activity against the platform.</li>
            <li>Share, sublicense, or resell access to the Service without written authorization from SummaMind Studio.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            3. Intellectual Property Rights
          </h2>
          <p>
            SummaMind Studio retains all rights, titles, and interests in and to its platform software, user interface design, logos, trademarks, vector search pipeline architecture, and multimodal ingestion system. All rights in uploaded documents, source materials, and generated summaries remain the exclusive property of the User who uploaded them.
          </p>
          <p style={{ marginTop: '12px' }}>
            By uploading documents to the Service, you grant SummaMind Studio a limited, non-exclusive, non-transferable license to process, chunk, embed, store, and retrieve your content solely for the purpose of providing the Service to you. This license does not extend to using your content for training any public AI model.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            4. AI Model Output & Limitation of Liability
          </h2>
          <p>
            While SummaMind utilizes grounded Retrieval-Augmented Generation (RAG) and page-level citations to maximize accuracy, AI outputs are generated programmatically and are inherently probabilistic. Users are strongly encouraged to verify all critical legal, medical, financial, or scientific claims against original source text before acting on AI-generated summaries.
          </p>
          <p style={{ marginTop: '12px' }}>
            SummaMind Studio shall not be liable for any decisions made, losses incurred, or damages suffered based on reliance upon AI-generated summaries, extracted details, or conversational responses. The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. To the fullest extent permitted by applicable law, SummaMind Studio's aggregate liability to you for any claims arising from your use of the Service shall not exceed the amounts paid by you, if any, in the twelve (12) months preceding the claim.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            5. Governing Law & Jurisdiction
          </h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law principles. Any legal action or proceeding arising under these Terms shall be brought exclusively in the federal or state courts located in San Francisco County, California, and you hereby consent to personal jurisdiction and venue in those courts.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            6. Dispute Resolution & Arbitration
          </h2>
          <p>
            In the event of any dispute, claim, or controversy arising out of or relating to these Terms, or the breach, termination, enforcement, interpretation, or validity thereof, including the determination of the scope or applicability of this agreement to arbitrate, the parties agree to first attempt to resolve the dispute informally by contacting <a href="mailto:support@summamind.shop" style={{ color: 'var(--gold)' }}>support@summamind.shop</a> and providing a written description of the dispute.
          </p>
          <p style={{ marginTop: '12px' }}>
            If the dispute is not resolved within thirty (30) days of informal notice, you and SummaMind Studio agree to resolve the dispute through binding arbitration before a single arbitrator under the rules of the American Arbitration Association (AAA). The arbitration shall take place in San Francisco, California, or via videoconference if mutually agreed. Each party shall bear its own costs of arbitration, and the arbitrator's fees shall be shared equally. Notwithstanding the foregoing, either party may seek injunctive or other equitable relief in a court of competent jurisdiction to prevent irreparable harm.
          </p>
          <p style={{ marginTop: '12px' }}>
            <strong style={{ color: '#EDE6D6' }}>Class Action Waiver:</strong> All claims must be brought in the parties' individual capacity and not as a plaintiff or class member in any purported class or representative proceeding.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            7. Modifications to the Service
          </h2>
          <p>
            SummaMind Studio reserves the right, at its sole discretion, to modify, suspend, or discontinue the Service (or any features or parts thereof) at any time with or without notice. We may also modify these Terms at any time by posting the revised Terms on our website. Your continued use of the Service after any such modifications constitutes your acceptance of the new Terms.
          </p>
          <p style={{ marginTop: '12px' }}>
            We will endeavor to provide reasonable notice of material changes to these Terms via email to your registered address or via a prominent notice on our website. We reserve the right to:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>Add, remove, or alter AI model options available in the Reading Room workspace.</li>
            <li>Adjust file size limits, rate limits, and supported ingestion formats as our infrastructure evolves.</li>
            <li>Introduce new pricing tiers, premium features, or subscription plans with appropriate advance notice.</li>
            <li>Temporarily suspend the Service for scheduled maintenance, upgrades, or emergency security patches.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            8. Accessibility & Compliance Statement
          </h2>
          <p>
            SummaMind Studio is committed to ensuring the Service is accessible to users with disabilities to the greatest extent reasonably practicable. We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. If you experience any accessibility barriers while using our Service, please notify us at <a href="mailto:support@summamind.shop" style={{ color: 'var(--gold)' }}>support@summamind.shop</a> so we may address them promptly.
          </p>
          <p style={{ marginTop: '12px' }}>
            We are committed to operating in compliance with all applicable laws and regulations, including but not limited to the Americans with Disabilities Act (ADA), the General Data Protection Regulation (GDPR) for European users, and the California Consumer Privacy Act (CCPA) for California residents. For compliance inquiries, please contact our legal team at the email address above.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--gold)', marginTop: 0, marginBottom: '12px', fontWeight: 'normal' }}>
            9. Contact Information
          </h2>
          <p>
            For questions, concerns, or legal notices regarding these Terms & Conditions, please contact:
          </p>
          <ul style={{ paddingLeft: '20px', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li><strong style={{ color: '#EDE6D6' }}>Email:</strong> <a href="mailto:support@summamind.shop" style={{ color: 'var(--gold)' }}>support@summamind.shop</a></li>
            <li><strong style={{ color: '#EDE6D6' }}>Mailing Address:</strong> SummaMind Studio Labs, 100 Tech Plaza Suite 400, San Francisco, CA 94107</li>
            <li><strong style={{ color: '#EDE6D6' }}>Response Time:</strong> Legal notices acknowledged within 5 business days.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};
