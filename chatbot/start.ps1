$ErrorActionPreference = "Stop"

Set-Location $PSScriptRoot

$activateScript = Join-Path $PSScriptRoot ".venv\Scripts\Activate.ps1"
if (-not (Test-Path $activateScript)) {
    throw "Python virtual environment activation script not found at '$activateScript'."
}

. $activateScript
Write-Host "Starting chatbot with Python environment: $env:VIRTUAL_ENV"
python app.py
