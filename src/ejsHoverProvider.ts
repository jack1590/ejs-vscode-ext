import * as vscode from 'vscode';
import { JsonIndexer } from './jsonIndexer';
import { EjsParser } from './ejsParser';

export class EjsHoverProvider implements vscode.HoverProvider {
    constructor(private jsonIndexer: JsonIndexer) {}

    provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Hover> {
        const ejsInfo = EjsParser.getEjsPathAtPosition(document, position);
        
        if (!ejsInfo) {
            return null;
        }

        const { path, prefix } = ejsInfo;

        // Try to find the path in the index
        let location = this.jsonIndexer.getLocation(path);

        // If not found and there's a prefix, try without the prefix
        if (!location && prefix) {
            const pathWithoutPrefix = path.replace(`${prefix}.`, '');
            location = this.jsonIndexer.getLocation(pathWithoutPrefix);
        }

        if (!location) {
            return null;
        }

        // Format the value for display
        const valueStr = this.formatValue(location.value);
        const hoverText = new vscode.MarkdownString();
        hoverText.appendCodeblock(valueStr, 'json');
        hoverText.appendText(`\n\nDefined in: ${location.uri.fsPath.split('/').pop()}:${location.line + 1}`);

        return new vscode.Hover(hoverText);
    }

    private formatValue(value: any): string {
        if (typeof value === 'string') {
            return `"${value}"`;
        } else if (typeof value === 'object') {
            return JSON.stringify(value, null, 2);
        } else {
            return String(value);
        }
    }
}
