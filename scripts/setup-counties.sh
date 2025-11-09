#!/bin/bash

# Load environment variables
set -a
source .env.local
set +a

echo "🚀 County Pages Setup"
echo "===================="
echo ""
echo "Step 1: Running database migration..."
echo "--------------------------------------"
npx tsx scripts/run-migration.ts

echo ""
echo "Step 2: Populating counties with Perplexity AI..."
echo "--------------------------------------------------"
npx tsx scripts/populate-counties-ultimate.ts

echo ""
echo "✅ Setup complete!"
echo ""
echo "View your county pages:"
echo "  http://localhost:3000/counties/davidson-county"
echo "  http://localhost:3000/counties/williamson-county"
echo "  http://localhost:3000/counties/rutherford-county"
echo ""
