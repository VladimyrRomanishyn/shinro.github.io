export const HTML_BLUEPRINT = 
`<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8">
    <base href="/">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
{{innerHTML}}
</body>
</html>`;

export const CSS_BASE = 
`* {
    margin: 0;
    padding:0
}

body {
    width: 100vw;
    height: 100vh;
}\n`;

export const HTML_FILE_NAME = 'index.html';
export const CSS_FILE_NAME = 'styles.css';