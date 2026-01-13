# Configuration
DOCKER_IMAGE = xenonwellz/brows3r
TYPE ?= patch
BUILD ?= 0

.PHONY: release

release:
	@echo "Bumping version..."
	npm version $(TYPE) --no-git-tag-version
	$(eval NEW_VERSION := $(shell node -p "require('./package.json').version"))
	@echo "New version: $(NEW_VERSION)"
	
	@echo "Committing and tagging..."
	git add package.json
	git commit -m "chore: bump version to $(NEW_VERSION)"
	git tag -a v$(NEW_VERSION) -m "Release v$(NEW_VERSION)"
	
	@if [ "$(BUILD)" = "1" ]; then \
		echo "Building Docker image..."; \
		docker build -t $(DOCKER_IMAGE):$(NEW_VERSION) -t $(DOCKER_IMAGE):latest .; \
		echo "Pushing Docker image..."; \
		docker push $(DOCKER_IMAGE):$(NEW_VERSION); \
		docker push $(DOCKER_IMAGE):latest; \
	fi
	
	@echo "Pushing to origin..."
	git push origin main
	git push origin v$(NEW_VERSION)
	@echo "Done! Version $(NEW_VERSION) released."
