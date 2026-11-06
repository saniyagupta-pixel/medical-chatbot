# Medical Chatbot

A medical question-answering application made up of three services:

- **Frontend:** React and Vite
- **Backend:** Express, MongoDB, and session-based authentication
- **Chatbot:** Flask, LangChain, Pinecone retrieval, and Groq generation

The repository includes a root launcher so all three services can be started
together. Local configuration is read from one root-level `.env` file.

## Prerequisites

- Windows with PowerShell
- Node.js and npm
- Python 3.14
- A MongoDB connection string
- Pinecone and Groq API keys

## Initial setup

Run these commands from the repository root in PowerShell.

### 1. Configure environment variables

Copy the example file to `.env`:

```powershell
Copy-Item .env.example .env
```

Edit `.env` and replace the placeholders:

| Variable | Purpose |
| --- | --- |
| `MONGO_URL` | MongoDB connection string used by the backend and session store |
| `SESSION_KEY` | A long, private key used to sign session cookies |
| `PINECONE_API_KEY` | Pinecone API key used by the chatbot |
| `GROQ_API_KEY` | Groq API key used to generate answers |
| `CHATBOT_API_URL` | Chatbot endpoint; use `http://127.0.0.1:8080/chat` for local development |
| `VITE_API_BASE_URL` | Backend base URL; use `http://localhost:3002` for local development |

Do not commit `.env` or put real credentials in `.env.example`.

### 2. Install Node.js dependencies

Install the root process runner and the dependencies for each Node.js service:

```powershell
npm ci
npm --prefix backend ci
npm --prefix medical-chatbot-react-version ci
```

### 3. Create and install the Python virtual environment

The chatbot launcher expects its environment at `chatbot\.venv`. Create it and
install the chatbot requirements:

```powershell
py -3.14 -m venv chatbot\.venv
.\chatbot\.venv\Scripts\python.exe -m pip install --upgrade pip
.\chatbot\.venv\Scripts\python.exe -m pip install -r chatbot\requirements.txt
```

The one-command launcher activates this virtual environment before starting the
chatbot, so you do not need to activate it manually when using the next step.

## Start all services

From the repository root, run:

```powershell
npm start
```

The launcher starts all three development services together:

| Service | Local address |
| --- | --- |
| Frontend | <http://localhost:5173> |
| Backend | <http://localhost:3002> |
| Chatbot | <http://localhost:8080> |
| Chatbot health check | <http://localhost:8080/healthz> |

The frontend launcher configures the API base URL to the local backend. The
backend sends chat requests to the chatbot URL from `CHATBOT_API_URL`.

Press **Ctrl+C** in the terminal to stop the services.

## Run a service separately

From the repository root:

```powershell
npm --prefix backend run dev
npm --prefix medical-chatbot-react-version run dev
```

To run the chatbot separately while still using its virtual environment:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File chatbot\start.ps1
```

Alternatively, activate the environment and run Flask yourself:

```powershell
.\chatbot\.venv\Scripts\Activate.ps1
Set-Location chatbot
python app.py
```

## Build and lint the frontend

```powershell
npm --prefix medical-chatbot-react-version run build
npm --prefix medical-chatbot-react-version run lint
```

## Deploy to Render

Deploy the frontend, backend, and RAG API as three separate Render services
from the dashboard. Do not use a Blueprint. MongoDB Atlas, Pinecone, and Groq
are external dependencies; create the Pinecone index before testing chat.

### Before deploying

1. Push the repository to GitHub and make sure Render can access it.
2. Create a MongoDB Atlas database and database user. Configure Atlas Network
   Access to allow the Render backend to connect.
3. Build the Pinecone index by following the instructions below. The index must
   be named `medical-chatbot`, use 384 dimensions, and use cosine similarity.
4. Have the MongoDB connection string and Pinecone and Groq API keys ready.
   Enter secrets in Render's Environment settings; never commit them.

### Deploy the RAG API

In Render, choose **New > Web Service**, connect this repository and branch,
and set:

| Setting | Value |
| --- | --- |
| Name | `medical-chatbot-rag` |
| Root Directory | `chatbot` |
| Runtime | Python |
| Build Command | `pip install -r requirements.txt && pip install gunicorn` |
| Start Command | `gunicorn app:app --bind 0.0.0.0:$PORT --timeout 120` |
| Health Check Path | `/healthz` |

Set `PYTHON_VERSION` to `3.14.4`. Add `PINECONE_API_KEY` and `GROQ_API_KEY`;
optionally set `GROQ_MODEL` to `openai/gpt-oss-20b` (the application default).
The embedding model needs significant memory, so select a plan with at least
2 GB RAM and check Render's current pricing.

Deploy the service, wait for it to become healthy, and copy its public
`https://...onrender.com` URL. The RAG service must be a public web service for
this dashboard setup because the backend will call its public URL.

