import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

export function activate(context: vscode.ExtensionContext) {
	console.log('Resume Generator extension is now active!');

	// Command to open the resume builder
	let disposable = vscode.commands.registerCommand('resume-generator.openResumeBuilder', () => {
		openResumeBuilder(context);
	});

	context.subscriptions.push(disposable);

	// Show welcome message
	vscode.window.showInformationMessage('Resume Generator is ready! Use "Open Resume Builder" command to get started.');
}

function openResumeBuilder(context: vscode.ExtensionContext) {
	const panel = vscode.window.createWebviewPanel(
		'resumeBuilder',
		'Resume Builder',
		vscode.ViewColumn.One,
		{
			enableScripts: true,
			localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
		}
	);

	const mediaPath = vscode.Uri.file(path.join(context.extensionPath, 'media'));
	const mediaUri = panel.webview.asWebviewUri(mediaPath);

	panel.webview.html = getWebviewContent(mediaUri);

	// Handle messages from the webview
	panel.webview.onDidReceiveMessage(
		async (message: any) => {
			switch (message.command) {
				case 'generatePDF':
					vscode.window.showInformationMessage('Generating PDF...');
					// Call backend API to generate PDF
					try {
						const response = await fetch('http://localhost:3000/api/generate-pdf', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(message.resumeData)
						});
						
						// Get PDF as arraybuffer
						const arrayBuffer = await response.arrayBuffer();
						const buffer = Buffer.from(arrayBuffer);
						
						// Generate filename with timestamp
						const timestamp = new Date().toISOString().slice(0, 10);
						const fullName = message.resumeData.fullName || 'Resume';
						const filename = `${fullName}_Resume_${timestamp}.pdf`;
						
						// Save to Downloads folder
						const downloadsPath = path.join(os.homedir(), 'Downloads');
						const filepath = path.join(downloadsPath, filename);
						
						// Ensure Downloads folder exists
						if (!fs.existsSync(downloadsPath)) {
							fs.mkdirSync(downloadsPath, { recursive: true });
						}
						
						// Write PDF to file
						fs.writeFileSync(filepath, buffer);
						
						// Open the PDF file
						await vscode.env.openExternal(vscode.Uri.file(filepath));
						
						vscode.window.showInformationMessage(`✅ Resume saved to: ${filepath}`);
					} catch (error) {
						vscode.window.showErrorMessage('Failed to generate PDF: ' + error);
					}
					break;
			}
		},
		undefined,
		context.subscriptions
	);
}

