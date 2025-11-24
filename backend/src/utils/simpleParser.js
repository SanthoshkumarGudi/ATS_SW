// backend/src/utils/simpleParser.js
const pdfParse = require('pdf-parse');
const fs = require('fs');

const SKILLS = ['react', 'node', 'javascript', 'python', 'java', 'aws', 'docker', 'mongodb'];

async function parseResume(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    const text = data.text.toLowerCase();

    const foundSkills = SKILLS.filter(skill => text.includes(skill.toLowerCase()));
    const email = text.match(/[\w.-]+@[\w.-]+\.\w+/)?.[0] || 'N/A';
    const name = text.split('\n').find(line => line.match(/^[A-Z][a-z]+(?:\s[A-Z][a-z]+)+$/)) || 'Candidate';

    return { name, email, skills: foundSkills };
  } catch (err) {
    console.error('Parse failed:', err.message);
    return { name: 'Unknown', email: 'N/A', skills: [] };
  }
}

module.exports = parseResume;