# Resume Generator - AI Agent Extension

A VS Code extension that generates professional resumes in HTML and CSS format with PDF export capability. Build and customize your resume directly from VS Code with real-time preview.

## Features

- 📋 **Interactive Resume Builder** - Fill in your information with a beautiful form interface
- 👁️ **Real-time Preview** - See your resume update as you type
- 📄 **Multiple Export Formats** - Export as HTML, CSS, or PDF
- 🎨 **Professional Templates** - Clean, ATS-friendly resume design
- 🚀 **Fast & Lightweight** - Built with React and Express
- 🔒 **Secure Processing** - All data processing happens locally

## Installation

1. Clone or download this repository
2. Open the folder in VS Code
3. Run `npm install` to install dependencies
4. Run `npm run esbuild` to compile TypeScript

## Usage

### Getting Started

1. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
2. Type "Open Resume Builder" and press Enter
3. A new panel will open with the Resume Builder interface

### Building Your Resume

1. **Personal Information** - Enter your name, email, phone, and location
2. **Professional Summary** - Add a brief overview of your background
3. **Experience** - Fill in your job title, company, date range, and responsibilities
4. **Education** - Add your degree, school, and graduation year
5. **Skills** - List your skills (comma-separated)

### Exporting Your Resume

Click the **"📥 Export as PDF"** button to download your resume as a PDF file.

The extension will:
- Validate your information
- Generate professional HTML/CSS
- Convert to PDF using Puppeteer
- Save to your computer

## Project Structure

```
resume-generator/
├── src/
│   ├── extension.ts          # VS Code extension entry point
│   ├── server.ts             # Express server for PDF generation
│   └── ui/                   # React UI components
├── templates/                # Resume HTML/CSS templates
├── media/                    # Media files (icons, etc.)
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## Development

### Build for Development

```bash
npm run esbuild-watch
```

This will watch for changes and automatically recompile.

### Run Backend Server

```bash
npm run server
```

The backend server will run on `http://localhost:3000`

### Development Mode (Both Frontend and Backend)

```bash
npm run dev
```

This starts both the extension compiler and backend server.

### Type Checking

```bash
npm run typecheck
```

## API Endpoints

### Generate PDF

**POST** `/api/generate-pdf`

Request body:
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "location": "San Francisco, CA",
  "summary": "Experienced developer...",
  "experience": {
    "jobTitle": "Senior Developer",
    "company": "Tech Company",
    "dateRange": "Jan 2020 - Present",
    "description": "Led development..."
  },
  "education": {
    "degree": "Bachelor of Science",
    "school": "University Name",
    "graduationYear": "2020"
  },
  "skills": "JavaScript, React, Node.js, Python"
}
```

Response: PDF file (binary)

### Generate HTML

**POST** `/api/generate-html`

Same request format as PDF endpoint.

Response: HTML resume

### Health Check

**GET** `/health`

Response: `{ "status": "ok" }`

## Technologies Used

- **VS Code Extension API** - For VS Code integration
- **TypeScript** - For type-safe development
- **Express.js** - Backend API server
- **Puppeteer** - HTML to PDF conversion
- **React** - UI (optional, can be integrated further)
- **esbuild** - Fast TypeScript bundler

## Requirements

- VS Code 1.75.0 or higher
- Node.js 16.0 or higher
- npm or yarn

## Resume Template Customization

The default resume template is optimized for:
- ✅ ATS (Applicant Tracking System) compatibility
- ✅ Clean, professional appearance
- ✅ Easy readability
- ✅ Standard font sizes and spacing

You can customize the resume HTML/CSS by modifying the `generateResumeHTML` function in `src/server.ts`.

## Troubleshooting

### PDF Generation Fails

- Ensure the backend server is running (`npm run server`)
- Check that `http://localhost:3000/health` returns a 200 status
- Check browser console for error messages

### Extension Not Activating

- Make sure the extension is compiled: `npm run esbuild`
- Reload VS Code window (`Cmd+Shift+P` → "Developer: Reload Window")

### Port 3000 Already in Use

- Change the PORT in `src/server.ts` to an available port
- Update the fetch URL in `src/extension.ts` accordingly

## Contributing

To contribute improvements:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvements`)
3. Make your changes
4. Commit (`git commit -m 'Add improvements'`)
5. Push to the branch (`git push origin feature/improvements`)
6. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Future Enhancements

- [ ] Multiple resume templates
- [ ] Template marketplace
- [ ] Cloud storage integration
- [ ] AI-powered content suggestions
- [ ] LinkedIn profile import
- [ ] Cover letter generator
- [ ] Dark/Light theme support
- [ ] Multi-language support

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy resume building! 🚀**
"# resume-builder-agent" 
