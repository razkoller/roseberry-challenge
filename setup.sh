#!/bin/bash

echo "🚀 TaskApp Setup Script"
echo "======================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🐳 Starting Docker containers..."
docker compose up -d --build

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "🌱 Seeding database with demo data..."
docker compose exec -T backend npm run seed

echo ""
echo "📱 Setting up mobile app..."
cd mobile
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎉 Next steps:"
echo "  1. Backend API is running at http://localhost:3000"
echo "  2. API docs available at http://localhost:3000/api-docs"
echo "  3. Start mobile app with: cd mobile && npm start"
echo ""
echo "📧 Demo credentials:"
echo "   Email: demo@example.com"
echo "   Password: demo123"
echo ""