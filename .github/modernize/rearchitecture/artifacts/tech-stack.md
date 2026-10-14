# Technology Stack

## Languages and runtimes

- Frontend: JavaScript ES modules with JSX, React 19; no TypeScript configuration is present.
- API: CommonJS JavaScript on Node.js; no explicit Node engine range is declared.
- Chatbot and indexing: Python 3.11.11 (`chatbot/.python-version` and `chatbot/runtime.txt`).
- Frontend build/dev server: Vite 8, configured in `medical-chatbot-react-version/vite.config.js`.
- API framework: Express 5 with Mongoose 9 and MongoDB.
- Chatbot framework: Flask 3 with LangChain retrieval components, Pinecone vector store, sentence-transformer embeddings, and Groq LLM integration.

## Frontend npm dependencies

Declared versions are ranges from `medical-chatbot-react-version/package.json`; resolved versions below are included where checked from the lockfile.

| Package | Declared | Locked |
|---|---|---|
| axios | `^1.18.1` | 1.18.1 |
| bootstrap | `^5.3.8` | 5.3.8 |
| react | `^19.2.6` | 19.2.7 |
| react-dom | `^19.2.6` | 19.2.7 |
| react-icons | `^5.6.0` | — |
| react-router-dom | `^7.18.0` | 7.18.0 |
| @babel/core | `^7.29.0` | — |
| @eslint/js | `^10.0.1` | — |
| @rolldown/plugin-babel | `^0.2.3` | — |
| @types/react | `^19.2.14` | — |
| @types/react-dom | `^19.2.3` | — |
| @vitejs/plugin-react | `^6.0.1` | — |
| babel-plugin-react-compiler | `^1.0.0` | — |
| eslint | `^10.3.0` | — |
| eslint-plugin-react-hooks | `^7.1.1` | — |
| eslint-plugin-react-refresh | `^0.5.2` | — |
| globals | `^17.6.0` | — |
| vite | `^8.0.12` | 8.0.16 |

Scripts: `dev`, `build`, `lint`, and `preview`.

## Backend npm dependencies

Declared versions are ranges from `backend/package.json`; selected locked versions checked from `backend/package-lock.json`.

| Package | Declared | Locked |
|---|---|---|
| axios | `^1.18.0` | 1.18.0 |
| bcrypt | `^6.0.0` | — |
| connect-mongo | `^6.0.0` | — |
| cors | `^2.8.6` | — |
| dotenv | `^17.4.2` | — |
| express | `^5.2.1` | 5.2.1 |
| express-session | `^1.19.0` | — |
| mongoose | `^9.7.1` | 9.7.1 |
| uuid | `^14.0.1` | — |
| nodemon (dev) | `^3.1.14` | — |

Scripts: `start` runs `node app.js`; `dev` runs `nodemon app.js`. The entry point listens on fixed port 3002.

## Python dependencies

Declared in `chatbot/requirements.txt`:

- `langchain==0.3.26`
- `flask==3.1.1`
- `sentence-transformers==4.1.0`
- `pypdf==5.6.1`
- `python-dotenv==1.1.0`
- `langchain-pinecone` (unversioned)
- `langchain-openai==0.3.24`
- `langchain-groq==0.3.5`
- `langchain-community==0.3.26`
- `--prefer-binary` is also present as a pip option.

The runtime uses `ChatGroq` with model name `llama-3.1-8b-instant`, `HuggingFaceEmbeddings` with `sentence-transformers/all-MiniLM-L6-v2`, and Pinecone index `medical-chatbot` with 384 dimensions and cosine metric.

## Configuration and external services

- Backend reads `MONGO_URL` and `SESSION_KEY` from process environment after `dotenv.config()`. Session storage uses `connect-mongo`; user/chat persistence uses Mongoose.
- Chatbot reads `PINECONE_API_KEY` and `GROQ_API_KEY`; index-building code also reads `OPEN_API_KEY`. The chatbot listener reads `PORT` with default 8080.
- The frontend API base is hard-coded to `https://medical-backend-61g4.onrender.com`; the backend chatbot URL is hard-coded to `https://efficient-abundance-production-f04b.up.railway.app/chat`.
- No Node engine or frontend runtime version is declared. Python is explicitly pinned to 3.11.11.
