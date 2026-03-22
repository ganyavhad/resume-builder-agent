# Resume Generator - Quick Start Guide

## Prerequisites

- Node.js 16+ installed
- npm installed
- VS Code 1.75.0 or higher

## Installation

```bash
# Install all dependencies (already done, but if needed)
npm install
```

## Running the Project

### Method 1: Development Mode (Recommended)

Start in a new terminal:

```bash
npm run dev
```

This starts both:
- **esbuild watcher** - Auto-compiles TypeScript changes
- **Backend server** - Runs on http://localhost:3000

### Method 2: Manual Setup (Two Terminals)

**Terminal 1 - Start Backend Server:**
```bash
npm run server
```
Server will be running on `http://localhost:3000`

**Terminal 2 - Start Extension Development:**
```bash
npm run esbuild-watch
```

### Debug in VS Code

1. Press `F5` or go to **Run > Start Debugging**
2. Opens a new VS Code window with the extension loaded
3. Open Command Palette (`Ctrl+Shift+P`) and run: **"Open Resume Builder"**
4. Fill out the form and test the PDF export

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm run esbuild` | Compile once for production |
| `npm run esbuild-watch` | Watch mode - recompiles on file changes |
| `npm run build:extension` | Compile only the extension |
| `npm run build:server` | Compile only the backend server |
| `npm run server` | Start backend on port 3000 |
| `npm run dev` | Start both extension watcher and server |
| `npm run typecheck` | Validate TypeScript without compiling |

## Project Architecture

```
Frontend (VS Code Webview)
        ↕ (Message Passing)
Extension (src/extension.ts)
        ↕ (HTTP)
Backend Server (src/server.ts:3000)
        ↕ (HTML to PDF)
Puppeteer
        ↓
PDF Output
```

## Testing the API Directly

```bash
# Health check
curl http://localhost:3000/health

# Generate PDF
curl -X POST http://localhost:3000/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "location": "San Francisco, CA",
    "summary": "Experienced developer with 5+ years...",
    "experience": {
      "jobTitle": "Senior Developer",
      "company": "Tech Corp",
      "dateRange": "2020 - Present",
      "description": "Led development of..."
    },
    "education": {
      "degree": "BS Computer Science",
      "school": "University of State",
      "graduationYear": "2018"
    },
    "skills": "JavaScript, React, Node.js, Python"
  }' > resume.pdf
```

## Troubleshooting

### Error: Cannot find module 'dist/server.js'
**Solution:** Run `npm run build:server` before `npm run server`

### Error: Port 3000 already in use
**Solution:** Change PORT in `src/server.ts` or kill the process using port 3000

### Extension not activating
**Solution:** 
1. Ensure esbuild compiled successfully: `npm run esbuild`
2. Reload VS Code window (`Cmd+Shift+P` → "Developer: Reload Window")

### PDF generation fails
**Solution:**
1. Check backend server is running: `curl http://localhost:3000/health`
2. Check browser console for errors (F12 in VS Code webview)
3. See backend logs for Puppeteer errors

## Development Workflow

1. **Make code changes** in `src/`
2. **esbuild-watch** automatically recompiles
3. **Reload Extension** in VS Code (Cmd+Shift+P → "Developer: Reload Window")
4. **Test** the changes in the Resume Builder

## Building for Distribution

```bash
# Creates release build
npm run esbuild
```

This minifies the code and prepares it for distribution.

## Next Steps

- [ ] Customize resume CSS in `src/server.ts`
- [ ] Add more template options
- [ ] Integrate LinkedIn profile import
- [ ] Add cover letter generation
- [ ] Deploy backend to cloud service (Heroku, AWS Lambda, etc.)

---

**Happy resume building! 🚀**
