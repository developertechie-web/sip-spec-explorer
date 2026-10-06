# SIP Explorer Pro

Create a modern, sleek developer dashboard application called "SIP RFC Explorer" designed for telecom solutions architects and engineers. The app allows users to upload RFC documents (or select built-in standard RFCs like RFC 3261) and query a backend Retrieval-Augmented Generation (RAG) engine about SIP protocols, header rules, state machines, and specifications.

Key Features Required:

1. Top Navigation Bar:

   - App title "📞 SIP RFC Explorer" with a status indicator badge showing backend connection health (Connected/Disconnected).

   - A settings modal or input field to configure the "Backend API Base URL" (defaulting to http://localhost:8080/api/sip).

2. Two-Column / Split Layout:

   - Left Sidebar (Document & Knowledge Base Manager):

     - Section to upload custom RFC text or PDF documents (drag-and-drop file upload zone).

     - List of currently indexed/loaded technical documents with delete/status options.

   - Right Main Panel (Interactive RAG Query Console):

     - A prominent chat/query interface with a text input area for asking technical questions (e.g., "What are the rules for Forking proxies under RFC 3261 Section 16.7?").

     - Quick-prompt suggestion pills (e.g., "Via Header parameters", "UAC State Machine", "401 Unauthorized requirements").

     - Clear loading states (spinner/skeleton loaders) while waiting for the RAG response.

3. Results & Transparency View:

   - Display the LLM's structured answer clearly with markdown formatting, syntax highlighting for code blocks (SIP messages, SDP payloads), and bullet points.

   - An expandable section titled "Retrieved RFC Context & Sources" showing the text snippets and sections the model used to form its answer.

4. Styling & UI/UX:

   - Dark/Light mode support (default to a clean, developer-friendly dark theme like a terminal/VS Code aesthetic: slate-900 background, neon teal/blue accents).

   - Fully responsive layout built with Tailwind CSS and Lucide React icons.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sip-spec-explorer.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9898cb84-03a9-457e-ac94-d6acd220930d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
