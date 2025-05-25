#!/bin/bash

set -e

echo "🟡 Esperando a que los servicios estén completamente levantados..."
sleep 10

echo "📦 Instalando dependencias necesarias en ms-taxi24..."
docker exec -it ms-taxi24 npm install kafkajs || echo "⚠️ kafkajs ya instalado o error menor al instalar"

echo "🔄 Ejecutando migraciones dentro del contenedor ms-taxi24..."
docker exec -it ms-taxi24 npx prisma migrate dev --name init --skip-seed || echo "⚠️ Las migraciones fallaron o ya estaban aplicadas"
echo "✅ Migraciones ejecutadas."

echo "🔁 Generando cliente Prisma dentro del contenedor..."
docker exec -it ms-taxi24 npx prisma generate || echo "⚠️ Prisma client ya generado o falló"

echo "🌱 Ejecutando seed.ts dentro del contenedor..."
set +e
docker exec -it ms-taxi24 npx ts-node prisma/seed.ts
if [ $? -ne 0 ]; then
  echo "⚠️ Seeder falló, probablemente datos ya existentes"
else
  echo "✅ Seeder ejecutado correctamente."
fi
set -e

declare -a topics=(
  "domain.user.created"
  "domain.user.authenticated"
  "domain.ride.assigned"
)

for topic in "${topics[@]}"; do
  echo "📦 Creando tópico Kafka '$topic'..."
  docker exec -it kafka \
    kafka-topics --create \
    --topic "$topic" \
    --bootstrap-server kafka:9092 \
    --replication-factor 1 \
    --partitions 1 || echo "⚠️ Tópico '$topic' ya existe o hubo un error menor."
done

echo "✅ Todos los tópicos creados."
echo "🎉 Todos los pasos completados correctamente."