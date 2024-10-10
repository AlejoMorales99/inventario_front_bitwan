#!/bin/bash

# Variables
IMAGE_NAME="img_front_inventario_28092024"
CONTAINER_NAME="front_inventario"
REPO_PATH="/root/proyectos/inventario/inventario_front_bitwan/"  #  ruta de tu repositorio local
PORT1=5022
PORT2=80

# Cambiar al directorio del repositorio
cd $REPO_PATH || { echo "No se pudo acceder al repositorio. Verifica la ruta."; exit 1; }

# Verificar si el repositorio local está actualizado
echo "Verificando si el repositorio está actualizado con la rama 'main'..."
git fetch origin main
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "El repositorio ya está actualizado."
else
    echo "El repositorio no está actualizado. Actualizando..."
    git pull origin main || { echo "Error al hacer git pull. Revisa tu conexión y permisos."; exit 1; }
fi

# Detener y eliminar el contenedor si está corriendo
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "Deteniendo y eliminando el contenedor existente..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
else
    echo "No hay ningún contenedor corriendo con el nombre $CONTAINER_NAME."
fi

# Construir una nueva imagen Docker
echo "Construyendo la imagen Docker..."
docker build -t $IMAGE_NAME . || { echo "Error al construir la imagen Docker."; exit 1; }

# Ejecutar el nuevo contenedor
echo "Creando y ejecutando un nuevo contenedor..."
docker run -dt --name $CONTAINER_NAME --restart unless-stopped -p $PORT:$PORT2 -e TZ=America/Bogota $IMAGE_NAME || { echo "Error al ejecutar el nuevo contenedor."; exit 1; }

echo "¡Despliegue completado con éxito!"