const fs = require('fs');
const path = require('path');

console.log('🔍 ULTRA RIGOROUS SYNTAX VALIDATION WITH ZERO TOLERANCE\n');

const snippetsDir = './snippets';
const files = fs.readdirSync(snippetsDir).filter(f => f.endsWith('.code-snippets'));

let totalErrors = 0;
const allErrors = [];

files.forEach(file => {
  const filePath = path.join(snippetsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  console.log(`📄 ANALYZING ${file}:`);
  let fileErrors = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    const issues = [];
    
    // Critical Error 1: Unescaped } in onTap callbacks
    if (line.includes('onTap: () {') && line.includes('},')) {
      issues.push('❌ CRITICAL: Unescaped } in onTap callback - should use \\}');
    }
    
    // Critical Error 2: Missing closing quotes before },
    if (line.match(/Text\('[^']*\$\{[^}]*\}[^']*'\),\}/)) {
      issues.push('❌ CRITICAL: Missing quote escape in Text with interpolation');
    }
    
    // Critical Error 3: Single escape when double needed
    if (line.includes('${index + 1}') && !line.includes('\\${index + 1\\}')) {
      if (line.includes('Text(')) {
        issues.push('❌ CRITICAL: Single escape in Text - needs double escape \\\\${...\\\\}');
      }
    }
    
    // Critical Error 4: Malformed Text interpolation
    if (line.match(/Text\('[^']*\$\{[^}]*\}[^']*'\),\}/)) {
      issues.push('❌ CRITICAL: Malformed Text interpolation with trailing },');
    }
    
    // Critical Error 5: Missing } closing - check next few lines
    if (line.includes('onTap: () {')) {
      let found = false;
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        if (lines[j].includes('\\},') || lines[j].includes('},')) {
          found = true;
          break;
        }
      }
      if (!found) {
        issues.push('❌ CRITICAL: Missing } for onTap callback');
      }
    }
    
    if (issues.length > 0) {
      console.log(`  ❌ Line ${lineNum}: ${issues.join(', ')}`);
      console.log(`     ${line.trim()}`);
      fileErrors++;
      totalErrors++;
      allErrors.push({ file, line: lineNum, issues, content: line.trim() });
    }
  }
  
  // JSON Validation
  try {
    JSON.parse(content);
    if (fileErrors === 0) {
      console.log(`  ✅ PERFECT SYNTAX`);
    } else {
      console.log(`  ⚠️  JSON valid but ${fileErrors} critical issues found`);
    }
  } catch (error) {
    console.log(`  💥 INVALID JSON: ${error.message}`);
    totalErrors++;
    allErrors.push({ file, line: 'JSON', issues: ['Invalid JSON'], content: error.message });
  }
  
  console.log('');
});

console.log(`\n🎯 ULTRA-STRICT ANALYSIS COMPLETE:`);
console.log(`📊 Total issues found: ${totalErrors}`);

if (totalErrors === 0) {
  console.log('🎉 PERFECTION ACHIEVED! ALL FILES ARE FLAWLESS! 🎉');
} else {
  console.log('\n🚨 ISSUES REQUIRING IMMEDIATE ATTENTION:');
  allErrors.forEach((error, i) => {
    console.log(`${i + 1}. ${error.file}:${error.line} - ${error.issues.join(', ')}`);
    console.log(`   Code: ${error.content}`);
  });
  
  console.log('\n💡 FIXES NEEDED:');
  console.log('1. Replace } with \\} in onTap callbacks');
  console.log('2. Use \\\\${...\\\\} for Text interpolation');
  console.log('3. Ensure all quotes are properly closed');
  console.log('4. Validate JSON structure');
}
