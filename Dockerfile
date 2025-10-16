FROM node:20-alpine

WORKDIR /app

# Traefik labels
LABEL traefik.enable="true"
LABEL traefik.http.routers.hodges.rule="Host(`hodges-demo.aicustomautomations.com`)"
LABEL traefik.http.routers.hodges.entrypoints="websecure"
LABEL traefik.http.routers.hodges.tls="true"
LABEL traefik.http.services.hodges.loadbalancer.server.port="3000"

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

EXPOSE 3000

# Start Next.js production server
CMD ["npm", "start"]
