# Project Structure

## Project type

Full-stack application with three repository modules: a React single-page frontend, an Express/Mongoose API, and a Flask retrieval-augmented chatbot service. The modules are separately started and communicate over HTTP; the Node API calls the deployed Flask chatbot endpoint.

## Top-level modules and tracked source counts

Counts below are from the repository's tracked files, excluding dependencies and generated assets.

| Area | Tracked files | Structure |
|---|---:|---|
| `medical-chatbot-react-version/` | 17 | Vite application; 9 files under `src/` (2 app/bootstrap files, 4 pages, 3 components) |
| `backend/` | 10 | Express entry point, 2 route modules, 2 controllers, 3 model/test files, package manifest and lockfile |
| `chatbot/` | 11 | Flask app, 4 Python source/package files, dependency/runtime metadata, and one PDF knowledge source |
| Repository root | 1 | `.gitignore` |

## Layers and functional areas

- **Frontend bootstrap and routing:** `index.html`, `src/main.jsx`, and `vite.config.js` mount React and define client routes.
- **Frontend account access:** Login (`/`) and signup (`/signup`) forms post through React Router actions to the auth API.
- **Authenticated chat UI:** `/App` renders the app shell; child routes provide a dashboard and `/App/chat/:chatId`. The sidebar lists/creates chats; the chat view reads messages and sends user input.
- **Backend HTTP/API layer:** `backend/app.js` configures Express, CORS, JSON parsing, session storage, MongoDB, and mounts auth/chat routers.
- **Backend controller/data layer:** controllers implement auth and chat operations; Mongoose models persist users and chats.
- **Chatbot/RAG service:** `chatbot/app.py` exposes `/` and `POST /chat`; it lazily initializes a retrieval chain against the Pinecone index, embeds with a sentence-transformer, and queries a Groq-hosted model.
- **Knowledge indexing:** `chatbot/store_index.py` loads PDFs from `chatbot/data`, splits documents, builds embeddings, and writes them to Pinecone.

## Entry points and routing

- Frontend document entry: `medical-chatbot-react-version/index.html`; it loads `src/main.jsx`.
- React routes: `/` → Login; `/signup` → SignUp; `/App` → App shell with nested `/App/dashboard` and `/App/chat/:chatId`.
- Node service entry: `backend/app.js`, listening on port `3002`; mounts `/api/auth` and `/api`.
- Auth API: `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`.
- Chat API: `POST /api/new-chat/:userId`, `GET /api/chats/:userId`, `GET /api/chat/:userId/:chatId`, and `POST /api/chat/:userId/:chatId`.
- Flask entry: `chatbot/app.py`, listening on `PORT` or `8080`; provides `GET /` and `POST /chat`.
- Indexing entry: direct execution of `chatbot/store_index.py`; no CLI arguments are defined.

## Configuration files and roles

- `medical-chatbot-react-version/package.json` and `package-lock.json`: frontend scripts and npm dependency declarations/resolutions.
- `medical-chatbot-react-version/vite.config.js`: Vite config with React and React Compiler Babel preset.
- `medical-chatbot-react-version/index.html`: browser document title, root mount element, and module entry.
- `backend/package.json` and `package-lock.json`: Node service scripts and dependencies.
- `backend/app.js`: loads dotenv values and configures CORS/session/Mongo connection; the source reads `SESSION_KEY` and `MONGO_URL`.
- `chatbot/requirements.txt`: Python runtime dependencies.
- `chatbot/.python-version` and `chatbot/runtime.txt`: both specify Python 3.11.11.
- `chatbot/setup.py`: setuptools package metadata; its `intall_requires` spelling is present as written.
- Runtime secrets/configuration are referenced in source but no `.env` file is tracked in the file inventory.

## Runtime connections

The frontend uses hard-coded Render API URLs and credentialed Axios requests to the Node API. The Node `chat-send` handler posts to the deployed Railway Flask `/chat` URL. The Flask service uses Pinecone for vector retrieval and Groq for response generation. No source-defined direct database connection exists between the React frontend and MongoDB.

## Evidence boundaries

This is a source-level structure inventory. The repository contains no checked-in architecture diagrams or deployment manifests in the analyzed tracked-file inventory; hosting details beyond hard-coded service URLs and listener ports are not inferred here.
