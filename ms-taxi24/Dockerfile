FROM node:18-slim

WORKDIR /src

RUN apt-get update && apt-get install -y \
  openssl \
  && rm -rf /var/lib/apt/lists/*
  COPY package*.json ./
  RUN npm install
  
COPY package*.json ./
RUN npm install

COPY . .

RUN [ -f ./prisma/schema.prisma ] && npx prisma generate || echo "⚠️ No se encontró schema.prisma, se omite generación"

RUN chmod +x ./entrypoint.sh

CMD ["./entrypoint.sh"]