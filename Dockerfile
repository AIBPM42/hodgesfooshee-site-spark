FROM node:20-alpine

WORKDIR /app

# Traefik labels
LABEL traefik.enable="true"
LABEL traefik.http.routers.hodges.rule="Host(`hodges-demo.aicustomautomations.com`)"
LABEL traefik.http.routers.hodges.entrypoints="websecure"
LABEL traefik.http.routers.hodges.tls="true"
LABEL traefik.http.services.hodges.loadbalancer.server.port="8080"

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 8080

CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "8080"]
