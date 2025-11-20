// backend/src/utils/resumeParser.js  ← FINAL WORKING VERSION (Cloudinary Compatible)

const pdfParse = require('pdf-parse');
const textract = require('textract');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');

const SKILLS_DB = [
  'javascript', 'react', 'node.js', 'express', 'mongodb', 'mysql', 'postgresql',
  'python', 'java', 'typescript', 'angular', 'vue', 'next.js', 'aws', 'docker',
  'kubernetes', 'git', 'html', 'css', 'tailwind', 'redux', 'graphql', 'prisma', 'mongodb'
];

// This function now works with Cloudinary URLs
const parseResumeFromUrl = async (resumeUrl, originalname) => {
  const ext = path.extname(originalname).toLowerCase();
  const tempPath = path.join(os.tmpdir(), `resume_${Date.now()}${ext}`);

  try {
    // Download file from Cloudinary
    const response = await axios({
      url: resumeUrl,
      method: 'GET',
      responseType: 'arraybuffer', // Important!
      timeout: 30000
    });

    // Save to temp file
    fs.writeFileSync(tempPath, response.data);

    let text = '';

    if (ext === '.pdf') {
      const data = await pdfParse(fs.readFileSync(tempPath));
      text = data.text;
    } else {
      // .doc or .docx
      text = await new Promise((resolve, reject) => {
        textract.fromFileWithPath(tempPath, { preserveLineBreaks: true }, (err, txt) => {
          if (err) reject(err);
          else resolve(txt);
        });
      });
    }

    const lowerText = text.toLowerCase();

    // Extract name, email, phone
    const nameMatch = text.match(/^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}/m);
    const name = nameMatch ? nameMatch[0].trim() : 'Unknown Candidate';

    const emailMatch = text.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const email = emailMatch ? emailMatch[0].toLowerCase() : '';

    const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/);
    const phone = phoneMatch ? phoneMatch[0] : '';

    const extractedSkills = SKILLS_DB.filter(skill =>
      lowerText.includes(skill.toLowerCase())
    );

    return { name, email, phone, extractedSkills };

  } finally {
    // Always clean up
    if (fs.existsSync(tempPath)) {
      try { fs.unlinkSync(tempPath); } catch (e) {}
    }
  }
};

module.exports = { parseResumeFromUrl };