### Deploy the backend

Create another **Web Service** using the same repository and branch:

| Setting | Value |
| --- | --- |
| Name | `medical-chatbot-backend` |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm ci` |
| Start Command | `npm start` |

Set these environment variables:

| Key | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `MONGO_URL` | MongoDB Atlas connection string |
| `SESSION_KEY` | Long, random secret |
| `CHATBOT_API_URL` | RAG URL plus `/chat`, e.g. `https://medical-chatbot-rag.onrender.com/chat` |

Deploy and wait for the service to start. Copy its public URL for the frontend
configuration. Check the service logs for a successful MongoDB connection.

### Deploy the frontend

Create a **Static Site** using the same repository and branch:

| Setting | Value |
| --- | --- |
| Name | `medical-chatbot-frontend` |
| Root Directory | `medical-chatbot-react-version` |
| Build Command | `npm ci && npm run build` |
| Publish Directory | `dist` |

Add the build-time environment variable `VITE_API_BASE_URL` and set it to the
backend's public base URL, e.g. `https://medical-chatbot-backend.onrender.com`.
Do not append `/api` or a trailing slash. Add a rewrite rule in **Redirects /
Rewrites**:

| Source | Destination | Action |
| --- | --- | --- |
| `/*` | `/index.html` | Rewrite |

Deploy the site and copy its public URL.

### Allow the frontend in backend CORS

Open the backend service's **Environment** settings and set `FRONTEND_URL` to
the exact frontend origin, e.g. `https://medical-chatbot-frontend.onrender.com`
(no path or trailing slash). Save and redeploy the backend. If you also use a
custom frontend domain, set `FRONTEND_URLS` to a comma-separated list that
includes both the Render frontend URL and the custom domain.

### Smoke test

1. Open the frontend URL and create an account.
2. Start a new chat and ask a question grounded in the uploaded PDF.
3. If chat fails, inspect the backend logs for forwarding or MongoDB errors and
   the RAG logs for Pinecone, Groq, model download, or memory errors.
4. The first RAG request may take longer because the embedding model loads on
   demand. The `/healthz` response reports `rag_initialized: false` until then.

This dashboard deployment does not use a `render.yaml` Blueprint or a Vercel
configuration file. The three services remain independent Render deployments;
deploy the RAG API first, then the backend, then the frontend so you can set
each service URL in the next service's environment.

## Build the Pinecone knowledge index

Index creation is a separate, one-time or maintenance task; it is not run when
the three application services start. Ensure `.env` has `PINECONE_API_KEY`, then
run:

```powershell
.\chatbot\.venv\Scripts\Activate.ps1
Set-Location chatbot
python store_index.py
```

The script reads PDF files from `chatbot\data` and writes their embeddings to
the configured Pinecone index. Avoid running indexing repeatedly unless you
intend to add the documents again.

## Troubleshooting

- **Virtual environment not found:** create `chatbot\.venv` using the setup
  command above.
- **Backend cannot connect:** verify `MONGO_URL` and that the MongoDB service
  accepts the connection.
- **Chatbot reports it is not configured:** verify `PINECONE_API_KEY` and
  `GROQ_API_KEY` are set in the root `.env`.
- **Chat requests fail locally:** confirm all services are running and
  `CHATBOT_API_URL` is `http://127.0.0.1:8080/chat`.
- **Frontend uses the wrong backend:** for local work, set
  `VITE_API_BASE_URL=http://localhost:3002` in the root `.env`, then restart
  Vite.

The Flask server used by the development launcher is intended for local
development, not production deployment.
