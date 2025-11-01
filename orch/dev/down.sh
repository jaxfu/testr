#!/usr/bin/env bash

set -e

docker compose --env-file orch/dev/dev.env \
	-f orch/dev/docker-compose.dev.yml \
	down -v
