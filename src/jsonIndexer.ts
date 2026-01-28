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
        fullContent: string
    ): void {
        if (typeof obj !== 'object' || obj === null) {
            return;
        }

        for (const key in obj) {
            const fullKey = prefix ? `${prefix}.${key}` : key;
            const value = obj[key];

            // Find the line number for this key
            const location = this.findKeyLocation(key, fullKey, value, document, fullContent);
            
            if (location) {
                this.index.set(fullKey, {
                    uri,
                    line: location.line,
                    column: location.column,
                    value: value,
                    endLine: location.endLine
                });
            }

            // Recursively index nested objects
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                this.indexObject(uri, value, fullKey, document, fullContent);
            }
        }
    }

    private findKeyLocation(
        key: string,
        fullKey: string,
        value: any,
        document: vscode.TextDocument,
        fullContent: string
    ): { line: number; column: number; endLine: number } | null {
        // Create a regex to find the key in JSON
        // This handles both "key": value and "key" : value patterns
        const keyPattern = new RegExp(`"${this.escapeRegex(key)}"\\s*:`, 'g');
        
        let match;
        const matches: { index: number; line: number; column: number }[] = [];
        
        while ((match = keyPattern.exec(fullContent)) !== null) {
            const position = document.positionAt(match.index);
            matches.push({
                index: match.index,
                line: position.line,
                column: position.character
            });
        }

        // If we have multiple matches, try to find the most relevant one
        // For now, just return the first match
        if (matches.length > 0) {
            const match = matches[0];
            
            // Try to find the end of this value
            let endLine = match.line;
            const valueStr = JSON.stringify(value);
            if (typeof value === 'object' && value !== null) {
                // For objects/arrays, scan forward to find closing bracket
                const text = document.getText();
                const startIndex = document.offsetAt(new vscode.Position(match.line, 0));
                let braceCount = 0;
                let inValue = false;
                
                for (let i = match.index; i < text.length && endLine - match.line < 100; i++) {
                    const char = text[i];
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
            } else {
                endLine = match.line;
            }
            
            return {
                line: match.line,
                column: match.column,
                endLine: endLine
            };
        }

        return null;
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
