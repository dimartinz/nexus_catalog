
# Etapa 1: Construcción (Builder)
# Esta etapa instala todas las dependencias (incluyendo devDependencies)
# y compila el código TypeScript a JavaScript.
FROM node:22-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Producción (Production)
# Esta etapa es más ligera y segura. Solo contiene lo estrictamente necesario
# para ejecutar la aplicación.
FROM node:22-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package*.json ./
RUN npm install --only=production
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 3000
CMD [ "node", "dist/main" ]