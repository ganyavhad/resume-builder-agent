import express, { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve static resume templates
app.use(express.static(path.join(__dirname, '../templates')));

interface ResumeData {
	fullName: string;
	email: string;
	phone: string;
	location: string;
	website?: string;
	linkedin?: string;
	github?: string;
	portfolio?: string;
	summary: string;
	experience: Array<{
		jobTitle: string;
		company: string;
		dateRange: string;
		bullets: string[];
	}>;
	education: {
		degree: string;
		school: string;
		graduationYear: string;
	};
	skills: string;
}

// API endpoint to generate PDF
app.post('/api/generate-pdf', async (req: Request, res: Response) => {
	try {
		const resumeData: ResumeData = req.body;
		
		// Generate HTML from resume data
		const html = generateResumeHTML(resumeData);
		
		// Convert HTML to PDF using Puppeteer
		const browser = await puppeteer.launch({
			headless: 'new',
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		});
		
		const page = await browser.newPage();
		await page.setContent(html, { waitUntil: 'networkidle0' });
		
		const pdf = await page.pdf({
			format: 'A4',
			margin: {
				top: '20px',
				right: '20px',
				bottom: '20px',
				left: '20px'
			}
		});
		
		await browser.close();
		
		// Send PDF as response
		res.contentType('application/pdf');
		res.send(pdf);
	} catch (error) {
		console.error('Error generating PDF:', error);
		res.status(500).json({ error: 'Failed to generate PDF' });
	}
});

// Endpoint to get resume as HTML
app.post('/api/generate-html', (req: Request, res: Response) => {
	try {
		const resumeData: ResumeData = req.body;
		const html = generateResumeHTML(resumeData);
		res.contentType('text/html');
		res.send(html);
	} catch (error) {
		console.error('Error generating HTML:', error);
		res.status(500).json({ error: 'Failed to generate HTML' });
	}
});

function generateResumeHTML(data: ResumeData): string {
	const emailSpan = data.email ? '<span>Email: ' + escapeHtml(data.email) + '</span>' : '';
	const phoneSpan = data.phone ? '<span>Phone: ' + escapeHtml(data.phone) + '</span>' : '';
	const locationSpan = data.location ? '<span>Location: ' + escapeHtml(data.location) + '</span>' : '';
	
	const linksArray = [];
	if (data.website) linksArray.push('<a href="' + escapeHtml(data.website) + '" target="_blank">Website</a>');
	if (data.linkedin) linksArray.push('<a href="' + escapeHtml(data.linkedin) + '" target="_blank">LinkedIn</a>');
	if (data.github) linksArray.push('<a href="' + escapeHtml(data.github) + '" target="_blank">GitHub</a>');
	if (data.portfolio) linksArray.push('<a href="' + escapeHtml(data.portfolio) + '" target="_blank">Portfolio</a>');
	const profileLinksSpan = linksArray.length > 0 ? '<div class="profile-links">' + linksArray.join(' | ') + '</div>' : '';
	
	const summarySection = data.summary ? 
		'<section>' +
		'<div class="section-title">Professional Summary</div>' +
		'<div class="section-content">' + escapeHtml(data.summary) + '</div>' +
		'</section>' : '';
	
	const experienceSection = (data.experience && data.experience.length > 0) ?
		'<section>' +
		'<div class="section-title">Experience</div>' +
		'<div class="section-content">' +
		data.experience.map((exp: any) => {
			let expHTML = '<div class="entry">' +
				'<div class="entry-header">' +
				'<span class="entry-title">' + escapeHtml(exp.jobTitle) + '</span>' +
				'<span class="entry-meta">' + escapeHtml(exp.dateRange) + '</span>' +
				'</div>' +
				'<div class="entry-meta">' + escapeHtml(exp.company) + '</div>';
			if (exp.bullets && exp.bullets.length > 0) {
				expHTML += '<ul style="margin: 4px 0 0 16px; padding: 0;">';
				exp.bullets.forEach((bullet: string) => {
					expHTML += '<li style="margin: 2px 0; font-size: 10px;">' + escapeHtml(bullet) + '</li>';
				});
				expHTML += '</ul>';
			}
			expHTML += '</div>';
			return expHTML;
		}).join('') +
		'</div>' +
		'</section>' : '';
	
	const educationSection = (data.education.degree || data.education.school) ?
		'<section>' +
		'<div class="section-title">Education</div>' +
		'<div class="section-content">' +
		'<div class="entry">' +
		'<div class="entry-header">' +
		'<span class="entry-title">' + escapeHtml(data.education.degree) + '</span>' +
		'<span class="entry-meta">' + escapeHtml(data.education.graduationYear) + '</span>' +
		'</div>' +
		'<div class="entry-meta">' + escapeHtml(data.education.school) + '</div>' +
		'</div>' +
		'</div>' +
		'</section>' : '';
	
	const skillsSection = data.skills ?
		'<section>' +
		'<div class="section-title">Skills</div>' +
		'<div class="section-content">' +
		'<div class="skills-list">' +
		data.skills.split(',').map(skill => 
			'<span class="skill-badge">' + escapeHtml(skill.trim()) + '</span>'
		).join('') +
		'</div>' +
		'</div>' +
		'</section>' : '';

	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Resume - ${data.fullName}</title>
	<style>
		* {
			margin: 0;
			padding: 0;
			box-sizing: border-box;
		}
		
		body {
			font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
			color: #333;
			line-height: 1.6;
			background: white;
			padding: 0;
		}
		
		.container {
			max-width: 8.5in;
			height: 11in;
			margin: 0 auto;
			padding: 0.5in;
			background: white;
		}
		
		header {
			text-align: center;
			margin-bottom: 20px;
			border-bottom: 2px solid #007acc;
			padding-bottom: 10px;
		}
		
		.name {
			font-size: 28px;
			font-weight: bold;
			color: #007acc;
			margin-bottom: 5px;
		}
		
		.contact-info {
			font-size: 11px;
			color: #666;
			display: flex;
			justify-content: center;
			gap: 15px;
			flex-wrap: wrap;
		}
		
		.contact-info span {
			display: inline-block;
		}
		
		.profile-links {
			font-size: 10px;
			margin-top: 5px;
		}
		
		.profile-links a {
			color: #007acc;
			text-decoration: none;
			margin: 0 3px;
		}
		
		.profile-links a:hover {
			text-decoration: underline;
		}
		
		section {
			margin-bottom: 15px;
		}
		
		.section-title {
			font-size: 12px;
			font-weight: bold;
			text-transform: uppercase;
			color: white;
			background: #007acc;
			padding: 5px 8px;
			margin-bottom: 8px;
			letter-spacing: 1px;
		}
		
		.section-content {
			font-size: 11px;
			line-height: 1.5;
		}
		
		.entry {
			margin-bottom: 12px;
		}
		
		.entry-header {
			display: flex;
			justify-content: space-between;
			margin-bottom: 2px;
		}
		
		.entry-title {
			font-weight: bold;
			font-size: 11px;
		}
		
		.entry-meta {
			font-style: italic;
			color: #666;
			font-size: 10px;
		}
		
		.entry-description {
			margin-top: 4px;
			font-size: 10px;
			color: #555;
		}
		
		.skills-list {
			display: flex;
			flex-wrap: wrap;
			gap: 8px;
			font-size: 10px;
		}
		
		.skill-badge {
			background: #e8f4f8;
			color: #007acc;
			padding: 3px 8px;
			border-radius: 3px;
			border: 1px solid #007acc;
		}
		
		@media print {
			body {
				margin: 0;
				padding: 0;
			}
			.container {
				max-width: 100%;
				height: 100%;
				padding: 0.5in;
				margin: 0;
			}
		}
	</style>
</head>
<body>
	<div class="container">
		<header>
			<div class="name">${escapeHtml(data.fullName)}</div>
			<div class="contact-info">
				${emailSpan}
				${phoneSpan}
				${locationSpan}
			</div>
			${profileLinksSpan}
		</header>
		${summarySection}
		${experienceSection}
		${educationSection}
		${skillsSection}
	</div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
	const map: { [key: string]: string } = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, m => map[m]);
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
	res.json({ status: 'ok' });
});

app.listen(PORT, () => {
	console.log('Resume Generator server running on http://localhost:' + PORT);
});
