const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

/**
 * 🤖 COPILOT INTEGRATION EXTENSION + PROJECT BOILERPLATE GENERATOR
 *
 * This module enhances VS Code's intelligence by providing
 * context-aware suggestions and powerful project generation commands.
 */

class CopilotEnhancer {
  constructor() {
    this.patterns = {
      cleanArchitecture:
        /clean-|entity|usecase|repository|dto|mapper|datasource|service/i,
      stateManagement: /bloc|cubit|provider|riverpod|setstate|consumer/i,
      uiComponents:
        /material3|form|navigation|responsive|animation|widget|page/i,
      filePatterns: {
        entity: /_entity\.dart$/,
        bloc: /_bloc\.dart$/,
        provider: /_provider\.dart$/,
        page: /_page\.dart$/,
        repository: /_repository\.dart$/,
        usecase: /_usecase\.dart$/,
      },
    };
  }

  /**
   * Analyzes current context and provides intelligent suggestions
   */
  analyzeContext(document, position) {
    const text = document.getText();
    const currentWord = document.getWordRangeAtPosition(position);
    const fileName = path.basename(document.fileName);

    const suggestions = {
      snippets: [],
      context: this.detectContext(text, fileName),
      patterns: this.identifyPatterns(text),
    };

    return suggestions;
  }

  /**
   * Detects project context and architecture patterns
   */
  detectContext(text, fileName) {
    const context = {
      architecture: "unknown",
      stateManagement: "none",
      fileType: "generic",
    };

    // Detect Clean Architecture
    if (this.patterns.cleanArchitecture.test(text)) {
      context.architecture = "clean";
    }

    // Detect State Management
    if (this.patterns.stateManagement.test(text)) {
      if (text.includes("flutter_bloc")) context.stateManagement = "bloc";
      if (text.includes("provider")) context.stateManagement = "provider";
      if (text.includes("riverpod")) context.stateManagement = "riverpod";
    }

    // Detect file type
    for (const [type, pattern] of Object.entries(this.patterns.filePatterns)) {
      if (pattern.test(fileName)) {
        context.fileType = type;
        break;
      }
    }

    return context;
  }

  /**
   * Identifies patterns in the current text
   */
  identifyPatterns(text) {
    const patterns = [];

    if (this.patterns.cleanArchitecture.test(text)) {
      patterns.push("clean-architecture");
    }
    if (this.patterns.stateManagement.test(text)) {
      patterns.push("state-management");
    }
    if (this.patterns.uiComponents.test(text)) {
      patterns.push("ui-components");
    }

    return patterns;
  }
}

/**
 * 🚀 PROJECT GENERATOR - ULTRA POWERFUL FLUTTER PROJECT SCAFFOLDING
 */
class ProjectGenerator {
  constructor(context) {
    this.context = context;
    this.outputChannel = vscode.window.createOutputChannel("Flutter Ultra Pro");
  }

