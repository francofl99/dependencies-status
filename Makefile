DOCKER_COMPOSE = docker compose
SERVICE = app

init:
	@$(DOCKER_COMPOSE) up --build $(SERVICE) -d && cp .env.example .env

up:
	@$(DOCKER_COMPOSE) up --build $(SERVICE) -d

run:
	@$(DOCKER_COMPOSE) exec $(SERVICE) node index.js

down:
	@$(DOCKER_COMPOSE) down

clean:
	@$(DOCKER_COMPOSE) down -v

rebuild:
	@$(DOCKER_COMPOSE) up --build $(SERVICE)