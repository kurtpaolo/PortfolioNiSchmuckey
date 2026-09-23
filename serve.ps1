param (
    [int]$Port = 8000
)

$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Prefixes.Add("http://127.0.0.1:$Port/")

try {
    $listener.Start()
    Write-Host "Server started successfully at http://localhost:$Port/ (or http://127.0.0.1:$Port/)"
    Write-Host "Press Ctrl+C to stop the server."
} catch {
    Write-Error "Failed to start server: $_"
    exit 1
}

$mimeTypes = @{
    ".php"  = "text/html; charset=utf-8"
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".webp" = "image/webp"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        try {
            $reqPath = [System.Uri]::UnescapeDataString($request.Url.AbsolutePath)
            if ($reqPath -eq "" -or $reqPath -eq "/" -or $reqPath -eq "/home" -or $reqPath -eq "/home.php") {
                if (Test-Path (Join-Path $root "index.php") -PathType Leaf) {
                    $reqPath = "/index.php"
                } else {
                    $reqPath = "/index.html"
                }
            }

            $relPath = $reqPath.TrimStart("/\").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
            $fullPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($root, $relPath))

            # Make sure the requested path stays inside the project folder
            if (-not $fullPath.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
                $response.StatusCode = 403
                $msg = [System.Text.Encoding]::UTF8.GetBytes("403 Forbidden")
                $response.ContentLength64 = $msg.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($msg, 0, $msg.Length)
                }
            } elseif (Test-Path $fullPath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
                $response.ContentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                $content = [System.IO.File]::ReadAllBytes($fullPath)
                $response.ContentLength64 = $content.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($content, 0, $content.Length)
                }
            } else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $reqPath")
                $response.ContentLength64 = $msg.Length
                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($msg, 0, $msg.Length)
                }
            }
        } catch {
            Write-Host "Request error: $_"
        } finally {
            try { $response.Close() } catch {}
        }
    }
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