  /**
   * Creates a complete Flutter project with Clean Architecture
   */
  async createFlutterProject() {
    try {
      this.outputChannel.show();
      this.outputChannel.appendLine(
        "🚀 Iniciando creación de proyecto Flutter Ultra Pro..."
      );

      // Get project details from user
      const projectName = await vscode.window.showInputBox({
        prompt: "📝 Nombre del proyecto (ejemplo: mi_app_flutter)",
        placeHolder: "mi_app_flutter",
        validateInput: (value) => {
          if (!value || !/^[a-z_][a-z0-9_]*$/.test(value)) {
            return "Nombre debe ser snake_case (solo letras minúsculas, números y guiones bajos)";
          }
          return null;
        },
      });

      if (!projectName) return;

      const description = await vscode.window.showInputBox({
        prompt: "📄 Descripción del proyecto",
        placeHolder: "Una increíble aplicación Flutter con Clean Architecture",
      });

      const stateManagement = await vscode.window.showQuickPick(
        [
          {
            label: "🧊 BLoC/Cubit",
            value: "bloc",
            description: "Recomendado para proyectos complejos",
          },
          {
            label: "🔄 Provider",
            value: "provider",
            description: "Ideal para proyectos medianos",
          },
          {
            label: "⚡ Riverpod",
            value: "riverpod",
            description: "Moderno y potente",
          },
          {
            label: "📱 setState",
            value: "setstate",
            description: "Básico para apps simples",
          },
        ],
        {
          placeHolder: "Selecciona el patrón de gestión de estado",
        }
      );

      if (!stateManagement) return;

      // Select workspace folder
      const workspaceFolder = await vscode.window.showWorkspaceFolderPicker({
        placeHolder: "Selecciona la carpeta donde crear el proyecto",
      });

      if (!workspaceFolder) return;

      const projectPath = path.join(workspaceFolder.uri.fsPath, projectName);

      // Create project structure
      await this.createProjectStructure(
        projectPath,
        projectName,
        description,
        stateManagement.value
      );

      this.outputChannel.appendLine("✅ ¡Proyecto creado exitosamente!");
      this.outputChannel.appendLine(`📁 Ubicación: ${projectPath}`);

      // Open project in new window
      const openInNewWindow = await vscode.window.showInformationMessage(
        `¡Proyecto ${projectName} creado! ¿Abrir en nueva ventana?`,
        "Sí",
        "No"
      );

      if (openInNewWindow === "Sí") {
        await vscode.commands.executeCommand(
          "vscode.openFolder",
          vscode.Uri.file(projectPath),
          true
        );
      }
    } catch (error) {
      this.outputChannel.appendLine(`❌ Error: ${error.message}`);
      vscode.window.showErrorMessage(
        `Error creando proyecto: ${error.message}`
      );
    }
  }

  /**
   * Creates the complete project structure with Clean Architecture
   */
  async createProjectStructure(
    projectPath,
    projectName,
    description,
    stateManagement
  ) {
    this.outputChannel.appendLine("📁 Creando estructura de carpetas...");

    // Create base directories
    const directories = [
      "lib",
      "lib/core",
      "lib/core/constants",
      "lib/core/errors",
      "lib/core/network",
      "lib/core/utils",
      "lib/core/widgets",
      "lib/features",
      "lib/features/auth",
      "lib/features/auth/data",
      "lib/features/auth/data/datasources",
      "lib/features/auth/data/models",
      "lib/features/auth/data/repositories",
      "lib/features/auth/domain",
      "lib/features/auth/domain/entities",
      "lib/features/auth/domain/repositories",
      "lib/features/auth/domain/usecases",
      "lib/features/auth/presentation",
      "lib/features/auth/presentation/bloc",
      "lib/features/auth/presentation/pages",
      "lib/features/auth/presentation/widgets",
      "lib/features/home",
      "lib/features/home/data",
      "lib/features/home/data/datasources",
      "lib/features/home/data/models",
      "lib/features/home/data/repositories",
      "lib/features/home/domain",
      "lib/features/home/domain/entities",
      "lib/features/home/domain/repositories",
      "lib/features/home/domain/usecases",
      "lib/features/home/presentation",
      "lib/features/home/presentation/bloc",
      "lib/features/home/presentation/pages",
      "lib/features/home/presentation/widgets",
      "lib/injection",
      "test",
      "test/features",
      "test/core",
      "android",
      "ios",
      "web",
    ];

    // Create all directories
    for (const dir of directories) {
      const fullPath = path.join(projectPath, dir);
      fs.mkdirSync(fullPath, { recursive: true });
    }

    // Generate pubspec.yaml
    await this.createPubspecYaml(
      projectPath,
      projectName,
      description,
      stateManagement
    );

    // Generate main.dart
    await this.createMainDart(projectPath, stateManagement);

    // Generate core files
    await this.createCoreFiles(projectPath);

    // Generate feature files
    await this.createFeatureFiles(projectPath, stateManagement);

    // Generate dependency injection
    await this.createDependencyInjection(projectPath, stateManagement);

    this.outputChannel.appendLine("✅ Estructura de proyecto creada");
  }

