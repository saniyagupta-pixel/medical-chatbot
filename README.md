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
