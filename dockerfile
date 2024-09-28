# Etapa de construcción
FROM node:18.20.3-alpine3.18 as node
#WORKDIR /app
#COPY ./ /app/
#RUN npm run build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install @ngx-progressbar/core --legacy-peer-deps
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Etapa de producción
FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/dist/inventario-bit-wan /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]