const vscode = require('vscode');

/**
 * 🤖 COPILOT INTEGRATION EXTENSION
 * 
 * This module enhances VS Code's intelligence by providing
 * context-aware suggestions and triggers for our Flutter snippets.
 */

class CopilotEnhancer {
  constructor() {
    this.patterns = {
      cleanArchitecture: /clean-|entity|usecase|repository|dto|mapper|datasource|service/i,
      stateManagement: /bloc|cubit|provider|riverpod|setstate|consumer/i,
      uiComponents: /material3|form|navigation|responsive|animation|widget|page/i,
      filePatterns: {
        entity: /_entity\.dart$/,
        bloc: /_bloc\.dart$/,
        provider: /_provider\.dart$/,
        page: /_page\.dart$/,
        repository: /_repository\.dart$/,
        usecase: /_usecase\.dart$/
      }
    };
  }

  /**
   * Analyzes current context and provides intelligent suggestions
   */
  analyzeContext(document, position) {
    const fileName = document.fileName;
    const currentLine = document.lineAt(position.line).text;
    const previousLine = position.line > 0 ? document.lineAt(position.line - 1).text : '';
    
    const context = {
      fileName: fileName,
      currentText: currentLine,
      previousText: previousLine,
      suggestions: []
    };

    // File-based suggestions
    if (this.patterns.filePatterns.entity.test(fileName)) {
      context.suggestions.push('clean-entity');
    } else if (this.patterns.filePatterns.bloc.test(fileName)) {
      context.suggestions.push('flb-bloc-complete');
    } else if (this.patterns.filePatterns.provider.test(fileName)) {
      context.suggestions.push('flp-provider');
    } else if (this.patterns.filePatterns.page.test(fileName)) {
      context.suggestions.push('flp-home');
    }

    // Content-based suggestions
    if (this.patterns.cleanArchitecture.test(currentLine)) {
      context.suggestions.push(...this.getCleanArchitectureSuggestions(currentLine));
    }
    
    if (this.patterns.stateManagement.test(currentLine)) {
      context.suggestions.push(...this.getStateManagementSuggestions(currentLine));
    }

    return context;
  }

  getCleanArchitectureSuggestions(text) {
    const suggestions = [];
    
    if (/entity/i.test(text)) suggestions.push('clean-entity');
    if (/usecase/i.test(text)) suggestions.push('clean-usecase-create');
    if (/repository/i.test(text)) suggestions.push('clean-repo-impl');
    if (/dto/i.test(text)) suggestions.push('clean-dto');
    if (/mapper/i.test(text)) suggestions.push('clean-mapper');
    if (/datasource/i.test(text)) suggestions.push('clean-http-datasource');
    
    return suggestions;
  }

  getStateManagementSuggestions(text) {
    const suggestions = [];
    
    if (/bloc/i.test(text)) suggestions.push('flb-bloc-complete');
    if (/cubit/i.test(text)) suggestions.push('flb-cubit');
    if (/provider/i.test(text)) suggestions.push('flp-provider');
    if (/riverpod/i.test(text)) suggestions.push('flr-provider');
    if (/setstate/i.test(text)) suggestions.push('fls-stateful');
    
    return suggestions;
  }

  /**
   * Provides completion items with enhanced intelligence
   */
  provideCompletionItems(document, position, token, context) {
    const analysis = this.analyzeContext(document, position);
    const completionItems = [];

    analysis.suggestions.forEach(suggestion => {
      const item = new vscode.CompletionItem(suggestion, vscode.CompletionItemKind.Snippet);
      item.detail = `🤖 Copilot Enhanced: ${suggestion}`;
      item.documentation = new vscode.MarkdownString(`**AI-Powered Suggestion**\\n\\nThis snippet is intelligently suggested based on your current context.`);
      item.sortText = '0' + suggestion; // High priority
      completionItems.push(item);
    });

    return completionItems;
  }
}

/**
 * Extension activation function
 */
function activate(context) {
  console.log('🤖 Copilot Enhanced Flutter Snippets is now active!');
  
  const enhancer = new CopilotEnhancer();
  
  // Register completion provider
  const provider = vscode.languages.registerCompletionItemProvider(
    'dart',
    {
      provideCompletionItems(document, position, token, context) {
        return enhancer.provideCompletionItems(document, position, token, context);
      }
    },
    // Trigger characters
    '.',
    ' ',
    '\\n'
  );

  context.subscriptions.push(provider);

  // Register hover provider for snippet information
  const hoverProvider = vscode.languages.registerHoverProvider('dart', {
    provideHover(document, position, token) {
      const range = document.getWordRangeAtPosition(position);
      const word = document.getText(range);
      
      if (enhancer.patterns.cleanArchitecture.test(word) || 
          enhancer.patterns.stateManagement.test(word) ||
          enhancer.patterns.uiComponents.test(word)) {
        
        return new vscode.Hover(
          new vscode.MarkdownString(`**🤖 Copilot Enhanced**\\n\\nType prefix patterns to get intelligent suggestions:\\n\\n- Clean Architecture: \`clean-*\`\\n- State Management: \`flb-*\`, \`flp-*\`, \`flr-*\`\\n- UI Components: \`flw-*\`, \`flm3-*\``)
        );
      }
    }
  });

  context.subscriptions.push(hoverProvider);

  // Register command for showing snippet catalog
  const catalogCommand = vscode.commands.registerCommand('flutter-snippets.showCatalog', () => {
    const panel = vscode.window.createWebviewPanel(
      'snippetCatalog',
      '🤖 Flutter Snippets Catalog',
      vscode.ViewColumn.One,
      {}
    );

    panel.webview.html = getWebviewContent();
  });

  context.subscriptions.push(catalogCommand);
}

function getWebviewContent() {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flutter Snippets Catalog</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      .category { margin-bottom: 30px; }
      .snippet { background: #f5f5f5; padding: 10px; margin: 5px 0; border-radius: 5px; }
      .prefix { font-weight: bold; color: #0066cc; }
    </style>
  </head>
  <body>
    <h1>🤖 Copilot Enhanced Flutter Snippets</h1>
    <p>141 professional snippets across 22 categories</p>
    
    <div class="category">
      <h2>🏗️ Clean Architecture</h2>
      <div class="snippet"><span class="prefix">clean-entity</span> - Complete entity with business rules</div>
      <div class="snippet"><span class="prefix">clean-usecase-create</span> - Create use case with validation</div>
      <div class="snippet"><span class="prefix">clean-repo-impl</span> - Repository implementation with caching</div>
    </div>
    
    <div class="category">
      <h2>🎯 State Management</h2>
      <div class="snippet"><span class="prefix">flb-bloc-complete</span> - Complete BLoC pattern</div>
      <div class="snippet"><span class="prefix">flp-provider</span> - Provider with ChangeNotifier</div>
      <div class="snippet"><span class="prefix">flr-provider</span> - Riverpod state management</div>
    </div>
    
    <div class="category">
      <h2>🎨 UI Components</h2>
      <div class="snippet"><span class="prefix">flm3-card</span> - Material 3 card component</div>
      <div class="snippet"><span class="prefix">flw-scaffold</span> - Complete scaffold template</div>
      <div class="snippet"><span class="prefix">fln-bottom</span> - Bottom navigation bar</div>
    </div>
    
    <p><strong>🚀 Pro Tip:</strong> GitHub Copilot automatically suggests these snippets based on context!</p>
  </body>
  </html>`;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
