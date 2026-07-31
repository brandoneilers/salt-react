# Anti-Hallucination Guardrails

> **Applies to**: All Claude agents, all phases of work in this repo.

## Rules

### AH-1: Scope Discipline

Do only what was asked. Don't add features, refactor adjacent code, or "improve"
things that weren't part of the request.

- **GIVEN** a user request, **WHEN** generating code, **THEN** the output addresses
  only the stated request — no extras.

### AH-2: No Invented APIs

Never use an API, method, class, config option, or library feature without
confirming it actually exists in this codebase or its dependencies' real,
current documentation — not from memory of how a similar library "usually" works.

- **GIVEN** code that references an API, **WHEN** that API hasn't been located via
  search or a read file, **THEN** stop and verify it before using it.

### AH-3: Assumption Declaration

When a request is ambiguous, ask instead of guessing. If proceeding without asking
is unavoidable, state every assumption made, explicitly, in the output.

- **GIVEN** unclear requirements, **WHEN** proceeding without clarification,
  **THEN** list the assumptions made so the human can catch a wrong one early.

### AH-4: Uncertainty Flagging

Say "I'm not sure" when that's true. A hedged, honest answer is more useful than a
confident, wrong one.

- **GIVEN** a question about code or system behavior, **WHEN** confidence is low,
  **THEN** flag the uncertainty explicitly instead of stating a guess as fact.

### AH-5: Evidence-Based Claims

Claims about what code does must be backed by a specific file and line, or by
actually running it. Don't state behavior from a name or a pattern that looks
familiar.

- **GIVEN** a claim about behavior, **WHEN** no evidence has actually been gathered,
  **THEN** say "I haven't verified this" or go verify it first.

### AH-6: Verify Before Reporting Success

Completing the steps that were *supposed* to produce a result is not the same as
confirming the result actually happened. Read the actual output of the last action
before describing it as done — don't infer success from the absence of an error, and
don't report an artifact (a URL, a file, a deployed version) that hasn't been
confirmed to exist.

- **GIVEN** an action with an externally-checkable result (a push, a deploy, a file
  write, an API call), **WHEN** reporting it as complete, **THEN** have already read
  that action's actual output/return value confirming it happened — not assumed it
  from the preceding steps going smoothly.
- **GIVEN** a claim that a UI feature "works," **WHEN** the only evidence is that
  unit/component tests pass, **THEN** treat that as "code compiles and passes
  isolated tests," not as "verified working" — those are different claims.

### AH-7: Verify Environment State Before Assuming It

Never assume a dependency is installed, a tool is connected, or a credential points
at the expected account just because it was true in a different session, a different
working directory, or a different point in time. Check the actual current state
first.

- **GIVEN** something that was true earlier in this task or in a similar past task
  (a package being installed, an integration being available, credentials resolving
  to a particular account), **WHEN** relying on it again, **THEN** re-verify it in
  the current environment rather than assuming it carried over.

### AH-8: Minimal Change Principle

Make the smallest diff that satisfies the request. Don't reformat untouched files,
reorder imports, or change whitespace on lines that weren't part of the change.

- **GIVEN** a code change, **WHEN** the diff includes edits beyond what the request
  needed, **THEN** remove the unrelated edits.

### AH-9: Output Hygiene

Don't leave `TODO`, `FIXME`, `...`, or stub implementations in generated output.

- **GIVEN** generated code, **WHEN** a placeholder exists, **THEN** either implement
  it fully or remove it and say explicitly what's missing and why.

### AH-10: High-Risk Domain Human-in-the-Loop

Stop and get explicit approval before changing authentication/authorization,
payment or financial logic, data migrations, encryption, production configuration,
or anything that pushes/publishes to a shared or public destination.

- **GIVEN** a change touching a high-risk domain, **WHEN** about to make it,
  **THEN** present the plan and wait for approval before acting, not after.

### AH-11: Breaking-Change Disclosure

Never introduce a breaking change to a public API, function signature, or data
contract without calling it out explicitly, even if the request didn't ask about
compatibility.

- **GIVEN** a change to a public interface, **WHEN** it changes behavior for
  existing callers, **THEN** state that plainly and note what has to change on
  their end.

### AH-12: Read-Only Verbs Stay Read-Only

When the user says "review," "analyze," "check," or "assess," report findings.
Don't fix anything unless asked to.

- **GIVEN** a read-only request, **WHEN** tempted to fix something noticed along the
  way, **THEN** report it instead and let the human decide whether to act on it.

## Self-Audit Checklist

After every code generation, verify:

| # | Check | Pass? |
| --- | --- | --- |
| 1 | Output addresses only what was asked (AH-1) | |
| 2 | All APIs/methods verified to exist (AH-2) | |
| 3 | Assumptions explicitly stated (AH-3) | |
| 4 | Uncertainty flagged where present (AH-4) | |
| 5 | Claims backed by file/line evidence or a real run (AH-5) | |
| 6 | Success confirmed from actual output, not inferred (AH-6) | |
| 7 | Environment state re-checked, not assumed (AH-7) | |
| 8 | Diff is minimal — no extra changes (AH-8) | |
| 9 | No placeholders or TODOs in output (AH-9) | |
| 10 | High-risk changes approved by a human first (AH-10) | |
| 11 | Breaking changes to public interfaces called out (AH-11) | |
| 12 | Read-only requests left the code unmodified (AH-12) | |
