#!/bin/bash

# Build and push script for Docker image
# Usage: ./docker-build.sh [tag]

set -e

REGISTRY="ghcr.io"
USERNAME="kzfamirhossein-beep"
IMAGE_NAME="utes-website"
TAG=${1:-latest}

FULL_IMAGE_NAME="${REGISTRY}/${USERNAME}/${IMAGE_NAME}:${TAG}"

echo "Building Docker image: ${FULL_IMAGE_NAME}"

# Build the image
docker build -t ${FULL_IMAGE_NAME} .

echo "Image built successfully!"

# Ask if user wants to push
read -p "Do you want to push the image to GitHub Container Registry? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "Pushing image to ${FULL_IMAGE_NAME}..."
    docker push ${FULL_IMAGE_NAME}
    echo "Image pushed successfully!"
else
    echo "Skipping push. Image is available locally as ${FULL_IMAGE_NAME}"
fi

