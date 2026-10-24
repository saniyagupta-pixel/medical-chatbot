# Data Model

## MongoDB / Mongoose documents

### User

Source: `backend/model/User.js`.

| Field | Type | Constraints / behavior |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required; unique |
| `password` | String | Required; signup handler stores a bcrypt hash (cost factor 10) |

Model name: `User`. No explicit collection name, timestamps, or additional indexes are declared in the schema; the unique email option defines a uniqueness constraint.

### Chat

Source: `backend/model/chat.js`.

| Field | Type | Constraints / behavior |
|---|---|---|
| `userId` | ObjectId | References model `User`; required |
| `title` | String | No schema-level required/default constraint |
| `messages` | Array of embedded message documents | No schema-level default or array constraints declared |

### Embedded message

Declared as `messageSchema` in `backend/model/chat.js`; embedded in `Chat.messages`.

| Field | Type | Constraints / behavior |
|---|---|---|
| `role` | String | No enum or required constraint |
| `content` | String | No required constraint |

The application writes roles `user` and `bot`. A newly created chat gets title `new chat` and an empty messages array. On the first user message, the chat handler sets the title to the first 30 characters of that message.

## Relationships and access patterns

- `Chat.userId` → `User` is a reference relationship (ObjectId with `ref: "User"`); the schema does not declare a Mongoose population operation.
- Chat listing filters by `userId` and excludes `messages` from its result projection.
- Chat read/send queries match both chat `_id` and `userId`.
- No explicit multi-document transaction or transaction boundary is declared in the source.

## Vector index and document metadata

The chatbot stores PDF-derived text chunks in Pinecone index `medical-chatbot`. The index is created with 384 dimensions and cosine similarity when absent. `filter_to_minimal_docs` retains document text and only the `source` metadata field before chunking and embedding. This is a vector/document store rather than a Mongoose entity.

## Key entities

- **User:** account name, unique email, and password hash.
- **Chat:** a user's conversation, identified by its `userId`, title, and embedded message history.
- **Message:** embedded conversation item containing role and text content.
- **PDF chunk:** Pinecone vectorized text from the local PDF knowledge source, with `source` metadata.
