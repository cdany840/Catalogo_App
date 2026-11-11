param(
  [int]$Port = 4321
)

$Root = $PSScriptRoot
$Listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $Port)
$Listener.Start()
Write-Output "URBAN_DROP Server running at http://localhost:$Port"

$MimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".ico"  = "image/x-icon"
}

try {
  while ($true) {
    $Client = $Listener.AcceptTcpClient()
    $Stream = $Client.GetStream()
    $Reader = [System.IO.StreamReader]::new($Stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
    $RequestLine = $Reader.ReadLine()
    while ($null -ne ($HeaderLine = $Reader.ReadLine()) -and $HeaderLine -ne "") {}

    if ($RequestLine -match "^GET\s+([^\s]+)\s+HTTP") {
      $UrlPath = $Matches[1].Split('?')[0].TrimEnd('/')
      if ($UrlPath -eq "" -or $UrlPath -eq "/index.html") {
        $FilePath = Join-Path $Root "index.html"
      } elseif ($UrlPath -eq "/login" -or $UrlPath -eq "/login.html") {
        $FilePath = Join-Path $Root "login.html"
      } elseif ($UrlPath -eq "/favicon.svg") {
        $FilePath = Join-Path $Root "public\favicon.svg"
      } else {
        $RelPath = $UrlPath.TrimStart('/').Replace('/', '\')
        $FilePath = Join-Path $Root $RelPath
        if (-not (Test-Path $FilePath -PathType Leaf) -and (Test-Path "$FilePath.html" -PathType Leaf)) {
          $FilePath = "$FilePath.html"
        }
      }

      if (Test-Path $FilePath -PathType Leaf) {
        $Ext = [System.IO.Path]::GetExtension($FilePath).ToLower()
        $ContentType = if ($MimeTypes.ContainsKey($Ext)) { $MimeTypes[$Ext] } else { "application/octet-stream" }
        $Bytes = [System.IO.File]::ReadAllBytes($FilePath)
        $SecurityHeaders = "X-Content-Type-Options: nosniff`r`nX-Frame-Options: DENY`r`nReferrer-Policy: strict-origin-when-cross-origin`r`nPermissions-Policy: camera=(), microphone=(), geolocation=()`r`n"
        $Header = "HTTP/1.1 200 OK`r`nContent-Type: $ContentType`r`nContent-Length: $($Bytes.Length)`r`n$SecurityHeaders`Cache-Control: no-store, no-cache, must-revalidate`r`nConnection: close`r`n`r`n"
        $HeaderBytes = [System.Text.Encoding]::ASCII.GetBytes($Header)
        $Stream.Write($HeaderBytes, 0, $HeaderBytes.Length)
        $Stream.Write($Bytes, 0, $Bytes.Length)
      } else {
        $NotFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $Header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($NotFound.Length)`r`nConnection: close`r`n`r`n"
        $HeaderBytes = [System.Text.Encoding]::ASCII.GetBytes($Header)
        $Stream.Write($HeaderBytes, 0, $HeaderBytes.Length)
        $Stream.Write($NotFound, 0, $NotFound.Length)
      }
    }
    $Stream.Close()
    $Client.Close()
  }
} finally {
  $Listener.Stop()
}
