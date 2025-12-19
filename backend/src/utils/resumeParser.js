// utils/resumeParser.js
const pdf = require("pdf-parse");
const fs = require("fs").promises;

async function parseResume(filePath) {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdf(dataBuffer);
    const text = data.text;
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const lowerText = text.toLowerCase();

    // EMAIL
    const emailMatch = text.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
    );
    const email = emailMatch ? emailMatch[0] : "";

    // PHONE
    let phone = "";
    const phonePattern =
      /(\+?91|0)?[-.\s]?\d{10}\b|mobile[:\s]*\+?\d[\d\s\-\(\)]{9,15}/gi;
    const phones = text.match(phonePattern) || [];
    for (let p of phones) {
      const num = p.replace(/[^0-9+]/g, "");
      if (num.length >= 10 && num.length <= 13) {
        phone = num.length === 10 ? "+91 " + num : num;
        break;
      }
    }

    // NAME (first well-formed capitalized name in top 10 lines)
    let name = "Unknown";
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i];
      if (
        line.length > 5 &&
        line.length < 50 &&
        /^[A-Z][a-z]+(?:\s[A-Z][a-z]+){0,4}$/.test(line) &&
        !/(experience|education|skill|github|linkedin|http|resume)/i.test(line)
      ) {
        name = line.trim();
        break;
      }
    }

    // LOCATION (Indian + Global)
    const cities = [
      "bangalore",
      "bengaluru",
      "mumbai",
      "delhi",
      "pune",
      "chennai",
      "hyderabad",
      "kolkata",
      "noida",
      "gurgaon",
      "ahmedabad",
      "kochi",
      "coimbatore",
      "jaipur",
      "indore",
      "mysore",
      "trivandrum",
    ];
    const states = [
      "karnataka",
      "maharashtra",
      "tamil nadu",
      "delhi",
      "gujarat",
      "kerala",
      "telangana",
      "uttar pradesh",
    ];
    let location = "Not mentioned";
    for (const line of lines) {
      const l = line.toLowerCase();
      if (
        l.includes("github") ||
        l.includes("linkedin") ||
        l.includes("http") ||
        l.includes("@")
      )
        continue;
      if (
        cities.some((c) => l.includes(c)) ||
        states.some((s) => l.includes(s)) ||
        l.includes("india")
      ) {
        location = line.replace(/[:\-–—]/g, " ").trim();
        break;
      }
    }

    // SKILLS
    const skillKeywords = new Set([
      "javascript",
      "react",
      "node",
      "python",
      "java",
      "angular",
      "spring",
      "django",
      "flutter",
      "aws",
      "docker",
      "kubernetes",
      "mongodb",
      "sql",
      "mysql",
      "git",
      "html",
      "css",
      "typescript",
      "machine learning",
      "data science",
      "react native",
      "express",
      "firebase",
      "tableau",
      "power bi",
    ]);
    const foundSkills = new Set();
    let inSkillsSection = false;

    for (const line of lines) {
      const l = line.toLowerCase();
      if (/skills?|technical|technologies|proficiency/i.test(l))
        inSkillsSection = true;
      if (inSkillsSection && /experience|education|project/i.test(l)) break;
      if (inSkillsSection || lowerText.includes("skills")) {
        const words = l.split(/[\s,•|\/\-\–\—]+/).map((w) => w.trim());
        for (const word of words) {
          for (const skill of skillKeywords) {
            if (word.includes(skill) || skill.includes(word)) {
              foundSkills.add(skill.charAt(0).toUpperCase() + skill.slice(1));
            }
          }
        }
      }
    }

    return {
      name,
      email,
      phone: phone || "",
      location,
      skills: Array.from(foundSkills),
    };
  } catch (err) {
    console.error("Resume parse failed:", err);
    return {
      name: "Unknown",
      email: "",
      phone: "",
      location: "Not mentioned",
      skills: [],
    };
  }
}

module.exports = parseResume;
