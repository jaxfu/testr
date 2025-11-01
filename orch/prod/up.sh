#!/usr/bin/env bash

set -e

docker compose --env-file orch/prod/prod.env \
	-f orch/prod/docker-compose.prod.yml \
	up -d
