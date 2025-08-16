#!/bin/bash

# =============================================================================
# CREDORA - ENVIRONMENT SETUP SCRIPT
# =============================================================================

echo "🚀 Setting up environment variables for Credora..."

# Check if .env file already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled. Your existing .env file was preserved."
        exit 1
    fi
fi

# Copy env.example to .env
if [ -f "env.example" ]; then
    cp env.example .env
    echo "✅ Created .env file from env.example"
    echo ""
    echo "📝 Next steps:"
    echo "1. Edit .env file with your actual values"
    echo "2. Update sensitive values like API keys and secrets"
    echo "3. Run 'docker-compose up -d' to start services"
    echo ""
    echo "🔐 Important: Never commit .env file to version control!"
    echo "   It contains sensitive information like API keys and passwords."
else
    echo "❌ Error: env.example file not found!"
    exit 1
fi

echo "🎉 Environment setup complete!" 