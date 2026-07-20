# Prompt Engine

This document covers prompt template variables resolution and sanitization.

## Mechanics
* **Placeholder Compilation**: Replacing `{variable}` keys in prompt templates with sanitized runtime parameters (e.g. client age, gender, medical info).
* **System Prompt Isolation**: Context-based system instructions depending on helper modules.
* **Prompt Library**: Pre-built sets stored and customized directly.
