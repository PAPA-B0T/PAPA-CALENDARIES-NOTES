param(
  [string]$EnvFile = ".\setup.env"
)

$ErrorActionPreference = "Stop"

function Read-SetupEnv {
  param([string]$Path)

  if (-not (Test-Path -LiteralPath $Path)) {
    throw "File not found: $Path. Copy setup.env.example to setup.env and fill in the values."
  }

  $values = @{}
  Get-Content -LiteralPath $Path | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith("#")) { return }
    $parts = $line.Split("=", 2)
    if ($parts.Count -eq 2) {
      $values[$parts[0].Trim()] = $parts[1].Trim()
    }
  }

  return $values
}

function Require-Value {
  param(
    [hashtable]$Values,
    [string]$Name
  )

  if (-not $Values.ContainsKey($Name) -or [string]::IsNullOrWhiteSpace($Values[$Name])) {
    throw "Missing required value in setup.env: $Name"
  }

  return $Values[$Name]
}

function Run-Wrangler {
  param(
    [string[]]$Arguments,
    [string]$WorkingDirectory,
    [int]$Attempts = 3
  )

  $command = "npx wrangler " + ($Arguments -join " ")
  for ($attempt = 1; $attempt -le $Attempts; $attempt++) {
    Write-Host "> $command"
    Write-Host "Attempt $attempt of $Attempts"
    Push-Location $WorkingDirectory
    try {
      $capturedOutput = @()
      & cmd /c $command 2>&1 | ForEach-Object {
        $line = $_.ToString()
        $capturedOutput += $line
        Write-Host $line
      }
      if ($LASTEXITCODE -eq 0) {
        return $capturedOutput
      }
    } finally {
      Pop-Location
    }

    if ($attempt -lt $Attempts) {
      Write-Host "Wrangler command failed. Waiting 5 seconds and retrying..."
      Start-Sleep -Seconds 5
    }
  }

  Write-Host ""
  Write-Host "Wrangler could not connect to Cloudflare or npm registry."
  Write-Host "Check internet connection, VPN, firewall, antivirus, and proxy settings."
  Write-Host "Then run the same command again:"
  Write-Host "powershell -ExecutionPolicy Bypass -File .\setup-reminders.ps1"
  throw "Wrangler command failed after $Attempts attempts: $command"
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDir "..")
$workerDir = Join-Path $repoRoot "workers"
$workerFile = Join-Path $workerDir "reminder-worker.js"
$wranglerFile = Join-Path $workerDir "wrangler.toml"

$envPath = Resolve-Path $EnvFile
$config = Read-SetupEnv $envPath

$cloudflareToken = Require-Value $config "CLOUDFLARE_API_TOKEN"
$accountId = Require-Value $config "CLOUDFLARE_ACCOUNT_ID"
$telegramBotToken = Require-Value $config "TELEGRAM_BOT_TOKEN"
$workerName = if ($config.ContainsKey("WORKER_NAME") -and $config["WORKER_NAME"]) { $config["WORKER_NAME"] } else { "papa-calendaries-reminder" }

if ($accountId -notmatch '^[a-fA-F0-9]{32}$') {
  throw "CLOUDFLARE_ACCOUNT_ID looks wrong. It must be a 32-character hex ID from Cloudflare, not an email and not Telegram Chat ID. Example: 0123456789abcdef0123456789abcdef"
}

if ($workerName -notmatch '^[a-z0-9][a-z0-9-]{0,62}$') {
  throw "WORKER_NAME looks wrong. Use lowercase letters, numbers, and hyphens only. Example: papa-calendaries-reminder"
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js is not installed. Install it from https://nodejs.org/ and run this script again."
}

if (-not (Test-Path -LiteralPath $workerFile)) {
  throw "Worker file not found: $workerFile"
}

$env:CLOUDFLARE_API_TOKEN = $cloudflareToken

Write-Host ""
Write-Host "Checking Cloudflare access..."
Run-Wrangler -Arguments @("whoami") -WorkingDirectory $workerDir -Attempts 3

Write-Host ""
Write-Host "Writing workers/wrangler.toml..."
@"
name = "$workerName"
main = "reminder-worker.js"
compatibility_date = "2024-01-01"
account_id = "$accountId"

[[kv_namespaces]]
binding = "REMINDERS"

[triggers]
crons = [ "* * * * *" ]
"@ | Set-Content -LiteralPath $wranglerFile -Encoding UTF8

Write-Host ""
Write-Host "Deploying Worker and provisioning KV..."
$deployOutput = Run-Wrangler -Arguments @("deploy", "--name", $workerName) -WorkingDirectory $workerDir
$workerUrl = ($deployOutput | Select-String -Pattern "https://[a-zA-Z0-9.-]+\.workers\.dev" | Select-Object -First 1).Matches.Value
if (-not $workerUrl) {
  $workerUrl = "https://$workerName.YOUR-WORKERS-SUBDOMAIN.workers.dev"
}

Write-Host ""
Write-Host "Uploading Telegram bot token as BOT_TOKEN secret..."
Push-Location $workerDir
try {
  $telegramBotToken | cmd /c "npx wrangler secret put BOT_TOKEN --name $workerName"
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to upload BOT_TOKEN secret."
  }
} finally {
  Pop-Location
}

Write-Host ""
Write-Host "Setup completed."
Write-Host ""
Write-Host "Copy the Worker URL:"
Write-Host ""
Write-Host $workerUrl
Write-Host ""
Write-Host "Open the extension settings and paste:"
Write-Host ""
Write-Host "Worker URL: $workerUrl"
Write-Host "Chat ID: your Telegram Chat ID"
Write-Host "Then click Test notification."
