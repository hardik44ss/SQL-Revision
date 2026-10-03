export interface QueryResult {
  columns: string[];
  values: any[][];
  executionTimeMs: number;
  rowCount: number;
  error?: string;
}

export interface TableColumn {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
  references?: string;
  nullable?: boolean;
}

export interface TableSchema {
  name: string;
  description: string;
  columns: TableColumn[];
  rowCount: number;
}

export type ChallengeDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface Challenge {
  id: string;
  title: string;
  difficulty: ChallengeDifficulty;
  category: string;
  tags: string[];
  description: string;
  tablesUsed: string[];
  initialQuery: string;
  solutionQuery: string;
  alternativeSolutions?: {
    title: string;
    query: string;
    description: string;
  }[];
  expectedResult: {
    columns: string[];
    values: any[][];
  };
  hints: string[];
  interviewPoints: {
    title: string;
    content: string;
  }[];
  edgeCasesToConsider: string[];
}

export interface CheatSheetCard {
  id: string;
  title: string;
  tag: string;
  category: 'core' | 'joins' | 'window' | 'perf' | 'data' | 'advanced';
  description: string;
  codeSnippets: {
    title: string;
    sql: string;
    note?: string;
  }[];
  visualType?: 'execution-order' | 'venn' | 'window-table' | 'acid' | 'index-tree' | 'truncate-vs-delete';
  keyTakeaways: string[];
}
