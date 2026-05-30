# ⚖️ LexSimplify

> **Legal document intelligence — plain language summaries, risk detection, and contract Q&A powered by Azure OpenAI.**

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Azure OpenAI](https://img.shields.io/badge/Azure_OpenAI-GPT--4o-0078D4?style=flat-square&logo=microsoftazure&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

LexSimplify lets you upload a legal contract (PDF or DOCX) and get back a plain-English summary, a list of high-risk clauses flagged by severity, and a chat interface where you can ask natural language questions about the document. All output can be translated into a target language via Azure Cognitive Translator.

---

## 📑 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [How the AI Pipeline Works](#-how-the-ai-pipeline-works)
- [Design Decisions](#-design-decisions)
- [Roadmap](#-roadmap)

---

## ✨ Features

| Feature | Description |
|---|---|
| 📝 **Plain-language summary** | GPT-4o reads the full contract and produces a 4–6 sentence summary written for a non-lawyer audience |
| 🚨 **Risk clause detection** | Flags clauses as `HIGH` / `MEDIUM` / `LOW` severity with a plain-English explanation of why each clause is risky |
| 🔍 **Hallucination validation** | Every flagged clause must cite a verbatim quote from the source document; any clause that cannot be grounded is re-prompted or discarded |
| 💬 **Document-grounded Q&A** | Ask questions about the contract in natural language; the model only answers from the document's own text, never from general knowledge |
| 🌐 **Multi-language output** | Translates summaries and risk explanations into any BCP-47 language via Azure Cognitive Translator (translation runs after AI analysis, so the model always works in English) |
| 📄 **Large document support** | Contracts exceeding the model's context window are split into overlapping token-safe chunks with sentence-boundary snapping, then merged into a single result |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React (Vite)                        │
│  UploadZone → ResultsDashboard → ChatPanel              │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP + JWT
┌──────────────────────▼──────────────────────────────────┐
│              Spring Boot 3 (Java 17)                    │
│                                                         │
│  Controllers                                            │
│  ├── DocumentController  (upload, analyze)              │
│  └── QueryController     (Q&A)                          │
│                                                         │
│  Services                                               │
│  ├── ChunkingService     (token-safe splitting)         │
│  ├── AiPipelineService   (summary + risk detection)     │
│  ├── QaService           (grounded Q&A)                 │
│  ├── BlobStorageService  (upload / download)            │
│  └── TranslationService  (post-processing)              │
│                                                         │
│  Config                                                 │
│  ├── AzureConfig         (SDK beans)                    │
│  └── SecurityConfig      (JWT + CORS)                   │
└──────┬────────────────────┬───────────────┬─────────────┘
       │                    │               │
┌──────▼──────┐  ┌──────────▼────┐  ┌──────▼────────────┐
│ Azure Blob  │  │ Azure OpenAI  │  │ Azure Translator  │
│ Storage     │  │ (GPT-4o)      │  │ REST API          │
└─────────────┘  └───────────────┘  └───────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Axios |
| **Backend** | Java 17, Spring Boot 3, Spring Security |
| **AI** | Azure OpenAI (GPT-4o) |
| **Storage** | Azure Blob Storage |
| **Translation** | Azure Cognitive Translator |
| **Auth** | JWT (`io.jsonwebtoken`) |
| **PDF parsing** | Apache PDFBox 3 |
| **DOCX parsing** | Apache POI 5 |
| **Build** | Maven |

---

## 📁 Project Structure

### Backend

```
com.lexsimplify/
├── controller/
│   ├── DocumentController.java   # POST /upload, POST /{docId}/analyze
│   └── QueryController.java      # POST /{docId}/query
├── service/
│   ├── ChunkingService.java      # Overlapping token-safe chunking
│   ├── AiPipelineService.java    # GPT-4o analysis + hallucination guard
│   ├── QaService.java            # Grounded Q&A with keyword retrieval
│   ├── BlobStorageService.java   # Azure Blob upload/download
│   └── TranslationService.java   # Azure Translator post-processing
├── config/
│   ├── AzureConfig.java          # OpenAIClient + BlobContainerClient beans
│   └── SecurityConfig.java       # JWT filter + CORS
├── model/
│   ├── ClauseRisk.java           # { clause, severity, reason, quote }
│   ├── AnalysisResult.java       # { summary, risks, metadata }
│   └── ChunkResult.java          # Intermediate per-chunk AI response
├── dto/
│   ├── AnalyzeRequest.java       # { targetLanguage }
│   └── QueryRequest.java         # { question }
├── exception/
│   └── GlobalExceptionHandler.java  # @ControllerAdvice — structured JSON errors
└── util/
    └── DocumentTextExtractor.java   # PDFBox + POI text extraction
```

### Frontend

```
src/
├── api/
│   └── lexApi.js             # All Axios calls — upload, analyze, query
├── components/
│   ├── UploadZone.jsx        # Drag-drop, react-dropzone
│   ├── RiskBadge.jsx         # HIGH / MEDIUM / LOW severity pill
│   ├── ClauseCard.jsx        # Risk card with collapsible verbatim quote
│   ├── SummaryPanel.jsx      # Summary + metadata chips
│   └── ChatPanel.jsx         # Q&A chat interface
├── pages/
│   ├── UploadPage.jsx        # Upload + language selector
│   └── ResultsPage.jsx       # Summary, risk list, chat
├── context/
│   └── DocumentContext.jsx   # Global state: docId, status, summary, risks
└── hooks/
    └── useAnalysis.js        # upload → analyze flow + navigation
```

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- Maven 3.9+
- An Azure account with:
  - Azure OpenAI resource (GPT-4o deployment)
  - Azure Blob Storage account + container
  - Azure Cognitive Translator resource

### Backend

```bash
# Clone the repository
git clone https://github.com/yourusername/lexsimplify.git
cd lexsimplify/backend

# Set environment variables (see Environment Variables section)
export AZURE_OPENAI_KEY=your_key
export AZURE_STORAGE_CONNECTION_STRING=your_connection_string
export AZURE_TRANSLATOR_KEY=your_key
export JWT_SECRET=your_256bit_secret

# Run
mvn spring-boot:run
```

> The API starts on `http://localhost:8080`

### Frontend

```bash
cd lexsimplify/frontend

# Install dependencies
npm install

# Create .env
echo "VITE_API_URL=http://localhost:8080" > .env

# Start dev server
npm run dev
```

> The UI starts on `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend (`application.properties`)

| Variable | Description |
|---|---|
| `AZURE_OPENAI_KEY` | Azure OpenAI API key |
| `azure.openai.endpoint` | e.g. `https://YOUR_RESOURCE.openai.azure.com/` |
| `azure.openai.deployment` | Your GPT-4o deployment name |
| `AZURE_STORAGE_CONNECTION_STRING` | Azure Blob Storage connection string |
| `azure.storage.container` | Blob container name (e.g. `lexsimplify-docs`) |
| `AZURE_TRANSLATOR_KEY` | Azure Cognitive Translator key |
| `azure.translator.region` | Translator resource region (e.g. `eastus`) |
| `JWT_SECRET` | HS256 secret, minimum 256 bits |

### Frontend (`.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL |

---

## 📡 API Reference

### `POST /api/documents/upload`

Upload a PDF or DOCX file. Returns a `docId` used in subsequent calls.

**Request:** `multipart/form-data` with field `file`

**Response:**
```json
{ "docId": "550e8400-e29b-41d4-a716-446655440000" }
```

---

### `POST /api/documents/{docId}/analyze`

Run the full AI pipeline on an uploaded document.

**Request body:**
```json
{ "targetLanguage": "hi" }
```

> `targetLanguage` is optional. If omitted, output is in English. Accepts any BCP-47 language code supported by Azure Translator (e.g. `"es"`, `"fr"`, `"de"`, `"hi"`, `"ar"`).

**Response:**
```json
{
  "summary": "This agreement is a software services contract between...",
  "risks": [
    {
      "clause": "The vendor may terminate the agreement without notice",
      "severity": "HIGH",
      "reason": "Allows the vendor to end services immediately with no warning, leaving you without recourse",
      "quote": "Provider reserves the right to terminate this Agreement at any time without prior notice"
    }
  ],
  "totalChunksProcessed": 8,
  "hallucValidationFails": 1
}
```

---

### `POST /api/documents/{docId}/query`

Ask a natural language question about the contract.

**Request body:**
```json
{ "question": "What is the notice period for termination?" }
```

**Response:**
```json
{
  "answer": "According to Section 12.3, either party must provide 30 days written notice before terminating the agreement..."
}
```

---

## 🧠 How the AI Pipeline Works

### 1. Text Extraction

The uploaded file is stored in Azure Blob Storage under its `docId`. When analysis is requested, the raw bytes are downloaded and routed through `DocumentTextExtractor`: PDFBox for PDFs, Apache POI for DOCX files.

### 2. Chunking

`ChunkingService` splits the extracted text into overlapping chunks. Each chunk is capped at approximately **1,500 tokens** (6,000 characters). Chunks overlap by **200 tokens** (800 characters) so that clause context is preserved across chunk boundaries. Before slicing, the service snaps the cut point to the nearest sentence boundary (`.` character) past the midpoint of the window — no clause is ever split mid-sentence.

### 3. Per-Chunk Analysis

Each chunk is sent to GPT-4o with a structured prompt requesting JSON output:

```json
{
  "summary": "...",
  "risks": [
    { "clause": "...", "severity": "HIGH|MEDIUM|LOW", "reason": "...", "quote": "..." }
  ]
}
```

> Temperature is set to `0.1` — low enough for consistent structured extraction, not zero so the model can paraphrase naturally.

### 4. Hallucination Validation

After parsing the JSON response, every flagged `risk.quote` is checked against the source chunk using `sourceChunk.contains(risk.quote)`. If any quote cannot be found verbatim in the source text, the entire chunk is **re-prompted** with stricter grounding instructions. This is the core quality gate — it ensures every risk card shown to the user is traceable to actual contract text.

### 5. Merging

Chunk summaries are consolidated into a single paragraph via a final GPT-4o call. Risk lists from all chunks are deduplicated (a risk is dropped if its `clause` field is a substring of an already-accepted risk). Risks are sorted `HIGH → MEDIUM → LOW`.

### 6. Translation *(optional)*

If `targetLanguage` is set, `TranslationService` passes the final `summary` and each `reason` through Azure Cognitive Translator. The `quote` field (verbatim contract text) and `severity` enum are **never** translated.

### 7. Q&A

When the user asks a question, `QaService` scores every chunk by keyword overlap with the question, takes the top 3 chunks, and injects them as context into a grounding prompt. Temperature is `0.0`. The model is instructed to answer only from the provided context and to say *"This information is not in the provided contract sections"* if the answer is not present.

---

## 💡 Design Decisions

<details>
<summary><strong>Why overlapping chunks?</strong></summary>

Naive chunking splits contracts at fixed character counts, which often cuts clauses in half. The 200-token overlap ensures every clause appears in full in at least one chunk.

</details>

<details>
<summary><strong>Why validate quotes verbatim?</strong></summary>

Large language models can paraphrase or confabulate clauses that sound plausible but do not exist in the source. Requiring a verbatim `quote` field and checking it against the source text makes hallucinations detectable and correctable programmatically.

</details>

<details>
<summary><strong>Why translate last?</strong></summary>

Sending non-English legal text to GPT-4o for clause extraction degrades accuracy — the model's legal domain knowledge is strongest in English. Running translation as a post-processing step keeps the AI pipeline entirely in English.

</details>

<details>
<summary><strong>Why keyword retrieval for Q&A?</strong></summary>

Cosine similarity over embeddings is more accurate but adds a vector database dependency and embedding API calls. Keyword overlap is explainable, dependency-free, and accurate enough for contracts where users ask questions using the same terminology as the contract. The code is structured so `retrieveRelevantChunks` can be swapped out for embedding-based retrieval without touching the rest of `QaService`.

</details>

<details>
<summary><strong>Why is <code>severity</code> an enum?</strong></summary>

Storing severity as a `String` means invalid values (e.g. `"CRITICAL"` or `"high"`) can silently enter the system. Making it `ClauseRisk.Severity { HIGH, MEDIUM, LOW }` means the JSON parser throws an `IllegalArgumentException` immediately if the model returns an unexpected value — caught by `GlobalExceptionHandler` and returned as a `400` rather than corrupt data.

</details>

---

## 🗺️ Roadmap

- [ ] Embedding-based chunk retrieval using Azure OpenAI `text-embedding-ada-002`
- [ ] Side-by-side contract comparison (upload two documents, diff the risk profiles)
- [ ] Clause export to PDF report
- [ ] User accounts with analysis history stored in PostgreSQL
- [ ] Support for scanned PDFs via Azure Document Intelligence (OCR)
- [ ] Streaming responses for the Q&A interface via Server-Sent Events
