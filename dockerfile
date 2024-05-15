# Etapa de construcción
FROM node:latest as node
WORKDIR /app
COPY ./ /app/
RUN npm install
RUN npm run build --prod

# Etapa de producción
FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/dist/inventario-bit-wan /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]