.PHONY: help build up down restart logs clean rebuild

# Variables
COMPOSE=docker-compose
SERVICE=nextjs

help: ## Mostrar ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Construir las imágenes Docker
	$(COMPOSE) build --no-cache

up: ## Levantar los servicios
	$(COMPOSE) up -d

down: ## Detener los servicios
	$(COMPOSE) down

restart: ## Reiniciar los servicios
	$(COMPOSE) restart

logs: ## Ver logs en tiempo real
	$(COMPOSE) logs -f $(SERVICE)

logs-all: ## Ver logs de todos los servicios
	$(COMPOSE) logs -f

ps: ## Ver estado de los contenedores
	$(COMPOSE) ps

exec: ## Ejecutar bash en el contenedor Next.js
	$(COMPOSE) exec $(SERVICE) sh

clean: ## Limpiar contenedores, imágenes y volúmenes
	$(COMPOSE) down -v
	docker system prune -f

rebuild: down build up ## Rebuild completo

deploy: ## Deploy completo (build + up)
	@echo "🚀 Iniciando deploy..."
	$(COMPOSE) build
	$(COMPOSE) up -d
	@echo "✅ Deploy completado"
	@echo "📊 Verificando estado..."
	$(COMPOSE) ps

update: ## Actualizar desde git y redeploy
	@echo "📥 Pulling changes..."
	git pull
	@echo "🔨 Rebuilding..."
	$(COMPOSE) up -d --build
	@echo "🧹 Limpiando imágenes antiguas..."
	docker image prune -f
	@echo "✅ Update completado"

health: ## Verificar health de los servicios
	@echo "Checking Next.js health..."
	@curl -f http://localhost:3000/api/health || echo "❌ Next.js unhealthy"
	@echo "\nChecking Redis health..."
	@docker exec real-estate-redis redis-cli ping || echo "❌ Redis unhealthy"

backup-redis: ## Backup de Redis
	@echo "📦 Creando backup de Redis..."
	@mkdir -p ./backups
	@docker exec real-estate-redis redis-cli SAVE
	@docker cp real-estate-redis:/data/dump.rdb ./backups/redis-backup-$$(date +%Y%m%d-%H%M%S).rdb
	@echo "✅ Backup completado"

stats: ## Ver estadísticas de recursos
	docker stats --no-stream

test: ## Test de la configuración
	$(COMPOSE) config

prod: ## Deploy en producción
	@echo "🚀 Deploy en producción..."
	@if [ ! -f .env ]; then echo "❌ .env file no encontrado"; exit 1; fi
	$(COMPOSE) -f docker-compose.yml build
	$(COMPOSE) -f docker-compose.yml up -d
	@echo "✅ Producción desplegada"
