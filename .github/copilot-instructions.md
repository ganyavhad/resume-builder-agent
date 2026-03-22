# Resume Generator AI Agent - Project Instructions

## Project Overview

VS Code extension that generates professional resumes in HTML/CSS with PDF export capability. The extension provides a user-friendly form interface with real-time preview and backend PDF generation using Puppeteer.

## Architecture

- **Frontend**: Webview-based form UI built into VS Code
- **Backend**: Express server for PDF generation via Puppeteer
- **Communication**: Message passing between extension and webview

## Key Files

- `src/extension.ts` - VS Code extension entry point with webview management
- `src/server.ts` - Express backend for resume HTML generation and PDF conversion
- `package.json` - Dependencies: puppeteer, express, react, typescript
- `tsconfig.json` - TypeScript configuration for ES2020 target

## Build Commands

- `npm run esbuild` - Compile TypeScript for development
- `npm run esbuild-watch` - Watch mode compilation
- `npm run server` - Start backend server on port 3000
- `npm run dev` - Run both extension compiler and backend server
- `npm run typecheck` - Validate TypeScript types

## Dependencies

- **puppeteer** ^21.7.0 - HTML to PDF conversion
- **express** ^4.18.2 - Backend API server
- **typescript** ^5.3.3 - TypeScript compiler
- **esbuild** ^0.20.2 - Fast bundler
- **react** ^18.2.0 - UI library (for future integration)

## Implementation Notes

1. Extension activates on command "resume-generator.openResumeBuilder"
2. Opens webview panel in VS Code with embedded HTML form
3. Form updates preview in real-time as user types
4. Export button sends resume data to backend server
5. Backend generates PDF and returns as binary response
6. Extension handles PDF URL generation for display

## Next Steps After Scaffolding

1. Install dependencies: `npm install`
2. Compile: `npm run esbuild`
3. Start backend: `npm run server` (in separate terminal)
4. Open extension in VS Code debug mode (F5)
5. Run command "Open Resume Builder" to test

## Common Issues

- Port 3000 conflicts: Modify PORT in server.ts
- Puppeteer installation: May require build tools
- Extension activation: Ensure esbuild completed successfully
