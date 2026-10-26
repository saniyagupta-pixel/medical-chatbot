$ErrorActionPreference = "Stop"

Set-Location $PSScriptRoot
$env:VITE_API_BASE_URL = "http://localhost:3002"

npm run dev
