/**
 * Plain-language ("explain for stakeholders") versions of glossary terms,
 * keyed by term id. Optional — the Glossary renders the technical definition
 * with or without an entry here, and only shows the plain version when the
 * reader turns on "Plain language" mode.
 */
export const glossaryPlainLanguage: Record<string, string> = {
  'model-api':
    'A pay-as-you-go cloud service that turns prompts into AI answers — like power from the grid, you just call it and pay per use.',
  sdk: 'An official code toolkit that makes it easier for developers to connect your app to an AI service.',
  framework:
    'Pre-built scaffolding that saves developers from wiring common AI plumbing (retrieval, tools, memory) by hand.',
  orchestration:
    'The conductor that decides the order of steps an AI system runs — which model, tool, or data source, and when.',
  agent:
    'An AI that picks its own next steps and uses tools to reach a goal, instead of following a fixed script. Powerful, but less predictable.',
  'workflow-engine':
    'A system that runs a fixed, repeatable sequence of steps reliably — the opposite of letting an AI improvise.',
  rag: 'A way to ground AI answers in your own documents so it uses your facts instead of guessing from training data.',
  'embedding-model':
    'A model that turns text into numbers capturing meaning, so a computer can find "similar" content — the engine behind semantic search.',
  'vector-db':
    'A specialised database that stores those meaning-numbers and finds the closest matches fast — the memory behind document search.',
  harness:
    'A testing rig that scores AI quality on a fixed set of examples, so you can tell whether a change made things better or worse.',
  benchmark:
    'A standard public test for comparing models — useful for a shortlist, but not a substitute for testing on your own task.',
  'eval-platform':
    'Tooling to run, track, and compare AI quality tests over time, often with dashboards and team workflows.',
  observability:
    'The "flight recorder" for a live AI system — what was asked, what it answered, how long it took, and what it cost.',
  gateway:
    'A single controlled doorway all AI calls pass through, giving you spend limits, logging, and the ability to swap providers.',
  router: 'A traffic director that sends each request to the best or cheapest model for that job.',
  'fine-tuning':
    'Extra training on your own examples so a model adopts a specific style or skill — best when the behaviour is stable, not when facts change often.',
  peft: 'A cheaper, lighter form of fine-tuning that adjusts a small part of the model instead of retraining the whole thing.',
  'prompt-management':
    'Version control for the instructions you give the AI, so you can change and roll them back like code.',
  'tool-calling':
    'Letting the AI trigger real actions or fetch live data (look up an order, send an email) instead of only talking.',
  mcp: 'An emerging open standard for plugging tools and data sources into AI assistants in a consistent way.',
  guardrails: 'Safety checks around the AI that block unsafe, off-topic, or non-compliant inputs and outputs.',
  'model-hub': 'An app-store-like catalog of downloadable open models you can run yourself.',
  'inference-server':
    'The engine that actually runs a model and serves its answers efficiently, usually on your own GPUs.',
  'agent-host':
    'The runtime that keeps long-running AI agents alive, managing their state, tools, and sessions.',
  llmops:
    'The operational practices and tooling for running AI features in production reliably — monitoring, cost, versioning, and quality.',
  'context-window':
    'How much text a model can consider at once — its short-term memory limit for a single request.',
  'structured-output':
    'Forcing the AI to answer in a strict format (like a filled-in form) so other software can use the result directly.',
  reranker:
    'A second-pass model that reorders search results to put the most relevant ones on top, improving answer quality.',
  chunking: 'Splitting big documents into bite-sized pieces so the AI can retrieve just the relevant part.',
  'semantic-cache':
    'A smart cache that reuses a past answer when a new question means the same thing — cutting cost and latency.',
  'red-teaming':
    'Deliberately attacking your own AI to find ways it can be tricked or misbehave, before real users or attackers do.',
}