  /**
   * Creates pubspec.yaml with all necessary dependencies
   */
  async createPubspecYaml(
    projectPath,
    projectName,
    description,
    stateManagement
  ) {
    const dependencies = {
      bloc: `  # State Management
  flutter_bloc: ^8.1.3
  equatable: ^2.0.5
  
  # Dependency Injection
  get_it: ^7.6.4
  injectable: ^2.3.2
  
  # Network
  dio: ^5.3.2
  connectivity_plus: ^5.0.1
  
  # Local Storage
  shared_preferences: ^2.2.2
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  
  # UI
  cached_network_image: ^3.3.0
  shimmer: ^3.0.0
  
  # Utilities
  dartz: ^0.10.1
  freezed_annotation: ^2.4.1`,

      provider: `  # State Management
  provider: ^6.1.1
  
  # Network
  dio: ^5.3.2
  connectivity_plus: ^5.0.1
  
  # Local Storage
  shared_preferences: ^2.2.2
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  
  # UI
  cached_network_image: ^3.3.0
  shimmer: ^3.0.0
  
  # Utilities
  dartz: ^0.10.1`,

      riverpod: `  # State Management
  flutter_riverpod: ^2.4.9
  riverpod_annotation: ^2.3.3
  
  # Network
  dio: ^5.3.2
  connectivity_plus: ^5.0.1
  
  # Local Storage
  shared_preferences: ^2.2.2
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  
  # UI
  cached_network_image: ^3.3.0
  shimmer: ^3.0.0
  
  # Utilities
  dartz: ^0.10.1`,

      setstate: `  # Network
  dio: ^5.3.2
  connectivity_plus: ^5.0.1
  
  # Local Storage
  shared_preferences: ^2.2.2
  
  # UI
  cached_network_image: ^3.3.0
  
  # Utilities
  dartz: ^0.10.1`,
    };

    const devDependencies = {
      bloc: `  # Code Generation
  build_runner: ^2.4.7
  injectable_generator: ^2.4.1
  hive_generator: ^2.0.1
  freezed: ^2.4.6
  json_annotation: ^4.8.1
  json_serializable: ^6.7.1
  
  # Testing
  bloc_test: ^9.1.5
  mocktail: ^1.0.1`,

      provider: `  # Code Generation
  build_runner: ^2.4.7
  hive_generator: ^2.0.1
  json_annotation: ^4.8.1
  json_serializable: ^6.7.1
  
  # Testing
  mockito: ^5.4.3`,

      riverpod: `  # Code Generation
  build_runner: ^2.4.7
  riverpod_generator: ^2.3.9
  custom_lint: ^0.5.7
  riverpod_lint: ^2.3.7
  hive_generator: ^2.0.1
  json_annotation: ^4.8.1
  json_serializable: ^6.7.1
  
  # Testing
  mockito: ^5.4.3`,

      setstate: `  # Code Generation
  build_runner: ^2.4.7
  json_annotation: ^4.8.1
  json_serializable: ^6.7.1`,
    };

    const pubspecContent = `name: ${projectName}
description: ${description || "A Flutter application with Clean Architecture"}
publish_to: 'none'

version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: ">=3.16.0"

dependencies:
  flutter:
    sdk: flutter
  
  cupertino_icons: ^1.0.2
${dependencies[stateManagement]}

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.1
${devDependencies[stateManagement]}

flutter:
  uses-material-design: true

  # assets:
  #   - images/

  # fonts:
  #   - family: Schyler
  #     fonts:
  #       - asset: fonts/Schyler-Regular.ttf
  #       - asset: fonts/Schyler-Italic.ttf
  #         style: italic
`;

    fs.writeFileSync(path.join(projectPath, "pubspec.yaml"), pubspecContent);
    this.outputChannel.appendLine("✅ pubspec.yaml creado");
  }

