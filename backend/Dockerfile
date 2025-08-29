
FROM node:22-alpine
# This is the critical fix. Use apk to install curl so it's available for the health check.
# The --no-cache flag ensures a smaller final image size by not caching the package index.
RUN apk add --no-cache curl
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY .env .env
RUN npm run build
# Expose the port your app runs on
EXPOSE 8080
CMD ["node","dist/server.js"]


