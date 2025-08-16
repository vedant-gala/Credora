# =============================================================================
# CREDORA - ENVIRONMENT SETUP SCRIPT (PowerShell)
# =============================================================================

Write-Host "🚀 Setting up environment variables for Credora..." -ForegroundColor Green

# Check if .env file already exists
if (Test-Path ".env") {
    Write-Host "⚠️  .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "❌ Setup cancelled. Your existing .env file was preserved." -ForegroundColor Red
        exit 1
    }
}

# Copy env.example to .env
if (Test-Path "env.example") {
    Copy-Item "env.example" ".env"
    Write-Host "✅ Created .env file from env.example" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Edit .env file with your actual values" -ForegroundColor White
    Write-Host "2. Update sensitive values like API keys and secrets" -ForegroundColor White
    Write-Host "3. Run 'docker-compose up -d' to start services" -ForegroundColor White
    Write-Host ""
    Write-Host "🔐 Important: Never commit .env file to version control!" -ForegroundColor Yellow
    Write-Host "   It contains sensitive information like API keys and passwords." -ForegroundColor Yellow
} else {
    Write-Host "❌ Error: env.example file not found!" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Environment setup complete!" -ForegroundColor Green 