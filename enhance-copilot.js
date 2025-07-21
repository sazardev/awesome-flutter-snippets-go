#!/usr/bin/env node

/**
 * 🤖 COPILOT INTELLIGENCE ENHANCER
 * 
 * This script analyzes our snippets and generates intelligent context
 * for GitHub Copilot to understand our patterns better.
 */

const fs = require('fs');
const path = require('path');

console.log('🤖 ENHANCING COPILOT INTELLIGENCE...\n');

const snippetsDir = './snippets';
const files = fs.readdirSync(snippetsDir).filter(f => f.endsWith('.code-snippets'));

// Intelligence data structure
const intelligence = {
  totalSnippets: 0,
  categories: {},
  patterns: {},
  triggers: {},
  contextualMappings: {},
  fileNamePatterns: {},
  importTriggers: {},
  semanticPatterns: {}
};

// Analyze each snippet file
files.forEach(file => {
  const filePath = path.join(snippetsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  try {
    const snippets = JSON.parse(content);
    const snippetNames = Object.keys(snippets);
    const categoryName = file.replace('.code-snippets', '');
    
    intelligence.totalSnippets += snippetNames.length;
    intelligence.categories[categoryName] = {
      count: snippetNames.length,
      snippets: snippetNames,
      prefixes: []
    };
    
    // Extract patterns and triggers
    Object.entries(snippets).forEach(([name, snippet]) => {
      const prefix = snippet.prefix;
      const description = snippet.description || '';
      const body = snippet.body ? snippet.body.join('\\n') : '';
      
      // Collect prefixes
      intelligence.categories[categoryName].prefixes.push(prefix);
      
      // Pattern analysis
      const prefixPattern = prefix.split('-')[0] + '-';
      if (!intelligence.patterns[prefixPattern]) {
        intelligence.patterns[prefixPattern] = [];
      }
      intelligence.patterns[prefixPattern].push({
        name,
        prefix,
        description,
        category: categoryName
      });
      
      // Trigger analysis
      const keywords = extractKeywords(description + ' ' + body);
      keywords.forEach(keyword => {
        if (!intelligence.triggers[keyword]) {
          intelligence.triggers[keyword] = [];
        }
        intelligence.triggers[keyword].push(prefix);
      });
      
      // File name pattern analysis
      analyzeFileNamePatterns(body, prefix, intelligence);
      
      // Import trigger analysis  
      analyzeImportTriggers(body, prefix, intelligence);
      
      // Semantic pattern analysis
      analyzeSemanticPatterns(description, body, prefix, intelligence);
    });
    
  } catch (error) {
    console.log(`❌ Error processing ${file}: ${error.message}`);
  }
});

// Generate contextual mappings
generateContextualMappings(intelligence);

// Output intelligence report
console.log('📊 COPILOT INTELLIGENCE REPORT:');
console.log(`📈 Total snippets analyzed: ${intelligence.totalSnippets}`);
console.log(`🗂️  Categories found: ${Object.keys(intelligence.categories).length}`);
console.log(`🎯 Pattern prefixes: ${Object.keys(intelligence.patterns).length}`);
console.log(`🔍 Semantic triggers: ${Object.keys(intelligence.triggers).length}`);

// Save intelligence data
const intelligenceOutput = {
  metadata: {
    generatedAt: new Date().toISOString(),
    version: '1.0.0',
    totalSnippets: intelligence.totalSnippets
  },
  ...intelligence,
  copilotEnhancement: {
    autoTriggers: generateAutoTriggers(intelligence),
    contextualSuggestions: generateContextualSuggestions(intelligence),
    patternChains: generatePatternChains(intelligence),
    smartCompletions: generateSmartCompletions(intelligence)
  }
};

fs.writeFileSync('./copilot-intelligence.json', JSON.stringify(intelligenceOutput, null, 2));

console.log('\\n✅ Intelligence data saved to copilot-intelligence.json');
console.log('🚀 Copilot enhancement complete!');

// Helper functions
function extractKeywords(text) {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
  
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\\s]/g, ' ')
    .split(/\\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word))
    .filter((word, index, arr) => arr.indexOf(word) === index)
    .slice(0, 10); // Limit to top 10 keywords
}

function analyzeFileNamePatterns(body, prefix, intelligence) {
  const filePatterns = [
    { pattern: /class\\s+(\\w+)Entity/, type: 'entity' },
    { pattern: /class\\s+(\\w+)Bloc/, type: 'bloc' },
    { pattern: /class\\s+(\\w+)Provider/, type: 'provider' },
    { pattern: /class\\s+(\\w+)Page/, type: 'page' },
    { pattern: /class\\s+(\\w+)Widget/, type: 'widget' },
    { pattern: /class\\s+(\\w+)Repository/, type: 'repository' },
    { pattern: /class\\s+(\\w+)UseCase/, type: 'usecase' },
    { pattern: /class\\s+(\\w+)Service/, type: 'service' }
  ];
  
  filePatterns.forEach(({ pattern, type }) => {
    if (pattern.test(body)) {
      if (!intelligence.fileNamePatterns[type]) {
        intelligence.fileNamePatterns[type] = [];
      }
      intelligence.fileNamePatterns[type].push(prefix);
    }
  });
}

