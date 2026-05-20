import fs from 'fs';

const content = fs.readFileSync('frontend/src/pages/Home.jsx', 'utf8');
const lines = content.split('\n');

lines.forEach((line, i) => {
  if (line.toLowerCase().includes('agriai') || line.toLowerCase().includes('advisory')) {
    console.log(`${i + 1}: ${line.trim()}`);
  }
});
