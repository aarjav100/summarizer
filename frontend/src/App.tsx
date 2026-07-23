import React, { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Header, UserProfile } from './components/Header';
import { UploadModal } from './components/UploadModal';
import { SummaryViewer } from './components/SummaryViewer';
import { ChatInterface } from './components/ChatInterface';
import { LandingPage } from './components/LandingPage';
import { LoginModal } from './components/LoginModal';
import { LLMModel, Project, FileItem, SummaryItem, ChatMessage } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8000' : 'https://summamind-backend.onrender.com');

export const App: React.FC = () => {
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
  const { user } = useUser();
  const { signOut } = useClerk();
  const [view, setView] = useState<'landing' | 'workspace'>('landing');
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

  // Automatically redirect to workspace when logged in
  useEffect(() => {
    if (currentUser && view === 'landing') {
      setView('workspace');
    }
  }, [currentUser, view]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('workspace') === 'true') {
      setView('workspace');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

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

    // Fetch files from database API on load
    fetch(`${API_BASE_URL}/api/v1/files?project_id=proj-1`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFiles(data);
          setSelectedFile(data[0]);
          loadSummaryForFile(data[0].id, 'auto-router');
        } else {
          const defaultFiles: FileItem[] = [
            { id: 'file-101', project_id: 'proj-1', filename: 'LLM_Multimodal_RAG_Architecture.pdf', file_type: 'pdf', file_size_bytes: 4200000, status: 'completed', is_favorite: true, created_at: new Date().toISOString() },
            { id: 'file-102', project_id: 'proj-1', filename: 'System_Architecture_Diagram.png', file_type: 'image', file_size_bytes: 1500000, status: 'completed', is_favorite: false, created_at: new Date().toISOString() }
          ];
          setFiles(defaultFiles);
          setSelectedFile(defaultFiles[0]);
          loadSummaryForFile(defaultFiles[0].id, 'auto-router');
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
  }, []);

  const loadSummaryForFile = (fileId: string, modelId: string, customTypes: string[] = ['short', 'medium', 'detailed', 'bullet', 'takeaways', 'action_items', 'faq', 'timeline', 'mcq', 'structured_json']) => {
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
        const isAarjav = selectedFile?.filename.toLowerCase().includes('aarjav') || selectedFile?.filename.toLowerCase().includes('jain');
        const isDiagram = selectedFile?.filename.toLowerCase().includes('diagram') || selectedFile?.filename.toLowerCase().includes('png');
        
        const botMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          content: isAarjav
            ? `Based on the resume of Aarjav Jain, the document lists his extensive experience in AI software engineering, specifically building scalable web applications, RAG pipelines, and full-stack SaaS products.`
            : isDiagram
            ? `The system architecture diagram visualizes the data flow from client upload, through Nginx proxy, to Celery workers and pgvector vector storage.`
            : `The RAG pipeline pairs pgvector retrieval with cross-encoder reranking before LLM generation.`,
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
  };

  const handleToggleFavorite = (fileId: string) => {
    setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, is_favorite: !f.is_favorite } : f)));
  };

  return (
    <div className="shell">
      {/* Header Bar */}
      <Header
        view={view}
        onSelectView={setView}
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

      {view === 'landing' ? (
        <LandingPage
          onEnterWorkspace={() => setView('workspace')}
          onOpenLogin={() => setIsLoginOpen(true)}
          isLoggedIn={currentUser !== null}
        />
      ) : (
        <>
          {/* The Desk Full Width Panel */}
          <div style={{ width: '100%', marginBottom: '24px' }}>
            <SummaryViewer
              summaries={summaries}
              selectedModel={selectedModel}
              isLoading={isLoadingSummary}
              onGenerateNewTypes={(types) => {
                if (selectedFile) loadSummaryForFile(selectedFile.id, selectedModel, types);
              }}
            />
          </div>

          {/* Collapsible Ask Drawer Console at the bottom */}
          <ChatInterface
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            selectedModel={selectedModel}
            selectedFile={selectedFile}
          />
        </>
      )}

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
                // Force state update by triggering a tiny window reload or updating user state
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
