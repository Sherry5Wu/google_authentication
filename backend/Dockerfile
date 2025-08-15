FROM node:20-alpine

WORKDIR /app

COPY package.json* ./
RUN npm install --omit=dev

# for checking the data from the Database inside the container
RUN apk add --no-cache sqlite

COPY . .

ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "src/app.js"]
