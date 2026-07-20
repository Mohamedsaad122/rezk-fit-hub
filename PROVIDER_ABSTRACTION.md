# AI Provider Abstraction

This document outlines how the platform avoids vendor lock-in.

## Design
* **AIService Wrapper**: Intercepts LLM calls and dynamically instantiates adapters based on config.
* **Supported Backends**: OpenAI, Azure OpenAI, Claude, Gemini, DeepSeek, Ollama, and Mock.
* **Method Interfaces**: Exposes `generateText`, `generateJSON`, and `streamText`.
