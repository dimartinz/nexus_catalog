# frontend/Dockerfile

# --- Etapa 1: Build de la aplicación Vue.js ---
# Actualizado a Node 22
FROM node:22-alpine AS build-stage

WORKDIR /app

# Declara los argumentos que se recibirán desde docker-compose
ARG VUE_APP_AUTH0_DOMAIN
ARG VUE_APP_AUTH0_CLIENT_ID
ARG VUE_APP_AUTH0_AUDIENCE

# Asigna los argumentos a variables de entorno para que `npm run build` los use
ENV VUE_APP_AUTH0_DOMAIN=$VUE_APP_AUTH0_DOMAIN
ENV VUE_APP_AUTH0_CLIENT_ID=$VUE_APP_AUTH0_CLIENT_ID
ENV VUE_APP_AUTH0_AUDIENCE=$VUE_APP_AUTH0_AUDIENCE

COPY package*.json ./
RUN npm install

COPY . .
# El proceso de build de Vue reemplazará process.env.VUE_APP_* con los valores
RUN npm run build

# --- Etapa 2: Servir con Nginx ---
FROM nginx:stable-alpine

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]