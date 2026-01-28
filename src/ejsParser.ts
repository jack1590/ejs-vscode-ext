import * as vscode from 'vscode';

export interface EjsInfo {
    path: string;
    prefix?: string;
    range: vscode.Range;
    fullMatch: string;
}

export class EjsParser {
    // Matches: "{{%- s(path.to.value) %}}" or "{{%= path.to.value %}}" or "{{%- o(path.to.value) %}}"
    private static readonly EJS_PATTERNS = [
        // Pattern for function calls: s(), o(), etc.
        /"{{%-?\s*[so]\(([^)]+)\)\s*%}}"/g,
        // Pattern for direct values
        /"{{%=\s*([^}]+?)\s*%}}"/g,
        // Pattern for string output
        /"{{%-\s*s\(([^)]+)\)\s*%}}"/g
    ];

    static getEjsPathAtPosition(
        document: vscode.TextDocument,
        position: vscode.Position
    ): EjsInfo | null {
        const line = document.lineAt(position.line);
        const lineText = line.text;

        // Check if cursor is within an EJS expression
        for (const pattern of this.EJS_PATTERNS) {
            pattern.lastIndex = 0; // Reset regex
            let match;

            while ((match = pattern.exec(lineText)) !== null) {
                const matchStart = match.index;
                const matchEnd = match.index + match[0].length;

                // Check if cursor is within this match
                if (position.character >= matchStart && position.character <= matchEnd) {
                    const captured = match[1].trim();
                    
                    // Parse the path - might have CONST. or other prefixes
                    const pathInfo = this.parsePath(captured);
                    
                    return {
                        path: pathInfo.path,
                        prefix: pathInfo.prefix,
                        range: new vscode.Range(
                            position.line,
                            matchStart,
                            position.line,
                            matchEnd
                        ),
                        fullMatch: match[0]
                    };
                }
            }
        }

        return null;
    }

    private static parsePath(captured: string): { path: string; prefix?: string } {
        // Handle cases like:
        // - "CONST.Video.videoTypes.MOVIE" -> { path: "Video.videoTypes.MOVIE", prefix: "CONST" }
        // - "paletteV2.primary.orange" -> { path: "paletteV2.primary.orange", prefix: undefined }
        
        const knownPrefixes = ['CONST', 'ENV', 'EVENT', 'CONFIG', 'PAGE'];
        
        for (const prefix of knownPrefixes) {
            if (captured.startsWith(`${prefix}.`)) {
                return {
                    path: captured,
                    prefix: prefix
                };
            }
        }

        return {
            path: captured,
            prefix: undefined
        };
    }

    static extractAllEjsPaths(text: string): string[] {
        const paths: string[] = [];

        for (const pattern of this.EJS_PATTERNS) {
            pattern.lastIndex = 0;
            let match;

            while ((match = pattern.exec(text)) !== null) {
                const captured = match[1].trim();
                const pathInfo = this.parsePath(captured);
                paths.push(pathInfo.path);
            }
        }

        return paths;
    }
}
