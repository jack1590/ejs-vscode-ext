import * as vscode from 'vscode';
import { JsonIndexer } from './jsonIndexer';
import { EjsParser } from './ejsParser';

export class EjsDefinitionProvider implements vscode.DefinitionProvider {
    constructor(private jsonIndexer: JsonIndexer) {}

    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Definition | vscode.LocationLink[]> {
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

        return new vscode.Location(
            location.uri,
            new vscode.Position(location.line, location.column)
        );
    }
}
