import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'App Title',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.deepPurple,
          brightness: Brightness.dark,
        ),
      ),
      themeMode: ThemeMode.system,
      home: const TestPage(),
    );
  }
}

class TestPage extends StatefulWidget {
  const TestPage({super.key});

  @override
  State<TestPage> createState() => _TestPageState();
}

class _TestPageState extends State<TestPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Test Snippets'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        // actions: [
        //   IconButton(
        //     onPressed: () {
        //       // Handle action
        //     },
        //     icon: const Icon(Icons.more_vert),
        //   ),
        // ],
      ),
      body: ListView.builder(
        itemCount: 10, // Change to your items list length
        padding: const EdgeInsets.all(8),
        itemBuilder: (context, index) {
          // final item = items[index];
          return Card(
            margin: const EdgeInsets.symmetric(
              vertical: 4,
              horizontal: 8,
            ),
            child: ListTile(
              leading: CircleAvatar(
                child: Text('${index + 1}'),
              ),
              title: Text('Item ${index + 1}'),
              subtitle: Text('Subtitle for item ${index + 1}'),
              trailing: const Icon(Icons.arrow_forward_ios),
              onTap: () {
                // Handle tap
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Tapped item ${index + 1}'),
                  ),
                );
              },
            ),
          );
        },
      ),
      // floatingActionButton: FloatingActionButton(
      //   onPressed: () {
      //     // Handle FAB press
      //   },
      //   child: const Icon(Icons.add),
      // ),
    );
  }
}