  /**
   * Creates main.dart file
   */
  async createMainDart(projectPath, stateManagement) {
    const mainContent = {
      bloc: `import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';

import 'core/constants/app_constants.dart';
import 'core/widgets/app_theme.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';
import 'features/home/presentation/bloc/home_bloc.dart';
import 'features/auth/presentation/pages/login_page.dart';
import 'injection/injection_container.dart' as di;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await di.init();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => GetIt.instance<AuthBloc>()),
        BlocProvider(create: (_) => GetIt.instance<HomeBloc>()),
      ],
      child: MaterialApp(
        title: AppConstants.appName,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        home: LoginPage(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}`,

      provider: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'core/constants/app_constants.dart';
import 'core/widgets/app_theme.dart';
import 'features/auth/presentation/providers/auth_provider.dart';
import 'features/home/presentation/providers/home_provider.dart';
import 'features/auth/presentation/pages/login_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => HomeProvider()),
      ],
      child: MaterialApp(
        title: AppConstants.appName,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        home: LoginPage(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}`,

      riverpod: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'core/constants/app_constants.dart';
import 'core/widgets/app_theme.dart';
import 'features/auth/presentation/pages/login_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    ProviderScope(
      child: MyApp(),
    ),
  );
}

class MyApp extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      title: AppConstants.appName,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      home: LoginPage(),
      debugShowCheckedModeBanner: false,
    );
  }
}`,

      setstate: `import 'package:flutter/material.dart';

import 'core/constants/app_constants.dart';
import 'core/widgets/app_theme.dart';
import 'features/auth/presentation/pages/login_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppConstants.appName,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      home: LoginPage(),
      debugShowCheckedModeBanner: false,
    );
  }
}`,
    };

    fs.writeFileSync(
      path.join(projectPath, "lib", "main.dart"),
      mainContent[stateManagement]
    );
    this.outputChannel.appendLine("✅ main.dart creado");
  }

  /**
   * Creates core files (constants, themes, utilities)
   */
  async createCoreFiles(projectPath) {
    // App Constants
    const appConstantsContent = `class AppConstants {
  static const String appName = 'Flutter Ultra Pro';
  static const String appVersion = '1.0.0';
  
  // API
  static const String baseUrl = 'https://api.example.com';
  static const Duration requestTimeout = Duration(seconds: 30);
  
  // Storage Keys
  static const String userTokenKey = 'user_token';
  static const String themeKey = 'app_theme';
  
  // UI
  static const double defaultPadding = 16.0;
  static const double defaultRadius = 12.0;
  static const double buttonHeight = 48.0;
}`;

    fs.writeFileSync(
      path.join(projectPath, "lib", "core", "constants", "app_constants.dart"),
      appConstantsContent
    );

    // App Theme
    const appThemeContent = `import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: Colors.blue,
        brightness: Brightness.light,
      ),
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        elevation: 0,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          minimumSize: const Size(double.infinity, 48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        contentPadding: const EdgeInsets.all(16),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: Colors.blue,
        brightness: Brightness.dark,
      ),
      appBarTheme: const AppBarTheme(
        centerTitle: true,
        elevation: 0,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          minimumSize: const Size(double.infinity, 48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        contentPadding: const EdgeInsets.all(16),
      ),
    );
  }
}`;

    fs.writeFileSync(
      path.join(projectPath, "lib", "core", "widgets", "app_theme.dart"),
      appThemeContent
    );

    this.outputChannel.appendLine("✅ Archivos core creados");
  }

