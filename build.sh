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

echo "🚀 Building and starting containers..."
docker-compose up --build
