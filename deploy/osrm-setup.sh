#!/usr/bin/env bash
# ==============================================================================
# GNNcab - OSRM Setup Script
# ==============================================================================
# This script sets up a local OSRM instance using Docker for routing.
# It downloads the New York map data and starts the OSRM backend container.
#
# Usage: sudo ./osrm-setup.sh
# ==============================================================================

set -euo pipefail

log() {
  echo -e "\033[1;34m[OSRM-SETUP]\033[0m $1"
}

error() {
  echo -e "\033[1;31m[ERROR]\033[0m $1" >&2
  exit 1
}

if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root (use sudo)."
fi

OSRM_DATA_DIR="/opt/osrm-data"
REGION_URL="http://download.geofabrik.de/north-america/us/new-york-latest.osm.pbf"
REGION_FILE="new-york-latest.osm.pbf"

log "Ensuring Docker is installed..."
if ! command -v docker >/dev/null 2>&1; then
  log "Installing Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  rm get-docker.sh
else
  log "Docker is already installed."
fi

log "Creating OSRM data directory at $OSRM_DATA_DIR..."
mkdir -p "$OSRM_DATA_DIR"
cd "$OSRM_DATA_DIR"

if [ ! -f "$REGION_FILE" ]; then
  log "Downloading map data for New York..."
  wget "$REGION_URL" -O "$REGION_FILE"
else
  log "Map data already exists. Skipping download."
fi

log "Extracting map data..."
docker run -t -v "${PWD}:/data" osrm/osrm-backend osrm-extract -p /opt/car.lua /data/$REGION_FILE

log "Partitioning map data..."
docker run -t -v "${PWD}:/data" osrm/osrm-backend osrm-partition /data/new-york-latest.osrm

log "Customizing map data..."
docker run -t -v "${PWD}:/data" osrm/osrm-backend osrm-customize /data/new-york-latest.osrm

log "Starting OSRM server on port 5001..."
# Remove existing container if it exists
docker rm -f osrm-gnncab 2>/dev/null || true

docker run -d --name osrm-gnncab -t -i -p 127.0.0.1:5001:5000 -v "${PWD}:/data" --restart unless-stopped osrm/osrm-backend osrm-routed --algorithm mld /data/new-york-latest.osrm

log "OSRM setup complete. API is running on http://localhost:5001"
