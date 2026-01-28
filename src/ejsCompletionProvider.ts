import * as vscode from 'vscode';
import { JsonIndexer } from './jsonIndexer';

export class EjsCompletionProvider implements vscode.CompletionItemProvider {
    constructor(private jsonIndexer: JsonIndexer) {}

    provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        const line = document.lineAt(position.line);
        const lineText = line.text;
        const cursorPos = position.character;

        // Check if we're inside an EJS expression
        const ejsContext = this.getEjsContext(lineText, cursorPos);
        if (!ejsContext) {
            return null;
        }

        const { partialPath, replaceRange } = ejsContext;

        // Get all indexed paths
        const allPaths = this.jsonIndexer.getAllPaths();

        // Filter paths that match the partial path
        const matchingPaths = this.getMatchingPaths(allPaths, partialPath);

        // Convert to completion items
        const completionItems = matchingPaths.map(pathInfo => {
            const item = new vscode.CompletionItem(
                pathInfo.displayText,
                vscode.CompletionItemKind.Property
            );

            item.insertText = pathInfo.insertText;
            item.detail = pathInfo.detail;
            item.documentation = pathInfo.documentation;

            // If we have a replace range, apply it
            if (replaceRange) {
                item.range = replaceRange;
            }

            // Sort by relevance
            item.sortText = pathInfo.sortText;

            return item;
        });

        return completionItems;
    }

    /**
     * Detects if cursor is inside an EJS expression and returns context
     */
    private getEjsContext(
        lineText: string,
        cursorPos: number
    ): { partialPath: string; replaceRange?: vscode.Range } | null {
        // Patterns: "{{%- s(path) %}}" or "{{%= path %}}" or "{{%- o(path) %}}"
        const ejsPatterns = [
            /{{%-?\s*([so])\(([^)]*)/g,  // s(path or o(path (unclosed)
            /{{%=\s*([^}%]*)/g            // %= path
        ];

        for (const pattern of ejsPatterns) {
            pattern.lastIndex = 0;
            let match;

            while ((match = pattern.exec(lineText)) !== null) {
                const matchStart = match.index;
                const matchEnd = match.index + match[0].length;

                // Check if cursor is within this match
                if (cursorPos >= matchStart && cursorPos <= matchEnd) {
                    // Extract the partial path being typed
                    const captured = match[2] || match[1] || '';
                    const pathStart = lineText.indexOf(captured, matchStart);
                    const partialPath = captured.substring(0, cursorPos - pathStart).trim();

                    return {
                        partialPath: partialPath,
                        replaceRange: undefined  // Could calculate exact range if needed
                    };
                }
            }
        }

        return null;
    }

    /**
     * Get matching paths based on partial input
     */
    private getMatchingPaths(
        allPaths: string[],
        partialPath: string
    ): Array<{
        displayText: string;
        insertText: string;
        detail: string;
        documentation?: string;
        sortText: string;
    }> {
        if (!partialPath || partialPath.length === 0) {
            // Show top-level keys
            const topLevelKeys = new Set<string>();
            allPaths.forEach(path => {
                const firstPart = path.split('.')[0];
                topLevelKeys.add(firstPart);
            });

            return Array.from(topLevelKeys).map(key => ({
                displayText: key,
                insertText: key,
                detail: `Top-level key`,
                sortText: `0_${key}`
            }));
        }

        // Check if partial path ends with a dot (user wants to see children)
        if (partialPath.endsWith('.')) {
            const parentPath = partialPath.slice(0, -1);
            return this.getChildProperties(allPaths, parentPath);
        }

        // Find paths that start with the partial path
        const lastDotIndex = partialPath.lastIndexOf('.');
        
        if (lastDotIndex === -1) {
            // No dots yet - filter top-level keys
            const topLevelKeys = new Set<string>();
            allPaths.forEach(path => {
                const firstPart = path.split('.')[0];
                if (firstPart.toLowerCase().startsWith(partialPath.toLowerCase())) {
                    topLevelKeys.add(firstPart);
                }
            });

            return Array.from(topLevelKeys).map(key => ({
                displayText: key,
                insertText: key,
                detail: `Top-level key`,
                sortText: `0_${key}`
            }));
        }

        // User is typing after a dot - suggest child properties
        const parentPath = partialPath.substring(0, lastDotIndex);
        const currentSegment = partialPath.substring(lastDotIndex + 1);

        const children = this.getChildProperties(allPaths, parentPath);
        
        return children.filter(child => 
            child.displayText.toLowerCase().startsWith(currentSegment.toLowerCase())
        );
    }

    /**
     * Get immediate child properties of a parent path
     */
    private getChildProperties(
        allPaths: string[],
        parentPath: string
    ): Array<{
        displayText: string;
        insertText: string;
        detail: string;
        documentation?: string;
        sortText: string;
    }> {
        const children = new Set<string>();
        const parentPrefix = parentPath + '.';

        allPaths.forEach(path => {
            if (path.startsWith(parentPrefix)) {
                const remainder = path.substring(parentPrefix.length);
                const nextSegment = remainder.split('.')[0];
                children.add(nextSegment);
            }
        });

        return Array.from(children).map(child => {
            const fullPath = `${parentPath}.${child}`;
            const location = this.jsonIndexer.getLocation(fullPath);
            
            let detail = 'Property';
            let documentation = undefined;

            if (location) {
                const valueType = typeof location.value;
                if (valueType === 'object' && location.value !== null) {
                    detail = Array.isArray(location.value) ? 'Array' : 'Object';
                    documentation = this.formatValueForDocs(location.value);
                } else {
                    detail = `${valueType}: ${JSON.stringify(location.value)}`;
                }
            }

            return {
                displayText: child,
                insertText: child,
                detail: detail,
                documentation: documentation,
                sortText: `1_${child}`
            };
        });
    }

    private formatValueForDocs(value: any): string {
        if (typeof value === 'object' && value !== null) {
            const preview = JSON.stringify(value, null, 2);
            const maxLength = 200;
            return preview.length > maxLength
                ? preview.substring(0, maxLength) + '...'
                : preview;
        }
        return String(value);
    }
}
