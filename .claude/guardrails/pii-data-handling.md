# PII & Secret Data Handling Guardrails

> Drafted for this repo — not transcribed from an external source, same caveat as
> `prompt-injection-tools.md`. Only PII-3 is defined here because that's the only
> rule ID this repo's agents currently reference (see the Guardrails table in
> `.claude/agents/feature-builder.md`); add PII-1/PII-2 here if a real source turns
> up that defines them.
> **Applies to**: any command, tool call, or report that could surface a secret.

## Rules

### PII-3: No Secrets in Reports

Never print, log, or otherwise include credentials, tokens, API keys, session
cookies, or other secret material in command output, chat responses, commit
messages, or generated reports — even when a diagnostic command's natural output
would include one. Prefer a check that confirms presence/validity without
displaying the raw value (e.g. an existence or expiry check) over one that dumps it.

- **GIVEN** a command or tool that could return a secret value, **WHEN** an
  equivalent check exists that doesn't require displaying it, **THEN** use that
  instead.
- **GIVEN** a secret has already been displayed inadvertently, **WHEN** reporting
  what happened, **THEN** say so immediately and recommend rotating it rather than
  treating the exposure as resolved just because the conversation moved on.
