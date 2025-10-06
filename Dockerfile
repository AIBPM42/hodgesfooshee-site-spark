FROM node:20-alpine

WORKDIR /app

LABEL traefik.enable="true"
LABEL traefik.http.routers.spark.rule="Host(`hodges-demo.aicustomautomations.com`)"
LABEL traefik.http.routers.spark.entrypoints="websecure"
LABEL traefik.http.routers.spark.tls="true"
LABEL traefik.http.services.spark.loadbalancer.server.port="8080"

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]
