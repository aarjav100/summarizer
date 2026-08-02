import React, { useState, useEffect } from 'react';
import { SEO } from './components/SEO';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Header, UserProfile } from './components/Header';
import { UploadModal } from './components/UploadModal';
import { SummaryViewer } from './components/SummaryViewer';
import { ChatInterface } from './components/ChatInterface';
import { LandingPage } from './components/LandingPage';
import { LoginModal } from './components/LoginModal';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { HelpCenterPage } from './components/HelpCenterPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsPage } from './components/TermsPage';
import { CookiePolicyPage } from './components/CookiePolicyPage';
import { Footer } from './components/Footer';
import { LLMModel, Project, FileItem, SummaryItem, ChatMessage } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8000' : 'https://summamind-backend.onrender.com');

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const [models, setModels] = useState<LLMModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('auto-router');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('proj-1');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  
  const [summaries, setSummaries] = useState<SummaryItem[]>([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Navigation & Authentication states
  const { user, isLoaded: isClerkLoaded } = useUser();
  const { signOut } = useClerk();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [customUser, setCustomUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('custom_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [tempUsername, setTempUsername] = useState('');

  const currentUserEmail = user?.primaryEmailAddress?.emailAddress || customUser?.email;
  const storedUsername = currentUserEmail ? localStorage.getItem(`username_${currentUserEmail}`) : null;

  const currentUser: UserProfile | null = user ? {
    email: user.primaryEmailAddress?.emailAddress || '',
    name: storedUsername || user.fullName || user.username || 'Active Reader',
    initials: (storedUsername || user.firstName || user.fullName || 'SM').slice(0, 2).toUpperCase(),
    imageUrl: user.imageUrl
  } : customUser;

  // Clean up URL query parameters after Clerk has successfully loaded/authenticated
  useEffect(() => {
    if (isClerkLoaded) {
      const params = new URLSearchParams(window.location.search);
      const hasClerkParams = Array.from(params.keys()).some(key => key.startsWith('__clerk'));
      if (params.get('workspace') === 'true') {
        navigate('/workspace');
      } else if (hasClerkParams) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [isClerkLoaded, navigate]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/models`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setModels(data);
      })
      .catch(() => {
        setModels([
          { id: 'auto-router', name: 'Smart AI Router', provider: 'System Auto', description: 'Auto-detect best model', max_tokens: 1000000, input_cost_per_1k: 0.0, output_cost_per_1k: 0.0, supports_vision: true },
          { id: 'gpt-4.1', name: 'GPT-4.1 Turbo', provider: 'OpenAI', description: 'High precision structural extraction', max_tokens: 128000, input_cost_per_1k: 0.0025, output_cost_per_1k: 0.0075, supports_vision: true },
          { id: 'claude-sonnet-5', name: 'Claude Sonnet 5', provider: 'Anthropic Claude', description: 'Detailed synthesis', max_tokens: 200000, input_cost_per_1k: 0.003, output_cost_per_1k: 0.015, supports_vision: true },
          { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google Gemini', description: 'Multimodal processing', max_tokens: 1000000, input_cost_per_1k: 0.00035, output_cost_per_1k: 0.0105, supports_vision: true }
        ]);
      });

    setProjects([
      { id: 'proj-1', name: 'AI Engineering Research', created_at: new Date().toISOString() },
      { id: 'proj-2', name: 'Client Deliverables', created_at: new Date().toISOString() },
      { id: 'proj-3', name: 'Personal', created_at: new Date().toISOString() }
    ]);

    fetchFilesFromAPI();
  }, []);

  const fetchFilesFromAPI = () => {
    fetch(`${API_BASE_URL}/api/v1/files?project_id=proj-1`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFiles(data);
          setSelectedFile((prev) => {
            if (!prev) {
              loadSummaryForFile(data[0].id, 'auto-router');
              return data[0];
            }
            const stillExists = data.find((f: FileItem) => f.id === prev.id);
            return stillExists || data[0];
          });
        } else {
          setFiles([]);
        }
      })
      .catch(() => {
        const defaultFiles: FileItem[] = [
          { id: 'file-101', project_id: 'proj-1', filename: 'LLM_Multimodal_RAG_Architecture.pdf', file_type: 'pdf', file_size_bytes: 4200000, status: 'completed', is_favorite: true, created_at: new Date().toISOString() },
          { id: 'file-102', project_id: 'proj-1', filename: 'System_Architecture_Diagram.png', file_type: 'image', file_size_bytes: 1500000, status: 'completed', is_favorite: false, created_at: new Date().toISOString() }
        ];
        setFiles(defaultFiles);
        setSelectedFile(defaultFiles[0]);
        loadSummaryForFile(defaultFiles[0].id, 'auto-router');
      });
  };

  const loadSummaryForFile = (fileId: string, modelId: string, customTypes: string[] = ['short', 'medium', 'detailed', 'bullet', 'takeaways', 'extracted_details', 'action_items', 'faq', 'timeline', 'mcq', 'structured_json']) => {
    setIsLoadingSummary(true);
    fetch(`${API_BASE_URL}/api/v1/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_id: fileId, summary_types: customTypes, model_id: modelId })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.summaries) {
          setSummaries(data.summaries);
        }
      })
      .catch(() => {
        setSummaries([
          {
            summary_type: 'short',
            title: 'Short Summary',
            content: 'The uploaded architecture doc outlines a multimodal RAG pipeline combining vector search over Supabase pgvector with LLM synthesis, and the diagram confirms a three-stage retrieval → rerank → generation flow.'
          },
          {
            summary_type: 'medium',
            title: 'Medium Summary',
            content: 'The architecture doc lays out a multimodal ingestion layer (PDF + image) feeding a Supabase pgvector store. Retrieval results are reranked before being passed to the generation model, with citations preserved back to source page numbers.'
          },
          {
            summary_type: 'detailed',
            title: 'Detailed Summary',
            content: 'Section 1 covers ingestion: PDFs are chunked by heading, images are embedded via a vision encoder. Section 2 covers storage: all chunks land in a single pgvector table keyed by document id. Section 3 covers the query path: retrieve → cross-encoder rerank → prompt assembly → generation, with every claim traceable to a source chunk.'
          },
          {
            summary_type: 'bullet',
            title: 'Bullet Points',
            content: '- Multimodal ingestion for PDF and image sources\n- Supabase pgvector as the single retrieval store\n- Rerank step precedes generation for grounding accuracy'
          },
          {
            summary_type: 'takeaways',
            title: 'Key Takeaways',
            content: '1. **Zero Hallucinations**: Grounded via vector search\n2. **Multi-Stage RAG**: Ingest → Index → Retrieve → Rerank → Synthesize'
          },
          {
            summary_type: 'extracted_details',
            title: 'Extracted Details',
            content: '**Extracted details from document:**\n\n- **Title**: Technical Document Intelligence Specification\n- **Key Findings**: Ingests image and PDF text, converting them to 1536-dimensional embeddings for Supabase pgvector cosine matching.'
          },
          {
            summary_type: 'action_items',
            title: 'Action Items',
            content: '1. Configure Supabase pgvector table embeddings.\n2. Validate cross-encoder reranking latency.'
          },
          {
            summary_type: 'faq',
            title: 'Generated FAQ',
            content: '**Q: What stores the embeddings?**\nSupabase pgvector.\n\n**Q: What happens before generation?**\nA cross-encoder rerank pass.'
          },
          {
            summary_type: 'timeline',
            title: 'Timeline & Chapters',
            content: '- **Chapter 1**: Ingestion & Vision Encoders\n- **Chapter 2**: pgvector Storage Schema\n- **Chapter 3**: Query Path & Reranking'
          },
          {
            summary_type: 'mcq',
            title: 'MCQs & Quiz',
            content: '**1. What store handles embeddings?**\n- A) Supabase pgvector [CORRECT]\n- B) Redis'
          },
          {
            summary_type: 'structured_json',
            title: 'Structured JSON',
            content: '```json\n{\n  "pipeline": "multimodal-rag",\n  "store": "pgvector",\n  "stages": ["retrieve", "rerank", "generate"]\n}\n```'
          }
        ]);
      })
      .finally(() => setIsLoadingSummary(false));
  };

  const handleSendMessage = (text: string, useFullContext: boolean = false, useFileContext: boolean = true) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text,
      created_at: new Date().toISOString()
    };
    setChatMessages((prev) => [...prev, userMsg]);

    fetch(`${API_BASE_URL}/api/v1/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: 'chat-101', 
        message: text, 
        model_id: selectedModel,
        file_id: useFileContext ? selectedFile?.id : null,
        use_full_context: useFullContext
      })
    })
      .then((res) => res.json())
      .then((data) => setChatMessages((prev) => [...prev, data]))
      .catch(() => {
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          content: `The RAG pipeline pairs pgvector retrieval with cross-encoder reranking before LLM generation.`,
          citations: [
            { chunk_id: 'chk-1', page_number: 1, source_text: `Semantic page data parsed from ${selectedFile?.filename || 'the active document'}.` }
          ],
          model_name: selectedModel,
          created_at: new Date().toISOString()
        };
        setChatMessages((prev) => [...prev, botMsg]);
      });
  };

  const handleUploadSuccess = (newFile: FileItem) => {
    setFiles((prev) => [newFile, ...prev]);
    setSelectedFile(newFile);
    loadSummaryForFile(newFile.id, selectedModel);
    setTimeout(() => fetchFilesFromAPI(), 1000);
  };

  const WorkspaceView = (
    <>
      <SEO
        title="Reading Room Workspace — SummaMind Studio"
        description="Analyze your documents with SummaMind Studio's AI Reading Room. Upload PDFs, images, audio, or URLs and receive grounded summaries, timelines, FAQs, and cited RAG answers."
        canonicalUrl="https://www.summamind.shop/workspace"
      />

      <div style={{ width: '100%', marginBottom: '24px' }}>
        <SummaryViewer
          summaries={summaries}
          selectedModel={selectedModel}
          isLoading={isLoadingSummary}
          activeFileName={selectedFile?.filename}
          onGenerateNewTypes={(types) => {
            if (selectedFile) loadSummaryForFile(selectedFile.id, selectedModel, types);
          }}
        />
      </div>

      <ChatInterface
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        selectedModel={selectedModel}
        selectedFile={selectedFile}
      />

      {/* Reading Room Guide — informational publisher content */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '48px auto 0 auto',
          padding: '0 16px',
          color: '#EDE6D6',
          fontFamily: "'IBM Plex Sans', sans-serif"
        }}
      >
        <div
          style={{
            background: '#111F1C',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '40px',
            marginBottom: '32px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{ fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>
              READING ROOM GUIDE
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '30px', color: 'var(--gold)', margin: '0 0 10px 0', fontWeight: 'normal' }}>
              How to Use the Reading Room
            </h2>
            <p style={{ fontSize: '14px', color: '#A8C3B8', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
              The Reading Room is your workspace for transforming raw documents into structured, citable knowledge using SummaMind Studio's multimodal AI pipeline.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              {
                icon: '📤',
                step: '01',
                title: 'Upload a Document',
                body: 'Click the Upload button in the header to add a PDF, image (PNG/JPG), audio file (MP3/WAV), or paste a website URL. SummaMind automatically routes each format to its dedicated ingestion engine — PyMuPDF for PDFs, Tesseract OCR for scanned images, and OpenAI Whisper for audio transcripts.'
              },
              {
                icon: '🤖',
                step: '02',
                title: 'Choose Your AI Model',
                body: 'Use the model selector in the header to choose between Smart AI Router (automatic), OpenAI GPT-4.1 Turbo (structured extraction), Claude Sonnet 5 (nuanced synthesis), or Google Gemini 2.5 Pro (multimodal tasks). The Smart Router auto-selects the optimal model for your document type.'
              },
              {
                icon: '📋',
                step: '03',
                title: 'Select Summary Formats',
                body: 'Choose from eleven output formats: Short Summary, Medium Summary, Detailed Analysis, Bullet Points, Key Takeaways, Extracted Details, Action Items, Generated FAQ, Timeline & Chapters, MCQ Quiz, and Structured JSON. Generate all eleven simultaneously or pick specific formats for your workflow.'
              },
              {
                icon: '💬',
                step: '04',
                title: 'Chat With Citations',
                body: 'Ask any natural language question in the RAG Chat panel below. Every answer is assembled from retrieved vector chunks and annotated with hoverable citation pills — showing the exact document name, page number, and original source text so you can independently verify every claim.'
              }
            ].map((item) => (
              <div
                key={item.step}
                style={{
                  background: '#152622',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '24px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{item.icon}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--gold)' }}>STEP {item.step}</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', color: '#EDE6D6', margin: '0 0 10px 0', fontWeight: 'normal' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#A8C3B8', lineHeight: '1.6', margin: 0 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips & Best Practices */}
        <div
          style={{
            background: '#152622',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '36px',
            marginBottom: '32px'
          }}
        >
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--gold)', margin: '0 0 20px 0', fontWeight: 'normal' }}>
            Tips for Best Results
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              { tip: 'Use high-resolution scans', detail: 'For scanned image documents, use at least 300 DPI resolution for optimal OCR accuracy. Lower resolution images may produce garbled text extraction.' },
              { tip: 'Select the right model for your task', detail: 'Use GPT-4.1 for legal/financial documents requiring precise clause extraction. Use Claude Sonnet 5 for narrative-heavy content like academic papers or reports. Use Gemini Pro for image-heavy PDFs.' },
              { tip: 'Generate all summary types', detail: 'Click "Generate All Formats" to produce all eleven summary types simultaneously. This gives you a complete knowledge picture and lets you copy the format most useful for your current workflow.' },
              { tip: 'Cite before you act', detail: 'Always verify critical conclusions using the citation pills in the RAG Chat interface. Hover over each pill to see the exact original text from the source document before making important decisions.' },
              { tip: 'Organize with Projects', detail: 'Use the project selector to group related documents together. This allows you to search across multiple files in a single RAG chat session for comprehensive cross-document analysis.' },
              { tip: 'Audio transcription quality', detail: 'For audio files, ensure minimal background noise and clear speech for the best Whisper transcription accuracy. Upload the full audio file — SummaMind handles transcription before summarization automatically.' }
            ].map((item, idx) => (
              <div key={idx} style={{ padding: '16px', background: '#0D1614', borderRadius: '8px', border: '1px solid rgba(237,230,214,0.06)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gold)', marginBottom: '6px' }}>✦ {item.tip}</div>
                <div style={{ fontSize: '12px', color: '#A8C3B8', lineHeight: '1.6' }}>{item.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Supported Document Types Reference */}
        <div
          style={{
            background: '#111F1C',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '36px'
          }}
        >
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--gold)', margin: '0 0 8px 0', fontWeight: 'normal' }}>
            Supported Document Types
          </h2>
          <p style={{ fontSize: '14px', color: '#A8C3B8', margin: '0 0 24px 0', lineHeight: '1.5' }}>
            SummaMind Studio's ingestion layer supports the following file formats and source types:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[
              { label: 'PDF Documents', ext: '.pdf', note: 'Including scanned PDFs via OCR' },
              { label: 'PNG Images', ext: '.png', note: 'Full OCR text extraction' },
              { label: 'JPEG Images', ext: '.jpg / .jpeg', note: 'Full OCR text extraction' },
              { label: 'WebP Images', ext: '.webp', note: 'Full OCR text extraction' },
              { label: 'MP3 Audio', ext: '.mp3', note: 'Whisper speech-to-text' },
              { label: 'WAV Audio', ext: '.wav', note: 'Whisper speech-to-text' },
              { label: 'M4A Audio', ext: '.m4a', note: 'Whisper speech-to-text' },
              { label: 'Plain Text', ext: '.txt', note: 'Direct ingestion' },
              { label: 'Markdown', ext: '.md', note: 'Direct ingestion' },
              { label: 'Website URLs', ext: 'https://...', note: 'Automated web crawler' }
            ].map((fmt) => (
              <div
                key={fmt.ext}
                style={{
                  background: '#152622',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  minWidth: '160px'
                }}
              >
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: 'var(--gold)', marginBottom: '4px' }}>{fmt.ext}</div>
                <div style={{ fontSize: '13px', color: '#EDE6D6', fontWeight: 600 }}>{fmt.label}</div>
                <div style={{ fontSize: '11px', color: '#7A8E8A', marginTop: '2px' }}>{fmt.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header Bar */}
      <Header
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={() => { 
          signOut(); 
          setCustomUser(null); 
          localStorage.removeItem('custom_user');
        }}
        models={models}
        selectedModel={selectedModel}
        onSelectModel={(modelId) => {
          setSelectedModel(modelId);
          if (selectedFile) loadSummaryForFile(selectedFile.id, modelId);
        }}
        files={files}
        selectedFile={selectedFile}
        onSelectFile={(f) => {
          setSelectedFile(f);
          loadSummaryForFile(f.id, selectedModel);
        }}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      <div style={{ flex: 1 }}>
        <Routes>
          <Route 
            path="/" 
            element={
              <LandingPage
                onEnterWorkspace={() => navigate('/workspace')}
                onOpenLogin={() => setIsLoginOpen(true)}
                isLoggedIn={currentUser !== null}
              />
            } 
          />
          <Route path="/workspace" element={WorkspaceView} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/cookies" element={<CookiePolicyPage />} />
        </Routes>
      </div>

      {/* Global Footer */}
      <Footer />

      {/* Multimodal Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        projectId={selectedProject}
      />

      {/* Authentication Login/Register Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(userProfile) => {
          setCustomUser(userProfile);
          localStorage.setItem('custom_user', JSON.stringify(userProfile));
        }}
      />

      {/* First-time Username Prompt Overlay */}
      {currentUser && !storedUsername && (
        <div 
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(8px)'
          }}
        >
          <div 
            style={{
              background: '#152622',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '40px',
              width: '100%',
              maxWidth: '380px',
              textAlign: 'center',
              boxShadow: '0 12px 48px rgba(0,0,0,0.6)',
              color: '#EDE6D6',
              fontFamily: "'IBM Plex Sans', sans-serif"
            }}
          >
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: 'var(--gold)', marginBottom: '10px', fontWeight: 'normal' }}>
              Archivist Registration
            </h2>
            <p style={{ fontSize: '13px', color: '#A8C3B8', lineHeight: '1.6', marginBottom: '24px' }}>
              Welcome to the sanctuary. Please register your custom archivist username in the Reading Room ledger.
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (tempUsername.trim()) {
                localStorage.setItem(`username_${currentUser.email}`, tempUsername.trim());
                window.location.reload();
              }
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input 
                type="text" 
                placeholder="Choose Username..."
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                style={{
                  width: '100%',
                  background: '#1C2F2B',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  padding: '12px',
                  color: '#EDE6D6',
                  fontSize: '14px',
                  outline: 'none',
                  textAlign: 'center',
                  boxSizing: 'border-box'
                }}
                required
              />

              <button 
                type="submit"
                className="btn-primary"
                style={{
                  background: 'var(--gold)',
                  color: '#152622',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease'
                }}
              >
                Register & Enter Room
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};
