# @pipeworx/librivox

[LibriVox](https://librivox.org) MCP — public-domain audiobooks (~17 000 titles in dozens of languages). Keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `audiobooks(query?, author?, title?, since?, limit?, offset?)` — search audiobooks
- `audiobook(id)` — single audiobook
- `authors(query?, last_name?, limit?, offset?)` — search authors
- `tracks(project_id)` — list tracks for an audiobook

## Data source

`https://librivox.org/api/feed/`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "librivox": {
      "url": "https://gateway.pipeworx.io/librivox/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Librivox data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
