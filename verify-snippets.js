#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const snippetsDir = 'c:\\Users\\cerbe\\Documents\\vscode\\awesome-flutter-snippets-go\\snippets';

console.log('🔍 VERIFICANDO SINTAXIS DE SNIPPETS...\n');

// Obtener todos los archivos .code-snippets
const files = fs.readdirSync(snippetsDir).filter(file => file.endsWith('.code-snippets'));

let totalErrors = 0;
let totalSnippets = 0;

files.forEach(file => {
  const filePath = path.join(snippetsDir, file);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const snippets = JSON.parse(content);
    
    console.log(`✅ ${file} - JSON válido`);
    
    // Contar snippets
    const snippetCount = Object.keys(snippets).length;
    totalSnippets += snippetCount;
    console.log(`   📝 ${snippetCount} snippets encontrados`);
    
    // Verificar cada snippet
    Object.entries(snippets).forEach(([name, snippet]) => {
      if (!snippet.prefix) {
        console.log(`   ⚠️  "${name}" - No tiene prefix`);
        totalErrors++;
      }
      if (!snippet.body || !Array.isArray(snippet.body)) {
        console.log(`   ⚠️  "${name}" - Body inválido`);
        totalErrors++;
      }
      
      // Verificar escapes problemáticos
      if (snippet.body) {
        snippet.body.forEach((line, index) => {
          // Verificar comillas sin cerrar en interpolaciones
          if (line.includes("'${") && !line.includes("'},")) {
            // Esto podría ser un problema
            const matches = line.match(/'[^']*\$\{[^}]*\}[^']*$/);
            if (matches) {
              console.log(`   🔍 "${name}" línea ${index + 1}: Posible comilla sin cerrar: ${line.trim()}`);
            }
          }
          
          // Verificar llaves sin escapar
          if (line.includes("${") && !line.includes("\\${")) {
            const placeholderMatches = line.match(/\$\{\d+:/g);
            const interpolationMatches = line.match(/\$\{[a-zA-Z_]/g);
            if (interpolationMatches && !placeholderMatches) {
              console.log(`   🔍 "${name}" línea ${index + 1}: Posible interpolación sin escapar: ${line.trim()}`);
            }
          }
        });
      }
    });
    
    console.log('');
    
  } catch (error) {
    console.log(`❌ ${file} - Error: ${error.message}`);
    totalErrors++;
  }
});

console.log('📊 RESUMEN:');
console.log(`   Archivos procesados: ${files.length}`);
console.log(`   Total snippets: ${totalSnippets}`);
console.log(`   Errores encontrados: ${totalErrors}`);

if (totalErrors === 0) {
  console.log('\n🎉 ¡TODOS LOS SNIPPETS ESTÁN CORRECTOS!');
} else {
  console.log(`\n⚠️  Se encontraron ${totalErrors} posibles problemas`);
}
