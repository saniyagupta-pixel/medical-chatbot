# Architecture Index

## Implementation Guide

This index is not the full contract. Do not implement from this file alone; follow the artifact paths below.

### Global artifacts

- `unit_graph.yaml`
  - Who reads: all implementation workers.
  - Use for: external entrypoints, source anchors, dependencies, exported signatures, and per-unit shared references.
  - How to consume: find the assigned unit and follow its source anchors and dependencies; anchors document evidence and are not rewrite scope.
- `shared_modules.yaml`
  - Who reads: workers whose unit has `shared_refs`.
  - Use for: shared router/controller/model/component inventory and migration handling.
  - How to consume: filter `modules` by `used_by_units`; restrict per-unit concern to the fields named in that unit's `shared_refs`.
- `wire_contracts.yaml`
  - Who reads: workers changing API consumers or providers.
  - Use for: HTTP request/response, errors, and outward integration contracts.
  - How to consume: filter by `unit`; preserve listed route shape and response behavior.
- `cross_unit_state.yaml`
  - Who reads: workers changing browser account state.
  - Use for: localStorage value passing between account forms and authenticated views.
  - How to consume: filter `flows` where writer or reader unit matches the assigned unit.
- `project-structure.md`
  - Who reads: all workers.
  - Use for: module boundaries, entrypoints, layers, and functional areas.
- `tech-stack.md`
  - Who reads: workers needing framework/runtime/dependency facts.
  - Use for: current languages, dependencies, versions, and runtime configuration only.
- `data-model.md`
  - Who reads: workers changing account, chat, or retrieval data access.
  - Use for: existing MongoDB document fields, relationships, and Pinecone metadata.

No `migration_boundary.yaml` or `seams.yaml` is included: this analysis request did not specify a target migration, implementation cut, or frozen side. Do not infer rewrite scope or a cutover contract from the inventories.

### Unit: `login-page`

- External trigger: SPA `/` route and login form submission.
- Must read: `units/login-page/behavior.yaml` for login/redirect behavior; `units/login-page/bindings.yaml` for root route/action wiring; `units/login-page/unit_decomposition.yaml` for advisory split candidates only.
- Relevant global rows: wire contracts for `auth-login-api`; shared modules with `login-page`; cross-unit flows written by this unit.
- Before DONE report: artifact paths read, preserved behaviors, unresolved contracts, and build/runtime/test evidence.

### Unit: `signup-page`

- External trigger: SPA `/signup` route and signup form submission.
- Must read: `units/signup-page/behavior.yaml`, `units/signup-page/bindings.yaml`, and `units/signup-page/unit_decomposition.yaml`.
- Relevant global rows: wire contracts for `auth-signup-api`; shared modules with `signup-page`; cross-unit flows written by this unit.
- Before DONE report: artifact paths read, preserved behaviors, unresolved contracts, and build/runtime/test evidence.

### Unit: `authenticated-shell`

- External trigger: parent SPA route `/App`.
- Must read: `units/authenticated-shell/behavior.yaml`, `units/authenticated-shell/bindings.yaml`, and `units/authenticated-shell/unit_decomposition.yaml`.
- Relevant global rows: shared modules where `used_by_units` includes `authenticated-shell`; cross-unit flows read by this unit; chat create/list contracts used by its sidebar.
- Before DONE report: artifact paths read, preserved behaviors, unresolved contracts, and build/runtime/test evidence.

### Unit: `dashboard-page`

- External trigger: SPA route `/App/dashboard`.
- Must read: `units/dashboard-page/behavior.yaml`, `units/dashboard-page/bindings.yaml`, and `units/dashboard-page/unit_decomposition.yaml`.
- Relevant global rows: shared modules where `used_by_units` includes `dashboard-page`; filter cross-unit flows by this unit.
- Before DONE report: artifact paths read, preserved behaviors, unresolved contracts, and build/runtime/test evidence.

### Unit: `chat-page`

- External trigger: SPA route `/App/chat/:chatId`.
- Must read: `units/chat-page/behavior.yaml`, `units/chat-page/bindings.yaml`, and `units/chat-page/unit_decomposition.yaml`.
- Relevant global rows: wire contracts for `chat-read-api` and `chat-send-api`; shared modules where `used_by_units` includes `chat-page`; cross-unit flows read by this unit.
- Before DONE report: artifact paths read, preserved behaviors, unresolved contracts, and build/runtime/test evidence.

### Unit: `auth-signup-api`

