param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("chromium", "firefox")]
  [string]$Target
)

$root = Split-Path -Parent $PSScriptRoot
$source = Join-Path $root ("manifest.{0}.json" -f $Target)
$dest = Join-Path $root "manifest.json"

if (-not (Test-Path $source)) {
  Write-Error "Source manifest not found: $source"
  exit 1
}

Copy-Item -Path $source -Destination $dest -Force
Write-Host "manifest.json updated for $Target"
