
export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  image?: string;
  isEmergency?: boolean;
}

export interface DiagnosisResult {
  hypothesis: string;
  studies: string[];
  level1: string; // Naturista
  level2: string; // Catalogo
  level3: string; // Alopatico
}
