import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const baseHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(baseHtmlPath)) {
  console.error('Error: dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const baseTemplate = fs.readFileSync(baseHtmlPath, 'utf8');

const navHeader = `
<header style="background:#0F1B18; border-bottom:1px solid #1C332D; padding:18px 24px;">
  <nav style="max-width:1180px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px;">
    <a href="/" style="display:flex; align-items:center; gap:12px; text-decoration:none; color:#EDE6D6;">
      <img src="/logo.png" alt="SummaMind Logo" width="36" height="36" style="border-radius:4px;" />
      <span style="font-family:'Playfair Display',serif; font-size:22px; font-weight:600; letter-spacing:0.02em;">SummaMind <span style="font-size:12px; font-family:'IBM Plex Mono',monospace; color:#D4AF37;">STUDIO</span></span>
    </a>
    <div style="display:flex; align-items:center; gap:20px; font-family:'IBM Plex Sans',sans-serif; font-size:14px;">
      <a href="/" style="color:#A8C3B8; text-decoration:none;">Home</a>
      <a href="/about" style="color:#A8C3B8; text-decoration:none;">About Us</a>
      <a href="/help" style="color:#A8C3B8; text-decoration:none;">Help Center</a>
      <a href="/contact" style="color:#A8C3B8; text-decoration:none;">Contact</a>
      <a href="/privacy-policy" style="color:#A8C3B8; text-decoration:none;">Privacy Policy</a>
      <a href="/terms" style="color:#A8C3B8; text-decoration:none;">Terms</a>
      <a href="/workspace" style="background:#D4AF37; color:#0F1B18; padding:8px 16px; border-radius:4px; text-decoration:none; font-weight:600; font-family:'IBM Plex Mono',monospace;">Open Workspace</a>
    </div>
  </nav>
</header>
`;

const globalFooter = `
<footer style="background:#0A1210; border-top:1px solid #182C27; padding:40px 24px; color:#879C93; font-family:'IBM Plex Sans',sans-serif; font-size:13px; margin-top:60px;">
  <div style="max-width:1180px; margin:0 auto; display:flex; justify-content:space-between; flex-wrap:wrap; gap:24px;">
    <div>
      <div style="font-family:'Playfair Display',serif; font-size:18px; color:#EDE6D6; margin-bottom:8px;">SummaMind Studio</div>
      <p style="margin:0 0 12px; max-width:320px; line-height:1.5;">Multimodal document intelligence and high-precision AI summarization with citation grounding.</p>
      <p style="margin:0; font-family:'IBM Plex Mono',monospace; font-size:12px;">Contact: <a href="mailto:support@summamind.shop" style="color:#D4AF37; text-decoration:none;">support@summamind.shop</a></p>
    </div>
    <div style="display:flex; gap:32px; flex-wrap:wrap;">
      <div>
        <div style="font-family:'IBM Plex Mono',monospace; color:#D4AF37; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:10px;">Platform</div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <a href="/" style="color:#879C93; text-decoration:none;">Home</a>
          <a href="/workspace" style="color:#879C93; text-decoration:none;">Reading Room Console</a>
          <a href="/about" style="color:#879C93; text-decoration:none;">About Us</a>
          <a href="/help" style="color:#879C93; text-decoration:none;">Help Center & Guides</a>
        </div>
      </div>
      <div>
        <div style="font-family:'IBM Plex Mono',monospace; color:#D4AF37; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:10px;">Legal & Trust</div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <a href="/privacy-policy" style="color:#879C93; text-decoration:none;">Privacy Policy</a>
          <a href="/terms" style="color:#879C93; text-decoration:none;">Terms of Service</a>
          <a href="/cookies" style="color:#879C93; text-decoration:none;">Cookie Policy</a>
          <a href="/contact" style="color:#879C93; text-decoration:none;">Contact Support</a>
        </div>
      </div>
    </div>
  </div>
  <div style="max-width:1180px; margin:24px auto 0; padding-top:20px; border-top:1px solid #132420; text-align:center; font-family:'IBM Plex Mono',monospace; font-size:11px; color:#5D736A;">
    &copy; 2026 SummaMind Studio. All rights reserved. TLS 1.3 SECURED | Supabase pgvector Retrieval Engine.
  </div>
</footer>
`;

const routes = [
  {
    path: 'about',
    title: 'About Us — SummaMind Studio Multimodal AI Intelligence',
    description: 'Learn about SummaMind Studio, our mission, multi-modal vector search architecture, and zero model retraining privacy framework.',
    canonical: 'https://summamind.shop/about',
    content: `
      ${navHeader}
      <main style="max-width:1080px; margin:0 auto; padding:40px 24px; color:#EDE6D6; font-family:'IBM Plex Sans',sans-serif;">
        <div style="text-align:center; margin-bottom:56px;">
          <div style="font-family:'IBM Plex Mono',monospace; font-size:12px; color:#D4AF37; letter-spacing:0.15em; text-transform:uppercase; margin-bottom:12px;">OUR STORY & ARCHITECTURE</div>
          <h1 style="font-family:'Playfair Display',serif; font-size:44px; color:#D4AF37; margin:0 0 16px; font-weight:normal; line-height:1.2;">Unlocking Wisdom from Dense Information</h1>
          <p style="font-size:18px; color:#A8C3B8; max-width:720px; margin:0 auto; line-height:1.6;">
            SummaMind Studio is a next-generation document intelligence platform designed to eliminate information overload for researchers, legal scholars, engineers, and executive teams.
          </p>
        </div>

        <section style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:24px; margin-bottom:64px;">
          <article style="background:#152622; border:1px solid #23433B; border-radius:12px; padding:32px;">
            <div style="font-size:28px; margin-bottom:16px;">🎯</div>
            <h2 style="font-family:'Playfair Display',serif; font-size:24px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">Our Mission</h2>
            <p style="font-size:14px; line-height:1.7; color:#A8C3B8; margin:0;">
              To empower thinkers, researchers, and decision-makers by distilling thousands of pages of unstructured data into precise, actionable, and verifiably grounded synthesis within seconds.
            </p>
          </article>

          <article style="background:#152622; border:1px solid #23433B; border-radius:12px; padding:32px;">
            <div style="font-size:28px; margin-bottom:16px;">👁️</div>
            <h2 style="font-family:'Playfair Display',serif; font-size:24px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">Our Vision</h2>
            <p style="font-size:14px; line-height:1.7; color:#A8C3B8; margin:0;">
              A world where no crucial insight remains buried in a PDF, technical paper, or audio transcript. We build AI systems prioritizing zero hallucinations and 100% citation transparency.
            </p>
          </article>
        </section>

        <section style="background:#111F1C; border:1px solid #1F3B34; border-radius:16px; padding:40px; margin-bottom:64px;">
          <div style="text-align:center; margin-bottom:40px;">
            <h2 style="font-family:'Playfair Display',serif; font-size:32px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">How SummaMind AI Works</h2>
            <p style="font-size:15px; color:#A8C3B8; max-width:640px; margin:0 auto;">
              Our platform combines multimodal parsing with high-dimensional vector search and specialized LLM synthesis.
            </p>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:20px;">
            <div style="background:#162925; padding:20px; border-radius:8px; border:1px solid #23433B;">
              <h3 style="font-size:16px; color:#FFF; margin:0 0 8px;">1. Multimodal Parsing</h3>
              <p style="font-size:13px; color:#A8C3B8; line-height:1.5; margin:0;">PDFs, images (OCR via Tesseract), and audio (STT via OpenAI Whisper) are ingested into clear text structures.</p>
            </div>
            <div style="background:#162925; padding:20px; border-radius:8px; border:1px solid #23433B;">
              <h3 style="font-size:16px; color:#FFF; margin:0 0 8px;">2. Supabase pgvector</h3>
              <p style="font-size:13px; color:#A8C3B8; line-height:1.5; margin:0;">Text chunks are embedded into 1536-dimensional vectors and stored in isolated user schemas for ultra-fast retrieval.</p>
            </div>
            <div style="background:#162925; padding:20px; border-radius:8px; border:1px solid #23433B;">
              <h3 style="font-size:16px; color:#FFF; margin:0 0 8px;">3. Smart AI Routing</h3>
              <p style="font-size:13px; color:#A8C3B8; line-height:1.5; margin:0;">Automated routing dispatches requests to OpenAI GPT-4.1, Anthropic Claude Sonnet 5, or Google Gemini 2.5 Pro.</p>
            </div>
            <div style="background:#162925; padding:20px; border-radius:8px; border:1px solid #23433B;">
              <h3 style="font-size:16px; color:#FFF; margin:0 0 8px;">4. Citation Grounding</h3>
              <p style="font-size:13px; color:#A8C3B8; line-height:1.5; margin:0;">All summary readouts and Q&A answers append page-level source references for zero-hallucination trust.</p>
            </div>
          </div>
        </section>
      </main>
      ${globalFooter}
    `
  },
  {
    path: 'contact',
    title: 'Contact Us — SummaMind Studio Support & Inquiry',
    description: 'Get in touch with SummaMind Studio. Reach our support team at support@summamind.shop or submit enterprise inquiries.',
    canonical: 'https://summamind.shop/contact',
    content: `
      ${navHeader}
      <main style="max-width:1080px; margin:0 auto; padding:40px 24px; color:#EDE6D6; font-family:'IBM Plex Sans',sans-serif;">
        <div style="text-align:center; margin-bottom:56px;">
          <div style="font-family:'IBM Plex Mono',monospace; font-size:12px; color:#D4AF37; letter-spacing:0.15em; text-transform:uppercase; margin-bottom:12px;">WE ARE HERE TO HELP</div>
          <h1 style="font-family:'Playfair Display',serif; font-size:44px; color:#D4AF37; margin:0 0 16px; font-weight:normal;">Contact SummaMind Studio</h1>
          <p style="font-size:18px; color:#A8C3B8; max-width:680px; margin:0 auto; line-height:1.6;">
            Have questions about our document intelligence platform, custom enterprise RAG pipelines, or API integrations? We respond within 24 hours.
          </p>
        </div>

        <section style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:24px; margin-bottom:56px;">
          <article style="background:#152622; border:1px solid #23433B; border-radius:12px; padding:32px; text-align:center;">
            <div style="font-size:32px; margin-bottom:12px;">✉️</div>
            <h2 style="font-size:18px; color:#FFF; margin:0 0 8px;">Direct Support Email</h2>
            <p style="font-size:14px; color:#A8C3B8; margin:0 0 12px;">For general questions, billing, and technical support:</p>
            <a href="mailto:support@summamind.shop" style="color:#D4AF37; font-family:'IBM Plex Mono',monospace; font-weight:bold; font-size:15px; text-decoration:none;">support@summamind.shop</a>
          </article>
          <article style="background:#152622; border:1px solid #23433B; border-radius:12px; padding:32px; text-align:center;">
            <div style="font-size:32px; margin-bottom:12px;">🏢</div>
            <h2 style="font-size:18px; color:#FFF; margin:0 0 8px;">Enterprise & Custom AI</h2>
            <p style="font-size:14px; color:#A8C3B8; margin:0 0 12px;">Custom model deployment and high-volume document ingestion:</p>
            <a href="mailto:support@summamind.shop?subject=Enterprise%20Inquiry" style="color:#D4AF37; font-family:'IBM Plex Mono',monospace; font-weight:bold; font-size:15px; text-decoration:none;">enterprise@summamind.shop</a>
          </article>
          <article style="background:#152622; border:1px solid #23433B; border-radius:12px; padding:32px; text-align:center;">
            <div style="font-size:32px; margin-bottom:12px;">⏱️</div>
            <h2 style="font-size:18px; color:#FFF; margin:0 0 8px;">Response Commitment</h2>
            <p style="font-size:14px; color:#A8C3B8; margin:0;">Our technical team monitors support channels 7 days a week with average response times under 4 hours.</p>
          </article>
        </section>

        <section style="background:#111F1C; border:1px solid #1F3B34; border-radius:16px; padding:40px;">
          <h2 style="font-family:'Playfair Display',serif; font-size:28px; color:#D4AF37; margin:0 0 20px; font-weight:normal; text-align:center;">Send Us a Message</h2>
          <form style="max-width:640px; margin:0 auto; display:flex; flex-direction:column; gap:16px;">
            <div>
              <label style="display:block; font-size:13px; font-family:'IBM Plex Mono',monospace; color:#A8C3B8; margin-bottom:6px;">Your Name</label>
              <input type="text" placeholder="John Doe" style="width:100%; padding:12px; background:#162925; border:1px solid #23433B; border-radius:6px; color:#EDE6D6; font-size:14px; box-sizing:border-box;" required />
            </div>
            <div>
              <label style="display:block; font-size:13px; font-family:'IBM Plex Mono',monospace; color:#A8C3B8; margin-bottom:6px;">Email Address</label>
              <input type="email" placeholder="john@example.com" style="width:100%; padding:12px; background:#162925; border:1px solid #23433B; border-radius:6px; color:#EDE6D6; font-size:14px; box-sizing:border-box;" required />
            </div>
            <div>
              <label style="display:block; font-size:13px; font-family:'IBM Plex Mono',monospace; color:#A8C3B8; margin-bottom:6px;">Message Subject</label>
              <input type="text" placeholder="General Inquiry / Feedback" style="width:100%; padding:12px; background:#162925; border:1px solid #23433B; border-radius:6px; color:#EDE6D6; font-size:14px; box-sizing:border-box;" required />
            </div>
            <div>
              <label style="display:block; font-size:13px; font-family:'IBM Plex Mono',monospace; color:#A8C3B8; margin-bottom:6px;">How Can We Help?</label>
              <textarea rows="5" placeholder="Tell us how we can assist your workflow..." style="width:100%; padding:12px; background:#162925; border:1px solid #23433B; border-radius:6px; color:#EDE6D6; font-size:14px; box-sizing:border-box;" required></textarea>
            </div>
            <button type="button" style="background:#D4AF37; color:#0F1B18; border:none; padding:14px; border-radius:6px; font-family:'IBM Plex Mono',monospace; font-weight:bold; font-size:14px; cursor:pointer;">Submit Support Request</button>
          </form>
        </section>
      </main>
      ${globalFooter}
    `
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy — SummaMind Studio',
    description: 'Read the SummaMind Studio Privacy Policy. Learn about our strict data privacy policies, zero LLM model retraining guarantee, and TLS 1.3 security.',
    canonical: 'https://summamind.shop/privacy-policy',
    content: `
      ${navHeader}
      <main style="max-width:960px; margin:0 auto; padding:40px 24px; color:#EDE6D6; font-family:'IBM Plex Sans',sans-serif; line-height:1.7;">
        <div style="text-align:center; margin-bottom:48px;">
          <div style="font-family:'IBM Plex Mono',monospace; font-size:12px; color:#D4AF37; letter-spacing:0.15em; text-transform:uppercase; margin-bottom:12px;">LAST UPDATED: AUGUST 2026</div>
          <h1 style="font-family:'Playfair Display',serif; font-size:42px; color:#D4AF37; margin:0 0 16px; font-weight:normal;">Privacy Policy</h1>
          <p style="font-size:16px; color:#A8C3B8; max-width:680px; margin:0 auto;">
            At SummaMind Studio, we prioritize your data privacy, document confidentiality, and transparency above all else.
          </p>
        </div>

        <article style="background:#132420; border:1px solid #1F3B34; border-radius:12px; padding:36px; display:flex; flex-direction:column; gap:28px;">
          <section>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">1. Information We Collect</h2>
            <p style="margin:0 0 8px; color:#A8C3B8;">We collect data necessary to provide high-precision document intelligence services:</p>
            <ul style="margin:0; padding-left:20px; color:#A8C3B8;">
              <li><strong>Account Credentials:</strong> Email address, archivist username, and Clerk authentication identifiers.</li>
              <li><strong>Uploaded Document Content:</strong> Text, scanned PDF pages, image data, audio recordings, and web page URLs provided for summarization.</li>
              <li><strong>Usage Analytics:</strong> Anonymized interaction logs and model performance metrics used solely for service stability.</li>
            </ul>
          </section>

          <section>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">2. How We Use Your Information</h2>
            <p style="margin:0; color:#A8C3B8;">
              Your documents are processed strictly to perform document chunking, vector embedding generation, LLM synthesis, and RAG retrieval answers requested by you. We do not sell, rent, or commercialize your uploaded files or extracted data under any circumstances.
            </p>
          </section>

          <section style="background:#182E29; border:1px solid #23433B; border-radius:8px; padding:20px;">
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">3. Zero LLM Model Retraining Guarantee</h2>
            <p style="margin:0; color:#EDE6D6;">
              <strong>Strict Guarantee:</strong> Your uploaded documents, text chunks, vector embeddings, and generated summaries are NEVER used to train, retrain, or fine-tune public or foundation AI models (including OpenAI, Anthropic, or Google Gemini models). API integration agreements enforce zero data retention policies for fine-tuning.
            </p>
          </section>

          <section>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">4. Data Storage & Security Standards</h2>
            <p style="margin:0; color:#A8C3B8;">
              All data transmissions are encrypted using TLS 1.3 protocols. Vector embeddings and page metadata reside in isolated Supabase pgvector schemas secured by Row Level Security (RLS) linked strictly to your authenticated account ID.
            </p>
          </section>

          <section>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">5. Third-Party Service Providers</h2>
            <p style="margin:0 0 8px; color:#A8C3B8;">We partner with enterprise-grade infrastructure providers adhering to ISO 27001 and SOC 2 Type II compliance:</p>
            <ul style="margin:0; padding-left:20px; color:#A8C3B8;">
              <li><strong>Clerk:</strong> User authentication and session management.</li>
              <li><strong>Supabase pgvector:</strong> Encrypted vector storage and relational metadata.</li>
              <li><strong>OpenAI, Anthropic, Google Cloud:</strong> API endpoints for LLM text synthesis and Whisper speech-to-text.</li>
            </ul>
          </section>

          <section>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">6. Data Retention & User Rights (GDPR & CCPA)</h2>
            <p style="margin:0; color:#A8C3B8;">
              You maintain full ownership of your data. You may delete any uploaded document or clear your workspace project at any time. Upon deletion, vector embeddings and document chunks are permanently erased from our databases immediately.
            </p>
          </section>

          <section>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">7. Contact Information</h2>
            <p style="margin:0; color:#A8C3B8;">
              For privacy requests, data export, or GDPR inquiries, please contact our privacy officer at <a href="mailto:support@summamind.shop" style="color:#D4AF37; font-family:'IBM Plex Mono',monospace;">support@summamind.shop</a>.
            </p>
          </section>
        </article>
      </main>
      ${globalFooter}
    `
  },
  {
    path: 'terms',
    title: 'Terms of Service — SummaMind Studio',
    description: 'Review the Terms of Service for SummaMind Studio. Understand terms regarding platform usage, user responsibilities, and intellectual property.',
    canonical: 'https://summamind.shop/terms',
    content: `
      ${navHeader}
      <main style="max-width:960px; margin:0 auto; padding:40px 24px; color:#EDE6D6; font-family:'IBM Plex Sans',sans-serif; line-height:1.7;">
        <div style="text-align:center; margin-bottom:48px;">
          <div style="font-family:'IBM Plex Mono',monospace; font-size:12px; color:#D4AF37; letter-spacing:0.15em; text-transform:uppercase; margin-bottom:12px;">EFFECTIVE DATE: AUGUST 2026</div>
          <h1 style="font-family:'Playfair Display',serif; font-size:42px; color:#D4AF37; margin:0 0 16px; font-weight:normal;">Terms of Service</h1>
          <p style="font-size:16px; color:#A8C3B8; max-width:680px; margin:0 auto;">
            Please read these terms carefully before accessing or using the SummaMind Studio document intelligence platform.
          </p>
        </div>

        <article style="background:#132420; border:1px solid #1F3B34; border-radius:12px; padding:36px; display:flex; flex-direction:column; gap:28px;">
          <section>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">1. Acceptance of Terms</h2>
            <p style="margin:0; color:#A8C3B8;">
              By accessing or using SummaMind Studio (located at summamind.shop), you agree to be bound by these Terms of Service. If you do not agree to all terms, you may not access or use our platform.
            </p>
          </section>

          <section>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">2. Service Description</h2>
            <p style="margin:0; color:#A8C3B8;">
              SummaMind Studio provides AI-assisted document ingestion, optical character recognition (OCR), audio transcription, vector search indexing, summarization format generation, and grounded retrieval chat.
            </p>
          </section>

          <section>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">3. User Intellectual Property & Rights</h2>
            <p style="margin:0; color:#A8C3B8;">
              You retain all ownership, copyright, and intellectual property rights in the documents, files, images, and text you upload to SummaMind Studio. SummaMind Studio acquires no ownership interest in your content.
            </p>
          </section>

          <section>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">4. Acceptable Use Policy</h2>
            <p style="margin:0 0 8px; color:#A8C3B8;">You agree not to use SummaMind Studio to:</p>
            <ul style="margin:0; padding-left:20px; color:#A8C3B8;">
              <li>Upload illegal, abusive, defamatory, or harmful materials.</li>
              <li>Attempt to reverse-engineer, bypass security protocols, or probe system vulnerabilities.</li>
              <li>Perform automated scraping or DDoS attacks against our servers.</li>
            </ul>
          </section>

          <section>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">5. Limitation of Liability</h2>
            <p style="margin:0; color:#A8C3B8;">
              SummaMind Studio and its underlying AI models provide summaries for research, synthesis, and productivity purposes. Users should independently verify critical legal, medical, or technical information against original source citations.
            </p>
          </section>

          <section>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">6. Governing Law & Contact</h2>
            <p style="margin:0; color:#A8C3B8;">
              These terms are governed by international software regulations. For questions regarding terms of service, reach out to <a href="mailto:support@summamind.shop" style="color:#D4AF37; font-family:'IBM Plex Mono',monospace;">support@summamind.shop</a>.
            </p>
          </section>
        </article>
      </main>
      ${globalFooter}
    `
  },
  {
    path: 'help',
    title: 'Help Center & Documentation — SummaMind Studio',
    description: 'Complete documentation, feature walkthroughs, format guides, and troubleshooting steps for SummaMind Studio.',
    canonical: 'https://summamind.shop/help',
    content: `
      ${navHeader}
      <main style="max-width:1080px; margin:0 auto; padding:40px 24px; color:#EDE6D6; font-family:'IBM Plex Sans',sans-serif;">
        <div style="text-align:center; margin-bottom:56px;">
          <div style="font-family:'IBM Plex Mono',monospace; font-size:12px; color:#D4AF37; letter-spacing:0.15em; text-transform:uppercase; margin-bottom:12px;">KNOWLEDGE BASE & GUIDES</div>
          <h1 style="font-family:'Playfair Display',serif; font-size:44px; color:#D4AF37; margin:0 0 16px; font-weight:normal;">Help Center & Documentation</h1>
          <p style="font-size:18px; color:#A8C3B8; max-width:700px; margin:0 auto; line-height:1.6;">
            Everything you need to master SummaMind Studio — from file ingestion guides to citation verification in RAG Chat.
          </p>
        </div>

        <section style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:24px; margin-bottom:64px;">
          <article style="background:#152622; border:1px solid #23433B; border-radius:12px; padding:32px;">
            <div style="font-size:28px; margin-bottom:12px;">🚀</div>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 10px; font-weight:normal;">Getting Started</h2>
            <p style="font-size:14px; color:#A8C3B8; line-height:1.6; margin:0 0 14px;">Learn how to upload your first document, organize projects in the workspace, and select appropriate AI synthesis models.</p>
            <a href="/workspace" style="color:#D4AF37; font-family:'IBM Plex Mono',monospace; font-size:13px; text-decoration:none; font-weight:bold;">Launch Workspace &rarr;</a>
          </article>

          <article style="background:#152622; border:1px solid #23433B; border-radius:12px; padding:32px;">
            <div style="font-size:28px; margin-bottom:12px;">📑</div>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 10px; font-weight:normal;">11 Summary Formats</h2>
            <p style="font-size:14px; color:#A8C3B8; line-height:1.6; margin:0 0 14px;">Understand how to generate Short/Medium/Detailed summaries, action items, FAQ pairs, timeline chapters, and JSON schema data.</p>
            <a href="/about" style="color:#D4AF37; font-family:'IBM Plex Mono',monospace; font-size:13px; text-decoration:none; font-weight:bold;">View Format Specifications &rarr;</a>
          </article>

          <article style="background:#152622; border:1px solid #23433B; border-radius:12px; padding:32px;">
            <div style="font-size:28px; margin-bottom:12px;">💬</div>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 10px; font-weight:normal;">RAG Chat & Citations</h2>
            <p style="font-size:14px; color:#A8C3B8; line-height:1.6; margin:0 0 14px;">How to ask complex questions over uploaded documents and verify claims using page-level citation pills.</p>
            <a href="/contact" style="color:#D4AF37; font-family:'IBM Plex Mono',monospace; font-size:13px; text-decoration:none; font-weight:bold;">Contact Support &rarr;</a>
          </article>
        </section>

        <section style="background:#111F1C; border:1px solid #1F3B34; border-radius:16px; padding:40px;">
          <h2 style="font-family:'Playfair Display',serif; font-size:28px; color:#D4AF37; margin:0 0 20px; font-weight:normal; text-align:center;">Troubleshooting & Ingestion FAQ</h2>
          <div style="display:flex; flex-direction:column; gap:16px;">
            <div style="background:#162925; border:1px solid #23433B; border-radius:8px; padding:20px;">
              <h3 style="font-size:16px; color:#FFF; margin:0 0 8px;">Why is my scanned PDF taking a few seconds longer?</h3>
              <p style="font-size:14px; color:#A8C3B8; margin:0; line-height:1.6;">Scanned PDFs containing images instead of raw text trigger our built-in Tesseract OCR engine, which extracts textual glyphs page by page before embedding.</p>
            </div>
            <div style="background:#162925; border:1px solid #23433B; border-radius:8px; padding:20px;">
              <h3 style="font-size:16px; color:#FFF; margin:0 0 8px;">What audio file formats are supported?</h3>
              <p style="font-size:14px; color:#A8C3B8; margin:0; line-height:1.6;">SummaMind supports MP3, WAV, and M4A audio files up to 25MB. OpenAI Whisper processes the audio file into speech-to-text transcriptions with page-aligned timestamps.</p>
            </div>
          </div>
        </section>
      </main>
      ${globalFooter}
    `
  },
  {
    path: 'cookies',
    title: 'Cookie Policy — SummaMind Studio',
    description: 'Learn how SummaMind Studio uses essential cookies to maintain user authentication and security.',
    canonical: 'https://summamind.shop/cookies',
    content: `
      ${navHeader}
      <main style="max-width:960px; margin:0 auto; padding:40px 24px; color:#EDE6D6; font-family:'IBM Plex Sans',sans-serif; line-height:1.7;">
        <div style="text-align:center; margin-bottom:48px;">
          <div style="font-family:'IBM Plex Mono',monospace; font-size:12px; color:#D4AF37; letter-spacing:0.15em; text-transform:uppercase; margin-bottom:12px;">UPDATED: AUGUST 2026</div>
          <h1 style="font-family:'Playfair Display',serif; font-size:42px; color:#D4AF37; margin:0 0 16px; font-weight:normal;">Cookie Policy</h1>
          <p style="font-size:16px; color:#A8C3B8; max-width:680px; margin:0 auto;">
            This Cookie Policy explains how SummaMind Studio uses cookies and similar technologies to ensure secure authentication and session operation.
          </p>
        </div>

        <article style="background:#132420; border:1px solid #1F3B34; border-radius:12px; padding:36px; display:flex; flex-direction:column; gap:28px;">
          <section>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">1. What Are Cookies?</h2>
            <p style="margin:0; color:#A8C3B8;">
              Cookies are small text files stored on your browser or device when you visit a website. They allow the application to recognize your session and maintain security state.
            </p>
          </section>

          <section>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">2. Essential Cookies</h2>
            <p style="margin:0; color:#A8C3B8;">
              We use essential cookies strictly required for the operation of SummaMind Studio. These include Clerk authentication cookies ('__session', '__clerk_db_jwt') used to securely authenticate your session and protect workspace data.
            </p>
          </section>

          <section>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">3. Preference & Local Storage</h2>
            <p style="margin:0; color:#A8C3B8;">
              We use browser LocalStorage to persist UI preferences such as your selected archivist username and active project selection across browser restarts.
            </p>
          </section>

          <section>
            <h2 style="font-family:'Playfair Display',serif; font-size:22px; color:#D4AF37; margin:0 0 12px; font-weight:normal;">4. Managing Cookies</h2>
            <p style="margin:0; color:#A8C3B8;">
              You can control or disable cookies through your web browser settings. Note that disabling essential cookies may impact authentication and prevent access to the Reading Room.
            </p>
          </section>
        </article>
      </main>
      ${globalFooter}
    `
  }
];

console.log('Generating pre-rendered static HTML routes...');

routes.forEach((route) => {
  const routeDir = path.join(distDir, route.path);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  let html = baseTemplate;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/s, `<title>${route.title}</title>`);

  // Replace Description
  html = html.replace(/<meta name="description" content=".*?" \/>/s, `<meta name="description" content="${route.description}" />`);

  // Replace Canonical
  if (html.includes('<link rel="canonical"')) {
    html = html.replace(/<link rel="canonical" href=".*?" \/>/s, `<link rel="canonical" href="${route.canonical}" />`);
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${route.canonical}" />\n</head>`);
  }

  // Replace OpenGraph title/description/url
  html = html.replace(/<meta property="og:title" content=".*?" \/>/s, `<meta property="og:title" content="${route.title}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/s, `<meta property="og:description" content="${route.description}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/s, `<meta property="og:url" content="${route.canonical}" />`);

  // Replace Twitter title/description/url
  html = html.replace(/<meta name="twitter:title" content=".*?" \/>/s, `<meta name="twitter:title" content="${route.title}" />`);
  html = html.replace(/<meta name="twitter:description" content=".*?" \/>/s, `<meta name="twitter:description" content="${route.description}" />`);
  html = html.replace(/<meta name="twitter:url" content=".*?" \/>/s, `<meta name="twitter:url" content="${route.canonical}" />`);

  // Inject pre-rendered content inside <div id="root">
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/s, `<div id="root">${route.content}</div>`);

  const outputPath = path.join(routeDir, 'index.html');
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`  ✓ Created ${path.relative(distDir, outputPath)}`);
});

console.log('Static route pre-rendering complete!');
