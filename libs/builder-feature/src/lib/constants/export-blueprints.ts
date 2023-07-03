// export const CSS_BASE = 
// `* {
//     margin: 0;
//     padding:0
// }

// body {
//     width: 100vw;
//     height: 100vh;
// }\n\n`;

// export const HTML_BLUEPRINT = 
// `<!DOCTYPE HTML>
// <html>
// <head>
//     <meta charset="utf-8">
//     <base href="/">
//     <link rel="stylesheet" href="styles.css">
// </head>
// <body>
// {{innerHTML}}
// </body>
// </html>`;

// export const HTML_BLUEPRINT_INTERNAL = 
// `<!DOCTYPE HTML>
// <html>
// <head>
//     <meta charset="utf-8">
//     <base href="/">
//     <style>
// ${CSS_BASE}    

// {{STYLES}}
//     </style>
// </head>
// <body>
// {{innerHTML}}
// </body>
// </html>`;

// export const TS_ANGULAR_BLUEPRINT =
// `import { Component } from '@angular/core';

// @Component({
//   standalone: true,  
//   selector: '{{SELECTOR}}',
//   templateUrl: './{{FILE_NAME}}.html',
//   styleUrls: ['./{{FILE_NAME}}.css']
// })
// export class {{COMPONENT_NAME}} {}
// `

// export const HTML_FILE_NAME = 'index.html';
// export const CSS_FILE_NAME = 'styles.css';
// export const TS_FILE_NAME = 'component.ts';
// export const DUMB = 'dumb.txt';

// export type ExportMapKey = 'Separate' | 'Internal' | 'Image' | 'Angular';
// export type FileNameMapKey = 'styles' | 'markup' | 'code' | 'image';
// export interface ExportMapValue {
//     label: string
//     fileNames: [FileNameMapKey, {name: string, ext: string}][]
// }

// export const ExportConfig: Map<ExportMapKey, ExportMapValue> = new Map([
//     [
//         'Angular', 
//         {   
//             label: 'Angular component',
//             fileNames: [
//                 ['code', {name: 'angular-component', ext: ''}],
//             ]
//         }
//     ],
//     [
//         'Separate', 
//         {   
//             label: 'Separate HTML and CSS files',
//             fileNames: [
//                 ['markup', {name: 'index', ext: '.html'}],
//                 ['styles', {name: 'styles', ext: '.css'}],
//             ]
//         }
//     ],
//     [
//         'Internal', 
//         {   
//             label: 'HTML file with internal styling',
//             fileNames: [
//                 ['markup', {name: 'index', ext: '.html'}],
//             ]
//         }
//     ],
//     [
//         'Image', 
//         {   
//             label: 'PNG image',
//             fileNames: [
//                 ['image', {name: 'image', ext: '.png'}],
//             ]
//         }
//     ]
// ])