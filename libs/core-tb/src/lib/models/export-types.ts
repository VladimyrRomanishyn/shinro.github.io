import { MessageService } from "primeng/api";

export type FileType = 'Angular' | 'internalStyles' | 'separate';

export interface ExportParams {
    element: HTMLElement;
    names: Map<string, string>;
    fileType: FileType;  
    messageSvc?: MessageService;
    electron?: boolean;
}