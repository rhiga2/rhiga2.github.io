---
title: 'Lessons in Agentic Engineering: Prompt Caching'
pubDate: 2026-09-04
description: 'What I learned about prompt caching on the Anthropic API — cost savings, invalidation gotchas, and architecture patterns that actually stick.'
tags: ["llm", "anthropic", "prompt-engineering", "caching"]
---

If you're calling frontier models at any real scale, prompt caching is one of the highest-leverage optimizations you can make to save cost and latency (in particular time-to-first-token). It sounds simple — the API caches repeated prompt prefixes so you don't pay full price on subsequent requests — but the details can be subtly tricky to work out in practice especially in production-quality, distributed environments. Here's what I learned the hard way.

## The economics are dramatic

Here are the concrete numbers for Claude Opus 5:

| Operation | Cost per MTok |
|---|---|
| Base input (no caching) | $5.00 |
| Cache write (5-min TTL) | $6.25 (1.25x base) |
| Cache read (hit) | $0.50 (0.1x base) |
| Output | $25.00 |

That cache read price — $0.50 vs $5.00 — is a 90% discount on input tokens. The cache write costs 25% more than a normal read on the first request, but it usually pays for itself after a single cache hit. For workloads with long, stable system prompts — think RAG pipelines with large context documents, or agentic loops with tool definitions — this changes the cost calculus entirely.

On one pipeline I worked on, the system prompt plus retrieved context totaled around 100k tokens per request. Without caching, that's $0.50 in input costs per call. With cache hits, the same 100k tokens cost $0.05 — a 10x reduction in cost. At thousands of calls per day, the savings compound fast.

The latency improvement was the surprise. Cache hits skip a chunk of the prefill computation, so time-to-first-token dropped noticeably on long prompts — which matters when you're in an agentic loop making several calls in sequence.

## Cache invalidation can occur where you least expect

Prompt caching on the Anthropic API works on an exact prefix match basis. The cache checks your prompt from the beginning, token by token, and the moment something differs, the cache stops matching. Everything after the divergence point is uncached.

This sounds straightforward--always put static content before dynamic content--until you realize how easy it is to accidentally break the prefix. Here are some reasons why prompt caching can fail unexpectedly:

### Non-deterministic serialization of tool name or structured data
If you're injecting tool definitions or structured data such as retrieved knowledge, the serialization order has to be stable. Python dicts are insertion-ordered in modern Python, but if you're building them from a database query or merging configs, the order can vary across requests. One shuffled tool_name and you start to incur the cost of full cache misses.

### Long tool calls can break 5m TTL
At our organization, we define many agents that work in the background without human input. Since these ambient agents take one request per session, a 5m TTL is often sufficient to keep the cache warm. With this setup, however, we sometimes observe cache reads suddenly reset to zero in the middle of an agent run. The culprit: long-running data-heavy tool calls that exceed the 5-minute TTL cause the prefix to expire prematurely. Based on our usage, a 1-hour TTL is overkill, so we ensure tool call latency remains well below 5 minutes by paginating large data retrievals. The agent receives an initial data chunk and subsequent chunks are fetched, offloaded to the filesystem, and processed by the agent if needed via filesystem tools.

### LLMs-as-judges require a different prompt layout than your agent
When using an LLM to evaluate or judge the output of another agent, the prompt structure often needs to prioritize the content being judged over the system instructions. This means the static system prompt may come after what we typically consider as dynamic content such as the agent trace. To put it more concretely, the main agent wants the following prefix pattern to maximize prompt cache efficiency:

```
┌─────────────────────────────┐
│  System prompt (cached)     │ ← never changes between requests
├─────────────────────────────┤
│  Tool definitions (cached)  │ ← sorted deterministically
├─────────────────────────────┤
│  Retrieved context (cached) │ ← same docs = same cache
├─────────────────────────────┤
│  Past messages (cached)     │ ← grows each turn
├─────────────────────────────┤
│  Current user message       │ ← always new
└─────────────────────────────┘
```
In an LLM-as-judge scenario, if you are running a suite of judges that each make their own LLM call then the static system prompt (or sometimes called the judging rubric) may change more rapidly than the content being judged, which is often your agent trace or agent state. In this case, we want the layout to be the following:

```
┌────────────────────────────────────┐
│  Generic judge prompt (cached)     │ ← never changes between requests
├────────────────────────────────────┤
│  Agent trace (cached)              │ ← same trace = same cache
├────────────────────────────────────┤
│  Rubric / system prompt            │ ← changes between judge requests
└────────────────────────────────────┘
```

## Architecture patterns that maximize hits

After getting burned enough times, I settled on a few patterns that keep cache hit rates high:


### Automatic vs explicit cache breakpoints

Anthropic offers two ways to enable caching. **Automatic caching** places a single `cache_control` at the top level of your request — the system manages breakpoints for you, advancing the cache boundary as the conversation grows:

```python
response = client.messages.create(
    model="claude-opus-5",
    max_tokens=1024,
    cache_control={"type": "ephemeral"},
    system="You are a helpful assistant.",
    messages=conversation_history,
)
```

This is the simplest option and works well for multi-turn conversations where the entire prefix should stay cached.

**Explicit breakpoints** give you fine-grained control by placing `cache_control` on individual content blocks. This matters when different parts of your prompt change at different frequencies — for example, tool definitions that rarely change vs. a system prompt that gets updated daily:

```python
response = client.messages.create(
    model="claude-opus-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are an AI assistant for analyzing documents.",
        },
        {
            "type": "text",
            "text": large_reference_document,
            "cache_control": {"type": "ephemeral"},
        },
    ],
    messages=[
        {"role": "user", "content": "Summarize the key points."}
    ],
)
```

In practice, I use automatic caching for straightforward chat agents and explicit breakpoints for pipelines where I need to control exactly which prefix segments are cached — like the LLM-as-judge layout described above.

### Deterministic serialization everywhere

I now run every piece of injected content through a canonical and well-tested serialization step before it enters the prompt — sorted keys, consistent whitespace, no floating-point formatting surprises. It's a small discipline that prevents an entire category of silent cache misses.

### Cache-aware batching

If you're running batch inference, group requests that share the same context prefix together and send them in rapid succession. This keeps the cache warm and maximizes reuse. Interleaving requests with different prefixes thrashes the cache.

### Monitor your cache hit rate

The Anthropic API returns `cache_creation_input_tokens` and `cache_read_input_tokens` in the usage response. Track these. If your cache read ratio drops, something changed in your prompt construction — and you want to catch that before the invoice arrives, not after.

## The meta-lesson

Prompt caching is a systems engineering problem, not an API feature you toggle on. The actual API integration is trivial — you add a `cache_control` field to your message blocks. The hard part is structuring your entire prompt pipeline so that the cacheable prefix stays stable across requests.

The payoff is real. Lower cost, lower latency, and — because it forces you to think carefully about prompt structure — often a cleaner architecture overall.