function getWebviewContent(mediaUri: vscode.Uri): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Resume Builder</title>
	<style>
		* { margin: 0; padding: 0; box-sizing: border-box; }
		body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background: #f5f5f5; padding: 20px; }
		.container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
		.form-section { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
		.preview-section { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
		h1 { font-size: 24px; margin-bottom: 20px; color: #333; }
		h2 { font-size: 18px; margin-top: 20px; margin-bottom: 10px; color: #555; border-bottom: 2px solid #007acc; padding-bottom: 5px; }
		.form-group { margin-bottom: 15px; }
		label { display: block; margin-bottom: 5px; font-weight: 500; color: #333; }
		input, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-family: inherit; }
		input:focus, textarea:focus { outline: none; border-color: #007acc; box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.1); }
		textarea { resize: vertical; min-height: 80px; }
		button { background: #007acc; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; margin-top: 10px; }
		button:hover { background: #005a9e; }
		.resume-preview { background: #f9f9f9; padding: 40px; border: 1px solid #ddd; min-height: 600px; font-size: 12px; line-height: 1.6; }
		.resume-header { text-align: center; margin-bottom: 20px; }
		.resume-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
		.resume-contact { font-size: 11px; color: #666; }
		.resume-section { margin-bottom: 15px; }
		.resume-section-title { font-weight: bold; border-bottom: 1px solid #333; margin-bottom: 8px; }\n\t\t.resume-links { font-size: 10px; margin-top: 5px; }\n\t\t.resume-links a { color: #007acc; text-decoration: none; margin: 0 4px; }
	</style>
</head>
<body>
	<div class="container">
		<div class="form-section">
			<h1>Resume Builder</h1>
			<h2>Personal Information</h2>
			<div class="form-group"><label>Full Name</label><input type="text" id="fullName" placeholder="John Doe" required></div>
			<div class="form-group"><label>Email</label><input type="email" id="email" placeholder="john@example.com" required></div>
			<div class="form-group"><label>Phone</label><input type="tel" id="phone" placeholder="(555) 123-4567"></div>
			<div class="form-group"><label>Location</label><input type="text" id="location" placeholder="City, State"></div>
			<h2>Profile Links & Website</h2>
			<div class="form-group"><label>Personal Website</label><input type="url" id="website" placeholder="https://yourwebsite.com"></div>
			<div class="form-group"><label>LinkedIn Profile</label><input type="url" id="linkedin" placeholder="https://linkedin.com/in/yourprofile"></div>
			<div class="form-group"><label>GitHub Profile</label><input type="url" id="github" placeholder="https://github.com/yourprofile"></div>
			<div class="form-group"><label>Portfolio</label><input type="url" id="portfolio" placeholder="https://portfolio.yoursite.com"></div>
			<h2>Professional Summary</h2>
			<div class="form-group"><textarea id="summary" placeholder="Brief overview of your professional background..."></textarea></div>
			<h2>Experience</h2>
			<div id="experienceContainer">
				<div class="experience-entry" data-experience-id="0">
					<div class="form-group"><label>Job Title</label><input type="text" class="job-title" placeholder="Senior Developer"></div>
					<div class="form-group"><label>Company</label><input type="text" class="company" placeholder="Tech Company"></div>
					<div class="form-group"><label>Date Range</label><input type="text" class="date-range" placeholder="Jan 2020 - Present"></div>
					<div class="form-group"><label>Key Responsibilities &amp; Achievements (one per line)</label><textarea class="job-bullets" placeholder="Led development of new features&#10;Improved performance by 50%&#10;Mentored junior developers"></textarea></div>
					<button type="button" class="remove-experience" data-experience-id="0" style="background: #dc3545; margin-top: 10px;">Remove</button>
				</div>
			</div>
			<button type="button" id="addExperienceBtn">+ Add Another Job</button>
			<h2>Education</h2>
			<div class="form-group"><label>Degree</label><input type="text" id="degree" placeholder="Bachelor of Science"></div>
			<div class="form-group"><label>School/University</label><input type="text" id="school" placeholder="University Name"></div>
			<div class="form-group"><label>Graduation Year</label><input type="text" id="graduationYear" placeholder="2020"></div>
			<h2>Skills</h2>
			<div class="form-group"><label>Skills (comma-separated)</label><textarea id="skills" placeholder="JavaScript, React, Node.js, Python..."></textarea></div>
			<button onclick="exportPDF()">Export as PDF</button>
		</div>
		<div class="preview-section">
			<h1>Preview</h1>
			<div class="resume-preview" id="resumePreview">
				<div class="resume-header">
					<div class="resume-name" id="previewName">Your Name</div>
					<div class="resume-contact"><span id="previewEmail">email@example.com</span> • <span id="previewPhone">(555) 123-4567</span> • <span id="previewLocation">City, State</span></div>
					<div class="resume-links" id="previewLinks" style="display:none; margin-top: 8px; font-size: 10px;"></div>
				</div>
				<div class="resume-section" id="summarySection" style="display:none;"><div class="resume-section-title">PROFESSIONAL SUMMARY</div><div id="previewSummary"></div></div>
				<div class="resume-section" id="experienceSection" style="display:none;"><div class="resume-section-title">EXPERIENCE</div><div id="previewExperience"></div></div>
				<div class="resume-section" id="educationSection" style="display:none;"><div class="resume-section-title">EDUCATION</div><div id="previewEducation"></div></div>
				<div class="resume-section" id="skillsSection" style="display:none;"><div class="resume-section-title">SKILLS</div><div id="previewSkills"></div></div>
			</div>
		</div>
	</div>
	<script>
		const vscode = acquireVsCodeApi();
		let experienceCount = 1;
		document.addEventListener('input', updatePreview);
		document.addEventListener('change', updatePreview);
		function addExperience() {
			const container = document.getElementById('experienceContainer');
			const id = experienceCount++;
			const entry = document.createElement('div');
			entry.className = 'experience-entry';
			entry.setAttribute('data-experience-id', id);
			entry.innerHTML = '<div class="form-group"><label>Job Title</label><input type="text" class="job-title" placeholder="Senior Developer"></div><div class="form-group"><label>Company</label><input type="text" class="company" placeholder="Tech Company"></div><div class="form-group"><label>Date Range</label><input type="text" class="date-range" placeholder="Jan 2020 - Present"></div><div class="form-group"><label>Key Responsibilities</label><textarea class="job-bullets" placeholder="Led development of new features&#10;Improved performance by 50%&#10;Mentored junior developers"></textarea></div><button type="button" class="remove-experience" data-experience-id="' + id + '" style="background: #dc3545; margin-top: 10px;">Remove</button>';
			container.appendChild(entry);
			updatePreview();
		}
		function removeExperience(id) {
			const entry = document.querySelector('[data-experience-id="' + id + '"]');
			if (entry) { entry.remove(); updatePreview(); }
		}
		function getExperiences() {
			const exps = [];
			document.querySelectorAll('.experience-entry').forEach((entry) => {
				const title = entry.querySelector('.job-title').value;
				const company = entry.querySelector('.company').value;
				const range = entry.querySelector('.date-range').value;
				const bullets = entry.querySelector('.job-bullets').value;
				if (title || company || bullets) {
					exps.push({ jobTitle: title, company: company, dateRange: range, bullets: bullets.split('\\n').filter(b => b.trim()).map(b => b.trim().replace(/^[\\s•*-]+/, '')) });
				}
			});
			return exps;
		}
		function updatePreview() {
			const fullName = document.getElementById('fullName').value || 'Your Name';
			const email = document.getElementById('email').value || 'email@example.com';
			const phone = document.getElementById('phone').value || '(555) 123-4567';
			const location = document.getElementById('location').value || 'City, State';
			const website = document.getElementById('website').value;
			const linkedin = document.getElementById('linkedin').value;
			const github = document.getElementById('github').value;
			const portfolio = document.getElementById('portfolio').value;
			const summary = document.getElementById('summary').value;
			const degree = document.getElementById('degree').value;
			const school = document.getElementById('school').value;
			const gradYear = document.getElementById('graduationYear').value;
			const skills = document.getElementById('skills').value;
			const exps = getExperiences();
			document.getElementById('previewName').textContent = fullName;
			document.getElementById('previewEmail').textContent = email;
			document.getElementById('previewPhone').textContent = phone;
			document.getElementById('previewLocation').textContent = location;
			const linksHtml = [];
			if (website) linksHtml.push('<a href="' + website + '" target="_blank">Website</a>');
			if (linkedin) linksHtml.push('<a href="' + linkedin + '" target="_blank">LinkedIn</a>');
			if (github) linksHtml.push('<a href="' + github + '" target="_blank">GitHub</a>');
			if (portfolio) linksHtml.push('<a href="' + portfolio + '" target="_blank">Portfolio</a>');
			const linksContainer = document.getElementById('previewLinks');
			if (linksHtml.length > 0) {
				linksContainer.innerHTML = linksHtml.join(' • ');
				linksContainer.style.display = 'block';
			} else {
				linksContainer.style.display = 'none';
			}
			const sumSec = document.getElementById('summarySection');
			if (summary) { sumSec.style.display = 'block'; document.getElementById('previewSummary').textContent = summary; } else { sumSec.style.display = 'none'; }
			const expSec = document.getElementById('experienceSection');
			if (exps.length > 0) {
				expSec.style.display = 'block';
				let html = '';
				exps.forEach(exp => {
					html += '<div style="margin-bottom: 12px;"><strong>' + exp.jobTitle + '</strong> at ' + exp.company + '<br><em>' + exp.dateRange + '</em>';
					if (exp.bullets.length > 0) {
						html += '<ul style="margin: 5px 0 0 20px; padding: 0;">';
						exp.bullets.forEach(bullet => { html += '<li>' + bullet + '</li>'; });
						html += '</ul>';
					}
					html += '</div>';
				});
				document.getElementById('previewExperience').innerHTML = html;
			} else { expSec.style.display = 'none'; }
			const eduSec = document.getElementById('educationSection');
			if (degree || school) { eduSec.style.display = 'block'; document.getElementById('previewEducation').innerHTML = '<div><strong>' + degree + '</strong> from ' + school + '<br><em>Graduated ' + gradYear + '</em></div>'; } else { eduSec.style.display = 'none'; }
			const skillSec = document.getElementById('skillsSection');
			if (skills) { skillSec.style.display = 'block'; document.getElementById('previewSkills').textContent = skills; } else { skillSec.style.display = 'none'; }
		}
		function exportPDF() {
			const exps = getExperiences();
			const data = {
				fullName: document.getElementById('fullName').value,
				email: document.getElementById('email').value,
				phone: document.getElementById('phone').value,
				location: document.getElementById('location').value,
				website: document.getElementById('website').value,
				linkedin: document.getElementById('linkedin').value,
				github: document.getElementById('github').value,
				portfolio: document.getElementById('portfolio').value,
				summary: document.getElementById('summary').value,
				experience: exps,
				education: { degree: document.getElementById('degree').value, school: document.getElementById('school').value, graduationYear: document.getElementById('graduationYear').value },
				skills: document.getElementById('skills').value
			};
			vscode.postMessage({ command: 'generatePDF', resumeData: data });
		}
		document.getElementById('addExperienceBtn').addEventListener('click', addExperience);
		document.addEventListener('click', (e) => { if (e.target.classList.contains('remove-experience')) { removeExperience(e.target.getAttribute('data-experience-id')); } });
		updatePreview();
	</script>
</body>
</html>`;
}

export function deactivate() {}
