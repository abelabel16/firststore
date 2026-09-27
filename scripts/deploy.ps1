# Build the static site and publish it to GitHub Pages (gh-pages branch).
# Usage:  npm run deploy          (defaults to skdksdcw68-dev)
#         powershell scripts/deploy.ps1 -Owner abelabel16
param([string]$Owner = "skdksdcw68-dev")

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$env:NEXT_PUBLIC_BASE_PATH = "/firststore"
$env:NEXT_PUBLIC_SITE_URL = "https://$Owner.github.io/firststore"
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build failed" }

New-Item -ItemType File -Force "$root\out\.nojekyll" | Out-Null
if (Test-Path "$root\out\.git") { Remove-Item -Recurse -Force "$root\out\.git" }

Set-Location "$root\out"
git init -b gh-pages -q
git add -A
git commit -m "Deploy built site" -q
git push --force "https://github.com/$Owner/firststore.git" gh-pages

Set-Location $root
Write-Host ""
Write-Host "Deployed: https://$Owner.github.io/firststore/" -ForegroundColor Green
