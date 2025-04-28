export interface Note {
    _id: string;
    title: string;
    content: string;
    category: 'Work' | 'Personal' | 'Ideas' | 'Other';
    sentiment?: 'Positive' | 'Neutral' | 'Negative' | '';
    summary?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface NoteFormData {
    title: string;
    content: string;
    category: 'Work' | 'Personal' | 'Ideas' | 'Other';
  }
  
  export interface SearchResult {
    query: string;
    parsedQuery: any;
    results: Note[];
  }