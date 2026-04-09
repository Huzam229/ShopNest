# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Install dependencies inside Docker
RUN npm install

# Copy the rest of the project (excluding node_modules via .dockerignore)
COPY . .

# Build Next.js
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]