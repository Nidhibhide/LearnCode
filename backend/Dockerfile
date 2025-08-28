
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY .env .env
RUN npm run build
# Expose the port your app runs on
EXPOSE 8080
CMD ["node","dist/server.js"]


