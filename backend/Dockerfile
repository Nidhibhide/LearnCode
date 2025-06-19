
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY .env .env
RUN npm run build
CMD ["node","dist/server.js"]