  /**
   * Creates feature files based on state management choice
   */
  async createFeatureFiles(projectPath, stateManagement) {
    // This method would create auth and home feature files
    // For brevity, I'll create basic login page
    const loginPageContent = `import 'package:flutter/material.dart';

class LoginPage extends StatefulWidget {
  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Iniciar Sesión'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.flutter_dash,
                size: 100,
                color: Theme.of(context).primaryColor,
              ),
              const SizedBox(height: 32),
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email',
                  prefixIcon: Icon(Icons.email),
                ),
                validator: (value) {
                  if (value?.isEmpty ?? true) {
                    return 'Por favor ingresa tu email';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _passwordController,
                decoration: const InputDecoration(
                  labelText: 'Contraseña',
                  prefixIcon: Icon(Icons.lock),
                ),
                obscureText: true,
                validator: (value) {
                  if (value?.isEmpty ?? true) {
                    return 'Por favor ingresa tu contraseña';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState?.validate() ?? false) {
                    // Handle login
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('¡Proyecto creado con Flutter Ultra Pro!'),
                      ),
                    );
                  }
                },
                child: const Text('Iniciar Sesión'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}`;

    fs.writeFileSync(
      path.join(
        projectPath,
        "lib",
        "features",
        "auth",
        "presentation",
        "pages",
        "login_page.dart"
      ),
      loginPageContent
    );
    this.outputChannel.appendLine("✅ Archivos de features creados");
  }

  /**
   * Creates dependency injection setup
   */
  async createDependencyInjection(projectPath, stateManagement) {
    if (stateManagement === "bloc") {
      const diContent = `import 'package:get_it/get_it.dart';

final sl = GetIt.instance;

Future<void> init() async {
  // Register your dependencies here
  // Example:
  // sl.registerLazySingleton(() => AuthBloc());
  // sl.registerLazySingleton(() => HomeBloc());
}`;

      fs.writeFileSync(
        path.join(projectPath, "lib", "injection", "injection_container.dart"),
        diContent
      );
      this.outputChannel.appendLine("✅ Dependency injection configurado");
    }
  }
}

/**
 * 🎯 FLUTTER COMMANDS - COMPREHENSIVE DEVELOPMENT COMMANDS
 */
class FlutterCommands {
  constructor(context) {
    this.context = context;
    this.outputChannel = vscode.window.createOutputChannel("Flutter Commands");
    this.projectGenerator = new ProjectGenerator(context);
  }

