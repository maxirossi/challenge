#!/bin/bash

cd ./ms-taxi24 || exit 1

if [ ! -d "node_modules/.prisma/client" ]; then
  echo "⚠ Prisma client not found. Running prisma generate..."
  npx prisma generate
  if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client. Exiting..."
    exit 1
  fi
  echo "✅ Prisma client generated successfully."
else
  echo "✅ Prisma client already exists."
fi

cd ..

# (Optional) Comment if you don't want clear volumes
echo "🧹 Cleaning Docker environment..."
docker-compose down --volumes --remove-orphans
docker system prune -af
docker volume prune -f

echo "🚀 Building and starting containers..."
docker-compose up --build
