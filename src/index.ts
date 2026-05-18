interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * LibriVox MCP.
 *
 * Auth: none. Docs: https://librivox.org/api/info
 */


const BASE = 'https://librivox.org/api/feed';
const UA = 'pipeworx-mcp-librivox/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'audiobooks',
    description: 'Search audiobooks.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Title keyword filter.' },
        author: { type: 'string' },
        title: { type: 'string' },
        since: { type: 'string', description: 'YYYY-MM-DD' },
        limit: { type: 'number' },
        offset: { type: 'number' },
      },
    },
  },
  {
    name: 'audiobook',
    description: 'Single audiobook by id.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'number' } },
      required: ['id'],
    },
  },
  {
    name: 'authors',
    description: 'Search authors.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        last_name: { type: 'string' },
        limit: { type: 'number' },
        offset: { type: 'number' },
      },
    },
  },
  {
    name: 'tracks',
    description: 'List tracks for an audiobook.',
    inputSchema: {
      type: 'object',
      properties: { project_id: { type: 'number' } },
      required: ['project_id'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'audiobooks': {
      const params = new URLSearchParams({ format: 'json' });
      if (args.title) params.set('title', String(args.title));
      if (args.author) params.set('author', String(args.author));
      if (args.since) params.set('since', String(args.since));
      if (args.limit) params.set('limit', String(args.limit));
      if (args.offset) params.set('offset', String(args.offset));
      if (args.query) params.set('title', String(args.query));
      return lvGet(`/audiobooks/?${params}`);
    }
    case 'audiobook':
      return lvGet(`/audiobooks/?id=${(args.id as number) | 0}&format=json`);
    case 'authors': {
      const params = new URLSearchParams({ format: 'json' });
      if (args.query) params.set('last_name', String(args.query));
      if (args.last_name) params.set('last_name', String(args.last_name));
      if (args.limit) params.set('limit', String(args.limit));
      if (args.offset) params.set('offset', String(args.offset));
      return lvGet(`/authors/?${params}`);
    }
    case 'tracks':
      return lvGet(`/audiotracks/?project_id=${(args.project_id as number) | 0}&format=json`);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function lvGet(path: string): Promise<unknown> {
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
  if (!res.ok) throw new Error(`LibriVox: ${res.status}`);
  return res.json();
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
