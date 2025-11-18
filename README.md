# Blabber

> Lightweight local AI assistant and demo web client — stores, vectors, and a small server to serve data and embeddings.

## Overview

Blabber is a multi-component project combining:

- An AI service (Python-based) that manages documents, vector stores, and (optionally) embedding/LLM integration.
- A Node server that exposes HTTP endpoints for the client and for integration with vector stores.
- A Vite-based client (React) demonstrating a web UI for interacting with the backend and AI service.

The repository is organized to keep data, vector stores, and runtime artifacts separate so you can run components independently.

## Repository Layout

- `ai_service/` - Python AI service logic (contains a `venv` in this copy and a `main.py`).
  - `data/`, `storage/`, `index_store/` - local data and index files (JSON stores and vector DB files).
- `server/` - Node server with `server.js` and `package.json` to expose endpoints.
- `client/` - Vite + React web client. Use `npm run dev` to run the frontend.
- `vector_store/` - local vector DB files (e.g., `chroma.sqlite3`).

## Quickstart

Below are minimal steps to get each component running. Commands assume you run them from the project root.

1) Python AI service (optional, if you plan to run the Python component)

   - Create and activate a virtual environment (Windows):

     ```cmd
     cd ai_service
     python -m venv venv
     venv\Scripts\activate
     ```

   - Install dependencies if a `requirements.txt` exists (otherwise install what your service requires):

     ```cmd
     pip install -r requirements.txt
     ```

   - Run the service (example):

     ```cmd
     python main.py
     ```

   - If the service uses an ASGI server like Uvicorn:

     ```cmd
     uvicorn main:app --reload --port 8000
     ```

2) Node server

   - Install and run the server:

     ```cmd
     cd server
     npm install
     node server.js
     ```

   - If `package.json` contains start scripts, you can also run:

     ```cmd
     npm start
     ```

3) Web client (Vite + React)

   - Start the client dev server:

     ```cmd
     cd client
     npm install
     npm run dev
     ```

   - Open the browser at the address printed by Vite (commonly `http://localhost:5173`).

## Data & Vector Stores

- The project keeps data files under `ai_service/data` and `storage` and a local vector DB file `vector_store/chroma.sqlite3`.
- If you regenerate embeddings or reindex documents, back up the `vector_store` files first.

## Configuration

- Check for environment variables or config files used by each component. Common places to look:
  - `ai_service/` — `main.py` or other modules may reference API keys, model settings, or storage paths.
  - `server/package.json` and `server.js` — port and CORS settings.
  - `client/vite.config.js` and `client/src` — client-side API base URLs.

## Development Notes

- Keep vector DB and large binary files out of git; use `.gitignore` to exclude `vector_store` artifacts if needed.
- When adding new documents to the AI service, follow the ingestion pipeline used by the service to generate embeddings and update the index files in `ai_service/index_store`.

## Contributing

- Fork and create a feature branch for changes.
- Run the relevant component locally and add tests where applicable.

## Troubleshooting

- If ports are in use, change the port in the relevant service and restart.
- If the Python service fails to start, ensure the virtual environment is activated and dependencies are installed.

## Contact

If you need help or want to suggest improvements, open an issue or contact the maintainer in the repository.

---
_Generated README — adjust installation steps and commands as required by your local environment and any non-checked-in configuration (API keys, model endpoints)._ 
