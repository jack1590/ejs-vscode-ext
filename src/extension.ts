import * as vscode from 'vscode';
import { EjsDefinitionProvider } from './ejsDefinitionProvider';
import { EjsHoverProvider } from './ejsHoverProvider';
import { EjsCompletionProvider } from './ejsCompletionProvider';
import { JsonIndexer } from './jsonIndexer';

export function activate(context: vscode.ExtensionContext) {
    console.log('EJS Navigator extension is now active');

    const jsonIndexer = new JsonIndexer();

    // Index JSON files on activation
    indexJsonFiles(jsonIndexer);

    // Watch for JSON file changes
    const jsonWatcher = vscode.workspace.createFileSystemWatcher('**/*.json');
    jsonWatcher.onDidChange(() => indexJsonFiles(jsonIndexer));
    jsonWatcher.onDidCreate(() => indexJsonFiles(jsonIndexer));
    jsonWatcher.onDidDelete(() => indexJsonFiles(jsonIndexer));

    // Watch for configuration changes
    const configWatcher = vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('ejsNavigator')) {
            console.log('EJS Navigator configuration changed, re-indexing...');
            indexJsonFiles(jsonIndexer);
        }
    });

    // Register definition provider for BrightScript and XML files
    const definitionProvider = new EjsDefinitionProvider(jsonIndexer);
    context.subscriptions.push(
        vscode.languages.registerDefinitionProvider(
            [
                { scheme: 'file', language: 'brightscript' },
                { scheme: 'file', pattern: '**/*.bs' },
                { scheme: 'file', pattern: '**/*.brs' },
                { scheme: 'file', language: 'xml' },
                { scheme: 'file', pattern: '**/*.xml' }
            ],
            definitionProvider
        )
    );

    // Register hover provider
    const hoverProvider = new EjsHoverProvider(jsonIndexer);
    context.subscriptions.push(
        vscode.languages.registerHoverProvider(
            [
                { scheme: 'file', language: 'brightscript' },
                { scheme: 'file', pattern: '**/*.bs' },
                { scheme: 'file', pattern: '**/*.brs' },
                { scheme: 'file', language: 'xml' },
                { scheme: 'file', pattern: '**/*.xml' }
            ],
            hoverProvider
        )
    );

    // Register completion provider
    const completionProvider = new EjsCompletionProvider(jsonIndexer);
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            [
                { scheme: 'file', language: 'brightscript' },
                { scheme: 'file', pattern: '**/*.bs' },
                { scheme: 'file', pattern: '**/*.brs' },
                { scheme: 'file', language: 'xml' },
                { scheme: 'file', pattern: '**/*.xml' }
            ],
            completionProvider,
            '.', // Trigger on dot
            '(', // Trigger on opening parenthesis
            ' '  // Trigger on space
        )
    );

    context.subscriptions.push(jsonWatcher, configWatcher);

    vscode.window.showInformationMessage('EJS Navigator is ready!');
}

async function indexJsonFiles(jsonIndexer: JsonIndexer) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        return;
    }

    const config = vscode.workspace.getConfiguration('ejsNavigator');
    const jsonFilePatterns = config.get<string[]>('jsonFiles', ['product/descarga.json', 'data/constants.json']);

    // Clear previous index
    jsonIndexer.clear();

    for (const workspaceFolder of workspaceFolders) {
        for (const pattern of jsonFilePatterns) {
            try {
                // Check if pattern contains glob characters
                if (pattern.includes('*') || pattern.includes('?') || pattern.includes('[')) {
                    // Use workspace.findFiles for glob patterns
                    const relativePattern = new vscode.RelativePattern(workspaceFolder, pattern);
                    const files = await vscode.workspace.findFiles(relativePattern);
                    
                    for (const fileUri of files) {
                        try {
                            await jsonIndexer.indexFile(fileUri);
                            console.log(`Indexed: ${fileUri.fsPath}`);
                        } catch (error) {
                            console.warn(`Could not index ${fileUri.fsPath}:`, error);
                        }
                    }
                } else {
                    // Treat as specific file path
                    const uri = vscode.Uri.joinPath(workspaceFolder.uri, pattern);
                    await jsonIndexer.indexFile(uri);
                    console.log(`Indexed: ${uri.fsPath}`);
                }
            } catch (error) {
                console.warn(`Could not process pattern "${pattern}":`, error);
            }
        }
    }
    
    const indexedCount = jsonIndexer.getAllPaths().length;
    console.log(`Total indexed paths: ${indexedCount}`);
}

export function deactivate() {}
