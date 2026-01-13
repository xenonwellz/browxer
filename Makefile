.PHONY: release

# Default version bump type (patch, minor, major)
TYPE ?= patch

release:
	@echo "Bumping version..."
	npm version $(TYPE) --no-git-tag-version
	$(eval NEW_VERSION := $(shell node -p "require('./package.json').version"))
	@echo "New version: $(NEW_VERSION)"
	
	@echo "Committing and tagging..."
	git add package.json
	git commit -m "chore: bump version to $(NEW_VERSION)"
	git tag -a v$(NEW_VERSION) -m "Release v$(NEW_VERSION)"
	
	@echo "Pushing to origin..."
	git push origin main
	git push origin v$(NEW_VERSION)
	@echo "Done! GitHub Actions will handle the release and Docker build."
