import * as vscode from 'vscode';

export interface EjsInfo {
    path: string;
    prefix?: string;
    range: vscode.Range;
    fullMatch: string;
    partialPath?: string; // The path up to where the cursor is
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
                    
                    // Determine which part of the path the cursor is over
                    const pathStartInMatch = lineText.indexOf(captured, matchStart);
                    const cursorOffsetInPath = position.character - pathStartInMatch;
                    const partialPath = this.getPartialPathAtOffset(pathInfo.path, cursorOffsetInPath);
                    
                    return {
                        path: pathInfo.path,
                        prefix: pathInfo.prefix,
                        range: new vscode.Range(
                            position.line,
                            matchStart,
                            position.line,
                            matchEnd
                        ),
                        fullMatch: match[0],
                        partialPath: partialPath
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

    private static getPartialPathAtOffset(fullPath: string, cursorOffset: number): string {
        // Find which segment of the path the cursor is over
        // e.g., "Hero.default.heroWrapper.liveTag.visible"
        //       cursor at position 15 (in "heroWrapper") -> "Hero.default.heroWrapper"
        
        if (cursorOffset < 0 || cursorOffset > fullPath.length) {
            return fullPath;
        }

        // Find the last dot before or at the cursor position
        let pathUpToCursor = fullPath.substring(0, cursorOffset);
        
        // If cursor is in the middle of a segment, include the whole segment
        let nextDotIndex = fullPath.indexOf('.', cursorOffset);
        if (nextDotIndex === -1) {
            // Cursor is in the last segment
            return fullPath;
        }
        
        // Include up to the next dot (current segment)
        return fullPath.substring(0, nextDotIndex);
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
