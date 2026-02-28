FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
EXPOSE 8181

COPY . .
CMD ["node", "app.js"]