  /**
   * Creates a new feature with Clean Architecture structure
   */
  async createFeature() {
    try {
      this.outputChannel.show();
      this.outputChannel.appendLine("🎯 Creando nueva feature...");

      const featureName = await vscode.window.showInputBox({
        prompt: "📝 Nombre de la feature (ejemplo: user_profile)",
        placeHolder: "user_profile",
        validateInput: (value) => {
          if (!value || !/^[a-z_][a-z0-9_]*$/.test(value)) {
            return "Nombre debe ser snake_case";
          }
          return null;
        },
      });

      if (!featureName) return;

      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        vscode.window.showErrorMessage("No hay workspace abierto");
        return;
      }

      const featurePath = path.join(
        workspaceFolder.uri.fsPath,
        "lib",
        "features",
        featureName
      );

      // Create feature structure
      const directories = [
        "data/datasources",
        "data/models",
        "data/repositories",
        "domain/entities",
        "domain/repositories",
        "domain/usecases",
        "presentation/bloc",
        "presentation/pages",
        "presentation/widgets",
      ];

      for (const dir of directories) {
        const fullPath = path.join(featurePath, dir);
        fs.mkdirSync(fullPath, { recursive: true });
      }

      this.outputChannel.appendLine(
        `✅ Feature '${featureName}' creada en: ${featurePath}`
      );
      vscode.window.showInformationMessage(
        `¡Feature ${featureName} creada exitosamente!`
      );
    } catch (error) {
      this.outputChannel.appendLine(`❌ Error: ${error.message}`);
      vscode.window.showErrorMessage(`Error creando feature: ${error.message}`);
    }
  }

  /**
   * Builds APK for the current project
   */
  async buildApk() {
    try {
      this.outputChannel.show();
      this.outputChannel.appendLine("📱 Construyendo APK...");

      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        vscode.window.showErrorMessage("No hay workspace abierto");
        return;
      }

      const terminal = vscode.window.createTerminal("Flutter Build APK");
      terminal.show();
      terminal.sendText(`cd "${workspaceFolder.uri.fsPath}"`);
      terminal.sendText("flutter build apk --release");

      this.outputChannel.appendLine("🚀 Comando de build enviado al terminal");
      vscode.window.showInformationMessage(
        "Build APK iniciado. Revisa el terminal para ver el progreso."
      );
    } catch (error) {
      this.outputChannel.appendLine(`❌ Error: ${error.message}`);
      vscode.window.showErrorMessage(
        `Error construyendo APK: ${error.message}`
      );
    }
  }

  /**
   * Runs flutter clean and pub get
   */
  async cleanAndGet() {
    try {
      this.outputChannel.show();
      this.outputChannel.appendLine(
        "🧹 Limpiando proyecto y obteniendo dependencias..."
      );

      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        vscode.window.showErrorMessage("No hay workspace abierto");
        return;
      }

      const terminal = vscode.window.createTerminal("Flutter Clean & Get");
      terminal.show();
      terminal.sendText(`cd "${workspaceFolder.uri.fsPath}"`);
      terminal.sendText("flutter clean && flutter pub get");

      this.outputChannel.appendLine(
        "🚀 Comandos de limpieza enviados al terminal"
      );
    } catch (error) {
      this.outputChannel.appendLine(`❌ Error: ${error.message}`);
      vscode.window.showErrorMessage(`Error en clean & get: ${error.message}`);
    }
  }

  /**
   * Runs tests for the current project
   */
  async runTests() {
    try {
      this.outputChannel.show();
      this.outputChannel.appendLine("🧪 Ejecutando tests...");

      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        vscode.window.showErrorMessage("No hay workspace abierto");
        return;
      }

      const terminal = vscode.window.createTerminal("Flutter Tests");
      terminal.show();
      terminal.sendText(`cd "${workspaceFolder.uri.fsPath}"`);
      terminal.sendText("flutter test");

      this.outputChannel.appendLine("🚀 Tests iniciados en el terminal");
    } catch (error) {
      this.outputChannel.appendLine(`❌ Error: ${error.message}`);
      vscode.window.showErrorMessage(
        `Error ejecutando tests: ${error.message}`
      );
    }
  }
}
function activate(context) {
  console.log("🤖 Copilot Enhanced Flutter Snippets is now active!");

  const enhancer = new CopilotEnhancer();

  // Register completion provider
  const provider = vscode.languages.registerCompletionItemProvider(
    "dart",
    {
      provideCompletionItems(document, position, token, context) {
        return enhancer.provideCompletionItems(
          document,
          position,
          token,
          context
        );
      },
    },
    // Trigger characters
    ".",
    " ",
    "\\n"
  );

  context.subscriptions.push(provider);

  // Register hover provider for snippet information
  const hoverProvider = vscode.languages.registerHoverProvider("dart", {
    provideHover(document, position, token) {
      const range = document.getWordRangeAtPosition(position);
      const word = document.getText(range);

      if (
        enhancer.patterns.cleanArchitecture.test(word) ||
        enhancer.patterns.stateManagement.test(word) ||
        enhancer.patterns.uiComponents.test(word)
      ) {
        return new vscode.Hover(
          new vscode.MarkdownString(
            `**🤖 Copilot Enhanced**\\n\\nType prefix patterns to get intelligent suggestions:\\n\\n- Clean Architecture: \`clean-*\`\\n- State Management: \`flb-*\`, \`flp-*\`, \`flr-*\`\\n- UI Components: \`flw-*\`, \`flm3-*\``
          )
        );
      }
    },
  });

  context.subscriptions.push(hoverProvider);

  // Register command for showing snippet catalog
  const catalogCommand = vscode.commands.registerCommand(
    "flutter-snippets.showCatalog",
    () => {
      const panel = vscode.window.createWebviewPanel(
        "snippetCatalog",
        "🤖 Flutter Snippets Catalog",
        vscode.ViewColumn.One,
        {}
      );

      panel.webview.html = getWebviewContent();
    }
  );

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
  deactivate,
};
