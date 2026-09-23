<?php
/**
 * Built-in Server Router
 * Blocks direct public HTTP downloads of sensitive files (.sql, .bat, .ps1, etc.)
 * Routes root, home, and extension-less URLs to their respective HTML files.
 */

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
$ext = strtolower(pathinfo($uri, PATHINFO_EXTENSION));

// Disallow downloading server scripts and database files
$blockedExtensions = ['sql', 'bat', 'ps1', 'ini', 'log'];
if (in_array($ext, $blockedExtensions)) {
    http_response_code(403);
    header('Content-Type: text/plain; charset=utf-8');
    exit('403 Forbidden: Access to this file is restricted.');
}

// Route root and /home to index.html
if ($uri === '/' || $uri === '' || $uri === '/home' || $uri === '/home.html') {
    if (file_exists(__DIR__ . '/index.html')) {
        readfile(__DIR__ . '/index.html');
        exit;
    }
}

// Clean URL support: if /about, /services, /contact is requested without extension, serve .html
if (empty($ext)) {
    $htmlFile = __DIR__ . $uri . '.html';
    if (file_exists($htmlFile)) {
        header('Content-Type: text/html; charset=utf-8');
        readfile($htmlFile);
        exit;
    }
}

// Let the built-in server handle the file
return false;
