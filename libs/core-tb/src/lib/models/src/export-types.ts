export type FileType = 'Angular' | 'internalStyles' | 'separate';

export interface ExportParams {
    element: HTMLElement;
    names: Map<string, string>;
    fileType: FileType;  
    electron?: boolean;
    files: File[];
}