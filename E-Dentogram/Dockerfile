# Etapa 1: build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar dependencias e instalar
COPY package*.json ./
RUN npm install

# Copiar el resto del código y construir la app
COPY . .
RUN npm run build

# Etapa 2: servidor web
FROM nginx:alpine

# Copiar el build al servidor nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar config opcional de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
