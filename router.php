<?php
/**
 * Built-in PHP Server Router
 * Blocks direct public HTTP downloads of sensitive files (.sql, .bat, .ps1, etc.)
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

// Let the built-in server handle the file
return false;
