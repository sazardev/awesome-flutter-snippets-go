const fs = require('fs');
const path = require('path');

console.log('🔍 SCANNING FOR SYNTAX ERRORS WITH ZERO TOLERANCE...\n');

const snippetsDir = './snippets';
const files = fs.readdirSync(snippetsDir).filter(f => f.endsWith('.code-snippets'));

let totalErrors = 0;

files.forEach(file => {
  const filePath = path.join(snippetsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let fileErrors = 0;
  
  console.log(`📄 Checking ${file}:`);
  
  // Split into lines for detailed analysis
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    
    // Check for common syntax errors
    const issues = [];
    
    // Error 1: '${...}'}), should be '${...}'),
    if (line.includes("'}),")) {
      issues.push(`Malformed string with extra quote: '}}),`);
    }
    
    // Error 2: Mixed quotes in placeholders
    if (line.match(/Text\('\$\{[^}]*'[^}]*\}'\)/)) {
      issues.push(`Mixed quotes in Text placeholder`);
    }
    
    // Error 3: Unescaped $ in strings 
    if (line.match(/Text\('[^']*\$\{[^}]*\}[^']*'\)/) && !line.includes('\\$')) {
      // This is actually correct for interpolation, skip
    }
    
    // Error 4: Trailing },} 
    if (line.includes('},}')) {
      issues.push(`Trailing },} pattern`);
    }
    
    if (issues.length > 0) {
      console.log(`  ❌ Line ${lineNum}: ${issues.join(', ')}`);
      console.log(`     ${line.trim()}`);
      fileErrors++;
      totalErrors++;
    }
  }
  
  // Try to parse as JSON
  try {
    JSON.parse(content);
    if (fileErrors === 0) {
      console.log(`  ✅ Valid JSON syntax`);
    } else {
      console.log(`  ⚠️  JSON is valid but found ${fileErrors} potential issues`);
    }
  } catch (error) {
    console.log(`  💥 INVALID JSON: ${error.message}`);
    totalErrors++;
  }
  
  console.log('');
});

console.log(`\n🎯 SUMMARY: Found ${totalErrors} total issues across all files`);

if (totalErrors === 0) {
  console.log('🎉 ALL FILES HAVE PERFECT SYNTAX! 🎉');
} else {
  console.log('🚨 ISSUES FOUND - MANUAL CORRECTION NEEDED 🚨');
}
