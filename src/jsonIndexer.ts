import * as vscode from 'vscode';

export interface JsonLocation {
    uri: vscode.Uri;
    line: number;
    column: number;
    value: any;
    endLine: number;
}

export class JsonIndexer {
    private index: Map<string, JsonLocation> = new Map();

    async indexFile(uri: vscode.Uri): Promise<void> {
        try {
            const document = await vscode.workspace.openTextDocument(uri);
            const content = document.getText();
            
            // Parse JSON with line tracking
            this.buildIndex(uri, content, document);
        } catch (error) {
            console.error(`Error indexing ${uri.fsPath}:`, error);
        }
    }

    private buildIndex(uri: vscode.Uri, content: string, document: vscode.TextDocument): void {
        try {
            const json = JSON.parse(content);
            this.indexObject(uri, json, '', document, content);
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    }

    private indexObject(
        uri: vscode.Uri,
        obj: any,
        prefix: string,
        document: vscode.TextDocument,
        fullContent: string,
        startOffset: number = 0
    ): void {
        if (typeof obj !== 'object' || obj === null) {
            return;
        }

        for (const key in obj) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const value = obj[key];

            // Find the line number for this key starting from the current offset
            const location = this.findKeyLocation(key, fullKey, value, document, fullContent, startOffset);
            
            if (location) {
                this.index.set(fullKey, {
                    uri,
                    line: location.line,
                    column: location.column,
                    value: value,
                    endLine: location.endLine
                });

                // Recursively index nested objects, starting search after this key
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    this.indexObject(uri, value, fullKey, document, fullContent, location.valueStartOffset);
                }
            }
        }
    }

    private findKeyLocation(
        key: string,
        fullKey: string,
        value: any,
        document: vscode.TextDocument,
        fullContent: string,
        startOffset: number = 0
    ): { line: number; column: number; endLine: number; valueStartOffset: number } | null {
        // Search for the key starting from the given offset
        const keyPattern = new RegExp(`"${this.escapeRegex(key)}"\\s*:`, 'g');
        keyPattern.lastIndex = startOffset;
        
        const match = keyPattern.exec(fullContent);
        
        if (!match) {
            return null;
        }

        const position = document.positionAt(match.index);
        const valueStartOffset = match.index + match[0].length;
        
        // Calculate end line
        let endLine = position.line;
        
        if (typeof value === 'object' && value !== null) {
            // For objects/arrays, scan forward to find closing bracket
            let braceCount = 0;
            let inValue = false;
            
            for (let i = valueStartOffset; i < fullContent.length && endLine - position.line < 500; i++) {
                const char = fullContent[i];
                if (char === '{' || char === '[') {
                    braceCount++;
                    inValue = true;
                } else if (char === '}' || char === ']') {
                    braceCount--;
                    if (inValue && braceCount === 0) {
                        endLine = document.positionAt(i).line;
                        break;
                    }
                }
            }
        }
        
        return {
            line: position.line,
            column: position.character,
            endLine: endLine,
            valueStartOffset: valueStartOffset
        };
    }

    private escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    getLocation(path: string): JsonLocation | undefined {
        return this.index.get(path);
    }

    getAllPaths(): string[] {
        return Array.from(this.index.keys());
    }

    clear(): void {
        this.index.clear();
    }
}