function analyzeImportTriggers(body, prefix, intelligence) {
  const importPatterns = [
    { pattern: /flutter_bloc/, trigger: 'bloc-imports' },
    { pattern: /provider/, trigger: 'provider-imports' },
    { pattern: /riverpod/, trigger: 'riverpod-imports' },
    { pattern: /dartz/, trigger: 'clean-arch-imports' },
    { pattern: /injectable/, trigger: 'di-imports' },
    { pattern: /get_it/, trigger: 'getit-imports' }
  ];
  
  importPatterns.forEach(({ pattern, trigger }) => {
    if (pattern.test(body)) {
      if (!intelligence.importTriggers[trigger]) {
        intelligence.importTriggers[trigger] = [];
      }
      intelligence.importTriggers[trigger].push(prefix);
    }
  });
}

function analyzeSemanticPatterns(description, body, prefix, intelligence) {
  const semanticPatterns = [
    { keywords: ['state', 'management'], category: 'state-management' },
    { keywords: ['clean', 'architecture'], category: 'clean-architecture' },
    { keywords: ['material', 'design'], category: 'material-design' },
    { keywords: ['responsive', 'layout'], category: 'responsive-design' },
    { keywords: ['navigation', 'route'], category: 'navigation' },
    { keywords: ['form', 'validation'], category: 'forms' },
    { keywords: ['animation', 'transition'], category: 'animations' }
  ];
  
  const text = (description + ' ' + body).toLowerCase();
  
  semanticPatterns.forEach(({ keywords, category }) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      if (!intelligence.semanticPatterns[category]) {
        intelligence.semanticPatterns[category] = [];
      }
      intelligence.semanticPatterns[category].push(prefix);
    }
  });
}

function generateContextualMappings(intelligence) {
  intelligence.contextualMappings = {
    'create user': ['clean-entity', 'clean-usecase-create', 'clean-dto'],
    'state management': ['flb-bloc-complete', 'flp-provider', 'flr-provider'],
    'form validation': ['flf-form', 'flf-validator'],
    'navigation': ['fln-bottom', 'fln-drawer', 'flb-nav'],
    'api integration': ['clean-http-datasource', 'clean-repo-impl'],
    'dependency injection': ['clean-getit-setup', 'clean-injectable-module'],
    'responsive design': ['flr-builder', 'flr-layout', 'flr-breakpoints'],
    'material design': ['flm3-card', 'flm3-button', 'flm3-theme']
  };
}

function generateAutoTriggers(intelligence) {
  return {
    classDeclarations: {
      'Entity': 'clean-entity',
      'Bloc': 'flb-bloc-complete', 
      'Provider': 'flp-provider',
      'Page': 'flp-home',
      'Widget': 'flw-container'
    },
    importStatements: {
      'flutter_bloc': ['flb-bloc-complete', 'flb-consumer'],
      'provider': ['flp-provider', 'flp-consumer'],
      'dartz': ['clean-entity', 'clean-usecase-create']
    },
    fileNames: {
      '*_entity.dart': 'clean-entity',
      '*_bloc.dart': 'flb-bloc-complete',
      '*_provider.dart': 'flp-provider',
      '*_page.dart': 'flp-home'
    }
  };
}

function generateContextualSuggestions(intelligence) {
  return {
    afterEntity: ['clean-usecase-create', 'clean-repository'],
    afterUseCase: ['clean-repo-impl', 'clean-http-datasource'],
    afterProvider: ['flp-consumer', 'flp-multi-provider'],
    afterBloc: ['flb-consumer', 'flb-builder']
  };
}

function generatePatternChains(intelligence) {
  return {
    cleanArchitecture: [
      'clean-entity',
      'clean-usecase-create', 
      'clean-repository',
      'clean-repo-impl',
      'clean-http-datasource',
      'clean-getit-setup'
    ],
    stateManagement: [
      'flb-bloc-complete',
      'flb-consumer',
      'flb-builder'
    ],
    uiComponents: [
      'flw-scaffold',
      'flm3-card',
      'fln-bottom',
      'flf-form'
    ]
  };
}

function generateSmartCompletions(intelligence) {
  return {
    when: {
      'user types "bloc"': 'flb-bloc-complete',
      'user types "provider"': 'flp-provider', 
      'user types "entity"': 'clean-entity',
      'user types "usecase"': 'clean-usecase-create',
      'user types "form"': 'flf-form',
      'user types "navigation"': 'fln-bottom'
    },
    context: {
      'in *_bloc.dart file': 'flb-bloc-complete',
      'in *_provider.dart file': 'flp-provider',
      'in *_entity.dart file': 'clean-entity',
      'in *_page.dart file': 'flp-home'
    }
  };
}