- External trigger: `POST /api/auth/signup`.
- Must read: `units/auth-signup-api/behavior.yaml`, `units/auth-signup-api/bindings.yaml`, and `units/auth-signup-api/unit_decomposition.yaml`.
- Relevant global rows: its wire contract; shared auth router/controller and user-model rows; filter cross-unit flows by unit name.
- Before DONE report: artifact paths read, preserved behaviors, unresolved contracts, and build/runtime/test evidence.

### Unit: `auth-login-api`

- External trigger: `POST /api/auth/login`.
- Must read: `units/auth-login-api/behavior.yaml`, `units/auth-login-api/bindings.yaml`, and `units/auth-login-api/unit_decomposition.yaml`.
- Relevant global rows: its wire contract; shared auth router/controller and user-model rows; filter cross-unit flows by unit name.
- Before DONE report: artifact paths read, preserved behaviors, unresolved contracts, and build/runtime/test evidence.

### Unit: `auth-logout-api`

- External trigger: `POST /api/auth/logout`.
- Must read: `units/auth-logout-api/behavior.yaml`, `units/auth-logout-api/bindings.yaml`, and `units/auth-logout-api/unit_decomposition.yaml`.
- Relevant global rows: its wire contract; shared auth router/controller rows; filter cross-unit flows by unit name.
- Before DONE report: artifact paths read, preserved behaviors, unresolved contracts, and build/runtime/test evidence.

### Unit: `chat-create-api`

- External trigger: `POST /api/new-chat/:userId`.
- Must read: `units/chat-create-api/behavior.yaml`, `units/chat-create-api/bindings.yaml`, and `units/chat-create-api/unit_decomposition.yaml`.
- Relevant global rows: its wire contract; shared chat router/controller/model rows; filter cross-unit flows by unit name.
- Before DONE report: artifact paths read, preserved behaviors, unresolved contracts, and build/runtime/test evidence.

### Unit: `chat-list-api`

- External trigger: `GET /api/chats/:userId`.
- Must read: `units/chat-list-api/behavior.yaml`, `units/chat-list-api/bindings.yaml`, and `units/chat-list-api/unit_decomposition.yaml`.
- Relevant global rows: its wire contract; shared chat router/controller/model rows; filter cross-unit flows by unit name.
- Before DONE report: artifact paths read, preserved behaviors, unresolved contracts, and build/runtime/test evidence.

### Unit: `chat-read-api`

- External trigger: `GET /api/chat/:userId/:chatId`.
- Must read: `units/chat-read-api/behavior.yaml`, `units/chat-read-api/bindings.yaml`, and `units/chat-read-api/unit_decomposition.yaml`.
- Relevant global rows: its wire contract; shared chat router/controller/model rows; filter cross-unit flows by unit name.
- Before DONE report: artifact paths read, preserved behaviors, unresolved contracts, and build/runtime/test evidence.

### Unit: `chat-send-api`

- External trigger: `POST /api/chat/:userId/:chatId`.
- Must read: `units/chat-send-api/behavior.yaml`, `units/chat-send-api/bindings.yaml`, and `units/chat-send-api/unit_decomposition.yaml`.
- Relevant global rows: its wire contract; `chatbot-chat-api` contract; shared chat router/controller/model rows; filter cross-unit flows by unit name.
- Before DONE report: artifact paths read, preserved behaviors, unresolved contracts, and build/runtime/test evidence.

### Unit: `chatbot-health-api`

- External trigger: `GET /` on the Flask service.
- Must read: `units/chatbot-health-api/behavior.yaml`, `units/chatbot-health-api/bindings.yaml`, and `units/chatbot-health-api/unit_decomposition.yaml`.
- Relevant global rows: its wire contract; no shared-module or cross-unit-state rows currently reference this unit.
- Before DONE report: artifact paths read, preserved behaviors, unresolved contracts, and build/runtime/test evidence.

### Unit: `chatbot-chat-api`

- External trigger: `POST /chat` on the Flask service.
- Must read: `units/chatbot-chat-api/behavior.yaml`, `units/chatbot-chat-api/bindings.yaml`, and `units/chatbot-chat-api/unit_decomposition.yaml`.
- Relevant global rows: its wire contract; `chat-send-api` dependency; filter shared/cross-unit rows by unit name.
- Before DONE report: artifact paths read, preserved behaviors, unresolved contracts, and build/runtime/test evidence.

### Unit: `vector-index-build`

- External trigger: direct execution of `chatbot/store_index.py`.
- Must read: `units/vector-index-build/behavior.yaml`, `units/vector-index-build/bindings.yaml`, and `units/vector-index-build/unit_decomposition.yaml`.
- Relevant global rows: `data-model.md` for the indexed document metadata and `tech-stack.md` for the current embedding/vector-store dependencies.
- Before DONE report: artifact paths read, preserved behaviors, unresolved contracts, and build/runtime/test evidence.
