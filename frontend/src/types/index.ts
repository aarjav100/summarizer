export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  max_tokens: number;
  input_cost_per_1k: number;
  output_cost_per_1k: number;
  supports_vision: boolean;
}

export interface FileItem {
  id: string;
  project_id: string;
  filename: string;
  file_type: 'pdf' | 'image' | 'video' | 'audio' | 'url' | 'text';
  file_size_bytes: number;
  storage_url?: string;
  source_url?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  is_favorite: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface SummaryItem {
  summary_type: string;
  title: string;
  content: string;
}

export interface LLMUsageMetrics {
  model_name: string;
  provider: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  response_time_ms: number;
  estimated_cost_usd: number;
}

export interface SummaryResponse {
  file_id: string;
  summaries: SummaryItem[];
  metrics: LLMUsageMetrics;
}

export interface Citation {
  chunk_id: string;
  page_number?: number;
  timestamp_seconds?: number;
  source_text: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  model_name?: string;
  created_at: string;
}
