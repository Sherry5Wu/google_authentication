FROM node:20-blueseye-slim

WORKDIR /app

# RUN apt-get update && apt-get install -y --no-install-recommends \
#   ca-certificates \
#   && rm -rf /var/lib/apt/lists/*

COPY package.json* ./
RUN npm ci --only=production

COPY . .

ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "src/app.js"]
