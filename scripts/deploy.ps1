# Build the static site and publish it to GitHub Pages (gh-pages branch).
# Usage:  npm run deploy
param(
  [string]$Owner = "skdksdcw68-dev",
  [string]$Domain = "vibrantflacon.com"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

# Custom domain serves from the root, so no base path.
$env:NEXT_PUBLIC_BASE_PATH = ""
$env:NEXT_PUBLIC_SITE_URL = "https://$Domain"
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build failed" }

New-Item -ItemType File -Force "$root\out\.nojekyll" | Out-Null
# GitHub Pages reads the custom domain from a CNAME file on the branch;
# without this, every force-push would disconnect the domain.
[System.IO.File]::WriteAllText("$root\out\CNAME", $Domain)
if (Test-Path "$root\out\.git") { Remove-Item -Recurse -Force "$root\out\.git" }

Set-Location "$root\out"
git init -b gh-pages -q
git add -A
git commit -m "Deploy built site" -q
# Push as the repo owner even when another GitHub account is active.
$token = gh auth token --user $Owner
if ($LASTEXITCODE -ne 0) { throw "Not logged in to GitHub as $Owner (run: gh auth login)" }
git -c credential.helper= push --force "https://x-access-token:$token@github.com/$Owner/firststore.git" gh-pages
if ($LASTEXITCODE -ne 0) { throw "Push to gh-pages failed" }

Set-Location $root
Write-Host ""
Write-Host "Deployed: https://$Domain/" -ForegroundColor Green
